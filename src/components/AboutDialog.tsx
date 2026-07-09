import React from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button on Top Right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.aboutTitle || 'Quick PDF Tools'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              {t.aboutButton || 'About'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pr-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          <p className="text-sm">
            {t.aboutDescription || 'A modern browser-based PDF toolkit designed to simplify everyday PDF tasks while keeping your files private through local browser processing.'}
          </p>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.aboutVersion || 'Version:'}
              </span>
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">
                v1.0.0
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.aboutDevelopedBy || 'Developed by:'}
              </span>
              <a 
                href="https://github.com/apie654" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-black text-blue-600 dark:text-blue-400 hover:underline"
              >
                HJE Labs
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {t.footerCopyright || '© 2026 HJE Labs. All Rights Reserved.'}
          </span>
          <Button onClick={onClose} size="sm" className="w-full sm:w-auto px-5 rounded-xl font-bold">
            {t.previewClose || 'Close'}
          </Button>
        </div>

      </div>
    </div>
  );
}
