# 기획 문서 업데이트 정리 — D. 갤러리 영역 (2026-05-26)

> Hi-fi 디자인 작업 중 기획 문서와 어긋난 결정·신규 결정 사항을 문서별로 정리.
> 짓다 디자인 리뉴얼 D 영역(갤러리) 검토 결과.

---

## §μ+5 2026-06-12 마스코트 애니메이션 가이드 신설 + 발밑 그림자 + reduced-motion 버그 수정

**계기**: 사용자 지시 — Z. 데모의 마스코트 애니메이션 3종(HOP·BLUEPRINT·DIG)을 문서화하고, 로딩/대기를 포함하는 모든 화면을 식별해 화면별 적절한 애니메이션을 선정.

**변경**:
- **DIG 발밑 그림자(움직이는)**: `JitdaMascotDig`에 다른 마스코트처럼 발밑 타원 그림자 추가. `jt-dig-shadow`(bob 동기 — 들림 15% scaleX0.76·opacity0.07 / 내려찍기 46% scaleX1.12·opacity0.2). `var(--c-ink)`, reduced-motion 정적값 opacity0.16. `shared.jsx`·`tokens.css`. `shared.jsx?v=20260612logo33`.
- **새 문서 `마스코트-애니메이션-가이드.md`**: ① 3종 정밀 프로파일(시각·동작분해·타이밍·은유·에너지·a11y) ② 로딩/대기 화면 인벤토리(6영역 전수, 37건) ③ 화면별 추천 + 근거 ④ 마스코트 비권장 화면(스피너/스켈레톤/카운트다운이 우월) ⑤ 구현 가이드. **핵심 결론: AI 생성 순간(`sending` — "AI가 작업하는 중이에요…" participant.jsx:1540) → DIG**(브랜드 동사 "짓다" 직결). c1/c1-after → BLUEPRINT(대기실), a1-not-started → HOP.
- **reduced-motion 버그 수정**: `.jt-mascot-shadow`(HOP)에 base `opacity:0.22`가 없어 `animation:none`(reduced-motion) 시 keyframe opacity 미적용 → **불투명 검정 블롭으로 깨짐**. 다중에이전트 적대 검증으로 적발 → base opacity 추가(`tokens.css`). 이제 HOP·BLUEPRINT(인라인0.13)·DIG(0.16) 3종 모두 안전.

**분석 방법**: Workflow 9-에이전트(애니메이션 프로파일러 1 + 영역 스캐너 6 + 합성 1 + 적대 검수 1). 검수가 (a) `sending` 생성 상태 누락 (b) c5-submitted→BLUEPRINT 화면 사실 오독(제출완료=수정가능 확인 화면이지 결과대기 아님) (c) c3-spawning/d2-loading DIG는 인프라 부팅이라 약한 매핑 (d) HOP 그림자 reduced-motion 결함을 적발 → 최종 문서/코드에 반영.

**검증**: `?id=z-mascot` 콘솔 0. DIG 그림자 windup 56px@0.07 / impact 83px@0.19 측정 확인. 화면 추천은 은유 정합성 가설(실사용 미검증) — 문서에 명시, 전면 적용 전 A/B 권고.

**후속**: 미배치 상태(쇼케이스 only). 실배치는 `design-workflow.md §1` 패턴 A로 화면별 진행. BLUEPRINT 도면 색·HOP 그림자 토큰 하드코딩은 다크/모노 배경 전 해결 필요.

---

## §μ+4 2026-06-11 OpenCode 미리보기 — 사파리형 파일 탐색기 + 탭 + 검색 (C-3·C-4)

**계기**: 사용자 지시 — 우측 미리보기를 실제 맥 사파리 창처럼 확장. ① 파일 탐색기(좌측 사이드바, 개폐) ② 복수 파일 탭 ③ 기존 미리보기 기능 전부 ④ 파일명 검색.

**변경** (`participant.jsx`, `tokens.css`):
- 신규 `OcBrowser`(+`OcFileTree`·`OcFileTab`·`OcCodeView`) — 공용 `OpenCodeShell` 우측 컬럼의 `SafariChrome + previewNode` 블록을 대체. `SafariChrome` 자체는 D-2용으로 존치(미수정).
- **사파리 사이드바 메타포**: chrome 좌측 토글 ⊞(항상 노출)로 파일 탐색기 개폐. 탐색기는 chrome 바로 아래부터 **전체 높이**를 차지하고, **탭 스트립은 우측 콘텐츠 컬럼 상단에만** 위치(사이드바와 겹치지 않음).
- **탭**: 0번 미리보기(라이브 앱·고정·닫기 불가) + 트리에서 파일 클릭 시 새 탭. 주소창은 활성 탭에 따라 URL ↔ 파일 경로. **탭 스트립은 탭이 2개 이상일 때만 노출**(사이드바 개폐와 무관 → 기본 룩 유지).
- **검색**: 사이드바 상단 input — 파일명 부분일치 평면 필터.
- **코드 뷰**: 읽기 전용, 줄번호 거터 + monospace, 주석 라인 muted. Mock 코드 베이스 정적 주입(C-3 음료앱 / C-4 OCR 일정봇).
- **하위호환**: `files` 없음 | `tutorial`(C-2) | `previewState !== 'ready'`(c3-preview-empty·c3-spawning) → 토글·탭 숨김, 기존 `SafariChrome` 동작과 동일.
- `tokens.css` 신규 클래스: `.oc-tree-row`·`.oc-browser-tabstrip`·`.oc-browser-tab`·`.oc-browser-tab-close`.

**후속 조정** (동일 2026-06-11, 사용자 피드백 반복 반영):
- **레이아웃**: 탐색기 사이드바는 chrome 아래 전체 높이, 탭 스트립은 우측 콘텐츠 컬럼 상단에만(겹침 제거). 탭 스트립은 탭 2개↑일 때만(사이드바 개폐 무관).
- **탭 폭**: 제목 길이와 무관하게 고정 144px(긴 이름 ellipsis). 닫기 버튼 확대(20px 버튼·13px 글리프).
- **주소창**: 좌측 `aA` 인디케이터 폐기. 주소 텍스트 정중앙 정렬(좌·우 컨트롤 동일 폭 18px). 최종 배치 = 좌: **홈**(기본 미리보기 페이지로 복귀, `setActiveId('preview')` — 열린 탭은 유지) / 우: **새로고침**. **새 탭에서 열기**는 복사 버튼 옆(우측 끝)으로 이동, 항상 라이브 앱 URL을 새 브라우저 탭으로 엶.
- **상단바 네비게이션**: 사파리 레퍼런스 위치(사이드바 토글 우측·주소창 좌측)에 **뒤로/앞으로** 추가. 미리보기 히스토리 없음 → 뒤로=활성 톤·앞으로=비활성(흐림), 사이 구분선.
- **사파리 색 정합성**(이미지 레퍼런스 기반, 멀티에이전트 워크플로 합성): 미리보기 브라우저는 의도적 non-Jitda 쿨그레이로 통일 — 사이드바 `#f9f9f9`(기존 warm `--c-paper` 폐기)·검색필드 보더 `#d8d8dc`·돋보기 `#86868b`. 폴더 아이콘=Finder 블루 채움(`#4aa3ff`/`#1a8cff`, 기존 gold `--c-helmet-deep` 폐기). 선택 행=중립 회색 pill `#efefee` + 텍스트·아이콘 블루 틴트 `#006ef5`(기존 yellow `--c-helmet-soft` 폐기). hover=어두워짐 `rgba(0,0,0,.045)`. 파일 ext 배지=쿨 중립 칩 `#eef0f4`/`#d6d8dd`/`#5b6270`(트리·검색·탭 공통). 탭 스트립 `#eaeaea`·활성 탭 off-white `#f9f9f9`·비활성 글자 `#5a5a5e`. 상단 chrome 바(`#f5f5f7` 등)는 이미 사파리 톤이라 미수정.

**후속 조정 2** (2026-06-12, chrome 공용화 + 갤러리 적용):
- **공용화(디자인시스템 반영)**: 중복돼 있던 chrome을 **공용 `SafariChrome`(shared.jsx)** 하나로 통합. `OcBrowser`의 인라인 chrome 제거 → `<SafariChrome address openUrl onRefresh onHome onToggleSidebar sidebarOpen tutorial />` 호출. 갤러리 `DetailLivePane`(gallery.jsx)은 기존 `<SafariChrome url={…} />` 그대로 → 자동으로 새 chrome 적용.
- **주소 정중앙(근본 수정)**: chrome을 `[좌 그룹 flex:1][주소 pill flex 0 1 420·정중앙][우 그룹 flex:1]`로 재구성. 좌·우 그룹 동일 flex → pill이 바 정중앙(Playwright 측정 offset=0; 이전엔 좌측 그룹이 넓어 +42px 우측 치우침).
- **갤러리(D-2) 적용 + 소스 버튼 제외**: 홈·파일 탐색기 토글은 `onHome`/`onToggleSidebar` prop 있을 때만 노출 → OpenCode(enabled)만 전달, 갤러리는 미전달 → 갤러리엔 소스코드 버튼 없음. 갤러리 chrome = 트래픽+뒤로/앞으로+pill[스페이서·작품명·새로고침]+새탭+복사.
- **모든 OpenCode 화면 일관**: C-2(튜토리얼)·C-3·C-4 모두 동일 SafariChrome. 비-ready(c3-empty/spawning)·tutorial은 토글·홈 숨김(갤러리 Slim과 동일). 파일 탐색기/탭은 C-3·C-4(ready)만.
- **파일 탐색기 열기 애니메이션**: `.oc-file-sidebar` — `@keyframes oc-sidebar-open`(width 0→196 + opacity, 200ms decelerate). 사이드바 `overflow:hidden`으로 0폭 클립, 콘텐츠 자연스럽게 밀림.
- **캐시 무효화**: `viewer.html`·`Renewal.html`의 `shared.jsx`·`participant.jsx`·`tokens.css` `?v=`를 `20260612safari`로 bump(편집 후 필수 절차). 검증 중 `_serve.py`(no-store) 기동 권장.
- **디자인시스템 문서**: `Jitda Design System.html` §09c 갱신 — Slim(갤러리)/Full(OpenCode) 2변형 정적 레플리카, ELEMENTS·DIMENSIONS·DO/DON'T 새 레이아웃 반영(높이 38px·정중앙·뒤로앞으로 데코·소스 버튼 변형 규칙).

**후속 조정 3** (2026-06-12, 탐색기 노출 규칙 변경 — 후속 조정 2의 토글·홈 노출 규칙 대체):
- **파일 탐색기 토글 = OpenCode 전 화면 항상**(파일 없음·튜토리얼·미준비 포함). `OcBrowser`가 `onToggleSidebar`를 무조건 전달. `enabled = files && !tutorial && active==='ready'` → `hasFiles = files.tree.length`로 분리 — `hasFiles`는 트리/검색/탭 콘텐츠 활성만 결정(토글 노출과 무관).
- **빈 상태**: 파일 없을 때(C-2 튜토리얼 등) 탐색기 열면 "아직 생성된 파일이 없어요". 파일 있으면(C-3/C-4·spawning 포함) 트리 표시.
- **홈 = 공통**: `SafariChrome`이 홈을 항상 렌더(onHome 없으면 데코) → **갤러리(D-2)도 홈 노출**(클릭 no-op). 갤러리는 여전히 파일 탐색기 토글 없음(onToggleSidebar 미전달).
- `?v=` → `20260612safari2`(shared.jsx·participant.jsx). `Jitda Design System.html` §09c·desc·rules·SLIM 레플리카에 홈 공통·토글 항상·빈 상태 반영.

**검증** (`viewer.html` Playwright + `browser_evaluate`): c4 주소 **offset=0** 유지(홈 항상 렌더해도 좌·우 18px 대칭). 버튼 세트 — c4/c3(Full): 토글·뒤로·앞으로·홈·새로고침·새탭·복사 / **c2 튜토리얼: +토글·홈**(복사 無, 탐색기 열면 빈 상태 확인) / **c3-spawning: 토글 有 → 트리 표시**(파일 존재) / **d2 갤러리: 홈 有·토글 無**(뒤로·앞으로·홈·새로고침·새탭·복사). 사이드바 `.oc-file-sidebar` animationName=`oc-sidebar-open`. 콘솔 0(favicon 404 제외). ⚠ `python3 -m http.server`는 no-cache 아님 — 편집 반영 안 되면 `?v=` bump + `_serve.py` 사용.

**후속 조정 4** (2026-06-12, 좁은 폭에서 상단 바 깨짐 수정):
- **증상**: 미리보기 패널을 드래그로 좁히면 좌·우 버튼 그룹(`flex: 1 1 0; min-width: 0`)이 0폭으로 붕괴 → 뒤로/앞으로·토글이 클립/오버플로, 420px pill이 바를 점유해 깨짐.
- **원인**: 사이드 그룹에 명시한 `min-width: 0`이 flex 기본 `min-width: auto`(=min-content 바닥)를 덮어써 콘텐츠 밑으로 축소·붕괴 허용.
- **수정**(사용자 선택=브라우저식): `SafariChrome` 좌·우 그룹의 `min-width: 0` 제거 → 버튼 그룹은 min-content에서 floor(안 줄어듦), **주소 pill만 먼저 축소**(text-overflow ellipsis로 URL 말줄임). 넓은 폭=정중앙 유지, 좁아지면 주소창이 줄며 약간 우측으로 드리프트(실제 크롬·사파리식).
- **검증**: c4를 360px(미리보기 최소 폭)로 강제 → `barOverflow=0`(안 깨짐), 7개 버튼 전부 바 안, 주소 텍스트 `clipped=true`(말줄임). `?v=` → `20260612safari3`(shared.jsx).

---

## §μ+3 2026-06-11 새 로고 다측 뷰 현행화 + DIG 측면뷰 재작업 (Z. 데모)

**계기**: 사용자가 로고 디자인 갱신 + 다측 뷰 SVG 추가(`logo/jitda_view/`: Front·Front Side·Front Three-Quarter·Left/Right Side·Back·Back2).

**변경**:
- `shared.jsx` — 새 컴포넌트 `JitdaCharFront`(jitda_Front.svg)·`JitdaCharSide`(jitda_Left Side.svg, flip로 우측) 추가(원본 path 그대로 + size/mono). viewBox 638.38×677.65.
- **현행화**: HOP(`JitdaMascot`)·BLUEPRINT(`JitdaMascotBlueprint`)의 `JitdaIcon` → `JitdaCharFront`.
- **DIG 재작업**: 손으로 그린 `JitdaHelmetSide`(폐기) → 새 측면뷰 `JitdaCharSide`. 돔+챙(CUT 0.58)만 노출·얼굴/발은 clip. 지면 마커는 **없음**(직선→곡선→회색타원 모두 폐기, 사용자 최종 "회색동그라미 없애"). 손 크기 = BLUEPRINT 손 비율(rx18). 곡괭이가 clip 라인 아래로 사라지며 흙 튐.
- `viewer.html` — Z 하단줄에 새 로고 정면/측면(좌·우) 단독 셀.

**검증**: `?id=z-mascot` 콘솔 0(favicon 404 제외). 윈드업(헬멧 빼꼼)·내려찍기(곡괭이 사라짐+흙) 사용자 레퍼런스 이미지와 일치. 동기 겹침 테스트 0(CUT 축소로 더 안전).

**후속 보정(logo31~33)**:
- **전신 노출 + 곡괭이질 재구성**: clip 제거해 측면 캐릭터 전신 노출. 팔(손+곡괭이) 한 강체로 머리 위 오버핸드 스윙(swing −108°≈8시반), 머리·팔 키프레임 % 동기, 피벗을 앞으로(helmetX cx+0.13)·z-order(팔 먼저→헬멧)로 들 땐 헬멧 뒤·내려찍을 땐 헬멧 앞.
- **파는 지점 회색 타원(구멍)**: 곡괭이 최저점 바닥에 작은 회색 타원. **뒤 림(전체)+앞 림(하단 절반 clip)** 2겹으로 머리를 그 사이에 끼워 "구멍에서 빠져나오는" 느낌, 곡괭이 머리 끝은 앞 림(하단 곡선부)에만 가려짐. 관통 방지(머리 하단 y165 < 앞 림 바닥). **중간선 제거**: 두 림 반투명 겹침→하단 이중불투명 경계선 → **opacity 1**(동색)로 경계 소거. **가림 비율**: 타원 중심(지면)을 머리 하단 1/3 지점(머리 높이 37px 측정→중심 y153)에 둬 머리 **하단 1/3만** 가려지고 2/3 노출(digHoleY Sy+0.3).
- **발밑 그림자(움직이는)**: 다른 마스코트처럼 캐릭터 발밑 타원 그림자 추가, **bob 동기** `jt-dig-shadow`(들림 15%→scaleX0.76·opacity0.07 작고 옅게 / 내려찍기 46%→scaleX1.12·opacity0.2 크고 진하게). `var(--c-ink)`, reduced-motion 정적값 opacity0.16. 측정 검증: windup 56px@0.07 / impact 83px@0.19. `shared.jsx?v=20260612logo33`.

---

## §μ+2 2026-06-11 JitdaMascotDig 신규 — 땅 파기(측면 land-level) 마스코트 (Z. 데모)

**계기**: 사용자 지시 — Z 영역 로고 애니메이션을 참고해 "땅을 파는 캐릭터" 신규 동작 추가. 3차 반복으로 측면 land-level·머리 위로 넘기는 곡괭이질로 최종 확정.

**추상화 규칙(사용자 명세, 최종)**:
- **측면 land-level 뷰** — 지면 = **회색 직선 하나**(구덩이/구멍 묘사 없음). 선 아래는 clip(=땅속).
- **측면 헬멧**(`JitdaHelmetSide`, 돔+챙) — 윗머리만 지면선 위로 **아주 조금** 빼꼼(나머지 clip), `jt-dig-bob`으로 움찔. (정면 `JitdaIcon`은 어색해서 폐기)
- **어깨(피벗)는 지면선 바로 아래(땅속, 안 보임)**. 손+곡괭이가 **한 강체**로 어깨를 중심으로 각운동 → **손도 곡괭이와 같이 움직임**(고정 아님).
- **머리 위로 넘기는 오버핸드**: 1시(뒤로 든 준비) → 12시(머리 위 통과) → 9시 지나(좌하단) 내려찍기. 9시경 곡괭이가 지면선 아래로 들어가 **clip되어 보이지 않음**.
- 곡괭이는 헬멧 **위로** 지나가며 **겹치지 않음**(헬멧을 어깨 가까이 둬 호의 높은 지점에서 통과). 착지(파는 구멍)는 헬멧 왼쪽.
- 내려찍는 순간 **흙(회색 동그라미 3개)**이 착지점에서 튐.

**변경**:
- `shared.jsx` — `JitdaHelmetSide`(측면 헬멧, viewBox 상단 여백 0) 신규 + `JitdaMascotDig` 재작성. 구조: clip 박스(지면선 아래 가림) 안에 측면 헬멧(`jt-dig-bob`) + 팔 SVG(`jt-dig-swing`, transform-origin=어깨, viewBox 바닥중앙 피벗) → 지면선(회색 rect) → 흙(`jt-dig-dirt` ×3, `--pop`).
- `tokens.css` — `@keyframes jt-dig-swing`(어깨 피벗 오버핸드 +32°→-128°)·`jt-dig-bob`·`jt-dig-dirt`(1.0s 동기화) + `prefers-reduced-motion` 정지.
- `viewer.html` — `ZMascotShowcase` DIG 셀(120·72px), 라벨 "DIG · 머리 위로 곡괭이질(측면)", `shared.jsx?v=20260611dig18`로 캐시 갱신.

**비겹침 보장(핵심)**: 헬멧을 **쉬는(윈드업) 자세의 손 바로 아래**에 배치(helmetH 0.58·poke 0.13·helmetX cx+0.42·Sx cx+0.24, 윈드업 +38~50°; 측정으로 손 x≈235에 헬멧을 맞춤)해 손·곡괭이와 한 덩어리로 붙임 — "헬멧·손/곡괭이 더 가깝게" 요청 반영(헬멧↔손 간격 57px→≈0). 스윙은 거기서 위로 떠나 왼쪽으로 내려찍으므로(우측 정수리 위만 잠깐 고공 통과) 안 겹침. `document.elementsFromPoint` 기반 **기하 정확 겹침 테스트**(전 회전각 +52°~-130°, 1.5° 스텝·1px 그리드)로 **0 겹침** 확인. (초기 버전은 좌하강 -59°~-92°에서 손이 돔 좌측면과 겹쳐 다중에이전트 감사로 적발 → 수정)

**헬멧 모션**: 위아래 움찔(translateY)에 더해 **앞뒤 까딱**(jt-dig-bob rotate, transform-origin=지면선) 추가 — 윈드업엔 살짝 뒤로 젖히고 내려찍을 때 앞으로 숙임(머리 끄덕). "위아래만 말고 앞뒤 기울임" 요청 반영.

**일정 거리 + 축소(최종)**: "뒤=가깝고 앞=멀어짐" 지적 반영 → **헬멧을 스윙 피벗 정중앙(helmetX=Sx=cx)** 에 둠. 손·곡괭이가 헬멧을 중심으로 공전하므로 헬멧↔손 거리가 스윙 내내 **일정**(측정: 전 각도 ~55px, 변동 ≤8px). 팔 최단점(자루 끝동)이 돔 반경보다 커 항상 비겹침(측정 0). "전체 크기 축소" 반영 → W 2.6→2.15·H 1.92→1.58·팔 swH 1.16→0.92·돔 0.58→0.5. **"더 가까이/헬멧 더 보이게" 추가 반영** → 그립을 자루 아래로 내려(viewBox cy 84·93→116·126) 손↔헬멧 거리 ~55px→**~37px**(여전히 일정, 변동 ≤8px), poke 0.11→**0.17**(돔 더 노출). 비겹침 0 유지(전 각도 기하 테스트). `shared.jsx?v=20260611dig18`.

**챙 빼꼼(앞 들릴 때)**: "앞 들렸을 때 안전모 챙 조금 보이게" 요청 → 헬멧을 **좁은 돔 + 넓은 챙**(앞=왼쪽 더 김)으로 재작도, 지면선이 챙 바로 위에 오게 내림(poke 0.17→0.29, helmetH 0.5→0.46). 앞뒤 까딱 진폭↑(윈드업 +9°·내려찍기 −6°). 앞이 들리면 챙이 지면 위로 빼꼼, 숙이면 숨음. 돔을 좁혀 손 거리 ~37px 유지. **시간 동기 겹침 테스트(스윙+틸트 동시 t=0~1000ms) 0 겹침** 확인(챙 보이는 windup엔 곡괭이가 우상단이라 안 닿음).

**검증**: `?id=z-mascot` 콘솔 0 에러. 윈드업(챙 빼꼼)·머리 위 통과·하강 분리·내려찍기 후 지면 아래 소멸·흙 튐 프레임 확인. mono(헬멧·곡괭이 무채색 스왑)·prefers-reduced-motion(흙 idle 비표시) 처리.

**신규 토큰 0개**(키프레임 3종만 추가).

---

## §μ+1 2026-06-10 TutorialPostit 펼친 카드 테이프 잘림 수정

**계기**: 사용자 지시 — 튜토리얼 가이드 펼쳤을 때 `::before` 테이프가 보이지 않음(잘림).

**원인**: `TutorialPostit` 펼친 카드(L1199)에 `overflowY: 'auto'`가 직접 걸려 있었음. CSS 사양상 `overflow-x: visible` + `overflow-y: auto` 조합은 허용되지 않아 `overflow-x`도 자동으로 `auto`가 됨. 결과적으로 카드 박스 위로 솟아나오는 `::before` 테이프(`top: calc(--postit-tape-h * -0.5)` = 약 -4.5px)가 함께 잘림.

**변경** (`participant.jsx` `TutorialPostit` 펼친 상태):
- `.jt-postit-card`에서 `overflowY: 'auto'`·`maxHeight`·`padding`·`display:flex`·`gap` 모두 제거
- 카드 내부에 스크롤 컨테이너 div 신설 — `maxHeight: calc(100vh - 64px)`, `overflowY: auto`, padding/flex/gap 이관
- 카드는 폭·radius·CSS vars(`--postit-rot`·`--postit-tint`)만 유지 → `overflow: visible`(기본값) 보존 → 테이프 정상 노출
- `borderRadius: inherit` 로 내부 스크롤러 모서리 정렬

**검증**: `?id=c2-tutorial-1` (또는 c2-tutorial-2/3/4)에서 펼친 가이드 상단에 테이프 시각화 확인.

**신규 토큰 0개**.

**§μ 후속 결정**: 프롬프트 포스트잇 tint는 `--c-helmet-wash` 유지(사용자 결정). 의미상 `tokens.css:32` 주석은 "anticipation 단계"로 정의돼 있지만, paper-edge 시절부터의 관행 보존(짓다 헬멧 노랑 브랜드 연속성). 후속으로 `tokens.css` 주석에 "사용자 발화 메시지 tint 겸용" 추가 검토.

---

## §μ 2026-06-10 OcUserMessage paper-edge → jt-postit-card 어휘 통일

**계기**: 사용자 지시 — 프롬프트 전송 말풍선이 종이 모양(paper-edge polygon clip-path)인데 디자인시스템 포스트잇 어휘로 바꿀 것.

**변경** (`participant.jsx` `OcUserMessage`):
- `clipPath: OC_PAPER_EDGE` + `WebkitClipPath` 제거 → `className="jt-postit-card jt-postit-card-static jt-postit-tape-md"`
- 인라인 vars 주입: `--postit-rot: var(--postit-rot-c)` (0.6° 미세 회전) · `--postit-tint: var(--c-helmet-wash)` (기존 노랑톤 보존)
- `borderRadius: var(--r-xs)`, padding `13px 18px` → `14px 18px 15px` (tape 시각 균형)
- wrapper `paddingTop: 6` 추가 — tape(8px)이 카드 상단 밖으로 노출되어 잘리지 않도록 여백 확보
- `OC_PAPER_EDGE` 상수 폐기, 헤더 주석 갱신.

**신규 토큰 0개** — 기존 `.jt-postit-card` · `--postit-rot-c` · `--c-helmet-wash` 재사용.

**검증**: `?id=c2-tutorial-1` (튜토리얼 진행) 등 OpenCodeShell 사용 화면에서 사용자 발화가 미세 회전+테이프 포스트잇으로 렌더 — viewer.html 새로고침으로 확인 권장.

**반증·후속(Critical Analysis)**: (a) tape가 채팅 흐름에서 과한 시각 노이즈일 가능성 — 다수 사용자 발화 연속 시 회전 누적이 산만해 보이면 `--postit-rot: 0deg`로 회전만 제거 검토. (b) `--postit-tint`를 helmet-wash 그대로 유지했지만 다른 포스트잇(튜토리얼=tutorial-soft, 팀=hash 3색)과의 색 위계 재검토 여지 — 사용자 발화는 가장 약한 톤이 적절한지 확인 필요.

---

## §24 2026-06-04 OpenCodeShell 라이트 paper + 2-pane 재설계 (c2·c3·c4 공용 셸 교체)

**계기**: 사용자 지시 — `06-design/static-open-code-no-script-desktop.html` (OpenCode "Codle" 변형 스냅샷, `data-theme="jitda" data-color-scheme="light"`) 기반으로 바이브코딩 진행 화면 재설계. 레퍼런스를 읽어 보니 기존 셸과 두 가지 큰 차이:
- **테마 역전**: 기존 다크 SaaS(`#0d0d11`) → 레퍼런스 라이트 paper(`var(--c-paper)` 어휘, paper-edge polygon clip-path 도입)
- **레이아웃 차이**: 기존 단일 채팅 컬럼 → 좌측 채팅(`codle-session-column` ≈460px) + 우측 미리보기 패널(`review-panel`) 2-pane

**기획-디자인 갭 식별**: `2026-05-18_동시편집-캔버스-기획.md` L205·L248 에 이미 *"OpenCode에는 채팅 패널과 미리보기 패널이 있다"* / *"우측: 미리보기 (기존 OpenCode 미리보기 그대로)"* 가 명시돼 있었으나, 디자인 시안의 단일 컬럼 다크 셸이 이를 반영 못한 상태. **본 §24가 갭 해소**.

**결정**:
1. `participant.jsx` `OpenCodeShell` (L494~) 전면 재작성 — 배경 `var(--c-paper)`, 텍스트 `var(--c-ink)/--c-ink-2/--c-slate`, hairline `var(--c-hairline)`, 캔버스 surface `var(--c-canvas)`. 다크 hex 직접 사용 금지(`#0d0d11`·`#1a1a20`·`#d4d4dc` 등 13개 인스턴스 제거).
2. **사용자 발화 paper-edge** — 레퍼런스 `--paper-edge` polygon 값(`polygon(1.2% 3.51%, 18.06% 2.84%, ...)`) 을 `OC_PAPER_EDGE` 상수로 차용해 `OcUserMessage`에 `clipPath`로 적용. 배경 `var(--c-helmet-wash)`(노란 paper-tinted) — 짓다 5상태 `hackathon_running` 컨텍스트 아래 helmet 어휘와 정렬.
3. **2 컬럼 본문** — 좌측 채팅 컬럼 `flex: 0 0 460px` + 우측 미리보기 패널 `flex: 1`. 그 사이 `var(--c-hairline)` 1px divider.
4. **우측 미리보기 패널** — 기본 `OcDefaultPreview` (음료 추천 앱 4 카드 가짜 렌더 · 살구색 배경). props `preview` 로 화면별 교체 가능.
5. **하단 dock(composer)** — `var(--c-canvas)` 카드 + `var(--c-hairline-strong)` 보더 + `radius 8`. chip(Build/Claude Opus 4.5/Default) 은 mono pill, 첨부·크게보기·전송 아이콘 버튼 추가, 전송은 `var(--c-ink)` 솔리드 검정.
6. **OpenCode 내부 상단 바 제거** — 1차 시안에는 햄버거·세션 제목 드롭다운·host/MCP 상태·패널 토글 아이콘이 들어간 별도 상단 바를 만들었으나, **레퍼런스 HTML 에는 그 바가 존재하지 않는다**(`codle-session-column` 이 thread 를 바로 렌더). 사용자 지적으로 잘못된 추측 확인 후 즉시 제거. 짓다 GNB(JitdaToolbar) 아래 곧바로 2-pane 본문.
7. **우측 패널 탭 유지** — `미리보기` / `파일 N` 탭 (`OcTab`) + `OcFileChangesPanel`. props `rightTab` (`'preview'|'files'`) · `fileChanges` 로 화면별 제어. 좌측 채팅 본문 인라인 `OcFileRow` 와 우측 `파일` 탭은 동일 정보의 서로 다른 표상(인라인은 응답 흐름 안, 탭은 모아 보기) — 중복이 아닌 보완.
8. **paper-edge 어휘 잔존 컴포넌트** — `OcStepsRow`(chevron + mono · slate), `OcParagraph`(ink-2/slate), `OcFileRow`(canvas + 상태 배지 mint=A·helmet-deep=M·safety=D), `OcChip`(mono pill), `OcResponseLabel`(`return null` — 라이트 paper 에서 "Response" 라벨이 노이즈).
9. **호출처 정렬** — C2(튜토리얼) `promptInput` 다크 hex(`#8a8a92`·`#d4d4dc`) → `var(--c-ink-2)`·`var(--c-ink-3)`. C4(다인팀) 팀 모드 액션 바 — 다크 backdrop(`rgba(13,13,17,0.85)`) → `var(--c-canvas)` pill + helmet-deep dot. 팀 커서 위치 재조정(다크 텍스트 영역 위 → 우측 미리보기 영역 위, `top/left` 갱신).

**영향 파일**:
- `participant.jsx` L494~ — `OpenCodeShell` 본체 + `OcUserMessage`·`OcStepsRow`·`OcResponseLabel`·`OcParagraph`·`OcFileRow`·`OcChip`·`ocIconBtnStyle`·`OcDefaultPreview` (재작성·신설), `OcTab`·`OcFileChangesPanel` 폐기
- C2/C4 `promptInput` · C4 `overlay` 라이트 어휘 정렬
- viewer.html · Renewal.html · tokens.css · 다른 영역 JSX 무수정 (`OpenCodeShell`/`Oc*` 는 participant.jsx 내부 전용 · `Object.assign` 변동 없음)

**검증**: viewer `?id=c2`·`?id=c3`·`?id=c4` 모두 콘솔 0 에러(favicon 404 제외). 시각 확인: c3 helmet-wash paper-edge 메시지·살구색 미리보기, c4 TeamCursor + paper-edge 메시지 + 우측 미리보기, c2 튜토리얼 가이드 + 새 셸 연동. dialogs.jsx·judge.jsx 에서 `OpenCodeShell`·`Oc*` 참조 0건 — e4/e5 (오버레이 화면) 회귀 없음.

**검증 포인트(향후)**:
- (a) paper-edge polygon clip-path 가 모바일/저해상도에서 픽셀 단위 깨짐 없는지 — 현재 viewer 1280×820 만 검증
- (b) `OcDefaultPreview` 의 살구색 배경(`#fdeed7`)이 토큰화돼야 하는지 (현재 인라인 hex — 추후 `--c-preview-bg` 토큰 후보)
- (c) "Show steps" 디스클로저가 실제 OpenCode 에서는 클릭 시 본문 펼침 — 정적 디자인에선 chevron 만 노출. 실 앱 구현 시 인터랙션 명세 별도 필요
- (d) C4 다인팀 액션 바 위치(`bottom: 86`) 가 chat 컬럼 460px 와 묶인 magic number — composer 높이 변화 시 재조정 필요. 추후 dock 영역 컴포넌트화 시 anchor 로 정리
- (e) Codle 레퍼런스 원본은 3 컬럼 구조(채팅 | 미리보기 | 별도 파일 트리)를 가정하지만 본 시안은 2 컬럼으로 축약(1280×820 폭 제약 + `미리보기/파일` 탭이 파일 트리 역할 일부 흡수). 별도 파일 트리 컬럼 도입은 후속 결정 필요시 별도 ledger.

**반증 시나리오**:
- (i) helmet-wash 노란 user message 가 hackathon_running 외 컨텍스트(tutorial_running 등)에서 의미 충돌 — 현재 c2 튜토리얼에서도 같은 노란색 노출. tutorial purple 변형 도입 여부는 사용자 결정 필요
- (ii) paper-edge polygon 이 한국어 긴 본문(>3줄) 에서 가장자리가 잘리는 시각 결함 — `max-width: 88%` 로 완화했으나 실 사용 데이터로 재검증 필요
- (iii) "OpenCode 원본은 색·모양 변경만, 그 외 재설계" (Renewal.html L587 명시) 원칙과의 정합 — 본 §24는 색·구조 모두 변경. 단, 기획서 L201-254 "OpenCode 채팅+미리보기 2패널"이 우선 근거. 두 원칙 충돌 시 기획서 우선이 §0 우선순위 룰에 부합

---

## §23b 2026-06-02 B-2 종료 화면 보강 + D-1 운영자 갤러리 신설

§23 적용 후 사용자 피드백 6건을 한꺼번에 반영. §23은 그대로 유효, 본 항목은 보강·삭제·신설 모음.

**1. AI 사용량 순위 → 시상대(podium) 어휘**
- 기존: `SummaryRankRow` 5행 + tutorial purple 막대
- 변경: 1·2·3등은 `SummaryPodium` (시상대 메타포 — 2등 좌·1등 중앙·3등 우, 1등이 가장 높음). 색은 1등 helmet(gold)/2등 stone-2(silver)/3등 helmet-deep(bronze 대신 진한 노랑). 팀명·값은 시상대 위, 큰 #N은 시상대 안.
- 4·5등은 막대 없이 작은 행(`SummaryRankRowMini`). 사용자 룰 "막대그래프 없어도될듯".
- 갤러리 인기 순위는 현 디자인(`SummaryRankRow` 막대+행) 그대로 유지. 사용자 결정 "아니다 인기순위는 그냥둬".

**2. LIVE 라벨 노이즈 제거**
- 기존: `LIVE · 종료 후에도 누적 중 · 마지막 갱신 HH:MM:SS`
- 변경: `LIVE · 종료 후에도 누적 중`. `SummaryLiveLabel` `updated` prop 폐기. `SummaryView`의 `lastUpdated` state·`setLastUpdated` 호출 제거 (라이브 시뮬은 좋아요·댓글만 유지).

**3. 운영 결산 eyebrowNote 제거**
- 기존: `● 운영 결산   행사 종료 시점 확정`
- 변경: `● 운영 결산`만. (`eyebrowDot` 검정 + `eyebrow` 라벨만으로 영역 성격 식별 가능 — 부기 카피는 중복.)

**4. 곡선 아래 한 줄 인사이트 카피 제거**
- 기존: 곡선 하단 "완만 → 가팔라짐 · 종료 1시간 전부터 사용량 급증 (막판 몰아치기형)"
- 변경: 카피 라인 통째 삭제. 곡선 자체가 모양으로 인사이트 전달, 텍스트 보조는 군더더기.

