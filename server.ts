import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / container sandbox virtual filesystem for preview mode when local agent is not running
interface SandboxEntry {
  name: string;
  type: 'file' | 'folder';
  size: number;
  content: string;
  modifiedAt: string;
}

const sandboxStorage: Record<string, SandboxEntry[]> = {
  Desktop: [
    { name: 'Hujjatlarim.txt', type: 'file', size: 120, content: 'JARVIS Lokal Agent sinov hujjati', modifiedAt: new Date().toISOString() },
    { name: 'Loyiha', type: 'folder', size: 0, content: '', modifiedAt: new Date().toISOString() }
  ],
  Downloads: [
    { name: 'setup.exe', type: 'file', size: 14500000, content: '', modifiedAt: new Date().toISOString() },
    { name: 'kitob.pdf', type: 'file', size: 2400000, content: '', modifiedAt: new Date().toISOString() }
  ],
  Documents: [
    { name: 'Reja_2026.docx', type: 'file', size: 45000, content: '', modifiedAt: new Date().toISOString() }
  ],
  Pictures: [
    { name: 'Manzara.jpg', type: 'file', size: 3400000, content: '', modifiedAt: new Date().toISOString() }
  ],
  Videos: []
};

// API: Download start-jarvis.bat (Windows)
app.get('/api/agent/download-bat', (req, res) => {
  const batPath = path.join(process.cwd(), 'start-jarvis.bat');
  if (fs.existsSync(batPath)) {
    res.download(batPath, 'start-jarvis.bat');
  } else {
    res.status(404).send('Fayl topilmadi');
  }
});

// API: Download start-jarvis.command (macOS)
app.get('/api/agent/download-command', (req, res) => {
  const cmdPath = path.join(process.cwd(), 'start-jarvis.command');
  if (fs.existsSync(cmdPath)) {
    res.download(cmdPath, 'start-jarvis.command');
  } else {
    res.status(404).send('Fayl topilmadi');
  }
});

// API: Download start-jarvis.sh (macOS & Linux)
app.get('/api/agent/download-sh', (req, res) => {
  const shPath = path.join(process.cwd(), 'start-jarvis.sh');
  if (fs.existsSync(shPath)) {
    res.download(shPath, 'start-jarvis.sh');
  } else {
    res.status(404).send('Fayl topilmadi');
  }
});

// API: Download jarvis-agent.js
app.get('/api/agent/download-script', (req, res) => {
  const scriptPath = path.join(process.cwd(), 'agent', 'jarvis-agent.js');
  if (fs.existsSync(scriptPath)) {
    res.download(scriptPath, 'jarvis-agent.js');
  } else {
    res.status(404).send('Fayl topilmadi');
  }
});

// Pure Local Agent: AI endpoints removed completely.
// If any legacy call is made to /api/ai-parse, gracefully return recognized: false
app.post('/api/ai-parse', (req, res) => {
  res.json({
    recognized: false,
    message: 'JARVIS 100% lokal agent rejimida ishlaydi. Hech qanday AI API ishlatilmaydi.'
  });
});

