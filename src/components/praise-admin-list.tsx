"use client";

import { useState, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePraises } from '@/context/praises-context';
import { EditPraiseDialog } from './edit-praise-dialog';
import { Input } from '@/components/ui/input';

export function PraiseAdminList() {
  const { praises, deletePraise, updatePraise, isLoaded } = usePraises();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPraises = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (!lowercasedSearchTerm) {
      return praises;
    }
    return praises.filter(praise =>
      praise.title.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, praises]);

  const handleDelete = async (praiseId: string) => {
    await deletePraise(praiseId);
    toast({
      title: 'Alabanza Eliminada',
      description: 'La alabanza se ha eliminado de la lista.',
    });
  };

  const handleUpdate = (praiseId: string) => async (updatedData: Omit<Praise, 'id'>) => {
    const result = await updatePraise(praiseId, updatedData);
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

  if (praises.length === 0) {
    return (
        <p className="text-muted-foreground">No hay alabanzas para mostrar. Agrégalas desde la sección de Alabanzas.</p>
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
        {filteredPraises.map((praise) => (
          <div key={praise.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">{praise.title}</span>
            </div>
            <div className="flex gap-2">
              <EditPraiseDialog praise={praise} onPraiseUpdated={handleUpdate(praise.id)}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              </EditPraiseDialog>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(praise.id)}>
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
