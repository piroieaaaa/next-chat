import type { NextApiResponse } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

// API Routesのデフォルトのレスポンスの型にwebsocketが含まれていないため、カスタマイズする必要がある。
export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

export interface ServerToClientEvents {
    chat: (message: string) => void;
    hello: () => void;
}

export interface ClientToServerEvents {
    chat: (message: string) => void;
}


// export interface InterServerEvents {
//     ping: () => void;
// }

// export   interface SocketData {
//     name: string;
//     age: number;
// }