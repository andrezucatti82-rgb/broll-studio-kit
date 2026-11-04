"""Rebuild the demonstration's original synthesized score and voice mix. Requires ffmpeg."""
import json,math,wave,struct,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=root/'public/demo'
sr=44100;duration=30
# Original slow pad, soft mallet notes and transition air. No samples or commercial song.
chords=[(130.813,164.814,195.998),(110,130.813,164.814),(87.307,130.813,174.614),(97.999,146.832,195.998),(110,164.814,220),(130.813,164.814,195.998)]
with wave.open(str(out/'score.wav'),'wb') as w:
 w.setparams((1,2,sr,0,'NONE','not compressed'));buf=bytearray();seed=17
 for n in range(sr*duration):
  t=n/sr;k=min(5,int(t/5));local=t%5
  fade=min(1,t/1.5,(duration-t)/2)
  pad=sum(math.sin(2*math.pi*f*t)*.009 for f in chords[k])*min(1,local/.5,(5-local)/.5)
  beat=t%1.25;note=chords[k][int(t/1.25)%3]*4
  pluck=.025*math.sin(2*math.pi*note*beat)*math.exp(-beat*8)*min(1,beat/.008)
  seed=(1664525*seed+1013904223)&0xffffffff
  noise=(seed/2147483648-1)
  air=sum(math.exp(-((t-cut)/.21)**2) for cut in [5,10,15,20,25])*.009*noise
  buf.extend(struct.pack('<h',int(max(-1,min(1,(pad+pluck+air)*fade))*32767)))
 w.writeframes(buf)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(out/'voice.wav'),'-i',str(out/'score.wav'),'-filter_complex','[0:a]adelay=400:all=1,apad,atrim=duration=30[v];[1:a]volume=0.6[m];[v][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000[a]','-map','[a]','-c:a','pcm_s16le',str(out/'soundtrack.wav')],check=True)
voice=json.loads((root/'examples/dipilatti/voice.json').read_text());chars=voice['characters'];caps=[];group=[]
for c in chars:
 group.append(c)
 text=''.join(x['text'] for x in group).strip()
 if c['text'] in '.!?,' or (c['text']==' ' and len(text)>34):
  if text:caps.append({'start':round(group[0]['start_time']+.4,3),'end':round(c['end_time']+.4,3),'text':text})
  group=[]
if group:caps.append({'start':round(group[0]['start_time']+.4,3),'end':round(group[-1]['end_time']+.4,3),'text':''.join(x['text'] for x in group).strip()})
p=root/'examples/dipilatti/project.json';data=json.loads(p.read_text());data['captions']=caps;p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('30-second mix and timed captions rebuilt.')
