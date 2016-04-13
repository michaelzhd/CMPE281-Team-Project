var mongoose = require('mongoose')

var cartSchema = require('../schemas/cartSchema')

var cart = mongoose.model('cart', cartSchema)

module.exports = cart