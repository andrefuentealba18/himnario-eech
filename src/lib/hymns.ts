export type Hymn = {
  number: number;
  title: string;
  lyrics: string;
};

// This is now just the initial data for the useHymns hook.
// The hook will manage the hymns in localStorage.
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

2. Ingressar al Ejército Evangélico
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
  },
  {
    number: 2,
    title: 'HIMNO OFICIAL MINISTERIO FEMENINO DORCAS',
    lyrics: `1. De Jesús nuestro Rey el mandato
anhelosas queremos cumplir,
Él nos manda a esparcir su Palabra
y al trabajo debemos salir.

CORO:
Somos grandes lumbreras del mundo
Por la gracia que Cristo nos dio
Porque somos las Dorcas de Cristo
Y su gran bendición Él nos da.

2. Por ciudades, aldeas y pueblos
con la luz de la Biblia nos ven
compartiendo el agua de la vida
y las gentes apagan su sed.

3. Al llegar con los ricos tesoros
de la Santa Palabra de Dios,
a regiones donde todo es adverso
nos sostienen la fe y la oración.

4. Prometemos al Dios de los cielos
trabajar con más celo y ardor,
en sembrar la Palabra de Vida
y vivir como manda el Señor.`
  },
  {
    number: 3,
    title: 'HIMNO OFICIAL GRUPO CICLISTA',
    lyrics: `1. Señor aquí en tu nombre, salimos a luchar
cumpliendo tú mandato de ir a predicar,
corriendo con paciencia, hasta el cielo llegar.

CORO:
Somos Ciclistas de Jesucristo
y nuestro lema es paladear,
en nuestras máquinas vamos lejos
el Evangelio a predicar.

2. Que hay hoyos en el camino, qué áspero está
que larga es la subida, que apenas subo ya,
llegar queremos un día, al Trono Celestial.

3. Detengámonos un momento, aquí hay que
predicar
a lo lejos una casa, un tratado hay que dejar,
un rayito de luz, un granito de sal.

4. Si hubiera una pana, una caída, aunque más
no te aflijas hermano, Cristo a tu lado está,
su Espíritu, su Gracia, Él te bendecirá.`
  },
  {
    number: 4,
    title: 'HIMNO OFICIAL CORO Y JUVENTUD',
    lyrics: `1. Mirad el Blanco que es Jesús
Coro – Juventud de Cristo,
Avanzad sin mirar atrás
En la lucha siempre listos
Seamos la luz de nuestra Patria
Predicad la Palabra de Verdad,
Asidos siempre de la Gracia
Y el triunfo nuestro será.

CORO:
¡Adelante, Coro y Juventud!
Del Ejército Evangélico de Chile,
Cantad llenos de virtud
a Jesús, quien nos preside.
¡Adorad al Rey de Gloria!
Con guitarra y acordeón
en pos de la victoria,
que obtendremos con honor.

2. Nuestro lema es cantar
alabanzas al Señor,
con trompetas, exaltad
a Jesús, el Salvador.
Loemos con panderos y arpa
Su venida siempre pregonad,
Levanta en alto tu cabeza
Que mirando está el General.

3. Venid muy pronto, jóvenes
Niños, niñas y demás,
Los espera el Señor Jesús
Y unidos trabajar.
Que muy pronto suena la trompeta
Y la voz de mando se hará escuchar,
es Cristo nos está anunciando
viene a su Iglesia a buscar.`
  },
  {
    number: 5,
    title: '¡A COMBATIR!',
    lyrics: `1. ¡A combatir!, resuena la guerrera voz
del buen Jesús, que voy llamando está;
sin desmayar seguidle siempre con valor,
y la victoria plena os dará.

CORO:
¡A la batalla, oh cristiano!, con el escudo de la cruz;
Sé fiel soldado, pues a tu lado, está el príncipe Jesús;
Él con su gracia te sostiene, y con potencia sin igual
Su brazo extiende y te defiende, en esta lucha contra el mal.

2. ¡A combatir!, marchad con fiel resolución
en pos de Cristo, vuestro Capitán,
henchido el corazón de varonil ardor
y derrotar las huestes de satán.

3. Al Rey de Reyes, nuestro Salvador Jesús
Honor y Gloria, todos tributad,
Pues ya los suyos, gozan de su plenitud
Y pronto reinará la santidad.`
  },
  {
    number: 6,
    title: 'A CUALQUIER PARTE SIN TEMOR IRÉ',
    lyrics: `1. A cualquier parte sin temor iré,
Si Jesús dirige mi inseguro pie,
Sin su compañía todo es turbación
Pero si Él me guía no tendré temor.

CORO:
Con Jesús, por doquier sin temor iré,
Si Jesús me guía nada temeré.

2. Con Jesús por guía donde quiera voy,
Porque su camino aprendiendo estoy;
Y aunque padre y madre me hayan de faltar
Él yo sé que nunca me abandonará.

3. Si por el desierto mi camino va,
Un seguro albergue no me faltará;
Pues a quien yo sirvo con filial amor
Es al Dios Bendito que Jacob guió.`
  },
  {
    number: 7,
    title: '¿A DONDE IRÉ?',
    lyrics: `1. Viviendo aquí, en el mundo de maldad
Nunca podréme confortar,
Duro es luchar, con toda tentación
A donde iré sin ti Señor.

CORO:
¿O donde iré, a donde iré Señor?
Dónde encontrar asilo y paz,
Yo necesito, un gran amigo fiel
A donde iré sin ti Señor.

2. Hay quienes son muy llenos de bondad,
Y a los que tanto amo yo,
Más cuando anhelo el celestial maná
A quien iré sino al Señor.

3. Aunque rodeado, estoy de amigos mil
Busco palabras de mi Dios,
Y cuando llegue de mi vida el fin
A donde iré sino al Señor.`
  },
  {
    number: 8,
    title: '¿A DONDE VOLVERÉ?',
    lyrics: `1. ¿A dónde volveré? mis ojos, ¡Oh, Señor!
Para implorar ayuda,
De quién sino de ti sustento me vendrá,
En horas de aflicción.
En sombras o en luz envuelto en la inquietud
Si oro me sustentas
En paz o en aflicción La mano de mi Dios,
Me da seguridad.

CORO:
Dame tu mano, Toma la mía, Dios amado,
Cuando estoy débil Se hace más fuerte tu Poder
Tu compañía, Y tu calor, Divino Amado,
Me lleva al Cielo Donde un día le veré.

2. Riquezas y poder Fama y celebridad
Rasguñaban mis manos Tratando de alcanzar
Lo que quería lograr Como un profundo ideal
Pero al mirarte a ti De pronto comprendí
Que estaba equivocado
Un mundo descubrí Más allá de la cruz
Donde sangró tu mano.`
  },
  {
    number: 9,
    title: 'A JESUCRISTO VEN SIN TARDAR',
    lyrics: `1. A Jesucristo ven sin tardar;
Que entre nosotros hoy Él está,
Y te convida con dulce afán
Tierno diciendo: “Ven”.

CORO:
¡Oh! Cuán grata nuestra reunión,
cuando allá, Señor, en tu mansión,
contigo estemos en comunión,
gozando eterno bien.

2. Piensa que Él sólo puede colmar
Tu triste pecho de gozo y paz;
Y porque anhela tu bienestar,
Vuelve a decirte: “Ven”.

3. Su voz escucha sin vacilar,
Y grato acepta lo que hoy te da;
Tal vez mañana no habrá lugar;
No te detengas, ven.`
  },
  {
    number: 10,
    title: 'A LAS ARMAS',
    lyrics: `1. A las armas soldados de Cristo
Del Maestro marchemos en pos
Cada cual en su puesto esté listo
A luchar por el Reino de Dios.

CORO:
Un clamor ha venido del monte,
Un clamor ha llegado del mar,
Un clamor del lejano horizonte
Y ellos todos parecen clamar.

2. Respondamos con voz encendida
A salvarnos nos manda Jesús
La verdad, el camino y la vida,
El amor, la justicia y la luz.

3. Nuestras culpas y culpas ajenas
Nos sumieron en la esclavitud,
Quebrantar las pesadas cadenas,
Con el yugo que inspira Jesús.

4. Redimidos de la servidumbre
Libertarnos del yugo del mal
Anhelemos en subir a la cumbre
Hacia el fúlgido sol celestial.`
  },
  {
    number: 11,
    title: 'A LUCHAR SIN TEMOR',
    lyrics: `1. A luchar sin temor siempre iremos,
Pues victoria nos dará Jesús
Hoy Hermanos sigamos esta senda,
Que trazada nos dejó Cristo en la cruz.

CORO:
Y allá Jesús nos dará Corona,
Si hasta el fin soy fiel en su camino
Y sé que al fin de mi carrera
Con Jesús allá viviré por la eternidad.

2. Tras el bello Estandarte avancemos,
A la rica mansión sin igual.
Proclamemos al mundo perdido,
Predicando gratas nuevas al hombre ya.

3. Valeroso Jesús nos convida,
El autor de la Paz y el Deber,
Recorramos esta senda celeste,
Vamos pronto mis Hermanos a vencer.

4. Y aunque rujan las huestes malignas
A mi lado Jesús estará,
Quién por siempre ganó la batalla,
Preparado con Jesús iré allá.`
  },
  {
    number: 12,
    title: 'A MI MADRE',
    lyrics: `1. Hoy vienen a mi mente
Los recuerdos del ayer.
Mi madre a quien yo daba
Tantas penas y dolor.
Y ahora que se ha ido
Y no tengo más su amor,
Quisiera yo decirle… la veré.

CORO:
Allá yo la veré, recuerdo su oración.
Este mensaje dile al Salvador.
Dile que allí estaré y el Cielo gozaré
Si, dile a mi Madre allí estaré.

2. Aunque desobediente,
Ella siempre me amó
Paciente, bondadosa
Con cariño me enseñó
Y todos mis dolores
Y placeres compartió.
¡Oh! Dile que en el Cielo la veré.

3. Pródigo y errante,
De su lado me aparté.
Y a su amante corazón
De pena desgarré.
De día y de noche,
Siempre oró a mi favor.
¡Oh! Dile que en el Cielo la veré

4. Un día que a su lecho
Presuroso yo acudí.
Llamábame a su lado,
Pues estaba por partir.
Postrado de rodillas,
Convertirme prometí.
¡Oh! Dile que en el Cielo la veré.`
  },
  {
    number: 13,
    title: 'A PASOS AGIGANTADOS',
    lyrics: `1. A pasos agigantados, se acerca ya
La Venida de Cristo.
Ansiamos alegre ese día
Cuando Jesucristo, su iglesia levante,
Señales se ven en el Cielo.
Diciéndole al mundo, que el tiempo es cumplido.
Los Hijos de Dios que le esperan,
Alzando sus manos, a Él cantarán.

CORO:
¡Gloria al Rey!, ¡Gloria al Rey!
¡Gloria al Rey que vive!
¡Gloria al Rey!, ¡Gloria al Rey!
¡Gloria al mi, Salvador!

2. Con voz de Arcángel y mando,
Jesús de los Cielos aparecerá
Al son de trompetas en las nubes
Los muertos en Cristo resucitarán.
Será majestuoso el encuentro,
Cuando en su Gloria loemos su Nombre,
Tomados todos de las manos,
Con los brazos en alto a Él cantarán.`
  },
  {
    number: 14,
    title: 'A PREPARARNOS MORADAS',
    lyrics: `1. A prepararnos moradas,
Fuiste a la Patria querida.
A gozar de tu hermosura
En tu segunda venida.

CORO:
Heme aquí, Señor te espero,
Mi alma de anhelo henchida.
A gozar de tu hermosura
En tu segunda venida.

2. De peligros y temores
Está mi alma combatida.
Porque el tiempo cerca espera
De tu segunda venida.

3. Mientras lejos permaneces
Mi alma de anhelo henchida.
Acerca Señor el día
De tu segunda venida.

4. Allá en las nubes viene
El autor de nuestras vidas,
Con sus santos y sus ángeles
En tu segunda venida.`
  },
  {
    number: 15,
    title: 'A TI ALMA',
    lyrics: `1. A ti alma te digo despierta
No desoigas de Cristo el llamado.
Hace tiempo Él golpea tu puerta
Y te dice abandona el pecado.

CORO:
Ven, pues, que a beber te llama
Agua de la viva fuente.
No esperes el mañana,
Hoy te invita Jesús dulcemente.

2. Él te quiere arrancar de los vicios
Y tenerte por su hijo amado.
Por tu alma llegó al sacrificio
Por tus culpas Él fue crucificado.

3. No le dejes en vano el llamar.
Hoy mismo ábrele tu corazón.
No le hagas más tiempo esperar.
Hoy recibe de Cristo el perdón.

4. Pecador no desprecies su amor,
Hoy acude a lavarte en su sangre.
No deseches a tu Salvador.
De limpieza tu alma tiene hambre.`
  },
  {
    number: 16,
    title: 'A TODO EL MUNDO',
    lyrics: `1. A todo el mundo predicaremos,
La gran Palabra del Salvador,
Para que todos crean en Cristo
Y así se limpien el corazón.

CORO:
Clama la sangre de Jesucristo
Y hallarás paz,
Ven a la fila del Evangelio
Y encontrarás la felicidad.

2. Ya es hora que todo el mundo
Mire la cruz de nuestro Señor,
Sepan las almas que con su sangre
Él lavará al vil pecador.

3. Cuando tú aceptes a Jesucristo,
Serás feliz en lo terrenal,
Y cuando mueras en esta tierra,
La vida eterna recibirás.

4. Y cuando Cristo venga a esta tierra
Tú en su escolta también vendrás
A establecer la paz verdadera
Que ser humano no la dará.`
  },
  {
    number: 17,
    title: 'ACOGIDA DA JESÚS',
    lyrics: `1. Acogida da Jesús,
Créelo, pobre pecador.
Al que en busca de la luz,
Vaga ciego y con temor.

CORO:
Volveremos a cantar
Cristo acoge al pecador;
Claro hacedlo resonar,
Cristo acoge al pecador.

2. Ven, con Él descansarás,
Ejercita en Él la fe.
De tus males sanarás;
A Jesús tu amigo ve.

3. Hazlo, porque así dirás:
Ya no me condenaré;
Ya la ley no pide más,
La cumplió Jesús, lo sé.

4. Acogerte prometió
Date prisa en acudir.
Necesitas, como yo,
Vida que Él te hará vivir.`
  },
  {
    number: 18,
    title: 'ACUÉRDATE CUANDO EN EL MUNDO',
    lyrics: `1. Acuérdate cuando en el mundo
A satanás le servías
Sin cuidar de tu Corona
Que el Cordero le tenía.

CORO:
Tú eres mi hijo y no te pierdas
Para que tengas tu galardón,
Y yo cumplirte lo prometido
Por la limpieza del corazón.

2. Ya está cerca mi venida,
Velad con mucha oración.
Retén lo poco que tienes
No entres en tentación.

3. Tú eres mi hijo amado
Yo soy tu fiel Pastor.
Dejad las cosas del mundo
Y conocerás mi amor.`
  },
  {
    number: 19,
    title: 'ADELANTE, CRISTO LLAMA',
    lyrics: `1. Adelante, Cristo llama,
Aguerrida juventud,
Nuestras fuerzas hoy reclaman
Ya del sueño a despertar.
En la tierra su presencia
Dios se va a manifestar
Salgamos con diligencia
Su gran Reino a proclamar.

CORO:
Y la corona de vida
Nos dará allá el Señor
En esta Patria querida
Al que salga vencedor
Esa fogosa batalla
Dios con nosotros ha de estar
Desatar todas las vallas
Romperemos hasta triunfar.

2. Sufrir por Cristo es grandioso,
Morir por Él es triunfar
Hoy luchemos sin reposo,
Hasta el Reino arrebatar,
Nuestras fuerzas no vacilen
En lidiar con altivez.
Dios glorifíquese en Chile,
Como en Pentecostés.

3. Oh Señor, infunde aliento
Haz tu iglesia estremecer,
En un gran avivamiento
Llénalos de tu Poder,
Con la llama encendida
De aquel gozo arrobador
Salgamos con diligencia
A salvar al pecador.`
  },
  {
    number: 20,
    title: 'ADELANTE, JUVENTUD',
    lyrics: `1. Adelante, Juventud, vamos todos a predicar
Con Jesús por capitán nuestras fuerzas crecerán
Hoy luchemos sin temor a las huestes de Satán
Jesucristo al frente va la victoria nos dará.

CORO:
Coro y Juventud la Biblia hay que tomar
Panderos y Guitarras debemos de llevar,
Coro y Juventud la Biblia hay que tomar
Panderos y Guitarras debemos de tocar.

2. Joven, deja ese vivir, entra pronto a la verdad
Jesucristo quiere darte la felicidad
Ven, no le desprecies, ven a la verdad
Con Cristo en tu vida gozo, paz y amor tendrás.

3. Cristo dice en su palabra yo soy tu fiel Pastor
Marchad con alegría cantando con amor,
Pronto, pronto sonará la trompeta de Jehová
Y Cristo de los cielos por tu alma bajará.

4. Celebremos este día con gozo en el corazón
Dando gracias al Señor por brindarnos este don,
De aceptar el Evangelio y ser de esta Misión
Y anunciando por las calles que en Jesús hay salvación.`
  },
  {
    number: 21,
    title: 'ADELANTE, VAMOS LUCHANDO POR JESÚS',
    lyrics: `1. ¡Adelante! Vamos luchando por Jesús.
Quien en su amor ha muerto en la cruz.
Caminemos siempre en divina luz.
Adelante sin temor.

CORO:
¡Despertad!, ¡Despertad! y pelead con valor.
¡Con Jesús!, ¡Con Jesús ¡tendremos victoria.
¡Adelante, vamos! con el Salvador.
A salvar del mal a todo pecador.
Proclamad perdón por su inmenso amor
Adelante, sin temor.

2. ¡Adelante, vamos! Dejando todo mal,
Jesucristo solo nuestro ideal
Preparando a todos para el día final
En el nombre del Señor.

3. ¡Adelante, vamos! Espera el galardón.
Al que venciere, Dios le dará el Don
De la vida eterna, sin más tentación;
Adelante, sin temor.

4. ¡Adelante, vamos! Jesús el capitán
Nos conducirá, pasando el Jordán,
a la tierra prometida de Canaán;
Entraremos sin temor.`
  },
  {
    number: 22,
    title: 'ADIÓS, MIS HERMANOS',
    lyrics: `1. Adiós, mis hermanos, yo voy a dejaros
y seguir la batalla en otra ciudad,
más quiero animaros a ser valerosos
luchando por Dios contra toda maldad.

CORO:
Partiremos de aquí, más allá nos veremos
Delante del Trono de nuestro Señor
Por siglos sin fin nunca más separarnos
Morando con Cristo en eterno esplendor.

2. Adiós, mis amigos, el deber ya me toca
Y tengo que irme sirviendo al Señor,
Y es mi oración que el Maestro os bendiga
Guardándoos siempre en su santo amor.

3. Adiós, pecadores, yo siento dejaros
Porque todavía estáis lejos de Dios,
Mas aún hay tiempo si queréis entregaros
En mano de aquel que os quiere salvar.`
  },
  {
    number: 23,
    title: 'ADIÓS, PUEBLO',
    lyrics: `1. Adiós, pueblo cristiano, ya nos vamos
Dando gracias, al bendito Salvador
Y rogando al Señor que nos bendiga
Y nos colme de su gracia y de su amor.

2. Adiós, hermanos cristianos, ya nos vamos
A cumplir del Señor esta misión,
Predicando a todo el mundo el Evangelio
Y anunciando que en Cristo hay Salvación.

3. Adiós, miembros que componen esta Iglesia,
Los probandos y en plena comunión,
Y hoy queremos con gozo despedirnos
Y abrazándoles con todo el corazón.

4. Adiós, pueblo obrero redimido,
Por la sangre que Cristo derramó
Y luchando en el mundo obtendremos
La corona que Cristo prometió.

5. Por fin hoy rogamos mis hermanos,
Que seáis fieles luchando con anhelo,
Que el Cordero de Dios ha prometido
Una herencia en el Reino de los Cielos.`
  },
  {
    number: 24,
    title: 'ADORO A DIOS',
    lyrics: `1. Cuando recuerdo el día, que me salvó el Señor
puedo decir con júbilo, ¡Hoy ya libre soy!
Todo lo hizo por mí, en una cruz murió,
Y con sangre carmesí la redención me dio;
El rescate, pagó por mí.

CORO:
¡Adoro a Dios, exalto a Dios!
Él es el dueño de mi vida,
Ya viene, en las alturas,
Jesús arrebatar a su Grey.

2. No debes olvidar que también vino por tí,
No tendrás el perdón, si no vienes a él,
Él borra tus pecados, te deja en libertad,
Y junto a los salvados, a Cristo esperarás.
¡Y saltarás de júbilo!
Al encuentro del Señor.`
  },
  {
    number: 25,
    title: 'AL PECADOR CRISTO LLAMA',
    lyrics: `1. Al pecador Cristo llama.
Pues no ha terminado aún su amor.
Él no quiere que las almas
Sumergidas mueran en perdición.

CORO:
Acudid todos los seres tristes
Pronto, venid, Jesús insiste.
Sólo en él tendrá pleno perdón.
Todo aquel que le quiera aceptar
Sólo en él hay salvación y libertad.

2. Otro ser no hay en quien pueda
Encontrar el hombre la Salvación.
Sólo Cristo dio su sangre
En la cruz por darnos la redención.

3. El que vaga por el mundo
Sin hallar reposo y tranquilidad.
Si a Jesús acude pronto,
Él le dará paz que fin no tendrá.

4. A Jesús, ¡Oh pecadores!
Venid pronto ya sin más demorar,
Pues el tiempo pasa luego,
Quizás, ya mañana, no llamará.`
  },
  {
    number: 26,
    title: 'ALABADO EL GRAN MANANTIAL',
    lyrics: `1. Alabado el gran manantial
¡Qué de sangre Dios nos mostró!
Alabado el Rey que murió,
Su pasión nos libra del mal.
Lejos del redil de mi Dueño
Vime mísero, pequeño, vil;
El Cordero sangre vertió;
Me limpia sólo este raudal.

CORO:
Sé que sólo así me emblanqueceré,
Láveme en su sangre Jesús
Y la nívea blancura me dé.

2. La punzante insignia llevó,
En la cruz dejó de vivir,
Grandes males quiso sufrir
No en vano empero sufrió.
Al gran manantial conducid
Que de mi maldad ha sido fin.
“Lávame” le puede decir
y nívea blancura me dio.

3. Padre, de ti lejos vagué,
Extravióse mi corazón.
Como grano mis culpas son
No con agua limpio seré.
A tu fuente magna acudí
Tu promesa creo, ¡Oh Jesús!,
La eficaz virtud de tu don
La nívea blancura me dé.`
  },
  {
    number: 27,
    title: 'ALCEMOS HERMANOS',
    lyrics: `1. Alcemos, hermanos, las manos caídas,
Los pasos en Cristo hemos de afirmar;
Jesús hoy nos llama a la paz y armonía,
Rencores pasados hemos de olvidar.

2. El fiero enemigo quiere dividirnos,
Porque poco tiempo le queda que obrar,
Más bien, pues hermanos, seamos unidos
Rencores pasados hemos de olvidar.

3. Unidos a la cruz siempre hemos de estar,
Jesús nos limpió ya de culpa y pesar,
Delante del Padre que es nuestro abogado
Rencores pasados hemos de olvidar.

4. De fieles cristianos demos santo ejemplo,
Y nada perturbe nuestro caminar,
Porque ya estamos en los últimos tiempos
Rencores pasados hemos de olvidar.

5. Hoy nuestros delitos a Dios confesemos,
Viniendo a sus plantas las cargas dejad,
Y así la corona de vida obtendremos,
Rencores pasados hemos de olvidar.

6. De Cristo a las puertas está su venida,
Viniendo muy pronto sus hijos a buscar,
La llama del gozo esté siempre encendida,
Rencores pasados hemos de olvidar.`
  },
  {
    number: 28,
    title: '¡ALELUYA, GLORIA ALELUYA!',
    lyrics: `1. Cantad alegres, cantad a Dios
habitantes de toda la tierra
servid a Dios con alegría
venid a Dios con regocijo

CORO:
¡Aleluya, gloria aleluya!
¡aleluya, gloria aleluya!
¡oh, aleluya, gloria aleluya!
¡aleluya, gloria aleluya!

2. Reconoced que Jehová es Dios
Él nos hizo y no nosotros mismos
pueblo suyo, suyo somos
y ovejas de su prado.

3. Entrad a Dios con acción de gracias
por sus atrios con alabanzas
alabadle, bendecid su nombre
alabadle, bendecid su nombre.

4. Porque Jehová, Jehová es bueno
para siempre su misericordia
y su verdad por todas,
por todas las generaciones.`
  },
  {
    number: 29,
    title: 'ALLÁ EN LAS PLAYAS DE GALILEA',
    lyrics: `1. Allá en las playas de galilea
humildes hombres llamo el Señor
fuego inflamado por la Judea
la dulce llama de gran amor.

CORO:
Dulce Evangelio inmaculado
Del cual emana felicidad
Que de los cielos ha sido enviado
A dar al mundo la claridad.

2. Al dar Jesús su gran doctrina
con rapidez se dio a entender
y conmoviéndose la Palestina
al ver un nuevo amanecer.

3. De vida echo simiente
junto al lago de Zenazaret
bellas palabras de amor ardiente
por el profeta de Nazaret.

4. Quiero que me hagas noble y sincero
para en tu viña fiel trabajar
ser decidido, fiel mensajero
y tu Bandera en la cumbre alzar.`
  },
  {
    number: 30,
    title: 'ALLÍ EN LA CRUZ MI JESÚS MURIÓ',
    lyrics: `1. Allí en la cruz mi Jesús murió;
allí mi horrible maldad pagó.
Allí el remedio se aplicó.
A mi corazón.

CORO:
¡Gloria en las alturas!
¡Gloria en las alturas!
Yo soy lavado de mi maldad.
¡Gloria a mi Jesús!

2. Tan grandemente salvado soy.
Y con Jesús a los Cielos voy,
a su gran nombre alabanzas doy
de mi corazón.

3. Glorioso el nombre de mi Jesús
¡Que sufrimiento paso en la cruz!
A Él veré en refulgente luz.
¡Dichoso corazón!`
  },
  {
    number: 31,
    title: 'ALMA ESCUCHA A TU SEÑOR',
    lyrics: `1. Alma, escucha a tu Señor
a Jesús mi Salvador;
Él te dice con amor:
¿Me amas tú, oh pecador?

CORO:
¡OH! que bello y dulce es
el amor de mi Jesús;
el amor que de mí tuvo,
gratamente alabaré.

2. Vine al mundo por tu amor
preso estabas, te libré;
moribundo, te salvé
¿Me amas tú, oh pecador?

3. Vives tú por mi dolor,
de mi gracia gozarás
vida eterna, sí tendrás
¿Me amas tú, oh pecador?`
  },
  {
    number: 32,
    title: 'ANGELES BLANCOS',
    lyrics: `1. Si yo tuviera de la mañana
las raudas alas para volar.
Yo muy contento me trasladara
a las riberas de Canaán.

CORO:
Ángeles blancos me llevarían
a la presencia de mi Señor,
y yo con júbilo cantaría
con los salvados por su amor

2. Allí no hay llanto, no hay amargura,
allí no se sabe lo que es dolor,
allí todo es luz y alegría,
allí todo es amor.

3. Vestido blanco, palma y corona
cada uno de ellos visten allí,
y sé ahora que si soy fiel,
vestido blanco hay para mí.

4. Allí no hay llanto, no hay despedida,
allí nunca se dice adiós,
porque allí siempre reinaremos
junto a Cristo nuestro Señor.`
  },
  {
    number: 33,
    title: 'ANOCHE SOÑÉ.',
    lyrics: `1. Anoche soñé, con el Día Final
ese día, que pronto llegará,
allí los creyentes, se levantarán
al oír la trompeta final.

CORO:
Veo en Gloria bajando
Al Salvador
Ángeles van anunciando
la redención.
Siento alegría en mi alma,
al verme subiendo,
con los salvados por Cristo,
a su Mansión.

2. Los que se quedaron, confundidos están,
la ciencia no lo puede explicar;
los que decían creer, confundidos están
porque el tiempo de la Gracia terminó.`
  },
  {
    number: 34,
    title: 'BAJO LAS ESTRELLAS',
    lyrics: `1. Bajo de las estrellas,
donde anduvo mi Jesús,
en el Jardín de Getsemaní
donde luz no se vió,
Cristo se arrodilló
Cuando oró bajo el olivar.

CORO:
Bajo el Olivar, bajo el olivar,
fue mi Cristo a solas a orar.
Sea tu voluntad, oh Padre Celestial,
Cuando oró bajo el olivar.

2. cuando el Padre oró,
muy triste se sintió,
fue amarga la copa que él bebió
vino un ángel del cielo
y le reconfortó,
cuando oró bajo el olivar.

3. Siempre desea mi corazón
el amor que me dio
mi Jesús cuando oró en el jardín.
¡Gloria sea dada a él!
Mis culpas él llevó,
cuando oró bajo el olivar`
  },
  {
    number: 35,
    title: 'BENDITA HORA DE ORACION',
    lyrics: `1. Bendita hora de oración
que el contacto mundanal
elévame hasta la mansión
de mi buen Padre Celestial.
Huyendo toda tentación,
acudo al templo del Señor,
lleno de paz y bendición,
a orar allí con puro amor.

2. Bendita voz, Santa oración,
a quien escucha con bondad,
dirijo aquí mi petición
a Dios que es único verdad.
Confiado estoy en su atención.
a mi plegaria, mi clamor,
pues, ya me ha dado Salvación
y pruebas grandes de su amor.

3. ¡Oh Padre!, fuente de salud,
a tu gran nombre siempre honor.
Tu Reino venga, que tu luz
por todo esparza su fulgor.
Hoy danos tu pan celestial,
perdona nuestra tibia fé,
y guárdanos de todo mal
¡Oh, tú gloria eterno Rey!`
  },
  {
    number: 36,
    title: 'BIENAVENTURADO',
    lyrics: `1. Bienaventurado el que ama a Jesús,
bienaventurado el que vive su amor,
bienaventurado, bienaventurado,
el que tiene paz entre manos.
Bienaventurado el que ama a Jesús,
bienaventurado el que guarda su ley,
bienaventurado, bienaventurado,
el que ve a Jesús en sus hermanos.

CORO:
Y si una lágrima en tus ojos cayendo está
recuerda: Jesús la enjugará
Y si una lágrima en tus ojos cayendo está
recuerda: Jesús la enjugará.

2. Bienaventurado el que ama a Jesús,
bienaventurado el que guarda su amor,
bienaventurado, bienaventurado
el que ve a Jesús en sus hermanos.
Bienaventurado el que ama su ley,
bienaventurado el que vive su amor,
bienaventurado, bienaventurado
el que ve a Jesús en los ancianos.`
  },
  {
    number: 37,
    title: 'CAMINANDO',
    lyrics: `1. Caminando, caminando
por el mundo del dolor
dirigimos nuestros pasos
al Palacio del Señor.

CORO:
Vamos todos, vamos sí
a vivir con el Señor
adorando y alabando
para siempre al Salvador.

2. ¡Oh venid! y vuestras voces
con las nuestras pronto unid,
pecadores, y el consuelo
sempiterno recibid.

3. E estrecha nuestra senda
más Jesús el Salvador
nos sostiene y nos alienta
con su gracia y con su amor.

4. Caminando, caminando.
Sn mirar jamás atrás
y obtendremos la Corona
de la vida eterna.`
  },
  {
    number: 38,
    title: 'CANTAN LOS ANGELES CON DULCE VOZ',
    lyrics: `1. Cantan los ángeles con dulce voz
cantan los hombres con sonora voz.
Cristo vendrá nuestro Rey Salvador,
Cristo vendrá otra vez.

CORO:
Viene otra vez, viene otra vez,
en gloria viene al mundo otra vez.
Viene otra vez, viene otra vez,
él viene pronto a reinar.

2. Ved en la tierra, los aires y el mar
Grandes señales cumpliéndose ya,
todo indicando que pronto vendrá
Nuestro glorioso Señor.

3. Todos los muertos en Cristo saldrán
de sus sepulcros y alegres irán
para encontrar a su Rey vencedor,
Cristo vendrá otra vez.

4. Ven en las nubes, oh buen Salvador,
ven a la tierra gloriosa a reinar,
ven que tu iglesia te espera, Señor
Cristo, vendrá otra vez.`
  },
  {
    number: 39,
    title: 'CANTARE CANTARE DEL HERMOSO PAÍS',
    lyrics: `1. Cantaré, cantaré del hermoso País,
el lejano glorioso jardín,
donde ha de vivir el alma feliz.
Mientras vuelan los siglos sin fin.

2. ¡Oh, la patria del alma! en sueños se ve,
sus muros de jaspe y cristal
y cercano parece el bello Edén,
radiante con luz Celestial.

3. Y el árbol de vida florece allá
y corre el rió de amor;
y jamás en la Santa Ciudad entrará
ni la muerte ni amargo dolor.

4. ¡Oh, cuan dulce será en el Santo País!
pasadas las penas aquí.
volveremos a ser en la vida feliz,
que nos queda con Cristo allí.`
  },
  {
    number: 40,
    title: 'CANTARE LA MARAVILLA',
    lyrics: `1. Cantaré la maravilla
que Jesús murió por mí;
cómo allá en el calvario
dio su sangre carmesí.

CORO:
Cantaré la bella historia
de Jesús mi Salvador.
Y con Santos en la Gloria
a Jesús daré loor.

2. Cristo vino a rescatarme,
vil, perdido me encontró;
con su mano fiel y tierna
al redil Él me llevó.

3. Mis heridas y dolores
el Señor Jesús sanó;
del pecado y los temores
su poder me libertó.

4. En el rió de la muerte
el Señor me guardará,
en su amor tan fiel y fuerte.,
que jamás me dejará.`
  },
  {
    number: 41,
    title: 'CARIÑOSO SALVADOR',
    lyrics: `1. Cariñoso salvador,
huyo de la tempestad
a tu seno protector,
fiándome de tu bondad.
Sálvame, Señor Jesús.
De las olas del turbión
hasta el puerto de salud
guía mi pobre embarcación.

2. Otro asilo ninguno hay,
indefenso acudo a ti.
Mi necesidad me trae,
Porque mi peligro ví.
Solamente en ti, Señor,
creo hallar consuelo y luz;
vengo lleno de temor
a los pies de mi Jesús.

3. Cristo, encuentro todo en ti.
Y no necesito más,
caído, me pusiste en pie;
débil, ánimo me das.
Al enfermo das salud,
guía tierno al que no vé;
con amor y gratitud
tu bondad ensalzaré.`
  },
  {
    number: 42,
    title: 'CAUTIVO ERA DE SATAN',
    lyrics: `1. Cautivo era de Satán,
por mis maldades oprimido.
Perderme fue siempre su afán,
mas Cristo al fin me liberó.

CORO:
Diré a todos mi historia:
Feliz y libre estoy,
Feliz y libre estoy.
A Dios loor, a Dios loor,
por su gloriosa libertad.

2. Emancipado ya del mal
emprenderé divina lucha
con Cristo insigne General
invicto siempre yo seré.

3. Jesús Caudillo Inmortal
al mudo vino por librarnos
de la vil opresión del mal
y darnos dulce libertad.

4. después de lidia terrenal
el premio celestial aguarda
al vencedor quien vivirá
por siempre libre de maldad.`
  },
  {
    number: 43,
    title: 'COMISIONADO DEL SEÑOR',
    lyrics: `1. Comisionados del Señor
venimos a contar
que Jesucristo sangre dió
al mundo por salvar.
Atentos perseguimos hoy
tan importante fin
y pregonamos por doquier:
“Ya suena el clarín”.

CORO:
A proclamar:
“Muy cerca del reino está”
¡Aún más allá!
Henos aquí, oh pecador;
la voz de amor oíd.
Dejad el mal, volved al bien,
y vida recibid.

2. ¿Por qué más tiempo peligrar
tu alma inmortal?
Jesús el precio ya pagó
por todos, imparcial.
Del Cielo habla el Señor
con voz de gran poder,
andando salvación buscar,
su rostro para ver.

3. Con pocos días mas acá
y has de terminar
tu vida y tu trabajar,
y cuentas habrás de dar
Pués no demores mas: ¡oh! ven,
escucha, pecador:
Entrega ya tu triste ser
a Cristo, tu Señor.`
  },
  {
    number: 44,
    title: 'COMO EN AQUELLOS DÍAS TRISTES DE NOE',
    lyrics: `1. Como en aquellos días tristes de Noé
así vendrá el día del Señor Jesús.
Los hombres se burlaron de su severo juicio
Y vino el diluvio y todo terminó.

CORO:
Ciento veinte años predico Noé
diciéndoles a los hombres, que ya venia el fin;
cuando vino el día, que no quedó nadie.
Que ni quedó nadie y todo consumió.

2. Nunca ellos pensaron que ya venia el día
amargo y tenebroso para su triste ser,
desechando el mensaje que Dios les ofrecía
y se burlaron todos de su Santo poder.

3. Pero llegó el día amargo y tenebroso
y el mundo de tinieblas todo se obscureció,
corriendo por las calles como enloquecidos
en busca del arca, y la puerta se cerró.

4. Madres con sus hijos llorando amargamente
Golpeando a la puerta del arca de Noé:
ábrenos la puerta, ahora sí creemos
que ya viene el juicio de todo nuestro ser.`
  },
  {
    number: 45,
    title: 'COMO PODRE ESTAR TRISTE',
    lyrics: `1. ¿Cómo podré estar triste,
cómo entre sombras ir,
cómo sentirme solo
y en el dolor vivir?
Si Cristo es mi consuelo,
mi amigo siempre fiel,
si aún las aves tienen
seguro asilo en Él.

CORO:
Feliz cantando alegre,
yo vivo siempre aquí;
si Él cuida de las aves
cuidará también de mí.

2. Nunca te desalientes
oigo al Señor decir,
y en su Palabra fiado
hago al dolor huir.
A Cristo paso a paso
Yo sigo sin cesar,
Y todas sus bondades
Me dá sin limitar.

3. Siempre que estoy tentado
o que en la sombra estoy,
más cerca del Camino
y protegido voy.
Sin en mí la fe desmaya,
Y caigo en la ansiedad,
Tan solo Él me levanta
Me dá seguridad.`
  },
  {
    number: 46,
    title: 'CON BIENAVENTURANZA',
    lyrics: `1. Con bienaventuranza voy a alejarme
pidiendo a mis hermanos su santa oración
para que Jesucristo me cubra con su sangre
y así poder librarme del mundo pecador.

CORO:
Marcharé yo de aquí lejos me voy hermanos
clamando siempre a Cristo su santa protección
y que todos nosotros seamos fieles Cristianos
y pronto llegaremos al trono del Señor.

2. ya saben mis hermanos los que nos pide Cristo.
Prediquemos con fuerzas su evangelio de paz
para así las almas salgan del precipicio
dejando así los vicios y vengan a Jehová.

3. se ríen de vosotros, no importa mis hermanos
sufrir en este mundo por el Rey y Señor
recordemos siempre que murió por nosotros
lavándonos en la sangre que en la cruz derramó.

4. Caminemos juntos llevando como emblema
la fe en Jesucristo nuestro Rey Señor
para entrar triunfalmente al torno de la Gloria
y vivir para siempre sin pena ni dolor.`
  },
  {
    number: 47,
    title: 'CON EL ALMA ENTRISTECIDA',
    lyrics: `1. Con el alma entristecida
vengo a tí, mi Salvador
pues sentí tu gran ternura
y lo inmenso de tu amor.
Falsa paz ofrece el mundo,
Sólo tú me das solaz.
¡Oh, Jesús amparo mío!
fiel y pura mi alma haz.

CORO:
Yo creo sí, yo creo sí.
Jesús murió, murió por mí
y en la cruz vertida fue
su sangre carmesí.

2. Cristo mío, veo al mundo
que se aleja de mi Dios,
Veo al hombre despreciando
tus ofertas y tu voz.
Esa vía tan torcida
nunca más voy a seguir,
con tu ayuda, Jesús mío,
quiero para ti vivir.

3. Muy oscura fue la senda
por la cual me encaminé.
mas su tierno amor me trajo
y contrito me humille.
Heme, pues aquí a tus plantas,
¡oh, perdona mi maldad!
No desoigas mi plegaria,
Sálvame por tu bondad.`
  },
  {
    number: 48,
    title: 'CON GRAN GOZO Y PLACER',
    lyrics: `1. Con gran gozo y placer, nos volvemos hoy a ver
nuestras manos otra vez, estrechamos;
se contenta el corazón, ensanchándose de amor
todos a una voz a Dios, gracia damos.

CORO:
Bienvenidos, bienvenidos
los hermanos de aquí
nos gozamos en decir
bienvenidos, bienvenidos,
al volvernos a reunir, bienvenidos.

2. Hasta aquí Dios te ayudó, ni un momento te dejó
y a nosotros te volvió, bienvenido;
el Señor te acompaño, su presencia te amparó
del peligro te guardó, bienvenido.

3. Dios nos guarde en este amor para que de corazón
consagrados al Señor, le alabemos;
en la eterna reunión do no habrá separación
ni tristeza, ni aflicción, bienvenido.`
  },
  {
    number: 49,
    title: 'CON VOS BENIGNA TE LLAMA JESÚS',
    lyrics: `1. Con vos benigna te llama Jesús
invitación de puro amor.
¿por qué lo dejas en vano llamar?
¿sordo serás, pecador?

CORO:
Hoy te convida, hoy te convida,
Voz bendecida, benigna convídate hoy.

2. A los cansados convida Jesús,
con compasión mira el dolor;
tráele tu carga; te la llevará
bendeciráte el Señor.

3. Siempre aguardando, contempla a Jesús
¡tanto esperar!, ¡con tanto amor!,
hasta sus plantas ven, mísero, y trae
tu tentación, tu dolor.`
  },
  {
    number: 50,
    title: 'CONTENDAMOS, JOVENES',
    lyrics: `1. Contendamos, jóvenes, por la fe
aunque brame el mundo con satanás,
en la lucha nunca nos vencerán
pues Jesús nos guardará.

CORO:
Si sufrimos aquí reinaremos allí
en la gloria Celestial
Si llevamos la cruz por amor a Jesús
la corona Él nos dará.

2. Procuremos todos la santidad
Sin la cual ninguno verá al Señor
Gozo, paz y eterna felicidad
Cristo da el vencedor.

3. No seamos tibios de corazón
ni dejemos nunca el primer amor;
mantengamos firme la profesión
de la fe del Salvador.`
  },
  {
    number: 51,
    title: 'CONSAGRARME TODO ENTERO',
    lyrics: `1. Consagrarme todo entero,
alma, vida y corazón,
es el intimo deseo
que hoy me anima, buen Señor.

CORO:
Heme aquí, Señor, a tus plantas hoy,
consagrando a tu servicio todo lo que soy.

2. Al contrito has prometido
que de ti no arrojarás,
hoy propicio sé conmigo
y tu Espíritu me das.

3. Confesando mis pecados,
que sin numero han de ser;
y arrojando todo a un lado,
a servirte aprenderé.

4. Mi canción constante sea,
y mi sola inspiración
proclamar la dicha eterna
del que vive para Dios.

5. ¡Cuánta paz inunda mi alma!
al pensar que suyo soy
y que pronto en las moradas
estaré con mi Señor.`
  },
  {
    number: 52,
    title: 'COROS FIELES A CRISTO',
    lyrics: `1. Nosotros Coros fieles
de Cristo nos llamamos
dispuesto todos estamos a cumplir
con la promesa que un día hicimos
de serles fiel hasta morir.

CORO:
Venid todos a mí
nos dijo un día el Salvador
que yo daré la paz
para tu triste corazón.
Venid todos a mí
nos dijo un día el Salvador
que yo limpiaré
a aquel que quiera el corazón.

2. Pues, ya nosotros
alegremente vamos a trabajar
allá en la obra del Bendito Salvador
y a todo el mundo predicaremos
que Jesucristo nos salvó
también diremos a todo el mundo
que con su sangre Él nos limpió.

3. Mas los que quieran
con nosotros así seguir
por el camino angosto que trazó el Señor
todos odiados tendrán que ser
por los contrarios de su amor
y aborrecidos de todo el mundo
porque adoramos al Salvador.

4. Jesucristo ha prometido ayudar
a los tristes y cansados de vagar
y conducirnos a un buen camino
donde la paz os esperará
y así guiarnos hasta la Gloria
donde más llanto allí no habrá`
  },
  {
    number: 53,
    title: 'CRISTO BUSCA LIMPIOS CORAZONES',
    lyrics: `1. Cristo busca limpios corazones
que le sirvan siempre con fidelidad;
que a los pecadores insten con fervor
que se vuelvan al Señor de su maldad

CORO:
Id a trabajar allá en los campos del Señor
que para la siega se presentan blancos hoy;
Oh, files siervos de Dios,
a quién te debéis todo honor
oíd su voz, salid a trabajar.

2. Labios puros Cristo necesita
que con gozo anuncien plena Salvación:
lenguas consagradas solo a su servicio
que proclamen al cautivo Redención.

3. Cristo busca manos bien dispuestas
para trabajar con buena voluntad
Siembras ya maduras piden vuestra ayuda
las doradas mieses pronto cosechar

4. Vidas sanas el señor necesita
que a los pecadores muestren su poder,
libres de ansiedad, en Jesús confiadas
y que pueda de ellas siempre disponer.`
  },
  {
    number: 54,
    title: 'CRISTO NUESTRO JEFE',
    lyrics: `1. Cristo, nuestro jefe, nos lleva a la lid
nunca cederemos si Él nos dice: Id.
En su justa causa se suele ignorar,
más, le seguiremos fiel

CORO:
¡Adelante, es la orden del Señor!
¡Adelante, vamos sin temor!
¡Adelante, canta ya su Grey!
La victoria es cierta con el Rey.

2. La furiosa lucha larga no será,
y a los vencedores, nos congregarán;
donde cantaremos un Himno Triunfal.
Sí, le seguiremos fiel.

3. Nuestro Estandarte luce por doquier
con Poder y gloria siempre se ha de ver
Cristo, nuestro jefe al mundo venció.
Sí, le seguiremos fiel.

4. Chile para Cristo, Cristo para él,
nuestras peticiones siempre han de ser
y la gran victoria nuestro Dios dará.
Sí, le seguiremos fiel.`
  },
  {
    number: 55,
    title: 'CRISTO QUIERE QUE YO BRILLE',
    lyrics: `1. Cristo quiere que yo brille
brillando para Él;
y que yo dé a conocer
su amor y gran poder.

CORO:
Brillando, brillando
Queremos que Chile brille;
brillando, brillando
Chile pedimos a Dios.

2. Somos pequeños nosotros
mas grande es el Señor;
haremos lo que podamos
en bien de la Nación.

3. Aunque somos pequeños
nos oirá el Señor
cuando pidamos por Chile
con intenso clamor.

4. Es un deber del Cristiano,
según nos aconsejó
el gran apóstol San Pablo,
orar por la Nación.`
  },
  {
    number: 56,
    title: 'CUAL CUIDAD',
    lyrics: `1. Cual cuidad sobre un monte edificada
no se puede esconder
que la luz de Dios sea en ti reflejada
haz tu luz resplandecer.

CORO:
Haz tu luz resplandecer
haz tu luz resplandecer
brille Cristo solamente
en nuestras vidas
haz tu luz resplandecer.

2. Cuídate que el mundo no se asombre
por un mal paso que en ti vea
no deshonres de Jesús el Santo nombre
haz tu luz resplandecer.

3. Caminando tú por plazas o por calles
en el hogar, o en el taller
digno ejemplo en un Cristiano en ti se halle
haz tu luz resplandecer.

4. Del Señor alzad en alto la bandera
Hasta vencer o morir
Sed cristiano hasta el fin de la carrera
Haz tu luz resplandecer`
  },
  {
    number: 57,
    title: 'CUAL FARO EN EL MAR',
    lyrics: `1. Cual faro en el mar, cual plácida armonía
es la esperanza del bendito día
en que el Señor vendrá con su excelsa compañía
descendiendo en gloriosa majestad.

CORO:
Ven Señor, ven Señor,
Ven Señor, con los tuyos a reinar,
Que a tu grata aparición
Cesará nuestra aflicción,
Ven Señor, con los tuyos reinar.

2. Cual iris de paz en tempestad airara
es para el aire, de luchar cansada,
la vuelta del Señor, a si iglesia bien amada
a inundarla de lumbre celestial.

3. Cual fuerte clarín que a batallar con vida
es de Jesús la grata y bendecida,
promesa de volver, para dar la bienvenida
a sus ciervos que pronto le verán.

4. ¡Oh!, ven sin tardar, Dios de los altos cielos,
ven a cumplir del alma los anhelos.
¡Oh, pronto ven, Jesús! y pon fin a los desvelos
de tus  ciervos que claman con afán.`
  },
  {
    number: 58,
    title: 'CUAL NOCTURNO Y DULCE SON',
    lyrics: `1. Cual nocturno y dulce son que en el monte suena
del que busca con amor su perdido bien
siempre viene desde allá donde Cristo reina
voz que dice con afán: a cada oveja, ven.

CORO:
Ven, tras mí, siguiendo mis pisadas;
Del redil la puerta franca está;
Oye, pues, la voz del que te llama;
Ven a él y el Cielo gozarás.

2. Tú que vas errante hoy lejos del rebaño,
tras un mundo engañador, No te perderás,
del pastor amante y fiel, ¿no oyes el reclamo?
Deja ya tu mal hacer y feliz serás.

3. El demonio tentador se transforma en ángel
y si ya tu mal logró burlarse de ti; pero cerca esta Jesús
el pastor amante, que con fiel solicitud
ven, te dice a mí.`
  },
  {
    number: 59,
    title: 'CUAN GLORIOSA SERÁ LA MAÑANA',
    lyrics: `1. Cuán gloriosa será la mañana
cuando venga Jesús el Salvador;
las naciones unidas como hermanas
bienvenida daremos al Señor.

CORO:
No habrá necesidad, de la luz ni el resplandor
Ni el sol dará su luz, ni tampoco su calor
Allí llanto no habrá, ni tristeza ni dolor;
Porque entonces Jesús el Rey del cielo
Para siempre será el Consolador

2. Esperamos la mañana gloriosa
para dar la bienvenida al Dios de amor
donde todo será color de rosa
en las santa presencia del Señor.

3. El Cristiano fiel y verdadero
y también  el obrero de valor
y la iglesia, esposa del Cordero,
estarán en los brazos del Señor.`
  },
  {
    number: 60,
    title: 'CUAN GLORIOSO ES EL CAMBIO OPERADO EN MÍ SER',
    lyrics: `1. Cuán glorioso es el cambio operado en mí ser
viniendo a mi vida el Señor
hay en mi alma que yo ansiaba tener
la paz que me trajo su amor.

CORO:
El vino a mi corazón.
El vino a mi corazón.
Soy feliz con al vida que Cristo me dio
Cuando Él vino a mi corazón.

2. Ya no voy por la senda que mal me trazó
yo sólo encontré confusión
mis errores pasados Jesús los borró
cuando Él vino a mi corazón.

3. Ni una sombra de duda oscurece su amor
amor que me trajo el perdón
la esperanza que aliento debo al señor
Cuando él vino a mi corazón.`
  },
  {
    number: 61,
    title: '¡CUAN GRANDE ES EL!',
    lyrics: `1. Señor mi Dios, al contemplar los cielos,
el firmamento y las estrellas mil
al oír tu voz, en los potentes truenos
y ver brillar el sol en su Cénit.

CORO:
Mi corazón entona esta canción;
¡Cuán grande es El, cuán grande es El!
Mi corazón entona esta canción;
¡cuán grande es El, cuán grande es El!

2. Al recorrer los Montes y los Valles
y ver las bellas flores al pasar
al escuchar el canto de las Aves
y el murmurar del claro manantial.

3. Cuando recuerdo del Amor Divino
que desde el Cielo al Salvador envió.
Aquel Jesús que por salvarnos vino
y en una cruz sufrió por mí y murió.

4. Cuando el Señor me llame a su presencia
al dulce Hogar, al Cielo de esplendor,
le adoraré cantando la grandeza
de su Poder y su infinito Amor.`
  },
  {
    number: 62,
    title: 'CUAN HERMOSO SON LOS PIES DEL FIEL CRISTIANO',
    lyrics: `1. Cuán hermosos son los pies del fiel Cristiano,
que cumple el mandato de Jesús;
va a las gentes sumergidas en tinieblas,
llamándolas a la luz.

CORO:
Los que sirven a Jesús
y son fieles a su Rey,
“ven buen Siervo y fiel” les dirá.
Sobre poco has sido fiel
sobre mucho te pondré,
y en mis brazos tú entrarás.

2. Despertad de vuestro sueño, mis
Hermanos,
salid levantando vuestra voz;
predicad a todo el mundo el Evangelio
de la Salvación de Dios.

3. No nos predicamos a nosotros mismos;
hablamos de Cristo y su Cruz;
Dios que resplandece en nuestros
Corazones
también quiere daros luz.

4. Satanás a los incrédulos e impíos
cegó y andan en oscuridad;
y debemos proclamar las gratas nuevas
que quiten su ceguedad.`
  },
  {
    number: 63,
    title: 'CUANDO ANUNCIE EL ARCANGEL',
    lyrics: `1. Cuando anuncie el Arcángel
que más tiempo no habrá,
y aclare esplendoroso el día final;
cuando todos los salvados
se congreguen ante Dios,
entre ellos yo también tendré lugar.

CORO:
Cuando el ángel pase lista,
cuando el ángel pase lista,
cuando el ángel pase lista,
al llamar mi nombre yo responderé.

2. Resucitarán gloriosos
los que han muerto en Jesús
las delicias del Paraíso a gozar;
y triunfantes entrarán
en las Mansiones de la luz
para mi también habrá un dulce hogar.

3. Trabajemos para Cristo
anunciando su amor
mientras dure nuestra vida terrenal
y al fin de la jornada
con los salvos por Jesús
entraremos en la Patria Celestial.`
  },
  {
    number: 64,
    title: 'CUANDO COMBATIDO POR LA ADVERSIDAD',
    lyrics: `1. Cuando combatido por la adversidad
creas ya perdida tu felicidad,
mira lo que el cielo para ti guardó,
cuenta las riquezas que el Señor te dio.

CORO:
Cuenta las promesas de tu Dios,
mira las riquezas de su amor.
Por los ojos donde Cristo está,
Y tu mente guarde la divina paz.

2. ¿Andas agobiado por algún  pesar?
¿Duda te párese tu cruz de llevar?
Cuenta las promesas del Señor Jesús
y de las tinieblas nacerá la luz.

3. Cuando de otros veas la prosperidad
y tus pies claudiquen tras de su maldad,
Cuenta las riquezas que tendrás por fe
donde el oro es polvo que hollara tus pies.

4. Aunque grande sea tu aflicción aquí,
no te desalientes; Dios está por ti;
ni a su propio hijo no se reservó.
Aun veras riquezas que ojo nunca vio.`
  },
  {
    number: 65,
    title: 'CUANDO DIOS A LAS HUESTES DE ISRAEL',
    lyrics: `1. Cuando Dios a las huestes de Israel
las mandó al desierto a vagar,
caminaron guiados por aquél
que les prometió llegar.

CORO:
Y en el fuego de noche fue.
Y en la nube de día está
el Señor, que libró
de la cruel esclavitud,
devolviendo la libertad
a su pueblo que escogió
que a la voz de su gran Libertador
venció sin ningún temor.

2. El mar Rojo su paso impidió.
Mas el agua sumisa al Señor
en silencio ancha vía les formó
y pasaron sin temor.

3. Como un barco en una tempestad
fueron marchando sin ningún compás,
pero Dios les mostró su gran bondad
no dejándoles jamás.

4. Y así por el mundo el hombre va
que camina a la Patria Celestial;
Pan ni Agua jamás le faltarán
pues Jesús es el manantial.`
  },
  {
    number: 66,
    title: 'CUANDO EL VERBO TERMINÓ',
    lyrics: `1. Cuando el verbo termino
de formar la creación,
formo al hombre y la mujer
y en ella los coloco
sin tener que trabajar
adorando solo a Dios,
y por desobedecer
la muerte se ejecutó.

CORO:
Oh, que triste es el morir,
oh que dicha que dicha es el pensar.
Ven que Cristo nos redime
Para su gloria reinar.

2. Dios al mundo ilumino
con su luz esdrújular
con estrellas, luna y sol
a toda la humanidad
de su árbol prohibió
que no pudieran probar.
Cuando el Señor los llamó
Desnudos los encontró.

3. La tierra desobedeció
Con todo el reino animal.
El hombre que la labró
Iba espinas a cosechar
En la frente de su sudor
Hubo de comer su pan
Y así pagar su pena
Todo mísero mortal.

4. La serpiente que engañó
a nuestro Padre Adán
cantó gloria en la mujer
para el infierno ganar.
Más un hijo que engendró
Una virgen en Belén
Su cabeza quebrantó
Para nunca más volver.`
  },
  {
    number: 67,
    title: 'DAR LOOR A DIOS',
    lyrics: `1. Dad loor a Dios, himnos elevad
Alabando su bondad;
Canta de Jesús, pobre pecador,
Canta sí, su gran amor.
Jesucristo descendió
De los cielos a Belén
Nuestra paz allí nació;
Nuestra dicha, luz y bien.

CORO:
¡Oh bendito Dios!
Gloria a Ti, Señor,
Por Jesús el Salvador.

2. Dad loor a Dios, himnos elevad
Alabando su bondad;
Canta de Jesús, pobre pecador,
Canta sí, su gran amor.
Por venir a padecer,
A los ángeles dejó
Y nacido de mujer
Con los hombres habitó.

3. Dad loor a Dios, himnos elevad
Alabando su bondad;
Canta de Jesús, pobre pecador,
Canta sí, su gran amor.
En el patíbulo cruel
Dio su vida celestial
Porque tenga luz en él
Todo mísero mortal.`
  },
  {
    number: 68,
    title: 'DE JESÚS',
    lyrics: `1. De Jesús el mandato tenemos
Que hacia el mundo avancemos a dar
Su evangelio verás que es consuelo
Para el cual nos habrá de salvar.

CORO:
Saludemos a la nueva alborada
Inundando pechos de amor
Nos dará en su mansión estrellada
La promesa de un mundo mejor.

2. La dulzura de nuestras canciones
En cada alma se vaya a verter
Ofrezcamos los brazos piadosos
Al hermano que veamos caer.

3. Ante nuestros dolores pongamos
La bondad, el amor, el deber
Y aunque sepa morir el Cristiano
Deberá combatiendo caer.

4. Como alas tendida al viento
Nuestras almas irán al ideal
Abrigando al desnudo y sediento
La corona Jesús nos dará.`
  },
  {
    number: 69,
    title: 'DE JESUCRISTO SOMOS CORISTAS',
    lyrics: `1. De Jesucristo somos coristas
Bien preparados para luchar,
Llevando al frente al Fiel Amigo
A Jesucristo por Capitán.
Su fiel doctrina es nuestro lema
Con el escudo de nuestra fe,
Sigue adelante no te detengas
Con Jesucristo vamos a vencer.

CORO:
Embajadores somos el Rey
Llevando al mundo himno de paz,
El Evangelio que es nuestra ley
Con que las almas se salvarán.

2. Arpa y guitarra dice el Salmista
A vuestros templos hay que llevar,
Tocando fuerte y bien la trompeta
Al Dios supremo hay que alabar,
Lleva bien puesto ese uniforme
El Evangelio tienes que honrar,
Mirando siempre a Jesucristo
Arpa y salterio hay que tocar.

3. Bravos y valientes somos de Cristo
En la batalla para luchar,
Estando firmes y siempre listos
El Evangelio a predicar.
Allá en las calles somos visibles
Siempre adelante nos ven pasar,
Van los Coristas tocando fuerte
Con Jesucristo por Capitán.

4. Uniformados van los coristas
Dándole honor a la Misión,
Predicando por todo Chile
Que en Jesucristo hay salvación.
Vamos cantando y también llorando
Por el camino que preparó Jesús,
Por el orgullo tener la dicha
De ser coristas del Coro y Juventud.`
  },
  {
    number: 70,
    title: 'DE LA TIERRA DE EGIPTO YO VENGO',
    lyrics: `1. De la tierra de Egipto yo vengo
Desde allá me sacó mi Señor
Mensajero me ha enviado a mi puerta
El mensaje de eterna Salvación.

CORO:
Bendito es el Señor
Bendito es su amor
Que tuvo de mí compasión
Enfermo me encontraba
Desamparado me hallaba
Cuando vino mi bendito Salvador.

2. De la tierra de Egipto yo vengo
A pedirle perdón al Señor
El pecado me tenía atado
En este mundo de tanto dolor.

3. Allí mi vida se estaba acabando
En este mundo de tanto dolor
Aburrido e intranquilo me hallaba
Cuando vino mi bendito Salvador.

4. Hoy vivimos felices y contentos
Con su sangre lavó mi corazón.
Esperando que cuando Él me llame
Gozaremos con Él en la Mansión.`
  },
  {
    number: 71,
    title: 'DE UN TIERNO SALVADOR',
    lyrics: `1. De un tierno Salvador oí hablar así
Que perdona las culpas de mísero mortal
Y sé que en la cruz su vida dio por mí
Para darme en el cielo vida eternal.

CORO:
En Cristo hay salud anunciaré
en Cristo hay perdón proclamaré
sin precio este don lo da Jesús
al pecador que acepto llevar su cruz

2. La voz de mi Jesús ahora siente mi ser
Y me dice con su sangre mis culpas él borró,
Por eso nunca más atrás quiero volver.
Sólo quiero al mundo anunciar su amor.

3. Al pecador que arrepentido lo quiere buscar,
Jamás despreciará Jesús es su inmenso amor.
En él mi corazón halló dulce solaz
Y mi alma del pecado libertó Jesús.`
  },
  {
    number: 72,
    title: 'DEJE MIS PENAS',
    lyrics: `1. Dejé mis penas todas a Jesús
Y clavó mis pecados en su cruz
El magnífico día que por fe
En la cruz por salvarme le miré.
Él la carga terrible
De mis hombros quitó
Y su voz apacible
Mi dolor disipó.

2. Dejé mis penas todas al Señor,
Porque quita a las penas su amargor
Y las lágrimas dora del mortal
Con su tierna sonrisa celestial.
El desierto miramos
Que se toma vergel
Cuando peregrinamos
Apoyados en Él.

3. Dejé mis penas todas al Señor,
De mi siempre benigno protector
En el Puerto seguro al fin anclé
Y reposo en sus aguas encontré.
Tengo en él mi consuelo
Es mi guía, mi luz,
Y vivir en el cielo
Es vivir con Jesús.

4. Acude con tus penas al Señor
Alma martirizada del dolor,
A su lado la dicha lograrás,
Y librada de angustia vivirás.
En su seno divino
Hay lugar para ti,
Y seguro destino
Alma tienes allí.`
  },
  {
    number: 73,
    title: 'DESDE EL CENTRO DE ESTAS LOBREGAS PAREDES',
    lyrics: `1. Desde el centro de estas lóbregas paredes
vio mi alma que le dieron una luz,
hoy la dicha principal de mis ensueños
es lavarme con la sangre de Jesús.

2. Yo no quiero esta vida indeseable
que me trajo a conocer esta prisión,
solo quiero de Jesús el Nazareno
que me lleve a disfrutar de su mansión.

3. Fue Job y Daniel fortalecidos
muchos otros instrumentos por la fe,
yo te pido, Jesucristo, que me mires
aquí me tienes humillando antes tus pies.

4. Solo quiero que ilumines mi camino
Que no tenga un tropezón nunca jamás,
Quiero ir con mi Señor divino
Porque es duro caminar con Satanás.

5. Tu doctrina Jesucristo me ha enseñado
Las más dulces enseñanzas que abrigué,
Sólo quiero lo que antes desechaba
Desde ahora eternamente te amaré.`
  },
  {
    number: 74,
    title: '¡DESPIERTA! TRISTE PECADOR',
    lyrics: `1. ¡Despierta, triste pecador!
¡Oye sí! oye sí!
Porque te dice el salvador
¡ven a mí, ven a mí!
A tu penoso trabajar
Preparo dulce bienestar
En donde puedas descansar
¡oye sí; ven a mí!

2. Yo soy la fuente del perdón,
¡Oye sí! oye sí!
En mi hay vida y salvación.
¡Ven a mí, ven a mí!
Si del castigo huyendo vas,
En mi refugio hallarás
Y vida eterna gozarás
¡oye sí; ven a mí!

3. Los que me buscan con afán
¡Oye sí! oye sí!
Jamás desatendidos van
¡ven a mí, ven a mí!
La compasión de Redentor
Te dice pobre pecador,
Admíteme por tu Pastor,
¡oye sí; ven a mí!
Si buscas paz y tranquilidad.

4. Si quieres la felicidad,
¡Oye sí! oye sí!
Si buscas paz, tranquilidad
¡ven a mí, ven a mí!
Tus lágrimas enjugaré
Y tus heridas sanaré
La vida eterna te daré
¡oye sí; ven a mí!`
  },
  {
    number: 75,
    title: 'DIA DE VICTORIA',
    lyrics: `1. Día de victoria gozo sin igual,
Cuando Cristo volverá,
Que glorioso encuentro con mi Salvador
En las nubes Él vendrá.

CORO:
En las nubes se verá
En aquel día final
Cristo el Salvador
Muy pronto volverá
Por aquellos que él amó.

2. Día de gran gozo, gozo sin igual,
Cuando Cristo volverá
De la tierra al cielo Él nos llevará
A su seno paternal.

3. Oye la trompeta anunciando está
La venida del Señor.
Ya no más dolores, ya no más afán
Con Jesús triunfó en amor.`
  },
  {
    number: 76,
    title: 'DIA FELIZ CUANDO ESCOGI',
    lyrics: `1. Día feliz cuando escogí
Servirte, mi Señor y Dios.
Preciso es que mi gozo en ti
Lo muestre hoy con obra y voz.

CORO:
¡Soy feliz! ¡soy feliz!
Y en su favor me gozaré
En libertad y luz me ví
Cuando triunfó en mí la fe
Y el raudal carmesí
Salud de mi alma enferma fue.

2. ¡Paso! Mi gran deber cumplí.
De Cristo soy y mío es él.
Me atrajo con placer seguí.
Su voz conoce todo fiel.

3. Reposa, débil corazón,
A tus contiendas pon ya fin
Hallé más noble posesión,
Y parte en superior festín.

4. Solemne voto, ofrenda, flor.
Que al cielo santo consagré,
Hoy sé mi vínculo de honor
Después testigo de mi fe.`
  },
  {
    number: 77,
    title: 'DIEZMO AL SEÑOR',
    lyrics: `1. Habrá grandes lluvias de bendición
Si traemos diezmos hoy al Alfolí,
Demostrando así la consagración
Si traemos nuestros diezmos.

CORO:
Diezmos, sí de amor y servicio
Y también de oro y plata
Si traemos nuestros diezmos
Si traemos nuestros diezmos
Bendiciones grandes abundarán.

2. El dará triunfo a su Grey acá.
Dios los librará de toda maldad.
A reinar el Príncipe de paz vendrá
Si traemos nuestros diezmos.

3. No robemos nunca más a nuestro Rey
Mas no demos nada por obligación,
Que el amor nos constriñe más que la ley
A traer todos los diezmos.`
  },
  {
    number: 78,
    title: 'DIOS BENDIGA',
    lyrics: `1. Que los dos que al altar se aproximan
A jurarse su fe mutuamente
Busquen siempre de Dios en la fuente,
El secreto de dicha inmortal
Y si acaso de duelo y tristeza
Se empañase su senda un día
En Jesús hallarán dulce guía,
Que otra senda les muestre mejor.

2. Que el Señor con su dulce presencia
Cariñoso estas bodas presida
Y conduzca por sendas de vida
A los que hoy se prometen lealtad
Les recuerdo que nada en el mundo
Es eterno, que todo termina
Y por tanto con gracia divina
Cifrar deben la dicha en su Dios.

3. Dios bendiga a las almas unidas
Por los lazos de amor sacrosanto
Y los guarde de todo quebranto
En el mundo de espinas orial,
Que el hogar que a formarse comienza
Con la unión de estos dos corazones,
Gocen siempre de mil bendiciones
Al amparo del Dios de Israel.`
  },
  {
    number: 79,
    title: 'DIOS CUIDARA DE TI',
    lyrics: `1. En tus afanes y en tu dolor
Dios cuidará de ti,
Vive amparado en su inmenso amor
Dios cuidará de ti.

CORO:
Dios cuidará de ti
Y por doquier contigo irá.
Dios cuidará de ti.
Nada te faltará.

2. Si desfalleces en tu dolor
Dios cuidará de ti.
Si ves peligro en un rededor
Dios cuidará de ti.

3. Cuanto anhelares Él te dará
Dios cuidará de ti.
Nada que pidas te negará
Dios cuidará de ti.

4. Nunca en las pruebas sucumbirás
Dios cuidará de ti.
En tu regazo te apoyará
Dios cuidará de ti.`
  },
  {
    number: 80,
    title: 'DIOS ETERNO',
    lyrics: `1. ¡Dios eterno! En tu presencia
Nuestros siglos horas son
Y un segundo la existencia
De cada generación,
Mas el hombre a tu lado
Ansía a ti volar con fe.
En su curso prolongado
¡Cuán lentos los años ve!

2. Otro año ha fenecido.
Que esta vida ya acortó.
Y al descanso apetecido.
Poco más nos acercó.
Gracias mil por tus mercedes
Tu Iglesia, ¡Oh Dios! te da.
Y, pues, todo tú lo puedes,
Tu poder nos sostendrá.

3. Visita nuestras familias
Y Bendice todo hogar.
Si Tú ¡Oh Dios! nos auxilias,
Nada nos podrá faltar.
Doquier te venere el hombre
Y te sirva haciendo el bien,
Y ensalce tu augusto nombre
Por siempre jamás, ¡Amén!`
  },
  {
    number: 81,
    title: 'DIOS NOS HA DADO PROMESA',
    lyrics: `1. Dios nos ha dado promesa
Lluvias de gracias enviaré.
Dones que os dan fortaleza
Gran bendición os daré.

CORO:
Lluvias de gracia,
lluvias pedimos, Señor,
mándanos lluvias copiosas
lluvias del consolador.

2. Cristo no dio la promesa
del santo consolador.
Danos paz y pureza
Para su gloria y honor.

3. Dios nuestro, a todo creyente
muestra tu amor y poder
Tu eres de gracia, la fuente,
llena de paz nuestro ser.

4. Obra en tus siervos piadosos
Celo, valor y virtud,
Dándonos dones preciosos,
Dones del consolador.`
  },
  {
    number: 82,
    title: 'EJERCITO EVANGELICO',
    lyrics: `1. Ejercito evangélico, refugio de las almas,
Cobijas en tus senos al pobre pecador,
Sois faro luminoso que alumbra el Camino,
Llevando como Emblema la Doctrina del Señor.

CORO:
Sembrando la semilla del Evangelio Santo,
Luchando con nobleza y sano corazón
Para quitarle al mundo la lepra del pecado
Que Chile para Cristo sea siempre tú Misión

2. Militan en tu fila los siervos del altísimo,
Tu gran misericordia, tus montes ya forjó
Y cual un solo hombre al amor de Jesucristo
Uniendo van su esfuerzo tras la causa del Señor.

3. Tus sabias enseñanzas dirigidas de lo alto
Van impulsando a nuestro Chile que Conozca la verdad.
Para ver en nuestro Chile la bandera de Justicia,
Demos glorias al León de la Tribu de Judá.`
  },
  {
    number: 83,
    title: 'EL ALCOHOL',
    lyrics: `1. Hay en el mundo un néctar que es benigno,
Es el alcohol que alegra su destino
mas el que llega a los pies del tabernero
este le alegra con ese vil veneno;
pero el que bebe con ansias y delirio
este licor dulcísimo y benigno
siente en el alma una alegría inmensa
que inunda todo vuestro ser entero.

2. Con ansias locas y lleno de contento
Sigue bebiendo, bebiendo con anhelo
En un momento cuando el licor inflama
El alma toda, cuando a hecho su efecto
Enciende en ira, recuerda lo pasado
Con vil rencores, intrépido, atrevido
Contra el amigo que tanto lo ha querido,
Hunde la esquina de todo su rencor.

3. cuando en la cárcel recuerda lo pasado
Todo lo hecho no puede remediar
Ya no hay amigo, ni padre, ni pariente
No hay ninguno que lo valla a visitar
Arrepentido levanta voz al cielo
Donde hay consuelo que puede mitigar
Ahí está Cristo el Salvador del mundo
Que dijo un día yo te quiero salvar.`
  },
  {
    number: 84,
    title: 'EL CALVARIO',
    lyrics: `1. El calvario horrenda cruz se vio
la cruz de mi Jesús,
El pecado de mi corazón
Lo llevó mi Salvador.

CORO:
¡Oh la sangre divina¡
la sangre eficaz,
derramada fue por mi
él murió por ti
pecador por ti
mi Jesús murió por mi.

2. El Redentor su sangre dio
Rescate fue por mi,
A mis culpas todas puso fin
Y me redimió a mi.

3. Yo te alabo Salvador también
Y te tengo que llorar
Y al mirarte en esa cruz tan cruel
Tú moriste por salvar.`
  },
  {
    number: 85,
    title: 'EL COMANDANTE',
    lyrics: `1. Allá a lo lejos se oyen clarines
Se oye trompetas de buen sonar
Aleta hermanos y acorazaos
Que la batalla va a empezar

CORO:
El Comandante
De nuestra escuadra
Aquí a mi lado hablando esta
Que libertemos
A nuestro Chile
De las cadenas de Satanás

2. Hermanos míos no desmayemos
Nunca dejemos vencer la espada
Que Jesucristo crucificado
Por Él tendremos la libertad.

3. Hermanos míos vamos adelante
Vamos a la guerra, vamos a luchar
Llevando siempre al Fiel amigo
A Jesucristo por Capitán

4. El Rey de Gloria te está llamando
Para que obtengas tu galardón
Allá en el cielo tendrás corona
Cantando glorias al cielo voy`
  },
  {
    number: 86,
    title: 'EL CORDERO INMOLADO',
    lyrics: `1. Hoy día que soy cristiano
se goza mi corazón;
por la obra tan gloriosa
que hizo mi Salvador
ese cuerpo tan perfecto
que a la cruz tuvo que ir
mi pecado fue la causa
que tuviste que morir.

2. Hoy me siento tan contento
Se lo debo al Salvador
Esa alegría tan inmensa
que me inunda el corazón
Por que hoy día soy salvado
Por la muerte de Jesús,
Redimido por la sangre
Derramada en la cruz

3. Muchos fueron los azotes
que el verdugo descargó
sobre el cuerpo que llevaba
el madero de la cruz
ese precio tan inmenso
que pago mi Salvador
fue un rescate tan bendito
que libertó al pecador.

4. De ese cuerpo sacrosanto
El verdugo se ensañó
Y con esos crueles clavos
Pies y manos traspasó
Por sus labios ni una queja
Contra nadie se le oyó
En el silencio de ese justo
Mi pobre alma se salvó.

5. Por fin sus labios se movieron
Con ternura sin igual
Implorando al padre Eterno
El perdón por ese mal.
La obra quedo perfecta
Por eso, a mi salvó
Hoy soy, limpio por su sangre
¡Que alegría Gloria a Dios!`
  },
  {
    number: 87,
    title: 'EL ENEMIGO AL FRENTE ESTA',
    lyrics: `1. El enemigo al frente está
Y nos oprime con poder
El Cristo solo salvara
A aquel que quiera el mal vencer,
Hombre de bien queréis venir
Al patrio suelo a libertar
La esclavitud se hace sentir
Y Cristo hoy quiere salvar.

CORO:
Gloria, me salve
Y cuanto gozo hay en mí,
Nunca volveré
al vicio vil a quien serví
guerra al alcohol
toda mi vida yo le haré
y por la fe encontrare
al Salvador a quien amé.

2. Hoy todos juntos levantemos
El sacrosanto pabellón
Con toda fuerza combatamos
Al feo vicio del licor,
No permitáis que nuestro suelo
Sea regado de dolor
Con fe ardiente y con anhelo
Defended siempre la Nación.

3. Legión de bravos a la lid
Y con valor hoy pelead,
Luchando siempre hasta morir,
Por Cristo nuestro Capitán,
Al enemigo venceremos
Con la palabra de Jesús
Y en verdad humillaremos
Al enemigo de la luz.`
  },
  {
    number: 88,
    title: 'EL EVANGELIO ES NUESTRO LEMA',
    lyrics: `1. El Evangelio es nuestro lema
La ley de Cristo es nuestro honor
Del sacrificio somos cristianos
Y evangelista de la Nación.
Si el mal acecha nuestra doctrina
Por la ignorancia y la corrupción
Vamos sin miedo contra el pecado
Somos de Cristo el Rey de amor.

CORO:
Nuestro estandarte flamea al viento
Somos gigantes de la verdad
Nuestros mensajes son el acento
Con que las almas se salvaran.

2. Triste es la vida de los que ignoran
El Evangelio de salvación
Sus almas sufren, sus ojos lloran
Por qué desprecian al Salvador.
Sigue adelante, evangelista,
Sin preocuparte de satanás
Lleva el mensaje de Jesucristo
Y vida eterna recibirás.

CORO:
Adiós, amigos, adiós, hermanos,
Ustedes quedan en oración
Yo voy en busca de almas perdidas
Para traerlas al Salvador.`
  },
  {
    number: 89,
    title: 'EL GRAN DIA YA VENDRA',
    lyrics: `1. El gran día ya vendrá
Cuando todos llegaran
De toda Nación, de todo lugar
Su Maestro encontrar,
De ver su hermosa paz
a estarse de su amor
sus cantos nunca cesarán
por toda la eternidad.

CORO:
De toda Nación vendrán
Su galardón a buscar,
Vendrán de los montes,
Vendrán de lo valles
Y del tormentoso mar,
Sus lágrimas cesaran
Pesar y dolor quitó
Que con su muerte en la cruz
Tu salvación compro.

2. Entonces los salvos ya
Librados allí estarán,
No más el pecado, ni pena y dolor
Su dicha destruirá,
Y todo nuevo será
Eterno júbilo habrá,
La lucha un día cesará
Por toda la eternidad.

3. Las puertas abiertas están
¿ Porqué no también entrar?
Si hay un lugar para ti
Si quieres a Cristo aceptar,
Amados que allí están
Te esperan con ansiedad
Las alabanzas unirán
Con coro angelical.`
  },
  {
    number: 90,
    title: 'EL HIJO PRÓDIGO',
    lyrics: `1. Hubo un hombre aquí en la tierra que tenía
Dos hijos que criaba con amor,
Y uno de ellos pidiéndole la herencia
Abandona al ser que lo crió.

2. Aquel padre que amaba con locura
Suplicaba al ingrato que crió
Ten piedad del anciano que te ama
No le dejes sumido en el dolor.

3. Siguió el hijo peregrino sus caprichos
Y la herencia que pedía recibió
No mirando las tristezas del anciano
Que de verle le partía el corazón.

4. Al salir de la casa aquel ingrato
Por sus ojos ni una lágrima brotó
Mientras el padre a Dios suplicaba,
Ten piedad acompáñalo Señor.

5. Y muy pronto el dinero que llevaba
Con amigos y rameras lo gastó
Y quedando en la última miseria
A su hogar enseguida se volvió.

6. De rodillas ante el padre suplicaba
No soy digno que me mires con amor
Y el anciano que le amaba con ternura
En sus brazos a su hijo loe estrecho.

7. Así es Cristo con el pobre que le clama
Le perdona y le abraza con amor
Y le lava con la sangre derramada
En la cruz por salvar al pecador.

8. Bienaventurado el hombre aquí en la tierra
Que ha seguido los pasos del Señor
Abrazando la cruz del vituperio,
Y la sangre que Cristo derramó.

9. Esa sangre que ha sido derramada
Limpia el alma que deja de pecar
Y la libra de tormentos y amarguras
Que este mundo al hombre siempre da.`
  },
  {
    number: 91,
    title: 'EL MERCADO',
    lyrics: `1. El mercado está vacío
en silencio se quedó,
el martillo del obrero
su bullicio ya paró,
los que siembran en el campo
terminaron su labor,
he aquí está el supremo
el retorno del Señor.

CORO:
Si el Rey está volviendo
El Rey está volviendo
Las trompetas están sonando
Y mi nombre va llamar.
Si el Rey está volviendo
El rey está volviendo
¡Aleluya!, Él nos viene a buscar

2. El vagón de un tren sin guía
Cruza valles y ciudad,
Los aviones sin pilotos
Vuelan a la destrucción,
La ciudad quedó desierta
En silencio se quedó,
Hoy las últimas noticias
Jesucristo ya volvió.

3. Multitudes van subiendo
Hay un Coro Celestial,
Todo el cielo se está abriendo
Cristo aparecerá
Como el son de muchas aguas
Oímos su resonar,
¡ Aleluya! Al Cordero
ya nos vamos al hogar.`
  },
  {
    number: 92,
    title: 'EL MUNDO PERDIDO',
    lyrics: `1. El mundo perdido en pecado se vio,
Jesús es la luz del mundo,
Mas en las tinieblas la gloria brilló,
Jesús es la luz del mundo.

CORO:
Ven a la luz, no quieras perder
Gozo perfecto al amanecer
Yo ciego fui, mas ya puedo ver
Jesús es la luz del mundo.

2. Vivir en él, vuelve la noche en día,
Jesús es la luz del mundo,
Andemos en luz y sigamos al guía,
Jesús es la luz del mundo.

3. Oh ciegos y presos del lóbrego error.
Jesús es la luz del mundo,
Él mandó lavarnos y ver su fulgor,
Jesús es la luz del mundo.

4. Ni soles ni lunas el cielo tendrá,
Jesús es la luz del mundo,
La luz de su rostro lo iluminará,
Jesús es la luz del mundo.`
  },
  {
    number: 93,
    title: 'EL ORO Y LA PLATA',
    lyrics: `1. El oro y la plata no me han redimido
mi ser del pecado no pueden librar
la sangre de Cristo es mi sola esperanza
su muerte tan solo me puede salvar.

CORO:
Me redimió, más no con plata
me compro el Salvador.
Con oro no, mas con su sangre
el grande precio de su amor.

2. El oro y la plata no me han redimido
La pena terrible no pueden quitar,
La sangre de Cristo es mi sola esperanza
mi culpa su muerte la alcanzó a borrar.

3. El oro y la plata no me han redimido
la paz no darán ellos al pecador,
la sangre de Cristo es mi sola esperanza
tan sólo su muerte me quita el temor.

4. El oro y la plata no me han redimido
la entrada en los Cielos no pueden comprar,
la sangre de Cristo es mi sola esperanza
su muerte rescate consiguió ganar.`
  },
  {
    number: 94,
    title: 'EL PASTOR',
    lyrics: `1. El pastor de los pastores
es Jesús el Nazareno.
Que ha implantado su doctrina
De un reino sempiterno,
Si son fieles sus rebaños,
Él los cuida con amor
si han dejado todo engaño
Él les da la salvación.

2. El pastor va presuroso
tras los que quedan allá
Él va contento y gozoso
y un buen consejo les da,
su historia ya conoce,
le falta el paso que dar,
no desoigas el llamado
si te quieres tu salvar.

3. Hoy sus pastos reverdecen,
sus aguas frescas están
y no hay otro manantial,
pues en Cristo permanece,
si los suyos le obedecen
nunca les faltará el pan,
su palabra permanece
y no ha mentido jamás.`
  },
  {
    number: 95,
    title: 'EL REY QUE VIENE',
    lyrics: `1. El rey que viene cerca está
el mismo que en la cruz murió
más sólo viene esta voz
por los que rescató.

CORO:
Cerca está, cerca está,
a las puertas misma llega ya.
Viene presto, viene presto,
a las puertas llega ya.

2. De su venda vemos ya
señal muchas por doquier
y pronto el alba eternal,
podrán los pueblos ver.

3. Pues no cantéis con gozo y paz
aquí las luchas seguirán
más cuando vuelva el Salvador
eterno fin tendrán.

4. Entonces nuestro hogar será
la tierra nueva eternal
la muerte nunca entrará
pues es todo inmortal`
  },
  {
    number: 96,
    title: 'EL SEMBRADOR',
    lyrics: `1. Sal a sembrar, sembrador de paz,
sigue las huellas del buen Jesús
muy ricos frutos tendrás, si fiel
sigues las sendas de paz y luz.

CORO:
Ve, ve, ve, sembrador,
ve, ve siembra la paz
habla doquiera del Señor
y de tu santa paz.

2. Vasto es el campo, sal a sembrar
Siempre el terreno que Dios te da
Si siembras siempre confiado en Dios,
Él tus esfuerzos coronará.

3. No desperdicies tiempo, ve,
Siembra semillas dondequiera que vas
Semilla eterna que dé sus mieses,
ricas semillas que no son lugar.

4. Dios ha mandado, sal a sembrar
nuevas de vida de su amor y paz
tal vez cueste dolores mil
más en los cielos tendrás solaz.

5. Voy, voy, voy, Salvador,
voy, voy, siembro la paz
hablando siempre del Señor
y de su santa paz.`
  },
  {
    number: 97,
    title: 'EL SEÑOR JESUS ESTA LLAMANDO',
    lyrics: `1. El Señor Jesús está llamando
¿quién irá por mí a trabajar?
¿quién a mí traerá los que se pierden?
y el camino les ha de enseñar.

CORO:
Háblame, háblame
Y tu voz yo presto acataré
háblame, ¡oh, Señor!
y tu voz yo presto acataré.

2. Cuando el trozo de carbón ardiente
Al profeta fiel purificó,
al oír la voz que me llamaba
mándame, Señor, le respondió.

3. Hay millones que en pecado mueren
¡escuchad su tétrico gemir!
Acudir con tiempo a recatarles
¿quién dirá Señor, yo quiero ir?

4. Pronto el tiempo de la siega pasa
Pronto iremos al Celeste Edén
Ojalá en aquel solemne día
Él me diga, hijo, hiciste bien.`
  },
  {
    number: 98,
    title: 'EN EL CIELO UNA MORADA',
    lyrics: `1. En el cielo una morada
Cristo fue a preparar,
para todo aquel que hiciere
su divina voluntad.

CORO:
Gozo eterno hay en el cielo
allí cantan de alegría
los salvados por Jesús
que han sido fieles en la vida.

2. Somos fieles los cristianos
somos fieles a Jesús,
abracemos con el alma
el evangelio de salud.

3. Somos probados los cristianos
como el oro en el crisol
y la sangre de Jesucristo
lava y limpia el corazón.`
  },
  {
    number: 99,
    title: 'EN EL FONDO DE MI ALMA',
    lyrics: `1. En el fondo de mi alma una dulce quietud.
Se difunde embargando mi ser
Una calma infinita que sólo podrán
Los salvados de Dios comprender.

CORO:
¡Paz!. ¡paz!, dulcísima paz.
Es aquella que el Padre me da;
Yo le ruego que inunde por siempre mi ser.
En sus ondas de amor celestial.

2. Qué tesoro yo tengo en la paz que me dio.
Y en el fondo del alma ha de estar.
Tan segura que nadie quitarla podrá.
Mientras miro los años pasar.

3. Esta paz inefable consuelo me da.
Descanso tan sólo en Jesús.
Y ningún peligro mi vida tendrá
Si me encuentro inundado en su luz.

4. Alma triste que en rudo conflicto te ves
Sola y débil tu senda al seguir.
Haz de Cristo su amigo, que fiel siempre es.
Y su paz tú podrás recibir.`
  },
  {
    number: 100,
    title: 'EN JESUCRISTO MARTIR DE PAZ',
    lyrics: `1. En Jesucristo mártir de paz,
en horas negras de tempestad
hallan las almas dulces solaz,
grato consuelo, felicidad.

CORO:
Gloria cantemos al redentor
que por nosotros quiso morir,
y que la gracia del Salvador
dirija siempre nuestro vivir.

2. En nuestras dudas, en el dolor
a cada paso su protección
infunde calma, santo vigor,
nuevos alientos al corazón.

3. Cuando en las luchas falte la fe,
y el alma siente desfallecer
Jesús nos dice: “yo os colmaré,
de rica gracia santo poder.”`
  },
  {
    number: 101,
    title: 'EN LA GUERRA CONTRA EL PECADO',
    lyrics: `1. En la guerra contra el pecado
vamos todos a combatir,
estará Dios a nuestro lado
en el tiempo de sufrir.
La victoria será nuestra
confiando en su poder
nos dará Él su ayuda
hemos todos de vencer.

CORO:
No, nosotros nunca, nunca,
cederemos al mal,
nunca no, no, no, nunca no, no, no,
no, nosotros nunca, nunca,
cederemos al mal,
nos espera la corona en el Cielo.

2. Pelearemos con toda fuerza
los dominios del mal a destruir
ayudando a los pecadores
el calvario a subir.
Sin miedo de las burlas
del diablo y del mundo
para  Dios y para el alma
hemos todos de vivir.

3. Jesucristo es nuestra fuerza
su poder nunca nos faltará,
su presencia nos esfuerza
y victoria nos dará.
Levantemos la bandera
del bendito Salvador
para que la gente sin perdón
disfrute de su amor.`
  },
  {
    number: 102,
    title: 'EN LA LUCHA, ¿OS SENTIS CANSADO?',
    lyrics: `1. En las luchas ¿os sentís cansado?
¿encontráis que todo es pesado?
¿muéstrase el cielo muy nublado?
¡no cedáis, nunca!
Apartad el miedo y constantes
Mantened la fe, sed vigilantes.
Con Jesús seréis triunfantes
¡no cedáis, nunca!

CORO:
¡Oh soldado, sin temor,
vamos a luchar!
Con Jesús por Capitán
hemos de triunfar.
La espada empuñad,
el pendón alzad
¡Adelante!, ¡a la victoria!

2. Fieles sed, seguid a Jesucristo
A sufrir durezas siempre listos.
De las armas de la fe provistos.
¡no cedáis nunca!
Sed gozosos, no guardéis tristezas,
Soportad las pruebas con firmeza
Si alguno a temblar empieza:
¡No cedáis nunca!.

3. Id a Cristo, cuando oprimidos,
Acordaos, por él sois redimidos:
Cuando sois del mundo aborrecidos
¡No cedáis, nunca!
Fuerte sed, cual bravos espartanos,
No temáis perder favor humano,
Si vencido cae algún hermano,
¡No cedáis, nunca!.`
  },
  {
    number: 103,
    title: 'EN LA NUEVA JERUSALEN',
    lyrics: `1. Cuando cesen los conflictos
de la vida terrenal
y dejemos este mundo de aflicción,
entraremos por las puertas
de la Patria Celestial
en la nueva Jerusalén.

CORO:
Cantaremos con los santos
la canción de redención
en Jerusalén, en Jerusalén
con acentos de alegría
alabando al Salvador
en la nueva Jerusalén.

2. Aunque el mar embravecido
y la olas del turbión
siempre agiten nuestra pobre embarcación
fiados en Cristo llegaremos
a la playa celestial
en la nueva Jerusalén.

3. Y consagre nuestras vidas
al servicio del Señor
siempre hablemos de su grande salvación.
Y en su viña trabajando
nos espera galardón
en la nueva Jerusalén.

4. En aquel país hermoso
do jamás se dice adiós,
gozaremos del descanso sin afán.
Cara a cara ver espero
a Jesús que me salvó
en la nueva Jerusalén.`
  },
  {
    number: 104,
    title: 'EN LA TIERRA SOY UN PEREGRINO',
    lyrics: `1. En la tierra soy un peregrino
que camino en el mundo de maldad
alentado sólo en mi camino
la esperanza de irme con Jesús.

CORO:
Lo veré en un cercano día
Cuando deje el mundo de dolor,
Cara a cara solo verle anhelo
Y vivir guardado por su amor.

2. Nada importa de mis desazones
en las pruebas mil que pase aquí
alentado sólo en mi camino
la esperanza de irme con Jesús.

3. Solo estoy de paso en esta tierra
donde todo ha de perecer,
busco aquella Patria bendecida
que eternal con Dios habrá de ser.`
  },
  {
    number: 105,
    title: 'EN LA VERGONZOSA CRUZ',
    lyrics: `1. En la vergonzosa cruz
Padeció por mí, Jesús,
Por la sangre que vertió
Mis pecados él expíó.
Lavará de todo mal
Ese rojo manantial,
El que abrió por mí, Jesús,
En la vergonzosa cruz.

CORO:
Sí, fue por mí, sí, fue por mí
fue por mí; murió Jesús
en la vergonzosa cruz

2. ¡Oh!, ¡qué amor, qué inmenso amor!
Reveló mi Salvador;
la maldad que hice yo
al suplicio le llevó.
Ahora a ti mi todo doy
cuerpo y alma tuyo soy;
mientras permanezca aquí,
hazme siempre fiel a Ti.

3. Yo de Cristo sólo soy;
A seguirle pronto estoy;
al bendito Redentor
serviré con firme amor.
sea mi alma ya su hogar
y mi corazón su altar
vida emana, paz y luz,
del calvario de la cruz.`
  },
  {
    number: 106,
    title: 'EN LAS AGUAS DEL BAUTISMO',
    lyrics: `1. En las aguas de la muerte sumergido
Fue Jesús.
Mas su amor no fue apagado
Por sus penas en la cruz;
Levantose de la tumba,
Las cadenas sacudió
Y triunfante y victorioso a los cielos
Él subió.

2. En las aguas del bautismo hoy confieso
Yo mi fe,
Jesucristo me ha salvado y en su amor
Me gozaré;
En las aguas humillantes a Jesús siguiendo
Estoy,
Desde ahora para el mundo y el pecado
Muerto estoy.

3. Yo estoy crucificado
¿cómo más podré estar?
Ya que soy resucitado, santa vida he de llevar,
Son las aguas del bautismo mi señal
De salvación,
Y yo quiero consagrarme al que obró mi redención.`
  },
  {
    number: 107,
    title: 'EN LOS CIELOS NUESTRA PATRIA ES HALLADA',
    lyrics: `1. En los cielos nuestra patria es hallada
Con su sangre la compró nuestro Señor,
Los hermanos que tienen su parte allá
Hoy nos traen lazos sinceros de amor.

CORO:
Bienvenido sois, hermanos,
bienvenido sois, hermanos,
en la iglesia del Señor
todos juntos congregados
al Señor damos loor.

2. Reunidos, hoy con júbilo estamos,
de los cuatro ámbitos de la nación
como símbolo de redención hermanos,
“Chile para Cristo” es nuestra oración.

3. Triunfante aquel día entraremos
con vosotros a esta grata reunión,
con vosotros hoy con regocijo estamos
bienvenidos allá, tributarán canción.`
  },
  {
    number: 108,
    title: 'EN SU AMOROSA COMPASION',
    lyrics: `1. En su amorosa compasión
Jesús me vino a rescatar.
Y de un abismo de maldad
Su brazo me salvó.

CORO:
De las cadenas de satán
con su poder me libertó
y es hoy mi gozo proclamar
que por su gracia salvo soy.

2. Frente a mis puertas con afán
por largo tiempo Él esperó:
y cuando al fin oí su voz
fue de perdón y de paz.

3. Sangrado aún veo su sien
que mano impía desgarró
mas él me dice con amor
que por salvarme fue.

4. Hoy en un mundo superior
respiro ambiente celestial
y salvo soy para ensalzar
al que por mí murió.`
  },
  {
    number: 109,
    title: 'EN TINIEBLAS DE MALDAD',
    lyrics: `1. En tinieblas de maldad,
Lejos de mi salvador
Preso era de ciega pasión,
Sin pensar que el fin del rebelde pecador
Era muerte y eterna destrucción.

CORO:
Me sacó de las tinieblas a la luz,
De tinieblas a la luz
Me sacó, sacó de las tinieblas mi Jesús
Gloriosa luz de Dios.

2. No pensaba en mi alma, ni en la eternidad
desoía la voz de mi Dios.
Y buscaba en vano hallar felicidad
hasta que dejé de ir el mundo en paz

3. Ante Cristo me postre:
mis pecados confesé
y humilde pedí el perdón,
ya la noche se fue y no más tropezaré,
pues Jesús me dio completa salvación.

4. Las tinieblas han pasado
Y ya vivo en la luz
disipóse la vana ilusión,
y ahora yo vivo guardado por Jesús,
victorioso sobre toda tentación.`
  },
  {
    number: 110,
    title: 'EN TODO TIEMPO',
    lyrics: `1. En todo tiempo, mi buen salvador,
quiero mi ser consagrar a tu amor
yendo contigo, llevando tu cruz,
cada momento gozando tu luz.

CORO:
Cada momento soy tuyo Señor,
cada momento me brindas tu amor
cada momento alumbra tu faz
cada momento me inunda tu paz.

2. Rudas batallas tendré que luchar
Contra mis males tendré que lidiar,
Pero tu gracia, Jesús, bastará
Cada momento me sustentarás.

3. Tú me quebrantas, mi amado Jesús
por tu consuelo podré yo vivir
sé que me brindas alivio y salud
cada momento con solicitud.

4. Cuando me lleves contigo a vivir
libre mi alma será de sufrir
he de alabarte por siglos sin fin
cada momento en bello festín.`
  },
  {
    number: 111,
    title: 'EN UN MOMENTO LEJANO DIVISO UNA CRUZ',
    lyrics: `1. En un monte lejano diviso una cruz
Emblema de afrenta y dolor
Y yo amo esa cruz, donde Cristo expiró
Por salvar al más vil pecador.

CORO:
Yo me abrazo a esa cruz con amor
Hasta el día de mi mutación
Cuando a Cristo mi cuenta le dé
Por su cruz yo corona tendré.

2. Despreciada del mundo, yo veo esa cruz
Que es centro de mi adoración,
Pues en ella el Cordero sin mancha expiró
sacrificio de expiación.

3. Empapada de sangre, yo veo esa cruz
Y es sangre preciosa en verdad,
Pues en ella mis culpas redime Jesús
Y dichosa mi alma será.

4. A la cruz despreciada, yo leal he de ser
su escarnio no he de rehuir.
mas un día Jesús ha de darme con él
herencia eterna y feliz.`
  },
  {
    number: 112,
    title: 'EN UN PESEBRE HUMILDE',
    lyrics: `1. En un pesebre humilde viniste tú al mundo
para mostrar al hombre tu gran humillación,
con esto demostraste tu gran amor profundo
y luego más tarde hacer la redención.
Una brillante estrella anuncia la venida
del niño que naciera allá en Belén.
Los reyes y los pastores con toda su alegría
le daban honra y gloria al Dios de Israel.

2. Seguiste demostrando tu gran sabiduría,
ninguno de los hombres te supo comprender,
seguiste predicando el mandato de arriba,
enclavado en una cruz te hicieron padecer.
Lleváronte al calvario los hombres enceguecidos,
amando mucho más las tinieblas que la luz,
derramaste tu sangre por el mundo perdido
en vicios y pecados en esa horrenda cruz.

3. Ahora, mis hermanos, mirad a Jesucristo
que vino por nosotros aquí a padecer,
que al toque de trompeta estemos todos listos,
más allá gozaremos en el celeste Edén.
Pidamos, mis hermanos, en nuestras oraciones
que crezca su palabra en todo corazón.
Que vengan muchas almas a las congregaciones,
y así pueden librarse del mundo pecador.`
  },
  {
    number: 113,
    title: 'ENROLADO ESTOY',
    lyrics: `1. Enrolado estoy en las huestes de Jehová;
he resuelto pelear por el bien
y contra el mal;
Con las armas de Dios y la espada espiritual
con Jesús en las luchas venceremos.

CORO:
Oíd el son marcial de los soldados,
al son del triunfo derrotaremos.
oíd que pasan ya los alistados:
van a vencer a satán.
Como soldado me he enrolado;
el Dios de los ejércitos es mi ayuda.
cual fiel soldado me he presentado
Con Jesús en las luchas venceremos.

2. Desplegad el perdón de amor y santidad,
salvación publicad al mundo pecador;
los dardos de satán no podrán darnos temor,
con Jesús en las luchas venceremos.

3. Si tu nombre, ¡oh amigo!, no has dado hasta hoy
Para unirte con los pocos fieles a Jesús,
no hay otro remedio al mal
sino la cruz,
Con Jesús en las luchas venceremos.`
  },
  {
    number: 114,
    title: 'ES JESUCRISTO MI TODO',
    lyrics: `1. Es Jesucristo mi todo
grato es cantar su loor,
oh, cuán sublime e infinito
es su divino amor.
Cuando me vio errabundo
cual hijo pródigo
vino a buscar y a salvarme
y a su redil me llevó.

CORO:
Cristo, Cristo, tú eres mi salvador.
Cristo, Cristo, tuyo seré, Señor.
Te seguiré donde quieras,
si tú guiando vas
y al terminar mi carrera
en gloria veré tu faz.

2. Cristo es el Lirio del valle
la Rosa es de Sarón.
Cristo es el astro esplendente
la roca de salvación;
El es la fuente de vida
y gozo eternal,
ya satisface mi alma
con el maná celestial.

3. Cristo nació en un pesebre
la amarga copa bebió,
cual inocente cordero
en el calvario murió;
Resucitó de la tumba
y al cielo ascendió,
más pronto viene en gloria
esta promesa nos dio.`
  },
  {
    number: 115,
    title: 'ES JESUCRISTO TAN SOLO',
    lyrics: `1. Es Jesucristo tan solo
Gracias tendrás pecador
Nadie de polo a polo
Es como el salvador.

CORO:
Sólo Jesús, sólo Jesús
Salvarte puede, sí sólo Jesús,
Sólo Jesús, sólo Jesús
Salvarte puede, sí sólo Jesús.

2. Los que en Cristo creyeron
gozan de plena salud,
paz y perdón recibieron
grande es su gratitud.

3. ¿Quieres salvar a tu alma?
Ven a Jesús, Él te llama
y obtendrás la salvación.
¿Quieres tener el perdón?

4. Ana, José y María
todos creyendo en Él,
ángeles cantan su gloria
grande es su Emanuel.

5. Abre tus puertas cerradas.
Toca el buen Salvador,
Él solicita entrada
¿cuándo será, pecador?.`
  }
];
