import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import ArticleLoadingSkeleton from "../Article/ArticleLoadingSkeleton";

function ProfileLoadingSkeleton() {
  return (
    <>
      <Card
        pt={{
          content: { className: "p-0" },
          body: { className: "p-0" },
        }}
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton width="10rem" height="1.5rem" shape="circle"></Skeleton>
              <Skeleton width="6rem" height=".5rem" shape="circle"></Skeleton>
            </div>
            <Skeleton size="5rem" shape="circle"></Skeleton>
          </div>
          <div className="py-6">
            <Skeleton width="100%" height="1.5rem" shape="circle"></Skeleton>
          </div>
          <style>{` .py-2 { padding-block: 0.5rem } `}</style>
        </div>
        <style>{` .p-0 { padding: 0 } `}</style>
      </Card>
      <ArticleLoadingSkeleton />
    </>
  );
}

export default ProfileLoadingSkeleton;
