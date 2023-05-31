import type { NextPage } from 'next'
import Link from 'next/link'


const Home: NextPage = () => {
  return (
    <>
      <div>
        <Link href="/chat-websocket-express">EXPRESS</Link>
      </div>
      <div>
      <Link href="/chat-websocket">API Routes（Client → Server：WebSocket）</Link>
      </div>
      <div>
      <Link href="/chat-websocket-post">API Routes（Client → Server：POST）</Link>
      </div>

    </>
  )
}

export default Home;