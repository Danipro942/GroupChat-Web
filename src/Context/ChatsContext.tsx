import { createContext, ReactNode, useState } from "react";
import { ChatType } from "../types/user";

type Props = {
  children: ReactNode;
};

type ChatContextType = {
  chats?: ChatType[] | null;
  setChats: (data: ChatType[] | null) => void;
};

export const ChatsContext = createContext<ChatContextType>(
  {} as ChatContextType
);

const chatProvider = ({ children }: Props) => {
  const [chats, setChats] = useState<ChatType[] | null>(null);

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatsContext.Provider>
  );
};

export default chatProvider;
