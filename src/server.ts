import http from 'http';
import socketIo from 'socket.io';

const server = http.createServer()
const io = socketIo(server);
const PORT = process.env.PORT || 3000;


io.on('connection', socket => {
    io.emit('hello', 'DEU BOM');
    console.log('conectou 1');
});

server.listen(PORT);