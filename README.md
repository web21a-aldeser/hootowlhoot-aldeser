El objetivo principal de este proyecto es utilizar tecnologías web, que se irán aprendiendo durante el curso, para implementar una adaptación, con fines académicos, del juego de mesa *Hoot Owl Hoot* de   *Peaceable Kingdom*.

Una breve descripción del juego... *Hoot Owl Hoot* es un juego de mesa colaborativo en el que pueden participar de 2 a 4 jugadores con la finalidad de llevar todos los búhos al nido antes de que amanezca. 

### Componentes del juego

 - Tablero: está compuesto por una espiral de círculos consecutivos que pueden tener seis colores (amarillo, verde, naranja, azul morado y rojo) y que llevan hasta el nido en el centro del tablero. El tablero posee una barra de claridad que indica cuánto falta para que amanezca. Esta barra tiene en un extremo una luna y en el otro extremo el sol.
 
 - Ficha de sol: al comenzar, se coloca en la barra de claridad en el extremo de la luna y se mueve una posición cada vez que aparece una carta de sol.
 
 - Ficha de búho: hay un total de seis fichas. El mínimo de fichas con el que se puede jugar es tres y el máximo seis. Entre más fichas haya, mayor es la dificultad.
 
 - Baraja de cartas: existen dos tipos de cartas. Las que son de alguno de los seis colores y las cartas de sol. En todo momento cada jugador puede tener un máximo de tres cartas.

### Mecánica del juego

En cada turno, cada jugador debe jugar alguna de sus cartas y mover su ficha de búho a la siguiente **posición disponible** del color de carta que escogió jugar. Si un jugador tiene una carta de sol, **está obligado** a jugarla y avanzar la ficha de sol en ese turno. Al finalizar su turno, el jugador debe coger una nueva carta de la pila de cartas y enviar a la pila de descarte la carta que acaba de utilizar. Si todos los búhos llegaron al nido antes de que la ficha de sol llegara al sol, entonces todos los jugadores ganan; pero si aún falta al menos un búho de entrar al nido y la ficha de sol llega a su punto máximo, el juego concluye los jugadores pierden.