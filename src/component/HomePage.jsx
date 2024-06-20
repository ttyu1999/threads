import { useEffect, useContext } from "react";
import { PostContext } from "./store/contexts";
import ArticleContent from "./Article/ArticleContent";
import ArticleLoadingSkeleton from "./Article/ArticleLoadingSkeleton";

function HomePage() {
  const { posts, setPosts, fetchPosts, setSelectedPost } =
    useContext(PostContext);
  useEffect(() => {
    setPosts([]);
    fetchPosts();
  }, [fetchPosts, setPosts, setSelectedPost]);

  return (
    <>
      {posts.length > 0 ? (
        <>
          {posts.map((article) => (
            <ArticleContent
              key={article._id}
              article={article}
              isPost={true}
              postId={article._id}
            />
          ))}
        </>
      ) : (
        <ArticleLoadingSkeleton />
      )}
    </>
  );
}

export default HomePage;
