// server.js

'use strict';

const Game = require("./src/server/server_game.js");

// Use express to open a web server
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// -- ROUTING --
app.get('/', function(req, res, next) {

  res.sendFile(__dirname + '/public/html/login-page.html');

});

app.post('/login', function(req, res, next) {
  console.log(req.body.username)

  if (req.body.username in connections) {
    res.send(false)
  }


  res.send(true);

});

app.post('/game', function(req, res, next) {
  console.log(req.body.username)


  if (req.body.username in connections) {
    res.send(false)
  }
  else {
    res.sendFile(__dirname + '/public/html/index.html');
  }

});



// -- ClIENT LISTENERS --
server.listen(4200, '0.0.0.0'); // begin listening
var connections = [];
var game = new Game(connections);
game.start();

io.on('connection', function(new_client) {
  var handshakeData = new_client.request;
  var username = handshakeData._query['username'];
  console.log(username + " logged in.")

  if (username in game.players) {
    new_client.disconnect();
    return;
  }
  connections[username] = new_client;

  new_client.on('init_client', function(player) {
    game.addPlayer(username, player)
  });

  new_client.on('move', function(player) {
    game.updatePlayer(username, player);

  });

  new_client.on('shoot', function(mouse_x, mouse_y) {
    game.shoot(username, mouse_x, mouse_y);
  });

  new_client.on('disconnect', function() {
    game.removeClient(username);
  });
});
