const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sr = io.of('/searchandiser');
const bbd = io.of('/storefront');
const wis = io.of('/wisdom');
const sre = io.of('/site-reliability');

const path = require('path');

http.listen(20380, function(){
  console.log('Started listening on port 20380...');
});

/**
 * EXPRESS ROUTING
 */

app.use("/scripts", require('express').static(__dirname + '/src'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/test/admin.html');
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
let srUsers = {};
sr.on('connection', function(socket){
  srUsers[socket.id] = {};
  console.log('User connected to Searchandiser');
  // console.log(sr.connected);

  socket.on('disconnect', function() {
    console.log('User disconnected from Searchandiser');
    delete srUsers[this.id];
  });

  socket.on('vote', function(data) {
    srUsers[this.id] = { name: data.name, vote: data.vote };
    const msg = data.name + ' on Searchandiser voted ' + data.vote;
    console.log(msg);

    // time to tally the votes?
    let voteTotal = votesAreIn(srUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for(let key in srUsers) {
        sr.to(key).emit('response', 'All the votes are in! You voted ' + srUsers[key].vote + ', result was ' + voteTotal + '.');
      }
    }
  });
});

// STOREFRONT namespace
let bbdUserCount = 0;
bbd.on('connection', function(socket){
  console.log('User connected to Storefront');
  bbdUserCount++;

  socket.on('disconnect', function() {
    console.log('User disconnected from Storefront');
    bbdUserCount--;
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on Storefront voted ' + data.vote;
    console.log(msg);
    bbd.emit('response', msg);
  });
});

// WISDOM namespace
let wsUserCount = 0;
wis.on('connection', function(socket){
  console.log('User connected to Wisdom');
  wsUserCount++;

  socket.on('disconnect', function() {
    console.log('User disconnected from Wisdom');
    wsUserCount--;
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on Wisdom voted ' + data.vote;
    console.log(msg);
    wis.emit('response', msg);
  });
});

// SRE namespace
let sreUserCount = 0;
sre.on('connection', function(socket){
  console.log('User connected to SRE');
  sreUserCount++;

  socket.on('disconnect', function() {
    console.log('User disconnected from SRE');
    sreUserCount--;
  });

  socket.on('vote', function(data) {
    const msg = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);
    sre.emit('response', msg);
  });
});

/**
 *  FUNCTIONS
 */

const votesAreIn = (users) => {
  console.log(users);
  let total = 0;
  for (let key in users) {
    if (users[key].vote != undefined) {
      total += parseInt(users[key].vote);
    } else {
      return false;
    }
  }
  console.log('Total: ' + total);
  return Math.round(total / Object.keys(users).length);
};
