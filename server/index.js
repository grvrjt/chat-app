const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const router = require('./router')

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('We have a new connection !!!');

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error)
        socket.emit('message', { user: 'admin', text: `${user.name} Welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined !!` });
        socket.join(user.room);
        callback();

    });

    socket.on('disconnect', () => {
        console.log('User had left !!!!')
    })


})




app.use(router);
server.listen(PORT, () => {
    console.log(`Server has started on the port ${PORT} `)
});