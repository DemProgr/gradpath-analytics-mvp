import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api/client';
import { useLanguage } from '@/hooks/useLanguage';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  coverImage: string | null;
  tags: string[] | null;
  publishedAt: string;
}

const SLUG_TO_IMAGE: Record<string, string> = {
  'kak-vybrat-it-specialnost': '/blog/IT.jpg',
  'srednie-zarplaty-vypusknikov-2026': '/blog/salary.jpg',
  'kuda-uezzhayut-vypuskniki': '/blog/admission.jpg',
  'stazhirovki-2026-gde-iskat': '/blog/intership.jpg',
  'reiting-vuzov-belarusi-2026': '/blog/rating.jpg',
  'kak-sostavit-rezume-studentu': '/blog/resume.jpg',
};

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const FALLBACK_IMAGES = [
  '/placeholder.svg',
];

export default function BlogPost() {
  const { t, language } = useLanguage();
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get<BlogPost>(`/api/blogs/${slug}`)
      .then((p) => {
        setPost(p);
        document.title = `${p.title} — GradPath`;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    document.title = post ? `${post.title} — GradPath` : 'GradPath';
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t('blog.notFound')}</p>
          <Button asChild><Link to="/blog">{t('blog.backToList')}</Link></Button>
        </main>
      </div>
    );
  }

  const locale = language === 'en' ? 'en-US' : language === 'be' ? 'be-BY' : 'ru-RU';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getCoverImage = () =>
    post.coverImage || SLUG_TO_IMAGE[post.slug] || FALLBACK_IMAGES[post.id % FALLBACK_IMAGES.length];

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={'md-' + i} className="text-2xl font-serif font-bold text-foreground mt-10 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={'md-' + i} className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('| ')) {
        return null;
      }
      if (line.startsWith('---')) {
        return <hr key={'md-' + i} className="my-8 border-border" />;
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={'md-' + i} className="flex gap-3 mb-2">
            <span className="text-primary font-bold shrink-0 mt-0.5">{line.match(/^\d+\./)?.[0]}</span>
            <span className="text-muted-foreground leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      if (line.startsWith('- **') && line.endsWith('**')) {
        const text = line.replace(/^- \*\*/, '').replace(/\*\*$/, '');
        return <p key={'md-' + i} className="font-semibold text-foreground mt-3">{text}</p>;
      }
      if (line.startsWith('- ')) {
        return (
          <div key={'md-' + i} className="flex gap-2 ml-4 mb-1">
            <span className="text-primary shrink-0">&bull;</span>
            <span className="text-muted-foreground leading-relaxed">{line.replace(/^- /, '')}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={'md-' + i} className="h-3" />;
      }
      return <p key={'md-' + i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Cover Image Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden"
        >
          <img
            src={getCoverImage()}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="section-container">
              {post.tags && post.tags.length > 0 && (
                <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full mb-4">
                  {post.tags[0]}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight max-w-3xl">
                {post.title}
              </h1>
            </div>
          </div>
        </motion.div>

        <article className="py-10">
          <div className="section-container max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('blog.backToList')}
                </Link>
              </Button>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-foreground/70 leading-relaxed mb-10 pl-4 border-l-2 border-primary font-medium italic">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-sm sm:prose max-w-none">
                {renderContent(post.content)}
              </div>
            </motion.div>
          </div>
        </article>
      </main>
    </div>
  );
}
