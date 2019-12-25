var express = require('express');
const url = require('url');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hhh')
  console.log( 'this is' + url.parse(req.url, true))
  res.render('index', { title: 'Express' });
});

module.exports = router;
