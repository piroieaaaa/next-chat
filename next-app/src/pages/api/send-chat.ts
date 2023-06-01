import type { NextApiRequest } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type {NextApiResponseWithSocket, ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'

const SendChatHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    // POST以外はエラー
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    // WebSocketサーバーの起動確認
    if (res.socket.server.io !== undefined) {
        // イベント定義が欲しいので、一旦変数に入れる。
        const io: IOServer<ClientToServerEvents, ServerToClientEvents> = res.socket.server.io

        // POSTの内容を全クライアントに送信
        console.log(`send-chat api request: ${JSON.stringify(req.body)}`);
        io.emit('chat', req.body.message);
    }

    return res.end();
}
export default SendChatHandler