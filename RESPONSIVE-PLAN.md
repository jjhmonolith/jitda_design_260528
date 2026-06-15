# 짓다 UI — 반응형(데스크탑 유동) 대응 작업계획

> 작성 2026-06-15 · 기준 캔버스 `viewer.html` / `Jitda Renewal.html` (61개 화면 상태)
> 근거: 7개 영역(A·B·C·D·E·F·공용) 라인레벨 감사 + 하니스 분석. 모든 이슈는 `file:line` 인용.

---

## 0. 결정사항 (확정 — override 금지)

| 항목 | 결정 | 함의 |
|------|------|------|
| **대응 범위** | **데스크탑 유동폭만 (≥1024)** | 폰/태블릿 전용 레이아웃 **제외**. 1024~ultrawide 창 크기·비율 변화에 reflow |
| **구현 방식** | **진짜 리플로우** (유동 + 소수 데스크탑 브레이크포인트) | `transform:scale` 아님. 콘텐츠가 실제 재배치 |
| **산출물** | **둘 다** | (a) 프로토타입(viewer/Renewal/JSX/tokens.css) 반응형화 + (b) `화면상태정의서.md:538` 부록을 데스크탑 유동 스펙으로 정식화 |

### 근본 원인 (한 줄)
모든 화면이 `viewer.html`의 **고정 `width:1280 height:820/920` 박스**에 렌더되고 `tokens.css`에 **뷰포트 미디어쿼리가 0개**(prefers-reduced-motion만). 내부는 flex 중심이라 절반은 이미 유동이지만, **고정폭 패널·고정 grid 트랙·820/920 고정높이**가 핀.

### "완료" 기준 (Acceptance)
- viewer에서 창을 **1024 / 1280 / 1440 / 1920** 으로 줄였을 때 각 화면이 깨짐 없이 reflow.
- **짧은 창**(세로 축소)에서 콘텐츠가 **클립 대신 내부 스크롤**.
- ultrawide에서 콘텐츠가 무한 신장하지 않고 **max-content 캡**으로 중앙 정렬.
- 콘솔 에러 0 (favicon 제외). Playwright 다폭 스크린샷 회귀 없음.

---

## Phase 0 — 하니스 키스톤 ✅ (2026-06-15 완료·검증)

`viewer.html`의 art-frame을 고정폭 → **데스크탑 유동폭**으로 전환. **이게 안 되면 로컬호스트에서 반응형 확인 자체가 불가**했음(창을 줄여도 1280 박스 고정).

- `viewer.html` art-frame CSS: `width: min(100%, var(--frame-w,1280px))` + `min-width: min(1024px, var(--frame-w))` + `height: var(--frame-h)` + `container-type: inline-size; container-name: artframe`.
- `viewer.html` render(): `style={{width,height}}` → `style={{'--frame-w','--frame-h'}}` (화면별 설계 치수를 캡으로 전달).
- 검증: d1 갤러리 1440(1280캡)/1100(유동) reflow 확인, b2-started 대시보드 container-type 하 정상 렌더(sticky 헤더 OK), 콘솔 에러 0.
- **남은 것**: 높이/aspect 내부 스크롤화는 회귀 방지 위해 영역별 후속(현재는 설계높이 유지). `Jitda Renewal.html`의 DCArtboard(고정 캔버스 프레임)는 디자인 오버뷰 성격이라 별도 판단(아래 §횡단).

---

## Phase 1 — 토큰·유틸 인프라 (선행 차단요인)

`tokens.css`에 **데스크탑 브레이크포인트 변수 + 공용 유동 유틸**을 신설. 현재 뷰포트 미디어쿼리 0개라 이게 모든 영역의 표준 기반이 됨. **반드시 영역 작업 전에.**

```
--bp-narrow: 1180px;     /* 칸반/2단 강등 임계 (B·F 공용) */
--bp-wide:   1680px;     /* ultrawide 캡 발동 */
--content-max: 1440px;   /* 대시보드/목록/summary 컨테이너 캡 */
--jt-page-gutter: clamp(20px, 4vw, 48px);
```
유틸 클래스(전 영역 ROI 최대):
- `.jt-truncate` — `flex:1; min-width:0; nowrap; ellipsis` (ProjectCard·RosterMemberRow·SafariChrome 반복 어휘 추출)
- `.jt-card-grid` — `grid-template-columns: repeat(auto-fill, minmax(var(--card-min,240px),1fr))` (operator의 `repeat(N,1fr)` 고정 트랙 대체)
- `.jt-shell-max` — `max-width: var(--content-max); margin-inline:auto` (ultrawide 캡)
- `.jt-scroll-y` — `min-height:0; overflow-y:auto` (짧은 창 내부 스크롤 표준)
- `.jt-side-rail` / `--dock` — 기본 `flex:0 1 var(--rail-w)` + bp 이하 `width:100%` 도크 (2패널 영역 공용)

