import type { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

// *****************************************************
// Socket使用時のレスポンスの型が用意されていないため、独自に定義する必要がある。嫌ならanyにするしかない
interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}
// *****************************************************

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
