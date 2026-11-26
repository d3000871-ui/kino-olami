import { handleUpload } from '@vercel/blob/client';
import { authorized, validPath, metadata, publish } from '../lib/library.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'POST required'});
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  const result=await handleUpload({body,request:req,onBeforeGenerateToken:async(pathname,clientPayload)=>{
   const payload=JSON.parse(clientPayload||'{}');
   if(!authorized(payload.password))throw Error('Admin paroli noto‘g‘ri yoki sozlanmagan');
   if(!validPath(pathname))throw Error('Faqat MP4 yoki WebM');
   const meta=metadata(payload.meta);
   return {allowedContentTypes:['video/mp4','video/webm'],maximumSizeInBytes:5*1024*1024*1024,addRandomSuffix:false,tokenPayload:JSON.stringify(meta)};
  },onUploadCompleted:async({blob,tokenPayload})=>{await publish(blob,JSON.parse(tokenPayload));}});
  return res.status(200).json(result);
 }catch(e){return res.status(400).json({error:e.message||'Yuklash xatosi'});}
}
