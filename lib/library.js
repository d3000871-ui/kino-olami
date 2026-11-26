import { timingSafeEqual } from 'node:crypto';
import { list, put } from '@vercel/blob';
export function authorized(password) {
 const secret=process.env.ADMIN_PASSWORD;
 if(!secret || typeof password!=='string') return false;
 const a=Buffer.from(secret),b=Buffer.from(password);
 return a.length===b.length && timingSafeEqual(a,b);
}
export const validPath=p=>typeof p==='string' && /^movies\/[a-f0-9-]{36}\.(mp4|webm)$/i.test(p);
export function metadata(o={}) {
 const clean=(v,n)=>String(v??'').trim().slice(0,n);
 const title=clean(o.title,120); if(!title) throw new Error('Film nomini kiriting');
 if(o.rights!==true) throw new Error('Tarqatish huquqini tasdiqlang');
 const rating=o.rating===''||o.rating==null?null:Number(o.rating);
 if(rating!==null&&(!Number.isFinite(rating)||rating<0||rating>10)) throw new Error('Reyting 0–10 oralig‘ida bo‘lsin');
 const year=clean(o.year,4); if(year&&!/^\d{4}$/.test(year)) throw new Error('Yil noto‘g‘ri');
 let poster=clean(o.poster,1500); if(poster){const u=new URL(poster);if(u.protocol!=='https:') throw new Error('Poster HTTPS bo‘lishi kerak');}
 return {title,year,genre:clean(o.genre,60)||'Boshqa',description:clean(o.description,4000),rating,poster,language:clean(o.language,50)||'O‘zbekcha',rights:true};
}
export async function publish(blob,meta) {
 if(!validPath(blob.pathname)) throw new Error('Fayl manzili noto‘g‘ri');
 const id=blob.pathname.split('/')[1].split('.')[0];
 const entry={...metadata(meta),id,video:blob.url,download:blob.downloadUrl||blob.url+'?download=1',source:'library',createdAt:new Date().toISOString()};
 await put('catalog/'+id+'.json',JSON.stringify(entry),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true,cacheControlMaxAge:60});
 return entry;
}
export async function catalog(){
 let cursor, all=[];
 do {
  const page=await list({prefix:'catalog/',limit:100,cursor});
  const data=await Promise.allSettled(page.blobs.filter(b=>b.pathname.endsWith('.json')).map(async b=>{const r=await fetch(b.url,{cache:'no-store'});if(!r.ok)throw Error('Metadata');return r.json()}));
  all.push(...data.filter(x=>x.status==='fulfilled').map(x=>x.value));
  cursor=page.hasMore?page.cursor:undefined;
 } while(cursor);
 return all.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
}
