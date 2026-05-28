# 기획 문서 업데이트 정리 — D. 갤러리 영역 (2026-05-26)

> Hi-fi 디자인 작업 중 기획 문서와 어긋난 결정·신규 결정 사항을 문서별로 정리.
> 짓다 디자인 리뉴얼 D 영역(갤러리) 검토 결과.

---

## 2026-05-27 모달 z-index 정책 — `.jt-modal-backdrop`에서 `z-index` 제거 (DOM 순서 stacking)

**계기**: E-1 다이얼로그(`e1-private`·`e1-saving`)에서 모달 카드 자체가 dim scrim 아래에 깔려 어둡게 보이는 시각 버그. E-5·E-6 동일 패턴.

**원인**: `tokens.css`/`viewer.html`/`Jitda Renewal.html`의 `.jt-modal-backdrop`에 `z-index: var(--z-overlay)` (=50) 가 부여돼 있었는데, 다이얼로그 카드들(`dialogs.jsx`의 E-1·E-5 dialog 및 E-6 paused body)은 z-index를 명시하지 않아 backdrop이 상위 stacking으로 올라옴 → 모달 카드 전체가 `rgba(20,19,15,0.40)` scrim 아래로 들어감.

**변경**:
- `tokens.css` `.jt-modal-backdrop`에서 `z-index: var(--z-overlay)` 제거. (`.jt-modal-surface`의 `z-index: var(--z-modal)`은 그대로 — surface 클래스를 직접 쓰는 코드 패턴 유지용.)
- `viewer.html`·`Jitda Renewal.html` 인라인 `.jt-modal-backdrop` 정의에서 동일 `z-index` 제거 (이후 사용자/린터가 인라인 modal-backdrop 블록 자체를 tokens.css 단일 소스로 통합).
- `dialogs.jsx`의 `E4VotingBody`·`E4WaitingBody`·`E4FailureBody`에 남아있던 잔재 `zIndex: 51` 3곳 제거 — backdrop이 z-index를 잃었으니 51 명시는 의미 없음.

**stacking 원칙 (이후)**: backdrop을 dialog 카드 직전에 두는 DOM 순서를 지키면 자연 stacking으로 dialog가 위. 별도 z-index 토큰 사용 불필요. `.jt-modal-surface` 클래스를 명시적으로 적용하는 경우엔 surface의 `z-index: var(--z-modal)`(=100)이 backdrop 위로 올림.

**검증**: viewer.html에서 `e1-private`·`e1-saving`·`e4`·`e5`·`e6-paused` 모두 모달 카드/본문이 정상 톤으로 렌더 확인.

---

## 2026-05-27 B-2 튜토리얼 대기 RosterView — 엣지 케이스 mock 2건 추가

**계기**: 사용자 요청 "이 화면에서도 1. 팀명 긴 케이스 2. 팀원 많은 케이스 샘플 추가" — `b2-tutorial-waiting` (RosterRow) 압축 카드의 두 가지 시각 한계를 가시화.

**변경**: `operator.jsx` `PENDING_TEAMS` 배열 끝(바이브 코더 직후, 1인팀 직전)에 2개 추가.
- **긴 팀명**: `엔드투엔드 인터랙션 테스트 마스터즈` (4명) — 카드 헤더의 `ellipsis` 동작 검증
- **다인팀**: `데이터 파이프라인 크루` (7명) — `+N` 칩 동작 검증 (5명 노출 + `+2` 칩)

**부수 변경 (RosterRow 아바타 행)**: `t.members.slice(0, 5)` + 6명 이상이면 `+N` 칩 노출. 칩은 OFF 아바타와 동일한 stone bg · 점선 테두리 22px 원 + `+N` 모노. 칩 `title`에 나머지 멤버 이름·상태 줄바꿈 노출(키보드/스크린리더 접근성 유지). 카드 폭(≈170px) 안에서 22×5+4×4+칩(22) ≈ 140px로 여유. 사용자 피드백: "사용자 더많으면 아이콘도 ... 되어야하는거아니야?" — 기존엔 `flexShrink:0`이라 7명부터 카드 밖으로 흘러나옴.

**부수 변경 (`RosterTeamDetailModal` 모달 상한)**: `b2-roster-detail` 모달이 다인팀에서 무한정 길어지지 않도록 3중 안전망. 사용자 피드백: "클릭했을때 모달도 최대높이같은게 있어야하지않나? 스크롤발생".
- 모달 outer: `maxHeight: 100%` + `flex` 컬럼 + `minHeight: 0` — wrapper 높이를 상한으로 받음.
- wrapper(`B2RosterDetail`): `position: absolute; top: 60; bottom: 60` 인셋으로 아트보드(820px) 안에서 모달이 차지할 수 있는 높이를 ≤700px로 한정.
- 본문: `flex:1 + maxHeight: 320 + overflow: auto` — 7명(≈330px) 케이스에서 곧장 내부 스크롤이 트리거되고, 30+ 명에서도 모달 자체 길이는 80(헤더)+320(본문)+50(푸터) = 450px 이하로 유지.

데모 시뮬 팀도 `404 NOT FOUND`(4명, 스크롤 미발생) → `데이터 파이프라인 크루`(7명) 로 교체. 4명·5명 케이스는 기존과 동일하게 스크롤 없이 그대로 렌더.

PENDING_TEAMS는 roster 모드(60팀/페이지) 전용 — `B2DashboardTutorialWaiting`·`B2DashboardHackathonWaiting` 두 화면에 동시 반영. STARTED_TEAMS는 `TutorialProgressView`의 i 인덱스 기반 step 분포(0–19 완료 / 20–22 step1 …)가 30팀 가정에 묶여 있어 건드리지 않음. 헤더 `{totalTeams}팀`·`접속 {claimed}/{total}` 카운트는 동적이라 자동 30→32로 갱신됨.

---

## 2026-05-27 B-2 종료 카운트다운 — "참가자에게 종료 예고 없음" 정책 + E-7 폐기

**계기**: 사용자 결정 "참가자는 종료 예고 화면이 없다. 정책을 변경해서, 30초 안내를 참가자에게는 보여주지 말고, 운영자에게만 유예 시간으로 주는 정책으로 변경해줘. 참가자는 그냥 즉시종료나 30초 지났을때 종료대기실로 이동되는것으로." 2026-05-27 신설한 `e7-ending`은 "운영자 모달이 참가자 미리보기로 약속한 화면이 실제로 없다"는 갭을 메우려 만든 화면이었지만, 이번 결정으로 **약속(미리보기) 자체가 잘못이었음** — 미리보기 폐기가 정합.

**대상**:
- `operator.jsx` `B2EndModalCountdown` L1054~ — confirm 버튼 라벨 + 0초 자동 트리거 + 미리보기 박스 교체 + 운영자 안내 문구
- `dialogs.jsx` L1106~ — `E7EndingCountdown` / `E7EndingCountdownBody` 함수 + Object.assign export 제거
- `viewer.html` L613 — SCREENS `e7-ending` 항목 제거
- `Jitda Design System.html` L1242 — jt-btn-critical-static 데모 라벨
- `STRUCTURE.md` — §2 E 9→8 · 총합 50→49 / §3 E 표 e7-ending strike-through / §7 와이어링 표 라벨
- `2026-05-18_어드민-역할-기획.md` L218 — §해커톤 상태 모델 규칙

**변경**:
1. **정책**: 30초는 운영자만의 유예 시간. 참가자에게는 종료 예고/오버레이/카운트다운 일체 노출 없음. 종료 확정(즉시 또는 30초 만료) 시점에 참가자 화면이 곧바로 C-3/C-4 → c1-ended(대기실 ③)로 자동 전환. (참가자-로그인-기획.md §자동 전환 매트릭스 `[해커톤 종료] → 대기실 ③`와 정합 복원)
2. **카피 — `지금 종료` → `즉시 종료`** (3곳 동기화: operator.jsx + Jitda Design System.html §03 데모 + STRUCTURE.md §7 와이어링 표). "지금"은 시점 강조지만 "즉시"는 카운트다운을 건너뛴다는 행위 의미가 분명.
3. **자동 종료 동작**: 0초 도달 시 [즉시 종료]와 동일 — 컴포넌트 내 rAF tick이 0 도달 시 `confirmBtnRef.current?.click()` 호출 → viewer ACTIONS 위임이 `b2-ended`로 라우팅. 실제 앱에서는 서버 타이머가 같은 시점에 상태 전이 트리거. [종료 취소]를 누르지 않은 침묵은 종료 의사로 해석.
4. **운영자 안내 박스 교체**: 기존 검은 띠 "참가자 화면 미리보기 · 240명에게 표시"는 약속을 깬 카피라 폐기. 대신 `var(--c-paper)` 옅은 안내 박스로 교체 — "참가자에게는 종료 예고가 표시되지 않습니다 — 30초는 운영자만의 유예 시간이며, 종료가 확정되는 시점에 참가자 화면이 곧바로 **해커톤 종료 안내(대기실 ③)** 로 전환됩니다". 운영자가 정책을 모달에서 즉시 학습.
5. **30초 유예 카드 안내 문구 변경**: "참가자들의 화면에 종료 알림이 표시되고 있어요"(허위) → "마음이 바뀌었다면 지금 [종료 취소]를 눌러주세요 / 아무 동작이 없으면 0초에 자동으로 종료됩니다"(자동 종료 동작 명시).
6. **E-7 폐기**: `E7EndingCountdown` + `E7EndingCountdownBody` 함수 삭제, Object.assign export 제외, viewer SCREENS 제거. 폐기 주석 4줄로 결정 흔적 보존. STRUCTURE.md §3 E 표는 행 strike-through로 결정 기록(완전 삭제 대신).

**의도**: "30초 유예"의 의미를 명확히 — 30초는 **운영자가 마음을 바꿀 시간**이며, 무응답은 종료 확정. 참가자는 예고 없이 작업 화면에서 종료 안내로 직접 전환(작업은 갤러리에 자동 저장되어 손실 없음).

**검증 포인트(향후)**:
- (a) 참가자가 c3/c4에서 코딩하다 갑자기 c1-ended로 점프하는 게 "작업 사라짐"으로 오해되지 않는지 — c1-ended 카피("작업은 갤러리에 공개되었어요" 명시) 후속 검토.
- (b) 운영자가 [종료 취소]를 누른 직후 참가자에게 어떤 신호도 안 가는 게 맞는지 — 운영자 화면만 b2-started 복귀, 참가자는 변화 없음(원래 c3/c4 계속).
- (c) 30초 자동 종료는 viewer 프로토타입 한정 동작이며 실제 앱은 서버 타이머가 같은 시점에 상태 전이 트리거해야 한다는 구현 메모 백엔드 인계 필요.
- (d) "30초는 운영자만의 유예"가 실제 행사 시연에서 운영자에게 부담(자동 종료 위험 인지)을 주는지 — K-12 교사 시범 운영자 피드백 필요.

---

## 2026-05-27 B-2 종료 카운트다운 모달 — 실제 카운트다운 애니메이션

**대상**: `operator.jsx` `B2EndModalCountdown` L1052~
**변경**: 정적 "22" 표시 → rAF 60fps 카운트다운(30초→0초). 링은 12시(top) 시작 시계방향 conic-gradient로 소비분(safety-soft)이 시계 바늘처럼 회전 확장. 링·태이프(⚠ N초 뒤 종료)·참가자 미리보기(`00:NN`) 3곳이 동일 `remaining` 값으로 sync.
**의도**: 30초 유예 단계는 운영자가 "취소할 시간이 있다"는 압력 받아야 하는데, 정적 표시는 시간 흐름이 안 보임. `dialogs.jsx` `RingTimer`(e4 cooldown 검증된 패턴)와 동일 어휘 채택 — 시계 바늘 = LoL 매치 수락 UI 어휘.
**부수 작업**: 없음. `jt-countdown-ring-critical` halo pulse 클래스는 그대로 유지.

---

## 2026-05-27 B2-ended 갤러리 CTA 시각 강조

**대상**: `operator.jsx` `SummaryView` L794 — "갤러리에서 결과물 보기" 카드의 `[갤러리 보기 →]` 버튼
**변경**: `jt-btn-primary` → `jt-btn-critical` 적용 (검정 bg + 노랑 텍스트/테두리 + 사선 shine sweep)
**의도**: B2-ended 대시보드는 종료 상태로 다른 운영 액션이 없으며, 갤러리 진입이 화면의 단일 핵심 CTA. `Jitda Design System.html` L1210 사용 룰("한 번에 한 화면에서 가장 무게 있는 단일 액션에만") 정합. 기존 `jt-btn-critical` 사용처(E-4 AI 전송, C-1 종료 갤러리, B2 튜토리얼/해커톤 시작)와 동일 위계.
**부수 작업**: `tokens.css` L538 주석("shine sweep 데모용")이 실제 시스템 설계와 어긋난 오래된 표현 — `Jitda Design System.html` L1210의 명문화된 룰에 맞춰 정정.

---

## ⭐ 2026-05-27 디자인 시스템 토큰 확장 (전 영역 적용)

**계기**: 49 화면을 senior UI 디자이너 관점에서 병렬 감사한 결과, 다음 공통 갭이 발견됨.

| # | 갭 | 발견 위치 | 결정 |
|---|----|---------|------|
| T1 | `:focus-visible` 토큰 부재 → 키보드 접근성 결함 | 전 영역 49 화면 | `--focus-ring-color`(helmet), `-width`, `-offset`, `-soft` 토큰 추가. `.jt-btn`·`.jt-input`·`.jt-icon-btn`·`.jt-card-interactive`에 `:focus-visible` outline 적용 |
| T2 | `:hover` transition 0ms (즉시 변화) | `.jt-btn` 4종 + 다수 인라인 | `--dur-{instant\|fast\|base\|slow}` 4단 + `--ease-{standard\|decelerate\|accelerate\|spring}` 4종 + `--trans-hover`·`--trans-press`·`--trans-elev` preset 추가. `.jt-btn`에 transition 기본값 적용 |
| T3 | `:active` (pressed) 상태 전무 | 모든 버튼·카드 | `.jt-btn:active scale(0.97)` · `.jt-icon-btn:active scale(0.94)` · `.jt-card-interactive:active scale(0.998)` |
| T4 | backdrop rgba 인라인 5+ 곳 하드코딩 (불일치 0.25/0.40/0.45) | dialogs.jsx 5 곳, operator.jsx 1 곳 | `--c-backdrop`(0.40 기본), `--c-backdrop-strong`(0.55 위험), `--c-backdrop-soft`(0.25 가벼움) 3단 토큰화. `.jt-modal-backdrop` 클래스로 통일 |
| T5 | 모달 shadow `0 30px 80px rgba(0,0,0,0.3)` 7곳 중복 | operator.jsx 6곳, dialogs.jsx 1곳 | `--shadow-modal` 토큰화. dual-layer (30/80 + 12/24) 강화. 함께 `--shadow-hover`·`--shadow-popover` 신설 |
| T6 | `jt-spin` keyframe 정의 누락(auth.jsx에서만 인라인 `<style>` 3 곳에 중복 정의) | auth.jsx | tokens.css에 `@keyframes jt-spin` + `.jt-spin`·`.jt-spin-once`·`.jt-spin-slow` 클래스 표준화 |
| T7 | 모달 진입 애니메이션 전무 | 11+ 모달 전체 | `jt-backdrop-in` · `jt-modal-pop-in` · `jt-modal-fade-in` · `jt-modal-slide-up` keyframe + `.jt-modal-backdrop`·`.jt-modal-surface` 프리미티브 |
| T8 | `role="dialog"`/`aria-modal` 전무 (접근성) | 11+ 모달 | E-1 설정(dialog) · E-4 투표(alertdialog) · E-5 AI 선택지(dialog) · E-1 미저장(alertdialog) · E-6 일시정지(alertdialog) — role + aria-modal + aria-label 부여. 운영자 모달은 다음 cycle |
| T9 | 모달 너비 인라인 magic number (420/560/720/920) | dialogs.jsx, operator.jsx | `--modal-w-{sm\|md\|lg\|xl}` 4단 토큰 |
| T10 | `jt-status-pulse` 라이브 카운터 헤일로 정의 누락 | shared.jsx StatusPill | tokens.css에 `@keyframes jt-status-pulse` + `.jt-status-pulse` 클래스 추가 |
| T11 | popover/tooltip/tab-underline 등 빈출 컴포넌트 미정의 | gallery.jsx 더보기 메뉴·정보·댓글 탭·아이콘 hover | `.jt-popover`·`.jt-tooltip`·`.jt-tab-underline`·`.jt-icon-btn` 클래스 신설 |
| T12 | `.jt-btn-helmet` JSX에서 사용하지만 정의 안 됨 | auth.jsx A1 입장·A1 invalid | tokens.css에 helmet variant 정식 정의(hover→helmet-deep) |
| T13 | `.jt-input` `:focus-visible`·`:hover`·`is-error` 미분화 | 다수 | hover은 ink-3 border, focus-visible은 ink border + helmet-soft glow, is-error는 safety border + soft bg |
| T14 | E-1 미저장 경고 모달 caution-strip 누락 (비가역 액션인데 시각 강도 약함) | dialogs.jsx L912~ | `.jt-caution-strip-static` 추가 + modal-shadow + pop-in 애니메이션 |
| T15 | `z-index` 인라인 magic number 혼재 | 전 영역 | `--z-{base\|sticky\|overlay\|modal\|popover\|toast}` 스케일 토큰화 |

**영향 범위**:
- `tokens.css` +180 줄 (모션·focus·backdrop·overlay·신규 클래스)
- `dialogs.jsx` E-1·E-4·E-5·E-1 미저장·E-6 모달 5개 패치 (backdrop·shadow·width·aria·entrance)
- `operator.jsx` 모달 shadow 6곳 + backdrop 1곳 토큰 치환, HackathonCard에 `.jt-card-interactive` + `role/tabIndex` 부여
- `shared.jsx` ProjectCard에 `.jt-card-interactive` + role/tabIndex 조건부 부여
- `Jitda Design System.html` 신규 섹션 3개 추가: §09d Motion · §09e Overlay · §09f Component Library (TOC 동기화)

**잔여 작업 (후속 cycle)**:
- operator.jsx 6개 모달에 role/aria-modal 부여 (b2-skip, b2-end, b2-end-countdown, b2-tutorial-start-confirm, b2-tutorial-end-confirm, b2-hackathon-start-confirm)
- gallery.jsx Safari traffic light hover (macOS Tahoe 동작 모사 — 데코지만 polish 가치)
- gallery.jsx 새로고침 버튼 클릭 → `.jt-spin-once` 트리거 와이어링
- shared.jsx StatusPill에 `.jt-status-pulse` 클래스 적용 (라이브 카운터)
- C 영역 participant.jsx 버튼 transition 토큰 적용 검증 (`.jt-btn` base에서 자동 상속되지만 인라인 style override 있는 위치 확인 필요)
- B 영역 모달 6개 + 운영자 confirm 모달들에 `role/aria-modal` + `.jt-modal-surface` 진입 애니메이션

