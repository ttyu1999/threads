import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

import './index.css';
// import 'primereact/resources/themes/viva-dark/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import App from './App';
import HomePage from './component/HomePage';
import PostDetailsPage from './component/Post/PostDetailsPage';
import SearchPage from './component/SearchPage';
import UserProfilePage from './component/Profile/UserProfilePage';
import SigninPage from './component/SigninPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "post/:postId/:commentId?",
        element: <PostDetailsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      // {
      //   path: "notification",
      //   element: <Notification />,
      // },
      {
        path: ":userId",
        element: <UserProfilePage />,
      },
      {
        path: "sign-in",
        element: <SigninPage />,
      },
      
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider value={{ pt: Tailwind, ripple: true }}>
    <RouterProvider router={router} />
  </PrimeReactProvider>
);

