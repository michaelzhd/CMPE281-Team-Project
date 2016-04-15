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
    	user.user_name = req.body.user_name;
		user.first_name = req.body.first_name;
		user.last_name = req.body.last_name;
		user.password = req.body.password;
		user.email = req.body.email;

		user.save(function(err){
			if (err)
				res.send(err);
			res.json({message : 'user created!'});
		})
	})
    .get(function(req, res){
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
	
router.route('/:user_name')
.get(function(req, res) {
	User.find({user_name :req.params.user_name}, function(err, user){
		if (err)
			res.send(err);
		res.json(user);
	});
})
.put(function(req, res){
	User.find({user_name:req.params.user_name}, function(err, user) {
		if (err)
			res.send(err);
		var userFind = user[0];
		userFind.first_name = req.body.first_name;
		userFind.last_name = req.body.last_name;
		userFind.last_name = req.body.last_name;
		userFind.password = req.body.password;
		userFind.email = req.body.email;
		console.log(userFind.first_name);
		
		//save the user
		userFind.save(function(err) {
			if (err)
				res.send(err);
			res.json({message : 'user updated!'});
		});
	});
})
.delete(function(req, res){
	User.remove({user_name:req.params.user_name}, function(err, user){
		if (err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

module.exports = router;
