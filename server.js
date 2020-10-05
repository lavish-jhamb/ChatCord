const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/message');
const formatMessages = require('./utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require('./utils/users');
const { emit } = require('process');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

let BOT = 'chatCord'


// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // WELCOME USERS
        socket.emit('message', formatMessages(BOT, 'welcome to the chatCord...'));

        // brodcasting when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(BOT, `${user.username} has joined the chat`));
        // send user and room info
        io.to(user.room).emit('roomUser', {
            room: user.room,
            users: getRoomUser(user.room)
        })
    })


    // listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    // RUNS when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(BOT, `${user.username} has left the chat`))

            // send user and room info
            io.to(user.room).emit('roomUser', {
                room: user.room,
                users: getRoomUser(user.room)
            })
        }
    })
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
