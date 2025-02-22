import { useForm } from "react-hook-form";
import { NewPasswordForm } from "../../../Schemas/NewPasswordForm";
import { zodResolver } from "@hookform/resolvers/zod";
import style from "./style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { useState } from "react";
type Props = {};

const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const URL = `/auth/resetPassword`;
    try {
      console.log(email);
      const response = await apiClient.put(URL, { email: email });
      toast.success(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      toast.error("Somethign went wrong, Try again");
      //   navigate("/auth/login");
    }
  };

  return (
    <form onSubmit={onSubmit} className={style.newPasswordContainer}>
      <h2>Forgot Password</h2>
      <label htmlFor="">Type your email</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default ForgotPassword;
