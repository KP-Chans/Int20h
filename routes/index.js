const express = require('express');
const request = require("request");
const axios = require('axios');
const router = express.Router();

router.get('/', function(req, res) {

    res.render('index', {
        trackId: req.query.id

    });
})

router.post('/lyrics', function(req, ress) {

    var data = {
        'q': req.body.lyrics,
        'api_token': 'f7114b9b152071e0523cd18154b88f58'
    };

    request({
        uri: 'https://api.audd.io/findLyrics/',
        form: data,
        method: 'POST'
    }, function(err, res, body) {
        console.log(JSON.parse(body).result[0].title);
        let a = "https://api.deezer.com/search/track/?q=" + JSON.parse(body).result[0].title + "&index=0&limit=2&output=json";
        axios.get(a, "")
            .then(x => {
                console.log(x.data.data[0].id);
                ress.redirect('/?id=' + x.data.data[0].id);
            })
            .catch(err => console.log(err))
    });
})

module.exports = router;