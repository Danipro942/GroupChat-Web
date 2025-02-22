import { zodResolver } from "@hookform/resolvers/zod";
import { SlOptions } from "react-icons/sl";
import style from "./style.module.css";

import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GoPaperclip } from "react-icons/go";
import { IoIosSend } from "react-icons/io";
import { SelectContext } from "../../Context/useSelectContext";
import { UserContext } from "../../Context/userContext";
import { sendMessageForm, sendMessageSchema } from "../../Schemas/sendMessage";
import { useSocket } from "../../Socket/SocketContext";
import apiClient from "../../api/apiClient";
import MessagesUser from "../../api/useMessages";
import { Messages } from "../../types/message";
import IsLoading from "../isLoading";
import Message from "./Message";
import WelcomeChat from "./WelcomeChat";
import { useNavigate } from "react-router-dom";

type Props = {};

const Chat = (props: Props) => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const { userSelected } = useContext(SelectContext);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);

  const { socket } = useSocket();

  const { data, isFetching } = MessagesUser(userSelected?.username || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<sendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
  });

  useEffect(() => {
    const messageListener = (data: Messages) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    // Suscribirse al evento
    socket?.on("messageReveived", messageListener);

    // Función de limpieza para eliminar el listener cuando el componente se desmonte o socket cambie
    return () => {
      socket?.off("messageReveived", messageListener);
    };
  }, [socket]);

  useEffect(() => {
    if (userSelected) {
      const getMessages = async () => {
        if (data) {
          setMessages(data.messages);
        }
      };
      getMessages();
    }
  }, [userSelected, data]);

  useEffect(() => {
    if (isAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isAutoScroll]);

  const onSubmit = (data: sendMessageForm) => {
    reset();
    const tempMessage = {
      sender: user?._id || "Unknown",
      text: data.message,
      _id: Date.now(),
    };

    setMessages((prevMessage) => [...prevMessage, tempMessage]);

    try {
      const URL = `/user/message`;

      const response = apiClient.put(URL, {
        receipterUser: userSelected?.username,
        text: data.message,
      });
    } catch (error) {
      setMessages((prevMessage) =>
        prevMessage.filter((msg) => msg._id !== tempMessage._id)
      );
    }

    if (socket) {
      console.log(user);
      const sendMessage = {
        username: user,
        message: data.message,
      };
      socket.emit("private_message", {
        to: userSelected?.username,
        message: data.message,
        sender: user?.username,
      });
    }
  };

  const fetchOldMessages = async (currentPage: number) => {
    try {
      const response = await apiClient.get(
        `/user/messages/${userSelected?.username}/${currentPage}`
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching old messages:", error);
      return { messages: [], hasMore: false };
    }
  };

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Controla el auto scroll (parte inferior)
      const bottomThreshold = 50;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + bottomThreshold;
      setIsAutoScroll(isAtBottom);

      // Si se acerca al tope, carga mensajes antiguos
      const topThreshold = 100;
      if (
        container.scrollTop < topThreshold &&
        hasMoreMessages &&
        !isFetchingMore
      ) {
        setIsFetchingMore(true);
        const prevScrollHeight = container.scrollHeight;
        const nextPage = currentPage + 1;
        const { messages: olderMessages, hasMore } = await fetchOldMessages(
          nextPage
        );
        console.log(nextPage);
        if (olderMessages.length > 0) {
          setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
          setCurrentPage(nextPage);
          setHasMoreMessages(hasMore);
          // Ajustar el scroll para que no salte
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight;
              messagesContainerRef.current.scrollTop =
                newScrollHeight - prevScrollHeight;
            }
          }, 0);
        } else {
          setHasMoreMessages(false);
        }
        setIsFetchingMore(false);
      }
    }
  };

  if (!userSelected) return <WelcomeChat />;

  return (
    <div className={style.chat}>
      <div className={style.chat__header}>
        <span>{userSelected.username}</span>
        <i>
          <SlOptions />
        </i>
      </div>

      <div className={[style.chat__messages_wrapper].join(" ")}>
        <div
          className={style.chat__messages}
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {isFetching || (isFetchingMore && <IsLoading />)}
          {messages.map((e, index) => (
            <Message
              key={index}
              isUser={
                e.sender.toString() === user?._id.toString() ? true : false
              }
              message={e.text}
            />
          ))}
        </div>
      </div>
      <div className={style.chat__form}>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register("message")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          ></textarea>
          <i>
            <GoPaperclip />
          </i>
          <button type="submit">
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
