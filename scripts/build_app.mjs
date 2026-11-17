import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');
const outDir = rootDir;

const questions = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'questions.json'), 'utf8'));
const pdfBytes = fs.readFileSync(path.join(outDir, 'study_guide.pdf'));
const pdfB64 = pdfBytes.toString('base64');

// Build index.html
const indexHtml = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1A2F8A">
<meta name="description" content="배재중학교 생활일본어 2학기 2차 수행평가 대비: 3·4·5단원 문화 53문항 학습지, 자유 연습, 20문항 모의시험">
<title>생활일본어 문화 수행평가 대비 | 배재중학교</title>
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap" rel="stylesheet">
<style>:root{
--navy:#1A2F8A;--navy2:#122466;--red:#C0392B;--green:#198754;--yellow:#F1C40F;
--ink:#171A22;--muted:#637083;--line:#DDE3EF;--bg:#F5F7FB;--card:#fff;
--radius:22px;--shadow:0 18px 50px rgba(26,47,138,.10);--safe:env(safe-area-inset-bottom,0px)
}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:linear-gradient(180deg,#f7f9fd 0,#f3f6fb 100%);color:var(--ink);font-family:Pretendard,"Noto Sans KR",system-ui,-apple-system,"Segoe UI",sans-serif;min-height:100vh}
button,a,input,select{font:inherit}button,a{touch-action:manipulation}.jp{font-family:"Noto Sans JP","Yu Gothic",Meiryo,sans-serif;letter-spacing:.02em}
a{color:inherit}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.topbar{position:sticky;top:0;z-index:20;background:rgba(245,247,251,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(221,227,239,.8)}
.topbar-inner{height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:10px;font-weight:900;color:var(--navy);text-decoration:none}.brand-mark{width:36px;height:36px;border-radius:12px;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:15px}.nav{display:flex;gap:8px}.nav button{border:0;background:transparent;padding:9px 12px;border-radius:12px;color:var(--muted);font-weight:800;cursor:pointer}.nav button:hover,.nav button.active{background:#e9eefb;color:var(--navy)}
.hero{padding:68px 0 34px}.eyebrow{display:inline-flex;gap:8px;align-items:center;padding:7px 11px;border-radius:999px;background:#e9eefb;color:var(--navy);font-size:12px;font-weight:900;letter-spacing:.08em}.hero h1{font-size:clamp(38px,7vw,70px);line-height:1.06;margin:18px 0 16px;color:var(--navy);letter-spacing:-.045em}.hero p{max-width:780px;font-size:clamp(17px,2.4vw,21px);line-height:1.65;color:var(--muted);margin:0;word-break:keep-all}.stats{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.pill{padding:8px 12px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:800;color:#4d5a6d}
.dashboard{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:20px 0 64px}.feature{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:26px;min-height:280px;display:flex;flex-direction:column}.feature .icon{font-size:36px}.feature h2{font-size:24px;margin:18px 0 10px;color:var(--navy)}.feature p{margin:0;color:var(--muted);line-height:1.65;flex:1;word-break:keep-all}.feature .meta{font-size:13px;color:#718096;margin-top:18px}.btn{border:0;border-radius:15px;padding:14px 18px;font-weight:900;cursor:pointer;text-decoration:none;display:inline-flex;justify-content:center;align-items:center;gap:8px;transition:.18s transform,.18s box-shadow,.18s background}.btn:active{transform:scale(.98)}.btn.primary{background:var(--navy);color:#fff;box-shadow:0 10px 22px rgba(26,47,138,.22)}.btn.primary:hover{background:var(--navy2)}.btn.secondary{background:#eef2fb;color:var(--navy)}.btn.secondary:hover{background:#e1e8f8}.btn.ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}.btn.ghost:hover{background:#f8faff}.btn.red{background:var(--red);color:#fff}.btn.green{background:var(--green);color:#fff}.feature .btn{margin-top:20px;width:100%}
.view{display:none;padding:32px 0 72px}.view.active{display:block}.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:24px}.section-head h1{margin:0;color:var(--navy);font-size:clamp(30px,5vw,48px)}.section-head p{margin:8px 0 0;color:var(--muted);word-break:keep-all}.card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px}.resource-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:18px}.pdf-preview{min-height:360px;background:linear-gradient(135deg,#edf2ff,#fff);display:flex;align-items:center;justify-content:center;text-align:center;border-radius:18px;border:1px dashed #b9c5e7;padding:24px}.pdf-preview .paper{background:#fff;width:min(270px,85%);aspect-ratio:210/297;border:1px solid #d7deec;box-shadow:0 14px 30px rgba(20,40,100,.12);padding:22px;display:flex;flex-direction:column;justify-content:center;gap:12px}.pdf-preview .paper b{font-size:22px;color:var(--navy)}.resource-actions{display:flex;flex-direction:column;gap:10px}.rule-list{margin:18px 0 0;padding-left:20px;color:#526075;line-height:1.8;word-break:keep-all}
.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px}.seg{display:flex;padding:4px;background:#e9eef7;border-radius:14px}.seg button{border:0;padding:10px 14px;border-radius:11px;background:transparent;color:#5e6b7e;font-weight:900;cursor:pointer;white-space:nowrap}.seg button.active{background:#fff;color:var(--navy);box-shadow:0 2px 8px rgba(0,0,0,.08)}.search{min-width:230px;flex:1;border:1px solid var(--line);border-radius:14px;padding:12px 14px;background:#fff;color:var(--ink)}
.practice-layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:18px}.flashcard{min-height:420px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden;padding:56px 28px 32px}.flashcard .direction{position:absolute;top:20px;left:20px;padding:7px 12px;background:#eef2fb;color:var(--navy);border-radius:999px;font-size:12px;font-weight:900}.flashcard .count{position:absolute;top:20px;right:20px;color:#8490a2;font-weight:800;font-size:13px}.prompt{font-size:clamp(24px,3.6vw,42px);font-weight:900;color:var(--navy);line-height:1.4;word-break:keep-all;overflow-wrap:anywhere;max-width:660px}.answer{margin-top:26px;padding-top:22px;border-top:1px solid var(--line);width:min(640px,94%);font-size:clamp(20px,2.8vw,32px);font-weight:900;color:var(--red);line-height:1.4;word-break:keep-all;opacity:0;transform:translateY(8px);transition:.2s}.answer.show{opacity:1;transform:none}.flash-actions{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap;justify-content:center}.study-list{max-height:520px;overflow:auto}.study-item{padding:14px 12px;border-bottom:1px solid #edf0f5;cursor:pointer;transition:.12s background}.study-item:hover{background:#f8faff}.study-item:last-child{border-bottom:0}.study-item .src-tag{display:inline-block;font-size:11px;font-weight:900;color:var(--navy);background:#eef2fb;padding:2px 7px;border-radius:999px;margin-bottom:5px}.study-item .qtext{font-weight:800;color:var(--ink);font-size:14px;line-height:1.45;word-break:keep-all}.study-item .krtext{color:var(--red);margin-top:5px;font-size:13px;font-weight:800;word-break:keep-all}.small{font-size:13px;color:var(--muted)}
.mock-start{text-align:center;padding:38px}.mock-start h2{font-size:32px;color:var(--navy);margin:8px 0}.mock-rules{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}.mock-rule{background:#f6f8fc;border:1px solid var(--line);border-radius:16px;padding:16px}.mock-rule b{display:block;color:var(--navy);margin-bottom:6px}.stage{min-height:calc(100vh - 100px);display:flex;flex-direction:column;gap:14px}.stage-head{display:grid;grid-template-columns:1fr auto auto auto;gap:10px;align-items:center}.stage-badge{padding:9px 12px;border-radius:999px;background:#eef2fb;color:var(--navy);font-weight:900;font-size:13px;white-space:nowrap}.stage-badge.timer{min-width:58px;text-align:center;background:#fff4e6;color:#a55b00}.stage-badge.timer.urgent{background:#fdecea;color:var(--red)}.stage-screen{flex:1;min-height:420px;display:flex;align-items:center;justify-content:center;text-align:center;background:#fff;border:1px solid var(--line);border-radius:26px;box-shadow:var(--shadow);padding:36px}.stage-prompt{font-size:clamp(26px,4.2vw,52px);font-weight:900;color:var(--navy);line-height:1.35;word-break:keep-all;overflow-wrap:anywhere;max-width:900px;margin:0 auto}.stage-help{font-size:18px;color:var(--muted);margin-top:22px;line-height:1.65;word-break:keep-all}.progressbar{height:8px;background:#e4e9f2;border-radius:999px;overflow:hidden}.progressbar>div{height:100%;background:var(--navy);width:100%;transition:width 1s linear}.stage-controls{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;padding-bottom:calc(8px + var(--safe))}.result-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.result-item{border:1px solid var(--line);border-radius:16px;padding:18px;background:#fff}.result-item .n{font-size:12px;font-weight:900;color:#8390a4}.result-item .q{font-size:18px;font-weight:800;color:var(--navy);margin:8px 0;line-height:1.45;word-break:keep-all}.result-item .a{font-size:17px;font-weight:900;color:var(--red);line-height:1.45;word-break:keep-all}
.footer{border-top:1px solid var(--line);padding:28px 0 42px;color:#758196;font-size:13px;line-height:1.6}.noscript{margin:20px;background:#fff4e6;padding:14px;border-radius:12px}
.unit-pill-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.unit-pill-card{background:#f8faff;border:1px solid var(--line);border-radius:14px;padding:12px 14px;text-align:left}
.unit-pill-card b{display:block;color:var(--navy);font-size:14px;margin-bottom:4px}
.unit-pill-card span{display:block;color:var(--muted);font-size:12px;line-height:1.45;word-break:keep-all}
@media(max-width:960px){.dashboard{grid-template-columns:1fr}.feature{min-height:220px}}
@media(max-width:860px){.resource-grid,.practice-layout{grid-template-columns:1fr}.mock-rules,.unit-pill-row{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.nav{display:none}.hero{padding-top:44px}.stage{min-height:calc(100vh - 86px)}.stage-screen{min-height:340px;padding:24px}.section-head{align-items:flex-start;flex-direction:column}.study-list{max-height:360px}.stage-head{grid-template-columns:1fr auto}.stage-head .dir{grid-column:1/-1;grid-row:2}}
@media(max-width:520px){.shell{width:min(100% - 20px,1120px)}.topbar-inner{height:60px}.brand span:last-child{font-size:14px}.hero h1{font-size:38px}.hero{padding:34px 0 16px}.dashboard{padding-top:10px}.card,.feature{padding:18px;border-radius:18px}.controls{align-items:stretch}.seg{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:4px}.seg button{padding:10px 6px}.flashcard{min-height:360px;padding:54px 18px 24px}.stage-screen{padding:18px;min-height:310px}.stage-controls .btn{flex:1;min-width:42%}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
</head>
<body>
<noscript><div class="noscript">이 페이지의 연습·모의시험 기능을 사용하려면 JavaScript가 필요합니다. PDF 자료 다운로드는 자료 메뉴에서 가능합니다.</div></noscript>
<header class="topbar"><div class="shell topbar-inner">
<button class="brand" data-go="home" style="border:0;background:transparent;cursor:pointer;padding:0"><span class="brand-mark">培材</span><span>생활일본어 수행평가 대비</span></button>
<nav class="nav" aria-label="주요 메뉴"><button data-go="resources">준비자료</button><button data-go="practice">자유 연습</button><button data-go="mock">20문항 모의시험</button></nav>
</div></header>
<main>
<section id="home" class="view active"><div class="shell">
<div class="hero"><span class="eyebrow">2026학년도 2학기 · 수행2 (3·4·5단원 문화)</span><h1>교과서 속 일본 문화,<br>한눈에 익히기.</h1><p>3·4·5단원 문화 코너(교과서 61~64쪽, 75~78쪽, 89~92쪽)에서 실제 평가에 나오는 <b>53개 핵심 문항</b>만 모았습니다. 학습지로 훑고, 단원별로 연습하고, 실제와 같은 20문항 모의시험으로 점검하세요.</p>
<div class="stats"><span class="pill">53개 핵심 문화 문항</span><span class="pill">3·4·5단원 교과서 100% 반영</span><span class="pill">랜덤 20문항 출제</span><span class="pill">로그인 없음</span></div></div>
<div class="dashboard">
<article class="feature"><div class="icon">📄</div><h2>시험 준비자료</h2><p>A4 2쪽짜리 학생용 문화 핵심 정리 학습지를 확인하고 PDF로 내려받을 수 있습니다. 실제 시험과 같은 20칸 A4 답안지도 인쇄해 보세요.</p><div class="meta">3·4·5단원 문화 · A4 2쪽 고밀도</div><button class="btn secondary" data-go="resources">자료 보기</button></article>
<article class="feature"><div class="icon">🃏</div><h2>53문항 자유 연습</h2><p>전체 53문항 또는 3·4·5단원별로 골라 플래시카드로 반복합니다. 정답은 직접 눌러 확인하고 언제든 새로 섞을 수 있습니다.</p><div class="meta">전체 · 3단원(17) · 4단원(20) · 5단원(16)</div><button class="btn secondary" data-go="practice">연습 시작</button></article>
<article class="feature"><div class="icon">⏱️</div><h2>20문항 모의시험</h2><p>전체 53개 문화 문항에서 서로 다른 20문항을 랜덤 추출해 5초 준비 뒤 문항당 10초씩 실제와 같은 방식으로 진행합니다.</p><div class="meta">5초 준비 · 문항당 10초 · 우리말 단답형</div><button class="btn primary" data-go="mock">모의시험 시작</button></article>
</div>
</div></section>

<section id="resources" class="view"><div class="shell"><div class="section-head"><div><h1>시험 준비자료</h1><p>2학기 2차 문화 수행평가 직전까지 반복해서 볼 학생용 핵심 정리 학습지와 답안지입니다.</p></div><button class="btn ghost" data-go="home">← 처음으로</button></div>
<div class="resource-grid">
<div class="card pdf-preview"><div class="paper"><span class="small">생활일본어 수행평가 2 · 문화</span><b>53개 핵심 문항</b><span>3·4·5단원 교과서 본문</span><span class="small">A4 · 2쪽 · 2단 고밀도</span></div></div>
<div class="card"><h2 style="margin-top:0;color:var(--navy)">학생용 문화 학습지 &amp; 답안지</h2><p style="color:var(--muted);line-height:1.7">교과서 <b>3·4·5단원 문화 코너(61~64, 75~78, 89~92쪽)</b>에서만 출제되는 53문항을 담았습니다.</p>
<div class="resource-actions">
<button class="btn primary" data-pdf="download">📥 학생용 학습지 PDF 다운로드</button>
<button class="btn secondary" data-pdf="open">👁️ 브라우저에서 학습지 PDF 열기</button>
<a class="btn ghost" href="./study_sheet.html" target="_blank" rel="noopener">📄 학습지 웹 화면으로 보기 / 인쇄</a>
<a class="btn ghost" href="./answer_sheet.html" target="_blank" rel="noopener">📝 20칸 답안지 인쇄하기 (A4)</a>
</div>
<ul class="rule-list">
<li>평가 범위: 미래엔 『생활일본어』 3단원(호칭·학교생활·교복 단추), 4단원(どうぞ·행운과 기원·숫자 8), 5단원(식사 예절·음식 문화·재미있는 우동 이름)</li>
<li>정답 형식: 우리말 단답형 (외래어 및 교과서 표기 기준)</li>
<li>웹 자유 연습·모의시험·실제 시험 모두 같은 53개 문항을 사용</li>
</ul>
<div class="unit-pill-row">
<div class="unit-pill-card"><b>3단원 (17문항)</b><span>61~64쪽 · 호칭 / 학교생활 / 교복의 두 번째 단추</span></div>
<div class="unit-pill-card"><b>4단원 (20문항)</b><span>75~78쪽 · どうぞ / 행운과 기원 / 행운의 숫자 8</span></div>
<div class="unit-pill-card"><b>5단원 (16문항)</b><span>89~92쪽 · 식사 예절 / 음식 문화 / 재미있는 우동 이름</span></div>
</div>
</div>
</div>
</div></section>

<section id="practice" class="view"><div class="shell"><div class="section-head"><div><h1>53문항 자유 연습</h1><p>정답을 가리고 떠올린 뒤 확인하세요. 단원별로 골라서 집중 연습할 수도 있습니다.</p></div><button class="btn ghost" data-go="home">← 처음으로</button></div>
<div class="controls">
<div class="seg" id="unitSeg" aria-label="단원 선택">
<button class="active" data-unit="all">전체 (53)</button>
<button data-unit="3단원">3단원 (17)</button>
<button data-unit="4단원">4단원 (20)</button>
<button data-unit="5단원">5단원 (16)</button>
</div>
<button id="reshuffleBtn" class="btn ghost">🔀 새로 섞기</button>
<input id="studySearch" class="search" type="search" placeholder="질문 또는 정답 키워드 검색" aria-label="문항 검색">
</div>
<div class="practice-layout">
<div class="card flashcard">
<span id="practiceDirection" class="direction">3단원(61쪽)</span>
<span id="practiceCount" class="count">1 / 53</span>
<div id="practicePrompt" class="prompt">로딩 중…</div>
<div id="practiceAnswer" class="answer">&nbsp;</div>
<div class="flash-actions">
<button id="revealBtn" class="btn primary">정답 보기</button>
<button id="nextPracticeBtn" class="btn secondary">다음 →</button>
</div>
</div>
<div class="card">
<h3 style="margin-top:0;color:var(--navy)">문항 목록 <span id="studyListCount" class="small" style="font-weight:700"></span></h3>
<p class="small">검색하면 아래 목록만 좁혀집니다. 목록 항목을 누르면 해당 카드로 바로 이동합니다.</p>
<div id="studyList" class="study-list" aria-live="polite"></div>
</div>
</div>
</div></section>

<section id="mock" class="view"><div class="shell"><div class="section-head"><div><h1>20문항 모의시험</h1><p>실제 교실 TV 송출의 기본 흐름과 같은 순서와 시간으로 진행합니다.</p></div><button class="btn ghost" data-go="home">← 처음으로</button></div>
<div id="mockStart" class="card mock-start">
<div style="font-size:44px">⏱️</div>
<h2>20문항 · 약 3분 25초</h2>
<p style="color:var(--muted);line-height:1.7;word-break:keep-all">시작하면 5초 준비 뒤 문항당 10초씩 자동 진행됩니다. 종이나 답안지에 우리말 단답형으로 직접 써 보세요.<br>마지막에 20문항의 질문과 정답을 한꺼번에 확인할 수 있습니다.</p>
<div class="mock-rules">
<div class="mock-rule"><b>출제 범위</b>3·4·5단원 문화 53문항</div>
<div class="mock-rule"><b>문항 구성</b>1~20번 랜덤 20문항</div>
<div class="mock-rule"><b>핵심 규칙</b>중복 없는 고유 문항 출제</div>
</div>
<button id="startMockBtn" class="btn primary" style="min-width:220px">모의시험 시작</button>
</div>
<div id="mockStage" class="stage" hidden>
<div class="stage-head">
<strong id="stageTitle" style="color:var(--navy);font-size:20px">생활일본어 문화 모의시험</strong>
<span id="stageDir" class="stage-badge dir">준비</span>
<span id="stageCounter" class="stage-badge">0 / 20</span>
<span id="stageTimer" class="stage-badge timer">5</span>
</div>
<div class="progressbar"><div id="timeBar"></div></div>
<div class="stage-screen"><div><div id="stagePrompt" class="stage-prompt">준비</div><div id="stageHelp" class="stage-help">답안지를 준비하세요.<br>5초 뒤 자동으로 시작합니다.</div></div></div>
<div class="stage-controls">
<button id="prevMockBtn" class="btn ghost">← 이전</button>
<button id="pauseMockBtn" class="btn primary">일시정지</button>
<button id="nextMockBtn" class="btn secondary">다음 →</button>
<button id="exitMockBtn" class="btn red">종료</button>
</div>
</div>
<div id="mockResult" hidden>
<div class="card" style="margin-bottom:16px">
<h2 style="color:var(--navy);margin-top:0">모의시험 완료</h2>
<p style="color:var(--muted)">아래에서 내가 쓴 답과 비교하세요. <b>새 모의시험</b>을 누르면 이전 회차와 무관하게 전체 53문항에서 다시 뽑습니다.</p>
<div style="display:flex;gap:10px;flex-wrap:wrap">
<button id="newMockBtn" class="btn primary">새 모의시험</button>
<button class="btn ghost" data-go="practice">자유 연습으로</button>
</div>
</div>
<div id="resultGrid" class="result-grid"></div>
</div>
</div></section>
</main>

<footer class="footer"><div class="shell">배재중학교 생활일본어 수행평가 대비 · 3·4·5단원 문화 53문항은 미래엔 『생활일본어』 교과서 본문에만 근거해 구성되었습니다.</div></footer>

<script>
const INLINE_PDF_B64 = '${pdfB64}';
const UNITS = ${JSON.stringify(questions)};

function secureRandomInt(max) {
  if (!Number.isInteger(max) || max <= 0) throw new Error('max must be a positive integer');
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const a = new Uint32Array(1);
    do c.getRandomValues(a); while (a[0] >= limit);
    return a[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffle(input) {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMockSet(pool) {
  if (!Array.isArray(pool) || pool.length < 20) throw new Error('20개 이상의 문항이 필요합니다.');
  const selected = shuffle(pool).slice(0, 20);
  return selected.map((item, index) => ({
    ...item,
    number: index + 1,
    direction: item.source,
    prompt: item.q,
    answer: item.a
  }));
}

function validateMockSet(set) {
  const keys = set.map(q => q.id);
  return {
    total: set.length,
    uniqueUnits: new Set(keys).size,
    valid: set.length === 20 && new Set(keys).size === 20 && set.every(q => q.prompt && q.answer)
  };
}

let practiceQueue = [], practiceIndex = 0, practiceUnit = 'all';
let mockSet = [], mockIndex = 0, mockPreparing = false, mockPaused = false, secondsLeft = 5, tick = null;
const $ = id => document.getElementById(id);

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.go === id));
  if (id !== 'mock') stopMockTimer();
  history.replaceState(null, '', id === 'home' ? '#home' : '#' + id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-go]');
  if (el) {
    e.preventDefault();
    showView(el.dataset.go);
  }
});

function getFilteredPool() {
  return practiceUnit === 'all' ? UNITS : UNITS.filter(u => u.unit === practiceUnit);
}

function renderStudyList(query = '') {
  const q = query.trim().toLowerCase();
  const base = getFilteredPool();
  const rows = base.filter(u =>
    !q ||
    u.q.toLowerCase().includes(q) ||
    u.a.toLowerCase().includes(q) ||
    u.source.toLowerCase().includes(q)
  );
  $('studyListCount').textContent = \`(\${rows.length}문항)\`;
  $('studyList').innerHTML = rows.map(u => \`
    <div class="study-item" data-jump-id="\${u.id}">
      <span class="src-tag">\${escapeHtml(u.source)}</span>
      <div class="qtext">\${escapeHtml(u.q)}</div>
      <div class="krtext">\${escapeHtml(u.a)}</div>
    </div>
  \`).join('') || '<div class="study-item">검색 결과가 없습니다.</div>';
}

$('studyList').addEventListener('click', e => {
  const item = e.target.closest('[data-jump-id]');
  if (!item) return;
  const idx = practiceQueue.findIndex(x => x.id === item.dataset.jumpId);
  if (idx >= 0) {
    practiceIndex = idx;
    renderPractice();
  }
});

function resetPractice() {
  practiceQueue = shuffle(getFilteredPool());
  practiceIndex = 0;
  renderPractice();
  renderStudyList($('studySearch').value);
}

function renderPractice() {
  const item = practiceQueue[practiceIndex];
  if (!item) return;
  $('practiceDirection').textContent = item.source;
  $('practiceCount').textContent = \`\${practiceIndex + 1} / \${practiceQueue.length}\`;
  $('practicePrompt').textContent = item.q;
  $('practiceAnswer').textContent = item.a;
  $('practiceAnswer').className = 'answer';
  $('revealBtn').textContent = '정답 보기';
}

$('unitSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-unit]');
  if (!b) return;
  practiceUnit = b.dataset.unit;
  document.querySelectorAll('#unitSeg button').forEach(x => x.classList.toggle('active', x === b));
  resetPractice();
});

$('reshuffleBtn').onclick = resetPractice;
$('revealBtn').onclick = () => {
  const a = $('practiceAnswer');
  const open = a.classList.toggle('show');
  $('revealBtn').textContent = open ? '정답 숨기기' : '정답 보기';
};
$('nextPracticeBtn').onclick = () => {
  if (!practiceQueue.length) return;
  practiceIndex = (practiceIndex + 1) % practiceQueue.length;
  renderPractice();
};
$('studySearch').addEventListener('input', e => renderStudyList(e.target.value));

function startMock() {
  mockSet = makeMockSet(UNITS);
  const check = validateMockSet(mockSet);
  if (!check.valid) throw new Error('모의시험 출제 규칙 검증 실패');
  mockIndex = 0;
  mockPreparing = true;
  mockPaused = false;
  secondsLeft = 5;
  $('mockStart').hidden = true;
  $('mockResult').hidden = true;
  $('mockStage').hidden = false;
  $('pauseMockBtn').textContent = '일시정지';
  renderMock();
  startMockTimer();
}

function startMockTimer() {
  stopMockTimer();
  tick = setInterval(() => {
    if (mockPaused) return;
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      if (mockPreparing) {
        mockPreparing = false;
        secondsLeft = 10;
        renderMock();
      } else {
        nextMock();
      }
    } else {
      renderMock();
    }
  }, 1000);
}

function stopMockTimer() {
  if (tick) {
    clearInterval(tick);
    tick = null;
  }
}

function renderMock() {
  const timer = $('stageTimer');
  const bar = $('timeBar');
  timer.textContent = secondsLeft;
  timer.classList.toggle('urgent', !mockPreparing && secondsLeft <= 3);
  bar.style.width = \`\${Math.max(0, secondsLeft / (mockPreparing ? 5 : 10) * 100)}%\`;

  if (mockPreparing) {
    $('stageTitle').textContent = '생활일본어 문화 모의시험 · 준비';
    $('stageDir').textContent = '총 20문항 · 우리말 단답형';
    $('stageCounter').textContent = '준비';
    $('stagePrompt').textContent = '준비';
    $('stageHelp').innerHTML = \`답안지를 준비하세요.<br><b>\${secondsLeft}초</b> 뒤 1번 문항이 자동으로 시작됩니다.\`;
    return;
  }

  const q = mockSet[mockIndex];
  $('stageTitle').textContent = '생활일본어 문화 모의시험';
  $('stageDir').textContent = q.direction;
  $('stageCounter').textContent = \`\${q.number} / 20\`;
  $('stagePrompt').textContent = q.prompt;
  $('stageHelp').textContent = '질문에 알맞은 정답을 우리말로 답안지에 쓰세요.';
}

function nextMock() {
  if (mockPreparing) return;
  if (mockIndex < 19) {
    mockIndex++;
    secondsLeft = 10;
    renderMock();
  } else {
    finishMock();
  }
}

function prevMock() {
  if (mockPreparing || mockIndex <= 0) return;
  mockIndex--;
  secondsLeft = 10;
  renderMock();
}

function finishMock() {
  stopMockTimer();
  $('mockStage').hidden = true;
  $('mockResult').hidden = false;
  renderResult();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderResult() {
  $('resultGrid').innerHTML = mockSet.map(q => \`
    <article class="result-item">
      <div class="n">\${String(q.number).padStart(2, '0')} · \${escapeHtml(q.direction)}</div>
      <div class="q">\${escapeHtml(q.prompt)}</div>
      <div class="a">\${escapeHtml(q.answer)}</div>
    </article>
  \`).join('');
}

$('startMockBtn').onclick = startMock;
$('newMockBtn').onclick = startMock;
$('nextMockBtn').onclick = nextMock;
$('prevMockBtn').onclick = prevMock;
$('pauseMockBtn').onclick = () => {
  if (mockPreparing) return;
  mockPaused = !mockPaused;
  $('pauseMockBtn').textContent = mockPaused ? '계속' : '일시정지';
};
$('exitMockBtn').onclick = () => {
  stopMockTimer();
  $('mockStage').hidden = true;
  $('mockStart').hidden = false;
  mockPaused = false;
  mockPreparing = false;
};

document.addEventListener('keydown', e => {
  if ($('mockStage').hidden) return;
  if (e.code === 'Space') {
    e.preventDefault();
    $('pauseMockBtn').click();
  } else if (e.key === 'ArrowRight') {
    nextMock();
  } else if (e.key === 'ArrowLeft') {
    prevMock();
  }
});

async function getPdfBlob() {
  const raw = atob(INLINE_PDF_B64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return new Blob([bytes], { type: 'application/pdf' });
}

async function downloadPdf(openOnly = false) {
  const opener = openOnly ? window.open('about:blank', '_blank') : null;
  try {
    const blob = await getPdfBlob();
    const url = URL.createObjectURL(blob);
    if (openOnly) {
      if (opener) opener.location.href = url;
      else window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = '생활일본어_수행2_문화_학생용_학습지_53문항.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  } catch (err) {
    if (opener) opener.close();
    alert(err.message);
  }
}

document.querySelectorAll('[data-pdf]').forEach(b =>
  b.addEventListener('click', () => downloadPdf(b.dataset.pdf === 'open'))
);

function init() {
  if (UNITS.length !== 53) throw new Error('문항 수 검증 실패');
  resetPractice();
  const hash = location.hash.replace('#', '');
  if (['resources', 'practice', 'mock'].includes(hash)) showView(hash);
}

try {
  init();
} catch (err) {
  console.error(err);
  document.querySelectorAll('.prompt').forEach(el => el.textContent = '데이터를 불러오지 못했습니다. 새로고침해 주세요.');
}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml, 'utf8');
console.log('Written index.html, length:', indexHtml.length);

// Build teacher.html
const teacherHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>교사용 실제시험 송출 및 정답 관리 (문화) | 배재중학교 생활일본어</title>
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap" rel="stylesheet">
<style>
:root {
  --navy: #1A2F8A;
  --navy2: #122466;
  --red: #C0392B;
  --green: #198754;
  --ink: #171A22;
  --muted: #637083;
  --line: #DDE3EF;
  --bg: #F5F7FB;
  --card: #FFFFFF;
  --radius: 20px;
  --shadow: 0 16px 40px rgba(26, 47, 138, 0.08);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Pretendard, "Noto Sans KR", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}
.jp { font-family: "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif; }
.shell { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 60px; }

/* Top Header */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--line);
  padding: 14px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
  margin-bottom: 24px;
}
.brand { display: flex; align-items: center; gap: 12px; font-weight: 900; color: var(--navy); font-size: 18px; }
.brand-mark {
  width: 38px; height: 38px; border-radius: 12px;
  background: var(--navy); color: #fff;
  display: grid; place-items: center; font-size: 15px; font-weight: 900;
}
.status-pill {
  padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 800;
  background: #E8F6EE; color: #187044; border: 1px solid #B8E4C9;
}

/* Card layout */
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 28px;
  margin-bottom: 24px;
}
h2 { color: var(--navy); margin: 0 0 8px; font-size: 24px; font-weight: 800; }
p.desc { color: var(--muted); margin: 0 0 20px; font-size: 15px; line-height: 1.6; }

/* Setup Controls */
.setup-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
@media (max-width: 768px) { .setup-grid { grid-template-columns: 1fr; } }

.field-group { margin-bottom: 18px; }
.field-label { display: block; font-weight: 800; font-size: 14px; color: #475569; margin-bottom: 8px; }
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.chip {
  border: 1px solid var(--line); background: #fff;
  padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 14px;
  cursor: pointer; transition: all 0.15s;
}
.chip:hover { background: #EEF2FA; color: var(--navy); }
.chip.active { background: var(--navy); color: #fff; border-color: var(--navy); box-shadow: 0 4px 12px rgba(26,47,138,0.25); }

.text-input {
  width: 100%; border: 1px solid var(--line); border-radius: 12px;
  padding: 12px 14px; font-size: 15px; font-weight: 700; color: var(--ink);
}
.text-input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(26,47,138,0.1); }

.select-row { display: flex; gap: 12px; }
.select-row > div { flex: 1; }
.select-row select {
  width: 100%; border: 1px solid var(--line); border-radius: 12px;
  padding: 12px 14px; font-size: 14px; font-weight: 800; background: #fff;
  margin-top: 6px;
}

/* Action Buttons */
.btn {
  border: 0; border-radius: 14px; padding: 14px 22px; font-weight: 900; font-size: 16px;
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.15s; touch-action: manipulation;
}
.btn:active { transform: scale(0.98); }
.btn-primary { background: var(--navy); color: #fff; box-shadow: 0 8px 20px rgba(26,47,138,0.25); }
.btn-primary:hover { background: var(--navy2); }
.btn-secondary { background: #EEF2FA; color: var(--navy); }
.btn-secondary:hover { background: #E0E7F5; }
.btn-drive { background: #0F9D58; color: #fff; box-shadow: 0 8px 20px rgba(15,157,88,0.25); }
.btn-drive:hover { background: #0B8043; }
.btn-print { background: #334155; color: #fff; }
.btn-print:hover { background: #1E293B; }
.btn-danger { background: var(--red); color: #fff; }
.btn-ghost { background: transparent; border: 1px solid var(--line); color: var(--muted); }

/* Stage (Exam TV Mode) */
#stageView {
  display: none;
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: #F8FAFC; z-index: 1000;
  padding: 24px; flex-direction: column;
}
.stage-head {
  display: flex; justify-content: space-between; align-items: center;
  background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 14px 24px;
  margin-bottom: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.stage-title { font-size: 22px; font-weight: 900; color: var(--navy); display: flex; align-items: center; gap: 12px; }
.stage-badges { display: flex; gap: 10px; align-items: center; }
.badge { padding: 8px 14px; border-radius: 999px; font-size: 14px; font-weight: 900; background: #EEF2FA; color: var(--navy); }
.badge.timer { min-width: 65px; text-align: center; background: #FFF4E6; color: #B45309; font-size: 18px; }
.badge.timer.urgent { background: #FDE8E8; color: var(--red); animation: pulse 0.5s infinite alternate; }
@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.08); } }

.progressbar { height: 10px; background: #E2E8F0; border-radius: 999px; overflow: hidden; margin-bottom: 16px; }
.progressbar-bar { height: 100%; background: var(--navy); width: 100%; transition: width 1s linear; }

.stage-screen {
  flex: 1; min-height: 360px; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; background: #fff; border: 3px solid var(--navy);
  border-radius: 28px; box-shadow: 0 20px 60px rgba(26,47,138,0.12);
  padding: 36px 48px; margin-bottom: 16px;
}
.stage-qnum { font-size: 24px; font-weight: 900; color: var(--muted); margin-bottom: 16px; letter-spacing: 0.03em; }
.stage-prompt {
  font-size: clamp(32px, 5vw, 64px); font-weight: 900; color: #0F172A;
  line-height: 1.3; word-break: keep-all; overflow-wrap: anywhere;
  max-width: 100%; margin: 8px 0;
}
.stage-prompt.prep { font-size: clamp(52px, 9vw, 96px); color: var(--navy); }
.stage-help { font-size: 20px; color: var(--muted); font-weight: 700; margin-top: 24px; word-break: keep-all; }

.stage-controls {
  display: flex; justify-content: center; gap: 12px;
  background: #fff; border: 1px solid var(--line); border-radius: 18px;
  padding: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}

/* Result / Answer Sheet View */
#resultView { display: none; }
.result-header {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--navy); padding-bottom: 16px; margin-bottom: 20px;
}
.result-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
.answer-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.answer-table th, .answer-table td { border: 1px solid #CBD5E1; padding: 12px 14px; text-align: left; }
.answer-table th { background: #F1F5F9; color: #334155; font-size: 13px; font-weight: 800; text-align: center; }
.answer-table td.num { text-align: center; font-weight: 900; width: 50px; color: #64748B; }
.answer-table td.dir { text-align: center; font-size: 12px; font-weight: 800; width: 110px; color: #0284C7; white-space: nowrap; }
.answer-table td.q { font-weight: 800; font-size: 16px; color: var(--navy); line-height: 1.45; word-break: keep-all; }
.answer-table td.a { font-weight: 900; font-size: 16px; color: var(--red); line-height: 1.45; word-break: keep-all; }

.drive-alert {
  padding: 16px 20px; border-radius: 14px; background: #E8F6EE; color: #187044;
  border: 1px solid #B8E4C9; font-weight: 800; margin-bottom: 20px; display: none;
}
.drive-alert a { color: #0F9D58; font-weight: 900; text-decoration: underline; margin-left: 8px; }

/* Print Mode */
@media print {
  body { background: #fff !important; padding: 0 !important; color: #000 !important; }
  .topbar, .setup-grid, .stage-controls, .result-actions, #stageView, .no-print { display: none !important; }
  #resultView { display: block !important; padding: 0 !important; }
  .card { box-shadow: none !important; border: 0 !important; padding: 0 !important; }
  .answer-table th { background: #EEE !important; -webkit-print-color-adjust: exact; }
  .answer-table td.a { color: #B91C1C !important; }
}
</style>
</head>
<body>

<div class="shell no-print">
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">培材</div>
      <div>생활일본어 수행평가 2 (문화) · 교사용 송출기</div>
    </div>
    <div class="status-pill">☁️ 구글 드라이브 자동 저장 연결됨</div>
  </header>

  <div class="card" id="setupCard">
    <h2>2학기 2차 수행평가 실제시험 송출 (3·4·5단원 문화)</h2>
    <p class="desc">
      3·4·5단원 교과서 문화 파트 53개 문항에서 <b>고유 20문항</b>을 랜덤 추출합니다.<br>
      시험이 끝나면 <b>구글 드라이브 지정 폴더로 정답표가 즉시 자동 저장</b>됩니다.
    </p>

    <div class="setup-grid">
      <div>
        <div class="field-group">
          <label class="field-label">학급 선택 (또는 직접 입력)</label>
          <div class="chip-group" id="classChips">
            <button type="button" class="chip active" data-class="2학년 2반">2-2</button>
            <button type="button" class="chip" data-class="2학년 3반">2-3</button>
            <button type="button" class="chip" data-class="2학년 4반">2-4</button>
            <button type="button" class="chip" data-class="2학년 5반">2-5</button>
            <button type="button" class="chip" data-class="2학년 6반">2-6</button>
            <button type="button" class="chip" data-class="2학년 7반">2-7</button>
            <button type="button" class="chip" data-class="2학년 8반">2-8</button>
            <button type="button" class="chip" data-class="2학년 9반">2-9</button>
          </div>
          <input type="text" id="customClassInput" class="text-input" value="2학년 2반" placeholder="예: 2학년 3반 (2차시)">
        </div>

        <div class="field-group">
          <label class="field-label">회차 메모 (선택사항)</label>
          <input type="text" id="roundMemoInput" class="text-input" placeholder="예: 3교시 본시험 / 재응시 등">
        </div>

        <div class="field-group">
          <label class="field-label" for="teacherPinInput">교사용 드라이브 저장 암호</label>
          <input type="password" id="teacherPinInput" class="text-input" autocomplete="off" placeholder="구글 드라이브 자동 저장용 암호 입력">
        </div>
      </div>

      <div>
        <div class="field-group">
          <label class="field-label">시험 타이머 설정</label>
          <div class="select-row">
            <div>
              <span style="font-size:12px; color:var(--muted); font-weight:700;">시작 전 준비</span>
              <select id="prepTimeSelect">
                <option value="3">3초</option>
                <option value="5" selected>5초 (기본)</option>
                <option value="10">10초</option>
              </select>
            </div>
            <div>
              <span style="font-size:12px; color:var(--muted); font-weight:700;">문항당 표시 시간</span>
              <select id="qTimeSelect">
                <option value="8">8초</option>
                <option value="10" selected>10초 (기본)</option>
                <option value="12">12초</option>
                <option value="15">15초</option>
                <option value="20">20초</option>
              </select>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px;">
          <button type="button" id="startExamBtn" class="btn btn-primary" style="width: 100%; font-size: 18px; padding: 18px;">
            🚀 실제시험 시작 (교실 TV 송출)
          </button>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
            <a class="btn btn-ghost" href="./notice.pdf" target="_blank" rel="noopener" style="flex:1; font-size:13px; padding:10px 12px; text-decoration:none;">📢 학급 안내문 PDF</a>
            <a class="btn btn-ghost" href="./answer_sheet.html" target="_blank" rel="noopener" style="flex:1; font-size:13px; padding:10px 12px; text-decoration:none;">📝 20칸 답안지</a>
            <a class="btn btn-ghost" href="./study_guide.pdf" target="_blank" rel="noopener" style="flex:1; font-size:13px; padding:10px 12px; text-decoration:none;">📖 학습지 PDF</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Stage View (Exam TV Fullscreen) -->
<div id="stageView">
  <div class="stage-head">
    <div class="stage-title">
      <span class="brand-mark" style="width:32px; height:32px; font-size:13px;">培材</span>
      <span id="stageClassBadge">2학년 2반</span>
      <span style="color:var(--muted); font-size:16px;">생활일본어 수행평가 2 (문화)</span>
    </div>
    <div class="stage-badges">
      <div id="stageDirBadge" class="badge">준비</div>
      <div id="stageCounterBadge" class="badge">0 / 20</div>
      <div id="stageTimerBadge" class="badge timer">5</div>
    </div>
  </div>

  <div class="progressbar">
    <div id="timeProgressBar" class="progressbar-bar"></div>
  </div>

  <div class="stage-screen" id="stageScreen">
    <div id="stageQNum" class="stage-qnum">생활일본어 문화 수행평가 · 준비</div>
    <div id="stagePrompt" class="stage-prompt prep">준비</div>
    <div id="stageHelp" class="stage-help">답안지를 준비하세요. 곧 시험이 시작됩니다.</div>
  </div>

  <div class="stage-controls">
    <button type="button" id="prevBtn" class="btn btn-secondary">← 이전 문항</button>
    <button type="button" id="pauseBtn" class="btn btn-primary">일시정지 (Space)</button>
    <button type="button" id="nextBtn" class="btn btn-secondary">다음 문항 →</button>
    <button type="button" id="abortBtn" class="btn btn-danger">시험 중단</button>
  </div>
</div>

<!-- Result & Archiving View -->
<div class="shell" id="resultView">
  <div class="card">
    <div class="result-header">
      <div>
        <h2>2026학년도 2학기 생활일본어 수행평가 2 (문화) 정답표</h2>
        <div style="color:var(--muted); font-size:14px; margin-top:4px;">
          배재중학교 2학년 · 시행일시: <span id="resDate"></span>
        </div>
      </div>
      <div class="badge" id="resClassBadge" style="font-size:18px; padding:8px 16px;">2학년 2반</div>
    </div>

    <div id="driveAlert" class="drive-alert">
      <span id="driveAlertText"><b>✅ 선생님 학교 구글 드라이브에 자동 저장되었습니다!</b></span>
      <a id="driveFileLink" href="#" target="_blank" rel="noopener noreferrer">📄 드라이브에서 열기</a>
    </div>

    <div class="result-actions no-print">
      <button type="button" id="saveDriveBtn" class="btn btn-drive">
        ☁️ 구글 드라이브에 저장
      </button>
      <button type="button" id="downloadHtmlBtn" class="btn btn-secondary">
        💾 PC에 파일 다운로드
      </button>
      <button type="button" id="printResultBtn" class="btn btn-print">
        🖨️ 정답표 인쇄 / PDF 저장
      </button>
      <button type="button" id="newExamBtn" class="btn btn-ghost" style="margin-left:auto;">
        🔄 다른 반 시험 시작
      </button>
    </div>

    <table class="answer-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>단원(쪽)</th>
          <th>시험 문제</th>
          <th>정답</th>
        </tr>
      </thead>
      <tbody id="answerTbody"></tbody>
    </table>
  </div>
</div>

<script>
const UNITS = ${JSON.stringify(questions)};
const SAVE_API_URL = '/api/save';
const PIN_SESSION_KEY = 'jtest_teacher_pin';

let currentClass = '2학년 2반';
let roundMemo = '';
let prepTime = 5;
let qTime = 10;
let examQuestions = [];
let examIndex = 0;
let isPreparing = true;
let isPaused = false;
let secondsLeft = 5;
let timerInterval = null;

const $ = id => document.getElementById(id);

function secureRandomInt(max) {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const a = new Uint32Array(1);
    do c.getRandomValues(a); while (a[0] >= limit);
    return a[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function secureShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateExamSet() {
  const chosen = secureShuffle(UNITS).slice(0, 20);
  return chosen.map((u, i) => ({
    number: i + 1,
    direction: u.source,
    prompt: u.q,
    answer: u.a,
    id: u.id
  }));
}

function fitStagePrompt() {
  const box = $('stageScreen');
  const el = $('stagePrompt');
  const qnum = $('stageQNum');
  const help = $('stageHelp');
  if (!box || !el || $('stageView').style.display !== 'flex') return;
  if (isPreparing) {
    el.style.fontSize = '';
    return;
  }
  const style = getComputedStyle(box);
  const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const availW = box.clientWidth - padX - 16;
  const overheadH = (qnum?.offsetHeight || 0) + (help?.offsetHeight || 0) + 56;
  const availH = box.clientHeight - padY - overheadH;
  if (availW <= 0 || availH <= 0) return;

  el.style.maxWidth = availW + 'px';
  const minPx = 24;
  const maxPx = Math.min(64, Math.max(32, Math.floor(window.innerWidth * 0.05)));
  let lo = minPx, hi = maxPx, best = minPx;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    el.style.fontSize = mid + 'px';
    if (el.scrollWidth <= availW && el.scrollHeight <= availH) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  el.style.fontSize = best + 'px';
}

window.addEventListener('resize', () => {
  if ($('stageView').style.display === 'flex') fitStagePrompt();
});

document.querySelectorAll('#classChips .chip').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('#classChips .chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentClass = btn.dataset.class;
    $('customClassInput').value = currentClass;
  };
});

$('customClassInput').oninput = e => {
  currentClass = e.target.value.trim() || '2학년 2반';
};

$('startExamBtn').onclick = () => {
  currentClass = $('customClassInput').value.trim() || '2학년 2반';
  roundMemo = $('roundMemoInput').value.trim();
  prepTime = parseInt($('prepTimeSelect').value, 10);
  qTime = parseInt($('qTimeSelect').value, 10);

  examQuestions = generateExamSet();
  examIndex = 0;
  isPreparing = true;
  isPaused = false;
  secondsLeft = prepTime;

  $('stageClassBadge').textContent = currentClass;
  $('stageView').style.display = 'flex';
  $('resultView').style.display = 'none';
  $('driveAlert').style.display = 'none';
  $('saveDriveBtn').disabled = false;
  $('saveDriveBtn').textContent = '☁️ 구글 드라이브에 저장';
  $('pauseBtn').textContent = '일시정지 (Space)';

  renderStage();
  startTimer();
};

function renderStage() {
  const timerBadge = $('stageTimerBadge');
  const bar = $('timeProgressBar');

  timerBadge.textContent = secondsLeft;
  timerBadge.classList.toggle('urgent', !isPreparing && secondsLeft <= 3);

  const totalSec = isPreparing ? prepTime : qTime;
  bar.style.width = \`\${Math.max(0, (secondsLeft / totalSec) * 100)}%\`;

  if (isPreparing) {
    $('stageDirBadge').textContent = '준비';
    $('stageCounterBadge').textContent = '준비';
    $('stageQNum').textContent = '생활일본어 문화 수행평가 · 준비';
    $('stagePrompt').textContent = '준비';
    $('stagePrompt').className = 'stage-prompt prep';
    $('stagePrompt').style.fontSize = '';
    $('stageHelp').innerHTML = \`답안지를 준비하세요.<br><b>\${secondsLeft}초</b> 뒤 1번 문항이 자동으로 시작됩니다.\`;
    return;
  }

  const q = examQuestions[examIndex];
  $('stageDirBadge').textContent = q.direction;
  $('stageCounterBadge').textContent = \`\${q.number} / 20\`;
  $('stageQNum').textContent = \`제 \${q.number} 번 (\${q.direction})\`;
  $('stagePrompt').textContent = q.prompt;
  $('stagePrompt').className = 'stage-prompt';
  $('stageHelp').textContent = '질문에 알맞은 정답을 우리말로 답안지에 쓰세요.';
  requestAnimationFrame(fitStagePrompt);
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    if (isPaused) return;
    secondsLeft--;
    if (secondsLeft <= 0) {
      if (isPreparing) {
        isPreparing = false;
        secondsLeft = qTime;
        renderStage();
      } else {
        nextQuestion();
      }
    } else {
      renderStage();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function nextQuestion() {
  if (isPreparing) return;
  if (examIndex < 19) {
    examIndex++;
    secondsLeft = qTime;
    renderStage();
  } else {
    finishExam();
  }
}

function prevQuestion() {
  if (isPreparing || examIndex <= 0) return;
  examIndex--;
  secondsLeft = qTime;
  renderStage();
}

function finishExam() {
  stopTimer();
  $('stageView').style.display = 'none';
  $('resultView').style.display = 'block';
  renderResult();
  autoSaveToDrive();
}

$('nextBtn').onclick = nextQuestion;
$('prevBtn').onclick = prevQuestion;
$('pauseBtn').onclick = () => {
  if (isPreparing) return;
  isPaused = !isPaused;
  $('pauseBtn').textContent = isPaused ? '계속 진행 (Space)' : '일시정지 (Space)';
};
$('abortBtn').onclick = () => {
  if (confirm('시험을 중단하시겠습니까?')) {
    stopTimer();
    $('stageView').style.display = 'none';
  }
};

document.addEventListener('keydown', e => {
  if ($('stageView').style.display !== 'flex') return;
  if (e.code === 'Space') {
    e.preventDefault();
    $('pauseBtn').click();
  } else if (e.key === 'ArrowRight') {
    nextQuestion();
  } else if (e.key === 'ArrowLeft') {
    prevQuestion();
  }
});

function renderResult() {
  const now = new Date();
  const dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0');

  $('resDate').textContent = dateStr;
  $('resClassBadge').textContent = currentClass + (roundMemo ? \` (\${roundMemo})\` : '');

  const tbody = $('answerTbody');
  tbody.innerHTML = examQuestions.map(q => \`
    <tr>
      <td class="num">\${q.number}</td>
      <td class="dir">\${escapeHtml(q.direction)}</td>
      <td class="q">\${escapeHtml(q.prompt)}</td>
      <td class="a">\${escapeHtml(q.answer)}</td>
    </tr>
  \`).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

async function autoSaveToDrive() {
  const btn = $('saveDriveBtn');
  btn.disabled = true;
  btn.textContent = '☁️ 구글 드라이브 저장 중...';

  let pin = ($('teacherPinInput')?.value || '').trim();
  if (!pin) {
    try {
      pin = (sessionStorage.getItem(PIN_SESSION_KEY) || '').trim();
    } catch (_) {}
  }
  if (!pin) {
    const prompted = window.prompt('구글 드라이브 저장을 위해 교사용 저장 암호를 입력해 주세요:');
    pin = prompted ? prompted.trim() : '';
    if (pin && $('teacherPinInput')) {
      $('teacherPinInput').value = pin;
    }
  }
  if (!pin) {
    btn.disabled = false;
    btn.textContent = '☁️ 구글 드라이브에 저장';
    alert('교사용 저장 암호가 입력되지 않아 구글 드라이브 자동 저장을 건너뛰었습니다.\\n암호를 입력한 뒤 [구글 드라이브에 저장] 버튼을 누르거나 [PC에 파일 다운로드]를 이용해 주세요.');
    return;
  }

  try {
    const payload = {
      className: currentClass,
      roundName: roundMemo ? \`[2차_문화] \${roundMemo}\` : '2학기 2차 문화',
      questions: examQuestions,
      timestamp: new Date().toISOString(),
      teacherPin: pin
    };

    const res = await fetch(SAVE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      try {
        sessionStorage.setItem(PIN_SESSION_KEY, pin);
      } catch (_) {}
      btn.textContent = '✅ 구글 드라이브 저장 완료';
      const alertBox = $('driveAlert');
      const alertText = $('driveAlertText');
      const linkEl = $('driveFileLink');
      if (alertText) {
        alertText.textContent = '';
        const b = document.createElement('b');
        b.textContent = data.fileName
          ? \`✅ 선생님 학교 구글 드라이브에 자동 저장되었습니다! (\${data.fileName})\`
          : '✅ 선생님 학교 구글 드라이브에 자동 저장되었습니다!';
        alertText.appendChild(b);
      }
      if (linkEl) {
        if (data.fileUrl) {
          linkEl.href = data.fileUrl;
          linkEl.style.display = 'inline';
        } else {
          linkEl.style.display = 'none';
        }
      }
      if (alertBox) alertBox.style.display = 'block';
    } else {
      if (res.status === 401) {
        try {
          sessionStorage.removeItem(PIN_SESSION_KEY);
        } catch (_) {}
        if ($('teacherPinInput')) $('teacherPinInput').value = '';
      }
      throw new Error(data.error || '저장 실패');
    }
  } catch (err) {
    console.error('Drive save error:', err);
    btn.disabled = false;
    btn.textContent = '⚠️ 드라이브 재시도 (클릭)';
    alert('구글 드라이브 저장 중 오류가 발생했습니다: ' + (err.message || '일시적 오류') + '\\n하단의 [PC에 파일 다운로드]로 백업해 두시거나 암호 확인 후 [구글 드라이브에 저장] 버튼을 다시 눌러주세요.');
  }
}

$('saveDriveBtn').onclick = autoSaveToDrive;

$('downloadHtmlBtn').onclick = () => {
  const htmlContent = document.documentElement.outerHTML;
  const now = new Date();
  const dateStr = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

  const fileName = \`[\${currentClass}]_생활일본어_수행2_문화_정답표_\${dateStr}.html\`;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

$('printResultBtn').onclick = () => window.print();

$('newExamBtn').onclick = () => {
  $('resultView').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'teacher.html'), teacherHtml, 'utf8');
console.log('Written teacher.html, length:', teacherHtml.length);
