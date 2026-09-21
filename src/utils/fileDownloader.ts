/**
 * Utility to download files directly to the user's Mac / PC via standard browser API.
 * Whenever the user asks to create a file or folder ('yarat'), this immediately downloads
 * the file directly to their local machine.
 */
export function downloadFileToComputer(fileName: string, content: string = ''): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const cleanFileName = fileName ? fileName.replace(/^.*[\\\/]/, '').trim() : 'yangi_hujjat.txt';
    const finalContent =
      content && content.trim().length > 0
        ? content
        : `JARVIS tomonidan yaratilgan hujjat: ${cleanFileName}\nVaqt: ${new Date().toLocaleString('uz-UZ')}\nHolat: Muvaffaqiyatli yuklandi.\n`;

    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    if (typeof link.click === 'function') {
      link.click();
    } else {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }

    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch {
        // cleanup ignore
      }
    }, 600);

    return true;
  } catch (err) {
    console.warn('Faylni yuklab olishda xatolik:', err);
    return false;
  }
}

