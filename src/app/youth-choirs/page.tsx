
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

const groups: { name: GroupType; icon?: any; imageUrl?: string; color: string; iconColor?: string; imgClass?: string }[] = [
  { name: "Coro Juventud", imageUrl: "https://i.postimg.cc/bvk974Xp/IMG_2532.jpg", color: "bg-transparent" },
  { name: "Grupo Ciclista", imageUrl: "https://i.postimg.cc/QtWZZ88d/Imagen1.png", color: "bg-transparent", imgClass: "object-contain scale-[0.85]" },
  { name: "Departamento Infantil", imageUrl: "https://i.postimg.cc/mDkyNsXL/Asunto.png", color: "bg-transparent" },
  { name: "Clase Dorcas", imageUrl: "https://www.photo-pick.com/online/api/v1/albums/628d3a58-df5a-4b3d-9e29-98902f716a85.jpg", color: "bg-transparent" },
  { name: "Departamento Juvenil", imageUrl: "https://www.photo-pick.com/online/api/v1/albums/3f593f63-fae9-461e-a3b0-45f7c8a62c32.jpg", color: "bg-transparent" },
];

export default function YouthChoirsIndexPage() {
  const { youthChoirs, addYouthChoirs, isLoaded, addYouthChoir } = useYouthChoirs();
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [isSingleYouthChoirDialogOpen, setSingleYouthChoirDialogOpen] = useState(false);
  const [isMultiYouthChoirDialogOpen, setMultiYouthChoirDialogOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsReady(true);
    
    if (typeof window !== 'undefined') {
      // Always show intro for 3 seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
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
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[180vw] h-[180vw] bg-amber-400/10 rounded-full blur-[160px] animate-aura-giant" />
          <div className="absolute bottom-[10%] left-[10%] w-[160vw] h-[160vw] bg-blue-600/10 rounded-full blur-[180px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        <div className="absolute top-24 right-12 w-24 h-24 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out">
          <div className="absolute inset-0 bg-amber-400/30 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="relative p-1.5 bg-gradient-to-tr from-amber-400/60 to-transparent rounded-full shadow-2xl">
            <Image 
              src={insigniaUrl} 
              alt="Insignia EECH" 
              width={96} 
              height={96} 
              className="relative rounded-full object-cover border-2 border-white/80"
              priority
            />
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="space-y-12 text-center px-6">
            <div className="relative">
              <h1 className="text-2xl font-black font-headline text-slate-900 animate-title-reveal-big uppercase tracking-[0.2em]">
                Agrupaciones
              </h1>
              
              <div className="mt-12 relative w-80 h-2 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
                <div className="absolute inset-0 flex">
                  <div className="h-full flex-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-loading-beam-long" style={{ animationDelay: '0s' }} />
                  <div className="h-full w-24 bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.4s' }} />
                  <div className="h-full flex-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.8s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[11px] font-black tracking-[0.8em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
              Ejército Evangélico de Chile
            </p>
            <div className="flex items-center gap-8 opacity-40">
              <div className="h-px w-20 bg-blue-600" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div className="h-px w-20 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <>
      <main className="relative flex flex-col items-center bg-background min-h-screen animate-in fade-in duration-1000">
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-primary/10 rounded-full blur-[140px] animate-aura-giant" />
          <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[120px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
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

          <div className="p-4 flex-1 overflow-auto animate-in fade-in duration-700">
            {!selectedGroup ? (
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
                          "transition-all duration-700 group-hover:scale-110 flex items-center justify-center overflow-hidden relative",
                          group.imageUrl ? "w-24 h-24 shadow-xl rounded-full bg-white ring-4 ring-white dark:ring-slate-800" : `w-16 h-16 p-4 rounded-full shadow-inner ${group.color}`
                        )}>
                          {group.imageUrl ? (
                            <Image 
                              src={group.imageUrl} 
                              alt={group.name} 
                              width={96} 
                              height={96} 
                              className={cn("w-full h-full", group.imgClass || "object-cover scale-[1.12]")}
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
