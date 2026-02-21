"use client";

import { useHymns } from '@/context/hymns-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TOTAL_HYMNS = 309;

export function MissingHymns() {
  const { hymns, isLoaded } = useHymns();

  if (!isLoaded) {
    return <p>Cargando himnos...</p>;
  }

  const existingHymnNumbers = new Set(hymns.map(h => h.number));
  const missingHymns: number[] = [];

  for (let i = 1; i <= TOTAL_HYMNS; i++) {
    if (!existingHymnNumbers.has(i)) {
      missingHymns.push(i);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Himnos Faltantes</CardTitle>
        <CardDescription>
          Se esperaba un total de {TOTAL_HYMNS} himnos. Actualmente hay {hymns.length}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {missingHymns.length > 0 ? (
          <div>
            <p className="font-semibold mb-2">Los números de los himnos que faltan son:</p>
            <div className="flex flex-wrap gap-2">
              {missingHymns.map(number => (
                <span key={number} className="bg-destructive text-destructive-foreground font-bold text-sm px-2 py-1 rounded-md">
                  {number}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-green-600 font-semibold">¡Felicidades! No falta ningún himno. Tienes los {TOTAL_HYMNS} himnos completos.</p>
        )}
      </CardContent>
    </Card>
  );
}
