"use client";

import type { Choir } from '@/lib/choirs';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ChoirListClientProps {
  choirs: Choir[];
}

export function ChoirListClient({ choirs }: ChoirListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChoirs = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (!lowercasedSearchTerm) {
      return choirs;
    }

    return choirs.filter(choir =>
      choir.title.toLowerCase().includes(lowercasedSearchTerm) ||
      choir.lyrics.toLowerCase().includes(lowercasedSearchTerm) ||
      (choir.tone && choir.tone.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [searchTerm, choirs]);

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
      <ChoirRoll choirs={filteredChoirs} />
    </div>
  );
}

function ChoirRoll({ choirs }: { choirs: Choir[] }) {
  if (choirs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay coros guardados.</p>
        <p className="text-sm">Toca en "Agregar Coro" para empezar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="flex flex-col">
        {choirs.map((choir) => (
            <Link
                href={`/choirs/${choir.id}`}
                key={choir.id}
                className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <div className="flex-1 flex justify-between items-center gap-2 overflow-hidden">
                    <span className="font-medium truncate">{choir.title}</span>
                    {choir.tone && <Badge variant="outline" className="flex-shrink-0">{choir.tone}</Badge>}
                </div>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}

    