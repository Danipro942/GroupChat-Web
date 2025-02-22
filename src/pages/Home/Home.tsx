import { useEffect } from "react";
import Chat from "../../Components/Chat";
import openSocket from "socket.io-client";

import ChatContainer from "../../Components/ChatContainer";
import style from "./style.module.css";
import { Bounce, ToastContainer } from "react-toastify";

type Props = {};

const Home = (props: Props) => {
  useEffect(() => {
    openSocket("danisthchat-production.up.railway.app");
  }, []);
  return (
    <div className={style.homeContainer}>
      <ChatContainer />

      <Chat />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Home;
