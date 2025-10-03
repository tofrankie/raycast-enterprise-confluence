import type { ConfluenceSearchContentResult, ProcessedFields } from "../types";

export function processContentItem(item: ConfluenceSearchContentResult, baseUrl: string): ProcessedFields {
  // Note: This link format is not valid for attachment type.
  // Alternative: `${baseUrl}/pages/viewpage.action?pageId=${item.id}`
  const contentUrl = `${baseUrl}${item._links.webui}`;
  const editUrl = `${baseUrl}/pages/editpage.action?pageId=${item.id}`;
  const spaceUrl = `${baseUrl}${item.space._links.webui}`;
  const creatorAvatarUrl = `${baseUrl}${item.history.createdBy.profilePicture.path}`;

  const createdAt = new Date(item.history.createdDate);
  const updatedAt = new Date(item.history.lastUpdated.when);

  const isSingleVersion = item.history.lastUpdated?.when === item.history.createdDate;
  const isFavourited = item.metadata.currentuser.favourited?.isFavourite ?? false;
  const favouritedAt = item.metadata.currentuser.favourited?.favouritedDate
    ? new Date(item.metadata.currentuser.favourited.favouritedDate).toISOString()
    : null;

  return {
    contentUrl,
    editUrl,
    spaceUrl,
    creatorAvatarUrl,
    createdAt,
    updatedAt,
    isSingleVersion,
    isFavourited,
    favouritedAt,
  };
}

export function processContentItems(items: ConfluenceSearchContentResult[], baseUrl: string) {
  return items.map((item) => ({
    ...item,
    ...processContentItem(item, baseUrl),
  }));
}
