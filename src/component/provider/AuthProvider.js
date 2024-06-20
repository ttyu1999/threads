import axios from "axios";
import { useEffect, useState } from "react";
import { AuthContext } from "../store/contexts";

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const [isLogin, setIsLogin] = useState(token);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "https://social-media-api-demo.fly.dev/api/authenticated-user-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        handlerSignIn();
        setLoggedInUser(response.data);
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };
    fetchUserInfo();
  }, [token]);

  const handlerSignOut = () => {
    localStorage.removeItem("authToken");
    setIsLogin(false);
    setLoggedInUser(null);
  };

  const handlerSignIn = () => {
    setIsLogin(true);
  };

  const ctxValue = {
    loggedInAvatar: loggedInUser?.avatar,
    loggedInUserId: loggedInUser?._id,
    loggedInUserName: loggedInUser?.userName,
    loggedInNickName: loggedInUser?.nickName,
    isLogin,
    loggedInUser,
    setLoggedInUser,
    onSignIn: handlerSignIn,
    onSignOut: handlerSignOut,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};