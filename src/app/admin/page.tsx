import Link from 'next/link';
import { hymns } from '@/lib/hymns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';

export default function AdminPage() {
  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">
            Panel de Administración
          </h1>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Himnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {hymns.map((hymn) => (
                  <div key={hymn.number} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-bold text-primary">{hymn.number}.</span>
                      <span className="ml-2 font-medium">{hymn.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="destructive" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
