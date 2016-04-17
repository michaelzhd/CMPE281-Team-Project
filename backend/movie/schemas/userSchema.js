var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	username: { type: String, required: true},
    password:{ type: String, required: true },
    email: String,
	cart:String,

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