const { createRequire } = require('module');
const path = require('path');
const fs = require('fs');

const req = createRequire('D:/Claude/workspace/클로드용/생활일본어_수행평가안내_2026-2/_work/package.json');
const { chromium } = req('playwright');

const URL = 'https://japanese-test-v4.vercel.app/';
const OUT = path.join(path.resolve(__dirname, '..'), '.tmp_notice_frames');
fs.mkdirSync(OUT, { recursive: true });

const W = 390;
const H = 540; // 390 x 540 ratio for crisp, compact 4-card mobile strip on A4

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'ko-KR',
  });
  const page = await ctx.newPage();
  const wait = (ms) => page.waitForTimeout(ms);

  const home = async () => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await wait(500);
  };

  async function frame(name, y = 0) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(200);
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const top = Math.max(0, Math.min(Math.round(y), Math.max(0, docH - H)));
    await page.screenshot({
      path: path.join(OUT, name + '.jpg'),
      type: 'jpeg',
      quality: 90,
      fullPage: true,
      clip: { x: 0, y: top, width: W, height: H },
    });
    console.log(name, 'clipTop=', top, 'docH=', docH);
  }

  // 1. 첫 화면 (Home hero + first card)
  await home();
  const yHero = await page.evaluate(() => {
    const h = document.querySelector('#home .hero h1');
    return h ? Math.max(0, h.getBoundingClientRect().top + window.scrollY - 68) : 0;
  });
  await frame('f1_home', 0);

  // 2. 준비자료 화면 (학생용 문화 학습지 & 답안지 카드)
  await page.locator('.feature button[data-go="resources"]').click();
  await wait(400);
  const yRes = await page.evaluate(() => {
    const card = document.querySelectorAll('#resources .card')[1];
    return card ? card.getBoundingClientRect().top + window.scrollY - 12 : 300;
  });
  await frame('f2_material', yRes);

  // 3. 53문항 자유 연습 (단원 선택 + 플래시카드 + 정답 공개)
  await home();
  await page.locator('.feature button[data-go="practice"]').click();
  await wait(300);
  // Make sticky topbar static during capture so unit filter pills aren't covered when scrolled
  await page.evaluate(() => {
    const tb = document.querySelector('.topbar');
    if (tb) tb.style.position = 'static';
  });
  await page.fill('#studySearch', '다루마');
  await wait(200);
  await page.locator('#studyList .study-item').first().click();
  await page.fill('#studySearch', '');
  await page.locator('#revealBtn').click();
  await wait(300);
  const yPrac = await page.evaluate(() => {
    const sec = document.querySelector('#practice .controls');
    return sec ? sec.getBoundingClientRect().top + window.scrollY - 14 : 120;
  });
  await frame('f3_practice', yPrac);

  // 4. 20문항 모의시험 진행 화면 (1 / 20 문항 타이머 카운트다운 중)
  await home();
  await page.locator('.feature button[data-go="mock"]').click();
  await wait(300);
  await page.locator('#startMockBtn').click();
  await wait(6200); // 5초 준비 완료 후 1번 문항(9초 남음) 진입
  await page.evaluate(() => {
    const pauseBtn = document.querySelector('#pauseMockBtn');
    if (pauseBtn && pauseBtn.textContent.trim() === '일시정지') pauseBtn.click();
  });
  const yMock = await page.evaluate(() => {
    const st = document.querySelector('#mockStage');
    return st ? st.getBoundingClientRect().top + window.scrollY - 10 : 120;
  });
  await frame('f4_mock', yMock);

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
