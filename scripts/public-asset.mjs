// Bounded retries for read-only release verification, never uploads or mutations.
export async function readPublicAsset(url, {fetchImpl=fetch, sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}) {
 for(let attempt=0;attempt<4;attempt++){
  try{
   const response=await fetchImpl(url,{headers:{'User-Agent':'GDA-Static-Deploy/1.0'},signal:AbortSignal.timeout(45000),redirect:'error'});
   if(!response.ok){
    const error=new Error(`Public asset HTTP ${response.status}: ${url}`);
    error.permanent=response.status!==429&&response.status<500;
    await response.body?.cancel();
    throw error;
   }
   return Buffer.from(await response.arrayBuffer());
  }catch(error){
   if(error.permanent||attempt===3)throw error;
   await sleep(500*2**attempt);
  }
 }
}
