"use client";

import { useRepertoires } from "@/context/repertoires-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "./ui/button";
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
import { Trash2 } from "lucide-react";

export function RepertoireListClient() {
  const { repertoires, deleteRepertoire, isLoaded } = useRepertoires();

  if (!isLoaded) {
    return <p>Cargando repertorios...</p>;
  }

  if (repertoires.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <h2 className="text-xl font-semibold">No hay repertorios guardados</h2>
        <p>Crea tu primer repertorio para que aparezca aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repertoires.map((repertoire) => (
        <Card key={repertoire.id}>
          <CardHeader>
            <CardTitle>{repertoire.name}</CardTitle>
            <CardDescription>
              {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es }) : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground truncate">
              {repertoire.firstHymn?.title || 'Sin himno de inicio'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/repertoire/${repertoire.id}`}>Ver</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el repertorio de "{repertoire.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteRepertoire(repertoire.id)}>
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
    