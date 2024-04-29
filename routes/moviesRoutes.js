var express = require('express');
var router = express.Router();
var Movie = require('../models/Movies');
var mongoose = require('mongoose');
var authJwtController = require('../auth_jwt');

router.get('/', authJwtController.isAuthenticated, function (req, res) {
    if (req.query.reviews ==='true') {
        Movie.aggregate = ([
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" }
                }
            },
            {
                $sort: { averageRating: -1 }
            }
        ]).exec((err, movies) => {
            if (err) {
                res.status(500).json({error: 'Internal server error.'});
            } else {
                res.json(movies);
            }
          });
    } else {
        Movie.find({}, function(err, movies) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(movies);
            }
        });
    }
});

router.get('/:movieparameter', authJwtController.isAuthenticated, function (req, res) {
    const id = mongoose.Types.ObjectId(req.params.movieparameter);
    if (!req.query.reviews) {
        Movie.findOne({ _id: id }, function(err, movie) {
            if (!movie) {
                res.status(404).send({success: false, msg: 'Movie not found.'});
            } else if (err) {
                res.status(500).send(err);
            } else {
                res.json(movie);
            }
        });
    } else if (req.query.reviews === 'true') {
        Movie.aggregate([
            {
                $match: { _id: id }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" }
                }
            },
            {
                $limit: 1
            }
        ]).exec(function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(result);
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid query parameter.' });
    }
});
            

router.post('/', authJwtController.isAuthenticated, function(req, res) {
    var movie = new Movie();
    movie.title = req.body.title;
    movie.releaseDate = req.body.releaseDate;
    movie.genre = req.body.genre;
    movie.actors = req.body.actors;
    movie.imageUrl = req.body.imageUrl;

    movie.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ success: true, message: 'Movie saved successfully.', movie: movie });
        }
    });
});

router.put('/:movieparameter', authJwtController.isAuthenticated, function(req, res) {
    Movie.findOneAndUpdate({ title: req.params.movieparameter }, req.body, function(err, movie) {
        if (err) {
            res.status(500).send(err);
        } else if (!movie) {
            res.status(404).send({success: false, msg: 'Movie not found.'});
        } else {    
            res.json({ success: true, message: 'Movie updated successfully.' });
        }
    });
});

router.delete('/:movieparameter', authJwtController.isAuthenticated, function(req, res) {
    Movie.findOneAndDelete({ title: req.params.movieparameter }, function(err, movie) {
        if (err) {
            res.send(err);
        } else if (!movie) {
            res.status(404).json({ success: false, message: 'Movie not found.' });
        } else {
            res.json({ success: true, message: 'Movie deleted successfully.' });
        }
    });
});    

router.all('/', authJwtController.isAuthenticated, function(req, res) {
    res.status(405).send({success: false, msg: 'Method not allowed.'});
});

module.exports = router;