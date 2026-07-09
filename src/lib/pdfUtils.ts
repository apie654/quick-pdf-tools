export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && start <= maxPages && end <= maxPages) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}
