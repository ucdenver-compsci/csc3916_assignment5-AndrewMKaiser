var express = require('express');
var router = express.Router();
var User = require('../models/Users');

router.all('/', function(req, res) {
    res.status(405).send({success: false, msg: 'Method not allowed.'});
});


module.exports = router;