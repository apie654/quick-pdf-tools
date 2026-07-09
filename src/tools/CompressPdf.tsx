import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { pdfjs } from 'react-pdf';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { formatBytes, downloadFile } from '../lib/utils';
import { ShieldAlert, Zap, Layers, CheckCircle2, Download, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function CompressPdf() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  
  // Custom states
  const [mode, setMode] = useState<'basic' | 'image'>('basic');
  const [quality, setQuality] = useState<number>(0.65); // Default Medium
  const [scale, setScale] = useState<number>(1.5); // Default Medium
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setOriginalSize(files[0].size);
    setResultBlob(null);
  };

  const processCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setCurrentProgress(null);

    try {
      if (mode === 'basic') {
        // Basic optimization: re-saves the PDF structure without metadata/streams
        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
        setResultBlob(new Blob([pdfBytes], { type: 'application/pdf' }));
      } else {
        // Image-based compression
        const fileBuffer = await file.arrayBuffer();
        
        // Load document via PDF.js
        const loadingTask = pdfjs.getDocument({ data: fileBuffer });
        const pdfDoc = await loadingTask.promise;
        const total = pdfDoc.numPages;

        if (total === 0) {
          throw new Error('PDF has no pages');
        }

        // Get first page to define initial jsPDF document format
        const firstPage = await pdfDoc.getPage(1);
        const firstViewport = firstPage.getViewport({ scale: scale });
        
        const pdf = new jsPDF({
          orientation: firstViewport.width > firstViewport.height ? 'l' : 'p',
          unit: 'pt',
          format: [firstViewport.width, firstViewport.height]
        });

        for (let i = 1; i <= total; i++) {
          setCurrentProgress({ current: i, total });
          
          let page;
          let viewport;
          
          if (i === 1) {
            page = firstPage;
            viewport = firstViewport;
          } else {
            page = await pdfDoc.getPage(i);
            viewport = page.getViewport({ scale: scale });
            pdf.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? 'l' : 'p');
          }

          // Offscreen canvas to render the PDF page
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Could not create 2D canvas context');
          }

          // Render PDF page into canvas context
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Convert page image to JPEG with selected quality
          const imgData = canvas.toDataURL('image/jpeg', quality);
          pdf.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
        }

        const pdfOutput = pdf.output('blob');
        setResultBlob(pdfOutput);
      }
    } catch (error) {
      console.error('Compression failed', error);
      alert(t.compressError || 'Failed to compress PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setCurrentProgress(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalSize(0);
    setResultBlob(null);
    setMode('basic');
    setQuality(0.65);
    setScale(1.5);
    setCurrentProgress(null);
  };

  const reductionPercentage = resultBlob
    ? Math.max(0, Math.round(((originalSize - resultBlob.size) / originalSize) * 100))
    : 0;

  const isLargerThanOriginal = resultBlob && resultBlob.size > originalSize;

  if (resultBlob) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Compression Complete!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Your optimized PDF document is ready for download.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-lg bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Original Size</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">{formatBytes(originalSize)}</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Size</span>
              <span className={`text-lg font-black mt-1 ${isLargerThanOriginal ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {formatBytes(resultBlob.size)}
              </span>
            </div>
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Reduction</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">
                {isLargerThanOriginal ? '0%' : `${reductionPercentage}%`}
              </span>
            </div>
          </div>

          {isLargerThanOriginal && (
            <div className="max-w-lg mb-6 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl border border-amber-200 dark:border-amber-900 text-left flex gap-3 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <p>
                <strong>Notice:</strong> The optimized size is slightly larger than the original. This is normal for already-optimized or simple PDFs. You can try <strong>Image-Based Compression</strong> with a lower quality or smaller resolution scale.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <Button onClick={() => downloadFile(resultBlob, 'compressed.pdf')} className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2" size="lg">
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" size="lg">
              <RefreshCw className="w-5 h-5" />
              Compress Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t.compressPdf}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg">{t.compressSubtitle}</p>
      
      {!file ? (
        <Card>
          <CardContent className="pt-6">
            <FileUploader onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* File Header Details */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{file.name}</p>
              <p className="text-sm text-slate-500 mt-1">{t.compressOriginal} {formatBytes(originalSize)}</p>
            </div>
            <Button variant="ghost" className="rounded-xl font-bold" onClick={handleReset}>
              {t.chooseAnother}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Compression Mode Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Select Compression Mode</h3>
              
              {/* Basic Option */}
              <div 
                onClick={() => setMode('basic')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'basic' 
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className={`w-5 h-5 ${mode === 'basic' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-950 dark:text-white">Basic Optimization</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Reduces metadata and optimizes structure. Safe, lossless, keeps text fully searchable, but cannot compress heavy embedded scanned page images.
                </p>
              </div>

              {/* Image-Based Option */}
              <div 
                onClick={() => setMode('image')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'image' 
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Layers className={`w-5 h-5 ${mode === 'image' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-950 dark:text-white">Image-Based Compression</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Renders pages to JPEG canvases first. Highly effective for scanned documents, books, and photo-heavy PDFs.
                </p>
              </div>
            </div>

            {/* Right Column: Settings & Warnings */}
            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              {mode === 'basic' ? (
                <div className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Mode: Basic Optimization</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      This lossless method works directly with the PDF structures. It is immediate, but cannot reduce the byte size of images.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-amber-800 dark:text-amber-200 text-sm flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Note:</strong> For scanned/image-heavy PDFs, browser-only basic saving may have limited effect.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Image Compression Settings</h4>
                  
                  {/* Quality Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Image Quality</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Low', val: 0.45 },
                        { label: 'Medium', val: 0.65 },
                        { label: 'High', val: 0.8 },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setQuality(opt.val)}
                          className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                            quality === opt.val
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {opt.label} ({opt.val})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scale / Resolution Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resolution Scale</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Small', val: 1.0 },
                        { label: 'Medium', val: 1.5 },
                        { label: 'Large', val: 2.0 },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setScale(opt.val)}
                          className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                            scale === opt.val
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {opt.label} ({opt.val}x)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning label */}
                  <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-amber-800 dark:text-amber-200 text-xs flex gap-3 leading-relaxed">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Important Warning:</strong> Image-based compression turns each page into a static image inside the PDF. The text will <strong>no longer be searchable, indexable, or selectable</strong>.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {isProcessing && currentProgress && (
              <div className="w-full max-w-md space-y-2 text-center">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Processing Page {currentProgress.current} of {currentProgress.total}...
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300" 
                    style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <Button 
              onClick={processCompress} 
              disabled={isProcessing}
              size="lg"
              className="w-full max-w-md font-bold text-lg h-12 rounded-xl"
            >
              {isProcessing 
                ? (currentProgress ? `Compressing (${currentProgress.current}/${currentProgress.total})...` : t.compressing) 
                : 'Optimize & Download'
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
