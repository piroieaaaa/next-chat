import type { NextApiRequest } from 'next'
import { Server as IOServer } from 'Socket.IO'
import type {NextApiResponseWithSocket, ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'
import { z } from "zod";

const postBodySchema = z.object({
    message: z.string().min(1).max(100)
});

const handlePost = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    console.log(`send-chat api request: ${JSON.stringify(req.body)}`);

    // WebSocketサーバーが起動していない
    if (res.socket.server.io === undefined) {
        return res.status(500).json({
            error: {
                message: `WebSocket server not running`,
                statusCode: 500,
            }
        });
    }

    // リクエストボディのチェック
    const result = postBodySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: {
                message: "Invalid request",
                statusCode: 400,
            }
        });
    }
    const {message} = result.data;

    // イベント定義が欲しいので、一旦変数に入れる。
    const io: IOServer<ClientToServerEvents, ServerToClientEvents> = res.socket.server.io

    // POSTの内容を全クライアントに送信
    io.emit('chat', message);

    return res.status(200).json({message: `Success`})
}


const SendChatHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    switch (req.method){
        case "POST":
            handlePost(req, res);
            break;
        default:
            return res.status(405).json({
                error: {
                    message: `Method ${req.method} Not Allowed`,
                    statusCode: 405,
                }
            });
    }
}
export default SendChatHandler