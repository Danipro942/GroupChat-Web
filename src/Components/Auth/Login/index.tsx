import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import style from "../../../pages/Auth/style.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, LoginFormSchema } from "../../../Schemas/LoginForm";
import useLogin from "../../../api/useLogin";
import { getSession, setSession } from "../../../utils/SessionStorage";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/user";
type Props = {
  isAuth: () => void;
};

const Login = ({ isAuth }: Props) => {
  const { mutate } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    mutate(data, {
      onSuccess: async (data) => {
        console.log(data);
        setSession(data.token);
        await isAuth();
        navigate("/");
      },
      onError: (err: AxiosError<any>) => {
        toast.error(err.response?.data.message);
        console.log(err.response?.data.message);
      },
    });
  };
  return (
    <div className={style.loginContainer}>
      <h2>
        Log In <i>👋</i>
      </h2>
      <p>Login into your account</p>
      <form
        action=""
        className={style.authForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("username")}
          type="text"
          placeholder="Username"
          className={errors.username ? "errorField" : ""}
          autoComplete="off"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={errors.password ? "errorField" : ""}
        />
        <div>
          <a href="" onClick={() => navigate("/auth/forgot-password")}>
            Forget your password?
          </a>
        </div>
        <button type="submit">Enviar</button>
        <span onClick={() => navigate("/auth/register")}>
          Don't have an account? Sign in
        </span>
      </form>
    </div>
  );
};

export default Login;
