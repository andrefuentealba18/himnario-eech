"use client";

import type { Hymn } from '@/lib/hymns';
import { useHymns } from '@/context/hymns-context';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditHymnDialog } from './edit-hymn-dialog';

export function HymnAdminList() {
  const { hymns, deleteHymn, updateHymn, isLoaded } = useHymns();
  const { toast } = useToast();

  const handleDelete = async (hymnNumber: number) => {
    await deleteHymn(hymnNumber);
    toast({
      title: 'Himno Eliminado',
      description: 'El himno se ha eliminado de la lista.',
    });
  };

  const handleUpdate = (hymnNumber: number) => async (updatedData: Omit<Hymn, 'id' | 'number'>) => {
    const result = await updateHymn(hymnNumber, updatedData);
    if (result.success) {
      toast({
        title: 'Himno Actualizado',
        description: `El himno #${hymnNumber} se ha guardado correctamente.`,
      });
    }
    return result;
  };

  if (!isLoaded) {
    return <p className="text-muted-foreground">Cargando himnos...</p>;
  }

  if (hymns.length === 0) {
    return <p className="text-muted-foreground">No hay himnos para mostrar. Agrégalos desde el diálogo correspondiente.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {hymns.map((hymn) => (
        <div key={hymn.number} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <span className="font-bold text-primary">{hymn.number}.</span>
            <span className="ml-2 font-medium">{hymn.title}</span>
          </div>
          <div className="flex gap-2">
            <EditHymnDialog hymn={hymn} onHymnUpdated={handleUpdate(hymn.number)}>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </EditHymnDialog>
            <Button variant="destructive" size="icon" onClick={() => handleDelete(hymn.number)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
