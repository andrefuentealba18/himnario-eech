
"use client";

import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, Star, List } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { normalizeSearchTerm } from '@/lib/utils';

interface SpecialOccasionListClientProps {
  specialOccasions: SpecialOccasion[];
}

export function SpecialOccasionListClient({ specialOccasions }: SpecialOccasionListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const { isFavorite } = useFavorites();

  const categories: SpecialCategory[] = ["Bautismo", "Santa Cena", "Matrimonio", "Fúnebre", "Aniversario", "Campaña"];

  const indexedSongs = useMemo(() => {
    return specialOccasions.map(s => ({
      ...s,
      _searchIndex: normalizeSearchTerm(`${s.title} ${s.lyrics} ${s.tone || ''} ${s.category}`)
    }));
  }, [specialOccasions]);

  const filteredSongs = useMemo(() => {
    let list = indexedSongs;
    if (activeTab === 'favorites') {
      list = indexedSongs.filter(s => isFavorite(s.id, 'special-occasion' as any));
    }
    const term = normalizeSearchTerm(deferredSearchTerm.trim());
    if (!term) return list;
    return list.filter(s => s._searchIndex.includes(term));
  }, [deferredSearchTerm, indexedSongs, activeTab, isFavorite]);

  const groupedSongs = useMemo(() => {
    const groups: Record<string, typeof filteredSongs> = {};
    filteredSongs.forEach(song => {
      if (!groups[song.category]) groups[song.category] = [];
      groups[song.category].push(song);
    });
    return groups;
  }, [filteredSongs]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título, letra o categoría..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all"><List className="mr-2 h-4 w-4" /> Todos</TabsTrigger>
          <TabsTrigger value="favorites"><Star className="mr-2 h-4 w-4" /> Favoritos</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <Accordion type="multiple" defaultValue={categories} className="w-full">
          {categories.map(cat => {
            const songs = groupedSongs[cat] || [];
            if (songs.length === 0 && activeTab === 'all' && !searchTerm) return null;
            if (songs.length === 0 && (activeTab === 'favorites' || searchTerm)) return null;

            return (
              <AccordionItem value={cat} key={cat} className="border-none mb-2">
                <AccordionTrigger className="hover:no-underline p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-amber-600 dark:text-amber-400">{cat}</span>
                    <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700">{songs.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-1 pl-2">
                    {songs.map(song => (
                      <Link
                        key={song.id}
                        href={`/special-occasions/${song.id}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border-b last:border-none"
                      >
                        <span className="font-medium text-sm truncate">{song.title}</span>
                        {song.tone && <Badge variant="outline" className="text-[8px] h-4">{song.tone}</Badge>}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        {filteredSongs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No se encontraron alabanzas especiales.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
