const express = require("express");
const watchlist = express.Router();
const bodyParser = require('body-parser');
const {viewWatchlist, addWatchlist, removeWatchlist} = require("../app");

watchlist.use(bodyParser.json());
watchlist.get('/view', (req, res) => {
    req.query.user = JSON.parse(req.query.user);
    viewWatchlist(req.query.user).then(o => {
        res.send(JSON.stringify({ id: o.id, watchlist: o.data().watchlist }));
    }).catch(e => console.log(e));
});

watchlist.post('/add', (req, res) => {
    addWatchlist(req.body.user, req.body.stockid).then((d) => {
        res.send(JSON.stringify({ msg: "Success", stock:  d}));
    }).catch(e => {
        res.send(JSON.stringify({ msg: "Error" }));
    })
});

watchlist.delete('/remove', (req, res) => {
    removeWatchlist(req.body.user, req.body.stockid).then((d) => {
        res.send(JSON.stringify({ msg: "Success", stock: d }));
    }).catch(e => {
        res.send(JSON.stringify({ msg: "Error" }));
    })
});

module.exports.watchlist = watchlist;