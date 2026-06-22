import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
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

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get<BlogPost>(`/api/blogs/${slug}`)
      .then(setPost)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

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
          <p className="text-muted-foreground mb-4">Статья не найдена</p>
          <Button asChild><Link to="/blog">Назад к блогу</Link></Button>
        </main>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('| ')) {
        return null;
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-6 border-border" />;
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        return (
          <div key={i} className="flex gap-2 ml-4 mb-1">
            <span className="text-primary font-bold shrink-0">{line.match(/^\d+\./)?.[0]}</span>
            <span className="text-muted-foreground">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      if (line.startsWith('- **') && line.endsWith('**')) {
        const text = line.replace(/^- \*\*/, '').replace(/\*\*$/, '');
        return <p key={i} className="font-semibold text-foreground mt-2">{text}</p>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <article className="py-16">
          <div className="section-container max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад к блогу
                </Link>
              </Button>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-6">
                {post.title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.excerpt && (
                <p className="text-lg text-muted-foreground/80 leading-relaxed mb-8 p-4 rounded-xl bg-secondary/50 border border-border italic">
                  {post.excerpt}
                </p>
              )}

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
