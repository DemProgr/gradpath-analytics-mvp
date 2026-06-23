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
import { useLanguage } from '@/hooks/useLanguage';

const PROFICIENCY_COLORS: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  expert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function SkillsSection() {
  const { t } = useLanguage();
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
      toast({ title: t('common.error'), description: t('profile.skillNameRequired'), variant: 'destructive' });
      return;
    }

    const { error } = editing
      ? await updateSkill(editing.id, { name: name.trim(), proficiencyLevel: proficiencyLevel as Skill['proficiencyLevel'] })
      : await addSkill({ name: name.trim(), proficiencyLevel: proficiencyLevel as Skill['proficiencyLevel'] });

    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editing ? t('profile.skillUpdated') : t('profile.skillAdded') });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteSkill(id);
    if (error) toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    else toast({ title: t('profile.skillDeleted') });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{t('profile.skills')}</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> {t('profile.add')}
        </Button>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t('profile.skillsEmpty')}
        </p>
      ) : (
        <ReorderableList items={skills} onReorder={reorderSkills}>
          {(skill) => (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <Badge className={PROFICIENCY_COLORS[skill.proficiencyLevel] || ''}>
                {skill.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t('profile.proficiency.' + skill.proficiencyLevel)}
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
            <DialogTitle>{editing ? t('profile.editSkill') : t('profile.addSkill')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('profile.skillName')}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Python" />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.proficiencyLevel')}</Label>
              <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t('profile.proficiency.beginner')}</SelectItem>
                  <SelectItem value="intermediate">{t('profile.proficiency.intermediate')}</SelectItem>
                  <SelectItem value="advanced">{t('profile.proficiency.advanced')}</SelectItem>
                  <SelectItem value="expert">{t('profile.proficiency.expert')}</SelectItem>
                </SelectContent>
              </Select>
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
