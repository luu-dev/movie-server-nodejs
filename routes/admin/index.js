var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Admin Dashboard' });
});


router.get('/test', function(req, res, next) {
  res.render('admin/component/header', { title: 'Admin Dashboard' });
});

module.exports = router;
