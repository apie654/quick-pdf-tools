import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { formatBytes } from '../lib/utils';
import { FileText, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SuccessScreen } from '../components/SuccessScreen';

export function MergePdf() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
  };

  const processMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResultBlob(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Merge failed', error);
      alert(t.mergeError);
    } finally {
      setIsProcessing(false);
    }
  };

  if (resultBlob) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <SuccessScreen file={resultBlob} filename="merged.pdf" onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.mergePdf}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg">{t.mergePdfSubtitle}</p>
      
      <Card>
        <CardContent className="pt-6">
          <FileUploader onFileSelect={handleFiles} multiple />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.mergeSelected} ({files.length})</CardTitle>
            <CardDescription>{t.mergeRearrange}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileText className="text-blue-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => moveFile(i, 'up')} disabled={i === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setFiles([])}>{t.clearAll}</Button>
            <Button onClick={processMerge} disabled={files.length < 2 || isProcessing}>
              {isProcessing ? t.merging : t.mergeAction}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
