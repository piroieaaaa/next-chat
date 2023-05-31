import type { NextPage } from 'next'
import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/Chat.module.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const [list, setList] = useState<string[]>([]);

  const handleSendMessage = () => {
    //サーバーへ送信
    socket.emit("send_message", { message: message });
  };

  //サーバーから受信
  socket.on("receive_message", (data) => {
    setList([...list, data.message]);
  });

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

export default Chat;