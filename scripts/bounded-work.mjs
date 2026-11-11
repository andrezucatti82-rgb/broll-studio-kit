// Wait for every active operation before returning or propagating an error.
export async function boundedWork(items,limit,work){
 if(!Number.isInteger(limit)||limit<1||limit>16)throw Error('Invalid concurrency');
 let next=0,failure;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
  while(!failure&&next<items.length){const index=next++;try{await work(items[index],index)}catch(error){failure=error}}
 }));
 if(failure)throw failure;
}
