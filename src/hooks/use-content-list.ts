import { useState, useEffect, useMemo, useCallback } from "react";
import { useConfluenceSearchContent } from "./use-confluence-queries";
import { buildCQL } from "../utils";
import { useConfluencePreferencesContext } from "../contexts";
import type { ProcessedConfluenceSearchContentResult } from "../types";

interface UseContentListProps {
  searchText: string;
  filters: string[];
  displayRecentlyViewed: boolean;
  searchPageSize: number;
}

export function useContentList({ searchText, filters, displayRecentlyViewed, searchPageSize }: UseContentListProps) {
  const [allResults, setAllResults] = useState<ProcessedConfluenceSearchContentResult[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { baseUrl } = useConfluencePreferencesContext();

  const currentCQL = useMemo(() => {
    if (!searchText && displayRecentlyViewed) {
      return `id in recentlyViewedContent(${searchPageSize}, 0)`;
    }
    if (!searchText || searchText.length < 2) {
      return "";
    }
    return buildCQL(searchText, filters);
  }, [searchText, filters, displayRecentlyViewed, searchPageSize]);

  const { data, fetchNextPage, isFetchingNextPage, isLoading, error, isError } = useConfluenceSearchContent(
    currentCQL,
    searchPageSize,
    baseUrl,
  );

  const results = useMemo(() => data?.pages.flatMap((page) => page.processedResults) ?? [], [data]);

  useEffect(() => {
    setAllResults([]);
    setHasMore(true);
  }, [searchText, filters]);

  useEffect(() => {
    if (data?.pages) {
      const latestPage = data.pages[data.pages.length - 1];
      if (latestPage) {
        // 更新 hasMore 状态
        const hasNextLink = !!latestPage._links?.next;
        const hasMoreBySize = latestPage.size === searchPageSize;
        setHasMore(hasNextLink || hasMoreBySize);

        // 更新所有结果
        const newResults = data.pages.flatMap((page) => page.processedResults);
        setAllResults(newResults);
      }
    }
  }, [data, searchPageSize]);

  // 分页处理函数
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasMore, isFetchingNextPage, fetchNextPage]);

  return {
    results,
    allResults,
    hasMore,
    currentCQL,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    handleLoadMore,
  };
}
