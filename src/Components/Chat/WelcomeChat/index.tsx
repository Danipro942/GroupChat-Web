import style from "./style.module.css";
type Props = {};

const WelcomeChat = (props: Props) => {
  return (
    <div className={style.welcomeChat}>
      <img src="https://www.svgrepo.com/show/6995/chat.svg" alt="" />
      <h1>WelcomeChat</h1>
      <p>
        Speak, laugh, and share with your friends in just a few clicks. With
        DanistGroup, your friends are closer than they seem.
      </p>
      <p></p>
    </div>
  );
};

export default WelcomeChat;
