# Advisor Explorer

Interactive React dashboard for comparing Tsinghua and Peking University computer architecture research directions, advisors, job-market trade-offs, and personalized direction matches.

## Stack

- Vite
- React
- Tailwind CSS v4

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

The app is configured with `base: '/advisor-explorer/'` for GitHub Pages deployment.

## Project Structure

```text
src/
  components/   UI sections and reusable cards
  data/         JSON data for advisors, directions, and quiz rules
  hooks/        scroll animation behavior
```

## Interaction Notes

- The main content tabs support mouse and keyboard navigation.
- Use Left/Right, Home, and End while focused on the tab list to switch panels.
- Direction rows can be expanded with click, Enter, or Space.
- Direction comparison and quiz panels are lazy-loaded after their tabs are opened.

## Verification

Before publishing changes, run:

```bash
npm run lint
npm run build
```
