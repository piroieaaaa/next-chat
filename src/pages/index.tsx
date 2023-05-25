import type { NextPage } from 'next'
import { useEffect } from 'react'
import io from 'socket.io-client'

let socket;
const Home: NextPage = () => {

  // WebSocketの接続
  useEffect(() => {
    const initWebSocket = async() =>{
      await fetch('/api/socket')
      socket = io()
      socket.on('connect', () => {
        console.log('server connected')
      })
    }
    initWebSocket();
  }, [])

  return (
      <h1>WebSocket</h1>
  )
}

export default Home;