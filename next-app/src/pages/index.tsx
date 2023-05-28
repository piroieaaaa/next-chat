import type { NextPage } from 'next'
import Link from 'next/link'


const Home: NextPage = () => {
  return (
    <>
      <div>
        <Link href="/websocket-express">EXPRESS</Link>
      </div>
      <div>
      <Link href="/websocket-api-routes">API Routes</Link>
      </div>
    </>
  )
}

export default Home;