var express = require('express');
var Order = require('../models/orderModel');

var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.route('/').
	post(function(req, res){
    	var order = new Order();
    	order.userId = req.body.userId;
		order.movieId = req.body.movieId;
		order.totalAmount = req.body.totalAmount;
		order.save(function(err,savedOrder){
			if (err)
				res.send(err);
			res.json(savedOrder);
		})
	})
    .get(function(req, res){
        Order.find(function(err, orders) {
            if (err)
                res.send(err);
            res.json(orders);
        });
    });
	
router.route('/:userId')
.get(function(req, res) {
	Order.find({userId :req.params.userId}, function(err, orders){
		if (err)
			res.send(err);
		res.json(orders);
	});
})
.put(function(req, res){
	Order.find({userId:req.params.userId}, function(err, order) {
		if (err)
			res.send(err);
		var orderFind = order[0];
		orderFind.movieId = req.body.movieId;
		orderFind.totalAmount = req.body.totalAmount;
		
		//save the order
		orderFind.save(function(err,savedOrder) {
			if (err)
				res.send(err);
			res.json(savedOrder);
		});
	});
})
.delete(function(req, res){
	Order.remove({userId:req.params.userId}, function(err, order){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

router.route('/id/:id')
.get(function(req, res) {
	Order.find({_id :req.params.id}, function(err, order){
		if (err)
			res.send(err);
		res.json(order);
	});
})
.put(function(req, res){
	Order.find({_id:req.params.id}, function(err, order) {
		if (err)
			res.send(err);
		var orderFind = order[0];
		orderFind.movieId = req.body.movieId;
		orderFind.totalAmount = req.body.totalAmount;
		//save the order
		orderFind.save(function(err, savedOrder) {
			if (err)
				res.send(err);
			res.json(savedOrder);
		});
	});
})
.delete(function(req, res){
	Order.remove({_id:req.params.id}, function(err, order){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});
module.exports = router;
