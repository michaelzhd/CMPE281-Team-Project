var express = require('express');
var Cart = require('../models/cartModel');

var router = express.Router();

router.route('/').
	post(function(req, res){
    	var cart = new Cart();
    	cart.username = req.body.username;
		cart.title = req.body.title;
		cart.director = req.body.director;
		cart.year = req.body.year;
		cart.price = req.body.price;
		cart.poster = req.body.poster;

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
	
router.route('/:username')
.get(function(req, res) {
	console.log("test");
	Cart.find({username :req.params.username}, function(err, cart){
		if (err)
			res.send(err);
		res.json(cart);
	});
})
.put(function(req, res){
	Cart.find({username:req.params.username}, function(err, cart){
		if (err)
			res.send(err);
		var cartFind = cart[0];
    	cartFind.username = req.body.username;
		cartFind.title = req.body.title;
		cartFind.director = req.body.director;
		cartFind.year = req.body.year;
		cartFind.price = req.body.price;
		cartFind.poster = req.body.poster;
		
		
		//save the user
		cartFind.save(function(err){
			if (err)
				res.send(err);
			res.json({message : 'cart updated!'});
		})
	});
})
.delete(function(req, res){
	Cart.remove({username:req.params.username}, function(err, cart){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

module.exports = router;