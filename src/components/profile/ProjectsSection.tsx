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
import { useLanguage } from '@/hooks/useLanguage';

export function ProjectsSection() {
  const { t, language } = useLanguage();
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
      toast({ title: t('common.error'), description: t('profile.projectTitleRequired'), variant: 'destructive' });
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

    if (error) toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    else { toast({ title: editing ? t('profile.projectUpdated') : t('profile.projectAdded') }); setDialogOpen(false); }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteProject(id);
    if (error) toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    else toast({ title: t('profile.projectDeleted') });
  };

  const locale = language === 'en' ? 'en-US' : language === 'be' ? 'be-BY' : 'ru-RU';

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{t('profile.projects')}</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> {t('profile.add')}
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{t('profile.projectsEmpty')}</p>
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
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate) || t('profile.present')}
                    </p>
                  )}
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> {t('profile.open')}
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
            <DialogTitle>{editing ? t('profile.editProject') : t('profile.addProject')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label>{t('profile.projectTitle')}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Web App Development" />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.projectRole')}</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend Developer" />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.projectDescription')}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('profile.projectDescription')} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.projectUrl')}</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('profile.projectStartDate')}</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.projectEndDate')}</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave}>{editing ? t('common.save') : t('profile.add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
