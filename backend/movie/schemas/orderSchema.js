var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	movieId: [{type: String, required: true}],
	totalAmount: Number,

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

orderSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createTime = this.meta.updateTime = Date.now()
	} else {
		this.meta.updateTime = Date.now()
	}
	next()
})

orderSchema.statics = {
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

module.exports = orderSchema