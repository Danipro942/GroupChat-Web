import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  type FileWithPreview = File & { preview: string };

  const { handleSubmit } = useForm();

  const [file] = useState<FileWithPreview[]>([]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      file.forEach((file) => {
        formData.append("image", file);
      });

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-image`,
        formData
      );
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
