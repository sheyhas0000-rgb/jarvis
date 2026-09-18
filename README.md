# 🤖 JARVIS - Haqiqiy Windows Desktop Yordamchisi

JARVIS — Windows kompyuteringizni o'zbek tilidagi ovozli va matnli buyruqlar orqali boshqaruvchi haqiqiy sun'iy intellekt yordamchisi.

Bu shunchaki ko'rgazmali demo emas: foydalanuvchi buyruq berganda, JARVIS Windows fayl tizimida haqiqiy xavfsiz amallarni bajaradi (fayl yaratish, ochish, o'chirish, nomini o'zgartirish, papkalarni ko'rish).

Asosiy buyruqlar uchun hech qanday Gemini yoki OpenAI API kaliti talab qilinmaydi — barchasi kompyuteringizdagi mahalliy (local) agent orqali xavfsiz ishlaydi.

---

## 🚀 O'rnatish va Ishga Tushirish

### 1-qadam: Node.js o'rnatish
Kompyuteringizda Node.js (v18 yoki undan yuqori) o'rnatilgan bo'lishi kerak:
- [https://nodejs.org](https://nodejs.org) saytiga kiring va LTS versiyasini o'rnating.

### 2-qadam: Bog'liqliklarni o'rnatish (agar kerak bo'lsa)
JARVIS Local Agent (`agent/jarvis-agent.js`) standart Node.js kutubxonalarida yozilgan, shuning uchun u qo'shimcha npm paketlarsiz ham ishlaydi.
Veb interfeysni ishlab chiquvchi sifatida yurgizish uchun:
```bash
npm install
npm run dev
```

### 3-qadam: JARVIS Local Agentni ishga tushirish
Windows kompyuteringizda:
- `start-jarvis.bat` faylini ikki marta bosing (yoki terminalda `node agent/jarvis-agent.js` buyrug'ini tering).
- Agent `http://127.0.0.1:8765` manzilida ishga tushadi.

### 4-qadam: JARVIS interfeysini ochish
Brauzeringizda JARVIS interfeysi ochilgach, yuqorida:
`🟢 Local agent ulangan: 127.0.0.1:8765 (Windows Foydalanuvchisi)`
yozuvi paydo bo'ladi.

### 5-qadam: Papkalarga ruxsat berish
Dastur birinchi ochilganda "JARVIS ruxsatlari" oynasida kerakli papkalarni belgilang:
- ☑️ Ish stoli (Desktop)
- ☑️ Yuklamalar (Downloads)
- ☑️ Hujjatlar (Documents)
- ☑️ Rasmlar (Pictures)
- ☑️ Videolar (Videos)

---

## 🗣️ O'zbekcha Buyruqlar Misollari

JARVIS tabiiy o'zbek tilini tushunadi. So'zlarni qat'iy bir xil tartibda aytish shart emas!

### 1. Fayl yaratish:
- `Desktopda test.txt yarat`
- `Ish stolida test.txt fayl yarat`
- `Ish stolimga test.txt faylini yaratib ber`
- `Desktopga test.txt degan fayl och`
- `test.txt fayl yaratib ber desktopda`
- `Desktopda salom.txt yarat ichiga Salom dunyo deb yoz`

### 2. Papka yaratish:
- `Ish stolida Games papkasini yarat`
- `Desktopda Projects degan papka och`
- `Yuklamalarda Yangi_Jild papkasini yarat`

### 3. Fayllarni ko'rsatish:
- `Ish stolimdagi fayllarni ko'rsat`
- `Desktopda nimalar bor?`
- `Yuklamalardagi fayllarni ko'rsat`

### 4. Faylni ochish:
- `test.txt faylini och`
- `hello.txt ochib ber`
*(Agar fayl mavjud bo'lmasa, JARVIS "❌ test.txt topilmadi" deb xabar beradi)*

### 5. Papkani ochish:
- `Downloads papkasini och`
- `Ish stolini och`
- `Hujjatlar papkasini och`

### 6. Fayl nomini o'zgartirish:
- `test.txt nomini notes.txt qil`
- `test.txt nomini hello.txt qilib o'zgartir`

### 7. Faylni xavfsiz o'chirish:
- `test.txt faylini o'chir`
*(JARVIS darhol o'chirib yubormaydi, avval tasdiqlash tugmalarini ko'rsatadi: `[ HA, O'CHIRISH ]` yoki `[ BEKOR QILISH ]`)*

---

## 🔒 Xavfsizlik (Security Architecture)

1. **Cheklangan ruxsatlar (Whitelist):** JARVIS faqatgina foydalanuvchi tasdiqlagan 5 ta papka (Desktop, Documents, Downloads, Pictures, Videos) doirasida ishlaydi. Butun C:\ diskiga ruxsat berilmaydi.
2. **Path Traversal himoyasi:** `../` kabi belgilar orqali ruxsat etilgan papkadan tashqariga chiqish qat'iyan bloklangan.
3. **Xavfli skriptlar taqiqlangan:** Hech qanday erkin PowerShell yoki cmd skriptlari bajarilmaydi, faqatgina aniq dasturlangan xavfsiz fayl operatsiyalari amalga oshiriladi.
4. **Haqiqiy tekshiruv:** Har bir operatsiyadan so'ng fayl haqiqatda mavjudligi yoki o'chirilganligi `fs.existsSync` orqali tekshiriladi.
