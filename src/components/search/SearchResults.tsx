import React from "react";
import Link from "next/link";
import { SearchResult } from "@/utils/searchUtils";

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: () => void;
  isVisible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onResultClick,
  isVisible,
}) => {
  if (!isVisible || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results-dropdown">
      <div className="search-results-list">
        {results.map((result, index) => (
          <Link
            key={`${result.link}-${index}`}
            href={result.link}
            className="search-result-item"
            onClick={onResultClick}
          >
            <div className="search-result-content">
              {result.icon && (
                <div className="search-result-icon">
                  <i className={`ti ti-${result.icon}`} />
                </div>
              )}
              <div className="search-result-details">
                <div className="search-result-label">{result.label}</div>
                {result.category && (
                  <div className="search-result-category">
                    {result.category}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
