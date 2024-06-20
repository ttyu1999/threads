import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useLocation, Link } from "react-router-dom";
import { parseISO } from "date-fns";
import LikeCommentShareButtons from "./LikeCommentShareButtons";
import ArticleMenu from "./ArticleOptionsMenu";

function ArticleContent({ article, isPost, postId, showAllText }) {
  const location = useLocation();
  let { content, author, _id: commentId } = article;
  if (postId === commentId) commentId = null;
  const hasComments = article.comments && article.comments.length > 0;

  const header = (
    <Link to={`/${author?._id}`}>
      <Avatar
        icon="pi pi-user"
        image={author?.avatar ?? null}
        size="large"
        shape="circle"
        className="overflow-hidden"
        pt={{ image: { className: "object-cover" } }}
      />
    </Link>
  );

  const formattedTime = formatRelativeTime(article.createdAt);

  const linkTo = isPost ? `/post/${postId}` : `/post/${postId}/${commentId}`;

  const notInPostPage =
    location.pathname !== `/post/${postId}` && location.pathname !== `/post/${postId}/${commentId}`;

  return (
    <div
      className={`relative card flex ${
        notInPostPage
          ? "border-b border-[var(--surface-border)] last:border-none"
          : ""
      }`}
    >
      <ArticleMenu
        isPost={isPost}
        postId={postId}
        commentId={commentId}
        userId={author?._id}
      />
      <Card
        title={
          <Link to={`/${author?._id}`}>
            {author?.nickName ?? author?.userName}
          </Link>
        }
        subTitle={<Link to={linkTo}>{formattedTime}</Link>}
        footer={
          <LikeCommentShareButtons
            article={article}
            isPost={isPost}
            postId={postId}
            commentId={commentId}
          />
        }
        header={header}
        className={`grid grid-cols-auto-1fr gap-5 ${
          isPost ? "" : hasComments ? "has-comments" : ""
        }`}
        pt={{
          root: { className: "root w-full" },
          body: {
            className: "p-0 flex flex-wrap gap-x-2.5 gap-y-1 items-center",
          },
          title: { className: "m-0 text-base" },
          subTitle: { className: "m-0 text-sm text-[var(--surface-300)]" },
          content: {
            className: `p-0 w-full ${showAllText ? "" : "multiline-ellipsis"}`,
          },
          footer: { className: "p-0" },
          header: { className: "relative" },
        }}
      >
        {/* 如果已經是最上層的貼文(包含評論也算)，文字就不再設連結 */}
        {isPost && !notInPostPage ? (
          <p className="word-break m-0">{content}</p>
        ) : (
          <Link to={linkTo} className="block">
            <p className="word-break m-0">{content}</p>
          </Link>
        )}
        <style>{`
          .p-0 {
            padding: 0;
          }

          .m-0 {
            margin: 0;
          }

          .text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }

          .text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }

          .block {
            display: block;
          }

          .word-break {
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          } 
        `}</style>
      </Card>
    </div>
  );
}

const formatRelativeTime = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 1000 / 60);

  if (diffInMinutes < 1) return "剛剛";
  
  if (diffInMinutes < 60) return `${diffInMinutes}分鐘`;
  
  if (diffInMinutes < 1440) {
    // 小於一天
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}小時`;
  }
  
  if (diffInMinutes < 4320) {
    // 小於三天
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays}天`;
  }
  
  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString("zh-TW", { month: "short", day: "numeric" });
  }
  
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default ArticleContent;
