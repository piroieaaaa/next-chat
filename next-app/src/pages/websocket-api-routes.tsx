import type { NextPage } from 'next'
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Chat.module.css";
import io from "socket.io-client";
import type { Socket } from 'socket.io-client'

const Home: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);  // socketを維持するためにuseStateにする必要有り。ただの変数にしていると、undefinedになってしまう。
  const initWebSocketRef = useRef(false);

  // WebSocketの接続
  useEffect(() => {
    if(initWebSocketRef.current){
      return;
    }
    initWebSocketRef.current = true;

    const initWebSocket = async() =>{
      await fetch('/api/socket')
    }
    initWebSocket();
    const client = io({
      path: "/api/socket_io",
    })

    client.on('connect', () => {
      console.log('connect')
    })

    client.on('hello', data => {
      console.log(`received server hello! data:${data}`)
    })

    client.on("receive_message", (data:{message: string}) => {
      setList(current => [...current, data.message]);
    });

    client.on('disconnect', () => {
      console.log('disconnect')
    })

    setSocket(client);
  }, [])

  const handleSendMessage = () => {
    if (socket !== undefined) {
      socket.emit("send_message", { message: message });
    }
  };

  return (
    <div className={styles.container}>
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
          {list.map((chat, i) => (
            <div key={i} className={styles.chatArea}>
              {chat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;