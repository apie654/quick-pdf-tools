import React from 'react';
import { Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export function Footer({ onOpenAbout, onOpenTerms, onOpenPrivacy }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 transition-colors select-none">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center space-y-2">
        {/* Powered By with Zap Icon */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          <span>
            {t.footerPoweredBy || 'Powered by'}{' '}
            <a 
              href="https://github.com/apie654" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors underline decoration-dotted underline-offset-2"
            >
              HJE Labs
            </a>
          </span>
        </div>

        {/* Slogan */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md leading-normal">
          {t.footerSlogan || 'Building practical apps that simplify everyday work.'}
        </p>

        {/* Links: About, Terms, Privacy */}
        <div className="flex items-center justify-center gap-3 text-[11px] pt-1 font-bold text-slate-450 dark:text-slate-550">
          <button 
            onClick={onOpenAbout} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {t.aboutButton || 'About'}
          </button>
          <span className="h-2.5 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
          <button 
            onClick={onOpenTerms} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {t.terms || 'Terms'}
          </button>
          <span className="h-2.5 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
          <button 
            onClick={onOpenPrivacy} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {t.privacy || 'Privacy'}
          </button>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-400/80 dark:text-slate-600 pt-0.5">
          {t.footerCopyright || '© 2026 HJE Labs. All Rights Reserved.'}
        </p>
      </div>
    </footer>
  );
}
