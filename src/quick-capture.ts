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
import { buildThingsUrl } from "./lib/things-url";
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

    const notes =
      preferences.urlInNotes === "notes" ? context.url || undefined : undefined;

    const url = buildThingsUrl({
      title,
      notes,
      when:
        preferences.defaultList === "inbox"
          ? undefined
          : preferences.defaultList,
      showQuickEntry: true,
    });

    await closeMainWindow({ popToRootType: PopToRootType.Suspended });

    // Small delay to let Raycast fully close
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use AppleScript to open URL - may handle focus better
    const escaped = url.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    await runAppleScript(`open location "${escaped}"`);
  } catch (error) {
    await showHUD(`Failed: ${String(error)}`);
  }
}
