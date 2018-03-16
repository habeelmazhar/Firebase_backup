var express = require('express');
var router = express.Router();

var fireb = require('../config/config.js');
var admin = fireb.admin;

var database = admin.database();

var fs = require('fs');
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  let dir = './backup';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let files = [];
  var lastFile;
  fs.readdirSync(dir).forEach(file => {
    console.log(moment(file.split('.json')[0]));
    files.push(moment(file.split('.json')[0]));

  });
  
  lastFile = files[files.length - 1];

  if (files.length === 0)
    lastFile = moment('2013-11-04');

  let now = moment();

  console.log(now.diff(lastFile, "days"));
  if (now.diff(lastFile, "days") > 7) {
    database.ref('CalstorySeoURLs').orderByKey().once('value', function (data) {
      fs.writeFile(dir + '/' + moment().format("YYYY-MM-DD") + '.json', JSON.stringify(data.val()), function (err) {
        if (err)
          return console.log(err);
        else
          res.json('ok');
      });
    });

  } else {
    res.json('No need');
  }

});



function backup(){
  let dir = './backup';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let files = [];
  var lastFile;
  fs.readdirSync(dir).forEach(file => {
    // console.log(moment(file.split('.json')[0]));
    files.push(moment(file.split('.json')[0]));
  });
  
  lastFile = files[files.length - 1];

  if (files.length === 0)
    lastFile = moment('2013-11-04');

  if (files.length > 3) {
    console.log('deleting ' + files[0].format("YYYY-MM-DD")+'.json');
    fs.unlinkSync(dir + '/' + files[0].format("YYYY-MM-DD")+'.json');
  }

  let now = moment();

  // console.log(now.diff(lastFile, "days"));
  if (now.diff(lastFile, "days") > 7) {
    database.ref('CalstorySeoURLs').orderByKey().once('value', function (data) {
      fs.writeFile(dir + '/' + moment().format("YYYY-MM-DD") + '.json', JSON.stringify(data.val()), function (err) {
        if (err)
          return console.log(err);
        else
          console.log('Backed up at ' + moment().format("YYYY-MM-DD"));
      });
    });

  } else {
    console.log('No need to backup');
  }
}


setTimeout(function(){
  backup();
}, 2000);


module.exports = router;
