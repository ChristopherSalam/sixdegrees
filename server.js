"use strict";

/*=======================================================|
|   Call in express and other node_modules               |
|=======================================================*/

var express = require('express'),
  https = require('https'),
  http = require('http'),
  path = require('path'),
  request = require("request"),
  bodyParser = require('body-parser'),
  app = express();
  // dbRemote = require('./db/db.js');

/*=======================================================|
|   Sets port to environment port or local port          |
|=======================================================*/

var port = process.env.PORT || 7473;

/*=======================================================|
|   connecting the client and server                     |
|   allows for CORS (cross origin resource sharing)      |
|=======================================================*/

app.use('player', function(req, res, next) {
  res.header("access-control-allow-origin", "*");
  res.header("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*=======================================================|
|   statically serves files from the client directory    |
|=======================================================*/

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

/*=======================================================|
|  ROUTES                                                |
|=======================================================*/

app.get('/', function(req, res) {
  res.location('/public/index.html');
});

app.post('/player', function(req, res){
  // old method
  // dbRemote.queryRaw(req.body.query,{}, function(err, result){
  //       if (err) throw err;
  // res.send(result);
  // });

  // new method
  var postData = { 'query' : req.body.query, 'params': {} };
  // console.log("postData", postData);
  request({
    uri: "http://ec2-54-213-120-12.us-west-2.compute.amazonaws.com:7474/db/data/cypher",
    method: "POST",
    form: postData,
    headers: {
      "Accept": "application/json;charset=UTF-8",
      "Content-Type": "application/json"
    }
  }, function(error, response, body) {
    res.send(body);
  });
});

app.get('/picture', function(req, res){
  var player = req.query.player.replace(/\s+/g, "+");
  if (player.match(/lebron/i)) player = player.replace(/lebron/i, 'LeBron');
  player = player.replace(/\b\w/g, function(l){ return l.toUpperCase(); })
  // console.log('picture of ', req.query.player, player);
  var ballerWiki = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=' + player;
  request(ballerWiki, function(error, response, body) {
    if (error) console.log("error:", error);
    res.send(response);
  });
});

/*=======================================================|
|    Test                                                |
|=======================================================*/

// dbRemote.queryRaw("MATCH (n:Player) RETURN n LIMIT 1", {}, function(err, result) {
//     if (err) throw err;
//     console.log("Query is working")
// });

/*=======================================================|
|   Calling the server                                   |
|=======================================================*/

app.listen(port, function() {
  console.log('Tip off on port', port);
});
exports = module.exports = app;
