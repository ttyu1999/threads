import PrimeReact from "primereact/api";
import { useContext, useRef, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { AuthContext } from "../store/contexts";

export default function AccountMenu({ onSignOut }) {
  const [theme, setTheme] = useState("dark");
  const { loggedInAvatar } = useContext(AuthContext);
  const menuRight = useRef(null);

  const handleSignOut = () => {
    onSignOut();
    window.location.href = "/home";
  };

  const changeMyTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    PrimeReact?.changeTheme?.(
      `viva-${theme}`,
      `viva-${newTheme}`,
      "app-theme",
      () => setTheme(newTheme)
    );
  };

  const items = [
    {
      label: "切換主題",
      icon: theme === "dark" ? "pi pi-sun" : "pi pi-moon",
      command: changeMyTheme,
    },
    { label: "登出", icon: "pi pi-sign-out", command: handleSignOut },
  ];

  return (
    <>
      <Menu
        model={items}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
        pt={{
          action: { className: "flex items-center" },
        }}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
      />
      <Avatar
        icon="pi pi-user"
        onClick={(event) => menuRight.current.toggle(event)}
        image={loggedInAvatar ?? null}
        size="large"
        shape="circle"
        className="overflow-hidden"
        pt={{ image: { className: "object-cover" } }}
      />
      <style>{`.flex { display: flex; }`}</style>
    </>
  );
}