**감사 근거**: 5개 병렬 정찰 agent 리포트 (A 10갭·B 17갭·C 7갭·D 14갭·E 11갭·F 5갭·공용 4갭·디자인 시스템 13누락) = 총 81개 식별. 우선순위는 시스템 레벨 + 49 화면 동시 영향 + 접근성 critical 기준.

---

## 0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| 1 | 상단 macOS 브라우저 chrome | **삭제** | GNB(AppHeader)만으로 충분. 더블 헤더 위계 충돌 |
| 2 | 갤러리 카드 셸 | 운영자(B영역) LivePreview 공용화 (`ProjectCard`) | 디자인 시스템 일관성 |
| 3 | 카드 정보 영역 | 3행 → **2행 컴팩트** (썸네일 위주) | 60팀 규모 — 한 화면에 더 많이 보이도록 |
| 4 | 댓글 시스템 | **Full Version → MVP 복귀, 단순화** | 사용자 피드백 — 갤러리에 댓글이 있어야 함 |
| 5 | 댓글 템플릿(잘한 점/개선 제안) | **삭제** | 사용자 결정: "그냥 댓글만" |
| 6 | 댓글 답글·좋아요 | **삭제** | 1차 범위 축소 |
| 7 | 댓글 정렬 | **고정(시간 순, 오래된 것이 위)** | 단일 흐름. 사용자가 정렬 제거 요청 |
| 8 | 댓글 신고 | 더보기(⋯) 메뉴로 일원화 | 액션 노이즈 감소 |
| 9 | 사용 기술 섹션 | **삭제** | 자동 검출 불가 — 알 수 없는 정보 |
| 10 | 갤러리 정렬 | **팀명순 고정** (선택 UI 없음) | 페이지네이션·검색과의 3축 직교 복잡도 회피. prev/next도 동일 기준. |
| 12 | 새로고침 버튼 | **신설** (D-2 좌측 아이콘 첫 슬롯) | 라이브 앱 상태 갱신용 |
| 13 | 본인 프로젝트 공개 설정 | D-2 아이콘 액션 (`mine=true` 활성) | UX 리뷰 권고 반영 |
| 14 | 좋아요 버튼 위계 | **1차 CTA** (solid coral, 큰 하트, 카운트 배지) | 사용자 요청: 더 눈에 띄게 |
| 15 | 종료 안내 배너 | **삭제** → 상태 pill로 통합 | 수직 공간 절약 → 카드 가시성 ↑ |
| 16 | 해커톤 상태 표시 | **상태 pill** (BackLink 인라인) — 진행/종료/튜토리얼 색·도트·라이브 카운터 | 1초 내 진행/종료 인지 |
| 17 | D-2 헤더 단일 행 강제 | 메타라인 제거 — 제목만 | 디자인 시스템: 헤더 2줄 금지 |
| 18 | GNB 위계 | **로고가 항상 좌측 고정** + 백 버튼은 본문 영역으로 분리 (`BackLink`) | AppHeader 패턴 준수 |
| 19 | iframe viewport 토글 | **삭제** — 데스크톱 뷰포트 고정 (2026-05-27) | 토글의 실제 기능적 가치 부재. 라이브 앱은 데스크톱 기준으로만 평가 |
| 20 | D-2 좌측 라이브 패널 구조 | iframe 컨테이너에 **Safari (macOS Tahoe) 컴팩트 chrome** — 높이 32px, 배경 #f5f5f7. 좌: 10px 트래픽 라이트 + 사이드바 아이콘. 중앙: pill 주소창(높이 22, max-w 380)에 aA 리더 + 작품명 + 새로고침 SVG. 우: 공유·탭 그룹 SVG. 모든 아이콘 SF Symbols 톤(0.9 스트로크). URL 텍스트 삭제, section padding 24→16 (2026-05-27) | 최신 Safari 미니멀 톤. 60% 슬림화로 작업물 가시성 우선. 작품명은 주소창에 노출(URL 대신). chrome 전체 데코레이션 전용. |

---

## 1. `2026-05-20_갤러리-2차-기획.md`

### 1-1. 검토 항목 표 수정 (line 148~157 "Full Version 검토 항목")

**현 명세 문제점**: `댓글 시스템`을 Full Version으로 분리하고 "구조화된 템플릿" 명시. 그러나 **MVP에 댓글을 다시 포함**하기로 결정. 또한 답글/좋아요/템플릿은 제외.

**수정안 — 표를 두 부분으로 재구성**:

```diff
- ### Full Version 검토 항목 (이번 작업 범위 제외)
- 
- | 기능 | 설명 | 우선순위 |
- |------|------|----------|
- | 프로젝트 검색 | 프로젝트명/팀명 텍스트 검색 (60팀 규모 필수) | High |
- | 댓글 시스템 | 텍스트 피드백 + 구조화된 템플릿("잘한 점/개선 제안") | Medium |
- | 댓글 관리 | 운영자 숨김 권한 + 신고 기능 | Medium |
- | 내 프로젝트 하이라이트 | 갤러리 목록에서 본인 프로젝트에 "내 프로젝트" 뱃지 | Low |
- | 프로젝트 공유 링크 | SNS/메신저 공유용 링크 복사 | Low |

+ ### MVP 추가 반영 항목 (2026-05-26 결정)
+ 
+ | 기능 | 설명 | 상태 |
+ |------|------|------|
+ | 프로젝트 검색 | 프로젝트명/팀명 텍스트 검색 (60팀 규모 필수) | MVP |
+ | 댓글 (단순형) | 일반 텍스트 댓글만. 템플릿·답글·좋아요 없음. **시간 역순(오래된 것이 위)** | MVP |
+ | 댓글 신고 | 댓글 아이템 우상단 더보기(⋯) 메뉴 | MVP |
+ | 본인 댓글 수정/삭제 | 본인 댓글에만 노출 | MVP |
+ | 내 프로젝트 하이라이트 | 갤러리 목록에서 본인 프로젝트에 "내 프로젝트" 리본 | MVP |
+ | 본인 프로젝트 공개 설정 | D-2 우상단 아이콘 액션 — 본인 프로젝트일 때만 활성 | MVP |
+ | 라이브 앱 새로고침 | D-2 좌측 아이콘 첫 슬롯 — 라이브 앱 상태 다시 불러오기 | MVP |
+ | 해커톤 상태 표시 | 본문 헤더에 상태 pill (진행 중 · 종료 · 튜토리얼) | MVP |
+ 
+ ### Full Version으로 보류
+ 
+ | 기능 | 사유 |
+ |------|------|
+ | 댓글 답글(threaded reply) | 1차 범위 단순화 |
+ | 댓글 좋아요 | 1차 범위 단순화 |
+ | 댓글 템플릿(잘한 점/개선 제안) | 사용자 결정: "그냥 댓글만". 분류 부담 회피 |
+ | 댓글 정렬 옵션(최신/인기) | 1순서로 충분 |
+ | 갤러리 정렬 옵션(인기순/최신순 선택) | 1차 단순화 — 팀명순 고정. 페이지네이션·검색과의 3축 직교 복잡도 회피 |
+ | 운영자 댓글 숨김 권한 | UI 슬롯은 확보, 권한 처리는 2차 |
+ | 프로젝트 공유 링크 | 새 탭 열기로 대체 |
```

### 1-2. 2-pane 레이아웃 다이어그램 수정 (line 121~131)

**현 다이어그램**:
```
┌────────────────────┬──────────────────┐
│                    │  📋 목적          │
│  라이브 앱          │  🎯 사용 기술     │
│                    │  🔧 사용법         │
│                    │  ❤️ 좋아요 N       │
│                    │  [새 탭에서 열기 ↗] │
└────────────────────┴──────────────────┘
```

