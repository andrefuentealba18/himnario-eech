
import type { YouthChoir } from './youth-choirs';

export const initialYouthChoirs: Omit<YouthChoir, 'id'>[] = [
  {
    title: 'MIRAD EL BLANCO',
    group: 'Coro Juventud',
    tone: 'Sol Mayor',
    speed: 'Rapido',
    lyrics: `Mirad el blanco que es Jesús,
Coro Juventud de Cristo,
avanzad sin mirar atrás,
en la lucha siempre listos.

CORO:
¡Adelante, Coro y Juventud!
del Ejército Evangélico de Chile,
cantad llenos de virtud
a Jesús quien nos preside.`
  },
  {
    title: 'CICLISTAS DE JESUCRISTO',
    group: 'Grupo Ciclista',
    tone: 'Re Mayor',
    speed: 'Rapido',
    lyrics: `Somos ciclistas de Jesucristo
y nuestro lema es paladear,
en nuestras máquinas vamos lejos,
el Evangelio a predicar.

Que hay hoyos en el camino,
que áspero está,
que larga es la subida,
que apenas subo ya.`
  }
];
