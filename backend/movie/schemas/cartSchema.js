var mongoose = require('mongoose')

var cartSchema = new mongoose.Schema({
	username: { type: String, required: true },
	title: String,
	director: String,
	year: Number,
	price: Number,
	poster: String,

	meta: {
		createTime:{
			type: Date,
			default:Date.now()
		},
		updateTime:{
			type: Date,
			default: Date.now()
		}
	}

})

cartSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createTime = this.meta.updateTime = Date.now()
	} else {
		this.meta.updateTime = Date.now()
	}
	next()
})

cartSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateTime')
			exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id:id})
			exec(cb)
	}
}

module.exports = cartSchema