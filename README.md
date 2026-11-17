# japanese-test-v4 — 배재중학교 수행평가 플랫폼 표준 템플릿

2026학년도 2학기 2차 생활일본어 수행평가(3·4·5단원 문화 53문항) 웹앱·인쇄물·보안 백엔드 패키지이자, 향후 수행평가 자료 및 플랫폼 제작의 공식 기준(Baseline SSOT)입니다.

- **운영 URL**: https://japanese-test-v4.vercel.app
- **교사용 송출기**: https://japanese-test-v4.vercel.app/teacher
- **저장소**: https://github.com/animal0000/japanese-test-v4

## 디렉터리 구성

| 경로 | 역할 | 배포 포함 여부 |
| --- | --- | --- |
| `index.html` | 학생 대비 포털 (`study_guide.pdf` base64 인라인 내장) | 포함 |
| `teacher.html` | 교실 TV 송출기 (학급 선택·타이머·정답표·`/api/save` 연동) | 포함 |
| `api/save.js` | Vercel 서버리스 프록시 (`JTEST_TEACHER_PIN` 검증 + `JTEST_SHARED_TOKEN` 주입) | 포함 |
| `study_sheet.html` / `study_guide.pdf` | A4 2쪽 학생용 문화 학습지 | 포함 |
| `answer_sheet.html` / `answer_sheet.pdf` | A4 1쪽 20칸 답안지 | 포함 |
| `notice.html` / `notice.pdf` / `생활일본어_2학기2차_수행평가안내문.pdf` | A4 1쪽 학급 게시용 초대형 QR(`86mm`) 안내문 | 포함 |
| `vercel.json` | `cleanUrls: true` 및 `/teacher`, `/answer-sheet`, `/study-sheet`, `/notice` 라우팅 | 포함 |
| `data/questions.json` | 문항 SSOT (`CU001`~`CU053`) | `.vercelignore` 제외 |
| `scripts/` | 정적 HTML/PDF/안내문 생성 및 환경변수 동기화 스크립트 | `.vercelignore` 제외 |

## 보안 및 환경변수 구조

- **필수 Vercel 환경변수** (`Production`, `Preview`, `Development` 모두 `encrypted`/`sensitive` 권장):
  - `JTEST_GAS_URL`: Google Apps Script 웹앱 실행 URL
  - `JTEST_SHARED_TOKEN`: GAS 웹앱 공유 검증 토큰 (24자 이상)
  - `JTEST_TEACHER_PIN`: 교사가 `/teacher`에서 입력하는 저장 암호 (SHA-256 `timingSafeEqual` 비교)
- **브라우저→GAS 직접 호출 금지**: 모든 저장 요청은 동일 출처 `/api/save`를 거치며, IP당 5분 15회 제한(`RATE_LIMIT_MAX_REQUESTS = 15`)이 적용됩니다.
- **PIN 변경 원칙**: AI 채팅창에 새 암호를 평문으로 입력하지 말고 Vercel Dashboard(`Settings → Environment Variables`)에서 직접 수정한 뒤 `npx vercel redeploy`로 반영합니다.

## 재생성 순서 (문항·디자인 수정 시)

1. `data/questions.json` 수정
2. 학습지·답안지 PDF 렌더링:
   ```powershell
   node scripts/generate_sheets.mjs
   ```
3. 학생·교사용 포털 HTML 빌드 (`study_guide.pdf` 인라인 재임베드 포함):
   ```powershell
   node scripts/build_app.mjs
   ```
4. (실서비스 화면 변경 후 안내문 갱신 시) 모바일 4컷 캡처 → 안내문 PDF/HTML 재생성:
   ```powershell
   node scripts/capture_notice_frames.js
   node scripts/build_notice.js
   ```
5. `vercel.json` 규칙 주의: `cleanUrls: true` 환경에서는 `rewrites[].destination`에 `.html` 확장자를 붙이지 않습니다.
