import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function formatRepertoireDate(createdAt: any): string {
  if (!createdAt) return '';
  try {
    if (typeof createdAt.toDate === 'function') {
      return format(createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es });
    }
    if (createdAt.seconds) {
      return format(new Date(createdAt.seconds * 1000), "d 'de' MMMM, yyyy", { locale: es });
    }
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      return format(d, "d 'de' MMMM, yyyy", { locale: es });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
  }
  return '';
}

export function removeUndefined<T = any>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj as any)) {
      const val = (obj as any)[key];
      if (val !== undefined) {
        newObj[key] = removeUndefined(val);
      }
    }
    return newObj as unknown as T;
  }
  return obj;
}

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
  let chorusCount = 1;
  
  paragraphs.forEach((p) => {
      const lines = p.trim().split('\n');
      if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) return;
      
      const firstLine = lines[0].trim();
      const isChorus = firstLine.toUpperCase().startsWith('CORO');
      
      if (isChorus) {
          if (firstLine.toUpperCase() === 'CORO' || firstLine.toUpperCase() === 'CORO:') {
              lines.shift();
          } else {
              lines[0] = lines[0].replace(/^(CORO|Coro|coro)[\s:-]*/, '');
          }
      }
      
      if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) return;
      
      if (isChorus) {
          openLpText += `---[Coro:${chorusCount}]---\n`;
          chorusCount++;
      } else {
          openLpText += `---[Verso:${verseCount}]---\n`;
          verseCount++;
      }
      
      openLpText += lines.join('\n') + '\n';
  });
  
  return openLpText.trim();
}

export function notifyAdmin(type: string, title: string) {
  try {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title })
    }).catch(e => console.error("Error al notificar (red)", e));
  } catch (e) {
    console.error("No se pudo notificar al admin", e);
  }
}
