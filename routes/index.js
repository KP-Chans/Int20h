const express = require('express');
const request = require("request");
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

router.get('/', function (req, res) {

    res.render('index', {
        trackId: req.query.id

    });
})

router.post('/lyrics', function (req, ress) {
    var data = {
        'q': req.body.lyrics,
        'api_token': '080f948aefc35f2fbd64c7205fcc5c14'

    };

    request({
        uri: 'https://api.audd.io/findLyrics/',
        formData: data,
        method: 'POST'
    }, function (err, res, body) {
        console.log(JSON.parse(body).result[0].title);
        let a = "https://api.deezer.com/search/track/?q=" + JSON.parse(body).result[0].title + "&index=0&limit=2&output=json";
        axios.get(a, "")
            .then(x => {
                console.log(x.data.data[0].id);
                ress.redirect('/?id=' + x.data.data[0].id);
            })
            .catch(err => console.log(err))
    })
})

router.post('/audio', function (req, ress) {
    console.log(req.body);
    let a = "https://api.deezer.com/search/track/?q=" + req.body.result.title + "&index=0&limit=2&output=json";
    axios.get(a, "")
        .then(x => {
            console.log(x.data.data[0].id);
            // window.location.replace('/?id=' + x.data.data[0].id);
            req.method = 'get';
            ress.redirect('/?id=' + x.data.data[0].id);
        })
        .catch(err => console.log(err))

})

router.post('/audio', function (req, res) {
    console.log(req.body);
    let a = "https://api.deezer.com/search/track/?q=" + req.body.result.title + "&index=0&limit=2&output=json";
    axios.get(a, "")
        .then(x => {
            console.log(x.data.data[0].id);

            res.json(x.data.data[0].id);
        })
        .catch(err => console.log(err))

})

module.exports = router;