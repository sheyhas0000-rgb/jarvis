/**
 * JARVIS Local Windows Agent
 * Port: 8765 (http://127.0.0.1:8765)
 * 
 * Ushbu skript foydalanuvchining Windows kompyuterida mahalliy ishlaydi
 * va JARVIS veb interfeysidan kelgan xavfsiz buyruqlarni haqiqiy Windows
 * fayl tizimida bajaradi.
 * 
 * Standart Node.js kutubxonalaridan foydalanadi (hech qanday qo'shimcha npm o'rnatish shart emas!).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = 8765;
const HOST = '127.0.0.1';

// Foydalanuvchi asosiy papkasi (masalan: C:\Users\<USERNAME> yoki /Users/<USERNAME>)
const USER_HOME = os.homedir();
const isMac = os.platform() === 'darwin';

// Ruxsat berilgan xavfsiz papkalar (macOS va Windows uchun)
const ALLOWED_DIRECTORIES = {
  Desktop: path.join(USER_HOME, 'Desktop'),
  Documents: path.join(USER_HOME, 'Documents'),
  Downloads: path.join(USER_HOME, 'Downloads'),
  Pictures: path.join(USER_HOME, 'Pictures'),
  Videos: isMac ? path.join(USER_HOME, 'Movies') : path.join(USER_HOME, 'Videos'),
};

// Papkalarning mavjudligini tekshirish va yo'q bo'lsa yaratish
for (const [key, dirPath] of Object.entries(ALLOWED_DIRECTORIES)) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (e) {
      console.warn(`[JARVIS] Papka tekshiruvida ogohlantirish: ${dirPath}`, e.message);
    }
  }
}

/**
 * Xavfsiz yo'lni tekshirish va hosil qilish (Path traversal himoyasi)
 */
function resolveSafePath(locationKey, subName = '') {
  const baseDir = ALLOWED_DIRECTORIES[locationKey];
  if (!baseDir) {
    throw new Error(`Ruxsat berilmagan joy: "${locationKey}". Faqat ruxsat etilgan papkalar: ${Object.keys(ALLOWED_DIRECTORIES).join(', ')}`);
  }

  // Tozalash va tekshirish
  const cleanSub = path.normalize(subName).replace(/^(\.\.[\/\\])+/, '');
  const resolved = path.resolve(baseDir, cleanSub);

  // Yo'l ruxsat etilgan asosiy papka ichida bo'lishi shart!
  if (!resolved.startsWith(baseDir)) {
    throw new Error(`Xavfsizlik xatosi: Yo'ldan tashqariga chiqish taqiqlangan (Path traversal blocked)!`);
  }

  return { baseDir, resolved };
}

/**
 * CORS sarlavhalari (Private Network Access Chrome/macOS uchun qo'llab-quvvatlanadi)
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Request-Private-Network');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
}

/**
 * JSON javob qaytarish
 */
function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Buyruqlarni bajaruvchi asosiy handler
 */
