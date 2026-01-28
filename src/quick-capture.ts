import {
  showHUD,
  getPreferenceValues,
  closeMainWindow,
  PopToRootType,
} from "@raycast/api";
import { runAppleScript } from "run-applescript";
import {
  getFrontmostAppContext,
  formatTitleWithEmoji,
} from "./lib/frontmost-app";
import { Preferences } from "./lib/types";

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();

  try {
    const context = await getFrontmostAppContext();

    if (!context.title) {
      await showHUD("No context to capture");
      return;
    }

    const formattedTitle = formatTitleWithEmoji(context);

    const title =
      preferences.urlInNotes === "notes"
        ? formattedTitle
        : context.url
          ? `${formattedTitle} - ${context.url}`
          : formattedTitle;

    const notes = preferences.urlInNotes === "notes" ? context.url || "" : "";

    // Escape for AppleScript
    const escTitle = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const escNotes = notes.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    await closeMainWindow({ popToRootType: PopToRootType.Suspended });

    // Use Things native AppleScript to show quick entry panel
    await runAppleScript(`
      tell application "Things3"
        activate
        show quick entry panel with properties {name:"${escTitle}", notes:"${escNotes}"}
      end tell
    `);
  } catch (error) {
    await showHUD(`Failed: ${String(error)}`);
  }
}
