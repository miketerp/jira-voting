const app     = require('express')();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const request = require('then-request');
const sr      = io.of('/searchandiser');
const bbd     = io.of('/storefront');
const wis     = io.of('/wisdom');
const sre     = io.of('/site-reliability');

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

app.post('/login', function (req, res) {
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/test/admin.html');
});

app.get('/need-admin', function (req, res) {
  res.sendFile(__dirname + '/test/need-admin-test.html');
});

// app.get('/name-test', function (req, res) {
//   res.sendFile(__dirname + '/test/name-test.html');
// });

/**
 * SOCKET.IO NAMESPACES
 */

const openTix = {sr: [], bbd: [], wis: [], sre: []};

// DEFAULT namespace - should do nothing.
io.on('connection', function (socket) {
  console.log('connection established');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// SEARCHANDISER namespace
let srUsers = {};
sr.on('connection', function (socket) {
  srUsers[socket.id] = {};
  console.log('User connected to SRE');

  socket.on('disconnect', function () {
    console.log('User disconnected from SRE');
    delete srUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into SRE');
    srUsers[this.id] = {admin: true};
  });

  socket.on('get open tickets', function (auth) {
    console.log(auth);
    let admin           = hasAdmin(srUsers);
    srUsers[admin].auth = auth;
    request('POST', 'https://issues.groupbyinc.com/rest/api/2/search', {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + auth
      },
      body:    JSON.stringify({
        'jql': 'project in (test) AND status = Backlog AND labels = VotingTest AND \"Story Points\" = -1 ORDER BY rank ASC'
      })
    }).then((res) => {
      openTix['sr'] = JSON.parse(res.getBody('utf-8'));

      let tix = [];

      openTix['sr'].issues.forEach(function (val, key) {
        tix.push({
          key:         val.key,
          summary:     val.fields.summary,
          description: val.fields.description,
          priority:    val.fields.priority.name,
          status:      val.fields.status.name
        });
      });
      sr.emit('open tickets', {issues: tix, total: tix.length});
    });
  });

  socket.on('ticket selected', function (tname) {
    console.log('Administrator has started a ticket');
    let admin = hasAdmin(srUsers);
    console.log('Admin: ' + admin);
    srUsers[admin]['ticket'] = tname;
    sr.emit('ticket', {title: tname, description: tickets[tname]});
  });

  socket.on('vote', function (data) {
    srUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg        = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(srUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      sr.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    let voteTotal = votesAreIn(srUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in srUsers) {
        if (key != admin) {
          sr.to(key).emit('response', 'All the votes are in! You voted ' + srUsers[key].vote + ', result was ' + voteTotal + '.');
          srUsers[key].vote = undefined;
        } else {
          sr.to(key).emit('response', 'All the votes are in! Your team voted ' + voteTotal + ' on ' + srUsers[key].ticket + '.');
          srUsers[key].ticket = undefined;
        }
      }
      srUsers[admin].holdingVote = voteTotal;
    }
  });

  socket.on('send jira', function () {
    let admin = hasAdmin(srUsers);
    request('PUT', 'https://issues.groupbyinc.com/rest/api/2/issues/' + srUsers[admin].ticket, {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + srUsers[admin].auth
      },
      body:    JSON.stringify({
        'jql': '{ "update": { "customfield_10002": [ { "set": ' + srUsers[admin].holdingVote + ' } ] } }'
      })
    })
  });
});

