
const express = require("express");
const socket = require("socket.io");
var http = require('http');
// App setup
const PORT = process.env.PORT || '3000';
const app = express();
// const server = app.listen(PORT, function () {
// //   console.log(`Listening on port ${PORT}`);
//   console.log(`http://localhost:${PORT}`);
// });

var server = http.createServer(app);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
// const options={
//   cors:true,
//   origins:[`http://localhost:${PORT}`],
//  }

// Static files
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})




function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// Socket setup
const io = socket(server);
io.on('connection', (socket) => {

  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});
  });

  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
  });
});
