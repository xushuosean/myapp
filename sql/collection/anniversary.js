const mongoose = require('../db.js'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

// 设计纪念日表的集合
const anniversarySchema = new Schema({ // 设计用户集合的字段以及数据类型
  dateid: { type: String },
  openid: { type: String },
  title: { type: String },
  desc: { type: String },
  time: { type: String },
  type: { type: String }
})
/**
 * dateid 日期id
 * openid 用户id
 * time 时间点--存入时间戳
 * type 纪念日类型
 */
module.exports = mongoose.model('Anniversary', anniversarySchema);
