import { runAppleScript } from "run-applescript";
import { CapturedContext } from "./types";
import { getAppHandler } from "./app-handlers";

export async function getFrontmostAppContext(): Promise<CapturedContext> {
  const appName = await runAppleScript(`
    tell application "System Events"
      return name of first process whose frontmost is true
    end tell
  `);

  const handler = getAppHandler(appName);
  if (handler) {
    try {
      return await handler.getContext();
    } catch (err) {
      console.error(`Handler failed for ${appName}:`, err);
      return getGenericContext(appName);
    }
  }
  return getGenericContext(appName);
}

async function getGenericContext(appName: string): Promise<CapturedContext> {
  // Escape quotes in app name for AppleScript
  const escaped = appName.replace(/"/g, '\\"');
  try {
    const title = await runAppleScript(`
      tell application "System Events"
        tell process "${escaped}"
          return name of front window
        end tell
      end tell
    `);
    return { appName, title: title || appName, url: null, type: "generic" };
  } catch (err) {
    console.error(`Generic handler failed for ${appName}:`, err);
    return { appName, title: appName, url: null, type: "generic" };
  }
}

export function formatTitleWithEmoji(context: CapturedContext): string {
  const emoji: Record<CapturedContext["type"], string> = {
    browser: "🌐",
    email: "📧",
    file: "📁",
    note: "📝",
    message: "💬",
    generic: "📌",
  };
  return `${emoji[context.type]} ${context.title}`;
}
