var express = require('express');
var Cart = require('../models/cartModel');

var router = express.Router();

router.route('/').
	post(function(req, res){
    	var cart = new Cart();
    	cart.userId = req.body.userId;
		cart.movieId = req.body.movieId;

		cart.save(function(err){
			if (err)
				res.send(err);
			res.json({message : 'cart created!'});
		})
	})
    .get(function(req, res){
        Cart.find(function(err, cart) {
            if (err)
                res.send(err);
            res.json(cart);
        });
    });
	
router.route('/:userId')
.get(function(req, res) {
	Cart.find({userId :req.params.userId}, function(err, cart){
		if (err)
			res.send(err);
		res.json(cart);
	});
});

router.route('/id/:id')
.get(function(req, res) {
	Cart.find({_id :req.params.id}, function(err, cart){
		if (err)
			res.send(err);
		res.json(cart);
	});
})
.put(function(req, res){
	Cart.find({_id:req.params.id}, function(err, cart){
		if (err)
			res.send(err);
		var cartFind = cart[0];
    	cartFind.movieId = req.body.movieId;
		
		//save the user
		cartFind.save(function(err){
			if (err)
				res.send(err);
			res.json({message : 'cart updated!'});
		})
	});
})
.delete(function(req, res){
	Cart.remove({_id:req.params.id}, function(err, cart){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

module.exports = router;