
import type { Praise } from './praises';

export const initialPraises: Omit<Praise, 'id'>[] = [
  {
    title: 'EN UNA CRUZ DE MADERA',
    tone: 'Sol Mayor',
    speed: 'Lento',
    lyrics: `En una cruz de madera
murió el hijo de Dios,
para darle la vida
al pobre pecador.

CORO:
¡Oh, qué amor!, ¡oh, qué amor!
el amor de mi Señor,
que bajó de los cielos
a morir en una cruz.

Fue por mis pecados
que Jesús allí murió,
para darme el perdón
y lavarme con su amor.`
  },
  {
    title: 'YO SOLO ESPERO ESE DÍA',
    tone: 'Mi Mayor',
    speed: 'Rapido',
    lyrics: `Yo solo espero ese día
cuando Cristo volverá,
yo solo espero ese día
cuando Cristo volverá.

CORO:
Aflicción no habrá más
en aquel día final,
con Jesús yo estaré
por toda la eternidad.

Ya no habrá más tristeza
ni tampoco más dolor,
estaremos con el Rey
alabando al Salvador.`
  },
  {
    title: 'PAZ EN LA TORMENTA',
    tone: 'Fa Mayor',
    speed: 'Lento',
    lyrics: `Puedes tener paz en la tormenta,
fe y esperanza cuando no puedas más,
aunque tu mundo se caiga a pedazos,
el Señor guiará tus pasos,
en paz en la tormenta.

Muchas veces me siento solo
y no sé qué hacer,
pero el Señor me dice:
"No temas, yo estoy contigo".`
  }
];
