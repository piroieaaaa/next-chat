import type { NextPage } from 'next'
import Head from "next/head";
import {Chat} from "@/components/chat"

const ChatWebSocket: NextPage = () => {
  return (
    <>
      <Head>
        <title>API Routes(WebSocket)</title>
      </Head>
      <Chat serverSendType="WebSocket"/>
    </>
  );
}

export default ChatWebSocket;