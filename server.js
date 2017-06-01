(function(){
    'use strict';
    /** Dar de alta películas nuevas que estén en config.urlNewMovie y no estén en filmListId
    * Escuchar un nodo de firebase para autogenerar películas nuevas; por si yo manualmente las creo a mano por cualquier motivo.
    * Insertar películas nuevas en netflix, netflix próximamente, hbo, estrenos DVD,vídeo bajo demanda (Filmin + movistar ) películas en cartelera ( Eliminarla cuando ya no esté )
        * Insertar el id de la película en un nodo de firebase, que desde firebase functions estaremos escuchando para enviar una push a los usuarios que tengan configurado
        que quieren recibir dicha información ( Es decir, si he marcado que quiero recibir alertas para las nuevas películas de HBO, netflix, cines, o lo que sea, me llegue una push )
        * También deberíamos poder configurar sólo una película para que no estén llegando muchísimas push. OJO con la duplicidad.*/
})();