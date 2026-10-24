import '../lib/pdfWorker';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document } from 'react-pdf';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBytes, downloadFile } from '../lib/utils';
import { ArrowUp, ArrowDown, CheckCircle2, Download, RefreshCw, MoveHorizontal, ListOrdered } from 'lucide-react';
import { LazyThumbnailPageItem } from '../components/PageThumbnailGrid';


export function RearrangePages() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const numPages = pdfDoc.getPageCount();
      const initialPages = Array.from({ length: numPages }, (_, i) => i);
      setPages(initialPages);
      setResultBlob(null);
    } catch (error) {
      console.error('Failed to load PDF', error);
      alert(t.deleteReadError || 'Could not read PDF.');
      setFile(null);
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === pages.length - 1)) return;
    const newPages = [...pages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;
    setPages(newPages);
  };

  const processRearrange = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(fileBuffer);
      
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, pages);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultBlob(finalBlob);
    } catch (error) {
      console.error('Rearrange failed', error);
      alert(t.extractError || 'Failed to rearrange pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setResultBlob(null);
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
            {isEn ? 'Pages Rearranged Successfully!' : 'Susunan Halaman Berjaya Ditukar!'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {isEn 
              ? 'Your PDF page order has been updated. Download the file below.'
              : 'Susunan halaman PDF anda telah berjaya dikemas kini. Muat turun fail di bawah.'}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isEn ? 'Total Pages' : 'Jumlah Halaman'}
              </span>
              <span className="text-lg font-black text-blue-600 mt-1">{pages.length}</span>
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
              onClick={() => downloadFile(resultBlob, 'rearranged.pdf')} 
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
              {isEn ? 'Rearrange Again' : 'Susun Lagi'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.rearrangePages}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{t.rearrangeSubtitle}</p>
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
                {t.deleteTotal} {pages.length} • {formatBytes(file.size)}
              </p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold text-xs h-9" onClick={handleReset}>
              {t.chooseAnother}
            </Button>
          </div>

          {/* Quick Info Tip */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-100">
                {isEn ? 'Reorder Pages' : 'Ubah Urutan Halaman'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isEn 
                  ? 'Use the up and down arrow buttons on each thumbnail card to rearrange pages.' 
                  : 'Gunakan butang anak panah ke atas dan ke bawah pada setiap kad lakaran kecil untuk menyusun semula halaman.'}
              </p>
            </div>
          </div>

          {/* Visual PDF page list */}
          <div className="border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6">
            <Document
              file={file}
              loading={
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="font-bold text-sm">{t.loadingThumbnails}</p>
                </div>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {pages.map((originalPageIndex, i) => {
                  const pageNumber = originalPageIndex + 1;
                  return (
                    <div 
                      key={`${originalPageIndex}-${i}`} 
                      className="flex flex-col items-center space-y-2 relative animate-in zoom-in-95 duration-150"
                    >
                      {/* Position Badge */}
                      <span className="absolute -top-2 -left-2 z-20 w-7 h-7 bg-blue-600 text-white font-black text-xs rounded-full flex items-center justify-center shadow-md">
                        {i + 1}
                      </span>

                      {/* Thumbnail Card */}
                      <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group select-none">
                        <LazyThumbnailPageItem pageNumber={pageNumber} />
                        
                        {/* Action buttons hover overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg bg-white/90 hover:bg-white text-slate-800" 
                            onClick={() => movePage(i, 'up')} 
                            disabled={i === 0}
                          >
                            <ArrowUp className="w-4.5 h-4.5" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg bg-white/90 hover:bg-white text-slate-800" 
                            onClick={() => movePage(i, 'down')} 
                            disabled={i === pages.length - 1}
                          >
                            <ArrowDown className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Original Page Label */}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isEn ? 'Orig.' : 'Asal'} {pageNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Document>
          </div>

          {/* Process bar */}
          <div className="flex flex-col items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
            <Button
              onClick={processRearrange}
              disabled={isProcessing}
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
                  <MoveHorizontal className="w-5 h-5" />
                  {t.rearrangeSelected || 'Apply Rearrange & Download'}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
