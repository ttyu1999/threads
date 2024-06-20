import { useContext, useState } from "react";
import MentionInput from "../MentionInput";
import { Button } from "primereact/button";
import { AuthContext, PostContext } from "../store/contexts";
import { useTextArea } from "../hook/useTextArea";

const maxLength = 3 * 100; // 中文字佔 3 bytes，限 100 字

function CommentInputArea({
  inputRef,
  rows,
  postId,
  commentId,
  defaultValue = "",
}) {
  const [value, setValue] = useState(defaultValue);
  const {
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    autoResize,
  } = useTextArea(setValue, maxLength);

  const { loggedInUserId } = useContext(AuthContext);
  const { createComment } = useContext(PostContext);

  const handleKeyDown = (e) => {
    // 檢查是否存在下拉菜單
    const mentionDropdown = document.querySelector(".p-mention-panel");
    if (mentionDropdown) return; // 如果存在下拉菜單，直接返回

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const content = inputRef.current.getInput().value;
    if (!content.trim()) return;

    const commentData = {
      author: loggedInUserId,
      postId: postId,
      content,
      parentCommentId: commentId || null, // 如果有 commentId，說明是評論的評論
    };

    try {
      await createComment(commentData);
      setValue("");
      setTimeout(() => autoResize(inputRef.current.getInput()), 0);
    } catch (error) {
      console.error("Post failed", error);
    }
  };

  return (
    <div>
      <MentionInput
        inputRef={inputRef}
        rows={rows}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      <Button
        icon="pi pi-send"
        onClick={handleSubmit}
        text
        rounded
        disabled={!value.trim()}
        className="absolute bottom-[0.1875rem] right-[0.1875rem] p-1.5 w-auto h-auto aspect-square"
      />
      <style>{` .absolute { position: absolute; } `}</style>
    </div>
  );
}

export default CommentInputArea;
