import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "./store/contexts";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";

export default function SignInPage({ pathName = "/home", onHide }) {
  const { onSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [isInvalidLogin, setIsInvalidLogin] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const rememberMe = checked;

    try {
      const response = await axios.post("https://social-media-api-demo.fly.dev/api/login", {
        email,
        password,
        rememberMe,
      });

      const { userId, token, autoLoginToken } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      if (rememberMe) {
        Cookies.set("autoLoginToken", autoLoginToken, {
          expires: 7,
        });
      } else {
        Cookies.remove("autoLoginToken");
      }
      onSignIn();
      onHide();
      // 重定向到首頁
      navigate(pathName);
    } catch (error) {
      console.error("Login failed", error);
      setIsInvalidLogin(true);
    }
  };

  // 在應用加載時檢查是否有自動登入令牌
  const autoLogin = async () => {
    const autoLoginToken = Cookies.get("autoLoginToken");
    if (autoLoginToken) {
      try {
        const response = await axios.post(
          "https://social-media-api-demo.fly.dev/api/auto-login",
          {
            autoLoginToken,
          }
        );

        localStorage.setItem("authToken", response.data.token);

        onSignIn();
        onHide();
        // 重定向到首頁
        navigate(pathName);
      } catch (error) {
        console.error("Auto-login failed", error);
      }
    }
  };

  // 在應用加載時調用 autoLogin 函數
  useEffect(() => {
    autoLogin();
  });

  const header = (
    <>
      <div className="flex justify-center items-center">
        <i className="pi pi-lock p-5 rounded-full text-[var(--primary-color-text)] bg-[var(--pink-500)]"></i>
      </div>
      <h2 className="text-center text-xl font-bold pt-2">登入</h2>
    </>
  );

  return (
    <>
      <div className="flex justify-center">
        <Card
          footer={
            <Button label="登入" className="w-full" onClick={handleSubmit} />
          }
          header={header}
          className="p-5 shadow-none w-full max-w-md"
          pt={{
            body: { className: "p-0" },
          }}
        >
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email">帳號</label>
              <InputText
                id="email"
                ref={emailRef}
                className="border-0 bg-[var(--surface-50)] py-3"
                keyfilter="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">密碼</label>
              <Password
                id="password"
                inputRef={passwordRef}
                feedback={false}
                tabIndex={1}
                toggleMask
                pt={{
                  root: { className: "w-full block" },
                  input: {
                    className: "w-full border-0 bg-[var(--surface-50)] py-3",
                  },
                  hideIcon: { className: "outline-0 right-2" },
                  showIcon: { className: "outline-0 right-2" },
                }}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                inputId="rememberMe"
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              />
              <label htmlFor="rememberMe" className="ml-2 cursor-pointer">
                記住我
              </label>
            </div>
          </form>
        </Card>
        <style>{`.p-0 {
            padding: 0;
          }
        `}</style>
      </div>
      {isInvalidLogin && (
        <div className="w-full max-w-md flex px-6 mx-auto">
          <Message severity="error" text="登入失敗，帳號或密碼錯誤" />
        </div>
      )}
    </>
  );
}
