import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RotateSpinner } from "react-spinners-kit";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import { isAuth } from "../utils/isAuth";
import Auth from "./Auth";
import Home from "./Home/Home";

import ForgotPassword from "../Components/Password/ForgotPassword";
import NewPassowrd from "../Components/Password/NewPassword";
import { UserContext } from "../Context/userContext";
import { useSocket } from "../Socket/SocketContext";
import { UserType } from "../types/user";
import { getSession } from "../utils/SessionStorage";

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
