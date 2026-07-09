import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Check, Grid, RefreshCw, Square, CheckSquare } from 'lucide-react';

// Initialize PDF.js worker using unpkg with the matching version of pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageThumbnailGridProps {
  file: File;
  selectedPages: Set<number>;
  onSelectionChange: (selected: Set<number>) => void;
  onPagesLoaded?: (numPages: number) => void;
}

export function PageThumbnailGrid({
  file,
  selectedPages,
  onSelectionChange,
  onPagesLoaded
}: PageThumbnailGridProps) {
  const { t } = useLanguage();
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages: loadedNumPages }: { numPages: number }) => {
    setNumPages(loadedNumPages);
    if (onPagesLoaded) {
      onPagesLoaded(loadedNumPages);
    }
  };

  const handleSelectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= numPages; i++) {
      all.add(i);
    }
    onSelectionChange(all);
  };

  const handleDeselectAll = () => {
    onSelectionChange(new Set<number>());
  };

  const handleInvertSelection = () => {
    const inverted = new Set<number>();
    for (let i = 1; i <= numPages; i++) {
      if (!selectedPages.has(i)) {
        inverted.add(i);
      }
    }
    onSelectionChange(inverted);
  };

  const togglePageSelection = (pageNum: number) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNum)) {
      updated.delete(pageNum);
    } else {
      updated.add(pageNum);
    }
    onSelectionChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Selection Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.selectedPages} <span className="text-blue-600 dark:text-blue-400 font-black">{selectedPages.size}</span> / {numPages || '?'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Click thumbnails below to toggle selection
            </p>
          </div>
        </div>

        {numPages > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="rounded-xl font-semibold text-xs py-1.5 h-8"
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
              {t.selectAll}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="rounded-xl font-semibold text-xs py-1.5 h-8"
            >
              <Square className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {t.deselectAll}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInvertSelection}
              className="rounded-xl font-semibold text-xs py-1.5 h-8"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {t.invertSelection}
            </Button>
          </div>
        )}
      </div>

      {/* PDF Pages Container */}
      <div className="border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 min-h-[300px]">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className="font-bold text-sm">{t.loadingThumbnails}</p>
            </div>
          }
          error={
            <div className="p-8 text-center text-red-500 font-bold bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-200 dark:border-red-900/30">
              {t.previewError}
            </div>
          }
        >
          {numPages > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: numPages }).map((_, index) => {
                const pageNum = index + 1;
                const isSelected = selectedPages.has(pageNum);

                return (
                  <div
                    key={pageNum}
                    onClick={() => togglePageSelection(pageNum)}
                    className="group cursor-pointer flex flex-col items-center space-y-2 relative"
                  >
                    {/* Thumbnail Card with interactive styles */}
                    <div
                      className={`w-full aspect-[3/4] relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border-2 transition-all duration-200 select-none ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 ring-4 ring-blue-100 dark:ring-blue-950/50 scale-[1.02]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                      }`}
                    >
                      {/* Checkbox overlay */}
                      <div
                        className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white scale-110'
                            : 'bg-white/80 dark:bg-slate-950/80 border-slate-300 dark:border-slate-700 text-transparent opacity-60 group-hover:opacity-100'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>

                      {/* Lazy Loading Page Container */}
                      <LazyThumbnailPageItem pageNumber={pageNum} />

                      {/* Selection background dim */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                      )}
                    </div>

                    {/* Page Label */}
                    <span className={`text-xs font-black tracking-tight px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {t.previewPage} {pageNum}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}

export interface LazyThumbnailPageItemProps {
  pageNumber: number;
}

export function LazyThumbnailPageItem({ pageNumber }: LazyThumbnailPageItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // start rendering slightly before it rolls on-screen
        threshold: 0.01
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={elementRef} className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {isVisible ? (
        <Page
          pageNumber={pageNumber}
          scale={0.3} // perfectly sized scale to keep rendering ultra-fast and tiny on memory
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="max-w-full max-h-full flex items-center justify-center"
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <RefreshCw className="w-5 h-5 animate-spin text-slate-300" />
            </div>
          }
          error={
            <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500 bg-red-50 dark:bg-red-950/10">
              Err
            </div>
          }
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      )}
    </div>
  );
}
