
"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { normalizeSearchTerm } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [activeTab, setActiveTab] = useState('all');

  const filteredYouthChoirs = useMemo(() => {
    let listToFilter = youthChoirs;

    if (activeTab === 'rapidos') {
      listToFilter = youthChoirs.filter(yc => yc.speed === 'Rapido');
    } else if (activeTab === 'lentos') {
      listToFilter = youthChoirs.filter(yc => yc.speed === 'Lento');
    }

    const normalizedSearch = normalizeSearchTerm(searchTerm);

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(praise => {
        const normalizedTitle = normalizeSearchTerm(praise.title);
        const normalizedLyrics = normalizeSearchTerm(praise.lyrics);
        const normalizedTone = praise.tone ? normalizeSearchTerm(praise.tone) : '';

        return (
          normalizedTitle.includes(normalizedSearch) ||
          normalizedLyrics.includes(normalizedSearch) ||
          normalizedTone.includes(normalizedSearch)
        );
    });
  }, [searchTerm, youthChoirs, activeTab]);

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
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Todos</TabsTrigger>
          <TabsTrigger value="rapidos" className="data-[state=active]:bg-chart-1 data-[state=active]:text-white">Rápidos</TabsTrigger>
          <TabsTrigger value="lentos" className="data-[state=active]:bg-chart-2 data-[state=active]:text-white">Lentos</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'all' ? (
        <SimpleYouthChoirRoll youthChoirs={filteredYouthChoirs} />
      ) : (
        <GroupedYouthChoirRoll youthChoirs={filteredYouthChoirs} />
      )}
    </div>
  );
}

function SimpleYouthChoirRoll({ youthChoirs }: { youthChoirs: YouthChoir[] }) {
  if (youthChoirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas guardadas.</p>
        <p className="text-sm">Toca en "Agregar Alabanza" para empezar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
        <div className="flex flex-col">
        {youthChoirs.map((praise) => (
            <Link
                href={`/youth-choirs/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-4 p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-medium truncate">{praise.title}</span>
                      {isNewSong(praise.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[10px] py-0 px-1.5 h-5 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {praise.speed && <Badge variant="outline" className="capitalize">{praise.speed}</Badge>}
                        {praise.tone && <Badge variant="outline">{praise.tone}</Badge>}
                    </div>
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}

function GroupedYouthChoirRoll({ youthChoirs }: { youthChoirs: YouthChoir[] }) {
  const grouped = useMemo(() => {
    const groups: Record<string, YouthChoir[]> = {};

    youthChoirs.forEach(yc => {
      const tone = yc.tone || 'Tonalidad no especificada';
      if (!groups[tone]) {
        groups[tone] = [];
      }
      groups[tone].push(yc);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Tonalidad no especificada') return 1;
        if (b === 'Tonalidad no especificada') return -1;
        return a.localeCompare(b);
      })
      .map(tone => ({
        tone,
        songs: groups[tone],
      }));
  }, [youthChoirs]);

  if (youthChoirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas para mostrar.</p>
        <p className="text-sm">Prueba a cambiar los filtros o agrega una alabanza nueva.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
        <Accordion type="multiple" className="w-full">
            {grouped.map(({ tone, songs }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary">{songs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {songs.map((yc) => (
                                <Link
                                    href={`/youth-choirs/${yc.id}`}
                                    key={yc.id}
                                    className="flex items-center gap-4 p-3 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <span className="font-medium truncate">{yc.title}</span>
                                          {isNewSong(yc.createdAt) && (
                                            <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[10px] py-0 px-1.5 h-5 flex-shrink-0">NEW</Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {yc.speed && <Badge variant="outline" className="capitalize hidden sm:inline-flex">{yc.speed}</Badge>}
                                        </div>
                                    </div>
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
