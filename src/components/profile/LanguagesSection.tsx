import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDigitalProfile, Language } from '@/hooks/useDigitalProfile';
import { useToast } from '@/hooks/use-toast';
import { ReorderableList } from './ReorderableList';

const CEFR_LABELS: Record<string, string> = {
  A1: 'A1 — Начальный',
  A2: 'A2 — Элементарный',
  B1: 'B1 — Средний',
  B2: 'B2 — Выше среднего',
  C1: 'C1 — Продвинутый',
  C2: 'C2 — В совершенстве',
};

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  B1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B2: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  C1: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  C2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function LanguagesSection() {
  const { languages, addLanguage, updateLanguage, deleteLanguage, reorderLanguages } = useDigitalProfile();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Language | null>(null);
  const [name, setName] = useState('');
  const [cefrLevel, setCefrLevel] = useState<string>('B1');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setCefrLevel('B1');
    setDialogOpen(true);
  };

  const openEdit = (lang: Language) => {
    setEditing(lang);
    setName(lang.name);
    setCefrLevel(lang.cefrLevel);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название языка', variant: 'destructive' });
      return;
    }
    const { error } = editing
      ? await updateLanguage(editing.id, { name: name.trim(), cefrLevel: cefrLevel as Language['cefrLevel'] })
      : await addLanguage({ name: name.trim(), cefrLevel: cefrLevel as Language['cefrLevel'] });

    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: editing ? 'Язык обновлён' : 'Язык добавлен' }); setDialogOpen(false); }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteLanguage(id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else toast({ title: 'Язык удалён' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Языки</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Добавить
        </Button>
      </div>

      {languages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Языки не добавлены.</p>
      ) : (
        <ReorderableList items={languages} onReorder={reorderLanguages}>
          {(lang) => (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <span className="font-medium text-sm">{lang.name}</span>
              <Badge className={CEFR_COLORS[lang.cefrLevel] || ''}>{lang.cefrLevel}</Badge>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => openEdit(lang)}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive" onClick={() => handleDelete(lang.id)}>
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
            <DialogTitle>{editing ? 'Редактировать язык' : 'Добавить язык'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Язык</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Английский" />
            </div>
            <div className="space-y-2">
              <Label>Уровень (CEFR)</Label>
              <Select value={cefrLevel} onValueChange={setCefrLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CEFR_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
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
