# Quick PDF redesign and compression update

## Changes
- Minimal neutral design with a green accent, responsive cards, English/BM, and light/dark themes.
- All nine existing tools retained.
- Four compression presets: Keep text, Balanced, Smallest size, Higher clarity.
- Enable compressed object streams for text-preserving optimisation.
- For image modes, compare original, structure-optimised and rasterised PDFs; return the smallest.
- Preserve physical page dimensions independently of rendering DPI.
- Bound canvas size and release resources after each page; stop on navigation.
- Bundle the matching PDF.js worker locally instead of fetching it from a CDN.
- Show honest results when a PDF cannot be reduced; preserve original filename if returning original.

## Validation
- Production build and TypeScript check passed.
- Browser checks: English/BM, light/dark, text and scanned PDF workflows.
- Two-page mixed portrait/landscape digital PDF: 4,689 -> 2,661 bytes; searchable text and page dimensions verified.
- Compact PDF: original returned, 2,661 bytes, no size increase.
- Generated scanned test PDF: 1,527,509 bytes -> 247,919 (Balanced), 102,021 (Smallest), 568,359 (Higher clarity).
- Generated outputs reopened and dimensions checked; Balanced sample rendered and visually inspected.
- Invalid PDF rejected.
- Cloud-browser download capture timed out; downloaded-file delivery could not be verified in that environment. Generated Blob contents were independently reopened and validated.

Image modes turn pages into JPEG images; text selection/search, forms, hyperlinks and digital signatures are not preserved. Reduction depends on the source document. Re-saving signed PDFs can invalidate signatures even in Keep text mode.

## Use
Replace the project source with this package, then run `npm ci` and `npm run build`. Existing Vercel deployment settings can remain unchanged. No backend is required.
