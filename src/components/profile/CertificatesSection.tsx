import { useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDigitalProfile, Certificate } from '@/hooks/useDigitalProfile';
import { useToast } from '@/hooks/use-toast';
import { ReorderableList } from './ReorderableList';

export function CertificatesSection() {
  const { certificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates } = useDigitalProfile();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [url, setUrl] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const openAdd = () => {
    setEditing(null);
    setName(''); setIssuer(''); setUrl(''); setIssueDate(''); setExpiryDate('');
    setDialogOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setName(cert.name);
    setIssuer(cert.issuer);
    setUrl(cert.url || '');
    setIssueDate(cert.issueDate ? cert.issueDate.slice(0, 10) : '');
    setExpiryDate(cert.expiryDate ? cert.expiryDate.slice(0, 10) : '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название сертификата', variant: 'destructive' });
      return;
    }
    if (!issuer.trim()) {
      toast({ title: 'Ошибка', description: 'Введите организацию', variant: 'destructive' });
      return;
    }

    const data = {
      name: name.trim(),
      issuer: issuer.trim(),
      url: url.trim() || undefined,
      issueDate: issueDate || undefined,
      expiryDate: expiryDate || null,
    };

    const { error } = editing
      ? await updateCertificate(editing.id, data)
      : await addCertificate(data);

    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: editing ? 'Сертификат обновлён' : 'Сертификат добавлен' }); setDialogOpen(false); }
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteCertificate(id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else toast({ title: 'Сертификат удалён' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Сертификаты</h4>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Добавить
        </Button>
      </div>

      {certificates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Сертификаты не добавлены.</p>
      ) : (
        <ReorderableList items={certificates} onReorder={reorderCertificates}>
          {(cert) => (
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  {cert.issueDate && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(cert.issueDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })}
                      {cert.expiryDate && ` — ${new Date(cert.expiryDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })}`}
                    </p>
                  )}
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> Подтвердить
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => openEdit(cert)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive" onClick={() => handleDelete(cert.id)}>
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
            <DialogTitle>{editing ? 'Редактировать сертификат' : 'Добавить сертификат'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="SQL для анализа данных" />
            </div>
            <div className="space-y-2">
              <Label>Организация *</Label>
              <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Coursera" />
            </div>
            <div className="space-y-2">
              <Label>Ссылка</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://coursera.org/..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Дата выдачи</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Срок действия</Label>
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
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