> ⚠ tokens.css 편집 후 `viewer.html`·`Jitda Renewal.html`의 `?v=` bump 필수(브라우저 캐시). `_serve.py`(no-store)로 검증.
> @media vs @container: 프레임 폭 ≠ 뷰포트(스테이지 패딩·Renewal 줌)이므로 **화면 내부 분기는 `@container artframe (max-width:…)`** 권장(Phase 0에서 컨테이너 컨텍스트 이미 수립). 전역 토글은 @media 허용.

---

## Phase 2 — 공용 컴포넌트 (`shared.jsx`) · 위험도 low·레버리지 최대

| 작업 | 위치 | 효과 |
|------|------|------|
| **ModalSurface 유동화** (M) | `shared.jsx:1202,1206,1211` | `width:W`(480~920 고정)에 `maxWidth:min(W, 92vw)` + `maxHeight:min(640px,88vh)` + 본문 `overflow:auto`. **dialogs·operator·judging 수십개 모달 일괄 해결** |
| overflow:hidden→내부 스크롤 3곳 (각 S) | BrowserChrome `:529`, ModalSurface `:1211`, PhoneFrame `:551` | 짧은 창 클립 방지 |
| AppHeader 마감 (S) | `:600` padding clamp, `:636` email truncate | narrow에서 breadcrumb 충돌 해소 |
| SpecNote 반응형 숨김 (S) | `:651-653` 절대좌표 | `.jt-fluid .jt-spec-note{display:none}` |

> 마스코트/로고/StatusPill/Pagination/Roster/ProjectCard 본체는 **무변경**(이미 유동, size-prop SVG·flex). 오탐 주의.

---

## Phase 3 — 파일럿: A 인증 (`auth.jsx`) · 위험도 low·effort S

**왜 파일럿**: 9개 화면이 **단일 `AuthShell`(auth.jsx:8)** 통과 + 카드가 이미 `width:100% maxWidth:440` + **`tabletMode` 단일컬럼 분기가 이미 구현됐으나 미배선**. "새 레이아웃"이 아니라 "기존 코드 켜기". 깨끗한 reflow를 빠르게 시연.

- `AuthShell` grid(`:15`) `minmax(360px,.9fr) 1.1fr` → `clamp(320px,36%,480px) minmax(0,1fr)`.
- 우 `<section>`(`:127`) → `min-height:100%; overflow-y:auto` 스크롤 리전 (a4 signup·a2-popup 클립 해소 — **영역 최우선**).
- children wrapper(`:141`)에 `max-width:720` 캡 (ultrawide 카드 부유 방지).
- `~960px`에서 `tabletMode=true` 배선(@container) → 좌 레일 숨김·카드 중앙.
- ⚠ 좌 레일 `flex:1` 스페이서(`:32/75/91/121`)가 820 고정높이 가정 → `justify-content:center`로 교체.

---

## Phase 4+ — 영역별 롤아웃 (위험도 × 사용자 가치 순)

### D 갤러리 (`gallery.jsx`) · M · 단일 핫스팟
- **핵심 1곳**: D2 본문 2패널 `grid '1fr 400px'`(`:595`) → flex `main flex:1 minWidth:0` + `aside flex:0 1 clamp(340px,30%,460px) minWidth:340`. → **d2 9개 상태 일괄 해결**.
- D1 목록: 이미 `auto-fill minmax(260px,1fr)`(`:507`) — `.jt-shell-max` 캡 + gutter clamp만(S). 스켈레톤 고정바(`:450/455`) `min()` 처리.
- 툴바 제목 `maxWidth:280`(`:560`) → `flex:1 minWidth:0`.

### E 다이얼로그 (`dialogs.jsx`) · M (e4 ring L)
- e1·e1-unsaved·e5(각 S): 폭 토큰화(`560/480` 생짜 → `--modal-w-*` + `calc(100vw-48px)`), `maxHeight:'88%'`(프레임%) → `min(88vh, calc(100%-48px))`.
- **e4 거대 ring (L)**: `MatchAcceptRing`(`:484`)이 `size=480` px 상수로 cx/cy/r/stripe 전부 계산 + viewBox px → `clamp(280px,56vmin,480px) aspect-ratio:1` 컨테이너 + SVG 100%로 재설계. 오버레이 `overflow:auto` + 내부 `min-height:100%` 센터. **voting/waiting/rejected 6화면을 한 컴포넌트로 커버**. absolute CTA(`bottom:16`) 위치 재연동 — **시각 회귀 테스트 필수**.

