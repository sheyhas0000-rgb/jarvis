import { CommandExecutionResult, LocalCommandDefinition, ApprovedLocation, FileItem } from '../types';
import { StorageService } from '../services/storageService';

export const FILE_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'file_create',
    name: 'Fayl yaratish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['fayl yarat', 'yarat', 'matn yarat', 'hujjat yarat', 'yoz', 'fayl och'],
    description: 'Ruxsat etilgan papkalarda (.txt, .bat, .json, .md) yangi matnli fayl yaratadi.',
    example: 'Desktopda test.txt yarat',
    requiresPermission: 'file_access',
  },
  {
    id: 'file_create_folder',
    name: 'Papka yaratish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['papka yarat', 'folder yarat', 'yangi papka'],
    description: 'Yangi lokal katalog / papka yaratadi.',
    example: 'Desktopda Yangi_Papka yarat',
    requiresPermission: 'file_access',
  },
  {
    id: 'file_list',
    name: 'Fayllar ro‘yxatini ko‘rish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['fayllarni korsat', "fayllarni ko'rsat", 'fayllar royxati', "fayllar ro'yxati", 'fayllar', 'fayllarni och'],
    description: 'Papka ichidagi fayl va kataloglar ro‘yxatini ko‘rsatadi.',
    example: 'Fayllarni ko‘rsat',
    requiresPermission: 'file_access',
  },
  {
    id: 'file_open',
    name: 'Faylni ochish / o‘qish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['faylni och', 'hujjatni och', 'matnni och', 'faylni oqi', "faylni o'qi"],
    description: 'Mavjud faylni ochadi va uning tarkibini ko‘rsatadi.',
    example: 'test.txt faylini och',
    requiresPermission: 'file_access',
  },
  {
    id: 'file_delete',
    name: 'Faylni o‘chirish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['faylni ochir', "faylni o'chir", 'faylni o‘chir', 'ochir', "o'chir", 'delete'],
    description: 'Ko‘rsatilgan faylni lokal papkadan butunlay o‘chiradi.',
    example: 'test.txt faylini o‘chir',
    requiresPermission: 'file_delete',
    dangerous: true,
  },
  {
    id: 'file_rename',
    name: 'Fayl nomini o‘zgartirish',
    category: 'files',
    pluginId: 'file_plugin',
    keywords: ['nomini ozgartir', "nomini o'zgartir", 'rename', 'qayta nomla'],
    description: 'Fayl nomini yangi nomga o‘zgartiradi.',
    example: 'test.txt nomini demo.txt ga o‘zgartir',
    requiresPermission: 'file_access',
  },
];

