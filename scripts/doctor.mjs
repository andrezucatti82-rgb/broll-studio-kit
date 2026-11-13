import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
export function commandStatus(p){if(p.error)return {status:p.error.code==='ENOENT'?'missing':'unverified',reason:p.error.code||'execution_error'};return {status:p.status===0?'available':'unverified',reason:p.status===0?'version_command_succeeded':'exit_'+p.status};}
export function diagnose(){
 const checks=[],file=(item,ok)=>checks.push({item,status:ok?'available':'missing',reason:'local_files'});
 file('Node.js >= 22',Number(process.versions.node.split('.')[0])>=22);file('Dependências locais (npm ci)',existsSync('node_modules/remotion/package.json'));
 for(const [item,cmd,args] of [['FFmpeg','ffmpeg',['-version']],['FFprobe','ffprobe',['-version']],['Chromium',process.env.CHROME_PATH||'chromium',['--version']],['Blender (opcional)','blender',['--version']]])checks.push({item,...commandStatus(spawnSync(cmd,args,{encoding:'utf8',timeout:10000}))});
 file('Skill e referências',existsSync('.agents/skills/video-multimarcas/SKILL.md'));file('Atlas local',existsSync('style-atlas/dist/catalog.json'));
 checks.push({item:'HeyGen API direta',status:'unverified',reason:process.env.HEYGEN_API_KEY?'credential_present_authentication_not_tested':'credential_not_configured'});
 return {checks,scope:'Comandos e arquivos locais. Não comprova conexão, saldo, compatibilidade de cena, playback, escuta ou qualidade. Permissão negada é não verificado, não ferramenta ausente.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=diagnose();if(process.argv.includes('--json'))console.log(JSON.stringify(r,null,2));else{for(const c of r.checks)console.log(`${{available:'OK',missing:'FALTA',unverified:'NÃO VERIFICADO'}[c.status]}  ${c.item} (${c.reason})`);console.log('\n'+r.scope);}if(r.checks.some(c=>c.status==='missing'&&!c.item.includes('opcional')))process.exitCode=1;}
