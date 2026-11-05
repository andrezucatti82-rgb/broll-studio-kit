"""Original procedural score/SFX + separately supplied, licensed narration.
Usage: python mix_audio.py --work /path/to/rendered-clips --out /path/to/previews
Requires numpy, soundfile and ffmpeg. Does not download or clone any voice.
"""
import argparse, json, subprocess
from pathlib import Path
import numpy as np
import soundfile as sf

p=argparse.ArgumentParser();p.add_argument('--work',required=True);p.add_argument('--out',required=True);a=p.parse_args()
w=Path(a.work);out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
sr=48000;n=sr*10;t=np.arange(n)/sr;rng=np.random.default_rng(20261105)
def event(dst,start,duration,freq,amp=.1,kind='bell',pan=0):
 count=min(int(duration*sr),n-int(start*sr));u=np.arange(count)/sr
 if count<=0:return
 env=(1-np.exp(-u*90))*np.exp(-u/(duration*.24))
 if kind=='noise':wave=rng.normal(0,1,count)*.25
 elif kind=='kick':wave=np.sin(2*np.pi*(45*u+35*.05*(1-np.exp(-u/.05))))
 else:wave=np.sin(2*np.pi*freq*u)+.24*np.sin(2*np.pi*freq*2*u)+.08*np.sin(2*np.pi*freq*3*u)
 v=amp*env*wave;idx=int(start*sr);dst[idx:idx+count,0]+=v*np.sqrt((1-pan)/2);dst[idx:idx+count,1]+=v*np.sqrt((1+pan)/2)
for i,key in enumerate(['type','stage','lens'],1):
 score=np.zeros((n,2));sfx=np.zeros_like(score)
 bpm=[100,84,72][i-1];beat=60/bpm
 notes=[[220,261.63,329.63,392],[146.83,220,293.66,369.99],[196,246.94,293.66,392]][i-1]
 for j,start in enumerate(np.arange(.1,9.6,beat)):
  event(score,float(start),1.6,notes[j%4],.055,pan=(-.25 if j%2 else .25))
  if i==1:event(score,float(start),.2,60,.08,'kick')
  if i==1 and j%2:event(score,float(start+.25),.1,0,.02,'noise',.25)
 for freq in notes[:3]:
  pad=np.sin(2*np.pi*freq*.5*t)*.008*np.sin(np.pi*np.minimum(t/1.5,1)/2)
  score+=pad[:,None]
 markers=[[1.5,2.4,3.4,4.8,5.6],[.7,1.2,1.7,2.2,3.1,5.5],[.8,2.7,5.0,7.4,8.8]][i-1]
 for j,start in enumerate(markers):
  event(sfx,start,.16,650+j*100,.04,pan=(j%3-1)*.3)
  event(sfx,start-.05,.3,0,.05,'noise',pan=(j%3-1)*.3)
 voice,vsr=sf.read(w/f'voice-{key}.wav');voice=voice.mean(axis=1) if voice.ndim>1 else voice
 voice=np.interp(np.arange(round(len(voice)*sr/vsr))*vsr/sr,np.arange(len(voice)),voice)
 voice*=.43/max(np.max(np.abs(voice)),.001)
 vo=np.zeros(n);offset=int([.45,.8,.85][i-1]*sr);vo[offset:offset+len(voice)]=voice[:n-offset]
 duck=1-.65*np.convolve((np.abs(vo)>.012).astype(float),np.ones(4801)/4801,mode='same').clip(0,1)
 score*=duck[:,None];fade=np.minimum(t/.25,1)*np.minimum((10-t)/.65,1);mix=(score+sfx+vo[:,None])*fade[:,None]
 sf.write(w/f'score-{i:02d}.wav',score,sr,subtype='PCM_24');sf.write(w/f'sfx-{i:02d}.wav',sfx,sr,subtype='PCM_24');sf.write(w/f'mix-{i:02d}.wav',mix,sr,subtype='PCM_24')
 target=out/f'motion-campaign-{i:02d}.mp4'
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(w/f'visual-{i:02d}.mp4'),'-i',str(w/f'mix-{i:02d}.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-af','loudnorm=I=-16:TP=-1.5:LRA=7','-ar','48000','-t','10','-movflags','+faststart',str(target)],check=True)
 print(target,flush=True)
