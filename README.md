# Quick PDF Tools

A modern, responsive, browser-based PDF utility app for general use. Built with React, Vite, and Tailwind CSS.
All PDF processing happens locally in the browser, ensuring privacy and speed. No backend or database is required.

## Features

- **Merge PDF**: Combine multiple PDFs into a single document.
- **Image to PDF**: Convert JPG or PNG images into a PDF.
- **Rotate PDF**: Rotate all pages in a PDF document.
- **Delete Pages**: Remove specific pages from a PDF.
- **Extract Pages**: Create a new PDF containing only specific pages.
- **Compress PDF (Basic)**: Re-save your PDF to optimize its structure.
- **Preview PDF**: View your PDF document directly in the browser.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the dependencies:

```bash
npm install
```

### Running Locally (Development)

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

### Building for Production

To create an optimized production build, run:

```bash
npm run build
```

This will generate a `dist` folder containing static assets ready to be deployed.

## Deployment

Since this app is a purely client-side Single Page Application (SPA), it can be hosted on any static hosting service like Vercel, GitHub Pages, or Netlify.

### Deploying to Vercel

1. Install the Vercel CLI or log in to the Vercel Dashboard.
2. If using the CLI, run:
   ```bash
   vercel
   ```
3. Follow the prompts. Vercel will automatically detect that it's a Vite project and use `npm run build` and the `dist` output folder.

### Deploying to GitHub Pages

1. Install `gh-pages` package (optional but recommended for easy deployment):
   ```bash
   npm install --save-dev gh-pages
   ```
2. In `vite.config.ts`, set the `base` path to your repository name (e.g., `base: '/your-repo-name/',`).
3. Add a deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`.

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pdf-lib](https://pdf-lib.js.org/) (For PDF manipulation)
- [react-pdf](https://projects.wojtekmaj.pl/react-pdf/) (For PDF preview)
- [Lucide React](https://lucide.dev/) (For icons)
