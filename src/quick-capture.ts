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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();

  try {
    // 1. Get context while Raycast is still open
    const context = await getFrontmostAppContext();

    if (!context.title) {
      await showHUD("No context to capture");
      return;
    }

    // 2. Build the data
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

    // 3. Delay to let browser focus settle after AppleScript query
    await sleep(150);

    // 4. Close Raycast
    await closeMainWindow({ popToRootType: PopToRootType.Suspended });

    // 5. Another delay
    await sleep(100);

    // 6. Double-activate pattern with System Events to force focus
    await runAppleScript(`
      tell application "Things3"
        activate
      end tell

      delay 0.2

      tell application "Things3"
        activate
        show quick entry panel with properties {name:"${escTitle}", notes:"${escNotes}"}
      end tell

      delay 0.1

      tell application "System Events"
        tell process "Things3"
          set frontmost to true
        end tell
      end tell
    `);
  } catch (error) {
    await showHUD(`Failed: ${String(error)}`);
  }
}
