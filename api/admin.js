import {list,put} from '@vercel/blob';
import {randomUUID} from 'node:crypto';
import {authorized,metadata} from '../lib/library.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).end();
 try{const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
 if(!authorized(b?.password))return res.status(401).json({error:'Admin paroli noto‘g‘ri'});
 if(b.action==='login')return res.json({ok:true});
 if(b.action==='add-link'){
  const meta=metadata(b.meta);const u=new URL(String(b.video||''));
  if(u.protocol!=='https:'||u.username||u.password||! /\.(mp4|webm)$/i.test(u.pathname)||u.href.length>2000)throw Error('HTTPS MP4 yoki WebM video havolasi kerak');
  const id=randomUUID(),movie={...meta,id,video:u.href,download:u.href,source:'library',createdAt:new Date().toISOString()};
  await put('catalog/'+id+'.json',JSON.stringify(movie),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,cacheControlMaxAge:60});return res.json({movie});
 }
 if(b.action!=='edit'||! /^[a-f0-9-]{36}$/i.test(String(b.id)))return res.status(400).json({error:'So‘rov noto‘g‘ri'});
 const path='catalog/'+b.id+'.json';const page=await list({prefix:path,limit:5});const blob=page.blobs.find(x=>x.pathname===path);
 if(!blob)return res.status(404).json({error:'Kino topilmadi'});
 const old=await fetch(blob.url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Ombor xatosi');return r.json()});
 const fields={};for(const k of ['title','year','genre','language','groupId','rating','poster','description'])if(Object.hasOwn(b.meta||{},k))fields[k]=b.meta[k];
 const movie={...old,...metadata({...old,...fields,rights:true}),updatedAt:new Date().toISOString()};
 await put(path,JSON.stringify(movie),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true,cacheControlMaxAge:60});return res.json({movie});
 }catch(e){return res.status(400).json({error:e.message||'Saqlash xatosi'});}
}
