// Official publisher links and Commons file pages; no third-party video extraction.
const rows=[
  {
    "id": "uz-yuzma",
    "title": "Yuzma-yuz",
    "year": "",
    "genre": "Drama",
    "language": "O‘zbekcha",
    "youtube": "xNfhytVf80E",
    "description": "O‘zbek badiiy filmi. Nashr manbasi: UzbekFilmsHD / RizaNova."
  },
  {
    "id": "uz-qovun",
    "title": "Qovun",
    "year": "",
    "genre": "Boshqa",
    "language": "O‘zbekcha",
    "youtube": "VZ31UDe9jqs",
    "description": "O‘zbek badiiy filmi. Nashr manbasi: Uzbekkino / RizaNova."
  },
  {
    "id": "uz-yovuz",
    "title": "Yovuz",
    "year": "",
    "genre": "Boshqa",
    "language": "O‘zbekcha",
    "youtube": "pbijbPYWN4E",
    "description": "O‘zbek badiiy filmi. Nashr manbasi: UzbekFilmsHD / RizaNova."
  },
  {
    "id": "ru-stalker",
    "title": "Stalker / Сталкер",
    "year": "1979",
    "genre": "Fantastika",
    "language": "Ruscha",
    "youtube": "UPerb922QGM",
    "description": "Sirli hududga sayohat qiluvchi uch inson.",
    "info": "https://www.mosfilm.ru/cinema/films/stalker/"
  },
  {
    "id": "ru-solaris",
    "title": "Solaris / Солярис",
    "year": "1972",
    "genre": "Fantastika",
    "language": "Ruscha",
    "youtube": "Z8ZhQPaw4rE",
    "description": "Kosmik stansiyadagi sirli hodisalar.",
    "info": "https://www.mosfilm.ru/cinema/films/solyaris/"
  },
  {
    "id": "ru-ivan",
    "title": "Ivan Vasilyevich kasbini o‘zgartiradi / Иван Васильевич меняет профессию",
    "year": "1973",
    "genre": "Komediya",
    "language": "Ruscha",
    "youtube": "l7eIIIPBNUc",
    "description": "Vaqt mashinasi tufayli yuz bergan kulgili voqealar."
  },
  {
    "id": "ru-diamond",
    "title": "Brilliant qo‘l / Бриллиантовая рука",
    "year": "1968",
    "genre": "Komediya",
    "language": "Ruscha",
    "watchUrl": "https://www.mosfilm.ru/cinema/films/brilliantovaya-ruka/",
    "description": "Sayohat chog‘ida kutilmagan sarguzashtlar."
  },
  {
    "id": "ru-moscow",
    "title": "Moskva ko‘z yoshlarga ishonmaydi / Москва слезам не верит",
    "year": "1979",
    "genre": "Drama",
    "language": "Ruscha",
    "youtube": "NTWA_7-ld_U",
    "description": "Uch dugonaning hayot yo‘llari."
  },
  {
    "id": "en-friday",
    "title": "His Girl Friday",
    "year": "1940",
    "genre": "Komediya",
    "language": "Inglizcha",
    "file": "His Girl Friday.webm",
    "description": "Jurnalistlar haqidagi klassik komediya."
  },
  {
    "id": "en-night",
    "title": "Night of the Living Dead",
    "year": "1968",
    "genre": "Qo‘rqinchli",
    "language": "Inglizcha",
    "file": "Night of the Living Dead (1968 film).webm",
    "description": "Tirik qolishga urinayotgan bir guruh insonlar."
  },
  {
    "id": "silent-general",
    "title": "The General / General",
    "year": "1926",
    "genre": "Jangari",
    "language": "So‘zsiz",
    "file": "The General (1926).webm",
    "description": "Poyezd va sarguzashtlar haqidagi klassik film."
  },
  {
    "id": "silent-sherlock",
    "title": "Sherlock Jr.",
    "year": "1924",
    "genre": "Komediya",
    "language": "So‘zsiz",
    "file": "Sherlock Jr. (1924).webm",
    "description": "Detektiv bo‘lishni orzu qilgan kino mexanigi."
  }
];
export default rows.map(m=>{const f=m.file?encodeURIComponent(m.file.replaceAll(' ','_')):'';const page=f?'https://commons.wikimedia.org/wiki/File:'+f:'';return {...m,source:'official',rating:null,media:'movie',watchUrl:m.youtube?'https://www.youtube.com/watch?v='+m.youtube:m.watchUrl||'',video:f?'https://commons.wikimedia.org/wiki/Special:FilePath/'+f:'',info:m.info||page||m.watchUrl||'',credit:f?'Wikimedia Commons: litsenziya va hududiy huquqlarni manbada tekshiring.':'Rasmiy nashr orqali tomosha. Yuklab olish va oflayn nusxa mavjud emas.'};});
