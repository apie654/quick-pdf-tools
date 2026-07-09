export type Language = 'en' | 'ms';

export const translations = {
  en: {
    appTitle: 'QUICK PDF',
    heroTitle: 'Quick PDF Tools',
    heroDesc: 'Simple, fast, and secure PDF utilities running directly in your browser. No files are uploaded to any server.',
    mergePdf: 'Merge PDF',
    mergePdfDesc: 'Combine multiple PDFs into one document.',
    imageToPdf: 'Image to PDF',
    imageToPdfDesc: 'Convert JPG, PNG, or GIF to PDF files.',
    rotatePdf: 'Rotate PDF',
    rotatePdfDesc: 'Adjust orientation of PDF pages easily.',
    deletePages: 'Delete Pages',
    deletePagesDesc: 'Remove unwanted pages from your document.',
    extractPages: 'Extract Pages',
    extractPagesDesc: 'Save specific pages as a new PDF file.',
    splitPdf: 'Split PDF',
    splitPdfDesc: 'Split a PDF into multiple files.',
    rearrangePages: 'Rearrange Pages',
    rearrangePagesDesc: 'Reorder PDF pages with drag & drop.',
    previewPdf: 'Preview PDF',
    previewPdfDesc: 'View document content in-browser instantly.',
    compressPdf: 'Compress PDF',
    compressPdfDesc: 'Reduce PDF file size for easier sharing (Basic Compression).',
    
    // general UI
    backToDashboard: 'Back to Dashboard',
    footerVersion: 'v1.0.2 Stable',
    footerLocal: 'Local processing only — no files uploaded to server',
    terms: 'Terms',
    privacy: 'Privacy',
    github: 'GitHub',
    footerPoweredBy: 'Powered by',
    footerSlogan: 'Building practical apps that simplify everyday work.',
    footerCopyright: '© 2026 HJE Labs. All Rights Reserved.',
    aboutTitle: 'Quick PDF Tools',
    aboutVersion: 'Version:',
    aboutDevelopedBy: 'Developed by:',
    aboutDescription: 'A modern browser-based PDF toolkit designed to simplify everyday PDF tasks while keeping your files private through local browser processing.',
    aboutButton: 'About',

    // File Uploader
    dragDrop: 'Drag & drop your files here',
    orClick: 'or click to browse local storage',
    supportedFormats: 'Supported Formats:',

    // Tools common
    chooseAnother: 'Choose another file',
    clearAll: 'Clear All',
    processing: 'Processing...',
    saving: 'Saving...',
    
    // Merge
    mergePdfSubtitle: 'Combine multiple PDFs into a single document.',
    mergeSelected: 'Selected Files',
    mergeRearrange: 'Rearrange the files in the order you want them to appear.',
    mergeAction: 'Merge PDFs',
    merging: 'Merging...',
    mergeError: 'Failed to merge PDFs. Please try again.',

    // Image to PDF
    imgToPdfSubtitle: 'Convert JPG or PNG images into a PDF document.',
    imgSelected: 'Selected Images',
    imgRearrange: 'Rearrange the images. Each image will be a new page in the PDF.',
    imgAction: 'Convert to PDF',
    converting: 'Converting...',
    imgError: 'Failed to convert images to PDF. Please ensure images are JPG or PNG.',

    // Rotate
    rotateSubtitle: 'Rotate all pages in your PDF document.',
    rotateLeft: 'Left',
    rotateRight: 'Right',
    rotateAction: 'Apply Rotation & Download',
    rotateError: 'Failed to rotate PDF. Please try again.',

    // Delete
    deleteSubtitle: 'Remove specific pages from your PDF document.',
    deleteTotal: 'Total Pages:',
    deleteInputLabel: 'Pages to delete (e.g. 1, 3, 5-8)',
    deleteAction: 'Delete Pages & Download',
    deleteError: 'Failed to delete pages. Please check your page range.',
    deleteReadError: 'Could not read PDF. It might be encrypted or corrupted.',

    // Extract
    extractSubtitle: 'Create a new PDF containing only specific pages.',
    extractInputLabel: 'Pages to extract (e.g. 1, 3, 5-8)',
    extractAction: 'Extract & Download',
    extractError: 'Failed to extract pages. Please check your page range.',
    extractNoValid: 'No valid pages selected.',

    // Compress
    compressSubtitle: 'Re-save your PDF to optimize structure. Results may vary.',
    compressNote: 'Note:',
    compressNoteText: 'This uses basic optimization. It may not significantly reduce the file size of scanned documents or heavy images, as it does not re-compress images within the PDF.',
    compressOriginal: 'Original Size:',
    compressAction: 'Compress & Download',
    compressing: 'Compressing...',
    compressError: 'Failed to compress PDF. Please try again.',

    // Preview
    previewSubtitle: 'View your PDF document directly in the browser.',
    previewPage: 'Page',
    previewOf: 'of',
    previewClose: 'Close',
    previewLoading: 'Loading PDF...',
    previewError: 'Failed to load PDF.',
    
    // Split
    splitSubtitle: 'Split a PDF document into individual pages or sections.',
    
    // Rearrange
    rearrangeSubtitle: 'Change the order of pages in your PDF document.',
    
    featureSecure: 'Secure',
    featureSecureDesc: '100% in-browser',
    featureFast: 'Fast',
    featureFastDesc: 'Local processing',
    featurePrivacy: 'Privacy',
    featurePrivacyDesc: 'No files saved',
    
    importantTip: 'Important Tip',
    importantTipDesc: 'All processes run directly in your browser. Your files are not uploaded to any server and remain secure.',
    chooseTool: 'Choose Tool',
    
    // Success Screen
    successTitle: 'Success!',
    successDesc: 'Your file is ready to download.',
    downloadBtn: 'Download',
    processAnother: 'Process Another',

    // Visual page tools selection
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    invertSelection: 'Invert Selection',
    selectedPages: 'Selected Pages:',
    noPagesSelected: 'No pages selected.',
    loadingThumbnails: 'Loading page thumbnails...',
    deleteSelected: 'Delete Selected Pages',
    extractSelected: 'Extract Selected Pages',
    rotateSelected: 'Rotate Selected Pages',
    splitSelected: 'Split Selected Pages',
    rearrangeSelected: 'Apply Rearrange & Download',
    originalPageCount: 'Original Pages:',
    newPageCount: 'New Pages:',
    outputFileSize: 'Output File Size:',
    downloadPdf: 'Download PDF',
  },
  ms: {
    appTitle: 'QUICK PDF',
    heroTitle: 'Alat PDF Pantas',
    heroDesc: 'Alat PDF yang mudah, cepat, dan selamat terus berfungsi dalam pelayar anda. Tiada fail dimuat naik ke mana-mana pelayan.',
    mergePdf: 'Gabung PDF',
    mergePdfDesc: 'Gabungkan beberapa PDF menjadi satu fail.',
    imageToPdf: 'Imej ke PDF',
    imageToPdfDesc: 'Tukar JPG, PNG, GIF kepada PDF.',
    rotatePdf: 'Putar PDF',
    rotatePdfDesc: 'Putar halaman PDF 90°, 180°, atau 270°.',
    deletePages: 'Padam Halaman',
    deletePagesDesc: 'Padam halaman yang tidak diperlukan dari PDF.',
    extractPages: 'Ekstrak Halaman',
    extractPagesDesc: 'Ekstrak halaman terpilih ke PDF baru.',
    splitPdf: 'Pisah PDF',
    splitPdfDesc: 'Pisahkan PDF kepada beberapa fail.',
    rearrangePages: 'Susun Semula',
    rearrangePagesDesc: 'Susun semula halaman PDF dengan drag & drop.',
    previewPdf: 'Pratonton PDF',
    previewPdfDesc: 'Lihat PDF terus dalam pelayar.',
    compressPdf: 'Mampat PDF',
    compressPdfDesc: 'Mampatkan saiz PDF (Basic Compression).',
    
    // general UI
    backToDashboard: 'Kembali ke Papan Pemuka',
    footerVersion: 'v1.0.2 Stabil',
    footerLocal: 'Proses tempatan sahaja — tiada fail dimuat naik ke pelayan',
    terms: 'Terma',
    privacy: 'Privasi',
    github: 'GitHub',
    footerPoweredBy: 'Dikuasakan oleh',
    footerSlogan: 'Membina aplikasi praktikal yang memudahkan kerja harian.',
    footerCopyright: '© 2026 HJE Labs. Hak Cipta Terpelihara.',
    aboutTitle: 'Alat PDF Pantas',
    aboutVersion: 'Versi:',
    aboutDevelopedBy: 'Dibangunkan oleh:',
    aboutDescription: 'Alatan PDF moden berasaskan pelayar yang direka untuk memudahkan tugasan PDF harian di samping menjaga privasi fail anda melalui pemprosesan pelayar tempatan.',
    aboutButton: 'Tentang',

    // File Uploader
    dragDrop: 'Tarik & letak fail anda di sini',
    orClick: 'atau klik untuk layari storan tempatan',
    supportedFormats: 'Format Disokong:',

    // Tools common
    chooseAnother: 'Pilih fail lain',
    clearAll: 'Kosongkan Semua',
    processing: 'Sedang diproses...',
    saving: 'Menyimpan...',
    
    // Merge
    mergePdfSubtitle: 'Gabungkan beberapa PDF menjadi satu dokumen.',
    mergeSelected: 'Fail Dipilih',
    mergeRearrange: 'Susun semula fail mengikut turutan yang anda mahukan.',
    mergeAction: 'Gabung PDF',
    merging: 'Menggabungkan...',
    mergeError: 'Gagal menggabungkan PDF. Sila cuba lagi.',

    // Image to PDF
    imgToPdfSubtitle: 'Tukar imej JPG atau PNG kepada dokumen PDF.',
    imgSelected: 'Imej Dipilih',
    imgRearrange: 'Susun semula imej. Setiap imej akan menjadi halaman baru dalam PDF.',
    imgAction: 'Tukar ke PDF',
    converting: 'Menukar...',
    imgError: 'Gagal menukar imej ke PDF. Sila pastikan imej adalah JPG atau PNG.',

    // Rotate
    rotateSubtitle: 'Putar semua halaman dalam dokumen PDF anda.',
    rotateLeft: 'Kiri',
    rotateRight: 'Kanan',
    rotateAction: 'Guna Putaran & Muat Turun',
    rotateError: 'Gagal memutar PDF. Sila cuba lagi.',

    // Delete
    deleteSubtitle: 'Buang halaman tertentu daripada dokumen PDF anda.',
    deleteTotal: 'Jumlah Halaman:',
    deleteInputLabel: 'Halaman untuk dipadam (cth. 1, 3, 5-8)',
    deleteAction: 'Padam Halaman & Muat Turun',
    deleteError: 'Gagal memadam halaman. Sila semak julat halaman anda.',
    deleteReadError: 'Tidak dapat membaca PDF. Ia mungkin disulitkan (encrypted) atau rosak.',

    // Extract
    extractSubtitle: 'Buat PDF baru yang hanya mengandungi halaman tertentu.',
    extractInputLabel: 'Halaman untuk diekstrak (cth. 1, 3, 5-8)',
    extractAction: 'Ekstrak & Muat Turun',
    extractError: 'Gagal mengekstrak halaman. Sila semak julat halaman anda.',
    extractNoValid: 'Tiada halaman sah dipilih.',

    // Compress
    compressSubtitle: 'Simpan semula PDF anda untuk mengoptimumkan struktur. Hasil mungkin berbeza.',
    compressNote: 'Nota:',
    compressNoteText: 'Ini menggunakan pengoptimuman asas. Ia mungkin tidak mengurangkan saiz fail dokumen yang diimbas atau imej berat dengan ketara, kerana ia tidak memampatkan semula imej dalam PDF.',
    compressOriginal: 'Saiz Asal:',
    compressAction: 'Mampat & Muat Turun',
    compressing: 'Memampatkan...',
    compressError: 'Gagal memampat PDF. Sila cuba lagi.',

    // Preview
    previewSubtitle: 'Lihat dokumen PDF anda terus dalam pelayar.',
    previewPage: 'Halaman',
    previewOf: 'daripada',
    previewClose: 'Tutup',
    previewLoading: 'Memuatkan PDF...',
    previewError: 'Gagal memuatkan PDF.',
    
    // Split
    splitSubtitle: 'Pisahkan dokumen PDF kepada halaman atau bahagian individu.',
    
    // Rearrange
    rearrangeSubtitle: 'Tukar susunan halaman dalam dokumen PDF anda.',
    
    featureSecure: 'Selamat',
    featureSecureDesc: '100% di pelayar',
    featureFast: 'Pantas',
    featureFastDesc: 'Proses tempatan',
    featurePrivacy: 'Privasi',
    featurePrivacyDesc: 'Fail tidak disimpan',
    
    importantTip: 'Petua Penting',
    importantTipDesc: 'Semua proses dijalankan terus dalam pelayar anda. Fail anda tidak dimuat naik ke mana-mana pelayan dan kekal selamat.',
    chooseTool: 'Pilih Alat',
    
    // Success Screen
    successTitle: 'Berjaya!',
    successDesc: 'Fail anda sedia untuk dimuat turun.',
    downloadBtn: 'Muat Turun',
    processAnother: 'Proses Lagi',

    // Visual page tools selection
    selectAll: 'Pilih Semua',
    deselectAll: 'Nyahpilih Semua',
    invertSelection: 'Songsangkan Pilihan',
    selectedPages: 'Halaman Dipilih:',
    noPagesSelected: 'Tiada halaman dipilih.',
    loadingThumbnails: 'Memuatkan lakaran kecil halaman...',
    deleteSelected: 'Padam Halaman Dipilih',
    extractSelected: 'Ekstrak Halaman Dipilih',
    rotateSelected: 'Putar Halaman Dipilih',
    splitSelected: 'Pisah Halaman Dipilih',
    rearrangeSelected: 'Guna Susunan Baru & Muat Turun',
    originalPageCount: 'Halaman Asal:',
    newPageCount: 'Halaman Baru:',
    outputFileSize: 'Saiz Fail Output:',
    downloadPdf: 'Muat Turun PDF',
  }
};
