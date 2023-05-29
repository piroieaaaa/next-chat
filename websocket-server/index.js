const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"], // サーバーはPORT5000、クライアントはPORT3000でオリジンが異なるため、CORSでクロスオリジンを許可する必要がある。
    },
});

const PORT = 5000;

// クライアント接続
io.on("connection", socket => {
    console.log('a user connected');

    // クライアントから受信
    socket.on('send_message', message => {
        console.log(message);

        // クライアントに送信
        io.emit('receive_message', message);
    })

    // クライアント切断
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(PORT, () => console.log(`server is running on ${PORT}`))