"use client";

import type { Choir } from '@/lib/choirs';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChoirListClientProps {
  choirs: Choir[];
}

export function ChoirListClient({ choirs }: ChoirListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredChoirs = useMemo(() => {
    let listToFilter = choirs;

    // Filter by tab
    if (activeTab === 'rapidos') {
      listToFilter = choirs.filter(choir => choir.speed === 'Rapido');
    } else if (activeTab === 'lentos') {
      listToFilter = choirs.filter(choir => choir.speed === 'Lento');
    } else if (activeTab === 'mayores') {
      listToFilter = choirs.filter(choir => choir.tone && choir.tone.includes('Mayor'));
    } else if (activeTab === 'menores') {
      listToFilter = choirs.filter(choir => choir.tone && choir.tone.includes('menor'));
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (!lowercasedSearchTerm) {
      return listToFilter;
    }

    return listToFilter.filter(choir =>
      choir.title.toLowerCase().includes(lowercasedSearchTerm) ||
      choir.lyrics.toLowerCase().includes(lowercasedSearchTerm) ||
      (choir.tone && choir.tone.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [searchTerm, choirs, activeTab]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título, letra o nota..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="rapidos">Rápidos</TabsTrigger>
          <TabsTrigger value="lentos">Lentos</TabsTrigger>
          <TabsTrigger value="mayores">Mayores</TabsTrigger>
          <TabsTrigger value="menores">Menores</TabsTrigger>
        </TabsList>
      </Tabs>

      <ChoirRoll choirs={filteredChoirs} />
    </div>
  );
}

function ChoirRoll({ choirs }: { choirs: Choir[] }) {
  if (choirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay coros para mostrar.</p>
        <p className="text-sm">Prueba a cambiar los filtros o agrega un coro nuevo.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
        <div className="flex flex-col">
        {choirs.map((choir) => (
            <Link
                href={`/choirs/${choir.id}`}
                key={choir.id}
                className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <span className="font-medium truncate">{choir.title}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {choir.speed && <Badge variant="secondary" className="capitalize hidden sm:inline-flex">{choir.speed}</Badge>}
                      {choir.tone && <Badge variant="outline">{choir.tone}</Badge>}
                    </div>
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}

    