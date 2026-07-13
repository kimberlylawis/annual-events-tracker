# Annual Events Tracker

A lightweight, no-build web app for tracking events that recur every year — company anniversaries, holidays, team milestones, and more. All data is stored locally in your browser (`localStorage`); nothing is sent to a server.

## Features

- Add, edit, and delete yearly events with a name, date (month/day), category, and notes.
- Optional "origin year" (e.g. the year a company was founded) to automatically show an anniversary count like "11th anniversary".
- Live countdown showing how many days remain until each event's next occurrence.
- Color-coded categories for quick visual scanning.
- **Export to JSON** — download all your events as a single file for backup.
- **Import from JSON** — load an exported file to restore your data or move it to another browser/workstation.

## Running locally

No build step or dependencies are required.

1. Clone or download this repository.
2. Open `index.html` directly in your browser, **or** serve the folder with any static file server, e.g.:
   ```
   npx serve .
   ```
3. Start adding events. Everything is saved automatically to your browser's local storage.

## Exporting and importing data

- Click **Export JSON** to download a timestamped `.json` file containing all your events.
- Click **Import JSON** and choose a previously exported file to add those events to your current list (existing events are kept; imported events are merged in with new IDs).
- This makes it easy to back up your data or move it to a different computer or browser profile — just export from one and import into the other.

## Deploying to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included and will automatically publish this site to GitHub Pages on every push to `main`. To enable it:

1. Push this repository to GitHub.
2. In the repo settings, go to **Pages** and set the source to **GitHub Actions**.
3. Push to `main` — the site will build and deploy automatically.

## Data & privacy

All event data lives only in your browser's `localStorage` under the key `annualEventsTracker.events`. Clearing your browser data will remove it, so export a backup periodically if the data matters to you.

## License

MIT — see [LICENSE](LICENSE).
