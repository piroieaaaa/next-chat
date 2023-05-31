import type { NextPage } from 'next'
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Chat.module.css";
import io from "socket.io-client";
import type { Socket } from 'socket.io-client'
import type {ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'

const Chat: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined);  // socketを維持するためにuseStateにする必要有り。ただの変数にしていると、undefinedになってしまう。
  const initWebSocketRef = useRef(false);

  // WebSocketの接続
  useEffect(() => {
    // Nextは開発モードでは２回レンダリングされるようになっている（StrictMode）。useEffectが１回だけ実行されるようにuseRefを利用する。
    if(initWebSocketRef.current){
      return;
    }
    initWebSocketRef.current = true;

    // WebSocketサーバーの設定
    const initWebSocket = async() =>{
      await fetch('/api/create-websocket')
    }
    initWebSocket();

    // WebSocketの作成
    const client: Socket<ServerToClientEvents, ClientToServerEvents> = io({
      // Next ver13以降ではpathを指定しないとエラーになる（https://github.com/vercel/next.js/issues/49334）
      path: "/api/create-websocket",
    })

    // サーバーに接続時の動作設定
    client.on('connect', () => {
      console.log('connect')
    })

    // hello受信時の動作設定
    client.on('hello', () => {
      console.log(`received server hello!`)
    })

    // chat受信時の動作設定
    client.on("chat", message => {
      setHistory(current => [message, ...current]);
    });

    // サーバー切断時の動作設定
    client.on('disconnect', () => {
      console.log('disconnect')
    })

     // socketを維持するためにuseStateに保持。
    setSocket(client);

    return () => {
      if (socket !== undefined) {
        console.log('Disconnecting..');
        socket.disconnect()
      }
    }
  }, [])

  // WebSocketサーバーにchat送信
  const handleSendMessage = () => {
    if (socket !== undefined) {
      socket.emit("chat", message);
    }
  };

  return (
    <>
      <Head>
        <title>チャットアプリ</title>
      </Head>
      <div className={styles.container}>
        <h2>チャットアプリ</h2>
        <div className={styles.chatInputButton}>
          <input
            type="text"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="ちゃっと・・・"
            value={message}
          />
          <button
            onClick={() => {
              handleSendMessage();
              setMessage("");
            }}
          >
            チャット送信
          </button>
        </div>
        <div>
          {history.map((message, index) => (
            <div key={index} className={styles.chatArea}>
              {message}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Chat;