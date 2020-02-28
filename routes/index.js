var express = require('express');
var router = express.Router();

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

router.get('/buy', function(req, res, next) {
  res.render('buy.html');
});

router.get('/contact', function(req, res, next) {
  res.render('contact.html');
});

module.exports = router;