export async function executeFileCommand(commandId: string, args: Record<string, any>): Promise<CommandExecutionResult> {
  const filesMap = StorageService.getFiles();
  const location: ApprovedLocation = args.location || 'Desktop';
  const list = filesMap[location] || [];

  switch (commandId) {
    case 'file_create': {
      const name = args.name || 'yangi_fayl.txt';
      const content = args.content || `JARVIS Local Desktop Agent tomonidan yaratildi.\nSana: ${new Date().toLocaleString()}`;
      
      const existingIdx = list.findIndex(f => f.name.toLowerCase() === name.toLowerCase());
      const newFileItem: FileItem = {
        name,
        type: 'file',
        size: content.length,
        sizeFormatted: `${content.length} B`,
        modifiedAt: new Date().toLocaleDateString(),
        location,
        content,
      };

      if (existingIdx !== -1) {
        list[existingIdx] = newFileItem;
      } else {
        list.push(newFileItem);
      }
      filesMap[location] = list;
      StorageService.saveFiles(filesMap);

      // Trigger actual browser client download so it appears in real Windows Downloads/Desktop
      try {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {}

      return {
        success: true,
        message: `✅ Bajarildi, ser! "${name}" fayli ${location} papkasida yaratildi va kompyuteringizga yuklandi.`,
        details: `Joylashuv: C:\\Users\\User\\${location}\\${name}\nHajmi: ${content.length} bayt\nTarkib:\n${content.slice(0, 150)}${content.length > 150 ? '...' : ''}`,
        createdFile: {
          name,
          content,
          size: content.length,
          location,
        },
        windowsCommand: `type nul > "C:\\Users\\User\\${location}\\${name}"`,
      };
    }

    case 'file_create_folder': {
      const name = args.name || 'Yangi_Papka';
      const existing = list.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (!existing) {
        list.push({
          name,
          type: 'folder',
          size: 0,
          sizeFormatted: '0 B',
          modifiedAt: new Date().toLocaleDateString(),
          location,
        });
        filesMap[location] = list;
        StorageService.saveFiles(filesMap);
      }

      return {
        success: true,
        message: `📁 Bajarildi, ser! "${name}" papkasi ${location} da yaratildi.`,
        details: `Joylashuv: C:\\Users\\User\\${location}\\${name}`,
        windowsCommand: `mkdir "C:\\Users\\User\\${location}\\${name}"`,
      };
    }

    case 'file_list': {
      let allItems: FileItem[] = [];
      if (args.allLocations) {
        for (const loc of Object.keys(filesMap) as ApprovedLocation[]) {
          allItems = allItems.concat(filesMap[loc]);
        }
      } else {
        allItems = list;
      }

      let formattedText = `📂 ${location} papkasida ${allItems.length} ta fayl mavjud:\n\n`;
      if (allItems.length === 0) {
        formattedText = `📂 ${location} papkasi hozircha bo‘sh, ser.\nFayl yaratish uchun: "Desktopda test.txt yarat" deb buyruq bering.`;
      } else {
        formattedText += allItems
          .map(f => `${f.type === 'folder' ? '📁' : '📄'} ${f.name} (${f.sizeFormatted || '0 B'})`)
          .join('\n');
      }

      return {
        success: true,
        message: formattedText,
        fileItems: allItems,
        details: `Jami fayllar soni: ${allItems.length}`,
        windowsCommand: `dir "C:\\Users\\User\\${location}"`,
      };
    }

    case 'file_open': {
      const targetName = (args.name || '').trim().toLowerCase();
      let found: FileItem | undefined;
      let foundLoc = location;

      if (targetName && targetName !== 'fayl') {
        found = list.find(f => f.name.toLowerCase() === targetName);
        if (!found) {
          // search all
          for (const loc of Object.keys(filesMap) as ApprovedLocation[]) {
            const match = filesMap[loc].find(f => f.name.toLowerCase() === targetName);
            if (match) {
              found = match;
              foundLoc = loc;
              break;
            }
          }
        }
      } else {
        found = list[list.length - 1];
      }

      if (!found) {
        return {
          success: false,
          message: `❌ Ko‘rsatilgan fayl topilmadi, ser.\nMavjud fayllarni ko‘rish uchun: "Fayllarni ko‘rsat" deb yozing.`,
        };
      }

      return {
        success: true,
        message: `📄 Bajarildi, ser! "${found.name}" fayli ochildi (${foundLoc} papkasida).`,
        details: `Tarkibi:\n${found.content || '(Bo‘sh fayl)'}`,
        createdFile: {
          name: found.name,
          content: found.content || '',
          size: found.size || 0,
          location: foundLoc,
        },
        windowsCommand: `notepad.exe "C:\\Users\\User\\${foundLoc}\\${found.name}"`,
      };
    }

    case 'file_delete': {
      const targetName = (args.name || '').trim().toLowerCase();
      let targetLoc = location;
      let idx = list.findIndex(f => f.name.toLowerCase() === targetName);

      if (idx === -1) {
        for (const loc of Object.keys(filesMap) as ApprovedLocation[]) {
          const checkIdx = filesMap[loc].findIndex(f => f.name.toLowerCase() === targetName);
          if (checkIdx !== -1) {
            targetLoc = loc;
            idx = checkIdx;
            break;
          }
        }
      }

      if (idx === -1) {
        return {
          success: false,
          message: `❌ "${args.name || 'fayl'}" topilmadi, ser.`,
        };
      }

      const deleted = filesMap[targetLoc].splice(idx, 1)[0];
      StorageService.saveFiles(filesMap);

      return {
        success: true,
        message: `🗑️ Bajarildi, ser! "${deleted.name}" fayli muvaffaqiyatli o‘chirildi.`,
        details: `Joylashuv: C:\\Users\\User\\${targetLoc}\\${deleted.name}`,
        windowsCommand: `del /f /q "C:\\Users\\User\\${targetLoc}\\${deleted.name}"`,
      };
    }

    case 'file_rename': {
      const oldName = (args.oldName || '').trim().toLowerCase();
      const newName = (args.newName || '').trim();
      const idx = list.findIndex(f => f.name.toLowerCase() === oldName);

      if (idx === -1) {
        return {
          success: false,
          message: `❌ "${args.oldName}" fayli topilmadi, ser.`,
        };
      }

      list[idx].name = newName;
      filesMap[location] = list;
      StorageService.saveFiles(filesMap);

      return {
        success: true,
        message: `✏️ Bajarildi, ser! Fayl nomi "${newName}" qilib o‘zgartirildi.`,
        details: `Oldingi nom: ${args.oldName} -> Yangi nom: ${newName}`,
        windowsCommand: `ren "C:\\Users\\User\\${location}\\${args.oldName}" "${newName}"`,
      };
    }

    default:
      return {
        success: false,
        message: '❌ Noma\'lum fayl amali.',
      };
  }
}
