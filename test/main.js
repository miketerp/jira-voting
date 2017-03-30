$(function () {

  var socket = io();

  $('#button').click(function(){
    socket.emit('vote', $('#vote').val());
    $('#vote').val('Should have sent!');
  });

});