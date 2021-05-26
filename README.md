Este proyecto es realizado por el equipo **Aldeser** compuesto por los estudiantes: Alexandra Siles, Dennis Solano y Sergio Fernández

Una breve descripción del juego original *Hoot Owl Hoot* es un juego de mesa colaborativo en el que pueden participar de 2 a 4 jugadores con la finalidad de llevar todos los búhos al nido antes de que amanezca. 
https://boardgamegeek.com/boardgame/94483/hoot-owl-hoot
El juego adaptativo es un juego colaborativo *Dino Explosion* en el que podran participar de 2 a 6 jugadores. En el cual al igual que en su juego base los caracteres sacan y usan una carta por turno con la cual pueden avanzar.
### Componentes del juego

 - Tablero:tablero cuadrado en el cual las casillas pueden tener seis colores diferentes (amarillo, verde, naranja, azul morado y rojo) y que llevan hasta la meta --final del tablero--. El tablero posee una barra de claridad que indica cuánto falta para que termine el juego. Esta barra tiene en un extremo de inicio y en el otro extremo el final.
 
 - Carta de meteorito: al comenzar, se coloca en la barra de claridad en el extremo izquierdo "el espacio" y se mueve una posición cada vez que aparece una carta de meteorito, hasta que llegue al otro extremo "La tierra".
 
 - Ficha de caracter: hay un total de seis fichas. El mínimo de fichas con el que se puede jugar es dos y el máximo seis. Entre más fichas haya, mayor es la dificultad.
 
 - Baraja de cartas: existen tres tipos de cartas. Las que son de alguno de los seis colores y las cartas de meteorito y las cartas de poder. 
 
 - Mano de cartas: las cartas en mano de cada jugador en este caso 3 cartas por jugador

### Mecánica del juego original

En cada turno, cada jugador debe jugar alguna de sus cartas y mover su ficha de búho a la siguiente **posición disponible** del color de carta que escogió jugar. Si un jugador tiene una carta de sol, **está obligado** a jugarla y avanzar la ficha de sol en ese turno. Al finalizar su turno, el jugador debe coger una nueva carta de la pila de cartas y enviar a la pila de descarte la carta que acaba de utilizar. Si todos los búhos llegaron al nido antes de que la ficha de sol llegara al sol, entonces todos los jugadores ganan; pero si aún falta al menos un búho de entrar al nido y la ficha de sol llega a su punto máximo, el juego concluye y los jugadores pierden.


### Mecanica del juego adaptado
Al igual que en el original cada jugador debe de jugar una de sus cartas en su turno, moviendo a la **posición disponible** del color de carta que escogió jugar. Si un jugador tiene una carta de meteorito, **está obligado** a jugarla y avanzar la ficha de meteorito en ese turno. Al finalizar su turno, el jugador debe coger una nueva carta de la pila de cartas y enviar a la pila de descarte la carta que acaba de utilizar. Si todos los dinosaurios llegaron a la cueva antes de que la ficha de meteorito llegara la tierra, entonces todos los jugadores ganan; pero si aún falta al menos un dinosaurio de entrar a la cueva y la ficha de meteorito llega a su punto máximo, el juego concluye y los jugadores pierden.


### Adaptaciones en orden descendente de prioridades:
 1. Posicionar al azar en las casillas del tablero bombas ocultas. Si un jugador mueve su ficha a una posición donde haya una bomba, la ficha se devuelve a su posición anterior y dicha posición queda inutilizable.
 
 2. Posicionar al azar al igual que las bombas casillas con premios que les permiten moverse otra vez en el mismo turno (sacar y usar otra carta). Estos están ocultos hasta que llega un caracter a esa posición.
 
 4. Introducir otros tipo de cartas. Esta idea está inspirada en el juego de cartas UNO.
	Poderes en orden descendente de prioridad:
	4.1 Una carta que permita avanzar más de una posición
	4.2 Una carta que obligue a otro jugador a devolver su ficha
	4.3 Carta que permita a un jugador bloquear el siguiente meteorito que aparezca. De manera que el siguiente jugador pueda jugar alguna de sus cartas, pero no esta.
	4.4 Pasar el turno de otro jugador,
	
 
 ### Prioridades de desarrollo
 
 1. Diferentes dinosaurios para cada jugador por defecto.
 2. Cartas a azar.
 3. Mover caracteres.
 4. ubicar bombas.
 5. Cambiar de dinosaurios.
 6. Calificaciones en orden de llegada a la cueva.