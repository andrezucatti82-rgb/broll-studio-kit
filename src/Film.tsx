import React from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';
import {buildTimeline} from './timeline.mjs';
export type Media={type:'image'|'video';src:string;startFrom?:number};
type Pose={x:number;y:number;scale:number};
export type Layer={media:Media;left:number;top:number;width:number;height:number;from:Pose;to:Pose;shadow?:boolean};
export type Shot={id:string;durationFrames:number;layout:'hero'|'photo'|'palette'|'spatial'|'catalog'|'closing';transition:{type:'cut'|'dissolve';durationFrames:number};eyebrow:string;title:string;detail:string;media:Media;focus:string;layers?:Layer[]};
export type Project={schemaVersion:2;topic:string;fps:number;brand:{name:string;website:string;logo:string;primary:string;ink:string;paper:string;tagline:string};audio:string;captions:{start:number;end:number;text:string}[];labels:{badge:string;illustration:string;categories:string[]};scenes:Shot[]};

const ease=Easing.bezier(.22,.75,.2,1);
const ramp=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const Arrow=()=> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 19L19 5M5 5h14v14"/></svg>;
const Photo=({media,focus='50% 50%',style={}}:{media:Media;focus?:string;style?:React.CSSProperties})=>{
 const css:React.CSSProperties={width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,...style};
 return media.type==='video'?<OffthreadVideo src={staticFile(media.src)} startFrom={media.startFrom??0} muted style={css}/>:<Img src={staticFile(media.src)} style={css}/>;
};
function DepthLayers({layers,length}:{layers:Layer[];length:number}){const f=useCurrentFrame();return <>{layers.map((layer,i)=>{
 const k=ramp(f,0,Math.max(1,length-1),0,1),mix=(a:number,b:number)=>a+(b-a)*k;
 return <div key={i} style={{position:'absolute',left:layer.left,top:layer.top,width:layer.width,height:layer.height,transform:`translate(${mix(layer.from.x,layer.to.x)}px,${mix(layer.from.y,layer.to.y)}px) scale(${mix(layer.from.scale,layer.to.scale)})`,filter:layer.shadow?'drop-shadow(12px 18px 18px #0005)':undefined}}><Photo media={layer.media}/></div>;
 })}</>}

