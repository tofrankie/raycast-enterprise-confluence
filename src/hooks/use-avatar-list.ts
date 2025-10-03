import { useMemo } from "react";
import { useAvatar } from "./use-avatar";
import { AVATAR_TYPES } from "../constants";
import type { ProcessedConfluenceSearchContentResult } from "../types";

export function useAvatarList(results: ProcessedConfluenceSearchContentResult[]) {
  const avatarList = useMemo(() => {
    const userMap = new Map<string, { url: string; filename: string }>();

    results.forEach((item) => {
      const userKey = item.history.createdBy.userKey;
      if (!userMap.has(userKey)) {
        const avatarUrl = item.creatorAvatarUrl;
        if (avatarUrl) {
          userMap.set(userKey, {
            url: avatarUrl,
            filename: userKey,
          });
        }
      }
    });

    return Array.from(userMap.values());
  }, [results]);

  useAvatar(avatarList, AVATAR_TYPES.CONFLUENCE);
}
