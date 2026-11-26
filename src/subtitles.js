export async function readSubtitleFile(file,limit=500000){
 if(file.size>limit)throw Error('Subtitr fayli hajmi chegaradan katta.');
 let t=(await file.text()).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
 if(!t.startsWith('WEBVTT'))t='WEBVTT\n\n'+t.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2');
 if(!t.includes('-->'))throw Error('Subtitr vaqtlari topilmadi.');
 return t;
}
export function attachSubtitles(video,m,input,remove,status,select){
 let track=null,objectUrl='',disposed=false;
 const names={uz:'O‘zbekcha',ru:'Русский',en:'English'};
 const key=lang=>'kino-sub-'+lang+'-'+m.id;
 function clear(){if(track){track.remove();track=null;}if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}}
 function show(t,lang){clear();if(!t||disposed)return;objectUrl=URL.createObjectURL(new Blob([t],{type:'text/vtt'}));track=document.createElement('track');track.kind='subtitles';track.label=names[lang];track.srclang=lang;track.src=objectUrl;track.default=true;video.append(track);track.track.mode='showing';status.textContent=names[lang]+' subtitri yoqildi.';}
 function pick(){const lang=select?.value||'uz';let local;try{local=localStorage.getItem(key(lang));}catch{}const t=local||(lang==='uz'?m.subtitleUz:'');status.textContent=t?'':'Bu tilda subtitr hali qo‘shilmagan.';show(t,lang);}
 if(select)select.onchange=pick;
 pick();
 if(input)input.onchange=async()=>{const f=input.files?.[0],lang=select?.value||'uz';input.value='';if(!f)return;try{const t=await readSubtitleFile(f);if(disposed)return;try{localStorage.setItem(key(lang),t);}catch{if((select?.value||'uz')===lang){show(t,lang);status.textContent='Subtitr yoqildi, lekin qurilmaga saqlanmadi.';}return;}if((select?.value||'uz')===lang)show(t,lang);}catch(e){if(!disposed)status.textContent=e.message;}};
 if(remove)remove.onclick=()=>{const lang=select?.value||'uz';clear();try{localStorage.removeItem(key(lang));}catch{}status.textContent='Subtitr o‘chirildi.';};
 return ()=>{disposed=true;clear();};
}
