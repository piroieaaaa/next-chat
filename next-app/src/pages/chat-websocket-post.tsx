import type { NextPage } from 'next'
import Head from "next/head";
import {Chat} from "@/components/chat"

const ChatWebSocketAndPost: NextPage = () => {
  return (
    <>
      <Head>
        <title>API Routes(WebSocket&POST)</title>
      </Head>
      <Chat serverSendType="POST"/>
    </>
  );
}

export default ChatWebSocketAndPost;