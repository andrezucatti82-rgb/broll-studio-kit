"""Render authored styleframes or exact 10-second clips from scene.html.
Start a local HTTP server at the atlas root; defaults to http://127.0.0.1:8765.
Requires playwright, Pillow and ffmpeg. Chromium path can be set with CHROME_PATH.
"""
from pathlib import Path
import argparse,os,subprocess,json
from playwright.sync_api import sync_playwright
from PIL import Image
R=Path(__file__).resolve().parents[2]
a=argparse.ArgumentParser();a.add_argument('--video',type=int);a.add_argument('--base',default='http://127.0.0.1:8765');a.add_argument('--out',default='/tmp/motion-campaign-render');args=a.parse_args();out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
nums=[args.video] if args.video else [1,2,5,7,9,10,13,14,16,17,19,21,22,24,25,27,28,30]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1280,'height':720},device_scale_factor=1);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for n in nums:
  page.goto(f'{args.base}/records/motion-campaign/scene.html?n={n}',wait_until='networkidle');page.wait_for_function('window.READY',timeout=60000)
  if args.video:
   frames=out/f'frames-{n:02d}';frames.mkdir(exist_ok=True)
   for f in range(240):
    page.evaluate('(t)=>window.renderFrame(t)',f/24);page.screenshot(path=str(frames/f'{f:04d}.png'))
    if f%48==0:print(n,f,flush=True)
   subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','24','-i',str(frames/'%04d.png'),'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(out/f'visual-{n:02d}.mp4')],check=True)
  else:
   page.evaluate('(t)=>window.renderFrame(t)',7.0 if n==1 else 5.0);f=out/f'still-{n:02d}.png';page.screenshot(path=str(f));Image.open(f).save(R/f'dist/assets/motion-campaign-{n:02d}.webp','WEBP',quality=94,method=6);print('still',n,flush=True)
 assert not errors,errors;b.close()
