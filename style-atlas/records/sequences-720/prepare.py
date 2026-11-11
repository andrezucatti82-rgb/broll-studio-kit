"""Build specific, authored four-shot briefs; this script does not generate media."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).parent
catalog=json.loads((ROOT/'style-atlas/dist/catalog.json').read_text())
pilot=json.loads((ROOT/'style-atlas/dist/sequence-pilot.json').read_text())
approved={x['styleId'] for x in pilot['examples']}
directions=json.loads((HERE/'family-direction.json').read_text())
jobs=[]
for f in catalog['families']:
    path=HERE/'plans'/f"{f['id']}.json"
    if not path.exists():continue
    plans=json.loads(path.read_text())
    styles=[s for s in catalog['styles'] if s['family']==f['id']]
    assert len(plans)==40,(f['id'],len(plans))
    for s,beats in zip(styles,plans):
        assert len(beats)==4,(s['id'],beats)
        if s['id'] in approved:continue
        prompt=f'''Create FOUR finished-quality keyframes of ONE coherent video, art directed as a professional campaign. This is not a wireframe. OUTPUT a tall PORTRAIT 9:16 canvas, divided EXACTLY into 2 columns and 2 rows at the center: four separate full VERTICAL 9:16 shots, no gutters or labels outside the frames. Never output 3:4 or landscape. Each panel is a full cinematic composition. Order: top left, top right, bottom left, bottom right.
STYLE: {s['name']} — {s['familyName']}. Preserve this particular visual language; do NOT turn all styles into 3D. This is the defining appearance: {s['signature']}
REFINEMENT FOR THIS CATEGORY: {directions[s['family']]}
FICTIONAL SUBJECT: {s['exampleTopic']}.
MOVEMENT TO SUGGEST: {s['motion']}. Show distinct meaningful states of that action, not four zoomed copies. Use precise art direction, deliberate lighting, materials, layered composition and visual hierarchy appropriate to this specific style. Main subject LARGE, readable at mobile size, clean focal point, generous type safe area. No generic flat cards unless this particular style requires flat graphics. Illustration must remain illustration; photographic styles must look naturally photographed, no wax skin or plastic food. Cinematic or dimensional work needs coherent contact shadows and foreground/background occlusion. All characters, locations, brands, products and data are fictional. Avoid existing brand logos and unsupported claims.
FOUR SHOTS:
'''+ '\n'.join(f'{i+1}: {b}' for i,b in enumerate(beats))+'''
CONTINUITY: exactly the same person, face, hair, clothing, object geometry and material between related frames; do not beautify, change body or mutate product. Anatomy and hands correct. Each shot must correspond to its described state. Do not show a collage inside any panel. No watermarks. No invented gibberish text. Prefer no text to tiny or incorrect text; any specified headline in Portuguese must be large and correctly accented. Numbers, graph scales and UI states must stay coherent. These are fictional concepts, not evidence that a technique works in motion. Final video will recreate lettering and interface data as editable code. Aim for a memorable, highly crafted image, not a generic stock photo or basic slide.'''
        jobs.append(dict(id=s['id'],family=s['family'],name=s['name'],topic=s['exampleTopic'],signature=s['signature'],motion=s['motion'],resources=s['resources'],beats=beats,prompt=prompt))
target=Path('/workspace/work/sequences-720/jobs.json');target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(jobs,ensure_ascii=False,indent=2)+'\n')
print(f'{len(jobs)} ungenerated-style briefs from {len(list((HERE/"plans").glob("*.json")))} authored categories')
