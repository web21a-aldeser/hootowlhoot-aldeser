## Mapa del sitio

A continuación se detalla el diseño del mapa del sitio.

![mapa-del-sitio](./wireframes/Aldeser-site-map.svg)

## Pantalla principal

El propósito de la pantalla principal es permitir al visitante elegir entre las siguientes opciones. 

Primera, solicitar ayuda, este muestra un poco sobre las reglas y como unirse y organizar una partida ![1](./numbers/1.svg). Organizar un juego ![2](./numbers/2.svg) si el visitante elige esta opción será redirigido a la pantalla de espera de juego en la que entrara como anfitrión. Tercera, unirse a un juego ![3](./numbers/3.svg) el jugador debe de introducir la clave de algún juego ya iniciado para poder unirse y jugar con otros jugadores. 

![pantalla-principal](./wireframes/home.svg)

Figura 1. Pantalla principal


![opcion-ayuda](./wireframes/help.svg)

 Figura 2. Opción de ayuda
Si el visitante selecciona la opción de solicitar ayuda se desplegará en la pantalla un mensaje donde podrá obtener más información respecto al juego.

## Sala de espera

El propósito de esta ventana (Figura 3) es permitirle al anfitrión de la partida visualizar a los participantes entrantes a la partida y establecer las configuraciones de la partida: establecer la probabilidad de encontrarse un geyser, la probabilidad de encontrarse huevos o binoculares en los espacios disponibles. 
El anfitrión estara diferenciado ya que aparecera de primero en la lista de jugadores y para los demás jugadores su nombre aparecera en rojo. Cuando el anfitrión realice un cambio en la configuración se le mostrara a los demás jugadores y si algun jugador cambia su nombre este cambio se le mostrara a los demás.
![pantalla-organizacion-partida](./wireframes/waiting-roomHost.svg)


Figura 3. Sala de espera para anfitrión.
Si el anfitrión abandona la partida el juego se cancela y expulsa a los demás jugadores. Al presionar el botón de start match se iniciara la partida y llevara a todos los jugadores a la arena.
![pantalla-cambio-avatar](./wireframes/DinoChoose.svg)

Figura 4. Cambiar de avatar.
Tambien haciendo click en los avatars se presenta la opcion de cambiar de dinosaurio. 

![pantalla-organizacion-partida](./wireframes/waiting-roomPlayer.svg)

Figura 5. Sala de espera para jugadores.
Los participantes visualizaran una pantalla similar con la diferencia de que no pueden cambiar las configuraciones.
Si los jugadores abandonan la partida la partida seguirá normalmente hasta que el anfitrión la termine.
## Juego

En esta pantalla se permite a los jugadores jugar de acuerdo a su turno. El número ![1](./numbers/1.svg) representa la barra de turnos o barra de proximidad, los jugadores pueden jugar mientras el meteorito no llegue a la tierra. El número ![2](./numbers/2.svg) muestra la caja de jugadores que contiene sus nombres, dinosaurio y su mano de cartas. El número ![3](./numbers/3.svg) es el botón para pasar turno. El número ![4](./numbers/4.svg) muestra el tablero y el número ![5](./numbers/5.svg) el botón para abandonar la partida y regresar a la pagina de Home.


![pantalla-de-juego2](./wireframes/board.svg)

Figura 6.  Ejemplo de juego: 
Se tocan las cartas correspondientes al personaje de cada jugador para que el dinosaurio avance hacia la casilla del color seleccionado más cercano y se pasa de turno, al jugar una carta el juego le proporcionara otra para tener en su mano, 3 cartas en todo momento.
Si se tiene una carta de meteorito se jugara y se movera el meteorito de la barra de turnos y se pasa de turno.
 Al caer en un geyser el jugador se devolvera a su casilla en la que estaba y la casilla donde estaba el geyser queda inutilizable.
 Al caer en un huevo se permitirá al jugador volver a jugar en su turno.
 Al caer en un binocular se permitirá ver el geyser más cercano.
![pantalla de calificación final](./wireframes/after-match.svg)

Figura 7. Calificación final

Al finalizar el juego o el tiempo se presentan las calificaciones y el scoreboard, un botón para regresar a la pantalla principal o para volver a jugar si el anfitrión no salio.

## Paso de mensajes 
Estado de paso de mensajes por broadcast
![paso de mensajes ](./state-machine/message-passing.svg)

Estado de paso de mensajes del waiting room
![paso de mensajes waiting ](./state-machine/waiting-room-message.svg)

Maquina de estados del cliente
![maquina de estados de cliente ](./state-machine/client-state.svg)

Maquina de estados del servidor
![maquina de estados del servidor ](./state-machine/server-state.svg)