**수정안**:
```
┌────────────────────┬─────────────────────┐
│  [🔄 새탭 ⚙]        │  팀명·N명           │
│  ┌──────────────┐  │  프로젝트 제목       │
│  │ 라이브 iframe │  │  태그라인            │
│  │              │  │  ─────────────       │
│  │              │  │  [정보] [댓글 N]     │
│  │              │  │  📋 목적              │
│  │              │  │  🔧 사용법            │
│  │              │  │  👥 팀 멤버           │
│  │              │  │  ─────────────       │
│  │              │  │  ❤️ 좋아요 [N]  ← CTA │
│  └──────────────┘  │                     │
└────────────────────┴─────────────────────┘
```
- 우측 패널에 **[정보] / [댓글 N]** 탭 구조 추가
- 우측 하단 sticky **좋아요 CTA** (1차 액션)
- `🎯 사용 기술` 섹션 **삭제** (자동 검출 불가)
- 좌측 패널 iframe 컨테이너 상단에 **Safari (macOS Tahoe) 컴팩트 chrome 바** (높이 32px, 배경 #f5f5f7) — 10px 트래픽 라이트 + 사이드바 SVG + 중앙 pill 주소창(aA 리더 + 작품명 + 새로고침 SVG) + 공유·탭 그룹 SVG. SF Symbols 톤(0.9 스트로크). 순수 데코레이션, 동작 없음 (2026-05-27: URL 텍스트·viewport 토글·미니 툴바 모두 삭제, 작업물 영역 우선)

### 1-3. 이전/다음 네비게이션 (line 136~147)

**추가**:
- prev/next는 **팀명순(한글 가나다 → 영문) 고정** 순서로 동작 (D-1 목록 정렬과 동일 기준)
- 정렬 선택 UI 없음 — 단일 기준이므로 dropdown 불필요

### 1-4. 카드 위계 (line 101~120)

**미세 조정**:
- 1순위 썸네일은 변경 없음 (LivePreview)
- 정보 영역은 **2행** (3행 → 2행):
  - 행 1: `제목 (truncate flex-1) ❤️ 카운트`
  - 행 2: `팀명 · N명 (truncate flex-1) 💬 댓글 수(>0일 때만)`
- `❤️ 위치`: 카드 우상단 (정보 영역 첫 행 우측)

---

## 2. `2026-05-20_디자인-리뉴얼-페이지-정의서.md`

### 2-1. D-1 컴포넌트 표 수정 (line 486~498)

**추가**:
```diff
+ | 9 | 상태 pill | 해커톤 진행/종료/튜토리얼 — BackLink 우측 인라인 (색+도트+카운터 이중 인코딩) |
+ | 10 | 검색 입력 | 프로젝트명/팀명 텍스트 검색 |
+ | 11 | 내 프로젝트 리본 | 본인 프로젝트 카드 좌상단 |
+ | 12 | 댓글 카운트 메타 | 카드 행 2 우측 (>0일 때만) |
```

### 2-2. D-2 컴포넌트 표 전체 재작성 (line 526~538 추정)

기존 "D-2 컴포넌트 8개"에서 다음 추가/삭제:

**추가**:
- 라이브 앱 새로고침 액션 (iframe 미니 툴바)
- 본인 프로젝트 공개 설정 (`mine=true`일 때만 활성)
- 이전/다음 프로젝트 칩 (prev/next, 팀명순 기준, 제목 + 비활성 처리)
- 정보·댓글 탭
- 댓글 작성 폼 (인라인 한 줄 → 포커스 시 확장)
- 댓글 아이템 (작성자·시간·본문·더보기 메뉴)
- 좋아요 CTA (1차 액션, solid coral)
- 상태별 좋아요 카드 (mine일 때)

**삭제**:
- `🎯 사용 기술` 섹션

### 2-3. D-2 사용자 액션 표 (line 552~557)

**추가**:
```diff
| # | 액션 | 트리거 | 결과 |
|---|------|--------|------|
| 1 | 라이브 앱 체험 | iframe 내 클릭/입력 | 앱과 상호작용 |
| 2 | 새 탭에서 열기 | "새 탭에서 열기" 클릭 | 앱이 별도 탭에서 전체화면 |
| 3 | 좋아요 토글 | ❤️ 버튼 클릭 | 좋아요 추가/제거, 카운트 ±1 (낙관적 업데이트) |
| 4 | 갤러리로 돌아가기 | ← 뒤로가기 | D-1로 복귀 |
+ | 5 | 라이브 앱 새로고침 | 🔄 아이콘 클릭 | iframe reload (서버 상태 다시 불러오기) |
+ | 6 | 공개 설정 변경 | ⚙ 아이콘 클릭 (mine=true) | 프로젝트 설정 다이얼로그(E-1) 열림 |
+ | 7 | 이전/다음 프로젝트 이동 | prev/next 칩 클릭 | 팀명순(고정) 기준 인접 프로젝트로 라우팅 |
+ | 8 | 정보/댓글 탭 전환 | 우측 패널 탭 클릭 | 컨텐츠 전환 |
+ | 9 | 댓글 작성 | 입력 포커스 → 텍스트 → 댓글 달기 | 새 댓글 추가(맨 아래) |
+ | 10 | 본인 댓글 수정/삭제 | 본인 댓글 행의 [수정]/[삭제] | 인라인 수정 / 확인 후 삭제 |
+ | 11 | 댓글 신고 | 댓글 우상단 ⋯ 메뉴 → 신고 | 운영자에게 신고 큐 발송 |
```

### 2-4. 화면 수 합계 표 (line 837~838)

```diff
- | D-1 갤러리 목록 | 8 | 3 | 3 | 전체 | 리액션 4종→단일 ❤️ |
- | D-2 갤러리 상세 | 8 | 5 | 4 | 전체 | 리액션 단일화, 댓글 Full 이동 |
+ | D-1 갤러리 목록 | 12 | 3 | 3 | 전체 | 진행/종료/빈/로딩 4상태, 상태 pill, 팀명순 고정 |
+ | D-2 갤러리 상세 | 14+ | 5 | 5+ | 전체 | 댓글 MVP 복귀(단순형), prev/next(팀명순), 새로고침 추가, 사용 기술 삭제 |
```

### 2-5. D-1 화면 상태 (line 502~506)

**추가**:
```diff
| 상태 | 조건 | 화면 |
|------|------|------|
| 로딩 | 데이터 패칭 | 로딩 메시지 + 스켈레톤 그리드 |
| 비어있음 | 공개 프로젝트 0개 | 빈 상태 메시지 + "내 프로젝트를 먼저 공개해볼까요?" CTA |
| 카드 목록 | 프로젝트 1개 이상 | 카드 그리드 + 페이지네이션 |
+ | 종료 후 | 해커톤 종료 (자동 공개) | 카드 목록 + 상태 pill "해커톤 종료 · SEALED" (별도 안내 배너 없음) |
```

---

## 3. `2026-05-20_디자인-리뉴얼-UX-리뷰-f1bc8859.md`

### 3-1. D-1 — 카드 시각적 우선순위 이슈 해결 (line 252~)

**상태 갱신**:
```diff
**[High] 카드 시각적 우선순위 미정의** — 잔여
+ → 2026-05-26 해결됨: ProjectCard 공용 컴포넌트로 4단 위계 명시
+   1. 썸네일(LivePreview) 60%+ 
+   2. 제목 (14px bold, truncate)
+   3. 팀명·멤버 (11.5px secondary, truncate)
+   4. ❤️ 카운트 + 💬 댓글 수
```

### 3-2. D-2 — 댓글 제거 → 단순형 복귀로 수정 (line 246~248)

```diff
- > **기획 변경 반영**: 리액션 4종 → 단일 ❤️ 좋아요로 변경 (갤러리-리액션-변경-기획).
- > 댓글은 Full Version으로 이동 (MVP 제외). D-2 컴포넌트 11→8, 액션 6→4로 단순화됨.
- > 이전 리뷰의 "리액션 4종 의미 구분 불명확 [High]", "리액션 4종 시각 노이즈 [Medium]" 이슈 **해결됨**.

+ > **기획 변경 반영 (2026-05-26)**: 리액션 4종 → 단일 ❤️ 좋아요로 변경. 
+ > **댓글은 MVP 복귀했으나 단순화** — 템플릿/답글/댓글 좋아요 모두 제외, 시간 역순 단일 정렬.
+ > 우측 패널은 [정보 / 댓글] 탭 구조로 분리되어 스크롤 길이 부담은 해소.
+ > 이전 리뷰의 "리액션 4종 의미 구분 불명확 [High]", "리액션 4종 시각 노이즈 [Medium]" 이슈 **해결됨**.
```

### 3-3. D-2 — 이전/다음 네비게이션 해결 (line 269~272)

```diff
**[Medium] 이전/다음 프로젝트 네비게이션 부재** — 잔여
- - 상세 → 목록 → 다음 카드 왕복 마찰
- - 개선: "← 이전 | 다음 →" 네비게이션 추가

+ → 2026-05-26 해결됨: D-2 우측 상단에 prev/next 칩.
+   순서는 팀명순(한글 가나다 → 영문) 고정 — D-1 목록과 동일 기준.
+   첫 프로젝트에서 prev 비활성, 마지막에서 next 비활성 ("더 이상 없어요" 표시).
```

### 3-4. D-1·D-2 공통 — GNB 위계 신규 이슈 (해결됨)

**추가 (신규 항목)**:
```
**[Medium] GNB 좌측에 백 버튼 배치는 로고 위계 침범** — 해결됨 (2026-05-26)
- 백 버튼이 짓다 로고보다 좌측에 있어 브랜드 위계 침범
- 개선: 로고를 항상 좌측 첫 슬롯에 고정 (AppHeader 패턴 준수). 
  백 버튼은 본문 영역 헤더로 분리 (`BackLink` 컴포넌트).
```

---

## 4. `화면상태정의서-422fcf39.md`

### 4-1. 갤러리 카드 상태 (line 347~362)

**추가**:
- 카드 메타 행: `❤️ N`은 우상단, `💬 M`은 우하단(>0일 때만) — 명세 추가
- 데스크톱 그리드: `repeat(auto-fill, minmax(260px, 1fr))` — 4고정 → auto-fill
- 모바일은 1열 유지

### 4-2. 갤러리 상세 — 프리뷰 상태 (line 383~385)

```diff
| **프리뷰 대기** | project + siteUrl + previewReady === false | 좌: 바운싱 점 + "준비 중이에요" / 우: 프로젝트 정보 |
| **프리뷰 로드됨** | previewReady === true | 좌: 라이브 iframe / 우: 프로젝트 정보 |
| **프리뷰 없음** | siteUrl === null | 프로젝트 정보만 표시 |
+ | **프리뷰 새로고침** | refresh 클릭 | iframe key 갱신 → previewReady false → 대기 → 로드됨 재진입 |
```

### 4-3. 갤러리 상세 툴바 (line 370~376)

```diff
**공통 요소:**
- - ← "갤러리" (목록으로)
- - 스페이서
- - "새 탭에서 열기 ↗" (siteUrl 존재 시)

+ **본문 위계의 서브 툴바 (단일 행, 좌→우):**
+ - ← BackLink "갤러리 목록"
+ - vertical divider
+ - 프로젝트 제목 (truncate, max-width 280px) + [내 프로젝트] 리본(mine)
+ - 아이콘 액션 그룹: [🔄 새로고침] [↗ 새 탭] [⚙ 공개 설정 — mine 시 활성]
+ - flex spacer
+ - prev 칩 (이전 프로젝트 제목 또는 "처음") — 팀명순 기준
+ - next 칩 (다음 프로젝트 제목 또는 "마지막") — 팀명순 기준
```

### 4-4. 화면 수 합계 (line 463~467)

```diff
- | 갤러리 목록 | 4 | 0 | 0 | 페이지네이션 포함 |
- | 갤러리 상세 | 5 | 0 | 0 | 리액션 상태 포함 |
+ | 갤러리 목록 | 4 | 0 | 0 | 진행/종료/빈/로딩 4상태 |
+ | 갤러리 상세 | 6 | 1 | 1 | 로드됨/대기/내것/마지막/댓글탭/댓글빈, 신고 다이얼로그(1) |
```

### 4-5. 기본 정렬 명세

화면상태정의서 §8-1 툴바 아래에 한 줄 명시:

```
**기본 정렬:** 팀명순 고정 (한글 가나다 → 영문) — 목록(D-1)·상세(D-2) prev/next 공통 기준
```

정렬 선택 UI 없음. 페이지네이션·검색은 독립 작동.

---

## 5. 신규로 필요한 문서 (선택)

다음 항목은 어느 기존 문서에도 깔끔히 들어가지 않으므로 **별도 짧은 문서**로 신설 권장:

### 5-1. `2026-05-26_갤러리-디자인-결정.md` (제안)

- 카드 셸 통합 (운영자 ↔ 갤러리 공용 `ProjectCard`)
- GNB 위계 (`AppHeader` 패턴 — 로고 좌측 고정, 백 버튼은 본문)
- 상태 pill (진행/종료/튜토리얼 — 색+도트+카운터)
- 좋아요 1차 CTA 처리 (solid coral)
- 갤러리 정렬: 팀명순 고정 (선택 UI 없음)
- 댓글 단순형 — 무엇을 빼고 왜 뺐는지

---

## 6. 영향 없는 문서

다음 문서들은 이번 갤러리 작업과 직접 충돌 없음:

- `2026-05-05_셀프-튜토리얼-기획.md` — 갤러리 직접 영향 없음
- `2026-05-18_동시편집-캔버스-기획.md` — 갤러리 직접 영향 없음
- `2026-05-18_참가자-로그인-기획.md` — 갤러리는 종료 후 접근 정도만 언급
- `2026-05-18_어드민-역할-기획-38f6cedd.md` — 권한 표에 "참가자: 갤러리, 리액션/댓글" 한 줄 — 그대로 유효

---

## 부록. 변경되지 않은 결정 (참고)

기획 v1의 다음 결정은 그대로 유지:

- 리액션 4종 → 단일 ❤️
- 4단 카드 위계 (썸네일 → 제목 → 작성자 → ❤️)
- 2-pane 상세 레이아웃 (좌: iframe 고정, 우: 정보 스크롤)
- 이전/다음 프로젝트 네비 — **팀명순(한글 가나다 → 영문) 고정** 기준
- 첫/마지막 프로젝트에서 prev/next 비활성
- 빈 상태 / 로딩 상태 정의
- 5초 폴링 갱신
- 페이지 보호 (`safePage = Math.min(page, pageCount)`)
- 모바일 1열 그리드

---

*검토자: 짓다 디자인 / 작성일: 2026-05-26*

---

# 7. E. 합의 투표 영역 추가 (2026-05-26)

> E-4 합의 투표를 LoL "매치 수락" 어휘로 리뉴얼하면서 발생한 결정·신규 화면·정의서 정합성 항목.

## 7-0. 변경 사항 한눈에 보기 (E 영역)

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| E-1 | E-4 voting 상태 — 투표 현황 노출 | **노출** (4열 포트레이트, 칩 3종: 요청자/동의/대기) — 2026-05-27 룰 변경 | 이전 결정("숨김 — 부분 진행률은 노이즈")을 뒤집음. 사용자 지적: voting 중에도 "누구의 결정을 기다리는지"를 알아야 재촉·긴급성 컨텍스트가 성립. 만장일치 룰에서도 pending 가시화는 진행률이 아닌 식별 정보 |
| E-2 | E-4 rejected — 팀원 포트레이트 | **노출** (4열 카드, 4가지 칩: 요청자/동의/거절/무응답) | 합의 실패 시 누가 막았나 시각화 |
| E-3 | E-4 카운트다운 시각화 | 진행바 4px → **원형 링 168px** (헬멧 노랑 + halo pulse, 12시 시작·시계바늘 진행) | 시간의 원형성·LoL 게임 수락 UI 어휘 |
| E-4 | 프롬프트 미리보기 | **완전 제거** (인라인 박스·별도 화면·voting 버튼 모두) | 시간 압박 화면에서 본문 검토 부적절 (사용자 결정 "간소화") |
| E-5 | E-4 동의 CTA | `jt-btn-sm` → `jt-btn-critical`(stache+helmet 사선 shine sweep, 115° L→R) | 시각 위계 강화. 토큰 이미 존재 |
| E-6 | E-4 배경 dim | 0.32 → **0.40** (살짝 강화) | 라이트 dim 유지, 다크 테마 회피 |
| E-7 | 합의 정족수 룰 | ✅ **만장일치 단일 룰** (어드민 설정 옵션 제거) — 2026-05-26 확정 | 단순화 + 합의 의미 강화. 병목 리스크는 실측으로 재검토 |
| E-8 | 투표 타임아웃 시간 | ✅ **15초** (이전 10초) — 2026-05-26 확정 | 만장일치 + 검토 여유 균형. RingTimer total=15 |
| E-9 | 거절 헤드라인 | ✅ **고정 문구 "합의가 무산됐어요"** (이름 명시 폐지) — 2026-05-26 확정 | 사회적 압박·책임 전가 회피. 누가 거절했는지는 4열 포트레이트 칩으로만 시각화 |
| E-10 | 팀원 칩 종류 | ✅ 요청자/동의/거절/**무응답**(timeout) 4가지 — 2026-05-26 확정 | 만장일치에서 무응답도 합의 실패 원인 |
| E-11 | RingTimer 방향 | ✅ 12시 시작·**시계 바늘 방향** (회색 sector가 시계방향으로 증가) — 2026-05-26 확정 | LoL 매치 수락 진행과 일치, 시각적 직관 |
| E-12 | RingTimer 애니메이션 | ✅ rAF 60fps 부드러운 호 감소 + 1초 ceil 숫자 — 2026-05-26 확정 | 시연용 자동 카운트다운, 정적 표시와 차별화 |
| E-13 | cooldown 화면 분리 | ✅ **폐기** — 거절 화면에 5초 ring 통합 — 2026-05-26 확정 | 정보 중복 (사용자 결정 "쿨다운은 필요없을것 같은데") |
| E-14 | E-4 voting 팀원 카드 노출 (2026-05-27 룰 변경) | ✅ **노출** (4열 포트레이트 · requester/agreed/pending 3종 칩) | E-1 결정 뒤집기. 사용자 지적: "voting 중에도 누가 응답했는지 보여줘야 한다". 만장일치 룰에서 pending 가시화는 진행률이 아닌 식별 정보(누구의 결정을 기다리는지). rejected 칩은 voting 중 등장 불가(즉시 e4-rejected 전이) |
| E-15 | voting 화면 레이아웃 (2026-05-27 v2) | ✅ **B안: 카드가 아래** — 헤드라인 → 큰 CTA → 구분선 → 카드. 이전 A안(카드→CTA) 폐기 | 사용자 결정 "현재 응답이 맨 아래가 맞음". CTA를 헤드라인 직후 배치하여 시간 압박 화면에서 안구 이동·동조 편향 완화. 카드는 post-decision 모니터링 어휘 |
| E-16 | CTA 버튼 사이즈 증대 (2026-05-27 v2) | ✅ padding 13×30 → **18×40/44**, fontSize 14/14.5 → **16/17**, 아이콘 13→16, border 1.5px→2px, radius 999→10 | 사용자 결정 "동의 거부 버튼이 더 커야 함". 핵심 액션 시각 위계 강화 |
| E-17 | 카드 fill 강조 (2026-05-27 v2) | ✅ 카드 자체에 상태별 fill — agreed=mint-soft+mint border / rejected=safety-soft+safety border / pending=옅은 bg+dashed stone-2 border / requester=helmet-soft+helmet border / timeout·offline=#ebebec | 사용자 결정 "카드 자체를 초록/주황으로 — 더 눈에 띄게". 멀리서도 동의/거절/대기 식별. voting·rejected 양쪽 공용 컴포넌트라 두 화면 모두 영향 |
| E-18 | voting 실시간 시뮬레이션 (2026-05-27 v2) | ✅ React.useState + setTimeout 데모 — t=2.5s 이서윤 agree, t=6.5s 박지호 agree, 최유나는 15s timeout 까지 pending | 사용자 결정 "voting 중 실시간 업데이트". 디자인 데모 한정 시뮬. 실제 앱은 서버 이벤트로 setMembers 호출 |
| E-19 | 신규 화면 `e4-waiting` (2026-05-27 v3) | ✅ 본인 동의 후 팀원 응답 대기 — 헤드라인 "팀원 응답을 기다리고 있어요" + sub "모두 동의하면 AI에 자동으로 전송됩니다" + "✓ 동의했어요 · 응답 완료" glass pill + 4 카드(본인=동의 확정). **취소 불가** | 사용자 결정 "동의 후 기다리는 화면 필요". 어휘는 그룹 상태 강조(자기 행동 확인보다 팀 진행 상태 우선). 취소 불가는 투표 의미 보존(K-12 잘못 누름 케이스 검증 필요). voting과 동일 vertical 구조로 화면 점프 최소화. role="status"·aria-live="polite" |
| E-20 | 와이어링 + 레이아웃 미세 조정 (2026-05-27 v3) | ✅ `e4: { agree: e4-waiting, reject: e4-rejected }` + `e4-waiting: { back-to-canvas: c4 }`. 거부 버튼 가로폭 축소(padding 24×44 → 24×26), 동의 버튼 가로폭 증대(padding 24×48 → 24×52), 버튼 세로 padding 18→24, container gap 18→22 / padding 28→32, headline↔CTA marginTop 4→12 | 사용자 피드백 3종: "거부 버튼 폭 줄여도 될듯", "멘트와 버튼 간격 너무 좁다", "버튼 높이 더 늘려라" |
| E-21 | Alternate 디자인 세트 `e4-v2` + `e4-waiting-v2` (2026-05-27 v4) | ✅ LoL 매치 수락 어휘 직접 차용 — 480px 거대 ring + 다크 inner disc(rgba 0,0,0,0.94) + 6시 수락 버튼(`bottom: -24` overlap) + ring 내부 미수락자 아바타만(점선 테두리 40px, 이름 mono 캡션). 신규 컴포넌트: `useCountdown(total)` 훅, `MatchAcceptRing(remaining,total,full,size)`, `PendingAvatar({name,color})`. waiting-v2는 6시 위치에 수락 버튼 대신 "✓ 동의했어요 · 응답 완료" pill(다크 + mint border + glow). 와이어링: `e4-v2: { agree: e4-waiting-v2, reject: e4-rejected }` + `e4-waiting-v2: { back-to-canvas: c4 }`. E 9→11, 총합 50→52 | 사용자 결정 "디자인을 아예 바꿔서 새 버전 / 타이머 훨씬 크고 6시방향 수락 / 팀원 응답은 ring 안에 작게 / 미수락자만 / 기존 화면 두고 새 화면 추가 / 동의 후 대기도 세트로". v1(`e4`·`e4-waiting`)은 유지 — 최종 채택 정책 미정 |
| E-22 | `MatchAcceptRing` SVG 게이지 — caution stripe(ring 곡률을 따라가는 사선) (2026-05-27 v5) | ✅ ffmpeg로 LoL 영상 프레임 분석 후 어휘 차용. 게이지: 7시(버튼 좌측 끝) → 시계방향 → 5시(버튼 우측 끝) = 100% (300° sweep, 60° 버튼 영역 자동 회피). 최종 구현(v6): 각 stripe를 **SVG `<path>` 평행사변형(두 호 + 두 대각선)** 으로 그려 ring 곡률을 따라 자연스럽게 사선 무늬 밧줄을 둥글게 감은 시각 구현. 이전 시도: (a) 정적 SVG `<pattern>` 45° → flat, (b) N=8 동심원 + dashoffset → spoke처럼, (c) 회전 사각형 segment → chevron(>>) joint. SVG `<mask>` 로 게이지 호 길이 L 만큼만 노출. CSS `drop-shadow` 다중 적용으로 노랑 glow halo. voting-v2 = 실시간 fraction 증가(rAF), waiting-v2 = `full={true}` 100% 고정. waiting-v2 eyebrow 카운트다운 제거 → "응답 전송됨" 정적 텍스트 | 사용자 피드백 5단계 반영 |
| E-23 | 디자인 시스템 버튼 정합화 + dark backdrop variant 신규 (2026-05-28) | ✅ **(1) `.jt-btn` border 정정** — `tokens.css`·`viewer.html`·`Jitda Renewal.html` 3곳의 base 정의가 `border: 1px solid transparent` shorthand로 정의돼 있어 variant의 `border-color` override를 매번 깨뜨림. 모두 `border-width/border-style/border-color` individual property로 분해. **(2) viewer.html 인라인 `.jt-btn` 전체 재정의 폐기** — 기존엔 base 전체 복사 + `border-radius: var(--r-sm)` 만 다름. variant 충돌 원인. 이제 viewer-specific override는 `border-radius`·`border-radius`(sm) 두 줄로만 유지. tokens.css가 단일 사실 출처. **(3) 신규 variant `.jt-btn-danger-outlined-dark` + `.jt-btn-ghost-dark`** — E-4 풀스크린 다크 dim 위 secondary 버튼용. 라이트 backdrop의 jt-btn-danger-outlined·jt-btn-ghost 거울 반전(bg fill로 hover 표시, elevation 없음). **(4) `.on-dark` modifier (jt-btn-critical용)** — 기본 critical hover의 검정 elevation shadow(0 6px 20px rgba(20,19,15,0.35))가 다크 배경에서 안 보이는 문제 해소. `.jt-btn-critical.on-dark:hover` 는 helmet 노랑 halo glow(0 0 32px + 0 0 64px) 로 대체. **(5) v1·v2 voting body 버튼 클래스 기반화** — v1 거부 = `jt-btn-danger-outlined-dark`, v1 동의 = `jt-btn-critical on-dark`, v2 수락 = `jt-btn-critical on-dark`, v2 거절 = `jt-btn-ghost-dark`. inline은 size override(height/padding/fontSize/borderRadius)만 남기고 색·border·hover·active·focus는 모두 클래스에 위임 | 사용자 지적: "v1·v2 화면 버튼 호버 적용 안 됐다, 디자인시스템 따라 업데이트" + 후속 "샤이닝 버튼 배경 어두울 때 다른 hover 필요 — 지금은 검정 그림자라 안 보임" |

## 7-1. 폐기된 화면 / 옵션 (2026-05-26)

- ~~`e4-cooldown` 별도 화면~~ → 폐기. (당초 거절 안내 화면 푸터에 통합 → **2026-05-26 v2: 푸터 ring/재요청 버튼도 함께 폐기**, 7-1-1 참조)
- ~~`e4-prompt` 프롬프트 검토 화면~~ → 제거. 시간 압박 상황에서 본문 검토 UX 부적절.
- ~~voting 화면의 `[📄 프롬프트 보기]` 버튼~~ → 제거. 위와 동일 사유.
- ~~viewer ACTIONS `e4 ↔ e4-prompt` 와이어링~~ → 제거.
- ~~정족수 어드민 설정 옵션 (전원/과반수/1명)~~ → 만장일치 단일 룰.
- ~~10초 타임아웃~~ → 15초.
- ~~거절자 이름 명시 ("OOO님이 거절했어요")~~ → 고정 문구 "합의가 무산됐어요".
- ~~`failureReason: 'reject' | 'timeout'` prop 분기~~ → 동일 헤드라인이므로 prop 제거.

### 7-1-1. rejected 푸터 단순화 (2026-05-26 v2)

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| E-14 | 5초 RingTimer (helmet 44px) | **폐기** — 푸터에서 제거 | 무산 직후 재요청은 핵심 액션이 아님. 카운트다운 자체가 "재요청을 빨리 누르라"는 잘못된 어포던스 |
| E-15 | 비활성 `[재요청 (대기 중)]` 버튼 | **폐기** — 푸터에서 제거 | 동일. 캔버스 수정 없이 즉시 재요청해도 같은 무산이 반복될 가능성 높음 |
| E-16 | `[캔버스로 돌아가기]` 버튼 | **primary CTA로 격상** — `jt-btn-primary` (ink 배경 + 흰 글자) + padding 16×36 + fontSize 15.5 + arrowLeft 16 icon + drop-shadow | 단일 CTA로 시선 집중. 재요청은 캔버스 복귀 후 "전송 요청"을 다시 누르는 자연 흐름으로 통합 |

- 와이어링: viewer.html ACTIONS `'e4-rejected': { 'back-to-canvas': 'c4' }` 추가.
- 사용자 결정 인용: "5초뒤 재요청은 중요한 액션이 아니다. 타이머와 재요청 버튼을 삭제하고, 캔버스로 돌아가기 버튼이 더 눈에 띄게 변경해라" (2026-05-26).

## 7-2. 정의서 갱신 완료

`2026-05-20_디자인-리뉴얼-페이지-정의서.md:644-696` E-4 절:
- 컴포넌트 표 갱신 (프롬프트 보기 버튼 제거, 무응답 칩 추가, 재요청 ring 통합)
- 화면 상태 표 단순화 (voting · 동의 통과 · 합의 무산 3개)
- 사용자 액션 표 갱신 (프롬프트 보기/닫기 제거, 재요청 추가)
- E-4-prompt 별도 절 → 제거

`2026-05-18_동시편집-캔버스-기획.md`:
- v7 changelog · 거절 헤드라인 고정 문구 · 무응답 칩 정책 · 만장일치 단일 룰 모두 반영

## 7-3. 영향 없는 결정 (그대로 유지)

- 요청자 자동 동의 (디자인-리뉴얼-페이지-정의서.md:650)
- 오프라인 팀원 정족수 제외 (디자인-리뉴얼-페이지-정의서.md:654)
- ~~거부 후 5초 쿨다운~~ → **폐기 (7-1-1 참조)** — 카운트다운 자체가 잘못된 어포던스라 판단. 캔버스 복귀를 거치도록 흐름 변경하면 자연스러운 쿨다운 효과.

---

## 8. B 영역 모달 상단 스트립 어휘 부활 (2026-05-26)

### 8-0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| B-1 | B 영역 6개 모달 상단 `.jt-caution-strip` | **추가** (12px 노랑/검정 사선, 1.6s 무한 스크롤) | 비가역 전이 강조 — 운영자가 모달 진입 즉시 "주의 필요" 인지 |
| B-2 | Design System 폐기 룰 | **철회** — 모달 상단 한정 어휘로 정식 부활. L1170 DON'T 룰 → "모달 외부 사용 금지" 로 좁힘. L1103 섹션 설명도 부활 명시 | 사용자: "실수로 삭제됐다" — 폐기 결정 자체가 의도치 않은 변경이었음 |
| B-3 | 변형 3종 등록 — `.jt-caution-strip` / `.jt-caution-strip-static` / `.jt-ink-strip` | **신설** — Design System §09b MODAL TOP STRIP 카탈로그 추가 | 긴급도 위계 차등 (애니메이션 사선 > 고정 사선 > 단색 검정). 한 모달 = 한 변형 |

### 8-1. 적용 대상 (operator.jsx)

| 함수 | 모달 ID | 위치 |
|------|---------|------|
| `B2EndModal` | b2-end | operator.jsx:887 |
| `B2EndModalCountdown` | b2-end-countdown | operator.jsx:959 |
| `B2SkipTutorialModal` | b2-skip | operator.jsx:1054 |
| `B2TutorialStartConfirm` | b2-tutorial-start-confirm | operator.jsx:1126 |
| `B2TutorialEndConfirm` | b2-tutorial-end-confirm | operator.jsx:1161 |
| `B2HackathonStartConfirm` | b2-hackathon-start-confirm | operator.jsx:1202 |

### 8-2. CSS 토큰 (tokens.css + viewer.html + Renewal.html + Design System.html 4파일 동기)

```css
/* 베이스 — 3 변형 공통 */
.jt-caution-strip,
.jt-caution-strip-static,
.jt-ink-strip { height: 12px; width: 100%; flex-shrink: 0; }

/* 사선 패턴 — 애니메이션 / 고정 공통 */
.jt-caution-strip,
.jt-caution-strip-static {
  background: repeating-linear-gradient(
    -45deg,
    var(--c-helmet) 0 14.1421356px,         /* 스트라이프 폭 = 10√2 */
    var(--c-ink) 14.1421356px 28.2842712px
  );
  background-size: 40px 100%;                /* x축 한 주기 = 정확히 40px (정수) */
}

/* 애니메이션 — 한 방향 무한 스크롤 */
.jt-caution-strip {
  animation: jt-caution-scroll 1.6s linear infinite;
  will-change: background-position;
}
@keyframes jt-caution-scroll {
  0%   { background-position: 0 0; }
  100% { background-position: 40px 0; }      /* 정수 키프레임 → 솔기 없는 루프 */
}

/* 단색 검정 — 위계 절제 */
.jt-ink-strip { background: var(--c-ink); }
```

**솔기 없는 루프 설계 근거**:
- -45° 사선 패턴의 x축 한 주기 = `perpendicular_period / sin(45°) = perpendicular_period × √2`
- 14px 스트라이프 사용 시 x-주기 = `28√2 ≈ 39.5979797px` (무리수) → 서브픽셀 렌더링 정밀도로 1프레임 점프 발생 (사용자 보고: "좌측 끝에서 검정 사다리꼴이 조금 멀리 나왔다가 붙는" 현상)
- 스트라이프 폭을 `10√2`로 조정 → perpendicular_period = `20√2`, x-주기 = `20√2 × √2 = 40px` (정수)
- `background-size: 40px 100%` + `background-position: 0 → 40px` 키프레임 → 한 주기 = 한 타일, 정수 픽셀 키프레임으로 솔기 없음 (시각 차이는 ~1%, 식별 불가)

`prefers-reduced-motion` 환경에서는 애니메이션 비활성화 (정적 패턴 유지).

### 8-3. Design System 갱신 — 폐기 결정 철회 (2026-05-26)

`Jitda Design System.html` 갱신 내역:
- L70 주석: "caution-tape 어휘는 폐기됨" → "caution strip (2026-05-26 부활)"
- L1103 섹션 설명: 폐기 명시 삭제, 부활·변형 3종·모달 상단 전용 한정 명시
- L1170 DON'T 룰: "caution-tape 신규 사용 금지" 삭제 → 모달 외부 사용 금지로 좁힘
- L1170 직전 DO 룰 추가: "모달 상단 12px 경계 표시 한정"
- §09b에 MODAL TOP STRIP 카탈로그 신설 — 3 변형(애니메이션 사선/고정 사선/단색 검정) 라이브 시각 예시
- L1247 일반 DON'T 룰 "대각선 caution 스트라이프를 장식으로 쓰지 않기" 유지 — 새 정책과 호환 (장식 금지·모달 상단 전용 = 동일 메시지)
- `prefers-reduced-motion` 미디어쿼리에 `.jt-caution-strip` 애니메이션 비활성 처리 추가

### 8-4. 변형별 사용 가이드 (긴급도 위계)

| 변형 | 클래스 | 용도 | 현재 적용 |
|------|--------|------|----------|
| **애니메이션 사선** | `.jt-caution-strip` | 비가역 전이 모달 — 능동적 주의 환기 | B 영역 6개 모달 |
| **고정 사선** | `.jt-caution-strip-static` | 주의 필요하나 모션 과한 맥락 (저빈도·접근성 우선) | 미적용 (라이브러리만) |
| **단색 검정** | `.jt-ink-strip` | 가역 액션 — 모달 경계만 명시, 위험 강조 절제 | 미적용 (라이브러리만) |

룰: **한 모달엔 한 변형만**. 위계 — 애니메이션 > 고정 > 단색.

---

*검토자: 짓다 디자인 / 작성일: 2026-05-26 (E 영역 + B 영역 모달 caution 부활)*

---

## 9. Critical 버튼 — shine sweep 절제 + 정적 변형 도입 (2026-05-26)

### 9-0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| C-1 | `.jt-btn-critical-static` 신설 — 검정+노랑테두리 정적 | **추가** (4파일 동기) | shine 효과 과사용 해소. 대부분의 비가역 액션은 강조 어휘 절제 |
| C-2 | 기존 사용처 8곳 중 6곳 정적 변형으로 교체 | **변경** (operator.jsx 6 + dialogs.jsx 1) | "현재 쓰이고 있는 샤이닝 버튼이 너무 많이 쓰이네" — 사용자 피드백 |
| C-3 | E-4 합의 투표 "동의 · AI에 전송" | **shine 유지** (`.jt-btn-critical`) | 합의 투표 단일 CTA — 가장 무게 있는 액션, 모달 외부라 caution-strip 없음 |
| C-4 | C-1 종료 "갤러리로 가기 →" | **shine 신규 추가** — `kind: 'primary'` → `'critical'` | 해커톤 완료 후 최종 CTA, 종착점 강조 |
| C-5 | `@keyframes jt-btn-shine` 키프레임 개선 | **130% → -30% sweep** (이전 100% → 0%) | 빛띠가 항상 버튼 바깥에서 시작 → "갑자기 화면에 생겨버리는" 부자연스러움 제거 |

### 9-1. CSS 변경 (4파일 동기: tokens.css + viewer.html + Renewal.html + Design System.html)

```css
/* 베이스 — 두 변형 공통 */
.jt-btn-critical,
.jt-btn-critical-static {
  background: var(--c-stache);     /* 검정 */
  color: var(--c-helmet);          /* 노랑 텍스트 */
  border: 2px solid var(--c-helmet); /* 노랑 테두리 */
  font-weight: 700;
  letter-spacing: 0.02em;
}
.jt-btn-critical:hover,
.jt-btn-critical-static:hover { background: #000; }

/* shine sweep — critical 변형 전용 (한 화면 한 곳만) */
.jt-btn-critical { position: relative; overflow: hidden; }
.jt-btn-critical::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255,206,43,0.55) 50%, transparent 65%);
  background-size: 220% 100%;
  background-position: 130% 0;     /* 시작: 좌측 완전 바깥 (안 보임) */
  animation: jt-btn-shine 2.4s ease-in-out infinite;
}
@keyframes jt-btn-shine {
  0%   { background-position: 130% 0; }   /* 빛띠 우측 끝(image 65%) = container -13% → 완전히 보이지 않음 */
  55%  { background-position: -30% 0; }   /* 빛띠 좌측 끝(image 35%) = container 113% → 완전히 빠짐 */
  100% { background-position: -30% 0; }   /* dwell — 안 보이는 상태로 머묾 (다음 cycle까지) */
}
```

**진입 부자연 해소 — 빛띠 위치 계산**:
- background-image 너비 = container 너비의 220%, 빛띠 중심 = image의 50% 위치
- 이전 키프레임(100% → 0%) 시작 시: 빛띠 우측 끝이 container 23% 위치 → 화면 안쪽에 빛띠 일부가 보임 → "갑자기 생기는" 시각 효과
- 새 키프레임(130% → -30%): 시작/끝 모두 빛띠 전체가 container 바깥 → 진입·퇴장 buffer 확보. 시각적으로 빛이 "왼쪽 바깥에서 미끄러져 들어왔다가 오른쪽 바깥으로 빠지는" 자연스러운 sweep

### 9-2. 사용처 매트릭스 (현재 상태)

| 사용처 | 클래스 | 위치 | 이유 |
|--------|--------|------|------|
| E-4 합의 투표 "동의 · AI에 전송" | `.jt-btn-critical` (shine) | dialogs.jsx:638 | 합의 투표 단일 CTA — 가장 강한 액션 강조 |
| C-1 종료 "갤러리로 가기 →" | `.jt-btn-critical` (shine) | participant.jsx (kind='critical') | 해커톤 완료 종착 CTA |
| E-1 "저장하고 닫기" | `.jt-btn-critical-static` | dialogs.jsx:1000 | 일반 저장 — 정적 |
| B-2 6개 모달 confirm/proceed | `.jt-btn-critical-static` | operator.jsx (939·1034·1075·1145·1187·1221) | 비가역 전이 — 모달 상단 caution-strip이 위계 강조 |

**원칙**: shine 버튼은 **한 화면에 최대 1개**. 모달 상단 caution-strip이 있는 화면(B 영역 6개 모달)에서는 강조 어휘가 이미 충분하므로 정적 사용.

### 9-3. Design System.html 갱신

- L1148 헤더: "글로우 sweep" → "검정 + 노랑 테두리"로 정정 (정적/shine 두 변형 모두 포함)
- L1149 설명: 두 변형 사용 정책 명시 (shine은 한 화면 한 곳만)
- §09b CRITICAL BUTTON 데모: 정적 3종 + shine 2종 분리 카탈로그
- L1159 mono 라벨: 키프레임 130%→-30% sweep 정책 명시

---

## 10. A 영역 — 참가자/운영자 시각 메타포 분리 + 콘크리트 패드 신규 토큰 (2026-05-27)

### 결정 요약
A 영역 9개 화면(`a1`·`a1-invalid`·`a1-not-started`·`a1-ended` / `a2`·`a2-inflight`·`a2-popup` / `a3`·`a3-failed`)의 좌측 안내 패널을 **두 가지 메타포**로 갈라침. 우측 폼 카드는 두 메타포 공통(paper)으로 유지해 입력 가독성 보호.

| variant | 대상 | 좌측 패널 메타포 | CSS |
|---------|------|------------------|-----|
| `site` | A-1군 (참가자, 4 화면) | **작업 시작 전 원본** — `.jt-blueprint-bg`(ink + 32×32 흰 그리드) + 헬멧 노랑 outline tag(-1.5° 회전) + 흰 헤드라인 + JitdaMark mono | 기존 클래스 재사용 |
| `blueprint` | A-2/A-3군 (운영자, 5 화면) | **콘크리트 패드** — stone-2(#e6e3dd) 옅은 콘크리트 + stache 0.05 도면 라인(24×24) + 우상단 헬멧 0.08 옅은 라디얼 + stache outline tag + helmet-deep LED dot | `.jt-blueprint-studio-bg` 신규 |

### 사유 (Why)
- 기존 `AuthShell`은 9개 화면 모두 동일한 `.jt-blueprint-bg`(ink + 32×32 그리드)를 좌측 패널에 사용 → 시각 차이는 좌측 tag 문구 1줄과 우측 폼(노랑 OTP vs 검정 primary)뿐.
- `A2OperatorLogin`·`A3OAuthCallback`이 받는 `leftAccent="var(--c-blue-soft)"` prop이 `AuthShell` 내부에서 **소비되지 않는 dead prop**(destructure만 됨) — 시각적 구분 의도는 있었으나 미완.
- 사용자 요청: "참여자 로그인, 운영자 로그인 화면을 서로 다른 느낌으로 구분되게 한다" → 0.5초 내 흐름 인지가 목표.

### 시안 반복 (4회 → 최종)
| # | 시안 | 사용자 피드백 |
|---|------|---------------|
| 1 | site=paper+노랑 라디얼 / blueprint=ink+그리드 | 채택 안 됨(참가자 임팩트 부족) |
| 2 | site=검정+노랑 라디얼 / blueprint=blue-soft 청사진 | "노란색 그라데이션은 본 제품 컨셉에 어울리지 않는다" |
| 3 | site=작업 시작 전 원본으로 롤백 / blueprint=blue-soft 청사진 유지 | "블루프린트 보기에는 좋은데 다른 디자인 요소랑 잘 안 어울려서" |
| 4 | blueprint=helmet-soft 노랑 | "유치원 같다" |
| **5** | **blueprint=stone-2 콘크리트 패드** | **채택** ("이게 제일 낫네") |

### 변경 파일
1. **`tokens.css`** — `.jt-blueprint-studio-bg` 1개 클래스 신규(`/* A 영역 — 운영자 메타포 배경 */` 섹션). **신규 색 토큰 0개** — 기존 `--c-stone-2`·`--c-helmet`·`--c-stache` 재활용.
2. **`viewer.html`** — 동일 클래스를 인라인 `<style>`에 미러(자주 하는 실수 #4 회피 — tokens.css ↔ viewer.html ↔ Renewal.html은 인라인 다이버전스 패턴).
3. **`Jitda Renewal.html`** — 동일 클래스를 인라인 `<style>`에 미러.
4. **`Jitda Design System.html`** — §09 패턴 카탈로그(L1060~)에 CONCRETE PAD 4번째 항목 추가, grid-3 → grid-4.
5. **`auth.jsx`** — `AuthShell` 시그니처를 `{children, variant='site', leftHeadline, leftTag, leftBody, tabletMode}`로 확장. dead `leftAccent` prop 제거. variant별 분기(`isBlueprint = variant === 'blueprint'`)로 다음을 갈라침:
   - 좌측 배경 클래스: `jt-blueprint-studio-bg`(blueprint) ↔ `jt-blueprint-bg`(site)
   - JitdaMark `mono`: `false`(blueprint, 검정 헤드라인) ↔ `true`(site, 흰 헤드라인)
   - tag 박스: stache 1.5px outline + helmet-deep LED dot(blueprint) ↔ 헬멧 노랑 1.5px outline + -1.5° 회전(site, 원본)
   - 헤드라인 컬러: `var(--c-stache)` ↔ `#fff`
   - body 컬러: `rgba(20,19,15,0.68)` ↔ `rgba(255,255,255,0.7)`
   - aside `borderRight`: stache 0.10 hairline(blueprint) ↔ 없음(site, 원본)
   - **좌측 패널 하단 footer는 두 variant 모두 추가하지 않음** — 사용자 결정 "operator studio 이런 멘트 다 지워, 참가자처럼".
