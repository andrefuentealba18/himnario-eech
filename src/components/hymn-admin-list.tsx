"use client";

import { useState } from 'react';
import { hymns as initialHymns } from '@/lib/hymns';
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

export function HymnAdminList() {
  const [hymns, setHymns] = useState(initialHymns);
  const { toast } = useToast();

  const handleDelete = (hymnNumber: number) => {
    // This is a simulation. In a real app, you'd call an API here.
    setHymns(hymns.filter(h => h.number !== hymnNumber));
    toast({
      title: 'Himno Eliminado (Simulación)',
      description: 'El himno se ha quitado de la lista. Los cambios no son permanentes.',
    });
  };

  const handleEdit = () => {
    toast({
      title: 'Próximamente',
      description: 'La función de editar estará disponible pronto.',
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {hymns.map((hymn) => (
        <div key={hymn.number} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <span className="font-bold text-primary">{hymn.number}.</span>
            <span className="ml-2 font-medium">{hymn.title}</span>
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
                    Esta acción no se puede deshacer. Esto eliminará el himno de la lista (de forma simulada).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(hymn.number)}>
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
