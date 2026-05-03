import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeSearchTerm(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡.,;?!"']/g, "");
}

export function formatForOpenLP(lyrics: string): string {
  if (!lyrics) return '';
  let openLpText = '';
  const paragraphs = lyrics.split(/\n\s*\n/);
  
  let verseCount = 1;
  paragraphs.forEach((p) => {
      const lines = p.trim().split('\n');
      if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) return;
      
      const isChorus = lines[0].trim().toUpperCase().startsWith('CORO');
      if (isChorus) {
          lines.shift(); // remove the word CORO
      }
      
      if (lines.length === 0) return; // if it was just the word CORO
      
      openLpText += `---[Verso:${verseCount}]---\n`;
      openLpText += lines.join('\n') + '\n';
      verseCount++;
  });
  
  return openLpText.trim();
}