// STOREFRONT namespace
let bbdUsers = {};
bbd.on('connection', function (socket) {
  bbdUsers[socket.id] = {};
  console.log('User connected to SRE');

  socket.on('disconnect', function () {
    console.log('User disconnected from SRE');
    delete bbdUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into SRE');
    bbdUsers[this.id] = {admin: true};
  });

  socket.on('get open tickets', function (auth) {
    console.log(auth);
    bbdUsers[admin].auth = auth;
    request('POST', 'https://issues.groupbyinc.com/rest/api/2/search', {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + auth
      },
      body:    JSON.stringify({
        'jql': 'project in (test) AND status = Backlog AND labels = VotingTest AND \"Story Points\" = -1 ORDER BY rank ASC'
      })
    }).then((res) => {
      openTix['bbd'] = JSON.parse(res.getBody('utf-8'));

      let tix = [];

      openTix['bbd'].issues.forEach(function (val, key) {
        tix.push({
          key:         val.key,
          summary:     val.fields.summary,
          description: val.fields.description,
          priority:    val.fields.priority.name,
          status:      val.fields.status.name
        });
      });
      bbd.emit('open tickets', {issues: tix, total: tix.length});
    });
  });

  socket.on('ticket selected', function (tname) {
    console.log('Administrator has started a ticket');
    let admin = hasAdmin(bbdUsers);
    console.log('Admin: ' + admin);
    bbdUsers[admin]['ticket'] = tname;
    bbd.emit('ticket', {title: tname, description: tickets[tname]});
  });

  socket.on('vote', function (data) {
    bbdUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg         = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(bbdUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      bbd.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    let voteTotal = votesAreIn(bbdUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in bbdUsers) {
        if (key != admin) {
          bbd.to(key).emit('response', 'All the votes are in! You voted ' + bbdUsers[key].vote + ', result was ' + voteTotal + '.');
          bbdUsers[key].vote = undefined;
        } else {
          bbd.to(key).emit('response', 'All the votes are in! Your team voted ' + voteTotal + ' on ' + bbdUsers[key].ticket + '.');
          bbdUsers[key].ticket = undefined;
        }
      }
      bbdUsers[admin].holdingVote = voteTotal;
    }
  });

  socket.on('send jira', function () {
    let admin = hasAdmin(bbdUsers);
    request('PUT', 'https://issues.groupbyinc.com/rest/api/2/issues/' + bbdUsers[admin].ticket, {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + bbdUsers[admin].auth
      },
      body:    JSON.stringify({
        'jql': '{ "update": { "customfield_10002": [ { "set": ' + bbdUsers[admin].holdingVote + ' } ] } }'
      })
    })
  });
});

