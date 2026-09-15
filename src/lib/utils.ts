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
    fetch("https://formsubmit.co/ajax/p.andresfuentealbabello@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          name: "Himnario EECH Bot",
          message: `Un usuario ha enviado una nueva sugerencia para revisión en la aplicación.\n\nTipo: ${type}\nTítulo: ${title}\n\nIngresa al Panel de Control (Configuración > Admin) de la aplicación para revisar y aprobar esta sugerencia.`,
          _subject: "NUEVA REVISIÓN PENDIENTE - Himnario EECH"
      })
    }).catch(e => console.error("Error al notificar (red)", e));
  } catch (e) {
    console.error("No se pudo notificar al admin", e);
  }
}
