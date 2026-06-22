import { useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDigitalProfile, Project } from '@/hooks/useDigitalProfile';
import { useToast } from '@/hooks/use-toast';
import { ReorderableList } from './ReorderableList';

export function ProjectsSection() {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useDigitalProfile();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const openAdd = () => {
    setEditing(null);
    setTitle(''); setDescription(''); setRole(''); setUrl(''); setStartDate(''); setEndDate('');
    setDialogOpen(true);
  };

  const openEdit = (proj: Project) => {
    setEditing(proj);
    setTitle(proj.title);
    setDescription(proj.description || '');
    setRole(proj.role || '');
    setUrl(proj.url || '');
    setStartDate(proj.startDate ? proj.startDate.slice(0, 10) : '');
    setEndDate(proj.endDate ? proj.endDate.slice(0, 10) : '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название проекта', variant: 'destructive' });
      return;
    }

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      role: role.trim() || undefined,
      url: url.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || null,
    };

    const { error } = editing
      ? await updateProject(editing.id, data)
      : await addProject(data);

    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: editing ? 'Проект обновлён' : 'Проект добавлен' }); setDialogOpen(false); }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteProject(id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else toast({ title: 'Проект удалён' });
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Проекты</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Добавить
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Проекты не добавлены.</p>
      ) : (
        <ReorderableList items={projects} onReorder={reorderProjects}>
          {(proj) => (
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{proj.title}</p>
                  {proj.role && <p className="text-xs text-muted-foreground">{proj.role}</p>}
                  {proj.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>}
                  {(proj.startDate || proj.endDate) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate) || 'настоящее время'}
                    </p>
                  )}
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> Открыть
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => openEdit(proj)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive" onClick={() => handleDelete(proj.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ReorderableList>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать проект' : 'Добавить проект'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Разработка веб-приложения" />
            </div>
            <div className="space-y-2">
              <Label>Роль</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend разработчик" />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание проекта" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Ссылка</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Дата начала</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Дата окончания</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>{editing ? 'Сохранить' : 'Добавить'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
