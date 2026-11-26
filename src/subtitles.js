export async function readSubtitleFile(file,limit=500000){
 if(file.size>limit)throw Error('Subtitr fayli hajmi chegaradan katta.');
 let t=(await file.text()).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
 if(!t.startsWith('WEBVTT'))t='WEBVTT\n\n'+t.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2');
 if(!t.includes('-->'))throw Error('Subtitr vaqtlari topilmadi.');
 return t;
}
export function attachSubtitles(video,m,input,remove,status){
 let track=null,objectUrl='',disposed=false;
 const key='kino-sub-uz-'+m.id;
 function clear(){if(track){track.remove();track=null;}if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}}
 function show(t){clear();if(!t||disposed)return;objectUrl=URL.createObjectURL(new Blob([t],{type:'text/vtt'}));track=document.createElement('track');track.kind='subtitles';track.label='O‘zbekcha';track.srclang='uz';track.src=objectUrl;track.default=true;video.append(track);track.track.mode='showing';status.textContent='O‘zbekcha subtitr yoqildi.';}
 let local;try{local=localStorage.getItem(key);}catch{}
 show(local||m.subtitleUz);
 if(input)input.onchange=async()=>{const f=input.files?.[0];input.value='';if(!f)return;try{const t=await readSubtitleFile(f);if(disposed)return;show(t);try{localStorage.setItem(key,t);}catch{status.textContent='Subtitr yoqildi, lekin qurilmaga saqlanmadi.';}}catch(e){if(!disposed)status.textContent=e.message;}};
 if(remove)remove.onclick=()=>{clear();try{localStorage.removeItem(key);}catch{}status.textContent='Subtitr o‘chirildi.';};
 return ()=>{disposed=true;clear();};
}
