import { UserType } from "../../../types/user";
import style from "./style.module.css";

type Props = {
  handleModel: (open?: boolean) => void;
  userSelected: UserType;
};

const UserSelectedModal = ({ userSelected }: Props) => {
  return (
    <div className={style.userSelectedModal}>
      <div className={style.username}>
        <h1>{userSelected.username}</h1>
      </div>

      <div className={style.userAvatar}>
        <img src={userSelected.profilePicture} alt="Profile Picture" />
      </div>

      <div className={style.createdAt}>
        <h2>Created at:</h2>
        <span>
          {userSelected.createdAt
            ? new Date(userSelected.createdAt).toLocaleDateString()
            : "< 2/1/2025"}
        </span>
      </div>
    </div>
  );
};

export default UserSelectedModal;
