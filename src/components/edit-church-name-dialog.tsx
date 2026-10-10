"use client";

import { useState } from 'react';
import { useChurch } from '@/context/church-context';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';

export function EditChurchNameDialog() {
  const { currentChurch, setCurrentChurch } = useChurch();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(currentChurch?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentChurch) return null;

  const handleSave = async () => {
    if (!newName.trim() || newName.trim() === currentChurch.name || !firestore) return;
    setIsSaving(true);
    
    try {
      await updateDoc(doc(firestore, 'churches', currentChurch.id), {
        name: newName.trim()
      });
      
      setCurrentChurch({ ...currentChurch, name: newName.trim() });
      toast({ title: 'Nombre actualizado', description: 'El nombre de la iglesia ha sido guardado.' });
      setOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el nombre.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (val) setNewName(currentChurch.name); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-primary/80 font-bold hover:bg-primary/10">
          <Pencil className="h-4 w-4 mr-2" />
          Editar Nombre
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-sm rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>Editar Nombre de Iglesia</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder="Nombre de la Iglesia" 
            className="text-lg font-bold"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving || !newName.trim()}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
