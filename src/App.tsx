import React, { useState, useEffect } from 'react';
import { MergePdf } from './tools/MergePdf';
import { ImageToPdf } from './tools/ImageToPdf';
import { RotatePdf } from './tools/RotatePdf';
import { DeletePagesPdf } from './tools/DeletePagesPdf';
import { ExtractPagesPdf } from './tools/ExtractPagesPdf';
import { CompressPdf } from './tools/CompressPdf';
import { PreviewPdf } from './tools/PreviewPdf';
import { SplitPdf } from './tools/SplitPdf';
import { RearrangePages } from './tools/RearrangePages';
import { 
  FilePlus, Image as ImageIcon, RotateCw, FileMinus, 
  Scissors, Minimize2, Eye, FileText, ArrowLeft,
  Sun, Moon, Shield, Zap, Lock, Info
} from 'lucide-react';
import { Button } from './components/ui/button';
import { useLanguage } from './contexts/LanguageContext';
import { PolicyDialog } from './components/PolicyDialog';
import { Footer } from './components/Footer';
import { AboutDialog } from './components/AboutDialog';

type ToolId = 'dashboard' | 'merge' | 'imageToPdf' | 'rotate' | 'delete' | 'extract' | 'compress' | 'preview' | 'split' | 'rearrange';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolId>('dashboard');
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const tools = [
    { id: 'merge', name: t.mergePdf, icon: <FilePlus />, desc: t.mergePdfDesc },
    { id: 'imageToPdf', name: t.imageToPdf, icon: <ImageIcon />, desc: t.imageToPdfDesc },
    { id: 'rotate', name: t.rotatePdf, icon: <RotateCw />, desc: t.rotatePdfDesc },
    { id: 'delete', name: t.deletePages, icon: <FileMinus />, desc: t.deletePagesDesc },
    { id: 'extract', name: t.extractPages, icon: <Scissors />, desc: t.extractPagesDesc },
    { id: 'split', name: t.splitPdf, icon: <FileMinus className="rotate-90" />, desc: t.splitPdfDesc },
    { id: 'rearrange', name: t.rearrangePages, icon: <FilePlus className="rotate-180" />, desc: t.rearrangePagesDesc },
    { id: 'preview', name: t.previewPdf, icon: <Eye />, desc: t.previewPdfDesc },
    { id: 'compress', name: t.compressPdf, icon: <Minimize2 />, desc: t.compressPdfDesc },
  ];

  const renderCurrentTool = () => {
    if (currentTool === 'dashboard') {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans flex flex-col transition-colors">
          <nav className="flex justify-between items-center px-6 lg:px-10 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                 <FileText className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{t.appTitle}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-sm font-bold transition-colors">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1.5 rounded-md shadow-sm transition-colors ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('ms')}
                  className={`px-4 py-1.5 rounded-md shadow-sm transition-colors ${language === 'ms' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Melayu
                </button>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </nav>
          
          <main className="flex-grow p-6 lg:p-10 flex flex-col gap-8 max-w-6xl mx-auto w-full">
            <div className="text-center space-y-4 mb-2 mt-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-blue-600 dark:text-blue-500">{t.heroTitle}</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                {t.heroDesc}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{t.featureSecure}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.featureSecureDesc}</div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{t.featureFast}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.featureFastDesc}</div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{t.featurePrivacy}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.featurePrivacyDesc}</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">{t.chooseTool}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, index) => {
                const colorClasses = [
                  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
                  'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
                  'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
                  'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
                  'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
                  'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
                  'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
                  'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
                  'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
                ];
                const iconColorClass = colorClasses[index % colorClasses.length];

                return (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id as ToolId)}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden text-left flex flex-col group"
                  >
                    {tool.id === 'compress' && (
                      <div className="absolute top-0 right-0 bg-slate-800 dark:bg-slate-700 text-white text-[10px] px-3 py-1 font-black rounded-bl-xl tracking-wider">BASIC</div>
                    )}
                    <div className={`p-3 rounded-2xl w-fit mb-4 transition-colors ${iconColorClass}`}>
                      {React.cloneElement(tool.icon as React.ReactElement, { className: 'w-6 h-6' })}
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white transition-colors">{tool.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight transition-colors">{tool.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-4 md:p-6 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl flex gap-4 items-start">
              <div className="p-2 bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-blue-400 mb-1">{t.importantTip}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.importantTipDesc}</p>
              </div>
            </div>
          </main>
          
          <Footer 
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenTerms={() => setPolicyType('terms')}
            onOpenPrivacy={() => setPolicyType('privacy')}
          />
        </div>
      );
    }

    const getActiveComponent = () => {
      switch (currentTool) {
        case 'merge': return <MergePdf />;
        case 'imageToPdf': return <ImageToPdf />;
        case 'rotate': return <RotatePdf />;
        case 'delete': return <DeletePagesPdf />;
        case 'extract': return <ExtractPagesPdf />;
        case 'compress': return <CompressPdf />;
        case 'preview': return <PreviewPdf />;
        case 'split': return <SplitPdf />;
        case 'rearrange': return <RearrangePages />;
        default: return null;
      }
    };
    
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans flex flex-col transition-colors">
        <nav className="flex justify-between items-center px-6 lg:px-10 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
               <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white hidden sm:block">{t.appTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant="ghost" className="font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl px-4 py-2" onClick={() => setCurrentTool('dashboard')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.backToDashboard}
            </Button>
          </div>
        </nav>
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col">
          {getActiveComponent()}
        </main>
        <Footer 
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenTerms={() => setPolicyType('terms')}
          onOpenPrivacy={() => setPolicyType('privacy')}
        />
      </div>
    );
  };

  return (
    <>
      {renderCurrentTool()}
      <PolicyDialog isOpen={policyType !== null} onClose={() => setPolicyType(null)} type={policyType || 'terms'} />
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
