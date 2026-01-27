import { runAppleScript } from "run-applescript";
import { CapturedContext, SupportedApp } from "./types";

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

const outlookHandler: AppHandler = {
  async getContext() {
    const result = await runAppleScript(`
      tell application "Microsoft Outlook"
        set selMessages to selected objects
        if selMessages is not {} then
          set theMessage to item 1 of selMessages
          set theSubject to subject of theMessage
          set theID to id of theMessage
          set theURL to "outlook://open?id=" & theID
          return theSubject & "|||" & theURL
        end if
      end tell
      return "|||"
    `);

    const [title, url] = result.split("|||");
    return {
      appName: "Microsoft Outlook",
      title: title || "Outlook Email",
      url: url || null,
      type: "email",
    };
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
          -- Extract just the identifier part
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

const slackHandler: AppHandler = {
  async getContext() {
    const title = await runAppleScript(`
      tell application "System Events"
        tell process "Slack"
          set windowTitle to name of front window
        end tell
      end tell
      return windowTitle
    `);

    return { appName: "Slack", title, url: null, type: "message" };
  },
};

const vscodeHandler = (appName: string): AppHandler => ({
  async getContext() {
    const result = await runAppleScript(`
      tell application "System Events"
        tell process "${appName}"
          set windowTitle to name of front window
        end tell
      end tell
      return windowTitle
    `);

    // VS Code window title format: "filename — foldername"
    // Try to extract file path
    const url: string | null = null;
    const title = result;

    return { appName, title, url, type: "file" };
  },
});

const linearHandler: AppHandler = {
  async getContext() {
    // Linear shows issue ID in window title
    const title = await runAppleScript(`
      tell application "System Events"
        tell process "Linear"
          set windowTitle to name of front window
        end tell
      end tell
      return windowTitle
    `);

    return { appName: "Linear", title, url: null, type: "generic" };
  },
};

const handlers: Partial<Record<SupportedApp, AppHandler>> = {
  Safari: safariHandler,
  "Google Chrome": browserHandler("Google Chrome"),
  "Microsoft Edge": browserHandler("Microsoft Edge"),
  Arc: browserHandler("Arc"),
  "Brave Browser": browserHandler("Brave Browser"),
  Mail: mailHandler,
  "Microsoft Outlook": outlookHandler,
  Finder: finderHandler,
  Notes: notesHandler,
  Slack: slackHandler,
  "VS Code": vscodeHandler("Code"),
  Cursor: vscodeHandler("Cursor"),
  Linear: linearHandler,
};

export function getAppHandler(appName: SupportedApp): AppHandler | null {
  return handlers[appName] || null;
}

export function getSupportedApps(): SupportedApp[] {
  return Object.keys(handlers) as SupportedApp[];
}
