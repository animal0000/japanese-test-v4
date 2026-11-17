import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('D:/Claude/workspace/클로드용/생활일본어_수행평가안내_2026-2/_work/node_modules/playwright');

const rootDir = path.resolve(import.meta.dirname, '..');
const previewDir = path.join(rootDir, '.tmp_previews');
fs.mkdirSync(previewDir, { recursive: true });
const outDir = rootDir;
const brandDir = 'D:/Claude/workspace/Cowork/Brand/processed';

const questions = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'questions.json'), 'utf8'));
const shieldB64 = fs.readFileSync(path.join(brandDir, 'pc_shield_navy.png')).toString('base64');
const wordmarkB64 = fs.readFileSync(path.join(brandDir, 'pc_ms_wordmark_navy.png')).toString('base64');

function esc(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

// 1. Generate study_sheet.html (Page 1: Q1~Q28, Page 2: Q29~Q56)
function renderQaList(slice, startNum) {
  return slice.map((item, idx) => {
    const num = startNum + idx;
    return `        <div class="qa"><div class="n">${num}</div><div class="body">
            <span class="src">${esc(item.source)}</span>
            <span class="q">${esc(item.q)}</span>
            <span class="a">${esc(item.a)}</span>
        </div></div>`;
  }).join('\n');
}

const page1Items = questions.slice(0, 27);
const page2Items = questions.slice(27, 53);

const studySheetHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>생활일본어 2학기 2차 수행평가 학습지 (3·4·5단원 문화) - 배재중학교</title>
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
    :root{
        --navy:#1A2F8A;
        --red:#C0392B;
        --gold:#B8860B;
        --ink:#0f172a;
        --muted:#64748b;
        --line:#cbd5e1;
        --soft:#eef2ff;
    }
    *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}
    html,body{
        font-family:'Pretendard','Noto Sans KR',sans-serif;
        color:var(--ink);
        background:#e2e8f0;
        font-size:9pt;
        line-height:1.34;
    }
    .jp{font-family:'Noto Sans JP','Yu Gothic',sans-serif;}
    .screen-bar{
        position:sticky;top:0;z-index:50;
        background:#fff;border-bottom:1px solid var(--line);
        padding:10px 24px;display:flex;justify-content:space-between;align-items:center;
        box-shadow:0 4px 12px rgba(0,0,0,.06);
    }
    .screen-bar .t{font-weight:800;color:var(--navy);font-size:14px;}
    .screen-bar .sub{font-size:11px;color:var(--muted);}
    .screen-bar button{
        background:var(--navy);color:#fff;border:0;padding:9px 18px;border-radius:10px;
        font-weight:800;font-size:13px;cursor:pointer;
    }
    @page{ size:A4 portrait; margin:0; }
    @media print{
        html,body{background:white !important;}
        .no-print{display:none !important;}
        .page{
            box-shadow:none !important;
            margin:0 !important;
            page-break-after:always;
            break-after:page;
        }
        .page:last-child{page-break-after:auto;break-after:auto;}
    }
    .page{
        width:210mm;
        height:297mm;
        padding:10mm 12mm 9mm 12mm;
        background:white;
        margin:14px auto;
        box-shadow:0 10px 30px rgba(26,47,138,.15);
        position:relative;
        overflow:hidden;
        display:flex;
        flex-direction:column;
    }
    .hdr{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        border-bottom:3px double var(--navy);
        padding-bottom:6px;
        margin-bottom:7px;
    }
    .hdr .title{
        display:flex;
        align-items:center;
        gap:9px;
    }
    .hdr .badge{
        background:var(--navy);
        color:white;
        padding:4px 9px;
        font-weight:900;
        font-size:9pt;
        letter-spacing:.05em;
        border-radius:3px;
    }
    .hdr h1{
        font-size:15.5pt;
        font-weight:900;
        color:var(--navy);
        letter-spacing:-.02em;
    }
    .hdr h1 .red{color:var(--red);}
    .hdr .meta{
        text-align:right;
        font-size:8.2pt;
        color:var(--muted);
        line-height:1.38;
    }
    .hdr .meta strong{color:var(--ink);}

    .tip{
        background:linear-gradient(90deg,#fff7e6,#fffdf5);
        border-left:4px solid var(--gold);
        padding:5px 10px;
        font-size:8.3pt;
        margin-bottom:7px;
        color:#5a4500;
    }
    .tip b{color:var(--red);}

    .qlist{
        column-count:2;
        column-gap:8mm;
        column-rule:1px dashed var(--line);
        flex:1;
    }
    .qa{
        break-inside:avoid;
        display:grid;
        grid-template-columns:20px 1fr;
        column-gap:6px;
        padding:3px 0 3.5px;
        border-bottom:1px dotted #e2e8f0;
        font-size:8.25pt;
        line-height:1.28;
    }
    .qa:last-child{border-bottom:none;}
    .qa .n{
        font-weight:900;
        color:var(--navy);
        font-size:8pt;
        background:var(--soft);
        text-align:center;
        height:16px;
        line-height:16px;
        margin-top:1px;
        border-radius:3px;
    }
    .qa .body .src{
        display:inline-block;
        font-size:7pt;
        font-weight:800;
        color:var(--navy);
        background:#eef2ff;
        border:1px solid #c7d2fe;
        padding:0 4px;
        border-radius:3px;
        margin-right:4px;
        vertical-align:0.5px;
    }
    .qa .body .q{
        color:var(--ink);
        font-weight:600;
        word-break:keep-all;
    }
    .qa .body .a{
        display:block;
        color:var(--red);
        font-weight:800;
        margin-top:2px;
        padding-left:6px;
        border-left:2px solid var(--red);
        font-size:8.1pt;
        word-break:keep-all;
    }
    .qa .body .a::before{
        content:"정답";
        font-size:6.8pt;
        background:var(--red);
        color:white;
        padding:0.5px 4px;
        margin-right:5px;
        font-weight:900;
        border-radius:2px;
        vertical-align:0.5px;
    }

    .ftr{
        margin-top:6px;
        padding-top:5px;
        border-top:1px solid var(--line);
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:8pt;
        color:var(--muted);
    }
    .ftr .stamp{
        font-weight:900;
        color:var(--navy);
        letter-spacing:.08em;
    }
    .corner{
        position:absolute;
        top:0;right:0;
        width:54px;height:54px;
        background:var(--navy);
        clip-path:polygon(100% 0,0 0,100% 100%);
    }
    .corner.red{background:var(--red);}
</style>
</head>
<body>

<div class="screen-bar no-print">
    <div>
        <div class="t">배재중학교 · 생활일본어 2학기 2차 수행평가 학습지 (3·4·5단원 문화)</div>
        <div class="sub">총 53문항 · A4 2쪽 고밀도 인쇄용</div>
    </div>
    <button onclick="window.print()">🖨️ 학습지 인쇄 / PDF 저장</button>
</div>

<!-- ═══════════════════ PAGE 1 (Q1 ~ Q27) ═══════════════════ -->
<div class="page" id="page1">
    <div class="corner"></div>
    <header class="hdr">
        <div class="title">
            <span class="badge">학습지</span>
            <h1>2학기 2차 수행평가 <span class="red">핵심 정리</span></h1>
        </div>
        <div class="meta">
            <strong>배재중학교 · 생활일본어 (3·4·5단원 문화 파트 53문항)</strong><br>
            학년( 2 ) 반( &nbsp;&nbsp; ) 번호( &nbsp;&nbsp; ) 이름(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
        </div>
    </header>

    <div class="tip">
        💡 <b>학습 안내</b> &nbsp;|&nbsp; 교과서 <b>3단원(61~64쪽) · 4단원(75~78쪽) · 5단원(89~92쪽)</b> 문화 코너에서만 출제됩니다. (총 53문항 중 <b>랜덤 20문항</b> 출제)
    </div>

    <div class="qlist">
${renderQaList(page1Items, 1)}
    </div>

    <footer class="ftr">
        <span>생활일본어 2학기 2차 수행평가 학습지 · 1/2 (1~27번 · 3단원 17문항 + 4단원 전반 10문항)</span>
        <span class="stamp">배재중학교 일본어과</span>
        <span>※ 교과서 본문 내용만 출제</span>
    </footer>
</div>

<!-- ═══════════════════ PAGE 2 (Q28 ~ Q53) ═══════════════════ -->
<div class="page" id="page2">
    <div class="corner red"></div>
    <header class="hdr">
        <div class="title">
            <span class="badge" style="background:var(--red);">학습지</span>
            <h1>2학기 2차 수행평가 <span class="red">핵심 정리</span></h1>
        </div>
        <div class="meta">
            <strong>배재중학교 · 생활일본어 (3·4·5단원 문화 파트 53문항)</strong><br>
            28~53번 · 4단원 후반 10문항 + 5단원 16문항
        </div>
    </header>

    <div class="tip">
        ✅ <b>셀프 체크</b> &nbsp;|&nbsp; 빨간 정답 박스를 가리고 우리말 단답형으로 떠올려 보세요. 웹 모의시험(20문항)으로도 실전처럼 점검할 수 있습니다.
    </div>

    <div class="qlist">
${renderQaList(page2Items, 28)}
    </div>

    <footer class="ftr">
        <span>생활일본어 2학기 2차 수행평가 학습지 · 2/2 (28~53번 · 4단원 후반 10문항 + 5단원 16문항)</span>
        <span class="stamp">배재중학교 일본어과</span>
        <span>크고자 하거든 남을 섬기라</span>
    </footer>
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'study_sheet.html'), studySheetHtml, 'utf8');
console.log('Written study_sheet.html');

