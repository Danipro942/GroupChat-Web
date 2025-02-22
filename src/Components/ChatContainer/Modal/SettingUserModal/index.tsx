import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../../Context/userContext";
import apiClient from "../../../../api/apiClient";
import DragZone from "../../../DragZone";
import style from "./style.module.css";
import axios from "axios";
import { getSession, setSession } from "../../../../utils/SessionStorage";
type Props = {
  handleModel: (open: boolean) => void;
};

const SettingUserModal = ({ handleModel }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, setUser } = useContext(UserContext);
  type FileWithPreview = File & { preview: string };
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");

  const [file, setFile] = useState<FileWithPreview[]>([]);
  const [preview, setPreview] = useState(
    user?.profilePicture || "/default-avatar.png"
  );

  const formData = new FormData();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Obtiene el primer archivo seleccionado
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);

      const fileWithPreview: FileWithPreview = Object.assign(selectedFile, {
        preview: previewUrl,
      });

      setPreview(previewUrl); // Actualiza la previsualización
      setFile([fileWithPreview]); // Guarda el archivo en el estado
    }
  };

  const ChangeProfilePicture = async () => {
    const URL = "/user/profilepicture";
    setIsLoading(true);
    console.log(formData);
    // Si solo se espera un archivo, usamos el primero del array.
    if (file.length > 0) {
      formData.append("image", file[0]);
    } else {
      toast.error("No se ha seleccionado ningún archivo");
      return;
    }

    // Para depurar: iteramos sobre los pares clave/valor de formData.
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(formData, file[0]);
    const token = getSession();

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profilepicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Solo si usas autenticación
          },
        }
      );
      console.log(result.data.imageUrl);
      setSession(result.data.token);
      setIsLoading(false);

      if (user) {
        setUser({
          ...user,
          profilePicture: result.data.imageUrl,
        });
      }
      toast.success("Your Profile Picture has been changed Successfully");

      console.log(result);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const ChangeUsername = async () => {
    try {
      const URL = "/auth/changeusername";
      const response = await apiClient.put(URL, {
        newUsername,
      });
      if (response.data) {
        console.log(response);
        toast.success(
          "Your Username has been changed Successfully, The website will reload in 5 seconds"
        );
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {}
  };

  const requestNewPassword = async () => {
    try {
      const URL = "/auth/resetPassword";
      const response = await apiClient.put(URL, {
        email,
      });
      console.log(response);
      if (response.data) {
        console.log(response);
        toast.success("Request for new password sent, please check your email");
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click(); // Abre el explorador de archivos
  };

  return (
    <div className={style.userSetting}>
      <h2>Setting up your account</h2>
      <form className={style.formUser}>
        <label htmlFor="">Change Username</label>
        <input
          type="text"
          value={newUsername || ""}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button type="button" onClick={() => ChangeUsername()}>
          Change Username
        </button>
        <label htmlFor="">Change Password</label>
        <input
          type="email"
          placeholder="Type your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button type="button" onClick={() => requestNewPassword()}>
          Send Code
        </button>
        <label htmlFor="">Change your picture profile</label>
        <div className={style.dragZone}>
          <div className={style.imagePreview} onClick={handleImageClick}>
            <img src={preview ? preview : user?.profilePicture} alt="" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          {/* <DragZone file={file} setFile={setFile} /> */}
        </div>
        {file.length > 0 && (
          <button
            onClick={() => ChangeProfilePicture()}
            type="button"
            disabled={isLoading}
          >
            Change Profile Picture
          </button>
        )}
      </form>
    </div>
  );
};

export default SettingUserModal;
