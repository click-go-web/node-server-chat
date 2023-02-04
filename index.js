
const express = require("express");
const socket = require("socket.io");
// App setup
const PORT = 3001;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
const options={
  cors:true,
  origins:[`http://localhost:${PORT}`],
 }

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server, options);
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

