// Wait for every active operation before returning or propagating an error.
export async function boundedWork(items,limit,work){
 if(!Number.isInteger(limit)||limit<1||limit>16)throw Error('Invalid concurrency');
 let next=0,failure;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
  while(!failure&&next<items.length){const index=next++;try{await work(items[index],index)}catch(error){failure=error}}
 }));
 if(failure)throw failure;
}

// Only use for idempotent operations such as overwriting the same release asset.
export async function retryIdempotent(work,attempts=3,delay=ms=>new Promise(r=>setTimeout(r,ms))){
 if(!Number.isInteger(attempts)||attempts<1||attempts>4)throw Error('Invalid attempts');
 for(let attempt=1;attempt<=attempts;attempt++){
  try{return await work(attempt)}catch(error){if(attempt===attempts)throw error;await delay(300*attempt)}
 }
}
