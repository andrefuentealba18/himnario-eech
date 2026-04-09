
import type { Choir } from './choirs';

export const initialChoirs: Omit<Choir, 'id'>[] = [
  {
    title: 'JACOB LUCHÓ CON EL ÁNGEL',
    tone: 'La menor',
    speed: 'Rapido',
    lyrics: `Jacob luchó con el ángel
por una bendición,
Jacob luchó con el ángel
por una bendición.

CORO:
Dámela, Señor, por tu amor,
dámela, Señor, por tu amor.

Yo la vine a buscar
y no me voy sin ella,
yo la vine a buscar
y no me voy sin ella.`
  },
  {
    title: 'VA BAJANDO YA',
    tone: 'Sol Mayor',
    speed: 'Rapido',
    lyrics: `Va bajando ya, va bajando ya,
va bajando el Espíritu de Dios.
Si el pueblo empieza a orar
y deja al Señor obrar,
va bajando el Espíritu de Dios.`
  },
  {
    title: 'SATÁN NO PUEDE TOCARME',
    tone: 'Do Mayor',
    speed: 'Rapido',
    lyrics: `Satán no puede tocarme,
porque yo soy de Dios,
Satán no puede tocarme,
porque yo soy de Dios.

CORO:
Tengo la sangre de Cristo
en mi corazón,
tengo la sangre de Cristo
en mi corazón.`
  }
];
