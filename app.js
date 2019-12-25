var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var interface = require('./utils/interface')
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token验证
app.use((req, res, next) => {
  console.log(req.url)
  if (interface.every(item => !(new RegExp('^'+item)).test(req.url))) {
    console.log('接口不登陆不可行')
    let token = req.headers.token || req.query.token || req.body.token;
    if (token) {
      jwt.verify(token, 'sean', function(err, decoded) {
        if (err) {
          res.send({ 
            code: '4005', 
            message: 'token已过期.' 
          });
        } else {
          req.decoded = decoded;  
          console.log('验证成功', decoded);
          next()
        }
      }) 
    } else {
      res.send({ 
        code: '4006', 
        message: '没有找到token.'
      });
    }
  } else {
    console.log('接口不登陆可行')
    next()
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
