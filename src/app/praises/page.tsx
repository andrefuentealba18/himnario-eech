"use client";

import { PraiseListClient } from '@/components/praise-list-client';
import { Music, ChevronLeft, Plus, ChevronDown, ZoomOut, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddSinglePraiseDialog } from '@/components/add-single-praise-dialog';
import { AddPraisesDialog } from '@/components/add-praises-dialog';
import { usePraises } from '@/context/praises-context';
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

export default function PraisesIndexPage() {
  const { praises, addPraise, addPraises, isLoaded } = usePraises();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(listFontSizes.length, 1);

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
                Alabanzas
              </h1>
              <Badge variant="secondary" className="text-base font-semibold px-2">
                {praises.length}
              </Badge>
              <Music className="h-7 w-7 text-primary" />
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
                    <AddSinglePraiseDialog onPraiseAdded={addPraise}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Agregar una alabanza
                      </DropdownMenuItem>
                    </AddSinglePraiseDialog>
                     <AddPraisesDialog onPraisesAdded={addPraises}>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Agregar varias alabanzas
                       </DropdownMenuItem>
                     </AddPraisesDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          {isLoaded ? (
            <PraiseListClient praises={praises} />
          ) : (
            <p>Cargando alabanzas...</p>
          )}
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
