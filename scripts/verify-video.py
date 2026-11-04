"""Measure and decode a supplied video. Does not claim visual or auditory review."""
import argparse,hashlib,json,re,subprocess
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('video',type=Path);parser.add_argument('--out',type=Path);args=parser.parse_args()
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames','-of','json',str(args.video)]))
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(args.video),'-f','null','-'],check=True)
report={'file':args.video.name,'sha256':hashlib.sha256(args.video.read_bytes()).hexdigest(),'metadata':probe,'decode':'passed','visualReview':'not_run','audioListening':'not_run'}
if any(s.get('codec_type')=='audio' for s in probe['streams']):
 result=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(args.video),'-vn','-af','loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 match=re.search(r'\{\s*"input_i".*?\}',result.stderr,re.S)
 if match:
  metrics=json.loads(match.group());report['loudness']={k:metrics[k] for k in ['input_i','input_tp','input_lra']}
text=json.dumps(report,ensure_ascii=False,indent=2)+'\n'
if args.out:args.out.write_text(text)
else:print(text,end='')
