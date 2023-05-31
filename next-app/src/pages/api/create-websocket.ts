import type { NextApiRequest } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type {NextApiResponseWithSocket, ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'

// ServerのWebSocketを設定する
const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    // 既に設定済みの場合、何もしない
    if (res.socket.server.io) {
        console.log('Socket is already running')
        res.end()
        return;
    }

    // WebSocketサーバーを生成
    const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(res.socket.server, {
        // Next ver13以降ではpathとaddTrailingSlashを指定しないとエラーになる（https://github.com/vercel/next.js/issues/49334）
        path: "/api/create-websocket",
        addTrailingSlash: false
    });

    // クライアント接続時の動作設定
    io.on('connection', socket => {
        console.log('a user connected');

        // 接続したクライアントにhelloを送信
        socket.emit('hello')

        // chat受信時の動作設定
        socket.on('chat', message => {
            console.log(`chat receive: ${message}`);

            // 全てのクライアントにchatを送信
            io.emit('chat', message);
        })

        // クライアント切断時の動作設定
        socket.on("disconnect", (reason) => {
            console.log(`a user disconnected. ${reason}`)
        })
    })

    // NextのAPI RoutesにWebSocketサーバーを設定
    res.socket.server.io = io

    // API Routesを終了させるために必要
    res.end()
}

// export const config = {
//     api: {
//         bodyParser: false
//     }
// }
export default SocketHandler
