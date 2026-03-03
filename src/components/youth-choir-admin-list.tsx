
"use client";

import { useState, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';
import { Input } from '@/components/ui/input';
import { normalizeSearchTerm } from '@/lib/utils';
import { Badge } from './ui/badge';

export function YouthChoirAdminList() {
  const { youthChoirs, deleteYouthChoir, updateYouthChoir, isLoaded } = useYouthChoirs();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredYouthChoirs = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    if (!normalizedSearch) {
      return youthChoirs;
    }
    return youthChoirs.filter(youthChoir =>
      normalizeSearchTerm(youthChoir.title).includes(normalizedSearch) ||
      normalizeSearchTerm(youthChoir.group).includes(normalizedSearch)
    );
  }, [searchTerm, youthChoirs]);


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
    return <p className="text-muted-foreground text-center py-10">Cargando alabanzas...</p>;
  }

  if (youthChoirs.length === 0) {
    return (
        <p className="text-muted-foreground text-center py-10">No hay alabanzas para mostrar. Agrégalas desde la sección correspondiente.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título o agrupación..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filteredYouthChoirs.map((youthChoir) => (
          <div key={youthChoir.id} className="flex items-center justify-between p-3 border rounded-lg gap-2">
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="font-medium truncate block">{youthChoir.title}</span>
              <Badge variant="outline" className="text-[10px] h-5">{youthChoir.group}</Badge>
            </div>
            <div className="flex gap-2 flex-shrink-0">
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
    </div>
  );
}
