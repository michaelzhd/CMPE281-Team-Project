var mongoose = require('mongoose')

var movieSchema = require('../schemas/movieSchema')

var movie = mongoose.model('movie', movieSchema)

module.exports = movie