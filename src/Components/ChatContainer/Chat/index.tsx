import { useContext } from "react";
import { UserContext } from "../../../Context/userContext";
import { SelectContext } from "../../../Context/useSelectContext";
import { ChatType, UserType } from "../../../types/user";
import style from "../style.module.css";
type Props = {
  userFetch: UserType[];
  onSelected: (data: UserType) => void;
  chat: ChatType;
};

const Chat = ({ userFetch, onSelected, chat }: Props) => {
  const { user } = useContext(UserContext);
  const { userSelected } = useContext(SelectContext);

  if (!user) return null;

  console.log(userFetch);
  const filterUser = userFetch.find((e) => e.username !== user.username);
  console.log(filterUser);

  return (
    <li
      className={[
        `${style.chat} ${
          userSelected?.username === filterUser?.username &&
          `${style.chat__active}`
        }`,
      ].join()}
      onClick={() => filterUser && onSelected(filterUser)}
    >
      <div className={style.Chatsections}>
        <div className={style.profileImg}>
          <img
            src={
              filterUser?.profilePicture ||
              "https://hips.hearstapps.com/hmg-prod/images/Diana_GettyImages-515185764.jpg?crop=1xw:1.0xh;center,top&resize=640:*"
            }
            alt=""
          />
        </div>
        <div className={style.information}>
          <p>{filterUser?.username}</p>
          <span>{chat.lastMessage || "Last Message"}</span>
        </div>
      </div>
    </li>
  );
};

export default Chat;
