"use client";

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePraises } from '@/hooks/use-praises';

export function PraiseAdminList() {
  const { praises, isLoaded } = usePraises();
  const { toast } = useToast();

  const handleDelete = (praiseId: string) => {
    toast({
      title: 'Función no implementada',
      description: 'La eliminación de alabanzas se implementará pronto.',
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará la alabanza de la lista (de forma simulada).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(praise.id)}>
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
