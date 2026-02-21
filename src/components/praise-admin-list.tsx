"use client";

import { useState } from 'react';
import { praises as initialPraises, type Praise } from '@/lib/praises';
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

export function PraiseAdminList() {
  const [praises, setPraises] = useState<Praise[]>(initialPraises);
  const { toast } = useToast();

  const handleDelete = (praiseId: string) => {
    // This is a simulation. In a real app, you'd call an API here.
    setPraises(praises.filter(p => p.id !== praiseId));
    toast({
      title: 'Alabanza Eliminada (Simulación)',
      description: 'La alabanza se ha quitado de la lista. Los cambios no son permanentes.',
    });
  };

  const handleEdit = () => {
    toast({
      title: 'Próximamente',
      description: 'La función de editar estará disponible pronto.',
    });
  };

  if (praises.length === 0) {
    return (
        <p className="text-muted-foreground">No hay alabanzas para mostrar. Agrégalas desde el diálogo correspondiente.</p>
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
