import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBytes, downloadFile } from '../lib/utils';
import { PageThumbnailGrid } from '../components/PageThumbnailGrid';
import { CheckCircle2, Download, RefreshCw, Scissors, Info, Layers } from 'lucide-react';

type SplitMode = 'every_page' | 'split_points';

export function SplitPdf() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [splitMode, setSplitMode] = useState<SplitMode>('every_page');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [segmentsCount, setSegmentsCount] = useState(0);

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
      setSelectedPages(new Set());
      setResultBlob(null);
      setResultFilename('');
      setSegmentsCount(0);
    } catch (error) {
      console.error('Failed to load PDF', error);
      alert(t.deleteReadError || 'Could not read PDF.');
      setFile(null);
    }
  };

  const processSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(fileBuffer);
      const zip = new JSZip();

      if (splitMode === 'every_page') {
        // Mode 1: Split every single page
        const numPages = originalPdf.getPageCount();
        if (numPages === 1) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(originalPdf, [0]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          setResultBlob(new Blob([pdfBytes], { type: 'application/pdf' }));
          setResultFilename('split-page.pdf');
          setSegmentsCount(1);
        } else {
          for (let i = 0; i < numPages; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();
            zip.file(`page-${i + 1}.pdf`, pdfBytes);
          }
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setResultBlob(zipBlob);
          setResultFilename('all_pages_split.zip');
          setSegmentsCount(numPages);
        }
      } else {
        // Mode 2: Split by visual split points
        const sortedSplitPoints = Array.from(selectedPages).map(Number).sort((a, b) => a - b);
        
        // Boundaries will represent the ranges of pages
        // E.g. if totalPages = 10, split points = [3, 7]
        // Ranges: 1-3, 4-7, 8-10
        const ranges: { start: number; end: number }[] = [];
        let currentStart = 1;

        for (const point of sortedSplitPoints) {
          ranges.push({ start: currentStart, end: point });
          currentStart = point + 1;
        }

        // Add the remaining segment if there are pages left
        if (currentStart <= totalPages) {
          ranges.push({ start: currentStart, end: totalPages });
        }

        if (ranges.length === 1) {
          // If no splits or only 1 range, just output original or selected part
          const r = ranges[0];
          const newPdf = await PDFDocument.create();
          const indices = Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start - 1 + i);
          const copiedPages = await newPdf.copyPages(originalPdf, indices);
          copiedPages.forEach(p => newPdf.addPage(p));
          const pdfBytes = await newPdf.save();
          setResultBlob(new Blob([pdfBytes], { type: 'application/pdf' }));
          setResultFilename('split_part.pdf');
          setSegmentsCount(1);
        } else {
          for (let idx = 0; idx < ranges.length; idx++) {
            const r = ranges[idx];
            const newPdf = await PDFDocument.create();
            const indices = Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start - 1 + i);
            const copiedPages = await newPdf.copyPages(originalPdf, indices);
            copiedPages.forEach(p => newPdf.addPage(p));
            const pdfBytes = await newPdf.save();
            zip.file(`part-${idx + 1}-pages-${r.start}_to_${r.end}.pdf`, pdfBytes);
          }
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setResultBlob(zipBlob);
          setResultFilename('custom_split_parts.zip');
          setSegmentsCount(ranges.length);
        }
      }
    } catch (error) {
      console.error('Split failed', error);
      alert(t.extractError || 'Split operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages(new Set());
    setResultBlob(null);
    setResultFilename('');
    setSegmentsCount(0);
  };

  const isEn = t.appTitle === 'QUICK PDF';

  if (resultBlob) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in-50 duration-200">
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {isEn ? 'PDF Splitted Successfully!' : 'PDF Berjaya Dipisahkan!'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {isEn 
              ? 'Your PDF segments have been generated. Download the compiled package below.'
              : 'Segmen PDF anda telah dijana. Muat turun pakej yang dipasang di bawah.'}
          </p>

          <div className="grid grid-cols-3 gap-4 w-full max-w-lg bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Original Pages' : 'Halaman Asal'}
              </span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-300 mt-1">{totalPages}</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Files Created' : 'Fail Dijana'}
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{segmentsCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Output Size' : 'Saiz Output'}
              </span>
              <span className="text-lg font-black text-emerald-600 mt-1">{formatBytes(resultBlob.size)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <Button 
              onClick={() => downloadFile(resultBlob, resultFilename)} 
              className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-xl" 
              size="lg"
            >
              <Download className="w-5 h-5" />
              {isEn ? 'Download PDF/ZIP' : 'Muat Turun PDF/ZIP'}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl" 
              size="lg"
            >
              <RefreshCw className="w-5 h-5" />
              {isEn ? 'Split More' : 'Pisah Lagi'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.splitPdf}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{t.splitSubtitle}</p>
      </div>
      
      {!file ? (
        <Card className="border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <CardContent className="pt-6">
            <FileUploader onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* File summary */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <p className="font-bold text-slate-850 dark:text-slate-100">{file.name}</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                {t.deleteTotal} {totalPages} • {formatBytes(file.size)}
              </p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold text-xs h-9" onClick={handleReset}>
              {t.chooseAnother}
            </Button>
          </div>

          {/* Mode Selector */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {isEn ? 'Select Splitting Mode' : 'Pilih Mod Pemisahan'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setSplitMode('every_page')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  splitMode === 'every_page'
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className="font-black text-sm text-slate-800 dark:text-slate-200">
                  {isEn ? 'Split Every Page' : 'Pisahkan Setiap Halaman'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {isEn ? 'Convert each individual page of the document into its own single-page PDF.' : 'Tukar setiap halaman tunggal dokumen kepada fail PDF tersendiri.'}
                </p>
              </div>

              <div 
                onClick={() => setSplitMode('split_points')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  splitMode === 'split_points'
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className="font-black text-sm text-slate-800 dark:text-slate-200">
                  {isEn ? 'Split by Selected Pages (Split Points)' : 'Pisah mengikut Halaman Dipilih'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {isEn ? 'Mark selected pages to represent the end of each sub-document segment.' : 'Tanda halaman terpilih untuk mewakili akhir setiap segmen dokumen kecil.'}
                </p>
              </div>
            </div>
          </div>

          {/* Visual PDF page selector */}
          {splitMode === 'split_points' && (
            <div className="space-y-4 animate-in slide-in-from-top-3 duration-200">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 text-blue-800 dark:text-blue-200 text-sm flex gap-3">
                <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                <p>
                  <strong>Instruction:</strong> Select pages that will be the <strong>LAST page</strong> of each split part. E.g., if you select Page 3 and Page 7 of a 10-page document, it splits into pages 1–3, pages 4–7, and pages 8–10.
                </p>
              </div>
              <PageThumbnailGrid
                file={file}
                selectedPages={selectedPages}
                onSelectionChange={setSelectedPages}
              />
            </div>
          )}

          {/* Process bar */}
          <div className="flex flex-col items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
            <Button
              onClick={processSplit}
              disabled={isProcessing || (splitMode === 'split_points' && selectedPages.size === 0)}
              size="lg"
              className="w-full max-w-md font-bold text-md h-12 rounded-2xl"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {t.processing}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  {splitMode === 'split_points' 
                    ? (t.splitSelected || 'Split Selected Pages') 
                    : (t.splitPdf)}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
