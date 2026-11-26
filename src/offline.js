const CACHE='kino-offline-films-v1', PREFIX='/__kino_offline__/';
const key=id=>new Request(new URL(PREFIX+encodeURIComponent(id),location.origin));
const cache=()=>caches.open(CACHE);
const pack=m=>encodeURIComponent(JSON.stringify({id:m.id,groupId:m.groupId||'',title:m.title,year:m.year||'',genre:m.genre||'Boshqa',description:m.description||'',rating:m.rating??null,language:m.language||'',source:m.source||'local',credit:m.credit||'',subtitleUz:m.subtitleUz||'',info:m.info||'',video:m.video||'',poster:'',media:m.media||'movie'}));
export async function savedList(){
 const c=await cache(),out=[];
 for(const k of await c.keys()){const r=await c.match(k);try{const m=JSON.parse(decodeURIComponent(r.headers.get('x-kino-meta')));out.push({...m,offline:true,bytes:Number(r.headers.get('x-kino-size')||0)});}catch{}}
 return out;
}
export async function saveMovie(m,{file,signal,onProgress=()=>{}}={}){
 if(!window.isSecureContext||!('caches' in window))throw Error('Oflayn saqlash uchun HTTPS va zamonaviy brauzer kerak.');
 if(navigator.storage?.persist)try{await navigator.storage.persist()}catch{}
 if(signal?.aborted)throw new DOMException('Bekor qilindi','AbortError');
 let body,type,size;
 if(file){type=file.type||(/\.webm$/i.test(file.name)?'video/webm':/\.mp4$/i.test(file.name)?'video/mp4':'');if(!/^video\/(mp4|webm)$/i.test(type))throw Error('MP4 yoki WebM fayl tanlang.');body=file.stream();size=file.size;}
 else{
  if(!m.video)throw Error('Bu kinoning video fayli mavjud emas.');
  let r;try{r=await fetch(m.video,{signal,mode:'cors',credentials:'omit'});}catch(e){if(signal?.aborted)throw e;throw Error('Video manbasi brauzer orqali saqlashga ruxsat bermadi. Faylni yuklab olib, Oflayn kutubxonaga import qiling.');}
  if(r.status!==200||!r.body)throw Error('To‘liq video faylini olish imkoni bo‘lmadi.');
  type=(r.headers.get('content-type')||'').split(';')[0];if(!/^video\/(mp4|webm|x-m4v)$/i.test(type)&&type!=='application/octet-stream'){await r.body.cancel();throw Error('Manba video faylini qaytarmadi.');}
  if(type==='application/octet-stream')type=/\.webm(?:[?#]|$)/i.test(m.video)?'video/webm':'video/mp4';
  size=Number(r.headers.get('content-length')||0);body=r.body;
 }
 if(size&&navigator.storage?.estimate){try{const e=await navigator.storage.estimate();if(e.quota&&size>e.quota-(e.usage||0))throw Error('Qurilmada brauzer uchun yetarli bo‘sh joy yo‘q.');}catch(e){if(e.message.includes('bo‘sh joy')){await body.cancel();throw e;}}}
 let received=0;const reader=body.getReader();
 const abort=()=>{reader.cancel().catch(()=>{});};signal?.addEventListener('abort',abort,{once:true});
 const stream=new ReadableStream({async pull(controller){try{if(signal?.aborted)throw new DOMException('Bekor qilindi','AbortError');const {done,value}=await reader.read();if(signal?.aborted)throw new DOMException('Bekor qilindi','AbortError');if(done){if(!received||(size&&received!==size))throw Error('Video to‘liq yuklanmadi.');controller.close();return;}received+=value.byteLength;onProgress(received,size);controller.enqueue(value);}catch(e){controller.error(e);reader.cancel().catch(()=>{});}},cancel(){return reader.cancel();}});
 const c=await cache();
 try{await c.put(key(m.id),new Response(stream,{headers:{'content-type':type,'x-kino-meta':pack(m),'x-kino-size':String(size||0)}}));}
 catch(e){if(signal?.aborted)throw new DOMException('Bekor qilindi','AbortError');if(e.name==='QuotaExceededError')throw Error('Brauzer xotirasi to‘ldi.');throw e;}
 finally{signal?.removeEventListener('abort',abort);}
 return received;
}
export async function playbackUrl(id){const r=await (await cache()).match(key(id));if(!r)throw Error('Saqlangan video topilmadi.');return URL.createObjectURL(await r.blob());}
export async function removeMovie(id){return (await cache()).delete(key(id));}
export async function storageInfo(){const e=await navigator.storage?.estimate?.()||{};return {...e,persisted:await navigator.storage?.persisted?.()||false};}
