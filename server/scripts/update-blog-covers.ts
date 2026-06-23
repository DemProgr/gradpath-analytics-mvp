import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const COVER_IMAGES: Record<string, string> = {
  'kak-vybrat-it-specialnost': '/blog/IT.jpg',
  'srednie-zarplaty-vypusknikov-2026': '/blog/salary.jpg',
  'kuda-uezzhayut-vypuskniki': '/blog/admission.jpg',
  'stazhirovki-2026-gde-iskat': '/blog/intership.jpg',
  'reiting-vuzov-belarusi-2026': '/blog/rating.jpg',
  'kak-sostavit-rezume-studentu': '/blog/resume.jpg',
};

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  for (const [slug, coverImage] of Object.entries(COVER_IMAGES)) {
    const result = await sql`UPDATE blogs SET cover_image = ${coverImage} WHERE slug = ${slug} AND cover_image IS NULL`;
    console.log(`Updated ${slug}: ${coverImage}`);
  }

  console.log('Done updating cover images');
  process.exit(0);
}

main().catch((err: unknown) => { console.error(err); process.exit(1); });
