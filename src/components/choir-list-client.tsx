"use client";

import type { Choir } from '@/lib/choirs';
import { useState, useMemo, useDeferredValue } from 'react';
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

interface ChoirListClientProps {
  choirs: Choir[];
}

const isNewSong = (createdAt: any) => {
  if (!createdAt) return false;
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 1;
};

export function ChoirListClient({ choirs }: ChoirListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const [filterTab, setFilterTab] = useState('all');
  const { isFavorite } = useFavorites();

  const indexedChoirs = useMemo(() => {
    return choirs.map(c => ({
      ...c,
      _searchIndex: normalizeSearchTerm(`${c.title} ${c.lyrics} ${c.tone || ''}`)
    }));
  }, [choirs]);

  const filteredChoirs = useMemo(() => {
    let listToFilter = indexedChoirs;

    if (activeTab === 'favorites') {
      listToFilter = indexedChoirs.filter(c => isFavorite(c.id, 'choir'));
    }

    if (filterTab === 'rapidos') {
      listToFilter = listToFilter.filter(choir => choir.speed === 'Rapido');
    } else if (filterTab === 'lentos') {
      listToFilter = listToFilter.filter(choir => choir.speed === 'Lento');
    }

    const term = deferredSearchTerm.trim();
    const normalizedSearch = normalizeSearchTerm(term);

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(choir => choir._searchIndex?.includes(normalizedSearch));
  }, [deferredSearchTerm, indexedChoirs, activeTab, filterTab, isFavorite]);

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
          <TabsTrigger value="rapidos">Avivamiento</TabsTrigger>
          <TabsTrigger value="lentos">Meditación</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filterTab === 'all' ? (
        <SimpleChoirRoll choirs={filteredChoirs} />
      ) : (
        <GroupedChoirRoll choirs={filteredChoirs} />
      )}
    </div>
  );
}

function SimpleChoirRoll({ choirs }: { choirs: (Choir & { _searchIndex?: string })[] }) {
  const { toast } = useToast();
  if (choirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay coros para mostrar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="flex flex-col">
        {choirs.map((choir) => (
            <Link
                href={`/choirs/${choir.id}`}
                key={choir.id}
                className="flex items-center gap-3 p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-[13px] text-slate-700 dark:text-slate-200 truncate">{choir.title}</span>
                      {isNewSong(choir.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[8px] py-0 px-1 h-4 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 scale-90">
                        {choir.speed && <Badge variant="outline" className="capitalize text-[8px] font-bold">{choir.speed === 'Rapido' ? 'Aviv.' : 'Medit.'}</Badge>}
                        {choir.tone && <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary">{choir.tone}</Badge>}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const formatted = formatForOpenLP(choir.lyrics);
                            navigator.clipboard.writeText(formatted);
                            toast({ title: "OpenLP Copiado", description: `"${choir.title}" copiado para OpenLP.` });
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
        </div>
    </ScrollArea>
  );
}

function GroupedChoirRoll({ choirs }: { choirs: (Choir & { _searchIndex?: string })[] }) {
  const { toast } = useToast();
  const groupedChoirs = useMemo(() => {
    const groups: Record<string, typeof choirs> = {};
    choirs.forEach(choir => {
      const tone = choir.tone || 'Tonalidad no especificada';
      if (!groups[tone]) groups[tone] = [];
      groups[tone].push(choir);
    });
    return Object.keys(groups).sort().map(tone => ({ tone, choirs: groups[tone] }));
  }, [choirs]);

  if (choirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay coros para mostrar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <Accordion type="multiple" className="w-full">
            {groupedChoirs.map(({ tone, choirs: choirList }) => (
                <AccordionItem value={tone} key={tone}>
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                           {tone}
                           <Badge variant="secondary" className="text-[10px]">{choirList.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col pt-2">
                            {choirList.map((choir) => (
                                <Link
                                    href={`/choirs/${choir.id}`}
                                    key={choir.id}
                                    className="flex items-center gap-4 p-2 -mx-2 border-b last:border-b-0 transition-colors hover:bg-muted/50 rounded-lg"
                                >
                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">{choir.title}</span>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const formatted = formatForOpenLP(choir.lyrics);
                                        navigator.clipboard.writeText(formatted);
                                        toast({ title: "OpenLP Copiado", description: `"${choir.title}" copiado para OpenLP.` });
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
