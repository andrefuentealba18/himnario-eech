"use client";

import type { Choir } from '@/lib/choirs';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { normalizeSearchTerm } from '@/lib/utils';

interface ChoirListClientProps {
  choirs: Choir[];
}

export function ChoirListClient({ choirs }: ChoirListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('rapidos');

  const filteredChoirs = useMemo(() => {
    let listToFilter: Choir[];

    if (activeTab === 'lentos') {
      listToFilter = choirs.filter(choir => choir.speed === 'Lento');
    } else { // Default to 'rapidos'
      listToFilter = choirs.filter(choir => choir.speed === 'Rapido');
    }

    const normalizedSearch = normalizeSearchTerm(searchTerm);

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(choir => {
        const normalizedTitle = normalizeSearchTerm(choir.title);
        const normalizedLyrics = normalizeSearchTerm(choir.lyrics);
        const normalizedTone = choir.tone ? normalizeSearchTerm(choir.tone) : '';
        
        return (
            normalizedTitle.includes(normalizedSearch) ||
            normalizedLyrics.includes(normalizedSearch) ||
            normalizedTone.includes(normalizedSearch)
        );
    });
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
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="rapidos">Rápidos</TabsTrigger>
          <TabsTrigger value="lentos">Lentos</TabsTrigger>
        </TabsList>
      </Tabs>

      <ChoirRoll choirs={filteredChoirs} />
    </div>
  );
}

function ChoirRoll({ choirs }: { choirs: Choir[] }) {
  const groupedChoirs = useMemo(() => {
    const groups: Record<string, Choir[]> = {};

    choirs.forEach(choir => {
      const tone = choir.tone || 'Tonalidad no especificada';
      if (!groups[tone]) {
        groups[tone] = [];
      }
      groups[tone].push(choir);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Tonalidad no especificada') return 1;
        if (b === 'Tonalidad no especificada') return -1;
        return a.localeCompare(b);
      })
      .map(tone => ({
        tone,
        choirs: groups[tone],
      }));
  }, [choirs]);

  if (choirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay coros para mostrar.</p>
        <p className="text-sm">Prueba a cambiar los filtros o agrega un coro nuevo.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
        <Accordion type="multiple" className="w-full">
            {groupedChoirs.map(({ tone, choirs: choirList }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary">{choirList.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {choirList.map((choir) => (
                                <Link
                                    href={`/choirs/${choir.id}`}
                                    key={choir.id}
                                    className="flex items-center gap-4 p-3 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                                        <span className="font-medium truncate">{choir.title}</span>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {choir.speed && <Badge variant="outline" className="capitalize hidden sm:inline-flex">{choir.speed}</Badge>}
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
