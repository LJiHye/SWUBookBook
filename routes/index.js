var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var $ = require('jquery');

require('../public/model/model');
require('../public/model/member');

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

router.post('/upload_book', function(req, res) {
  var body = req.body;

  var p_isbn = body.isbn;
  var p_title = body.title;
  var p_author = body.author;
  var p_pub = body.pub;
  var p_date = body.date;
  var p_realPrice = body.realPrice;
  var p_sellPrice = body.sellPrice;
  var p_content = body.content;
  var p_state = body.state;
  var p_imageUrl = body.imageUrl;
  var p_password = body.password;

  var Book = mongoose.model('book');

  var newBook = new Book({isbn : p_isbn, title : p_title, author : p_author, pub : p_pub, date : p_date, realPrice : p_realPrice, sellPrice : p_sellPrice, content : p_content, state : p_state, imageUrl : p_imageUrl, password : p_password});

  newBook.save(function(error,data){
    if(error) console.log(error);
    else {
      console.log('book saved!');
      res.redirect('/buy');
    }
  });
});

router.post('/upload_member', function(req, res) {
  var body = req.body;

  var p_email = body.email;
  var p_password = body.password;

  console.log(p_email, p_password);

  var Member = mongoose.model('member');

  var newMember = new Member({email : p_email, password : p_password});

  newMember.save(function(error,data){
    if(error) console.log(error);
    else {
      console.log('member saved!');
      res.redirect('/');
    }
  });
});

router.post('/load', function(req, res){
  var book = mongoose.model('book');
  book.find({}, function(err, data) {
    if(err) {console.error(err); return;}
    if(data.length == 0) {console.log('not found'); return;}

    console.log('success to find!');
    console.log(data);
    res.json(data);
  });
});

router.get('/buy', function(req, res, next){
  res.render('buy.html');

  var book = mongoose.model('book');
  var books = book.find({}, function(err, data) {
    if(err) {console.error(err); return;}
    if(data.length == 0) {console.log('not find'); return;}
    //console.log('success to find!');

    // var list = $('#list');
    // var template =$('#template');

    // for (i =0; i< data.length; i++){
    //   $template.find('img').attr('src', data[i].picture);
    //   $template.find('.ISBN').text(data[i].ISBN);
    //   $template.find('.type').text(data[i].type);
    //   $template.find('.name').text(data[i].name);
    //   $template.find('.price').text(data[i].price);
    //   $template.find('.seller-id').text(data[i].sellerId);

    //   $list.append(template.html());
    // }

  });
});


router.get('/contact', function(req, res, next) {
  res.render('contact.html');
});

// router.use('/buy', buy);
// router.use('/sell', sell);
// router.use('/join', join)

module.exports = router;