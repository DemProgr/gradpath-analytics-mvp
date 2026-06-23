import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Search, Loader2,
  FileText, Save, X, Eye, ArrowLeft,
  Calendar, User, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  tags: string;
}

const emptyForm: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  coverImage: '',
  tags: '',
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.get<BlogPost[]>('/api/blogs');
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (title: string) => {
    const map: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya',
    };
    return title
      .toLowerCase()
      .split('')
      .map(c => map[c] || c)
      .join('')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleGenerateSlug = () => {
    setForm(prev => ({ ...prev, slug: generateSlug(prev.title) }));
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author,
      coverImage: post.coverImage || '',
      tags: (post.tags || []).join(', '),
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content || !form.author) return;

    setSaving(true);
    try {
      const parsed = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        author: form.author,
        coverImage: form.coverImage || null,
        tags: form.tags
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      };

      if (editingId) {
        await api.put(`/api/blogs/${editingId}`, parsed);
      } else {
        await api.post('/api/blogs', parsed);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await fetchPosts();
    } catch (err) {
      console.error('Failed to save blog post:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/blogs/${id}`);
      setDeleteConfirm(null);
      await fetchPosts();
    } catch (err) {
      console.error('Failed to delete blog post:', err);
    }
  };

  const filtered = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Назад
            </Button>
            <h3 className="text-lg font-semibold">
              {editingId ? 'Редактировать статью' : 'Новая статья'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
              <X className="w-4 h-4 mr-1" />
              Отмена
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !form.title || !form.slug || !form.content || !form.author}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Label>Заголовок *</Label>
              <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Как выбрать IT-специальность" />
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Slug (URL) *</Label>
                <Input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="kak-vybrat-it-specialnost" />
              </div>
              <Button variant="outline" size="sm" onClick={handleGenerateSlug} disabled={!form.title} className="mb-0.5">
                Сгенерировать
              </Button>
            </div>

            <div>
              <Label>Краткое описание</Label>
              <Textarea
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Краткое описание для карточки статьи"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Текст статьи *</Label>
              <Textarea
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="## Заголовок&#10;&#10;Текст статьи...&#10;&#10;### Подзаголовок&#10;&#10;Поддерживается простая разметка: ## h2, ### h3, --- разделитель, 1. нумерованные списки"
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Поддерживается разметка: <code>## заголовок</code>, <code>### подзаголовок</code>, <code>---</code> разделитель, <code>1. список</code>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Автор *</Label>
              <Input value={form.author} onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))} placeholder="GradPath" />
            </div>

            <div>
              <Label>Теги</Label>
              <Input value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} placeholder="IT, Карьера, Поступление" />
              <p className="text-xs text-muted-foreground mt-1">Через запятую</p>
            </div>

            <div>
              <Label>URL обложки</Label>
              <Input value={form.coverImage} onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))} placeholder="https://..." />
            </div>

            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Предпросмотр</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">Заголовок:</span> {form.title || '—'}</p>
                <p><span className="font-medium text-foreground">Slug:</span> /blog/{form.slug || '—'}</p>
                <p><span className="font-medium text-foreground">Автор:</span> {form.author || '—'}</p>
                <p><span className="font-medium text-foreground">Теги:</span> {form.tags || '—'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Статьи блога</h3>
          <Badge variant="secondary">{posts.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Новая статья
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Поиск по заголовку, slug или описанию..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Статьи не найдены</p>
          <Button variant="link" onClick={() => setShowForm(true)}>
            Написать первую статью
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{post.title}</h4>
                  <span className="text-xs text-muted-foreground shrink-0">/blog/{post.slug}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.tags.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => {
                  const url = `/blog/${post.slug}`;
                  window.open(url, '_blank');
                }}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                {deleteConfirm === post.id ? (
                  <div className="flex items-center gap-1">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                      Удалить
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(post.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
