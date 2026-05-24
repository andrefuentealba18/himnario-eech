"use client";

import { useState, useMemo, useEffect } from 'react';
import type { SpecialOccasion } from '@/lib/special-occasions';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { EditSpecialOccasionDialog } from './edit-special-occasion-dialog';
import { EditToneDialog } from './edit-tone-dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { normalizeSearchTerm } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SpecialOccasionAdminList() {
  const { specialOccasions, deleteSpecialOccasion, updateSpecialOccasion, isLoaded } = useSpecialOccasions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredOccasions = useMemo(() => {
    let list = specialOccasions;

    if (categoryFilter !== 'all') {
      list = list.filter(o => o.category === categoryFilter);
    }

    const normalizedSearch = normalizeSearchTerm(searchTerm);
    if (!normalizedSearch) {
      return list;
    }

    return list.filter(o =>
      normalizeSearchTerm(`${o.title} ${o.lyrics} ${o.tone || ''} ${o.category} ${o.hymnNumber || ''}`).includes(normalizedSearch)
    );
  }, [searchTerm, categoryFilter, specialOccasions]);

  const [visibleCount, setVisibleCount] = useState(50);
  useEffect(() => setVisibleCount(50), [searchTerm, categoryFilter]);
  const visibleOccasions = filteredOccasions.slice(0, visibleCount);

  const handleDelete = async (id: string) => {
    deleteSpecialOccasion(id);
  };

  const handleUpdate = (id: string) => async (updatedData: Omit<SpecialOccasion, 'id'>) => {
    const result = await updateSpecialOccasion(id, updatedData);
    if (result.success) {
      toast({
        title: 'Canto Especial Actualizado',
        description: `El canto "${updatedData.title}" se ha guardado correctamente.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'No se pudo guardar el canto.',
      });
    }
    return result;
  };

  const handleToneUpdate = (song: SpecialOccasion) => async (newTone: string): Promise<{ success: boolean; }> => {
    const { id, ...restOfSong } = song;
    const result = await updateSpecialOccasion(id, { ...restOfSong, tone: newTone });
    if (result.success) {
      toast({
        title: 'Tonalidad Actualizada',
        description: `La tonalidad de "${song.title}" se ha guardado.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'No se pudo guardar la tonalidad.',
      });
    }
    return { success: result.success };
  };

  if (!isLoaded) {
    return <p className="text-muted-foreground">Cargando cantos especiales...</p>;
  }

  if (specialOccasions.length === 0) {
    return (
      <p className="text-muted-foreground">No hay cantos especiales para mostrar. Agrégalos desde la sección de Ocasiones Especiales.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título o letra..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            <SelectItem value="Predicación">Predicación</SelectItem>
            <SelectItem value="Fúnebre">Fúnebre</SelectItem>
            <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
            <SelectItem value="Bautismos">Bautismos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {visibleOccasions.map((song) => (
          <div key={song.id} className="flex items-center justify-between p-3 border rounded-lg gap-2">
            <div className="flex items-center gap-2 flex-grow min-w-0">
              <span className="font-bold text-primary flex-shrink-0 text-xs">
                {song.category.slice(0, 4)}.
              </span>
              {song.hymnNumber && (
                <span className="text-[10px] font-black bg-primary/5 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                  Nº {song.hymnNumber}
                </span>
              )}
              <span className="font-medium truncate">{song.title}</span>
              <EditToneDialog song={song} onToneUpdated={handleToneUpdate(song)}>
                <Badge variant="outline" className="cursor-pointer flex-shrink-0">
                  {song.tone || 'Indefinido'}
                </Badge>
              </EditToneDialog>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <EditSpecialOccasionDialog specialOccasion={song} onSpecialUpdated={handleUpdate(song.id)}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              </EditSpecialOccasionDialog>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(song.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>
        ))}
        {visibleCount < filteredOccasions.length && (
          <Button variant="ghost" onClick={() => setVisibleCount(v => v + 50)} className="w-full mt-4 p-4 text-xs font-bold text-slate-500">
            Cargar Más ({filteredOccasions.length - visibleCount})
          </Button>
        )}
      </div>
    </div>
  );
}
