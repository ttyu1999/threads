import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

function ArticleLoadingSkeleton() {
  const articles = Array.from({ length: 7 });

  return (
    <>
      {articles.map((_, index) => (
        <Card
          key={index}
          title={<Skeleton width="6rem" shape="circle"></Skeleton>}
          subTitle={
            <Skeleton width="2rem" height=".5rem" shape="circle"></Skeleton>
          }
          footer={
            <div className="flex flex-wrap gap-2">
              <Skeleton width="12rem" height="1rem" shape="circle"></Skeleton>
            </div>
          }
          header={<Skeleton size="3rem" shape="circle"></Skeleton>}
          className={`grid grid-cols-auto-1fr gap-5`}
          pt={{
            root: { className: "root w-full" },
            body: {
              className: "p-0 flex flex-wrap gap-x-2.5 gap-y-3 items-center",
            },
            title: { className: "m-0 text-base" },
            subTitle: { className: "m-0 text-sm text-[var(--surface-300)]" },
            content: {
              className: `p-0 w-full`,
            },
            footer: { className: "p-0" },
            header: { className: "relative" },
          }}
        >
          <Skeleton width="100%" height="1.5rem" shape="circle"></Skeleton>
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
          `}</style>
        </Card>
      ))}
    </>
  );
}

export default ArticleLoadingSkeleton;
