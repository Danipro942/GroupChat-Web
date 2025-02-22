import style from "../style.module.css";
type Props = {
  isUser: Boolean;
  message: string;
};

const Message = ({ isUser, message }: Props) => {
  return (
    <div className={[`${isUser ? style.isUser : ""}`, style.message].join(" ")}>
      {message}
    </div>
  );
};

export default Message;
