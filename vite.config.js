import {defineConfig} from 'vite';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const template=readFileSync(new URL('./sw-template.js',import.meta.url),'utf8');
export default defineConfig({plugins:[{name:'kino-offline-shell',apply:'build',generateBundle(_,bundle){
 const assets=[...new Set(['/','/index.html','/manifest.webmanifest','/icon.svg',...Object.keys(bundle).map(x=>'/'+x)])];
 const hash=createHash('sha256').update(JSON.stringify(assets)+template).digest('hex').slice(0,16);
 this.emitFile({type:'asset',fileName:'sw.js',source:template.replace('__CACHE__',JSON.stringify('kino-shell-'+hash)).replace('__ASSETS__',JSON.stringify(assets))});
}}]});
