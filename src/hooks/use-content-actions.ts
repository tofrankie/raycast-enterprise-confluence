import { useEffect } from "react";
import { showFailureToast } from "@raycast/utils";
import { useToggleFavorite } from "./use-confluence-queries";

export function useContentActions() {
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = (contentId: string, isFavorited: boolean) => {
    toggleFavorite.mutate({ contentId, isFavorited });
  };

  useEffect(() => {
    if (toggleFavorite.isError && toggleFavorite.error) {
      showFailureToast(toggleFavorite.error, { title: "Failed to Update Favorite Status" });
    }
  }, [toggleFavorite.isError, toggleFavorite.error]);

  return {
    handleToggleFavorite,
    isTogglingFavorite: toggleFavorite.isPending,
  };
}
