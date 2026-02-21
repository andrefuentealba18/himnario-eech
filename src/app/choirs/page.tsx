"use client";

import { useState } from 'react';
import { ChoirListClient } from '@/components/choir-list-client';
import { Mic, ChevronLeft, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddSingleChoirDialog } from '@/components/add-single-choir-dialog';
import { AddChoirsDialog } from '@/components/add-choirs-dialog';
import { useChoirs } from '@/context/choirs-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export default function ChoirsIndexPage() {
  const { choirs, addChoir, addChoirs, isLoaded } = useChoirs();
  const [isSingleChoirDialogOpen, setSingleChoirDialogOpen] = useState(false);
  const [isMultiChoirDialogOpen, setMultiChoirDialogOpen] = useState(false);

  return (
    <>
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
                  Coros
                </h1>
                <Badge variant="secondary" className="text-base font-semibold px-2">
                  {choirs.length}
                </Badge>
                <Mic className="h-7 w-7 text-primary" />
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
                      <DropdownMenuItem onSelect={() => setSingleChoirDialogOpen(true)}>
                        Agregar un coro
                      </DropdownMenuItem>
                       <DropdownMenuItem onSelect={() => setMultiChoirDialogOpen(true)}>
                        Agregar varios coros
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </header>

          <div className="p-4 flex-1 overflow-auto">
            {!isLoaded ? (
              <p>Cargando coros...</p>
            ) : (
              <ChoirListClient choirs={choirs} />
            )}
          </div>
        </div>
      </main>

      <AddSingleChoirDialog
        open={isSingleChoirDialogOpen}
        onOpenChange={setSingleChoirDialogOpen}
        onChoirAdded={addChoir}
      />
      <AddChoirsDialog
        open={isMultiChoirDialogOpen}
        onOpenChange={setMultiChoirDialogOpen}
        onChoirsAdded={addChoirs}
      />
    </>
  );
}
