export const ENDPOINTS=Object.freeze({overview:'overview',connections:'connections',gsc:'gsc',ga4:'ga4',seranking:'seranking',health:'site-health',autopilot:'autopilot-status'});
export const SESSION_KEY='avcc_v3_token';
// All state stays in memory. No provider response or admin token is persisted here.
export class Sources {
  constructor({fetcher=fetch,token,onUnauthorized=()=>{},now=Date.now,ttl=300000}={}){
    this.fetcher=fetcher;this.token=token;this.onUnauthorized=onUnauthorized;this.now=now;this.ttl=ttl;this.records=new Map();this.pending=new Map();this.controllers=new Set();this.epoch=0;
  }
  clear(){this.epoch++;for(const c of this.controllers)c.abort();this.controllers.clear();this.records.clear();this.pending.clear();}
  async ping(){const r=await this.fetcher('/api/command/ping',{cache:'no-store',headers:{authorization:'Bearer '+this.token()},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(r.status===401?'Acces respins. Verifică tokenul.':'Serverul nu a confirmat accesul. Încearcă din nou.');}
  load(key,{force=false}={}){
    if(!Object.hasOwn(ENDPOINTS,key))return Promise.reject(Error('Unknown source'));
    if(this.pending.has(key))return this.pending.get(key);
    const existing=this.records.get(key);
    if(!force&&existing?.status==='ready'&&this.now()-existing.at<this.ttl)return Promise.resolve(existing);
    const epoch=this.epoch,controller=new AbortController();this.controllers.add(controller);
    this.records.set(key,{status:'loading',data:null,at:null});
    const promise=(async()=>{
      const timer=setTimeout(()=>controller.abort(),30000);
      try{
        await Promise.resolve();
        if(epoch!==this.epoch)return null;
        const response=await this.fetcher('/api/command/'+ENDPOINTS[key],{cache:'no-store',headers:{authorization:'Bearer '+this.token()},signal:controller.signal});
        if(epoch!==this.epoch)return null;
        if(response.status===401){this.clear();this.onUnauthorized();return null;}
        if(!response.ok)throw Error('source_unavailable');
        const data=await response.json();
        if(epoch!==this.epoch)return null;
        if(!data||typeof data!=='object'||Array.isArray(data))throw Error('invalid_source');
        const record={status:'ready',data,at:this.now()};this.records.set(key,record);return record;
      }catch{
        if(epoch!==this.epoch)return null;
        const record={status:'error',data:null,at:this.now()};this.records.set(key,record);return record;
      }finally{clearTimeout(timer);this.controllers.delete(controller);if(epoch===this.epoch)this.pending.delete(key);}
    })();this.pending.set(key,promise);return promise;
  }
}
