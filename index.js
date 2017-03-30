const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sr = io.of('/searchandiser');
const bbd = io.of('/storefront');
const wis = io.of('/wisdom');
const sre = io.of('/site-reliability');

http.listen(20380, function(){
  console.log('Started listening on port 20380...');
});


/**
 * EXPRESS ROUTING
 */

// Serve the login client page. They should be redirected depending on their role
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html'); // <---- update to be pete's login screen
});

app.get('/basic-test', function(req, res){
  res.sendFile(__dirname + '/test/index.html');
});

app.get('/name-test', function(req, res){
  res.sendFile(__dirname + '/test/name-test.html');
});


/**
 * SOCKET.IO NAMESPACES
 */

// DEFAULT namespace
io.on('connection', function(socket){
  console.log('connection established');

  socket.on('vote', function(data) {
    console.log(data);
    io.emit('response', data);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

// SEARCHANDISER namespace
sr.on('connection', function(socket){
  console.log('User connected to Searchandiser');

  socket.on('disconnect', function() {
    console.log('User disconnected from Searchandiser');
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on Searchandiser voted ' + data.vote;
    console.log(msg);
    sr.emit('response', msg);
  });
});

// STOREFRONT namespace
bbd.on('connection', function(socket){
  console.log('User connected to Storefront');

  socket.on('disconnect', function() {
    console.log('User disconnected from Storefront');
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on Storefront voted ' + data.vote;
    console.log(msg);
    bbd.emit('response', msg);
  });
});

// WISDOM namespace
wis.on('connection', function(socket){
  console.log('User connected to Wisdom');

  socket.on('disconnect', function() {
    console.log('User disconnected from Wisdom');
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on Wisdom voted ' + data.vote;
    console.log(msg);
    wis.emit('response', msg);
  });
});

// SRE namespace
sre.on('connection', function(socket){
  console.log('User connected to SRE');

  socket.on('disconnect', function() {
    console.log('User disconnected from SRE');
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);
    sre.emit('response', msg);
  });
});

