import React, { useEffect, useRef, useState } from "react";
import { FileUploader } from "../components/FileUploader";
import { Button } from "../components/ui/button";
import { formatBytes } from "../lib/utils";
import {
  CheckCircle2,
  Info,
  Download,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  compressPdf,
  CompressionPreset,
  CompressionResult,
} from "../lib/compression";

export function CompressPdf() {
  const { language, t } = useLanguage();
  const ms = language === "ms";
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPreset>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  useEffect(() => {
    if (!result) {
      setDownloadUrl("");
      return;
    }
    const url = URL.createObjectURL(result.blob);
    setDownloadUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const options: {
    id: CompressionPreset;
    title: string;
    desc: string;
    detail: string;
  }[] = [
    {
      id: "small",
      title: "Small",
      desc: ms
        ? "Compression minimum. Utamakan kejelasan tulisan dan butiran gambar."
        : "Minimum compression. Prioritises clear text and image detail.",
      detail: ms ? "Kualiti diutamakan" : "Quality first",
    },
    {
      id: "medium",
      title: "Medium",
      desc: ms
        ? "Compression sederhana. Seimbangkan saiz fail dengan kejelasan dokumen."
        : "Moderate compression. Balances file size and document clarity.",
      detail: ms
        ? "Disyorkan untuk kegunaan harian"
        : "Recommended for everyday use",
    },
    {
      id: "high",
      title: "High",
      desc: ms
        ? "Compression maksimum. Utamakan saiz kecil; tulisan halus mungkin kurang jelas."
        : "Maximum compression. Prioritises a smaller file; fine text may lose clarity.",
      detail: ms ? "Saiz fail diutamakan" : "File size first",
    },
  ];
  const selectedOption = options.find((option) => option.id === preset)!;
  const run = async () => {
    if (!file || busy) return;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    setError("");
    setProgress({ current: 0, total: 0 });
    try {
      const output = await compressPdf(
        file,
        preset,
        (current, total) => setProgress({ current, total }),
        abort.signal,
      );
      if (!abort.signal.aborted) setResult(output);
    } catch (err) {
      if (!abort.signal.aborted) {
        const name = err instanceof Error ? err.name : "";
        setError(
          name.includes("Password") || name.includes("Encrypted")
            ? ms
              ? "PDF dilindungi kata laluan. Buka kuncinya dahulu sebelum cuba lagi."
              : "This PDF is password protected. Unlock a copy before trying again."
            : ms
              ? "PDF tidak dapat diproses. Pastikan fail sah dan tidak dilindungi kata laluan, kemudian cuba lagi."
              : "Could not process this PDF. Check it is valid and unlocked, then try again.",
        );
      }
    } finally {
      if (!abort.signal.aborted) setBusy(false);
    }
  };
  const select = (files: File[]) => {
    setFile(files[0]);
    setResult(null);
    setError("");
  };
  const reduced = result && file ? result.blob.size < file.size : false;
  const saving = result && file ? (1 - result.blob.size / file.size) * 100 : 0;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-3">{t.compressPdf}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {ms
            ? "Pilih tahap compression: Small untuk minimum, Medium untuk sederhana, atau High untuk maksimum. Medium dipilih secara awal."
            : "Choose your compression level: Small for minimum, Medium for moderate, or High for maximum. Medium is selected by default."}
        </p>
      </div>
      {!file ? (
        <FileUploader onFileSelect={select} />
      ) : result ? (
        <section
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-9"
          aria-live="polite"
        >
          {reduced ? (
            <CheckCircle2 size={30} className="text-blue-600 mb-5" />
          ) : (
            <Info size={30} className="text-slate-500 mb-5" />
          )}
          <h2 className="text-2xl font-medium">
            {reduced
              ? ms
                ? "Lebih kecil. Sedia dikongsi."
                : "Smaller. Ready to share."
              : ms
                ? "Tiada pengurangan dengan tetapan ini."
                : "No reduction with these settings."}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            {!reduced
              ? ms
                ? "Tahap ini belum menghasilkan fail lebih kecil. Fail asal dikekalkan. Cuba tahap lebih tinggi jika ada."
                : "This level did not produce a smaller PDF. Your original is kept. Try a higher level if available."
              : result.method === "image"
                ? ms
                  ? "Halaman disimpan sebagai gambar. Semak kejelasan sebelum berkongsi."
                  : "Pages were saved as images. Check readability before sharing."
                : ms
                  ? "Struktur PDF dioptimumkan. Teks dan kualiti visual dikekalkan."
                  : "PDF structure optimised. Text and visual quality are preserved."}
          </p>
          <p className="text-xs text-blue-600 mt-4">
            {ms ? "Tahap digunakan" : "Level used"}:{" "}
            <strong>{selectedOption.title}</strong> · {selectedOption.detail}
          </p>
          <div className="result-stats">
            <div>
              <span>{ms ? "Saiz asal" : "Original"}</span>
              <strong>{formatBytes(file.size)}</strong>
            </div>
            <div>
              <span>{ms ? "Saiz akhir" : "Result"}</span>
              <strong>{formatBytes(result.blob.size)}</strong>
            </div>
            <div>
              <span>{ms ? "Pengurangan" : "Saved"}</span>
              <strong className="text-blue-600">
                {saving > 0 && saving < 0.1 ? "<0.1" : saving.toFixed(1)}%
              </strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={downloadUrl || undefined}
              download={
                reduced
                  ? file.name.replace(/\.pdf$/i, "") + "-compressed.pdf"
                  : file.name
              }
              className="inline-flex items-center justify-center rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white h-11 px-5"
            >
              <Download size={16} className="mr-2" />
              {ms ? "Muat turun PDF" : "Download PDF"}
            </a>
            {!reduced && preset !== "high" && (
              <Button
                variant="outline"
                onClick={() => {
                  setPreset(preset === "small" ? "medium" : "high");
                  setResult(null);
                }}
              >
                {ms ? "Cuba tahap " : "Try "}
                {preset === "small" ? "Medium" : "High"}
              </Button>
            )}
            <Button variant="outline" onClick={() => setResult(null)}>
              {ms ? "Cuba tetapan lain" : "Try other settings"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
            >
              {ms ? "Fail baharu" : "New file"}
            </Button>
          </div>
        </section>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
            <FileText size={22} className="text-blue-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium break-all">{file.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              disabled={busy}
              className="text-xs text-blue-600 disabled:opacity-40"
              onClick={() => {
                setFile(null);
                setError("");
              }}
            >
              {t.chooseAnother}
            </button>
          </div>
          <fieldset disabled={busy}>
            <legend className="text-sm font-medium mb-3">
              {ms ? "Tahap compression" : "Compression level"}
            </legend>
            <div
              className="compression-options"
              role="radiogroup"
              aria-label={ms ? "Tahap compression" : "Compression level"}
            >
              {options.map((option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={preset === option.id}
                  key={option.id}
                  className="compression-option"
                  onClick={() => setPreset(option.id)}
                >
                  <strong>{option.title}</strong>
                  <p>{option.desc}</p>
                  <small>{option.detail}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <p className="compression-notice">
            {ms
              ? "Compression mengurangkan resolusi dan kualiti imej. High memberi pengurangan paling kuat tetapi boleh mengurangkan kejelasan. Halaman menjadi gambar: teks tidak lagi boleh dicari atau dipilih; pautan, borang dan tandatangan digital tidak dikekalkan."
              : "Compression reduces image resolution and quality. High applies the strongest reduction but may reduce clarity. Pages become images: text will no longer be searchable or selectable; links, forms and digital signatures are not preserved."}
          </p>
          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 border border-red-200 rounded-lg p-4"
            >
              {error}
            </p>
          )}
          {busy && (
            <div
              role="status"
              aria-live="polite"
              className="text-sm text-slate-500"
            >
              <div className="flex gap-2 items-center">
                <LoaderCircle size={16} className="animate-spin" />
                {progress.total
                  ? `${ms ? "Memproses halaman" : "Processing page"} ${progress.current} / ${progress.total}`
                  : ms
                    ? "Menganalisis PDF…"
                    : "Analysing PDF…"}
              </div>
              {progress.total > 0 && (
                <progress
                  className="w-full mt-3 accent-blue-600"
                  value={progress.current}
                  max={progress.total}
                />
              )}
            </div>
          )}
          <Button disabled={busy} onClick={run} className="w-full">
            {busy
              ? ms
                ? "Sedang memproses…"
                : "Compressing…"
              : ms
                ? "Compress PDF"
                : "Compress PDF"}
          </Button>
        </>
      )}
    </div>
  );
}
