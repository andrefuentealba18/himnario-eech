'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { normalizeSearchTerm } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Book, Users, Mic, Search, Loader2 } from 'lucide-react';

type Song = {
  id: string | number;
  title: string;
  lyrics: string;
  tone?: string;
  number?: number;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir';
};

const categoryIcons = {
  hymn: <Book className="h-5 w-5 text-muted-foreground" />,
  praise: <Music className="h-5 w-5 text-muted-foreground" />,
  choir: <Mic className="h-5 w-5 text-muted-foreground" />,
  'youth-choir': <Users className="h-5 w-5 text-muted-foreground" />,
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
  const [isOpen, setIsOpen] = useState(false);

  const { hymns, isLoaded: hymnsLoaded } = useHymns();
  const { praises, isLoaded: praisesLoaded } = usePraises();
  const { choirs, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, isLoaded: youthChoirsLoaded } = useYouthChoirs();

  const isLoaded = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const allSongs: Song[] = useMemo(() => {
    if (!isLoaded) return [];
    return [
      ...hymns.map(h => ({ ...h, id: h.number, type: 'hymn' as const })),
      ...praises.map(p => ({ ...p, type: 'praise' as const })),
      ...choirs.map(c => ({ ...c, type: 'choir' as const })),
      ...youthChoirs.map(yc => ({ ...yc, type: 'youth-choir' as const }))
    ];
  }, [hymns, praises, choirs, youthChoirs, isLoaded]);

  const filteredSongs = useMemo(() => {
    if (!searchTerm) return [];

    const normalizedSearch = normalizeSearchTerm(searchTerm);
    if (normalizedSearch.length < 2) return [];

    return allSongs.filter(song => {
      const normalizedTitle = normalizeSearchTerm(song.title);
      const normalizedLyrics = normalizeSearchTerm(song.lyrics);
      const normalizedTone = song.tone ? normalizeSearchTerm(song.tone) : '';
      
      return (
        normalizedTitle.includes(normalizedSearch) ||
        (song.number && song.number.toString().includes(normalizedSearch)) ||
        normalizedLyrics.includes(normalizedSearch) ||
        normalizedTone.includes(normalizedSearch)
      );
    }).slice(0, 50); // Limit results to avoid performance issues
  }, [searchTerm, allSongs]);

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
                        placeholder="Buscar himnos, coros, alabanzas..."
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
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium truncate">{song.title}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{song.type === 'hymn' ? `Himno #${song.number}` : song.type.replace('-', ' ')}</p>
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
