# Things Quick Capture

A Raycast extension that replicates Things 3's "Quick Entry with Autofill" functionality. Captures the current URL/context from the frontmost application and creates a task in Things.

## Features

- Captures URLs from browsers (Safari, Chrome, Edge, Arc, Brave)
- Creates email links from Mail and Outlook
- Links to files and folders from Finder
- Links to Notes
- Captures context from Slack, Discord
- Configurable hotkey (recommended: Control+Option+Space)

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to load in Raycast
4. Assign hotkey Control+Option+Space to "Quick Capture to Things"

## Commands

### Quick Capture to Things

Opens a form pre-filled with context from the frontmost app. You can edit the title, add notes, choose when (Today/Evening/Someday), and add tags.

**Keyboard shortcuts in the form:**

- `Cmd+I` - Add to Inbox immediately
- `Cmd+T` - Add to Today immediately
- `Cmd+E` - Add to Evening immediately
- `Cmd+S` - Add to Someday immediately

### Quick Capture (Silent)

Instantly captures to Things without showing any UI. Uses your default preferences.

## Preferences

- **Default List**: Where tasks go by default (Inbox, Today, Evening, Someday)
- **Show Things Quick Entry**: Whether to open Things' Quick Entry window after capture
- **URL Placement**: Put captured URL in notes field or append to title

## Development

```bash
npm install
npm run dev      # Development mode with hot reload
npm run build    # Build for production
npm run lint     # Run linter
npm test         # Run tests
```

## Supported Applications

| App               | URL Support | Notes             |
| ----------------- | ----------- | ----------------- |
| Safari            | Yes         | Full URL + title  |
| Google Chrome     | Yes         | Full URL + title  |
| Microsoft Edge    | Yes         | Full URL + title  |
| Arc               | Yes         | Full URL + title  |
| Brave             | Yes         | Full URL + title  |
| Apple Mail        | Yes         | `message://` URL  |
| Microsoft Outlook | Yes         | `outlook://` URL  |
| Finder            | Yes         | `file://` URL     |
| Notes             | Yes         | `notes://` URL    |
| Slack             | No          | Window title only |
| VS Code           | No          | Window title only |
| Generic           | No          | Window title only |

## License

MIT
