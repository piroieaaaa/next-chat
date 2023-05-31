import type { NextPage } from 'next'
import Link from 'next/link'


const Home: NextPage = () => {
  return (
    <>
      <div>
        <Link href="/chat-websocket-express">EXPRESS</Link>
      </div>
      <div>
      <Link href="/chat-websocket">API Routes</Link>
      </div>
    </>
  )
}

export default Home;