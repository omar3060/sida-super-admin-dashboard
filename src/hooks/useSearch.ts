import { useState, useEffect, useCallback } from "react";
import { SearchResult, searchPages, getAllPages } from "@/utils/searchUtils";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allPages, setAllPages] = useState<SearchResult[]>([]);

  // Load all pages on mount
  useEffect(() => {
    setAllPages(getAllPages());
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;

      return (query: string) => {
        clearTimeout(timeoutId);

        if (!query.trim()) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);

        timeoutId = setTimeout(() => {
          const results = searchPages(query, allPages);
          setSearchResults(results);
          setIsSearching(false);
        }, 300); // 300ms debounce delay
      };
    })(),
    [allPages]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearchChange,
    clearSearch,
    allPages,
  };
};
