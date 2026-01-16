import "stream-chat-react/dist/css/v2/index.css";
import { useCreateChatClient } from "stream-chat-react";
import { createContext, useContext, useState } from "react";
import { useAuth } from "../AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const apiKey = process.env.REACT_APP_STREAM_API_KEY;

function ChatProviderInner({ children }) {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState(null);

  const client = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: user.stream_token,
    userData: {
      id: user._id,
      name: user.username,
      image: user.avatar,
    },
  });

  const value = { client, activeChannel, setActiveChannel };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function ChatProvider({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <ChatContext.Provider value={{ client: null }}>
        {children}
      </ChatContext.Provider>
    );
  }

  return <ChatProviderInner>{children}</ChatProviderInner>;
}
