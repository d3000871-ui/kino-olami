const genres={28:'Jangari',12:'Sarguzasht',16:'Multfilm',35:'Komediya',80:'Kriminal',99:'Hujjatli',18:'Drama',14:'Fantastika',27:'Qo‘rqinchli',10749:'Romantika',878:'Fantastika',53:'Triller',10751:'Oilaviy',36:'Tarixiy',10402:'Musiqa',9648:'Detektiv',10752:'Urush',37:'Vestern',10759:'Jangari',10765:'Fantastika',10768:'Urush',10762:'Multfilm'};
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const token=process.env.TMDB_READ_TOKEN;
 if(!token)return res.status(200).json({movies:[],configured:false,totalPages:0,totalResults:0});
 const q=String(req.query?.q||'').trim().slice(0,100),media=req.query?.media==='tv'?'tv':'movie',genre=String(req.query?.genre||''),year=String(req.query?.year||''),sort=req.query?.sort;
 const page=Math.max(1,Math.min(500,parseInt(req.query?.page,10)||1));
 const params=new URLSearchParams({language:'en-US',include_adult:'false',page:String(page)});
 const validYear=/^\d{4}$/.test(year);
 if(q){params.set('query',q);if(validYear)params.set(media==='movie'?'primary_release_year':'first_air_date_year',year);}
 else{
  if(validYear)params.set(media==='movie'?'primary_release_year':'first_air_date_year',year);
  const ids=Object.entries(genres).filter(([id,g])=>g===genre&&(media==='tv'?!['28','12','14','27','10749','878','53','36','10402','10752'].includes(id):!['10759','10765','10768','10762'].includes(id))).map(([id])=>id);
  if(ids.length)params.set('with_genres',ids.join('|'));
  params.set('sort_by',sort==='rating'?'vote_average.desc':sort==='title'&&media==='movie'?'title.asc':'popularity.desc');
  if(sort==='rating')params.set('vote_count.gte','50');
 }
 try{
 const r=await fetch('https://api.themoviedb.org/3/'+(q?'search/':'discover/')+media+'?'+params,{headers:{Authorization:'Bearer '+token,accept:'application/json'},signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('TMDB');
 const data=await r.json();
 const movies=(data.results||[]).filter(x=>!x.adult).map(x=>({id:'tmdb-'+(media==='tv'?'tv-':'')+x.id,media,title:x.title||x.name,year:(x.release_date||x.first_air_date||'').slice(0,4),genre:genres[x.genre_ids?.[0]]||'Boshqa',genres:[...new Set((x.genre_ids||[]).map(id=>genres[id]).filter(Boolean))],rating:x.vote_count?x.vote_average:null,description:x.overview,poster:x.poster_path?'https://image.tmdb.org/t/p/w500'+x.poster_path:'',source:'tmdb',info:'https://www.themoviedb.org/'+media+'/'+x.id,language:x.original_language}));
 res.setHeader('Cache-Control','s-maxage=120, stale-while-revalidate=300');
 return res.status(200).json({movies,configured:true,totalPages:Math.min(500,data.total_pages||0),totalResults:data.total_results||0,page});
 }catch{return res.status(502).json({error:'TMDB vaqtincha mavjud emas'});}
}
