import '../lib/pdfWorker';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBytes } from '../lib/utils';


export function PreviewPdf() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const handlePrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.previewPdf}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg">{t.previewSubtitle}</p>
      
      {!file ? (
        <Card>
          <CardContent className="pt-6">
            <FileUploader onFileSelect={(files) => setFile(files[0])} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-3 flex flex-wrap items-center justify-between gap-4">
            <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
              {file.name} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({formatBytes(file.size)})</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={pageNumber <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.previewPage} {pageNumber} {t.previewOf} {numPages || '?'}
                </span>
                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={pageNumber >= (numPages || 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center text-slate-700 dark:text-slate-300">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={scale >= 3.0}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="destructive" size="sm" onClick={() => setFile(null)}>{t.previewClose}</Button>
            </div>
          </div>
          
          <div className="w-full max-h-[70vh] overflow-auto flex justify-center p-4">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="p-8 text-slate-700 dark:text-slate-300">{t.previewLoading}</div>}
              error={<div className="p-8 text-red-500">{t.previewError}</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg bg-white dark:bg-slate-900"
              />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
