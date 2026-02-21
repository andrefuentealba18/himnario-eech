"use client";

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePraises } from '@/hooks/use-praises';

export function PraiseAdminList() {
  const { praises, deletePraise, isLoaded } = usePraises();
  const { toast } = useToast();

  const handleDelete = (praiseId: string) => {
    deletePraise(praiseId);
    toast({
      title: 'Alabanza Eliminada',
      description: 'La alabanza se ha eliminado de la lista.',
    });
  };

  const handleEdit = () => {
    toast({
      title: 'Próximamente',
      description: 'La función de editar estará disponible pronto.',
    });
  };

  if (!isLoaded) {
    return <p className="text-muted-foreground">Cargando alabanzas...</p>;
  }

  if (praises.length === 0) {
    return (
        <p className="text-muted-foreground">No hay alabanzas para mostrar. Agrégalas desde la sección de Alabanzas.</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {praises.map((praise) => (
        <div key={praise.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <span className="font-medium">{praise.title}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handleDelete(praise.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
