# 짓다 마스코트 — 로딩/대기/빈 상태 적용 후보

> 헬멧 캐릭터(`JitdaIcon`) 기반 CSS 마스코트를 로딩·대기·빈 상태 화면에 배치하기 위한 검토 문서.
> 전체 화면(`viewer.html` SCREENS, `*.jsx`) 검토 결과 · 최초 작성 2026-06-10.

---

## 1. 만들어 둔 마스코트

| 이름 | 컴포넌트 | 위치 | 톤 | 상태 |
|------|----------|------|----|------|
| **HOP** (통통 튀기) | `JitdaMascot({ size, mono })` | `shared.jsx` | 대기/짓는 중 — 느긋 | ✅ 완성 |
| **BLUEPRINT** (도면 보기) | `JitdaMascotBlueprint({ size, mono })` | `shared.jsx` | 검토/읽는 중 — 차분 | ✅ 완성 (정적 V접힘, 머리 도리도리) |
| ~~PICKAXE (곡괭이질)~~ | `JitdaMascotPickaxe` | `shared.jsx` | 적극 작업 | ⛔ 보류 (구도 미완) |

- 키프레임: `tokens.css`의 `jt-mascot-*`(hop) · `jt-bp-*`(blueprint) · `jt-pick-*`(pickaxe, 보류)
- 쇼케이스: `viewer.html` → 화면 **`z-mascot`** (Z. 데모)
- 사이즈 무관 동일 비율(모든 px값 size 비례). `mono` prop으로 어두운 배경 대응.
- `prefers-reduced-motion` 대응 완료.

---

## 2. 적용 후보 화면 (적합도순)

### 🥇 Tier 1 — 거의 완벽 (풀스크린 대기·로딩, 가운데 빈 공간)

| 화면 ID | 컴포넌트 (파일) | 현재 로딩 UI | 적합 이유 | 추천 마스코트 |
|---------|----------------|--------------|-----------|---------------|
| `c3-preview-empty` | `OcPreviewEmpty` (participant.jsx) | 5블록 펄스 + "아직 미리보기가 준비되지 않았습니다" | 밋밋한 블록 자리 직행 | HOP / BLUEPRINT |
| `c3-spawning` | `OcPreviewSpawning` (participant.jsx) | 스피너 + "작업 환경을 준비하고 있어요" | 가운데 큰 빈 영역, "짓는 중" 카피와 매치 | HOP |
| `c1` | `C1RoomBeforeV2` (participant.jsx) | 정적 대기실 — "화면만 켜두면 자동으로 시작돼요 / 시작을 기다리는 중" | 참가자 수동 대기 시간 → focal point. **최고 후보** | HOP |
| `c1-after-tutorial` | `C1RoomAfterTutorialV2` (participant.jsx) | "해커톤이 곧 시작됩니다 / 해커톤 시작을 기다리는 중" | 위와 동일 (대기실 ②) | HOP |
| `d2-loading` | `PreviewLoading` (gallery.jsx) | 64px 박스 BouncingDots + "앱을 불러오고 있어요 · BOOT 00:08 · 최대 00:30" | 최대 30초 대기 → 지루함 완화 효과 큼 | HOP / BLUEPRINT |

### 🥈 Tier 2 — 좋음 (스켈레톤·인증 로딩)

| 화면 ID | 컴포넌트 (파일) | 현재 | 비고 |
|---------|----------------|------|------|
| `d1-loading` | `D1GalleryLoading` (gallery.jsx) | 인라인 BouncingDots + "작품을 불러오는 중이에요" + 스켈레톤 그리드 | 인라인 점이 작음 → 스켈레톤 위/헤더 옆 **소형 마스코트** |
| `a3` | `A3OAuthCallback` (auth.jsx) | 원형 스피너 + "로그인하는 중이에요" | AuthShell 우측 카드. 가능하나 운영자 인증 톤 약간 다름 |

### 🥉 Tier 3 — 가능하나 신중

| 화면 ID | 컴포넌트 (파일) | 비고 |
|---------|----------------|------|
| `d1-empty` | `D1GalleryEmpty` (gallery.jsx) | "아직 공개된 작품이 없어요" — 이미 포스트잇+갤러리 아이콘 정체성. 아이콘 자리에 **소형 마스코트** 대체 가능 |
| `c4` (팀 캔버스) | `OcPreviewEmpty/Spawning` 공유 | **c3와 같은 컴포넌트** → c3 고치면 자동 반영 (공짜) |
| ~~`a3-failed`~~ | `A3OAuthFailed` (auth.jsx) | ❌ **제외** — 인증 실패/슬픈 톤에 통통 튀는 마스코트 부적합 |

---

## 3. 핵심 인사이트

1. **공유 컴포넌트 레버리지** — `OcPreviewEmpty` / `OcPreviewSpawning`은 `c3`(1인팀)과 `c4`(팀)가 공유.
   한 번 고치면 4개 화면(c3/c4 × empty/spawning)이 동시 반영 → ROI 최고. **여기부터 시작 권장.**

2. **마스코트 톤 매칭**
   - 대기(c1) → HOP "느긋한 호핑" 적합
   - 로딩/빌드(c3·d2) → HOP "작업 중 호핑" 또는 BLUEPRINT "검토 중" — "짓는 중/불러오는 중" 카피와 매치
   - **에러(a3-failed)는 금지** — 움직임 톤 충돌

---

## 4. 추천 실행 순서

1. **`c3-preview-empty` + `c3-spawning`** (공유 컴포넌트 → c4까지 4화면 커버, 검증 쉬움)
2. **`c1` / `c1-after-tutorial`** 대기실 (수동 대기 → focal point 효과 큼)
3. **`d2-loading`** (30초 대기 지루함 완화)
4. 이후 Tier 2/3 선택 적용

---

## 변경 이력

- 2026-06-10: 최초 작성. 전체 화면 검토 후 Tier 1~3 후보 정리. 마스코트 HOP·BLUEPRINT 완성, PICKAXE 보류.
