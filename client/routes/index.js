var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res ) {
  res.render('index', { title: '建站' });
});

module.exports = router;
