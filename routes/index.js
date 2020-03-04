var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// var buy = require('./buy (not used)/buy.js')
// var sell = require('./sell (not used)/sell.js')
// var join = require('./join/join')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/join', function(req, res, next) {
  res.render('join.html');
});

router.get('/login', function(req, res, next) {
  res.render('login.html');
});

router.get('/sell', function(req, res, next) {
  res.render('sell.html');
});

router.post('/upload', function(req, res) {
  var body = req.body;

  var p_isbn = body.isbn;
  var p_title = body.title;
  var p_author = body.author;
  var p_pub = body.pub;
  var p_realPrice = body.realPrice;
  var p_sellPrice = body.sellPrice;
  var p_content = body.content;
  var p_state = body.state;
  var p_password = body.password;

  var book = mongoose.Schema({
    isbn : 'string',
    title : 'string',
    author : 'string',
    pub : 'string',
    realPrice : 'number',
    sellPrice : 'number',
    content : 'string',
    state : 'string',
    password : 'string'
  });
  var Book = mongoose.model('Schema', book);
  var newBook = new Book({isbn : p_isbn, title : p_title, author : p_author, pub : p_pub, realPrice : p_realPrice, sellPrice : p_sellPrice, content : p_content, state : p_state, password : p_password});

  //var newBook = new Book({isbn : p_isbn, title : p_title, author : p_author, pub : p_pub, realPrice : p_realPrice, sellPrice : p_sellPrice, state : p_state, password : p_password});

  newBook.save(function(error,data){
    if(error) console.log(error);
    else {
      console.log('saved!');
      res.redirect('/buy');
    }
  });
});

router.get('/buy', function(req, res, next) {
  res.render('buy.html');
});

router.get('/contact', function(req, res, next) {
  res.render('contact.html');
});

// router.use('/buy', buy);
// router.use('/sell', sell);
// router.use('/join', join)

module.exports = router;