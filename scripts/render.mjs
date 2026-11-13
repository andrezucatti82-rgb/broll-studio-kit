import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {validate} from './validate.mjs';
import {reviewFrames} from '../src/timeline.mjs';
import {checkWorkflow} from './workflow-gate.mjs';
const args=process.argv.slice(2);const arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const config=arg('--project',undefined);
if(!config){console.error('Informe --project caminho/project.json. O arquivo templates/project.json é apenas um rascunho técnico.');process.exit(1);}
const props=JSON.parse(fs.readFileSync(config,'utf8'));validate(props);
// Stills remain available for visual approval; full video needs scoped evidence.
if(!args.includes('--stills')){
 const record=arg('--workflow',path.join(path.dirname(config),'workflow.json'));
 const stage=arg('--stage','full-render');
 if(!['animatic','sample','full-render'].includes(stage))throw Error('Use --stage animatic, sample or full-render');
 if(stage==='sample'&&props.scenes.reduce((n,s)=>n+s.durationFrames,0)/props.fps>15)throw Error('Sample must be <= 15 seconds; render the representative excerpt');
 const gate=checkWorkflow(JSON.parse(fs.readFileSync(record,'utf8')),stage==='full-render'?'full-render':'ai-video',path.dirname(path.resolve(record)));
 if(!gate.ready)throw Error('Production approval pending: '+gate.errors.join('; '));
}
const out=arg('--out','output');fs.mkdirSync(out,{recursive:true});
const browserExecutable=process.env.CHROME_PATH||undefined;
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx'),publicDir:path.resolve('public')});
const composition=await selectComposition({serveUrl,id:'BrandFilm',inputProps:props,browserExecutable});
if(args.includes('--stills')){for(const frame of reviewFrames(props.scenes)){await renderStill({serveUrl,composition,inputProps:props,output:path.join(out,`frame-${frame}.jpg`),frame,imageFormat:'jpeg',browserExecutable});}console.log('Scene boundaries, transition ends and midpoints saved; playback still required.');}
else {let last=-1;await renderMedia({serveUrl,composition,inputProps:props,outputLocation:path.join(out,'video.mp4'),codec:'h264',audioCodec:'aac',crf:20,pixelFormat:'yuv420p',browserExecutable,concurrency:Number(process.env.RENDER_CONCURRENCY||2),onProgress:({progress})=>{let n=Math.floor(progress*10);if(n!==last){console.log(`Render ${n*10}%`);last=n;}}});const target=path.join(out,'video.mp4');const trimmed=path.join(out,'video-final.mp4');execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',target,'-t',String(composition.durationInFrames/props.fps),'-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',trimmed],{stdio:'inherit'});fs.renameSync(trimmed,target);console.log('Candidate rendered. Continuous playback and listening review are still required.');}
