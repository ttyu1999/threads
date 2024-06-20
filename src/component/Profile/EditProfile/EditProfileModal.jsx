import { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import EditProfileForm from "./EditProfileForm";
import { useAvatarUpload } from "../../hook/useAvatarUpload";
import { AuthContext, PostContext } from "../../store/contexts";

const EditProfileModal = ({
  currentUser,
  setCurrentUser,
  userId,
  fetchUser,
  nickName,
  defaultValue,
}) => {
  const { fetchUserPosts } = useContext(PostContext);
  const { setLoggedInUser } = useContext(AuthContext);
  const [value, setValue] = useState(defaultValue);
  const [visible, setVisible] = useState(false);
  const nickNameRef = useRef(null);
  const bioRef = useRef(null);

  const {
    tempAvatar,
    setTempAvatar,
    handleCrop,
    handleRemoveAvatar,
    uploadImage,
    compressedFile,
    removeAvatar,
  } = useAvatarUpload(userId, setCurrentUser, setLoggedInUser);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    setTempAvatar("");
  };

  const handleSubmit = async () => {
    let nickName = nickNameRef.current.value.trim();
    const bio = bioRef.current.getInput().value.trim();

    if (nickName === "") nickName = null;
    const profileData = { nickName, bio };

    try {
      await updateProfile(profileData);
      if (compressedFile) await uploadImage(compressedFile);
      if (tempAvatar === null) await removeAvatar();
      hideDialog();
      await fetchUser(userId);
      await fetchUserPosts(userId);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      await axios.put(
        `https://social-media-api-demo.fly.dev/api/users/${userId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <>
      <Button
        outlined
        rounded
        className="py-2 justify-center"
        onClick={showDialog}
      >
        編輯個人檔案
      </Button>
      <Dialog
        header="編輯個人檔案"
        footer={
          <Button className="w-full justify-center m-0" onClick={handleSubmit}>
            完成
          </Button>
        }
        visible={visible}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
        className="w-[95%] max-w-md"
        modal
        blockScroll
        dismissableMask
        draggable={false}
        onHide={hideDialog}
        pt={{
          header: { className: "text-center" },
          content: { className: "overflow-y-visible" },
          footer: { className: "justify-end" },
        }}
      >
        <EditProfileForm
          currentUser={currentUser}
          tempAvatar={tempAvatar}
          handleCrop={handleCrop}
          handleRemoveAvatar={handleRemoveAvatar}
          nickName={nickName}
          defaultValue={defaultValue}
          value={value}
          inputRef={[nickNameRef, bioRef]}
          setValue={setValue}
        />
      </Dialog>
    </>
  );
};

export default EditProfileModal;
