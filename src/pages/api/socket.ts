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
        console.log('Socket is initializing')
        const io = new IOServer(res.socket.server)
        res.socket.server.io = io

        io.on('connection', (socket) => {
            socket.on('input-change', (msg) => {
                socket.broadcast.emit('update-input', msg)
            })
        })
    }
    res.end()
}

export default SocketHandler
