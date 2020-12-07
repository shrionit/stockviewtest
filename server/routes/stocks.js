const express = require("express");
const {alpaca} = require('../alpaca');

const stock = express.Router();
// const stocklist = ['DOMO', 'TLRY', 'SQ', 'MRO', 'AAPL', 'GM', 'SNAP', 'SHOP', 'SPLK', 'BA', 'AMZN', 'SUI', 'SUN', 'TSLA', 'CGC', 'SPWR', 'NIO', 'CAT', 'MSFT', 'PANW', 'OKTA', 'TWTR', 'TM', 'RTN', 'ATVI', 'GS', 'BAC', 'MS', 'TWLO', 'QCOM'];
const stocklist = ['AAPL', 'AMZN', 'TSLA', 'MSFT', 'FB']
let assets = [];

let output = [];


stock.get('/', (req, res) => {
    alpaca.getBars('1Min', stocklist, { limit: 10 }).then(e => {
        output = [];
            for (let o in e) {
                alpaca.getAsset(o).then(d => output.push({
                    id: d.id,
                    stock: d.symbol,
                    label: d.name,
                    status: d.status,
                    openPrice: e[o][0].openPrice,
                    closePrice: e[o][0].closePrice,
                    rate: (e[o][0].closePrice-e[o][9].openPrice).toFixed(1),
                    data: e[o],
                }));
            }
        setTimeout(() => res.send(JSON.stringify(output)), 3000);
        }).catch(e => res.send(JSON.stringify({'error': e})));
});

stock.get('/:id', (req, res) => {
    alpaca.getAsset(req.params.id).then(d => {
        alpaca.getBars('1Min', d.symbol, { limit: 10 }).then(e => {
            res.send({
                    id: d.id,
                    stock: d.symbol,
                    label: d.name,
                    status: d.status,
                    openPrice: e[d.symbol][0].openPrice,
                    closePrice: e[d.symbol][0].closePrice,
                    rate: (e[d.symbol][0].closePrice-e[d.symbol][9].openPrice).toFixed(1),
                    data: e[d.symbol],
                })
        })
    });
})

module.exports.stock = stock;