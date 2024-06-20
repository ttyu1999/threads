import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext, PostContext } from "../store/contexts";
import { Avatar } from "primereact/avatar";
import GoBackButton from "../UI/GoBackButton";
import CommentInputArea from "./CommentInputArea";
import ArticleContent from "../Article/ArticleContent";
import ArticleLoadingSkeleton from "../Article/ArticleLoadingSkeleton";

function PostDetailsPage() {
  const { postId, commentId } = useParams();
  const { isLogin, loggedInAvatar, loggedInNickName, loggedInUserName } =
    useContext(AuthContext);
  const {
    setPosts,
    selectedPost,
    setSelectedPost,
    fetchSelectedPost,
    fetchSelectedComment,
  } = useContext(PostContext);

  const inputRef = useRef(null);

  useEffect(() => {
    setPosts([]);
    setSelectedPost(null);
    if (!commentId) fetchSelectedPost(postId);
    else fetchSelectedComment(commentId);
  }, [
    setPosts,
    setSelectedPost,
    postId,
    fetchSelectedPost,
    commentId,
    fetchSelectedComment,
  ]);

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div
        className="border-b border-[var(--surface-border)] last:border-none"
        key={comment._id}
      >
        <ArticleContent article={comment} postId={postId} />
        {comment?.comments.length > 0 && (
          // 只取評論的第一則，剩下的需點進內頁才能查看
          <>{renderComments([comment.comments[0]])}</>
        )}
      </div>
    ));
  };

  return (
    <>
      <GoBackButton />
      {selectedPost ? (
        <div>
          <ArticleContent
            article={selectedPost}
            isPost
            postId={postId}
            showAllText
          />
          <div>
            <h2 className="px-6 py-2 text-sm border-y border-[var(--surface-border)]">
              回覆
            </h2>
            {renderComments(selectedPost?.comments ?? [])}
            {isLogin ? (
              <div className="grid grid-cols-auto-1fr gap-5 pb-4 p-6">
                <Avatar
                  icon="pi pi-user"
                  image={loggedInAvatar ?? null}
                  size="large"
                  shape="circle"
                  className="overflow-hidden"
                  pt={{ image: { className: "object-cover" } }}
                />
                <div className="flex flex-col w-full items-start gap-1">
                  <span className="text-normal font-bold text-[var(--text-color)]">
                    {loggedInNickName ?? loggedInUserName}
                  </span>
                  <div className="w-full relative">
                    <CommentInputArea
                      postId={postId}
                      commentId={commentId}
                      inputRef={inputRef}
                      rows={1}
                    />
                    <style>{` .absolute { position: absolute; } `}</style>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-auto-1fr gap-5 pb-4 p-6">
                <Avatar
                  icon="pi pi-user"
                  image={loggedInAvatar ?? null}
                  size="large"
                  shape="circle"
                  className="overflow-hidden"
                  pt={{ image: { className: "object-cover" } }}
                />
                <div className="flex flex-col w-full items-start justify-center gap-1">
                  <span>登入即可留言</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ArticleLoadingSkeleton />
      )}
    </>
  );
}

export default PostDetailsPage;
