const { createRequire } = require('module');
const fs = require('fs');
const path = require('path');

const WORK_REF = 'D:/Claude/workspace/클로드용/생활일본어_수행평가안내_2026-2/_work';
const req = createRequire(path.join(WORK_REF, 'package.json'));
const QRCode = req('qrcode');
const { chromium } = req('playwright');
const { PDFDocument } = req('pdf-lib');
const { PNG } = req('pngjs');
const jsQR = req('jsqr');

const BRAND = 'D:/Claude/workspace/Cowork/Brand';
const ICONS = path.join(WORK_REF, 'icons');
const DEPLOY_DIR = path.resolve(__dirname, '..');
const FRAMES = process.env.NOTICE_FRAMES_DIR || path.join(DEPLOY_DIR, '.tmp_notice_frames');

const URL_TARGET = 'https://japanese-test-v4.vercel.app/';

const b64 = (p) => fs.readFileSync(p).toString('base64');
const fontB64 = (w) => b64(`${BRAND}/fonts/에이투지체-woff2-v1.001/에이투지체-${w}.woff2`);
const iconSvg = (slug) =>
  fs
    .readFileSync(path.join(ICONS, slug + '.svg'), 'utf8')
    .replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="currentColor"')
    .replace('<svg ', '<svg aria-hidden="true" ');

