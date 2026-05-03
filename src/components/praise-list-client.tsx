"use client";

import type { Praise } from '@/lib/praises';
import { useState, useMemo, useDeferredValue, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, List, Star, FileText } from 'lucide-react';
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
import { normalizeSearchTerm, formatForOpenLP } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PraiseListClientProps {
  praises: Praise[];
}

const isNewSong = (createdAt: any) => {
  if (!createdAt) return false;
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
};

export function PraiseListClient({ praises }: PraiseListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const [filterTab, setFilterTab] = useState('all');
  const { isFavorite } = useFavorites();

  const indexedPraises = useMemo(() => {
    return praises.map(p => ({
      ...p,
      _searchIndex: normalizeSearchTerm(`${p.title} ${p.lyrics} ${p.tone || ''}`)
    }));
  }, [praises]);

  const filteredPraises = useMemo(() => {
    let listToFilter = indexedPraises;

    if (activeTab === 'favorites') {
      listToFilter = indexedPraises.filter(p => isFavorite(p.id, 'praise'));
    }

    if (filterTab === 'rapidos') {
      listToFilter = listToFilter.filter(praise => praise.speed === 'Rapido');
    } else if (filterTab === 'lentos') {
      listToFilter = listToFilter.filter(praise => praise.speed === 'Lento');
    }

    const term = deferredSearchTerm.trim();
    const normalizedSearch = normalizeSearchTerm(term);

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(praise => praise._searchIndex?.includes(normalizedSearch));
  }, [deferredSearchTerm, indexedPraises, activeTab, filterTab, isFavorite]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título o letra..."
          className="pl-10 w-full h-11 rounded-xl"
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
        <SimplePraiseRoll praises={filteredPraises} />
      ) : (
        <GroupedPraiseRoll praises={filteredPraises} />
      )}
    </div>
  );
}
function SimplePraiseRoll({ praises }: { praises: (Praise & { _searchIndex?: string })[] }) {
  const [visibleCount, setVisibleCount] = useState(50);
  const { toast } = useToast();

  useEffect(() => {
    setVisibleCount(50);
  }, [praises]);

  if (praises.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas para mostrar.</p>
      </div>
    );
  }

  const visiblePraises = praises.slice(0, visibleCount);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="flex flex-col pb-8">
        {visiblePraises.map((praise) => (
            <Link
                href={`/praises/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-3 p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-[13px] text-slate-700 dark:text-slate-200 truncate">{praise.title}</span>
                      {isNewSong(praise.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[8px] py-0 px-1 h-4 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 scale-90">
                        {praise.speed && <Badge variant="outline" className="capitalize text-[8px] font-bold">{praise.speed}</Badge>}
                        {praise.tone && <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary">{praise.tone}</Badge>}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const formatted = formatForOpenLP(praise.lyrics);
                            navigator.clipboard.writeText(formatted);
                            toast({ title: "OpenLP Copiado", description: `"${praise.title}" copiado para OpenLP.` });
                          }}
                          className="ml-1 p-1.5 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors"
                          title="Copiar para OpenLP"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Link>
        ))}
        {visibleCount < praises.length && (
          <div className="py-6 flex justify-center">
            <button 
              onClick={() => setVisibleCount(v => v + 50)} 
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border-none shadow-sm"
            >
              Cargar Más ({praises.length - visibleCount})
            </button>
          </div>
        )}
        </div>
    </ScrollArea>
  );
}

function GroupedPraiseRoll({ praises }: { praises: (Praise & { _searchIndex?: string })[] }) {
  const { toast } = useToast();
  const groupedPraises = useMemo(() => {
    const groups: Record<string, typeof praises> = {};
    praises.forEach(praise => {
      const tone = praise.tone || 'Tonalidad no especificada';
      if (!groups[tone]) groups[tone] = [];
      groups[tone].push(praise);
    });
    return Object.keys(groups).sort().map(tone => ({ tone, praises: groups[tone] }));
  }, [praises]);

  if (praises.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas para mostrar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <Accordion type="multiple" className="w-full">
            {groupedPraises.map(({ tone, praises: praiseList }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary" className="text-[10px]">{praiseList.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {praiseList.map((praise) => (
                                <Link
                                    href={`/praises/${praise.id}`}
                                    key={praise.id}
                                    className="flex justify-between items-center gap-4 p-2 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">{praise.title}</span>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const formatted = formatForOpenLP(praise.lyrics);
                                        navigator.clipboard.writeText(formatted);
                                        toast({ title: "OpenLP Copiado", description: `"${praise.title}" copiado para OpenLP.` });
                                      }}
                                      className="p-1.5 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors"
                                      title="Copiar para OpenLP"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
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