function Rings({color}:{color:string}){return <div style={{position:'absolute',width:850,height:850,borderRadius:'50%',border:`1px solid ${color}44`,right:-240,top:140}}>{[.8,.6,.4].map(s=><div key={s} style={{position:'absolute',inset:`${(1-s)*50}%`,border:`1px solid ${color}44`,borderRadius:'50%'}}/>)}</div>}
function Scene({p,i,length}:{p:Project;i:number;length:number}){
 const f=useCurrentFrame(),s=p.scenes[i],b=p.brand;
 const t=Math.min(f/length,1);
 const entry=ramp(f,0,23,95,0),a=ramp(f,3,22,0,1);
 const zoom=1.06+t*.045;
 const label=<div style={{fontSize:23,letterSpacing:4,fontWeight:700,display:'flex',alignItems:'center',gap:18}}><span style={{width:38,height:3,background:'currentColor'}}/>{s.eyebrow}</div>;
 const title=(size=106)=><div style={{fontWeight:700,fontSize:size,lineHeight:.98,letterSpacing:-5,whiteSpace:'pre-line',marginTop:28}}>{s.title}</div>;
 const footer=<div style={{position:'absolute',left:70,right:70,bottom:255,fontSize:28,letterSpacing:.2,display:'flex',alignItems:'center',gap:20}}><span style={{width:58,height:2,background:'currentColor'}}/>{s.detail}</div>;
 return <AbsoluteFill style={{background:b.paper,overflow:'hidden',color:b.ink}}>
 {s.layout==='hero'&&<>
  <AbsoluteFill style={{transform:`scale(${zoom}) translateX(${-t*12}px)`}}><Photo media={s.media} focus={s.focus}/></AbsoluteFill>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(19,12,11,.25),rgba(19,12,11,.05) 35%,rgba(19,12,11,.88) 82%)'}}/>
  <div style={{position:'absolute',top:95,left:70,right:70,color:'#fff',display:'flex',justifyContent:'space-between',fontSize:27,letterSpacing:3}}><span>{b.name.toUpperCase()}</span><span>{String(i+1).padStart(2,'0')} — {String(p.scenes.length).padStart(2,'0')}</span></div>
  <div style={{position:'absolute',top:1000,left:70,color:b.paper,transform:`translateY(${entry}px)`,opacity:a}}>{label}{title(139)}</div>
  <div style={{color:b.paper}}>{footer}</div>
  <div style={{position:'absolute',width:4,height:130,background:b.primary,left:70,top:805,transform:`scaleY(${a})`,transformOrigin:'bottom'}}/>
 </>}
 {s.layout==='photo'&&<>
  <Rings color={b.primary}/>
  <div style={{position:'absolute',left:70,top:150,transform:`translateY(${entry}px)`,opacity:a}}>{label}{title(118)}</div>
  <div style={{position:'absolute',left:58,top:595,width:960,height:775,transform:`perspective(1600px) rotateY(${-5+t*5}deg) rotateZ(${-2+t}deg) translateY(${entry*.7}px)`,boxShadow:'30px 55px 70px #291E2035',overflow:'hidden',border:'14px solid white'}}><Photo media={s.media} focus={s.focus} style={{transform:`scale(${zoom})`}}/></div>
  <div style={{position:'absolute',right:54,top:1265,width:300,height:300,borderRadius:'50%',background:b.primary,color:b.paper,boxShadow:'0 25px 50px #0003',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:35,lineHeight:1.1,fontWeight:700,transform:`scale(${ramp(f,18,43,.7,1)})`,opacity:ramp(f,18,35,0,1)}}>{p.labels.badge}</div>
  {footer}
 </>}
 {s.layout==='palette'&&<>
  <div style={{position:'absolute',inset:'0 0 540px',overflow:'hidden'}}><Photo media={s.media} focus={s.focus} style={{transform:`scale(${zoom}) translateX(${t*15}px)`}}/></div>
  <div style={{position:'absolute',left:70,top:1030,width:940,height:510,background:b.paper,boxShadow:'0 30px 75px #0003',padding:55,transform:`translateY(${entry}px)`,opacity:a}}>{label}{title(104)}<div style={{display:'flex',gap:20,marginTop:36}}>{[b.primary,'#52624A','#DBBD8A',b.ink].map((c,j)=><span key={c} style={{width:72,height:72,borderRadius:'50%',background:c,boxShadow:'0 7px 12px #0002',transform:`translateY(${ramp(f,12+j*4,30+j*4,35,0)}px)`}}/>)}</div></div>
  {footer}
 </>}
 {s.layout==='spatial'&&<>
  <AbsoluteFill><Photo media={s.media} focus={s.focus} style={{transform:`scale(${1.2-t*.08})`}}/></AbsoluteFill>
  <AbsoluteFill style={{background:'linear-gradient(180deg,#231615bb,transparent 70%,#231615aa)'}}/>
  <div style={{position:'absolute',left:70,top:155,color:b.paper,opacity:a,transform:`translateY(${entry}px)`}}>{label}{title(112)}</div>
  <div style={{position:'absolute',left:90,top:850,width:890,height:650,border:'2px solid #ffffff80',borderRadius:50,background:'#241c1c40',transform:`perspective(1400px) rotateX(46deg) rotateZ(${-9+t*3}deg)`,boxShadow:'20px 70px 70px #0006'}}>
   <svg viewBox="0 0 890 650" style={{width:'100%',height:'100%'}}><defs><filter id="shadow"><feDropShadow dx="0" dy="15" stdDeviation="8" floodOpacity=".5"/></filter></defs><path d="M 70 510 Q 140 335 380 335 T 820 130" fill="none" stroke="#F3EEE5" strokeWidth="7" strokeDasharray="1400" strokeDashoffset={ramp(f,15,95,1400,0)}/>{[[235,190],[620,460]].map(([x,y],j)=><g key={j} filter="url(#shadow)">{[0,60,120,180,240,300].map(d=><circle key={d} cx={x+145*Math.cos(d*Math.PI/180)} cy={y+145*Math.sin(d*Math.PI/180)} r="26" fill="#C52E32"/>)}<circle cx={x} cy={y} r="111" fill="#F3EEE5"/><circle cx={x} cy={y} r="60" fill="#D8C9AD"/><circle cx={x} cy={y} r="30" fill="#52624A"/></g>)}</svg>
  </div>
  <div style={{position:'absolute',left:90,top:1500,color:'#fff9',fontSize:20,letterSpacing:2}}>{p.labels.illustration}</div>
  <div style={{color:b.paper}}>{footer}</div>
 </>}
 {s.layout==='catalog'&&<>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:1920}}><Photo media={s.media} focus={s.focus} style={{transform:`scale(${zoom})`}}/></div>
  <AbsoluteFill style={{background:'linear-gradient(180deg,#291E20cc,transparent 60%,#291E20dd)'}}/>
  <div style={{position:'absolute',left:70,top:155,color:b.paper,opacity:a,transform:`translateY(${entry}px)`}}>{label}{title(119)}</div>
  <div style={{position:'absolute',left:70,right:70,top:940,perspective:1400}}>{p.labels.categories.map((x,j)=><div key={x} style={{height:120,marginBottom:14,background:j===0?b.primary:b.paper,color:j===0?b.paper:b.ink,padding:'28px 36px',fontSize:42,fontWeight:700,display:'flex',justifyContent:'space-between',boxShadow:'15px 20px 35px #0004',transform:`translateX(${ramp(f,8+j*6,30+j*6,160,0)}px) rotateY(${-5+t*3}deg)`,opacity:ramp(f,8+j*6,26+j*6,0,1)}}><span>{x}</span><span style={{fontWeight:400}}><Arrow/></span></div>)}</div>
 </>}
 {s.layout==='closing'&&<>
  <div style={{position:'absolute',inset:'0 0 820px',overflow:'hidden'}}><Photo media={s.media} focus={s.focus} style={{transform:`scale(${1.13-t*.06})`}}/></div>
  <div style={{position:'absolute',inset:'850px 0 0',background:b.primary,transform:`translateY(${entry}px)`}}><div style={{position:'absolute',top:-90,left:70,width:440,height:196,background:b.ink,padding:25,boxShadow:'0 25px 50px #0003'}}><Img src={staticFile(b.logo)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>
   <div style={{padding:'170px 70px 0',color:b.paper}}>{label}{title(110)}<div style={{marginTop:65,padding:'27px 35px',border:'2px solid #ffffffa0',borderRadius:70,fontSize:41,display:'flex',justifyContent:'space-between'}}><span>{s.detail}</span><span><Arrow/></span></div></div>
  </div>
 </>}
 <DepthLayers layers={s.layers??[]} length={length}/>
 <div style={{position:'absolute',left:70,right:70,bottom:80,display:'flex',gap:10}}>{p.scenes.map((_,j)=><div key={j} style={{height:3,flex:1,background:'#ffffff40'}}><div style={{height:3,width:j<i?'100%':j===i?`${Math.min(t,1)*100}%`:'0%',background:s.layout==='photo'||s.layout==='palette'?b.primary:b.paper}}/></div>)}</div>
 </AbsoluteFill>
}
export function Film(p:Project){const frame=useCurrentFrame();const timeline=buildTimeline(p.scenes);const cap=p.captions.find(c=>frame/p.fps>=c.start&&frame/p.fps<c.end);return <AbsoluteFill style={{fontFamily:'Geist, sans-serif',background:p.brand.ink}}>
 <style>{`@font-face{font-family:Geist;src:url('${staticFile('fonts/Geist-Regular.ttf')}')}@font-face{font-family:Geist;src:url('${staticFile('fonts/Geist-Bold.ttf')}');font-weight:700}*{box-sizing:border-box}`}</style>
 {timeline.clips.map(({index:i,from,durationInFrames,overlapAfter})=><Sequence key={p.scenes[i].id} from={from} durationInFrames={durationInFrames+overlapAfter} premountFor={15}><SceneTransition transition={p.scenes[i].transition}><Scene p={p} i={i} length={durationInFrames}/></SceneTransition></Sequence>)}
 {cap&&<div style={{position:'absolute',bottom:145,left:70,right:70,display:'flex',justifyContent:'center'}}><span style={{fontSize:31,lineHeight:1.2,color:'#fff',background:'#201819e8',borderRadius:12,padding:'14px 23px',textAlign:'center',maxWidth:920}}>{cap.text}</span></div>}
 {p.audio&&<Audio src={staticFile(p.audio)}/>}
 </AbsoluteFill>}
function SceneTransition({children,transition}:{children:React.ReactNode;transition:Shot['transition']}){const f=useCurrentFrame();return <AbsoluteFill style={{opacity:transition.type==='cut'?1:ramp(f,0,transition.durationFrames,0,1)}}>{children}</AbsoluteFill>}
