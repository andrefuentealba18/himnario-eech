import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, DatabaseBackup, Shuffle } from 'lucide-react';
import { HymnAdminList } from '@/components/hymn-admin-list';
import { PraiseAdminList } from '@/components/praise-admin-list';
import { ChoirAdminList } from '@/components/choir-admin-list';
import { YouthChoirAdminList } from '@/components/youth-choir-admin-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MissingHymns } from '@/components/missing-hymns';
import { BackupManager } from '@/components/backup-manager';
import { SongTransferManager } from '@/components/song-transfer-manager';

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

        <div className="p-4">
          <Tabs defaultValue="hymns" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="hymns">Himnos</TabsTrigger>
              <TabsTrigger value="praises">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs">Coro Juventud</TabsTrigger>
              <TabsTrigger value="missing-hymns">Faltantes</TabsTrigger>
              <TabsTrigger value="transfer">
                <Shuffle className="mr-2 h-4 w-4" />
                Traspasar
              </TabsTrigger>
              <TabsTrigger value="backup">
                <DatabaseBackup className="mr-2 h-4 w-4" />
                Respaldo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hymns">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Himnos</CardTitle>
                </CardHeader>
                <CardContent>
                  <HymnAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="praises">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Alabanzas</CardTitle>
                </CardHeader>
                <CardContent>
                  <PraiseAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="choirs">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestionar Coros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChoirAdminList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="youth-choirs">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestionar Alabanza Coro Juventud</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <YouthChoirAdminList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="missing-hymns">
                <MissingHymns />
            </TabsContent>
            <TabsContent value="transfer">
                <SongTransferManager />
            </TabsContent>
             <TabsContent value="backup">
                <BackupManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
