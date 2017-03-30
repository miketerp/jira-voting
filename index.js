const app  = require('express')();
const http = require('http').Server(app);
const io   = require('socket.io')(http);
const sr   = io.of('/searchandiser');
const bbd  = io.of('/storefront');
const wis  = io.of('/wisdom');
const sre  = io.of('/site-reliability');

http.listen(20380, function () {
  console.log('Started listening on port 20380...');
});

/**
 * EXPRESS ROUTING
 */

// Serve the login client page. They should be redirected depending on their role
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html'); // <---- update to be pete's login screen
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/test/admin.html');
});

app.get('/basic-test', function (req, res) {
  res.sendFile(__dirname + '/test/index.html');
});

app.get('/name-test', function (req, res) {
  res.sendFile(__dirname + '/test/name-test.html');
});

/**
 * SOCKET.IO NAMESPACES
 */

// DEFAULT namespace
io.on('connection', function (socket) {
  console.log('connection established');

  socket.on('vote', function (data) {
    console.log(data);
    io.emit('response', data);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// SEARCHANDISER namespace
let srUsers = {};
sr.on('connection', function (socket) {
  srUsers[socket.id] = {};
  console.log('User connected to Searchandiser');

  socket.on('disconnect', function () {
    console.log('User disconnected from Searchandiser');
    delete srUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into SR');
    srUsers[this.id] = { admin: true };
  });

  socket.on('vote', function (data) {
    srUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg        = data.name + ' on Searchandiser voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(bbdUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      bbd.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    // time to tally the votes?
    let voteTotal = votesAreIn(srUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in srUsers) {
        sr.to(key).emit('response', 'All the votes are in! You voted ' + srUsers[key].vote + ', result was ' + voteTotal + '.');
      }
    }
  });
});

// STOREFRONT namespace
let bbdUsers = {};
bbd.on('connection', function (socket) {
  bbdUsers[socket.id] = {};
  console.log('User connected to Storefront');

  socket.on('disconnect', function () {
    console.log('User disconnected from Storefront');
    delete bbdUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into BBD');
    bbdUsers[this.id] = { admin: true };
  });

  socket.on('vote', function (data) {
    bbdUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg         = data.name + ' on Storefront voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(bbdUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      bbd.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    // time to tally the votes?
    let voteTotal = votesAreIn(bbdUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in bbdUsers) {
        bbd.to(key).emit('response', 'All the votes are in! You voted ' + bbdUsers[key].vote + ', result was ' + voteTotal + '.');
      }
    }
  });
});

// WISDOM namespace
let wisUsers = {};
wis.on('connection', function (socket) {
  wisUsers[socket.id] = {};
  console.log('User connected to Wisdom');

  socket.on('disconnect', function () {
    console.log('User disconnected from Wisdom');
    delete wisUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into WIS');
    srUsers[this.id] = { admin: true };
  });

  socket.on('vote', function (data) {
    wisUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg         = data.name + ' on Wisdom voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(bbdUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      bbd.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    // time to tally the votes?
    let voteTotal = votesAreIn(wisUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in wisUsers) {
        wis.to(key).emit('response', 'All the votes are in! You voted ' + wisUsers[key].vote + ', result was ' + voteTotal + '.');
      }
    }
  });
});

// SRE namespace
let sreUsers = {};
sre.on('connection', function (socket) {
  sreUsers[socket.id] = {};
  console.log('User connected to SRE');

  socket.on('disconnect', function () {
    console.log('User disconnected from SRE');
    delete sreUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into SRE');
    srUsers[this.id] = { admin: true };
  });

  socket.on('vote', function (data) {
    sreUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(bbdUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      bbd.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    // time to tally the votes?
    let voteTotal = votesAreIn(sreUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in sreUsers) {
        sre.to(key).emit('response', 'All the votes are in! You voted ' + sreUsers[key].vote + ', result was ' + voteTotal + '.');
      }
    }
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
    } else if (!users[key].admin) {
      return false;
    }
  }
  console.log('Total: ' + total);
  return Math.round(total / Object.keys(users).length);
};

const hasAdmin = (users) => {
  for (let key in users) {
    if (users[key].admin) {
      return key;
    }
  }
  return false;
};

