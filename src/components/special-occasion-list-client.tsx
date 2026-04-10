
"use client";

import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, Star, List, Mic, Cross, Gift, Droplets, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import { normalizeSearchTerm } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SpecialOccasionListClientProps {
  specialOccasions: SpecialOccasion[];
  activeCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

const categoryConfig: Record<SpecialCategory, { icon: any, color: string, iconColor: string }> = {
  "Predicación": { icon: Mic, color: "bg-blue-50", iconColor: "text-blue-600" },
  "Fúnebre": { icon: Cross, color: "bg-slate-50", iconColor: "text-slate-600" },
  "Cumpleaños": { icon: Gift, color: "bg-rose-50", iconColor: "text-rose-600" },
  "Bautismos": { icon: Droplets, color: "bg-cyan-50", iconColor: "text-cyan-600" },
};

export function SpecialOccasionListClient({ specialOccasions, activeCategory, onSelectCategory }: SpecialOccasionListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState('all');
  const { isFavorite } = useFavorites();

  const categories: SpecialCategory[] = ["Predicación", "Fúnebre", "Cumpleaños", "Bautismos"];

  const indexedSongs = useMemo(() => {
    return specialOccasions.map(s => ({
      ...s,
      _searchIndex: normalizeSearchTerm(`${s.title} ${s.lyrics} ${s.tone || ''} ${s.category}`)
    }));
  }, [specialOccasions]);

  const filteredSongs = useMemo(() => {
    let list = indexedSongs;

    if (activeTab === 'favorites') {
      list = indexedSongs.filter(s => isFavorite(s.id, 'special-occasion'));
    }

    if (activeCategory) {
      list = list.filter(s => s.category === activeCategory);
    }

    const term = normalizeSearchTerm(deferredSearchTerm.trim());
    if (!term) return list;

    return list.filter(s => s._searchIndex.includes(term));
  }, [deferredSearchTerm, indexedSongs, activeTab, isFavorite, activeCategory]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    specialOccasions.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [specialOccasions]);

  if (!activeCategory && !searchTerm) {
    return (
      <div className="grid grid-cols-2 gap-4 py-4">
        {categories.map((cat) => {
          const config = categoryConfig[cat];
          return (
            <Card 
              key={cat}
              className="cursor-pointer border-slate-200/50 bg-white/40 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 active:scale-95 group app-card"
              onClick={() => onSelectCategory(cat)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner",
                  config.color
                )}>
                  <config.icon className={cn("h-8 w-8", config.iconColor)} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-[11px] text-slate-800 uppercase tracking-widest leading-tight">{cat}</h3>
                  <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0 h-5 bg-primary/5 text-primary border-primary/10">
                    {countsByCategory[cat] || 0} cantos
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar canto..."
          className="pl-10 w-full h-11 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="flex flex-col gap-1">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <Link
                key={song.id}
                href={`/special-occasions/${song.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border-b last:border-none"
              >
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-[13px] text-slate-700 dark:text-slate-200 truncate block">
                    {song.title}
                  </span>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{song.category}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {song.tone && <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-bold border-primary/20 text-primary">{song.tone}</Badge>}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>No se encontraron alabanzas especiales.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
