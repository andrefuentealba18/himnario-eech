
"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, List, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { normalizeSearchTerm } from '@/lib/utils';

interface YouthChoirListClientProps {
  youthChoirs: YouthChoir[];
}

const isNewSong = (createdAt: any) => {
  if (!createdAt) return false;
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
};

export function YouthChoirListClient({ youthChoirs }: YouthChoirListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const [filterTab, setFilterTab] = useState('all');
  const { isFavorite } = useFavorites();

  const indexedYouthChoirs = useMemo(() => {
    return youthChoirs.map(yc => ({
      ...yc,
      _searchIndex: normalizeSearchTerm(`${yc.title} ${yc.lyrics} ${yc.tone || ''} ${yc.group}`)
    }));
  }, [youthChoirs]);

  const filteredYouthChoirs = useMemo(() => {
    let listToFilter = indexedYouthChoirs;

    if (activeTab === 'favorites') {
      listToFilter = indexedYouthChoirs.filter(yc => isFavorite(yc.id, 'youth-choir'));
    }

    if (filterTab === 'rapidos') {
      listToFilter = listToFilter.filter(yc => yc.speed === 'Rapido');
    } else if (filterTab === 'lentos') {
      listToFilter = listToFilter.filter(yc => yc.speed === 'Lento');
    }

    const term = deferredSearchTerm.trim();
    const normalizedSearch = normalizeSearchTerm(term);

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(yc => yc._searchIndex.includes(normalizedSearch));
  }, [deferredSearchTerm, indexedYouthChoirs, activeTab, filterTab, isFavorite]);

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            <List className="mr-2 h-4 w-4" />
            Todos
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" />
            Favoritos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={filterTab} onValueChange={setFilterTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto text-[10px]">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="rapidos">Rápidos</TabsTrigger>
          <TabsTrigger value="lentos">Lentos</TabsTrigger>
        </TabsList>
      </Tabs>

      {filterTab === 'all' ? (
        <SimpleYouthChoirRoll youthChoirs={filteredYouthChoirs} />
      ) : (
        <GroupedYouthChoirRoll youthChoirs={filteredYouthChoirs} />
      )}
    </div>
  );
}

function SimpleYouthChoirRoll({ youthChoirs }: { youthChoirs: (YouthChoir & { _searchIndex?: string })[] }) {
  if (youthChoirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas guardadas.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="flex flex-col">
        {youthChoirs.map((praise) => (
            <Link
                href={`/youth-choirs/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-4 p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-medium truncate text-sm">{praise.title}</span>
                      {isNewSong(praise.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[8px] py-0 px-1 h-4 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 scale-90">
                        {praise.speed && <Badge variant="outline" className="capitalize text-[8px]">{praise.speed}</Badge>}
                        {praise.tone && <Badge variant="outline" className="text-[8px]">{praise.tone}</Badge>}
                    </div>
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}

function GroupedYouthChoirRoll({ youthChoirs }: { youthChoirs: (YouthChoir & { _searchIndex?: string })[] }) {
  const grouped = useMemo(() => {
    const groups: Record<string, typeof youthChoirs> = {};
    youthChoirs.forEach(yc => {
      const tone = yc.tone || 'Tonalidad no especificada';
      if (!groups[tone]) groups[tone] = [];
      groups[tone].push(yc);
    });
    return Object.keys(groups).sort().map(tone => ({ tone, songs: groups[tone] }));
  }, [youthChoirs]);

  if (youthChoirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas para mostrar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <Accordion type="multiple" className="w-full">
            {grouped.map(({ tone, songs }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary" className="text-[10px]">{songs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {songs.map((yc) => (
                                <Link
                                    href={`/youth-choirs/${yc.id}`}
                                    key={yc.id}
                                    className="flex items-center gap-4 p-2 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <span className="text-xs font-medium truncate">{yc.title}</span>
                                </Link>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </ScrollArea>
  );
}
