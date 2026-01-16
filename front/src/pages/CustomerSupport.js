import "stream-chat-react/dist/css/v2/index.css";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { Spin } from "antd";
import "../assets/css/stream-overrides.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import ChannelsList from "../components/ChannelsList";

function CustomerSupport() {
  const { user } = useAuth();
  const { client } = useChat();

  if (!client)
    return <Spin fullscreen tip="Connecting to chat..." size="large" />;

  return (
    <div style={{ margin: 0, padding: 0,  }}>
      <Chat client={client} theme="str-chat__theme-dark" key={user?._id}>
        <div className="chat-layout">
          <aside className="chat-sidebar">
            <ChannelsList />
          </aside>

          <main className="chat-main">
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </main>
        </div>
      </Chat>
    </div>
  );
}

export default CustomerSupport;
