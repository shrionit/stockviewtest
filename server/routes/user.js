const express = require("express");
const bodyParser = require('body-parser');
const {handleSignIn} = require("../app");
const user = express.Router();
user.use(bodyParser.json());
user.post('/login', (req, res) => {
    handleSignIn(req.body.user).then(() => res.send(JSON.stringify({ msg: "Success" })));
});

module.exports.user = user;