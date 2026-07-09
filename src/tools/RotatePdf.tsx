import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBytes, downloadFile } from '../lib/utils';
import { PageThumbnailGrid } from '../components/PageThumbnailGrid';
import { CheckCircle2, Download, RefreshCw, RotateCw, RotateCcw } from 'lucide-react';

export function RotatePdf() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rotationAngle, setRotationAngle] = useState(90); // default to 90 degrees CW
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

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

  const processRotate = async () => {
    if (!file || selectedPages.size === 0) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      
      // Rotate selected pages by the chosen angle
      selectedPages.forEach((pageNum) => {
        const pageIndex = pageNum - 1;
        if (pageIndex >= 0 && pageIndex < pages.length) {
          const page = pages[pageIndex];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + rotationAngle) % 360));
        }
      });
      
      const pdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultBlob(finalBlob);
    } catch (error) {
      console.error('Rotate failed', error);
      alert(t.rotateError || 'Failed to rotate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages(new Set());
    setRotationAngle(90);
    setResultBlob(null);
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
            {isEn ? 'Pages Rotated Successfully!' : 'Halaman Berjaya Diputar!'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {isEn 
              ? 'Your PDF has been rotated and processed successfully. Download the file below.'
              : 'PDF anda telah diputar dan diproses dengan jaya. Muat turun fail di bawah.'}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Rotated Pages' : 'Halaman Diputar'}
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{selectedPages.size}</span>
            </div>
            <div className="flex flex-col items-center border-l border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Output Size' : 'Saiz Output'}
              </span>
              <span className="text-lg font-black text-emerald-600 mt-1">{formatBytes(resultBlob.size)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <Button 
              onClick={() => downloadFile(resultBlob, 'rotated_pages.pdf')} 
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
              {isEn ? 'Rotate More' : 'Putar Lagi'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isEn = t.appTitle === 'QUICK PDF';

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.rotatePdf}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{t.rotateSubtitle}</p>
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

          {/* Rotation direction & degree settings */}
          {selectedPages.size > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {isEn ? 'Choose Rotation Angle' : 'Pilih Sudut Putaran'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={rotationAngle === 90 ? 'default' : 'outline'}
                  onClick={() => setRotationAngle(90)}
                  className="rounded-xl py-3 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4 text-emerald-500" />
                  <span>90° Clockwise</span>
                </Button>
                <Button
                  variant={rotationAngle === 180 ? 'default' : 'outline'}
                  onClick={() => setRotationAngle(180)}
                  className="rounded-xl py-3 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4 text-amber-500 rotate-90" />
                  <span>180° Flip</span>
                </Button>
                <Button
                  variant={rotationAngle === 270 ? 'default' : 'outline'}
                  onClick={() => setRotationAngle(270)}
                  className="rounded-xl py-3 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  <span>90° Counter-CW</span>
                </Button>
              </div>
            </div>
          )}

          {/* Process bar */}
          <div className="flex flex-col items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
            <Button
              onClick={processRotate}
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
                  <RotateCw className="w-5 h-5" />
                  {t.rotateSelected || 'Rotate Selected Pages'}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