function handleExecute(actionData) {
  const { action, location, name, content, oldName, newName } = actionData;

  switch (action) {
    case 'create_file': {
      if (!name) throw new Error("Fayl nomi ko'rsatilmadi.");
      const { resolved } = resolveSafePath(location, name);

      // Faylga yozish
      const fileContent = typeof content === 'string' ? content : '';
      fs.writeFileSync(resolved, fileContent, 'utf-8');

      // Haqiqatda mavjudligini tekshirish (Do not fake success!)
      if (!fs.existsSync(resolved)) {
        throw new Error(`Faylni yaratib bo'lmadi: ${resolved}`);
      }

      const stat = fs.statSync(resolved);
      return {
        success: true,
        message: `✅ Tayyor. ${location === 'Desktop' ? 'Ish stolingizda' : location + 'da'} ${name} fayli yaratildi.`,
        path: resolved,
        size: stat.size,
      };
    }

    case 'create_folder': {
      if (!name) throw new Error("Papka nomi ko'rsatilmadi.");
      const { resolved } = resolveSafePath(location, name);

      fs.mkdirSync(resolved, { recursive: true });

      if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
        throw new Error(`Papkani yaratib bo'lmadi: ${resolved}`);
      }

      return {
        success: true,
        message: `✅ ${name} papkasi yaratildi.`,
        path: resolved,
      };
    }

    case 'list_files': {
      const { resolved } = resolveSafePath(location, '');
      if (!fs.existsSync(resolved)) {
        return {
          success: true,
          message: `${location} papkasi bo'sh.`,
          items: [],
        };
      }

      const entries = fs.readdirSync(resolved, { withFileTypes: true });
      const items = entries.map(entry => {
        const itemPath = path.join(resolved, entry.name);
        let size = 0;
        let modifiedAt = new Date().toISOString();
        try {
          const st = fs.statSync(itemPath);
          size = st.size;
          modifiedAt = st.mtime.toISOString();
        } catch (e) {}

        return {
          name: entry.name,
          type: entry.isDirectory() ? 'folder' : 'file',
          size,
          modifiedAt,
          extension: entry.isDirectory() ? '' : path.extname(entry.name),
        };
      });

      // Formatlangan Uzbekcha javob
      let formattedMsg = `${location === 'Desktop' ? 'Ish stolingizda' : location + 'da'} ${items.length} ta obyekt bor:\n\n`;
      if (items.length === 0) {
        formattedMsg = `${location === 'Desktop' ? 'Ish stolingiz' : location} hozircha bo'sh.`;
      } else {
        formattedMsg += items
          .slice(0, 20)
          .map(it => `${it.type === 'folder' ? '📁' : '📄'} ${it.name}`)
          .join('\n');
        if (items.length > 20) {
          formattedMsg += `\n... va yana ${items.length - 20} ta`;
        }
      }

      return {
        success: true,
        message: formattedMsg,
        items,
        path: resolved,
      };
    }

    case 'open_file': {
      if (!name) throw new Error("Ochish uchun fayl nomi ko'rsatilmadi.");
      const { resolved } = resolveSafePath(location, name);

      // Agar mavjud bo'lmasa, hech qachon yolg'on muvaffaqiyat ko'rsatma!
      if (!fs.existsSync(resolved)) {
        return {
          success: false,
          message: `❌ ${name} topilmadi.`,
          error: `${name} fayli mavjud emas`,
        };
      }

      // Windows tizimida ochish
      const platform = os.platform();
      let openCommand = '';
      if (platform === 'win32') {
        openCommand = `start "" "${resolved}"`;
      } else if (platform === 'darwin') {
        openCommand = `open "${resolved}"`;
      } else {
        openCommand = `xdg-open "${resolved}"`;
      }

      exec(openCommand, (err) => {
        if (err) {
          console.error('[JARVIS Agent] Faylni ochishda xato:', err);
        }
      });

      return {
        success: true,
        message: `✅ ${name} fayli ochildi.`,
        path: resolved,
      };
    }

    case 'open_folder': {
      const { resolved } = resolveSafePath(location, name || '');
      if (!fs.existsSync(resolved)) {
        return {
          success: false,
          message: `❌ ${location} papkasi topilmadi.`,
        };
      }

      const platform = os.platform();
      let cmd = '';
      if (platform === 'win32') {
        cmd = `explorer "${resolved}"`;
      } else if (platform === 'darwin') {
        cmd = `open "${resolved}"`;
      } else {
        cmd = `xdg-open "${resolved}"`;
      }

      exec(cmd, (err) => {
        if (err) {
          console.error('[JARVIS Agent] Papkani ochishda xato:', err);
        }
      });

      return {
        success: true,
        message: `✅ ${location === 'Desktop' ? 'Ish stoli' : location} papkasi ochildi.`,
        path: resolved,
      };
    }

    case 'rename_file': {
      if (!oldName || !newName) throw new Error("Eski va yangi nom ko'rsatilishi shart.");
      const { resolved: oldResolved } = resolveSafePath(location, oldName);
      const { resolved: newResolved } = resolveSafePath(location, newName);

      if (!fs.existsSync(oldResolved)) {
        return {
          success: false,
          message: `❌ ${oldName} topilmadi.`,
        };
      }

      if (fs.existsSync(newResolved)) {
        return {
          success: false,
          message: `❌ Fayl nomini o'zgartirib bo'lmadi.\nSabab: "${newName}" nomli fayl allaqachon mavjud.`,
        };
      }

      fs.renameSync(oldResolved, newResolved);

      // Tekshirish
      if (!fs.existsSync(newResolved)) {
        throw new Error(`Fayl nomini o'zgartirish muvaffaqiyatsiz tugadi.`);
      }

      return {
        success: true,
        message: `✅ Fayl nomi ${newName} qilib o‘zgartirildi.`,
        oldPath: oldResolved,
        newPath: newResolved,
      };
    }

    case 'delete_file': {
      if (!name) throw new Error("O'chirish uchun fayl ko'rsatilmadi.");
      const { resolved } = resolveSafePath(location, name);

      if (!fs.existsSync(resolved)) {
        return {
          success: false,
          message: `❌ ${name} topilmadi.`,
        };
      }

      const stat = fs.statSync(resolved);
      if (stat.isDirectory()) {
        fs.rmSync(resolved, { recursive: true, force: true });
      } else {
        fs.unlinkSync(resolved);
      }

      // Haqiqiy o'chirilganini tekshirish
      if (fs.existsSync(resolved)) {
        throw new Error(`Faylni o'chirib bo'lmadi.`);
      }

      return {
        success: true,
        message: `✅ ${name} muvaffaqiyatli o'chirildi.`,
      };
    }

    case 'open_website': {
      const targetUrl = actionData.url || 'https://www.youtube.com';
      const platform = os.platform();
      let openCmd = '';
      if (platform === 'darwin') {
        openCmd = `open "${targetUrl}"`;
      } else if (platform === 'win32') {
        openCmd = `start "" "${targetUrl}"`;
      } else {
        openCmd = `xdg-open "${targetUrl}"`;
      }
      exec(openCmd, (err) => {
        if (err) console.error('[JARVIS Agent] Sayt ochishda xato:', err);
      });
      return {
        success: true,
        message: `✅ ${actionData.title || 'Sayt'} Mac/tizim brauzerida ochildi: ${targetUrl}`,
        url: targetUrl,
      };
    }

    default:
      throw new Error(`Noma'lum harakat: ${action}`);
  }
}

