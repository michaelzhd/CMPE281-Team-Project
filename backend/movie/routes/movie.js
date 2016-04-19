var express = require('express');
var Movie = require('../models/movieModel');

var router = express.Router();

router.route('/').
	post(function(req, res){
    	var movie = new Movie();
		movie.title = req.body.title;
		movie.director = req.body.director;
		movie.year = req.body.year;
		movie.price = req.body.price;
		movie.image = req.body.image;

		movie.save(function(err,savedmovie){
			if (err)
				res.send(err);
			res.json(savedmovie);
		})
	})
    .get(function(req, res){
        Movie.find(function(err, movies) {
            if (err)
                res.send(err);
            res.json(movies);
        });
    });
	
	router.route('/:title')
	.get(function(req, res) {
		Movie.find({title :req.params.title}, function(err, movie){
			if (err)
				res.send(err);
			res.json(movie);
		});
	});
	
	router.route('/id/:movieId')
	.get(function(req, res) {
		Movie.find({_id :req.params.movieId}, function(err, movie){
			if (err)
				res.send(err);
			res.json(movie);
		});
	})
	.put(function(req, res){
		Movie.find({_id:req.params.movieId}, function(err, movies){
			if (err)
				res.send(err);
			var movie = movies[0];
			movie.title = req.body.title;
			movie.year = req.body.year;
			movie.price = req.body.price;
			movie.director = req.body.director;
			movie.image = req.body.image;
			
			//save the user
			movie.save(function(err){
				if (err)
					res.send(err);
				res.json({message : 'movie updated!'});
			})
		});
	})
	.delete(function(req, res){
		Movie.remove({_id:req.params.movieId}, function(err, movie){
			if (err)
				res.send(err);
			res.json({message:'Successfully deleted'});
		});
	});
	module.exports = router;