
"use client";

import { useState, useMemo } from 'react';
import { YouthChoirListClient } from '@/components/youth-choir-list-client';
import { Users, ChevronLeft, Plus, Baby, Bike, UserCircle, Library } from 'lucide-react';
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

const groups: { name: GroupType; icon: any; color: string; iconColor: string }[] = [
  { name: "Coro Juventud", icon: Users, color: "bg-blue-50", iconColor: "text-blue-600" },
  { name: "Grupo Ciclista", icon: Bike, color: "bg-green-50", iconColor: "text-green-600" },
  { name: "Departamento Infantil", icon: Baby, color: "bg-rose-50", iconColor: "text-rose-600" },
  { name: "Clase Dorcas", icon: UserCircle, color: "bg-purple-50", iconColor: "text-purple-600" },
  { name: "Departamento Juvenil", icon: Users, color: "bg-orange-50", iconColor: "text-orange-600" },
];

export default function YouthChoirsIndexPage() {
  const { youthChoirs, addYouthChoirs, isLoaded, addYouthChoir } = useYouthChoirs();
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [isSingleYouthChoirDialogOpen, setSingleYouthChoirDialogOpen] = useState(false);
  const [isMultiYouthChoirDialogOpen, setMultiYouthChoirDialogOpen] = useState(false);
  const { toast } = useToast();

  const countsByGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    youthChoirs.forEach(yc => {
      counts[yc.group] = (counts[yc.group] || 0) + 1;
    });
    return counts;
  }, [youthChoirs]);

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
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  {selectedGroup ? (
                    <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)}>
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Volver al menú</span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/">
                          <ChevronLeft className="h-6 w-6" />
                          <span className="sr-only">Volver</span>
                      </Link>
                    </Button>
                  )}
              </div>
              <div className="flex items-center gap-3 px-10">
                <h1 className="text-base font-bold font-headline text-foreground truncate">
                  {selectedGroup || "Agrupaciones"}
                </h1>
                {selectedGroup && (
                  <Badge variant="secondary" className="text-xs font-semibold px-2 h-5">
                    {filteredByGroup.length}
                  </Badge>
                )}
                {!selectedGroup && <Library className="h-5 w-5 text-primary" />}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                        <Plus className="mr-1 h-3 w-3" />
                        Agregar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="animate-pulse text-sm">Cargando alabanzas...</p>
              </div>
            ) : !selectedGroup ? (
              <div className="space-y-6 py-2">
                <div className="text-center space-y-1 mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Selecciona Categoría</p>
                  <div className="h-0.5 w-6 bg-primary/20 mx-auto rounded-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {groups.map((group, index) => (
                    <Card 
                      key={group.name} 
                      className="cursor-pointer border-slate-200/60 bg-white hover:bg-slate-50 transition-all duration-300 active:scale-95 shadow-sm group overflow-hidden"
                      onClick={() => setSelectedGroup(group.name)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                        <div className={`p-2 rounded-xl ${group.color} transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                          <group.icon className={`h-4 w-4 ${group.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[11px] text-slate-800 leading-tight uppercase tracking-tight">{group.name}</h3>
                          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">
                            {countsByGroup[group.name] || 0} cantos
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <YouthChoirListClient youthChoirs={filteredByGroup} />
              </div>
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
