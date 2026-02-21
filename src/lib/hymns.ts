export type Hymn = {
  number: number;
  title: string;
  lyrics: string;
};

export const hymns: Hymn[] = [
  {
    number: 1,
    title: 'HIMNO OFICIAL DEL EJÉRCITO EVANGÉLICO DE CHILE',
    lyrics: `1. Adelante ejército de Cristo
y luchar contra las huestes del mal
y confiar que saldremos victoriosos
con el León de la Tribu de Judá.

CORO:
Es inútil que nos tiendan barreras
Las legiones mandadas por satán,
Nuestras fuerzas alcanzaran victoria
La bandera jamás hemos de arriar.

2. Ingresar al Ejército Evangélico
los que amáis a nuestro salvador
lucharemos juntos como hermanos
hasta implantar la justicia del señor.

3. Venid pronto queridos amigos
a escuchar los consejos del señor
y saldrá esa venda de tus ojos
y serás del ejército de Dios.

4. Congregarse todos los cristianos
al Ejército Evangélico de Dios,
a quebrantar las religiones falsas
que han tenido a Chile en el error.`
  }
];

export function getHymnById(id: number): Hymn | undefined {
  return hymns.find(hymn => hymn.number === id);
}
