# 🎬 Kino Olami
O‘zbekcha, mobilga mos kino sayti. Vite + Vercel Functions + Vercel Blob.

## Vercel
1. Vercel.com → Add New → Project → d3000871-ui/kino-olami → Import.
2. Framework Vite; Build npm run build; Output dist; Node 22.
3. Storage → Create → Blob → Public store yarating, loyihaga Production va Preview uchun ulang. BLOB_READ_WRITE_TOKEN avtomatik qo‘shiladi.
4. Settings → Environment Variables → ADMIN_PASSWORD (uzun, tasodifiy, maxfiy parol). Hech qachon GitHubga yozmang.
5. Ixtiyoriy: themoviedb.org API Read Access Token → TMDB_READ_TOKEN. TMDB foydalanish shartlariga va attributsiyasiga rioya qiling. U video bermaydi.
6. Deploy yoki Redeploy. Saytda Kino qo‘shish → admin paroli → MP4/WebM → huquqni tasdiqlang → yuklang.

## Saqlash
Video brauzerdan to‘g‘ridan-to‘g‘ri Blobga ketadi (multipart katta fayllar uchun). Metadata alohida catalog/*.json obyektlarida saqlanadi. Sayt redeploy bo‘lganda fayllar yo‘qolmaydi, agar o‘sha Blob store ulangan bo‘lsa. Store o‘chirilishi, tarif limitlari yoki akkaunt yopilishi bo‘yicha kafolat yo‘q; zaxira nusxa oling. Public Blob URL hamma uchun ochiq. Faqat ommaviy tarqatish huquqingiz bo‘lgan videolarni yuklang. 5 GB ilova limiti; tarif va trafik xarajatlari Vercelga bog‘liq. Video fayllarini GitHubga commit qilmang. Yuklab olingan fayl foydalanuvchi qurilmasida qoladi; brauzer namuna video havolasini yangi oynada ochishi mumkin (Save video as orqali saqlang).
Sevimlilar, shaxsiy baholar va tomosha tarixi localStorage orqali shu brauzerda saqlanadi; ma’lumotlar tozalansa yo‘qoladi. Umumiy baholash yoki akkauntlar hozircha yo‘q.
Admin paroli serverda tekshiriladi; uni faqat egasi bilsin. Ommaviy sayt uchun qo‘shimcha rate limit va autentifikatsiya tavsiya qilinadi.

## Demo
Big Buck Bunny, Sintel, Tears of Steel — Blender Foundation ochiq filmlari (CC BY), https://www.blender.org/about/projects/. Namunalar Google video sample bucket orqali ko‘rsatiladi. TMDB metama’lumotlari ixtiyoriy va ular tomosha/yuklab olish huquqini bermaydi.

## Local
npm install
npm run build
Vercel CLI orqali vercel dev (environment sozlangan bo‘lishi kerak). Vite dev faqat frontend uchun.

## Kengaytirilgan katalog
TMDB_READ_TOKEN bilan kino va seriallar, yil, janr, qidiruv, reyting va sahifalash ishlaydi. API bir so‘rov filtri uchun 500 sahifagacha; yil va janr bilan chuqurroq qidiring. TMDB tavsiflari video emas. 11 qo‘shimcha Blender ochiq filmi Wikimedia Commons orqali havolalangan; individual litsenziya va kredit Manba sahifasida. Tashqi videolar Blobga ko‘chirilmagan, shuning uchun manba mavjudligiga bog‘liq. Faqat o‘zingiz Blobga yuklagan filmlar omborda turadi.

## Oflayn tomosha (PWA)
Vercel HTTPS saytiga birinchi marta internet bilan kiring. Ochiq/ruxsatli videoni ochib Oflayn saqlashni bosing; yakunlanganidan keyin Oflayn bo‘limidan internetsiz oching. Ilova shell service worker orqali, video Cache Storage orqali alohida saqlanadi; redeploy media keshini o‘chirmaydi. Tashqi video CORS ruxsat bermasa, faylni qonuniy yuklab olib Oflayn bo‘limida MP4/WebM import qiling. Brauzer doimiy xotira ruxsatini so‘raydi, lekin rad etilishi mumkin; brauzer ma’lumotlari o‘chirilsa, joy yetishmasa yoki boshqa qurilmada oflayn nusxalar mavjud bo‘lmasligi mumkin. Asl faylni alohida zaxiralang. iOS/Android/desktop brauzerlarida kodek va kvota farqlanadi. Internet yo‘q bo‘lsa yangi video yuklab bo‘lmaydi. 

## O‘zbekcha tarjima
TMDB o‘zbekcha tavsif mavjud bo‘lsa qaytaradi, aks holda inglizcha tavsif olinadi. O‘zbekcha ovoz filtri haqiqiy audio tili metama’lumotiga asoslanadi; avtomatik dublyaj yo‘q. Admin qisqa SRT/VTT subtitr (12 KB gacha) qo‘sha oladi; tomoshabin 500 KB gacha subtitrni o‘z brauzerida qo‘sha oladi, oflayn ham ishlaydi. Subtitr va dublyaj uchun tarqatish huquqi kerak.

## Uch tilda video tarjimalari
Kino qo‘shish panelida bir film uchun bir xil tarjima guruhi kodidan foydalanib O‘zbekcha, Ruscha va Inglizcha video fayllarini alohida yuklang. Mavjud kinoning guruh kodini takliflar ro‘yxatidan tanlash mumkin. Katalogda guruh birlashtiriladi; pleyer mavjud ovoz variantlarini ko‘rsatadi. Har bir variant o‘z fayli bilan alohida oflayn saqlanadi. Tomoshabin uch tilda shaxsiy SRT/VTT subtitr qo‘sha oladi. Sayt audio tarjima/dublyajni avtomatik yaratmaydi; TMDB original tilni beradi, video taqdim etmaydi. Tarjima videolarini tarqatish huquqi bo‘lishi shart.

## Android APK va alohida bo‘limlar
GitHub Actions → Android APK → Run workflow. Build muvaffaqiyatli tugasa Artifacts → Kino-Olami-APK ZIP ichidan app-debug.apk ni oling. Debug APK sinov uchun, Play Store uchun release signing va AAB kerak. Birinchi ochishda Vercel loyihangizning aniq HTTPS domenini kiriting. Android WebView saytni shu domen orqali ochadi; oflayn uchun avval sayt yuklanishi va service worker ishlashi kerak. Ilova ma’lumotlari o‘chirilsa oflayn video yo‘qolishi mumkin. Android 8+.
Foydalanuvchi: `/`; admin: `/admin.html` (server ADMIN_PASSWORD orqali yuklashni himoyalaydi, sahifaning o‘zi ochiq). `src/admin.js`, `src/user.js`, `src/search.js` alohida. Profil mahalliy, serverda ro‘yxatdan o‘tish yo‘q. Vercel build va Android build alohida.
