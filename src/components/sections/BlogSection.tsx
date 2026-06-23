import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

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

const FALLBACK_IMAGES = [
  '/blog/IT.jpg',
  '/blog/salary.jpg',
  '/blog/admission.jpg',
  '/blog/intership.jpg',
  '/blog/rating.jpg',
  '/blog/resume.jpg',
];

interface BlogSectionProps {
  className?: string;
}

export function BlogSection({ className }: BlogSectionProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    api.get<BlogPost[]>('/api/blogs')
      .then((items) => setPosts(items || []))
      .catch((err) => setError(err.message || t('blog.loadError')))
      .finally(() => setLoading(false));
  }, []);

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))].sort();

  const filtered = posts.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !activeTag || (p.tags && p.tags.includes(activeTag));
    return matchesSearch && matchesTag;
  });

  const locale = language === 'en' ? 'en-US' : language === 'be' ? 'be-BY' : 'ru-RU';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getImage = (post: BlogPost) =>
    post.coverImage || SLUG_TO_IMAGE[post.slug] || FALLBACK_IMAGES[post.id % FALLBACK_IMAGES.length];

  const getSidebarImage = (post: BlogPost) =>
    post.coverImage || SLUG_TO_IMAGE[post.slug] || FALLBACK_IMAGES[post.id % FALLBACK_IMAGES.length];

  const getCategory = (post: BlogPost) =>
    post.tags && post.tags.length > 0 ? post.tags[0] : null;

  if (loading) {
    return (
      <section className={cn("py-16", className)}>
        <div className="section-container flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="section-container text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>{t('blog.retry')}</Button>
        </div>
      </section>
    );
  }

  const mainPosts = filtered.slice(0, 3);
  const featuredPosts = filtered.slice(0, 3);
  const latestPosts = filtered.slice(3, 6);

  return (
    <section className={cn("pt-16 bg-background", className)}>
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            {t('blog.title')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            {language === 'en'
              ? 'Discover our latest news'
              : language === 'be'
                ? 'Апошнія навіны'
                : 'Последние новости'}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {t('blog.subtitle')}
          </p>

          {/* Search */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button className="h-11 px-6 bg-primary text-primary-foreground">
              {language === 'en' ? 'Find Now' : 'Найти'}
            </Button>
          </div>
        </motion.div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeTag === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {t('blog.allTags')}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                  activeTag === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{t('blog.empty')}</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setActiveTag(null); }}>
              {t('blog.resetFilters')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            {/* Left: Section heading + image cards grid */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-8">
                {language === 'en'
                  ? 'Featured articles.'
                  : language === 'be'
                    ? 'Артыкулы.'
                    : 'Избранные статьи.'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mainPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a href={`/blog/${post.slug}`} className="group block">
                      <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                        <img
                          src={getImage(post)}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Category badge */}
                        {getCategory(post) && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                            {getCategory(post)}
                          </span>
                        )}

                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white leading-snug line-clamp-3">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-8">
              {/* Featured */}
              <div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-5">
                  {language === 'en' ? 'Featured' : 'Избранное'}
                </h3>
                <div className="space-y-0">
                  {featuredPosts.map((post, index) => (
                    <div key={post.id}>
                      <a
                        href={`/blog/${post.slug}`}
                        className="flex gap-4 py-4 group"
                      >
                        <img
                          src={getSidebarImage(post)}
                          alt={post.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            {formatDate(post.publishedAt)}
                          </p>
                          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                        </div>
                      </a>
                      {index < featuredPosts.length - 1 && (
                        <div className="border-b border-border" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest */}
              {latestPosts.length > 0 && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-5">
                    {language === 'en' ? 'Latest' : 'Недавние'}
                  </h3>
                  <div className="space-y-0">
                    {latestPosts.map((post, index) => (
                      <div key={post.id}>
                        <a
                          href={`/blog/${post.slug}`}
                          className="flex gap-4 py-4 group"
                        >
                          <img
                            src={getSidebarImage(post)}
                            alt={post.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">
                              {formatDate(post.publishedAt)}
                            </p>
                            <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                          </div>
                        </a>
                        {index < latestPosts.length - 1 && (
                          <div className="border-b border-border" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Newsletter Subscription */}
      <div className="py-20" style={{ backgroundColor: 'rgb(228, 235, 242)' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {language === 'en'
              ? 'Want to stay updated? Subscribe to our newsletter!'
              : language === 'be'
                ? 'Хочаце быць у курсе? Падпішыцеся на нашу рассылку!'
                : 'Хотите быть в курсе? Подпишитесь на нашу рассылку!'}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            {language === 'en'
              ? 'We will send you the latest articles about careers, education and the labor market in Belarus'
              : language === 'be'
                ? 'Мы адправім вам апошнія артыкулы аб кар\'еры, адукацыі і рынку працы ў Беларусі'
                : 'Мы отправим вам последние статьи о карьере, образовании и рынке труда в Беларуси'}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input') as HTMLInputElement;
              if (input?.value) {
                toast({ title: 'Подписка оформлена', description: `${input.value} добавлен в рассылку` });
                input.value = '';
              }
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
          >
            <Input
              type="email"
              required
              placeholder={language === 'en' ? 'Your email address' : 'Ваш email'}
              className="flex-1 w-full sm:w-auto h-11"
            />
            <Button type="submit" className="h-11 px-8 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {language === 'en' ? 'Subscribe' : 'Подписаться'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
