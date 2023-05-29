import type { NextApiRequest, NextApiResponse } from 'next'

const ChatHandler = (req: NextApiRequest, res: NextApiResponse ) => {
    res.status(200).json({ name: 'John Doe' });
}
export default ChatHandler