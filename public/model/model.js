var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var validator = require('validator');
var book = Schema({
    isbn : String,
    title : String,
    author : String,
    pub : String,
    date : String,
    realPrice : Number,
    sellPrice : Number,
    content : String,
    state : String,
    imageUrl : String,
    password : String
});

mongoose.model('book', book);