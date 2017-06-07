(function () {
    'use strict';

    const functions = require('firebase-functions');
    const admin = require('firebase-admin');
    const push = require('./modules/push');
    const moment = require('moment');
    /*push.sendNotification()*/
    admin.initializeApp(functions.config().firebase);

    const logLevel = {
        info: 0,
        error: 1
    };

    let instance = moment().valueOf();

    function rootlog(prefix, level, msg) {
        var str = instance + ':' + prefix + ' - ' + msg;
        if (level == logLevel.info) {
            console.log(str);
        } else if (level == logLevel.error) {
            console.error(str);
        }
    }

    exports.updateLastFilm = functions.database.ref('moviesList').onWrite(event => {
        let film = event.data.val();
        if (event.data.previous.exists()) {
            rootlog(film.id, logLevel.info, 'La película: ' + film.id + ' ya existe');
        } else {
            rootlog(film.id, logLevel.info, 'La película: ' + film.id + ' no existe');
        }
    });

})();