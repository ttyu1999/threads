import axios from "axios";
import { Avatar } from "primereact/avatar";
import { useContext, useEffect, useState } from "react";
import { AuthContext, PostContext } from "../store/contexts";
import { Card } from "primereact/card";
import { useParams } from "react-router-dom";
import ArticleContent from "../Article/ArticleContent";
import ProfileSkeleton from "./ProfileLoadingSkeleton";
import EditProfileModal from "./EditProfile/EditProfileModal";
import GoBackButton from "../UI/GoBackButton";

function UserProfilePage() {
  const { userId } = useParams();
  const { loggedInUserId } = useContext(AuthContext);
  const { posts, setPosts, fetchUserPosts } = useContext(PostContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(null);
    if (userId) {
      fetchUser(userId);
      fetchUserPosts(userId);
    }
  }, [fetchUserPosts, userId, setPosts]);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        `https://social-media-api-demo.fly.dev/api/users/${userId}`
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  return (
    <>
      {currentUser ? (
        <>
          <GoBackButton />
          <Card
            className="border-b border-[var(--surface-border)]"
            pt={{
              content: { className: "p-0" },
              body: { className: "p-0" },
            }}
          >
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentUser?.nickName}
                  </h2>
                  <span>{currentUser?.userName}</span>
                </div>
                <Avatar
                  icon="pi pi-user"
                  image={currentUser?.avatar ?? null}
                  shape="circle"
                  className="overflow-hidden w-[5rem] h-[5rem]"
                  pt={{
                    image: { className: "object-cover" },
                    icon: { className: "text-[2.5rem]" },
                  }}
                />
              </div>
              <div className="py-6">
                <p>{currentUser?.bio}</p>
              </div>
              {userId === loggedInUserId && (
                <EditProfileModal
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  avatarUrl={currentUser?.avatar}
                  nickName={currentUser?.nickName}
                  fetchUser={fetchUser}
                  userId={userId}
                  defaultValue={currentUser?.bio}
                />
              )}
              <style>{` .py-2 { padding-block: 0.5rem } `}</style>
            </div>
            <style>{` .p-0 { padding: 0 } `}</style>
          </Card>
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
        <ProfileSkeleton />
      )}
    </>
  );
}

export default UserProfilePage;
