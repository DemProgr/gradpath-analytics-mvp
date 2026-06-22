import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { profiles } from '../db/schema/profiles';
import { verificationDocuments } from '../db/schema/verification-documents';
import { universities } from '../db/schema/universities';
import { faculties } from '../db/schema/faculties';
import { specialties } from '../db/schema/specialties';
import { eq, and, desc } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = new Hono();

const updateUniversitySchema = z.object({
  universityId: z.string().min(1, 'Университет обязателен'),
  facultyId: z.string().nullable().optional(),
  specialtyId: z.string().nullable().optional(),
  course: z.number().int().min(1, 'Курс от 1 до 6').max(6, 'Курс от 1 до 6'),
  enrollmentYear: z.number().int().min(2015, 'Год поступления от 2015').max(new Date().getFullYear(), 'Некорректный год поступления'),
  expectedGraduationYear: z.number().int().min(2019, 'Некорректный год выпуска').max(2035, 'Некорректный год выпуска'),
});

const verifyEmailSchema = z.object({
  email: z.string().email('Некорректный email'),
});

// University email domain mapping for verification
const UNIVERSITY_DOMAINS: Record<string, string> = {
  'bsuir.by': 'bsuir',
  'bsu.by': 'bsu',
  'bntu.by': 'bntu',
  'belstu.by': 'belstu',
  'grodno.net': 'grsu',
  'gstu.by': 'gstu',
  'mogilev.by': 'mogilev',
  'polatk.by': 'polatk',
  'vgpu.by': 'vgpu',
  'academy.gov.by': 'academy',
  'bce.by': 'bce',
};

