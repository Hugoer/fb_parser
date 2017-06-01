(function(){
    'use strict';
    module.exports = function(config){

        var _filmaffinity = {};

        var Crawler = require('crawler'),
            $ = require('cheerio');

        var _allUrls = [];
        /* Coger las urls principales
            http://www.filmaffinity.com/es/allfilms_0-9_1.html',
            'http://www.filmaffinity.com/es/allfilms_0-9_2.html',
            'http://www.filmaffinity.com/es/allfilms_0-9_3.html'
            ....
        */
        function getPagination(url,callback, failure){
            console.log('LLamamos a filmaffinity: ' + url);
            var c = new Crawler();
            c.queue({
                uri       : url,
                maxConnections : config.maxConnections,
                userAgent : config.userAgent,
                skipDuplicates : true,
                jQuery    : true,
                forceUTF8 : true,
                callback  : function (error, result, done) {
                    if ( !!error ){
                        failure(error);
                    }else{
                        var $ = result.$;
                        if ( !!$('.pager') ){

                            var maxPaginationNumber = +$($('.pager')[0]).find('a').eq(-2).text(),
                                character = $($('td > b')[0]).text().replace('[','').replace(']','');

                            for (var index = 0; index < maxPaginationNumber; index++) {
                                var completeUrl = config.urlMain + character + '_' + (index + 1) + '.html';
                                callback(character,completeUrl);
                            }
                        }

                        setTimeout(function(){
                            _allUrls.shift();
                            console.log('Vamos a llamar de nuevo para continuar con la siguiente letra ');
                            if ( !!_allUrls[0] ){
                                getPagination(_allUrls[0], callback, failure);
                            }else{
                                console.log('Proceso getPagination finalizado');
                            }
                        }, config.timeout);
                    }

                }
            });
        }

        _filmaffinity.createUrlList = function(callback, failure){
            _allUrls = [];
            var urlIndexGeneral = config.filmsPagination.split('@');
            var urlHtml = '';

            for (var i = 0; i < urlIndexGeneral.length; i++) {
                if (!!urlIndexGeneral[i]){
                    urlHtml = config.urlMain + urlIndexGeneral[i] + '_1.html';
                    console.log('urlIndexGeneral - ' + urlHtml);
                    _allUrls.push(urlHtml);
                }
            }
            callback = callback || function(){};
            getPagination(_allUrls[0],callback, failure);
        };
        /* FIN - Coger urls principales */

        function getFilmId(url,callback, failure, setRetrievedPage){
            var c = new Crawler();
            c.queue({
                uri       : url.url,
                maxConnections : config.maxConnections,
                userAgent : config.userAgent,
                skipDuplicates : true,
                jQuery    : true,
                forceUTF8 : true,
                callback  : function (error, result, done) {
                    if ( !!error ){
                        failure(error);
                    }else{
                        var $ = result.$;

                        var _titles = $('.mc-title > a');
                        if ( _titles.length > 0 ){
                            for (var index = 0; index < _titles.length; index++) {
                                var element = +$(_titles[index]).attr('href').replace('/es/film','').replace('.html','');
                                console.log(element);
                                callback(element);
                            }
                            setTimeout(function(){
                                /*Sólo actualizar si no aparece la web que diga que no eres un Bot*/
                                setRetrievedPage(_allUrls[0]);
                                _allUrls.shift();
                                console.log('Obtener IDS - Vamos a llamar de nuevo para continuar con la siguiente página');
                                if ( !!_allUrls[0] ){
                                    getFilmId(_allUrls[0], callback, failure,setRetrievedPage);
                                }else{
                                    console.log('Proceso getFilmId finalizado ');
                                }
                            }, config.timeout);
                        }else{
                            console.log('No se ha encontrado ningún título. Eres un bot?¿ o ha terminado ya el proceso? Consulta http://www.filmaffinity.com ');
                            process.exit();
                        }

                    }

                }
            });
        }
        /*Obtener todos los ids de las películas */
        _filmaffinity.getAllFilmIds = function(allMailUrls, callback, failure, setRetrievedPage){
            _allUrls = allMailUrls;
            getFilmId(_allUrls[0], callback, failure, setRetrievedPage);
        };

        /* FIN - ids películas */

        /* Cogemos la información de la película */
        function getInfo(movie,callback,failure){
            var c = new Crawler();
            c.queue({
                uri       : movie.url,
                maxConnections : config.maxConnections,
                userAgent : config.userAgent,
                skipDuplicates : true,
                jQuery    : true,
                forceUTF8 : true,
                callback  : function (error, result, done) {
                    if ( !!error ){
                        failure(error);
                    }else{
                        //Resultado
                        var $ = result.$;

                        //Colecciones
                        var $actors = {};
                        var $genres = {};
                        var $topics = {};
                        var $awards = {};

                        var _award = '';
                        var movieWebSite = '';
                        var i = 0;
                        //Obj que guardaremos
                        var _movie = {};
                        _movie.idFirebase = movie.idFirebase;
                        _movie.id = movie.id;
                        _movie.urlFilmAffinity = movie.url;
                        _movie.actorsList = [];
                        _movie.genresList = [];
                        _movie.topicsList = [];
                        _movie.awards = [];

                        _movie.title = $('#main-title span').text();
                        /*_movie.synopsis = $($($('.movie-info')[0]).find('dd').last()[0]).text();*/
                        _movie.synopsis = $('.movie-info').find('dd[itemprop="description"]').text();
                        _movie.originalTitle = $($('.movie-info dd')[0]).text().trim();
                        _movie.year = $($($('.movie-info')[0]).find('dd[itemprop="datePublished"]')[0]).text();
                        _movie.country = $('#country-img').parent().text().trim();

                        movieWebSite = $('.web-url').find('a').text();

                        if ( !!movieWebSite ){
                            _movie.web = movieWebSite;
                        }

                        var _rating = $('#movie-rat-avg').text().trim().replace(',','.');
                        if ( !!_rating ){
                            _movie.rating = +_rating;
                            _movie.ratingCount = +$('#movie-count-rat span').text();
                            //Esto se hace para hacer las búsquedas más eficientes en firebase
                            //Si tiene un 6.6 y buscamos desde la app
                            //películas que tengan más de un 6, nos da igual que tenga un 6.6 o 6.9
                            _movie.ratingFilter = Math.floor(+_rating);
                        }

                        _movie.thumbnailName = $('#movie-main-image-container img').attr('src');

                        $actors = $($('.movie-info')[0]).find('a[href*="/es/search.php?stype=cast"]');
                        $genres = $($('.movie-info')[0]).find('a[href*="/es/moviegenre.php?genre"]');
                        $topics = $($('.movie-info')[0]).find('a[href*="/es/movietopic.php?topic"]');
                        $awards = $('.award').find('.margin-bottom');

                        for (i = 0; i < $actors.length; i++) {
                            _movie.actorsList.push( $($actors[i]).text().trim() );
                        }

                        for (i = 0; i < $genres.length; i++) {
                            _movie.genresList.push( $($genres[i]).text().trim() );
                        }

                        for (i = 0; i < $topics.length; i++) {
                            _movie.topicsList.push( $($topics[i]).text().trim() );
                        }

                        for (i = 0; i < $awards.length; i++) {
                            _award = $($awards[i]).text().trim();
                            if ( !!_award ){
                                _movie.awards.push(_award);
                            }
                        }

                        if (!!_movie.title || _movie.id === 0){
                            if (_movie.id !== 0){
                                console.log('Guardamos la película: ' +_movie.originalTitle + ' - ' + movie.idFirebase + ' - ' + movie.id);
                                callback(_movie);
                            }

                            setTimeout(function(){
                                _allUrls.shift();
                                if ( !!_allUrls[0] ){
                                    getInfo(_allUrls[0], callback, failure);
                                }else{
                                    console.log('Proceso getInfo finalizado');
                                }
                            }, config.timeout);
                        }else{
                            console.log(_movie);
                            var moment   		= require('moment');
                            console.log(moment().format('L LTS'));
                            console.log('No se ha encontrado ningún título. Eres un bot?¿ o ha terminado ya el proceso? Consulta http://www.filmaffinity.com ');
                            /*process.exit();*/
                            setTimeout(function(){
                                if ( !!_allUrls[0] ){
                                    getInfo(_allUrls[0], callback, failure);
                                }else{
                                    console.log('Proceso getInfo finalizado');
                                }
                            }, 108000000);
                        }


                    }

                }
            });
        }

        _filmaffinity.getFilmInfo = function(allUrlMovies, callback, failure){
            _allUrls = allUrlMovies;
            getInfo(_allUrls[0], callback, failure);
        };
        /* FIN - Info de la película */
        return _filmaffinity;
    };
})();