"use client";

import { useState, useEffect } from 'react';
import { useChurch, Church } from '@/context/church-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, Plus, Search, Info, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ChurchSelector() {
  const { currentChurch, availableChurches, setCurrentChurch, createChurch, isLoading } = useChurch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newChurchName, setNewChurchName] = useState('');
  const [newChurchDistrict, setNewChurchDistrict] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingFoundChurch, setExistingFoundChurch] = useState<Church | null>(null);

  if (isLoading || currentChurch) return null;

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
    const dist = formatText(rawDist);
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
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex gap-3 text-left">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Nueva Función</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
                    Ahora cada iglesia tiene su himnario privado y separado. Busca tu iglesia en la lista para entrar, o presiona <strong>"Crear nueva iglesia"</strong> si aún no existe. (Luego podrás cambiar de iglesia usando el botón al final de la página de inicio).
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar iglesia o distrito..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/5 dark:bg-white/5 border-none h-12 rounded-xl"
                />
              </div>
              
              <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {sortedDistricts.map(district => (
                  <div key={district} className="space-y-2 mb-4">
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                      {district}
                    </h3>
                    {groupedChurches[district].map(church => (
                      <Button 
                        key={church.id} 
                        variant="outline" 
                        className="w-full justify-start h-14 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all font-bold text-left whitespace-normal h-auto py-3"
                        onClick={() => setCurrentChurch(church)}
                      >
                        <MapPin className="mr-3 h-5 w-5 text-slate-400 shrink-0" />
                        <span>{formatText(church.name)}</span>
                      </Button>
                    ))}
                  </div>
                ))}
                
                {filteredChurches.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm font-medium">
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
                      onClick={() => setCurrentChurch(existingFoundChurch)}
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
