export interface CapturedContext {
  appName: string;
  title: string;
  url: string | null;
  type: "browser" | "email" | "file" | "note" | "message" | "generic";
}

export interface ThingsTaskParams {
  title: string;
  notes?: string;
  when?: "today" | "evening" | "tomorrow" | "someday" | string; // string for specific date
  deadline?: string;
  tags?: string[];
  listId?: string; // project or area ID
  list?: string; // project or area name
  heading?: string;
  completed?: boolean;
  canceled?: boolean;
  showQuickEntry?: boolean;
  revealInList?: boolean;
}

export type SupportedApp =
  | "Safari"
  | "Google Chrome"
  | "Microsoft Edge"
  | "Arc"
  | "Brave Browser"
  | "Firefox"
  | "Mail"
  | "Microsoft Outlook"
  | "Finder"
  | "Notes"
  | "Slack"
  | "Discord"
  | "Notion"
  | "Linear"
  | "Figma"
  | "VS Code"
  | "Cursor";
