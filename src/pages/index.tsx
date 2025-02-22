import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Home from "./Home/Home";
import Auth from "./Auth";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import { useContext, useEffect, useState } from "react";
import { isAuth } from "../utils/isAuth";
import { PushSpinner, RotateSpinner } from "react-spinners-kit";
import { jwtDecode } from "jwt-decode";
import { Socket, io } from "socket.io-client";

import { UserContext } from "../Context/userContext";
import { UserType } from "../types/user";
import { getSession } from "../utils/SessionStorage";
import { useSocket } from "../Socket/SocketContext";
import NewPassowrd from "../Components/Password/NewPassword";
import ForgotPassword from "../Components/Password/ForgotPassword";

const AppRouter = () => {
  const { socket } = useSocket();

  const [authenticated, setAuthenticated] = useState<Boolean | null>(null);

  const { setUser } = useContext(UserContext);

  const checkAuthentication = async () => {
    const auth = await isAuth();
    if (auth === true) {
      const session = getSession();
      if (session) {
        const decodeJWT = jwtDecode<UserType>(session);
        setUser(decodeJWT);
        // Emit new user
        console.log(socket);

        if (socket) {
          socket.emit("login", decodeJWT.username);
        }
      }
    }
    setAuthenticated(auth);
  };

  useEffect(() => {
    checkAuthentication();
  }, [socket]);

  if (authenticated === null)
    return (
      <div className="loadingContainer">
        <RotateSpinner size={70} color={"#00d9ff"} />
      </div>
    );

  const router = createBrowserRouter([
    {
      path: "/",
      element: authenticated ? <Home /> : <Navigate to="/auth/login" replace />,
    },

    {
      path: "/auth",
      element: <Auth />,
      children: [
        { path: "", element: <Navigate to="/auth/login" replace /> },
        { path: "login", element: <Login isAuth={checkAuthentication} /> },
        { path: "new-password/:token", element: <NewPassowrd /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "register", element: <Register /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
export default AppRouter;
