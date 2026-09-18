/**
 * Utility to download files directly to the user's Mac / PC via standard browser API.
 * No external agent or downloads required!
 */
export function downloadFileToComputer(fileName: string, content: string = ''): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const blob = new Blob([content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 400);
    return true;
  } catch (err) {
    console.warn('Faylni yuklab olishda xatolik:', err);
    return false;
  }
}
