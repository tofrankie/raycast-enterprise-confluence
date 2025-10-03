import { List } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useState, useEffect, memo } from "react";
import { QueryProvider } from "./query-client";
import { ConfluencePreferencesProvider, useConfluencePreferencesContext } from "./contexts";
import { useContentList, useContentActions, useSearchFilters, useAvatarList } from "./hooks";
import { writeToSupportPathFile, initializeRegistries } from "./utils";
import { SearchFilters, ContentList } from "./components";

export default function ConfluenceSearchContentProvider() {
  useEffect(() => {
    initializeRegistries();
  }, []);

  return (
    <ConfluencePreferencesProvider>
      <QueryProvider>
        <ConfluenceSearchContent />
      </QueryProvider>
    </ConfluencePreferencesProvider>
  );
}

const ConfluenceSearchContent = memo(function ConfluenceSearchContent() {
  const [searchText, setSearchText] = useState("");
  const { filters, setFilters } = useSearchFilters();
  const { searchPageSize, displayRecentlyViewed } = useConfluencePreferencesContext();
  const { handleToggleFavorite } = useContentActions();

  const { results, hasMore, currentCQL, isLoading, isError, error, handleLoadMore } = useContentList({
    searchText,
    filters,
    displayRecentlyViewed,
    searchPageSize,
  });

  useAvatarList(results);

  useEffect(() => {
    if (isError && error) {
      showFailureToast(error, { title: "Search Failed" });
    }
  }, [isError, error]);

  // TODO: 调试
  useEffect(() => {
    if (results.length > 0) {
      writeToSupportPathFile(JSON.stringify(results[0], null, 2), "temp.json");
    }
  }, [results]);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Content..."
      searchBarAccessory={<SearchFilters filters={filters} onFiltersChange={setFilters} />}
      pagination={{
        onLoadMore: handleLoadMore,
        hasMore: hasMore,
        pageSize: searchPageSize,
      }}
      throttle
    >
      <ContentList
        results={results}
        isLoading={isLoading}
        searchText={searchText}
        currentCQL={currentCQL}
        onToggleFavorite={handleToggleFavorite}
      />
    </List>
  );
});
