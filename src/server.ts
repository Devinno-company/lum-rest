import http from 'http';
import socketIo from 'socket.io';

const server = http.createServer()
const io = socketIo(server);

io.on('connection', socket => {
    io.emit('hello', 'DEU BOM');
    console.log('conectou 1');
});

server.listen(3000);