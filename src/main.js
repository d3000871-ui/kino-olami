import './style.css';
import {attachSubtitles} from './subtitles.js';
import {savedList,saveMovie,playbackUrl,removeMovie,storageInfo} from './offline.js';
import openMovies from './open-movies.js';
import {openProfile} from './user.js';
import {bindSearch} from './search.js';
const app=document.querySelector('#app');
const demo=[
{id:'bunny',title:'Big Buck Bunny',year:'2008',genre:'Multfilm',description:'Tinchlikni sevuvchi ulkan quyonning o‘rmondagi sarguzashtlari. Blender Foundation ochiq animatsion filmi.',language:'So‘zsiz',video:'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',poster:'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',info:'https://peach.blender.org/',source:'demo',rating:null},
{id:'sintel',title:'Sintel',year:'2010',genre:'Fantastika',description:'Yosh qahramon va ajdarho haqidagi fantastik sarguzasht. Blender Foundation ochiq filmi.',language:'Inglizcha',video:'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',poster:'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',info:'https://durian.blender.org/',source:'demo',rating:null},
{id:'tears',title:'Tears of Steel',year:'2012',genre:'Fantastika',description:'Kelajak Amsterdamida insonlar va robotlar to‘qnashuvi. Blender Foundation ochiq filmi.',language:'Inglizcha',video:'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',poster:'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',info:'https://mango.blender.org/',source:'demo',rating:null}
];
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const write=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch{}};
let favorites=read('kino-favorites',[]),ratings=read('kino-ratings',{}),history=read('kino-history',{}),library=[],discover=[],remote=[],tab='home',query='',genre='',sort='new',notice='',blobReady=false,tmdbReady=false,active=null,searchId=0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=v=>{try{const u=new URL(v);return u.protocol==='https:'?esc(u.href):''}catch{return ''}};
let savedMovies=read('kino-saved-movies',{}),page=0,totalPages=0,totalResults=0,busy=false,media='movie',year='',catalogError='';
const genreOptions=['Jangari','Sarguzasht','Multfilm','Komediya','Kriminal','Hujjatli','Drama','Fantastika','Qo‘rqinchli','Romantika','Triller','Oilaviy','Tarixiy','Musiqa','Detektiv','Urush','Vestern','Boshqa'];
let audioFilter='',subtitleCleanup=()=>{};
const isUz=m=>/^(uz(?:-uz)?|o[‘’ʻʼ'`]?zbek(?:cha)?|uzbek)$/i.test(String(m.language||'').trim());
const languageCode=m=>{const t=String(m.language||'').toLowerCase().trim();return isUz(m)?'uz':/^(ru(?:-ru)?|ruscha|russian|русский)$/.test(t)?'ru':/^(en(?:-us|-gb)?|inglizcha|english)$/.test(t)?'en':'other';};
const labels={uz:'O‘zbekcha',ru:'Русский',en:'English',other:'Asl til'};
const groupKey=m=>m.groupId||m.id;
const variants=m=>all().filter(x=>groupKey(x)===groupKey(m)&&(x.video||offlineId(x.id))&&(navigator.onLine||offlineId(x.id)));
let offlineMovies=[],offlineNotice='',offlineJob=null,localPlayback='',playSeq=0;
const offlineId=id=>offlineMovies.some(m=>m.id===id);
const all=()=>[...library,...demo,...openMovies,...discover,...remote,...Object.values(savedMovies),...offlineMovies].filter((m,i,a)=>a.findIndex(x=>x.id===m.id)===i);
const star=m=>m.rating==null?'—':Number(m.rating).toFixed(1);
app.innerHTML='<header><a class="brand" href="#" data-tab="home"><span class="logo">▶</span>KINO<span>OLAMI</span></a><nav><button data-tab="home">Bosh sahifa</button><button data-tab="watch">Tomosha</button><button data-tab="favorites">Sevimlilar</button><button data-tab="history">Tarix</button><button data-tab="offline">↓ Oflayn</button></nav><div class="headright"><label class="search">⌕ <input id="search" placeholder="Kino qidirish..." aria-label="Kino qidirish"></label><button class="outline" id="profile">♙ Profil</button></div></header><main><section id="hero"></section><section class="catalog"><div class="sectionhead"><div><span class="eyebrow">KINO KUTUBXONASI</span><h2 id="heading">Barcha kinolar</h2></div><div class="filters"><select id="media" aria-label="Tur"><option value="movie">Kinolar</option><option value="tv">Seriallar</option></select><select id="year" aria-label="Yil"><option value="">Barcha yillar</option></select><select id="audioFilter" aria-label="Ovoz tili"><option value="">Barcha tillar</option><option value="uz">O‘zbekcha ovoz</option><option value="ru">Русский звук</option><option value="en">English audio</option></select><select id="genre" aria-label="Janr"><option value="">Barcha janrlar</option></select><select id="sort" aria-label="Saralash"><option value="new">Yangilari</option><option value="rating">Reyting</option><option value="title">A–Z</option></select></div></div><p id="notice" class="notice" role="status"></p><div id="offlineTools" hidden><p id="storageInfo"></p><button class="outline" id="installApp" hidden>Ilovani o‘rnatish</button> <label class="outline importLabel">＋ Qurilmadan video qo‘shish<input id="importVideo" type="file" accept="video/mp4,video/webm,.mp4,.webm"></label><p id="offlineStatus" role="status"></p><progress id="offlineProgress" hidden></progress><button id="cancelOffline" class="outline" hidden>Bekor qilish</button></div><div id="cards" class="cards"></div><div class="pagination"><p id="catalogCount" aria-live="polite"></p><button id="more" class="outline" hidden>Yana ko‘rsatish ↓</button></div></section></main><footer><b>KINO OLAMI</b><span>Faqat tarqatishga ruxsat etilgan filmlar.</span><small>This product uses the TMDB API but is not endorsed or certified by TMDB. <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDB</a> · Ochiq filmlar: Blender Foundation.</small></footer><dialog id="detail"></dialog><dialog id="profileDialog"></dialog>';
const $=s=>document.querySelector(s);
$('#year').insertAdjacentHTML('beforeend',Array.from({length:new Date().getFullYear()-1887},(_,i)=>'<option>'+ (new Date().getFullYear()-i)+'</option>').join(''));
const hero=()=>{const m=library[0]||demo[1];$('#hero').innerHTML='<div class="hero" '+(m.poster?'style="--hero:url(&quot;'+url(m.poster)+'&quot;)"':'')+'><div class="heroContent"><span class="eyebrow">✦ TANLANGAN FILM</span><h1>'+esc(m.title)+'</h1><div class="tags"><span>'+esc(m.year)+'</span><span>'+esc(m.genre)+'</span><span>HD</span></div><p>'+esc(m.description)+'</p><button class="primary" data-open="'+esc(m.id)+'">▶ Tomosha qilish</button> <button class="outline" data-fav="'+esc(m.id)+'">'+(favorites.includes(m.id)?'♥ Saqlangan':'♡ Sevimlilarga')+'</button></div></div>';};
function render(){
 hero();$('#hero').hidden=tab!=='home'||!!query;
 const names={home:'Barcha kinolar',watch:'Tomosha qilish',favorites:'Sevimli kinolar',history:'Tomosha tarixi',offline:'Oflayn kinolar'};
 $('#offlineTools').hidden=tab!=='offline';
 $('#heading').textContent=query?'Qidiruv natijalari':names[tab];
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('selected',b.dataset.tab===tab));
 const movies=all();
 const genres=[...new Set([...genreOptions,...movies.map(m=>m.genre)])].sort();
 $('#genre').innerHTML='<option value="">Barcha janrlar</option>'+genres.map(g=>'<option>'+esc(g)+'</option>').join('');
 $('#genre').value=genre;
 let shown=movies.filter(m=>(!audioFilter||languageCode(m)===audioFilter)&&(!year||m.year===year)&&(!genre||m.genre===genre||m.genres?.includes(genre))&&(tab!=='home'||(media==='tv'?m.media==='tv':m.media!=='tv'))&&(!query||(m.title+' '+m.description+' '+m.genre).toLowerCase().includes(query.toLowerCase())||((query?remote:discover).some(x=>x.id===m.id)))&&(tab==='home'||tab==='watch'&&(m.video||offlineId(m.id))||tab==='favorites'&&favorites.includes(m.id)||tab==='history'&&history[m.id]||tab==='offline'&&offlineId(m.id)));
 if(!audioFilter&&['home','watch'].includes(tab)){shown=shown.filter((m,i,arr)=>arr.findIndex(x=>groupKey(x)===groupKey(m))===i);}
 if(sort==='rating')shown.sort((a,b)=>(b.rating??-1)-(a.rating??-1));if(sort==='title')shown.sort((a,b)=>a.title.localeCompare(b.title));if(tab==='history'&&sort==='new')shown.sort((a,b)=>history[b.id].updated-history[a.id].updated);
 $('#notice').textContent=tab==='offline'?'Internet borida saqlangan filmlar. Internet o‘chsa ham shu qurilmada tomosha qiling.':!navigator.onLine?'Internet yo‘q — Oflayn bo‘limidagi saqlangan kinolarni tomosha qiling.':catalogError||notice||(!blobReady?'Demo rejimi: doimiy video ombori Vercel Blob ulanganda ishlaydi.':'')+(!tmdbReady?' TMDB tokeni ulanmagan: hozircha ochiq filmlar va yuklangan kinolar ko‘rinadi.':'');
 $('#cards').innerHTML=shown.length?shown.map(m=>'<article class="movie"><button class="poster" data-open="'+esc(m.id)+'" aria-label="'+esc(m.title)+'">'+(m.poster?'<img loading="lazy" src="'+url(m.poster)+'" alt="">':'<span class="placeholder">🎬</span>')+'<span class="score">★ '+star(m)+'</span><span class="playmark">'+(m.video||offlineId(m.id)?'▶':'ⓘ')+'</span><span class="quality">'+(offlineId(m.id)?'✓ OFLAYN':m.video?'VIDEO':'MA’LUMOT')+'</span></button><button class="fav" data-fav="'+esc(m.id)+'" aria-label="Sevimlilarga">'+(favorites.includes(m.id)?'♥':'♡')+'</button><button class="movietitle" data-open="'+esc(m.id)+'">'+esc(m.title)+'</button><div class="sub">'+esc(m.year||'—')+' · '+esc(m.genre)+(m.video||offlineId(m.id)?' · '+esc([...new Set(variants(m).map(x=>labels[languageCode(x)]))].join(' / ')):'')+'</div></article>').join(''):'<div class="empty">🎬<h3>Hozircha kino yo‘q</h3><p>Boshqa so‘z yoki janrni tanlang.</p></div>';
 pagination(shown.length);
}
function toggleFav(id){const movie=all().find(x=>x.id===id);if(movie){savedMovies[id]=movie;write('kino-saved-movies',savedMovies);}favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];write('kino-favorites',favorites);render();if(active?.id===id){const b=$('#detail [data-fav]');if(b)b.textContent=favorites.includes(id)?'♥ Saqlangan':'♡ Sevimlilarga';}}
async function showMovie(id){const m=all().find(x=>x.id===id);if(!m)return;active=m;if(m.video){savedMovies[id]=m;write('kino-saved-movies',savedMovies);}const d=$('#detail');const seq=++playSeq;const hasLocal=offlineId(id);const versions=variants(m);d.innerHTML='<button class="close" data-close aria-label="Yopish">×</button>'+(m.video||hasLocal?'<video id="player" controls playsinline preload="metadata" '+(!hasLocal&&m.video?'src="'+url(m.video)+'"':'')+' '+(m.poster&&navigator.onLine?'poster="'+url(m.poster)+'"':'')+'></video>':'<div class="infohero">'+(m.poster?'<img src="'+url(m.poster)+'" alt="">':'🎬')+'<p>Bu film haqida ma’lumot. Tomosha fayli hali qo‘shilmagan. Rasmiy manba orqali ma’lumot oling.</p></div>')+'<div class="detailbody"><span class="eyebrow">'+esc(m.source==='tmdb'?'TMDB katalogi':'Kino Olami')+'</span><h2>'+esc(m.title)+'</h2><div class="tags"><span>★ '+star(m)+'</span><span>'+esc(m.year)+'</span><span>'+esc(m.genre)+'</span><span>'+esc(m.language)+(isUz(m)?' · O‘zbekcha ovoz':'')+'</span></div><p id="movieDescription">'+esc(m.description||'Tavsif mavjud emas.')+'</p>'+(m.credit?'<p class="credit">'+esc(m.credit)+'</p>':'')+(versions.length?'<div class="audioVersions"><b>Ovoz / Язык / Audio</b><div class="actions">'+versions.map(x=>'<button class="'+(x.id===id?'primary':'outline')+'" data-version="'+esc(x.id)+'" '+(x.id===id?'aria-current="true"':'')+'>'+esc(labels[languageCode(x)])+(offlineId(x.id)?' ✓':'')+'</button>').join('')+'</div><small>Faqat mavjud tarjimalar ko‘rsatiladi. Har bir tilni alohida oflayn saqlash mumkin.</small></div>':'')+'<div class="actions">'+(m.video?'<a class="primary" href="'+url(m.download||m.video)+'" download target="_blank" rel="noopener">↓ Yuklab olish</a>':'')+(hasLocal?'<button class="outline" id="removeLocal">Oflayn nusxani o‘chirish</button>':m.video?'<button class="primary" id="saveLocal">↓ Oflayn saqlash</button>':'')+'<button class="outline" data-fav="'+esc(id)+'">'+(favorites.includes(id)?'♥ Saqlangan':'♡ Sevimlilarga')+'</button>'+(m.info?'<a class="outline" target="_blank" rel="noopener" href="'+url(m.info)+'">Manba ↗</a>':'')+'</div>'+(m.video||hasLocal?'<div class="subtitleTools"><b>Tarjima subtitrlari</b><p>SRT yoki VTT faylini tanlang. Subtitr video ovozini o‘zgartirmaydi.</p><label>Subtitr tili <select id="subtitleLanguage"><option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option></select></label> <label class="outline importLabel">＋ Subtitr<input type="file" id="subtitleFile" accept=".srt,.vtt"></label> <button class="outline" id="subtitleRemove">Subtitrni o‘chirish</button><p id="subtitleStatus" role="status"></p></div>':'')+'<label class="ratinglabel">Shaxsiy bahoyingiz (shu qurilmada) <select id="myRating"><option value="">Baholash</option>'+Array.from({length:10},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'/10</option>').join('')+'</select></label><p id="localStatus" role="status"></p><progress id="localProgress" hidden></progress><button class="outline" id="cancelLocal" hidden>Bekor qilish</button></div>';
 d.showModal();jobUI();$('#myRating').value=ratings[id]||'';$('#myRating').onchange=e=>{if(e.target.value)ratings[id]=Number(e.target.value);else delete ratings[id];write('kino-ratings',ratings);};
 const v=$('#player');if(v){subtitleCleanup();subtitleCleanup=attachSubtitles(v,m,$('#subtitleFile'),$('#subtitleRemove'),$('#subtitleStatus'),$('#subtitleLanguage'));v.addEventListener('loadedmetadata',()=>{if(history[id]?.time>0&&history[id].time<v.duration-5)v.currentTime=history[id].time});let saved=0;v.addEventListener('timeupdate',()=>{if(Math.abs(v.currentTime-saved)<4)return;saved=v.currentTime;history[id]={time:v.currentTime,updated:Date.now()};write('kino-history',history)});v.addEventListener('pause',()=>{if(v.currentTime>0){history[id]={time:v.currentTime,updated:Date.now()};write('kino-history',history)}});}
 if(hasLocal){try{const u=await playbackUrl(id);if(seq!==playSeq||!d.open){URL.revokeObjectURL(u);return;}localPlayback=u;v.src=u;}catch(e){if(seq===playSeq)$('#localStatus').textContent=e.message;}}
 const save=$('#saveLocal');if(save)save.onclick=()=>beginOffline(m,null,'local');
 const del=$('#removeLocal');if(del)del.onclick=async()=>{if(!confirm('Faqat qurilmadagi oflayn nusxa o‘chirilsinmi?'))return;try{await removeMovie(id);await reloadOffline();d.close();}catch(e){$('#localStatus').textContent=e.message;}};
}
$('#detail').addEventListener('close',()=>{$('#player')?.pause();subtitleCleanup();subtitleCleanup=()=>{};playSeq++;if(localPlayback){URL.revokeObjectURL(localPlayback);localPlayback='';}active=null;$('#detail').innerHTML='';render()});
document.addEventListener('click',e=>{const b=e.target.closest('button,a[data-tab]');if(!b)return;if(b.dataset.close!==undefined)b.closest('dialog').close();if(b.dataset.tab){e.preventDefault();tab=b.dataset.tab;if(tab==='offline'){query='';$('#search').value='';genre='';year='';audioFilter='';$('#audioFilter').value='';$('#year').value='';reloadOffline();}render();if(tab==='home'&&page===0&&!busy)loadCatalog(true)}if(b.dataset.version&&b.dataset.version!==active?.id){const next=b.dataset.version;const d=$('#detail');d.addEventListener('close',()=>showMovie(next),{once:true});d.close();}if(b.dataset.open)showMovie(b.dataset.open);if(b.dataset.fav)toggleFav(b.dataset.fav);if(b.id==='profile')openProfile({favorites,history,offlineMovies})});
$('#audioFilter').onchange=e=>{audioFilter=e.target.value;refresh()};$('#genre').onchange=e=>{genre=e.target.value;refresh()};$('#sort').onchange=e=>{sort=e.target.value;refresh()};$('#year').onchange=e=>{year=e.target.value;refresh()};$('#media').onchange=e=>{media=e.target.value;tab='home';refresh()};$('#more').onclick=()=>loadCatalog(false);
function pagination(shown){
 const visible=tab==='home';
 $('#more').hidden=!visible||!tmdbReady||(!busy&&page>=totalPages);
 $('#more').disabled=busy;
 $('#more').textContent=busy?'Yuklanmoqda…':'Yana 20 ta ko‘rsatish ↓';
 $('#catalogCount').textContent=shown+' ta ko‘rsatilmoqda'+(visible&&tmdbReady&&totalResults?' · TMDB natijalari: '+totalResults.toLocaleString('uz-UZ'):'');
}
async function loadCatalog(reset=false){
 if(!reset&&busy)return;
 if(reset){searchId++;page=0;totalPages=0;totalResults=0;discover=[];remote=[];catalogError='';}
 const id=searchId,next=page+1;busy=true;render();
 try{
  const p=new URLSearchParams({q:query,genre,year,sort,media,audio:audioFilter,page:String(next)});
  const r=await fetch('/api/discover?'+p);const data=await r.json();
  if(!r.ok)throw Error(data.error||'Katalog yuklanmadi');
  if(id!==searchId)return;
  tmdbReady=!!data.configured;page=next;totalPages=data.totalPages||0;totalResults=data.totalResults||0;
  if(query)remote=[...remote,...data.movies];else discover=[...discover,...data.movies];
  catalogError='';
 }catch(e){if(id===searchId)catalogError=e.message;}
 finally{if(id===searchId){busy=false;render();}}
}
function refresh(){if(tab==='home')loadCatalog(true);else render()}
bindSearch($('#search'),{onChange:value=>{query=value; if(tab!=='offline')tab='home';searchId++;busy=false;page=0;totalPages=0;totalResults=0;discover=[];remote=[];render();},onSubmit:()=>{if(tab==='home'&&navigator.onLine)loadCatalog(true);}});
render();
async function init(){await reloadOffline();if(!navigator.onLine){tab='offline';render();return;}loadCatalog(true);try{const r=await fetch('/api/library');if(!r.ok)throw Error();const d=await r.json();library=d.movies||[];blobReady=!!d.configured}catch{notice='Ombor bilan bog‘lanib bo‘lmadi. Ochiq filmlar mavjud.'}render()}init();

