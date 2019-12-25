const mongoose = require('./../db.js'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

// 设计用户表的集合
const userSchema = new Schema({ // 设计用户集合的字段以及数据类型
  userid: {type: String },
  openid: { type: String },
  nickName: { type: String },
  avatarUrl: { type: String },
  city: { type: String },
  country: { type: String },
  province: { type: String },
  gender: { type: String },
  language: { type: String }
})

module.exports = mongoose.model('User', userSchema);
