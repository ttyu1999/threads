import { useContext, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import PostVisibilityMenu from "./PostVisibilityMenu";
import MentionInput from "../MentionInput";
import { AuthContext, PostContext } from "../store/contexts";
import { useTextArea } from "../hook/useTextArea";
import { useLocation, useParams } from "react-router-dom";

const maxLength = 3 * 100; // 中文字佔 3 bytes，限 100 字

export default function PostCreationModal({ visible, hideDialog }) {
  const { loggedInUserId, loggedInAvatar, loggedInNickName, loggedInUserName } =
    useContext(AuthContext);
  const location = useLocation();
  const { userId } = useParams();
  const { createPost } = useContext(PostContext);
  const [value, setValue] = useState("");
  const {
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    autoResize,
  } = useTextArea(setValue, maxLength);
  const inputRef = useRef(null);

  const onShow = () => inputRef.current && inputRef.current.focus();

  const handleSubmit = async () => {
    const content = inputRef.current.getInput().value;
    if (!content) return;

    try {
      createPost({
        author: loggedInUserId,
        content,
      }, userId, location.pathname);
      hideDialog();
      setValue("");
      setTimeout(() => autoResize(inputRef.current.getInput()), 0);
    } catch (error) {
      console.error("Post failed", error);
    }
  };

  return (
    <>
      <Dialog
        header="建立串文"
        footer={
          <Button
            label="發佈"
            icon="pi pi-check"
            onClick={handleSubmit}
            disabled={!value.trim()}
          />
        }
        visible={visible}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
        className="w-[95%] max-w-screen-sm"
        modal
        blockScroll
        dismissableMask
        draggable={false}
        onHide={hideDialog}
        onShow={onShow} // 使用 onShow 事件
        pt={{
          header: { className: "text-center" },
          content: { className: "overflow-y-visible" },
          footer: { className: "justify-end" },
        }}
      >
        <div className="card flex items-center gap-5 pb-4">
          <Avatar
            icon="pi pi-user"
            image={
              loggedInAvatar ?? null
            }
            size="large"
            shape="circle"
            className="overflow-hidden"
            pt={{ image: { className: "object-cover" } }}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-normal font-bold">
              {loggedInNickName ?? loggedInUserName}
            </span>
            <PostVisibilityMenu />
          </div>
        </div>
        <div className="card">
          <MentionInput
            inputRef={inputRef}
            value={value}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        </div>
      </Dialog>
    </>
  );
}