// WISDOM namespace
let wisUsers = {};
wis.on('connection', function (socket) {
  wisUsers[socket.id] = {};
  console.log('User connected to SRE');

  socket.on('disconnect', function () {
    console.log('User disconnected from SRE');
    delete wisUsers[this.id];
  });

  socket.on('adminIsIn', function () {
    console.log('Administrator has logged into SRE');
    wisUsers[this.id] = {admin: true};
  });

  socket.on('get open tickets', function (auth) {
    console.log(auth);
    wisUsers[admin].auth = auth;
    request('POST', 'https://issues.groupbyinc.com/rest/api/2/search', {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + auth
      },
      body:    JSON.stringify({
        'jql': 'project in (test) AND status = Backlog AND labels = VotingTest AND \"Story Points\" = -1 ORDER BY rank ASC'
      })
    }).then((res) => {
      openTix['wis'] = JSON.parse(res.getBody('utf-8'));

      let tix = [];

      openTix['wis'].issues.forEach(function (val, key) {
        tix.push({
          key:         val.key,
          summary:     val.fields.summary,
          description: val.fields.description,
          priority:    val.fields.priority.name,
          status:      val.fields.status.name
        });
      });
      wis.emit('open tickets', {issues: tix, total: tix.length});
    });
  });

  socket.on('ticket selected', function (tname) {
    console.log('Administrator has started a ticket');
    let admin = hasAdmin(wisUsers);
    console.log('Admin: ' + admin);
    wisUsers[admin]['ticket'] = tname;
    wis.emit('ticket', {title: tname, description: tickets[tname]});
  });

  socket.on('vote', function (data) {
    wisUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg         = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(wisUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      wis.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    let voteTotal = votesAreIn(wisUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in wisUsers) {
        if (key != admin) {
          wis.to(key).emit('response', 'All the votes are in! You voted ' + wisUsers[key].vote + ', result was ' + voteTotal + '.');
          wisUsers[key].vote = undefined;
        } else {
          wis.to(key).emit('response', 'All the votes are in! Your team voted ' + voteTotal + ' on ' + wisUsers[key].ticket + '.');
          wisUsers[key].ticket = undefined;
        }
      }
      wisUsers[admin].holdingVote = voteTotal;
    }
  });

  socket.on('send jira', function () {
    let admin = hasAdmin(wisUsers);
    request('PUT', 'https://issues.groupbyinc.com/rest/api/2/issues/' + wisUsers[admin].ticket, {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + wisUsers[admin].auth
      },
      body:    JSON.stringify({
        'jql': '{ "update": { "customfield_10002": [ { "set": ' + wisUsers[admin].holdingVote + ' } ] } }'
      })
    })
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
    sreUsers[this.id] = {admin: true};
  });

  socket.on('get open tickets', function (auth) {
    console.log(auth);
    let admin            = hasAdmin(sreUsers);
    sreUsers[admin].auth = auth;
    request('POST', 'https://issues.groupbyinc.com/rest/api/2/search', {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + auth
      },
      body:    JSON.stringify({
        'jql': 'project in (test) AND status = Backlog AND labels = VotingTest AND \"Story Points\" = -1 ORDER BY rank ASC'
      })
    }).then((res) => {
      openTix['sre'] = JSON.parse(res.getBody('utf-8'));

      let tix = [];

      openTix['sre'].issues.forEach(function (val, key) {
        tix.push({
          key:         val.key,
          summary:     val.fields.summary,
          description: val.fields.description,
          priority:    val.fields.priority.name,
          status:      val.fields.status.name
        });
      });
      sre.emit('open tickets', {issues: tix, total: tix.length});
    });
  });

  socket.on('ticket selected', function (tname) {
    console.log('Administrator has started a ticket');
    let admin = hasAdmin(sreUsers);
    console.log('Admin: ' + admin);
    sreUsers[admin]['ticket'] = tname;
    sre.emit('ticket', {title: tname, description: tickets[tname]});
  });

  socket.on('vote', function (data) {
    sreUsers[this.id] = {name: data.name, vote: data.vote, admin: false};
    const msg         = data.name + ' on SRE voted ' + data.vote;
    console.log(msg);

    let admin = hasAdmin(sreUsers)
    console.log('Admin: ' + admin);
    if (admin) {
      sre.to(admin).emit('voter voted', data.name + ': ' + data.vote);
    }

    let voteTotal = votesAreIn(sreUsers);
    console.log(voteTotal);
    if (voteTotal) {
      for (let key in sreUsers) {
        if (key != admin) {
          sre.to(key).emit('response', 'All the votes are in! You voted ' + sreUsers[key].vote + ', result was ' + voteTotal + '.');
          sreUsers[key].vote = undefined;
        } else {
          sre.to(key).emit('response', 'All the votes are in! Your team voted ' + voteTotal + ' on ' + sreUsers[key].ticket + '.');
        }
      }
      sreUsers[admin].holdingVote = voteTotal;
    }
  });

  socket.on('send jira', function () {
    let admin = hasAdmin(sreUsers);
    console.log({
      ticket: sreUsers[admin].ticket,
      auth:   sreUsers[admin].auth,
      vote:   sreUsers[admin].holdingVote,
      admin:  admin
    });
    request('PUT', 'https://issues.groupbyinc.com/rest/api/2/issue/' + sreUsers[admin].ticket, {
      headers: {
        'Content-type':  'application/json',
        'Authorization': 'Basic ' + sreUsers[admin].auth
      },
      body:    JSON.stringify({
        "update": { "customfield_10002": [ { "set": ' + sreUsers[admin].holdingVote + ' } ] }
      })
    })
    .then((res) => console.log('Result: ' + res.getBody('utf-8')))
    .catch((res) => console.log('Error: ' + res.getBody('utf-8')));
    sreUsers[admin].ticket = undefined;
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
  return Math.round(hasAdmin(users) ? total / (Object.keys(users).length - 1) : total / Object.keys(users).length);
};

const hasAdmin = (users) => {
  for (let key in users) {
    if (users[key].admin) {
      return key;
    }
  }
  return false;
};

/**
 *  A FAKE DATA SOURCE TO BE DELETED
 */

const tickets = {'TICK-101': 'Description for ticket #102.', 'TICK-102': 'Description for ticket #102.', 'TICK-103': 'Description for ticket #103.'};

const userRegistry = [
  {
    name:       'michael',
    admin:      false,
    namespaces: ['sr', 'sre']
  },
  {
    name:       'abegail',
    admin:      false,
    namespaces: ['sr']
  },
  {
    name:       'amir',
    admin:      false,
    namespaces: ['sr']
  },
  {
    name:       'garry',
    admin:      true,
    namespaces: ['sr', 'sre']
  },
  {
    name:       'bruce',
    admin:      true,
    namespaces: ['wis', 'bbd']
  },
  {
    name:       'tahir',
    admin:      false,
    namespaces: ['wis']
  },
];

