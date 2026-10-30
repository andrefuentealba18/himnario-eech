"use client";

import { useState, useEffect } from 'react';
import { useChurch, Church, canonicalDistrict } from '@/context/church-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, Plus, Search, Info, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ChurchSelector() {
  const { 
    currentChurch, 
    availableChurches, 
    setCurrentChurch, 
    createChurch, 
    isLoading,
    isSelectorOpen,
    closeChurchSelector
  } = useChurch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newChurchName, setNewChurchName] = useState('');
  const [newChurchDistrict, setNewChurchDistrict] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingFoundChurch, setExistingFoundChurch] = useState<Church | null>(null);

  if (isLoading) return null;
  if (!isSelectorOpen && currentChurch) return null;

  const formatText = (text: string) => {
    if (!text) return '';
    if (text === text.toLowerCase()) {
      return text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return text;
  };

  const filteredChurches = availableChurches.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.district && c.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedChurches = filteredChurches.reduce((acc, church) => {
    const rawDist = church.district || 'Sin Distrito';
    const dist = canonicalDistrict(rawDist);
    if (!acc[dist]) acc[dist] = [];
    acc[dist].push(church);
    return acc;
  }, {} as Record<string, typeof availableChurches>);

  const sortedDistricts = Object.keys(groupedChurches).sort();

  const handleCreate = async () => {
    if (!newChurchName.trim()) return;
    setErrorMessage(null);
    setExistingFoundChurch(null);
    const res = await createChurch(newChurchName.trim(), newChurchDistrict.trim() || 'Sin Distrito', creatorName.trim(), creatorEmail.trim());
    if (res.success && res.church) {
      setCurrentChurch(res.church);
    } else if (res.error === 'ALREADY_EXISTS') {
      setErrorMessage(res.message || 'Ya está creada la iglesia.');
      if (res.church) {
        setExistingFoundChurch(res.church);
      }
      toast({
        variant: "destructive",
        title: "Ya está creada la iglesia",
        description: res.message || "Esta congregación ya está registrada. Puedes buscarla en la lista."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error al registrar",
        description: res.message || "No se pudo registrar la iglesia."
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[190] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-amber-50/40 dark:from-blue-900/20 dark:to-amber-900/10 pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {currentChurch && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => closeChurchSelector()}
            className="absolute top-4 right-4 h-9 w-9 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white z-20"
            title="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <CardHeader className="text-center space-y-3 pt-7 pb-3">
          <div className="mx-auto bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-1">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">Selecciona tu Iglesia</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Cada congregación tiene sus repertorios y alabanzas independientes
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-6">
          {!isCreating ? (
            <div className="space-y-4">
              
              {currentChurch && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-center space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Tu iglesia actual:</span>
                  <div className="flex items-center justify-center gap-2 text-foreground font-black text-base">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{formatText(currentChurch.name)}</span>
                  </div>
                  {currentChurch.district && (
                    <p className="text-[11px] font-medium text-muted-foreground">{currentChurch.district}</p>
                  )}
                  <Button 
                    type="button"
                    onClick={() => closeChurchSelector()}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-md shadow-blue-500/20 mt-1 text-sm"
                  >
                    Continuar en {formatText(currentChurch.name)}
                  </Button>
                </div>
              )}

              {currentChurch && (
                <div className="flex items-center gap-3 my-1">
                  <div className="h-[1px] flex-1 bg-border/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">O cambiar de iglesia</span>
                  <div className="h-[1px] flex-1 bg-border/60" />
                </div>
              )}

              {!currentChurch && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3.5 rounded-xl flex gap-3 text-left">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Nueva Función</p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
                      Las iglesias EECH ahora están separadas. Elige tu congregación en la lista para entrar, o presiona <strong>"Crear nueva iglesia"</strong> si aún no está registrada.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar iglesia o distrito..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/5 dark:bg-white/5 border-none h-11 rounded-xl text-sm"
                />
              </div>
              
              <div className="max-h-[35vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {sortedDistricts.map(district => (
                  <div key={district} className="space-y-1.5 mb-3">
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                      {district}
                    </h3>
                    {groupedChurches[district].map(church => (
                      <Button 
                        key={church.id} 
                        variant="outline" 
                        className="w-full justify-start rounded-xl border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all font-bold text-left whitespace-normal h-auto py-2.5 px-3 text-sm"
                        onClick={() => {
                          setCurrentChurch(church);
                        }}
                      >
                        <MapPin className="mr-2.5 h-4 w-4 text-slate-400 shrink-0" />
                        <span>{formatText(church.name)}</span>
                      </Button>
                    ))}
                  </div>
                ))}
                
                {filteredChurches.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs font-medium">
                    No encontramos ninguna iglesia con ese nombre.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-amber-500/30 text-left space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Ya está creada la iglesia</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {errorMessage}
                  </p>
                  {existingFoundChurch && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 font-bold text-xs bg-white dark:bg-slate-900 border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      onClick={() => {
                        setCurrentChurch(existingFoundChurch);
                      }}
                    >
                      Entrar a {formatText(existingFoundChurch.name)}
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Distrito al que pertenece</label>
                <Input 
                  placeholder="Ej: Distrito 1" 
                  value={newChurchDistrict}
                  onChange={(e) => { setNewChurchDistrict(e.target.value); setErrorMessage(null); }}
                  className="bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl font-bold text-sm"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de la nueva iglesia</label>
                <Input 
                  placeholder="Ej: EECH Mi Ciudad" 
                  value={newChurchName}
                  onChange={(e) => { setNewChurchName(e.target.value); setErrorMessage(null); }}
                  className="bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tu Nombre (Administrador)</label>
                <Input 
                  placeholder="Ej: Juan Pérez" 
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
                <Input 
                  type="email"
                  placeholder="correo@ejemplo.com" 
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
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
              onClick={() => { setIsCreating(true); setErrorMessage(null); }}
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
                disabled={!newChurchName.trim() || !newChurchDistrict.trim() || !creatorName.trim() || !creatorEmail.trim()}
              >
                Crear y Entrar
              </Button>
              <Button 
                variant="ghost" 
                className="w-full rounded-xl h-12 font-bold"
                onClick={() => { 
                  setIsCreating(false); 
                  setErrorMessage(null);
                  setExistingFoundChurch(null);
                  setNewChurchName(''); 
                  setNewChurchDistrict(''); 
                  setCreatorName(''); 
                  setCreatorEmail(''); 
                }}
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
