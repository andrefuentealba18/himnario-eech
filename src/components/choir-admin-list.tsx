"use client";

import { useState, useMemo } from 'react';
import type { Choir } from '@/lib/choirs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChoirs } from '@/context/choirs-context';
import { EditChoirDialog } from './edit-choir-dialog';
import { Input } from '@/components/ui/input';

export function ChoirAdminList() {
  const { choirs, deleteChoir, updateChoir, isLoaded } = useChoirs();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChoirs = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (!lowercasedSearchTerm) {
      return choirs;
    }
    return choirs.filter(choir =>
      choir.title.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, choirs]);

  const handleDelete = async (choirId: string) => {
    await deleteChoir(choirId);
    toast({
      title: 'Coro Eliminado',
      description: 'El coro se ha eliminado de la lista.',
    });
  };

  const handleUpdate = (choirId: string) => async (updatedData: Omit<Choir, 'id'>) => {
    const result = await updateChoir(choirId, updatedData);
    if (result.success) {
      toast({
        title: 'Coro Actualizado',
        description: `El coro "${updatedData.title}" se ha guardado correctamente.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'Ya existe un coro con ese título.',
      });
    }
    return result;
  };


  if (!isLoaded) {
    return <p className="text-muted-foreground">Cargando coros...</p>;
  }

  if (choirs.length === 0) {
    return (
        <p className="text-muted-foreground">No hay coros para mostrar. Agrégalos desde la sección de Coros.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filteredChoirs.map((choir) => (
          <div key={choir.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">{choir.title}</span>
            </div>
            <div className="flex gap-2">
              <EditChoirDialog choir={choir} onChoirUpdated={handleUpdate(choir.id)}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              </EditChoirDialog>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(choir.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
