const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use("/scripts", require('express').static(__dirname + '/src'));

// Serve the login client page. They should be redirected depending on their role
app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});

// When a new socket connection is established with a team member
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

// basic server stuff.
http.listen(9000, function() {
  console.log('Started listening on port 9000...');
});

