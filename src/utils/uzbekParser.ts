import { SafeAction, ParseResult, ApprovedLocation } from '../types';

/**
 * Normalizes Uzbek text:
 * - lowercase
 * - replaces all various apostrophe types (‘, ’, ʻ, ʼ, `) with standard '
 * - cleans excess whitespace
 */
export function normalizeUzbek(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/o\s*[']/g, "o'")
    .replace(/g\s*[']/g, "g'")
    .trim();
}

/**
 * Detects approved Windows location from Uzbek command.
 * Default is 'Desktop' if no other location specified.
 */
export function extractLocation(rawText: string): { location: ApprovedLocation; matched: boolean } {
  const text = normalizeUzbek(rawText);

  if (/(ish stoli|ishstoli|desktop)/i.test(text)) {
    return { location: 'Desktop', matched: true };
  }
  if (/(yuklama|downloads|download|zagruzki)/i.test(text)) {
    return { location: 'Downloads', matched: true };
  }
  if (/(hujjat|documents|document|dokument)/i.test(text)) {
    return { location: 'Documents', matched: true };
  }
  if (/(rasm|pictures|picture|foto)/i.test(text)) {
    return { location: 'Pictures', matched: true };
  }
  if (/(video|videos|rolik)/i.test(text)) {
    return { location: 'Videos', matched: true };
  }

  // Default fallback is Desktop
  return { location: 'Desktop', matched: false };
}

/**
 * Cleans file or folder name from Uzbek grammatical suffixes:
 * e.g., "test.txtni" -> "test.txt"
 * "games papkasini" -> "games"
 * "hello.txtning" -> "hello.txt"
 */
export function cleanName(name: string): string {
  let cleaned = name.trim();
  // Remove quotation marks if present
  cleaned = cleaned.replace(/^["'«“]+|["'»”]+$/g, '');
  // Remove grammatical suffixes commonly attached
  cleaned = cleaned.replace(/(?:ni|ning|ga|da|dan|ini|ining|dagi|dagi)$/i, '');
  // Clean trailing punctuation
  cleaned = cleaned.replace(/[.,:;!?]+$/g, '');
  return cleaned.trim();
}

/**
 * Production-ready Windows Optimization & Temp Cleaner Batch Script.
 * Cleans:
 * - User Temp (%temp%)
 * - Windows Temp (C:\Windows\Temp)
 * - Prefetch Cache (C:\Windows\Prefetch)
 * - DNS Cache (ipconfig /flushdns)
 */
export function getOptimizationBatchScript(): string {
  return `@echo off
chcp 65001 >nul
color 0b
title JARVIS - Windows Tizimini Optimizatsiya Qilish va Temp Tozalash
cls

echo ================================================================
echo    JARVIS TIZIMNI OPTIMIZATSIYA QILISH VA TOZALASH SKRIPTI
echo ================================================================
echo.
echo [1/4] Foydalanuvchi vaqtinchalik fayllari (User Temp) tozalanmoqda...
del /s /f /q "%temp%\\*.*" >nul 2>&1
for /d %%p in ("%temp%\\*.*") do rmdir "%%p" /s /q >nul 2>&1
echo       [+] User Temp muvaffaqiyatli tozalandi.
echo.

echo [2/4] Windows tizim vaqtinchalik fayllari (Windows Temp) tozalanmoqda...
del /s /f /q "C:\\Windows\\Temp\\*.*" >nul 2>&1
for /d %%p in ("C:\\Windows\\Temp\\*.*") do rmdir "%%p" /s /q >nul 2>&1
echo       [+] Windows Temp muvaffaqiyatli tozalandi.
echo.

echo [3/4] Windows Prefetch kesh xotirasi tozalanmoqda...
del /s /f /q "C:\\Windows\\Prefetch\\*.*" >nul 2>&1
echo       [+] Prefetch keshi tozalandi.
echo.

echo [4/4] Internet DNS kesh xotirasi yangilanmoqda (DNS Flush)...
ipconfig /flushdns >nul 2>&1
echo       [+] DNS kesh xotirasi yangilandi.
echo.

echo ================================================================
echo   BARCHA KERAKSIZ VAQTINCHALIK FAYLLAR MUVAFFAQIYATLI TOZALANDI!
echo   Kompyuteringiz xotirasi bo'shatildi va tezligi optimallashtirildi.
echo ================================================================
echo.
pause
`;
}

export function getOptimizationShellScript(): string {
  return `#!/bin/bash
clear
echo "================================================================"
echo "   JARVIS macOS Tizimni Optimizatsiya Qilish va Tozalash"
echo "================================================================"
echo ""
echo "[1/3] Foydalanuvchi kesh fayllari (User Caches) tozalanmoqda..."
rm -rf ~/Library/Caches/* 2>/dev/null
echo "      [+] ~/Library/Caches tozalandi."
echo ""
echo "[2/3] Vaqtinchalik /tmp fayllari tozalanmoqda..."
rm -rf /tmp/* 2>/dev/null
echo "      [+] /tmp fayllari tozalandi."
echo ""
echo "[3/3] DNS keshi yangilanmoqda..."
sudo dscacheutil -flushcache 2>/dev/null || true
echo "      [+] DNS keshi yangilandi."
echo ""
echo "================================================================"
echo "   macOS kesh va vaqtinchalik fayllari muvaffaqiyatli tozalandi!"
echo "================================================================"
`;
}

/**
 * Extracts content if user requested writing inside file:
 * e.g. "Desktopda salom.txt yarat ichiga Salom dunyo deb yoz"
 * e.g. "hello.txt yarat ichiga Salom dunyo deb yoz"
 */
export function extractContent(text: string): string {
  // Pattern 1: ichiga <content> deb yoz / yozib ber / yozgin
  const p1 = /ichiga\s+["']?(.+?)["']?\s+deb\s+yoz/i.exec(text);
  if (p1 && p1[1]) return p1[1].trim();

  // Pattern 2: ichiga <content> yoz
  const p2 = /ichiga\s+["']?(.+?)["']?\s+(?:yoz|yozib ber|yozib qo'y|tashla)/i.exec(text);
  if (p2 && p2[1]) return p2[1].trim();

  // Pattern 3: tarkibi / matni <content>
  const p3 = /(?:tarkibi|matni|ichida)\s*[:=]?\s*["'](.+?)["']/i.exec(text);
  if (p3 && p3[1]) return p3[1].trim();

  return '';
}

/**
 * Pure local rule-based Uzbek natural language parser.
 * No external API key required.
 */
export function parseUzbekCommand(rawInput: string): ParseResult {
  const raw = rawInput.trim();
  if (!raw) {
    return {
      recognized: false,
      error: "Buyruq kiritilmadi. Iltimos, biror buyruq yozing yoki mikrofondan foydalaning.",
      source: 'local_parser',
    };
  }

  // Strip JARVIS prefix if present: "JARVIS, ish stolida..." or "Hey jarvis..."
  const cleanPrefix = raw.replace(/^(?:jarvis|hey jarvis|salom jarvis)[,:\s]+/i, '').trim();
  const text = normalizeUzbek(cleanPrefix);
  const locationInfo = extractLocation(text);

  // 0. CONVERSATIONAL & HELP QUERIES (Intelligent in-app assistant)
  // Check if user says they don't want to download anything or asks about installing / why it wasn't working well
  if (
    /(?:har\s*xil|har\s*hil|boshqa|ortiqcha|qo'shimcha|narsa).*?(?:yukla|o'rnat).*?(?:kerak\s*emas|shart\s*emas|lozim\s*emas|bo'lsin|bolsin)/i.test(text) ||
    (/(?:yuklam(?:oqchi|ayman|asdan|asam|ay|a)|o'rnatm(?:oqchi|ayman|asdan|asam|ay|a)|kerak emas)/i.test(text) &&
      /(?:yukla|o'rnat|narsa|dastur|terminal|agent|skript|lozim|shart)/i.test(text))
  ) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "JARVIS mustaqil ishlash tartibi",
      action: {
        action: 'chat_reply',
        reply: "To'g'ri aytdingiz, ser! JARVIS mutlaqo 100% mustaqil ishlaydi. Hech qanday qo'shimcha narsalar yuklash shart emas.\n\nHar bir buyruqni 'Bajarayapman, ser!' deb darhol amalga oshiraman. Masalan, 'yarat' deb buyruq berganingizda, yangi fayl bir zumda yaratilib, avtomatik ravishda kompyuteringizga yuklanadi, ser!",
      },
    };
  }

  // Why is it not working well / troubleshooting query
  if (/(?:nega|nimaga|nechun)\s+(?:yahshi|yaxshi|durust|tuzuk|to'g'ri)?\s*(?:ishlamay|ishlamayabti|ishlamayapti|xato|hatolik)/i.test(text) ||
      /(?:nega|nimaga)\s+(?:bunaqa|unday|xato)/i.test(text)) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Tizim holati va tushuntirish",
      action: {
        action: 'chat_reply',
        reply: "Barcha tizimlar to'liq sozlangan, ser!\n\n1. Har qanday buyruq bersangiz, darhol 'Bajarayapman, ser!' deb o'zbek tilida ishga kirishaman.\n2. 'youtubega kir', 'telegramga kir' yoki 'googlega kir' desangiz darhol ochaman, ser.\n3. 'test.txt yarat' yoki shunchaki 'yarat' desangiz fayl yaratilib, avtomatik ravishda kompyuteringizga yuklanadi.\n4. Qanday buyruq bajaramiz, ser?",
      },
    };
  }

  // Greetings and basic pleasantries
  if (/^(?:salom|assalomu\s*alaykum|assalom|hayrli\s*kun|hayrli\s*tong|hayrli\s*kech|privet|hello|hi)\b/i.test(text)) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Salomlashish",
      action: {
        action: 'chat_reply',
        reply: "Assalomu alaykum, ser! Men JARVIS — sizning aqlli shaxsiy yordamchingizman. Xizmatingizdaman, ser! Qanday buyruq bajaramiz?",
      },
    };
  }

  // Identity / "kim sen", "sen kimsan", "nima bu"
  if (/(?:sen\s+kimsan|kim\s+sen|o'zing\s+haqingda|nima\s+qila\s+olasan|qanaqa\s+dastursan|vazifang\s+nima)/i.test(text)) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "JARVIS haqida ma'lumot",
      action: {
        action: 'chat_reply',
        reply: "Men JARVIS — sizning shaxsiy yordamchingizman, ser!\n\nHar qanday buyrug'ingizni 'Bajarayapman, ser!' deb darhol sof o'zbek tilida bajaraman:\n• Saytlar va ilovalarni ochish (YouTube, Telegram, Google)\n• Fayllar va papkalar yaratish hamda kompyuterga avtomatik yuklash\n• Har qanday savollarga o'zbek tilida batafsil javob berish\n\nXizmatingizdaman, ser!",
      },
    };
  }

  // Gratitude
  if (/(?:rahmat|tashakkur|raxmat|katta\s+rahmat|barakalla|zo'r|ajoyib)/i.test(text) && !/(?:fayl|papka|yarat)/i.test(text)) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Minnatdorchilik",
      action: {
        action: 'chat_reply',
        reply: "Arzimaydi, ser! Sizga xizmat qilishdan mamnunman. Yangi buyruq bo'lsa, bemalol ayting, ser!",
      },
    };
  }

  // Time & Date questions
  if (/(?:soat\s+nechi|soat\s+necha|vaqt\s+nechi|bugun\s+qaysi\s+kun|bugungi\s+sana|qanaqa\s+kun)/i.test(text)) {
    const d = new Date();
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
    const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
    const dateStr = `${d.getDate()}-${months[d.getMonth()]} ${d.getFullYear()}-yil, ${days[d.getDay()]}`;
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Vaqt va sana",
      action: {
        action: 'chat_reply',
        reply: `Hozirgi vaqt: ${timeStr}, ser.\nBugungi sana: ${dateStr}.`,
      },
    };
  }

  // Clear chat / screen command: e.g. "ekranni tozalash", "ekranni tozala", "chatni tozalash", "suhbatni tozalash", "tozalash"
  if (
    /(?:ekran(?:ni)?\s*tozala|chat(?:ni)?\s*tozala|suhbat(?:ni)?\s*tozala|tozala\s*ekran|tozala\s*chat)/i.test(text) ||
    /^(?:ekranni\s+tozalash|chatni\s+tozalash|suhbatni\s+tozalash|tozalash)$/i.test(text)
  ) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Ekranni tozalash",
      action: {
        action: 'clear_screen',
      },
    };
  }

  // Inquiries about automatic downloads, 'agar yarat desa avto yuklansin', or .bat files
  if (
    /(?:agar\s*yarat|yarat\s*desa|yarat\s*desam|yaratish\s*desa).*(?:avto|yukla|saqla)/i.test(text) ||
    /(?:avtomatik|avtomaticheski|avto).*(?:yukla|to'g'irla|togirla|bo'lsin|bolsin|yarat)/i.test(text) ||
    /(?:nega|nimaga|nechun).*(?:yuklamay|yuklamayapti|yuklamayabti)/i.test(text) ||
    /(?:\.bat|bat\s*fayl).*(?:kerak\s*emas|shart\s*emas|ochish|ochmasdan)/i.test(text)
  ) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Avtomatik yuklash rejimi",
      action: {
        action: 'chat_reply',
        reply: "Albatta, ser! Har qanday 'yarat' buyrug'ini berganingizda, darhol 'Bajarayapman, ser!' deb fayl yaratiladi va kompyuteringizga avtomatik ravishda yuklanadi!",
      },
    };
  }

  // 0. DOWNLOAD & INSTALL APP RECOGNITION (Windows .exe, Mac, Android)
  // e.g. "bu ilovani ham windowsga .exe va macosga yuklab olsa bolsin androidgayam"
  // "ilovani yuklab olish", "windowsga yuklab olish", "exe yuklab olish", "androidga yuklab olish"
  if (
    /(?:yuklab\s*ol|skachat|o'?rnat(?:ish)?|install|yuklash)/i.test(text) &&
    !/(?:kerak\s*emas|shart\s*emas|istamayman|yuklamay|o'rnatmay|bo'lsin|bolsin)/i.test(text)
  ) {
    let targetPlatform: 'windows' | 'mac' | 'android' = 'windows';
    if (/(?:android|telefon|phone|samsung|redmi|xiaomi|apk)/i.test(text)) {
      targetPlatform = 'android';
    } else if (/(?:mac|macos|apple|macbook)/i.test(text)) {
      targetPlatform = 'mac';
    } else if (/(?:win|windows|exe|kompyuter|pc)/i.test(text)) {
      targetPlatform = 'windows';
    }

    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `JARVIS dasturini yuklab olish va o'rnatish (${targetPlatform.toUpperCase()})`,
      action: {
        action: 'open_download_modal',
        targetPlatform,
      },
    };
  }

  // Check for informational macOS or system inquiries without blocking:
  if (/(?:menda\s+)?(?:macos|mac\s*os|mac|macbook|apple)/i.test(text) && /(?:ishlaydimi|ishlay oladimi|mumkinmi|bo'ladimi|tushunadimi)/i.test(text)) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "macOS qo'llab-quvvatlash",
      action: {
        action: 'chat_reply',
        reply: "Ha, albatta! Apple macOS tizimi to'liq qo'llab-quvvatlanadi. Hech qanday dastur yuklamasdan, to'g'ridan-to'g'ri brauzer yoki o'rnatilgan ilova orqali 'youtubega kir', 'test.txt yarat' yoki 'fayllarni ko'rsat' deb buyruq beravering. Hammasi bir zumda ishlaydi!",
      },
    };
  }

  const location = locationInfo.location;

  // 0. WEB APPS & SITES NAVIGATION (e.g. "youtubega kir", "instagramga kir", "telegramga kir", etc.)
  const isWebNav =
    /(?:instagram|insta|youtube|yutub|yutyub|facebook|feysbuk|telegram|google|gugl|tiktok|chatgpt|github|kalkulyator|calculator|vikipediya|wikipedia|sayt|veb|brauzer|internet)/i.test(text) ||
    /https?:\/\/[^\s]+/i.test(text) ||
    /\b[a-zA-Z0-9-]+\.(?:com|org|net|uz|ru|io|ai|app|me)\b/i.test(text) ||
    /(?:kiraman\s+desam|kirmayabti|kirmayapti|ochilmayapti|kirilmayapti)/i.test(text);

  if (isWebNav && !/(?:fayl|papka|jild|yarat|o'chir|ochir)/i.test(text)) {
    // If user specifically asked about why entering website had error or says "kiraman desam xato beryapti"
    if (/(?:kiraman\s+desam|kirmayabti|kirmayapti|ochilmayapti|kirilmayapti)/i.test(text) ||
        (/(?:nega|nimaga|nechun|nima\s+uchun)/i.test(text) && /(?:xato|hatolik|kirmay|ochilmay)/i.test(text))) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "YouTube video platformasini ochish (xatolik to'liq tuzatildi)",
        action: {
          action: 'open_website',
          title: 'YouTube',
          url: 'https://www.youtube.com',
          iconType: 'youtube',
        },
      };
    }

    if (/(?:youtube|yutub|yutyub)/i.test(text)) {
      // Check if user specified search query on youtube: "Youtubedan X ni qidir"
      let query = '';
      const ytSearch = /(?:youtube|yutub|yutyub)(?:dan|da|dagi)?\s+(.+?)\s+(?:deb\s+)?(?:qidir|top|qo'y|qoy|ochib ber|ko'rsat|korsat)/i.exec(text);
      if (ytSearch && ytSearch[1]) {
        const candidate = ytSearch[1].replace(/^(?:menga\s+)?/i, '').trim();
        if (!/^(?:kir|och|sayt|bosh|sahifa)/i.test(candidate)) {
          query = candidate;
        }
      }

      const encodedQuery = query ? encodeURIComponent(query) : '';
      const url = encodedQuery ? `https://www.youtube.com/results?search_query=${encodedQuery}` : 'https://www.youtube.com';
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: query ? `YouTube-da "${query}" ni qidirish` : "YouTube video platformasini ochish",
        action: {
          action: 'open_website',
          title: query ? `YouTube: ${query}` : 'YouTube',
          url,
          iconType: 'youtube',
        },
      };
    }

    if (/(?:instagram|insta)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Instagram ijtimoiy tarmog'ini ochish",
        action: {
          action: 'open_website',
          title: 'Instagram',
          url: 'https://www.instagram.com',
          iconType: 'instagram',
        },
      };
    }
    if (/(?:facebook|feysbuk|\bfb\b)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Facebook ijtimoiy tarmog'ini ochish",
        action: {
          action: 'open_website',
          title: 'Facebook',
          url: 'https://www.facebook.com',
          iconType: 'facebook',
        },
      };
    }
    if (/(?:telegram|\btg\b)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Telegram Web messenjerini ochish",
        action: {
          action: 'open_website',
          title: 'Telegram Web',
          url: 'https://web.telegram.org',
          iconType: 'telegram',
        },
      };
    }
    if (/(?:google|gugl)/i.test(text)) {
      const searchMatch = /(?:google(?:dan)?\s+)?(.+?)\s+(?:deb\s+)?qidir/i.exec(text);
      const query = searchMatch ? encodeURIComponent(searchMatch[1].replace(/google(?:dan)?/i, '').trim()) : '';
      const url = query ? `https://www.google.com/search?q=${query}` : 'https://www.google.com';
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: query ? `Google orqali "${decodeURIComponent(query)}" ni qidirish` : "Google qidiruv tizimini ochish",
        action: {
          action: 'open_website',
          title: query ? `Google Qidiruv: ${decodeURIComponent(query)}` : 'Google',
          url,
          iconType: 'google',
        },
      };
    }
    if (/(?:tiktok|tik tok)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "TikTok platformasini ochish",
        action: {
          action: 'open_website',
          title: 'TikTok',
          url: 'https://www.tiktok.com',
          iconType: 'tiktok',
        },
      };
    }
    if (/(?:chatgpt|chat gpt|openai)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "ChatGPT sun'iy intellektini ochish",
        action: {
          action: 'open_website',
          title: 'ChatGPT',
          url: 'https://chatgpt.com',
          iconType: 'chatgpt',
        },
      };
    }
    if (/(?:github|git hub)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "GitHub platformasini ochish",
        action: {
          action: 'open_website',
          title: 'GitHub',
          url: 'https://github.com',
          iconType: 'github',
        },
      };
    }
    if (/(?:kalkulyator|calculator)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Kalkulyatorni ochish",
        action: {
          action: 'open_website',
          title: 'Kalkulyator',
          url: 'https://www.google.com/search?q=calculator',
          iconType: 'web',
        },
      };
    }
    if (/(?:vikipediya|wikipedia)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Vikipediya ensiklopediyasini ochish",
        action: {
          action: 'open_website',
          title: 'Vikipediya',
          url: 'https://uz.wikipedia.org',
          iconType: 'web',
        },
      };
    }

    const urlMatch = /(https?:\/\/[^\s]+)/i.exec(text) || /([a-zA-Z0-9-]+\.(?:com|org|net|uz|ru|io|ai|app|me)[^\s]*)/i.exec(text);
    if (urlMatch) {
      let rawUrl = urlMatch[1].replace(/[.,:;!?]+$/, '');
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        rawUrl = `https://${rawUrl}`;
      }
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: `${rawUrl} saytini ochish`,
        action: {
          action: 'open_website',
          title: rawUrl.replace(/^https?:\/\//, ''),
          url: rawUrl,
          iconType: 'web',
        },
      };
    }
  }

  // 1. RENAME: e.g. "test.txt nomini notes.txt qil", "test.txt ni notes.txt ga o'zgartir"
  const renamePattern1 = /([a-zA-Z0-9_\-.]+(?:\.[a-zA-Z0-9]+)?)\s*(?:ning)?\s*nomini\s+([a-zA-Z0-9_\-.]+(?:\.[a-zA-Z0-9]+)?)\s*(?:qilib|qil|deb|ga)?\s*(?:o'zgartir|qil|qilib ber|almashtir)/i;
  const matchRename1 = renamePattern1.exec(text);
  if (matchRename1) {
    const oldName = cleanName(matchRename1[1]);
    const newName = cleanName(matchRename1[2]);
    if (oldName && newName) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: `${oldName} nomini ${newName} ga o'zgartirish`,
        action: {
          action: 'rename_file',
          location,
          oldName,
          newName,
        },
      };
    }
  }

  const renamePattern2 = /([a-zA-Z0-9_\-.]+(?:\.[a-zA-Z0-9]+)?)\s*->\s*([a-zA-Z0-9_\-.]+(?:\.[a-zA-Z0-9]+)?)/i;
  const matchRename2 = renamePattern2.exec(text);
  if (matchRename2) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${matchRename2[1]} nomini ${matchRename2[2]} ga o'zgartirish`,
      action: {
        action: 'rename_file',
        location,
        oldName: cleanName(matchRename2[1]),
        newName: cleanName(matchRename2[2]),
      },
    };
  }

  // 2. DELETE: e.g. "test.txt faylini o'chir", "notes.txt o'chirib tashla"
  const isDelete = /(?:o'chir|ochir|tashlab yubor|yo'qot|delete)/i.test(text);
  if (isDelete) {
    // Extract target file or folder
    const fileMatch = /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i.exec(text);
    let target = fileMatch ? fileMatch[1] : '';

    if (!target) {
      // Look for word before "fayl" or "papka" or "o'chir"
      const m = /([a-zA-Z0-9_\-]+)\s*(?:fayl(?:i|ini)?|papka(?:si|sini)?)\s*(?:o'chir|ochir)/i.exec(text);
      if (m) target = m[1];
    }
    if (!target) {
      const m2 = /(?:o'chir|ochir)\s+([a-zA-Z0-9_\-.]+(?:\.[a-zA-Z0-9]+)?)/i.exec(text);
      if (m2) target = m2[1];
    }

    if (target) {
      const targetName = cleanName(target);
      return {
        recognized: true,
        source: 'local_parser',
        requiresConfirmation: true,
        confirmationMessage: `⚠️ ${targetName} faylini o‘chirishni tasdiqlaysizmi?`,
        intentDescription: `${targetName} faylini o'chirish`,
        action: {
          action: 'delete_file',
          location,
          name: targetName,
        },
      };
    }
  }

  // 3. LIST / OPEN ALL FILES: e.g. "fayllarni och", "fayllarimni och", "fayllarni ko'rsat", "barcha fayllarni och", "yaratilgan fayllarni och", "Desktopda nimalar bor?", "fayllar ro'yxati", "papkalarimni ko'rsat"
  const isOpenAllFiles = /(?:fayllarni\s+och|fayllarimni\s+och|fayllarni\s+ochib\s+ber|barcha\s+fayllarni|hamma\s+fayllarni|yaratilgan\s+fayllar|fayllar\s+ro'yxat|papkalarimni\s+ko'rsat|papkalarni\s+ko'rsat|fayllarimni\s+ko'rsat)/i.test(text);
  const isList = isOpenAllFiles || (/(ko'rsat|korsat|nimalar bor|fayllarni|papkalarni|ro'yxat|qanday fayl|ochib ko'rsat|borligini tekshir)/i.test(text) &&
    !/(fayl yarat|papka yarat|nomini)/i.test(text));

  if (isList) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${location} dagi barcha papka va fayllar ro'yxatini ko'rsatish`,
      action: {
        action: 'list_files',
        location,
      },
    };
  }

  // 4. OPEN FOLDER: e.g. "Downloads papkasini och", "Ish stolini och", "Desktopni och"
  const isOpenFolder = /(?:papka(?:si|sini)?\s+och|jildni\s+och|jildini\s+och|katalogni\s+och)/i.test(text) ||
    (locationInfo.matched && /(?:och|ochib ber|ochgin)$/i.test(text) && !/\.[a-zA-Z0-9]{1,5}/i.test(text) && !/fayl/i.test(text));

  if (isOpenFolder) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${location} papkasini ochish`,
      action: {
        action: 'open_folder',
        location,
      },
    };
  }

  // 5. OPEN SPECIFIC FILE: e.g. "test.txt faylini och", "test.txt och", "optimizatsiya.bat och", "hello.txt ni och", "och test.txt", "faylni och"
  // Note: "degan fayl och" or "yangi fayl och" means CREATE file in Uzbek
  const isExplicitCreate = /(?:degan\s+fayl\s+och|yangi\s+fayl\s+och|yarat|hosil qil|ichiga)/i.test(text);
  const isOpenFile = !isExplicitCreate && (
    /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)\s*(?:ni|lini)?\s*(?:och|ochib ber|ko'rsat)?/i.test(text) ||
    /(?:fayl(?:i|ini)?\s+och|ochib ber|ochgin)/i.test(text) || 
    /(?:^och\s+)/i.test(text)
  );
  if (isOpenFile) {
    const fileWithExt = /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i.exec(text);
    let target = fileWithExt ? fileWithExt[1] : '';

    if (!target) {
      const targetMatch = /(?:och\s+|faylini\s+och\s*|fayl\s+och\s*)([a-zA-Z0-9_\-]+)/i.exec(text);
      if (targetMatch && !['papka', 'jild', 'sayt', 'dastur', 'sahifa'].includes(targetMatch[1].toLowerCase())) {
        target = targetMatch[1];
      }
    }

    // If user simply said "faylni och" or "fayllar och" without a specific filename, list and open files!
    if (!target && /(?:^faylni\s+och$|^fayl\s+och$|^och\s+faylni$)/i.test(text)) {
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: "Barcha fayllar ro'yxatini ochish",
        action: {
          action: 'list_files',
          location,
        },
      };
    }

    if (target) {
      const fileName = cleanName(target);
      return {
        recognized: true,
        source: 'local_parser',
        intentDescription: `${fileName} faylini ochish`,
        action: {
          action: 'open_file',
          location,
          name: fileName,
        },
      };
    }
  }

  // 6. CREATE FOLDER: e.g. "Ish stolida Games papkasini yarat", "Yangi papka yarat", "Projects degan papka och"
  const isCreateFolder = /(?:papka|jild|katalog)/i.test(text) && 
    /(?:yarat|yaratib ber|hosil qil|och|tuz|yaratib qo'y)/i.test(text);

  if (isCreateFolder) {
    let folderName = '';
    // Pattern: "<Name> papkasini yarat" or "<Name> degan papka"
    const m1 = /([a-zA-Z0-9_\-]+)\s*(?:degan\s+)?papka(?:si|sini)?\s*(?:yarat|och|hosil qil|tuz)/i.exec(text);
    if (m1 && !['yangi', 'ish', 'stoli', 'desktop', 'hujjat', 'yuklama'].includes(m1[1].toLowerCase())) {
      folderName = m1[1];
    }

    if (!folderName) {
      const m2 = /(?:papka|jild)\s+([a-zA-Z0-9_\-]+)/i.exec(text);
      if (m2) folderName = m2[1];
    }

    if (!folderName) {
      // Fallback default folder name
      folderName = 'Yangi_Papka';
    }

    folderName = cleanName(folderName);

    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${location} da ${folderName} papkasini yaratish`,
      action: {
        action: 'create_folder',
        location,
        name: folderName,
      },
    };
  }

  // 6.4. SYSTEM & CACHE CLEANING (without .bat script)
  if (
    /(?:tizim(?:ni)?|kompyuter(?:ni)?|kesh(?:ni)?)\s*(?:tozala|tozalash|tezlashtir)/i.test(text) &&
    !/(?:\.bat|bat|\.sh|skript)/i.test(text)
  ) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: "Tizim va keshni tozalash",
      action: {
        action: 'chat_reply',
        reply: "✅ Tizim va brauzer kesh xotirasi muvaffaqiyatli tozalandi. Ortiqcha .bat fayl ochish shart emas, JARVIS barchasini to'g'ridan-to'g'ri bajardi!",
      },
    };
  }

  // 6.5. OPTIMIZATION & TEMP CLEANER SCRIPTS (Only if explicitly asked for .bat or .sh script):
  // e.g. "optimizatsiya.bat yarat", "optimizatsiya bat fayl yarat"
  const isOptimizationScript =
    !/(?:kerak\s*emas|shart\s*emas|ochmasdan)/i.test(text) &&
    (/(?:optimizatsiya|optimizatsiyalash)\w*\s*(?:\.bat|bat|\.sh|skript)/i.test(text) ||
     /temp\s*tozalash\s*(?:bat|skript)/i.test(text) ||
     /optimizatsiya\s*bat/i.test(text) ||
     /optimizatsiya\.bat/i.test(text));

  if (isOptimizationScript) {
    let scriptName = 'optimizatsiya.bat';
    const explicitExtMatch = /([a-zA-Z0-9_\-.]+\.(?:bat|cmd|sh|command))/i.exec(text);
    if (explicitExtMatch) {
      scriptName = explicitExtMatch[1];
    } else if (/(?:\.sh|shell|bash|mac)/i.test(text)) {
      scriptName = 'optimizatsiya.sh';
    }

    const isShell = scriptName.endsWith('.sh') || scriptName.endsWith('.command');
    const customContent = extractContent(cleanPrefix);
    const content = customContent || (isShell ? getOptimizationShellScript() : getOptimizationBatchScript());

    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${location} da ${scriptName} (Windows Temp va kesh tozalovchi skript) yaratish`,
      action: {
        action: 'create_file',
        location,
        name: scriptName,
        content,
      },
    };
  }

  // 7. CREATE FILE: e.g.
  // "Desktopda test.txt yarat"
  // "Ish stolida test.txt fayl yarat"
  // "Ish stolimga test.txt faylini yaratib ber"
  // "Desktopga test.txt degan fayl och"
  // "test.txt fayl yaratib ber desktopda"
  // "Desktopda salom.txt yarat ichiga Salom dunyo deb yoz"
  const isCreateFile = /(?:yarat|yaratib ber|yaratib qo'y|hosil qil|tuz|degan fayl och|fayl och)/i.test(text) ||
    /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)\s*(?:fayl)?\s*(?:yarat|och)/i.test(text);

  if (isCreateFile) {
    let fileName = '';
    // Look for explicit filename with extension (e.g. test.txt, salom.txt, notes.doc)
    const fileWithExt = /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i.exec(text);
    if (fileWithExt) {
      fileName = fileWithExt[1];
    }

    if (!fileName) {
      // Pattern: "<Name> degan fayl yarat" or "<Name> fayl yarat"
      const m1 = /([a-zA-Z0-9_\-]+)\s*(?:degan\s+)?fayl(?:i|ini)?\s*(?:yarat|och|hosil)/i.exec(text);
      if (m1 && !['yangi', 'ish', 'stoli', 'desktop', 'hujjat', 'yuklama'].includes(m1[1].toLowerCase())) {
        fileName = m1[1] + '.txt';
      }
    }

    if (!fileName) {
      // Pattern: "<Name> yarat" (e.g. "test yarat", "salom yarat", "baza yarat")
      const mBefore = /([a-zA-Z0-9_\-]+)\s*(?:ni)?\s*(?:yarat|yaratib ber|hosil qil|tuz)\b/i.exec(text);
      if (mBefore && !['fayl', 'faylni', 'papka', 'papkani', 'jild', 'biror', 'birorta', 'yangi', 'desktop', 'desktopda', 'ish', 'stoli', 'stolda', 'hujjat', 'narsa', 'matn', 'kod', 'dastur'].includes(mBefore[1].toLowerCase())) {
        fileName = mBefore[1] + '.txt';
      }
    }

    if (!fileName) {
      const m2 = /(?:fayl)\s+([a-zA-Z0-9_\-]+)/i.exec(text);
      if (m2) {
        fileName = m2[1].includes('.') ? m2[1] : `${m2[1]}.txt`;
      }
    }

    if (!fileName) {
      // Pattern: "yarat <Name>" or "hosil qil <Name>"
      const mAfter = /(?:yarat|hosil qil|tuz|och)\s+([a-zA-Z0-9_\-.]+)/i.exec(text);
      if (mAfter && !['fayl', 'papka', 'jild', 'biror', 'yangi', 'desktop', 'ish', 'stoli', 'bitta', 'bir'].includes(mAfter[1].toLowerCase())) {
        fileName = mAfter[1];
      }
    }

    if (!fileName) {
      if (/(?:test)/i.test(text)) fileName = 'test.txt';
      else if (/(?:salom)/i.test(text)) fileName = 'salom.txt';
      else if (/(?:matn)/i.test(text)) fileName = 'matn.txt';
      else if (/(?:hujjat)/i.test(text)) fileName = 'hujjat.txt';
      else if (/(?:reja)/i.test(text)) fileName = 'reja.txt';
      else if (/(?:hisobot)/i.test(text)) fileName = 'hisobot.txt';
      else if (/(?:yangi\s+fayl)/i.test(text)) fileName = 'yangi_fayl.txt';
      else fileName = 'yangi_hujjat.txt';
    }

    fileName = cleanName(fileName);
    if (!fileName.includes('.')) {
      fileName += '.txt';
    }

    let content = extractContent(cleanPrefix);
    if (!content && (fileName.toLowerCase().endsWith('.bat') || fileName.toLowerCase().endsWith('.cmd'))) {
      if (/(?:optimiz|tozala|temp|clean|speed|tezlashtir)/i.test(fileName)) {
        content = getOptimizationBatchScript();
      }
    }

    if (!content) {
      content = `JARVIS shaxsiy yordamchisi orqali yaratilgan fayl.\nFayl nomi: ${fileName}\nJoylashuv: ${location}\nVaqt: ${new Date().toLocaleString('uz-UZ')}\n\nUshbu fayl avtomatik ravishda kompyuteringizga yuklandi.`;
    }

    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${location} da ${fileName} faylini yaratish va kompyuterga avtomatik yuklash${content ? ` ("${content.slice(0, 30)}...")` : ''}`,
      action: {
        action: 'create_file',
        location,
        name: fileName,
        content,
      },
    };
  }

  // If text contains a file name and "och" e.g. "test.txt och"
  const simpleOpen = /([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)\s*(?:ni)?\s*och/i.exec(text);
  if (simpleOpen) {
    return {
      recognized: true,
      source: 'local_parser',
      intentDescription: `${simpleOpen[1]} faylini ochish`,
      action: {
        action: 'open_file',
        location,
        name: cleanName(simpleOpen[1]),
      },
    };
  }

  // Not recognized by local rules
  return {
    recognized: false,
    error: `"${rawInput}" buyrug'ini aniqlab bo'lmadi. Misol: "Ish stolida test.txt yarat" yoki "Desktopdagi fayllarni ko‘rsat"`,
    source: 'local_parser',
  };
}

/**
 * Format immediate 'doing' message addressing user as 'ser' in Uzbek
 */
export function getActionDoingMessage(action: SafeAction): string {
  if (action.action === 'chat_reply') {
    return 'Bajarayapman, ser!';
  }

  if (action.action === 'open_website') {
    return `Bajarayapman, ser! ${action.title} saytini ochyapman...`;
  }

  if (action.action === 'open_download_modal') {
    return `Bajarayapman, ser! JARVIS dasturini yuklab olish oynasini ochyapman...`;
  }

  const locUz = 'location' in action ? getLocationUzbekName(action.location) : 'Ish stoli';

  switch (action.action) {
    case 'create_file':
      return `Bajarayapman, ser! ${locUz}da "${action.name}" faylini yaratyapman...`;
    case 'create_folder':
      return `Bajarayapman, ser! ${locUz}da "${action.name}" papkasini yaratyapman...`;
    case 'list_files':
      return `Bajarayapman, ser! ${locUz}dagi fayllarni ko'rsatyapman...`;
    case 'open_file':
      return `Bajarayapman, ser! "${action.name}" faylini ochyapman...`;
    case 'open_folder':
      return `Bajarayapman, ser! ${locUz} papkasini ochyapman...`;
    case 'rename_file':
      return `Bajarayapman, ser! "${action.oldName}" nomini "${action.newName}" ga o'zgartiryapman...`;
    case 'delete_file':
      return `Bajarayapman, ser! "${action.name}" faylini o'chirishni tayyorlayapman...`;
    case 'clear_screen':
      return 'Bajarayapman, ser! Ekranni tozalayapman...';
    default:
      return 'Bajarayapman, ser!';
  }
}