// 2. Generate answer_sheet.html (A4 1 page portrait, 1~10 left, 11~20 right, horizontal guide line only)
const answerSheetHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2026학년도 2학기 2차 수행평가 답안지 (생활일본어 문화) - 배재중학교</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --pc-navy: #1A2F8A;
      --pc-navy-dark: #101F61;
      --pc-navy-light: #EEF3FA;
      --pc-red: #C0392B;
      --pc-red-light: #FDF2F2;
      --pc-border: #334155;
      --pc-border-light: #CBD5E1;
      --pc-grid-guide: #E2E8F0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Noto Sans KR', 'Pretendard', system-ui, -apple-system, sans-serif;
      background-color: #E2E8F0;
      color: #0F172A;
      margin: 0;
      padding: 0;
    }
    .screen-top-bar {
      position: sticky;
      top: 0; left: 0; right: 0;
      background: #FFFFFF;
      border-bottom: 1px solid #CBD5E1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      z-index: 100;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sheet-wrapper { padding: 24px 0 40px 0; }
    .a4-sheet {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 12mm 15mm 11mm 15mm;
      margin: 0 auto;
      background: #FFFFFF;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
    }
    @page { size: A4 portrait; margin: 0; }
    @media print {
      body { background: transparent !important; padding: 0 !important; margin: 0 !important; }
      .no-print { display: none !important; }
      .sheet-wrapper { padding: 0 !important; }
      .a4-sheet {
        box-shadow: none !important;
        margin: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        padding: 12mm 15mm 10mm 15mm !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
    .id-table {
      border-collapse: collapse;
      border: 1.5px solid var(--pc-navy);
    }
    .id-table th, .id-table td {
      border: 1px solid var(--pc-border-light);
      text-align: center;
      vertical-align: middle;
      height: 33px;
      padding: 2px 6px;
    }
    .id-table th {
      background-color: var(--pc-navy-light);
      color: var(--pc-navy-dark);
      font-weight: 700;
      font-size: 12px;
      letter-spacing: -0.02em;
    }
    .answer-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid var(--pc-border);
      table-layout: fixed;
    }
    .answer-table th, .answer-table td {
      border: 1.2px solid var(--pc-border);
      text-align: center;
      vertical-align: middle;
    }
    .answer-table tbody tr {
      height: 19.0mm;
    }
    .num-cell {
      background-color: #F8FAFC;
      font-weight: 800;
      color: #334155;
      font-size: 15px;
      letter-spacing: -0.02em;
    }
    .write-cell {
      position: relative;
      background-color: transparent;
      overflow: hidden;
    }
    .guide-h {
      position: absolute;
      left: 0; right: 0; top: 50%;
      border-top: 1px dashed var(--pc-grid-guide);
      pointer-events: none;
      z-index: 1;
    }
    .hide-guides .guide-h {
      display: none !important;
    }
    .check-cell {
      background-color: #FAFAFA;
      color: #94A3B8;
      font-size: 10px;
    }
  </style>
</head>
<body>

  <header class="no-print screen-top-bar">
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-7 bg-[#1A2F8A] rounded-full"></div>
      <div>
        <h2 class="text-sm font-extrabold text-[#1A2F8A] leading-tight">배재중학교 2학년 생활일본어 2차 수행평가 답안지</h2>
        <p class="text-[11px] text-slate-500">2026학년도 2학기 2차 (3·4·5단원 문화 파트 53문항 중 랜덤 20문항 출제) · A4 1장 최적화</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="toggleGuides()" id="guide-toggle-btn" class="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm">
        <span>📏</span> 가로 안내선 ON
      </button>
      <button onclick="window.print()" class="bg-[#1A2F8A] hover:bg-[#101F61] text-white px-5 py-2 rounded-xl shadow-md font-bold text-sm transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        A4 답안지 인쇄하기
      </button>
    </div>
  </header>

  <div class="sheet-wrapper">
    <div class="a4-sheet" id="sheet-container">
      <div>
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center gap-1.5">
              <img src="data:image/png;base64,${shieldB64}" alt="배재중학교 심볼" class="h-8 object-contain">
              <img src="data:image/png;base64,${wordmarkB64}" alt="배재중학교" class="h-6 object-contain">
            </div>
            <div class="h-5 w-px bg-slate-300 mx-1"></div>
            <div class="flex items-center gap-2">
              <h1 class="text-[19px] font-black text-slate-900 tracking-tight">
                2026학년도 2학기 2차 일본어 수행평가 답안지
              </h1>
              <span class="text-[#1A2F8A] text-xs font-black px-2 py-0.5 bg-[#EEF3FA] rounded-md border border-[#C7D7F0]">
                생활일본어
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4 pb-2.5 border-b-2 border-[#1A2F8A]">
          <div class="flex items-center gap-2 text-xs text-slate-600 font-semibold pl-1 whitespace-nowrap">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#1A2F8A] shrink-0"></span>
            <span>출제 범위 : 3·4·5단원 문화 53문항 (랜덤 20문항)</span>
          </div>
          <div>
            <table class="id-table text-xs">
              <tr>
                <th class="w-11">학년</th>
                <td class="w-10 font-black text-[#1A2F8A] text-base">2</td>
                <th class="w-10">반</th>
                <td class="w-12"></td>
                <th class="w-11">번호</th>
                <td class="w-12"></td>
                <th class="w-12">성명</th>
                <td class="w-36"></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5 mt-2.5 text-[11px]">
          <div class="bg-[#EEF3FA] border border-[#C7D7F0] border-l-4 border-l-[#1A2F8A] rounded-md px-3 py-1.5 flex items-center gap-2">
            <span class="bg-[#1A2F8A] text-white font-black text-[10px] px-1.5 py-0.5 rounded shrink-0">1~10번</span>
            <span class="text-slate-800 leading-tight"><strong>우리말 단답형</strong> : 화면 질문에 알맞은 정답 쓰기</span>
          </div>
          <div class="bg-[#FDF2F2] border border-[#F5C2C0] border-l-4 border-l-[#C0392B] rounded-md px-3 py-1.5 flex items-center gap-2">
            <span class="bg-[#C0392B] text-white font-black text-[10px] px-1.5 py-0.5 rounded shrink-0">11~20번</span>
            <span class="text-slate-800 leading-tight"><strong>우리말 단답형</strong> : 화면 질문에 알맞은 정답 쓰기</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5 mt-2">
          <div>
            <table class="answer-table">
              <thead>
                <tr class="bg-[#1A2F8A] text-white text-[12px]">
                  <th style="width: 14%;" class="py-1.5 font-bold">번호</th>
                  <th style="width: 72%;" class="py-1.5 font-bold tracking-wide">정 답 (우리말 단답형)</th>
                  <th style="width: 14%;" class="py-1.5 font-semibold text-[10px] bg-[#14256E]">채점</th>
                </tr>
              </thead>
              <tbody id="left-tbody"></tbody>
            </table>
          </div>

          <div>
            <table class="answer-table">
              <thead>
                <tr class="bg-[#C0392B] text-white text-[12px]">
                  <th style="width: 14%;" class="py-1.5 font-bold">번호</th>
                  <th style="width: 72%;" class="py-1.5 font-bold tracking-wide">정 답 (우리말 단답형)</th>
                  <th style="width: 14%;" class="py-1.5 font-semibold text-[10px] bg-[#96261B]">채점</th>
                </tr>
              </thead>
              <tbody id="right-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-300 flex justify-between items-center text-slate-500 text-[11px]">
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-[#1A2F8A]">배재중학교</span>
          <span>2학년 생활일본어 2차 수행평가 (문화)</span>
          <span class="text-slate-400">|</span>
          <span class="text-slate-400">A4 표준 규격 답안지</span>
        </div>
        <div class="text-right flex items-center gap-2">
          <span class="font-bold text-[#1A2F8A]">배재중학교 일본어과</span>
          <span class="text-slate-400">·</span>
          <span class="text-slate-600 font-medium">“크고자 하거든 남을 섬기라”</span>
        </div>
      </div>
    </div>
  </div>

  <script>
    function renderRows() {
      const leftTbody = document.getElementById('left-tbody');
      const rightTbody = document.getElementById('right-tbody');
      const makeRows = (start, end) => {
        let html = '';
        for (let i = start; i <= end; i++) {
          html += \`
            <tr>
              <td class="num-cell">\${i}</td>
              <td class="write-cell"><div class="guide-h"></div></td>
              <td class="check-cell"></td>
            </tr>
          \`;
        }
        return html;
      };
      leftTbody.innerHTML = makeRows(1, 10);
      rightTbody.innerHTML = makeRows(11, 20);
    }
    function toggleGuides() {
      const container = document.getElementById('sheet-container');
      const btn = document.getElementById('guide-toggle-btn');
      container.classList.toggle('hide-guides');
      if (container.classList.contains('hide-guides')) {
        btn.innerHTML = '<span>📏</span> 가로 안내선 OFF';
        btn.classList.add('bg-slate-200');
      } else {
        btn.innerHTML = '<span>📏</span> 가로 안내선 ON';
        btn.classList.remove('bg-slate-200');
      }
    }
    renderRows();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'answer_sheet.html'), answerSheetHtml, 'utf8');
console.log('Written answer_sheet.html');

// 3. Render both PDFs and preview PNGs using Playwright
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 1600 } });

  const pageStudy = await context.newPage();
  await pageStudy.goto('file:///' + path.join(outDir, 'study_sheet.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await pageStudy.pdf({
    path: path.join(outDir, 'study_guide.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });
  await (await pageStudy.$('#page1')).screenshot({ path: path.join(previewDir, 'study_page1.png') });
  await (await pageStudy.$('#page2')).screenshot({ path: path.join(previewDir, 'study_page2.png') });

  // Also check if any .qa element inside #page1 or #page2 overflows its page box
  const overflowCheck = await pageStudy.evaluate(() => {
    const res = {};
    for (const id of ['page1', 'page2']) {
      const el = document.getElementById(id);
      const qlist = el.querySelector('.qlist');
      const lastQa = qlist.lastElementChild;
      const pageRect = el.getBoundingClientRect();
      const qlistRect = qlist.getBoundingClientRect();
      const lastRect = lastQa.getBoundingClientRect();
      res[id] = {
        pageHeight: Math.round(pageRect.height),
        qlistScrollWidth: Math.round(qlist.scrollWidth),
        qlistClientWidth: Math.round(qlist.clientWidth),
        qlistScrollHeight: Math.round(qlist.scrollHeight),
        qlistClientHeight: Math.round(qlist.clientHeight),
        lastQaRight: Math.round(lastRect.right - pageRect.left),
        pageWidth: Math.round(pageRect.width),
        lastQaBottom: Math.round(lastRect.bottom - pageRect.top)
      };
    }
    return res;
  });
  console.log('Study sheet overflow check:', JSON.stringify(overflowCheck, null, 2));

  const pageAnswer = await context.newPage();
  await pageAnswer.goto('file:///' + path.join(outDir, 'answer_sheet.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await pageAnswer.pdf({
    path: path.join(outDir, 'answer_sheet.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });
  await (await pageAnswer.$('#sheet-container')).screenshot({ path: path.join(previewDir, 'answer_sheet_preview.png') });

  await browser.close();
  console.log('Rendered study_guide.pdf and answer_sheet.pdf successfully!');
})();
