
var usernames = {};
module.exports = io.sockets.on('connection', function (socket) {
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
