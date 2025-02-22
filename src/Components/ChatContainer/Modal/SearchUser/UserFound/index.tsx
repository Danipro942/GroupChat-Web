import apiClient from "../../../../../api/apiClient";
import { Chat, SearchUserType } from "../../../../../types/user";

type Props = {
  data: SearchUserType;
  onSubmit: (userChat: SearchUserType) => void;
};

const UserFound = ({ data, onSubmit }: Props) => {
  return (
    <li onClick={() => onSubmit(data)}>
      <img
        src={
          data.profilePicture ||
          `https://cdn-icons-png.flaticon.com/512/219/219986.png`
        }
        alt=""
      />
      <span>{data.username}</span>
    </li>
  );
};

export default UserFound;
