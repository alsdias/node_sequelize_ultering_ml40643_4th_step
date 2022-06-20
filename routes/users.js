var express = require('express');
var router = express.Router();
//const UserDB = require('../models/persistence/UserDB');
const UserSvc = require('../models/business/UserSvc');

var userSvc = new UserSvc();

router.get('/', function(req, res, next) {
  res.render('users', { title: 'Users', msg: '' });
});

router.get('/list', function(req, res, next) {
  return userSvc.findAll(res);
});

router.get('/populate', function(req, res, next) {
  userSvc.populate();
  res.render('users', { title: 'Users', msg: 'Task done: populate' });
});

router.get('/delete', function(req, res, next) {
  userSvc.delete();
  res.render('users', { title: 'Users', msg: 'Task done: delete' });
});


module.exports = router;