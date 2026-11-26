export function wirePlayer(video,sources,{play,retry,status}){
 let i=0,wantsPlay=false,failed=false;
 const note=t=>{if(status)status.textContent=t;};
 const attempt=()=>{wantsPlay=true;video.play().catch(e=>{if(e.name==='NotAllowedError')note('Videoni boshlash uchun yana ▶ bosing.');else if(e.name!=='AbortError'&&!failed&&video.error)next();});};
 const start=(index)=>{i=index;failed=false;retry.hidden=true;note('Video yuklanmoqda…');video.src=sources[i];video.load();if(wantsPlay)attempt();};
 function next(){if(failed)return;if(i+1<sources.length){start(i+1);return;}failed=true;note('Video manbasi ochilmadi. Internetni tekshirib qayta urining yoki Manba havolasini oching.');retry.hidden=false;}
 video.addEventListener('error',next);
 video.addEventListener('waiting',()=>{if(!failed)note('Video buferlanmoqda…');});
 video.addEventListener('canplay',()=>{failed=false;retry.hidden=true;note('Video tayyor');});
 video.addEventListener('playing',()=>{note('');play.hidden=true;});
 video.addEventListener('pause',()=>{play.hidden=false;});
 play.onclick=attempt;retry.onclick=()=>{wantsPlay=true;if(sources.length){wantsPlay=true;start(0);}else{failed=false;retry.hidden=true;video.load();attempt();}};
 if(sources.length)start(0);
}
