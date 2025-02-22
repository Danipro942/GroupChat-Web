import { useForm } from "react-hook-form";
import { NewPasswordForm } from "../../../Schemas/NewPasswordForm";
import { zodResolver } from "@hookform/resolvers/zod";
import style from "./style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
type Props = {};

const NewPassowrd = (props: Props) => {
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
