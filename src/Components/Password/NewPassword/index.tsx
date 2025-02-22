import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";
import { NewPasswordForm } from "../../../Schemas/NewPasswordForm";
import style from "./style.module.css";
type Props = {};

const NewPassowrd = ({}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewPasswordForm),
  });

  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();
  const onSubmit = async (data: any) => {
    const URL = `/auth/newpassword/${token}`;
    try {
      const response = await apiClient.put(URL, data);
      toast.success(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      toast.error("Token Expired, Please try again");
      navigate("/auth/login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={style.newPasswordContainer}
    >
      <h2>Set Your New password</h2>
      <input
        type="text"
        placeholder="Password"
        {...register("password")}
        className={errors.password ? "errorField" : ""}
      />
      <input
        type="text"
        placeholder="Confirm Password"
        {...register("confirmPassword")}
        className={errors.confirmPassword ? "errorField" : ""}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewPassowrd;
