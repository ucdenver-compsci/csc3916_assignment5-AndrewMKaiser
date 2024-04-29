var express = require('express');
var router = express.Router();
var Review = require('../models/Reviews');
var crypto = require("crypto");
var rp = require('request-promise');
var authJwtController = require('../auth_jwt');

const GA_TRACKING_ID = process.env.GA_KEY;

function trackDimension(category, action, label, value, dimension, metric) {
    var options = {
        method: 'GET',
        url: 'https://www.google-analytics.com/collect',
        qs: {
            v: '1',
            tid: GA_TRACKING_ID,
            cid: crypto.randomBytes(16).toString("hex"),
            t: 'event',
            ec: category,
            ea: action,
            el: label,
            ev: value,
            cd1: dimension,
            cm1: metric
        },
        headers: { 'Cache-Control': 'no-cache' }
    };

    return rp(options);
}

router.get('/', function (req, res) {
    Review.find({}, function(err, reviews) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ success: true, reviews: reviews });
        }
    });
});

router.post('/', authJwtController.isAuthenticated, function(req, res) {
    var review = new Review();
    review.movieId = req.body.movieId;
    review.username = req.body.username;
    review.review = req.body.review;
    review.rating = req.body.rating;

    review.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ success: true, message: 'Review created!', review: review });
        }
    });
});

module.exports = router;