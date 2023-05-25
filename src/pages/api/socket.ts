import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'Socket.IO'

const SocketHandler: NextApiHandler = (req: NextApiRequest, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)

        io.on('connection', (socket) => {
            console.log('client connected');
        });

        res.socket.server.io = io
    }
    res.end()
}

export default SocketHandler
