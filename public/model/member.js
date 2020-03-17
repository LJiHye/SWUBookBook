var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var validator = require('validator');
var member = Schema({
    email : String,
    password : String
});

mongoose.model('member', member);