// HTTP Server yaratish
const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Status & Health check
  if ((req.url === '/health' || req.url === '/status') && req.method === 'GET') {
    const userInfo = os.userInfo();
    sendJson(res, 200, {
      status: 'ok',
      agent: isMac ? 'JARVIS macOS Agent' : (os.platform() === 'win32' ? 'JARVIS Windows Agent' : 'JARVIS Linux Agent'),
      version: '1.2.0',
      platform: os.platform(),
      platformName: isMac ? 'macOS' : (os.platform() === 'win32' ? 'Windows' : 'Linux'),
      username: userInfo.username,
      hostname: os.hostname(),
      homeDir: USER_HOME,
      allowedPaths: ALLOWED_DIRECTORIES,
      uptime: process.uptime(),
      time: new Date().toISOString(),
    });
    return;
  }

  // 2. Buyruqni bajarish: POST /execute
  if (req.url === '/execute' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy(); // Katta so'rovlardan himoya
      }
    });

    req.on('end', () => {
      try {
        const actionData = JSON.parse(body || '{}');
        console.log(`[JARVIS Agent] Buyruq qabul qilindi: ${actionData.action} ->`, actionData);

        const result = handleExecute(actionData);
        sendJson(res, 200, {
          ...result,
          isRealWindows: true,
        });
      } catch (err) {
        console.error('[JARVIS Agent] Xatolik:', err.message);
        sendJson(res, 400, {
          success: false,
          message: `❌ Xatolik yuz berdi: ${err.message}`,
          error: err.message,
          isRealWindows: true,
        });
      }
    });
    return;
  }

  sendJson(res, 404, { error: 'Topilmadi' });
});

server.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log('       🤖 JARVIS LOCAL WINDOWS AGENT ISHLAYAPTI       ');
  console.log('====================================================');
  console.log(`Manzil: http://${HOST}:${PORT}`);
  console.log(`Foydalanuvchi: ${os.userInfo().username}`);
  console.log(`Windows platformasi: ${os.platform()}`);
  console.log('Ruxsat etilgan papkalar:');
  for (const [name, p] of Object.entries(ALLOWED_DIRECTORIES)) {
    console.log(`  ✓ ${name}: ${p}`);
  }
  console.log('----------------------------------------------------');
  console.log('JARVIS veb-interfeysi bilan bog\'lanishga tayyor.');
  console.log('Ushbu oynani yopmang!');
  console.log('====================================================');
});
