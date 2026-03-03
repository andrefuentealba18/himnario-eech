"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

  const filteredYouthChoirs = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(searchTerm);

    if (!normalizedSearch) {
      return youthChoirs;
    }

    return youthChoirs.filter(praise => {
        const normalizedTitle = normalizeSearchTerm(praise.title);
        const normalizedLyrics = normalizeSearchTerm(praise.lyrics);
        const normalizedTone = praise.tone ? normalizeSearchTerm(praise.tone) : '';

        return (
          normalizedTitle.includes(normalizedSearch) ||
          normalizedLyrics.includes(normalizedSearch) ||
          normalizedTone.includes(normalizedSearch)
        );
    });
  }, [searchTerm, youthChoirs]);

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
      <YouthChoirRoll youthChoirs={filteredYouthChoirs} />
    </div>
  );
}

function YouthChoirRoll({ youthChoirs }: { youthChoirs: YouthChoir[] }) {
  if (youthChoirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas guardadas.</p>
        <p className="text-sm">Toca en "Agregar Alabanza" para empezar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="flex flex-col">
        {youthChoirs.map((praise) => (
            <Link
                href={`/youth-choirs/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-medium truncate">{praise.title}</span>
                      {isNewSong(praise.createdAt) && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white border-none text-[10px] py-0 px-1.5 h-5 flex-shrink-0">NEW</Badge>
                      )}
                    </div>
                    {praise.tone && <Badge variant="outline" className="flex-shrink-0">{praise.tone}</Badge>}
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}