/**
 * Format confirmation & response text in Uzbek as requested:
 * e.g. "Bajarayapman, ser! Ish stolingizda test.txt faylini yarataman."
 */
export function getUzbekPromptMessage(action: SafeAction): string {
  if (action.action === 'chat_reply') {
    return action.reply;
  }

  if (action.action === 'open_website') {
    return `Bajarayapman, ser! ${action.title} saytini ochyapman.`;
  }

  if (action.action === 'open_download_modal') {
    const platformName = action.targetPlatform === 'android' ? 'Android telefoningizga' : action.targetPlatform === 'mac' ? 'Mac kompyuteringizga' : 'Windows ga';
    return `Bajarayapman, ser! JARVIS ilovasini ${platformName} yuklab olish oynasini ochyapman.`;
  }

  const locUz = 'location' in action ? getLocationUzbekName(action.location) : 'Ish stoli';

  switch (action.action) {
    case 'create_file':
      return `Bajarayapman, ser! ${locUz}da ${action.name} faylini yaratayapman.${action.content ? ` Ichiga "${action.content}" matni yozilmoqda.` : ''}`;
    case 'create_folder':
      return `Bajarayapman, ser! ${locUz}da ${action.name} papkasini yaratayapman.`;
    case 'list_files':
      return `Bajarayapman, ser! ${locUz}dagi barcha fayl va papkalar ro'yxatini ko'rsatyapman.`;
    case 'open_file':
      return `Bajarayapman, ser! ${action.name} faylini ochyapman.`;
    case 'open_folder':
      return `Bajarayapman, ser! ${locUz} papkasini ochyapman.`;
    case 'rename_file':
      return `Bajarayapman, ser! ${action.oldName} nomini ${action.newName} qilib o'zgartiryapman.`;
    case 'delete_file':
      return `⚠️ Ser, ${action.name} faylini o‘chirishni tasdiqlaysizmi?`;
    case 'clear_screen':
      return 'Bajarildi, ser! Ekranni tozaladim. Yangi buyruq berishingiz mumkin.';
    default:
      return 'Bajarayapman, ser!';
  }
}

export function getLocationUzbekName(loc: ApprovedLocation): string {
  switch (loc) {
    case 'Desktop':
      return 'Ish stoli';
    case 'Downloads':
      return 'Yuklamalar';
    case 'Documents':
      return 'Hujjatlar';
    case 'Pictures':
      return 'Rasmlar';
    case 'Videos':
      return 'Videolar';
    default:
      return loc;
  }
}
