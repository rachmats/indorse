var express = require('express');
var router = express.Router();

function socket(io) {
  // start listen with socket.io
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('new message', function(msg){
      var data = {
        nama: 'test',
      }
      io.emit('chat message', data);
    });
  });

}
module.exports = {
  router: router,
  sck: socket
}