(async () => {
  // 인쇄용 대형 QR코드: 에러정정 Q, 순수 벡터 SVG (여백은 CSS로 3mm 확보)
  const qrSvg = await QRCode.toString(URL_TARGET, {
    type: 'svg',
    errorCorrectionLevel: 'Q',
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
  });

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>2026학년도 2학기 2차 생활일본어 수행평가 안내 | 배재중학교</title>
<style>
@font-face { font-family: 'A2Z'; src: url(data:font/woff2;base64,${fontB64('4Regular')}) format('woff2'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'A2Z'; src: url(data:font/woff2;base64,${fontB64('7Bold')}) format('woff2'); font-weight: 700; font-style: normal; }
@font-face { font-family: 'A2Z'; src: url(data:font/woff2;base64,${fontB64('8ExtraBold')}) format('woff2'); font-weight: 800; font-style: normal; }

:root {
  --pc-navy: #1A2F8A;
  --pc-red: #C0392B;
  --pc-white: #FFFFFF;
  --pc-yellow: #F1C40F;
  --pc-text: #1C1C1C;
  --pc-muted: #5A6072;
  --pc-line: #E2E5EE;
  --pc-bg-soft: #F5F6FA;
  --pc-yellow-soft: #FDF5D3;
  --pc-font: 'A2Z', 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', system-ui, sans-serif;
}

@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--pc-font);
  color: var(--pc-text);
  background: #D9DCE5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  word-break: keep-all;
}

.page {
  position: relative;
  width: 210mm;
  height: 297mm;
  margin: 8mm auto;
  background: var(--pc-white);
  box-shadow: 0 2mm 8mm rgba(26, 47, 138, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── 1. 헤더 밴드 ───────────────────────────── */
.band {
  background: var(--pc-navy);
  color: var(--pc-white);
  height: 14mm;
  padding: 0 10mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
}
.band img { height: 9mm; display: block; }
.band__meta { text-align: right; font-size: 9pt; line-height: 1.4; font-weight: 700; letter-spacing: 0.02em; }
.band__meta span { display: block; font-weight: 400; opacity: 0.86; font-size: 8pt; }
.band-rule { height: 1.3mm; background: var(--pc-yellow); flex: none; }

.body {
  flex: 1;
  padding: 4.5mm 10mm 0;
  display: flex;
  flex-direction: column;
  gap: 3mm;
}

/* ── 2. 제목·출제범위(왼쪽) + 초대형 QR(오른쪽 96mm) ── */
.top {
  display: grid;
  grid-template-columns: 1fr 96mm;
  grid-template-rows: auto 1fr;
  column-gap: 4.5mm;
  row-gap: 3mm;
  align-items: stretch;
}
.hero { grid-column: 1; grid-row: 1; }
.eyebrow {
  display: inline-block;
  font-size: 9pt; font-weight: 700; color: var(--pc-navy);
  background: var(--pc-bg-soft); border: 0.35mm solid var(--pc-line);
  padding: 0.9mm 3mm; border-radius: 10mm; margin: 0 0 2mm;
}
.hero h1 {
  font-size: 24pt; font-weight: 800; color: var(--pc-navy);
  line-height: 1.15; margin: 0; letter-spacing: -0.015em;
}
.hero h1 em { font-style: normal; box-shadow: inset 0 -2.8mm 0 var(--pc-yellow); }
.hero .rule { width: 12mm; height: 0.9mm; background: var(--pc-red); margin: 2.2mm 0 2mm; }
.lead { font-size: 9.8pt; line-height: 1.52; margin: 0; color: var(--pc-text); }
.lead b { color: var(--pc-navy); }

/* 초대형 QR 카드 */
.qr {
  grid-column: 2; grid-row: 1 / 3;
  border: 0.7mm solid var(--pc-navy);
  border-radius: 4.5mm;
  padding: 2.4mm 2.5mm 2.6mm;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--pc-white);
}
.qr__label {
  font-size: 10.2pt; font-weight: 800; color: var(--pc-white); background: var(--pc-navy);
  border-radius: 10mm; padding: 1mm 4.4mm; margin-bottom: 1.6mm;
}
.qr__code {
  width: 86mm; height: 86mm;
  padding: 2.4mm;
  background: #ffffff;
  border-radius: 2mm;
}
.qr__code svg { width: 100%; height: 100%; display: block; }
.qr__url {
  font-size: 11.8pt; font-weight: 800; color: var(--pc-navy);
  margin-top: 1.2mm; letter-spacing: 0.01em;
}
.qr__note { font-size: 8.2pt; font-weight: 700; color: var(--pc-muted); margin-top: 0.6mm; }

/* ── 3. 출제 범위 요약 박스 (.when) ────────────────── */
.scope {
  grid-column: 1; grid-row: 2;
  background: var(--pc-yellow-soft);
  border-left: 2.2mm solid var(--pc-yellow);
  border-radius: 0 3mm 3mm 0;
  padding: 2.8mm 3.2mm;
  display: flex; flex-direction: column; justify-content: center;
}
.scope__head {
  display: flex; align-items: center; gap: 2.2mm;
  margin-bottom: 2mm;
}
.scope__icon { color: var(--pc-navy); flex: none; }
.scope__icon svg { width: 8.4mm; height: auto; display: block; }
.scope__title { font-size: 10.5pt; font-weight: 800; color: var(--pc-navy); margin: 0; line-height: 1.25; }
.scope__title small { display: block; font-size: 8.1pt; font-weight: 700; color: var(--pc-muted); margin-top: 0.3mm; }
.scope__list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 1.5mm;
  font-size: 8.3pt; line-height: 1.35;
}
.scope__list li {
  display: flex; gap: 1.5mm; align-items: center; white-space: nowrap;
}
.scope__tag {
  flex: none;
  font-size: 7.5pt; font-weight: 800; color: var(--pc-white); background: var(--pc-navy);
  border-radius: 1.3mm; padding: 0.35mm 1.5mm; white-space: nowrap;
}
.scope__must {
  font-size: 8.6pt; font-weight: 800; color: var(--pc-red);
  margin: 2mm 0 0; line-height: 1.35;
}

/* ── 공통 소제목 ───────────────────────────── */
.h2 { display: flex; align-items: center; gap: 2.2mm; margin: 0 0 1.8mm; font-size: 12.5pt; font-weight: 800; color: var(--pc-navy); }
.h2::before { content: ""; width: 1.4mm; height: 4.8mm; background: var(--pc-navy); border-radius: 1mm; }
.h2 small { font-size: 8.4pt; font-weight: 400; color: var(--pc-muted); }
.h2__right { margin-left: auto; font-size: 8.8pt; font-weight: 400; color: var(--pc-text); }
.h2__right b { color: var(--pc-navy); font-weight: 800; }

/* ── 4. 평가 진행 ──────────────────────────── */
.flow { display: grid; grid-template-columns: 18mm 1fr; gap: 1.2mm; }
.seg { border-radius: 2mm; padding: 1.8mm 3.2mm; font-size: 8.8pt; line-height: 1.35; }
.seg b { display: block; font-size: 10.2pt; }
.seg--ready { background: var(--pc-line); color: var(--pc-muted); text-align: center; padding: 1.9mm 1mm; font-size: 7.8pt; }
.seg--ready b { font-size: 9pt; }
.seg--main { background: var(--pc-navy); color: var(--pc-white); }
.seg span { opacity: 0.92; }

.facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.8mm; margin-top: 2mm; }
.fact { display: grid; grid-template-columns: 9.5mm 1fr; gap: 2.2mm; align-items: center; background: var(--pc-bg-soft); border-radius: 2.4mm; padding: 1.6mm 2.8mm; }
.fact svg { width: 9.5mm; height: auto; display: block; color: var(--pc-navy); }
.fact p { margin: 0; font-size: 8.4pt; line-height: 1.4; }
.fact p b { color: var(--pc-navy); display: block; font-size: 9.3pt; }

