$(function () {

  var socket = io();
  $('#button').click(function(){
    socket.emit('vote', $('#vote').val());
  });

});