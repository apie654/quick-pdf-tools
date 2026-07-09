import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBytes, downloadFile } from '../lib/utils';
import { PageThumbnailGrid } from '../components/PageThumbnailGrid';
import { CheckCircle2, Download, RefreshCw, Layers } from 'lucide-react';

export function ExtractPagesPdf() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [newTotalPages, setNewTotalPages] = useState(0);

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
      setSelectedPages(new Set());
      setResultBlob(null);
    } catch (error) {
      console.error('Failed to load PDF', error);
      alert(t.deleteReadError || 'Could not read PDF.');
      setFile(null);
    }
  };

  const processExtract = async () => {
    if (!file || selectedPages.size === 0) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(fileBuffer);
      
      const newPdf = await PDFDocument.create();
      
      // Sort page numbers in ascending order for copying
      const pagesToCopy = Array.from(selectedPages).map(Number).sort((a, b) => a - b);
      
      // PDF-lib expects 0-based index
      const indicesToCopy = pagesToCopy.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, indicesToCopy);
      
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setNewTotalPages(newPdf.getPageCount());
      setResultBlob(finalBlob);
    } catch (error) {
      console.error('Extract failed', error);
      alert(t.extractError || 'Failed to extract pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages(new Set());
    setResultBlob(null);
    setNewTotalPages(0);
  };

  if (resultBlob) {
    const isEn = t.appTitle === 'QUICK PDF';
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in-50 duration-200">
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {isEn ? 'Pages Extracted Successfully!' : 'Halaman Berjaya Diekstrak!'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {isEn 
              ? 'Your new extracted PDF document has been compiled and is ready.'
              : 'Dokumen PDF diekstrak yang baru telah disusun dan sedia untuk digunakan.'}
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
                {isEn ? 'Extracted Pages' : 'Halaman Diekstrak'}
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{newTotalPages}</span>
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
              onClick={() => downloadFile(resultBlob, 'extracted_pages.pdf')} 
              className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-xl" 
              size="lg"
            >
              <Download className="w-5 h-5" />
              {isEn ? 'Download PDF' : 'Muat Turun PDF'}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl" 
              size="lg"
            >
              <RefreshCw className="w-5 h-5" />
              {isEn ? 'Extract More' : 'Ekstrak Lagi'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.extractPages}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{t.extractSubtitle}</p>
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

          {/* Visual PDF page selector */}
          <PageThumbnailGrid
            file={file}
            selectedPages={selectedPages}
            onSelectionChange={setSelectedPages}
          />

          {/* Process bar */}
          <div className="flex flex-col items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
            <Button
              onClick={processExtract}
              disabled={isProcessing || selectedPages.size === 0}
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
                  <Layers className="w-5 h-5" />
                  {t.extractSelected || 'Extract Selected Pages'}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
