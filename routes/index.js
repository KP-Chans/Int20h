const express = require('express');
const request = require("request");
const axios = require('axios');
const config = require('../config/config');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {
        trackId: req.query.id,
        title: req.query.title,
        artist: req.query.artist
    });
})

router.post('/lyrics', function (req, ress) {
    var data = {
        'q': req.body.lyrics,
        'api_token': config.apiToken
    };

    request({
        uri: 'https://api.audd.io/findLyrics/',
        formData: data,
        method: 'POST'
    }, function (err, res, body) {
        if (JSON.parse(body).result[0]) {
            let a = "https://api.deezer.com/search/track/?q=" + JSON.parse(body).result[0].title + "&index=0&limit=2&output=json";
            axios.get(a, "")
                .then(x => {
                    if (x.data.data[0]) 
                        ress.redirect('/?id=' + x.data.data[0].id + '&title=' + x.data.data[0].title + '&artist=' + x.data.data[0].artist.name);
                    else 
                        ress.redirect('/');
                })
                .catch(err => console.log(err))
        }
        else {
            ress.redirect('/');
        }
    })
})

router.post('/audio', function (req, res) {
    if (req.body.result) {
        let a = "https://api.deezer.com/search/track/?q=" + req.body.result.title + "&index=0&limit=2&output=json";
        axios.get(a, "")
            .then(x => {
                res.json(x.data.data[0]);
            })
            .catch(err => console.log(err))
    }
    else {
        res.json(null);
    }
})

module.exports = router;