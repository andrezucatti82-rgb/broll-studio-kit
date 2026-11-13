import {spawnSync} from 'node:child_process';
const result=spawnSync(process.platform==='win32'?'python':'python3',['tests/heygen-budget.test.py'],{stdio:'inherit'});
if(result.error)console.error(result.error.message);
process.exitCode=result.status??1;
