import React from 'react';
import { Button } from './ui/button';
import { CheckCircle, Download, RefreshCw } from 'lucide-react';
import { formatBytes, downloadFile } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface SuccessScreenProps {
  file: Blob | null;
  filename: string;
  onReset: () => void;
}

export function SuccessScreen({ file, filename, onReset }: SuccessScreenProps) {
  const { t } = useLanguage();
  
  if (!file) return null;

  const handleDownload = () => {
    downloadFile(file, filename);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.successTitle || 'Success!'}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {t.successDesc || 'Your file is ready to download.'}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={handleDownload} className="w-full sm:w-auto flex items-center gap-2" size="lg">
          <Download className="w-5 h-5" />
          {t.downloadBtn || 'Download'} ({formatBytes(file.size)})
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full sm:w-auto flex items-center gap-2" size="lg">
          <RefreshCw className="w-5 h-5" />
          {t.processAnother || 'Process Another'}
        </Button>
      </div>
    </div>
  );
}
