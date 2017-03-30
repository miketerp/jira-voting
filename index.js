const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve the login client page. They should be redirected depending on their role
app.get('/', function(req, res){
  res.sendFile(__dirname + '/test/index.html');
});

app.get('/name-test', function(req, res){
  res.sendFile(__dirname + '/test/name-test.html');
});

// When a new socket connection is established with a team member in DEFAULT namespace
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

// Set up namespaces for each team
const sr = io.of('/searchandiser');
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

const bbd = io.of('/storefront');
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

const wis = io.of('/wisdom');
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

const sre = io.of('/site-reliability');
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

// basic server stuff.
http.listen(20380, function(){
  console.log('Started listening on port 20380...');
});

