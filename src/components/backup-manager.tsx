"use client";

import { useState, useRef } from 'react';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from './ui/label';

export function BackupManager() {
  const { hymns, restoreHymns } = useHymns();
  const { praises, restorePraises } = usePraises();
  const { choirs, restoreChoirs } = useChoirs();
  const { youthChoirs, restoreYouthChoirs } = useYouthChoirs();
  const { toast } = useToast();
  
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBackup = () => {
    const backupData = {
      hymns: hymns.map(({ id, ...h }) => h),
      praises: praises.map(({ id, ...p }) => p),
      choirs: choirs.map(({ id, ...c }) => c),
      youthChoirs: youthChoirs.map(({ id, ...yc }) => yc),
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `himnario-eech-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Copia de seguridad creada", description: "El archivo se ha descargado en tu dispositivo." });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBackupFile(event.target.files[0]);
    } else {
      setBackupFile(null);
    }
  };

  const handleRestore = async () => {
    if (!backupFile) return;

    setIsRestoring(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
        try {
            const content = e.target?.result as string;
            const backupData = JSON.parse(content);

            if (typeof backupData.hymns === 'undefined' || typeof backupData.praises === 'undefined' || typeof backupData.choirs === 'undefined' || typeof backupData.youthChoirs === 'undefined') {
                throw new Error("Formato de archivo inválido. Faltan una o más secciones de datos.");
            }

            await Promise.all([
                restoreHymns(backupData.hymns || []),
                restorePraises(backupData.praises || []),
                restoreChoirs(backupData.choirs || []),
                restoreYouthChoirs(backupData.youthChoirs || []),
            ]);

            toast({ title: "Restauración Completada", description: "Todos los datos han sido restaurados con éxito." });
        } catch (error: any) {
            console.error("Error al restaurar la copia de seguridad:", error);
            toast({
                variant: "destructive",
                title: "Error en la Restauración",
                description: error.message || "El archivo podría estar dañado o tener un formato incorrecto.",
            });
        } finally {
            setIsRestoring(false);
            setBackupFile(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    reader.readAsText(backupFile);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Crear Copia de Seguridad</CardTitle>
          <CardDescription>
            Guarda todos los himnos, alabanzas y coros en un archivo JSON en tu dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateBackup}>
            <Download className="mr-2 h-4 w-4" />
            Descargar Copia de Seguridad
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Restaurar desde Copia de Seguridad</CardTitle>
          <CardDescription>
            Selecciona un archivo de respaldo para restaurar todos los datos. ¡Esta acción sobreescribirá todo el contenido actual!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-file">Archivo de respaldo (.json)</Label>
            <Input id="backup-file" type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!backupFile || isRestoring}>
                {isRestoring ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Restaurar Datos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción es irreversible. Se borrarán todos los datos actuales (himnos, alabanzas, coros) y se reemplazarán con los datos del archivo de respaldo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore}>
                  Sí, restaurar ahora
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
