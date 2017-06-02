(function () {
    'use strict';
    module.exports = function (credentials, config, executeWhenLogged) {

        var fb = require('firebase');
        fb.initializeApp(credentials.config);

        fb.auth().signInWithEmailAndPassword(credentials.auth.email, credentials.auth.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            if (!!error) {
                console.error(error);
            }
        });

        fb.auth().onAuthStateChanged(function (user) {
            if (!!user) {
                executeWhenLogged();
                console.log('Usuario logueado correctamente: ' + user.email);
            }
        });

        var _firebase = function () { };

        console.log('Firebase inicado correctamente');

        _firebase.addUrlList = function (character, url) {
            var result = fb.database().ref('listUrl').child(character).push({
                'url': url,
                'retrieved': 0
            });
            console.log('Hemos creado el registro: ' + character + ' con la url: ' + url + ' y tiene la key: ' + result.key);
        };

        _firebase.addFilmId = function (id) {
            var _id = id;
            fb.database().ref('listId').child('id').child(id).once('value', function (film) {
                if (!!film.val()) {
                    console.log('La película: ' + _id + ' ya la tenemos guardada.');
                } else {
                    console.log('NO EXISTE');
                    /*var result = fb.database().ref('listId').push({
                        'id': _id,
                        'retrieved' : 0
                    });*/
                    var result = fb.database().ref('listId').child(_id).set({
                        'id': _id,
                        'retrieved': 0
                    });
                    console.log('Hemos guardado la película con el id: ' + id);
                }

            });

        };

        _firebase.setRetrievedPage = function (urlMain) {
            /*fb.database().ref('listId').orderByChild('url').equalTo(urlMain).set({retrieved: 1});*/
            fb.database().ref('listUrl').child(urlMain.key).orderByChild('url').equalTo(urlMain.url).once('value', function (snapshot) {
                console.log(snapshot.val());
                console.log(snapshot.key);
                var _urlKey = Object.keys(snapshot.val())[0];
                if (!!_urlKey) {
                    fb.database().ref('listUrl').child(urlMain.key).child(_urlKey).child('retrieved').set(1);
                }
            });

        };

        _firebase.setRetrievedId = function (id) {
            fb.database().ref('listId').orderByChild('id').equalTo(id).set({ retrieved: 1 });
        };

        _firebase.getMainUrls = function (callback, failure) {
            fb.database().ref('listUrl').once('value', function (snapshot) {
                callback(snapshot);
            }, function (err) {
                failure(err);
            });
        };

        _firebase.getAllUrls = function (callback, failure) {
            fb.database().ref('listId').orderByChild('retrieved').equalTo(0).once('value', function (snapshot) {
                callback(snapshot);
            }, function (err) {
                failure(err);
            });
        };

        _firebase.saveMovieInfo = function (movie) {
            var _movie = movie;
            var result = fb.database().ref('movies').child(movie.idFirebase).set(_movie);
            result.then(function () {
                console.log('Marcamos como retrieved la película: ' + _movie.originalTitle + ' - ' + _movie.idFirebase + ' - ' + _movie.id);
                fb.database().ref('listId').child(_movie.idFirebase).child('retrieved').set(1);
            });
        };

        _firebase.getOldMoviesNode = function () {
            fb.database().ref('movies').once('value', function (film) {
                film.forEach(function (movie) {
                    var _movie = movie.val();


                });
            });
        };

        _firebase.downloadImage = function () {
            /*http://pics.filmaffinity.com/memories_off_2nd-306148635-mmed.jpg*/

        };

        return _firebase;
    };
})();