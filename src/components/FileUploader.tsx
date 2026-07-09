import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  className?: string;
}

export function FileUploader({
  onFileSelect,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxFiles = 0,
  label,
  className,
}: FileUploaderProps) {
  const { t } = useLanguage();
  const displayLabel = label || t.dragDrop;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles: maxFiles > 0 ? maxFiles : undefined,
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full min-h-[16rem] p-8 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center transition-all duration-200 group cursor-pointer',
        isDragActive 
          ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className={cn("p-4 rounded-full text-white mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110", 
        isDragActive ? "bg-blue-500 shadow-blue-300 dark:shadow-blue-900/30" : "bg-blue-600 shadow-blue-200 dark:shadow-blue-900/20")}>
        <UploadCloud className="w-8 h-8" strokeWidth={2.5} />
      </div>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center px-4">{displayLabel}</p>
      <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-center px-4">
        {t.orClick}
      </p>
      <p className="mt-6 text-[10px] font-black text-slate-400 dark:text-slate-500 text-center tracking-widest uppercase">
        {t.supportedFormats} {Object.values(accept).flat().join(', ')}
      </p>
    </div>
  );
}
