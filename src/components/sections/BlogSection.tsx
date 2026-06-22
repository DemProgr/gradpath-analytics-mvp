import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Search, Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';

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

interface BlogSectionProps {
  className?: string;
}

export function BlogSection({ className }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    api.get<BlogPost[]>('/api/blogs')
      .then((items) => {
        setPosts(items || []);
      })
      .catch((err) => {
        setError(err.message || 'Не удалось загрузить статьи');
      })
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
          <Button onClick={() => window.location.reload()}>Повторить</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-card", className)}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">Блог</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Статьи о карьере, образовании, поступлении и рынке труда в Беларуси. Аналитика и советы от GradPath.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск по статьям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge
              variant={activeTag === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setActiveTag(null)}
            >
              Все
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setActiveTag(tag)}>
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button variant="link" className="px-0 self-start" asChild>
                    <a href={`/blog/${post.slug}`}>
                      Читать дальше
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setActiveTag(null); }}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
