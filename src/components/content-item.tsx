import { memo } from "react";
import { ActionPanel, Action, Icon, List, Image } from "@raycast/api";
import { getContentIcon, getContentTypeLabel } from "../utils";
import { CONFLUENCE_CONTENT_TYPE, CONFLUENCE_AVATAR_DIR } from "../constants";
import type { ConfluenceContentType, ProcessedConfluenceSearchContentResult } from "../types";

interface ContentItemProps {
  item: ProcessedConfluenceSearchContentResult;
  onToggleFavorite: (contentId: string, isFavorited: boolean) => void;
  currentCQL?: string;
}

export const ContentItem = memo<ContentItemProps>(({ item, onToggleFavorite, currentCQL }) => {
  const icon = getContentIcon(item.type as ConfluenceContentType);
  const contentTypeLabel = getContentTypeLabel(item.type as ConfluenceContentType);

  const {
    contentUrl,
    editUrl,
    spaceUrl,
    creatorAvatarUrl,
    updatedAt,
    createdAt,
    isSingleVersion,
    isFavourited,
    favouritedAt,
  } = item;
  const spaceName = item.space?.name || "";
  const creator = item.history.createdBy.displayName;
  const updater = item.history.lastUpdated.by.displayName;

  const creatorAvatar = CONFLUENCE_AVATAR_DIR
    ? `${CONFLUENCE_AVATAR_DIR}/${item.history.createdBy.userKey}.png`
    : creatorAvatarUrl;

  const accessories = [
    ...(isFavourited
      ? [
          {
            icon: Icon.Star,
            tooltip: `Favourited at ${favouritedAt ? new Date(favouritedAt).toLocaleString() : ""}`,
          },
        ]
      : []),
    {
      date: updatedAt,
      tooltip: isSingleVersion
        ? `Created at ${createdAt.toLocaleString()} by ${creator}`
        : `Updated at ${updatedAt.toLocaleString()} by ${updater}\nCreated at ${createdAt.toLocaleString()} by ${creator}`,
    },
    ...(creatorAvatar
      ? [
          {
            icon: { source: creatorAvatar, mask: Image.Mask.Circle },
            tooltip: `Created by ${creator}`,
          },
        ]
      : []),
  ];

  return (
    <List.Item
      key={item.id}
      icon={{ ...icon, tooltip: contentTypeLabel }}
      title={item.title}
      subtitle={{ value: item.space.name, tooltip: `Space: ${item.space.name}` }}
      accessories={accessories}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={contentUrl} />
          {item.type !== CONFLUENCE_CONTENT_TYPE.ATTACHMENT && (
            <Action.OpenInBrowser icon={Icon.Pencil} title="Edit in Browser" url={editUrl} />
          )}
          <Action.CopyToClipboard
            title="Copy Link"
            content={contentUrl}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
          {item.type !== CONFLUENCE_CONTENT_TYPE.ATTACHMENT && (
            <Action
              icon={isFavourited ? Icon.StarDisabled : Icon.Star}
              title={isFavourited ? "Remove from Favorites" : "Add to Favorites"}
              onAction={() => onToggleFavorite(item.id, isFavourited)}
              shortcut={{ modifiers: ["cmd"], key: "f" }}
            />
          )}
          {spaceUrl && (
            <Action.OpenInBrowser
              icon={Icon.House}
              title={`Open Space Homepage${spaceName ? ` (${spaceName})` : ""}`}
              url={spaceUrl}
            />
          )}
          {currentCQL && <Action.CopyToClipboard title="Copy CQL" content={currentCQL} />}
        </ActionPanel>
      }
    />
  );
});
