const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// Ip address of our cloud computer
server.listen(port, "46.101.177.81" ,() => {
  console.log('Server listening at port %d', port);
});

// Function for emitting data on connection
function onConnection(socket){
  socket.on('message', (data) => socket.broadcast.emit('message', data));
}
io.on('connection', onConnection);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Users
let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;


  // Add user
  socket.on('add user', (username) => {
    if (addedUser) return;

    // Store the username
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // A user connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });


  // A user disconnected
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // A user left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
