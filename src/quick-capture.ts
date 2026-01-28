import {
  showHUD,
  getPreferenceValues,
  closeMainWindow,
  PopToRootType,
} from "@raycast/api";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  getFrontmostAppContext,
  formatTitleWithEmoji,
} from "./lib/frontmost-app";
import { buildThingsUrl } from "./lib/things-url";
import { Preferences } from "./lib/types";

const execFileAsync = promisify(execFile);

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
    // Use execFile to avoid shell interpretation of special characters
    await execFileAsync("open", [url]);
  } catch (error) {
    await showHUD(`Failed: ${String(error)}`);
  }
}
