"use client";

import { useState, useMemo } from 'react';
import type { Hymn } from '@/lib/hymns';
import { useHymns } from '@/context/hymns-context';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditHymnDialog } from './edit-hymn-dialog';
import { Input } from '@/components/ui/input';
import { normalizeSearchTerm } from '@/lib/utils';

export function HymnAdminList() {
  const { hymns, deleteHymn, updateHymn, isLoaded } = useHymns();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHymns = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    if (!normalizedSearch) {
      return hymns;
    }
    return hymns.filter(hymn =>
      normalizeSearchTerm(hymn.title).includes(normalizedSearch) ||
      hymn.number.toString().includes(normalizedSearch)
    );
  }, [searchTerm, hymns]);

  const handleDelete = async (hymnNumber: number) => {
    await deleteHymn(hymnNumber);
  };

  const handleUpdate = (hymnNumber: number) => async (updatedData: Omit<Hymn, 'id' | 'number'>) => {
    const result = await updateHymn(hymnNumber, updatedData);
    if (result.success) {
      toast({
        title: 'Himno Actualizado',
        description: `El himno #${hymnNumber} se ha guardado correctamente.`,
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error al Actualizar',
            description: 'No se pudo guardar el himno.',
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por número o título..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filteredHymns.map((hymn) => (
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
    </div>
  );
}
