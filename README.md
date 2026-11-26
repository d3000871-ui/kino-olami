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
