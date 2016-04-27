var express = require('express');
var Movie = require('../models/movieModel');

var router = express.Router();

	router.route('/:category')
	.get(function(req, res) {
		Movie.find({category :req.params.category}, function(err, movie){
			if (err)
				res.send(err);
			res.json(movie);
		});
	})
	module.exports = router;
