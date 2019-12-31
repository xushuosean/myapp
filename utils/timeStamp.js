function timeExcu (past, now) {
  var usedTime = now - past;  //两个时间戳相差的毫秒数
  // 计算出年数
  var years = Math.floor(usedTime / ( 365 * 24 * 3600 * 1000))
  // 计算出月数
  var leave0 = usedTime % ( 365 * 24 * 3600 * 1000)
  var months = Math.floor(leave0 / (24 * 3600 * 1000 * 30));
  //计算出天数
  var leave1 = usedTime % (24 * 3600 * 1000 * 30);   //计算天数后剩余的毫秒数
  var days = Math.floor(leave1 / (3600 * 1000 * 24));
  return { years: years,months: months, days: days}
}

module.exports = {
  timeExcu
}