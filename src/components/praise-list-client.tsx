"use client";

import type { Praise } from '@/lib/praises';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PraiseListClientProps {
  praises: Praise[];
}

export function PraiseListClient({ praises }: PraiseListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPraises = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (!lowercasedSearchTerm) {
      return praises;
    }

    return praises.filter(praise =>
      praise.title.toLowerCase().includes(lowercasedSearchTerm) ||
      praise.lyrics.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, praises]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título o letra..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <PraiseRoll praises={filteredPraises} />
    </div>
  );
}

function PraiseRoll({ praises }: { praises: Praise[] }) {
  if (praises.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No hay alabanzas guardadas.</p>
        <p className="text-sm">Toca en "Agregar Alabanza" para empezar.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="flex flex-col">
        {praises.map((praise) => (
            <Link
                href={`/praises/${praise.id}`}
                key={praise.id}
                className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/50 rounded-lg"
            >
                <span className="flex-1 font-medium">{praise.title}</span>
            </Link>
        ))}
        </div>
    </ScrollArea>
  );
}
