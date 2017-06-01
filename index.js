(function () {
	'use strict';
	var moment = require('moment');
	var
		config = require('./config.json'),
		firebaseConfig = require('./firebaseConfig.json'),
		fa = require('./modules/filmaffinity.js')(config);

	function fnIsLogged() {

		/*Este método genera un arbol con todas las urls que hay a día de hoy por letra.
		{
		"filmListUrl" : {
			"A" : {
			"-KkHUtAL5Jp7ptspflyT" : "http://www.filmaffinity.com/es/allfilms_A_1.html",
			"-KkHUtAL5Jp7ptspflyU" : "http://www.filmaffinity.com/es/allfilms_A_2.html",
			"-KkHUtAL5Jp7ptspflyV" : "http://www.filmaffinity.com/es/allfilms_A_3.html",
			"-KkHUtAMSClam2l1Hbhd" : "http://www.filmaffinity.com/es/allfilms_A_4.html",
			"-KkHUtAMSClam2l1Hbhe" : "http://www.filmaffinity.com/es/allfilms_A_5.html",
			...
			"B" : {
			"-KkHUtKjHpTkt0PKiPSB" : "http://www.filmaffinity.com/es/allfilms_B_1.html",
			"-KkHUtKjHpTkt0PKiPSC" : "http://www.filmaffinity.com/es/allfilms_B_2.html",
			"-KkHUtKjHpTkt0PKiPSD" : "http://www.filmaffinity.com/es/allfilms_B_3.html",
			"-KkHUtKkI10Gtuyy4GpC" : "http://www.filmaffinity.com/es/allfilms_B_4.html",
			...*/
		/*fa.createUrlList(function(character,completeUrl){
			fb.addUrlList(character,completeUrl);
		}, function(err){
			console.error(err);
		});*/

		/* Este método se usa pra obtener las urls de cada una de las películas */
		/*fb.getMainUrls(function(data){
			var _allUrls = [];
			//Esto se hace para desarrollo; si sólo buscamos una letra
			//no vamos a tener una colección dentro de una colección ( x : {},y: {}...)
			if (Object.keys(data.val())[0].length > 3){
				//Si es mayor que uno, es que viene un key de firebase
				//y no el array de letras ( o de "0-9" )
				var _list = data.val();
				for (var key in _list) {
					if (_list.hasOwnProperty(key)) {
						var element = _list[key];
						if ( element.retrieved === 0 ){
							_allUrls.push(element.url);
						}
						_allUrls.push(element);
					}
				}
			}else{
				data.forEach(function(childSnapshot) {
					var _list = childSnapshot.val();
					for (var key in _list) {
						if (_list.hasOwnProperty(key)) {
							var element = _list[key];
							if ( element.retrieved === 0 ){
								_allUrls.push({
									'url': element.url,
									'key': childSnapshot.key
								});
							}
						}
					}
				});
			}

			fa.getAllFilmIds(_allUrls, function(idFilm){
				fb.addFilmId(idFilm);
			}, function(err){
				console.error(err);
			}, function(urlMain){
				fb.setRetrievedPage(urlMain);
			});
		}, function(err){
			console.error(err);
		});*/
		/*113485-111953*/

		/*fb.getAllUrls(function(data){
			console.log('Hemos obtenido los datos - ' + moment().format('L LTS'));
			var _allUrls = [];
			var _list = data.val();
			console.log('Qedan por obtener: ' + Object.keys(_list).length);
			for (var key in _list) {
				if (_list.hasOwnProperty(key)) {

					var element = config.urlFilm + _list[key].id + '.html';
					_allUrls.push({
						'idFirebase' : key,
						'id' : _list[key].id,
						'url' : element
					});
				}
			}
			fa.getFilmInfo(_allUrls, function(movie){
				fb.saveMovieInfo(movie);
			}, function(err){
				console.error(err);
			});

		}, function(err){
			console.error(err);
		});*/
	}

	var fb = require('./modules/firebaseCtrl.js')(firebaseConfig, config, fnIsLogged);

})();