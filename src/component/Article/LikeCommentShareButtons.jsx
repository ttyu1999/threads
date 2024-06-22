import axios from "axios";
import { useState, useContext, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { AuthContext, PostContext } from "../store/contexts";
import { Link, useLocation } from "react-router-dom";
import LineIcon from "../Icon/LineIcon";
import SignInPage from "../SignInPage";
import { Dialog } from "primereact/dialog";

function ButtonItem({ btn }) {
  return (
    <Button
      icon={btn.icon}
      rounded
      text
      aria-label={btn.ariaLabel}
      label={btn.label || " "}
      className="py-1 h-full items-center"
      pt={{
        label: { className: "text-sm font-normal leading-none" },
      }}
      onClick={btn.command}
    />
  );
}

function LikeCommentShareButtons({ article, isPost, postId, commentId }) {
  const location = useLocation();
  const { isLogin, loggedInUserId } = useContext(AuthContext);
  const [visibleSignIn, setVisibleSignIn] = useState(false);
  const { setPosts, setSelectedPost } = useContext(PostContext);

  let { likedBy, likes, commentsCount, shares } = article;
  const isLikedByUser = likedBy.includes(loggedInUserId);
  const [isLiked, setIsLiked] = useState(isLikedByUser);

  const op = useRef(null);

  useEffect(() => {
    setIsLiked(likedBy.includes(loggedInUserId));
  }, [loggedInUserId, likedBy]);

  const showSignInDialog = () => setVisibleSignIn(true);
  const hideSignInDialog = () => setVisibleSignIn(false);

  const notInPostPage =
    location.pathname !== `/post/${postId}` &&
    location.pathname !== `/post/${postId}/${commentId}`;

  const handleUserLike = async (id) => {
    const likeData = {
      postId: postId,
      commentId: commentId,
      userId: loggedInUserId,
    };

    try {
      const response = await axios.post(
        `https://social-media-api-demo.fly.dev/api/posts/${id}/like`,
        likeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const updateData = (item, data) => ({
        ...item,
        likes: data.likes,
        likedBy: data.likedBy,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updateData(post, response.data) : post
        )
      );

      setIsLiked(response.data.likedBy.includes(loggedInUserId));

      if (notInPostPage) return; // 只要不是在貼文內頁，就不繼續執行

      if (isPost) {
        // 如果點讚的是PO文
        return setSelectedPost((prevPost) =>
          updateData(prevPost, response.data)
        );
      }

      return setSelectedPost((prevPost) => {
        if (prevPost) {
          const updateComments = (comments) => {
            return comments.map((comment) => {
              if (comment._id === commentId) {
                return updateData(comment, response.data);
              } else if (comment.comments) {
                return {
                  ...comment,
                  comments: updateComments(comment.comments),
                };
              }

              return comment;
            });
          };

          return {
            ...prevPost,
            comments: updateComments(prevPost.comments),
          };
        }

        return prevPost;
      });
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const buttonData = [
    {
      icon: isLiked ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up",
      ariaLabel: "Like",
      label: likes,
      command: isLogin
        ? () => handleUserLike(commentId || postId)
        : showSignInDialog,
    },
    {
      icon: "pi pi-comment",
      ariaLabel: "Comment",
      label: commentsCount,
      command: null,
    },
    {
      icon: "pi pi-share-alt",
      ariaLabel: "Share",
      label: shares,
      command: (e) => op.current.toggle(e),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 -ml-4">
      <OverlayPanel
        ref={op}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
      >
        <a
          href={`https://social-plugins.line.me/lineit/share?url=https://ttyu1999.github.io/threads/post/${postId}${
            commentId ? `/${commentId}` : ""
          }?openExternalBrowser=1`}
          target="_blank"
          rel="noreferrer"
        >
          <LineIcon />
        </a>
      </OverlayPanel>
      {buttonData.map((btn, index) => {
        const linkTo = isPost
          ? `/post/${postId}`
          : `/post/${postId}/${commentId}`;

        if (btn.ariaLabel === "Comment") {
          if (commentId || notInPostPage) {
            return (
              <Link key={index} to={linkTo} className="block">
                <ButtonItem btn={btn} />
              </Link>
            );
          }
        }

        return <ButtonItem key={index} btn={btn} />;
      })}
      <style>{`
        .py-1 {
          padding-block: 0.25rem;
        }
        .leading-none {
          line-height: 1;
        }
      `}</style>
      <Dialog
        visible={visibleSignIn}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
        className="w-[95%] max-w-screen-sm"
        modal
        blockScroll
        dismissableMask
        draggable={false}
        onHide={hideSignInDialog}
        pt={{
          header: { className: "absolute right-0" },
          content: { className: "pt-8" },
          footer: { className: "justify-end" },
        }}
      >
        <SignInPage
          pathName={
            location.pathname !== "/sign-in" ? location.pathname : "/home"
          }
          onHide={hideSignInDialog}
        />
      </Dialog>
    </div>
  );
}

export default LikeCommentShareButtons;
