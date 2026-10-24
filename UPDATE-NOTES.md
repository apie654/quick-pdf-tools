# Quick PDF compression levels

The compression tool offers three levels, from lightest to strongest:

| Level | Compression | Rendering | JPEG quality |
| --- | --- | --- | --- |
| Small | Minimum; prioritise clarity | 160 DPI | 82% |
| Medium | Moderate; selected by default | 120 DPI | 65% |
| High | Maximum; prioritise smaller files | 85 DPI | 42% |

Each level recompresses scanned pages and images. Original physical page sizes are preserved. Pages become images, so searchable/selectable text, interactive forms, hyperlinks and digital signatures are not preserved. Smaller text can be less clear with High. Savings depend on the source PDF; the smallest of the original, structure-optimised and image-based candidates is returned.

Results identify the selected level. If there is no reduction, Small offers a shortcut to Medium and Medium offers a shortcut to High, with settings shown before the next compression run.

Validation: production build, TypeScript and browser selection/result checks. Compression levels were also exercised against the seven-page uploaded PDF using the application's compression function with a Node canvas adapter.

The remaining eight PDF tools, English/BM support and light/dark themes are retained. PDF.js and its matching worker are bundled locally.

Install with `npm ci`, then build with `npm run build`. Existing Vercel settings can remain unchanged.
