"use client";

import { useToast } from '@/hooks/use-toast';
import { useHymns } from '@/context/hymns-context';
import type { Hymn } from '@/lib/hymns';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Plus, ChevronDown, ZoomOut, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddHymnDialog } from '@/components/add-hymn-dialog';
import { AddSingleHymnDialog } from '@/components/add-single-hymn-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useFontSize } from '@/hooks/use-font-size';


const listFontSizes = [
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
];

export default function HymnsIndexPage() {
  const { hymns, addHymn, addHymns: addMultipleHymns, isLoaded } = useHymns();
  const { toast } = useToast();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(listFontSizes.length, 1);

  const handleAddHymns = (newHymns: Hymn[]): { addedCount: number, duplicates: number } => {
    return addMultipleHymns(newHymns);
  };
  
  const handleAddSingleHymn = (newHymn: Hymn): boolean => {
    const success = addHymn(newHymn);
    if(!success){
        toast({
            variant: 'destructive',
            title: 'Error al agregar',
            description: `El himno número ${newHymn.number} ya existe.`,
        });
    }
    return success;
  }


  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-center relative h-14">
            <Button variant="ghost" size="icon" asChild className="absolute left-2 top-1/2 -translate-y-1/2">
                <Link href="/">
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Volver</span>
                </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-headline text-foreground">
                Himnos
              </h1>
              <Badge variant="secondary" className="text-base font-semibold px-2">
                {hymns.length}
              </Badge>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <AddSingleHymnDialog onHymnAdded={handleAddSingleHymn}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Agregar un himno
                      </DropdownMenuItem>
                    </AddSingleHymnDialog>
                     <AddHymnDialog onHymnsAdded={handleAddHymns}>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Agregar varios himnos
                       </DropdownMenuItem>
                     </AddHymnDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          {isLoaded ? <HymnListClient hymns={hymns} /> : <p>Cargando himnos...</p>}
        </div>

        <footer className="sticky bottom-0 z-10 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm p-4 border-t">
           <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-14 w-14">
             <ZoomOut className="h-7 w-7" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === listFontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
        </footer>
      </div>
    </main>
  );
}
