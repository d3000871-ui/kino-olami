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

## Katta katalog (100 000+ yozuvlar maqsadi)
TMDB_READ_TOKEN bilan kino/serial katalogi real vaqtda API orqali olinadi. Yil, janr, nom, reyting, yangilik va klassik filmlar filtrlari mavjud. Natija soni API javobidan olinadi; API bir filtrga 500 sahifa bilan cheklangan, yil va janrga ajratib qidirish mumkin. Uch tilda ma’lumotlar mavjud tarjimalardan olinadi, bo‘lmasa inglizcha manba ishlatiladi. Film tafsilotlari, aktyorlar, treyler va mavjud rasmiy tomosha manbalari qo‘shildi. TMDB film videolarini bermaydi. Faqat tarqatish huquqi bor haqiqiy dublyajlarni Blobga yuklash kerak. 100 000 video fayli yuklanmagan. Admin panelda parol tekshiruvi, qidiruv va metadata tahrirlash mavjud; video fayl o‘zgarmaydi. Foydalanuvchi profili mahalliy. 

## Video pleyeri
Asosiy ekran endi video fayli mavjud kinolarni ko‘rsatadi. Barcha katalog alohida. Blender ochiq filmlari uchun Blender video serveridagi MP4 va mavjud zaxira manbalar qo‘llanadi. Pleyer xato yuz bersa keyingi manbani sinaydi, qayta urinish va holat xabarini ko‘rsatadi. Manbalarning mavjudligi tashqi serverlarga bog‘liq. TMDB yozuvlari o‘zidan video bermaydi; o‘zbekcha/ruscha tarjima fayllari admin orqali yuklanishi kerak.

## Havola orqali kino qo‘shish
Admin panelda video fayli o‘rniga tarqatish huquqi bor HTTPS MP4 yoki WebM manzilini kiritish mumkin. Katalog yozuvi Blobda saqlanadi, video tashqi manbada qoladi va u o‘chirilsa ijro ishlamaydi. Doimiy video uchun faylni Blobga yuklang. Blender ochiq filmlari uchun rasmiy tomosha havolalari va zaxira video manbalari mavjud. TMDB katalogi token talab qiladi.

## Badiiy filmlar
Rasmiy UzbekFilmsHD/Uzbekkino va Mosfilm nashr havolalari, shuningdek Wikimedia Commons klassik filmlari qo‘shildi. YouTube filmlari rasmiy embed yoki asl sahifada ishlaydi, ulardan video ajratib olinmaydi. Tomosha imkoniyati hududga va nashriyot chekloviga bog‘liq. Badiiy va animatsiya filtrlari mavjud. Mahalliy yuklangan video ombori va TMDB tokeni alohida.

## Sayt ichida tomosha qilish
MP4/WebM va rasmiy YouTube embed pleyeri sayt ichida ochiladi; tashqi tomosha tugmalari olib tashlangan. Admin ruxsatli YouTube havolasini ham saqlashi mumkin. Agar nashriyot embedni bloklasa, xabar ko‘rsatiladi; bunday cheklov chetlab o‘tilmaydi. YouTube pleyerining o‘zidagi standart havolalar provayder boshqaruvida. Yuklab olish tugmasi mavjud ruxsatli video faylni oflayn omborga saqlaydi, YouTube uchun yuklab olish yo‘q.

## Zamonaviy kinolar
77 ta qo‘lda tanlangan film katalog yozuvi token bo‘lmasa ham ishlaydi. Qasoskorlar, Marvel va janr turkumlari, uch tilda nom bo‘yicha qidiruv, ayrim rasmiy treylerlar. TMDB tokeni ulanganda qo‘shimcha metadata olinadi. Bu tijoriy filmlarning to‘liq videolari yoki dublyajlari emas. Qasoskorlar Doomsday 2026 dekabriga rejalangan. To‘liq videolar uchun tarqatish huquqi bor manbani admin orqali qo‘shish kerak.

## Bosh sahifa barqarorligi
Boshlang‘ich HTMLda 77 ta katalog kartochkasi bor; JS yoki API ishlamasa ham katalog nomlari ko‘rinadi. Interaktiv katalog muvaffaqiyatli render qilingandan so‘ng statik zaxira yashiriladi. Poster bo‘lmasa nomli kartochka ko‘rsatiladi; saqlangan noto‘g‘ri profil ma’lumotlari tekshiriladi. Oflayn holatda avtomatik boshqa bo‘limga o‘tmaydi. Bu katalog metadata, to‘liq tijoriy video fayllari emas.

## Poster va reytinglar
77 ta zamonaviy film uchun IMDb identifikatorlari asosida MetaHub poster manzili qo‘shilgan; mavjud TMDB posterlari saqlangan. IMDb reytinglari Cinemeta metadata servisidan ko‘rinayotgan kartochkalar bo‘yicha olinadi, qiymat bo‘lmasa — ko‘rsatiladi. Uchinchi tomon servisining ishlashi va tasvirlardan foydalanish huquqlari alohida tekshirilishi kerak. To‘liq filmlar qo‘shilmagan.
