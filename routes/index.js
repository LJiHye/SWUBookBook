var express = require("express")

var mongoose = require("mongoose")
var router = express.Router()
var $ = require("jquery")

var path = require("path")
var expressSession = require("express-session")
var cookieParser = require("cookie-parser")

require("../public/model/model")
require("../public/model/member")

// var buy = require('./buy (not used)/buy.js')
// var sell = require('./sell (not used)/sell.js')
// var join = require('./join/join')


/* GET home page. */
router.get("/", function(req, res, next) {
  var sess = req.session

  //메인페이지에서 세션을 조회할 수 있도록 추가한 코드
  res.render("index.html", {
    title: "MY HOMEPAGE",
    length: 5,
    name: sess.name,
    username: sess.username,
  })
})

router.get("/join", function(req, res, next) {
  res.render("join.html")
})

router.get("/login", function(req, res, next) {
  res.render("login.html")
})

router.get("/sell", function(req, res, next) {
  res.render("sell.html")
})

router.get("/buy", function(req, res, next) {
  res.render("buy.html")
})

router.get("/contact", function(req, res, next) {
  res.render("contact.html")
})

/* sell */
router.post("/upload_book", function(req, res) {
  var body = req.body

  var p_isbn = body.isbn
  var p_title = body.title
  var p_author = body.author
  var p_pub = body.pub
  var p_date = body.date
  var p_realPrice = body.realPrice
  var p_sellPrice = body.sellPrice
  var p_content = body.content
  var p_state = body.state
  var p_imageUrl = body.imageUrl
  var p_password = body.password

  var Book = mongoose.model("book")

  var newBook = new Book({
    isbn: p_isbn,
    title: p_title,
    author: p_author,
    pub: p_pub,
    date: p_date,
    realPrice: p_realPrice,
    sellPrice: p_sellPrice,
    content: p_content,
    state: p_state,
    imageUrl: p_imageUrl,
    password: p_password,
  })

  newBook.save(function(error, data) {
    if (error) console.log(error)
    else {
      console.log("book saved")
      res.redirect("/buy")
    }
  })
})

/* join */
router.post("/upload_member", function(req, res) {
  var body = req.body

  var p_email = body.email
  var p_password = body.password

  console.log(p_email, p_password)

  var Member = mongoose.model("member")

  var newMember = new Member({ email: p_email, password: p_password })

  newMember.save(function(error, data) {
    if (error) console.log(error)
    else {
      console.log("member saved")
      res.redirect("/")
    }
  })
})

/* buy */
router.post("/load", function(req, res) {
  var book = mongoose.model("book")
  book.find({}, function(err, data) {
    if (err) {
      console.error(err)
      return
    }
    if (data.length == 0) {
      console.log("book list not found")
      return
    }

    console.log("success to load the book list")
    //console.log(data);
    res.json(data)
  })
})

/* board */
router.get("/loadBoard/:id", function(req, res) {
  var book = mongoose.model("book")
  data = book.find({ _id: req.params.id }, function(err, data) {
    if (err) {
      console.error(err)
      return
    }
    if (data.length == 0) {
      console.log("book not found")
      return
    }

    console.log("success to find the book")
    console.log(data)
    //res.json(data);

    console.log(data[0].isbn)

    res.render("board.ejs", {
      imageUrl: data[0].imageUrl,
      isbn: data[0].isbn,
      title: data[0].title,
      realPrice: data[0].realPrice,
      sellPrice: data[0].sellPrice,
      author: data[0].author,
      pub: data[0].pub,
      date: data[0].date,
      content: data[0].content,
      state: data[0].state,
    })
  })
})

/* login */
router.post("/login", function(req, res) {
  var p_email = req.body.email
  var p_password = req.body.password
  var sess = req.session

  var users = mongoose.model("member")

  var result = users.find({ email: p_email, password: p_password }, function(err, data) {
    if (err) {
      console.error(err)
      return
    }
    if (data.length == 0) {
      console.log("member not found")
      return
    }
    if (sess) {
      console.log("[Login] " + data[0].email)
      console.log(data)

      sess.username = p_email
      console.log(sess)

      res.redirect("/")

      // res.post("<h1>Login Success</h1>")
      // res.post("[ID] : " + sess.username + "환영합니다.")
      // res.post('<a href="/views/login">Move</a>')
      // console.log("로그인 최종 성공")
      // res.end()
    }
  })
})

/* logout */
router.get("/logout", function(req, res) {
  sess = req.session
  if (sess.username) {
    console.log("[Logout] " + sess.username)
    req.session.destroy(function(err) {
      if (err) {
        console.log(err)
      } else {
        res.redirect("/")
      }
    })
  } else {
    console.log("Session not found")
    res.redirect("/")
  }
})

module.exports = router
