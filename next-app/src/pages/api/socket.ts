import type { NextApiRequest } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type {NextApiResponseWithSocket} from '@/types/websocket'

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    if (res.socket.server.io) {
        // WebSocketが既にある場合、なにもしない
        console.log('Socket is already running')
    } else {
        // 初めてのアクセスでWebSocketが存在しない場合、作成する
        const io = new IOServer(res.socket.server, {
            // Next ver13以降では指定しないとエラーになる（https://github.com/vercel/next.js/issues/49334）
            path: "/api/socket_io",
            addTrailingSlash: false
        });

        // クライアント接続時
        io.on('connection', socket => {
            console.log('a user connected');
            // クライアントに送信
            socket.emit('hello', 'world!')
            // メッセージ受信時の処理
            socket.on('send_message', message => {
                console.log(message);
                // 全てのクライアントに送信
                io.emit('receive_message', message);
            })

            // クライアント切断時
            socket.on("disconnect", (reason) => {
                console.log(`a user disconnected. ${reason}`)
            })
        })

        // NextのAPI RoutesにWebSocketサーバーを設定
        res.socket.server.io = io
    }

    // API Routesを終了させるために必要
    res.end()
}

// export const config = {
//     api: {
//         bodyParser: false
//     }
// }
export default SocketHandler
