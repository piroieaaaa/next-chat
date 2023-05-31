import type { NextApiRequest } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type {NextApiResponseWithSocket, ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'

const SendChatHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    // POST以外はエラー
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    if (res.socket.server.io !== undefined) {
        const io: IOServer<ClientToServerEvents, ServerToClientEvents> = res.socket.server.io

        console.log(`send-chat api request: ${JSON.stringify(req.body)}`);
        io.emit('chat', req.body.message);
    }

    return res.end();
}
export default SendChatHandler