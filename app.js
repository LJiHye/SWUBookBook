var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
~~~~
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// connect to mongodb server
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/bookbook');

//test of inserting data to mongodb
/*var book = mongoose.Schema({
  isbn : 'string',
  sellPrice : 'number',
  state : 'string'
});
var Book = mongoose.model('Schema', book);
var newBook = new Book({isbn : '9791164452064', sellPrice : '14800', state : 'Gooood'});
newBook.save(function(error,data){
  if(error) console.log(error);
  else console.log('saved!');
})*/

module.exports = app;
