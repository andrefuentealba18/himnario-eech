export type Hymn = {
  number: number;
  title: string;
  lyrics: string;
};

export const hymns: Hymn[] = [
  {
    number: 1,
    title: "¡Santo, Santo, Santo!",
    lyrics: `¡Santo, Santo, Santo! Señor omnipotente,
Siempre el labio mío loores te dará.
¡Santo, Santo, Santo! Te adoro reverente,
Dios en tres personas, bendita Trinidad.

¡Santo, Santo, Santo! En numeroso coro,
Santos escogidos te adoran sin cesar
De alegría llenos y sus coronas de oro
Rinden ante el trono y el cristalino mar.

¡Santo, Santo, Santo! La inmensa muchedumbre
De ángeles que cumplen tu santa voluntad,
Ante ti se postra, bañada de tu lumbre,
Ante ti que has sido, que eres y serás.

¡Santo, Santo, Santo! Por más que estés velado,
E imposible sea tu gloria contemplar,
Santo tú eres solo y nada hay a tu lado
En poder perfecto, pureza y caridad.

¡Santo, Santo, Santo! La gloria de tu nombre
Vemos en tus obras, en cielo, tierra y mar,
¡Santo, Santo, Santo! Te adorará todo hombre,
Dios en tres personas, bendita Trinidad. Amén.`
  },
  {
    number: 2,
    title: "A Dios, Naciones, Dad Loor",
    lyrics: `A Dios, naciones, dad loor,
también, pueblos, dadle honra,
porque ha engrandecido
sobre nosotros su favor;
y la verdad de nuestro Dios
es para siempre. ¡Aleluya!
Es para siempre. ¡Aleluya! Amén.`
  },
  {
    number: 3,
    title: "Castillo Fuerte Es Nuestro Dios",
    lyrics: `Castillo fuerte es nuestro Dios,
defensa y buen escudo.
Con su poder nos librará
en todo trance agudo.
Con furia y con afán
acósanos Satán;
por armas deja ver
astucia y gran poder;
cual él no hay en la tierra.

Nuestro valor es nada aquí,
con él todo es perdido;
mas por nosotros pugnará
de Dios el Escogido.
¿Sabéis quién es? Jesús,
el que venció en la cruz,
Señor de Sabaoth.
Y pues él solo es Dios,
él triunfa en la batalla.`
  },
  {
    number: 4,
    title: "¡Oh, Amor de Dios!",
    lyrics: `¡Oh amor de Dios!, su inmensidad
el hombre no podrá contar,
ni comprender la gran verdad
que Dios al hombre pudo amar.
Cuando el pecar entró al hogar
de Adán y Eva en Edén,
Dios les sacó, mas prometió
un Salvador también.

Coro:
¡Oh amor de Dios!, brotando está,
inmensurable, eternal;
por las edades durará,
inagotable raudal.

Si fuera tinta todo el mar,
y todo el cielo un gran papel,
y cada hombre un escritor,
y cada hoja un pincel,
para escribir de su existir
no bastarían jamás.
El gran amor de mi Señor
agota todo afán.

Y cuando el tiempo pasará,
con cada reino mundanal,
y cada trama y plan carnal,
el hombre que no adoró a Dios,
clamará por las montañas,
mas no habrá dónde ocultar
su alma de la ira del Señor.`
  },
  {
    number: 5,
    title: "Grande Es Tu Fidelidad",
    lyrics: `Oh, Dios eterno, tu misericordia
ni una sombra de duda tendrá;
tu compasión y bondad nunca fallan
y por los siglos el mismo serás.

Coro:
¡Oh, tu fidelidad! ¡Oh, tu fidelidad!
Cada momento la veo en mí.
Nada me falta, pues todo provees,
¡grande, Señor, es tu fidelidad!

La noche obscura, el sol y la luna,
las estaciones del año también,
unen su canto cual fieles criaturas,
porque eres bueno, por siempre eres fiel.

Tú me perdonas, me impartes el gozo,
tierno me guías por sendas de paz;
eres mi fuerza, mi fe, mi reposo,
y por los siglos mi Padre serás.`
  }
];

export function getHymnById(id: number): Hymn | undefined {
  return hymns.find(hymn => hymn.number === id);
}