// API: Sandbox execution (fallback file storage)
app.post('/api/sandbox/execute', (req, res) => {
  const { action, location = 'Desktop', name, content = '', oldName, newName } = req.body;

  if (!sandboxStorage[location]) {
    sandboxStorage[location] = [];
  }

  const userAgent = (req.headers['user-agent'] as string) || '';
  const isClientMac = /Macintosh|Mac OS/i.test(userAgent);
  const getDisplayPath = (sub: string) => isClientMac
    ? `/Users/foydalanuvchi/${location}/${sub}`
    : `C:\\Users\\JARVIS_User\\${location}\\${sub}`;

  const list = sandboxStorage[location];

  switch (action) {
    case 'create_file': {
      if (!name) return res.status(400).json({ success: false, message: 'Fayl nomi kiritilmadi' });
      const existing = list.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        existing.content = content;
        existing.size = Buffer.byteLength(content, 'utf-8');
        existing.modifiedAt = new Date().toISOString();
      } else {
        list.push({
          name,
          type: 'file',
          size: Buffer.byteLength(content, 'utf-8'),
          content,
          modifiedAt: new Date().toISOString(),
        });
      }
      const fileItem = list.find(i => i.name.toLowerCase() === name.toLowerCase())!;
      const successMsg = `✅ Tayyor, ser! ${location === 'Desktop' ? 'Ish stolingizda' : location + 'da'} "${name}" fayli yaratildi.`;
      return res.json({
        success: true,
        message: successMsg,
        isRealWindows: false,
        path: getDisplayPath(name),
        createdFile: {
          name: fileItem.name,
          content: fileItem.content,
          size: fileItem.size,
          location,
        },
      });
    }

    case 'create_folder': {
      if (!name) return res.status(400).json({ success: false, message: 'Papka nomi kiritilmadi' });
      const existing = list.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (!existing) {
        list.push({
          name,
          type: 'folder',
          size: 0,
          content: '',
          modifiedAt: new Date().toISOString(),
        });
      }
      return res.json({
        success: true,
        message: `✅ Tayyor, ser! "${name}" papkasi yaratildi.`,
        isRealWindows: false,
        path: getDisplayPath(name),
      });
    }

    case 'list_files': {
      const currentItems = list.map(i => ({
        name: i.name,
        type: i.type,
        size: i.size,
        modifiedAt: i.modifiedAt,
      }));

      const allItems: any[] = [];
      for (const [locKey, locList] of Object.entries(sandboxStorage)) {
        locList.forEach(item => {
          allItems.push({
            name: item.name,
            type: item.type,
            size: item.size,
            modifiedAt: item.modifiedAt,
            location: locKey,
          });
        });
      }

      const items = (currentItems.length > 0 || allItems.length === 0) ? currentItems : allItems;
      let formatted = `Tayyor, ser! ${location === 'Desktop' ? 'Kompyuteringizda' : location + 'da'} ${items.length} ta fayl topildi:\n\n`;
      if (items.length === 0) {
        formatted = `Hozircha kompyuteringizda birorta ham fayl yaratilmagan, ser.\nFayl yaratish uchun: "test.txt yarat" deb buyruq bering.`;
      } else {
        formatted += items.map(it => `${it.type === 'folder' ? '📁' : '📄'} ${it.name}${it.location && it.location !== location ? ` (${it.location})` : ''}`).join('\n');
      }

      return res.json({
        success: true,
        message: formatted,
        items,
        isRealWindows: false,
        path: `C:\\Users\\JARVIS_User\\${location}`,
      });
    }

    case 'open_file': {
      let item: any = null;
      let foundLocation = location;
      const targetName = (name || '').trim();

      if (targetName && targetName !== 'fayl' && targetName !== 'fayllar') {
        item = list.find(i => i.name.toLowerCase() === targetName.toLowerCase());
      }

      if (!item && targetName && targetName !== 'fayl' && targetName !== 'fayllar') {
        for (const [locKey, locList] of Object.entries(sandboxStorage)) {
          const found = locList.find(i => i.name.toLowerCase() === targetName.toLowerCase());
          if (found) {
            item = found;
            foundLocation = locKey;
            break;
          }
        }
      }

      if (!item) {
        for (const [locKey, locList] of Object.entries(sandboxStorage)) {
          if (locList.length > 0) {
            item = locList[locList.length - 1];
            foundLocation = locKey;
            break;
          }
        }
      }

      if (!item) {
        return res.json({
          success: false,
          message: targetName && targetName !== 'fayl'
            ? `❌ "${targetName}" fayli topilmadi, ser.`
            : `❌ Ochish uchun birorta fayl topilmadi, ser.`,
          isRealWindows: false,
        });
      }

      return res.json({
        success: true,
        message: `✅ Tayyor, ser! "${item.name}" fayli ochildi (${foundLocation} papkasida).`,
        isRealWindows: false,
        content: item.content || '',
        createdFile: {
          name: item.name,
          content: item.content || '',
          location: foundLocation,
          size: item.size,
        },
      });
    }

    case 'open_folder': {
      return res.json({
        success: true,
        message: `✅ Tayyor, ser! ${location === 'Desktop' ? 'Ish stoli' : location} papkasi ochildi.`,
        isRealWindows: false,
      });
    }

    case 'rename_file': {
      const item = list.find(i => i.name.toLowerCase() === (oldName || '').toLowerCase());
      if (!item) {
        return res.json({
          success: false,
          message: `❌ ${oldName} topilmadi, ser.`,
          isRealWindows: false,
        });
      }
      item.name = newName;
      item.modifiedAt = new Date().toISOString();
      return res.json({
        success: true,
        message: `✅ Bajarildi, ser! Fayl nomi ${newName} qilib o‘zgartirildi.`,
        isRealWindows: false,
      });
    }

    case 'delete_file': {
      const idx = list.findIndex(i => i.name.toLowerCase() === (name || '').toLowerCase());
      if (idx === -1) {
        return res.json({
          success: false,
          message: `❌ ${name} topilmadi, ser.`,
          isRealWindows: false,
        });
      }
      list.splice(idx, 1);
      return res.json({
        success: true,
        message: `✅ Bajarildi, ser! ${name} muvaffaqiyatli o'chirildi.`,
        isRealWindows: false,
      });
    }

    default:
      return res.status(400).json({ error: 'Noma\'lum amal' });
  }
});

// Direct serving and download for standalone jarvis.html
app.get('/jarvis.html', (req, res) => {
  const localPublic = path.join(process.cwd(), 'public', 'jarvis.html');
  if (fs.existsSync(localPublic)) {
    return res.sendFile(localPublic);
  }
  const distFile = path.join(process.cwd(), 'dist', 'jarvis.html');
  if (fs.existsSync(distFile)) {
    return res.sendFile(distFile);
  }
  res.status(404).send('jarvis.html topilmadi');
});

app.get('/api/download/jarvis.html', (req, res) => {
  const localPublic = path.join(process.cwd(), 'public', 'jarvis.html');
  if (fs.existsSync(localPublic)) {
    return res.download(localPublic, 'jarvis.html');
  }
  res.status(404).send('jarvis.html topilmadi');
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JARVIS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
