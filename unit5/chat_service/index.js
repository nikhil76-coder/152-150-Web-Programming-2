const express = require('express');
const app = express();
const  http = require('http');
const server = http.createServer(app);
const  io = require('socket.io').listen(server);

// Static files
app.use(express.static(__dirname + '/public'));

/* Chat program */
var usernames = {};
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER'
            , username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER'
            , socket.username + ' has disconnected');
    });
});

var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);