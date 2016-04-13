var mongoose = require('mongoose')

var orderSchema = require('../schemas/orderSchema')

var order = mongoose.model('order', orderSchema)

module.exports = order