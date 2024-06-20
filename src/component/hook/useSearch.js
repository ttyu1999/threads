import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const useSearch = (initialQuery, initialResults, setPosts) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && initialResults.length > 0) {
      setPosts(initialResults);
      setHasInitialized(true);
    } else if (!hasInitialized) {
      setPosts([]);
      setHasInitialized(true);
    }
  }, [initialResults, setPosts, hasInitialized]);

  const handleSearch = async () => {
    try {
      const keywords = searchQuery.split(" ");
      const queryString = keywords.join(" ");
      const response = await axios.get(
        `https://social-media-api-demo.fly.dev/api/search?query=${queryString}`
      );
      const { posts, comments } = response.data;
      const combinedResults = [...posts, ...comments];
      setPosts(combinedResults);

      navigate(location.pathname, {
        state: { searchQuery, searchResults: combinedResults },
      });
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleKeyDown,
  };
};
