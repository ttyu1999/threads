import { useState } from "react";
import axios from "axios";

export const useAvatarUpload = (userId, setCurrentUser, setLoggedInUser) => {
  const [tempAvatar, setTempAvatar] = useState("");
  const [compressedFile, setCompressedFile] = useState(null);

  const handleCrop = async (cropperRef) => {
    const cropper = cropperRef.current?.cropper;
    const croppedCanvas = cropper?.getCroppedCanvas();
    if (croppedCanvas) {
      const compressedFile = await new Promise((resolve) => {
        croppedCanvas.toBlob(
          (blob) =>
            resolve(
              new File([blob], "profile-picture.jpg", { type: "image/jpeg" })
            ),
          "image/jpeg",
          0.8 // 壓縮質量
        );
      });
      setCompressedFile(compressedFile);
      const tempUrl = URL.createObjectURL(compressedFile);
      setTempAvatar(tempUrl);
    }
  };

  const handleRemoveAvatar = () => setTempAvatar(null);

  const removeAvatar = async () => {
    try {
      const response = await axios.delete(
        `https://social-media-api-demo.fly.dev/api/users/${userId}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setCurrentUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatar,
      }));
      setLoggedInUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatar,
      }));
    } catch (error) {
      console.error("Error removing avatar", error);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("avatar", compressedFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        `https://social-media-api-demo.fly.dev/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const avatarUrl = response.data.url;
      await updateAvatarUrlInDatabase(avatarUrl);
    } catch (error) {
      console.error("Error uploading avatar", error);
    }
  };

  const updateAvatarUrlInDatabase = async (avatarUrl) => {
    try {
      const response = await axios.put(
        `https://social-media-api-demo.fly.dev/api/users/${userId}/avatar`,
        { avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setCurrentUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatar,
      }));
      setLoggedInUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatar,
      }));
    } catch (error) {
      console.error("Error updating avatar in database", error);
    }
  };

  return {
    tempAvatar,
    setTempAvatar,
    compressedFile,
    setCompressedFile,
    handleCrop,
    handleRemoveAvatar,
    removeAvatar,
    uploadImage,
  };
};
