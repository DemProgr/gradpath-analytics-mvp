import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDigitalProfile, Skill } from '@/hooks/useDigitalProfile';
import { useToast } from '@/hooks/use-toast';
import { ReorderableList } from './ReorderableList';

const PROFICIENCY_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  expert: 'Эксперт',
};

const PROFICIENCY_COLORS: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  expert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function SkillsSection() {
  const { skills, addSkill, updateSkill, deleteSkill, reorderSkills } = useDigitalProfile();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [name, setName] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('intermediate');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setProficiencyLevel('intermediate');
    setDialogOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setName(skill.name);
    setProficiencyLevel(skill.proficiencyLevel);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название навыка', variant: 'destructive' });
      return;
    }

    const { error } = editing
      ? await updateSkill(editing.id, { name: name.trim(), proficiencyLevel: proficiencyLevel as Skill['proficiencyLevel'] })
      : await addSkill({ name: name.trim(), proficiencyLevel: proficiencyLevel as Skill['proficiencyLevel'] });

    if (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editing ? 'Навык обновлён' : 'Навык добавлен' });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteSkill(id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else toast({ title: 'Навык удалён' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Навыки</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Добавить
        </Button>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Навыки не добавлены. Добавьте хотя бы 3-5 навыков для улучшения профиля.
        </p>
      ) : (
        <ReorderableList items={skills} onReorder={reorderSkills}>
          {(skill) => (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <Badge className={PROFICIENCY_COLORS[skill.proficiencyLevel] || ''}>
                {skill.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {PROFICIENCY_LABELS[skill.proficiencyLevel]}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => openEdit(skill)}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </ReorderableList>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать навык' : 'Добавить навык'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Python" />
            </div>
            <div className="space-y-2">
              <Label>Уровень владения</Label>
              <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Начальный</SelectItem>
                  <SelectItem value="intermediate">Средний</SelectItem>
                  <SelectItem value="advanced">Продвинутый</SelectItem>
                  <SelectItem value="expert">Эксперт</SelectItem>
                </SelectContent>
              </Select>
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
