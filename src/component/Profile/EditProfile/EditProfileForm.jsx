// components/EditProfileForm.js
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import ProfileAvatarMenu from "./ProfileAvatarMenu";
import MentionInput from "../../MentionInput";
import { useTextArea } from "../../hook/useTextArea";

const maxLength = 3 * 50; // 中文字佔 3 bytes，限 50 字

const EditProfileForm = ({
  currentUser,
  tempAvatar,
  handleCrop,
  handleRemoveAvatar,
  nickName,
  inputRef,
  value,
  setValue,
}) => {
  const [ nickNameRef, bioRef ] = inputRef;
  const cropperRef = useRef(null);
  
  const {
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
  } = useTextArea(setValue, maxLength);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="nickName">名稱</label>
          <InputText
            defaultValue={nickName}
            id="nickName"
            ref={nickNameRef}
            className="border-0 bg-[var(--surface-50)] py-3"
          />
        </div>
        <div>
          <ProfileAvatarMenu
            currentUser={currentUser}
            onRemoveAvatar={handleRemoveAvatar}
            onCrop={() => handleCrop(cropperRef)}
            inputRef={cropperRef}
            tempAvatar={tempAvatar}
            userId={currentUser?._id}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="bio">個人簡介</label>
        <MentionInput
          id="bio"
          inputRef={bioRef}
          value={value}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>
    </div>
  );
};

export default EditProfileForm;
