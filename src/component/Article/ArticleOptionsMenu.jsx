import { useContext, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useLocation, useParams } from "react-router-dom";
import { AuthContext, PostContext } from "../store/contexts";

function ArticleOptionsMenu({ isPost, postId, commentId, userId }) {
  const location = useLocation();
  const { commentId: currentPageCommentId } = useParams(); // 取得 URL 中的 commentId
  const menuRight = useRef(null);
  const { loggedInUserId } = useContext(AuthContext);
  const { deletePost, deleteComment } = useContext(PostContext);

  const handleDelete = (postId, commentId) => {
    if (isPost && !currentPageCommentId) deletePost(postId, userId, location.pathname); 
    else deleteComment(postId, commentId, currentPageCommentId);
  };

  const items = [
    {
      label: "測試",
      icon: "pi pi-cog",
      command: null,
    },
  ];

  // 如果用戶是作者，則新增刪除按鈕
  if (loggedInUserId === userId) {
    items.push({
      label: "刪除",
      icon: "pi pi-trash",
      command: () => handleDelete(postId, commentId),
    });
  }

  return (
    <>
      <div className="absolute top-3 right-3">
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
        <style>{`.flex { display: flex; }`}</style>
        <Button
          text
          rounded
          icon="pi pi-ellipsis-h"
          size="small"
          onClick={(event) => menuRight.current.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        />
      </div>
    </>
  );
}

export default ArticleOptionsMenu;
