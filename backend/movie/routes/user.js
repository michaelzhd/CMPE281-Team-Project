var express = require('express');
var User = require('../models/userModel');

var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.route('/').
	post(function(req, res){
    	var user = new User();
    	user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		user.cart = req.body.cart;

		user.save(function(err,savedUser){
			if (err)
				res.send(err);
			res.json(savedUser);
		})
	})
    .get(function(req, res){
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
	
router.route('/:username')
.get(function(req, res) {
	User.find({username :req.params.username}, function(err, user){
		if (err)
			res.send(err);
		res.json(user);
	});
})
.put(function(req, res){
	User.find({username:req.params.username}, function(err, user) {
		if (err)
			res.send(err);
		var userFind = user[0];
		userFind.password = req.body.password;
		userFind.email = req.body.email;
		userFind.cart = req.body.cart;
		//save the user
		userFind.save(function(err) {
			if (err)
				res.send(err);
			res.json({message : 'user updated!'});
		});
	});
})
.delete(function(req, res){
	User.remove({username:req.params.username}, function(err, user){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

router.route('/id/:id')
.get(function(req, res) {
	User.find({_id :req.params.id}, function(err, user){
		if (err)
			res.send(err);
		res.json(user);
	});
})
.put(function(req, res){
	User.find({_id:req.params.id}, function(err, user) {
		if (err)
			res.send(err);
		var userFind = user[0];
		userFind.username = req.body.username;
		userFind.password = req.body.password;
		userFind.email = req.body.email;
		userFind.cart = req.body.cart;
		//save the user
		userFind.save(function(err) {
			if (err)
				res.send(err);
			res.json({message : 'user updated!'});
		});
	});
})
.delete(function(req, res){
	User.remove({_id:req.params.id}, function(err, user){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

module.exports = router;
