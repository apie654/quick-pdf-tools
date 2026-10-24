import React, { useEffect, useState } from "react";
import { MergePdf } from "./tools/MergePdf";
import { ImageToPdf } from "./tools/ImageToPdf";
import { RotatePdf } from "./tools/RotatePdf";
import { DeletePagesPdf } from "./tools/DeletePagesPdf";
import { ExtractPagesPdf } from "./tools/ExtractPagesPdf";
import { CompressPdf } from "./tools/CompressPdf";
import { PreviewPdf } from "./tools/PreviewPdf";
import { SplitPdf } from "./tools/SplitPdf";
import { RearrangePages } from "./tools/RearrangePages";
import {
  FilePlus,
  Image,
  RotateCw,
  FileMinus,
  Scissors,
  Minimize2,
  Eye,
  FileText,
  ArrowLeft,
  ArrowUpRight,
  Sun,
  Moon,
  ShieldCheck,
  Grip,
} from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import { PolicyDialog } from "./components/PolicyDialog";
import { Footer } from "./components/Footer";
import { AboutDialog } from "./components/AboutDialog";

type ToolId =
  | "merge"
  | "image"
  | "rotate"
  | "delete"
  | "extract"
  | "compress"
  | "preview"
  | "split"
  | "rearrange";
export default function App() {
  const [active, setActive] = useState<ToolId | null>(null);
  const [policy, setPolicy] = useState<"terms" | "privacy" | null>(null);
  const [about, setAbout] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const ms = language === "ms";
  const [dark, setDark] = useState(
    () => localStorage.getItem("quickpdf-theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("quickpdf-theme", dark ? "dark" : "light");
  }, [dark]);
  const tools = [
    {
      id: "compress",
      name: t.compressPdf,
      desc: ms
        ? "Kecilkan fail. Sedia untuk dikongsi."
        : "Smaller files. Ready to share.",
      icon: Minimize2,
      component: CompressPdf,
    },
    {
      id: "merge",
      name: t.mergePdf,
      desc: t.mergePdfDesc,
      icon: FilePlus,
      component: MergePdf,
    },
    {
      id: "image",
      name: t.imageToPdf,
      desc: t.imageToPdfDesc,
      icon: Image,
      component: ImageToPdf,
    },
    {
      id: "split",
      name: t.splitPdf,
      desc: t.splitPdfDesc,
      icon: Scissors,
      component: SplitPdf,
    },
    {
      id: "extract",
      name: t.extractPages,
      desc: t.extractPagesDesc,
      icon: FileText,
      component: ExtractPagesPdf,
    },
    {
      id: "rearrange",
      name: t.rearrangePages,
      desc: t.rearrangePagesDesc,
      icon: Grip,
      component: RearrangePages,
    },
    {
      id: "rotate",
      name: t.rotatePdf,
      desc: t.rotatePdfDesc,
      icon: RotateCw,
      component: RotatePdf,
    },
    {
      id: "delete",
      name: t.deletePages,
      desc: t.deletePagesDesc,
      icon: FileMinus,
      component: DeletePagesPdf,
    },
    {
      id: "preview",
      name: t.previewPdf,
      desc: t.previewPdfDesc,
      icon: Eye,
      component: PreviewPdf,
    },
  ];
  const Component = tools.find((tool) => tool.id === active)?.component;
  const navigate = (id: ToolId | null) => {
    setActive(id);
    window.scrollTo({ top: 0 });
  };
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate(null)}
            aria-label="Quick PDF home"
          >
            <span className="brand-icon">
              <FileText size={21} />
            </span>
            Quick PDF<span className="brand-by">by HJE Labs</span>
          </button>
          <div className="header-actions">
            <div className="language-switch">
              <button aria-pressed={!ms} onClick={() => setLanguage("en")}>
                EN
              </button>
              <button aria-pressed={ms} onClick={() => setLanguage("ms")}>
                BM
              </button>
            </div>
            <button
              className="theme-button"
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      <main className={active ? "tool-main" : "dashboard-main"}>
        {Component ? (
          <>
            <button className="back-link" onClick={() => navigate(null)}>
              <ArrowLeft size={16} />
              {t.backToDashboard}
            </button>
            <Component />
          </>
        ) : (
          <>
            <section className="hero">
              <div className="eyebrow">
                <span />{" "}
                {ms ? "RUANG KERJA PDF ANDA" : "YOUR EVERYDAY PDF WORKSPACE"}
              </div>
              <h1>
                {ms ? (
                  <>
                    Urus PDF.
                    <br />
                    <span>Tanpa rumit.</span>
                  </>
                ) : (
                  <>
                    Less PDF hassle.
                    <br />
                    <span>More done.</span>
                  </>
                )}
              </h1>
              <p>
                {ms
                  ? "Gabung, susun dan kecilkan dokumen anda. Semua yang perlu, dalam satu ruang yang ringkas."
                  : "Merge, organise and compress your documents. Everything you need, in one simple space."}
              </p>
              <div className="privacy-inline">
                <ShieldCheck size={16} />
                {ms
                  ? "Fail kekal pada peranti anda. Tiada muat naik."
                  : "Your files stay on your device. No uploads."}
              </div>
              <div className="hero-mark" aria-hidden="true">
                <FileText strokeWidth={0.8} />
                <span>PDF</span>
              </div>
            </section>
            <section aria-labelledby="tools-heading">
              <div className="section-heading">
                <h2 id="tools-heading">{t.chooseTool}</h2>
                <span>09 {ms ? "alat percuma" : "free tools"}</span>
              </div>
              <div className="tools-grid">
                {tools.map((tool, index) => (
                  <button
                    key={tool.id}
                    className={`tool-card ${index === 0 ? "featured" : ""}`}
                    onClick={() => navigate(tool.id as ToolId)}
                  >
                    <div className="tool-card-top">
                      <tool.icon size={23} strokeWidth={1.6} />
                      <ArrowUpRight className="card-arrow" size={19} />
                    </div>
                    <h3>{tool.name}</h3>
                    <p>{tool.desc}</p>
                    <span className="tool-number">0{index + 1}</span>
                  </button>
                ))}
              </div>
            </section>
            <div className="workspace-note">
              <ShieldCheck size={18} />
              <p>
                {ms
                  ? "Tiada akaun. Tiada pemasangan. Pilih alat dan terus mula."
                  : "No account. No installation. Just pick a tool and get started."}
              </p>
              <span>
                {ms ? "Ringkas secara sengaja." : "Simple by design."}
              </span>
            </div>
          </>
        )}
      </main>
      <Footer
        onOpenAbout={() => setAbout(true)}
        onOpenTerms={() => setPolicy("terms")}
        onOpenPrivacy={() => setPolicy("privacy")}
      />
      <PolicyDialog
        isOpen={policy !== null}
        onClose={() => setPolicy(null)}
        type={policy || "terms"}
      />
      <AboutDialog isOpen={about} onClose={() => setAbout(false)} />
    </div>
  );
}
