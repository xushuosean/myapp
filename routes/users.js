var express = require('express');
var User = require('./../sql/collection/users');
var Anni = require('./../sql/collection/anniversary');
var sql = require('./../sql');
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
var axios = require('axios');
var utils = require('./../utils')
var timeStamp = require('./../utils/timeStamp.js')
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  console.log(req.query)
  var { code, userInfo } = req.query;
  var { avatarUrl, city, country, gender, language, nickName, province } = JSON.parse(userInfo);
  var appid = 'wx9c4dd20171b6cecf';
  var secret = '7b5b93a3447a06510fafd058f153c9f4';
  axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`).then(function (response) {
    var { openid } = response.data;
    // 检测数据库内是否含有此用户
    sql.find(User, { openid }).then(data => {
      if (data.length === 0) {
        // 如果没有该用户，则插入数据库
        let userid = 'users_' + uuid.v1();
        sql.insert(User, { userid, openid, nickName, avatarUrl, city, country, province, gender, language }).then(() => {
          // 插入数据成功，生成token
          let token = jwt.sign({ openid }, 'sean', {
            // expiresIn: 60*60*24// 授权时效24小时
            expiresIn: 60*60*24*7// 授权时效7天
          })
          utils.loginAndReg.token = token
          res.send(utils.loginAndReg)
        })
      } else {
        // 生成token
        let token = jwt.sign({ openid }, 'sean', {
          // expiresIn: 60*60*24// 授权时效24小时
          expiresIn: 60*60*24*7// 授权时效7天
        })
        utils.loginSuccess.token = token
        res.send(utils.loginSuccess)
      }
    })
  })
});

router.get('/find', function(req, res, next) {
  var openid = 'oMdYl0YOjquEQJYGIgRXFcmyIbsc';
  sql.find(User, { openid }, { _id: 0}).then(function (data) {
    res.send(utils.loginSuccess)
  })
})

router.get('/addAnni', function (req, res, next) {
  var { openid, title, desc, time, type } = req.query
  var dateid = 'dateid_' + uuid.v1()
  sql.insert(Anni, { dateid, openid, title, desc, time, type }).then(() => {
    res.send(utils.anniSuccess)
  })
})

router.get('/findAnni', function (req, res, next) {
  var { openid } = req.query
  sql.find(Anni, { openid }).then((response) =>{
    var nowDate = Date.now()
    // console.log(nowDate)
    var objStr = JSON.stringify(response)
    var obj = JSON.parse(objStr)
    var obj = obj.map((item, index) => {
      var dateCollection = timeStamp.timeExcu(item.time, nowDate)
      item.dateCollection = dateCollection
      return item
    })
    res.send(obj)
  })
})

module.exports = router;
