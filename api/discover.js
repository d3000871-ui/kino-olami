const genres={28:'Jangari',12:'Sarguzasht',16:'Multfilm',35:'Komediya',80:'Kriminal',99:'Hujjatli',18:'Drama',14:'Fantastika',27:'Qo‘rqinchli',10749:'Romantika',878:'Fantastika',53:'Triller'};
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const token=process.env.TMDB_READ_TOKEN;
 if(!token)return res.status(200).json({movies:[],configured:false});
 const q=String(req.query?.q||'').trim().slice(0,100);
 const params=new URLSearchParams({language:'en-US',include_adult:'false',page:'1'});
 if(q)params.set('query',q);
 try{
 const r=await fetch('https://api.themoviedb.org/3/'+(q?'search/movie':'movie/popular')+'?'+params,{headers:{Authorization:'Bearer '+token,accept:'application/json'},signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('TMDB');
 const data=await r.json();
 const movies=(data.results||[]).filter(x=>!x.adult).map(x=>({id:'tmdb-'+x.id,title:x.title,year:(x.release_date||'').slice(0,4),genre:genres[x.genre_ids?.[0]]||'Boshqa',rating:x.vote_count?x.vote_average:null,description:x.overview,poster:x.poster_path?'https://image.tmdb.org/t/p/w500'+x.poster_path:'',source:'tmdb',info:'https://www.themoviedb.org/movie/'+x.id,language:x.original_language}));
 res.setHeader('Cache-Control','s-maxage=120, stale-while-revalidate=300');
 return res.status(200).json({movies,configured:true});
 }catch{return res.status(502).json({error:'TMDB vaqtincha mavjud emas'});}
}