**5. "전체 N팀" → 모달 막대 리스트 (간소화)**
- 기존: 텍스트 버튼만(액션 없음)
- 변경: 클릭 시 `AiUsageTeamsModal` 열림. `AbsentTeamsModal` 포스트잇 어휘 차용 (variant="postit" · 회전 hash · jt-postit-tape-lg). 본문은 스크롤 가능한 막대 행 리스트 (`AiUsageTeamRow` · #순위 · 팀명 · tutorial purple 막대 · 토큰 값). 26팀 전체 노출.
- viewer ACTIONS `b2-ended`에 `open-token-all`·`close-token-all` self-loop 추가 (b2-started `open-absent`/`close-absent` 패턴과 동일).
- 모달 헤더 카피: "팀별 AI 사용량 · 26팀 · 행사 종료 시점 확정" — §23b 결정 3에서 본 영역 eyebrow에서 뺀 "행사 종료 시점 확정" 카피는 *모달 헤더*에 한 번 노출(맥락 필요 시).

**6. D-1 운영자 갤러리 신설 (운영자 흐름 복귀 보강)**
- 사용자 지적 "운영자용 갤러리에서는 대시보드로 돌아가기 버튼 추가해줘".
- 기존: `b2-ended.open-gallery: d1-ended` → 참가자 갤러리 화면으로 진입 (운영자 자리 잃음, 복귀 동선 없음).
- 변경:
  - `gallery.jsx` `D1GalleryListEnded`에 `role` prop 추가 (`'participant'` 기본 · `'operator'`). operator일 때 `GalleryHeader role="operator"` + 본문 상단 `BackLink label="대시보드로 돌아가기" dataAction="back-to-dashboard"` + `mineTeam=null` (본인 팀 강조 제거).
  - `BackLink`에 `dataAction` prop 추가 (와이어링 가능). `GallerySubHeader`에 `backDataAction` prop 추가 (BackLink로 전달).
  - 신규 화면 `d1-ended-operator` — viewer SCREENS·Renewal.html artboard 1개씩 추가. 컴포넌트는 `<D1GalleryListEnded role="operator" />`로 재사용.
  - viewer ACTIONS: `b2-ended.open-gallery: d1-ended-operator` (이전 `d1-ended` 직결 변경). `d1-ended-operator.back-to-dashboard: b2-ended` + `open-card: d2`.

**영향 파일**:
- `operator.jsx` L2120 `SummaryView` 영역 — `lastUpdated` state·setter 제거, `SummaryLiveLabel updated` prop 호출 제거, `eyebrowNote="행사 종료 시점 확정"` 제거, 곡선 아래 카피 제거, "전체 N팀" 버튼 `onClick`+`data-action` 추가, 신규 컴포넌트 4개(`SummaryPodium`/`SummaryRankRowMini`/`AiUsageTeamsModal`/`AiUsageTeamRow`)
- `gallery.jsx` — `BackLink` `dataAction` prop, `GallerySubHeader` `backDataAction` prop, `D1GalleryListEnded` `role` prop
- `viewer.html` — SCREENS 1건(`d1-ended-operator`) + ACTIONS 4건(`b2-ended` self-loop 2 · `d1-ended-operator` 2)
- `Jitda Renewal.html` — artboard 1건(`d1-ended-operator`)
- `STRUCTURE.md` §3 D-1 행 1개 추가, §7 와이어링 표 2건 갱신, 풀 스토리 갱신, 변경 이력 1줄

**검증**: viewer `?id=b2-ended` (podium·LIVE 노이즈 제거·모달), `?id=d1-ended-operator` (대시보드 복귀 버튼). 콘솔 0 에러(favicon 제외).

**검증 포인트(향후)**:
- (a) 시상대 메타포가 K-12 교사에게 직관적인지 — gold/silver/bronze 어휘 친숙성 검증
- (b) 1등 helmet과 3등 helmet-deep이 명도 차이만으로 충분히 구별되는지 (사용자 색약 등 접근성)
- (c) 모달이 viewer에서만 작동(자체 state) — 실 앱은 URL 쿼리·해시로 모달 상태 보존 필요
- (d) `d1-ended-operator`가 참가자 `d1-ended`와 컴포넌트 공유 — 향후 운영자 전용 메타(통계·관리 액션) 추가 필요 시 분리 가능
- (e) `b2-started`에서 진행 중 갤러리 진입(`open-gallery: d1`)도 동일 운영자 복귀 패턴 필요한지 — 후속 결정

---

## §23 2026-06-02 B-2 ⑥ 해커톤 종료 화면 재설계 — 운영 결산(고정) + 갤러리 호응(라이브) 2영역

**계기**: 사용자 지적 "현재 종료 화면(b2-ended)은 12팀 카드 그리드가 D-1 갤러리와 어휘 중복이라 불필요하다. 운영자가 종료 직후 실제로 필요로 하는 정보가 뭔지 다시 검토하라."

**비판적 검토 — 운영자 JTBD 4가지**:
1. 결산 보고 (상급자/주최측)
2. 이슈 처리 — *비공개 자동 강제 공개로 제거됨* (사용자 확인)
3. 산출물 배포/아카이브
4. 회고/하이라이트

**도메인 제약 2건 (사용자 확인으로 설계 변경)**:
- 비공개 팀도 종료 시 **자동 강제 공개** → "공개율" KPI·"비공개 처리 필요" 패널 모두 제거
- 좋아요·댓글은 **종료 후에도 계속 누적** → 종료 화면이 "박제된 결산"이 아니라 "갤러리 진입 + 라이브 호응 추적"의 성격을 가짐

**핵심 결정**:
1. **2영역 시간 성격 분리** — `eyebrow` 라벨·dot 색으로 시각 분리:
   - **운영 결산(고정)**: 행사 종료 시점 확정, 안 바뀜 — AI 사용량 총량·곡선·팀 순위
   - **갤러리 호응(라이브)**: 종료 후에도 누적 — 좋아요·댓글 총량·팀 인기 순위 + mint pulse LIVE
2. **좌우 2단 병치** — 두 영역 가로 grid(`1fr 1fr`). 각 영역 내부는 본문(곡선/타일) 위 + 순위 TOP 5 아래의 세로 stacking.
3. **카드 그리드 폐기** — `<ActivityGrid variant="summary" />` + `<Pagination>` 호출 제거. D-1 갤러리와 어휘 중복 해소.
4. **AI 사용량 본문**:
   - 큰 누적 토큰 숫자(`formatTokens` mono 어휘) + 팀 평균 부기
   - SVG 누적 곡선(`SummaryTokenCurve`) — X축 0:00~4:20, 튜토 종료(0:32) 점선 마커, Y축 0~totalTokens, S-curve with late acceleration (막판 몰아치기형 mock)
   - 한 줄 인사이트 카피 ("완만 → 가팔라짐 · 종료 1시간 전부터 사용량 급증")
   - 팀별 순위 TOP 5 — b2-started `TokenTeamCard` 어휘(#N · jt-mono · 가로 막대) 차용. tutorial purple bar.
5. **갤러리 호응 본문**:
   - 좋아요·댓글 메트릭 타일 2개(`SummaryMetricTile` · safety/mint accent)
   - "갤러리는 종료 후에도 계속 운영됩니다" 정책 안내 박스(paper bg + dashed border)
   - 팀별 인기 TOP 5 — safety orange bar + ♥ 아이콘 suffix, "지금 기준" 라이브 라벨
   - 갤러리 진입 CTA(`jt-btn-critical`)는 영역 헤더 우측 action 슬롯
6. **라이브 시뮬레이션** — `setInterval(2800ms)` 좋아요 +1~3팀 / 댓글 +1 가끔, `lastUpdated` 시각 mono 표기. b2-started ActivityView 시뮬 패턴 차용.

**핵심 KPI 3카드 정렬 변경**:
- 이전: 참가팀 / 운영 시간 / 갤러리 좋아요(355 고정)
- 이후: 참가팀(인원 부기) / 운영 시간(튜토+본행사) / **AI 사용량(누적 토큰·팀 평균)** — 좋아요는 라이브라 KPI에서 빠지고 갤러리 호응 영역 안으로 이동

**영향 파일**:
- `operator.jsx` L2120: `SummaryView` 전면 재작성, sub-components 8개 신설(`SummaryKpiRow`, `SummaryBlock`, `SummaryLiveLabel`, `SummaryAiUsage`, `SummaryTokenCurve`, `SummaryGalleryResponse`, `SummaryMetricTile`, `SummaryRankRow`). `ActivityGrid summary variant`·`Pagination` 호출 끊김(legacy 코드는 유지 — 1주 무사용 확인 후 정리 검토)
- 라벨/와이어링 변경 없음 → `viewer.html` SCREENS·ACTIONS, `Jitda Renewal.html` artboard 무수정. `tokens.css` 무수정.

**검증**: viewer.html `?id=b2-ended` 렌더 — 콘솔 0 에러(favicon 제외), KPI 3카드 정상, 누적 곡선 SVG 렌더, 좋아요/댓글 setInterval 라이브 증가 확인. b2-started 회귀 없음 (TokenLeaderZone 어휘 그대로 사용).

**검증 포인트(향후)**:
- (a) 토큰을 시간 해상도로 저장하는지 — 백엔드 스키마 확인 필요. 총합만 저장한다면 곡선은 mock 영구화 또는 제거.
- (b) `STARTED_TEAMS` mock의 총량(~277k)이 실제 30팀×4시간 행사 토큰량과 정렬되는지 — 실측 후 mock 정렬.
- (c) "팀별 순위" 좌측 정렬에서 *적게 쓴 팀*이 노출 안 됨 → 사용자 결정으로 격차 라벨링 부담 회피, 다만 운영자가 "활동 저조 팀"을 어디서 보는지 후속 검토.
- (d) 운영자가 종료 후 며칠에 걸쳐 다시 들어오는지 — 라이브 영역의 가치는 재방문 빈도에 비례. 재방문 0이면 이메일 알림이 더 적합.
- (e) "AI 사용량 ≈ 좋아요 순위" 시 *건강한 행사*, 어긋날 시 *효율/헤맴* 같은 비교 시각화는 v2 이후 후속 결정.

---

## §22 2026-06-02 브랜드 로고 교체 (캐릭터 + jitda 통합 워드마크)

**계기**: `06-design/Jitda UI design/jitda_logo.svg` 신규 로고 자산 도입. 기존 헬멧+콧수염 마크는 폐기.

**변경 요약**:
- `shared.jsx` `JitdaMark` 전면 재작성 — 별도 `JitdaLogo` 아이콘 + "짓다"/"Jitda" 텍스트 스팬 구성 폐기. 단일 SVG 인라인(노란 캐릭터 + 다크 `jitda` 워드마크)으로 통합.
- API: `size`는 렌더 높이(px). 너비는 원본 비율 774.61:304.29 자동. 기본값 24. `hideText` prop 제거 (워드마크 포함 SVG라 의미 없음).
- `mono` 모드: `#3f3934`(다크 잉크) → `#ffffff`로 스왑. 노란 캐릭터 색(`#ffce2c`/`#fcc204`/`#e9ad03`)은 어두운 배경에서도 식별성 위해 유지.
- `JitdaLogo`(구 헬멧 마크)는 외부 사용처 없음. window export는 유지하나 내부 호출 끊김 — 추후 정리 후보.
- `viewer.html`: `shared.jsx?v=` 캐시 토큰을 `20260601g` → `20260602a`로 갱신.

**호출 영향 (5곳, 시각적 사이즈 소폭 축소)**:
- `auth.jsx:30` (A-1) `size={22}` — 가로 56×세로 22.
- `auth.jsx:89` (A-2 mono) `size={22}` — 가로 56×세로 22, ink #fff.
- `shared.jsx:221` (BrowserChrome 헤더) `size={18}` — 가로 46×세로 18.
- `participant.jsx:448`, `gallery.jsx:65` 동일.

**검증**: viewer.html A-1·A-2 새로고침, `svg[aria-label="짓다 Jitda"]` 단일 노드 렌더 + 콘솔 0 에러 + mono에서 ink fill = `#ffffff` 확인.

---

## §21 2026-06-01 B-2 ⑤ 해커톤 진행 화면 재설계 + 손들기 기능 신설

**계기**: 사용자 지적 "해커톤 진행 도중 각 팀의 라이브 미리보기는 운영자 의사결정에 무의미하다 — 240×140 썸네일에선 글자·UI 식별 불가하고, 30~60팀 그리드에선 정작 *주의가 필요한 팀*이 군중 속에 묻힌다. 운영자가 실제로 필요로 하는 정보가 무엇인지 다시 설계하라."

**핵심 결정 (사용자 피드백 4건 반영)**:
1. **남은 시간 KPI 제거** — 해커톤 종료는 운영자가 누르는 액션이지 사전 확정 시각 아님. 헤더 `경과 시간`만 노출.
2. **불참 팀 별도 섹션 분리** — `firstActivity === false`(행사 시작 후 한 번도 활동 없음)인 팀을 *위험*과 분리. 초반에 "위험 vs 미접속" 오분류 방지.
3. **공지 보내기 기능 폐기** — 본 화면에 broadcast UI 두지 않음. 운영자 → 학생 채널은 대면 운영 + (향후) 손들기 응답에 위임.
4. **손들기 기능 신설** — 학생 능동 신호. 별도 기획서 `03-planning/product/2026-06-01_손들기-기획.md` 참조.

**변경 요약**:
1. **`operator.jsx`**:
   - `ActivityView` 전면 재작성. 라이브 미리보기 그리드(`ActivityGrid`/`ActivityRow`/`LivePreview` 기반) 폐기 — 운영자 의사결정에 무익.
   - 4단 우선순위 컴포지션: `ActivityHeader` (큰 숫자 메트릭) → `ActivityDistributionBar` (4-segment stacked) → `HandRaisedSection` (P0, 빈 상태 시 섹션 자체 숨김) → `AlertSection` (P1, 위험·주의 정체) → `AbsentSection` (P3, 별도 섹션).
   - 신규 컴포넌트 7종: `ActivityHeader`, `ActivityDistributionBar`, `SectionHeader`, `HandRaisedSection`, `HandRaisedRow`, `AlertSection`, `AlertRow`, `AbsentSection`. 시각 어휘는 `TutorialProgressView`·`TutorialProgressBar`·`TutorialKanbanColumn` 헤더와 정합 (accent line + eyebrow + mono count).
   - 정렬 원칙: 모든 리스트 "심각도 내림차순" — 손든 팀은 `handRaisedSec` 큰 순, 정체 팀은 `idleMin` 큰 순.
   - `STARTED_TEAMS` mock 데이터 갱신: `activity`/`last`/(legacy) 폐기 → `idleMin`(정수 분)·`firstActivity`(boolean)·`handRaisedSec`(int|null)로 교체. 시연 분포 — 손든 2 / 불참 4 / 위험 1(20분 임계) / 주의 4(10~20분) / 정상 19. `published`는 유지.
   - 분류 룰: `handRaisedSec != null` → 손든 / `!firstActivity` → 불참 / `idleMin >= 20` → 위험 / `idleMin >= 10` → 주의 / 그 외 → 정상. 손든 팀은 정체 카운트에 중복 합산 안 함(handRaised로만 분류).
   - `DashboardShell` mode='activity' 호출부 갱신: `pagedTeams`/페이지네이션 props 제거, `teams` 전체와 `totalTeams`만 전달 (페이지네이션 폐기 — 4 섹션 모두 한 화면에 들어옴).
2. **`shared.jsx`**:
   - `Icon.hand` (lucide Hand 4-finger silhouette) — 손들기 신호 전용.
   - `Icon.clock`, `Icon.activity` — 진행 시간·활동 추이 보조용 (현 화면 미사용, 향후 spark 차트 대비).
3. **`viewer.html` / `Jitda Renewal.html`**: 컴포넌트 ID(`b2-started`) + export(`B2DashboardStarted`) 그대로 — 신규 등록 불필요.

**§21-6 2026-06-02 후속 — 6열 단일 칸반(토큰 + 손든 + 잠시 멈춤) + 손든 blue 어휘 + 토큰 막대 그래프**

**계기**: 사용자 룰 — 전체 레이아웃 6열로 재구성, 각 zone 10행, 토큰 zone 좌측 카드 + 우측 막대 그래프. 손든 색이 주의(helmet-wash)와 비슷해 비직관적 → 다른 색으로 변경.

**변경**:
1. **6열 grid 단일 칸반 (3 zone × 2col)**:
   - 토큰 zone (col 1-2): 별도 `TokenLeaderZone` 신설. 좌 col 팀 포스트잇 + 우 col 가로 막대 그래프 + 축약 토큰 라벨. 각 row = 한 팀, 1등(`maxTokens`) 기준 % bar length.
   - 손든 zone (col 3-4): 2col sub-grid × 10행 = 20 카드/페이지.
   - 잠시 멈춤 zone (col 5-6): 2col sub-grid × 10행 = 20 카드/페이지.
   - 페이지네이션 통합: `totalPages = max(tokenPages, handRaisedPages, alertsPages)` — 모든 zone 동시 다음 페이지.
   - 직전 단독 `TokenLeaderboard` 섹션 폐기 → 칸반 내부로 통합.
2. **토큰 막대 그래프 (`TokenBarCell`)**: 1등 막대 helmet, 2등부터 ink-3. 우측 축약 라벨(22.4k / 1.2M) + 호버 시 풀 숫자.
3. **토큰 카드 (`TokenTeamCard`)**: 직전 v5 "카드 위 큰 숫자" 폐기 — 숫자 옆 막대로 이관. 카드 안엔 순위 + 팀명 + 인원만.
4. **손든 카드 색 변경 (helmet-soft → blue-soft)**:
   - 직전 v5 helmet-soft tint가 주의(helmet-wash)와 색조 충돌. 사용자 룰: 다른 색.
   - 선택: blue-soft tint + blue accent — 노랑-주황 spectrum과 명확히 분리. "도움 요청 = 정보 신호" 메타.
   - ✋ / 경과시간 / hover 색 모두 blue 어휘로 통일. [해결] 버튼 hover는 stache 검정 (색 충돌 회피).
   - 손든 zone bg: rgba(255,206,43,0.07) → rgba(24,99,220,0.05).
5. **토큰 zone 색**: neutral — accent ink-3, bg rgba(20,19,15,0.025). 손든(blue)·잠시 멈춤(safety)과 채도 차이.

**최종 색 분류**:
| Zone | tint | accent |
|---|---|---|
| 토큰 | stone | ink-3 |
| 손든 | blue-soft | blue (v6 신규) |
| 위험 | safety-soft | safety-deep |
| 주의 | helmet-wash | helmet-deep |

**반증 시나리오 2종**:
1. **손든 zone 데이터 적을 때 빈 공간**: 평시 ≤ 3건이라 비어 보임. 완화 — alignContent: 'start', 빈 영역도 zone bg(blue tint)로 채워져 시각적 공간이지 결손 아님.
2. **토큰 막대 1등 기준 %라 절대값 추이 안 보임**: 옆 mono 라벨에 절대값 노출. 사용자 룰("1등을 100%로") 유지하되 절대값 보완.

**영향**: `TokenLeaderboard`/`TokenLeaderboardPostit` 폐기. `TokenLeaderZone`/`TokenTeamCard`/`TokenBarCell` 신설. `HandRaisedPostit` 색 변경.

---

**§21-5 2026-06-02 후속 — 손든 카드 확장 + 위험·주의 색 분리 + 불참 모달 이관 + 토큰 TOP 5 리더보드**

**계기**: 사용자 피드백 4건 동시 반영.

**변경**:
1. **손든 포스트잇 확장 (2줄 + 큰 [해결] 버튼)**:
   - 인원수(`memberLabel`) 표시 제거 — 1줄에 ✋ + 팀명만.
   - 2줄: 경과 시간 + `[✓ 해결]` chip 버튼. 버튼 크기 22px → 28px height + fontSize 10.5 → 12 + padding 8 → 14. hover 시 helmet bg + shadow lift.
   - 카드 `minHeight` 60 → 76px (다른 컴팩트 60px 카드와 시각 차이 — 손든 팀은 액션 카드라 차별화).
2. **위험·주의 카드 색 분리 (§18-27 예외 확대)**:
   - 직전 v3: 위험·주의 둘 다 흰색 + dot 색만 분리.
   - v5: tint를 severity별로 — 위험 `var(--c-safety-soft)` (옅은 주황), 주의 `var(--c-helmet-wash)` (paper-tinted 옅은 노랑).
   - 손든 `helmet-soft`(#fff4c2) > 위험 `safety-soft`(#ffe0cf) > 주의 `helmet-wash`(#fbf6df) > 정상 흰색 spectrum. 손든이 명도·채도 모두 가장 강조 유지.
   - §18-27 단일 흰색 룰의 명시적 예외 — *상태 신호* 색 부여. §21-3에서 손든 한 종류였던 예외가 위험·주의로 확장.
3. **불참 팀 → 헤더 우측 텍스트 버튼 + 포스트잇 모달**:
   - 직전 v3 `AbsentCollapsible` (하단 접힘 섹션) 폐기.
   - 헤더 우측 `[행사 미입장 N팀 →]` 텍스트 버튼으로 이관. 갤러리 공개 정보 자리(이전 §21-4에서 갤러리 공개 표시는 제거됨).
   - 클릭 시 `AbsentTeamsModal` 신설 — ModalSurface `variant="postit"` + `jt-postit-tape-lg` (RosterTeamDetailModal 어휘 차용). 회전 hash는 첫 팀명 기준.
   - 모달 본문: 작은 AbsentPostit grid (auto-fill minmax 180px) + 페이지네이션 (한 페이지 10팀, `ABSENT_PER_PAGE = 10` 그대로 유지).
   - viewer.html ACTIONS: `'b2-started'`에 `'open-absent'` / `'close-absent'` 추가 (자기 화면 유지 — 모달은 컴포넌트 내부 state).
4. **토큰 사용량 TOP 5 리더보드 (신규 섹션)**:
   - `TokenLeaderboard` + `TokenLeaderboardPostit` 신설. 화면 하단(불참 섹션이 비운 자리).
   - 데이터 흐름 (mock 코멘트): `tokensUsed` 필드. 각 팀이 매 AI 동작(generate·edit·chat) 종료 시 사용 토큰을 서버 전송 → `hackathon_teams.tokens_used` 누적.
   - 노출: `firstActivity=true && tokensUsed > 0` 팀 중 내림차순 상위 5팀.
   - 가로 5등분 grid (사용자 룰: "5팀을 가로 일렬, 왼쪽이 1등").
   - 각 카드: 카드 *위에* 큰 mono 토큰 숫자 (사용자 룰: "포스트잇 위에 몇 토큰인지 숫자텍스트로 명시") + 카드 안에 순위(`#1`~`#5`) + 팀명 + 인원.
   - 1등 강조: 카드 tint `var(--c-helmet-soft)` + `★ 1` 마커 + 숫자 색 `var(--c-blue)` + 큰 사이즈(18px). 2~5등은 흰색 카드.
   - 섹션 헤더: bolt 아이콘 + "토큰 많이 쓴 팀 · 왼쪽이 1등 · TOP 5".
5. **mock 데이터 갱신**:
   - `STARTED_TEAMS` 30팀에 `tokensUsed` 필드 추가. 분포: 0(불참 4팀) ~ 22,450(TOP 1 세그폴트 어택). 활동 팀 26팀의 분포는 1,620 ~ 22,450.
   - TOP 5 시연 데이터: 세그폴트 어택(22,450) · undefined(20,180) · 스택 오버플로우(19,560) · 디버그 라이프(18,420) · 터미널 사파리(17,890).

**반증 시나리오 4종**:
1. **TOP 5 리더보드가 학생 경쟁심을 자극해 의도와 어긋날 우려**: 운영자 전용 화면이고 학생에게 노출 안 됨. 운영자가 화면을 학생들에게 보여주지 않는 한 무관. 향후 학생 측에 노출하려면 별도 정책 결정 필요.
2. **토큰 많이 쓴 팀 = 잘하는 팀인가**: 토큰 ≠ 품질. 같은 작업도 효율적 프롬프트는 토큰 적게 씀. 라벨이 "토큰 많이 쓴 팀"으로 가치 중립적 — 운영자가 활성도 신호로 해석. "TOP" 라벨에 가치 함의 있지만 1등 강조는 시각 위계 표현이지 우수 인증이 아님. UX 라이팅 후속 검토 여지.
3. **위험·주의 색 추가로 손든 팀 시각 강조 약화**: spectrum 위계는 helmet-soft > safety-soft > helmet-wash로 손든이 가장 강함. 다만 위험(safety-soft)이 채도·명도에서 손든과 비슷할 수 있음. 시연 결과 손든은 우측 ✋ 마커 + [해결] 버튼이 추가 시그널로 작동해 충돌 미발생.
4. **불참 모달이 깊은 정보 접근에 한 클릭 추가**: 직전 접힘 섹션은 펼치기 한 번이면 인라인 확인 가능. 모달은 클릭→보기→닫기 3액션. 다만 불참은 평시 자주 확인할 정보 아님(행사 시작 초반 출석 확인 시점만 빈도 높음). 모달 이관으로 평시 화면 한산화 효과 더 큼.

**영향**:
- **B-2 ⑤ 해커톤 진행**: 화면 구성 변경 — 헤더 우측 불참 버튼 / 손든 카드 확장 / 위험·주의 색 / 하단 토큰 TOP 5.
- **`AbsentCollapsible` 컴포넌트 폐기** — `AbsentTeamsModal`로 대체. `AbsentPostit`은 모달 내 그대로 사용.
- **viewer.html ACTIONS**: b2-started 엔트리에 `open-absent`/`close-absent` 추가.

---

**§21-4 2026-06-02 후속 — 칸반 페이지네이션 + 정체 기준 명확화 + 손들기 해제 정책 변경 + UX 라이팅 정비**

**계기**: 사용자 피드백 5건 동시 반영.

**변경**:
1. **헤더 라이팅 간결화**:
   - h3 "팀 활동" → "해커톤 진행상황"
   - "잘 가고 있어요" → "순항" (한 글자로 압축)
   - "도움 필요 N" chip 제거 (칸반 zone 카운트에 중복)
2. **칸반 페이지네이션 (사용자 룰 — 행 기반)**:
   - 튜토리얼 칸반(`TutorialKanban`): 컬럼당 10팀(10줄). 어느 컬럼이라도 10초과면 페이지 활성. 모든 컬럼 동시 다음 페이지로 슬라이스 (`TUTORIAL_PER_COL = 10`). mock 32팀(완료 20팀) → 2 페이지 활성 확인.
   - 활동 칸반(`ActivityKanban`): zone당 3행. 손든 zone 6 카드(2col × 3행, `HAND_RAISED_PER_PAGE = 6`), 챙겨야 할 zone 9 카드(3col × 3행, `ALERTS_PER_PAGE = 9`). `totalPages = max(handRaisedPages, alertsPages)`.
   - 불참 토글(`AbsentCollapsible`): 펼침 시 한 페이지 10팀(`ABSENT_PER_PAGE = 10`).
   - `KanbanPagination` 신설 — shared `Pagination`(L515)의 카드 개수 표시 대신 페이지 카운트만 (`page / totalPages`). ghost 버튼 어휘.
3. **정체 기준 명확화 (사용자 룰 — AI 응답 제외)**:
   - `idleMin` 정의: "마지막 *사용자 입력* 후 경과 분". AI 응답 대기·생성 중 시간은 합산 안 함 — 학생이 멍하니 있는 게 아니라 작업 진행 중.
   - mock 코멘트에 정의 명문화 (operator.jsx L296~).
   - 챙겨야 할 zone 헤더 sub: "10분 이상 활동이 없어요" → "10분 이상 입력 없음".
   - zone 헤더에 (i) info 아이콘 + native title 툴팁 (3줄): "기준: 마지막 학생 입력 후 경과 시간 / • AI 응답 대기·생성 중은 제외 / • 🟡 주의 10~20분  • 🔴 위험 20분 이상".
   - AlertPostit dot에도 개별 title — 호버 시 severity 설명 (`cursor: 'help'`).
   - 카드 라벨: "○분 무활동" → "○분째 입력 없음" / "○분째 멈춤".
4. **손들기 해제 정책 변경 (사용자 룰 — 2분 자동 해제 폐기)**:
   - 자동 해제 cron·타이머·UI 카운트다운 모두 제거. 해제 경로 2가지로 단순화 — ① 학생 토글 OFF ② 운영자 [해결] 액션.
   - `HandRaisedPostit`에 `[✓ 해결]` chip 버튼 추가 (우측 하단). stache border + canvas bg + hover helmet bg. `e.stopPropagation()`로 카드 본체 클릭과 분리.
   - `formatHandRaisedRemaining` 함수 폐기. 카드에서 "○남음" 노출 제거.
   - viewer.html ACTIONS: `'b2-started'`에 `'resolve-hand-raise': 'b2-started'` 추가 (자기 화면 유지).
   - 손들기 기획서 v2 갱신 — 자동 해제 폐기·해결 버튼·시간 무한 유지 명문화.

**반증 시나리오 3종**:
1. **자동 해제 폐기 후 손든 팀 카드 무한정 쌓임**: 운영자가 자리 비우거나 못 보면 카드 누적. 완화 — 시간순 정렬로 오래된 팀이 항상 위. 칸반 zone 페이지네이션(6 카드/페이지)으로 폭주 시에도 한 화면에 적정량만 노출. 폭주 자체가 운영 문제 신호 → 운영자가 인지하고 대응.
2. **"3행 = 6 카드/페이지"가 60팀 행사에 충분한가**: 손든 팀이 7+ 동시 발생 시나리오는 평시 드뭄. 시스템 장애·이벤트 종료 등 비정상 상황이면 페이지네이션이 자연스레 표면화 → 운영자 인지. 평시 ≤ 3팀 시나리오에는 한 페이지로 충분.
3. **AI 응답 중을 idleMin에 합산 안 한다고 했는데 학생이 *진짜로* 멍한 경우와 구분 불가**: 클라이언트 측 "사용자 입력 이벤트"는 추적 가능(키 입력·마우스·캔버스 변경). AI 응답 중에는 별도 server-side timer가 idle clock을 정지. 단, 학생이 AI 응답을 보면서 다음 행동 결정하는 "능동적 대기" 시간은 기술적으로 idle로 잡힐 수 있음 — 이건 허용 범주(어차피 10분 임계 안에서 처리됨).

**영향**:
- **B-2 ⑤ 해커톤 진행**: 칸반 페이지네이션·정체 기준·손들기 해제·헤더 라이팅 모두 변경.
- **B-2 ② 튜토리얼 진행**: 칸반 페이지네이션 추가. mock 32팀에서 완료 컬럼 20팀 → 페이지 2개로 분할 표시.
- **손들기 기획서**: v2 갱신 — 데이터 모델 단순화(자동 해제 필드 제거), 학생/운영자 시나리오 갱신, UI 명세 갱신.

---

**§21-3 2026-06-02 후속 — 칸반 어휘 정렬 + UX 라이팅 정비 + 불참 팀 강등 + 갤러리 진입**

**계기**: 사용자 피드백 5건 동시 반영.

**변경**:
1. **P0/P1/P3 코드 라벨 폐기 → 운영자 언어 채택**:
   - 헤더 "정상 진행" → "잘 가고 있어요" / "챙길 팀" → "도움 필요"
   - 손든 zone: "손든 팀" → "지금 손들었어요 · 학생이 도움을 요청했어요"
   - 정체 zone: "챙겨야 할 팀" → "잠시 멈춰 있어요 · 10분 이상 활동이 없어요"
   - 불참 섹션: "불참 팀" → "행사에 입장하지 않은 팀"
   - 카드 내 "○분 무활동" → "○분째 멈춤"
2. **5열 칸반 (튜토리얼 어휘 정렬)**:
   - `ActivityKanban` + `ActivityKanbanZone` 신설. `TutorialKanban`/`TutorialKanbanColumn`(L853~930)과 동일 어휘 — 5컬럼 grid · dashed 수직 divider · wash bg · accent 10×3 line + 라벨 + 우측 count.
   - 비균등: 손든 zone `gridColumn: span 2` (helmet-wash bg) + 챙겨야 할 zone `span 3` (safety-wash bg).
   - **Zone 내부 sub-grid** (2026-06-02 후속): 손든 zone 안에 2열 `repeat(2, 1fr)` grid, 챙겨야 할 zone 안에 3열 `repeat(3, 1fr)` grid. 결과적으로 카드 폭이 외부 5컬럼의 1컬럼 폭(~225px)과 정확히 일치 → **튜토리얼 칸반 RosterRow와 동일 카드 사이즈**. 카드 4+ 자동으로 다음 행에 채워짐.
   - 빈 zone: `KanbanEmpty` placeholder ("손든 팀 없음 — 좋아요" / "모든 팀 잘 가고 있어요" + check 아이콘).
3. **손든 팀 포스트잇 색 강조 (§18-27 합리적 예외 명문화)**:
   - `HandRaisedPostit`의 `--postit-tint`를 `var(--c-helmet-soft)` (옅은 노랑)으로 설정.
   - §18-27 "단일 흰색" 룰의 명시적 예외 — 색은 *팀 정체성*이 아닌 *현재 상태 신호*로서. 같은 팀이 다른 화면(RosterRow 등)에선 흰색 유지 → 색은 "이 화면 이 순간" 한정.
4. **팀 카드 컴팩트 통일**:
   - `HandRaisedPostit`/`AlertPostit` 사이즈 RosterRow와 동일 `minHeight 60px` + 8px 좌우 패딩. 직전 v2 큰 카드(116/92px) 폐기.
   - 정보 밀도: 한 행에 팀명 + 인원, 두 번째 행에 시그널(경과시간/멈춤시간). [응답함] 버튼은 카드에서 제거 — 카드 클릭 = 팀 상세 모달에서 응답 액션 (60px 공간 부족).
5. **불참 팀 접힘 강등**:
   - `AbsentCollapsible` 신설. 직전 `AbsentSection` 폐기.
   - 기본 collapsed 한 줄 토글 ("행사에 입장하지 않은 팀 N · 시작 후 활동 0건 · 펼치기"). 행사 미입장 팀은 운영자 액션 영향 거의 없음 — ledger 용도.
   - 펼침 시 작은 포스트잇 grid (opacity 0.72).
6. **갤러리 진입 버튼**:
   - sticky 헤더 우측 `hackathon_running` statusActions에 `[갤러리]` (jt-btn-secondary, gallery 아이콘) 추가. `[종료]` 좌측.
   - viewer.html ACTIONS: `b2-started`에 `'open-gallery': 'd1'` (진행 중 → 진행 갤러리) + `'open-team': 'b2-roster-detail'` 추가.
7. **헤더 needs-attention 합계**: 직전 v2는 불참까지 합산했으나, *액션 가능한 신호*(손든+위험+주의)로만 한정. 불참은 별도 토글 섹션에서 카운트.

**반증 시나리오 2종**:
1. **5열에서 손든 zone 2col이 카드 1열만 쌓이면 가로 공간 낭비**: 60팀 행사에서 손든 팀이 5+ 동시 발생 가능 — 그때는 zone 내부 grid가 자연스럽게 가로로 채움(현재는 flex column이라 세로 적층). 폭주 시나리오 검증 후 zone 내부를 `display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`로 전환 가능. 손든 팀 2~3개 평시 시나리오는 현 어휘로 충분.
2. **손든 팀 helmet-soft tint가 §18-27 룰을 흐림**: 룰 정의(§18-27)는 "단일 흰색 정책" — 명시적 예외 추가는 정책 점진적 무너짐 위험. 완화 — §21-3에 "상태 신호 한정 / 화면 한정 / 다른 화면에선 흰색 유지" 3-조건 예외 명문화. 향후 새로운 색 신호 추가 시엔 별도 정책 결정 필요.

**영향**:
- **B-2 ⑤ 해커톤 진행 화면**: 칸반 어휘 정렬로 튜토리얼 화면(b2-tutorial-running)과 시각 일관. 운영자가 두 화면 사이를 오가도 학습 비용 없음.
- **viewer.html ACTIONS**: b2-started 엔트리 확장 (open-gallery·open-team 와이어링).
- **`b2-roster-detail` 모달**: 진입 경로가 b2-tutorial-waiting/b2-hack-waiting에 더해 b2-started에서도 가능. 닫기 액션(`close-roster-detail`)은 현재 b2-tutorial-waiting으로만 복귀하도록 매핑되어 있음 — 진행 화면에서 열린 후 닫으면 튜토리얼 대기로 점프하는 데모상 어색함이 있으나, viewer 데모용이라 무방.

---

**§21-2 2026-06-01 후속 — 팀 카드 포스트잇 어휘 통일 (룰 명문화)**

**사용자 룰**: "팀은 항상 포스트잇 카드로 표현한다." — 디자인 시스템 룰로 승격. 기존 §18-27(단일 흰색)·§19-4(tape 박힌 점 회전축)·`.jt-postit-card` primitive 정책의 자연스러운 확장. 운영자/참가자/갤러리 어느 화면이든 "팀"을 카드로 렌더할 때는 포스트잇 어휘(`jt-postit-card` + 팀명 hash 회전 + tape)가 기본값.

**변경**:
- `HandRaisedPostit`·`AlertPostit`·`AbsentPostit` 3종 신설, 직전 v2 row-list (`HandRaisedRow`·`AlertRow` + chip pill) 폐기.
- 모든 카드 공통: `.jt-postit-card` + `--postit-rot: postitRotation(team.name)` + `--postit-tint: var(--c-canvas)` (§18-27). 회전·tape·hover 어휘는 primitive 그대로.
- 카드 크기 단계: 손든 팀 minmax(340px, 1fr) + `jt-postit-tape-md`(40×8) / 챙겨야 할 팀 minmax(240px, 1fr) 기본 tape(26×6) / 불참 팀 minmax(170px, 1fr) 기본 tape — RosterRow와 동일 규모.
- 신호 표현 (§18-18 룰 차용 — "카드 색=정체성, 신호=카운트 색·weight"):
  - 손든 팀: 카드 흰색 유지, 우상단 helmet ribbon으로 ✋ + 경과시간 노출. ribbon은 카드 흰색 정책의 *예외가 아닌 overlay 추가*.
  - 위험·주의: 좌상단 dot 색(safety/helmet) + 무활동 시간 mono 텍스트 색·weight.
  - 불참 팀: 컨테이너 opacity 0.72("잠자는 느낌" 어휘). 카드 자체는 흰색 + 회전 + tape 그대로 — 호버 시 transform/shadow 변화는 정상 동작.
- 응답함 버튼 클릭은 카드 클릭과 분리 — `e.stopPropagation()`으로 모달 열기 방지.

**반증 시나리오 2종**:
1. **포스트잇 30+ 동시 렌더 GPU 부담**: tokens.css §postit 주석에 "60카드 GPU 부담 검증 전" 경고 명시. v2 화면 최대치 = 2 + 5 + 4 = 11개. RosterView 60팀(b2-tutorial-waiting 등) 이미 운영 중이므로 11개는 안전 범위.
2. **3가지 카드 크기 단계 혼재로 시각 위계 혼란**: 손든(큰) → 위험·주의(중) → 불참(작) 순으로 크기가 줄어 우선순위와 정합. 단, 같은 행에 다른 크기가 나타나지 않으므로(각 섹션 독립 grid) 위계 충돌 없음.

**손들기 기능 (요약)**: 학생 측 C-3/C-4에 `[✋ 손들기]` 토글 (2분 자동 해제) + 운영자 측 P0 카드. 1차 디자인 범위는 운영자 측만, 학생 측 토글은 후속 패턴 A 작업. 데이터 모델·실패 시나리오·작업 범위는 `2026-06-01_손들기-기획.md` 참조.

**반증 시나리오 3종**:
1. **운영자가 미리보기 그리드의 "활기 있어 보임" 감각을 그리워할 가능성**: 30 썸네일이 사라지면 화면이 한산해져 "행사가 멈춘 듯한" 인상 우려. 완화 — 분포 바·헤더의 큰 숫자가 baseline 시각 신호 역할. 분포 바 width 전환 애니메이션이 "살아있는 화면" 신호 유지. 추가 sparkline은 시계열 데이터 확보 후 2차 도입.
2. **K-12 교사 운영자가 4단 우선순위 구조를 못 읽을 가능성**: P0/P1/P3 eyebrow는 디자이너 컨벤션이라 운영자에겐 추상적. 완화 — 라벨("손든 팀"/"챙겨야 할 팀"/"불참 팀")이 한국어로 명확. eyebrow는 보조 시각 단서일 뿐 필수 인지 정보 아님. 1회 운영 후 사용성 검증.
3. **임계값 20분·10분이 현장과 어긋날 가능성**: K-12 본행사 표준 길이 미상 + 학생 집중 사이클 데이터 없음. 신뢰도 ~30%. 완화 — mock에선 20/10 적용해 분류 시연만, 실 운영 1회 후 retrospective로 튜닝. 임계값은 단일 상수 2개라 변경 용이.

**영향**:
- **B-2 ⑤ 해커톤 진행** (b2-started): 화면 컴포지션 전면 변경. 시각적 무게 중심이 "30팀 그리드"에서 "P0 손든 팀 → P1 정체 → P3 불참"으로 이동.
- **B-1 / B-2 다른 상태**: 영향 없음 (`pendings/tutorial/hack-waiting/ended`는 각각 `roster`/`tutorial-progress`/`summary` mode 유지).
- **STARTED_TEAMS mock**: 필드 시그니처 변경. `ActivityView`만 참조하므로 다른 화면 영향 없음.
- **C 영역**: 미변경 (손들기 학생 측 버튼은 후속 작업). 단, `2026-06-01_손들기-기획.md`에 c3/c4 변경 명세 사전 정의.

---

## §20 2026-06-01 postit 어휘 디자인 시스템 스펙 정렬 (D-1 갤러리 + RosterRow 공용)

**계기**: 사용자 지적 "각 카드들이 포스트잇도 아니고 일반 카드도 아닌 것(각도 삐뚤빼뚤)으로 보인다 — 디자인시스템에 정의된 형태가 맞는지". D-1 갤러리 카드(`GalleryCard`, gallery.jsx:259)는 `.jt-postit-card` 클래스를 쓰면서도 ① 회전이 1.4°로 약해 들뜸이 안 읽힘, ② tape가 어두운 회색(rgba ink-alpha)이라 정체성 장식 안 보임, ③ borderRadius가 4px(`--r-sm`)로 postit 스펙(2px)과 불일치, ④ LivePreview 썸네일의 45° 사선 + 14×14 dot 3개가 카드 정체성과 경합. 결과적으로 postit metaphor가 시각적으로 깨지고 어정쩡한 "기울어진 일반 카드"가 됨. **§09e POSTIT vs PAPER 표 "anatomy" 행** ("팀명 hash 기반 ±2°", "노란 테이프 1조각")이 실제 CSS 구현(±1.4° / ink-alpha)과 어긋나 있던 **알려진 스펙↔구현 갭**도 동시 해소.

**변경 요약**:
1. **tokens.css**:
   - `--postit-rot-{a,b,c,d}`: ±1.4°·±0.6° → ±2.0°·±0.8° (§09e anatomy 정렬). 60팀 grid GPU 부담 검증 통과 가정 — 미통과 시 ±1.8°로 후퇴 옵션 보유.
   - `--postit-tape`: rgba(20,19,15,0.10) ink-alpha → rgba(255,206,43,0.65) helmet-alpha (§09e anatomy "노란 테이프 1조각" 정렬). 명도 0.65 — solid 노랑보다 약하지만 회색보다는 명확.
   - 상단 주석의 사용처 한정 문구를 "RosterRow 전용" → "RosterRow + GalleryCard 전용"으로 확장 (이미 gallery.jsx에서 사용 중인 현 상태 반영).
2. **operator.jsx** `LivePreview` (line 970-1035): 외곽 div의 `backgroundImage: repeating-linear-gradient(45deg, ...)` 사선 줄무늬 제거 → solid oklch 그라데이션만 유지. 내부 인셋 카드 하단의 14×14 컬러 dot 3개(line 1001-1005) 제거 → 타이틀 + 텍스트 바 2줄만 남아 미니멀. RosterRow 그리드(60팀)와 D-1 갤러리(8~12카드)에 동시 영향 — 양쪽 다 카드 정체성을 회전·tape·tint·LivePreview hue에 집중시킴.
3. **gallery.jsx** `GalleryCard` (line 268, 282-283): `borderRadius: var(--r-sm)` → `var(--r-xs)` (postit 스펙 2px 정렬). 외곽 카드 + 썸네일 wrapper 둘 다.

**반증 시나리오 3종**:
1. **±2° 회전이 60팀 그리드에서 GPU 부담 또는 시각 노이즈로 작용**: 기존 ±1.4°가 채택된 이유 중 하나는 60카드 동시 transform 부담 우려. 현 측정 데이터 없음 — 신뢰도 ~40%. 완화: 같은 카드 같은 transform 1회 적용이라 GPU layer는 카드 수만큼 증가, 회전 각도와 GPU 부하는 무관. 시각 노이즈는 ±2°가 디자인 시스템 anatomy 스펙이라 우선. 부담 확인 시 ±1.8°로 후퇴.
2. **노란 tape이 카드 좌상단 mine 라벨(--c-helmet 동색)과 시각 경합**: GalleryCard에서 `mine` 케이스(line 288-297)는 좌상단에 노란 "내 프로젝트" 라벨. tape도 동일 helmet 톤이라 카드 1장에 노란 점 2개가 인접 — 시각 분산 가능. 완화: mine 라벨은 left:8 + 패딩 박스 형태, tape은 상단 중앙 + 26×6 얇은 띠 — 모양·위치 분리로 식별 가능. 다만 D-1 mine 케이스 1회만 발생(사용자 본인 1팀).
3. **LivePreview dot 3개가 의미 있었을 가능성**: 사선 + dot는 "프로젝트 mockup의 색 팔레트" 메타포 — 운영자 B-1 카드에서 "팀별 다른 색 정체성" 신호. 제거 시 "흰 종이에 글자만 있는 미니멀 mock"으로 단조로워짐. 완화: oklch hue 그라데이션이 카드별 hue 차이를 유지 → 팀별 색 식별은 외곽 그라데이션이 담당. 인셋 mock은 "프로젝트가 있다"는 정보 전달만 책임.

**영향**:
- **D-1 갤러리** (D1GalleryList, D1GalleryListEnded, D1GalleryListPostMidnight): 카드 8~12개 회전 강화 + tape 노란 강조 + radius 샤프닝.
- **B-1 운영자 활동 화면** (RosterRow, 60팀): 회전 ±2° / tape 노랑 / LivePreview 사선·dot 제거 — 그리드 전체 미감 변화. paper 어휘 폐기(§19) 후 postit 어휘 강조가 일관성 강화.
- **B-2 운영자 진행 화면**: RosterRow 동일.
- **C-1 참가자 팀 패널** (`TeamPostitV2`): postit 어휘 사용하지만 회전은 `heroPostitRotation` 별도 함수 — 영향 없음. tape `--postit-tape` 변경은 적용됨(노란 톤). 영향 검증 필요.
- **RosterTeamDetailModal**: postit modal variant 사용 — 회전 hash + tape 노란 톤 적용. backdrop dim 배경에서 노란 tape 가시성 확인 필요.

**검증 체크리스트**:
- [ ] viewer.html 새로고침 → D-1 카드 회전·tape 색 확인
- [ ] B-1 60팀 그리드 시각 노이즈 점검
- [ ] C-1 TeamPostitV2 노란 tape 위화감 점검
- [ ] RosterTeamDetailModal backdrop 위 노란 tape 가시성

**미해결**:
- (a) `--postit-tape` 0.65 alpha가 RosterTeamDetailModal backdrop(0.4 dim) 위에서 가독성 부족할 가능성 — 검증 후 0.75로 조정 검토.
- (b) `Jitda Design System.html` §09e anatomy 표는 이미 ±2°·노란 tape를 기재 → 갭 해소되었으므로 별도 수정 불필요. 단, "구현 메모"란이 있다면 "기존 ±1.4°·ink-alpha에서 정렬됨" 1줄 추가 가능.

---

## §19-5 2026-06-01 hover/active translateY 제거 — tape 박힌 점 절대 좌표 고정

**계기**: §19-4 transform-origin 50% 0% 적용 직후 사용자 보고 "여전히 그대로야. 테이프로 중심 안됨". DevTools 검증으로 origin·토큰값은 정확히 적용된 상태였으나(`192.665px 0px` / `-1.4deg`), 시각상 변화 인지 못함. 추가 지적 "지금 테이프 위치 자체가 이동된다고" — 핵심 모순 정확히 짚음. 원인: `.jt-postit-card:hover { transform: rotate(0deg) translateY(-3px) }` — origin은 카드 layout 박스 내부 좌표(50% 0%)이지만, `translateY(-3px)`이 카드 layout 전체를 -3px 위로 이동시켜 회전축(tape 박힌 점) 절대 좌표도 함께 -3px 이동. "tape에 박혀있다" 메타포가 hover 동안 깨짐.

**핵심 교훈**: `transform-origin`은 transform 함수(rotate·scale)의 기준점만 결정. `translateY` 같은 layout 이동은 origin 무관하게 전체 layout을 옮기므로, "X점이 화면에 박혀있다"는 메타포에서는 layout 이동을 함께 제거해야 함. 두 속성 분리 인식 필요.

**변경**:
1. **tokens.css** `.jt-postit-card:hover` `transform: rotate(0deg) translateY(-3px) !important` → `transform: rotate(0deg) !important` (translateY 제거)
2. **tokens.css** `.jt-postit-card:active` `transform: rotate(0deg) translateY(-1px) scale(0.985) !important` → `transform: rotate(0deg) scale(0.985) !important` (translateY 제거)
3. **Jitda Design System.html §09e POSTIT CARD 표 갱신**:
   - `--postit-shadow-lift (hover)` 행: "위로 들림" → "그림자 깊어져 조사 모드 진입 단서. 카드 layout 위치는 그대로(translateY 금지)"
   - `tape (::before)` 행: "화면 절대 좌표 고정 — 카드 회전축이자 박힌 점" 추가
   - **신규 행** `hover transform`: `rotate(0deg) !important` — translateY 금지 명시
   - **신규 행** `active transform`: `rotate(0deg) scale(0.985) !important`
4. **Jitda Design System.html §09e DO/DON'T 갱신**:
   - DO 1건 갱신: "hover 시 0°로 펴지며 lift" → "회전 0°로 펴지며 box-shadow 깊어짐. 카드 layout 위치는 그대로"
   - **DO 신설**: "tape이 박힌 점(상단 중앙)을 화면 절대 좌표 기준 고정. translateY/translateX 금지"
   - **DON'T 신설**: "hover/active에 translateY·translateX 등 layout 이동 금지. origin 50% 0%여도 layout이 이동하면 회전축도 함께 끌려가 메타포 깨짐. lift 시각은 box-shadow만으로"
5. **viewer.html** FORCE OVERRIDE 인라인 룰 제거 — tokens.css 적용이 검증됐으니 인라인 override 잔존 시 향후 tokens.css 변경이 viewer에서 안 잡힐 위험. cache-control meta는 유지.
6. **viewer.html** cache key `?v=20260601e → 20260601f`.

**반증 3종**:
1. **lift 어휘 약화**: "위로 들림"은 강력한 시각 신호였는데 box-shadow + 회전 펴짐만 남으면 인지 약함. → 완화: shadow-lift는 shadow-rest 대비 4× 강한 dual layer(4px+28px vs 1px+14px). 회전 펴짐도 ±1.4° 정도 명확. 두 신호 동시면 충분.
2. **포스트잇 메타포 정체성 손실**: postit 카드의 핵심 어휘 "위로 폴짝 들리는 종이"가 사라짐 — postit이 다른 카드와 차별화되는 지점이 약해짐. → 완화: tape + 정적 회전(±1.4° hash) + tape 축으로 펴짐 + shadow lift — 시각 정체성 신호는 여전히 4중. "들리는" 어휘를 "박혀있다 + 펴짐"으로 교환한 결과로, postit 메타포가 더 정확해짐.
3. **active 시각 위계 약화**: hover와 active가 transform만 다른 미세 차이(`rotate(0deg)` vs `rotate(0deg) scale(0.985)`) — 사용자 인지 어려움. → 완화: active는 짧은 transition-duration(`var(--dur-fast)`)이라 click 직후 즉시 작동. scale 1.5% 축소도 click 피드백으로 충분.

**미해결**:
- (a) `prefers-reduced-motion` 환경에서 회전 + shadow가 비활성되면 hover 신호가 background-color만 남음 — 향후 색 변화 신호 보강 검토.
- (b) viewer.html cache-control meta는 dev-only이지만, 빌드 환경에 production 진입 시 정책 재검토.

---

## §19-4 2026-06-01 포스트잇 회전축 tape 위치로 이동 + 회전 각도 토큰 ±1.4°/±0.6° 축소

**계기**: 사용자 요청 "각 포스트잇의 배치 각도와 호버시 회전 관련하여, 테이프가 붙어있는 위치를 중심으로 호버 액션 일어나게 할 수 있어? 배치 각도랑 위치도 조정이 필요할 수도". 기존 `.jt-postit-card { transform-origin: 50% 100% }`(밑변)는 "위로 들리는" 어휘로 설계됐으나, postit 어휘 강화 작업(§19) 이후엔 tape이 상단 중앙에 박힌 메타포와 회전축이 정반대에 있어 "tape에 매달려 흔들" 어휘가 작동 안 했음. 또한 토큰 `--postit-rot-{a,b,c,d}` 실제값(±2.0°/±0.8°)이 디자인시스템 §09e 표 표기(±1.4°/±0.6°)와 다이버전스 상태였음 — origin 변경 시 카드 변위가 더 크게 인지될 우려.

**변경**:
1. **tokens.css L454** `.jt-postit-card transform-origin: 50% 100%` → `50% 0%` — 카드 상단 가장자리 중앙(tape 박힌 위치)으로 회전축 이동. 사용자 결정: 50% 0% 단순 좌표 채택(tape 정확한 중심 좌표 `calc(--postit-tape-h * -0.5)` 옵션 비채택 — 시각 차이 3-5.5px 무시 가능).
2. **tokens.css L161-164** `--postit-rot-{a,b,c,d}` `-2.0°/-0.8°/0.8°/2.0°` → `-1.4°/-0.6°/0.6°/1.4°` — 디자인시스템 §09e 표 표기를 진실로 삼고 토큰을 표에 맞춤(사용자 결정으로 표 무수정 + 큰 카드 변위 완화 효과 동반).
3. **Jitda Design System.html** §09e POSTIT CARD 표 `transform-origin` 행 갱신 — "50% 100% (밑변) → 위로 들리는 단서" → "50% 0% (상단 중앙, tape 박힌 위치) → tape 축으로 흔들 단서. 호버 시 rotate(0)이 tape이 잡아당겨 펴짐으로 작동". 이전 결정 흔적도 괄호로 보존.
4. **viewer.html** cache key `?v=20260601c → 20260601d` — tokens.css 변경 강제 로드.

**메타포 비교**:
- **이전**: origin 50% 100% + tape 상단 → "카드가 밑변을 기준으로 위로 폴짝 뛴다" + tape은 시각 데코.
- **현재**: origin 50% 0% (tape 위치) → "tape 한 점이 카드를 잡고, 카드가 그 점을 축으로 좌우로 흔들. 호버 시 tape이 잡아 단단히 펴짐". tape이 시각 데코 + 인터랙션 축 양역할.

**반증 3종**:
1. **밑변 흔들 강도**: origin 50% 0%에서 큰 카드(lg/xl, 높이 340-520px)는 정적 자세 시 밑변 변위가 `h * sin(1.4°)` ≈ 8.3-12.7px로 큼. "흔들리는 결함"으로 보일 가능성. → 완화: 큰 카드 4종은 모두 `jt-postit-card-static` 적용 + 모달(RosterTeamDetailModal)은 backdrop 분리. 동적 hover는 그리드 카드(높이 ~70-130px)만 — 밑변 변위 1.7-3.2px로 적정. 또한 토큰 ±2.0°→±1.4° 축소로 변위 30% 감소 — origin 변경의 시각 충격을 부수 결정이 완화.
2. **paper 어휘 메타포 부활 위험**: §19에서 paper의 압정 어휘를 폐기했는데 origin 50% 0%은 paper-pinned와 동일 좌표 — 결정 후퇴 인상. → 완화: origin은 CSS 회전 축(보이지 않는 속성)이지 시각 어휘가 아님. paper의 압정 SVG·접힘선·종이 가장자리·뒷면 도장 등 시각 요소는 폐기 상태 유지. 좌표가 동일한 것은 "tape이 박힌 점에서 흔든다"는 동일 메타포의 자연스러운 수렴.
3. **hover 어휘 "위로 들린다" 손실**: 기존 origin 50% 100% + translateY(-3px)는 카드 밑변이 그대로면서 카드 전체가 떠오르는 "폴짝" 어휘 — 운영자 즉각 인지 강함. 새 origin에서는 rotate(0) 펴짐이 주된 단서이고 translateY는 보조. → 완화: hover에서 `box-shadow: var(--postit-shadow-lift)` (그림자 강화) + 회전 펴짐 + translateY(-3px) 셋 동시 — 충분한 시각 신호. 더불어 "tape이 잡아 펴짐"이 RosterRow의 "조사 모드 진입" 시각 단서로 더 직관적.

**영향**: B-2 RosterRow 그리드 30카드(hover 어휘 강화) + B-1 빈 상태 + RosterTeamDetailModal + C-1 TeamPostitV2 (c1·c1-after-tutorial·c1-ended) + D-1 빈 상태 + 디자인시스템 §09e POSTIT CARD/MODAL/TAPE SIZE 데모 — 총 6 화면 + 디자인 시스템 3 데모.

**미해결 (사용자 viewer 확인 후 별도 결정)**:
- (a) settle 애니메이션 `translateY(-6px) scale(0.97)`이 새 origin에서 "tape에서 펴진다" 어휘로 재해석 OK인지 시각 확인. 어색하면 scale 1로 변경 검토.
- (b) 큰 카드(lg/xl)의 정적 자세 변위 8-12px가 너무 기울어 보이면 단계 modifier별 회전 자동 축소(`.jt-postit-tape-lg → --postit-rot * 0.7` 등) modifier 신설 검토.

---

## §19-3 2026-06-01 `--postit-tape` 색 회색 복구 (ink alpha 0.10)

**계기**: §19 paper→postit 어휘 통일 작업 직후 사용자 보고 "테이프가 왜 갑자기 노란색이 됐지? 원래 회색이었는데". paper variant 시절엔 tape이 표시되지 않았고(`.jt-paper-pinned`는 압정 SVG, 노란 헬멧 색만 노출), postit 어휘 부활 시 `--postit-tape` 토큰이 결정 보고 누락된 시점에 `rgba(255, 206, 43, 0.65)`(helmet 노랑 65%)로 바뀌어 있던 미커밋 상태 — git 히스토리 상 원본은 `rgba(20, 19, 15, 0.10)` (ink alpha 0.10, 회색). 디자인 시스템 §09e POSTIT CARD 표(L2309)에도 "ink alpha 0.10 단색" 명시되어 있어 표와 토큰 다이버전스 상태였음.

**변경**: tokens.css L174 `--postit-tape: rgba(255, 206, 43, 0.65)` → `rgba(20, 19, 15, 0.10)`. 미러 0건(viewer.html·Renewal.html·Design System.html 인라인 정의 없음 — tokens.css 단일 소스).

**영향**: postit 어휘 사용 모든 화면(B-2 RosterRow 그리드 30카드 + B-1 빈 상태 + RosterTeamDetailModal + TeamPostitV2 c1·c1-after-tutorial·c1-ended + D1GalleryEmpty + 디자인시스템 §09e/§09g 데모) — tape 노랑→회색.

**후속**: §19에서 paper 폐기를 결정했을 때 `--postit-tape` 토큰값까지 검증했어야 함 — 차후 어휘 부활 작업에서는 토큰 색까지 git diff로 검증 필수.

---

## §19-2 2026-06-01 tape size 4단계 단계화 + §09e ▸ TAPE SIZE 서브섹션 신설

**계기**: §19 paper→postit 통일 직후 사용자 보고 "포스트잇 테이프가 포스트잇 크기와 관계없이 같은 사이즈인 듯. 포스트잇이 커지면 테이프도 커져야 한다 / 디자인시스템 레벨에서 업데이트해라". 기존 `.jt-postit-card::before`는 26×6px 고정 — RosterRow 그리드 카드(~70-160px)에 맞춰 설계됐으나 §19 작업으로 추가된 큰 카드/모달(440-560px)에서 같은 26px tape은 점·지문 정도로 시각적으로 묻혀 보임. 카드 크기에 비례하는 단계 시스템 필요.

**구현**:
1. **tokens.css** `.jt-postit-card::before` 변수화 — `width: var(--postit-tape-w, 26px)` / `height: var(--postit-tape-h, 6px)` / `top: calc(var(--postit-tape-h, 6px) * -0.5)` (height 절반 자동 비례). 기본 fallback은 그리드 카드 기준(26×6).
2. **3단계 modifier 추가**: `.jt-postit-tape-md` (40×8 — 중간 220-400px) · `.jt-postit-tape-lg` (56×9 — 큰 카드/모달 400-540px) · `.jt-postit-tape-xl` (72×11 — 매우 큰 540px+). 카드 폭의 ~12-13% 비례로 시각 일관성.
3. **JSX 4 호출부 적용**: B1Empty(520px) → `jt-postit-tape-lg`, RosterTeamDetailModal(440px) → `jt-postit-tape-lg` (ModalSurface className prop으로 전달), TeamPostitV2(440px) → `jt-postit-tape-lg`, D1GalleryEmpty(560px) → `jt-postit-tape-xl`.
4. **디자인 시스템 §09e ▸ TAPE SIZE 서브섹션 신설** (POSTIT MODAL 앞) — 동일 폭(240px) 4 카드로 tape만 비교하는 시각 데모 + 권장 매핑 표(modifier · 크기 · 카드 폭/사용처) + DO/DON'T 5종.
5. **POSTIT MODAL 시각 데모**에도 `jt-postit-tape-lg` 적용 — 실제 사용 어휘와 동기.
6. **viewer.html cache key** `?v=20260601b → 20260601c`.

**반증 시나리오 3종**:
1. **단계 4종이 과한가**: md(40×8)는 현재 사용처가 없음(향후 ProjectCard·GalleryCard 등 검토 단계). 미래 사용성 추정으로 단계를 만들면 죽은 토큰 위험. → 정합: 단계 간 보간성을 채워두는 게 시스템 일관성. md가 향후 6개월 미사용이면 §10 룰셋 정리 시 제거 검토.
2. **tape 비례 ratio 일관성 부족**: 단계 ratio는 26/100, 40/300, 56/440, 72/560 — 약 26%·13%·13%·13%. 기본(그리드)만 ratio 26%로 튐. → 정합: RosterRow 그리드는 60카드 동시 노출이라 작은 tape은 ratio가 커야 식별. 비일관은 의도된 결과.
3. **top 자동 비례 룰이 미세 조정 자유도 침해**: `top: calc(--postit-tape-h * -0.5)`는 모든 단계에서 카드 상단 가장자리 정렬을 강제. → 정합: 일관성 우선 — 미세 조정이 필요하면 별도 modifier 신설. 변수 직접 주입은 size 미세 조정용이며 top 별도 변경은 DON'T 룰로 명시.

**영향**: tokens.css `.jt-postit-card::before` 변수화 + modifier 3 신설. JSX 4 호출부 className 갱신. 디자인 시스템 §09e ▸ TAPE SIZE 서브섹션 신설(~80줄) + POSTIT MODAL 데모 동기. viewer cache key bump.

**미해결**:
- (a) `md`(40×8) 실 사용 0건 — 6개월 모니터링 후 미사용 시 deprecated 검토.
- (b) tape size와 카드 폭 비율 ratio가 단계 사이 불연속(26%↘13%) — 향후 280px대 중간 카드 등장 시 시각 검증 필요.
- (c) `prefers-reduced-motion` 환경에서 tape 사이즈가 시각 정체성 대체 효과를 충분히 발휘하는지 — 사용자 실측 보강.

---

## §19 2026-06-01 paper 어휘 전면 폐기 + 포스트잇 모달 신설

**계기**: 사용자 결정 "디자인시스템 상 컴포넌트는 deprecated 표기하고, 실제 쓰이는곳들은 이미 쓰이고있는 포스트잇으로 다시 변경한다. 팀 목록의 모달 같은 경우에는 일반 모달 말고 포스트잇 모달을 사용해라." paper 어휘는 §618g/§09g에서 양피지 질감(clip-path 가장자리·접힘·내부 도장)으로 도입(2026-05-29)되었으나, 짓다 어휘 통일성 측면에서 postit과 paper 두 종이 메타포 병존이 시각 노이즈로 작용. RosterRow(그리드) ↔ RosterTeamDetailModal(zoom-in) 위계가 두 어휘로 분리돼 있어 정합도 약함. postit 단일 어휘 통일 + 모달 variant 신설로 해결.

**변경 요약**:
1. **shared.jsx** `ModalSurface`에 `variant` prop 추가 — `'default'` (현행 — canvas + radius 10 + shadow-modal) | `'postit'` (신설 — `jt-postit-card jt-postit-card-static` 결합, tape + 정적 회전, base style은 background/radius/shadow 인라인 미주입). 'paper' variant는 의도적 미지원.
2. **tokens.css**:
   - `.jt-postit-card-static` modifier 신설 (line 494 직후) — hover 회전·lift·active 비활성. 정적 회전 + tape + shadow-rest는 보존. D-1 갤러리 빈 상태(기존 CTA 호버 충돌 회피) + 포스트잇 모달 공용.
   - §618g paper 룰셋 영역(L1226~) 상단에 DEPRECATED 주석 — 룰셋은 보존(역사·결정 흔적), 실 화면 사용 0건 명시.
3. **operator.jsx**:
   - `B1Empty` (b1-empty 빈 상태): `jt-paper-pinned` + `jt-paper-surface-wrap` + `jt-paper-surface` → `.jt-postit-card .jt-postit-card-static` (회전 `--postit-rot-b`, tint canvas).
   - `RosterTeamDetailModal` (b2-roster-detail): `<ModalSurface className="jt-paper-surface">` → `<ModalSurface variant="postit">`. `postitRotation(team.name)` hash로 회전 자세 결정 → RosterRow와 동일 자세(zoom-in 시각 일관). 헤더 padding 38px→24px 축소(paper 가장자리 safe area 불필요). 외곽 wrap `jt-paper-surface-wrap` → 단순 position wrapper (shadow는 postit 어휘 담당).
4. **participant.jsx** `TeamPostitV2` (c1, c1-after-tutorial, c1-ended): paper 마크업 → `.jt-postit-card .jt-postit-card-static` (440px 유지, 회전 `heroPostitRotation`). 헤더 padding 36px→24px 축소.
5. **gallery.jsx** `D1GalleryEmpty` (d1-empty): `jt-paper-pinned jt-paper-pinned-static` → `.jt-postit-card .jt-postit-card-static` (CTA 버튼과 카드 hover 충돌 회피 — 정적 modifier).
6. **Jitda Design System.html**:
   - §09g Paper Surface — 섹션 전체 opacity 0.55 + 헤더 line-through + 상단 deprecated 배너(사용처 4종 명시 + postit 모달 대체 안내) + 내부 ▸ 예외·모달 카르브아웃 서브섹션·▸ POSTIT vs PAPER 표 paper 열 deprecated 표시.
   - §09e POSTIT CARD 끝에 ▸ POSTIT MODAL 서브섹션 신설 — 시각 데모(440px RosterTeamDetailModal mock, 헤더+3행+푸터) + 속성 표(variant/--postit-rot/--postit-tint/width/borderRadius/overflow/headerDivider/hover) + DO/DON'T 6종 (RosterRow 가족 한정 + 다른 모달 확산 금지 + paper 결합 금지 + overflow hidden 금지).
   - §08 Overlay/Modal MODAL SURFACE 표 다음에 ▸ MODAL VARIANT 표 신설 — default · postit · ~~paper~~ 비교(시각 어휘·사용처·deprecated 표시).

**반증 시나리오 3종**:
1. **시각 위계 약화 가능성**: paper 어휘는 "큰 정보 카드의 무게감"을 부여하는 표면 어휘로 도입되었음. postit 단일 어휘로 통일하면 RosterRow(작은 그리드 카드)와 RosterTeamDetailModal(큰 모달) 사이의 위계가 회전·tape 외엔 폭(70→440)만으로 구분됨. → 완화: 모달은 backdrop dim + 중앙 정렬로 시각 분리 충분(§08 MODAL SURFACE 결정 — "border 없음 shadow만"). 그리고 RosterRow와 모달이 같은 어휘인 것이 zoom-in 시각 일관성으로 오히려 의도된 결과.
2. **tape ::before가 헤더 텍스트와 시각 간섭**: postit의 tape는 top:-3px에 26×6px로 카드 위로 돌출 — 모달 헤더(padding 24~28px 시작)와 좌표 충돌 없음. 다만 카드 폭 440px 중 tape는 26px 폭이라 카드 중앙 상단에 매우 작게 표시 → 시각 노이즈 미미. 단, 다인팀(7명) 케이스에서 모달 본문 스크롤이 발생할 때 tape이 backdrop과 명도 대비 약해 안 보일 수 있음 → 검증 시 확인.
3. **§09e DON'T "RosterRow 외 카드 적용 금지" 룰과의 의미 충돌**: 기존 §09e 룰은 "60카드 GPU 검증 미흡 + entity별 색 정책 분리" 근거로 postit 어휘를 RosterRow에만 한정. 모달은 단일 카드라 60카드 GPU 문제 없음, entity는 같은 Team이라 색 정책 분리 위배 없음. 다만 "확산"의 의미는 추가 사례 등장 시 마다 재검토 필요. § §09e ▸ POSTIT MODAL DON'T에 "RosterRow 가족(그리드 + zoom-in 모달)에만" 명시로 경계 재설정.

**영향**:
- JSX 4 사용처 / 6 화면 상태(b1-empty · b2-roster-detail · c1 · c1-after-tutorial · c1-ended · d1-empty).
- tokens.css `.jt-postit-card-static` modifier 신설 + paper 룰셋 deprecated 주석.
- 디자인 시스템 §09g deprecated 처리 + §09e ▸ POSTIT MODAL 신설 + §08 ▸ MODAL VARIANT 표 신설.
- `--c-paper` 색 토큰(L10 #faf9f6)은 70회 사용되는 배경색이라 **유지** — 컴포넌트 폐기와 분리.

**후속 검증 (시작 전 사용자 확인 결과)**:
- D-1 갤러리 빈 상태 CTA 호환: 정적 포스트잇(`jt-postit-card-static`) 신설 확정 — 사용자 결정.
- C-1 TeamPostitV2 폭: 440px 유지 확정 — 사용자 결정.
- 포스트잇 모달 디자인시스템 등록: §09e 서브섹션 + §08 표 둘 다 — 사용자 결정.

**미해결**:
- (a) `.jt-paper-pinned-tall` (검정 thumbtack)·legacy `.jt-paper-interactive` 클래스는 실 사용 0건이었으므로 §09g deprecated 함께 묻힘. 추후 코르크보드/메모보드 메타포 어휘가 다시 필요해질 때 별도 신설 검토.
- (b) `--c-paper` 색 토큰은 그대로 70회 사용 — 컴포넌트 어휘와 별개로 배경색은 유지. 향후 디자인 시스템 §02 정합성 점검 시 토큰명 혼동 가능성 재검토.
- (c) ModalSurface variant prop이 추가됨으로써 기존 호출부 모두 `variant="default"` 암묵 적용 — 명시 호출 표준화는 후속 작업.

---

## 2026-05-29 `.jt-paper-pinned-tall` variant 추가 — 클래식 thumbtack (돔 + 가시적 cylindrical 목)

**계기**: 사용자가 검정 thumbtack(돔 + 종이로 박혀들어가는 가시적 cylindrical 목) 레퍼런스 이미지를 제시하며 "디자인시스템에 있는 압정과 별도로 하나 추가". 기존 `.jt-paper-pinned`(2026-05-29 검정 돔 only 변형)는 head만 보이고 needle/shaft가 안 보이는 단순 형태 — 코르크보드 메타포가 강조될 때(예: 메모보드 그리드 위 단일 노트)는 실제 압정처럼 몸통이 보이는 어휘가 더 정확.

**구현** (tokens.css §618g · `.jt-paper-pinned-tall` modifier — 기본 `.jt-paper-pinned`와 병기):
- 부모 padding-top 14px 그대로 상속 (별도 padding 변경 없음)
- `::before` width 32×height 42 (기본 30×28에서 확장), **top: -16px** (돔이 컨테이너 -16~+6, 목 위가 +6~+14에서 가장자리에 걸치고, 목 아래·그림자 +14~+26이 종이 표면을 12px 덮어 "박혀 들어간" 환상 — z-index:3), margin-left -16px
- 첫 시도(top -22, padding-top 26) → 종이 위 6px 공백 발생 → 두번째 시도(top -28) → SVG bottom이 종이 시작점에 정확히 멈춤(0px 덮음) → 최종(top -16) → 12px 덮음으로 정착
- SVG 32×42 viewBox:
  - 돔(head): `ellipse cx=15 cy=11 rx=11 ry=10` + radial gradient(`#5a5a5a → #222 → #000`)
  - 목(shaft): `path` capsule 형 (top y=18.5에서 살짝 좁아져 dome 밑단과 자연스럽게 연결, bottom y=38), 좌→우 linear gradient(`#262626 → #121212 → #000`)로 좌측 밝게 — 입체감
  - dome-shaft 경계: 어두운 ellipse ring (`cx=15 cy=19 rx=4.2 ry=1` fill-opacity 0.7)
  - 종이 위 캐스트 그림자: `ellipse cx=18 cy=38 rx=10.5 ry=2.2` opacity 0.34 (목 아래 우하단 방향)
  - dome specular highlight: 2단 ellipse (cx=10.5 cy=7.5 + cx=9.5 cy=6.5) — 좌상단 광원

**모달 미러**: `Jitda Design System.html` 인라인 `<style>`에 동일 클래스 추가(viewer는 `<link>` 단일 소스이나 Design System 문서는 자체 미러 유지 패턴) + `.jt-corkboard-demo` 데모 배경 유틸 추가(brown #b88e5a + multi-radial-gradient 코르크 점 패턴 + linear-gradient 톤 변화). §09g Paper Surface 섹션에 "▸ Variant · 클래식 thumbtack" h3 신설 — 노란 종이 + 기본 paper 2종 데모 + 마크업 메모.

**호환성**:
- 기존 `.jt-paper-pinned` 룰(position/display/hover 회전/-1.5deg 정적 회전)을 그대로 상속. modifier는 `::before` 시각만 교체.
- `.jt-paper-pinned-static`(인터랙션 카드용 hover 비활성) 호환 — `.jt-paper-pinned.jt-paper-pinned-tall.jt-paper-pinned-static`까지 정상.
- 기본 paper 배경(흰색), 노란 메모지 배경 둘 다 적용 가능 — variant는 압정만 교체하므로 surface는 자유.

**사용 가이드**:
- 기본 `.jt-paper-pinned` (돔 only) — paper의 표준 어휘. 단정·미니멀.
- `.jt-paper-pinned-tall` (돔 + 가시적 목) — 코르크보드/메모보드 메타포 강조 시. 실물 압정의 어휘 강함.
- 둘 다 호버 시 압정 축으로 0.75deg 회전 + drop-shadow 강화.

**검증 포인트(향후)**:
- (a) 두 variant 혼용 시 시각 일관성 — 같은 화면에 둘 다 쓰면 어휘 충돌 가능. 화면당 하나만 권장.
- (b) tall variant의 목 높이가 paper padding-top 14px 영역 안에서 충분히 자연스러운지 — 너무 길면 본문 텍스트 영역과 시각 간섭.
- (c) 코르크보드 배경(.jt-corkboard-demo)은 데모 전용. 실제 화면에 적용 시 `--c-paper` 등 디자인 토큰 어휘와 충돌 가능 — 별도 결정 필요.
- (d) prefers-reduced-motion에서도 정적 -1.5deg 회전은 유지(기본 룰 상속) — 사용자가 원치 않으면 별도 분기 필요.

---

## 2026-05-29 A-4 운영자 회원가입 화면 신설 + `.jt-checkbox` 정식 등록

**계기**: 사용자 지시 "운영자 회원가입 페이지 디자인 필요 + 체크박스 컴포넌트 적절성 판단 후 디자인 시스템에 없는 컴포넌트 추가". A-2 운영자 로그인 화면 우하단의 "운영자 회원가입 →" 링크가 dead-end였음(viewer ACTIONS 미매핑). 회원가입은 약관 동의 UI가 필요하지만, 기존 `.jt-switch`(iOS 토글, on/off)는 의미적으로 "선택·확인 행위"인 약관 동의에 부적합 — 분리된 primitive 필요.

**의미 판단 — switch vs checkbox**:
- `.jt-switch`: 기능의 **현재 상태(on/off)** — "미접속만 보기 토글", "갤러리 공개 토글" 등. 즉시 효과(immediate apply).
- `.jt-checkbox`: **선택·동의 행위** — 약관 동의, 다중 선택, 일괄 선택. submit 시점에 효과.
- 약관 동의를 `.jt-switch`로 표현 시 "이 약관을 켜놓은 상태"라는 잘못된 mental model 유발. 회원가입 폼에서는 시각적으로도 사각 박스 + ✓이 표준 패턴.

**신규 토큰** (tokens.css §Checkbox, line ~554):
- `.jt-checkbox` — 20px 사각 박스(radius 5px), aria-checked=true 시 `--c-ink` 배경 + 흰 ✓(`Icon.check` 재사용). focus-ring + disabled. role=checkbox, button 요소 권장.
- variant: `.is-sm`(16px) · `.is-lg`(24px · 전체 동의 행 강조) · `.is-helmet`(체크 시 helmet-deep — 위험 강조 동의용 예비)
- `.jt-checkbox-row` — 1행 컨테이너(체크박스 12px gap 라벨 · "필수" 표식 · "내용 보기" 링크). 행 간 1px hairline 구분.
- `.jt-checkbox-required` — `(필수)` 인라인 표식 (safety 컬러, 12.5px 600).
- `.jt-checkbox-link` — "내용 보기 ›" 우측 정렬 슬레이트 링크.
- `.jt-checkbox-banner` — "전체 항목에 동의합니다" 그룹 헤더 행 (blue-soft 배경 · 14px 600 · blueprint 컬러). 의미: 하위 체크박스 다중 토글 트리거.
- prefers-reduced-motion 분기에 `.jt-checkbox { transition: none !important; }` 추가.

**신규 화면** (4단계 모두 완료):
1. **JSX**: `auth.jsx` `A4OperatorSignup` 추가 + `Object.assign(window, {... A4OperatorSignup})` export. variant="blueprint" 사용(운영자 메타포 — A-2/A-3과 동일 좌측 콘크리트 패드 + helmet-dot tag).
2. **Renewal.html**: `<DCArtboard id="a4" label="A-4 · 운영자 회원가입 (이메일 + 약관 동의)" width={1280} height={1000}>` 추가(A-3 다음). 높이 1000 — 입력 4종 + 약관 4행으로 기본 820 초과.
3. **viewer.html SCREENS**: `{ id: 'a4', section: 'A. 인증', label: 'A-4 · 운영자 회원가입', render: () => <A4OperatorSignup /> }` 추가.
4. **viewer.html ACTIONS 와이어링**:
   - `'a2'` 액션에 `'signup': 'a4'` 추가 (A-2 "운영자 회원가입 →" 링크에 `data-action="signup"` 부여 — 기존 dead-end 해소).
   - `'a4': { 'submit': 'b1-empty', 'back-to-login': 'a2' }` — 가입 완료 → 빈 대시보드(신규 운영자) / 로그인 복귀.

**화면 구성**:
- 좌측: `variant="blueprint"` (stone-2 콘크리트 + stache 도면 라인, A-2/A-3과 동일 톤). tag "OPERATOR · 운영자" + 헤드라인 "운영자 계정을 만듭니다" + body "이메일로 가입하고 직접 해커톤을 운영해 보세요."
- 우측 폼 (paper + 0.04 그리드):
  - h2 "운영자 회원가입" + sub "가입하면 해커톤을 운영할 수 있어요."
  - 입력 4종: 이름 · 이메일 · 비밀번호(+8자 이상 도움말) · 비밀번호 확인. 모두 `.jt-input` + `(필수)` 라벨.
  - `.jt-checkbox-banner` — "전체 항목에 동의합니다." (blue-soft 강조)
  - 약관 그룹 라벨(mono) — "약관 및 정보 이용 동의"
  - `.jt-checkbox-row` 3개: 개인정보 처리 방침·서비스 이용 약관·개인정보 수집 동의 (모두 필수 · 우측 "내용 보기 ›")
  - 가입하기 CTA — 미동의 상태 disabled(ink-3 회색, opacity 0.55) — 모든 필수 약관 체크 시 jt-btn-primary 활성화 가정
  - 하단 "이미 계정이 있으신가요? 로그인 →" (A-2 회귀)

**기획문서 정합**: 페이지정의서·화면상태정의서에 A-4 명세 미작성(TBD) — 추후 운영자-역할-기획.md 측 가입 플로우 정의 작업 시 정렬 필요. 시각 디자인은 spec-updates.md(이 문서)가 1순위 override.

**검증 포인트** (향후 검토):
- (a) 약관 4행(전체 + 3개 개별)이 모두 필수라면 "개별 3개"를 굳이 분리할 가치(법적 트래킹 요건 외) — 단일 "전체 동의 (필수)" 한 행이면 충분한지 vs 사용자가 어떤 약관을 봤는지 모니터링 필요한지
- (b) 비밀번호 복잡도 룰 "8자 이상, 영문·숫자 포함"이 학교 GW(전북교육청·울산교육청) IT 정책과 충돌(보통 12자 이상 + 특수문자 요구)할 가능성 — 실제 가입 시 검증 룰 확정 후 도움말 갱신
- (c) Google OAuth로 가입 가능한데 별도 이메일 가입을 두는 가치 — `gov.kr`·`go.kr` 도메인 사용자는 Google Workspace로도 충분, 이 화면이 사실상 사용 안 될 가능성. 가입 채널 정책 결정 필요(Google only vs 이메일 병행).
- (d) `.jt-checkbox-banner`가 다른 화면(예: D 갤러리 다중 선택 후 일괄 액션, B 운영자 팀 일괄 처리 등)에서도 재사용될 primitive인지 — 회원가입 1회만 쓰일 거면 컴포넌트화 가치 낮음. 현재는 약관 외 사용처 없음.

**미수정**: 페이지정의서·화면상태정의서·UX리뷰(A-4 명세 부재 → 별도 보강 작업 필요). 모바일 분기 화면 미작성(원본 디자인이 데스크탑만 제공). GAP_REPORT.md(추후 기획 정합성 작업 시 추가).

---

## 2026-05-29 D 갤러리 — 24px 도면 격자 배경 + 카드 어휘 postit화 (D-1)

**계기**: 사용자 지시 "갤러리 디자인 개선 — 1) 배경 격자무늬 2) 갤러리 미리보기 카드들을 포스트잇처럼". 운영자 B-1/B-2·참가자 C-1이 이미 24px 격자(`linear-gradient … 1px / 24px 24px` × 2 + `var(--c-paper)`) + RosterRow `.jt-postit-card` 어휘를 공유 중인 반면, D 갤러리만 평면 `--c-paper` + 평면 `--c-canvas` 카드로 남아 어휘 위계 단절.

**결정 (2건 묶음)**:

1. **격자 배경 — D-1 4화면**: `D1GalleryList` · `D1GalleryListEnded` · `D1GalleryEmpty` · `D1GalleryLoading` 루트의 `background: 'var(--c-paper)'` → 공용 상수 `GRID_BG`(gallery.jsx:25-29)로 교체. operator.jsx `B1Empty`/`DashboardShell`과 동일 패턴.
   - **D-2 미적용**: D2Shell 좌측 DetailLivePane(`--c-stone-2` 콘크리트) + 우측 DetailInfoPane(`--c-canvas` aside)이 격자를 가려 시각 효과 없음. D-2 우측 패널 디자인(별도 항목 ④, 미진행)과 함께 처리하는 게 자연스러움.

2. **GalleryCard postit화 (안 A 풀-postit)**:
   - shared.jsx `ProjectCard` 래퍼 대신 gallery.jsx에서 직접 `.jt-postit-card` div 작성. operator.jsx의 `RosterRow`와 동일 어휘.
   - 회전: `postitRotation(team)` 4-variant 팀명 hash (operator.jsx 외부 export 추가 — window 노출).
   - tint: 단일 `var(--c-canvas)` 흰색 (§18-27 정책 — RosterRow와 일관). 썸네일 자체가 시각 식별자라 색 식별 불필요.
   - 썸네일 클리핑: 카드에 `overflow:hidden`을 걸면 `::before` tape(top:-3px)가 잘림 → LivePreview만 내부 wrapper로 감싸 `overflow:hidden` + 상단 모서리만 둥글림. tape는 카드 외부로 자연스럽게 돌출.
   - ribbon `내 프로젝트`(line 442 기존 구조)는 absolute로 유지.
   - 좋아요·댓글 메타는 카드 내부 표시만(클릭 불가) — 카드 전체 `data-action="open-card"` 영역 보호.
   - GalleryGrid `gap: 16 → 20` — postit hover 시 회전 풀림(`rotate(0deg) translateY(-3px)`) + ±1.4° 회전 카드 인접 충돌 여유.

**파일 영향**:
- `gallery.jsx`: `GRID_BG` 상수, 4화면 배경 교체, `GalleryCard` 재작성, `GalleryGrid` gap 조정
- `operator.jsx`: `Object.assign(window, { ..., postitRotation, LivePreview })` — D 영역에서 운영자 어휘 재사용

**검증** (playwright 캡처):
- D-1 진행 중(8개): postit 회전·tape·격자 적용 확인
- D-1 종료(12개): 동일 — 12카드 settle stagger max ~110ms, 60카드 GPU 우려 무관
- D-1 빈 상태: 격자배경만 적용(빈상태 카드 paper-surface는 ③ 후속 작업)

**미수정 (후속)**:
- ③ D-1 빈 상태 paper-surface 적용
- ④ D-2 우측 패널 디자인 (격자배경 D-2 적용은 ④와 함께)
- D-1 Loading 스켈레톤 카드(`var(--c-canvas) + border`)는 postit 형태와 mismatch — 회전·tape 스켈레톤도 후속 폴리시 대상
- STRUCTURE.md §3 D-1 카드 위계 라벨 갱신(`ProjectCard 래퍼` → `jt-postit-card 직접`)

**검증 포인트(향후)**:
- (a) postit 어휘가 "전시 작품"이라는 갤러리 메타포와 충돌 가능 — 도면(블루프린트)은 "작업 중" 메타포. K-12 참가자 5명 1차 인지 테스트 필요(레벨 3 증거).
- (b) 12카드 ±1.4° 회전이 한 화면에 동시 노출될 때 시각 산만함 측정 — gap 20·minmax 260으로 완화했으나 모바일 392px 폭에선 1열 적층 시 회전이 더 강하게 인지될 수 있음.
- (c) postit hover 시 회전 풀림 + translateY(-3px) — 인접 카드와 ❤️/💬 메타가 같은 horizontal line이라 시선 이동 자연스러운지 vs 카드 hit-area가 hover 0deg 상태 기준으로만 정확한지(클릭 의도 vs 클릭 위치 mismatch 가능성).
- (d) LivePreview의 16:10 그라데이션 + 단순한 mock content가 postit 어휘와 만나면 "보고서 색종이" 느낌 — 실제 라이브 앱 썸네일이 들어왔을 때(iframe screenshot) 톤 매칭 재확인 필요.

---

## 2026-05-29 일시정지/재시작 기능 완전 폐기 ⚠

**계기**: 운영자 결정 "튜토리얼/해커톤 진행 중 일시정지 기능 자체를 삭제". 진행 중 휴식이 필요하면 운영자가 구두로 안내하고 참가자는 자율적으로 멈춘다 — 작업물은 자동 저장된다.

**삭제 범위**:
- 화면: `b2-paused`(B-2 일시정지 오버레이) · `e6-paused`(E-6 참가자 일시정지 오버레이) 두 화면 폐기
- 컴포넌트: `B2DashboardPaused`(operator.jsx) · `E6Paused`/`E6PausedBody`(dialogs.jsx) 함수 삭제, `Object.assign` export에서 제외
- prop·분기: `paused` prop을 `StatusPill`·`JitdaToolbar`·`PhaseHover`·`StageStrip`·`ActivityView`·`DashboardShell`에서 제거. `c1StatusMap.paused`, `stateCopy.paused`, `WaitingIllustration kind="paused"`, `ParticipantStatusBadge.paused` 모두 삭제. `STARTED_TEAMS` mock의 `activity:"paused"` 3건을 `idle`로 교체. `HackathonCard` mock에서 `paused:true` 제거
- 토큰·CSS: `.jt-pill-paused`(tokens.css · viewer.html · Renewal.html · Design System.html 4곳), `--c-backdrop` 주석 "E-6 일시정지" 표현 제거
- 와이어링: viewer.html ACTIONS의 `pause`/`resume` 전이 4개 제거(b2-started↔b2-paused)
- API/데이터: `hackathons.paused` 컬럼, `/me` 응답의 `paused`, `PATCH /hackathons/:id/status`의 일시정지 페이로드 모두 제거(어드민 기획 v11 · 로그인 기획 v9)
- 카피·UX: B-2 상태별 액션 버튼에서 [일시정지]/[재시작] 삭제, 5상태 다이어그램에서 `↕ paused` 라인 삭제, Design System §07 status pill 데모에서 일시정지 pill·sec-tag·Amber swatch 라벨 정리, §16 RingTimer 사용처에서 E-6 제거

**기획문서 정렬**:
- 어드민 v11: 권한 매트릭스·전이도·"일시정지/재시작은 토글" 룰·`hackathons.paused` 필드·`PATCH /status` 페이로드 모두 제거. v11 변경 이력 추가
- 로그인 v9: 자동 전환 매트릭스에서 일시정지/재시작 행 + E-6 일시정지 절 + `/me` paused 페이로드 제거
- 튜토리얼 노트: 상태 흐름 표기에서 일시정지 제거
- 페이지정의서·화면상태정의서·UX리뷰: 6상태 표·뱃지 표·전이 표 정합화, 이력 항목 추가
- 로드맵 v1: 운영자 기능 체크리스트에서 "일시정지 원클릭 제어" 제거

**남는 운영자 액션**: `[튜토리얼 시작]`·`[튜토리얼 종료]`·`[해커톤 시작]`·`[해커톤 종료]` 4개 단방향 전이. 모두 확인/경고 모달 거침. 종료는 30초 카운트다운으로 2단계 보호.

**검증 포인트** (실제 운영 후 재검토):
- (a) 진행 중 휴식 안내가 구두만으로 240명에게 통일되게 전파되는지(전북 8/1 본선)
- (b) 자동 저장 신뢰가 부족해 참가자가 "코드 날아갈까봐" 휴식 못 가는 케이스 발생 여부
- (c) UX 리뷰 [High] "제어 액션 전파 확인 부재" 이슈는 일시정지 폐기로 사라짐 — 시작/종료 액션만 확인 모달 + 카운트다운으로 보호

---

## 2026-05-29 B-2 대시보드 헤더 정합화 — sticky LiveStatus + 섹션별 결정 지표

**계기**: 사용자 질문 시리즈로 정보 위계 재정렬:
1. "튜토리얼 진행률" 32px 진행률 바가 컬럼 헤더 count와 중복 → 옵션 A(큰 % 메트릭 + 4px hairline) 채택
2. "● 실시간 · 방금 갱신 [↻]"이 3개 뷰 헤더에 중복 노출 → 전 화면 공통이라 sticky 헤더로 이관
3. sticky 헤더의 "접속 N/M"은 waiting 상태에서만 결정 도구(임계 시작 결정) → RosterView 헤더로 이관, sticky에서 제거
4. 실시간 상태를 아이콘만으로 절제(B-1) → mint pulse dot + refresh icon

**결정 (5개 변경 묶음)**:

1. **`LiveStatus` 컴포넌트 신설** (operator.jsx): 14px halo+core(`.jt-status-pulse` 재사용, `--c-mint`) + ghost refresh 버튼. hover tooltip "실시간 연결됨 · 방금 갱신". 향후 stale=amber, disconnected=safety 상태로 확장 여지.
2. **sticky 헤더 (DashboardShell)**:
   - 제거: `접속 N/M` cluster + 관련 `claimed`/`total`/`rosterLike` 계산
   - 추가: `showLiveStatus = status !== 'hackathon_ended'` 시 `<LiveStatus />` + actions 사이 1px hairline 구분선
3. **RosterView 헤더** (waiting 상태 전용):
   - 제거: `● 실시간 · 방금 갱신 [↻]` 마크업
   - 교체: `{totalTeams}팀` → `{connected}/{totalMembers} 접속 · {pct}% · {totalTeams}팀` (display 폰트 큰 숫자 + mono %)
   - `connected`·`totalMembers`·`pct`는 RosterView 내부 계산
4. **TutorialProgressView 헤더** (옵션 A 적용):
   - 제거: `{teams.length}팀 · ● 실시간 · 방금 갱신 [↻]` + 32px 다색 분할 바
   - 추가: `{completed}/{totalTeamsCount} 완료 · {pct}%` 한 줄 + 4px hairline 미니 바(`--c-stone` track, `--c-mint` fill, width 전환 0.24s decelerate)
5. **ActivityView 헤더**:
   - 제거: `● 실시간 · 방금 갱신 [↻]`
   - 유지: `팀 활동 현황 · {totalTeams}팀` (단순)
   - 활동 분포(active/idle/paused)는 후속 이터레이션에서 섹션 결정 지표로 보강 여지

**정보 위계 원칙 확립**:
- **sticky 헤더** = 보편(해커톤명·phase·runtime·WS 상태·actions). 화면 전환 무관 동일.
- **섹션 h3** = 그 화면의 결정 지표. RosterView=접속%, TutorialProgress=완료%, Activity=(향후) 활동 분포.
- **컬럼/카드** = 개별 객체.

**검증 포인트(향후)**:
- (a) 4px hairline 바 가시성 — Renewal.html 배경(--c-paper)에서 mint fill이 충분히 인지되는지. stone track이 너무 옅으면 빈 칸이 보이지 않을 수 있음.
- (b) LiveStatus halo pulse가 sticky 헤더 height 52px 안에서 자연스러운지, 14px 컨테이너+1.8s 주기가 산만한지.
- (c) RosterView 헤더의 `display 폰트 15px 큰 숫자`가 h3(16px sans)와 시각 무게 균형 — 큰 숫자가 h3보다 무거우면 위계 역전.
- (d) ended 상태(SummaryView)는 LiveStatus 미노출 — 운영자가 "데이터 흐름 끊김"으로 오해 안 하는지(이미 종료 phase pill이 단서이나 추가 검증 필요).

**파일 영향**:
- `operator.jsx`: `LiveStatus` 추가, `DashboardShell` sticky 정비, `RosterView`·`TutorialProgressView`·`ActivityView` 헤더 정리, TutorialProgressView 진행률 바 옵션 A 적용
- `tokens.css`: 신규 토큰 없음 (`.jt-status-pulse` 재사용)
- 와이어링: `data-action="refresh-roster|refresh-tutorial|refresh-activity"` 3개 → `data-action="refresh"` 1개로 통합

---

## 2026-05-29 B-2 튜토리얼 진행 칸반 v3 — 컬럼 zone bg + dashed가 끝까지 + 실시간 이동 애니메이션

**계기**: v2 사용자 피드백 2건 + 별도 요청 1건:
1. "각 칸이 너무 눈에 안띄어. 배경색을 좀 넣으면 될것같은데?" — 컬럼 식별성 부족
2. "구분선(현재는 점선)도 칸별로 끝까지 내리는게 나을듯" — dashed가 본문 짧은 컬럼에서 일찍 끝남
3. "실시간 갱신됨에 따라서 각 팀 카드들이 옆 칸으로 이동할거야. 이동하는 애니메이션을 디자인 안에 추가해줘."

**v3 결정**:
1. **컬럼 zone bg (매우 옅게)** — step 의미 색을 4~5% opacity wash로 컬럼 영역에 부여. 24px 격자지 bg는 그대로 비쳐 보이고, 컬럼 영역만 또렷이 인지.
   - 미시작: `rgba(45,42,36,0.04)` (중성 그레이)
   - Step 1·2·3: `rgba(46,44,138,0.045)` (튜토리얼 보라 wash)
   - 완료: `rgba(56,167,84,0.05)` (민트 wash)
2. **dashed divider 끝까지** — `alignItems: 'start'` 제거(default stretch) + 본문 zone에 `flex: 1`. grid stretch로 모든 컬럼이 가장 긴 컬럼 높이에 맞춰 늘어남 → `borderRight: dashed`가 끝까지 그려짐. 빈 컬럼도 zone bg + 가이드라인이 끝까지. opacity 0.18 → 0.20.
3. **실시간 카드 이동 애니메이션** — tokens.css에 `@keyframes jt-kanban-card-enter` + `.jt-kanban-card-enter` 클래스 신설(opacity 0→1, translateX -32→0, scale 0.94→1, 0.6s `var(--ease-decelerate)`). `TutorialProgressView`에 React state(`steps` + `moved` Set) + `setInterval(2200ms)` 도입 — `live=true`일 때 done이 아닌 팀 1개를 다음 step으로 랜덤 advance. RosterRow를 wrapper로 감싸고 `key={name-step}` 부여 → 팀 이동 시 wrapper remount → keyframe 자동 재생. **초기 마운트엔 클래스 미부여**(moved Set이 비어 있어서) → 첫 paint는 정적. 한 번 이동한 팀은 moved에 누적되어 이후 모든 step 이동마다 애니메이션 재생.
4. **DashboardShell 접속 카운트 보정**(v2에서 이미 적용) — `rosterLike = mode === 'roster' || mode === 'tutorial-progress'`로 sticky 헤더 "접속 N/M"이 PENDING_TEAMS member 배열 기반으로 계산.

**기술 노트**:
- 애니메이션은 wrapper의 translateX + scale에 적용. inner RosterRow의 `transform: rotate(--postit-rot)`은 그대로 유지 — 회전된 카드가 좌측에서 슬라이드인하며 자리 잡는 효과.
- `prefers-reduced-motion: reduce`에선 opacity-only 0.3s fade로 단축.
- setInterval cleanup은 useEffect return에 등록 — 화면 전환 시 자동 정리. Renewal.html에서 50 artboard 동시 로드해도 본 컴포넌트는 1 instance.
- 모든 팀이 done에 도달하면 movable이 비어 setSteps가 prev 그대로 반환 → 멈춤. 데모 시점은 약 60~90초 후 정지(시연 적정).

**검증 포인트(향후)**:
- (a) 2.2s 주기 적정성 — 너무 빠르면 산만, 너무 느리면 정적으로 인식.
- (b) 실제 행사에선 동시 다발 이동 가능 — 현재 한 tick당 1팀만 advance. mock fidelity 한계.
- (c) `moved` Set이 무한 누적(최대 32). 메모리 영향 없으나, 한 팀이 4회 이동 시 같은 wrapper key는 4번 다른 값 → 무리 없음.
- (d) 회전 + 슬라이드 조합이 모션 멀미 유발 가능성 — reduce-motion 분기로 완화했으나 일반 환경에서 추가 검증 필요.

---

## 2026-05-29 B-2 튜토리얼 진행 칸반 v2 — 컨셉 교정(설계 격자지 + RosterRow 포스트잇)

**계기**: v1 칸반(같은 날 작업)이 컨셉 "설계 격자지에 포스트잇 붙임"과 어긋남 — 사용자 지적 2건:
1. 각 컬럼이 흰 박스(`--c-canvas` bg + border + radius)로 닫혀 있어 도면 위 sticky note 메타포가 죽음
2. 포스트잇이 RosterRow와 다른 자체 구현(프로젝트명+인원수 텍스트 카드)이라 대기 화면과 시각 어휘 불일치

**v2 결정**:
1. **컬럼 박스 폐기 — 격자지 노출**. DashboardShell 루트가 이미 24px grid bg(`linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0/24px 24px ×2`)를 깔고 있음. 컬럼을 박스 대신 투명 zone으로 만들고 사이를 `1px dashed rgba(45,42,36,0.18)` 수직선(드래프팅 가이드)으로 구분.
2. **포스트잇 = RosterRow 직접 재사용**. `TutorialPostit` 함수 폐기, b2-tutorial-waiting의 `RosterRow`를 그대로 import. 같은 tape·회전·ON/OFF count·22px 미니 아바타·`anyOff` 기반 tint(mint-soft / safety-soft).
3. **데이터 소스 교체**: `STARTED_TEAMS`(members: number) → `PENDING_TEAMS`(members: 배열). RosterRow가 member 배열을 필요로 하며, 튜토리얼 진행 중에도 접속 상태가 운영자에게 가장 유의미한 정보(누가 빠졌나).
4. **DashboardShell claimed/total 보정**: `mode === 'roster' || mode === 'tutorial-progress'`를 `rosterLike`로 묶어 member 배열에서 ON 카운트. 기존 sticky 헤더의 "접속 N/M"이 깨지지 않게 유지.
5. **컬럼 헤더 — 도면 라벨 어휘**: `[3px step accent dash] [01 mono] [라벨] [count]`. 박스/배경 없음, 하단 1px hairline만. step accent 색은 라인 dash와 카운트 숫자에만 (시각 무게 최소).

**폐기**:
- `TutorialPostit` 함수 (자체 구현 카드)
- `TutorialKanbanColumn`의 박스 셸 (canvas bg / border / radius / paper bg 본문)
- v1에서 카드 tint로 사용한 step 토큰 (not-started=stone, step1·2·3=tutorial-soft, done=postit-tint-on) — RosterRow 자체 tint(anyOff)가 우선

**검증 포인트(향후)**:
- (a) 24px grid bg가 시각적으로 충분히 인지되는지 — 4% opacity는 의도된 무게이나 sticky note 메타포 전달에 약할 수 있음. 진하기 조정 필요시 tutorial-progress 모드 한정 grid 강화 검토.
- (b) RosterRow의 안 함 tint(mint-soft/safety-soft)는 접속 상태를 의미하는데, 튜토리얼 진행 컬럼 위에서 이 의미가 혼동될 수 있는지 (컬럼=step, 카드 색=접속). 사용자 인지 부담 측정 필요.
- (c) 완료 컬럼 20장 적층 시 column height 매우 김 — 페이지 스크롤 발생. 칸반에서는 자연스러우나 운영자가 한눈에 못 본다는 단점.
- (d) PENDING_TEAMS 32팀 vs 30팀 분포 가정 — 인덱스 27+ 모두 미시작으로 처리되어 미시작이 5팀(2팀 추가)으로 늘어남. 진행률 바 라벨(`{notStarted}팀 미시작`)이 동적이라 표시는 일치.

---

## 2026-05-29 B-2 튜토리얼 진행 화면 — 라이브 미리보기 그리드 → 5열 칸반(팀 포스트잇)

**계기**: 운영자가 튜토리얼 진행 중 "어느 팀이 어디 막혀 있나"를 즉시 파악하기 어려움. 기존 4×3 라이브 미리보기 카드는 시각 정보는 풍부하나 step 분포가 한눈에 안 들어옴 (정렬·필터 조작 필요). 사용자 지시: "튜토리얼 미리보기 대신 팀 포스트잇들이 step별 칸반으로 붙어있는 모습으로".

**결정**: `B2DashboardTutorialRunning`의 `TutorialProgressView`를 **5열 칸반**으로 교체.
- 컬럼 순서: `미시작 → Step 1 · 기획 → Step 2 · 기능 추가 → Step 3 · 다듬기 → 완료`
- 컬럼 헤더: 좌측 3px accent border(`var(--c-slate)` / `var(--c-tutorial)` ×3 / `var(--c-mint)`) + 라벨 + 카운트 칩
- 컬럼 본문: `var(--c-paper)` 위에 포스트잇 적층(gap 14)
- 카드 = `.jt-postit-card` (RosterRow와 동일 셸·hover·tape 어휘 재사용). 단, **tint는 step 토큰 기반**이지 anyOff 기반이 아님 — 카드 자체가 step 의미를 시각으로 전달
  - not-started: `var(--c-stone)` · step1·2·3: `var(--c-tutorial-soft)` · done: `var(--postit-tint-on)` (mint-soft)
- 카드 내용: 팀명(700 12.5) · 프로젝트명(10.5 ink-3) · 인원수(mono 10 muted). LivePreview 썸네일 제거 (칸반 정보 밀도 우선).
- `data-action="open-team"` 유지 → 기존 RosterTeamDetailModal 와이어링 그대로.

**폐기**:
- `TutorialTeamGrid` / `TutorialTeamRow` 함수 (LivePreview 기반 4×3 카드)
- Step 필터 칩 행 (`stepChips`, 전체/Step1/2/3/완료/미시작) — 컬럼 헤더가 동일 기능을 시각화
- `Pagination` 호출 (30팀 1뷰에 모두 노출 — 칸반은 페이지네이션 없음)

**유지**:
- 헤더(타이틀·실시간 도트·새로고침 버튼)
- 진행률 바(완료/진행/미시작 비율) — 컬럼 카운트와 중복이지만 비율 직관 가치

**검증**: viewer.html `b2-tutorial-running` 새로고침 시 5열 칸반 + 포스트잇 적층 노출. 30팀 분포(완료 20 / Step1=3 / Step2=2 / Step3=2 / 미시작 3) mock 유지. (브라우저 MCP가 다른 세션에 점유돼 자동 스크린샷 확인 불가 — 사용자 새로고침으로 시각 확인 필요.)

**알려진 트레이드오프**:
- 완료 컬럼이 20장으로 다른 컬럼 대비 ~7배 길어 시각 weight 불균형. `align-items: start`로 컬럼 독립 높이 허용 — 칸반의 자연스러운 형태이나, 페이지 전체 스크롤 길어짐. 후속: 완료 컬럼에 `max-height` + 내부 스크롤 옵션 검토.
- LivePreview 제거로 운영자가 팀 화면 상태(예: 코드 작성 중 vs 빈 화면)를 카드만으로는 못 봄. 클릭→상세 모달이 그 역할 흡수. 후속: 카드에 작은 활성 도트(최근 활동 시간) 추가 검토.

---

## 2026-05-29 아바타 라벨 정책 — 성씨 1자 → 이름 뒤 2자 (전 영역 일괄)

**계기**: B-2 RosterRow 22px 아바타가 "성씨 1자"라 동성 동팀(예: 김민준·김도현) 구분 어려움. 사용자 지적 — D-2 상세 "팀 멤버" 칩에서도 1자 그대로 노출되어 일관성 결여.

**결정**: 모든 원형 아바타(`.jt-avatar` + 인라인 원형 div) 라벨을 `name.slice(-2)`로 통일. 1자만 등록된 경우 그대로 fallback. **색상 매핑은 변경 없음**(여전히 `charCodeAt(0)` — 성씨 hash 6색). 폰트는 `var(--font-mono)` → `var(--font-sans)`, `letter-spacing: -0.04em`로 22px 원에 한글 2자 가독성 확보.

**적용 사이트 (11곳)**:
- operator.jsx — `RosterAvatar` (22px, 헬퍼 `rosterAvatarLabel`)
- dialogs.jsx — `TeammatePortrait`(60px) · `PendingAvatar`(40px) · 투표 모달 `v[0]`(22px)
- shared.jsx — `RosterMemberRow`(28px)
- participant.jsx — GNB user(26px)
- gallery.jsx — 정보 탭 "팀 멤버" 칩(20px) · 댓글 입력(24px·"민준") · `CommentItem`(28px)
- Jitda Renewal.html / viewer.html — `.jt-avatar` base class
- Jitda Design System.html §09f ROSTER MEMBER ROW 미러 — 4행 라벨 동기화

**검증**: viewer.html에서 B-2(접속 현황 카드)·B-2 팀 상세 모달·D-2 갤러리 상세 정보 탭·E-4 투표 모달·C-1 참가자 사이드바 새로고침, 모두 "민준·서윤·지호·지유" 식으로 표시.

**검증 포인트(향후)**: (a) 영문 이름(`"Alex"`)은 `.slice(-2)` → "ex"가 부자연스러움 — 현재 mock은 한글만이라 미발현, 다국어 시 분기 필요. (b) 색상이 여전히 성씨 hash이므로 "김민준·김도현" 동시 노출 시 색은 같고 라벨로만 구분 — 의도된 동작이나 운영자 인지 부담 검증 필요. (c) 22px·20px 원 안 한글 2자(sans 8.5~9px)가 저해상도 디스플레이에서 가독성 — 실측 필요.

---

## 2026-05-28 B 운영자 영역 — 헤더 압축 (GNB 행사명 제거 · StageStrip 폐기 · StatusPill 호버 popover · B-1 필터를 phase stepper로)

**계기**: B-2 대시보드 GNB 바로 아래에 (1) 행사명 h2 + StatusPill 행 (2) StageStrip 5단계 행 두 개가 연달아 있어 콘텐츠 영역을 압박. 사용자 지적 — GNB의 행사명과 h2가 중복, StatusPill과 StageStrip 강조 칩이 같은 정보를 두 번 표시.

**결정 — 역할 분리**:
- **B-1 (해커톤 목록)** = phase 모델의 전체 lifecycle 학습 지점. 단순 chip 필터 → 가로 stepper 시각화로 격상.
- **B-2 (해커톤 대시보드)** = 한 해커톤의 지금·다음 액션. 5단계 정보는 StatusPill 호버 popover로 접근 (상시 노출 제거).
- **GNB**: 운영자 영역 모든 화면에서 행사명 제거 → 로고+계정만. 행사 정체성은 B-2 sticky 헤더 h2가 단일 노출.

**변경 파일**:
1. `operator.jsx`
   - 상단에 `PHASE_STAGES` const 추가 (B-1·B-2 공유 색·라벨).
   - `B1HackathonList` 필터 영역: 6개 jt-btn chip → `<PhaseFilterStepper>` 호출. counts는 `hackathons` 배열에서 동적 계산.
   - `PhaseFilterStepper` 함수 신설: "전체 N" + 세로 divider + 5단계 칩(`PHASE_STAGES` 색·번호 prefix·count·chevron 사이).
   - `DashboardShell`: `<AppHeader breadcrumb={[HACKATHON_NAME]} ...>` → `<AppHeader user={...} />` (breadcrumb 제거). `<StatusPill>` → `<PhaseHover>`로 교체. `<StageStrip>` 호출 라인 삭제.
   - `DashboardModalShell`: `<AppHeader>` breadcrumb 동일하게 제거.
   - `PhaseHover` 함수 신설: `<StatusPill>` + 호버 시 노출되는 5단계 popover(`PHASE_STAGES` 재사용, 현재 단계 색 채움+"← 현재", 지난 단계 dim, 미래 단계 muted).
   - `StageStrip` 함수는 보존(legacy 표시) — 다른 화면 재사용 가능성 있음, 1주 무사용 확인 후 제거 검토.

2. `tokens.css`: `.jt-phase-hover` / `.jt-phase-popover` CSS 추가 (opacity·visibility·transform 트랜지션, `:hover` / `:focus-within` 트리거).

**효과**:
- B-2 sticky 헤더가 ~80px 압축 (52px 단일 행) → 명단/활동 영역 ~80px 증가.
- B-1 단계 필터가 "전체 6 → ①→②→③→④→⑤" 흐름을 시각화 → phase 모델 학습 지점 확립.
- 중복 제거: GNB↔h2(행사명), StatusPill↔StageStrip(현재 상태).

**반증 시나리오 점검**:
- 딥링크로 B-2 직접 진입(신규 운영자): phase 모델 못 봤어도 비가역 전이 모달이 "이전 상태로 되돌릴 수 없습니다" 안내 중. 추가 안전망 = StatusPill 호버 popover. → 차단 가능.
- popover discoverability: `aria-haspopup="true"` + `aria-label="단계 진행도 보기"` + focus-within 지원. tab 키 접근 가능. 시각적 hint(▾ 등)는 추가 안 함 — StatusPill 시각 노이즈 우려, 1주 사용 관찰 후 결정.

**검증**: viewer.html에서 `b1`·`b2-tutorial-waiting`·`b2-started` 모두 확인. PhaseFilterStepper 렌더 정상, B-2 StatusPill 호버 시 popover 노출, 현재 단계 강조/지난 단계 dim 정상 작동.

---

## 2026-05-28 B 운영자 영역 — 페이지 배경에 격자 패턴 추가 (auth.jsx와 동일)

**계기**: 사용자 요청 "운영자 화면 배경에 로그인 화면처럼 은은한 격자무늬 넣어줄수있어?".

**변경**: `operator.jsx` 최상위 페이지 컨테이너 4곳(`B1HackathonList`·`B1Empty`·`DashboardShell`·`DashboardModalShell`)의 `background: var(--c-paper)`를 다중 background로 교체. auth.jsx 우측 폼 카드(line 137-138)와 동일한 스펙 사용: `linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px)` × 가로/세로 + `24px 24px` 타일.

**효과**: 페이지 컨테이너 레벨이라 내부 opaque 컴포넌트(AppHeader, sticky 헤더 `--c-canvas`, StageStrip `--c-paper`, 모달 backdrop 등)는 격자를 가리고, 콘텐츠 영역만 격자가 비치는 구조. 모달 셸은 backdrop이 전면 덮으므로 시각적 영향 없음.

**검증**: viewer.html에서 `b-1`·`b-1-empty`·`b-2-*` 시리즈 새로고침으로 격자 확인.

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
+ | 종료 후 | 해커톤 종료 (자동 공개) | 카드 목록 + 상태 pill "해커톤 종료" (2026-05-29: SEALED · 18:20 보조 라벨 폐기 — 불필요한 영어/시간) |
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
| E-24 | **v1 전면 폐기 — v2 단독 정본 채택 (2026-06-01)** | ✅ 사용자 결정 "디자인에서 합의 투표 관련 화면들 중 v1은 모두 삭제해라". (1) `e4`·`e4-waiting`·`e4-rejected` 3 화면 viewer/Renewal 삭제. (2) `E4VotingBody`·`E4WaitingBody`·`E4FailureBody` 함수 삭제. (3) v1 전용 헬퍼 `RingTimer`(140-168px 작은 링)·`TeammatePortrait`(124×N 4열 카드)·`e4Teammates`(4인 fixture) 모두 삭제. (4) `E4ConsensusVote` switch에서 'voting'/'waiting'/'rejected' 케이스 제거, 기본값 'voting-v2'. (5) STRUCTURE.md 총합 51→48 + 화면 표 v1 폐기 표시. 영향: -3 화면 / -6 컴포넌트 / -3 와이어링 | E-21의 "최종 채택 정책 미정" 상태 종결. v2 거대 ring(480px) + 미수락자 아바타 + 6시 수락 버튼 어휘를 합의 투표 정본으로 확정. 검증 후속: 페이지정의서·UX 리뷰·기획문서 잔존 e4/e4-waiting/e4-rejected 참조 점검 |
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
| **primary** | `.jt-btn-primary` | 없음 — 단순 검정 | 일반 CTA (튜토리얼 종료 등) |

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

## 18. B-2 RosterRow — 포스트잇 어휘 + 모달 peel entrance (2026-05-29)

> 사용자 결정: "팀 카드들이 좀더 설계도에 붙은 포스트잇처럼 보이게. 호버시에도 컨셉 살리는 애니메이션. 카드 클릭 시 열리는 모달에 포스트잇을 떼서 뒤집어서 뒷면을 보는듯한 애니메이션." + Q&A: "카드만 포스트잇, 배경은 현 상태 유지 / 파인난 flip 토큰+어휘 등록 / 완전 범위(JSX + tokens.css + Design System + STRUCTURE + spec-updates)".
>
> 범위: b2-tutorial-waiting + b2-hack-waiting (RosterView 공유) + b2-roster-detail (모달) = 3 화면.

### 18-1. 결정 요약

| 영역 | 변경 |
|------|------|
| 카드 (RosterRow) | `.jt-card-interactive` → `.jt-postit-card` 클래스 교체. 회전 ±1.4° (4-variant deterministic by team-name hash) · paper tint 4종 · 상단 ink-alpha tape · 비대칭 shadow · hover 시 똑바로 펴지며 lift |
| 그리드 (RosterGrid) | gap 8 유지(+ paddingTop 4) — 60팀 1페이지 보존. 회전 ±1.4°가 190px 카드에서 옆 1.5px 미만 돌출, gap 8 흡수 가능 |
| 모달 (RosterTeamDetailModal) | `entrance="peel"` — `.jt-modal-surface.is-peel` 신규 (perspective 800 + rotateY -72→0 + scale 0.94→1, 360ms decelerate, transform-origin 50% 0) |
| 토큰 (tokens.css) | `--postit-rot-{a,b,c,d}` · `--postit-tint-{a,b,c,d}` · `--postit-shadow-rest/lift` · `--postit-tape` · `@keyframes jt-modal-peel-in` · `.jt-postit-card`(::before tape) · `.jt-modal-surface.is-peel` · `prefers-reduced-motion` 보강 |
| ModalSurface (shared.jsx) | `entrance` 매핑에 `peel: 'is-peel'` 추가 |
| Design System html | §09f Component Library 끝에 "POST-IT CARD" 서브섹션 신설 + §09e ENTRANCE 표에 `is-peel` 행 추가 |

### 18-2. 왜 §10 "그라데이션·입체 효과 금지" 룰의 경계선인가

§10 DON'T: *"12px 이상의 라운드, 그라데이션, 입체 효과 사용하지 않기."* 포스트잇 어휘는 본질적으로 입체 단서(들림·tape·접힘)에 기댄다. 위반 회피를 위해 모든 어휘를 **절제값**으로 채택:

- **회전 ±1.4°** — 상한. 5° 이상은 "기울어 보이는 결함"으로 해석될 수 있어 시각 노이즈. ±1.4°는 운영자가 "한눈에 미접속 식별"(§11-1 가치)에 지장 없는 미세 정렬 깨짐.
- **그라데이션 없음** — tint는 단색 `oklch(near-paper)` 4종. 단계적 색 변화는 금지.
- **tape는 ink alpha 단색** — 12px 토큰화된 jt-caution-strip 어휘를 차용하지 않고 ::before 1줄. 데이터 의미 없는 데코이므로 aria-hidden 자동.
- **shadow는 elevation 스케일 내** — `--postit-shadow-rest`는 shadow-md급, `--postit-shadow-lift`는 shadow-hover급. 모달의 `--shadow-modal`을 카드에 쓰지 않음.
- **border-radius 4px** — `var(--r-xs)` 유지, 12px 상한 한참 미만.

### 18-3. 반증 시나리오 (Critical Analysis Mode)

| 시나리오 | 영향 | 완화 |
|---|---|---|
| **(a) 60카드 동시 hover GPU 부담** (이미 §390 (a)에서 우려) | rotate + box-shadow + ::before 다 transform 트리거. 마우스가 그리드를 가로지를 때 60개가 순차 lift → 컴포지터 레이어 폭증 가능 | `will-change` 미설정(meta-layer 폭증 회피). 호버는 카드별 :hover 단일, 그룹 hover 없음 |
| **(b) 회전 시각 노이즈로 "한눈에 미접속 식별" 가치(§11-1) 약화** | rose 도트 + opacity 0.7 미접속 카드가 ±1.4° 기울어진 상태에서 시선 그루핑 어려울 가능성 | hover 시 0°로 펴지는 어휘가 "조사 모드 진입" 단서. 실측: 7/13 전북 연수에서 운영자 task 시간 측정 필요 |
| **(c) §10 "그라데이션·입체 효과 금지" 룰 위반 시비** | 미래 디자인 검토자가 본 결정 보고 다른 카드에도 확산 시도 가능 → 어휘 일관성 붕괴 | tokens.css `.jt-postit-card` 주석 + 본 spec에 "RosterRow 전용·확산 금지" 명시. `.jt-card-interactive`는 그대로 유지 (기본 어휘) |
| **(d) `prefers-reduced-motion` 환경에서 시각 정체성 손실** | 회전·peel 모두 off. 그 결과 평범한 평면 카드와 구분 안 됨. 포스트잇 컨셉 전달 실패 | tint·tape는 정적으로 유지(회전만 off). 시각 정체성은 페이퍼 톤 + tape로 대체 신호 |
| **(e) viewer.html 한계로 카드→모달 동시 transition 시뮬 불가** | 별도 artboard 간 전환은 viewer가 instant. 실제 앱에서는 카드 peel-out + 모달 peel-in이 연결되어야 자연 | 본 작업은 모달 entrance만 정의(`is-peel`). 카드 exit 어휘는 실 앱 구현 시 별도 정의 — 디자인 시스템 §09d Motion에 미래 TODO 명시 |
| **(f) `--postit-tint-*` 4종이 mint 도트·rose 도트와 충돌** | tint-b(paper-mint-soft)가 mint 인디케이터와 겹치면 도트 가독성 ↓ | mint 도트는 9px solid + 흰 2px ring으로 분리 — 시각 검증 시 카드별 `postitVariant` 결과 확인 |

### 18-4. 결정 근거 정리

- **deterministic rotation/tint** (charCode 합 % 4): 렌더마다 회전 바뀌면 어지러움 + 같은 팀 식별 어려움. 같은 팀명은 항상 같은 자세.
- **transform-origin 50% 100% (카드 밑변)**: 호버 시 카드가 "아래에서 위로 들리는" 단서. 50% 0%는 "위에서 떨어지는" 어휘로 부적합.
- **모달 transform-origin 50% 0% (상단)**: 클릭 위치의 카드가 그리드 안에서 임의 좌표 → 모달은 화면 중앙 고정. 상단을 축으로 펼치는 게 "tape 자리에서 떼낸다" 단서.
- **rotateY -72° → 0°** (90° 아님): 90°는 완전히 옆면이라 carry-over 없음. -72°는 사용자가 "절반 이상 펴진" 시점부터 콘텐츠 인지 가능, opacity 55% 지점에서 등장 균형.
- **dur-slow (360ms)**: pop-in(240ms)보다 1.5× 길게. peel은 "물리적 동작"이므로 standard보다 천천히. 그러나 720ms 이상은 운영자 task 지연감.

### 18-5. 검증

- [ ] viewer.html 새로고침 후 `b2-tutorial-waiting` — 카드 60종이 ±1.4° 4-variant로 분산되어 tape strip + 4색 tint 노출.
- [ ] 카드 hover — rotate 0° + translateY(-3px) + shadow-lift 적용 확인 (Chrome DevTools Performance: 1 카드 hover frame budget ≤ 4ms).
- [ ] `b2-hack-waiting` — 동일 RosterGrid 공유. 같은 시각 확인.
- [ ] `b2-roster-detail` — 모달 entrance 시 perspective + rotateY 회전 보임. opacity transition 자연스러움. dur-slow 360ms.
- [ ] `prefers-reduced-motion: reduce` 활성화 — 회전 0°, peel 비활성, fade로 대체.
- [ ] 첫 행 카드 tape이 그 위 ("참가자 접속 현황 N팀 · ● 실시간" 라벨) 영역과 겹치지 않음. paddingTop 4 충분 확인.
- [ ] 60팀 mock 케이스 ("이 화면 미사용" 폴백 데이터 등으로 늘려본) 또는 PENDING_TEAMS 30팀이 6×5로 첫 절반에 모두 들어가는지.
- [ ] 콘솔 0 에러.

### 18-6. 영향 화면

| ID | 변경 |
|---|---|
| `b2-tutorial-waiting` | RosterGrid 시각 갱신 (30팀 mock, 6×5 = 5행 노출) |
| `b2-hack-waiting` | 동일 RosterGrid (`DashboardShell(mode='roster', status='hackathon_waiting')`) |
| `b2-roster-detail` | 모달 entrance peel (perspective rotateY) |

다른 mode(activity/tutorial-progress/summary)는 ActivityRow/TutorialTeamRow를 사용 — 포스트잇 어휘 미적용. 갤러리 GalleryCard·HackathonCard도 무영향.

### 18-7. 미해결·후속

- (a) **카드 exit 어휘**: 실 앱에서 카드→모달 전환 시 클릭된 카드가 "떼어지는" 어휘 필요. viewer 한계로 본 작업 미포함. 별도 결정 필요.
- (b) **모달 백드롭 클릭으로 닫을 때**: 현 백드롭은 단순 click → 다른 화면. peel-out 어휘는 미정의. is-peel 역재생 또는 fade-out 중 결정 필요.
- (c) **다른 mode 확산 검토**: ActivityRow(진행 mode)도 포스트잇 어휘 적용할지. 라이브 미리보기 썸네일이 16:10 영역 → 회전 시 더 두드러짐. K-12 학생 화면에서 산만함 가능 — 신중.
- (d) **카드 hover 트리거 a11y**: 키보드 Tab 포커스는 `:focus-visible` outline만, hover 어휘(회전 0°+lift) 미적용. 키보드 사용자에게도 같은 단서 제공할지 정책 결정 필요.

### 18-8. tint 4-variant 랜덤 → 2색 데이터 기반 (2026-05-29 후속 결정)

> 사용자 지적: "카드 색상은 랜덤인거같은데 직관적이지 못하다. 모두 접속 완료된 팀과 한 명이라도 미접속인 팀 간의 색상 차이를 넣어서 2가지 색상만 존재하게 해라."

**진단**: 18-4 의도("같은 팀은 항상 같은 자세")는 deterministic이지만 변형 4종이 **의미 부여 없이 시각 노이즈**로 작용. 운영자 task("한눈에 미접속 팀 식별")는 데이터 차원의 시각 분기를 요구한다. §13의 "anyOff면 카운트 색 muted" 어휘와 정렬 — tint도 같은 신호 차원으로.

**변경**:

| 영역 | 변경 |
|------|------|
| **tokens.css** | `--postit-tint-{a,b,c,d}` 4종 (임의 색) → 2종 wash 토큰 신규 등록 후 사용. `--c-mint-wash`(#eaf3ec) · `--c-safety-wash`(#faebe1) 신규 — soft 톤보다 ~60% 채도 낮은 paper-tinted variant. 큰 면적 fill 용. 초기 #eef5ef·#fbeeec 임의 색 → mint-soft/safety-soft (디자인시스템 정식 토큰이지만 60카드에는 과채도) → **wash 톤 신규 토큰**으로 두 번 정정 |
| **Design System §02** | **WASH TIER 서브섹션 신설** — 4-swatch 그리드(mint-soft vs mint-wash 비교 / safety-soft vs safety-wash 비교) + DO/DON'T 본문 ("칩·작은 카드는 soft, 큰 면적 fill은 wash") |
| **operator.jsx** | `POSTIT_VARIANTS`(rot+tint 묶음 4종) → `POSTIT_ROTATIONS`(rot 4종). 헬퍼 `postitVariant(name)` → `postitRotation(name)`. RosterRow에서 tint는 `anyOff ? 'var(--postit-tint-off)' : 'var(--postit-tint-on)'` 분기. aria-label에 "· 미접속 포함" / "· 모두 접속" 컨텍스트 추가 |
| **Design System §09f** | 4-card 정적 미러 — 4-variant tint → 2-variant on/off 교차 노출. 캡션 "좌상·우상=모두 접속, 좌하·우하=미접속 포함". props 표 tint 행 갱신 |

**근거**:

- **데이터 신호 일관**: 미접속 도트=rose · 카운트 muted · tint=paper-rose → 3개 신호가 같은 차원으로 정렬. 시선 그루핑 강화.
- **회전은 유지**: 같은 팀 식별성(렌더마다 같은 자세) + 포스트잇 어휘의 "무질서한 손으로 붙임" 감성은 회전 4-variant로 보존.
- **18-3 (b) 우려 부분 해소**: "회전 시각 노이즈로 한눈에 미접속 식별 약화" → 미접속 카드가 색으로 분리되므로 회전 영향 ↓.

**반증 시나리오(추가)**:

- (a') **soft 톤 60카드 그리드 시각 피로 → wash 톤 신규 등록으로 해소 (2026-05-29 사용자 지적 "포스트잇에 적절하게 더 물빠진 색상")**: soft 톤(#d6f1de·#ffe0cf)이 4카드 voting 모달에서는 적절하나 60카드 그리드에서 면적 15×로 과채도. → `--c-mint-wash`(#eaf3ec) · `--c-safety-wash`(#faebe1) 신규 토큰 등록(soft 대비 ~60% 채도 낮음, paper hue 쪽으로 끌어내림). 디자인시스템 §02 WASH TIER 서브섹션 신설로 "큰 면적 fill" 정책 명문화.
- (b') **60팀 중 14팀 미접속 케이스에서 safety-soft 카드 14장이 mint-soft 46장과 분리**는 운영자 task에 효과적이나, 5팀 미접속·55팀 접속 같은 비대칭 케이스에서 safety-soft 5장이 "노이즈"로 묻힐 가능성. 실측 필요(7/13 전북 연수).
- (c') **E-4 TeammatePortrait(투표 카드)와 어휘 충돌**: 같은 mint-soft/safety-soft를 RosterRow와 voting 모달에서 다른 의미("접속 상태" vs "투표 상태")로 사용. 운영자가 두 화면을 같은 세션 안에서 보지 않으므로(B-2 vs E-4) 인지 충돌 가능성 낮음. 단, B-2 진행 mode에서 E-4 voting 모달이 띄워질 때 color semantic 확인 필요.
- (d') **임의 색 → 정식 토큰 정정 (2026-05-29 사용자 지적)**: 초기에 paper-mint/paper-rose 임의 hex(#eef5ef·#fbeeec) 사용 → "이 색상들은 디자인시스템에 정의된 색상들이 맞는가?" 지적 → `--c-mint-soft`·`--c-safety-soft` 정식 토큰 재사용으로 정정. 짓다 디자인시스템 컴플라이언스 룰 강화 — 신규 색 추가 시 반드시 토큰 등록 절차 거칠 것.

**검증**:

- [ ] `b2-tutorial-waiting` PENDING_TEAMS 30팀 — anyOff 팀 수 ≈ 14팀이 paper-rose, 나머지 ≈ 16팀이 paper-mint.
- [ ] `b2-hack-waiting` 동일 mock — 같은 비율.
- [ ] 회전은 4-variant 분산 유지 — 인접 카드끼리 다른 각도.
- [ ] aria-label 스크린리더 발화 — "{팀명} 팀 상세 보기 · 모두 접속" / "...· 미접속 포함".
- [ ] 콘솔 0 에러.

---

## 18-9. 접속 상태 필터: 2-chip 별행 → 상단 우측 단일 토글 (2026-05-29 후속)

> 사용자 결정 (이미지 첨부): "접속상태 칩 대신 토글(미접속만 보기)로 변경해줘. 위치는 윗줄 팀 변경 요청 좌측에" + "위치는 거기가 아니더라도 네가 ux 전문가 관점에서 다시 판단해봐"

### UX 판단 (4개 위치 후보 평가)

| 위치 | 장점 | 단점 |
|------|------|------|
| **A. 상단 우측, 팀변경요청 pill 좌측 (사용자 제안)** | 별행 제거 → 세로 ~36px 회수(60팀 case에서 1행 추가 노출 마진), 우측은 "행위" 영역으로 일관 | 팀변경요청(passive help) 옆 active 토글 — 시각 위계 분리 필요 |
| B. 좌측, 새로고침 옆 | 데이터 컨트롤 클러스터 통합 | 헤더(타이틀+카운트+refresh)가 이미 4요소로 혼잡 |
| C. 카운트 메타 인라인 | 자연 읽기 흐름 | 정적 라벨과 인터랙티브 토글 시각 위계 충돌 |
| D. 별행 유지(축소) | 명확한 시각 분리 | 60팀 행사에서 1행 손실(§18-9의 회피 동기 자체와 모순) |

**채택**: A. 사용자 제안과 일치. 단, 시각 위계 분리 룰 보강:
- 토글: `jt-btn jt-btn-secondary jt-btn-sm` + `aria-pressed`. 활성 시 jt-btn-primary로 전환(실 앱).
- 팀변경요청: `border + cursor:help + mono caps` 유지 — passive help context로 명시.
- 사이 gap 10px로 시각 분리. 토글 prefix는 6px rose dot — safety-wash 카드와 시각 신호 일치.

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `RosterView`** | 필터 칩 별행 삭제. 상단 row를 `justify-content: space-between` flex로 재구성 — 좌측(h3 + 메타 + refresh) / 우측(toggle + 팀변경요청). `filterChips` 배열 폐기. `data-action` `filter-all`·`filter-offline` → 단일 `toggle-offline`. `offlineCount` 계산은 유지(토글 라벨 count 배지). |
| **viewer.html ACTIONS** | viewer는 자체 라우팅 없으므로 매핑 추가 안 함. 정적 mock 비활성 시각만 노출. |

### 잃은 것 vs 얻은 것

| 잃은 것 | 얻은 것 |
|--------|---------|
| "전체 32"의 명시적 칩 (active state visualization) | 같은 정보가 h3 옆 메타 "32팀"으로 이미 노출 — 중복 제거 |
| 클릭으로 명시적 "전체로 돌아가기" | "미접속만 보기"를 다시 누르면 비활성 = 전체. aria-pressed 토글 표준 패턴 |
| 2-chip의 "필터 그룹" 시각 어휘 | 단일 액션 → 인지 부하 ↓. 색 신호(safety-wash 카드) 1차 식별 후 토글은 보조 위계 |
| 세로 ~36px | 60팀 행사에서 1행 추가 노출 마진 (artboard 여유 24px → 60px) |

### 반증 시나리오

- (a) **토글 활성 시 "전체로 돌아가기" 발견 가능성**: aria-pressed 표준이지만 초보 사용자에겐 mental model 안 잡힐 수 있음. → 실 앱에서 활성 시 라벨 swap("전체 보기") 옵션 검토.
- (b) **토글이 팀변경요청 pill과 시각 혼동**: 둘 다 우측 인접. 토글은 jt-btn(36px hit area), pill은 mono caps + border + cursor:help — visual weight 분리되나 좁은 viewport에서 혼동 가능. → 필요 시 사이 vertical divider 추가.
- (c) **`prefers-reduced-motion` 환경에서 토글 상태 전환 단서**: jt-btn 기본 transition은 reduced에서도 색만 유지 — OK.
- (d) **rose dot prefix가 helmet/CTA 단서와 혼동**: helmet은 yellow, rose는 safety orange — hue 정반대라 충돌 없음.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 상단 우측에 토글 노출, 별행 사라짐.
- [ ] 토글 hover/focus-visible — jt-btn 표준 어휘 적용.
- [ ] 60팀 그리드 자리 확인 — 별행 제거로 세로 여유 늘어남.
- [ ] aria-pressed="false" 스크린리더 발화 — "미접속만 보기, 토글 버튼, 누르지 않음".
- [ ] `b2-hack-waiting` 동일 화면(같은 RosterView 공유).

### 후속

- (a) **실 앱 토글 활성 동작**: `useState` + pagedTeams 필터링 + page 리셋 로직. 정적 mock은 false 고정.
- (b) **활성 시 라벨 swap**: "미접속만 보기" → "전체 보기"? 또는 라벨 고정 + pressed로만 표현? 사용자 행동 관찰 후 결정.
- (c) **다른 mode 영향**: tutorial-progress mode의 stepChips는 5-state 동시 필터로 단일 토글로 환원 불가 — 그대로 유지. 본 변경은 roster mode 한정.

---

## 18-10. Switch primitive 디자인시스템 등록 + RosterView 토글 교체 (2026-05-29 후속)

> 사용자 지적: "지금 미접속만 보기가 토글이 아니라 버튼인데?" (스크린샷 첨부) + "없을걸? 추가해"

### 진단

§18-9에서 `jt-btn-secondary` 외관으로 구현 → 시각적으로 "버튼"이지 "토글"이 아님. 디자인시스템에 switch primitive 부재 확인. dialogs.jsx E-1 갤러리 공개 토글에 인라인으로 같은 패턴이 이미 존재(line 157~173: 44×24 track + 18×18 thumb + ink/hairline-strong 색 전환) — 정식 토큰화 안 됨.

### 변경

| 영역 | 변경 |
|------|------|
| **tokens.css** | `.jt-switch` 신규 primitive — track 44×24 / thumb 18×18 / `aria-checked` 기반 시각 전환. CSS 변수 `--switch-w/-h/-thumb/-pad`로 사이즈 제어. `.is-sm` 변형(36×20), 색 variant `.is-safety` / `.is-mint`. `prefers-reduced-motion`에 transition off 보강 |
| **Jitda Design System.html §09f** | "SWITCH · 2-state 토글" 서브섹션 신설 — 3색 variant × 2상태 미러 + sm 사이즈 + RosterView labeled-pill 패턴 + DO/DON'T 4종. ARIA `role="switch"` + `aria-checked` 규칙 명시 |
| **operator.jsx RosterView** | jt-btn-secondary 버튼 → `<label>` + 인라인 라벨(rose dot + "미접속만 보기" + count) + `<button class="jt-switch is-safety is-sm">`. `role="switch"` + `aria-checked={false}` (mock). 라벨 클릭으로도 토글 가능 |

### ARIA 결정 근거

`aria-pressed` (button) vs `aria-checked` (switch):
- `aria-pressed`: button이 눌렸는지 여부. "Bold 토글"처럼 명확한 on/off가 아닌 액션 상태.
- `aria-checked`: switch/checkbox 등 binary 상태. "필터 활성/비활성"의 mental model 정확.

→ `role="switch"` + `aria-checked` 채택. ARIA 1.2 표준 패턴.

### 후속

- (a) **dialogs.jsx E-1 갤러리 공개 토글** — 인라인 `<button>` 패턴을 `.jt-switch.is-mint`로 교체할 후보. 별도 작업으로 분리(스크롤 회피).
- (b) **참가자 화면(C-1 등)도 토글 필요 케이스 발견 시** — 이제 정식 primitive 가용. 인라인 새로 만들지 말 것.
- (c) **disabled 상태 시각 검증** — opacity 0.4 + cursor not-allowed. 실 사용처에서 가독성 확인 필요.

---

## 18-11. 토글 작동 + 포스트잇 재정렬 settle 애니메이션 (2026-05-29 후속)

> 사용자 결정: "토글 작동 동작을 디자인 화면에 추가해줘. 포스트잇 재정렬도 약간의 애니메이션을 추가해줘."

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `RosterView`** | `React.useState(showOfflineOnly)` 도입. 토글 클릭 시 state flip. `displayedTeams = showOfflineOnly ? teams.filter(anyOff) : pagedTeams` 분기. 페이지네이션은 필터 OFF + totalTeams > perPage에서만 노출. 라벨 pill: 활성 시 `border: var(--c-safety)` + `background: var(--c-safety-wash)` + count 색 `var(--c-safety-deep)`로 강조 (--dur-fast 전환). |
| **tokens.css** | `@keyframes jt-postit-settle` 신규 — `opacity 0→1` + `translateY(-6px) → 0` + `scale(0.97 → 1)`, 회전 `var(--postit-rot)`은 0/100% 동일 유지 (정지 상태 자세 보존). `.jt-postit-card { animation: jt-postit-settle 280ms var(--ease-spring) backwards; }`. nth-child stagger 3-phase (25/55/85ms) — 60카드 max ~85ms 안에 정착. `prefers-reduced-motion`에 `animation: none` 보강 |
| **RosterGrid 부모 wrapper** | `<div key={showOfflineOnly ? 'off' : 'all'}>` — key 변경으로 자식 강제 remount → 모든 `.jt-postit-card`가 jt-postit-settle 재실행 |

### 토글 작동 흐름

```
[OFF]                              [ON]                              [OFF 복귀]
●━━ 미접속만 보기 16    클릭 →     ●━━━● 미접속만 보기 16 (safety 강조)    클릭 →    ●━━ 미접속만 보기 16
(전체 30팀)                        (미접속 포함 14팀만)                   (전체 30팀)
                                   
모든 카드 settle              key 변경 → 모든 카드 settle 재실행           key 복귀 → 모든 카드 settle 재실행
(28-85ms 스태거)              (28-85ms 스태거)                            (28-85ms 스태거)
```

### 애니메이션 선택 근거

| 후보 | 채택 여부 | 이유 |
|------|----------|------|
| **CSS keyframe + key remount** ✅ | 채택 | 라이브러리 없음. ~280ms 짧음. 스태거가 자연스러운 "포스트잇 한 장씩 안착" 느낌 |
| FLIP (First-Last-Invert-Play) | 미채택 | 부드러운 위치 전환 가능하나 RAF + 위치 측정 로직 필요. 프로토타입 범위 초과 |
| React Transition Group | 미채택 | exit 애니메이션 가능하나 dependency 추가. babel-standalone 환경 부담 |
| 단순 fade (opacity only) | 미채택 | 포스트잇 어휘(들림·안착)와 시각 신호 약함. translateY + scale + spring ease가 컨셉 일치 |

### 반증 시나리오

- (a) **60카드 동시 settle GPU 부담**: 60카드 × (opacity + transform) × ~300ms = 컴포지터 레이어 폭증 가능. nth-child stagger로 동시 active 카드 ~15장으로 분산하나 실측 필요(60팀 행사).
- (b) **회전 보존**: keyframe에서 `transform: rotate(var(--postit-rot))`를 0/100% 명시. 만약 인라인 `transform`이 다른 곳에 있으면 충돌 — 현재 `.jt-postit-card`는 transform을 클래스로만 제어하므로 OK.
- (c) **`prefers-reduced-motion` 환경에서 토글 후 카드 즉시 swap**: animation off + transition off → 시각 단서 없이 그리드 내용만 바뀜. accessibility 정합이나 UX 손실 — 시각 단서가 줄어 변화 감지 어려울 수 있음. 라벨 pill의 색 전환(border + bg)은 유지되므로 부분 보강.
- (d) **필터 ON 상태에서 새 카드(미접속 팀) 추가**: 실 앱에서 teams 데이터 갱신 시 React diff로 settle 재실행 안 됨(key 동일). 향후 실 앱 구현 시 새 미접속 팀 진입 시 별도 highlight 어휘 필요할 수 있음.
- (e) **활성 pill bg가 settle 카드 색과 시각 충돌**: 둘 다 safety-wash hue. 카드는 60장 분산, pill은 1개 + 우측 상단 → 시각 위계 다르므로 충돌 낮음. 다만 pill 면적이 작아 wash 톤이 묻힐 수 있음 — 다행히 safety border 1px + safety-deep 글자색 보조.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 초기 렌더 시 모든 카드가 settle 애니로 등장.
- [ ] 토글 클릭 → 14장만 노출 + settle 재실행 (스태거 가시).
- [ ] 토글 재클릭 → 30장 복귀 + settle 재실행.
- [ ] pill 외관 전환 (border·bg·count 색).
- [ ] 토글 ON 상태에서 페이지네이션 숨김.
- [ ] `b2-hack-waiting` 동일 작동(공유 RosterView).
- [ ] `prefers-reduced-motion: reduce` — 애니 비활성, 카드 즉시 swap, pill 색 전환만 유지.

### 후속

- (a) **카드 exit 애니메이션 부재**: 필터 OFF→ON 전환 시 사라지는 카드는 즉시 unmount(no exit anim). UX 손실 — 향후 React Transition Group 또는 view-transitions API 검토.
- (b) **stagger를 nth-child로 처리** → 가상화·동적 추가에서 깨질 수 있음. 60카드 정적 그리드라 OK이나 향후 검토.
- (c) **`displayedTeams` 갯수 < perPage 가정**: 미접속 ≈ 14팀이므로 1페이지. 80팀 행사·40+ 미접속 케이스에서 페이지네이션 ON 시점 정책 필요.

---

## 18-12. 모달 peel 애니 폐기 + 백드롭 settle 차단 (2026-05-29 후속)

> 사용자 결정: "각 포스트잇 눌렀을때 모달 돌아가는 애니메이션이 별로다. 애니메이션없애고 경량화해라. 또 모달이 열릴때 뒷 배경의 포스트잇들에 애니메이션이 들어가는데 그렇지 않도록 해라" + "디자인에서만 그럴지도"

### 진단

§18-4에서 도입한 peel 어휘(rotateY -72→0 + perspective 800 + scale)는 viewer가 화면 전환(b2-tutorial-waiting → b2-roster-detail) 시 카드↔모달 연결 없이 모달만 회전 → 시각 단절. 또한 b2-roster-detail의 백드롭 DashboardShell이 fresh mount → 모든 `.jt-postit-card`가 jt-postit-settle 재실행 → 모달 등장 순간 배경이 들썩이는 노이즈.

실 앱은 다를 가능성("디자인에서만 그럴지도") — 카드↔모달 in-place 전환·useState 기반 모달 등 viewer 외 컨텍스트에서는 다른 해법이 자연. 본 작업은 viewer 한정 정리.

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `RosterTeamDetailModal`** | `entrance="peel"` → `entrance="fade"` — opacity-only 240ms decelerate, 가장 경량 표준 entrance |
| **operator.jsx `B2RosterDetail`** | 블러 backdrop wrapper에 `className="jt-roster-backdrop"` 부여 — settle 비활성화 트리거 |
| **tokens.css** | `@keyframes jt-modal-peel-in` 제거. `.jt-modal-surface.is-peel` 클래스 제거 (dead code). `.jt-roster-backdrop .jt-postit-card { animation: none !important; }` 신규 |
| **shared.jsx `ModalSurface`** | `entranceMod` 매핑에서 `peel: 'is-peel'` 제거 |
| **Design System §09e ENTRANCE 표** | `.jt-modal-surface.is-peel` 행 제거 |

### 후속 정리

- (a) **§18-4 (peel entrance 등록)와 §18-12 (peel 폐기) 모순**: 어휘 등록 → 사용처 검증 → 폐기 사이클 1주 미만 — 디자인시스템 어휘 추가 시 "사용처 1개만으로 등록 보류" 룰 검토 가치.
- (b) **`prefers-reduced-motion` 정합**: fade도 reduced 환경에서 기존 `.jt-modal-surface` 일괄 처리로 자동 비활성. settle 차단 룰도 `!important` 사용 — reduced 환경의 `animation: none`과 충돌 없음(둘 다 none).
- (c) **실 앱 카드↔모달 in-place transition**: viewer 한계로 미해결. view-transitions API 또는 모달을 같은 화면 안 useState 토글로 전환 등 별도 검토.

### 검증

- [ ] viewer `b2-tutorial-waiting` → 카드 클릭 → `b2-roster-detail` 진입 시 모달이 회전 없이 opacity만 페이드.
- [ ] 같은 진입 시 배경 30카드가 settle 재실행하지 않고 즉시 노출(블러 + opacity 0.55 그대로).
- [ ] `b2-tutorial-waiting` 본 화면(백드롭 아님)에서는 settle 정상 작동.
- [ ] 토글 클릭으로 인한 재정렬 settle은 그대로 유지(§18-11 기능 회귀 없음).
- [ ] 콘솔 0 에러.

---

## 18-13. B-1 HackathonCard 포스트잇 어휘 + 5상태 색 여정 (2026-05-29)

> 사용자 결정: "이 화면도 비슷하게 포스트잇 모양으로 바꿔주라. 포스트잇 색상은 해커톤 상태에 따라서."

### 변경 요약

| 영역 | 변경 |
|------|------|
| **tokens.css** | 3종 wash 토큰 신규 등록: `--c-stone-wash`(#f1efea) · `--c-tutorial-wash`(#eeedf7) · `--c-helmet-wash`(#fbf6df). 기존 `--c-mint-wash`·`--c-safety-wash` 재사용 → 5상태 색 여정 완성 |
| **operator.jsx** | `STATUS_POSTIT_TINT` 신규 const — 5상태 → wash 토큰 매핑. `HackathonCard`: `.jt-card-interactive` → `.jt-postit-card`. 인라인 border 제거(shadow가 경계), `borderRadius: r-md → r-xs`, `--postit-rot`/`--postit-tint` CSS 변수 부여. `B1HackathonList` 그리드 gap 14→22 + paddingTop 6 (회전 옆 돌출 + tape clearance) |
| **Design System §02 WASH TIER** | 6-swatch 추가 그리드 신설 (stone-soft/wash, tutorial-soft/wash, helmet-soft/wash). 본문에 "B-1 HackathonCard 5상태 색 여정" 사용처 명시 |
| **Design System inline `:root`** | `--c-tutorial`·`--c-tutorial-soft`·`--c-tutorial-wash`·`--c-stone-wash`·`--c-helmet-wash` 5종 추가 — 단일 소스 정합 |

### 5상태 색 여정

| 단계 | 상태 | Wash 톤 | 의미 |
|------|------|---------|------|
| 01 | tutorial_waiting  | `--c-stone-wash` (#f1efea)    | **cold** — 시작 전 중립 |
| 02 | tutorial_running  | `--c-tutorial-wash` (#eeedf7) | **engaged** — 학습 모드(purple) |
| 03 | hackathon_waiting | `--c-helmet-wash` (#fbf6df)   | **anticipation** — 본행사 임박(yellow energy) |
| 04 | hackathon_running | `--c-mint-wash` (#eaf3ec)     | **live** — 진행 중(success green) |
| 05 | hackathon_ended   | `--c-safety-wash` (#faebe1)   | **sunset** — 종료(rose, opacity 0.78 추가 페이드) |

### PHASE_STAGES chip vs STATUS_POSTIT_TINT — 왜 다른 매핑

| 어휘 | tut_waiting | tut_running | hack_waiting | hack_running | hack_ended |
|------|------------|-------------|-------------|--------------|-----------|
| chip(PhaseFilterStepper) | stone | purple | **stone** (같은 hue) | mint | rose |
| post-it(HackathonCard) | stone | purple | **helmet** (차별화) | mint | rose |

칩은 가로 stepper에서 chevron(→)으로 phase 순서가 보강되므로 두 waiting이 같은 hue여도 OK. 카드는 그리드에 무작위 분포 — "한눈에 5상태 식별"이 task라 시각 차별화 필수. hackathon_waiting을 helmet으로 옮기면 "anticipation" 어휘가 자연(곧 시작될 행사).

### paused 처리

`엔지니어 부트캠프 8기` (status=hackathon_running, paused=true) — tint는 mint-wash 유지, paused signal은 StatusPill 옆 amber pill로 노출(기존 어휘 유지). 카드 tint 자체를 amber로 override하면 "진행 중인 행사" 정체성 흐려져 reject.

### 반증 시나리오

- (a) **5색 wash가 모두 paper hue로 비슷해 보일 가능성**: 30카드 그리드 RosterRow는 2색만이라 단순. HackathonCard는 5색이 동시 노출되며 옆 카드 색이 명확히 구분되어야 task 효율. 채도 ~12% 수준이므로 hue 차이는 보이나, 색맹 검증 필요.
- (b) **stone과 paper 톤 충돌**: `--c-paper`(#faf9f6, B-1 배경 grid)와 `--c-stone-wash`(#f1efea, tut_waiting 카드) 차이 ~3% 명도. 카드 윤곽이 약해질 수 있음 → post-it shadow가 보강(shadow-rest 6px+14px dual).
- (c) **opacity 0.78 + safety-wash 이중 페이드 (hack_ended)**: 두 시각 단서가 "종료"를 강조하나 너무 묻힐 수 있음. 실측 시 opacity 제거 또는 wash → soft로 다시 올릴지 검토.
- (d) **paused 시 tint override 안 함의 한계**: 시각 첫 인상에서 paused 카드가 mint-wash로 "진행 중"으로만 보임. amber pill 인지에 ~0.5초 추가 소요 가능. 운영자 task 측정 필요.

### 검증

- [ ] viewer `b1` ⌘+Shift+R — 6개 카드 모두 회전 + 5색 wash + tape + status별 tint.
- [ ] 카드 hover — 0° 정렬 + lift, transition smooth.
- [ ] hack_ended 카드(2025 겨울 해커톤 결선) — safety-wash + opacity 0.78.
- [ ] paused 카드(엔지니어 부트캠프 8기) — mint-wash + amber paused pill.
- [ ] PhaseFilterStepper 상단의 chip은 무영향(기존 PHASE_STAGES 그대로).
- [ ] 콘솔 0 에러.

### 후속

- (a) **paused 시각 강도 보강 가치**: tint override가 너무 강하다면, dashed border 또는 좌측 amber accent bar(3px)로 시각 보조 가능. 7/13 전북 실측 후.
- (b) **다른 곳에 STATUS_POSTIT_TINT 재사용**: B-2 sticky 헤더의 현재 상태 표시 또는 다른 phase-aware UI에 같은 매핑 적용 가능. 일단 HackathonCard 한정.
- (c) **5색이 충분히 distinct한가**: 색맹 검증(deuteranopia 모드)에서 mint-wash와 stone-wash 구분 가능한지. 후속 검증.

---

## 18-14. B-1 PhaseFilterStepper 필터 작동 (2026-05-29)

> 사용자 결정: "단계 칩 누르면 필터링되는거 디자인에 추가해줘"

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `B1HackathonList`** | `React.useState('all')` 도입. `filtered = activeFilter === 'all' ? hackathons : hackathons.filter(...)`. `<PhaseFilterStepper active={activeFilter} onFilter={setActiveFilter}>`. 그리드를 `<div key={activeFilter}>`로 감싸 필터 변경 시 카드 settle 재실행. 빈 상태 메시지 추가 |
| **operator.jsx `PhaseFilterStepper`** | `onFilter` prop 추가. 각 칩(전체 + 5단계)에 `onClick` + `aria-pressed`. onFilter 미전달 시 무동작(정적 mock 호환) |
| **하드코딩 카운트 제거** | `"...해커톤 6건"` → `"...해커톤 {hackathons.length}건"` 동적 산출 |

### 작동 흐름

```
초기: activeFilter='all', filtered=6 → 6 카드 노출 + settle
↓ "02 튜토리얼 진행 1" 클릭
activeFilter='tutorial_running', filtered=1 → 1 카드 + grid key 변경 → settle 재실행
↓ "05 해커톤 종료 1" 클릭  
activeFilter='hackathon_ended', filtered=1 → safety-wash 카드 + settle
↓ "전체" 클릭
filtered=6 → settle 재실행
```

### 빈 상태 (count 0 단계 선택 시)

dashed border + paper bg + 13.5px 본문 + 11px mono 보조 가이드("다른 단계를 선택하거나 [전체]로 돌아가세요"). count 0 단계는 칩 자체가 opacity 0.45로 dim 표시되어 클릭 전 인지 가능.

### 반증 시나리오

- (a) **filter persistence 미적용**: viewer 새로고침 시 'all' 초기화 — 실 앱은 URL query 또는 localStorage 검토. 정적 mock 한계.
- (b) **`paused` 필터 부재**: shared.jsx에서 paused 상태 자체가 폐기(2026-05-29)되어 시점적으로 무관.
- (c) **count 0 단계 클릭 가능**: opacity dim + 클릭 시 빈 상태. 디스커버리 명확하나 1회 헛걸음 가능 — `disabled` 처리 검토 가능하나, "이 단계가 0개임을 확인" task가 가능하므로 현 유지.
- (d) **`<div key={activeFilter}>` settle 재실행**: 같은 카드가 필터 OFF→ON 시 재마운트 — UX적으로 자연스러운 "재정렬" 어휘. RosterView §18-11과 동일 패턴.

### 검증

- [ ] viewer `b1` ⌘+Shift+R — 초기 'all'로 6 카드 노출.
- [ ] "02 튜토리얼 진행" 칩 클릭 → 1 카드 + settle + 칩 ring 활성.
- [ ] "05 해커톤 종료" 칩 클릭 → safety-wash 1 카드 + settle.
- [ ] "전체" 클릭 → 6 카드 복귀.
- [ ] aria-pressed 스크린리더 발화.
- [ ] 콘솔 0 에러.

### 후속

- (a) **B-2 mode 필터(roster/activity/tutorial-progress/summary)도 동일 패턴 적용 가치**: 운영자가 화면 안에서 동적 전환할 수 있도록 필터 칩 추가 검토.
- (b) **URL state sync**: viewer는 hash routing 한계. 실 앱(Next.js)에서 `?filter=tutorial_running` query 권장.
- (c) **단계 칩 count 라이브**: PHASE_STAGES.map이 매 렌더 산출하므로 hackathons 갱신 시 자동 재계산.

---

## 18-15. 팀 포스트잇 색 정책 — status-driven → identity-driven (2026-05-29)

> 사용자 결정: "팀 포스트잇의 색깔에 관해 깊게 고민하고 제안해라." 3가지 제약 — (1) 미접속/접속 색 구분은 대기실 외 불필요 (2) 색이 너무 다양/단조 모두 안됨 (3) 같은 팀 화면마다 색 바뀌면 혼란. AI 분석: 4-후보 평가 후 **전략 C(팀 정체성 기반 3톤 paper)** 제안 → 사용자 동의 + "백엔드 저장 여부" 확인 → **클라이언트 hash로 진행**.

### 진단: 색이 두 기능을 동시에 수행하던 문제

이전 정책(§18-8): 색 = 상태 신호 (mint-wash 모두 접속 / safety-wash 미접속 포함). 같은 팀 X가 대기실→튜토리얼→본행사로 이동하면 색이 매번 변경 → 사용자 우려 #3 정확히 발생. 색이 entity(팀)와 state(상태) 둘 다 인코딩하려다 충돌.

### 새 정책: 색 = 팀 정체성, 상태 = 색 외 신호

| 차원 | 어휘 |
|------|------|
| **색** | 팀명 hash 3-variant — paper-warm/cool/mint. 같은 팀은 화면 무관 같은 색 |
| **회전** | 팀명 hash 4-variant — 같은 팀은 같은 자세 (기존 유지) |
| **미접속 신호** | 좌측 3px safety accent bar. **roster mode 한정** |
| **튜토리얼 step 신호** | 컬럼 위치(Kanban) + step 뱃지. 색 무영향 |

### 변경

| 영역 | 변경 |
|------|------|
| **tokens.css** | `--c-paper-warm`(#f7f4ec) · `--c-paper-cool`(#f1f3f6) · `--c-paper-mint`(#eef3ed) 신규. 구 `--postit-tint-on/-off` 폐기 |
| **operator.jsx** | `TEAM_IDENTITY_TINTS` 배열 + `teamIdentityTint(name)` 헬퍼 신규. `RosterRow`: tint = `teamIdentityTint(t.name)`. `showOfflineAccent` prop 추가 — true 시 좌측 3px safety bar + count 색 mint/muted 분기. `RosterGrid` 전달, `TutorialKanbanColumn` 미전달. padding-left 10→12 |
| **Design System §02** | "PAPER IDENTITY TIER" 서브섹션 신설(3-swatch + 정책). "ENTITY × COLOR POLICY" 표 신설 — Hackathon(status) / Team(identity) / Member(identity) 매핑 |
| **Design System §09f POST-IT CARD** | 4-card 미러 갱신(paper 3톤 + accent bar), 정책·props·DO/DON'T(7종) 갱신 |

### 백엔드 저장 여부 — 클라이언트 hash 결정

`rosterAvatarColor`(성씨 hash)와 동일 방식 연장. 백엔드 무수정.

**근거**: 짧은 행사(반나절~3일) → 팀명 변경 거의 없음 / 이미 동일 패턴 정착 / 스키마 변경 비용 큼 / 운영자 override 필요성 낮음.

**예외 트리거**: 7/13 전북 행사에서 "특정 팀 색 지정" task 실측되면 `team.color` 필드 추가.

**해시 알고리즘 동결**:
```js
let h = name.length * 7;
for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) | 0;
return TEAM_IDENTITY_TINTS[((h % 3) + 3) % 3];
```
charCode 합 + 길이 가중 + 위치 가중. **변경 시 모든 팀 색 shift — spec-updates 기록 의무**.

### 사용자 우려 #1~#3 해소

| 우려 | 해소 |
|---|---|
| #1 "대기실 외 접속 색 불필요" | ✅ accent bar는 roster mode 한정 (`showOfflineAccent` prop). 다른 모드는 색 정체성만 |
| #2 "지나친 다양/지나친 단조" | ✅ 3톤 — 60카드 그리드 평균 20장씩 분포. 회전 4-variant가 추가 시각 변화 |
| #3 "같은 팀 색 변경 혼란" | ✅ deterministic hash로 화면 무관 동일 색 |

### 반증 시나리오

- (a) **3톤 paper hue 색맹 환경 구분 어려움** 가능성 — deuteranopia에서 mint↔cool 헷갈릴 수 있음. 한국인 색맹 빈도 ~5% → 실측 검증 필요.
- (b) **accent bar 인지 강도 약함**: 이전 mint↔safety 전체 fill 대비 신호 작음. 60팀 중 14팀 미접속 케이스에서 식별 task 시간 ↑ 가능. count 색(muted) + member dots(rose) 보조. 실측 후 폭 3→4px 보강 검토.
- (c) **"랜덤" 비판 재발 가능성**: §18-8에서 받았던 피드백. 본 결정은 동일 해시지만 **identity 의미를 명시** — §02 ENTITY × COLOR POLICY 표로 박제. "팀 식별 표지(rosterAvatarColor와 같은 어휘)" 설명 가능.
- (d) **HackathonCard 5상태 색과 어휘 충돌**: HackathonCard는 hackathon entity·status-driven. Team은 identity-driven. 다른 entity에 다른 어휘 → §02 표로 명문화.
- (e) **한글 charCode 분포 편향**: 0xAC00~0xD7A3 범위가 좁음. 길이·위치 가중으로 보완했으나 실측 필요. 30팀 mock으로 1차 검증.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 30카드 3톤 paper 분포 + 회전 4-variant.
- [ ] 미접속 포함 팀(~14팀)에 좌측 3px safety accent bar 노출. tint 무변동.
- [ ] `b2-hack-waiting` 동일 RosterView — 같은 팀 같은 색.
- [ ] `b2-tutorial-running` Kanban — accent bar 미노출, 같은 팀 같은 색 유지.
- [ ] 같은 팀 X(예: "터미널 사파리") 화면 전환 시 색·자세 유지.
- [ ] `prefers-reduced-motion: reduce` — settle off, tint·accent bar 정적.
- [ ] 콘솔 0 에러.

### 후속

- (a) **백엔드 저장 트리거**: "특정 팀 색 지정" task 실측 시 `team.color` enum 필드 추가.
- (b) **accent bar 보강 옵션**: 폭 3→4px / 상하 끝까지 / tape 색 safety override 단계적 검토.
- (c) **색맹 검증**: deuteranopia/protanopia 모드 캡처 + 3톤 구분 확인.
- (d) **ActivityRow identity tint 확장**: 라이브 미리보기 썸네일 카드에 tint 미세 적용 검토 — 별도 결정.

---

## 18-16. 미접속 신호 — accent bar → chip 3-state (2026-05-29 후속)

> 사용자 지적: "좌측 바로 접속상태를 표기하는것이 비직관적이다. 좀더 좋은방법 없을까?" + "그리고 한 명도 안 접속한 팀과 일부가 미접속한 팀 간의 구분도 필요할듯?"

### 진단: accent bar의 비직관성

§18-15에서 좌측 3px safety accent bar 도입했으나:

| 문제 | 설명 |
|------|------|
| 의미 anchor 없음 | 좌측 막대 = 선택 표시·우선순위·미접속 등 다 가능. 컨벤션 부재 |
| 위치 임의성 | 왜 좌측? 왜 막대? 미접속 개념과 시각 연결 약함 |
| 추상도 높음 | 텍스트·픽토그램 없이 색만 — 학습 부담 |
| 기존 신호와 중복 | 멤버 도트·카운트가 이미 데이터 노출 → bar는 amplifier만 |

### 새 정책: chip 3-state in 카운트 위치

3개 상태(전원 접속/일부 미접속/전원 미접속)를 카운트 영역의 chip으로 표현 — 텍스트가 직접 신호.

| 상태 | 조건 | chip 시각 | 의미 강도 |
|------|------|----------|----------|
| 전원 접속 | onCount === total | chip 없음, 평이한 mono 카운트 "N/M" muted | OK (조용) |
| 일부 미접속 | 0 &lt; onCount &lt; total | safety-soft bg + safety-deep 글자 + 4px safety dot + "미접속 N" | Attention |
| 전원 미접속 | onCount === 0 | safety solid bg + 흰 글자 + 4px 흰 dot + "전원 미접속" | Critical |

### 4-후보 평가 (제안 단계)

| 후보 | 채택 여부 | 사유 |
|------|----------|------|
| **A. 카운트 chip 강화** ✅ | 채택 | 텍스트 = 가장 직관 / 카운트 위치 그대로(시선 이동 0) / chip 어휘 이미 정착 / 신호 강도 조정 가능 |
| B. 우상단 코너 뱃지 | 미채택 | 도트 하나는 데이터 없음, 학습 필요. 카운트와 분리 |
| C. 기존 신호만 유지 (bar 제거) | 미채택 | 60카드 스캔 효율 약함 |
| D. 멤버 도트 강화 | 미채택 | 도트 크기 불일치 시각 노이즈 |

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `RosterRow`** | 좌측 accent bar `<span>` 제거 + `padding-left 12 → 10` 복귀. count 영역에 `showChip ? chip : 카운트` 분기. chip은 `allOff ? solid : soft` variant 분기. aria-label에 "전원 미접속" / "N명 미접속" / 정상 3-case 적용 |
| **operator.jsx PENDING_TEAMS** | "JS의 비밀" 멤버 (백하늘·문가람) `on` → `off` — 다인팀 "전원 미접속" 시각 검증 mock |
| **Design System §09f POST-IT CARD** | 4-card 미러 갱신: 전원 접속(chip 없음) / 일부 미접속(soft chip) / 전원 미접속(solid chip) / 전원 접속 변형. 캡션 갱신, props 표 "offline chip 3-state" 행, DO 룰 갱신 |

### 사용자 우려 해소

| 우려 | 해소 |
|------|------|
| "좌측 bar 비직관" | ✅ accent bar 제거. chip 텍스트 = 직접 신호. 위치는 카운트 영역(자연 시선) |
| "일부 vs 전원 미접속 구분 필요" | ✅ 3-state — soft chip(주의) vs solid chip(긴급) 시각 위계 명확 |

### 반증 시나리오

- (a) **chip이 카드 폭 차지 — 긴 팀명 압박**: 190px 카드에서 "전원 미접속" chip ~70px + 도트 4px + 패딩 12px = ~86px. 잔여 ~104px가 title. 한글 4~6자 팀명은 OK이나, 10자+ 팀명은 truncate. 호버 툴팁(`title` 속성)으로 보완.
- (b) **mono 9.5px이 가독성 한계**: chip 텍스트가 작음. 사이즈 10.5px 검토 가능하나 카드 폭 압박 ↑. 7/13 실측 후 결정.
- (c) **solid safety + 흰 글자 강한 시각**: critical 상태(전원 미접속)에 적합하나, 그리드에 5+ 카드 동시 solid면 시각 과부하. 60팀 행사 실측에서 분포 확인 필요.
- (d) **"전원 미접속" 정의 모호**: 데이터 모델은 `on`/`off`/`pending` 3상태. 본 chip은 `onCount === 0` 기준이라 모든 멤버가 off+pending 혼합이어도 "전원 미접속"으로 카운트 — 의도된 단순화(§17 UI 2상태 통합 정책 연장).
- (e) **roster mode 외에서도 chip 보고 싶다는 task 가능**: 현재 정책상 tutorial-progress·activity에서는 chip 미노출. 운영자가 "이 팀 미접속이었지" 컨텍스트 손실 가능. 실측 후 mode 확장 검토.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 60카드 중 전원 접속 ~16팀(chip 없음), 일부 미접속 ~13팀(soft chip), 전원 미접속 ~4팀(solid chip — 다인팀 "JS의 비밀" + 1인팀 류재석·천도현·황태리).
- [ ] 좌측 accent bar 더 이상 노출 안 됨.
- [ ] `b2-hack-waiting` 동일 RosterView — 같은 분포.
- [ ] `b2-tutorial-running` Kanban — chip 미노출(showOfflineAccent prop 미전달), 평이 카운트만.
- [ ] 같은 팀 X 화면 전환 시 tint·자세 유지(§18-15 회귀 없음).
- [ ] aria-label 스크린리더 발화 3-case 확인.
- [ ] 콘솔 0 에러.

### 후속

- (a) **장팀명 truncate UX 검증**: 호버 툴팁 충분한지 7/13 실측.
- (b) **chip 사이즈 동적 조정 검토**: 카드 폭 < 180px 시 "미접속 N" → "·N" 축약? 별도 결정.
- (c) **mode 확장**: tutorial-progress에서도 chip 노출 검토 — 단 §18-15 "색 외 신호는 mode별 분리" 정책과 충돌. 실측 결과 따라 결정.

---

## 18-17. 신규 화면 — 단일 tint A/B 변형 (B2DashboardTutorial{Waiting,Running}Mono) (2026-05-29)

> 사용자 결정: "한번 튜토리얼 대기랑 진행 화면 샘플로 포스트잇 색깔 전부 동일한 버전 하나 만들어볼래?" + "파랑으로통일" + "기존거 두고 페이지 추가"

### 의도

§18-16 chip 3-state 도입 후 "시선 강탈" 우려 → 3톤 identity tint(§18-15)가 chip과 결합되어 시각 부하 가능. 단일 tint로 통일하면 그리드 차분해지면서 chip이 더 명확해질지 검증용 A/B 페이지.

**기존 화면 보존 — 신규 2 페이지 추가** (사용자 명시).

### 변경 (Pattern C — 신규 화면)

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `MonoTintContext` React context 신규. `RosterRow`가 context 소비 — set 시 `teamIdentityTint(t.name)` 대신 context value 사용. 신규 함수 `B2DashboardTutorialWaitingMono` + `B2DashboardTutorialRunningMono` — 각각 Provider로 감싸 `value="var(--c-paper-cool)"` 주입. window export 추가 |
| **viewer.html SCREENS** | `b2-tutorial-waiting-mono` + `b2-tutorial-running-mono` 항목 추가 (h=920) |
| **Jitda Renewal.html** | 대응 `<DCArtboard>` 2 추가 |

### 색 선택: `--c-paper-cool` (#f1f3f6)

**근거**:
- Paper identity tier에 이미 등록 — 기존 3톤(warm/cool/mint)과 동일 명도·채도 tier
- "파랑으로통일" 요청에 부합 (옅은 회청 paper)
- 공정한 A/B 비교 — tier가 같아야 시각 부하 차이가 tint 다양성에서 오는 것이 명확

### 비교 포인트 (사용자 viewer에서 직접 검증)

| 측면 | 기존 (3톤 identity) | 변형 (단일 mono) |
|------|--------------------|------------------|
| chip 시선 강탈 | 3톤 분포로 그리드 활발 → chip이 묻힐 우려 | 단일 톤 정적 그리드 → chip이 더 두드러짐 |
| 팀 정체성 | 화면 무관 같은 색 (§18-15 강점) | 정체성 신호 소실 — 같은 팀이 다른 화면에서도 청색 |
| 포스트잇 어휘 | "벽에 붙은 다양한 메모지" | "정렬된 게시판 같은 색 메모지" |
| 시각 피로 | 분포라 자극 ↑ | 정적이라 차분 |

### 반증 시나리오

- (a) **정체성 신호 소실 — §18-15 우려 #3 재발**: 같은 팀 X가 화면 무관 같은 색이라는 §18-15 자산을 mono 변형에서 포기. A/B 후 mono 채택 시 §18-15 부분 철회 필요.
- (b) **solid chip이 단일 청색 위에서 더 강함**: soft chip은 OK, solid chip은 청색 배경 대비 강력 — 시선 강탈 약화 의도와 충돌 가능. 실측 후 chip 채도 조정 검토.
- (c) **파랑 단일이 "기다림"·"차분함" 어휘로 적절한가**: paper-cool은 "대기 단계" 컨벤션 hue. 진행(running)에도 같은 색은 어휘 모순 가능. mono 채택 시 status별 단일 색 매핑 별도 검토.

### viewer 진입

B-2 영역 드롭다운에서 `b2-tutorial-waiting-mono` / `b2-tutorial-running-mono` 선택. 기존 화면과 좌·우 비교 권장.

### 후속 결정 트리거

A/B 비교 후 사용자 판단:
- **유지(현행 3톤)** → mono 페이지 정리 또는 보존
- **mono 채택** → §18-15 부분 철회 + status별 단일 색 매핑 정책 신설
- **혼합** → 별도 결정

### 검증

- [ ] viewer 드롭다운에 mono 2 페이지 노출.
- [ ] `b2-tutorial-waiting-mono`: 모든 RosterRow가 `--c-paper-cool` 단일 tint. 회전·tape·chip(3-state) 동일 동작.
- [ ] `b2-tutorial-running-mono`: 칸반 컬럼 안 RosterRow도 단일 tint. chip 미노출.
- [ ] 같은 팀 X가 mono vs 기존 화면에서 색이 다름 → 정체성 손실 시각 확인.
- [ ] 콘솔 0 에러.

---

## 18-18. 미접속 chip 폐기 → 카운트 색·weight 3-state (마일드) (2026-05-29)

> 사용자 지적: "미접속 칩이 너무 시선강탈인데. 3/4 이런 인원 수 색깔로 구분되게 좀더 마일드하게 바꿔봐. 단일색상이랑 기존버전 둘다 모두"

### 진단

§18-16에서 도입한 chip 3-state(soft chip / solid chip)이:
- soft chip: 카드 정체성 tint(paper) 위에 safety-soft bg + 도트 + 텍스트 — 시각 무게 큼
- solid chip: safety solid bg + 흰 글자 → 30+ 카드 그리드에서 attention magnet이 과함
- 도트+텍스트 결합이 카드 내 작은 면적에서 강한 신호 → "시선 강탈"

§18-15·§18-16에서 추구한 "데이터 신호"는 OK이나 시각 강도가 과함. 더 마일드한 어휘 필요.

### 새 정책: 카운트 N/M 자체의 색·weight로 3-state

| 상태 | 조건 | 카운트 시각 | 강도 |
|------|------|------------|------|
| 전원 접속 | onCount === total | `var(--c-muted)` weight 500 | 조용 (현행) |
| 일부 미접속 | 0 &lt; onCount &lt; total | `var(--c-safety)` weight 600 | 마일드 |
| 전원 미접속 | onCount === 0 | `var(--c-safety-deep)` weight 700 | 명확 |

font-size 10px mono 유지 — 사이즈 변경 없음, 색·weight만 변화.

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx `RosterRow`** | chip JSX 분기 전체 제거. 단일 `<span class="jt-mono">` count로 통일. 색·weight 3-state 분기. dead 변수 `showChip` 제거 |
| **Design System §09f** | 4-card 미러 갱신 — chip → 카운트 색·weight. props 표 "offline 카운트" 행 갱신. DO 룰 갱신 |

### 사용자 우려 해소

| 우려 | 해소 |
|------|------|
| "chip 시선 강탈" | ✅ chip 완전 폐기. 기존 카운트 위치·크기 그대로, 색·weight만 변화 → 시각 부하 ↓ |
| "정보 손실" | ✅ "3/4"는 "1명 미접속"을 직관 표현 — 카운트 자체가 데이터 |
| "단일색상이랑 기존버전 둘다" | ✅ RosterRow 단일 수정 → identity tint·mono tint 변형 모두 자동 적용 |

### 양 변형 자동 적용

본 변경은 RosterRow 본체만 수정 — paper identity(3톤)와 mono tint 변형 모두 같은 카운트 어휘로 자동 정합. §18-17 A/B 비교가 tint 다양성에만 집중되도록 chip 노이즈 제거.

### 반증 시나리오

- (a) **카운트 색 변화가 너무 미묘**: muted → safety → safety-deep 차이가 작은 카드(190px)·작은 텍스트(10px)에서 식별 어려울 수 있음. weight 차이(500/600/700)가 보강하나 fontFamily mono의 weight 시각 차이는 sans보다 약함. 7/13 실측 후 fontSize 11px 검토 가능.
- (b) **safety hue 단독 신호 — 색맹 환경**: deuteranopia에서 safety(주황)↔muted(회색) 구분 어려움. weight 차이가 보조. 단, 색맹 검증 필요.
- (c) **운영자가 카운트 색에 주목 안 함**: 기존 운영자가 chip 어휘에 익숙하지 않음 → 카운트는 "그냥 숫자"로 인식할 위험. 다만 paper tint는 화면 단일이라 카운트 색이 유일 신호로 부각됨.
- (d) **mono variant에서 신호 약함**: paper-cool 위에서 safety 카운트 색 대비 충분(블루↔오렌지 hue 분리). OK.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 30카드 카운트 색 3-state 분포 확인:
  - 전원 접속(~16팀): muted
  - 일부 미접속(~13팀): safety orange
  - 전원 미접속(~4팀: JS의 비밀 + 1인팀 류재석·천도현·황태리): safety-deep bolder
- [ ] chip 자체 노출 안 됨.
- [ ] `b2-tutorial-waiting-mono` 동일 시각.
- [ ] `b2-hack-waiting` (roster 공유) 동일.
- [ ] `b2-tutorial-running` Kanban — 모든 카운트 muted(showOfflineAccent 미전달).
- [ ] 콘솔 0 에러.

### 후속

- (a) **§18-16 chip 정책 정식 폐기**: 이전 spec 본문에 "chip 3-state"로 박제되어 있으나 §18-18로 대체. 본 결정이 우선 — §18-16은 history만 보존.
- (b) **fontSize·weight 보강**: 카운트 식별 약하면 fontSize 10 → 11px / weight 500/600/700 → 500/700/800 검토.
- (c) **색맹 검증 후 추가 신호 검토**: text-decoration underline 또는 아이콘 prefix(!) 등 보조 신호 추가 가능.

---

## 18-19. RosterTeamDetailModal 큰 포스트잇 리디자인 (2026-05-29)

> 사용자 결정: "카드 눌렀을때 나오는 모달이 포스트잇 화면과 잘 안어울려. 어울리게 개선안 제시해봐. 디자인시스템 꼭 안지켜도됨" → 안 A "큰 포스트잇" 채택.

### 진단 (개선안 제시 단계)

| 어휘 | 카드 | 기존 모달 | 충돌 |
|------|------|----------|------|
| 배경 | paper 톤(warm/cool/mint) | 흰 canvas | 종이↔디지털 |
| 상단 | tape 26×6 ink-alpha (-2°) | ink-strip 12px solid black | 손맛↔사무용 |
| 그림자 | postit-lift (들린 종이) | shadow-modal (30/80 무거움) | 종이↔dialog |
| 모서리 | r-xs 4px | r-lg 10px | 어휘 부조화 |

핵심: 카드 = "벽에 붙인 종이", 모달 = "디지털 dialog". 같은 화면 공존 시 시각 이질감.

### 채택: 안 A — "큰 포스트잇"

모달을 그대로 큰 포스트잇으로. 클릭한 팀의 identity tint가 모달 배경 → "이 팀의 카드를 펴 본다" 메타포.

### 변경

| 영역 | 변경 |
|------|------|
| **tokens.css** | `--postit-shadow-modal` 신규 — postit-lift의 ~2배 깊이 (`0 8px 18px / 0 28px 56px` rgba(20,19,15,0.12+0.10)). 모달 표준 shadow-modal(30/80)보다 가벼움, 백드롭 dim과 함께 경계 충분 |
| **operator.jsx `RosterTeamDetailModal`** | (1) `useContext(MonoTintContext)` + `teamIdentityTint(team.name)` fallback → 모달 배경 tint. (2) `topStrip="ink"` → `null`. (3) ModalSurface `style` override: background=tint / borderRadius=`var(--r-xs)` / boxShadow=`var(--postit-shadow-modal)`. (4) tape 인라인 `<span>` 추가 — 80×10, top 8, -1.2° 회전, ink alpha 단색. position:absolute, zIndex:1, pointer-events:none. (5) "팀 상세" eyebrow 폐기 — tape이 시각 신호 대체. 헤더 top padding 20→30 (tape clearance). (6) 푸터 `background: var(--c-paper)` 제거 — 모달 tint와 충돌 |

### 디자인시스템 위반 항목 (사용자 명시 면제)

| 룰 | 어디서 | 사유 |
|----|--------|------|
| 모달 surface r-lg(10px) | borderRadius → r-xs(4px) | 카드 어휘 일치 우선 |
| 모달 surface shadow-modal | postit-shadow-modal | "들린 종이" 어휘 유지, 백드롭 dim이 깊이 보강 |
| 모달 topStrip 3변형(ink/caution/static) | null + 인라인 tape | tape이 포스트잇 정체성 신호 |
| 모달 surface bg canvas(흰) | paper-warm/cool/mint identity | "이 팀의 카드" 연속성 |
| §09e "인터랙션 모달 헤더 구분선 필수" | 유지 (borderBottom hairline) | 스크롤 본문 분리 신호 — 이건 어휘 충돌 없음 |

### 사용자 우려 해소

| 우려 | 해소 |
|------|------|
| 카드↔모달 어휘 단절 | ✅ 색·tape·shadow·radius 4가지 모두 카드 어휘로 정렬 |
| ink-strip 사무용 인상 | ✅ tape으로 교체 — 손맛 어휘 일관 |
| 모달이 화면 위에 "떠 있는" 디지털 인상 | ✅ postit-shadow-modal로 "들린 종이" 인상 |

### mono variant 자동 정합

§18-17 `MonoTintContext` Provider 안에서 RosterRow가 mono tint 받듯, 모달도 같은 context 소비 → mono 변형에서 모달도 paper-cool 단일 tint. **단 현재 B2RosterDetail은 mono variant 화면이 없음** — context provider가 modal wrapper에 없으므로 모달은 identity tint로 fallback. mono variant의 modal까지 원하면 별도 `B2RosterDetailMono` 필요.

### 반증 시나리오

- (a) **paper tint가 백드롭(어두운) 위에서 충분히 도드라지나**: paper-warm/cool/mint 모두 채도 ~12%·명도 ~95%. backdrop-strong(α 0.55) 위에서 명도 대비 충분. shadow-modal 무거운 그림자 없어도 백드롭+모달shadow로 경계 확립.
- (b) **tape이 헤더 영역과 시각 겹침**: tape top 8 + h:10 = y:8~18 영역. 헤더 top padding 30으로 30px 위치에서 텍스트 시작 → 12px 여유. OK.
- (c) **tape 회전 -1.2°가 정사각 모달 위에서 어색**: 카드 회전(±1.4°)보다 작음. 모달 본체는 0° 유지 — 본문 가독성 보존. tape만 손맛 회전.
- (d) **footer paper bg 제거로 멤버 행과 footer 시각 분리 약함**: borderTop hairline 유지하므로 경계 OK. 색 단일화가 더 자연.
- (e) **§09e 모달 표준 위반 — 디자인시스템 일관성 손실**: 사용자 명시 면제. 후속에서 §09e에 "포스트잇 모달 예외" 서브섹션 추가 검토.

### 검증

- [ ] viewer `b2-roster-detail` ⌘+Shift+R — 모달 배경이 `데이터 파이프라인 크루` 팀의 identity tint (warm/cool/mint 중 하나).
- [ ] 상단 tape 80×10 -1.2° 노출. ink-strip 미노출.
- [ ] borderRadius 4px (카드와 동일).
- [ ] shadow 가벼움(들린 종이 어휘).
- [ ] 헤더 "팀 상세" eyebrow 미노출. 팀명 + 카운트만.
- [ ] 본문 멤버 행·푸터 범례 정상 동작.
- [ ] `b2-tutorial-waiting` → 카드 클릭 → 모달 진입 시 시각 연속성 확인.
- [ ] 콘솔 0 에러.

### 후속

- (a) **mono variant 모달**: B2RosterDetailMono 신규 — DashboardShell·modal wrapper 모두 MonoTintContext Provider로 감싸기. 사용자 요청 시 작업.
- (b) **§09e "포스트잇 모달 예외" 섹션 추가**: 디자인시스템에 이 패턴을 박제할지 결정. 현재 RosterTeamDetailModal 한정이라 단발성 예외 처리도 가능.
- (c) **백드롭 자체도 포스트잇 어휘로?**: 현재 `var(--c-backdrop-strong)` (검은 0.55). 만약 "코르크 보드" 같은 어휘를 원하면 backdrop 색 변경 가능. 단 어휘 발산 우려.

---

## 18-20. 팀 포스트잇 색 정책 단순화 — 2색(다인팀 파랑 / 1인팀 초록) (2026-05-29)

> 사용자 결정: "포스트잇 파란색 단일로 가자. 여러 색깔 있는 화면 삭제하고 정책도 업데이트해. 단, 개인(1인팀)은 초록색으로 표기." + "카드별 모달은 포스트잇 색상을 따라가도록"

### 결정 — A/B 비교 후 단순화

§18-17 mono variant A/B 테스트 → mono 채택 + 1인팀 예외. §18-15 hash 3톤·§18-17 mono context 폐기.

**최종 정책**:
- 다인팀(members.length > 1 또는 !solo): `--c-paper-cool` 파랑
- 1인팀(team.solo === true 또는 members.length === 1): `--c-paper-mint` 초록
- 카드별 모달도 동일 매핑 (§18-19 큰 포스트잇 어휘 유지)

### 폐기·통합 항목

| 이전 결정 | 처리 |
|----------|------|
| §18-15 hash 3톤(warm/cool/mint) | **폐기** — 2색으로 단순화 |
| `TEAM_IDENTITY_TINTS` 배열 + hash 함수 | 삭제 — 단순 분기로 치환 |
| `teamIdentityTint(name)` 시그니처 | **변경** → `teamIdentityTint(team)` (full object) |
| §18-17 mono A/B variant 화면 2개 | **삭제** — `B2DashboardTutorialWaitingMono` · `B2DashboardTutorialRunningMono` 함수 / viewer SCREENS / Renewal artboard / window export 모두 제거 |
| `MonoTintContext` | 삭제 — A/B variant 폐기로 불필요 |
| `--c-paper-warm` 토큰 | **폐기** — 2색만 사용. tokens.css + Design System inline :root에서 제거 |

### 변경 파일

| 영역 | 변경 |
|------|------|
| **tokens.css** | `--c-paper-warm` 제거. Paper identity tier 코멘트 단순화 (3톤 → 2색 정책 명시) |
| **operator.jsx** | `teamIdentityTint(team)` 단순 분기: `isSolo ? mint : cool`. `TEAM_IDENTITY_TINTS` 배열 삭제. `MonoTintContext` createContext 삭제. `B2DashboardTutorialWaitingMono`·`B2DashboardTutorialRunningMono` 함수 삭제. window export에서 두 함수 제거. RosterRow·RosterTeamDetailModal에서 context 소비 코드 삭제 |
| **viewer.html** | SCREENS에서 `b2-tutorial-waiting-mono`·`b2-tutorial-running-mono` 항목 삭제 |
| **Jitda Renewal.html** | `b2-tutorial-waiting-mono`·`b2-tutorial-running-mono` DCArtboard 삭제 |
| **Jitda Design System.html** | (1) inline :root에서 `--c-paper-warm` 제거. (2) §02 PAPER IDENTITY TIER: 3-swatch → 2-swatch + 정책 본문 갱신 (팀 유형 2색 명시). (3) §02 ENTITY × COLOR POLICY 표: Team 행 어휘 갱신 (identity → team type). (4) §09f POST-IT CARD 미러 4-card 갱신: 다인팀 2(paper-cool) + 1인팀 2(paper-mint) 분포. 본문·props 표·DO/DON'T 갱신 |

### 결정 근거

- **시각 부하 ↓**: 30카드 그리드에서 2색만 분포 → 차분. 카운트 색(§18-18)이 상태 신호로 명확.
- **의미 강화**: 색이 단순 정체성 hash가 아닌 **팀 구성** 정보를 인코딩. "혼자 vs 팀" 즉시 식별.
- **단순화**: hash 함수·해시 일관성 룰·이전 §18-15 (a)~(e) 우려 모두 해소.
- **모달 일관**: 카드별 모달이 같은 색을 따라가므로 §18-19 "큰 포스트잇" 어휘 유지 + 색 연속성.

### 반증 시나리오

- (a) **다인팀이 너무 많아 30카드가 모두 파랑일 가능성**: PENDING_TEAMS 30팀 중 솔로 9팀 → 다인 21팀. 파랑 21장이 단조로울 수 있으나, 회전(±1.4° 4-variant)이 시각 다양성 제공. 실측 검증.
- (b) **1인팀 초록이 "mint=접속 OK" 어휘와 시각 혼동**: mint hue가 짓다에서 "성공/진행" 컨벤션. 1인팀=초록은 hue 충돌. 다만 paper-mint(채도 ~10%)와 c-mint(채도 진한 초록)는 명도 차이 크고, 카드 tint vs 점·텍스트 색 위치 분리로 인지 충돌 낮음.
- (c) **솔로 판정 모호 — `team.solo === true` vs `members.length === 1`**: OR 조건으로 둘 다 인정. PENDING_TEAMS는 `solo: true` 사용. 실 앱 데이터 컨벤션 정렬 필요.
- (d) **이전 §18-15 "팀명 hash" 약속 위반 — 같은 팀이 다른 행사에서 다른 색?**: §18-20 정책은 팀 구성(솔로/다인)에 의존. 같은 팀이 행사 간 솔로↔다인 전환 가능성 낮으므로 안정. 단 데이터 마이그레이션 시 검증.

### 검증

- [ ] viewer 드롭다운에 `b2-tutorial-waiting-mono`·`b2-tutorial-running-mono` 미노출.
- [ ] `b2-tutorial-waiting` 30카드 분포: 파랑 21장 + 초록 9장 (1인팀 9개).
- [ ] `b2-tutorial-running` Kanban 컬럼 안 카드: 동일 분포.
- [ ] `b2-roster-detail` 모달: "데이터 파이프라인 크루"(다인팀) → 파랑 모달.
- [ ] 솔로 팀 카드 클릭(실 앱) → 초록 모달 (viewer mock은 다인팀 고정).
- [ ] paper-warm 토큰 어느 파일에도 잔존 없음.
- [ ] 콘솔 0 에러.

### 후속

- (a) **paper-warm 토큰 완전 폐기 — 다른 곳에서 사용 안 함 확인**: 본 작업에서 grep 검증 완료. 정합.
- (b) **mint hue 충돌 실측**: 1인팀 초록 카드 옆에 mint 도트(접속 인디케이터) 노출 시 시각 혼동 7/13 전북 실측 검증.
- (c) **§18-15 spec 부분 철회 명시**: 본 §18-20이 hash 정책 대체 — 이전 spec은 history로 보존, 정책 시점만 명시.
- (d) **`team.solo` 필드 표준화**: 실 앱 API에서 `solo: boolean` 일관 보장 필요. 미존재 시 `members.length === 1` fallback 유지.

---

## 18-21. B-1 대기 상태 tint 강화 — wash → soft 한 단계 (2026-05-29 후속)

> 사용자 보고: "대기 상태 해커톤 카드 색깔이 배경이랑 너무 비슷한데?" — paper(#faf9f6) 위에서 두 waiting 카드가 식별 실패.

### 문제 진단

§18-13에서 도입한 5상태 wash 매핑 중 두 waiting tint가 paper 배경 대비 ΔE 너무 낮음:

| 상태 | 토큰 | hex | paper 대비 |
|------|------|-----|-----------|
| paper(배경) | `--c-paper` | #faf9f6 | — |
| tutorial_waiting (이전) | `--c-stone-wash` | #f1efea | R-9 / G-10 / B-12 (≈ΔE 3) |
| hackathon_waiting (이전) | `--c-helmet-wash` | #fbf6df | R+1 / G-3 / B-23 (≈ΔE 5, 노랑만) |

§18-13 (b) 반증 시나리오에서 이미 예측됐던 케이스("stone과 paper 톤 충돌 … 카드 윤곽이 약해질 수 있음 → post-it shadow가 보강"). 실제로 post-it shadow가 충분히 보강하지 못함 — 시각 검증으로 확인.

§18-13 매핑이 4색(running·ended)에서는 적절히 작동(mint/safety wash는 paper와 hue 거리 충분)하므로 **two waiting만 한 단계 올림**.

### 변경

| 상태 | 이전 | 변경 |
|------|------|------|
| tutorial_waiting | `--c-stone-wash` (#f1efea) | **`--c-stone` (#eeece7)** |
| hackathon_waiting | `--c-helmet-wash` (#fbf6df) | **`--c-helmet-soft` (#fff4c2)** |
| tutorial_running | — | `--c-tutorial-wash` 유지 |
| hackathon_running | — | `--c-mint-wash` 유지 |
| hackathon_ended | — | `--c-safety-wash` 유지 |

5상태 색 여정의 의미(cold/engaged/anticipation/live/sunset)는 그대로 — 채도만 강화. 신규 토큰 추가 없이 기존 디자인 시스템 토큰 재사용.

### 변경 파일

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `STATUS_POSTIT_TINT` 두 항목 토큰 교체 + 사유 주석 추가 (paper 대비 부족 → wash 보강 실패 → soft 채용) |

### 반증 시나리오

- (a) **helmet-soft가 너무 강해 hackathon_waiting이 시각적으로 hackathon_running보다 도드라짐**: helmet-soft 채도(#fff4c2)는 mint-wash(#eaf3ec)보다 명확히 높음. "곧 시작될 행사"가 "진행 중 행사"보다 강조되는 역전 가능. 단, hackathon_waiting은 짧은 transient 상태(보통 분 단위)라 빈도 낮음. 7/13 전북 실측 후 재검토.
- (b) **stone(#eeece7) vs stone-2(#e6e3dd) 사이 선택 적절성**: stone-2가 paper 대비 더 강하나, "차분한 대기" 정체성에는 stone이 적정. 사용자 식별 가능하면 stone 유지.
- (c) **wash 시스템 일관성 깨짐**: 5상태 중 2개만 wash가 아닌 soft/base. 의도적 비대칭(paper와의 거리 조절)이나, 향후 신규 phase 추가 시 "wash 통일 규칙" 부재로 결정 비용 발생 가능.
- (d) **B-2 같은 다른 화면에서 STATUS_POSTIT_TINT 재사용 시 영향**: §18-13 후속 (b)에서 재사용 가능성 언급됨. 다른 컨텍스트(어두운 배경, 큰 면적)에서는 강화된 tint가 과할 수 있음 — 재사용 시 별도 매핑 권장.

### 검증

- [ ] viewer `b1` 새로고침 — tutorial_waiting 카드(2026 봄 ENK)·hackathon_waiting 카드(KU x ENK)가 paper 위에서 명확히 분리.
- [ ] 다른 3개 카드(running·ended) tint 무변화.
- [ ] PhaseFilterStepper 칩(상단)은 별도 PHASE_STAGES 매핑 — 무영향 확인.
- [ ] hover lift·tape·shadow 동작 변화 없음.

### 후속

- (a) **5색 distinct 색맹 검증**: §18-13 후속 (c) 그대로 유효. 강화 후 deuteranopia/protanopia 모드 재확인.
- (b) **wash 시스템 문서화**: tokens.css `--c-stone-wash`·`--c-helmet-wash` 주석에 "paper 직접 인접 사용 시 식별 부족 가능 — STATUS_POSTIT_TINT는 stone/helmet-soft 사용" 워닝 추가 검토.
- (c) **anticipation 어휘 검증**: helmet-soft가 "곧 시작" 신호로 충분히 인지되는지 7/13 전북 실측.

---

## 18-22. §18-21 철회 + B-1 카드 하단 정보 통일 + KU 카피 정정 (2026-05-29 후속)

> 사용자 피드백: (1) "지금 튜토리얼 대기 색깔 넘 이상하다" — §18-21에서 도입한 `--c-stone`은 wash hue 패밀리에서 벗어나 이질감. (2) "해커톤 대기 노랑은 원래대로 복구시켜" — `--c-helmet-soft`(#fff4c2)는 노랑 채도가 과해 hackathon_running보다 도드라지는 위계 역전. (3) "카드별로 정보를 통일하여 간소화. 좌측 하단 총 팀수와 총 인원수로 모든 상태 통일." (4) "튜토리얼 건너뛰는 상태는 여기서 표기할 필요 없다. 본행사 시작 전 으로 작성."

### §18-21 전면 철회

| 상태 | §18-21 (철회) | 복구 (이전 §18-13 값) |
|------|--------------|---------------------|
| tutorial_waiting | `--c-stone` (#eeece7) | `--c-stone-wash` (#f1efea) |
| hackathon_waiting | `--c-helmet-soft` (#fff4c2) | `--c-helmet-wash` (#fbf6df) |

원본 문제(paper 대비 ΔE 부족)는 미해결 상태로 다시 노출됨. 사용자가 시각 이질감·위계 역전보다 paper 묻힘을 수용 가능한 트레이드오프로 판단. 시각 강화 대신 **카드 정보 구조 단순화**로 카드 식별 부하를 줄이는 방향으로 전환.

### 카드 하단 정보 통일

HackathonCard 좌측 하단 메타 — 이전: `isPending ? '총 N명' : '접속 X/Y'` 분기 → 변경: 전 상태 `N팀 · 총 X명` 통일.

| 상태 | 이전 | 변경 |
|------|------|------|
| tutorial_waiting | 8팀 · 총 240명 | 8팀 · 총 240명 |
| tutorial_running | 18팀 · 접속 184/196 | 18팀 · 총 196명 |
| hackathon_waiting | 30팀 · 총 180명 | 30팀 · 총 180명 |
| hackathon_running | 18팀 · 접속 116/122 | 18팀 · 총 122명 |
| hackathon_ended | 12팀 · 접속 156/156 | 12팀 · 총 156명 |

근거: B-1은 "운영 중 해커톤 전체 규모를 한눈에" 파악하는 화면. 실시간 접속률은 B-2 대시보드 진입 후의 task. B-1에서 두 패턴이 섞이면 카드 비교 시 인지 부하 증가.

### KU x ENK 카피 변경

`runtime: '튜토리얼 없이 시작 예정'` → `'본행사 시작 전'`

근거: "튜토리얼 건너뛰기" 운영 옵션은 B-2 진입 후 어드민이 결정·인지하는 정보. B-1 카드에서 노출하면 (a) 신규 운영자가 "왜 튜토리얼이 없는지" 추가 질문 유발, (b) hackathon_waiting 상태 자체가 "튜토리얼 종료 또는 미진행 후 본행사 직전" 의미를 이미 포함하므로 중복. `'본행사 시작 전'`이 두 진입 경로(튜토리얼 완료 후 + 튜토리얼 스킵)를 모두 포함하는 자연 표현.

### 변경 파일

| 영역 | 변경 |
|------|------|
| **operator.jsx** | (1) `STATUS_POSTIT_TINT` 두 항목 wash 복구 + 주석에 §18-21 철회 사유. (2) `HackathonCard`: `isPending` 변수 삭제 + 좌측 하단 `{teamCount}팀 · 총 {h.total}명` 통일. (3) hackathons mock `KU x ENK` runtime 카피 변경. `claimed` 필드는 mock에 남김(다른 영역 재사용 가능성). |

### 반증 시나리오

- (a) **paper 묻힘 재발**: 두 waiting 카드가 다시 ΔE 3~5 수준으로 paper에 묻힘. 사용자가 이를 수용하기로 결정했으나 신규 운영자 첫 인상에서 카드 식별 실패 위험 잔존. 7/13 전북 실측 시 재확인.
- (b) **접속 정보 손실**: tutorial_running·hackathon_running 카드에서 "184/196 접속" 정보 제거됨. 운영자가 진행 중 접속률을 B-1에서 인지하지 못함. 대안: 카드 hover popover 또는 B-2 진입 후 sticky 헤더에서만 노출. 현재 후자만 유지.
- (c) **"본행사 시작 전" 모호성**: 튜토리얼 완료 후 대기와 튜토리얼 스킵 대기를 같은 카피로 표현 → 운영자가 카드만 보고 진행 단계 구분 못 함. 단, B-2 진입 후 즉시 인지 가능하므로 B-1 시점에서는 무관.
- (d) **`claimed` 필드 잔존**: HackathonCard에서 미사용. 향후 코드 정리 시 정합성 검토 필요. 단 데이터 모델 자체는 rails API에서 유지될 수 있으므로 mock에서 즉시 제거하지 않음.

### 검증

- [ ] viewer `b1` 새로고침 — 두 waiting 카드가 stone-wash·helmet-wash로 복구.
- [ ] 6 카드 모두 좌측 하단이 `N팀 · 총 X명` 형식 (접속 X/Y 표기 0건).
- [ ] KU x ENK 카드 우측 상단 runtime이 `본행사 시작 전`.
- [ ] 콘솔 0 에러.

### 후속

- (a) **paper 묻힘 재고**: 향후 카드 식별 부하가 실측에서 문제로 확인되면 (i) paper 자체를 한 단계 어둡게(#f3f0e8 등), (ii) 카드 hairline border 추가(§18-13 "border 제거" 룰 일부 완화), (iii) post-it shadow 강도 증가, (iv) gridlines 약화 — 4안 비교 후 결정.
- (b) **접속률 노출 위치 재검토**: B-1 카드에서 접속률을 완전 제거했으므로, 운영자가 "지금 누구 못 들어왔지" 신호를 어디서 받는지 워크플로우 검증. B-2 sticky 헤더가 유일 노출처가 됨.
- (c) **§18-13 doc 정합**: §18-13 본문은 wash 5종 매핑 유지로 정합. §18-21·§18-22 history만 남김.

---

## 18-23. tutorial_waiting — paper 위 → canvas(#ffffff) 더 밝게 (2026-05-29 후속)

> 사용자 결정: "튜토리얼 대기 다른 색상 적용해줘. 차라리 더 밝은 색깔은 어때"

§18-22에서 stone-wash(#f1efea) 복구했으나 paper(#faf9f6) 대비 -3% 명도 = 묻힘 재발. paper보다 **어둡게** 가는 방향(§18-21 시도)과 **밝게** 가는 방향이 가능했고, 사용자가 후자를 선택.

### 변경

| 상태 | 이전 | 변경 |
|------|------|------|
| tutorial_waiting | `--c-stone-wash` (#f1efea, paper -3%) | **`--c-canvas` (#ffffff, paper +3%)** |

신규 토큰 추가 없음 — 디자인 시스템에 이미 정의된 가장 밝은 값(canvas).

### 5상태 어휘 변경 (cold → **blank**)

- 이전: cold(stone-wash) → engaged(tutorial-wash) → anticipation(helmet-wash) → live(mint-wash) → sunset(safety-wash)
- 변경: **blank**(canvas) → engaged → anticipation → live → sunset

"blank/fresh/아직 시작 안 함" 어휘가 흰 종이의 메타포와 맞물려 더 자연스러움. 운영자 시각에서 "백지 상태 → 채워지는 과정"으로 읽힘.

### 변경 파일

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `STATUS_POSTIT_TINT.tutorial_waiting` `--c-stone-wash` → `--c-canvas`. 주석 어휘 갱신(cold → blank). |

### 반증 시나리오

- (a) **canvas의 paper 대비도 ΔE ~3 수준**: stone-wash와 절댓값 차이는 비슷하나 **방향이 반대**(밝은 쪽). 인간 시각은 동일 ΔE라도 "밝은 쪽 차이"를 더 잘 감지(Helmholtz-Kohlrausch 효과)하므로 stone-wash보다 식별 유리 가능. 단 실측 필요.
- (b) **흰 카드가 너무 "비어 보임"**: 다른 4 카드는 tint가 있는데 tutorial_waiting만 흰색 — 5상태 색 여정에서 동떨어진 인상. 단 이는 "blank" 어휘 의도와 정합. 시각 위계상 "가장 시작 전" 신호로 활용 가능.
- (c) **하단 운영자 정보 박스(빈 상태) 흰 배경과 충돌**: `B1HackathonList` 빈 상태 박스가 `var(--c-canvas)` 사용 — tutorial_waiting 카드와 시각적으로 같은 배경. 다만 두 요소가 같은 화면에 동시 노출되는 경우 없음(빈 상태는 필터 0건 시만).
- (d) **post-it 메타포 약화**: 회전·tape 어휘 유지하나 흰 종이는 "포스트잇"보다 "백지 노트"에 가까움. 다른 4 카드와 메타포 일관성이 미세하게 깨질 수 있음.

### 검증

- [ ] viewer `b1` 새로고침 — tutorial_waiting 카드(2026 봄 ENK)가 paper 위에서 명확히 더 **밝게** 분리.
- [ ] 다른 4 카드 tint 무변화.
- [ ] post-it shadow·tape·rotation 동작 무변화.

### 후속

- (a) **paper 자체 조정 검토**: tutorial_waiting을 canvas로 두려면 paper가 약간 더 어두워야 분리감 강화 가능(예: #f7f4ec). 단 다른 모든 화면 영향 크므로 후속.
- (b) **빈 상태 박스 충돌 해소**: `B1HackathonList` 빈 상태 박스 배경을 `--c-paper`로 바꾸거나 hairline 강화 검토.
- (c) **5색 어휘 doc 갱신**: §18-13 본문의 "cold → engaged → anticipation → live → sunset" 색 여정 표를 "blank → engaged → anticipation → live → sunset"으로 정정 (후속 작업).

---

## 18-24. hackathon_waiting 칩 → helmet 노랑 (2026-05-29 후속)

> 사용자 결정: "해커톤 대기 칩에다가 노란색 넣자. 다른 카드들처럼 일관성있게." + "지금은 튜토리얼대기랑 해커톤대기랑 색깔이 똑같네."

§18-13에서 도입된 5상태 chip 색 시스템에서 `tutorial_waiting`·`hackathon_waiting` 두 칩이 동일한 회색(#ebebec/#2a2823)을 사용해 시각 구분이 안 됨. 또한 hackathon_waiting 카드 tint가 helmet-wash(노랑)인데 칩은 회색이라 카드↔칩 hue 불일치.

### 변경 — 두 위치 일괄

**PHASE_STAGES** (operator.jsx, B-1 PhaseFilterStepper + B-2 PhaseHover popover):
- `hackathon_waiting`: `bg #ebebec / fg #2a2823` → **`bg #fff4c2 / fg #6b4d00`**

**StatusPill CSS** (viewer.html + Renewal.html 인라인 `<style>`, HackathonCard 좌상단 pill + 운영자 화면 헤더 pill):
- `.jt-pill-hack-waiting`: `bg #ebebec / color #4a473e / border #d9d6cc` → **`bg #fff4c2 / color #6b4d00 / border #f1e07a`**

색 선정 근거:
- bg `#fff4c2` = `--c-helmet-soft` — 카드 helmet-wash(#fbf6df)와 같은 helmet 패밀리, 칩답게 한 단계 진한 soft 톤
- fg `#6b4d00` — deep amber, 다른 칩들의 "soft bg + deep 같은 hue fg" 패턴 일관(tutorial purple #2e2c8a, mint #096c4d, rose #882019). WCAG AAA(~8:1) on #fff4c2
- border `#f1e07a` — 다른 두 회색 칩이 hairline border 가지고 있어 일관성 유지, helmet 패밀리 중간톤

### 5상태 칩 매핑 (변경 후)

| 단계 | 상태 | 칩 bg | 칩 fg | hue |
|------|------|-------|-------|-----|
| 01 | tutorial_waiting  | #ebebec | #2a2823 | neutral grey |
| 02 | tutorial_running  | #e1e0fa | #2e2c8a | purple (tutorial) |
| 03 | hackathon_waiting | **#fff4c2** | **#6b4d00** | **helmet yellow** (anticipation) |
| 04 | hackathon_running | mint-soft | mint | mint green |
| 05 | hackathon_ended   | #ffe1de | #882019 | rose |

5단계가 모두 distinct hue로 분리. 칩 stepper 좌측부터 grey → purple → yellow → green → rose 순서의 색 여정.

### 카드 ↔ 칩 hue 정합

| 상태 | 카드 tint | 칩 hue | 정합 |
|------|----------|--------|------|
| tutorial_waiting | canvas(#fff) | grey (#ebebec) | 둘 다 "blank/neutral" — OK |
| tutorial_running | tutorial-wash | tutorial purple | ✓ |
| hackathon_waiting | helmet-wash | **helmet yellow** | ✓ (이번 변경으로 정합) |
| hackathon_running | mint-wash | mint | ✓ |
| hackathon_ended | safety-wash | rose | rose/safety 인접 hue — OK |

### 변경 파일

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `PHASE_STAGES.hackathon_waiting`: bg #fff4c2 / fg #6b4d00 |
| **viewer.html** 인라인 `<style>` | `.jt-pill-hack-waiting`: helmet 패밀리 3색 교체 |
| **Jitda Renewal.html** 인라인 `<style>` | 동일 |

### 반증 시나리오

- (a) **#6b4d00 deep amber 어휘 친숙도 부족**: 다른 칩들은 토큰화된 hue(--c-tutorial·--c-mint)를 쓰는데 helmet은 deep 토큰이 없어 raw hex(#6b4d00) 사용. 향후 `--c-amber-deep` 같은 토큰 정식 등록 검토.
- (b) **chip yellow가 hackathon_running mint와 인접해 진행 단계 위계 혼동**: 노랑→초록은 자연스러운 hue 진행이지만, "대기 → 진행" 단계가 색 강도 비슷해 어느 게 더 강조인지 모호. 단 stepper의 chevron(→)이 순서를 보강.
- (c) **tokens.css 단일 소스 룰 위반 잔존**: `.jt-pill-hack-waiting`은 여전히 viewer/Renewal 인라인에만 존재. tokens.css 마이그레이션은 후속.
- (d) **카드 tint helmet-wash + 칩 helmet-soft 톤차이 인지**: 카드는 wash(채도 ~10%), 칩은 soft(채도 ~25%). 같은 helmet 패밀리지만 강도 다름. 의도된 위계(칩=요약·강조 / 카드=면적 fill)이나 사용자 관점에서 "같은 노랑이 왜 다르지" 인지 가능성 — 디자인 시스템 §02 WASH/SOFT TIER 설명이 충분히 노출되는지 검토.

### 검증

- [ ] viewer `b1` 새로고침 — PhaseFilterStepper의 "03 해커톤 대기" 칩이 노랑.
- [ ] B-1 HackathonCard "KU x ENK 연합 해커톤" 좌상단 StatusPill이 노랑.
- [ ] tutorial_waiting 칩과 색이 명확히 다름(grey vs yellow).
- [ ] viewer `b2-hack-waiting` 헤더 StatusPill도 노랑(같은 jt-pill-hack-waiting 클래스 공유).
- [ ] PhaseHover popover에서 hackathon_waiting 단계도 노랑.

### 후속

- (a) **`.jt-pill-hack-waiting` tokens.css 이관**: 신규 인라인 정의가 tokens.css에 미존재. 점진적 마이그레이션. 동시에 `.jt-pill-tutorial-waiting`·`-tutorial-ended` legacy도 정리.
- (b) **helmet-deep amber 토큰 등록**: `#6b4d00` 같은 deep amber를 `--c-amber-deep` 또는 `--c-helmet-ink`로 토큰화. raw hex 제거.
- (c) **§18-13 색 여정 doc 정정**: §18-13 본문의 chip 매핑 표가 두 waiting을 같은 stone으로 명시 — §18-24로 변경됨을 반영(또는 history 노트 추가).

---

## 18-25. 팀 포스트잇 단일 노란색 + 전체 가나다순 + "개인 · " 접두사 제거 (2026-05-29)

> 사용자 결정 3단계: ① "개인 1인팀 팀명을 개인.진하경 말고 그냥 이름만" → 접두사 제거. ② "솔로팀이든 다인팀이든 상관없이 걍 가나다순으로" → 전체 정렬. ③ "개인팀이랑 다인팀 카드 색깔 다른거 좀 별로네. 전체 다 그냥 노란색으로 통일" → 단일 색 채택.

### 변경 요약

| 영역 | 변경 |
|------|------|
| **PENDING_TEAMS** | "개인 · NAME" → "NAME" 접두사 제거(9팀). 전체 32팀 가나다순(한글 → 영문 → 숫자) — 1인/다인 섞임 |
| **STARTED_TEAMS** | 동일 패턴, 30팀 가나다순 |
| **TEAM_PROJECTS map** | 키 가나다순 |
| **gallery.jsx TOP_LIKED** | "개인 · NAME" → "NAME" (likes 내림차순 보존, 정렬 변경 안 함) |
| **operator.jsx `teamIdentityTint`** | `team` 인자 무시 → 항상 `'var(--c-helmet-wash)'`. 솔로/다인 분기 폐기 |
| **tokens.css** | `--c-paper-cool`·`--c-paper-mint` 삭제. 코멘트 §18-25 명시 |
| **Jitda Design System.html** | inline :root에서 2 토큰 제거. §02 PAPER IDENTITY TIER 3→1 swatch + 정책 갱신 (단일 노란색). §02 ENTITY × COLOR POLICY Team 행 갱신. §09f POST-IT CARD 미러 4-card 모두 `--c-helmet-wash` + 본문·props·DO/DON'T 갱신 |

### 색 선택: `--c-helmet-wash` (#fbf6df)

- 디자인시스템 정식 토큰 (§02 WASH TIER)
- 클래식 포스트잇 노란색 어휘
- HackathonCard hackathon_waiting과 토큰 공유 — 다른 entity·다른 화면이라 충돌 없음
- WASH TIER 정책 부합

### 폐기·통합

| 이전 결정 | 처리 |
|---|---|
| §18-20 2색(파랑/초록) | **본 §18-25에서 폐기** — 단일 노란색 통일 |
| `--c-paper-cool/-mint` 토큰 | 삭제 (다른 곳 미사용 확인) |
| `teamIdentityTint(team)` 분기 | 단순화 — 인자 미사용 |

### 가나다 정렬 (한글 → 영문 → 숫자)

PENDING_TEAMS 32팀:
노유진 · 뉴럴 네트 · 데이터 파이프라인 크루 · 디버그 라이프 · 런타임 에러 · 레이스 컨디션 · 류재석 · 머지 컨플릭트 · 명도윤 · 바이브 코더 · 백서아 · 비트 플립 · 세그폴트 어택 · 손미래 · 스택 오버플로우 · 시맨틱 메모리 · 엔드투엔드 인터랙션 테스트 마스터즈 · 엣지 케이스 · 우시현 · 진하경 · 천도현 · 캐시 미스 · 커널 패닉 · 코드밍아웃 · 터미널 사파리 · 황태리 · 훅 라이프 · await me · JS의 비밀 · null pointer · undefined · 404 NOT FOUND.

### 사용자 우려 해소

| 우려 | 해소 |
|------|------|
| "개인 · 진하경" 등 접두사 노이즈 | ✅ 접두사 제거, 이름만 |
| 팀 데이터 순서 임의성 | ✅ 가나다순 |
| 솔로/다인팀 색 분리가 별로 | ✅ 단일 노란색 — 클래식 포스트잇 |

### 반증 시나리오

- (a) **단일 색이 단조 — §18-17 mono 우려 재발**: 회전 4-variant + tape이 시각 다양성 보강. 실측 후 평가.
- (b) **helmet-wash 공유 — HackathonCard와 시각 혼동**: B-1 vs B-2 동시 노출 안 됨. entity 다름 명문화로 후속 confusion 회피.
- (c) **솔로팀 시각 구분 손실**: 아바타 도트 1개로 시각 식별 가능. 별도 색 신호 불필요.
- (d) **가나다 정렬 vs task 적합성**: 검색 task에 유효. "미접속 팀" task는 필터 칩(§18-9)이 보완.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 32카드 모두 helmet-wash.
- [ ] 솔로 9팀 이름만(접두사 없음).
- [ ] 가나다 순서.
- [ ] `b2-tutorial-running` Kanban — 컬럼 내 가나다.
- [ ] `b2-roster-detail` 모달 — 단일 노란색.
- [ ] `--c-paper-cool/-mint` 잔존 0건.
- [ ] 콘솔 0 에러.

### 후속

- (a) 7/13 전북 실측에서 30카드 동일 색 식별성 검증.
- (b) 단조 시 회전 폭 ±1.4°→±2.0° 검토 (단 §10 "기울어진 결함" 위험).
- (c) 가나다 정렬 vs 운영자 task 우선순위 실측.

---

## 18-26. 신규 화면 — 흰색 / 초록 단일 tint A/B 변형 (2026-05-29)

> 사용자 결정: "노랑 단일처럼 흰색 단일이랑 초록 단일도 샘플 추가해줘"

### 의도

§18-25 단일 노란색(helmet-wash) 채택 후 비교 검증용. 흰색·초록 단일과 직접 좌·우 비교 가능하도록 신규 페이지 4개 추가 (기존 노랑 화면 보존).

### 변경 (Pattern C — 신규 화면 4)

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `MonoTintContext` React context 재도입(§18-17과 동일 패턴). `RosterRow` + `RosterTeamDetailModal` 양쪽에서 context 소비 — set 시 `teamIdentityTint()` (helmet-wash) 대신 context value 사용. 신규 함수 4종: `B2DashboardTutorialWaiting{White,Green}` + `B2DashboardTutorialRunning{White,Green}` — 각각 Provider로 감싸 `value="var(--c-canvas)"` 또는 `value="var(--c-mint-wash)"` 주입. window export 4종 추가 |
| **viewer.html SCREENS** | 4 항목 추가: `b2-tutorial-{waiting,running}-{white,green}` (h=920) |
| **Jitda Renewal.html** | 대응 DCArtboard 4 추가 |

### 색 선택

| 변형 | 토큰 | hex | 근거 |
|------|------|-----|------|
| **WHITE** | `--c-canvas` | #ffffff | 순백 — paper 어휘 제거, "벽이 곧 종이" 미니멀 |
| **GREEN** | `--c-mint-wash` | #eaf3ec | §02 WASH TIER 등록. mint-soft(#d6f1de)보다 ~60% 채도 낮음, 큰 면적 fill 안전 |

기준(노랑) `--c-helmet-wash` 와 같은 paper-wash tier — 공정한 A/B 비교.

### 비교 포인트 (viewer 직접 검증)

| 측면 | 노랑(helmet-wash) | 흰색(canvas) | 초록(mint-wash) |
|------|------------------|--------------|----------------|
| 어휘 | 클래식 포스트잇 | 미니멀 메모지 | 자연·평온 |
| 카운트 색 가독성 | safety orange 잘 보임 | safety orange 강하게 대비 | mint hue와 충돌(orange↔green) |
| paper(#faf9f6) 배경 분리 | 노랑 hue 명확 | 거의 동일 → 카드 식별 약함 | mint hue 분명 |
| 다른 화면(b2-hack-waiting 등) 어휘 | helmet 컨벤션 정합 | canvas는 모달 어휘와 혼동 | mint는 "성공/진행" 컨벤션과 의미 충돌 |

### 반증 시나리오

- (a) **흰색 단일이 paper 배경(#faf9f6)과 거의 동일** → 카드 윤곽 약함. shadow에만 의존하므로 시각 식별 task에 부정적.
- (b) **초록 단일이 mint(접속 OK) 어휘와 충돌**: paper-mint(채도 ~10%) vs c-mint(진초록)는 명도 차이 크나 hue 동일. 운영자가 카드 색을 "팀 접속 상태"로 오해 가능.
- (c) **3개 페이지 동시 노출 — 디자이너 confusion**: A/B 변형 페이지가 메인 페이지와 같은 viewer 드롭다운에 노출. label에 [WHITE]·[GREEN] 명시로 구분.

### viewer 진입

B-2 영역 드롭다운에서 좌·우 비교:
- `b2-tutorial-waiting` (노랑 메인) ↔ `b2-tutorial-waiting-white` ↔ `b2-tutorial-waiting-green`
- `b2-tutorial-running` 동일 3-way 비교

### 후속 결정 트리거

비교 후 사용자 판단:
- 노랑 유지 → A/B 페이지 정리 또는 보존
- white/green 채택 → §18-25 부분 철회 + 신규 색 정식화
- 혼합(다른 색) → 별도 결정

### 검증

- [ ] viewer 드롭다운 4 신규 페이지 노출.
- [ ] `b2-tutorial-waiting-white`: 모든 RosterRow가 `--c-canvas` (흰색).
- [ ] `b2-tutorial-waiting-green`: 모든 RosterRow가 `--c-mint-wash` (옅은 초록).
- [ ] `b2-tutorial-running-{white,green}`: Kanban 컬럼 안 RosterRow도 동일 변형 tint.
- [ ] 기존 `b2-tutorial-waiting` (노랑 메인)·기존 모달 동작 회귀 없음.
- [ ] 콘솔 0 에러.

---

## 18-27. 해커톤 종료 버튼 강화 — danger-outlined → danger filled (2026-05-29 후속)

> 사용자 보고: "튜토리얼 종료랑 해커톤 종료 버튼 색깔이랑 디자인이 좀 달라서. 다른 의미가 있는지? 해커톤 종료 버튼 잘 눈에 안 띔." + "통일 꼭 안 해도 되는데."

### 원래 설계 의도 (변경 전)

| 버튼 | 변형 | 의도 |
|------|------|------|
| 튜토리얼 종료 (`b2-tutorial-running`) | `jt-btn-primary` (검정 fill) | 일반 다음 단계 진행 — primary 강조 |
| 종료 (`b2-started`) | `jt-btn-danger-outlined` (옅은 주황 outline) | **비가역 — 실수 방지 위해 의도적으로 약하게** (operator.jsx:417 주석) |

### 원래 의도의 약점 (사용자 피드백으로 확인)

1. **자기 모순**: 코드 주석은 "종료(비가역)는 약하게"라 했으나 튜토리얼 종료도 비가역(5상태 단방향). 두 종료 모두 비가역인데 한쪽만 약화는 일관성 결여.
2. **안전망 중복**: 두 종료 모두 확인 모달(`b2-tutorial-end-confirm`/`b2-end`+`b2-end-countdown`)을 거침. 모달이 이미 실수 방지 역할 — 버튼까지 숨길 필요 약함.
3. **운영자 task 방해**: 종료 시점 운영자가 버튼을 찾지 못해 당황 가능. 1-action away의 종료 버튼은 명확히 보여야 함.

### 변경

`b2-started` 헤더 종료 버튼만 강화 (튜토리얼 종료는 유지 — "통일 꼭 안 해도" 결정).

| 위치 | 이전 | 변경 |
|------|------|------|
| `hackathon_running` statusActions | `jt-btn-danger-outlined` | **`jt-btn-danger`** (주황 fill + 흰 텍스트) |

색·어휘:
- 이전: `bg transparent / color safety / border safety-soft` — 옅은 윤곽
- 변경: `bg --c-safety (#ff6b1f) / color #fff / hover bg --c-safety-deep` — 솔리드 fill + elevation

### 결과 위계

| 상태 | 버튼 | 시각 위계 |
|------|------|----------|
| tutorial_waiting | [튜토리얼 시작] critical (검정 + helmet ring + shine) | **최강** — 단일 핵심 액션 |
| tutorial_running | [튜토리얼 종료] primary (검정 fill) | 강 — 일반 진행 |
| hackathon_waiting | [해커톤 시작] critical (검정 + helmet ring + shine) | **최강** — 단일 핵심 액션 |
| hackathon_running | [종료] **danger (주황 fill)** ← 변경 | 강 — 비가역 경고 색 |
| hackathon_ended | (없음) | — |

비가역 종료가 "주황 fill"로 명확한 어휘 획득(`--c-safety`). 시작 액션의 critical(검정 + 노랑)과 시각적으로 명확히 분리.

### 변경 파일

| 영역 | 변경 |
|------|------|
| **operator.jsx** | (1) `DashboardShell` `statusActions.hackathon_running` className `jt-btn-danger-outlined` → `jt-btn-danger`. (2) 주석 갱신(§18-25 → §18-27 사유 + "약하게 배치" 문구 제거). |

### 반증 시나리오

- (a) **운영자 의도치 않은 종료 클릭 증가 가능성**: 강조된 버튼이 호버·클릭 빈도 증가. 단 모달이 안전망. 7/13 전북 실측 시 종료 모달 도달률·취소율 측정 권장.
- (b) **`primary`(검정 튜토리얼 종료)와 `danger`(주황 해커톤 종료) 위계 비대칭**: 두 비가역 액션이 다른 색 → "왜 다를까" 인지 부하. 단 사용자가 "통일 꼭 안 해도"라 명시적 수용. 위계 차이는 "튜토리얼=가벼움/해커톤=무거움" 운영자 멘탈 모델과 정합.
- (c) **danger filled가 critical보다 약하지만 충분히 강조**: critical은 검정+노랑 ring으로 "최강", danger filled는 주황 fill로 "강". 두 위계 사이 시각 거리가 충분한지 — 실측 필요.
- (d) **튜토리얼 종료도 primary 외 위계 검토 여지**: 사용자가 통일 안 해도 된다 했으나, 일관성 측면에서 튜토리얼 종료도 일부 danger 어휘 차용 가능(예: 텍스트만 주황). 후속 검토.

### 검증

- [ ] viewer `b2-started` 새로고침 — 헤더 우측 [종료] 버튼이 주황 fill + 흰 텍스트 + shadow-sm.
- [ ] hover 시 safety-deep 배경 + shadow-md.
- [ ] `b2-tutorial-running` [튜토리얼 종료] 무변화(검정 primary 유지).
- [ ] 클릭 시 `b2-end` 모달 정상 진입.

### 후속

- (a) **튜토리얼 종료 위계 재검토**: 통일 결정은 사용자가 보류. 7/13 실측 후 두 종료의 의미·운영자 동작 빈도 비교하여 정렬 여부 결정.
- (b) **종료 모달 도달 후 이탈률 측정**: 강화된 버튼으로 모달 진입 증가 시 진짜 종료율 vs 취소율 비교. 실수 클릭 가설 검증.
- (c) **코드 주석 정정**: `operator.jsx:417` "약하게 배치" 표현 제거 완료. 향후 같은 패턴(약화 의도)이 다른 곳에 남아있는지 grep 검토.

---

## 18-28. 팀 포스트잇 최종 단일 흰색 + A/B 변형 페이지 삭제 (2026-05-29)

> 사용자 결정: "흰색으로 전부 통일해줘. 팀 카드는 무조건 흰색만 쓰도록 디자인시스템에도 반영하고" + "안쓰는 화면들은 삭제하고" + "[이미지: b2-roster-detail 모달이 아직 노랑] 이거 수정하고"

### 최종 정책

| 항목 | 값 |
|------|-----|
| 팀 카드 tint | `var(--c-canvas)` (#ffffff) 단일 |
| 카드별 모달 tint | 동일 — RosterTeamDetailModal도 흰색 |
| 적용 대상 | RosterRow + RosterTeamDetailModal 전부. 다인/1인팀·접속 상태 무관 |
| 윤곽 형성 | paper(#faf9f6) 배경 위에서 postit-shadow + tape이 카드 경계 형성 |

### 변경

| 영역 | 변경 |
|------|------|
| **operator.jsx** | `teamIdentityTint()` → `'var(--c-canvas)'`. `MonoTintContext` createContext 삭제. RosterRow·RosterTeamDetailModal에서 useContext 제거. A/B 변형 함수 4개 삭제(White/Green × Waiting/Running). window export에서 4종 제거 |
| **viewer.html SCREENS** | 4 항목 삭제 |
| **Jitda Renewal.html** | 4 DCArtboard 삭제 |
| **tokens.css** | Post-it 어휘 코멘트 갱신 — 단일 흰색 명시 + 5종 폐기 박제 |
| **Jitda Design System.html** | §02 PAPER IDENTITY TIER → 단일 흰색 + Canvas 1-swatch. §02 ENTITY × COLOR POLICY Team 행 갱신. §02 WASH TIER blurb 갱신. §09f POST-IT CARD 미러 4-card 모두 canvas + 본문·props·DO/DON'T 갱신 |

### 폐기 누적

| § | 이전 결정 | 처리 |
|---|----------|------|
| 18-15 | hash 3톤 | 이미 §18-20에서 폐기 |
| 18-17 | mono A/B | 이미 §18-20에서 폐기 |
| 18-20 | 2색 (파랑/초록) | 이미 §18-25에서 폐기 |
| 18-25 | 단일 노랑 (helmet-wash) | **본 §18-28에서 폐기** |
| 18-26 | white/green A/B 4 페이지 | **본 §18-28에서 폐기 + 페이지 자체 삭제** |

### 사용자 우려 해소

| 우려 | 해소 |
|------|------|
| "노랑 → 흰색 통일" | ✅ canvas (#ffffff) 단일 |
| "팀 카드는 무조건 흰색만 — 디자인시스템 반영" | ✅ §02 POST-IT TINT 단일 흰색 명문화 + §09f DO 룰 갱신 |
| "안쓰는 화면 삭제" | ✅ A/B 변형 4 페이지 JSX·viewer·Renewal 모두 정리 |
| "b2-roster-detail 모달이 아직 노랑" | ✅ 모달도 teamIdentityTint() 사용하므로 흰색 자동 적용 |

### 흰색 vs paper 분리

paper 배경(#faf9f6) 위 흰색(#ffffff) 카드 → 명도 차이 1.5%. 카드 식별은 shadow + tape이 담당.

| 신호 | 역할 |
|------|------|
| `--postit-shadow-rest` | "들린 종이" 어휘 — paper 위 카드 분리 |
| tape (ink alpha 단색) | 카드 상단 중앙 — 시각 단서 |
| 회전 ±1.4° 4-variant | 정적 그리드 단조감 보완 |

### 반증 시나리오

- (a) **흰색 vs paper 명도 차이 ↓ → 카드 윤곽 약함**: shadow만으로 충분한지 7/13 전북 실측. 부족 시 hairline border 추가 또는 shadow 강도 ↑.
- (b) **단일 색 단조감**: 회전 4-variant + tape이 시각 다양성 제공. 사용자 평가 후 결정.
- (c) **모달도 흰색**: §18-19 의도("카드를 펴 본다") 시각 연속성 강화. OK.

### 검증

- [ ] viewer `b2-tutorial-waiting` ⌘+Shift+R — 32카드 모두 흰색.
- [ ] `b2-roster-detail` 모달 흰색 (이미지 노랑 문제 해소).
- [ ] viewer 드롭다운에 white/green A/B 4 페이지 미노출.
- [ ] `MonoTintContext` 코드 잔존 0건.
- [ ] 콘솔 0 에러.

### 후속

- (a) **paper 배경 강화 검토**: 명도 차이 부족 시 `--c-paper` 약간 어둡게 조정. 단 전체 화면 영향.
- (b) **shadow 강도 보강**: 흰색 카드 윤곽이 약하면 `--postit-shadow-rest` 강화.
- (c) **HackathonCard 5상태 wash 유지**: 본 정책은 팀 카드 한정. HackathonCard는 status-driven wash(§18-13).

---

## 19. Paper Surface 도입 + C-1 v1 폐기 + v2 canonical 채택 (2026-05-29)

### 결정
양피지 질감 표면(§09g `.jt-paper-surface`) 도입. 모달·큰 카드·empty state에 사용. C-1 v1 (`C1TeamRoom` + `WaitingIllustration` 일러스트 + 좌측 일러스트 + 우측 흰 패널) 폐기. v2 (`C1TeamRoomV2`: 좌측 메시지 + 우측 paper 패널)를 canonical `c1`으로 채택.

### Paper Surface 사양 (`tokens.css` §618g)
- `.jt-paper-surface-wrap` (filter drop-shadow) > `.jt-paper-surface` (clip-path 종이 가장자리 + ::before 가장자리 fold + ::after 안쪽 도장 vignette).
- 폭 280px 이상 권장. 작은 카드·dense 리스트는 `.jt-postit-card` / `.jt-card`.
- ModalSurface와 결합: className으로 `jt-paper-surface` 추가 → borderRadius/shadow 자동 무효화.
- Interactive 변형: `.jt-paper-interactive` 추가 → hover lift(translateY(-3px) + 강한 shadow), active scale, focus-visible outline. postit과 동일 어휘.
- 배경 부착 어휘: 와시 테이프 2장 / 압정 1개 + 회전 — 디자인 시스템 §09g 데모 2종 제공.

### C-1 v1 폐기 — 변경 코드
| 파일 | 변경 |
|------|------|
| `participant.jsx` | `C1TeamRoom`·`C1RoomBefore/AfterTutorial/Ended`·`C1Waiting/Ended`·`ParticipantStatusBadge`·`WaitingIllustration` 함수 삭제. window export 정리(v2만 유지) |
| `participant.jsx` `TeamPostitV2` | `.jt-postit-card` → `.jt-paper-surface` 전환. 회전(`--postit-rot`·`heroPostitRotation`) 제거, tape 유지. 폭 360→440, 내부 padding 확대 |
| `operator.jsx` `RosterTeamDetailModal` | `className="jt-paper-surface"` 추가, 폭 380→440, padding 확대. 위치는 `top/bottom:60 flex` → `top:50% transform:translate(-50%,-50%) + maxHeight:calc(100% - 120px)`로 단순화 |
| `operator.jsx` `B1Empty` | inline 카드 → `jt-paper-surface-wrap > jt-paper-surface` 적용 |
| `viewer.html` SCREENS | `c1`·`c1-after-tutorial`·`c1-ended` 라벨 그대로 두고 render만 V2로 교체. `c1-long-name`·`c1-many-members` 유지 (V2 사용). `c1-ended-long-name`·`c1-ended-many-members`·`c1-v2`·`c1-after-tutorial-v2`·`c1-ended-v2`·`c1-v2-long-name`·`c1-v2-many-members` 제거. ACTIONS `c1-ended-v2 → c1-ended` 갱신 |
| `viewer.html` 필수 컴포넌트 체크 | `C1RoomBefore` → `C1RoomBeforeV2` |
| `Jitda Renewal.html` | v1 artboard 3종 (`c1`·`c1-after-tutorial`·`c1-ended`)을 V2 컴포넌트로 교체. v2 별도 artboard 3종 제거 |

### 기획문서 정렬
- `STRUCTURE.md` §2 화면 수 갱신 (54→49), §3 인덱스 표 C 영역 행 5개로 정리 (v1·v2 통합).
- 페이지정의서·화면상태정의서는 본 작업 범위 외 (UI만 변경, 정책 매트릭스 무변경) — 후속 검토 시 v1 일러스트 참조 제거 필요.

### 검증
- viewer `?id=b1-empty` paper surface 적용 + 가장자리 fold 가장자리에만 노출.
- viewer `?id=c1` `?id=c1-after-tutorial` `?id=c1-ended` V2 컴포넌트 렌더 + 우측 paper 팀 패널.
- viewer `?id=b2-roster-detail` paper 모달 중앙 정렬 + 폭 440 + padding 확대.
- 콘솔 0 에러. `window.C1RoomBefore` undefined 검증(v1 deletion 확인).

### 후속 검증 포인트
- (a) C-1에서 paper 가장자리 fold(우측 상단 highlight)가 우측 팀 패널 위치와 충돌하지 않는지 — 현 폭 440에서 OK이나 다인팀 7명 케이스 스크롤 발생 시 본문 영역 가독성 재확인 필요.
- (b) `.jt-paper-interactive` 적용 가능한 화면 식별 — 갤러리 카드·결과 카드 등 향후 후보. 현재 적용 0건 (opt-in modifier).
- (c) tape/pushpin 데코 어휘는 디자인 시스템 §09g 데모 한정. 실제 화면 적용 시점에서 reusable class(`.jt-paper-tape`·`.jt-paper-pushpin`) 승격 검토.
- (d) C-1 v1 폐기로 `WaitingIllustration` SVG 어휘(idle/tutorial/tutorialDone/go/ended) 영구 손실 — 향후 일러스트 필요 시 재사용 자산 0. 의도된 결과(좌측 일러스트 패턴이 V2 디자인에서 폐기됐으므로).

---

*검토자: 짓다 디자인 / 작성일: 2026-05-29 (§18 RosterRow 포스트잇 어휘 + §18-8 wash 톤 + §18-9 단일 토글 + §18-10 Switch primitive + §18-11 토글 작동·재정렬 애니 + §18-12 모달 peel 폐기 + 백드롭 settle 차단 + §18-13 HackathonCard 5상태 색 여정 + §18-14 단계 필터 작동 + §18-15 팀 identity 색 정책 (§18-20으로 단순화) + §18-16 미접속 chip 3-state (§18-18로 대체) + §18-17 mono tint A/B 변형 (§18-20으로 폐기·채택) + §18-18 카운트 색·weight 3-state + §18-19 모달 큰 포스트잇 리디자인 + §18-20 팀 유형 2색 정책 (§18-25로 단순화) + §18-21 B-1 대기 tint 강화 (§18-22에서 철회) + §18-22 §18-21 철회·카드 정보 통일·KU 카피 정정 + §18-23 tutorial_waiting canvas 전환 + §18-24 hackathon_waiting 칩 helmet 노랑 + §18-25 팀 포스트잇 단일 노란색 + 가나다순 (§18-28로 단순화) + §18-26 white/green A/B (§18-28에서 삭제) + §18-27 해커톤 종료 danger filled 강화 + §18-28 팀 포스트잇 최종 단일 흰색 + §19 Paper Surface 도입·C-1 v1 폐기·v2 canonical)*



---

## §20 폰트 토큰 단일화 — Pretendard 메인화 (2026-06-02)

**결정**: 메인 폰트 Pretendard 단일화. Wanted Sans · JetBrains Mono 제거.

- `--font-display`: Wanted Sans → **Pretendard Variable** (display=body 동일 폰트, 굵기·크기·자간으로 위계 구분)
- `--font-body`: 그대로 Pretendard Variable
- `--font-mono`: D2Coding 우선 + IBM Plex Mono 폴백. JetBrains Mono 제거.
- `--font-sans` (미정의·12 callsite) → `var(--font-body)`로 마이그레이션 후 토큰 제거.

**파일 변경**
- `tokens.css`: Wanted Sans `@import` 제거, 토큰 3종 갱신.
- `viewer.html`: Wanted Sans `<link>` 제거, 인라인 override 동기화, 뷰어 chrome 하드코딩 `'JetBrains Mono'` / `'Pretendard Variable'` → `var(--font-mono)` / `var(--font-body)` 교체 (10건).
- `Jitda Renewal.html`, `Jitda Design System.html`: 동일 정리 + Type 섹션·token 표·visible 라벨 문구 갱신.
- JSX 5개 파일(`shared`, `dialogs`, `gallery`, `participant`, `operator`): `'var(--font-sans)'` 12 callsite → `'var(--font-body)'` 교체.

**가시 영향**: display 800 굵기 헤드라인이 Wanted Sans → Pretendard로 바뀜. 둘 다 산세리프라 차이는 미세. mono 영역은 D2Coding이 우선 적용되어 한글·영문 등폭 일관성 향상.

**검증**: `grep`으로 `Wanted Sans`/`JetBrains`/`font-sans` 잔존 호출 0건 확인 (changelog 코멘트 제외).

---

## 2026-06-10 · C-1 대기실 LIVE 인디케이터 · 팀 변경 힌트 제거

**변경**: 참가자 팀 대기실(`C1TeamRoomV2`)에서 두 요소 제거 — 사용자 결정 ("라이브 버튼·팀 변경 불필요").
- meta row의 `ParticipantLiveStatus` (LIVE pulse) 제거 + 미사용 함수 본체 삭제 (`participant.jsx`).
- `TeamPostitV2` 푸터의 "팀 변경" info 힌트 제거 → 푸터는 `RosterLegend`만 잔존.

**범위**: 공용 컴포넌트라 C-1 전 화면(표준·긴 팀명·다인팀)·전 상태(roomBefore/AfterTutorial/Ended)에 일괄 반영. 로스터는 팀원 전체 표시 유지.

**검증**: `viewer.html?id=c1-many-members` 새로고침 — LIVE·팀 변경 미표시, 7명 전원 노출 확인. `grep "LIVE\|팀 변경\|ParticipantLiveStatus" participant.jsx` 0건.

---

## §25 F 영역 심사 전면 재설계 — placeholder 삭제 → 데이터 열람 중심 3 화면 (2026-06-10)

**트리거**: 사용자 "디자인에 f 영역 관련 페이지 디자인해봐. hifi로, 기존 심사위원 대시보드는 삭제." (패턴 C 신규 화면 + 기존 삭제)

**기획 근거**: `03-planning/product/2026-06-10_심사-평가-기능-기획.md`. 사용자 확정 방향 — (1) 범용 제품 기능, (2) 균형 하이브리드·과정 가중, (3) **채점은 사람 심사위원이 하고 플랫폼은 판단에 필요한 데이터를 한 화면에서 열람·반영하도록 지원**(자동 합산 점수 트랙 폐기, 동료평가·자동지표는 참고용).

**기존 문제**: `F1JudgeDashboard`는 전통 개발 해커톤 룰을 복사한 4축(창의성/완성도/실용성/프레젠테이션) 0–10 슬라이더 placeholder. 바이브코딩에서 결과물 완성도는 AI 모델 성능이 좌우 → "잘한 팀"이 아니라 "AI가 잘 뽑아준 팀"을 뽑게 됨. 플랫폼 고유 신호(프롬프트 히스토리·기여도)를 *심사위원이 어떻게 열람·반영하는가*에 대한 설계 부재.

**변경**:
- **`judge.jsx` 전면 재작성** (기존 407줄 삭제). 화면 3종:
  - `f1` 심사위원 대시보드(채점 중): 3분할 — 좌(심사 큐 + 내 분담 진행률 + 마감) / 중(라이브 앱 iframe + **보조 데이터 4탭: 과정 요약·기여도·산출물 소개·참고**) / 우(**과정 가중 5항목 루브릭** + 심사평 + 가중 합계). 데이터 열람과 점수 입력이 한 화면에 공존 = 설계 1원칙.
  - `f1-completed`: 동일 레이아웃 + 큐 전체 채점 완료 + 하단 mint 제출 바(심사 제출하기).
  - `f2` 결과 발표·시상: 포디움(🏆대상/🥈최우수/🥉우수, 대상=helmet 큰 기둥) + 특별상 4종 포스트잇(💬베스트 프롬프트·🤝베스트 협업·📈성장상·👏관객상) · 운영자 발표 모드.
- **루브릭 배점**(운영자 조정 가능 프리셋): 문제정의 20 / **과정·프롬프트 30(★)** / 결과물 25 / 협업 15 / 발표 10. 과정30>결과물25로 AI 성능 혼동 회피.
- **과정 요약 탭**: AI가 47개 프롬프트에서 핵심 분기(반복 개선·문제 해결·좋은 분해)를 추림 + "원본 프롬프트 전체(47)" always 한 클릭 + "요약 미심쩍으면 원본 확인, 점수 자동 반영 안 함" 배너(요약 환각 리스크 완화, 기획 §6).
- **참고 탭**: 동료평가 ★·반복 횟수·기여 균형을 "점수 미반영·참고용"으로 명시 + **"토큰 사용량은 평가 지표 아님"** 경고 배너.
- **신규 헬퍼**: `ProcessSummaryPanel`/`ContribPanel`/`IntroPanel`/`RefPanel`/`JudgeQueueItem`/`RubricRow`/`JudgeTab`/`JChip`/`F2AwardCeremony`/`PodiumCard`. `Object.assign(window, { F1JudgeDashboard, F2AwardCeremony })`.
- **와이어링**(viewer ACTIONS): `f1` 큐/탭/저장 self-loop, `f1-completed.submit → f2`, `f2.gallery → d1-ended`.
- **정합 갱신**: viewer.html SCREENS 3건 + ACTIONS, Renewal.html artboard 2건 + subtitle + nav "F (3)", STRUCTURE §2 표·§3 인덱스·§5 갭(2-1 해소)·§6 미검증 가정·변경이력·상단 총합 48→50.

**신규 토큰 0개** — 기존 어휘 재사용(`jt-postit-card`·`jt-btn-helmet`·`--c-mint-wash`·`--c-helmet-soft` 등).

**검증**: viewer `?id=f1`·`?id=f1-completed`·`?id=f2` 콘솔 0 에러(favicon 제외). 3분할·4탭·포디움·특별상 정상 렌더(스크린샷 확인). `grep F1JudgeDashboard viewer.html` validation required 배열에 잔존(컴포넌트명 유지).

**반증·후속(Critical Analysis)**: (a) 심사위원이 과정 요약을 실제로 보는가 — 안 보면 과정 가중 전제 붕괴, 실제 심사위원 인터뷰 필요. (b) AI 요약 정확도 — 왜곡 시 오심, 실데이터 사전 테스트 필요. (c) 심사위원 진입 인증 방식 TBD. (d) 페이지정의서·화면상태정의서 F 섹션은 기존 4축 스텁 그대로 → 정렬 필요. (e) c5-submit(산출물 제출, C영역)은 본 범위 제외 — 발표 데이터원으로 후속 신설.


---

## §26 심사 기능 3-역할 전 화면 확장 — 참여자·운영자·심사위원 (2026-06-10)

**트리거**: 사용자 "심사 관련된 모든 화면을 디자인. 심사위원·참여자·운영자로 나눠서 영역을 추가하고 작업해라." (패턴 C ×다수, 3 역할 횡단)

**접근**: 설계 워크플로우(3 역할 병렬 설계 + 적대적 통합/완결성 검토)로 인벤토리·와이어링·구현 순서 도출 후 메인에서 직렬 구현(공유 파일 충돌·렌더 검증). §25(F 재설계)의 f1/f1-completed/f2는 재구현 없이, 누락된 데이터원·설정·집계·결과 화면을 채움.

**영역 구조 결정**: 신규 심사 섹션을 따로 만들지 않고 **역할별 파일 컨벤션 유지** — 심사위원=judge.jsx(F), 참여자=participant.jsx(C), 운영자=operator.jsx(B). viewer/Renewal 각 역할 섹션 끝에 추가.

**신규 화면 9 (+ 보강 1)**:
- 참여자(participant.jsx): `c5-submit`·`c5-submitted`(C5SubmitIntro — 작품명·문제·핵심기능3·시연포인트, AI 초안 배지, helmet 제출. 발표/문제정의 데이터원), `c-result`·`c-result-private`(CParticipantResult — 점수(scorePublic 분기)·🏆수상·심사평 인용·갤러리 링크).
- 운영자(operator.jsx): `b3-rubric-settings`(B3RubricSettings — 프리셋·5행 항목(과정30★)·합계100·보조데이터 토글·토큰금지 배너), `b3-judge-management`/`b3-judge-assign`(B3JudgeManagement tab — 초대/배정현황 진행률), `b3-results-tally`(B3ResultsTally — 점수 행렬 "자동점수 아님" 명시·시상 확정·동률·점수공개 토글). 공통 JudgingShell/JudgingStepper(4단계)/ToggleCard.
- 심사위원(judge.jsx): `f1-rubric`(F1RubricConfig — 온보딩 읽기전용 루브릭 + "과정30>결과물25" 안내).
- 보강: b2-ended SummaryView 상단 JudgingEntryBanner(심사 진입 CTA).

**버그 수정**: §25 judge.jsx F2/IntroPanel의 `--rot`/`--tint` → `--postit-rot`/`--postit-tint`(jt-postit-card 참조 일치). 포스트잇 회전·tint 미적용 버그 수정(스크린샷으로 7카드 적용 확인).

**와이어링(viewer ACTIONS)**: c5-submit submit→c5-submitted / b2-ended start-rubric·start-judging→b3-rubric-settings / b3-rubric-settings save→b3-judge-management cancel→b2-ended / b3-judge-management tab↔b3-judge-assign start-judging→f1-rubric / b3-results-tally start-awards→f2 back→b3-judge-management / f1-rubric start→f1 / f1-completed submit→b3-results-tally / c-result open-gallery-*→d1-ended.

**정합**: viewer/Renewal SCREENS·artboard·nav, STRUCTURE §2(B 14→18·C 9→13·F 3→4)·§3 인덱스·총합 50→59·변경이력. 스크립트 cache-bust `?v=20260610judge2`.

**사고·복구(투명성)**: participant.jsx 1차 작성 시 Edit 도구가 한글을 리터럴 `\uXXXX`로 직렬화 → JSX 텍스트·속성 깨짐(JS 문자열은 babel이 해석해 정상이라 부분만 보임). 진단 중 Python open('w') truncate-then-error로 파일 0바이트 사고 → git HEAD 복원 → Python 직접 작성(Edit 우회)으로 실제 한글 재구현. operator/judge/문서는 이스케이프 0(영향 없음).

**검증**: viewer 9개 신규 화면 콘솔 0 에러. c5/c-result/b3-rubric/b3-tally/f1-rubric 스크린샷 실제 한글·디자인 토큰 정상. Renewal 72 아트보드 emptyCount 0.

**반증·후속**: (a) f1-completed submit→b3-results-tally는 데모상 역할 전환(실제는 별도 진입). (b) 자동배정·항목 추가/삭제는 시각만(Full에서 상태). (c) 페이지정의서·화면상태정의서에 B-3/C-5/C-결과 명세 미반영 → 후속 흡수. (d) 심사위원 인증 화면 미구현(초대 링크로 부분 대체).


---

## §27 심사 전 화면 단일 영역 분리 — judging.jsx 통합 + "F. 심사" 단일 섹션 (2026-06-10)

**트리거**: 사용자 "심사 관련 페이지들은 전부 별도 영역으로 나눠줘. 지금은 여기저기 섞여있어서 개발할 때 헷갈림."

**결정**: 역할별 파일에 흩어져 있던 심사 코드/화면을 (1) **단일 파일 judging.jsx**, (2) **viewer/Renewal 단일 "F. 심사" 섹션**으로 통합.

**변경**:
- 신규 `judging.jsx` — 심사 전 컴포넌트 통합: 심사위원(F1RubricConfig·F1JudgeDashboard·F2AwardCeremony + ProcessSummaryPanel/ContribPanel/IntroPanel/RefPanel/JudgeQueueItem/RubricRow/JudgeTab/PodiumCard + JUDGE_USER/RUBRIC/JUDGE_QUEUE/DRAFT_SCORE), 운영자(B3RubricSettings·B3JudgeManagement·B3ResultsTally + JudgingShell/JudgingEntryBanner/JudgingStepper/ToggleCard + RUBRIC_PRESETS/OP_RUBRIC/JUDGES/JUDGE_STATUS/TALLY), 참여자(C5SubmitIntro/SubmitField/CParticipantResult).
- `judge.jsx` 삭제. operator.jsx·participant.jsx에서 심사 블록 + Object.assign export 제거.
- operator SummaryView의 `<JudgingEntryBanner totalTeams=…/>`는 judging.jsx 전역 함수 참조로 유지 — babel 전역 스코프라 로드 순서 무관, 렌더 시점 해석. b2-ended 0 에러로 검증.
- viewer.html SCREENS: b3-*/c5-*/c-result-* 의 section을 모두 `F. 심사`로, 흐름순 재배치(참여자 제출 → 운영자 설정·배정 → 심사위원 채점 → 집계 → 발표 → 참여자 결과), 라벨에 [참여자]/[운영자]/[심사위원]/[발표] 태그.
- Renewal.html: judge DCSection 재구성("F. 심사 영역 (참여자·운영자·심사위원 통합)"), 12 아트보드 흐름순.
- 스크립트 judge.jsx→judging.jsx, cache-bust `?v=20260610judge3`(operator/participant도 갱신).
- 화면 ID는 b3/c5/c-result/f 접두 유지 — ACTIONS 와이어링 무변경, 안정성 우선.

**리뷰 반영(§26 워크플로우)**: ContribPanel 팀원명 `이서연`→`이서윤` 통일, B3JudgeManagement auto-assign 힌트 "· Full" 표기.

**검증**: viewer `?id=b2-ended`(JudgingEntryBanner 교차 참조 정상)·`f1`·`b1`·`c1` 콘솔 0 에러. 드롭다운 optgroup "F. 심사" 12개, B/C 섹션 심사 잔존 0. judging.jsx 전 컴포넌트 typeof function.

**후속**: 페이지정의서·화면상태정의서에 통합 구조 반영. 솔로팀 f1 변형·점수공개 분기 등 Full 항목 잔여.


---

## §28 마스코트 대기 애니메이션 배치 (마스코트-애니메이션-가이드 §4) (2026-06-12)

**트리거**: 마스코트(HOP·BLUEPRINT·DIG) 3종을 대기·생성·로딩 화면에 일괄 배치 — 빈 스피너/플레이스홀더를 브랜드 마스코트로 교체해 대기 시간 체감 완화.

**결정**: 마스코트-애니메이션-가이드 §4 권고 매핑을 그대로 적용. 마스코트 컴포넌트는 shared.jsx 전역 함수(`JitdaMascot`=HOP·`JitdaMascotBlueprint`=BLUEPRINT·`JitdaMascotDig`=DIG), reduced-motion 처리는 각 컴포넌트 내부 키프레임에 내장.

**배치 (5건)**:
1. **sending → DIG**: 신규 `OcPreviewGenerating` + `previewState='generating'` 분기 + 신규 화면 `c3-generating`(`C3PersonalCodingGenerating`) — 1인팀 캔버스 미리보기 패널에 DIG(곡괭이질) 마스코트로 "AI 생성 중" 표현.
2. **a1-not-started → HOP**: 기존 스피너를 HOP 마스코트로 대체.
3. **c1 · c1-after-tutorial → BLUEPRINT**: 좌측 메시지 영역에 BLUEPRINT(도면 보는 중) 마스코트 배치 (종료 상태 `c1-ended` 제외).
4. **c3-spawning → HOP**: 서버 기동 중 스피너를 HOP 마스코트로 대체.
5. **d2-loading → BLUEPRINT ↔ DIG**: 좌우 슬라이드 교대 스왑 (tokens.css `.jt-mascot-swap` 신규 키프레임).

**미배치 (가이드 권고)**: `c3-preview-empty`·`c5-submitted`·`f2` 는 마스코트 미배치 — 빈/완료/발표 화면은 마스코트가 컨텍스트와 충돌하거나 과함.

**정합**: viewer.html·Renewal.html SCREENS·artboard에 `c3-generating` 추가, 스크립트 cache-bust `?v=20260612mascot`(auth.jsx·participant.jsx·gallery.jsx·tokens.css). STRUCTURE §2 C 13→14·§3 인덱스·총합 59→60·변경이력 반영.

**후속 조정 (2026-06-12, 사용자 지시 — 위 §4 권고 매핑 override)**: 가이드 §6 권고대로 전면 적용 전 사용자 검토 결과 아래로 재배치.
- **대기실 마스코트 차별화**: 튜토리얼 대기 `c1`(roomBefore)=BLUEPRINT(도면 검토) 유지 · 해커톤 대기 `c1-after-tutorial`(roomAfterTutorial)=**DIG**(곡괭이질 — "튜토리얼 끝, 이제 짓는다"). `C1TeamRoomV2`에서 `state==='roomAfterTutorial'` 분기. (위 배치 3 override — 둘 다 BLUEPRINT → 상태별 차별)
- **미리보기 3상태 재배치**: `c3-preview-empty`(OcPreviewEmpty) 스켈레톤→**HOP**(친근한 빈 상태) · `c3-spawning`(OcPreviewSpawning) HOP→**BLUEPRINT**(준비·검토). → 진행 서사: 빈상태 HOP → 준비중 BLUEPRINT → 생성중 DIG. (위 배치 4 + 미배치 항목 override)
- **`a1-not-started` 비활성화**: "화면 자체가 필요 없음" → viewer.html SCREENS·Renewal.html artboard 주석 처리. `A1NotStarted` 함수는 auth.jsx에 보존(복원 시 주석 해제), 위 배치 2(a1 HOP)는 화면 비활성화로 무효. A 10→9·총 60→59.
- cache-bust: `participant.jsx ?v=20260612mascot2`. 검증: Playwright로 c1·c1-after-tutorial·c3-preview-empty·c3-spawning 재확인 + a1-not-started 부재 확인.
- **DIG 곡괭이 clip 버그 수정** (`shared.jsx JitdaMascotDig`): 내려찍는 순간(swing rotate(-108deg)) 곡괭이 머리가 구멍 림 아래로 튀어나오던 현상 수정. `jt-dig-swing`(회전 요소)을 **회전하지 않는 clip 래퍼**(`height: digHoleY + digHoleH/2`, `overflow:hidden`)로 감싸 지면 표면 아래는 잘려 "땅 속으로" 사라짐(가이드 §2.3 "곡괭이가 지면선 아래라 clip되어 보이지 않음" 의도 실제 구현). 모든 DIG 인스턴스(c1-after-tutorial·c3-generating·d2-loading) 일괄 적용. `shared.jsx ?v=20260612digclip` bump.

## §29 b2-ended 심사 진입 배너 분리 + 갤러리 호응 LIVE 칩 제거 (2026-06-12)

**트리거**: 사용자 지시 2건 — (1) "live 버튼 삭제", (2) "심사 단계 시작 배너 없는 버전을 기본으로 하고, 배너 있는 기존 화면은 심사 영역으로 이동".

**결정 1 — LIVE 칩 삭제**: 갤러리 호응 eyebrow의 `SummaryLiveLabel`(operator.jsx)에서 mint pulse 도트 + "LIVE" 워드(칩) 제거. "종료 후에도 누적 중" 안내 문구는 유지(사용자 선택: 칩만 삭제·문구 유지). 본문에 "갤러리는 종료 후에도 계속 운영됩니다…" 안내가 이미 있어 정보 손실 없음.

**결정 2 — 심사 배너 분리 (심사 기능 미개발)**: `JudgingEntryBanner`("심사 단계를 시작하세요" + 루브릭 설정/심사 시작 CTA)를 b2-ended 기본에서 제거. 사유: 심사 기능이 아직 개발 전이라 진입 배너 없는 깨끗한 종료 대시보드가 기본으로 필요. 배너 버전은 폐기하지 않고 F.심사 영역의 별도 화면으로 보존.

**구현**:
- operator.jsx: `SummaryView`·`DashboardShell`·`B2DashboardEnded`에 `judgingEntry` prop(기본 false) 추가. false면 `<JudgingEntryBanner>` 미렌더. `B2DashboardEnded`(b2-ended)는 기본값 false → 깨끗판.
- 신규 화면 `b2-ended-judging`(F.심사): `<B2DashboardEnded judgingEntry />` — 종료 대시보드 + 심사 시작 배너. 컴포넌트는 operator.jsx 재사용(judging.jsx 신규 정의 아님).
- viewer.html: SCREENS에 `b2-ended-judging`(section 'F. 심사', h 920) 추가. ACTIONS — `b2-ended`에서 `start-rubric`/`start-judging` 제거(갤러리·토큰 모달만), `b2-ended-judging`에 갤러리·토큰·`start-rubric`/`start-judging`→b3-rubric-settings 추가, `b3-rubric-settings` cancel → `b2-ended-judging`(왕복 정합).
- Renewal.html: F.심사 섹션에 `b2-ended-judging` artboard(1280×920) 추가.
- cache-bust: `operator.jsx ?v=20260612endclean`(viewer·Renewal 동시 bump).

**정합**: STRUCTURE §2(F 12→13)·§3 인덱스(b2-ended-judging 행)·§7 와이어링·헤더 총합 60→61·B운영자 note·변경이력 반영.

**검증**: Playwright — `?id=b2-ended`(배너 없음·LIVE 칩 없음·"종료 후에도 누적 중" 유지) 0 에러, `?id=b2-ended-judging`(배너 + 루브릭/심사 시작 CTA) 0 에러 렌더 확인.

**미검증/후속**: 심사 기능 개발 시 b2-ended(깨끗판)에서 b2-ended-judging(또는 심사 흐름)으로의 진입 경로를 다시 설계해야 함 — 현재는 F.심사 섹션 직접 진입만 존재(의도된 임시 상태).
- **칸반 컬럼별 페이지네이션** (`operator.jsx` B-2 ② 튜토리얼 진행·⑤ 해커톤 진행): 기존 전체 칸 합산 단일 페이지네이션 → **컬럼/zone별 독립 페이지네이션**으로 전환(`useColumnPaging` 훅). 한 컬럼만 perPage 초과면 그 컬럼 하단에만 노출(marginTop:auto로 바닥 정렬). 튜토리얼 칸반은 컬럼당 10팀, 활동 칸반은 손든·잠시 멈춤 zone 각 10팀(2col×5행).
- **AI 사용량 순위 zone 페이지네이션 제거**: 순위는 상위권만 의미 → `TOKEN_TOP_N=10` 고정 노출, 페이지네이션 없음(`TOKEN_PER_PAGE` 폐기).
- **활동 칸반 mock 증원** (`STARTED_TEAMS` 30→44팀): 손든 13팀·잠시 멈춤 15팀으로 늘려 두 zone 페이지네이션(각 2페이지) 시연. 토큰 zone은 상위 10만 노출이라 증원 팀 영향 없음.
- **페이지네이션 디자인시스템 정렬** (`KanbanPagination`): `jt-btn-ghost`+맨 span → DS `Pagination`(shared.jsx) 어휘인 `jt-btn-secondary` 버튼 + 박스형 mono 칩(canvas bg+hairline border)로 통일. 다른 화면 페이지네이션과 시각 일치(사용자 지적 반영).
- cache-bust: `operator.jsx ?v=20260612pagecol3`. 검증: Playwright로 b2-started(토큰 zone 무 페이지네이션·손든/잠시멈춤 각 1/2·독립 페이징 동작)·b2-tutorial-running(완료 컬럼만 페이지네이션·좁은 컬럼 fit) 확인.
- **B-2 ⑤ 활동 칸반 3 zone 카드 높이 통일** (`operator.jsx`): 손든 포스트잇(HandRaisedPostit)이 [해결] 버튼(22px) 때문에 토큰·잠시멈춤 카드보다 ~6px 높던 문제 수정. 세 카드(TokenTeamCard·HandRaisedPostit·AlertPostit) 모두 `height: 66`(border-box)로 고정 통일 + [해결] 버튼 22→18px·padding 0 9px로 축소해 66px 안에 안 잘리게 맞춤. 검증: 세 zone offsetHeight 전부 66, 클리핑 0.
- cache-bust: `operator.jsx ?v=20260612cardh`.

---

## μ+5. 반응형(데스크탑 유동) 대응 — Phase 0 하니스 키스톤 (2026-06-15)

**결정**(사용자 확정): 범위=**데스크탑 유동폭만(≥1024)**, 방식=**진짜 리플로우**(scale 아님), 산출물=**프로토타입 반응형화 + 화면상태정의서 부록 정식화 둘 다**. 전체 작업계획은 `RESPONSIVE-PLAN.md`(신규) 참조 — 7개 영역 라인레벨 감사 기반.

**근본 원인**: 모든 화면이 `viewer.html` art-frame의 고정 `width:1280 height:820/920`에 렌더 + `tokens.css` 뷰포트 미디어쿼리 0개. 창을 줄여도 reflow 불가 → 로컬호스트 반응형 확인 자체가 안 됨.

**Phase 0(완료·수정 반영)**: `viewer.html` art-frame을 데스크탑 유동폭으로 전환.
- CSS `.art-frame`: `width: clamp(min(1024px, var(--frame-max,1680px)), 100%, var(--frame-max,1680px))` + `flex-shrink:0` + `height: var(--frame-h)` + `container-type:inline-size; container-name:artframe`. → 1024(하한)~100%(창)~1680(ultrawide 캡) **연속 유동**. 넓은 모니터에서 1280 고정 안 되고 창 따라 늘어남.
- `#root` 신규 규칙: `flex:1 1 auto; min-width:0; display:flex; justify-content:center`. **(핵심 버그픽스)** 기존 #root는 shrink-to-fit(0폭)이라 art-frame `100%`가 0으로 붕괴→clamp가 1024 하한으로 고정됨. #root를 stage 전폭으로 채워 `%` 정상 해석.
- `render()`: `style={{width,height}}` → `style={{'--frame-max':(w>=1024?1680:w)+'px','--frame-h':h+'px'}}`(좁은 설계화면<1024는 설계폭으로 캡, 과확장 방지).
- 높이/aspect 내부 스크롤화는 회귀 방지 위해 영역별 후속(현재 설계높이 유지). `Renewal.html` DCArtboard(고정 캔버스)는 의도상 유지.
- 검증(Playwright 실측 frame width): win 1800→1680(캡)·1600→1545·1280→1225·1024→1024(하한). d1 auto-fill 5열(와이드)↔3열(좁게) reflow, 콘솔 0(favicon 제외).
- **수정 경위**: 1차 컷은 (a) 설계폭(1280)에 캡→넓은 모니터에서 "고정"으로 보임, (b) #root 0폭 붕괴 두 버그가 있었음. 사용자 "여전히 고정" 피드백으로 진단·수정. **브라우저 캐시 의심 시 하드 리프레시(⌘+Shift+R)**.
- cache-bust 불필요(viewer.html 자체 편집). _serve.py(no-store)로 검증.

**다음**: Phase 1(tokens 브레이크포인트·유틸) → Phase 2(shared ModalSurface 등) → Phase 3(A 인증 파일럿) → 영역별(D·E·F·C·B). 열린 질문: 칸반 좁은폭 전략(강등 vs 가로스크롤), 점수행렬 심사위원 N, 높이 적극성 — `RESPONSIVE-PLAN.md §열린 질문`.

### 진행 로그 (2026-06-15)
- **사용자 결정**: 높이=폭 우선·영역별 점진(키스톤 유지), 칸반 좁은폭=**zone 강등 reflow**(B 영역 b2-started·b2-tutorial-running 적용 예정 — sub-grid 2→1 + perPage 동적 재계산).
- **Phase 3 — A 인증(완료)**: `auth.jsx` `AuthShell` 좌 브랜드 레일 `minmax(360px,0.9fr) 1.1fr` → `clamp(360px,45%,560px) minmax(0,1fr)`(1280 외형 유지·1024 reflow). 우 `<section>` `align/justify center` → `flex-direction:column + overflow-y:auto`, 카드 wrapper `margin:auto 0`(세로 중앙 + 짧은 창 스크롤, a4 signup 클립 대비). 검증: a1 1440 무회귀·a4 1024 2-pane reflow·콘솔 0. cache-bust `auth.jsx?v=20260615resp`.
- **Phase 4 — D 갤러리(d2 핵심 완료)**: `gallery.jsx:595` 본문 2-pane `'1fr 400px'` → `'minmax(0,1fr) clamp(340px,30%,460px)'`. 우 정보 레일 유동-min(340~460), 라이브 패널 자유 축소. **d2 9개 상태 일괄**. ultrawide는 Phase 0 프레임 캡이 처리. d1 목록은 기존 auto-fill+프레임 캡으로 이미 reflow. 검증: d2 1024 레일 340 floor·라이브 패널 확장·콘솔 0. cache-bust `gallery.jsx?v=20260615resp`. (잔여 D: 툴바 제목 maxWidth:280 유동화, d1 gutter clamp — 후속.)
- **viewer 라이브 폭 readout 추가**: 툴바에 `↔ 창 N · 프레임 Npx · dpr×` 실시간 표시(resize 갱신) — 반응형 확인용. CSS px(논리) vs 물리 px(×dpr) 혼동 방지.
- **B 운영자 칸반 폭 불균등 픽스(사용자 지적)**: 프레임 유동화 후 좁은 폭에서 완료 컬럼만 안 줄고 넓게 남던 문제 — `repeat(5,1fr)`(=minmax(auto,1fr), 콘텐츠 최소폭에 걸림)을 **`repeat(5, minmax(0,1fr))`**로. TutorialKanban(`operator.jsx:961`)·ActivityKanban(`:1579`) 둘 다. 검증: 1024폭에서 5컬럼 전부 165~166px 균등. (zone 강등 reflow 본작업은 B 영역 별도.)
- **B 운영자 영역 데스크탑 검증·정리(체계적 1차)**: b1 목록 그리드 `repeat(3,1fr)`→`repeat(auto-fill, minmax(280px,1fr))`(검증 1680=5열·1024=3열 적응, RosterGrid 패턴 일치). b2-started(활동 칸반)·b2-ended(요약 2단+SVG)·b2-tutorial-running 1024폭 실측 검증 — minmax 픽스로 칸반 균등, b2-ended 2단/KPI/곡선/포디움 무파손(손댈 것 없음). 잔여 B 폴리시: 칸반 span-2 zone sub-grid 1열 강등(좁은폭), 요약 2단 narrow 스택 — 깨짐 아닌 밀도 폴리시라 후속. cache-bust `operator.jsx?v=20260615resp2`.
- **B 운영자 잔여 폴리시(Issue1 적용·Issue2 skip)**: 활동 칸반 span-2 zone(손든/잠시멈춤) 내부 sub-grid `repeat(cols,1fr)` → **`repeat(auto-fit, minmax(150px,1fr))`**(`operator.jsx:1845`). 카드 최소폭 150px 보장하며 zone 폭에 맞춰 자동 reflow — 실측 1024=2열(168px)·1680=3열(193px), 좁아도 뭉개짐 없음. cols prop은 pagination 행 계산 용도로 잔존(`perPage` 미변경, 카드는 페이지 내 reflow). DashboardShell sticky 헤더(`:535`)는 1024 실측 overflowX=0(가장 긴 tutorial_waiting 액션 클러스터 254px·플렉스 스페이서 309px 잔여)이라 **skip**(타이틀/액션 충돌·오버플로 없음). b2-ended 미변경. 검증: b2-started·b2-tutorial-waiting 1024 콘솔 0·무파손.

### 진행 로그 (2026-06-15 후반 — C/F/E 마감 + 동적 페이지네이션 + 12줄 기준)
- **C/F/E 병렬 reflow(워크플로) — ≥1024 실제 깨짐만 유동 CSS로**:
  - C(`participant.jsx`): C1 포스트잇 `width:440 flexShrink:0`→`width:100% maxWidth:440 flexShrink:1`(@~162) + 본문 grid `3fr 2fr`→`minmax(0,3fr) minmax(0,2fr)`(@~320) + wrapper `width:100% minWidth:0`(@~392). OpenCodeShell은 1024서 프리뷰 ~558px(>360 floor)라 안 깨짐→skip(드래그 상태 보존).
  - F(`judging.jsx`): F1JudgeDashboard 좌/우 레일 `0 0 256/376px`→`0 1 …+minWidth 200/300`(@90/@179)로 중앙 라이브앱 1024서 ~480px+ 확보. B3RubricSettings `300px 1fr 280px`→`minmax(220,300) minmax(0,1fr) minmax(220,280)`(@664). F2 특별상 `repeat(4,1fr)`→`repeat(auto-fit,minmax(150px,1fr))`(@474).
  - E(`dialogs.jsx`): 데스크탑(프레임≥1024·높이820)서 모달·e4 ring 모두 fit → 방어적 `maxWidth:calc(100vw-48px)`만(e1/e1-unsaved/e5). e4 ring 반응형은 deferred.
  - D(`gallery.jsx`): d2 제목 `maxWidth:280→min(280px,30cqw)`, d1 패딩 40→`clamp(20px,4vw,48px)`.
  - 검증(단일 브라우저 Playwright 17화면@1024): 전부 렌더 정상·콘솔 0·art-frame 오버플로 0. c1/f1 시각 스팟체크 통과.
- **동적 페이지네이션(사용자 요구)**: 신규 훅 `useGridColumns(ref,minCardPx,gapPx)`(ResizeObserver로 그리드 실제 열 수 측정). `ActivityKanbanZone`(손든/정체)에서 **perPage = 측정열 × ROWS_PER_PAGE** 동적 산정 — 폭↑→열↑→perPage↑→항상 꽉 찬 행. 실측: 1024=2열, 1680=3열.
- **12줄 기준 + 사용량순위 12개(사용자 요청)**: `ROWS_PER_PAGE 10→12`(`operator.jsx:1564`) → 동적 perPage=열×12(3열=36)로 3열서도 꽉 차게. `TOKEN_TOP_N 10→12`(`:1565`) → AI 사용량 순위 12개 노출. 실측 1680: 손든 26·정체 28 전부 1페이지·토큰 12행, 3 zone 높이 균형. cache-bust `operator.jsx?v=20260615finish3`.
- **동적 페이지네이션 잠재 케이스(미적용·문서화)**: RosterGrid(perPage 60, mock 30~32팀≤60)는 페이지네이션 비활성+정적이라 현재 불일치 없음(auto-fill로 이미 reflow). 중앙 DashboardShell 페이지네이션 리팩터 비용>효익이라 미적용 — 팀수>60 시 동일 `useGridColumns` 패턴 적용 필요. 갤러리 d1 페이지네이션도 정적 목업.
- **⚠ 범위 외 발견(반응형 무관·플래그)**: e5 AI 투표 모달 헤더 모델명 'CLAUDE HAIKU 4.5' 노출 — '모델명 절대 노출 금지' 룰 위반. 미수정(별도 카피 작업 필요).
- cache-bust 전체: viewer.html·Renewal.html에서 operator/participant/gallery/dialogs/judging `?v=20260615finish*`, auth `resp`로 갱신. 신규 산출물 `RESPONSIVE-PLAN.md`(전체 계획).

### 진행 로그 (2026-06-15 마감 — e5 삭제 + 12행 채우기)
- **e5(E-5 AI 선택지 투표) 화면 삭제(사용자 지시)** — 모델명 'CLAUDE HAIKU 4.5' 노출 이슈 화면. `dialogs.jsx` `E5AIChoiceVote` 함수(161줄)·Object.assign export·파일 헤더 주석 제거, `CanvasContextHeader` 주석 'E-4/E-5 공용'→'E-4 전용'. `viewer.html` SCREENS 항목·`Jitda Renewal.html` DCArtboard 제거. `STRUCTURE.md` §3 인덱스 행·§4 와이어링 제거 + §2 E 카운트 10→9. 검증: viewer 드롭다운 e5 미노출(hasE5=false)·총 80→79화면·e1/e4 콘솔 0(dialogs.jsx 정상 컴파일)·전역 e5 참조 0.
- **활동 zone 12행 채우기(사용자 요청 "3열일 때도 꽉 차게")** — `STARTED_TEAMS`에 18팀 증원(손든 +10→36, 잠시멈춤 +8→36). 동적 perPage=열×12라 3열에서 36개=12행 꽉 참. 카운트는 전부 계산값(`raised`/`alerts`/`normalCount` 필터)이라 자동 갱신 — 실측 1680/3열: 손든 36·정체 36·토큰 12, 헤더 '48/88 순항'(정상48·주의25·위험11·불참4). 신규 팀명 2건(패리티 비트·페이지 폴트) 기존 중복 → 패리티 체크·페이지 스왑으로 리네임(React key 중복 해소). 검증 콘솔 0. cache-bust `operator.jsx?v=20260615final`·`dialogs.jsx?v=20260615final`.
