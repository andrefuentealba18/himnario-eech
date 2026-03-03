"use client";

import type { Hymn } from '@/lib/hymns';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import { Search, Star, List } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { normalizeSearchTerm } from '@/lib/utils';

interface HymnListClientProps {
  hymns: Hymn[];
}

const isNewSong = (createdAt: any) => {
  if (!createdAt) return false;
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
};

export function HymnListClient({ hymns }: HymnListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { favorites, isLoaded } = useFavorites();

  const filteredHymns = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    
    let listToFilter = hymns;
    if (activeTab === 'favorites') {
      if (!isLoaded) return [];
      listToFilter = hymns.filter(hymn => favorites.has(hymn.number));
    }

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(hymn => {
        const normalizedTitle = normalizeSearchTerm(hymn.title);
        const normalizedLyrics = normalizeSearchTerm(hymn.lyrics);
        const normalizedTone = hymn.tone ? normalizeSearchTerm(hymn.tone) : '';
        
        return (
            normalizedTitle.includes(normalizedSearch) ||
            hymn.number.toString().includes(normalizedSearch) ||
            normalizedLyrics.includes(normalizedSearch) ||
            normalizedTone.includes(normalizedSearch)
        );
    });
  }, [searchTerm, hymns, activeTab, favorites, isLoaded]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por número, título, letra o nota..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            <List className="mr-2 h-4 w-4" />
            Índice
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" />
            Favoritos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <HymnRoll hymns={filteredHymns} />
        </TabsContent>
        <TabsContent value="favorites">
          {isLoaded && filteredHymns.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No tienes himnos favoritos.</p>
              <p className="text-sm">Toca la estrella en un himno para agregarlo.</p>
            </div>
          ) : (
            <HymnRoll hymns={filteredHymns} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HymnRoll({ hymns }: { hymns: Hymn[] }) {
  if (hymns.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No se encontraron himnos.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
        <div className="flex flex-col">
        {hymns.map((hymn) => (
            <Link
                href={`/hymns/${hymn.number}`}
                key={hymn.number}
                className="flex items-center gap-4 p-3 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <span className="font-bold text-primary w-8 text-center">{hymn.number}</span>
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-medium truncate">{hymn.title}</span>
                      {isNewSong(hymn.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[10px] py-0 px-1.5 h-5 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    {hymn.tone && <Badge variant="outline" className="flex-shrink-0">{hymn.tone}</Badge>}
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}
