import { useRef, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import AvatarUploadAndCrop from "./AvatarUploadAndCrop";

export default function ProfileAvatarMenu({
  currentUser,
  onCrop,
  onRemoveAvatar,
  inputRef,
  tempAvatar,
}) {
  const [visible, setVisible] = useState(false);
  const menuRight = useRef(null);
  const handleOpen = () => setVisible(true);
  const handleHide = () => setVisible(false);

  const handleCrop = () => {
    onCrop();
    handleHide();
  };

  const items = [
    {
      label: "移除頭貼",
      icon: "pi pi-delete-left",
      command: onRemoveAvatar,
    },
    { label: "更換頭貼", icon: "pi pi-camera", command: handleOpen },
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
        image={
          tempAvatar
            ? tempAvatar
            : tempAvatar === ""
            ? currentUser?.avatar ?? null
            : null
        }
        shape="circle"
        className="overflow-hidden w-[4rem] h-[4rem]"
        pt={{
          image: { className: "object-cover" },
          icon: { className: "text-[2rem]" },
        }}
      />
      <style>{`.flex { display: flex; }`}</style>

      <AvatarUploadAndCrop
        onCrop={handleCrop}
        inputRef={inputRef}
        visible={visible}
        onHide={handleHide}
      />
    </>
  );
}
