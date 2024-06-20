import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PostContext } from "../store/contexts";
import { useNavigate } from "react-router-dom";

export const PostProvider = ({ children }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts([]);
    setSelectedPost(null);
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get("https://social-media-api-demo.fly.dev/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  }, []);

  const fetchUserPosts = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `https://social-media-api-demo.fly.dev/api/posts/user/${userId}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  }, []);

  const fetchSelectedPost = useCallback(async (postId) => {
    try {
      const [postResponse, commentResponse] = await Promise.all([
        axios.get(`https://social-media-api-demo.fly.dev/api/posts/${postId}`),
        axios.get(`https://social-media-api-demo.fly.dev/api/posts/${postId}/comments`),
      ]);

      const postData = postResponse.data;
      postData.comments = commentResponse.data;

      setSelectedPost(postData);
    } catch (error) {
      console.error("Error fetching post", error);
    }
  }, []);

  const fetchSelectedComment = useCallback(async (commentId) => {
    try {
      const response = await axios.get(
        `https://social-media-api-demo.fly.dev/api/comments/${commentId}`
      );

      setSelectedPost(response.data);
    } catch (error) {
      console.error("Error fetching post", error);
    }
  }, []);

  const createPost = async (post, userId, path) => {
    try {
      await axios.post("https://social-media-api-demo.fly.dev/api/posts", post, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (path === `/${userId}`) fetchUserPosts(userId); //發文成功後刷新用戶貼文
      else fetchPosts(); // 發文成功後刷新文章列表
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const createComment = async (post) => {
    try {
      await axios.post(
        `https://social-media-api-demo.fly.dev/api/posts/${post.postId}/comments`,
        post,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // 如果存在父層評論，則刷新父層評論
      if (post.parentCommentId) {
        fetchSelectedComment(post.parentCommentId);
      } else {
        fetchSelectedPost(post.postId);
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const deletePost = async (postId, userId, path) => {
    try {
      await axios.delete(`https://social-media-api-demo.fly.dev/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (path === `/${userId}`) fetchUserPosts(userId); //發文成功後刷新用戶貼文
      else fetchPosts(); // 發文成功後刷新文章列表

      if (path.includes === `/post/${postId}`) {
        navigate(-1); // 回上一頁
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const deleteComment = async (postId, commentId, currentPageCommentId) => {
    try {
      await axios.delete(`https://social-media-api-demo.fly.dev/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (commentId === currentPageCommentId) navigate(-1); // 回上一頁
      else if (!currentPageCommentId) fetchSelectedPost(postId);
      else fetchSelectedComment(currentPageCommentId); // 刪除成功後刷新文章評論

    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const ctxValue = {
    posts,
    setPosts,
    fetchPosts,
    selectedPost,
    setSelectedPost,
    fetchSelectedPost,
    createPost,
    createComment,
    fetchSelectedComment,
    fetchUserPosts,
    deletePost,
    deleteComment,
  };

  return (
    <PostContext.Provider value={ctxValue}>{children}</PostContext.Provider>
  );
};