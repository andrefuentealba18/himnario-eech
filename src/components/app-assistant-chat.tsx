'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { askAssistant, type AssistantAction } from '@/ai/flows/app-assistant-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Send, Bot, User, Loader2, CheckCircle2, AlertTriangle, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model';
  text: string;
  actions?: AssistantAction[];
  status?: 'pending' | 'applied' | 'error';
};

export function AppAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu Asistente Prototyper. ¿En qué puedo ayudarte hoy? Puedo corregir letras, cambiar tonalidades o organizar tus repertorios.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { hymns, updateHymn } = useHymns();
  const { praises, updatePraise, addPraise } = usePraises();
  const { choirs, updateChoir, addChoir } = useChoirs();
  const { youthChoirs, updateYouthChoir, addYouthChoir } = useYouthChoirs();

  // Crear un snapshot de los datos para la IA
  const contextSnapshot = useMemo(() => {
    const h = hymns.map(x => `Himno ${x.number}: ${x.title} (${x.tone})`).join(', ');
    const p = praises.map(x => `Alabanza ${x.id}: ${x.title}`).join(', ');
    const c = choirs.map(x => `Coro ${x.id}: ${x.title}`).join(', ');
    return `Himnos: ${h.slice(0, 1000)}... | Alabanzas: ${p.slice(0, 500)}... | Coros: ${c.slice(0, 500)}...`;
  }, [hymns, praises, choirs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: [{ text: m.text }]
      }));

      const result = await askAssistant({
        message: userMessage,
        history,
        contextSnapshot
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text, 
        actions: result.actions,
        status: result.actions ? 'pending' : undefined
      }]);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error de conexión', description: 'No pude contactar al asistente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const applyActions = async (msgIndex: number) => {
    const message = messages[msgIndex];
    if (!message.actions) return;

    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[msgIndex] = { ...message, status: 'applied' };
      return newMsgs;
    });

    for (const action of message.actions) {
      try {
        switch (action.type) {
          case 'update_hymn':
            await updateHymn(parseInt(action.id), action.data);
            break;
          case 'update_praise':
            await updatePraise(action.id, action.data);
            break;
          case 'update_choir':
            await updateChoir(action.id, action.data);
            break;
          case 'update_youth_choir':
            await updateYouthChoir(action.id, action.data);
            break;
          case 'add_praise':
            await addPraise(action.data);
            break;
          case 'add_choir':
            await addChoir(action.data);
            break;
        }
        toast({ title: 'Acción Ejecutada', description: action.description });
      } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error al aplicar', description: `No pude realizar: ${action.description}` });
      }
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border-primary/20 shadow-xl overflow-hidden bg-background">
      <div className="bg-primary p-4 text-primary-foreground flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-bold text-sm tracking-tight">Asistente Prototyper</h2>
          <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">IA Inteligente en Vivo</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-muted text-foreground rounded-tl-none border border-border/50"
              )}>
                <div className="flex items-center gap-2 mb-1 opacity-50">
                  {msg.role === 'model' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  <span className="text-[10px] font-bold uppercase">{msg.role === 'model' ? 'Asistente' : 'Tú'}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>

              {msg.actions && msg.actions.length > 0 && (
                <div className="ml-4 p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2 w-[80%]">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase mb-2">
                    <Wand2 className="h-3 w-3" /> Plan de Acción
                  </div>
                  {msg.actions.map((action, ai) => (
                    <div key={ai} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {action.description}
                    </div>
                  ))}
                  {msg.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      className="w-full mt-2 h-8 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90"
                      onClick={() => applyActions(i)}
                    >
                      Ejecutar Cambios
                    </Button>
                  ) : msg.status === 'applied' ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-green-600 font-bold text-[10px] uppercase">
                      <CheckCircle2 className="h-4 w-4" /> Cambios Aplicados
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl w-fit animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Pensando respuesta...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex gap-2 bg-background p-1.5 rounded-full border-2 border-primary/10 shadow-inner focus-within:border-primary/30 transition-all">
          <Input 
            placeholder="Pídeme corregir algo..." 
            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="rounded-full h-10 w-10 shrink-0 shadow-lg"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase tracking-tighter font-bold opacity-60">
          El asistente puede modificar Himnos, Alabanzas y Coros según tu solicitud.
        </p>
      </div>
    </Card>
  );
}
