"use client";

import type { Praise } from '@/lib/praises';
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

interface PraiseListClientProps {
  praises: Praise[];
}

export function PraiseListClient({ praises }: PraiseListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPraises = useMemo(() => {
    let listToFilter = praises;

    if (activeTab === 'rapidos') {
      listToFilter = praises.filter(praise => praise.speed === 'Rapido');
    } else if (activeTab === 'lentos') {
      listToFilter = praises.filter(praise => praise.speed === 'Lento');
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
  }, [searchTerm, praises, activeTab]);

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
        <SimplePraiseRoll praises={filteredPraises} />
      ) : (
        <GroupedPraiseRoll praises={filteredPraises} />
      )}
    </div>
  );
}

function SimplePraiseRoll({ praises }: { praises: Praise[] }) {
  if (praises.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas para mostrar.</p>
        <p className="text-sm">Prueba a cambiar los filtros o agrega una alabanza nueva.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
        <div className="flex flex-col">
        {praises.map((praise) => (
            <Link
                href={`/praises/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-4 p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <span className="font-medium truncate">{praise.title}</span>
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

function GroupedPraiseRoll({ praises }: { praises: Praise[] }) {
  const groupedPraises = useMemo(() => {
    const groups: Record<string, Praise[]> = {};

    praises.forEach(praise => {
      const tone = praise.tone || 'Tonalidad no especificada';
      if (!groups[tone]) {
        groups[tone] = [];
      }
      groups[tone].push(praise);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Tonalidad no especificada') return 1;
        if (b === 'Tonalidad no especificada') return -1;
        return a.localeCompare(b);
      })
      .map(tone => ({
        tone,
        praises: groups[tone],
      }));
  }, [praises]);

  if (praises.length === 0) {
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
            {groupedPraises.map(({ tone, praises: praiseList }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary">{praiseList.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {praiseList.map((praise) => (
                                <Link
                                    href={`/praises/${praise.id}`}
                                    key={praise.id}
                                    className="flex items-center gap-4 p-3 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                                        <span className="font-medium truncate">{praise.title}</span>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {praise.speed && <Badge variant="outline" className="capitalize hidden sm:inline-flex">{praise.speed}</Badge>}
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