### F 심사 (`judging.jsx`) · L · 표 중심
- **B3ResultsTally 점수행렬 (L·최대 난제)**: `:878/882` 심사위원 **2열 하드코딩**인데 카피·데이터는 "5인" → `repeat(var(--judge-n), minmax(44px,56px))` + 표를 `overflow-x:auto` 래퍼 + 팀명 컬럼 `position:sticky left:0`.
- **F1JudgeDashboard (L)**: 좌256+우376 고정 레일(`:90/179`) → `--bp-judge-3col(~1180)`에서 우 루브릭 레일 하단 도크/접이, 중앙 라이브앱 가독폭(≥560) 확보.
- B3RubricSettings(M): `:664` `'300px 1fr 280px'` → minmax + bp 스택. F2 포디움(M): `:498` 카드 `220/184`→clamp, `:456` `justify:center`→`flex-start`(상단 클립 버그), 특별상 `repeat(4,1fr)`→`auto-fit minmax(150px,1fr)`.
- f1-rubric·c5-submit·c-result(각 S): 이미 센터컬럼+overflow:auto. maxWidth clamp만.

### C 참가자 (`participant.jsx`) · M · OpenCodeShell 키스톤
- **OpenCodeShell (M·70% 가치)**: 좌 대화 컬럼 `flex:'0 0 '+colW+'px'`(`:637`, 460 고정)이 리사이즈 시 **재클램프 안 됨**, 360 프리뷰 하한이 **드래그 때만** 적용 → 창 좁히면 우 OcBrowser가 `overflow:hidden`(`:633`)에 클립. → 좌 컬럼 `clamp(340,38%,760)` 유동 + OcBrowser CSS `min-width:360` + 리사이즈 effect(`:586-592`)에서 colW 재클램프. **c2/c3/c3-generating/c4 = 9개 변형 일괄**. ⚠ 드래그 상태(useState colW)와 충돌 주의 — 영역 최고 위험 편집.
- C1TeamRoomV2 (M·별도): `'3fr 2fr'`(`:320`) `~1100` 단일컬럼 폴백, 포스트잇 `width:440`(`:162`)→`min(440,100%)`, 카드 max-height(footer/legend 이탈 방지), main `alignItems:center`→짧은창 `start`.

### B 운영자 (`operator.jsx`) · L · 칸반 (가장 복잡 3553줄)
- **b2-started ActivityKanban (L)**: `repeat(5,1fr)` span 비대칭(토큰1:손든2:정체2, `:1577`) + sub-grid columnGap + 카드폭 정렬 가정(`:1834`) + perPage/카드 height:66이 1280에 정밀 튜닝. → `repeat(5,minmax(0,1fr))` + `~1180`에서 zone sub cols 2→1 강등 + perPage **cols 기준 동적 재계산** + 카드 `height:66`→`min-height`.
- **b2-tutorial-running TutorialKanban (L)**: 5단계 의미 순서 고정(병합 불가) → `minmax(0,1fr)` + narrow에서 칸반 `overflow-x:auto`(컬럼 min 190) 또는 아바타 노출 5→3.
- b2-dashboards 셸(M): sticky 헤더 `height:52`(`:534`)→`min-height`, 제목 truncate, runtime 메타 narrow 숨김 — **5상태 공유, 한 번에**.
- b1(S): `repeat(3,1fr)`(`:64`)→`.jt-card-grid` auto-fill(RosterGrid `:2905` 패턴 횡전개). b2-ended summary(M): 2단(`:2245`) narrow 1열 스택, KPI auto-fit. 모달 9종(S): ModalSurface 가드로 자동.

---

## 횡단 관심사

