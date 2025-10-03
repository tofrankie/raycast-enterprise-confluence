import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { memo } from "react";

interface EmptyStateProps {
  currentCQL?: string;
}

export const EmptyState = memo<EmptyStateProps>(({ currentCQL }) => {
  return (
    <List.EmptyView
      icon={Icon.MagnifyingGlass}
      title="No Results"
      description="Try adjusting your search filters or check your CQL syntax"
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            icon={Icon.Book}
            title="Open CQL Documentation"
            url="https://developer.atlassian.com/server/confluence/rest/v1010/intro/#advanced-searching-using-cql"
          />
          {currentCQL && <Action.CopyToClipboard title="Copy CQL" content={currentCQL} />}
        </ActionPanel>
      }
    />
  );
});
