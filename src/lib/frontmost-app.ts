import { runAppleScript } from "run-applescript";
import { CapturedContext, SupportedApp } from "./types";
import { getAppHandler } from "./app-handlers";

export async function getFrontmostAppContext(): Promise<CapturedContext> {
  // First, get the frontmost app name
  const appName = await runAppleScript(`
    tell application "System Events"
      set frontApp to name of first process whose frontmost is true
    end tell
    return frontApp
  `);

  const handler = getAppHandler(appName as SupportedApp);

  if (handler) {
    try {
      return await handler.getContext();
    } catch (error) {
      // Fall back to generic handler
      return getGenericContext(appName);
    }
  }

  return getGenericContext(appName);
}

async function getGenericContext(appName: string): Promise<CapturedContext> {
  try {
    const title = await runAppleScript(`
      tell application "System Events"
        tell process "${appName}"
          set windowTitle to name of front window
        end tell
      end tell
      return windowTitle
    `);

    return {
      appName,
      title: title || appName,
      url: null,
      type: "generic",
    };
  } catch {
    return {
      appName,
      title: appName,
      url: null,
      type: "generic",
    };
  }
}

export function formatTitleWithEmoji(context: CapturedContext): string {
  const emojiMap: Record<CapturedContext["type"], string> = {
    browser: "🌐",
    email: "📧",
    file: "📁",
    note: "📝",
    message: "💬",
    generic: "📌",
  };

  return `${emojiMap[context.type]} ${context.title}`;
}
