import { useContext } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import ArticleContent from "./Article/ArticleContent";
import GoBackButton from "./UI/GoBackButton";
import { PostContext } from "./store/contexts";
import { useLocation } from "react-router-dom";
import { useSearch } from "./hook/useSearch";

function SearchPage() {
  const location = useLocation();
  const { posts, setPosts } = useContext(PostContext);

  const savedQuery = location.state?.searchQuery || "";
  const savedResults = location.state?.searchResults || [];

  const { searchQuery, setSearchQuery, handleKeyDown } = useSearch(
    savedQuery,
    savedResults,
    setPosts
  );

  return (
    <>
      <GoBackButton />
      <div className="flex gap-3 p-6">
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜尋關鍵字"
            className="w-full py-3 pl-10"
          />
        </IconField>
      </div>
      {posts.length === 0 ? (
        <div className="text-center p-6">查無結果</div>
      ) : (
        <>
          {posts.map((article) => (
            <div
              className="border-b border-[var(--surface-border)] last:border-none"
              key={article._id}
            >
              <ArticleContent
                article={article}
                isPost={!article.post}
                postId={article.post ?? article._id}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default SearchPage;
