import React from 'react';
import { X, Shield, FileText, CheckCircle2, Lock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface PolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export function PolicyDialog({ isOpen, onClose, type }: PolicyDialogProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const isEn = language === 'en';

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col max-h-[85vh] relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button on Top Right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'terms' ? (
          <>
            {/* TERMS OF USE */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isEn ? 'Terms of Use' : 'Terma Penggunaan'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {isEn ? 'Quick PDF Tools Agreement' : 'Perjanjian Alat PDF Pantas'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 py-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed scrollbar-thin">
              <p>
                {isEn 
                  ? 'Welcome to Quick PDF. Please read these Terms of Use carefully before using our local in-browser PDF utilities.'
                  : 'Selamat datang ke PDF Pantas. Sila baca Terma Penggunaan ini dengan teliti sebelum menggunakan utiliti PDF tempatan dalam pelayar kami.'}
              </p>

              <div className="space-y-4">
                {/* Point 1 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? '1. Provided "As-Is"' : '1. Disediakan "Sedia Ada"'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'This application and all its tools are provided on an "as-is" and "as-available" basis without warranties of any kind, either express or implied.'
                        : 'Aplikasi ini dan semua alatannya disediakan atas dasar "sedia ada" dan "sebagaimana tersedia" tanpa sebarang jaminan, sama ada tersurat atau tersirat.'}
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? '2. User Responsibility' : '2. Tanggungjawab Pengguna'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'You are solely responsible for checking and verifying the correctness, formatting, and completeness of all generated, edited, and output PDF documents.'
                        : 'Anda bertanggungjawab sepenuhnya untuk menyemak dan mengesahkan ketepatan, format, dan kelengkapan semua dokumen PDF yang dijana, diedit, dan dikeluarkan.'}
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? '3. Local Offline Processing' : '3. Pemprosesan Tempatan Luar Talian'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'All PDF utilities run 100% locally inside your web browser. No files are transmitted to or stored on any remote server.'
                        : 'Semua utiliti PDF dijalankan 100% secara tempatan di dalam pelayar web anda. Tiada fail dihantar atau disimpan pada mana-mana pelayan jauh.'}
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? '4. No Conversion Guarantees' : '4. Tiada Jaminan Penukaran'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'Due to differences in PDF specifications, embedded objects, and security permissions, we do not guarantee perfect PDF conversion, page deletion, rotation, extraction, or compression.'
                        : 'Oleh kerana perbezaan dalam spesifikasi PDF, objek tertanam, dan kebenaran keselamatan, kami tidak menjamin penukaran PDF, pemadaman halaman, putaran, pengekstrakan, atau pemampatan yang sempurna.'}
                    </p>
                  </div>
                </div>

                {/* Point 5 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? '5. Lawful Use' : '5. Penggunaan Sah di Sisi Undang-undang'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'You agree to use this application only for lawful purposes. You must not process copyrighted documents without authorization or use the application for harmful or illegal activities.'
                        : 'Anda bersetuju untuk menggunakan aplikasi ini hanya untuk tujuan yang sah di sisi undang-undang. Anda tidak boleh memproses dokumen berhak cipta tanpa kebenaran atau menggunakan aplikasi untuk aktiviti yang membahayakan atau haram.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PRIVACY POLICY */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isEn ? 'Privacy Policy' : 'Dasar Privasi'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {isEn ? 'Your Security is Our Priority' : 'Keselamatan Anda Keutamaan Kami'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 py-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed scrollbar-thin">
              <p>
                {isEn 
                  ? 'We are fully committed to protecting your privacy. Below is our straightforward privacy commitment to you.'
                  : 'Kami komited sepenuhnya untuk melindungi privasi anda. Di bawah adalah komitmen privasi kami yang jelas kepada anda.'}
              </p>

              <div className="space-y-4">
                {/* Point 1 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? 'No Sign-ups or Logins' : 'Tiada Pendaftaran atau Log Masuk'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'You do not need to create an account, register, or provide any personal details (such as email addresses or passwords) to use any of our PDF tools.'
                        : 'Anda tidak perlu mencipta akaun, mendaftar, atau memberikan sebarang butiran peribadi (seperti alamat e-mel atau kata laluan) untuk menggunakan mana-mana alat PDF kami.'}
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? 'Zero Server Uploads' : 'Sifar Muat Naik ke Pelayan'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'We never upload your files, images, or documents to any servers. All operations happen client-side inside your own browser.'
                        : 'Kami tidak pernah memuat naik fail, imej, atau dokumen anda ke mana-mana pelayan. Semua operasi berlaku di dalam pelayar anda sendiri.'}
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? 'No Data Retention' : 'Tiada Penyimpanan Data'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'Since files are processed inside your device memory (RAM), documents are instantly cleared when you close or refresh the tab. We do not store or track any document content.'
                        : 'Memandangkan fail diproses di dalam memori peranti anda (RAM), dokumen akan dibersihkan serta-merta apabila anda menutup atau menyegarkan semula tab. Kami tidak menyimpan atau menjejaki sebarang kandungan dokumen.'}
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEn ? 'Strictly Local Configuration Storage' : 'Penyimpanan Konfigurasi Tempatan Sahaja'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                      {isEn 
                        ? 'We may use the browser\'s standard localStorage to save simple preference settings, such as your selected language (English or Melayu) or theme preference (light or dark mode).'
                        : 'Kami mungkin menggunakan localStorage standard pelayar untuk menyimpan tetapan pilihan mudah, seperti bahasa pilihan anda (Inggeris atau Melayu) atau pilihan tema (mod terang atau gelap).'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <Button onClick={onClose} size="lg" className="px-6 rounded-2xl font-bold">
            {isEn ? 'Close' : 'Tutup'}
          </Button>
        </div>

      </div>
    </div>
  );
}
