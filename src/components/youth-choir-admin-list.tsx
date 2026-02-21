"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';

export function YouthChoirAdminList() {
  const { youthChoirs, deleteYouthChoir, updateYouthChoir, isLoaded } = useYouthChoirs();
  const { toast } = useToast();

  const handleDelete = async (youthChoirId: string) => {
    await deleteYouthChoir(youthChoirId);
    toast({
      title: 'Alabanza Eliminada',
      description: 'La alabanza se ha eliminado de la lista.',
    });
  };

  const handleUpdate = (youthChoirId: string) => async (updatedData: Omit<YouthChoir, 'id'>) => {
    const result = await updateYouthChoir(youthChoirId, updatedData);
    if (result.success) {
      toast({
        title: 'Alabanza Actualizada',
        description: `La alabanza "${updatedData.title}" se ha guardado correctamente.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'Ya existe una alabanza con ese título.',
      });
    }
    return result;
  };


  if (!isLoaded) {
    return <p className="text-muted-foreground">Cargando alabanzas...</p>;
  }

  if (youthChoirs.length === 0) {
    return (
        <p className="text-muted-foreground">No hay alabanzas para mostrar. Agrégalas desde la sección correspondiente.</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {youthChoirs.map((youthChoir) => (
        <div key={youthChoir.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <span className="font-medium">{youthChoir.title}</span>
          </div>
          <div className="flex gap-2">
            <EditYouthChoirDialog youthChoir={youthChoir} onYouthChoirUpdated={handleUpdate(youthChoir.id)}>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </EditYouthChoirDialog>
            <Button variant="destructive" size="icon" onClick={() => handleDelete(youthChoir.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

    