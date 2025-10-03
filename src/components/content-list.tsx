import { memo, useMemo, useCallback } from "react";
import { ContentItem } from "./content-item";
import { EmptyState } from "./empty-state";
import { CQLWrapper } from "./cql-wrapper";
import type { ProcessedConfluenceSearchContentResult } from "../types";

interface ContentListProps {
  results: ProcessedConfluenceSearchContentResult[];
  isLoading: boolean;
  searchText: string;
  currentCQL?: string;
  onToggleFavorite: (contentId: string, isFavorited: boolean) => void;
}

export const ContentList = memo<ContentListProps>(
  ({ results, isLoading, searchText, currentCQL, onToggleFavorite }) => {
    const showEmptyState = useMemo(
      () => results.length === 0 && !isLoading && searchText.length >= 2,
      [results.length, isLoading, searchText.length],
    );

    const renderContentItems = useCallback(() => {
      return results.map((item) => (
        <ContentItem key={item.id} item={item} onToggleFavorite={onToggleFavorite} currentCQL={currentCQL} />
      ));
    }, [results, onToggleFavorite, currentCQL]);

    return (
      <CQLWrapper query={searchText}>
        {showEmptyState ? <EmptyState currentCQL={currentCQL} /> : renderContentItems()}
      </CQLWrapper>
    );
  },
);