- **높이/aspect**: 모든 영역이 art-frame 820/920에 height:100%로 핀. 대시보드/갤러리/심사 셸·모달은 **이미 내부 overflow:auto 보유** → Phase 0의 frame-h를 후속에서 `min-height + max-height:100%`로 풀면 다수 자동. **내부 스크롤 없는 화면**(일부 auth/dialogs)만 개별 스크롤 리전 추가.
- **ModalSurface**(Phase 2)가 전 모달 height/width 캡의 단일 해결점.
- **절대배치 오버레이**: 마스코트·팝오버·TutorialPostit은 relative 부모 기준이라 안전. SpecNote만 1280×820 좌표 가정 → 반응형 모드 `display:none`.
- **ultrawide 캡**: `.jt-shell-max`로 목록/summary/센터폼. 앱 셸(대시보드·F1·OpenCode)은 풀폭 정상.
- **Renewal.html 캔버스**: DCArtboard는 줌/팬 디자인 오버뷰라 **고정 프레임 유지가 정상**. 옵션으로 대표 폭 변형(1024/1280/1440) 추가 검토. viewer가 1차 반응형 검증 surface.
- **comment-pin 레이어**: `__viewerComments.syncForScreen`이 프레임 기준 좌표 계산 → 프레임 유동화 후 핀 정합 재검증 필요(코멘트 도구 한정, 코어 무관).

---

## 스펙 정식화 (산출물=둘 다)

`화면상태정의서.md:538` "부록: 반응형 브레이크포인트"를 **데스크탑 유동 실구현 기준**으로 갱신:
- 데스크탑 브레이크포인트 세트(`--bp-narrow 1180`, `--bp-wide 1680`, `--content-max 1440`) 명문화.
- 영역별 reflow 규칙 표(2패널 도크, 칸반 강등, 점수행렬 가로스크롤, 모달 vw/vh 캡) 기록.
- 기존 모바일(<1024) 행은 "범위 외(향후)"로 명시 구분.

---

## 검증 전략

- `_serve.py`(no-store) + Playwright: 각 화면을 **1024·1280·1440·1920 폭 × 짧은높이(720)** 로 스크린샷, reflow/클립/콘솔에러 확인.
- 영역별 exit: 핵심 화면 무클립 reflow + 콘솔 0 + 시각 회귀 없음. e4 ring·칸반은 시각 회귀 특별 점검.
- 각 영역 완료 시 `STRUCTURE.md`/`spec-updates.md` 변경 이력 1줄.

---

## 공수 합산 & 임계경로

| Phase | 영역 | 공수 |
|-------|------|------|
| 0 | 하니스 키스톤 | ✅ 완료 |
| 1 | 토큰·유틸 | S (~0.5d) |
| 2 | shared (ModalSurface 등) | S~M (~1~1.5d) |
| 3 | A 인증 파일럿 | S (~0.5d) |
| 4 | D 갤러리 | M (~1d) |
| 4 | E 다이얼로그 | M (e4 ring L 포함) |
| 4 | F 심사 | L (점수행렬·F1) |
| 4 | C 참가자 | M (OpenCodeShell) |
| 4 | B 운영자 | L (칸반 2종) |

**임계경로**: Phase 1·2(토큰·ModalSurface) → 나머지 전 영역이 의존. **총 ~2~3주** (B·F 칸반/표가 60% 비중).

---

## 리스크 & 실패 시나리오 (Critical Analysis)

1. **`@container` 지원/렌더**: babel-standalone + 브라우저에서 container query 미지원 시 분기 무효 → 대안 `@media` + 프레임폭≈뷰포트 보정. **(Phase 1 첫 화면에서 즉시 검증 필요.)**
2. **칸반 정보밀도 ≥1280 의존**: b2-started 5열×span은 1280에 정밀 튜닝 — narrow에서 카드 ~95px 붕괴. 단순 fr 변환 불가, **zone 강등 전략 + 디자인 합의** 없으면 1024 랩탑에서 사실상 깨짐. 이 화면은 "유동 불가, 가로스크롤 허용"이 정답일 수 있음 — **사용자 결정 필요**.
3. **점수행렬 N 가변**: 2열 하드코딩 vs "5인" 카피 모순 — 진짜 N명은 reflow 본질이 표라 회피 불가(가로스크롤+sticky).
4. **OpenCodeShell 드래그 상태**: 유동화가 imperative 드래그/리사이즈 effect와 충돌 위험 — 최고 위험 편집, 리사이즈 재클램프 누락 시 여전히 클립.
5. **카드높이 통일 디자인 의도**: `height:66`→`min-height` 전환 시 zone 간 통일성 흔들림 — 디자인 합의 필요.

---

## 열린 질문 (구현 전 결정)

- **b2-started 칸반**: 좁은 데스크탑에서 (a) zone 강등 reflow vs (b) 가로스크롤 허용 — 어느 쪽?
- **점수행렬 심사위원 수**: 실제 최대 N? (열 폭/가로스크롤 임계 결정)
- **Renewal.html 캔버스**: 고정 유지 vs 대표 폭 변형 추가?
- **높이/aspect 적극성**: 모든 화면 내부 스크롤화(적극) vs 표준 높이 유지+긴 화면만(보수)?
