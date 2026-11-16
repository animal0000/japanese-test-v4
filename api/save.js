const crypto = require('node:crypto');

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const rateStore = globalThis.__jtestSaveRateLimit || new Map();
globalThis.__jtestSaveRateLimit = rateStore;

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return 'unknown';
}

function checkRateLimit(key) {
  const now = Date.now();
  if (rateStore.size > 1000) {
    for (const [k, v] of rateStore.entries()) {
      if (v.resetAt <= now) rateStore.delete(k);
    }
  }
  const entry = rateStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  const rawHost = req.headers['x-forwarded-host'] || req.headers.host;
  const host = typeof rawHost === 'string' ? rawHost.split(',')[0].trim().toLowerCase() : '';
  if (!origin || !host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function safePinEquals(provided, expected) {
  const a = String(provided || '');
  const b = String(expected || '');
  if (!a || !b) return false;
  const da = crypto.createHash('sha256').update(a, 'utf8').digest();
  const db = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(da, db);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: '허용되지 않은 메서드입니다.' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ success: false, error: '허용되지 않은 요청 출처입니다.' });
  }

  const clientIp = getClientIp(req);
  const limit = checkRateLimit(`jtest:save:${clientIp}`);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    return res.status(429).json({ success: false, error: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.' });
  }

  const gasUrl = process.env.JTEST_GAS_URL || '';
  const sharedToken = process.env.JTEST_SHARED_TOKEN || '';
  const expectedPin = String(process.env.JTEST_TEACHER_PIN || '').trim();

  if (!gasUrl || sharedToken.length < 24 || !expectedPin) {
    return res.status(500).json({ success: false, error: '서버 저장 설정이 완료되지 않았습니다.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ success: false, error: '올바른 JSON 형식이 아닙니다.' });
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, error: '요청 본문이 비어 있습니다.' });
  }

  const providedPin = String(body.teacherPin || req.headers['x-teacher-pin'] || '').trim();
  if (!safePinEquals(providedPin, expectedPin)) {
    return res.status(401).json({ success: false, error: '교사용 저장 암호가 일치하지 않습니다.' });
  }

  const questions = Array.isArray(body.questions) ? body.questions : [];
  if (questions.length === 0 || questions.length > 50) {
    return res.status(400).json({ success: false, error: '문항 수(1~50)가 허용 범위를 벗어났습니다.' });
  }

  const upstreamPayload = {
    className: typeof body.className === 'string' ? body.className : '',
    roundName: typeof body.roundName === 'string' ? body.roundName : '',
    questions,
    timestamp: typeof body.timestamp === 'string' ? body.timestamp : new Date().toISOString(),
    token: sharedToken,
  };

  try {
    const upstream = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(upstreamPayload),
      redirect: 'follow',
    });

    const text = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, error: '저장 백엔드 응답 형식이 올바르지 않습니다.' });
    }

    if (!upstream.ok || !parsed || typeof parsed !== 'object') {
      return res.status(502).json({ success: false, error: '저장 백엔드 호출에 실패했습니다.' });
    }

    return res.status(parsed.success ? 200 : 400).json(parsed);
  } catch {
    return res.status(502).json({ success: false, error: '구글 드라이브 저장 서버와 통신할 수 없습니다.' });
  }
};
