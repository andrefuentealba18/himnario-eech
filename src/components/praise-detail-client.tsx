"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface PraiseDetailClientProps {
  praise: Praise;
}

export function PraiseDetailClient({ praise }: PraiseDetailClientProps) {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/praises">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-bold font-headline text-lg truncate">{praise.title}</h1>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-2xl px-6 text-center">
            <div
                className={`font-body leading-loose text-lg`}
            >
                {praise.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                  const isChorus = paragraph.toUpperCase().startsWith('CORO');
                  return (
                    <p key={pIndex} className={`whitespace-pre-wrap ${isChorus ? 'font-bold mb-4 leading-snug' : 'mb-6'}`}>
                      {paragraph}
                    </p>
                  );
                })}
            </div>
        </div>
      </main>
    </div>
  );
}
