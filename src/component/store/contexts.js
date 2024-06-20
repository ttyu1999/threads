// context.js
import { createContext } from "react";

export const AuthContext = createContext({
  loggedInAvatar: null,
  loggedInUserName: null,
  loggedInNickName: null,
  loggedInUserId: null,
  loggedInUser: null,
  setLoggedInUser: () => {},
  isLogin: null,
  onSignIn: () => {},
  onSignOut: () => {},
});

export const PostContext = createContext({
  posts: [],
  setPosts: () => {},
  fetchPosts: () => {},
  createPost: () => {},
});