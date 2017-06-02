(function () {
    'use strict';
    var
        fs = require('fs'),
        request = require('request'),
        exec = require('child_process').exec,
        client = {};
    const GoogleImages = require('google-images');

    function downloadThumbnail(uri, name, callback) {

        callback = callback || function () { };

        if (uri) {

            request.head(uri, function (err, res, body) {

                if (err) {

                    console.error(err);

                } else {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request
                        .get(uri)
                        .on('error', function (err) {
                            console.log(err);
                        })
                        .pipe(fs.createWriteStream('./img/' + name));
                }

            });


        }
    }

    module.exports = function googleSearchEngine(id, key) {
        var fn = function () { };
        const client = new GoogleImages(id, key);

        fn.search = function (strToSearch, id) {
            client.search(strToSearch, { size: 'large' })
                .then(images => {
                    console.log(images[0]);
                    downloadThumbnail(images[0].url, id + '.jpg')
                });
        };

        return fn;
    };

})();