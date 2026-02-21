import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { HymnAdminList } from '@/components/hymn-admin-list';
import { PraiseAdminList } from '@/components/praise-admin-list';

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
              <HymnAdminList />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestionar Alabanzas</CardTitle>
            </CardHeader>
            <CardContent>
              <PraiseAdminList />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestionar Coros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente...</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Alabanza Coro Juventud</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente...</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}
