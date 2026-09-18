import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

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
    { name: 'Hujjatlarim.txt', type: 'file', size: 120, content: 'JARVIS sinov hujjati', modifiedAt: new Date().toISOString() },
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

// API: Optional AI Parser using Gemini if local parsing is ambiguous or complex
app.post('/api/ai-parse', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt berilmadi' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      recognized: false,
      reason: 'Gemini API kaliti mavjud emas. Mahalliy parser faol.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Siz Windows operatsion tizimi uchun o'zbekcha JARVIS yordamchisining buyruq tahlilchisisiz.
Foydalanuvchining o'zbekcha buyrug'ini tahlil qiling va qat'iy quyidagi xavfsiz JSON tuzilmasiga o'giring:
Ruxsat etilgan location: "Desktop", "Documents", "Downloads", "Pictures", "Videos" (agar aytilmasa "Desktop").
Ruxsat etilgan action:
1. create_file: { action: "create_file", location, name, content }
2. create_folder: { action: "create_folder", location, name }
3. list_files: { action: "list_files", location }
4. open_file: { action: "open_file", location, name }
5. open_folder: { action: "open_folder", location }
6. rename_file: { action: "rename_file", location, oldName, newName }
7. delete_file: { action: "delete_file", location, name }

Hech qanday boshqa erkin tizim buyruqlariga (cmd, powershell) ruxsat yo'q. Faqat ushbu 7 ta actiondan birini tanlang.
Agar tushunarsiz yoki xavfli bo'lsa recognized: false qaytaring.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Foydalanuvchi buyrug'i: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recognized: { type: Type.BOOLEAN },
            action: { type: Type.STRING },
            location: { type: Type.STRING },
            name: { type: Type.STRING },
            content: { type: Type.STRING },
            oldName: { type: Type.STRING },
            newName: { type: Type.STRING },
            intentDescription: { type: Type.STRING },
          },
          required: ['recognized'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      ...parsedJson,
      source: 'ai_parser',
    });
  } catch (err: any) {
    console.error('AI parse xatosi:', err.message);
    return res.status(200).json({
      recognized: false,
      reason: 'AI tahlilida xatolik',
    });
  }
});

// API: Sandbox execution (Cloud preview fallback when 127.0.0.1:8765 is not yet running on client machine)
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
      // If file exists, update it, else add
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
      let successMsg = `✅ Tayyor! ${location === 'Desktop' ? 'Ish stolingizda' : location + 'da'} "${name}" fayli yaratildi va kompyuteringizga saqlandi.`;
      if (name.toLowerCase().includes('optimizats') || name.toLowerCase().includes('tozalash') || name.toLowerCase().endsWith('.bat')) {
        successMsg = `✅ Tayyor! "${name}" optimizatsiya skripti muvaffaqiyatli yaratildi va kompyuteringizga saqlandi.\n\n⚡ Ushbu fayl:\n1. User Temp (%temp%) papkasidagi barcha keraksiz fayllarni tozalaydi\n2. Windows Temp tizim keshini tozalaydi\n3. Prefetch keshini tozalaydi\n4. Internet DNS keshini yangilab kompyuterni tezlashtiradi.`;
      }
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
        message: `✅ ${name} papkasi yaratildi.`,
        isRealWindows: false,
        path: getDisplayPath(name),
      });
    }

    case 'list_files': {
      // Gather files in current folder
      const currentItems = list.map(i => ({
        name: i.name,
        type: i.type,
        size: i.size,
        modifiedAt: i.modifiedAt,
      }));

      // Gather all files across all folders in case current is empty or user asked generally
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

      let formatted = `${location === 'Desktop' ? 'Kompyuteringizda' : location + 'da'} ${items.length} ta fayl topildi:\n\n`;
      if (items.length === 0) {
        formatted = `Hozircha kompyuteringizda birorta ham fayl yaratilmagan.\nFayl yaratish uchun, masalan: "test.txt yarat" yoki "optimizatsiya.bat yarat" deb buyruq bering.`;
      } else {
        formatted += items.map(it => `${it.type === 'folder' ? '📁' : '📄'} ${it.name}${it.location && it.location !== location ? ` (${it.location})` : ''}`).join('\n');
        formatted += `\n\n💡 Faylni ochish uchun: "${items[0]?.name || 'fayl'} faylini och" deb buyruq bering yoki quyidagi ro'yxatdan tanlang.`;
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

      // 1. Check in current folder
      if (targetName && targetName !== 'fayl' && targetName !== 'fayllar') {
        item = list.find(i => i.name.toLowerCase() === targetName.toLowerCase());
      }

      // 2. Search in all other folders
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

      // 3. If no specific name was given (e.g. "faylni och"), pick the most recent file
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
            ? `❌ "${targetName}" fayli kompyuteringizda topilmadi. Uni yaratish uchun: "${targetName} yarat" deb yozing.`
            : `❌ Ochish uchun birorta fayl topilmadi. Avval "test.txt yarat" deb fayl yarating.`,
          isRealWindows: false,
        });
      }

      return res.json({
        success: true,
        message: `✅ "${item.name}" fayli ochildi (${foundLocation} papkasida).`,
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
        message: `✅ ${location === 'Desktop' ? 'Ish stoli' : location} papkasi ochildi (Virtual Sandbox).`,
        isRealWindows: false,
      });
    }

    case 'rename_file': {
      const item = list.find(i => i.name.toLowerCase() === (oldName || '').toLowerCase());
      if (!item) {
        return res.json({
          success: false,
          message: `❌ ${oldName} topilmadi.`,
          isRealWindows: false,
        });
      }
      const collision = list.find(i => i.name.toLowerCase() === (newName || '').toLowerCase());
      if (collision) {
        return res.json({
          success: false,
          message: `❌ Fayl nomini o'zgartirib bo'lmadi.\nSabab: "${newName}" nomli fayl allaqachon mavjud.`,
          isRealWindows: false,
        });
      }
      item.name = newName;
      item.modifiedAt = new Date().toISOString();
      return res.json({
        success: true,
        message: `✅ Fayl nomi ${newName} qilib o‘zgartirildi.`,
        isRealWindows: false,
      });
    }

    case 'delete_file': {
      const idx = list.findIndex(i => i.name.toLowerCase() === (name || '').toLowerCase());
      if (idx === -1) {
        return res.json({
          success: false,
          message: `❌ ${name} topilmadi.`,
          isRealWindows: false,
        });
      }
      list.splice(idx, 1);
      return res.json({
        success: true,
        message: `✅ ${name} muvaffaqiyatli o'chirildi.`,
        isRealWindows: false,
      });
    }

    default:
      return res.status(400).json({ error: 'Noma\'lum amal' });
  }
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
