var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	// userId: String,
	// username: String,
	// password: String
	user_name: String,
	first_name:String,
	last_name:String,
    	password:String,
    	email: String

})



userSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id:id})
			exec(cb)
	}
}

module.exports = userSchema