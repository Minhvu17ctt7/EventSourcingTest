const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String,},
    password: {type: String,},
    name: {type: String},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('users',UserSchema);