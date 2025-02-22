import { useContext, useEffect, useState } from "react";
import Chat from "./Chat";
import style from "./style.module.css";
import { UserContext } from "../../Context/userContext";
import { MdAddComment } from "react-icons/md";
import ModalComponent from "../Modal";
import SearchUser from "./Modal/SearchUser";
import apiClient from "../../api/apiClient";
import { ChatType, UserType } from "../../types/user";
import { CircleSpinner } from "react-spinners-kit";
import { SelectContext } from "../../Context/useSelectContext";
import { Messages } from "../../types/message";
import { useSocket } from "../../Socket/SocketContext";
import { deleteSession } from "../../utils/SessionStorage";
import { useNavigate } from "react-router-dom";
import { ChatsContext } from "../../Context/ChatsContext";
import { IoIosSettings } from "react-icons/io";
import SettingUserModal from "./Modal/SettingUserModal";

type Props = {};

const ChatContainer = (props: Props) => {
  const [searchUseropen, setSearchUseropen] = useState(false);
  const [settingUser, setSettingUser] = useState(false);
  const [filterUser, setFilterUser] = useState<string>("");

  const { setUserSelected } = useContext(SelectContext);
  const navigate = useNavigate();

  const { chats, setChats } = useContext(ChatsContext);
  const { user: userContext } = useContext(UserContext);

  const { socket } = useSocket();

  const ModelSearcUser = (open?: boolean) => {
    setSearchUseropen(!open);
  };

  const modelSettingUser = (open?: boolean) => {
    setSettingUser(!open);
  };

  const onSelect = (userSelected: UserType) => {
    setUserSelected(userSelected);
  };

  useEffect(() => {
    const messageListener = (data: any) => {
      const findChat = chats?.find(
        (e) => e._id.toString() === data._id.toString()
      );
      if (findChat) {
        findChat.lastMessage = data.message;
        console.log("findChat: ", findChat);
        setChats([...chats!]);
      }
    };
    // Suscribirse al evento
    socket?.on("lastMessage", messageListener);

    // Función de limpieza para eliminar el listener cuando el componente se desmonte o socket cambie
    return () => {
      socket?.off("lastMessage", messageListener);
    };
  }, [socket]);

  const closeSesion = () => {
    deleteSession();
    navigate("/auth/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const URL = `/user/chats`;

      try {
        const response = await apiClient.get<{ chats: ChatType[] }>(URL);
        console.log(response.data);
        setChats(response.data.chats);
      } catch (error) {
        console.log("Something went wrong loading Chats ", error);
      }
    };
    fetchData();
  }, [socket]);
  const { user } = useContext(UserContext);
  return (
    <div className={style.chatContainer}>
      <div className={style.userInfo}>
        <span>DanisthChat</span>
        <div className={style.user}>
          <i onClick={() => modelSettingUser()}>
            <IoIosSettings />
          </i>
          <img src={user?.profilePicture} alt="" />
          <span>{user?.username}</span>
          <button onClick={() => closeSesion()}>Log out</button>
        </div>
      </div>
      {/* <hr /> */}
      <ul className={style.chatList}>
        <form action="" className={style.searchUser}>
          <input
            type="text"
            onChange={(e) => setFilterUser(e.target.value)}
            value={filterUser}
          />
          <i>
            <MdAddComment onClick={() => ModelSearcUser()} />
          </i>
        </form>

        {chats ? (
          chats
            .filter((chat) =>
              chat.users
                .filter((user) => user.username !== userContext?.username)
                .some((user) =>
                  user.username.toLowerCase().includes(filterUser.toLowerCase())
                )
            )
            .map((chat, index) => (
              <Chat
                key={index}
                userFetch={chat.users}
                onSelected={onSelect}
                chat={chat}
              />
            ))
        ) : (
          <div className={style.loading}>
            <CircleSpinner size={20} color={"#c5c5c5"} />
          </div>
        )}
      </ul>
      <ModalComponent handleModel={ModelSearcUser} open={searchUseropen}>
        <SearchUser handleModel={ModelSearcUser} />
      </ModalComponent>

      <ModalComponent handleModel={modelSettingUser} open={settingUser}>
        <SettingUserModal handleModel={modelSettingUser} />
      </ModalComponent>
    </div>
  );
};

export default ChatContainer;
