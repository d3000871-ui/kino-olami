import {mountEmbed,embedMarkup} from './embed-player.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function movieDetails(m,dialog,alive,initial='uz'){
 const area=document.createElement('section');area.className='extraDetails';area.innerHTML='<label>Ma’lumot tili <select><option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option></select></label><div class="extraContent" role="status"></div>';dialog.querySelector('.detailbody').append(area);
 const select=area.querySelector('select'),content=area.querySelector('.extraContent');select.value=initial;let request=0;
 async function load(){const n=++request;content.textContent='Ma’lumot yuklanmoqda…';try{const id=m.tmdbId||m.id.split('-').pop();const r=await fetch('/api/details?'+new URLSearchParams({id,media:m.media||'movie',lang:select.value}));const d=await r.json();if(!r.ok)throw Error(d.error);if(!alive()||n!==request)return;
 const title=dialog.querySelector('h2'),desc=dialog.querySelector('#movieDescription');if(title&&d.title)title.textContent=d.title;if(desc)desc.textContent=(d.description||'Tavsif mavjud emas.')+(d.descriptionLang==='en-US'&&select.value!=='en'?' (Inglizcha manba)':'');
 const cast=(d.cast||[]).map(x=>esc(x.name)+(x.character?' — '+esc(x.character):'')).join(' · ');
 let provider='';try{const u=new URL(d.providers?.link);if(u.protocol==='https:'&&(u.hostname==='themoviedb.org'||u.hostname.endsWith('.themoviedb.org')))provider='<p>O‘zbekistondagi rasmiy tomosha manbalari: '+esc(d.providers.names.join(', '))+'</p><small>Tomosha manbalari: JustWatch.</small>';}catch{}
 content.innerHTML=(d.runtime?'<p>Davomiyligi: '+esc(d.runtime)+' daqiqa</p>':'')+(d.seasons?'<p>Fasllar: '+esc(d.seasons)+'</p>':'')+(cast?'<p><b>Aktyorlar:</b> '+cast+'</p>':'')+(d.trailer?'<button class="outline" id="trailerInline">▶ Treyler</button>':'')+provider+'<p class="credit">TMDB ma’lumotlari. Bu katalog yozuvi to‘liq film fayli emas.</p>';const t=content.querySelector('#trailerInline');if(t)t.onclick=()=>{if(!/^[A-Za-z0-9_-]{11}$/.test(d.trailer))return;const existing=content.querySelector('.officialPlayer');if(existing)existing.remove();const div=document.createElement('div');div.innerHTML=embedMarkup();const node=div.firstElementChild;content.append(node);mountEmbed(node.querySelector('.embedHost'),d.trailer);};
 }catch(e){if(alive()&&n===request)content.textContent=e.message||'Ma’lumot yuklanmadi.';}}
 select.onchange=load;load();
}
