import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AuthContext } from "../store/contexts";
import ThreadsIcon from "../Icon/ThreadsIcon";
import PostCreationModal from "../PostCreation/PostCreationModal";
import AccountMenu from "./AccountMenu";
import SignInPage from "../SignInPage";

const IconButtonItem = ({ icon, to, ...props }) => (
  <li {...props}>
    {to ? (
      <NavLink to={to}>
        {({ isActive }) => (
          <Button
            text
            icon={"pi " + icon}
            className={`aspect-square ${
              isActive ? "bg-[var(--primary-color)]" : ""
            }`}
            pt={{
              icon: {
                className: `text-xl ${
                  isActive ? "text-[var(--primary-color-text)]" : ""
                }`,
              },
            }}
          />
        )}
      </NavLink>
    ) : (
      <Button
        text
        icon={"pi " + icon}
        className="aspect-square"
        pt={{
          icon: { className: "text-xl" },
        }}
      />
    )}
  </li>
);

function Header() {
  const location = useLocation();
  const { isLogin, onSignOut, loggedInUserId } = useContext(AuthContext);
  const [visiblePost, setVisiblePost] = useState(false);
  const [visibleSignIn, setVisibleSignIn] = useState(false);

  const showPostDialog = () => {
    if (!isLogin) {
      setVisibleSignIn(true);
      return;
    }
    setVisiblePost(true);
  };
  const hidePostDialog = () => setVisiblePost(false);

  const showSignInDialog = () => (setVisibleSignIn(true));
  const hideSignInDialog = () => setVisibleSignIn(false);

  return (
    <header id="header" className="z-[999] sticky top-0">
      <div className="max-w-7xl w-[95%] py-4 mx-auto relative flex justify-between items-center max-custom:justify-end">
        <div className="max-custom:absolute max-custom:top-1/2 max-custom:left-1/2 max-custom:-translate-x-1/2 max-custom:-translate-y-1/2">
          <Link to="/home">
            <ThreadsIcon />
          </Link>
        </div>
        <div className="header-content">
          <ul className="header-menu">
            <IconButtonItem aria-label="home" icon="pi-home" to="home" />
            <IconButtonItem aria-label="search" icon="pi-search" to="search" />
            <IconButtonItem
              aria-label="post"
              icon="pi-pen-to-square"
              onClick={showPostDialog}
            />
            {/* <IconButtonItem
              aria-label="notification"
              icon="pi-heart"
              onClick={showSignInDialog}
              to={isLogin ? "/notification" : null}
            /> */}
            <IconButtonItem
              aria-label="profile"
              icon="pi-user"
              onClick={isLogin ? null : showSignInDialog}
              to={isLogin ? `/profile/${loggedInUserId}` : null}
            />
          </ul>
        </div>
        <div>
          {isLogin ? (
            <AccountMenu onSignOut={onSignOut} />
          ) : (
            <Link to="/sign-in">
              <Button variant="contained">登入</Button>
            </Link>
          )}
        </div>
      </div>
      <PostCreationModal visible={visiblePost} hideDialog={hidePostDialog} />
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
        <SignInPage pathName={location.pathname !== '/sign-in' ? location.pathname : "/home"} onHide={hideSignInDialog} />
      </Dialog>
    </header>
  );
}

export default Header;
