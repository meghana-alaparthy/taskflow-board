# Taskflow Board

A kanban-style task board I built to keep track of my own side projects. I was tired of juggling to-dos across notes apps and sticky notes, so I made something simple: four columns, drag cards around, everything saved in the browser. No account, no backend, no setup beyond `npm install`.

## Features

- Four columns: Backlog, In Progress, Review, Done
- Drag and drop cards within a column to reorder, or across columns to change status
- Add, edit, and delete tasks from a modal form
- Labels (bug, feature, docs, chore) and priorities (low, medium, high)
- Due dates, with overdue tasks highlighted in red
- Search by title/description and filter by label
- Everything persists to localStorage — reload the page and your board is still there
- Ships with realistic seed tasks on first load so it doesn't open empty

## Quickstart

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To make a production build:

```bash
npm run build
```

## Project structure

```
src/
  App.jsx                # board state, drag handlers, modal + filter wiring
  main.jsx               # React entry point
  index.css              # all styling, plain CSS
  data/seed.js           # column/label definitions and first-run seed tasks
  hooks/useLocalStorage.js  # state hook that syncs to localStorage
  components/
    Board.jsx            # DndContext wrapper and the four columns
    Column.jsx           # droppable column with a sortable card list
    TaskCard.jsx         # the card itself + the drag-overlay ghost
    TaskModal.jsx        # add/edit form
    FilterBar.jsx        # search input and label filter
```

## How it works

Drag-and-drop is handled by dnd-kit. Moving a card within a column reorders the task array; hovering a card over a different column moves it there live, before you release the pointer. State lives in one `tasks` array in `App`, and the `useLocalStorage` hook writes it to localStorage on every change and reads it back on load — that's the entire persistence layer.

## Tech stack

- React 18 + Vite 5
- @dnd-kit for drag-and-drop
- Plain CSS, no component library

## License

MIT — see [LICENSE](LICENSE).
