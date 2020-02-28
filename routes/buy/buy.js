var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/buy', function(req, res, next) {
  res.render('buy.html');
});

module.exports = router;
