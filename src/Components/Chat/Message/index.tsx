import style from "../style.module.css";
type Props = {
  isUser: Boolean;
  imgURL?: string;
  message: string;
  onLoad: () => void;
};

const Message = ({ isUser, message, imgURL, onLoad }: Props) => {
  return (
    <div className={[`${isUser ? style.isUser : ""}`, style.message].join(" ")}>
      {imgURL && <img className={style.image} src={imgURL} onLoad={onLoad} />}
      {message}
    </div>
  );
};

export default Message;
