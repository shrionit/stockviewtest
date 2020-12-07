const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const dotenv = require('dotenv').config();
const {user} = require('./routes/user');
const {stock} = require('./routes/stocks');
const {watchlist} = require('./routes/watchlist');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/user', user);
app.use('/stock', stock);
app.use('/watchlist', watchlist);

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);