/* ── 5. 사이트 이용 방법 ───────────────────── */
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3.6mm; }
.step { display: flex; flex-direction: column; }
.phone {
  border: 1.4mm solid #20242E;
  border-radius: 4.5mm;
  overflow: hidden;
  background: #fff;
  aspect-ratio: 390 / 540;
}
.phone img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: top; }
.step__head { display: flex; align-items: center; gap: 1.6mm; margin: 2mm 0 1mm; }
.num {
  flex: none; width: 5.2mm; height: 5.2mm; border-radius: 50%;
  background: var(--pc-navy); color: var(--pc-white);
  font-size: 8.6pt; font-weight: 800; display: flex; align-items: center; justify-content: center;
}
.step__title { font-size: 9.6pt; font-weight: 800; color: var(--pc-navy); line-height: 1.25; }
.step p { margin: 0; font-size: 8.2pt; line-height: 1.45; }
.btn {
  display: inline-block; font-size: 7.4pt; font-weight: 700; color: var(--pc-navy);
  border: 0.3mm solid var(--pc-navy); border-radius: 1.2mm; padding: 0 1.1mm; line-height: 1.45; white-space: nowrap;
}
.btn--fill { background: var(--pc-navy); color: var(--pc-white); }

/* ── 6. 추천 순서 + 푸터 ───────────────────── */
.order {
  display: flex; align-items: center; flex-wrap: wrap; gap: 1.8mm;
  border: 0.35mm dashed var(--pc-navy); border-radius: 2.8mm; padding: 1.8mm 3.6mm;
  font-size: 8.8pt;
}
.order__label { font-weight: 800; color: var(--pc-navy); margin-right: 1mm; }
.chip { background: var(--pc-navy); color: var(--pc-white); font-weight: 700; border-radius: 10mm; padding: 0.7mm 2.8mm; }
.arrow { color: var(--pc-navy); font-weight: 800; }
.order__note { flex-basis: 100%; font-size: 8.1pt; color: var(--pc-muted); }

.foot {
  flex: none;
  margin: auto 10mm 0;
  padding: 2mm 0 4.5mm;
  border-top: 0.3mm solid var(--pc-line);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 8.4pt; color: var(--pc-muted);
}
.foot img { height: 6.2mm; display: block; }
.foot b { color: var(--pc-navy); font-weight: 800; font-size: 9.8pt; }

