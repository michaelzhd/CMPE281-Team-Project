var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

var User = require('./app/models/user');

//routes for our api
var router = express.Router();

//middleware to use for all requests
router.use(function(req, res, next){
    console.log("request is happening");
    next();
});

router.get('/', function(req, res){
     res.json({message:'welcome to our api!'});
});

//post for /api/user
router.route('/user').
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
	
	router.route('/user/:user_name')
	.get(function(req, res) {
		User.find({user_name :req.params.user_name}, function(err, user){
			if (err)
				res.send(err);
			res.json(user);
		});
	})
	.put(function(req, res){
		User.find({user_name:req.params.user_name}, function(err, user){
			if (err)
				res.send(err);
			user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;
			user.last_name = req.body.last_name;
			user.password = req.body.password;
			user.email = req.body.email;
			
			//save the user
			user.save(function(err){
				if (err)
					res.send(err);
				res.json({message : 'user updated!'});
			})
		});
	})
	.delete(function(req, res){
		User.remove({user_name:req.params.user_name}, function(err, user){
			if (err)
				res.send(err);
			res.json({message:'Successfully deleted'});
		});
	});
	
app.use('/api', router);
app.listen(port);
