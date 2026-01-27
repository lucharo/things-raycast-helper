import { closeMainWindow, showHUD, getPreferenceValues, open } from "@raycast/api";
import { getFrontmostAppContext, formatTitleWithEmoji } from "./lib/frontmost-app";
import { buildThingsUrl } from "./lib/things-url";

interface Preferences {
  defaultList: "inbox" | "today" | "evening" | "someday";
  showQuickEntry: boolean;
  urlInNotes: "notes" | "title";
}

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();

  try {
    const context = await getFrontmostAppContext();
    const formattedTitle = formatTitleWithEmoji(context);

    let title: string;
    let notes: string | undefined;

    if (preferences.urlInNotes === "notes") {
      title = formattedTitle;
      notes = context.url || undefined;
    } else {
      title = context.url ? `${formattedTitle} - ${context.url}` : formattedTitle;
    }

    const url = buildThingsUrl({
      title,
      notes,
      when: preferences.defaultList === "inbox" ? undefined : preferences.defaultList,
      showQuickEntry: preferences.showQuickEntry,
    });

    await closeMainWindow();
    await open(url);
    await showHUD(`✓ Added: ${context.title}`);
  } catch (error) {
    await showHUD(`✗ Failed: ${String(error)}`);
  }
}
