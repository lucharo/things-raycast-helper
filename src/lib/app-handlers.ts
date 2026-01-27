import { runAppleScript } from "run-applescript";
import { CapturedContext } from "./types";

interface AppHandler {
  getContext: () => Promise<CapturedContext>;
}

const browserHandler = (appName: string): AppHandler => ({
  async getContext() {
    const result = await runAppleScript(`
      tell application "${appName}"
        set tabURL to URL of active tab of front window
        set tabTitle to title of active tab of front window
      end tell
      return tabTitle & "|||" & tabURL
    `);
    const [title, url] = result.split("|||");
    return { appName, title, url, type: "browser" };
  },
});

const safariHandler: AppHandler = {
  async getContext() {
    const result = await runAppleScript(`
      tell application "Safari"
        set docURL to URL of front document
        set docTitle to name of front document
      end tell
      return docTitle & "|||" & docURL
    `);
    const [title, url] = result.split("|||");
    return { appName: "Safari", title, url, type: "browser" };
  },
};

const mailHandler: AppHandler = {
  async getContext() {
    const result = await runAppleScript(`
      tell application "Mail"
        set theMessage to item 1 of (selection as list)
        set theSubject to subject of theMessage
        set theID to message id of theMessage
        set theURL to "message://%3c" & theID & "%3e"
      end tell
      return theSubject & "|||" & theURL
    `);
    const [title, url] = result.split("|||");
    return { appName: "Mail", title, url, type: "email" };
  },
};

const finderHandler: AppHandler = {
  async getContext() {
    const result = await runAppleScript(`
      tell application "Finder"
        set theSelection to selection as alias list
        if theSelection is not {} then
          set theFile to item 1 of theSelection
          set theName to name of theFile
          set theURL to URL of theFile
          return theName & "|||" & theURL
        else
          set folderName to name of front window
          set folderTarget to target of front window as alias
          set folderURL to URL of folderTarget
          return folderName & "|||" & folderURL
        end if
      end tell
    `);
    const [title, url] = result.split("|||");
    return { appName: "Finder", title, url, type: "file" };
  },
};

const notesHandler: AppHandler = {
  async getContext() {
    const result = await runAppleScript(`
      tell application "Notes"
        set theNote to selection
        if theNote is not {} then
          set theNote to item 1 of theNote
          set theName to name of theNote
          set theID to id of theNote
          set theURL to "notes://showNote?identifier=" & theID
          return theName & "|||" & theURL
        end if
      end tell
      return "|||"
    `);
    const [title, url] = result.split("|||");
    return { appName: "Notes", title: title || "Note", url: url || null, type: "note" };
  },
};

const handlers: Record<string, AppHandler> = {
  Safari: safariHandler,
  "Google Chrome": browserHandler("Google Chrome"),
  "Microsoft Edge": browserHandler("Microsoft Edge"),
  Arc: browserHandler("Arc"),
  "Brave Browser": browserHandler("Brave Browser"),
  Firefox: browserHandler("Firefox"),
  Mail: mailHandler,
  Finder: finderHandler,
  Notes: notesHandler,
};

export function getAppHandler(appName: string): AppHandler | null {
  return handlers[appName] || null;
}
