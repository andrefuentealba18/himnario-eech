"use client";

import type { Hymn } from '@/lib/hymns';
import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import { Search, Star, List, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { normalizeSearchTerm, formatForOpenLP } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HymnListClientProps {
  hymns: Hymn[];
}

const isNewSong = (createdAt: any) => {
  if (!createdAt) return false;
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 1;
};

export function HymnListClient({ hymns }: HymnListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const { favorites, isLoaded } = useFavorites();

  const indexedHymns = useMemo(() => {
    return hymns.map(h => ({
      ...h,
      _searchIndex: normalizeSearchTerm(`${h.title} ${h.number} ${h.lyrics} ${h.tone || ''}`)
    }));
  }, [hymns]);

  const filteredHymns = useMemo(() => {
    const term = deferredSearchTerm.trim();
    const normalizedSearch = normalizeSearchTerm(term);
    
    let listToFilter = indexedHymns;
    if (activeTab === 'favorites') {
      if (!isLoaded) return [];
      listToFilter = indexedHymns.filter(hymn => {
        return favorites.some(f => f.id === hymn.number && f.type === 'hymn');
      });
    }

    if (!normalizedSearch) {
      return listToFilter;
    }

    return listToFilter.filter(hymn => hymn._searchIndex.includes(normalizedSearch));
  }, [deferredSearchTerm, indexedHymns, activeTab, favorites, isLoaded]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por número, título o letra..."
          className="pl-10 w-full h-11 rounded-xl"
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
        <TabsContent value="all" className="mt-0">
          <HymnRoll hymns={filteredHymns} />
        </TabsContent>
        <TabsContent value="favorites" className="mt-0">
          {isLoaded && filteredHymns.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <p className="font-bold">No tienes favoritos aún</p>
              <p className="text-[10px] uppercase tracking-widest mt-2">Toca la estrella en un himno</p>
            </div>
          ) : (
            <HymnRoll hymns={filteredHymns} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HymnRoll({ hymns }: { hymns: (Hymn & { _searchIndex?: string })[] }) {
  const { toast } = useToast();
  if (hymns.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        <p className="text-xs uppercase font-black tracking-widest">No se hallaron resultados</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-14rem)] pr-2">
        <div className="flex flex-col pb-10">
        {hymns.map((hymn) => (
            <Link
                href={`/hymns/${hymn.number}`}
                key={hymn.number}
                className="flex items-center gap-3 p-3 border-b transition-colors hover:bg-muted/50 rounded-lg group"
            >
                <span className="font-black text-primary w-7 text-center text-xs opacity-60 group-hover:opacity-100">{hymn.number}</span>
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-[13px] text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">{hymn.title}</span>
                      {isNewSong(hymn.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[8px] py-0 px-1.5 h-4 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    {hymn.tone && <Badge variant="outline" className="flex-shrink-0 text-[9px] h-5 px-1.5 font-bold border-primary/20 text-primary bg-primary/5">{hymn.tone}</Badge>}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const formatted = formatForOpenLP(hymn.lyrics);
                        navigator.clipboard.writeText(formatted);
                        toast({ title: "OpenLP Copiado", description: `"${hymn.title}" copiado para OpenLP.` });
                      }}
                      className="ml-1 p-1.5 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors"
                      title="Copiar para OpenLP"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}