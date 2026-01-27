import { runAppleScript } from "run-applescript";
import { CapturedContext } from "./types";
import { getAppHandler } from "./app-handlers";

export async function getFrontmostAppContext(): Promise<CapturedContext> {
  const appName = await runAppleScript(`
    tell application "System Events"
      set frontApp to name of first process whose frontmost is true
    end tell
    return frontApp
  `);

  const handler = getAppHandler(appName);
  if (handler) {
    try {
      return await handler.getContext();
    } catch {
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
    return { appName, title: title || appName, url: null, type: "generic" };
  } catch {
    return { appName, title: appName, url: null, type: "generic" };
  }
}

export function formatTitleWithEmoji(context: CapturedContext): string {
  const emoji: Record<CapturedContext["type"], string> = {
    browser: "🌐",
    email: "📧",
    file: "📁",
    note: "📝",
    generic: "📌",
  };
  return `${emoji[context.type]} ${context.title}`;
}
