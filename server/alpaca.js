const Alpaca = require('@alpacahq/alpaca-trade-api');
const cred = {
    keyId: process.env.APCA_PAPER_API_KEY_ID,
    secretKey: process.env.APCA_PAPER_API_SECRET_KEY,
    paper: true,
    usePolygon: false
};

const alpaca = new Alpaca(cred);
module.exports.alpaca = alpaca;