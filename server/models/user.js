const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const User = new mongoose.Schema({
    name: {type: String, require: true}, 
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true, minlength: 6},
    image: {type: String, require: true},
    places: [{type: mongoose.Types.ObjectId, ref: 'Place'}]
})

User.plugin(uniqueValidator)

module.exports = mongoose.model('User', User)