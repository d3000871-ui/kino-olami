import { list } from '@vercel/blob';
import { authorized, validPath, metadata, publish, catalog } from '../lib/library.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method==='GET'){
  if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(200).json({movies:[],configured:false});
  try{return res.status(200).json({movies:await catalog(),configured:true});}
  catch{return res.status(503).json({error:'Kino ombori bilan bog‘lanib bo‘lmadi'});}
 }
 if(req.method!=='POST')return res.status(405).end();
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!authorized(b?.password))return res.status(401).json({error:'Admin paroli noto‘g‘ri'});
  if(!validPath(b.pathname))throw Error('Fayl manzili noto‘g‘ri');
  const meta=metadata(b.meta);
  const page=await list({prefix:b.pathname,limit:10});
  const blob=page.blobs.find(x=>x.pathname===b.pathname);
  if(!blob)throw Error('Video omborda topilmadi');
  return res.status(200).json({movie:await publish(blob,meta)});
 }catch(e){return res.status(400).json({error:e.message||'Saqlash xatosi'});}
}