6. **9개 호출부**(`A1CodeLogin`·`A1CodeInvalid`·`A1NotStarted`·`A1Ended` → `variant="site"` / `A2OperatorLogin`·`A2GoogleInFlight`·`A2PopupBlocked`·`A3OAuthCallback`·`A3OAuthFailed` → `variant="blueprint"`). A2/A3 3개 호출부의 `leftAccent` prop 제거.

### A-1 부수 변경 (카피·레이아웃 정합)
- **a1 leftHeadline**: "코드 한 번이면 / 바이브 코딩 시작" → **"AI 해커톤에 / 오신 것을 환영합니다."** (사용자 결정).
- **a1 leftBody**: "미리 안내한 6자리 참여 코드를 입력하세요." 한 줄로 단순화 — "설치 없이 브라우저에서 바로 AI와 지을 수 있습니다." 줄 삭제.
- **a1-invalid leftBody**: "6자리 영문 대문자·숫자를 다시 확인해 주세요." 한 줄로 단순화 — "코드 카드의 0/O, 1/I 같은 혼동 문자는 발급에서 제외됩니다." 줄 삭제.
- **a1·a1-invalid 제목 영역 위치 정합**: 두 화면 모두 제목을 `{minHeight: 52, marginBottom: 20, display: 'flex', alignItems: 'flex-end'}` 컨테이너로 감쌈. h2 텍스트(~31px)와 `jt-tape-block`(~46px 회전+drop-shadow) 시각 영역 차이로 어긋난 NAME·CODE 시작 위치를 정확히 정합.

### 미수정 (의도적)
- **페이지정의서**(`2026-05-20_디자인-리뉴얼-페이지-정의서.md` §A): 컴포넌트·상태 명세이지 시각 사양이 아니므로 무수정.
- **화면상태정의서**: 라우트·상태 머신 — 무관.
- **viewer.html SCREENS/ACTIONS**: 라벨·와이어링 변경 없음 → 동기화 불필요.
- **다른 영역 JSX**(B·C·D·E·F): A 영역 한정 작업.

### 학습 (시안 4회 반복에서 도출)
**큰 면적은 무채색, 액센트 컬러는 작은 영역에 한정**.
짓다 브랜드의 다채로운 액센트(helmet/safety/blueprint/mint)는 작은 dot·outline·강조 영역에서 강력하지만, 좌측 패널 같은 큰 면적에 깔면 (a) 톤 인플레이션 — 액센트가 더 이상 액센트로 작동하지 않음, (b) 다른 화면 어휘와의 컨셉 충돌이 발생한다.

| 시안 | 큰 면적 컬러 | 실패 사유 |
|------|--------------|-----------|
| v1 paper+노랑 라디얼 | 노랑(우측 OTP 액센트와 중복) | 임팩트 부족 |
| v2 검정+노랑 라디얼 | 노랑 | "컨셉 안 어울림" |
| v2 blue-soft 청사진 | blueprint blue | "다른 디자인 요소와 안 어울림" |
| v4 helmet-soft 노랑 | helmet 노랑 면적 ↑ | "유치원 같음" |
| **v5 stone-2 콘크리트** | **무채색**(stone-2) + 점 액센트(helmet 0.08) | **채택** |

→ 향후 큰 면적 컬러 선택 시 무채색 토큰(`stone`·`stone-2`·`concrete`·`paper`·`ink`/`stache`) 우선 사용, 액센트 컬러는 작은 dot·outline·강조 영역에 한정.

