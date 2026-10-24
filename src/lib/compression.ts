import { PDFDocument } from "pdf-lib";
import { pdfjs } from "./pdfWorker";

export const presets = {
  small: { dpi: 160, quality: 0.82 },
  medium: { dpi: 120, quality: 0.65 },
  high: { dpi: 85, quality: 0.42 },
} as const;
export type CompressionPreset = keyof typeof presets;
export type CompressionResult = {
  blob: Blob;
  method: "original" | "structure" | "image";
  pages: number;
};

export async function compressPdf(
  file: File,
  preset: CompressionPreset,
  onProgress: (page: number, total: number) => void,
  signal?: AbortSignal,
): Promise<CompressionResult> {
  const check = () => {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  };
  check();
  const source = new Uint8Array(await file.arrayBuffer());
  const document = await PDFDocument.load(source, { updateMetadata: false });
  check();
  const pages = document.getPageCount();
  if (!pages) throw new Error("EMPTY_PDF");
  // Keep the original as a candidate: never return a larger file.
  let best: CompressionResult = { blob: file, method: "original", pages };
  const structured = await document.save({
    useObjectStreams: true,
    updateFieldAppearances: false,
  });
  if (structured.byteLength < best.blob.size)
    best = {
      blob: new Blob([new Uint8Array(structured).buffer], {
        type: "application/pdf",
      }),
      method: "structure",
      pages,
    };
  check();
  const task = pdfjs.getDocument({ data: source.slice() });
  const abort = () => {
    void task.destroy();
  };
  signal?.addEventListener("abort", abort, { once: true });
  try {
    const input = await task.promise;
    const output = await PDFDocument.create();
    const { dpi, quality } = presets[preset];
    for (let i = 1; i <= input.numPages; i++) {
      check();
      onProgress(i, input.numPages);
      const page = await input.getPage(i);
      const original = page.getViewport({ scale: 1 });
      // Limit canvas memory to 8 megapixels / 4096px per side on large pages.
      const scale = Math.min(
        dpi / 72,
        4096 / original.width,
        4096 / original.height,
        Math.sqrt(8_000_000 / (original.width * original.height)),
      );
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      try {
        const context = canvas.getContext("2d");
        if (!context) throw new Error("CANVAS_FAILED");
        await page.render({
          canvasContext: context,
          canvas,
          viewport,
          background: "rgb(255,255,255)",
        }).promise;
        check();
        const jpeg = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("JPEG_FAILED"))),
            "image/jpeg",
            quality,
          ),
        );
        const image = await output.embedJpg(await jpeg.arrayBuffer());
        // DPI affects image resolution only, never physical page dimensions.
        output.addPage([original.width, original.height]).drawImage(image, {
          x: 0,
          y: 0,
          width: original.width,
          height: original.height,
        });
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    check();
    const bytes = await output.save({ useObjectStreams: true });
    if (bytes.byteLength < best.blob.size)
      best = {
        blob: new Blob([new Uint8Array(bytes).buffer], {
          type: "application/pdf",
        }),
        method: "image",
        pages,
      };
    return best;
  } finally {
    signal?.removeEventListener("abort", abort);
    await task.destroy();
  }
}
