
"use client";

import { useState, useMemo } from 'react';
import { YouthChoirListClient } from '@/components/youth-choir-list-client';
import { Users, ChevronLeft, Plus, ChevronDown, Music, Baby, Bike, UserCircle, Library } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddSingleYouthChoirDialog } from '@/components/add-single-youth-choir-dialog';
import { AddYouthChoirsDialog } from '@/components/add-youth-choirs-dialog';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import type { GroupType } from '@/lib/youth-choirs';

const groups: { name: GroupType; icon: any; color: string }[] = [
  { name: "Coro Juventud", icon: Users, color: "text-blue-500 bg-blue-50" },
  { name: "Grupo Ciclista", icon: Bike, color: "text-green-500 bg-green-50" },
  { name: "Departamento Infantil", icon: Baby, color: "text-pink-500 bg-pink-50" },
  { name: "Clase Dorcas", icon: UserCircle, color: "text-purple-500 bg-purple-50" },
  { name: "Departamento Juvenil", icon: Users, color: "text-orange-500 bg-orange-50" },
];

export default function YouthChoirsIndexPage() {
  const { youthChoirs, addYouthChoirs, isLoaded, addYouthChoir } = useYouthChoirs();
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [isSingleYouthChoirDialogOpen, setSingleYouthChoirDialogOpen] = useState(false);
  const [isMultiYouthChoirDialogOpen, setMultiYouthChoirDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredByGroup = useMemo(() => {
    if (!selectedGroup) return [];
    return youthChoirs.filter(yc => yc.group === selectedGroup);
  }, [youthChoirs, selectedGroup]);

  const handleSingleOpenChange = (open: boolean) => {
    setSingleYouthChoirDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleMultiOpenChange = (open: boolean) => {
    setMultiYouthChoirDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <>
      <main className="flex flex-col items-center bg-background min-h-screen">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-center relative h-14">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                  {selectedGroup ? (
                    <button onClick={() => setSelectedGroup(null)} type="button">
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Volver al menú</span>
                    </button>
                  ) : (
                    <Link href="/">
                        <ChevronLeft className="h-6 w-6" />
                        <span className="sr-only">Volver</span>
                    </Link>
                  )}
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold font-headline text-foreground truncate max-w-[180px]">
                  {selectedGroup || "Agrupaciones"}
                </h1>
                {selectedGroup && (
                  <Badge variant="secondary" className="text-base font-semibold px-2">
                    {filteredByGroup.length}
                  </Badge>
                )}
                {!selectedGroup ? <Library className="h-7 w-7 text-primary" /> : <Music className="h-7 w-7 text-primary" />}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Agregar
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSingleYouthChoirDialogOpen(true); }}>
                        Agregar una alabanza
                      </DropdownMenuItem>
                       <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setMultiYouthChoirDialogOpen(true); }}>
                        Agregar varias alabanzas
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </header>

          <div className="p-4 flex-1 overflow-auto">
            {!isLoaded ? (
              <p className="text-center py-10">Cargando alabanzas...</p>
            ) : !selectedGroup ? (
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-center mb-2">Selecciona una agrupación para ver sus alabanzas:</p>
                {groups.map((group) => (
                  <Card 
                    key={group.name} 
                    className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                    onClick={() => setSelectedGroup(group.name)}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={`p-3 rounded-full ${group.color}`}>
                        <group.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {youthChoirs.filter(yc => yc.group === group.name).length} canciones guardadas
                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground -rotate-90" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <YouthChoirListClient youthChoirs={filteredByGroup} />
            )}
          </div>
        </div>
      </main>

      <AddSingleYouthChoirDialog
        open={isSingleYouthChoirDialogOpen}
        onOpenChange={handleSingleOpenChange}
        onYouthChoirAdded={addYouthChoir}
        initialGroup={selectedGroup || undefined}
      />
       <AddYouthChoirsDialog
        open={isMultiYouthChoirDialogOpen}
        onOpenChange={handleMultiOpenChange}
        onYouthChoirsAdded={addYouthChoirs}
        initialGroup={selectedGroup || undefined}
      />
    </>
  );
}
