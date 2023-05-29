import type { NextApiRequest } from 'next'
import type {NextApiResponseWithSocket} from '@/types/websocket'

const ChatHandler = (req: NextApiRequest, res: NextApiResponseWithSocket ) => {
    if (res.socket.server.io !== undefined) {
        res.socket.server.io.emit('receive_message', { message: 'api routes!' });
    }

    res.end()
}
export default ChatHandler