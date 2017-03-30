const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve the login client page. They should be redirected depending on their role
app.get('/', function(req, res){
  res.sendFile(__dirname + '/test/index.html');
});

// When a new socket connection is established with a team member
io.on('connection', function(socket){

  console.log('connection established');

  socket.on('vote', function(data) {
    console.log(data);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

// basic server stuff. serving on port 3000 rn
http.listen(3000, function(){
  console.log('listening on *:3000');
});