@media print {
  body { background: none; }
  .page, .page + .page { margin: 0; box-shadow: none; }
}
</style>
</head>
<body>
<main class="page">

  <header class="band">
    <img src="data:image/png;base64,${b64(`${BRAND}/processed/pc_lockup_white.png`)}" alt="배재중학교 PAI CHAI MIDDLE SCHOOL">
    <div class="band__meta">2026학년도 2학기 생활일본어<span>학급 게시용 안내문</span></div>
  </header>
  <div class="band-rule"></div>

  <div class="body">

    <div class="top">
      <section class="hero">
        <p class="eyebrow">수행평가 2 · 3·4·5단원 문화</p>
        <h1>생활일본어<br><em>수행평가</em> 안내</h1>
        <div class="rule"></div>
        <p class="lead">교과서 3·4·5단원 문화 파트 <b>53개 핵심 문항</b>에서 출제됩니다. 오른쪽 QR코드를 스캔해 대비 사이트에서 미리 연습하세요.</p>
      </section>

      <aside class="qr">
        <div class="qr__label">휴대전화 카메라로 스캔</div>
        <div class="qr__code" id="qr">${qrSvg}</div>
        <div class="qr__url">japanese-test-v4.vercel.app</div>
        <div class="qr__note">로그인 없이 바로 이용 · 학습지 PDF · 자유 연습 · 모의시험</div>
      </aside>

      <section class="scope">
        <div class="scope__head">
          <div class="scope__icon">${iconSvg('open-textbook')}</div>
          <p class="scope__title">출제 범위 · 교과서 3·4·5단원 문화<small>미래엔 『생활일본어』 교과서 본문 기준 총 53문항</small></p>
        </div>
        <ul class="scope__list">
          <li><span class="scope__tag">3단원 17문항</span><span>61~64쪽 · 호칭·학교생활·교복 단추</span></li>
          <li><span class="scope__tag">4단원 20문항</span><span>75~78쪽 · どうぞ·행운과 기원·숫자 8</span></li>
          <li><span class="scope__tag">5단원 16문항</span><span>89~92쪽 · 식사 예절·음식·우동 이름</span></li>
        </ul>
        <p class="scope__must">※ 전체 53문항 중 20문항이 무작위로 출제됩니다.</p>
      </section>
    </div>

    <section>
      <h2 class="h2">평가는 이렇게 진행돼요 <small>사이트 20문항 모의시험과 똑같이 진행</small><span class="h2__right">총 <b>20문항</b> · 문항당 <b>10초</b> 자동 진행 · 약 3분 25초</span></h2>
      <div class="flow">
        <div class="seg seg--ready"><b>준비</b>5초</div>
        <div class="seg seg--main"><b>1~20번 · 3·4·5단원 문화 핵심 질문 (문항당 10초)</b><span>교실 TV 화면의 문화 질문을 보고 배부된 답안지에 우리말 단답형으로 작성</span></div>
      </div>
      <div class="facts">
        <div class="fact">${iconSvg('broadcast-television')}<p><b>TV 화면으로 출제</b>화면의 질문을 보고 답합니다.</p></div>
        <div class="fact">${iconSvg('pencil-writing')}<p><b>답은 종이에 직접</b>시간 안에 답안지에 우리말로 씁니다.</p></div>
        <div class="fact">${iconSvg('open-textbook')}<p><b>핵심 53문항 100% 출제</b>사이트 문화 정리 학습지에서 그대로 출제!</p></div>
      </div>
    </section>

    <section>
      <h2 class="h2">사이트 이용 방법 <small>휴대전화 화면 기준</small></h2>
      <div class="steps">
        <div class="step">
          <div class="phone"><img src="data:image/jpeg;base64,${b64(path.join(FRAMES, 'f1_home.jpg'))}" alt="첫 화면"></div>
          <div class="step__head"><span class="num">1</span><span class="step__title">QR로 접속</span></div>
          <p>첫 화면을 내려 메뉴 카드 3개를 확인합니다.</p>
        </div>
        <div class="step">
          <div class="phone"><img src="data:image/jpeg;base64,${b64(path.join(FRAMES, 'f2_material.jpg'))}" alt="시험 준비자료 화면"></div>
          <div class="step__head"><span class="num">2</span><span class="step__title">시험 준비자료</span></div>
          <p><span class="btn">자료 보기</span>에서 학생용 핵심 학습지(A4 2쪽)와 20칸 답안지를 확인·인쇄해요.</p>
        </div>
        <div class="step">
          <div class="phone"><img src="data:image/jpeg;base64,${b64(path.join(FRAMES, 'f3_practice.jpg'))}" alt="자유 연습 화면"></div>
          <div class="step__head"><span class="num">3</span><span class="step__title">53문항 자유 연습</span></div>
          <p><span class="btn">연습 시작</span> → 전체·단원별로 훑고 떠올린 뒤 <span class="btn">정답 보기</span>로 확인해요.</p>
        </div>
        <div class="step">
          <div class="phone"><img src="data:image/jpeg;base64,${b64(path.join(FRAMES, 'f4_mock.jpg'))}" alt="20문항 모의시험 진행 화면"></div>
          <div class="step__head"><span class="num">4</span><span class="step__title">20문항 모의시험</span></div>
          <p><span class="btn btn--fill">모의시험 시작</span> → 실제와 같이 10초씩 넘어가며 실전 점검!</p>
        </div>
      </div>
    </section>

    <section class="order">
      <span class="order__label">추천 준비 순서</span>
      <span class="chip">① 핵심 학습지로 훑기</span><span class="arrow">→</span>
      <span class="chip">② 단원별 자유 연습 반복</span><span class="arrow">→</span>
      <span class="chip">③ 20문항 모의시험 점검</span>
      <span class="order__note">연습·모의시험은 할 때마다 53개 전체 문항에서 새로 뽑습니다. 평가 전까지 부담 없이 여러 번 반복하세요.</span>
    </section>

  </div>

  <footer class="foot">
    <img src="data:image/png;base64,${b64(`${BRAND}/processed/pc_lockup_navy.png`)}" alt="배재중학교">
    <b>외우기보다 익숙해지기.</b>
  </footer>

