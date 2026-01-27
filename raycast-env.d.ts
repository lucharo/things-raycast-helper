/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Default List - Where to save tasks by default */
  "defaultList": "inbox" | "today" | "evening" | "someday",
  /** Show Things Quick Entry - Open Things Quick Entry window after capture */
  "showQuickEntry": boolean,
  /** URL Placement - Where to put the captured URL */
  "urlInNotes": "notes" | "title"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `quick-capture` command */
  export type QuickCapture = ExtensionPreferences & {}
  /** Preferences accessible in the `quick-capture-silent` command */
  export type QuickCaptureSilent = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `quick-capture` command */
  export type QuickCapture = {}
  /** Arguments passed to the `quick-capture-silent` command */
  export type QuickCaptureSilent = {}
}

