const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const bodyParser = require('body-parser');
const routeIndex = require('./routes/index');
const config = require('./config/config');

const app = express();
const port = config.ServerPort;
const viewsDir = path.join(__dirname, 'views');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser()); // get information from html forms

app.engine('mst', mustache(viewsDir));

app.set('views', viewsDir);
app.set('view engine', 'mst');

app.use('/', routeIndex);

app.listen(port, () => console.log(`Listening on port ${port}`));