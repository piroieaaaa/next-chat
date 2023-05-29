import type { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        const io = new IOServer(res.socket.server, {
            path: "/api/socket_io",
            addTrailingSlash: false
        });

        io.on('connection', socket => {
            console.log('a user connected');
            socket.emit('hello', 'world!')
            socket.on('send_message', message => {
                console.log(message);
                io.emit('receive_message', message);
            })
        })

        res.socket.server.io = io
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}
export default SocketHandler
