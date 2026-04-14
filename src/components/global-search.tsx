'use client';

import { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { useRouter } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { normalizeSearchTerm } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Book, Users, Mic, Search, Loader2, Library } from 'lucide-react';

type Song = {
  id: string | number;
  title: string;
  lyrics: string;
  tone?: string;
  number?: number;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir';
  groupLabel?: string;
  _searchIndex?: string;
};

const categoryIcons = {
  hymn: <Book className="h-5 w-5 text-muted-foreground" />,
  praise: <Music className="h-5 w-5 text-muted-foreground" />,
  choir: <Mic className="h-5 w-5 text-muted-foreground" />,
  'youth-choir': <Library className="h-5 w-5 text-muted-foreground" />,
};

const categoryLabels = {
  hymn: 'Himno',
  praise: 'Alabanza',
  choir: 'Coro',
  'youth-choir': 'Agrupación',
};

const categoryHrefs = {
    hymn: '/hymns/',
    praise: '/praises/',
    choir: '/choirs/',
    'youth-choir': '/youth-choirs/',
};

export function GlobalSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isOpen, setIsOpen] = useState(false);

  const { hymns, isLoaded: hymnsLoaded } = useHymns();
  const { praises, isLoaded: praisesLoaded } = usePraises();
  const { choirs, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, isLoaded: youthChoirsLoaded } = useYouthChoirs();

  const isLoaded = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded;

  // Pre-calcular el índice de búsqueda para cada canción una sola vez al cargar los datos
  const allSongs: Song[] = useMemo(() => {
    if (!isLoaded) return [];
    const base = [
      ...hymns.map(h => ({ ...h, id: h.number, type: 'hymn' as const })),
      ...praises.map(p => ({ ...p, type: 'praise' as const })),
      ...choirs.map(c => ({ ...c, type: 'choir' as const })),
      ...youthChoirs.map(yc => ({ ...yc, type: 'youth-choir' as const, groupLabel: yc.group }))
    ];

    return base.map(song => ({
      ...song,
      _searchIndex: normalizeSearchTerm(`${song.title} ${song.number || ''} ${song.lyrics} ${song.tone || ''} ${song.groupLabel || ''}`)
    }));
  }, [hymns, praises, choirs, youthChoirs, isLoaded]);

  const filteredSongs = useMemo(() => {
    const term = deferredSearchTerm.trim();
    if (term.length < 2) return [];

    const normalizedSearch = normalizeSearchTerm(term);
    return allSongs.filter(song => 
      song._searchIndex?.includes(normalizedSearch)
    ).slice(0, 50);
  }, [deferredSearchTerm, allSongs]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);
  
  const handleSelectSong = (song: Song) => {
    const href = `${categoryHrefs[song.type]}${song.id}`;
    router.push(href);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverAnchor>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    {isLoaded ? null : <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
                    <Input
                        type="search"
                        placeholder="Buscar por título o letra..."
                        className="pl-10 w-full text-base h-12 rounded-full shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!isLoaded}
                    />
                </div>
            </PopoverAnchor>
            <PopoverContent 
                className="w-[--radix-popover-trigger-width] p-0" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <ScrollArea className="h-auto max-h-80">
                    <div className="p-2">
                        {filteredSongs.length > 0 ? (
                            filteredSongs.map(song => (
                                <div
                                    key={`${song.type}-${song.id}`}
                                    className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-accent"
                                    onClick={() => handleSelectSong(song)}
                                >
                                    {categoryIcons[song.type]}
                                    <div className="flex-1 overflow-hidden text-left">
                                        <p className="font-medium truncate">{song.title}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                          {song.type === 'hymn' ? `Himno #${song.number}` : song.groupLabel || categoryLabels[song.type]}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-muted-foreground p-4">
                                {searchTerm.length > 1 ? "No se encontraron resultados." : "Escribe para buscar..."}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    </div>
  );
}
