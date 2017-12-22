var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var aData = [{"name":"190 Strand"},{"name":"375 Kensignton"}];
  res.render('users', { title: 'Users', data: aData });
});

module.exports = router;
