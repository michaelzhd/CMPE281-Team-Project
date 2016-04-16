var express = require('express');
var Movie = require('../models/movieModel');

var router = express.Router();

router.route('/').
	post(function(req, res){
    	var movie = new Movie();
    	movie.movieId = req.body.movieId;
		movie.title = req.body.title;
		movie.year = req.body.year;
		movie.price = req.body.price;
		movie.poster = req.body.poster;

		movie.save(function(err){
			if (err)
				res.send(err);
			res.json({message : 'movie created!'});
		})
	})
    .get(function(req, res){
        Movie.find(function(err, movies) {
            if (err)
                res.send(err);
            res.json(movies);
        });
    });
	
	router.route('/:movieId')
	.get(function(req, res) {
		Movie.find({movieId :req.params.movieId}, function(err, movie){
			if (err)
				res.send(err);
			res.json(movie);
		});
	})
	.put(function(req, res){
		Movie.find({movieId:req.params.movieId}, function(err, movie){
			if (err)
				res.send(err);
			movie.title = req.body.title;
			movie.year = req.body.year;
			movie.price = req.body.price;
			movie.poster = req.body.poster;
			
			//save the user
			movie.save(function(err){
				if (err)
					res.send(err);
				res.json({message : 'movie updated!'});
			})
		});
	})
	.delete(function(req, res){
		Movie.remove({movieId:req.params.movieId}, function(err, movie){
			if (err)
				res.send(err);
			res.json({message:'Successfully deleted'});
		});
	});