// GET /api/profile - get current user's profile
router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    let [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    // Auto-create empty profile if none exists
    if (!profile) {
      [profile] = await db.insert(profiles).values({
        userId: authUser.id,
        email: authUser.email,
      }).returning();
    }

    // Fetch related data
    let university = null;
    let faculty = null;
    let specialty = null;

    if (profile.universityId) {
      const [uni] = await db.select().from(universities).where(eq(universities.id, profile.universityId));
      university = uni || null;
    }

    if (profile.facultyId) {
      const [fac] = await db.select().from(faculties).where(eq(faculties.id, profile.facultyId));
      faculty = fac || null;
    }

    if (profile.specialtyId) {
      const [spec] = await db.select().from(specialties).where(eq(specialties.id, profile.specialtyId));
      specialty = spec || null;
    }

    // Calculate completeness
    const completeness = calculateCompleteness(profile);

    return c.json({
      ...profile,
      university,
      faculty,
      specialty,
      completeness,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PUT /api/profile/university - update university data
router.put('/university', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = updateUniversitySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
    }

    const { universityId, facultyId, specialtyId, course, enrollmentYear, expectedGraduationYear } = parsed.data;

    // Verify university exists
    const [uni] = await db.select().from(universities).where(eq(universities.id, universityId));
    if (!uni) {
      return c.json({ error: 'Университет не найден' }, 404);
    }

    // Verify faculty belongs to university (if provided)
    if (facultyId) {
      const [fac] = await db.select().from(faculties).where(
        and(eq(faculties.id, facultyId), eq(faculties.universityId, universityId))
      );
      if (!fac) {
        return c.json({ error: 'Факультет не принадлежит этому университету' }, 400);
      }
    }

    // Verify specialty belongs to university (if provided)
    if (specialtyId) {
      const [spec] = await db.select().from(specialties).where(
        and(eq(specialties.id, specialtyId), eq(specialties.universityId, universityId))
      );
      if (!spec) {
        return c.json({ error: 'Специальность не принадлежит этому университету' }, 400);
      }
    }

    // Check if profile exists
    let [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    const updateData = {
      universityId,
      facultyId: facultyId || null,
      specialtyId: specialtyId || null,
      course,
      enrollmentYear,
      expectedGraduationYear,
      updatedAt: new Date(),
    };

    if (existingProfile) {
      // Update existing profile
      const [updated] = await db.update(profiles)
        .set(updateData)
        .where(eq(profiles.id, existingProfile.id))
        .returning();
      existingProfile = updated;
    } else {
      // Create new profile
      [existingProfile] = await db.insert(profiles).values({
        userId: authUser.id,
        email: authUser.email,
        ...updateData,
      }).returning();
    }

    // Fetch related data
    const [fac] = facultyId
      ? await db.select().from(faculties).where(eq(faculties.id, facultyId))
      : [null];
    const [spec] = specialtyId
      ? await db.select().from(specialties).where(eq(specialties.id, specialtyId))
      : [null];

    return c.json({
      ...existingProfile,
      university: uni,
      faculty: fac || null,
      specialty: spec || null,
      completeness: calculateCompleteness(existingProfile),
    });
  } catch (err) {
    console.error('Update university profile error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/profile/verify/send-code - auto-verify (testing mode, no DB checks)
router.post('/verify/send-code', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const { email } = body;

    // Get or create profile
    let [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    const updateData = {
      verificationEmail: email || null,
      verificationStatus: 'verified',
      isUniversityVerified: true,
      verificationMethod: 'auto',
      updatedAt: new Date(),
    };

    if (existingProfile) {
      [existingProfile] = await db.update(profiles)
        .set(updateData)
        .where(eq(profiles.id, existingProfile.id))
        .returning();
    } else {
      [existingProfile] = await db.insert(profiles).values({
        userId: authUser.id,
        email: authUser.email,
        ...updateData,
      }).returning();
    }

    return c.json({
      message: 'Верификация пройдена (тестовый режим)',
      verificationStatus: 'verified',
      isUniversityVerified: true,
    });
  } catch (err) {
    console.error('Verify error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/profile/verify/confirm-code - confirm verification code
router.post('/verify/confirm-code', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return c.json({ error: 'Введите код подтверждения' }, 400);
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    if (!profile || profile.verificationStatus !== 'email_sent') {
      return c.json({ error: 'Код не был запрошен. Начните верификацию заново.' }, 400);
    }

    if (profile.verificationCode !== code) {
      return c.json({ error: 'Неверный код подтверждения' }, 400);
    }

    if (profile.verificationCodeExpires && new Date(profile.verificationCodeExpires) < new Date()) {
      return c.json({ error: 'Срок действия кода истёк. Запросите новый код.' }, 400);
    }

    const [updated] = await db.update(profiles)
      .set({
        isUniversityVerified: true,
        verificationStatus: 'email_verified',
        verificationCode: null,
        verificationCodeExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id))
      .returning();

    return c.json({
      message: 'Email подтверждён',
      verificationStatus: 'email_verified',
      isUniversityVerified: true,
    });
  } catch (err) {
    console.error('Confirm code error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/profile/verify/document - upload student ID document (auto-approve in test mode)
router.post('/verify/document', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    const contentType = c.req.header('Content-Type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.parseBody();
      const file = formData['file'] as File | undefined;
      if (file) {
        fileName = file.name;
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        fileUrl = `data:${file.type};base64,${base64}`;
      }
    } else {
      const body = await c.req.json();
      fileUrl = body.fileUrl;
      fileName = body.fileName || 'document';
    }

    if (!fileUrl) {
      return c.json({ error: 'Файл не загружен' }, 400);
    }

    // Auto-approve in test mode
    let [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    if (existingProfile) {
      await db.update(profiles)
        .set({
          verificationStatus: 'verified',
          isUniversityVerified: true,
          verificationMethod: 'document',
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, existingProfile.id));
    } else {
      [existingProfile] = await db.insert(profiles).values({
        userId: authUser.id,
        email: authUser.email,
        verificationStatus: 'verified',
        isUniversityVerified: true,
        verificationMethod: 'document',
      }).returning();
    }

    const [doc] = await db.insert(verificationDocuments)
      .values({
        userId: authUser.id,
        fileUrl,
        fileName,
        status: 'approved',
      })
      .returning();

    return c.json({
      message: 'Документ принят (тестовый режим)',
      verificationStatus: 'verified',
      documentId: doc.id,
    });
  } catch (err) {
    console.error('Upload document error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/profile/verification-status - get current verification status
router.get('/verification-status', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    if (!profile) {
      return c.json({
        status: 'not_verified',
        isVerified: false,
        method: 'none',
        email: null,
      });
    }

    // Get latest document
    const [doc] = await db.select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.userId, authUser.id))
      .orderBy(verificationDocuments.createdAt)
      .limit(1);

    return c.json({
      status: profile.verificationStatus || 'not_verified',
      isVerified: profile.isUniversityVerified || false,
      method: profile.verificationMethod || 'none',
      email: profile.verificationEmail || null,
      document: doc ? {
        id: doc.id,
        status: doc.status,
        fileName: doc.fileName,
        rejectionReason: doc.rejectionReason,
        createdAt: doc.createdAt,
      } : null,
    });
  } catch (err) {
    console.error('Verification status error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

function calculateCompleteness(profile: any) {
  const fields = [
    { key: 'university', weight: 20, value: profile.universityId },
    { key: 'faculty', weight: 20, value: profile.facultyId },
    { key: 'specialty', weight: 20, value: profile.specialtyId },
    { key: 'course', weight: 15, value: profile.course },
    { key: 'enrollmentYear', weight: 10, value: profile.enrollmentYear },
    { key: 'expectedGraduationYear', weight: 15, value: profile.expectedGraduationYear },
  ];

  let percentage = 0;
  const missingFields: string[] = [];

  for (const field of fields) {
    if (field.value) {
      percentage += field.weight;
    } else {
      missingFields.push(field.key);
    }
  }

  return {
    percentage,
    missingFields,
    isComplete: percentage === 100,
  };
}

// Admin: GET /api/profile/admin/verifications - list pending document verifications
router.get('/admin/verifications', authMiddleware, adminMiddleware, async (c) => {
  try {
    const docs = await db.select({
      id: verificationDocuments.id,
      userId: verificationDocuments.userId,
      fileUrl: verificationDocuments.fileUrl,
      fileName: verificationDocuments.fileName,
      status: verificationDocuments.status,
      rejectionReason: verificationDocuments.rejectionReason,
      createdAt: verificationDocuments.createdAt,
    })
      .from(verificationDocuments)
      .where(eq(verificationDocuments.status, 'pending'))
      .orderBy(verificationDocuments.createdAt);

    return c.json(docs);
  } catch (err) {
    console.error('Admin verifications error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Admin: POST /api/profile/admin/verifications/:id/approve
router.post('/admin/verifications/:id/approve', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
    const adminUser = c.get('user');

    const [doc] = await db.update(verificationDocuments)
      .set({
        status: 'approved',
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
      })
      .where(eq(verificationDocuments.id, id))
      .returning();

    if (!doc) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Mark user profile as verified
    await db.update(profiles)
      .set({
        isUniversityVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'document',
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, doc.userId));

    return c.json({ message: 'Verification approved', documentId: id });
  } catch (err) {
    console.error('Approve verification error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Admin: POST /api/profile/admin/verifications/:id/reject
router.post('/admin/verifications/:id/reject', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
    const adminUser = c.get('user');
    const body = await c.req.json();

    const [doc] = await db.update(verificationDocuments)
      .set({
        status: 'rejected',
        rejectionReason: body.reason || 'Документ не соответствует требованиям',
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
      })
      .where(eq(verificationDocuments.id, id))
      .returning();

    if (!doc) {
      return c.json({ error: 'Document not found' }, 404);
    }

    return c.json({ message: 'Verification rejected', documentId: id });
  } catch (err) {
    console.error('Reject verification error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;
