import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/userContext";
import {
  RegisterForm,
  RegisterFormSchema,
} from "../../../Schemas/RegisterForm";
import useRegister from "../../../api/useRegister";
import style from "../../../pages/Auth/style.module.css";
import { ErrorResponse, UserType } from "../../../types/user";
import { setSession } from "../../../utils/SessionStorage";
import { isAuth } from "../../../utils/isAuth";

type Props = {};

const Register = ({}: Props) => {
  const { setUser } = useContext(UserContext);
  const { mutate } = useRegister();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    mutate(data, {
      onSuccess: async (data) => {
        setSession(data.token);
        await isAuth();
        navigate("/");
        const decodeJWT = jwtDecode<UserType>(data.token);
        setUser(decodeJWT);
      },
      onError: (err: AxiosError<ErrorResponse>) => {
        console.log(err.response?.data.message);
        toast.error(err.response?.data.message);
      },
    });
  };

  return (
    <div className={style.loginContainer}>
      <h2>
        Sign In <i>🎉</i>
      </h2>
      <p>Create a new account</p>
      <form
        action=""
        className={style.authForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Username"
          className={errors.username ? "errorField" : ""}
          {...register("username")}
        />
        <input
          type="email"
          placeholder="Email"
          className={errors.email ? "errorField" : ""}
          {...register("email")}
        />
        <input
          type="text"
          placeholder="Password"
          className={errors.password ? "errorField" : ""}
          {...register("password")}
        />
        <input
          type="text"
          placeholder="Repeat Password"
          className={errors.confirmPassword ? "errorField" : ""}
          {...register("confirmPassword")}
        />
        <div>
          <a href="">Forget your password?</a>
        </div>
        <button type="submit">Enviar</button>
        <span onClick={() => navigate("/auth/login")}>
          Don't have an account? Sign in
        </span>
      </form>
    </div>
  );
};

export default Register;
