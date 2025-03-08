import { useContext, useState } from "react";
import { CircleSpinner } from "react-spinners-kit";
import apiClient from "../../../../api/apiClient";
import { ChatsContext } from "../../../../Context/ChatsContext";
import { ChatType, SearchUserType } from "../../../../types/user";
import style from "./style.module.css";
import UserFound from "./UserFound";

type Props = {
  handleModel: (open: boolean) => void;
};

const SearchUser = ({ handleModel }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [UsersFound, setUsersFound] = useState<SearchUserType[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Para almacenar el término de búsqueda

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  ); // Para manejar el debounce

  const { setChats, chats = [] } = useContext(ChatsContext);

  const handleSearch = async (data: string) => {
    const URL = `/user/searchuser`;
    setIsLoading(true);
    try {
      const response = await apiClient.post<SearchUserType[]>(URL, {
        search: data,
      });
      setIsLoading(false);
      setUsersFound(response.data);
    } catch (error) {
      console.log("Something went wrong ", error);
      setIsLoading(false);
    }
  };

  const onSubmit = async (userChat: SearchUserType) => {
    const URL = "/user/chat";

    try {
      const response = await apiClient.put<{ chat: ChatType }>(URL, {
        username: userChat.username,
      });
      const ifChatExisted = chats?.find(
        (chat) => chat._id === response.data.chat._id
      );
      if (ifChatExisted) return;

      if (chats) setChats([...chats, response.data.chat]);
      handleModel(true);
    } catch (error) {}
  };

  setTimeout(() => setIsLoading(false), 2000); // Simula una búsqueda

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Si ya existe un temporizador anterior, lo cancelamos
    if (timer) {
      clearTimeout(timer);
    }

    // Establecer un nuevo temporizador que ejecuta la búsqueda después de 500ms
    const newTimer = setTimeout(() => {
      handleSearch(value);
    }, 500);

    setTimer(newTimer); // Guardamos el nuevo temporizador
  };

  return (
    <div className={style.SearchUser}>
      <h2>Find your friend!</h2>
      <form>
        <div className={style.Search__Form}>
          <input
            type="text"
            onChange={handleInputChange}
            value={searchTerm}
            placeholder="Username"
          />
          <i>{isLoading && <CircleSpinner size={20} color={"#c5c5c5"} />}</i>
        </div>

        <ul className={style.usersFound}>
          {UsersFound.length > 0 ? (
            UsersFound.map((user, index) => (
              <UserFound key={index} data={user} onSubmit={onSubmit} />
            ))
          ) : (
            <span className={style.textUserfound}>
              Type yout friend's Username
            </span>
          )}
        </ul>
      </form>
    </div>
  );
};

export default SearchUser;
