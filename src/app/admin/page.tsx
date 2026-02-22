'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Settings, Inbox } from 'lucide-react';
import { HymnAdminList } from '@/components/hymn-admin-list';
import { PraiseAdminList } from '@/components/praise-admin-list';
import { ChoirAdminList } from '@/components/choir-admin-list';
import { YouthChoirAdminList } from '@/components/youth-choir-admin-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MissingHymns } from '@/components/missing-hymns';
import { BackupManager } from '@/components/backup-manager';
import { SongTransferManager } from '@/components/song-transfer-manager';
import { DuplicateSongsManager } from '@/components/duplicate-songs-manager';
import { SongReviewList } from '@/components/song-review-list';
import { Badge } from '@/components/ui/badge';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'review';

  const { pendingPraises } = usePraises();
  const { pendingChoirs } = useChoirs();
  const { pendingYouthChoirs } = useYouthChoirs();

  const pendingCount = pendingPraises.length + pendingChoirs.length + pendingYouthChoirs.length;

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

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
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="review">
                <Inbox className="mr-2 h-4 w-4" />
                Revisiones
                {pendingCount > 0 && <Badge className="ml-2">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="hymns">Himnos</TabsTrigger>
              <TabsTrigger value="praises">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs">Coro Juventud</TabsTrigger>
              <TabsTrigger value="more-settings">
                <Settings className="mr-2 h-4 w-4" />
                Más
              </TabsTrigger>
            </TabsList>
            <TabsContent value="review">
               <Card>
                  <CardHeader>
                    <CardTitle>Canciones Pendientes de Revisión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SongReviewList />
                  </CardContent>
                </Card>
            </TabsContent>
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
            <TabsContent value="more-settings">
                <div className="space-y-6">
                    <DuplicateSongsManager />
                    <MissingHymns />
                    <SongTransferManager />
                    <BackupManager />
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}