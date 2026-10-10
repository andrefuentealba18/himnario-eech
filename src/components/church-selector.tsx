"use client";

import { useState, useEffect } from 'react';
import { useChurch } from '@/context/church-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, Plus, Search } from 'lucide-react';

export function ChurchSelector() {
  const { currentChurch, availableChurches, setCurrentChurch, createChurch, isLoading } = useChurch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newChurchName, setNewChurchName] = useState('');
  const [showDelay, setShowDelay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDelay(true), 3600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || currentChurch) return null;
  if (!showDelay) return null; // Wait for the splash screen to finish // Only show if fully loaded and NO church is selected

  const filteredChurches = availableChurches.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = async () => {
    if (!newChurchName.trim()) return;
    const created = await createChurch(newChurchName.trim());
    if (created) {
      setCurrentChurch(created);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-amber-50/40 dark:from-blue-900/20 dark:to-amber-900/10 pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">Bienvenido</CardTitle>
          <CardDescription className="text-sm font-medium">
            Selecciona tu iglesia para acceder a su himnario privado
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isCreating ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar iglesia..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl"
                />
              </div>
              
              <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredChurches.map(church => (
                  <Button 
                    key={church.id} 
                    variant="outline" 
                    className="w-full justify-start h-14 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all font-bold text-left whitespace-normal h-auto py-3"
                    onClick={() => setCurrentChurch(church)}
                  >
                    <MapPin className="mr-3 h-5 w-5 text-slate-400 shrink-0" />
                    <span>{church.name}</span>
                  </Button>
                ))}
                
                {filteredChurches.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm font-medium">
                    No encontramos ninguna iglesia con ese nombre.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de la nueva iglesia</label>
                <Input 
                  placeholder="Ej: EECH Mi Ciudad" 
                  value={newChurchName}
                  onChange={(e) => setNewChurchName(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border-none h-14 rounded-xl font-bold text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-slate-50 dark:bg-slate-950/50 p-6 flex flex-col gap-3">
          {!isCreating ? (
            <Button 
              variant="default" 
              className="w-full rounded-xl h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Crear nueva iglesia
            </Button>
          ) : (
            <>
              <Button 
                variant="default" 
                className="w-full rounded-xl h-12 bg-primary text-white font-bold shadow-lg shadow-primary/30"
                onClick={handleCreate}
                disabled={!newChurchName.trim()}
              >
                Crear y Entrar
              </Button>
              <Button 
                variant="ghost" 
                className="w-full rounded-xl h-12 font-bold"
                onClick={() => { setIsCreating(false); setNewChurchName(''); }}
              >
                Volver a la lista
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
