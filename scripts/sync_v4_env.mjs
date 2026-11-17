import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const tmpEnv = path.join(os.tmpdir(), 'jtest_v3_env_' + process.pid);
const TARGET_KEYS = ['JTEST_GAS_URL', 'JTEST_SHARED_TOKEN', 'JTEST_TEACHER_PIN'];
const ENVS = ['production', 'preview', 'development'];

function parseDotEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

try {
  execFileSync('vercel', ['env', 'pull', tmpEnv, '-p', 'japanese-test-v3', '-e', 'production', '--yes'], {
    shell: true,
    stdio: 'pipe',
  });
  const parsed = parseDotEnv(fs.readFileSync(tmpEnv, 'utf8'));
  for (const k of TARGET_KEYS) {
    if (!parsed[k]) throw new Error(`Missing key ${k} from japanese-test-v3`);
  }

  for (const k of TARGET_KEYS) {
    for (const envName of ENVS) {
      const res = spawnSync(
        'vercel',
        ['env', 'add', k, envName, '-p', 'japanese-test-v4', '--sensitive', '--force', '--yes'],
        {
          shell: true,
          input: parsed[k],
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
      if (res.status !== 0) {
        throw new Error(`Failed setting ${k} (${envName}): ${res.stderr || res.stdout}`);
      }
    }
    console.log(`Synced ${k} across [${ENVS.join(', ')}] (len=${parsed[k].length})`);
  }
} finally {
  if (fs.existsSync(tmpEnv)) {
    fs.unlinkSync(tmpEnv);
    console.log('Removed temporary env file cleanly.');
  }
}
