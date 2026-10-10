"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ActivityLog } from '@/lib/activity-logger';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, PlusCircle, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function ActivityLogList() {
  const [logs, setLogs] = useState<(ActivityLog & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const q = query(
      collection(firestore, 'activityLogs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (ActivityLog & { id: string })[];
      setLogs(newLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="h-4 w-4 text-emerald-500" />;
      case 'UPDATE': return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'DELETE': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'APPROVE': return <CheckCircle2 className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'CREATE': return 'agregó';
      case 'UPDATE': return 'modificó';
      case 'DELETE': return 'eliminó';
      case 'APPROVE': return 'aprobó';
      default: return 'procesó';
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Cargando registro de actividad...</div>;
  }

  if (logs.length === 0) {
    return (
      <Card className="border-dashed bg-transparent border-2 border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Clock className="h-12 w-12 mb-4 opacity-20" />
          <p className="font-bold">No hay actividad reciente</p>
          <p className="text-xs mt-1">Los cambios aparecerán aquí cuando las iglesias agreguen o modifiquen cantos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id} className="overflow-hidden border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-start p-4 gap-4">
            <div className="mt-1 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
              {getActionIcon(log.action)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span className="font-bold">{log.userName || 'Usuario'}</span> {getActionText(log.action)}{' '}
                  <span className="font-bold">"{log.title}"</span>
                </p>
                {log.timestamp && (
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {formatDistanceToNow(log.timestamp.toDate(), { addSuffix: true, locale: es })}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center mt-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                  {log.type}
                </Badge>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                  📍 {log.churchName}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