function bytes(n){return n>=1024**3?(n/1024**3).toFixed(2)+' GB':(n/1024**2).toFixed(1)+' MB';}
async function reloadOffline(){try{offlineMovies=await savedList();const e=await storageInfo();$('#storageInfo').textContent=offlineMovies.length+' ta saqlangan kino'+(e.quota?' · Brauzer bo‘sh joyi taxminan '+bytes(Math.max(0,e.quota-(e.usage||0))):'')+(e.persisted?' · Doimiy saqlash ruxsati bor':' · Brauzer xotirasi tozalansa nusxalar o‘chishi mumkin.');}catch(e){$('#storageInfo').textContent='Bu brauzerda oflayn ombor ishlamayapti.';}render();}
function jobUI(){for(const [statusId,progressId,cancelId] of [['#offlineStatus','#offlineProgress','#cancelOffline'],['#localStatus','#localProgress','#cancelLocal']]){const status=$(statusId),p=$(progressId),b=$(cancelId);if(status)status.textContent=offlineNotice;if(p){p.hidden=!offlineJob;if(offlineJob?.total){p.max=offlineJob.total;p.value=offlineJob.received;}else p.removeAttribute('value');}if(b){b.hidden=!offlineJob;b.onclick=()=>offlineJob?.controller.abort();}}const save=$('#saveLocal');if(save){save.disabled=!!offlineJob||offlineId(active?.id);if(offlineId(active?.id))save.textContent='✓ Oflayn saqlandi';}}
async function beginOffline(m,file,where){
 if(offlineJob){offlineNotice='Boshqa kino saqlanmoqda.';jobUI();return;}
 const controller=new AbortController();offlineJob={controller,total:0,received:0};
 offlineNotice='Saqlanmoqda…';jobUI();
 try{await saveMovie(m,{file,signal:controller.signal,onProgress:(received,total)=>{if(!offlineJob)return;offlineJob.received=received;offlineJob.total=total;offlineNotice='Saqlanmoqda: '+bytes(received)+(total?' / '+bytes(total):'');jobUI();}});offlineNotice='✓ Kino qurilmaga saqlandi. Internet bo‘lmasa ham Oflayn bo‘limida ochiladi.';await reloadOffline();}
 catch(e){offlineNotice=controller.signal.aborted?'Yuklash bekor qilindi.':e.message||'Saqlashda xatolik.';}
 finally{offlineJob=null;jobUI();}
}
$('#importVideo').onchange=e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;beginOffline({id:'local-'+crypto.randomUUID(),title:f.name.replace(/\.[^.]+$/,''),genre:'Boshqa',description:'Qurilmadan import qilingan video.',language:'Asl til',source:'local'},f,'offline');};
window.addEventListener('offline',()=>{tab='offline';query='';genre='';year='';$('#search').value='';$('#year').value='';render();});
window.addEventListener('online',()=>{render();if(!blobReady){fetch('/api/library').then(r=>r.json()).then(d=>{library=d.movies||[];blobReady=!!d.configured;render()}).catch(()=>{});}if(tab==='home')loadCatalog(true);});
let installPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#installApp').hidden=false;});
$('#installApp').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('#installApp').hidden=true;};
window.addEventListener('appinstalled',()=>{$('#installApp').hidden=true;});
if(import.meta.env.PROD&&'serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{offlineNotice='Oflayn saytni o‘rnatib bo‘lmadi. HTTPS va brauzer sozlamalarini tekshiring.';jobUI();});}
