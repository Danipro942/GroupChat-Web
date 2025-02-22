import { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import "./App.css";
import DragZone from "./Components/DragZone";
import { useForm } from "react-hook-form";
import axios from "axios";

function App() {
  type FileWithPreview = File & { preview: string };

  const { handleSubmit } = useForm();

  const [file, setFile] = useState<FileWithPreview[]>([]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      file.forEach((file) => {
        formData.append("image", file);
      });

      console.log(file);
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-image`,
        formData
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default App;
