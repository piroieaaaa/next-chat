import styles from "@/styles/Chat.module.css";
import { useState, useEffect, useRef } from "react";
import type {ClientToServerEvents, ServerToClientEvents} from '@/types/websocket'
import type { Socket } from 'socket.io-client'
import io from "socket.io-client";

export type ServerSendType = "WebSocket" | "POST"

export const Chat = ({serverSendType}: {serverSendType: ServerSendType}) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined);  // socketを維持するためにuseStateにする必要有り。ただの変数にしていると、undefinedになってしまう。
	const [message, setMessage] = useState<string>("");
	const [history, setHistory] = useState<string[]>([]);

  const initWebSocketRef = useRef(false);

  // WebSocketの接続
  useEffect(() => {
    console.log(`start useEffect. initWebSocketRef.current:${initWebSocketRef.current}`)
    // Nextは開発モードでは２回レンダリングされるようになっている（StrictMode）。useEffectが１回だけ実行されるようにuseRefを利用する。
    if(initWebSocketRef.current){
      console.log('stop useEffect')
      return;
    }
    initWebSocketRef.current = true;

    // Socket作成時にpathでAPIを指定していると、実行されるっぽい。/api/create-websocketが２度実行されてしまうので、こっちをコメントアウト。
    // WebSocketサーバーの設定
    (async() =>{
      await fetch('/api/create-websocket')
    })();

    // WebSocketの作成
    // const client: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    //   // Next ver13以降ではpathを指定しないとエラーになる（https://github.com/vercel/next.js/issues/49334）
    //   path: "/api/create-websocket",
    // })
    const client: Socket<ServerToClientEvents, ClientToServerEvents> = io();
    console.log('create Socket')

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
  const handleSendChat = () => {
		switch (serverSendType) {
			case "WebSocket":
				if (socket !== undefined) {
					socket.emit("chat", message);
				}
				break;
			case "POST":
				(async() => {
					await fetch('/api/send-chat',{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ message: message }),
					})
				})();
			default:
				break;
		}
  };

  return (
    <>
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
              handleSendChat();
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
  )
}