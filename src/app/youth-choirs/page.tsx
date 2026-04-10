"use client";

import { useState, useMemo, useEffect } from 'react';
import { YouthChoirListClient } from '@/components/youth-choir-list-client';
import { Users, ChevronLeft, Plus, Baby, UserCircle, Library, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const groups: { name: GroupType; icon?: any; imageUrl?: string; color: string; iconColor?: string }[] = [
  { name: "Coro Juventud", imageUrl: "https://i.postimg.cc/bvk974Xp/IMG_2532.jpg", color: "bg-transparent" },
  { name: "Grupo Ciclista", imageUrl: "https://i.postimg.cc/QtWZZ88d/Imagen1.png", color: "bg-transparent" },
  { name: "Departamento Infantil", icon: Baby, color: "bg-rose-100", iconColor: "text-rose-600" },
  { name: "Clase Dorcas", icon: UserCircle, color: "bg-purple-100", iconColor: "text-purple-600" },
  { name: "Departamento Juvenil", icon: Users, color: "bg-orange-100", iconColor: "text-orange-600" },
];

export default function YouthChoirsIndexPage() {
  const { youthChoirs, addYouthChoirs, isLoaded, addYouthChoir } = useYouthChoirs();
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [isSingleYouthChoirDialogOpen, setSingleYouthChoirDialogOpen] = useState(false);
  const [isMultiYouthChoirDialogOpen, setMultiYouthChoirDialogOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

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

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700">
        {/* EFECTOS DE FONDO CINEMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/5 rounded-full blur-[120px] animate-aura-slow" />
          <div className="absolute inset-0 design-grid opacity-10" />
          <div className="absolute top-1/4 left-1/4 w-[100vw] h-[100vw] bg-gradient-to-br from-amber-200/5 to-transparent blur-[100px] animate-pulse" />
        </div>
        
        {/* INSIGNIA ESQUINA SUPERIOR DERECHA */}
        <div className="absolute top-12 right-8 w-14 h-14 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-1000 ease-out">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <Image 
            src={insigniaUrl} 
            alt="Insignia EECH" 
            width={56} 
            height={56} 
            className="relative rounded-full object-cover shadow-2xl border-2 border-white dark:border-white/10"
            priority
          />
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <Library className="h-5 w-5 text-primary/40" />
              <div className="h-px w-8 bg-primary/20" />
            </div>
            
            <div className="relative group">
              <h1 className="text-5xl font-black font-headline tracking-[0.15em] text-slate-900 dark:text-white animate-title-reveal uppercase text-glow">
                Agrupaciones
              </h1>
              <div className="absolute -inset-x-8 -bottom-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>

            <p className="text-[10px] font-black tracking-[0.6em] text-primary/60 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 pt-4">
              Cánticos Especiales
            </p>
          </div>
        </div>

        {/* PIE DE PÁGINA SOLEMNE */}
        <div className="absolute bottom-16 left-0 w-full text-center px-6">
          <div className="flex items-center justify-center gap-4 mb-3 opacity-20 dark:opacity-40">
            <div className="h-px w-12 bg-slate-400" />
            <Sparkles className="h-3 w-3 text-slate-400 animate-pulse" />
            <div className="h-px w-12 bg-slate-400" />
          </div>
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            Ejército Evangélico de Chile
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative flex flex-col items-center bg-background min-h-screen animate-in fade-in duration-1000">
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
          <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-16 pb-6 px-4 border-b flex items-center justify-center relative min-h-[140px]">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  {selectedGroup ? (
                    <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)} className="rounded-full h-12 w-12">
                      <ChevronLeft className="h-7 w-7" />
                      <span className="sr-only">Volver al menú</span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12">
                      <Link href="/">
                          <ChevronLeft className="h-7 w-7" />
                          <span className="sr-only">Volver</span>
                      </Link>
                    </Button>
                  )}
              </div>
              <div className="flex items-center gap-3 px-10">
                <h1 className="text-xl font-bold font-headline text-foreground truncate max-w-[180px]">
                  {selectedGroup || "Agrupaciones"}
                </h1>
                {selectedGroup && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
                    {filteredByGroup.length}
                  </Badge>
                )}
                {!selectedGroup && <Library className="h-6 w-6 text-primary" />}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full h-10 px-4">
                        <Plus className="mr-1 h-4 w-4" />
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
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="animate-pulse font-bold uppercase tracking-widest text-[10px]">Sincronizando Agrupaciones...</p>
              </div>
            ) : !selectedGroup ? (
              <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Selecciona Categoría</p>
                  <div className="h-0.5 w-8 bg-primary/30 mx-auto rounded-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {groups.map((group, index) => (
                    <Card 
                      key={group.name} 
                      className="cursor-pointer border-slate-200/50 bg-white/40 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 active:scale-95 shadow-sm hover:shadow-xl group overflow-hidden border-2 app-card"
                      onClick={() => setSelectedGroup(group.name)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className={cn(
                          "transition-all duration-700 group-hover:scale-110 flex items-center justify-center overflow-hidden",
                          group.imageUrl ? "w-20 h-20 p-0 shadow-lg rounded-full" : `w-16 h-16 p-4 rounded-2xl shadow-inner ${group.color}`
                        )}>
                          {group.imageUrl ? (
                            <Image 
                              src={group.imageUrl} 
                              alt={group.name} 
                              width={80} 
                              height={80} 
                              className="object-cover w-full h-full"
                              priority
                              data-ai-hint="group logo"
                            />
                          ) : (
                            <group.icon className={`h-8 w-8 ${group.iconColor}`} />
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-black text-[10px] text-slate-800 leading-tight uppercase tracking-widest">{group.name}</h3>
                          <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0 h-5 bg-primary/5 text-primary border-primary/10">
                            {countsByGroup[group.name] || 0} cantos
                          </Badge>
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
