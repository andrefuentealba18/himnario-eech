"use client";

import { useState } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymns } from '@/lib/hymns';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Plus, ChevronDown } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';


export default function HymnsIndexPage() {
  const [hymns, setHymns] = useState<Hymn[]>(initialHymns);
  const { toast } = useToast();

  const handleAddHymns = (newHymns: Hymn[]): number => {
    const existingNumbers = new Set(hymns.map(h => h.number));
    const uniqueNewHymns = newHymns.filter(h => !existingNumbers.has(h.number));
    
    if (uniqueNewHymns.length > 0) {
      setHymns(prevHymns => [...prevHymns, ...uniqueNewHymns].sort((a, b) => a.number - b.number));
    }
    
    return uniqueNewHymns.length;
  };
  
  const handleAddSingleHymn = (newHymn: Hymn): boolean => {
    const existingNumbers = new Set(hymns.map(h => h.number));
    if(existingNumbers.has(newHymn.number)){
        toast({
            variant: 'destructive',
            title: 'Error al agregar',
            description: `El himno número ${newHymn.number} ya existe.`,
        });
        return false;
    }
    setHymns(prevHymns => [...prevHymns, newHymn].sort((a,b) => a.number - b.number));
    return true;
  }


  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
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

        <div className="p-4">
          <HymnListClient hymns={hymns} />
        </div>
      </div>
    </main>
  );
}