</main>
</body>
</html>`;

  const noticeHtmlPath = path.join(DEPLOY_DIR, 'notice.html');
  const noticePdfPath = path.join(DEPLOY_DIR, 'notice.pdf');
  const koreanPdfPath = path.join(DEPLOY_DIR, '생활일본어_2학기2차_수행평가안내문.pdf');
  const previewPath = path.join(DEPLOY_DIR, '.tmp_notice_preview.png');

  fs.writeFileSync(noticeHtmlPath, html, 'utf8');
  console.log('Written HTML:', noticeHtmlPath, (Buffer.byteLength(html) / 1024).toFixed(0) + 'KB');

  // Render PDF & PNG + Gate checks
  const MM = 96 / 25.4;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const external = [];
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith('file:') && !u.startsWith('data:')) external.push(u);
  });

  await page.goto('file:///' + noticeHtmlPath.replace(/\\/g, '/'));
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);

  const metrics = await page.evaluate((MM) => {
    const q = (s) => document.querySelector(s).getBoundingClientRect();
    const pageR = q('.page');
    const order = q('.order');
    const foot = q('.foot');
    const qrR = q('#qr');
    return {
      pageH_mm: +(pageR.height / MM).toFixed(1),
      bodyScrollH_mm: +(document.documentElement.scrollHeight / MM).toFixed(1),
      slack_mm: +((foot.top - order.bottom) / MM).toFixed(1),
      footBottomInside_mm: +((pageR.bottom - foot.bottom) / MM).toFixed(1),
      qrBox_mm: `${(qrR.width / MM).toFixed(1)}x${(qrR.height / MM).toFixed(1)}`,
      font800: document.fonts.check('800 20px A2Z'),
      font400: document.fonts.check('400 12px A2Z'),
      h1Font: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0],
    };
  }, MM);
  console.log('Metrics:', JSON.stringify(metrics));

  await page.pdf({ path: noticePdfPath, format: 'A4', preferCSSPageSize: true, printBackground: true });
  fs.copyFileSync(noticePdfPath, koreanPdfPath);

  const pdfDoc = await PDFDocument.load(fs.readFileSync(noticePdfPath));
  console.log('PDF pages:', pdfDoc.getPageCount(), '| size:', (fs.statSync(noticePdfPath).size / 1024).toFixed(0) + 'KB');

  await page.locator('.page').screenshot({ path: previewPath });

  const qrBuf = await page.locator('#qr').screenshot();
  const png = PNG.sync.read(qrBuf);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  console.log('QR decode:', code ? JSON.stringify(code.data) : 'null', '| match:', !!code && code.data === URL_TARGET);
  console.log('External requests:', external.length);

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
