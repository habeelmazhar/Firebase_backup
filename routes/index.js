var express = require('express');
var router = express.Router();

var fireb = require('../config/config.js');

var admin = fireb.admin;

var Calstory = admin.database().ref('Calstory');
var SeoURL = admin.database().ref('CalstorySeoURLs');

/* GET home page. */
router.get('/', function(req, res, next) {
  Calstory.orderByKey().once('value', function(data){
    res.json(data.val());
    // res.render('index', { title: 'Express' });
  });
});

module.exports = router;