### 검증 포인트 (향후)
- (a) 콘크리트 stone-2(#e6e3dd) ↔ paper(#faf9f6) 명도 대비 약 0.7:1 — 도면 라인 + borderRight stache 0.10이 좌우 경계 명확화. 도면 라인 없을 경우 두 면이 거의 같아 보일 수 있음(현 사양은 라인 있음 → OK).
- (b) 우상단 헬멧 0.08 라디얼이 v2의 "노란색 그라데이션 컨셉 안 어울림" 우려를 재유발하지 않을 정도로 옅은지 — 0.08 alpha는 거의 비가시 톤, OK.
- (c) blueprint variant tag(stache outline + helmet-deep dot)와 site variant tag(헬멧 노랑 outline)가 시각 어휘는 같되 톤 반전 — 두 화면 일관 패턴 유지.
- (d) site variant의 작업 시작 전 원본은 헬멧 노랑 outline(L-1.5° 회전)을 유지하므로, blueprint의 stache outline과의 시각 차이가 충분히 드러나는지(O — 참가자=노랑/짙은 배경, 운영자=stache/옅은 배경).

---

*검토자: 짓다 디자인 / 작성일: 2026-05-27 (E + B caution + Critical 정적 변형 + A 콘크리트 패드)*

---

## 11. B-2 튜토리얼 대기 — 페이지네이션 제거 + 메인 CTA shine 적용 (2026-05-26 → 2026-05-27 정정)

### 11-0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| 11-1 | `RosterView` 페이지네이션 제거 | **삭제** — `<RosterGrid teams={teams} />`로 전체 팀 한 화면 노출 | 운영자가 미접속/지연 참가자를 즉시 식별. 30팀 4열 그리드(8행)는 1280px artboard에 충분히 들어감 ⚠️ **2026-05-27 부분 철회 — §12 참조 (24팀/페이지로 재도입)** |
| 11-2 | b2-tutorial-waiting "튜토리얼 시작" 버튼에 `jt-btn-critical` (shine) 적용 | **변경** — 기존 `jt-btn-primary` → `jt-btn-critical` | 디자인 시스템에 이미 정의된 어휘 재사용. 화면 메인 CTA 강조 |
| 11-3 | ~~`.jt-btn-attention` 신설~~ | **철회** — 4파일에서 완전 제거 | 사용자 피드백: "이상하다 — 디자인시스템에 있는 샤이닝 써야지". 새 어휘 만들지 말고 기존 shine 어휘 재사용 |

### 11-1. RosterView 영향 범위 매트릭스 (⚠️ 2026-05-27 §12로 일부 갱신됨)

`RosterView`(mode='roster')는 두 화면에서 사용:

| 화면 | 적용 (~2026-05-26) | 2026-05-27 갱신 |
|------|------|------|
| `b2-tutorial-waiting` | 페이지네이션 제거 (30팀 전부 노출) | **24팀/페이지 + Pagination 재도입** (§12) |
| `b2-hack-waiting` | 페이지네이션 제거 (동일 UX) | **24팀/페이지 + Pagination 재도입** (§12) |

다른 mode (tutorial-progress / activity / summary) 의 페이지네이션은 그대로 유지 (12팀/페이지) — 해커톤 진행 중에는 상태가 동적이고 운영자 액션이 빈번하므로 그리드 길이 제한이 합리적.

### 11-2. Critical Action 위계 (현 상태)

| 어휘 | 클래스 | 강도 | 적용처 |
|------|--------|------|--------|
| **shine sweep** | `.jt-btn-critical` | 강 — 노란 빛띠 sweep | E-4 합의 투표 "동의 · AI에 전송", C-1 "갤러리로 가기 →", **B-2 "튜토리얼 시작"** (신규 추가) |
| **정적 critical** | `.jt-btn-critical-static` | 약 — 정적 검정+노랑 테두리 | B-2 6개 모달 (b2-tutorial-start-confirm 포함), E-1 "저장하고 닫기" |
| **primary** | `.jt-btn-primary` | 없음 — 단순 검정 | 일반 CTA (튜토리얼 종료, 일시정지, 재시작 등) |

룰: shine 버튼은 **한 화면에 최대 1개**. b2-tutorial-waiting에는 critical이 이 버튼 하나뿐이므로 원칙 부합.

화면→모달 흐름:
- b2-tutorial-waiting 화면의 "튜토리얼 시작" = `jt-btn-critical` (shine)
- 클릭 → b2-tutorial-start-confirm 모달의 "튜토리얼 시작" 확정 버튼 = `jt-btn-critical-static` (정적, 모달 상단 caution-strip이 강조 어휘 역할)

### 11-3. 자기 비판 — 도입했다가 철회한 이유

`.jt-btn-attention` (외곽 halo pulse) 도입 → 4파일에 클래스/키프레임 추가 → 사용자 거부 → 4파일에서 모두 제거.

**잘못된 판단의 근원**:
- 직전에 "샤이닝 너무 많이 쓰임" 피드백을 받고 `jt-btn-critical-static`을 도입한 직후라, 또 shine을 추가하는 게 모순적으로 보일까 우려했음
- 그래서 "shine보다 절제된 새 어휘"라는 자의적 해결을 시도

**놓친 부분**:
- 사용자의 진짜 의도는 "shine을 모든 곳에 쓰지 말고 **꼭 필요한 곳에만** 써라"였음 — 어휘 자체를 폐기하라는 게 아니었음
- shine 사용처 룰("한 화면 한 곳")만 지키면 추가 사용 OK
- **새 어휘 추가 = 디자인 시스템 일관성 손상**. 기존 어휘로 해결 가능한 문제에 새 어휘를 만들지 않는 게 디자인 시스템 원칙

**교훈** — 디자인 시스템 작업 룰:
1. 새 시각 어휘 도입 전 → 기존 어휘로 해결 가능한지 먼저 확인
2. "한 화면 한 곳" 같은 룰을 지키면 기존 어휘 추가 사용은 정당
3. 사용자 피드백("X 너무 많다")을 "X 자체 폐기"로 과해석하지 말 것

---

## 12. B-2 RosterView — 24팀/페이지 + 페이지네이션 재도입 (2026-05-27)

### 12-0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| 12-1 | `RosterView` 페이지네이션 재도입 | **추가** — `<RosterGrid teams={pagedTeams} /> + <Pagination />` | §11-1의 "30팀 = 상한" 가정이 60팀 행사(전북 240명) 케이스를 커버 못 함. mode 간 페이지네이션 정책 통일 |
| 12-2 | roster 기본 perPage = 24 (그 외 mode = 12) | **분기** — `DashboardShell`에서 `mode === 'roster' ? 24 : 12` | RosterRow(컴팩트 ~76px) vs 썸네일 카드(~210px) 높이 차이가 ~2.8배. 같은 본문 영역에 2배 들어감이 자연 |

### 12-1. 영향 범위

| 화면 | 변경 | 결과 (30팀 mock 기준) |
|------|------|------|
| `b2-tutorial-waiting` | RosterGrid `teams` → `pagedTeams` + Pagination | 2페이지 (24+6), 4열×6행 |
| `b2-hack-waiting` | 동일 | 동일 |
| `b2-tutorial-running` (mode='tutorial-progress') | 변경 없음 | 3페이지 (12+12+6), 4열×3행 |
| `b2-hack-running` (mode='activity') | 변경 없음 | 3페이지 (12+12+6) |
| `b2-hack-paused` (mode='activity') | 변경 없음 | 3페이지 |
| `b2-hack-ended` (mode='summary') | 변경 없음 | 3페이지 |

### 12-2. 구현 변경 (operator.jsx)

```diff
- function DashboardShell({ ..., page = 1, perPage = 12 }) {
+ function DashboardShell({ ..., page = 1, perPage }) {
+   const effectivePerPage = perPage ?? (mode === 'roster' ? 24 : 12);
    ...
-   const pagedTeams = teams.slice((page - 1) * perPage, page * perPage);
+   const pagedTeams = teams.slice((page - 1) * effectivePerPage, page * effectivePerPage);
    ...
-   const pageProps = { ..., perPage, ... };
+   const pageProps = { ..., perPage: effectivePerPage, ... };
  }

  function RosterView({ ..., pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
-   <RosterGrid teams={teams} />
+   <RosterGrid teams={pagedTeams} />
+   <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
  }
```

### 12-3. §11-1 결정을 뒤집은 근거 (Critical Analysis)

§11-1은 "30팀 4열×8행이 1280×820 artboard에 충분히 들어감"을 근거로 페이지네이션을 제거했다. 이 가정의 한계:

1. **30팀 ≠ 모든 행사 상한** — 전북교육청 해커톤(240명, 60팀) 등 큰 행사 케이스에서 60팀은 4열×15행 = 세로 ~1300px+, artboard 820 한참 초과. 스크롤 발생 → §11-1이 막으려던 "한눈에 미접속 식별" 가치 자체가 깨짐.
2. **mode 간 정책 불일치** — roster만 페이지네이션 없고 나머지 3 mode는 12팀/페이지로 분할. 운영자가 단계 전이할 때마다 그리드 동작이 달라지는 인지 부조화.
3. **`perPage` 분기로 두 가치 모두 보존** — roster=24 (컴팩트 카드 4열×6행, 한 페이지 안에 60% 노출), 미리보기 mode=12 (썸네일 카드 4열×3행). RosterRow가 ActivityRow(LivePreview 포함)보다 ~2.8배 짧으므로 2배 노출이 자연.

### 12-4. 검증 필요 사항

- (a) **60팀 행사 실측** — 24팀/페이지 = 60팀 → 3페이지. 운영자가 미접속 식별을 위해 페이지를 넘기는 동작이 실제 운영 시나리오에서 허용 가능한지? 한 화면에 압축(예: 6열×10행으로 60팀 노출)이 더 나은 옵션일 수 있음.
- (b) **카드 폭** — 4열 `minmax(280px, 1fr)` 유지. 6열로 축소 시 멤버 칩 wrap 깨질 가능성 (4명 팀 칩 2줄로 늘어남). 현 유지.
- (c) **Pagination 위치 일관성** — 다른 mode(TutorialProgressView·ActivityView·SummaryView)의 Pagination은 본문 하단. RosterView도 동일 위치라 일관성 OK.

---

## 13. B-2 RosterView — 카드 압축 (아바타 도트) + 미접속 필터 (B+E 결합, 2026-05-27)

### 13-0. 변경 사항 한눈에 보기

| # | 항목 | 결정 | 사유 |
|---|------|------|------|
| 13-1 | RosterRow 멤버 표시: 이름 칩 → 22px 성씨 미니 아바타 | **압축** — 22px 원형 아바타, 성씨 1글자(흰색 mono 11/700), 색=성씨 hash로 6색 토큰 매핑 / 미접속=stone bg + dashed outline + opacity 0.7 | 카드 높이 76→60px (~21% 감소, 도트 8px안 48px → 사용자 피드백 "너무 간소화" → 아바타로 보강). E-4 `TeammatePortrait`(60px) 미니어처 어휘 재사용 |
| 13-2 | RosterGrid 컬럼: minmax(280→190px) | **6열로 확장** | 1280 artboard - 64 padding = 1216 / 6열 ≈ 200px 카드. 4명 팀 도트 4×8=32px만 차지해 폭 압축 가능 |
| 13-3 | perPage: 24 → 60 (§12 갱신) | **확장** | 6열×10행 = 60팀 한 화면. 전북 60팀 행사 1페이지 노출 |
| 13-4 | Pagination 조건부 렌더: `totalTeams > perPage` 시에만 | **숨김 조건 추가** | 60팀 이하 행사는 페이지네이션 영역 자체 제거 → 시각 노이즈 축소 |
| 13-5 | RosterView 상단 필터 칩: [전체 N] [미접속 M] | **추가** — `tutorial-progress` stepChips 동일 패턴 | 운영자 실제 task("누가 안 들어왔지?") 직결. 60팀 중 미접속 5팀이면 1초 안에 식별 |

### 13-1. §12 정책 부분 갱신 — 사용자 결정 경로

1차(§11-1, 2026-05-26): 페이지네이션 제거, 30팀 한 화면 → 60팀 행사 미대응
2차(§12, 2026-05-27): 24팀/페이지 + Pagination 재도입 → mode 간 일관성 회복
**3차(§13, 본 문서)**: B(아바타 도트 압축) + E(미접속 필터) → 60팀 1페이지 + task 직결

사용자 직접 결정: "b + e로 가자", "[전체] [미접속] 2개 칩 + perPage=60".

### 13-2. 영향 화면

| 화면 | 변경 | 시각 결과 (30팀 mock) |
|------|------|------|
| `b2-tutorial-waiting` | RosterRow 도트화 + 6열 + 필터 칩 | 6열×5행, 본문 위쪽 50% 노출, Pagination 숨김 |
| `b2-hack-waiting` | 동일 | 동일 |

다른 mode(tutorial-progress·activity·summary)는 변경 없음 — 썸네일 카드(~210px)는 압축 어휘 부적합(LivePreview가 시각 정보의 1순위).

### 13-3. RosterRow 압축 카드 구조 (2026-05-27 아바타 보강)

```
┌──────────────────────────┐  ← 폭 ~200px, 높이 60px (측정 63.2px)
│ 터미널 사파리      4/4   │  ← fontSize 12.5, mono 카운트
│ ㉠ ㉡ ㉢ ㉣              │  ← 22px 성씨 미니 아바타 (색=성씨 hash 6색)
└──────────────────────────┘
```

- 아바타: `width:22 height:22 borderRadius:50%`. 접속 = 색 배경(`ROSTER_AVATAR_PALETTE[name.charCodeAt(0) % 6]`) + 흰 mono 11/700 성씨. 미접속 = stone bg + dashed hairline outline + opacity 0.7 + muted 성씨.
- 6색 팔레트: coral / blue / mint / amber / helmet-deep / safety — E-4 `TeammatePortrait`(dialogs.jsx:512)의 4색 토큰 어휘 + 2색 확장. 같은 성은 항상 같은 색(deterministic).
- `<span title={`${name} · ${state === 'on' ? '접속' : '미접속'}`} />` — 호버 시 OS 툴팁으로 이름·상태 노출 (성씨 1글자만으로 식별 부족할 때 보조).
- 카운트 색: 전원 접속이면 mint, 한 명이라도 미접속이면 muted(회색).

#### 진화 경로 (이름 식별성 ↔ 압축 균형)

| 단계 | 멤버 표시 | 카드 높이 | 사용자 피드백 |
|---|---|---|---|
| §12 (2026-05-27 오전) | 이름 칩 (mint-soft bg + 4px dot + 이름) | 76px | "더 압축할 수 있으면 좋을텐데" |
| §13 v1 (오후) | 8px 도트 only (호버 툴팁) | 48px | "지금은 너무 간소화됐네" |
| **§13 v2 (현행)** | **22px 성씨 미니 아바타 (6색 hash)** | **60px** (측정 63.2) | 채택 |

### 13-4. 필터 칩 패턴 (RosterView 상단)

```
접속 상태  [전체 30]  [미접속 14]
           ────────   ──────────
           ink bg     canvas outline
           활성       비활성
```

- `tutorial-progress` mode의 stepChips와 100% 동일 패턴 — 단일 사실 출처: `jt-btn-sm` + 활성/비활성 bg 분기.
- `data-action="filter-all"` / `"filter-offline"` 와이어링 — 정적 mock에선 시각만, 실제 앱은 클릭 시 pagedTeams가 미접속 팀으로 좁혀짐.
- 카운트 산출: `offlineCount = teams.reduce((n, t) => n + (t.members.some(m => m[1] !== 'on') ? 1 : 0), 0)`. 한 명이라도 미접속인 팀.
- "접속" 칩은 일부러 추가 안 함 — mint 도트로 이미 시각 자명. 필터 종류 늘리면 미세하게 따고들지 못함.

### 13-5. 잃은 것 vs 얻은 것

| 잃은 정보 | 얻은 것 |
|---|---|
| 멤버 이름 본문 노출 (호버 시 툴팁으로 복원 가능) | 한 화면 30→60팀 (×2) |
| `mint-soft` 칩 배경의 컬러풀함 | 미접속 식별 시간 ↓ (필터 칩 1클릭) |
| 멤버별 칩 단위 클릭 가능성 (현 디자인 미사용) | 60팀 행사 1페이지 (Pagination 영역 제거) |

### 13-6. 검증 필요 사항 (Critical Analysis)

- (a) **호버 툴팁 의존성** — 멤버 이름 확인이 호버 only가 됨. 운영자가 "○○ 참가자 코드 알려달라" 요청에 즉답 곤란 (호버는 키보드/터치 환경에서 약함). 정말 빈번한 task면 별도 참가자 검색 화면(예: `b2-roster-search`)이 필요할 수 있음 — §11 GAP과 같은 맥락의 미해결.
- (b) **필터 칩 정적 mock** — 클릭 시 실제 필터링은 viewer에서 시뮬레이트 안 됨(정적 active flag). 실제 앱 구현에서 pagedTeams 필터링 + 페이지 리셋(page=1) 로직 추가 필요.
- (c) **60팀 폼 팩터 — 아바타 도입으로 여유 사라짐** — 카드 측정값 63.2px × 10행 + gap 8px×9 = 704px + 헤더~150 + 필터 칩 ~40 + 제목 ~36 ≈ **930px**. 1280×820 artboard 기준 **약 110px 초과**. 대시보드 본문은 `overflow:auto`(operator.jsx:357)라 60팀 시 본문 스크롤 발생 — "60팀 1페이지 노출" 가치는 시각상 부분 깨짐(스크롤 필요). 대응 옵션: (1) perPage를 48로 줄여 8행만 한 화면 + Pagination 다시 노출(perPage=48이면 30팀 mock에서도 1페이지), (2) 카드 폭 좁혀 7열로(190→160px, 60팀=7열×9행=63팀) — 7명 팀 칩 wrap 깨질 우려는 짓다 룰상 4인 팀 상한이라 무관. **현 채택**: 옵션 0(스크롤 허용) — 사용자가 "사람 아이콘으로라도 표시"를 우선 요청. 60팀 실측 후 재논의.
- (d) ~~"미접속" 정의 모호~~ — **결정 (2026-05-27, 사용자)**: "한 명이라도 미접속한 팀" 을 미접속 팀으로 카운트. 4인 팀 1명 미접속 = 미접속 팀. 1차 단순성 우선 — `noneOnCount`(전원 미접속) 별도 필터는 추가하지 않음. 페이지정의서 §B-2 ⑦b 본문에 명시.

### 13-7. 새로고침 버튼 (2026-05-27 추가)

사용자 결정: "미접속 여부 검토 = 실시간 or 새로고침 버튼 — 새로고침 버튼은 어쨋든 있어야할듯함".

| 항목 | 결정 |
|---|---|
| 위치 | `RosterView` 헤더 좌측 — "참가자 접속 현황 N팀 · ● 실시간 · 방금 갱신" 라벨 옆 |
| 어휘 | `Icon.refresh(13)` + `jt-btn-ghost jt-btn-sm` — slate 톤 ghost |
| 와이어링 | `data-action="refresh-roster"` |
| 정책 | 실시간(WebSocket 푸시) + 수동 새로고침 **이중**. 실시간이 기본, 새로고침은 연결 끊김·지연·운영자 화면 백그라운드 복귀·"왜 변화 없지?" 의심 시 명시적 동기화 트리거 |
| "방금 갱신" 라벨 | mono 11px muted — 마지막 데이터 수신 시각 (예: "방금", "5초 전", "1분 전") |

**왜 항상 노출인가**: WebSocket이 정상이어도 운영자 멘탈 모델상 "정말 최신인가?" 검증 손잡이가 필요. 짓다 디자인 시스템의 다른 화면(D-1 갤러리·D-2 라이브 패널)에는 명시적 새로고침이 없는데, RosterView는 운영자의 **실시간 task**(누가 입장 안 했나)를 1초 단위로 결정하는 화면이라 특별. 진행 mode(activity)에는 활동 상태가 색·도트 애니로 반영되므로 같은 손잡이 불필요 — roster mode 한정.

### 13-8. 아바타 호버 디자인 툴팁 (2026-05-27 추가)

사용자 결정: "호버시 이름 나오는 디자인도 추가해야해". §13 v2(성씨 미니 아바타)에 OS `title` 속성으로만 의존하던 것을 짓다 어휘 디자인 툴팁으로 보강.

| 항목 | 결정 |
|---|---|
| 트리거 | `onMouseEnter`/`onMouseLeave` (useState 기반 — tokens.css 무수정) |
| 어휘 | ink bg + 흰 글자, padding 5/9, borderRadius 4, fontSize 11/500, mono ON/OFF 칩, 6px 화살표 |
| 내용 | `{이름}` + `{ON|OFF}` 칩 (ON=mint bg + ink, OFF=glass white) |
| 위치 | 아바타 위 (top), 가운데 정렬, 6px gap |
| 병행 | OS `title` 속성도 유지 — 키보드 포커스·터치 환경에서도 노출 |
| 영향 | RosterRow 안 인라인 아바타 마크업 → `<RosterAvatar name on />` 컴포넌트 추출 |

**왜 짓다에 디자인된 툴팁이 없었나** (§13-8 자기 비판): 짓다 전체 디자인 시스템에서 디자인된 툴팁은 본 작업이 **첫 사례**. 그동안 `title` 속성에 의존(AppHeader·필터 칩 등). 이유: 짓다는 1280×820 단일 artboard 디자인 도구라 hover 인터랙션 시뮬레이션 부담 → JSX state로 가벼이 구현. **향후**: 같은 패턴이 D-1·D-2 등에서 필요하면 `<JitdaTooltip>` 공용 컴포넌트로 승격 검토. 현재는 RosterAvatar 안에 인라인 — 짓다 어휘 단일 사용처.

**검증 포인트**:
- (a) 호버 툴팁이 카드 그리드 안에 갇혀 잘릴 가능성 — `position: absolute` + 부모 카드 `overflow: hidden` 없으므로 OK이나, 첫 행 카드는 상단으로 솟아오를 자리 충분 확인 필요 (24px 여유)
- (b) 마우스 빠른 이동 시 깜빡임 — onMouseEnter/Leave는 즉시 토글이라 transition 없음. 0ms = 정확하지만 시각 노이즈. fade 200ms 추가 검토(2차)
- (c) "방금 갱신" 라벨이 정적 mock에선 항상 "방금" — 실제 앱에서는 lastUpdatedAt 상태 + setInterval로 1초 단위 갱신 필요

---

*검토자: 짓다 디자인 / 작성일: 2026-05-26 (E + B caution + Critical 정적 변형 + A 메타포 분리), 2026-05-27 정정 (B-2 메인 CTA를 shine으로 통합, attention 어휘 철회), 2026-05-27 §12 (RosterView 24팀/페이지 + Pagination 재도입), 2026-05-27 §13 v1/v2 (RosterRow B+E 압축 → 성씨 아바타), 2026-05-27 §13-7/8 (새로고침 + 호버 디자인 툴팁 + 미접속 기준 확정), 2026-05-27 §14 (B-2 확인 모달 6종 외곽 테두리 통일 — amber/mint/hairline-strong → 1px hairline. caution strip이 단독 경고 신호), 2026-05-27 §15 (E-7 참가자 종료 카운트다운 오버레이 신설 + C-1 팀 정보 예외 케이스 viewer 4종 + RosterAvatar 호버 툴팁 가독성 정정)*

---

## §15. E-7 참가자 종료 카운트다운 + C-1 팀 정보 예외 케이스 + RosterAvatar 호버 가독성 (2026-05-27)

### 배경
사용자가 같은 세션에서 짚은 세 갭을 한 묶음으로 처리. 운영자가 [종료] 후 30초 유예 동안 참가자가 보는 화면이 정의 안 됨(b2-end-countdown 운영자 모달이 "참가자 화면 미리보기" 라벨로 약속한 컴포넌트가 실제로는 부재), C-1 팀 정보 패널이 학교 현장 변동성을 표현 못 함, RosterAvatar 호버 툴팁의 ON/OFF 칩 두 색 조합 모두 가독성 미달.

### 변경표
| # | 영역 | 변경 |
|---|---|---|
| 15-1 | E-7 신규 화면 | `dialogs.jsx` 에 `E7EndingCountdown` + Body 컴포넌트 추가. E-6Paused 거울 패턴(JitdaToolbar + CanvasBackdrop + 84×84 ring + E4Headline + E4Divider + 상태 칩), safety orange 어휘로 교체. CTA 없음. `viewer.html`에 `e7-ending` 등록. |
| 15-2 | C-1 MOCK 분리 | `participant.jsx` 라인 24의 인라인 team 객체 → 모듈 상수 3종(`MOCK_TEAM_STANDARD`/`MOCK_TEAM_LONG_NAME`/`MOCK_TEAM_MANY_MEMBERS`). `C1TeamRoom`에 `team` prop 추가(기본값 STANDARD). |
| 15-3 | C-1 viewer edge | `viewer.html`에 `c1-long-name`·`c1-many-members`·`c1-ended-long-name`·`c1-ended-many-members` 4종 등록. |
| 15-4 | 버그 수정 | `참가자 4명` 리터럴 → `참가자 {team.members.length}명` 동적화. |
| 15-5 | 팀명 wrap | 팀명 div에 `wordBreak: 'keep-all'` + `WebkitLineClamp: 2` — 한국어 단어 단위 break, 2줄까지 wrap, 3줄 이상 ellipsis. |
| 15-6 | RosterAvatar ON/OFF 칩 시멘틱 분리 | `operator.jsx:867–875` 두 칩 모두 `color: '#fff'`로 통일하되 배경은 시멘틱 분리 — ON=`var(--c-mint)` (긍정·접속), OFF=`var(--c-rose)` (부정·미접속). 초기 안은 OFF→stone+ink(중성)였으나 사용자 추가 피드백 "on이랑 off 너무 비슷, 칩 색 다르게 + 글씨 흰색"으로 rose(차분한 빨강)로 변경. ON/OFF가 한눈에 구분되고 두 칩 모두 흰 글자로 가독성 통일. |

### E-7 디자인 결정 메모
- **링 색상**: safety orange(`var(--c-safety)`) — operator.jsx:1078–1097의 b2-end-countdown 링과 동일 어휘. E-6 helmet 노랑과 명확히 구분되어야 "종료 직전" vs "일시정지" 메타포 충돌 방지.
- **링 크기**: 84×84 (E-6와 동일, operator의 80px를 풀스크린 위계로 확대). 중앙 mono 32px "22" — 정적 프레임 1개만 표시(타이머 없음 정책).
- **카피 톤**: "해커톤이 곧 종료됩니다" + "작업은 자동으로 저장되고 갤러리에 공개돼요" — 운영자 모달과 평행하면서 참가자에게 안심(저장됨) + 다음 행동 단서(갤러리) 제공.
- **상태 칩**: E-6 "운영자의 재시작을 기다리는 중"의 거울인 "운영자가 종료를 마무리하는 중" — 펄스 도트만 helmet→safety 교체. 능동적 행위(운영자 행위)를 직접 칭함으로써 참가자 "내가 뭘 해야 하지?" 불안 해소.
- **참가자 액션 부재**: E-6와 동일하게 CTA 없음. "[종료 취소]"는 운영자 모달에만 존재하며 참가자에겐 시각 단서로도 노출하지 않음(잘못된 기대 형성 방지).

### C-1 팀 정보 변형 디자인 결정 메모
- **긴 팀명**: "사이버보안 챌린지 우승팀 9조 - 디지털선도학교"(27자) — 학교 해커톤 현실(소속 + 조 번호 + 부서). 360px aside에서 fontSize 20px / lineHeight 1.25 / 2줄 wrap = 약 50px 차지(기본 4줄 제한 24px 대비 26px 증가). 좌측 본문 레이아웃엔 영향 없음(grid 1fr 360px 고정).
- **다인팀 7명**: 6~8명 범위는 학교 현장에서 동아리·반 단위 팀에서 등장. 스크롤 발생(aside flex 1 + overflow auto)으로 디자인은 자연 대응. "팀원 7명"·"X / 7 접속 중" 카운트 동적화로 정합.
- **1인팀·대기실 ② 변형**: 이번 범위 외 — 운영자 mock(operator.jsx:151–160)엔 solo 9건 등록돼 있어 후속 검토 필요. 대기실 ②는 ①과 레이아웃 동일하므로 시각 검증 우선순위 낮음.
- **wordBreak `keep-all`**: 한국어 어절 단위 break — 영문 단어(`Cybersecurity`) 강제 break는 발생하나 한국어 일반 케이스에선 자연스러운 줄바꿈.

### RosterAvatar 호버 가독성 디자인 결정 메모
- **사용자 지적 1차**: (1) "off일때 호버 반투명인거 너무 가독성 떨어져" — glass 흰 칩 + 옅은 흰 텍스트가 ink 배경 위에서 명도차 1.2:1 수준, (2) "초록색에 검정글씨도 가독성 떨어져" — mint(`#0a8a5c`) + ink는 명도차 1.8:1로 WCAG AA(4.5:1) 미달.
- **1차 안 (AI 제안)**: ON=`mint + 흰색`, OFF=`stone + ink` — 가독성은 둘 다 통과(AA·AAA)하나 톤이 비슷(둘 다 무채색·중성)해 시멘틱 분리가 약함.
- **사용자 2차 피드백**: "on이랑 off 너무 비슷, 칩 색 다르게 + 글씨 흰색" — 가독성 외에 *상태 시멘틱*도 즉시 식별되어야 한다는 요구.
- **최종 결정**: ON=`mint + 흰색` (긍정·접속·생성형 그린) / OFF=`rose + 흰색` (부정·미접속·차분한 빨강). 두 칩 모두 흰 글자 통일로 가독성 보장 + 배경색 hue 차이로 시멘틱 즉시 분리. 흰 글자 통일은 ON/OFF 시각 위계 평등화(어느 한쪽이 더 강조되지 않음).
- **rose 선택 근거**: safety orange는 너무 긴급, ink는 시멘틱 모호, stone은 중성. rose는 "비활성" 의미를 차분히 전달하면서 mint와 명확히 분리되는 보색 계열.
- **다른 RosterAvatar 외관 무수정**: 사용자 지적은 *호버 툴팁* 한정. 아바타 자체의 OFF 표기(dashed border + opacity 0.7 + muted text)는 변경 없음 — 기본 노출 상태이고 충분히 식별 가능.

### 검증 포인트
- (a) E-7 safety orange ring + halo가 K-12 교사에게 "긴급 상황 발생" 으로 잘못 읽히는지(실 행사 검증) — 운영자 b2-end-countdown 링과 시각 어휘 일치시켰으므로 이중 노출 시 일관성은 OK.
- (b) E-7과 E-4(합의 투표) / E-5(AI 선택지 투표)가 동시에 떠야 하는 케이스의 우선순위 — 현 디자인 미정의. 후속 결정 필요.
- (c) C-1 27자 팀명이 다른 브라우저(특히 Safari)에서 `wordBreak: keep-all` 동작 차이 — Chromium/Firefox는 검증됨, Safari는 실측 필요.
- (d) RosterAvatar 호버 시 mint+흰색 ON 칩이 ink 배경에서 contrast halo로 보일 가능성(흰 글자가 mint 위에서도, 어두운 ink 배경의 밝은 칩으로도 강조됨) — 인지 부담 증가 vs 식별성 향상 trade-off.

---

## 14. B-2 신규 화면 `b2-roster-detail` — RosterRow 카드 클릭 → 팀 상세 모달 (2026-05-27)

사용자 결정: "각 카드 누르면 작은 모달로 팀에 소속된 인원들과 접속상태 보여줘. c1의 요소 활용해".

### 14-0. 변경 요약

| # | 항목 | 결정 |
|---|------|------|
| 14-1 | 신규 화면 `b2-roster-detail` | B 영역 14→15, 총합 49→50 |
| 14-2 | `RosterTeamDetailModal` 컴포넌트 | C-1 `C1TeamRoom` 우측 팀원 패널 어휘 재사용(28px 아바타·이름·PresenceDot·범례) |
| 14-3 | `B2RosterDetail` 셸 | DashboardShell(roster mode) 뒷배 블러 + 백드롭 + 모달 중앙 |
| 14-4 | 카드 와이어링 | RosterRow는 이미 `data-action="open-team"` + `jt-card-interactive`(2026-05-27 시스템 토큰 작업에서 적용됨). viewer ACTIONS 매핑만 추가 |
| 14-5 | 시뮬 데이터 | PENDING_TEAMS[2] (404 NOT FOUND, 4명 중 2명 미접속) — 접속/미접속 두 상태 한 화면 시각화 |

### 14-1. C-1 어휘 재사용 매핑

| C-1 (참가자 팀 대기실) | B-2 RosterTeamDetailModal (운영자 모달) | 차이 |
|---|---|---|
| 우측 `<aside>` 패널 전체 | 380px 흰 카드 모달 | aside → 카드 (모달 경계 명시) |
| "내 팀" eyebrow | "팀 상세" eyebrow | 운영자 컨텍스트 |
| 팀명 display 20px | 동일 | — |
| "M / N 접속 중" mono | 동일 | — |
| 멤버 행 28px 아바타 + 이름 + PresenceDot | 동일 | `m.name === team.me` "나" 표시 제거(운영자는 팀원 아님) |
| PresenceDot 3상태 | 2상태(on/off) | B-2 데이터는 2상태 튜플(`[name, 'on'|'off']`) |
| 푸터 범례 🟢/🔘/⬜ | 색 도트 + 텍스트 ● 접속 / ● 미접속 | 이모지 → 색 도트(디자인 시스템 일관성) |
| 멤버 = `{name, color, online}` 객체 | `[name, state]` 튜플 + `rosterAvatarColor(name)` hash | 어휘 일치를 위해 모달 내부에서 변환 |

### 14-2. 와이어링 (viewer.html ACTIONS)

```
b2-tutorial-waiting:  open-team           → b2-roster-detail
b2-hack-waiting:      open-team           → b2-roster-detail
b2-roster-detail:     close-roster-detail → b2-tutorial-waiting (또는 진입 화면)
```

같은 `open-team` 액션명을 두 화면에서 공유 — ACTIONS 맵은 출발 화면 ID 기준이라 충돌 없음.

### 14-3. 검증 결과

- ✅ viewer 직접 URL (`?id=b2-roster-detail`) — 모달 정상 렌더
- ✅ 카드 클릭 트랜지션 — `b2-tutorial-waiting`에서 첫 카드 클릭 시 URL이 정확히 `b2-roster-detail`로 전환
- ✅ 접속/미접속 두 상태 시각화 명확 (mint halo vs 옅은 muted dot, 아바타 opacity 0.45)
- ✅ 백드롭 + X 모두 `close-roster-detail` 동작
- 콘솔 0 에러

### 14-4. 검증 필요 사항 (Critical Analysis)

- (a) **모달 width 380px가 5명+ 팀에서 OK?** — 짓다 룰상 1~4인 팀 상한이므로 무관. 향후 룰 변경 시 재검토.
- (b) **진행 mode(activity)에도 같은 모달 노출 정책 일관성?** — 현 와이어링은 roster 2개 화면만. ActivityRow는 LivePreview 썸네일이라 클릭 시 다른 동작(프로젝트 미리보기)이 자연스러울 수 있음 — 후속 결정 필요.
- (c) **백드롭 클릭 시 복귀 화면 모호** — viewer는 항상 `b2-tutorial-waiting`으로 가지만, 실제 앱은 `b2-hack-waiting`에서 진입했다면 거기로 가야 함. 진입 화면 state 추적 필요.
- (d) **C-1과 동일 어휘 사용 → 운영자가 "참가자 화면"으로 오인할 가능성** — 헤더 eyebrow "팀 상세" + X 닫기 버튼이 모달임을 명시하나, 시각 디자인이 90%+ 같아 헷갈릴 여지 있음. 7/13 연수 운영자 시연 관찰 권장.
- (e) **시뮬 팀 선택** — viewer 정적 mock이라 항상 PENDING_TEAMS[2]. 실제 앱은 클릭한 카드의 팀 데이터 동적 전달 필요.

---

*검토자: 짓다 디자인 / 작성일: 2026-05-27 (§14 b2-roster-detail 신규 — RosterRow → 팀 상세 모달, C-1 어휘 재사용, 화면 총합 49→50)*

---

## 15. 공용 `RosterMemberRow`·`RosterLegend` — B-2 모달 + C-1 멤버 어휘 통일 + 접속/미접속 시각 강화 (2026-05-27)

사용자 피드백 4종:
1. "도트가 이름 한참 오른쪽 떨어져 들어옴" → 우측 도트 폐기, **아바타 우하단 인디케이터** 로 통합 (SNS 패턴)
2. "성 아이콘 흐리게 나오는 것도 잘 안 띈다" → 행 전체 bg + 이름 색까지 차별화
3. "줄별 호버 안됨" → useState hover bg
4. "C-1 '나' 표시가 호버처럼 보임" → 좌측 helmet 액센트 바 + "나" 칩(helmet-deep solid + 흰 글자)
5. (추가) "아래쪽 불 디자인이 위쪽에 쓰인것과 달라" → 푸터 🟢🔘⬜ 이모지 폐기, 도트 어휘 통일

### 15-0. 변경 요약

| # | 항목 | 결정 |
|---|------|------|
| 15-1 | `RosterMemberRow({name, color, state, isMe})` 신규 | shared.jsx 공용. B-2 모달 + C-1 동일 어휘 |
| 15-2 | `RosterLegend({states})` 신규 | 2/3 상태 가변, 멤버 행 인디케이터와 같은 색 도트 |
| 15-3 | 인디케이터 도트 위치 | 우측 끝 → **아바타 우하단 9px** (흰 ring으로 분리, SNS 패턴) |
| 15-4 | 행 차별화 | 접속=투명 / 미접속=rgba(20,19,15,0.025) + 이름 muted / 호버=rgba 0.05 |
| 15-5 | C-1 "나" 표시 | helmet-soft + border 박스 → helmet-soft bg + **좌측 3px helmet-deep 세로 액센트 바** + **"나" mono caps 칩(helmet-deep + 흰 글자)** |
| 15-6 | C-1 푸터 어휘 통일 | 🟢🔘⬜ 이모지 → 멤버 행 인디케이터 동일 색 도트 |

### 15-1. RosterMemberRow 구조

```
┌──────────────────────────────────────┐
│  [성] 김민준                          │  ← 접속: 흰 bg, 진한 이름, 우하단 mint dot
│  [성] 박지호                          │  ← 미접속: 옅은 bg, muted 이름, 우하단 회색 dot
│ │[성] 최지유  [나]                    │  ← isMe: 좌측 helmet 액센트 + helmet-soft bg + "나" 칩
└──────────────────────────────────────┘
```

- 아바타 28px + 우하단 9px 인디케이터 (흰 2px ring으로 분리)
- 인디케이터 색: `on=mint solid` / `pending=paper bg + dashed border` / `off=muted solid`
- 호버: useState 기반 rgba(20,19,15,0.05) bg
- isMe 우선 — helmet-soft bg가 hover 차별화를 덮음(의도)

### 15-2. C-1 "나" 표시 진화

| 단계 | 디자인 | 사용자 인식 |
|---|---|---|
| 이전 | `bg: helmet-soft` + `border: 1px solid helmet-deep` (테두리 박스) | "호버된 상태처럼 보임 · 직관적 안 됨" |
| **현행** | `bg: helmet-soft` + **좌측 3px helmet-deep 세로 액센트 바** + **"나" mono caps 칩** (helmet-deep bg + 흰 글자) | "내가 이 사람"임이 명확 |

좌측 액센트 바는 list-item 강조의 보편 패턴(이메일 클라이언트 미읽음 표시 등)이라 호버 어휘와 시각 충돌 없음. "나" 칩은 mono uppercase + helmet-deep solid라 다른 라벨들과 구분.

### 15-3. 영향 화면

| 화면 | 변경 |
|---|---|
| `b2-roster-detail` | RosterMemberRow 사용 + 푸터 RosterLegend |
| `c1`, `c1-after-tutorial`, `c1-ended` | 인라인 멤버 행 폐기 → RosterMemberRow + isMe 분기. 푸터 RosterLegend로 통일 |

총 4 화면 영향. `PresenceDot`(participant.jsx)은 호출처 없어졌으므로 cleanup 대상 (향후).

### 15-4. 검증 결과

- ✅ B-2 모달 (404 NOT FOUND, 2/4): 접속/미접속 행 시각 차별화 명확, 아바타 인디케이터 + 행 bg + 이름 색 3중 단서
- ✅ C-1 (터미널 사파리, 3/4): 김민준/이서윤 접속, 박지호 미접속(옅음), 최지유 "나" 표시 좌측 helmet 바 + 칩
- ✅ 푸터 RosterLegend: 멤버 행 인디케이터와 동일 도트 어휘 ("위/아래 다름" 해소)
- 콘솔 0 에러

### 15-5. 검증 필요 사항

- (a) `PresenceDot` 미사용 함수 cleanup — grep 후 삭제 권장
- (b) 행 호버 bg(rgba 0.05)가 isMe 행(helmet-soft) 위에서 누적 시 — 현 코드는 isMe 우선이라 호버 무시(의도)
- (c) C-1 1인팀 케이스(`MOCK_TEAM_STANDARD` 4인 가정)에서 isMe 단일 행 시각 검증 필요
- (d) 인디케이터 9px가 아바타 28px와 비례 OK이나, 더 작은 아바타 사이즈에서는 비례 재계산 필요
- (e) state='pending'(입장 전)은 B-2 데이터(2상태 튜플)에는 없으므로 B-2 모달에서 절대 안 나타남 — 의도적

---

*검토자: 짓다 디자인 / 작성일: 2026-05-27 (§15 RosterMemberRow·RosterLegend 공용 + 접속/미접속 시각 강화 + C-1 "나" 표시 재디자인)*

---

## 16. 미접속 도트 rose 채택 + PresenceDot cleanup + 입장 전 mock 추가 + 디자인 시스템 등록 (2026-05-27)

사용자 결정 3종:
1. "초록 점이랑 회색 점이 잘 눈에 띄게 구분이 안되네. rose를 회색대신 써볼까?" → **미접속 도트 색 `var(--c-muted)` → `var(--c-rose)` 채택** (rose = safety orange alias, mint와 명확 대조)
2. "입장 전 상태가 있는데 샘플이 없네 디자인에" → **MOCK_TEAM_STANDARD 이서윤 `online: 'connected'` → `'idle'`** (3상태 모두 시각 검증 가능)
3. "정리하고 디자인시스템에도 반영해" → **PresenceDot 함수 삭제** (participant.jsx:230) + **`Jitda Design System.html` §09f에 ROSTER MEMBER ROW + ROSTER LEGEND 시각 예제 등록**

### 16-0. 변경 요약

| # | 항목 | 결정 |
|---|------|------|
| 16-1 | 미접속 도트 색 | `var(--c-rose)` (safety alias) — mint와 명확 대조 |
| 16-2 | MOCK_TEAM_STANDARD 분포 | connected 2 / idle 1 / offline 1 / 나(connected) — 3상태 시각 모두 노출 |
| 16-3 | PresenceDot 폐기 | participant.jsx:230 함수 삭제 — 호출처 0 확인 후 |
| 16-4 | 디자인 시스템 등록 | §09f Component Library에 ROSTER MEMBER ROW + ROSTER LEGEND 서브섹션 신설 |

### 16-1. 색 결정 근거

| 색 | 토큰 값 | 의미 | 검토 |
|---|---|---|---|
| 이전: 회색 | `var(--c-muted)` (#8a8779) | "비활성" | mint(#096c4d, 진한 초록)와 명도/채도 둘 다 비슷 → 대비 부족 |
| 채택: rose | `var(--c-rose)` = `var(--c-safety)` (#ff6b1f) | "주의 필요" | mint와 hue 정반대 + 채도 대비 강함. 짓다 어휘상 safety는 "위험/비가역"이지만, 미접속도 운영자가 즉각 인지해야 할 신호라 의미 정합 |

검증: viewer로 c1·b2-roster-detail 모두 시각 확인 — rose(주황)와 mint(초록)이 명확히 구분되어 한눈에 미접속 식별 가능.

### 16-2. PresenceDot cleanup

```
참조 grep 결과:
- participant.jsx:230 (함수 정의)
- 다른 .jsx 호출 0
```

안전하게 삭제. 폐기 흔적 주석만 남김:
```jsx
// PresenceDot — 폐기됨(2026-05-27): shared.jsx의 공용 RosterMemberRow가 아바타 우하단 인디케이터로 통합.
// 호출처 0 확인 후 삭제.
```

operator.jsx의 RosterTeamDetailModal 주석에도 "PresenceDot" 언급 → "RosterMemberRow + RosterLegend 공용 컴포넌트 사용"으로 갱신.

### 16-3. 디자인 시스템 등록 (`Jitda Design System.html` §09f)

기존 §09f "Component Library"(IconButton·InteractiveCard·Tab·CountdownRing·Tooltip·Spin) 끝에 2개 서브섹션 신설:

- **▸ ROSTER MEMBER ROW · 팀 멤버 행** — 4행 시각 예제(접속·입장 전·미접속·나) + props 표(name·color·state·isMe) + 인디케이터/행 차별화/isMe 규칙
- **▸ ROSTER LEGEND · 푸터 범례** — 3상태 도트 + props(states 가변) + DO/DON'T(이모지 금지)

TOC는 §09f 안 서브섹션이라 별도 갱신 불필요(상위 섹션만 TOC).

### 16-4. 검증 결과

- ✅ C-1: 김민준(접속·mint) / 이서윤(입장 전·dashed) / 박지호(미접속·rose) / 최지유(나·mint + helmet 액센트) — 3상태 모두 명확 노출
- ✅ B-2 모달: 강수아·임소영(mint) / 윤재현·서지훈(rose) — rose 색이 mint와 명확 대조
- ✅ 디자인 시스템: §09f에 시각 예제 + props/룰 표 모두 렌더
- ✅ PresenceDot 삭제 후 viewer 콘솔 0 에러

### 16-5. 검증 필요 사항

- (a) **rose가 짓다 "safety = 위험/비가역" 단일 어휘와 의미 충돌하는지** — 미접속도 운영자가 즉각 알아야 할 신호이긴 하나 "비가역 액션"은 아님. 행사 운영 중 인지 부담 차이 실측 필요(7/13 연수).
- (b) **rose 도트가 다른 safety 강조(b2-end 종료 모달 등)와 한 화면에 동시 노출 시 우선순위** — 현재는 B-2 종료 모달이 풀스크린 takeover라 동시 노출 불가, 향후 인라인 사이드바 등에서 충돌 가능.
- (c) **MOCK_TEAM_STANDARD에 idle 추가가 다른 컴포넌트(예: JitdaToolbar의 DEFAULT_PARTICIPANT_USER) 정합성에 영향?** — DEFAULT_PARTICIPANT_USER는 별도 객체라 무관. 확인됨.
- (d) **디자인 시스템 시각 예제가 정적 HTML 미러** — 실제 React 컴포넌트 변경 시 동기화 부담. 향후 컴포넌트 변경 시 디자인 시스템 §09f도 같이 갱신 필요.

### 16-6. 후속 미세 조정 (2026-05-27 같은 날)

사용자 피드백: "지금은 로즈가 아니라 주황색인데? 주황색이 오프라인인게 직관적이지가 않아. 눈에 너무 띄어서. 로즈로 가자." + (이미지 첨부) "미접속은 배경줄이 없어서 눈에 안띄네. 미접속과 같은 배경 적용해줘"(입장 전 행 지적)

**변경 2종**:
1. **미접속 도트 색 `var(--c-rose)`(safety orange alias #ff6b1f) → `#c94560`(진짜 rose 인라인 hex)** — `--c-rose` 토큰이 deprecated alias로 safety orange를 가리키고 있어 시각상 주황으로 렌더됐음. 다른 곳 영향 없는 인라인 hex로 우회. shared.jsx RosterMemberRow 인디케이터 + RosterLegend off + 디자인 시스템 §09f 정적 미러 3곳 모두 동기화. 향후 `--c-rose-real` 또는 `--c-state-off` 별도 토큰 신설 검토 가능.
2. **`rowBg` 조건 단순화 `!on && !pending` → `!on`** — pending도 off와 같은 옅은 회색 bg(rgba 0.025) 적용. "비접속" 상태를 시각적으로 한 그룹으로 묶어 운영자가 즉각 식별. shared.jsx + 디자인 시스템 §09f 정적 미러 동기화.

검증: viewer로 c1 재캡처 — 박지호 도트가 진짜 rose(분홍빛 빨강), 이서윤 행이 옅은 회색 bg 적용으로 박지호와 같은 시각 그룹 형성.

검증 포인트(향후): (a) 인라인 hex `#c94560`이 짓다 토큰 시스템 밖에서 살아 있음 — 다른 화면에서 같은 rose 필요해지면 토큰 승격 결정 필요, (b) pending/off 같은 bg가 두 상태 시각 구분을 약화시키는지 — 도트(dashed vs solid)로는 여전히 구분되나 행 전체로는 한 그룹(의도된 효과 — "비접속" 묶음).

### 16-7. 갤러리 상세 서브툴바 prev/next 칩 압축 (2026-05-27 같은 날)

사용자 피드백: "gnb 아래 바 높이가 너무 높아. 이전/다음 버튼 높이가 너무 높아서 그런거같은데" → 옵션 A(1줄 압축) 선택 → "버튼 가로폭은 고정, 연타 시 위치 흔들리지 않게. 짧으면 중앙정렬, 길면 …. 흰색 배경 안 어울림."

**변경 (gallery.jsx `ProjectNavChip` + 서브툴바 컨테이너)**:
1. **칩 1줄화** — 기존 2줄(라벨 "이전·다음" + 프로젝트명, 높이 44px) → 1줄(프로젝트명만, 높이 32px). prev/next 의미는 화살표 방향과 `title` 속성(스크린리더·hover)으로 전달.
2. **고정폭 180px** — `width: 180px` 명시. 연타 시 인접 프로젝트 제목 길이 차이로 인한 좌/우 위치 흔들림 방지(연타 UX 핵심).
3. **3-cell grid 레이아웃** — `gridTemplateColumns: '14px 1fr 14px'`. 화살표 컬럼은 한쪽만 채워도 텍스트 중심이 항상 칩의 시각 중심에 정렬됨. 텍스트는 `textAlign: center` + `text-overflow: ellipsis`.
4. **배경 색 `--c-canvas`(#fff) → `--c-stone`(#eeece7)** — 흰색 헤더 위 흰색 칩이 약했음. stone 베이스로 chip-like 톤, hover시 `--c-stone-2`. 테두리는 `--c-hairline-strong` 유지.
5. **비활성 상태** — 기존 130px+44px "더 이상 없어요" 보조 라벨까지 띄우던 큰 박스 → 같은 180×32 칩 안에 "처음입니다"/"마지막입니다" 한 줄. transparent bg + opacity 0.55로 활성 칩과 구분.
6. **서브툴바 컨테이너 minHeight 52 → 44px, padding 10/24 → 6/24** — 칩이 32로 줄면서 컨테이너도 축소. GNB와 본문 사이 시각적 공간감 회복.

검증 (DOM 측정 — 스크린샷 툴은 viewer 폰트 variants 미사용분의 `unloaded` 상태 때문에 타임아웃 반복):
- 활성 칩 2종 모두 width=180 / height=32 / bg=`rgb(233,230,221)` (stone)
- 비활성 칩 width=180 / height=32 / bg=`rgba(0,0,0,0)` (transparent) / disabled=true
- 서브툴바 height 44px (이전 52 minHeight + 큰 칩으로 인해 실측 ~64 → 44)

검증 포인트(향후): (a) 180px가 한글 12자 + 화살표를 무리 없이 담는지 — 한국어 평균 프로젝트명 8~12자 가정. 12자 초과 빈도가 높으면 200px로 상향 검토. (b) stone 톤이 갤러리 다른 영역(D-1 카드 hover, D-2 본문)과 충돌 안 하는지 — 현재 카드 hover는 별도 톤이라 무관.

### 16-8. prev/next 칩 자체 폐기 → 우측 정보 패널 헤더의 작은 화살표로 이동 (2026-05-27 같은 날, §16-7 대체)

사용자 피드백: "버튼 디자인 개별로잖아. 차라리 '인디 음악 디스커버리' 영역에 좌우 화살표 작게 넣는게 나을듯" (이미지로 우측 정보 패널 헤더 영역 지정).

§16-7에서 칩을 잘 만들었지만 **칩 한 쌍이 서브툴바 우측을 차지하는 구조 자체가 부담**이라는 지적. 칩 폭 360px(180×2)를 새 정보 영역에 쓰는 게 낫다고 판단.

**변경**:
1. **`ProjectNavChip` 함수 폐기** — 1줄 chip(§16-7) 자체를 제거.
2. **`ProjectNavArrows` + `NavArrow` 신설** — 24×24 아이콘 버튼 한 쌍. transparent bg, hover시만 `--c-stone`. icon `Icon.arrowLeft/Right(14)`. 비활성 시 opacity 0.35.
3. **위치 이동** — 서브툴바 우측 → `DetailInfoPane` 헤더의 팀명 라인(`{team} · {members}명`) 오른쪽. `justifyContent: space-between`으로 한쪽 끝 정렬.
4. **서브툴바 청소** — prev/next 칩 자리에 있던 `<div style={{ flex: 1 }} />`만 남김. minHeight 44 / padding 6/24 유지(§16-7).
5. **`DetailInfoPane` 시그니처 확장** — `prev`, `next`, `prevDisabled`, `nextDisabled` props 추가. caller(`GalleryProjectDetail`) 4 prop 모두 전달.
6. **인접 프로젝트 제목은 tooltip(`title`)로** — `이전: {title}` / `다음: {title}` / `처음 프로젝트입니다` / `마지막 프로젝트입니다`. 시각적으로는 화살표 방향이 prev/next 의미를 전달.

검증 (DOM 측정):
- 서브툴바 버튼 4개(BackLink + 새로고침/새탭/설정 3개) — prev/next 칩 완전 제거 확인. 높이 44px.
- 화살표 24×24, transparent bg, 활성/비활성 opacity 1/0.35.
- 마지막 프로젝트(d2-last)에서 다음 화살표 disabled=true, tooltip "마지막 프로젝트입니다".
- 콘솔 0 에러.

검증 포인트(향후): (a) 24×24 hit-area가 좁아 모바일/터치에서 클릭 어려울 수 있음 — 모바일 대응 시 32×32로 확장 검토. (b) 우측 패널이 좁아지면(현재 400px) 팀명 ellipsis 가능성 — `min-width: 0` 적용 안 되어 있어 추후 필요. 현재는 영향 없음. (c) 폐기된 `ProjectNavChip`/`§16-7` 변경 일부(서브툴바 minHeight 44, padding 6/24)는 유지 — 칩이 없어도 1줄 헤더로 충분하기 때문.

### 16-9. 작은 화살표를 다시 서브툴바로 (2026-05-27 같은 날, §16-8 위치 일부 되돌림)

사용자 피드백: "좌우 버튼이 지금 영역 말고 GNB 아래 바에 있는게 나을것같다. 원래 버튼 있던 위치 말이야."

§16-8에서 우측 정보 패널로 옮긴 화살표를 다시 서브툴바 우측으로 이동. 단, **디자인은 §16-8의 24×24 작은 아이콘 형태(`ProjectNavArrows`/`NavArrow`)를 그대로 유지** — 칩(§16-7)이 아닌 작은 화살표.

**변경**:
1. **`DetailInfoPane` 시그니처 원복** — `prev`/`next`/`prevDisabled`/`nextDisabled` props 제거. 헤더의 `space-between` 레이아웃·`hasNav` 조건도 제거.
2. **서브툴바 우측에 `ProjectNavArrows` 배치** — `<div style={{ flex: 1 }} />` 다음 위치. 칩(§16-7)이 있던 자리와 동일하나 폭은 24+2+24=50px로 매우 컴팩트.
3. **`ProjectNavArrows`/`NavArrow` 함수는 그대로 유지** — 시각·동작 동일.

검증 (DOM 측정):
- 서브툴바 높이 44px 유지
- 화살표 2개, 24×24, 우측 정렬(x=1380, 1406, 우측 padding 24px 이후)
- tooltip: "이전: 봇 마실 음료 추천" / "다음: 캠퍼스 분실물 지도" (정상)
- 콘솔 0 에러

검증 포인트(향후): (a) §16-8 우측 패널 헤더의 `space-between` 변경을 원복했으므로 정보 패널 헤더는 원래 형태(team-mono + h2 + tagline) 그대로. (b) 칩(§16-7) 대비 절약 폭: 360px → 50px = 약 310px 절약. 서브툴바가 훨씬 가벼움. (c) 24×24 hit-area는 데스크탑 기준이라 모바일 대응 시 재검토.

---

*검토자: 짓다 디자인 / 작성일: 2026-05-27 (§16-9 화살표 서브툴바 복귀 — 디자인은 §16-8 작은 화살표 유지)*

---

## 17. UI 2상태 통합 — 미접속 / 입장 전 한 어휘로 (2026-05-27)

사용자 결정: "미접속과 입장 전을 꼭 나눠야 할까? 기획을 검토해보고 의견줘" → 기획 검토 후 통합 권고 → "좋아. ui만 하나로 묶는다. a로 심플하게".

### 17-0. 변경 요약

| # | 항목 | 결정 |
|---|------|------|
| 17-1 | UI 정책 | "접속" / "비접속" **2상태**로 단순화 |
| 17-2 | 데이터 모델 | **3상태 유지** — API `teammates.status: "online"|"offline"|"not_entered"` 그대로 |
| 17-3 | 시각 처리 | pending(not_entered)도 off와 동일 — rose 도트 + 옅은 bg + "미접속" 라벨 |
| 17-4 | 통합 근거 | 운영자/참가자 task가 두 비접속 케이스 모두 "옆에 가서 확인"으로 동일 |

### 17-1. 통합 근거 (기획 검토 결과)

| 케이스 | 데이터 status | 발생 원인 | 운영자 액션 |
|---|---|---|---|
| 미접속 | `offline` | 한 번 들어왔다 연결 끊김 | 옆에 가서 확인 |
| 입장 전 | `not_entered` | 한 번도 안 들어옴 | 옆에 가서 확인 |

→ **운영자 task가 같음**. 시점별 의미 차이(행사 직후 vs 진행 중)는 있으나 운영자가 자동으로 다른 의사결정을 한다는 증거 없음. K-12 교사 인지 부담 + 시각 단순성 우선.

### 17-2. 변경된 코드 (5개 파일)

| 파일 | 변경 |
|---|---|
| `shared.jsx` `RosterMemberRow` | `pending` 변수 제거, 인디케이터 분기 단순화 (`on ? mint : rose`), 행 bg는 이미 `!on` 기준 |
| `shared.jsx` `RosterLegend` | `pending` 옵션은 데이터 호환 위해 남기되 off와 동일 색·라벨로 통합. 기본값 `['on','off']` |
| `participant.jsx` C-1 | `RosterLegend states={['on','off','pending']}` → `['on','off']` |
| `participant.jsx` MOCK_TEAM_STANDARD | 이서윤 `online: 'idle'` 유지 (데이터 보존, 시각은 off로 자동 통합) |
| `Jitda Design System.html` §09f | 입장 전 행 제거 + 푸터 범례 입장 전 도트 제거 + 본문 정책 명시 |

### 17-3. 기획문서 갱신 (3개)

| 문서 | 변경 |
|---|---|
| `참가자-로그인-기획.md` 287~290줄 | 3상태 라벨 → **UI 2상태(접속/미접속) + 데이터 모델 3상태 유지 명시** + 통합 근거 4줄 |
| `페이지정의서 §C-1 ③` | "🟢접속/🔘미접속/⬜입장 전" → "🟢접속/🔘미접속" + 데이터 `not_entered`도 UI에선 미접속으로 표시 명시 |
| `화면상태정의서 §C-1` | 동일 |

### 17-4. 검증 결과

- ✅ C-1: 김민준(접속·mint) / 이서윤·박지호(비접속·rose 같은 시각 그룹) / 최지유(나·mint + helmet 액센트)
- ✅ 푸터 범례: "접속 / 미접속" 2상태만
- ✅ 데이터 변환은 그대로 동작 (`'idle' → 'pending' → 시각 off`)
- ✅ 콘솔 0 에러

### 17-5. 검증 필요 사항 (Critical Analysis)

- (a) **시점별 의미 손실** — 행사 시작 직후 5분에 "입장 전 N명"이 운영자 즉각 액션(코드 안내)을 유발하는 명확한 운영 패턴이 검증되면, 옵션 B(3상태 유지) 또는 C(호버 컨텍스트)로 회귀 검토 필요. 7/13 전북 연수에서 운영자 행동 관찰 권장.
- (b) **호버/모달 컨텍스트 노출 보강 미적용** — 옵션 C("호버 시 상세")는 채택 안 함. 운영자가 "이 사람 입장 전인지 미접속인지" 정말 알고 싶을 때 확인 경로 없음. 향후 필요 시 RosterMemberRow에 호버 툴팁 추가 가능 (operator.jsx RosterAvatar 패턴 재사용).
- (c) **데이터 모델 3상태가 UI 미사용** — `not_entered` 상태가 UI에 노출되지 않으므로 분석·로깅·관리자 화면에서만 의미. 어드민 시스템(짓다 외부)에서는 3상태 유지 권장.
- (d) **운영자 관리자 화면**(어드민 외부 시스템) — 거기서는 3상태 분리가 의미 있을 가능성 큼 (참가자 등록·코드 발급 추적). 본 작업은 짓다 플랫폼(B-2 모달, C-1) 한정.

---

### 17-6. 후속 — "미등록" 인라인 라벨 추가 (2026-05-27 같은 날)

사용자 결정: "최초 등록 했는지 여부는 데이터상으로 알 수 있으니까, 둘다 빨간불로 표기하되 아에 한 번도 안 들어온사람(미등록)만 이름 우측에 미등록이라고 표기해줄래?"

**변경**: shared.jsx `RosterMemberRow`에서 `state === 'pending' && !isMe`일 때 이름 우측에 **"미등록" 라벨**(mono caps 9.5px, hairline outline, muted 글자, transparent bg) 추가. 도트·bg 등 비접속 시각은 미접속과 동일 유지 (§17 결정 보존).

**디자인 어휘 위계**:
| 라벨 | 스타일 | 강도 |
|---|---|---|
| **"나"** (isMe) | helmet-deep solid bg + 흰 글자 | 강 (본인 식별) |
| **"미등록"** (state=pending) | transparent bg + hairline outline + muted 글자 | 약 (부가 정보) |

**영향**: c1·c1-after-tutorial·c1-ended에서 이서윤(idle→pending) 행에 "미등록" 노출. B-2 모달은 PENDING_TEAMS 데이터가 2상태(on/off)만 가져서 pending 멤버 없음 → 영향 0. 디자인 시스템 §09f에 미등록 행 정적 미러 추가 + 본문 정책 1줄 명시. 페이지정의서 §C-1 ③항 + 화면상태정의서 §C-1 본문 라벨 정책 추가. 참가자-로그인-기획 §대기실 상태 표기 갱신.

**근거**: §17의 "UI 단순화"와 충돌 안 함 — 시각은 여전히 2상태(rose 도트 같음), 부가 라벨 1개만 추가. 운영자/팀원이 "이 사람 한 번도 안 들어왔네 → 코드 안내 필요"를 1초 안에 식별 가능. 호버 없이 인라인 노출이라 키보드/터치 환경도 OK. §17-5 (b) "호버 컨텍스트 미적용" 우려도 인라인 라벨로 부분 해소.

**검증**: viewer c1 evaluate — `nameContext: "이서윤\n미등록\n박\n박지호\n최\n최지유\n나"` 정확. 박지호(off)는 라벨 없음, 이서윤(pending)만 라벨 노출. (스크린샷은 viewer screenshot timeout으로 시각 캡처 불가 — 사용자 직접 확인 필요)

**검증 포인트(향후)**:
- (a) "미등록" 라벨이 시각 노이즈인지 정보인지 7/13 전북 연수에서 관찰 — 운영자가 라벨 실제 활용하는지
- (b) PENDING_TEAMS(operator.jsx mock) 데이터 모델이 2상태(튜플)라 B-2 모달에서 미등록 시각 검증 불가 — 향후 PENDING_TEAMS에 'pending' 추가 검토
- (c) **"미등록" 어휘 정확성** — 기획문서 정의는 "코드는 발급됐으나 사용 안 함"(어드민이 등록은 했음)이라 "미등록"은 의미 약간 모호 (어드민 등록 vs 본인 입장). 행사 운영자 피드백 후 "미입장"·"코드 미사용" 등 대안 검토 가능

---

### 17-7. 후속 — 호버 칩 rose 통일 + 미등록 모달 샘플 + RosterTeamDetailModal B-2 표준 정렬 (2026-05-27 같은 날)

사용자 피드백 4종:
1. "호버 칩 off일때 일관성있게 rose로 표기" — RosterAvatar 호버 툴팁의 OFF 칩 bg `var(--c-slate)` → **`#c94560`** (rose). ON(mint) ↔ OFF(rose) 명확 대조 + 미접속 인디케이터 도트와 어휘 통일.
2. "모달 안에 리스트에서 미등록 칩 샘플 추가해줘" — PENDING_TEAMS '데이터 파이프라인 크루'(B2RosterDetail 시뮬 데이터) 멤버 오민채 `'off'` → **`'pending'`** 변경. RosterTeamDetailModal 본문에서 미등록 라벨 시각 검증 가능.
3. "모달 디자인 수정. b2 모달을 참고하되 상단을 플레인 잉크로 하고, 닫기 버튼은 삭제하며, 헤더 아래 얇은 바도 없애. 디자인 시스템을 따라라" — RosterTeamDetailModal 헤더 재디자인:
   - 상단에 **`.jt-ink-strip` 클래스** 적용 (디자인 시스템 표준, caution-strip의 단색 검정 변형)
   - 헤더 **X 닫기 버튼 제거** (백드롭 클릭으로 close-roster-detail data-action 트리거)
   - 헤더 **borderBottom 제거**
   - boxShadow `0 30px 80px rgba(0,0,0,0.3)` → **`var(--shadow-modal)` 토큰** (B-2 다른 모달과 일관)
4. "잉크 플레인 상단바는 커션보다 얇아?" — 초기 인라인 8px 잘못 만든 것 지적. **`.jt-ink-strip` 클래스로 교체해 caution-strip과 동일 12px**로 정렬. tokens.css §618 "모달 상단 스트립 — 12px (3 변형: 애니메이션 사선 / 고정 사선 / 단색 검정)" 표준 따름.

### 17-7. 변경 파일

| 파일 | 변경 |
|---|---|
| `operator.jsx` RosterAvatar 호버 칩 | bg `var(--c-slate)` → `#c94560` |
| `operator.jsx` PENDING_TEAMS '데이터 파이프라인 크루' | 오민채 `'off'` → `'pending'` |
| `operator.jsx` RosterTeamDetailModal | 상단 `<div className="jt-ink-strip" />` 추가 / 헤더 X 버튼 + borderBottom 제거 / boxShadow `var(--shadow-modal)` |

### 17-7. 검증 결과

- ✅ b2-roster-detail evaluate: `hasUnregistered: true`, `omincheCtx: "오민채\n미등록"`, `hasInkBar: true`
- ✅ ink-strip 측정값: **height 11.996px (≈ 12px)**, bg rgb(20,19,15) = `--c-ink` — caution-strip과 동일 두께
- ✅ b2-tutorial-waiting RosterAvatar 호버: OFF 칩 #c94560 rose 적용
- ✅ 콘솔 0 에러
- ⚠️ viewer 스크린샷은 timeout 지속으로 시각 캡처 불가 — 사용자 직접 확인 필요

### 17-7. 검증 포인트(향후)

- (a) `.jt-ink-strip` 표준 사용으로 모달 헤더 어휘 일관 — 다른 B-2 모달(B2EndModal 등)도 caution-strip 대신 ink-strip 검토 가치 있음
- (b) 닫기 버튼 제거로 키보드 ESC 또는 백드롭 클릭만 가능 — 향후 ESC 핸들러 추가 검토(현재 viewer 정적 mock에선 ESC 미작동)
- (c) PENDING_TEAMS 데이터 모델 이제 'on'|'off'|'pending' 3상태 — RosterAvatar 인디케이터·RosterRow에서 pending도 자동 off와 같이 미접속 처리(통합 정책 유지) + 모달에서만 미등록 라벨 노출
- (d) "데이터 파이프라인 크루" 7명 케이스가 모달 본문 maxHeight 320 스크롤 시각화에도 적합

---

### 17-8. 후속 — 모달 border 제거 (2026-05-27 같은 날)

사용자 피드백: "상단바에도 흰색 테두리가있네? 지금 모달에 밝은색 테두리가 둘러져있는거같은데 디자인시스템때문이지? 테두리를 아예없애볼래?"

**진단**: B-2 모달 표준 패턴 `border: 1px solid var(--c-hairline)`이 ink-strip 위쪽 1px을 흰 띠처럼 노출. ink-strip이 카드 border 안쪽에 위치하기 때문.

**변경**: RosterTeamDetailModal에서 `border` 라인 제거. boxShadow `var(--shadow-modal)`은 유지 — 백드롭 검정 dim 위에서 흰 카드 경계는 그림자만으로 충분(`borderWidth: 0px` 확인).

**근거**: 사용자 진단 정확 — 디자인 시스템 모달 표준이 hairline border + shadow 조합. shadow만 있어도 백드롭 dim 환경에서 경계 명확. 모달이 dim 없는 화면(없지만 가정) 위에 떠도 shadow로 분리 가능.

**검증**: viewer evaluate — `borderWidth: 0px`, `borderStyle: none`, boxShadow는 그대로 유지. 콘솔 0 에러(favicon 404 제외).

**검증 포인트(향후)**:
- (a) **다른 B-2 모달(B2EndModal·B2TutorialStartConfirm 등)도 같은 border 가짐** — 본 작업은 RosterTeamDetailModal 한정. 일관성 위해 모두 제거할지, RosterTeamDetail이 디자인 시스템에서 벗어난 변형으로 둘지 정책 결정 필요. 사용자가 본 모달만 지적했으므로 보수적으로 한정 적용.
- (b) **디자인 시스템 §09e 모달 표준**에 "border + shadow" 패턴이 명시돼 있다면 이 결정이 표준 위반 → 표준 수정 또는 본 모달을 예외로 등록 필요. 확인 안 됨.

---

### 17-9. ModalSurface 표준화 + 모든 흰 테두리 제거 + 인터랙션 모달 헤더 구분선 규칙 (2026-05-27 같은 날)

사용자 결정 3단계:
1. "모든 모달에서 흰테두리를 삭제해줘" — operator.jsx 6개 모달의 `border: 1px solid var(--c-hairline)` 일괄 제거
2. "모달 디자인은 디자인시스템에 없어?" — §09e 갭 진단(backdrop·z·width·animation·A11Y만 있고 surface 시각 표준 누락) + 옵션 C 채택 ("ModalSurface 컴포넌트 추출")
3. "단순 버튼 선택 모달 외 인터렉션이 있는 모달의 경우 헤더 아래 본영역 사이에 구분선을 추가하여라" — 디자인 시스템 §09e 규칙 추가

### 17-9. ModalSurface 공용 컴포넌트 (shared.jsx)

| Props | 값 |
|---|---|
| `width` | 숫자(px) 또는 `'sm'`(420)/`'md'`(560)/`'lg'`(720)/`'xl'`(920). 기본 480 |
| `topStrip` | `null` / `'ink'`(plain ink 12px) / `'caution'`(애니메이션 사선) / `'caution-static'`(고정 사선) |
| `entrance` | `'pop'` / `'fade'` / `'slide'` (§09e Entrance Animation 표준 3종) |
| `role` | `'dialog'` (기본) / `'alertdialog'` (비가역 액션) |
| `ariaLabel` / `ariaLabelledBy` | A11Y |
| `style` | 인라인 추가 스타일 override |

**내부 어휘** (고정): `background: var(--c-canvas)` / `borderRadius: 10` / `boxShadow: var(--shadow-modal)` / **border 없음** / `overflow: hidden` / `display: flex flexDirection: column`. `.jt-modal-surface` 클래스 + entrance modifier 자동 적용.

### 17-9. operator.jsx 7개 모달 호출부 교체

| 모달 | 변경 |
|---|---|
| B2EndModal | `<ModalSurface width={480} topStrip="caution" role="alertdialog">` |
| B2EndModalCountdown | width 520 + caution + alertdialog |
| B2SkipTutorialModal | width 480 + caution + alertdialog |
| B2TutorialStartConfirm | width 480 + caution + alertdialog |
| B2TutorialEndConfirm | width 520 + caution + alertdialog |
| B2HackathonStartConfirm | width 480 + caution + alertdialog |
| RosterTeamDetailModal | width 380 + ink + dialog + `style={{maxHeight:'100%', minHeight:0}}` + 헤더 borderBottom 추가(인터랙션 모달 규칙) |

각 모달의 outer `<div>` (background·borderRadius·boxShadow·border·overflow) + 첫 자식 `<div className="jt-caution-strip">` 모두 ModalSurface로 통합. 본문 inner `<div style={padding}>`는 유지.

### 17-9. 디자인 시스템 §09e 추가 규칙

- **MODAL SURFACE 시각 표준** 서브섹션 신설 — background/border-radius/box-shadow/border 정책 + topStrip 4종 명시. 본 작업 결정의 모든 어휘 박제.
- **HEADER DIVIDER 규칙** 서브섹션 신설 — "단순 버튼 선택 모달은 구분선 없음 / 인터랙션 모달은 헤더 아래 `border-bottom: 1px solid var(--c-hairline)` 필수". 판단 기준 3가지(스크롤 본문 / 별도 정보 박스·리스트·폼 / 헤더-본문 분리 명확성) 명시.

### 17-9. 분류 결과

| 모달 | 분류 | 구분선 | 근거 |
|---|---|---|---|
| B2EndModal | 단순 | ❌ | 단계 표시 + 메시지 + CTA만 |
| B2EndModalCountdown | 단일 영역 (헤더-본문 분리 없음) | ❌ | 단계 표시 + 카운트다운 ring + 미리보기 박스 + CTA — 헤더 라벨 분리 안 됨 |
| B2SkipTutorialModal | 단순 | ❌ | 메시지 + 정보 박스 + CTA |
| B2TutorialStartConfirm | 단순 | ❌ | 동일 |
| B2TutorialEndConfirm | 단일 영역 | ❌ | 메시지 + 완료 현황 박스 + CTA — 헤더 라벨 분리 안 됨 |
| B2HackathonStartConfirm | 단순 | ❌ | 동일 |
| **RosterTeamDetailModal** | **인터랙션** | ✅ | 헤더(팀명·카운트) + 스크롤 멤버 리스트(maxHeight 320) + 푸터 범례 — 헤더·본문 분리 명확 |

### 17-9. 검증 결과

- ✅ B2TutorialStartConfirm evaluate: `role=alertdialog` / `aria-modal=true` / `borderWidth=0px` / `className=jt-modal-surface` / `hasCautionStrip=true`
- ✅ RosterTeamDetailModal: `role=dialog` / 미등록 라벨 노출 / `.jt-ink-strip` 자식 정상
- ✅ 콘솔 0 에러 (cache busting URL ?cb=2 필요했음 — babel-standalone이 shared.jsx 변경 즉시 재컴파일 안 함)
- ✅ shared.jsx `Object.assign(window, { ..., ModalSurface })` 단일 export 패턴으로 글로벌 등록

### 17-9. 검증 포인트(향후)

- (a) **dialogs.jsx 모달들(E-1·E-5)은 ModalSurface 미적용** — border 어휘가 다름(line 1237 ink, line 1429 hairline-strong). 향후 ModalSurface가 border prop 받아서 통합할지, dialogs 모달은 별도 패턴으로 유지할지 정책 결정 필요. 일단 본 작업은 operator.jsx 7개 한정.
- (b) **B2EndModalCountdown·B2TutorialEndConfirm의 헤더 구조 추가 검토** — 현 분류는 "단일 영역"이라 구분선 미적용했으나, 사용자가 명시적 헤더(예: 상단 단계 표시) + 본문(타이머/완료 현황) 분리를 원할 수 있음. 7/13 연수 실측 후 재분류 가능.
- (c) **babel-standalone hot reload 안 됨** — viewer 새로고침 시 shared.jsx의 새 함수가 즉시 안 잡힘. cache busting URL 또는 hard refresh 필요. 향후 dev 워크플로우 개선 검토.
- (d) **ModalSurface에 padding prop 미포함** — 각 모달이 inner `<div style={{ padding: ... }}>`로 직접 처리. 다양한 padding 케이스(24/28/22 vs 20/24/14 등) 있어 인자 추가 가치 검토 가능. 현재는 유연성 위해 inner div 그대로.

---

*검토자: 짓다 디자인 / 작성일: 2026-05-27 (§17 + §17-6 + §17-7 + §17-8 + §17-9 ModalSurface 표준화 + 모든 흰 테두리 제거 + 인터랙션 모달 헤더 구분선 규칙)*


