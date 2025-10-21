# MarkLee

MarkLee is a modern, fast, and minimal Markdown note editor built with Tauri, React, and Vite.  
It supports recursive folder browsing, live markdown preview, image viewing, and customizable UI preferences.

## Features

- 📝 Edit and preview Markdown, text, and CSV files
- 🖼️ View images (PNG, JPG, JPEG) inline
- 📂 Browse folders recursively and select files from a sidebar
- 💾 Remembers last opened folder and UI preferences (sidebar, preview mode)
- ⚡ Fast startup and native performance via Tauri
- 🎨 Styled with Tailwind CSS and Typography plugin
- 🖱️ Keyboard shortcuts and menu integration (toggle preview, sidebar, open folder, etc.)

## Usage

- Select a folder to browse your notes and images
- Click files in the sidebar to view or edit
- Use **Ctrl+E** to toggle between edit and preview modes
- Use the menu or keyboard shortcuts for quick actions

## Development

- Built with [Tauri](https://tauri.app/), [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- Uses [marked](https://github.com/markedjs/marked) for markdown rendering

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Getting Started

```bash
npm install
npm run tauri:dev
```

## License

MIT
