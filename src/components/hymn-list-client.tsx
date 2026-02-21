"use client";

import type { Hymn } from '@/lib/hymns';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import { Search, Star, List } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HymnListClientProps {
  hymns: Hymn[];
}

export function HymnListClient({ hymns }: HymnListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { favorites, isLoaded } = useFavorites();

  const filteredHymns = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    let listToFilter = hymns;
    if (activeTab === 'favorites') {
      if (!isLoaded) return [];
      listToFilter = hymns.filter(hymn => favorites.has(hymn.number));
    }

    if (!lowercasedSearchTerm) {
      return listToFilter;
    }

    return listToFilter.filter(hymn =>
      hymn.title.toLowerCase().includes(lowercasedSearchTerm) ||
      hymn.number.toString().includes(lowercasedSearchTerm) ||
      hymn.lyrics.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, hymns, activeTab, favorites, isLoaded]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por número, título o letra..."
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
    <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="flex flex-col">
        {hymns.map((hymn) => (
            <Link
                href={`/hymns/${hymn.number}`}
                key={hymn.number}
                className="flex items-center gap-4 p-3 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <span className="font-bold text-primary w-8 text-center">{hymn.number}</span>
                <span className="flex-1 font-medium">{hymn.title}</span>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}
