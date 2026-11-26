export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const token=process.env.TMDB_READ_TOKEN;if(!token)return res.status(503).json({error:'TMDB ulanmagan'});
 const id=String(req.query?.id||''),media=req.query?.media==='tv'?'tv':'movie',langs={uz:'uz-UZ',ru:'ru-RU',en:'en-US'},lang=langs[req.query?.lang]||langs.uz;
 if(!/^\d{1,10}$/.test(id))return res.status(400).json({error:'ID noto‘g‘ri'});
 try{const base='https://api.themoviedb.org/3/'+media+'/'+id;
 const headers={Authorization:'Bearer '+token,accept:'application/json'};
 const fetchDetails=async lang=>{const r=await fetch(base+'?'+new URLSearchParams({language:lang,append_to_response:'credits,videos,watch/providers'}),{headers,signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error();return r.json();};
 const d=await fetchDetails(lang);let fallback;if(!d.overview&&lang!=='en-US')try{fallback=await fetchDetails('en-US')}catch{}
 const providers=d['watch/providers']?.results?.UZ||null;
 const trailers=[...(d.videos?.results||[]),...(fallback?.videos?.results||[])].filter(x=>x.site==='YouTube'&&x.type==='Trailer'&&/^[A-Za-z0-9_-]{11}$/.test(x.key));
 res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
 return res.json({title:d.title||d.name,description:d.overview||fallback?.overview||'',descriptionLang:d.overview?lang:fallback?.overview?'en-US':'',runtime:d.runtime||d.episode_run_time?.[0]||null,seasons:d.number_of_seasons||null,cast:(d.credits?.cast||[]).slice(0,8).map(x=>({name:x.name,character:x.character})),trailer:trailers[0]?.key||'',providers:providers?{link:providers.link,names:[...new Set([...(providers.flatrate||[]),...(providers.rent||[]),...(providers.buy||[])].map(x=>x.provider_name))]}:null});
 }catch{return res.status(502).json({error:'Film ma’lumotini yuklab bo‘lmadi'});}
}