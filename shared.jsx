/* Shared artboard primitives — phone & desktop frames, brand mark, status pills, etc.
   Exported to window so other Babel scripts can use them.            */

// ── Brand mark ─────────────────────────────────────────────────────
function JitdaLogo({ size = 36 }) {
  // Hard hat (helmet token) over a thick handlebar mustache (stache token).
  // 색상은 디자인 시스템 토큰(--c-helmet/--c-helmet-deep/--c-stache)을 따른다.
  // viewBox 48 x 40 — designed to read crisply down to ~20px.
  const helmet = 'var(--c-helmet)';
  const helmetDeep = 'var(--c-helmet-deep)';
  const stache = 'var(--c-stache)';
  return (
    <svg width={size} height={size * 40 / 48} viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg">
      {/* helmet dome */}
      <path d="M 6 22 C 6 11 13 5 24 5 C 35 5 42 11 42 22 L 42 24 L 6 24 Z"
            style={{ fill: helmet, stroke: stache }} strokeWidth="2" strokeLinejoin="round" />
      {/* helmet ridge / crest */}
      <path d="M 24 5 L 24 24" style={{ stroke: stache }} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="14" rx="3" ry="1.4" style={{ fill: stache }} opacity="0.0" />
      {/* dome shadow band */}
      <path d="M 8 22 L 40 22 L 40 24 L 8 24 Z" style={{ fill: helmetDeep }} />
      {/* brim */}
      <path d="M 3 24 L 45 24 Q 47 24 47 26 L 47 28 Q 47 30 45 30 L 3 30 Q 1 30 1 28 L 1 26 Q 1 24 3 24 Z"
            style={{ fill: helmet, stroke: stache }} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 4 28 L 44 28" style={{ stroke: helmetDeep }} strokeWidth="1.4" />
      {/* mustache — handlebar */}
      <path d="M 8 36
               C 11 33 14 33 17 34
               C 20 35 22 36 24 36
               C 26 36 28 35 31 34
               C 34 33 37 33 40 36
               C 37 38 34 38 31 37
               C 28 37 26 37 24 37
               C 22 37 20 37 17 37
               C 14 38 11 38 8 36 Z"
            style={{ fill: stache }} />
    </svg>
  );
}

// 캐릭터 입모양(표정) 베리에이션 — logo/jitda_logo-{12,13,16,17}.svg에서 캐릭터만 추출.
// 영문 "Jitda" 워드마크 path는 제외하고, 입(표정) path만 변형으로 보존. 색은 ink(눈과 동일)로 통일.
// 2026-06-11 사용자 결정: 플랫폼 정본 로고 = v16 (활짝 웃는 물결형). JitdaIcon 기본값이 v16.
// base = 원본 jitda_logo.svg의 열린 'ㅅ' 입 (legacy — 비교용으로만 보존, 명시적 variant="base" 필요).
const JITDA_MOUTHS = {
  // base(legacy) — 원본 열린 'ㅅ' 입
  base: ['M123.33,205.18c-1.15-1.53-2.93-2.41-4.84-2.41h-7.94c-1.91,0-3.69.88-4.84,2.41-5.24,6.95-20.94,27.08-33.19,35.44-1.65,1.13-.91,3.69,1.09,3.69h20.6l20.31-22.73,20.31,22.73h20.6c2,0,2.74-2.56,1.09-3.69-12.24-8.36-27.95-28.49-33.18-35.44Z'],
  // logo-12 — 콧수염형 잔잔한 미소 (ring 따라가는 곡선)
  v12: ['M132.85,212.35c-4.78-4.25-10.21-7.28-16.34-9.14-.43-.13-.88-.19-1.31-.27-.55-.07-1.05-.04-1.37,0-.43.08-.86.13-1.28.26-6.13,1.86-11.56,4.89-16.34,9.15-19.23,17.09-31.2,18.28-38.89,17.71,18.17,7.97,45.14.65,57.22-12.91,12.08,13.56,39.05,20.88,57.21,12.91-7.69.57-19.66-.61-38.89-17.71Z'],
  // logo-13 — 입술형(아랫입술 강조) 미소
  v13: ['M144.81,243.31c-11.43-2.22-22.23-6.08-30.25-15-8.03,8.98-19.06,12.85-30.51,15.03-1.49.48-3.5.1-4.03-1.48l-3.17-9.43c-.36-1.08-.3-1.95.21-2.87s1.41-1.34,2.58-1.59c9.93-2.17,25.3-6.3,26-17.52.12-1.89,1.7-2.98,3.45-2.98l11.34-.02c1.17,0,2.82,1.06,2.88,2.3.18,3.26,1.32,6.01,3.58,8.35,5.32,5.49,15.4,8.28,23.07,9.99,1.6.36,2.95,1.88,2.38,3.67l-3.15,9.92c-.56,1.77-2.77,2.25-4.37,1.64Z'],
  // logo-16 — 활짝 웃는 물결형 입
  v16: ['M114.61,227.45c-9.29,9.46-23.42,14.39-36.08,10.36-4.23-1.35-7.82-3.7-10.38-7.24-.17-.24-.14-.66-.11-.83.05-.25.4-.52.85-.5,5.94.2,11.56-1,16.98-3.43s10.08-5.53,14.08-9.75l4.23-4.47c.96-1.01,1.8-2.4,3.41-2.41l13.24-.09c1.91-.01,2.91.89,4,2.23,8.92,10.9,21.48,18.45,35.83,17.96.58-.02.34,1.2.1,1.5-2.58,3.36-6.01,5.59-10.02,6.97-12.51,4.09-26.93-.8-36.13-10.29Z'],
  // logo-17 — 혀(디테일) 보이는 미소 (입 + 혀 2 path)
  v17: ['M147.52,232.5c-11.24,1.55-24.54-1.63-32.95-9.66-1.45,1.53-2.92,2.68-4.71,3.78-8.49,5.24-18.58,7.27-28.49,5.88-2.03-.28-3.81-.85-5.59-1.69-2.15-1.01-4.52-3.23-4.01-4.54.2-.5.65-.88,1.3-.96,7.43-.9,14.39-3.29,20.81-7.15l7.52-5.16c1.88-1.29,3.75-2.67,6.2-2.62,2.68.06,5.11,1.34,6.97,3.3,3.6-3.29,7.61-4.52,11.68-1.8l8.69,6.08c6.54,3.95,13.64,6.38,21.21,7.34,3.02.38.34,5.96-8.63,7.2Z', 'M103.47,211.64s10.73-6.38,22.56.1l-11.51,5.45-11.05-5.55Z'],
};

function JitdaIcon({ size = 36, mono = false, ink: inkProp, variant = 'v16' }) {
  // 캐릭터(병아리) 단독. viewBox는 원본 SVG에서 캐릭터 영역만 잘라낸 박스.
  // mono=true → 다크 디테일(눈·콧수염·입)만 흰색 스왑(반전 버전). 노란 몸체·악센트는 브랜드 식별 위해 어두운 배경에서도 유지.
  // ink prop으로 디테일 색 직접 지정 가능(예: 순수 검정 '#000'). 미지정 시 브랜드 기본값.
  // variant('base'|'v12'|'v13'|'v16'|'v17') → 입(표정) 교체. 미지정 시 정본 v16(활짝 웃는 물결형).
  const ink = inkProp ?? (mono ? '#ffffff' : '#3f3934');
  const body = '#ffce2c';
  const bodyAccent = '#e9ad03';
  const VB_W = 230, VB_H = 200;
  const mouthPaths = JITDA_MOUTHS[variant] || JITDA_MOUTHS.v16;
  return (
    <svg
      width={size * VB_W / VB_H}
      height={size}
      viewBox={`0 47 ${VB_W} ${VB_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="짓다"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* 패스 순서: 눈 → 악센트 → 노란 몸체 → 입. 몸체가 눈 위쪽 일부를 자연스럽게 가리고,
          입(표정)은 원본 베리에이션 SVG처럼 몸체 다음(맨 위)에 그려 안 가려진다. */}
      <circle fill={ink} cx="165.56" cy="196.37" r="15.27"/>
      <circle fill={ink} cx="63.8" cy="196.37" r="15.27"/>
      <path fill={bodyAccent} d="M142.5,104.68c1.37.13,3.05-.71,3.21-2.2.88-8.38,1.95-16.54,3.84-24.79,1.49-6.54,3.04-12.91,5.53-19.03-3.22-1.59-6.54-2.97-10.04-4.21-1.76-.62-3.39-1.27-5.36-1.54l-.05,49.34c0,1.51,1.65,2.31,2.87,2.43Z"/>
      <path fill={bodyAccent} d="M76.28,65.06c.02.07.04.15.06.23.02.08.03.16.04.25.04.25.07.52.17.75.09.23-.2.59.08.69l.31.5c.59,2.13,1.14,4.27,1.66,6.41.17.72.34,1.43.5,2.15.33,1.43.63,2.87.93,4.31.15.72.29,1.44.43,2.17.26,1.35.5,2.7.72,4.05.03.19.06.39.1.58.22,1.36.44,2.72.63,4.09.52,3.65.94,7.32,1.27,11.01.02.19.05.37.11.54.03.09.06.17.1.25.07.16.16.31.27.45.1.14.22.27.35.39.13.12.27.22.42.32.22.14.46.25.71.34.08.03.17.05.25.07.25.07.51.1.76.11.09,0,.19,0,.28,0,.29-.02.57-.06.85-.14.18-.05.36-.12.53-.19.51-.23.95-.59,1.22-1.06.18-.31.28-.68.28-1.1l.02-37.92-.03-11.38c-5.34,1.43-10.35,3.39-15.25,5.68l.74,2.16,1.49,4.31Z"/>
      <path fill={body} d="M224.15,164.76c-1.59-7.38-5.45-15.08-13.34-17.77l-.14-11.8c-.07-1.17-.16-2.34-.26-3.5-.63-7.16-1.88-14.19-4.15-21.1-.2-.6-.4-1.19-.61-1.79-3.49-9.84-8.73-18.96-15.46-27.2-6.66-8.16-14.67-15.01-23.92-20.53l-6.5-3.63c-1.35-.75-4.04-.28-4.65,1.23-2.49,6.12-4.04,12.49-5.53,19.03-1.88,8.25-2.96,16.41-3.84,24.79-.16,1.49-1.84,2.33-3.21,2.2-1.22-.12-2.87-.92-2.87-2.43l.05-49.34-.03-2.21c-.06-4.79-6.91-7.09-11.82-8.06-4.41-.88-8.89-1.31-13.36-1.3-4.36,0-8.72.43-13.03,1.27-5.18,1-11.57,3.06-12.02,8.1-.07.79-.13,1.56-.12,2.2l.03,11.37-.02,37.92c0,.42-.11.79-.28,1.1-.27.47-.71.82-1.23,1.06-.17.08-.35.14-.53.19-.28.08-.56.12-.85.14-.09,0-.19,0-.28,0-.25,0-.51-.04-.76-.11-.08-.02-.17-.05-.25-.07-.25-.09-.49-.2-.71-.34-.15-.09-.29-.2-.42-.32s-.25-.25-.35-.38c-.1-.14-.19-.29-.27-.45-.04-.08-.07-.16-.1-.25-.06-.17-.09-.35-.11-.54-.11-1.3-.31-2.58-.45-3.87-.07-.89-.16-1.81-.29-2.81-.09-.74-.19-1.41-.28-2.12-.1-.74-.15-1.48-.25-2.21-.2-1.36-.41-2.73-.63-4.09-.03-.15-.05-.31-.08-.46-2.97-18.93-6.45-26.61-7.08-27.89l-.07-.21c-1.06-1.32-2.73-1.83-4.6-1.21-14.3,7.21-26.49,17.59-35.2,30.36-3.38,4.95-6.23,9.92-8.54,15.36-1.11,2.61-2.12,5.23-3,7.87-1.78,5.33-3.04,10.76-3.56,16.4l-.42,4.62-.37,4-.1,10.99c-8.13,2.82-12.33,11.19-13.53,18.91-.3,1.94.67,3.88,2.43,4.97,2.81,1.74,5.8,2.93,9,4.2,3.52,1.4,7.07,2.7,10.67,3.92,9.8,3.31,19.86,5.93,30.08,7.94,16.75,3.3,33.92,4.94,50.99,5.21h6.58s6.44,0,6.44,0c15.64-.37,31.15-1.6,46.56-4.37,1.3-.23,2.6-.48,3.9-.73,10.06-1.96,19.93-4.47,29.57-7.62,3.28-1.07,6.55-2.22,9.78-3.44l9.99-4.39c2.91-1.28,4.02-3.94,3.4-6.82Z"/>
      {mouthPaths && mouthPaths.map((d, i) => <path key={i} fill={ink} d={d}/>)}
    </svg>
  );
}

// ── 새 로고 다측 뷰 (logo/jitda_view/*.svg) ─────────────────────────
// 2026-06-11 사용자가 로고 디자인을 갱신하고 정면/측면/3-4/후면 뷰 SVG 추가.
// 아래 두 컴포넌트는 원본 SVG path를 그대로 옮기고 size/mono만 입힌 것.
// 둘 다 viewBox 638.38×677.65 (세로가 약간 김). size = 높이(px).

// 정면 뷰 (jitda_Front.svg). 패스 순서: 눈(2) → 악센트 → 몸체 → 콧수염(맨 위).
function JitdaCharFront({ size = 80, mono = false }) {
  const body = mono ? '#b8b3ac' : '#ffce2c';
  const accent = mono ? '#9a9189' : '#e9ad03';
  const accent2 = mono ? '#9a9189' : '#fcc204';
  const ink = mono ? '#ffffff' : '#3f3934';
  const dark = mono ? '#ffffff' : '#403b37';
  return (
    <svg width={size * 638.38 / 677.65} height={size} viewBox="0 0 638.38 677.65"
         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="짓다"
         style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, overflow: 'visible' }}>
      <ellipse fill={ink} cx="457" cy="485.14" rx="39.71" ry="39.84"/>
      <ellipse fill={ink} cx="192.35" cy="485.14" rx="39.71" ry="39.84"/>
      <path fill={accent} d="M397.03,245.93c3.56.34,7.93-1.85,8.35-5.74,2.29-21.86,5.07-43.15,9.99-64.68,3.88-17.06,7.91-33.68,14.38-49.65-8.37-4.15-17.01-7.75-26.11-10.98-4.58-1.62-8.82-3.31-13.94-4.02l-.13,128.72c0,3.94,4.29,6.03,7.46,6.34Z"/>
      <path fill={accent} d="M224.81,142.56c.05.18.1.39.16.6s.08.42.1.65c.1.65.18,1.36.44,1.96.23.6-.52,1.54.21,1.8l.81,1.3c1.53,5.56,2.96,11.14,4.32,16.72.44,1.88.88,3.73,1.3,5.61.86,3.73,1.64,7.49,2.42,11.24.39,1.88.75,3.76,1.12,5.66.68,3.52,1.3,7.04,1.87,10.57.08.5.16,1.02.26,1.51.57,3.55,1.14,7.1,1.64,10.67,1.35,9.52,2.44,19.1,3.3,28.72.05.5.13.97.29,1.41.08.23.16.44.26.65.18.42.42.81.7,1.17.26.37.57.7.91,1.02s.7.57,1.09.83c.57.37,1.2.65,1.85.89.21.08.44.13.65.18.65.18,1.33.26,1.98.29h.73c.75-.05,1.48-.16,2.21-.37.47-.13.94-.31,1.38-.5,1.33-.6,2.47-1.54,3.17-2.77.47-.81.73-1.77.73-2.87l.05-98.93-.08-29.69c-13.89,3.73-26.92,8.84-39.66,14.82l1.92,5.64,3.88,11.24v-.05Z"/>
      <path fill={accent2} d="M243.98,242.77c-.26-.37-.49-.76-.7-1.17.18.42.42.81.7,1.17Z"/>
      <path fill={accent2} d="M242.76,239.53c-.83-9.63-1.92-19.2-3.3-28.72,1.35,9.52,2.44,19.1,3.3,28.72Z"/>
      <path fill={body} d="M609.38,402.67c-4.14-19.25-14.17-39.34-34.69-46.36l-.36-30.79c-.18-3.05-.42-6.1-.68-9.13-1.64-18.68-4.89-37.02-10.79-55.05-.52-1.57-1.04-3.1-1.59-4.67-9.08-25.67-22.7-49.47-40.21-70.96-17.32-21.29-38.15-39.16-62.21-53.56l-16.9-9.47c-3.51-1.96-10.51-.73-12.09,3.21-6.48,15.97-10.51,32.59-14.38,49.65-4.89,21.52-7.7,42.81-9.99,64.68-.42,3.89-4.79,6.08-8.35,5.74-3.17-.31-7.46-2.4-7.46-6.34l.13-128.72-.08-5.77c-.16-12.5-17.97-18.5-30.74-21.03-11.47-2.3-23.12-3.42-34.75-3.39-11.34,0-22.68,1.12-33.89,3.31-13.47,2.61-30.09,7.98-31.26,21.13-.18,2.06-.34,4.07-.31,5.74l.08,29.66-.05,98.93c0,1.1-.29,2.06-.73,2.87-.7,1.23-1.85,2.14-3.2,2.77-.44.21-.91.37-1.38.5-.73.21-1.46.31-2.21.37h-.73c-.65,0-1.33-.1-1.98-.29-.21-.05-.44-.13-.65-.18-.65-.23-1.27-.52-1.85-.89-.39-.23-.75-.52-1.09-.83s-.65-.65-.91-.99c-.26-.37-.49-.76-.7-1.17-.1-.21-.18-.42-.26-.65-.16-.44-.23-.91-.29-1.41-.29-3.39-.81-6.73-1.17-10.1-.18-2.32-.42-4.72-.75-7.33-.23-1.93-.49-3.68-.73-5.53-.26-1.93-.39-3.86-.65-5.77-.52-3.55-1.07-7.12-1.64-10.67-.08-.39-.13-.81-.21-1.2-7.72-49.39-16.77-69.42-18.41-72.76l-.18-.55c-2.76-3.44-7.1-4.77-11.96-3.16-37.19,18.81-68.89,45.89-91.54,79.21-8.79,12.91-16.2,25.88-22.21,40.07-2.89,6.81-5.51,13.64-7.8,20.53-4.63,13.91-7.91,28.07-9.26,42.79l-1.09,12.05-.96,10.44-.26,28.67c-21.14,7.36-32.07,29.19-35.19,49.33-.78,5.06,1.74,10.12,6.32,12.97,7.31,4.54,15.08,7.64,23.41,10.96,9.15,3.65,18.39,7.04,27.75,10.23,25.49,8.64,51.65,15.47,78.23,20.71,43.56,8.61,88.22,12.89,132.61,13.59h33.86c40.67-.97,81.01-4.17,121.09-11.4,3.38-.6,6.76-1.25,10.14-1.9,26.16-5.11,51.83-11.66,76.9-19.88,8.53-2.79,17.03-5.79,25.43-8.97l25.98-11.45c7.57-3.34,10.45-10.28,8.84-17.79v.03Z"/>
      <path fill={dark} d="M324.5,566.22c-24.16,24.68-60.91,37.54-93.83,27.03-11-3.52-20.34-9.65-27-18.89-.44-.63-.36-1.72-.29-2.17.13-.65,1.04-1.36,2.21-1.3,15.45.52,30.06-2.61,44.16-8.95,14.1-6.34,26.22-14.43,36.62-25.44l11-11.66c2.5-2.63,4.68-6.26,8.87-6.29l34.43-.23c4.97-.03,7.57,2.32,10.4,5.82,23.2,28.44,55.86,48.13,93.18,46.86,1.51-.05.88,3.13.26,3.91-6.71,8.77-15.63,14.58-26.06,18.18-32.53,10.67-70.04-2.09-93.96-26.85v-.03Z"/>
    </svg>
  );
}

// 측면 뷰 (jitda_Left Side.svg = 왼쪽 바라봄). flip=true → 우측(미러).
// 패스 순서: 발 → 눈 → 몸체(헬멧) → 악센트(능선). 몸체가 눈 위쪽(챙)을 가림.
function JitdaCharSide({ size = 80, mono = false, flip = false }) {
  const body = mono ? '#b8b3ac' : '#ffce2c';
  const accent = mono ? '#9a9189' : '#e9ad03';
  const dark = mono ? '#ffffff' : '#403b37';
  return (
    <svg width={size * 638.38 / 677.65} height={size} viewBox="0 0 638.38 677.65"
         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="짓다 측면"
         style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path fill={dark} d="M236.21,519.56c-3.35,12.56-16.89,21.33-31.65,25.44-27.2,7.57-57.56,3.11-80.77-11.16-19.21-11.8-22.86-36.13-5.15-49.9,7.63-5.94,23.48-5.41,30.41.45l27.16,22.94c16.38,12.34,36.26,16.03,60,12.23Z"/>
      <path fill={dark} d="M174.28,397.22c21.5-3.12,38.34,11.91,40.79,30.45,2.67,20.27-11,37.89-30.29,40.57-19.53,2.72-37.84-10.29-40.85-28.8-3.29-20.2,8.66-39.07,30.36-42.22Z"/>
      <path fill={body} d="M533.43,360.73l-.98-53.78c-.05-2.82-.27-5.97-.64-9.35,0,0,0,0,0,0,0-106.14-94.38-192.18-210.81-192.18-91.13,0-168.74,52.71-198.18,126.51-10.93,23.7-16.44,50.05-18.44,76.91l-.75,47.18c-.05,3.25-4.54,5.15-6.91,6.59l-40.16,24.38c-6.5,3.94-9.07,11.62-7.08,19.14,1.41,5.33,7.57,11.46,15.4,11.46l91.48.03,218.22.06,111.01-.02h21.75s28.89-.38,28.89-.38c7.64-.1,12.9-8.12,15.24-13,6.33-13.19-5.25-31.69-18.03-43.56Z"/>
      <path fill={accent} d="M355.92,138.74l19.16,4.86c19.36,4.91,36.3,14.26,52.48,25.68,1.18.31,2.22,1.65,2.9,2.11,23.79,16.25,49.74,48.66,59.56,74.76l5,13.3c1.63,4.35-2.04,7.93-5.7,8.35-3.19.37-5.94-2.02-7.35-5.64-19.08-48.93-57.7-84.43-107.58-100.1-48.61-15.27-99.09-8.14-141.86,19.96-27.69,18.19-48.09,43.83-61.74,74.09-1.65,3.66-6.97,4.31-9.65,3.02-3.2-1.54-3.95-5.73-2.25-9.68l5.54-12.39c21.17-41.47,54.47-73.82,98.39-89.8l5.17-1.88c28.31-10.3,58.22-11.65,87.95-6.64Z"/>
    </svg>
  );
}

function JitdaWordmark({ size = 26, mono = false }) {
  // 한글 "짓다" 워드마크. size = 글자 캐릭터 높이(px) 근사값.
  // 기존 jitda SVG 자리에 들어가므로 fontFamily/weight/letter-spacing은 원본 디자인 시스템 어휘 유지.
  const ink = mono ? '#ffffff' : '#3f3934';
  return (
    <span
      role="img"
      aria-label="짓다"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: size * 1.18,
        letterSpacing: '-0.045em',
        color: ink,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      짓다
    </span>
  );
}

function JitdaMark({ size = 26, mono = false, iconSize, gap, variant }) {
  // size = "jitda" 워드마크 높이(px). iconSize 미지정 시 size*1.55(아이콘이 한 단계 크게).
  // gap = 워드마크/아이콘 간 간격(px). 미지정 시 size*0.32.
  // variant → 캐릭터 표정 베리에이션. 워드마크는 항상 한글 "짓다" (영문 미사용).
  const icon = iconSize ?? Math.round(size * 1.55);
  const innerGap = gap ?? Math.round(size * 0.32);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: innerGap,
        verticalAlign: 'middle',
      }}
      aria-label="짓다"
    >
      <JitdaIcon size={icon} mono={mono} variant={variant} />
      <JitdaWordmark size={size} mono={mono} />
    </span>
  );
}

// 헬멧 캐릭터가 통통 튀는 "짓는 중" 마스코트. 로딩/빈 상태 자리에 쓰는 살아있는 로고.
// 2겹 wrapper로 transform 합성: 바깥(tilt=rotate) → 안(hop=translate+scale).
// 키프레임은 tokens.css의 jt-mascot-* (squash&stretch + 바닥 그림자 호흡).
function JitdaMascot({ size = 72, mono = false }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.16) }} aria-label="짓다 캐릭터 작업 중" role="img">
      <span className="jt-mascot-tilt" style={{ display: 'inline-flex' }}>
        <span className="jt-mascot-hop" style={{ display: 'inline-flex' }}>
          <JitdaCharFront size={size} mono={mono} />
        </span>
      </span>
      <span
        className="jt-mascot-shadow"
        style={{ width: Math.round(size * 0.66), height: Math.round(size * 0.13), borderRadius: '50%', background: 'var(--c-ink)' }}
      />
    </span>
  );
}

// 헬멧 캐릭터가 곡괭이질하며 열심히 "짓는" 마스코트. 적극적 작업/빌드 로딩 자리에.
// 곡괭이 스윙 + 몸 반동(움찔) + 착지 스파크를 한 주기로 동기화 (tokens.css jt-pick-*).
function JitdaMascotPickaxe({ size = 96, mono = false }) {
  const W = Math.round(size * 1.45);
  const H = Math.round(size * 1.3);
  const pickW = Math.round(size * 0.8);
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.13) }} role="img" aria-label="짓다 캐릭터 곡괭이질 중">
      <span style={{ position: 'relative', width: W, height: H }}>
        {/* 캐릭터 — 바닥 중앙 고정, 내려찍는 순간 살짝 눌리며 움찔 */}
        <span className="jt-pick-body" style={{ position: 'absolute', left: '50%', bottom: 0, display: 'inline-flex' }}>
          <JitdaIcon size={size} mono={mono} />
        </span>
        {/* 곡괭이 — 그립을 몸 중앙에 두고 휘두름. overflow visible로 머리 안 잘리게 */}
        <svg
          className="jt-pick-swing"
          width={pickW} height={pickW} viewBox="0 0 100 100"
          style={{ position: 'absolute', left: '50%', bottom: Math.round(size * 0.16), marginLeft: -pickW / 2, transformOrigin: '50% 88%', overflow: 'visible' }}
        >
          {/* 자루 */}
          <rect x="46" y="28" width="8" height="60" rx="4" fill="#9c6b3f" />
          <rect x="46.5" y="28" width="3" height="60" rx="1.5" fill="#bd8753" />
          {/* 곡괭이 머리 — 양날 곡선 + 하이라이트 */}
          <path d="M14 30 Q50 11 86 30" fill="none" stroke="#3f3934" strokeWidth="11.5" strokeLinecap="round" />
          <path d="M20 27 Q50 14 80 27" fill="none" stroke="#5d564f" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        {/* 충격 스파크 — 곡괭이 착지점(우하단)에서 번쩍 */}
        <span className="jt-pick-spark" style={{ position: 'absolute', right: Math.round(size * 0.05), bottom: Math.round(size * 0.04), width: Math.round(size * 0.38), height: Math.round(size * 0.38) }}>
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
            <g stroke="#e9ad03" strokeWidth="3" strokeLinecap="round">
              <line x1="20" y1="26" x2="9" y2="13" />
              <line x1="20" y1="26" x2="20" y2="7" />
              <line x1="20" y1="26" x2="32" y2="14" />
            </g>
            <circle cx="8" cy="30" r="2.2" fill="#9c6b3f" />
            <circle cx="31" cy="31" r="2.4" fill="#9c6b3f" />
          </svg>
        </span>
      </span>
      <span style={{ width: Math.round(size * 0.7), height: Math.round(size * 0.13), borderRadius: '50%', background: 'var(--c-ink)', opacity: 0.16 }} />
    </span>
  );
}

// 도면 한 장 — 모눈 배경 + 파란 작도선. page='a'|'b' 로 두 장 구분.
// 작도선 SVG는 viewBox(130×80) preserveAspectRatio=none 이라 자동 스케일. 모눈/테두리만 px 비례 처리.
function BlueprintSheet({ w, h, page = 'a', blank = false, style }) {
  const grid = '#d4e0f3';
  const line = '#3f6bb0';
  const faint = '#9fb6d8';
  const LW = Math.max(1, Math.round(w * 0.0045));  // 모눈/테두리 선두께
  const CELL = Math.round(w / 11);                 // 칸 폭(항상 ~11칸)
  const GAP = CELL - LW;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: w, height: h,
      background: '#eef4fc',
      // blank=true → 모눈·작도선 없는 '파란 백지'(넘김 안쪽 페이지용). 외엔 모눈 폭(w) 비례.
      backgroundImage: blank ? 'none' :
        'repeating-linear-gradient(0deg, transparent 0 ' + GAP + 'px, ' + grid + ' ' + GAP + 'px ' + CELL + 'px),' +
        'repeating-linear-gradient(90deg, transparent 0 ' + GAP + 'px, ' + grid + ' ' + GAP + 'px ' + CELL + 'px)',
      border: LW + 'px solid #c6d6ef', borderRadius: Math.round(w * 0.026),
      boxShadow: '0 ' + Math.round(h * 0.03) + 'px ' + Math.round(h * 0.09) + 'px rgba(40,60,100,0.12)',
      overflow: 'hidden',
      ...style,
    }}>
      {!blank &&
      <svg width={w} height={h} viewBox="0 0 130 80" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        {page === 'a'
          ? <g fill="none" stroke={line} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="12" y="14" width="42" height="34" rx="1.5" />
              <line x1="12" y1="30" x2="54" y2="30" />
              <line x1="33" y1="14" x2="33" y2="48" />
              <circle cx="86" cy="26" r="9" />
              <line x1="77" y1="26" x2="95" y2="26" /><line x1="86" y1="17" x2="86" y2="35" />
              <line x1="12" y1="58" x2="54" y2="58" />
              <path d="M12 55.5 L12 60.5 M54 55.5 L54 60.5" />
              <line x1="78" y1="50" x2="118" y2="50" strokeWidth="2.6" stroke={faint} />
              <line x1="78" y1="58" x2="106" y2="58" strokeWidth="2.6" stroke={faint} />
              <line x1="78" y1="66" x2="118" y2="66" strokeWidth="2.6" stroke={faint} />
            </g>
          : <g fill="none" stroke={line} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 42 L40 18 L66 42" />
              <rect x="20" y="42" width="40" height="22" />
              <rect x="34" y="50" width="12" height="14" />
              <circle cx="96" cy="28" r="7" />
              <line x1="84" y1="28" x2="108" y2="28" />
              <line x1="78" y1="58" x2="118" y2="58" />
              <path d="M78 55.5 L78 60.5 M118 55.5 L118 60.5" />
              <line x1="84" y1="68" x2="112" y2="68" strokeWidth="2.6" stroke={faint} />
            </g>
        }
      </svg>
      }
    </div>
  );
}

// 헬멧 캐릭터가 도면(신문처럼 접힌)을 들고 보는 마스코트. 몸통 없이 헬멧만 도면 위로 빼꼼.
// 레이어(앞→뒤): 손 > 도면 > 헬멧. 도면은 가운데 접힘선 기준 양쪽이 ±FOLD°로 꺾인 정적 V접힘.
// 애니메이션은 머리 도리도리(jt-bp-peek) + 종이 흔들림(jt-bp-sway). 페이지 넘김은 제거됨.
function JitdaMascotBlueprint({ size = 110, mono = false }) {
  const PW = Math.round(size * 1.95);
  const PH = Math.round(size * 1.18);
  const peek = Math.round(size * 0.76);   // 헬멧이 도면 위로 솟는 높이(눈이 살짝 걸쳐 빼꼼)
  const H = peek + PH;
  const handW = Math.round(size * 0.2);
  const handH = Math.round(size * 0.13);
  const FOLD = 24;                         // 신문 V접힘각(°)
  const half = PW / 2;
  const R = Math.round(PW * 0.026);        // 종이 모서리 반경(BlueprintSheet와 동일). 바깥 모서리 clip 둥글게
  // ── 사이즈 비례 px (모든 절대값 제거 → 어떤 size에서도 동일 비율) ──
  const TILT = -15;                        // 위아래 틸트(°). 음수=아래가 뒤로(위에서 내려다봄)
  const handShadow = 'inset 0 -' + Math.max(1, Math.round(size * 0.017)) + 'px 0 rgba(0,0,0,0.10)';
  // perspective(=카메라 거리)·tilt를 두 레이어가 공유 → 같은 시점으로 겹쳐 보임
  const persp = { position: 'absolute', left: '50%', top: peek, width: PW, height: PH, transform: 'translateX(-50%)', perspective: Math.round(size * 9), perspectiveOrigin: '50% 125%', transformStyle: 'preserve-3d' };
  const tilt = { position: 'absolute', top: 0, left: 0, width: PW, height: PH, transformOrigin: '50% 0%', transform: 'rotateX(' + TILT + 'deg)', transformStyle: 'preserve-3d' };
  const hand = { position: 'absolute', zIndex: 4, top: peek - Math.round(handH / 2), width: handW, height: handH, borderRadius: handH, background: '#ffce2c', boxShadow: handShadow };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.12) }} role="img" aria-label="짓다 캐릭터 도면 보는 중">
      <span className="jt-bp-sway" style={{ position: 'relative', width: PW, height: H }}>
        {/* 헬멧 — 도면 뒤(z-index 1), 위로 빼꼼. 평면 합성(3D 밖)이라 영향 없음 */}
        <span className="jt-bp-peek" style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', zIndex: 1, display: 'inline-flex' }}>
          <JitdaCharFront size={size} mono={mono} />
        </span>
        {/* 도면 3D 레이어(z-index 2) — 정적 V접힘 (페이지 넘김 액션 제거됨) */}
        <span style={{ ...persp, zIndex: 2 }}>
          <span style={tilt}>
            {/* 왼쪽 페이지 — −FOLD°. 바깥(왼쪽) 모서리만 둥글게, spine(오른쪽)은 각지게. clip 단면이라 spine 테두리 없음 */}
            <span style={{ position: 'absolute', top: 0, left: 0, width: half, height: PH, transformOrigin: 'right center', transform: 'rotateY(' + (-FOLD) + 'deg)', overflow: 'hidden', borderRadius: R + 'px 0 0 ' + R + 'px' }}>
              <BlueprintSheet w={PW} h={PH} page="a" />
            </span>
            {/* 오른쪽 페이지 — +FOLD°. 바깥(오른쪽) 모서리만 둥글게. spine(왼쪽) 테두리 제거로 이음매 선 없앰 */}
            <span style={{ position: 'absolute', top: 0, left: half, width: half, height: PH, transformOrigin: 'left center', transform: 'rotateY(' + FOLD + 'deg)', overflow: 'hidden', borderRadius: '0 ' + R + 'px ' + R + 'px 0' }}>
              <BlueprintSheet w={PW} h={PH} page="a" style={{ left: -half, borderLeftWidth: 0 }} />
            </span>
          </span>
        </span>
        {/* 손 — 종이가 손 중앙에 오도록(top = paper edge − handH/2) */}
        <span style={{ ...hand, left: Math.round(PW * 0.1) }} />
        <span style={{ ...hand, right: Math.round(PW * 0.1) }} />
      </span>
      <span style={{ width: Math.round(size * 1.1), height: Math.round(size * 0.14), borderRadius: '50%', background: 'var(--c-ink)', opacity: 0.13 }} />
    </span>
  );
}

// 헬멧 캐릭터가 땅을 파는 모습 — 측면 land-level 뷰. 추상화 마스코트.
// 추상화 규칙(사용자 명세):
//  · 지면 = 회색 직선 하나(land level). 구덩이/구멍 묘사 없음. 선 아래는 clip(=땅속).
//  · 몸통 없음 — 측면 헬멧 윗부분만 지면선 위로 "아주 조금" 빼꼼, 곡괭이질에 맞춰 움찔(jt-dig-bob).
//  · 어깨(피벗)는 지면선 바로 아래(땅속, 안 보임). 손+곡괭이가 한 강체로 이 어깨를 중심으로 각운동
//    → 손도 곡괭이와 같이 움직임(고정 아님). 손잡이 1시→CCW→머리 위로 넘겨 9시 지나 내려찍음.
//  · 곡괭이가 9시 각도경(수평)에 오면 지면선 아래라 clip되어 보이지 않음(= 땅 속으로).
//  · 곡괭이는 헬멧 "위로" 넘어가며(겹치지 않음), 착지(파는 구멍)는 헬멧 왼쪽.
//  · 내려찍는 순간 흙(회색 동그라미 3개)이 착지점에서 튐.
function JitdaMascotDig({ size = 96, mono = false }) {
  const W = Math.round(size * 2.15);
  const H = Math.round(size * 1.78);
  const cx = Math.round(W / 2);
  const lineY = Math.round(H * 0.52);                      // 캐릭터 기준 Y(보이지 않음)
  // 어깨(피벗) = 스윙 원점. 헬멧을 바로 이 점에 두면 손·곡괭이가 헬멧을 중심으로 도므로
  // 헬멧↔손/곡괭이 거리가 스윙 내내 "일정"하게 유지됨. (이전: 헬멧 고정 → 뒤=가깝고 앞=멀어짐)
  const Sx = cx;
  const Sy = lineY + Math.round(size * 0.05);
  // 헬멧 = 새 로고 측면 뷰(JitdaCharSide). 피벗(Sx)을 헬멧보다 앞쪽(왼쪽)에 둬서:
  //  · 위로 들었을 때(우상) → 팔이 헬멧 뒤로 가려짐(곡괭이 z-order가 헬멧보다 아래)
  //  · 내려찍을 때(좌하) → 팔이 헬멧 앞쪽(왼쪽)에서 보임
  const helmetX = cx + Math.round(size * 0.13);
  const charH = Math.round(size * 0.92);                 // 측면 캐릭터 렌더 높이
  const DOME_TOP = 0.161;                                // viewBox 내 돔 꼭대기 비율(≈y109/677)
  const CUT = 0.58;                                      // 지면(타원)이 자르는 비율(챙 부근) → 헬멧만 빼꼼(얼굴은 타원 속)
  const helmetTop = Math.round(lineY - CUT * charH);     // 캐릭터 element top
  const bobOrigin = '50% 96%';                            // 틸트 피벗 = 발 부근(전신이 발로 까딱)
  // 팔(손+곡괭이) SVG — 피벗=바닥중앙, 위로 뻗음. 회전 시 손도 함께 호를 그림(강체).
  const swH = Math.round(size * 0.92);
  const swW = Math.round(size * 0.92 * 84 / 200);
  const PIVOT_X = 50, PIVOT_Y = 98;                       // SVG viewBox(84×200) 어깨(피벗) 위치 %
  const headFill = mono ? '#5d564f' : '#3f3934';
  const headHi = mono ? '#7a736b' : '#6f675f';
  // 곡괭이 최저점(파는 지점) — 측정상 머리 바닥 ≈ (Sx-0.66size, Sy+0.63size).
  // 여기에 작은 회색 타원(구멍)을 두고, 머리 끝이 그 안(타원 아래)으로 들어가 일부 가려지게.
  const digHoleX = Sx - Math.round(size * 0.78);
  const digHoleY = Sy + Math.round(size * 0.3);           // 타원 중심(지면 표면) = 곡괭이 머리 하단 1/3 지점 → 머리 1/3만 가려짐
  const digHoleW = Math.round(size * 0.46);
  const digHoleH = Math.round(size * 0.24);               // 앞 림(하단 절반)이 머리 끝 아래까지 충분히 덮게
  // 캐릭터 발밑 그림자(다른 마스코트처럼) — 곡괭이질에 맞춰 호흡(jt-dig-shadow): 들리면 작고 옅게, 눌리면 크고 진하게
  const shadowY = lineY + Math.round((1 - CUT) * charH) + Math.round(size * 0.035);
  const shadowW = Math.round(size * 0.62);
  const shadowH = Math.round(size * 0.13);
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} role="img" aria-label="짓다 캐릭터 머리 위로 곡괭이질(측면)">
      <span style={{ position: 'relative', width: W, height: H }}>
        {/* 바닥 없음 → 전체 캐릭터 노출(clip 제거). 측면 캐릭터 전신 + 곡괭이질 */}
        <span style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'visible' }}>
          {/* 캐릭터 발밑 그림자 — 맨 뒤(지면). 곡괭이질에 맞춰 호흡(jt-dig-shadow): 들리면 작게·옅게, 내려찍으면 크게·진하게 */}
          <span
            className="jt-dig-shadow"
            style={{ position: 'absolute', left: helmetX, top: shadowY, width: shadowW, height: shadowH, marginLeft: -shadowW / 2, marginTop: -shadowH / 2, borderRadius: '50%', background: mono ? 'rgba(255,255,255,0.28)' : 'var(--c-ink, #403b37)' }}
          />
          {/* 구멍(뒤 림) — 곡괭이 뒤. 머리가 이 위로 올라와 구멍에서 빠져나오는 듯. opacity 1(앞 림과 겹쳐도 중간선 안 생기게) */}
          <span style={{ position: 'absolute', left: digHoleX, top: digHoleY, width: digHoleW, height: digHoleH, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: '#aca69e' }} />
          {/* 팔(손+곡괭이) — 헬멧 "뒤"(z-order 아래). 위로 들면 헬멧에 가려지고, 내려찍으면 헬멧 앞(왼쪽)에서 보임.
              ⚠ 지면 표면선(digHoleY = 구멍 타원 중심 = 실제 땅 높이)에서 clip → 곡괭이 머리가 지면 아래로
              일절 안 나옴(구멍 림 하단·측면 커브 어디서도 안 튀어나옴). clip은 회전 안 하는 래퍼에 걸어
              지면선이 수평으로 고정됨(스윙은 안쪽에서 회전). 림(타원)은 별도 요소라 그대로 보임(near-lip 깊이감). */}
          <span style={{ position: 'absolute', left: 0, top: 0, width: W, height: digHoleY, overflow: 'hidden' }}>
            <span
              className="jt-dig-swing"
              style={{ position: 'absolute', left: Math.round(Sx - swW * PIVOT_X / 100), top: Math.round(Sy - swH * PIVOT_Y / 100), width: swW, height: swH, transformOrigin: PIVOT_X + '% ' + PIVOT_Y + '%' }}
            >
              <svg width={swW} height={swH} viewBox="0 0 84 200" style={{ overflow: 'visible' }}>
                {/* 자루 — 머리(위)에서 손 지나 아래까지 */}
                <rect x="37.5" y="22" width="9" height="118" rx="4.5" fill="#9c6b3f" />
                <rect x="38" y="22" width="3" height="118" rx="1.5" fill="#bd8753" />
                {/* 곡괭이 머리 — 자루 끝(위) 양날 곡선 + 하이라이트 */}
                <path d="M8 24 Q42 4 76 24" fill="none" stroke={headFill} strokeWidth="12" strokeLinecap="round" />
                <path d="M14 21 Q42 7 70 21" fill="none" stroke={headHi} strokeWidth="3.5" strokeLinecap="round" />
                {/* 양손 — 자루를 쥔 노란 손 둘. BLUEPRINT(도면) 손과 비슷한 비율(≈helmet*0.2)로 크게 */}
                <ellipse cx="32" cy="112" rx="18" ry="14" fill="#ffce2c" stroke="#e9ad03" strokeWidth="2.5" />
                <ellipse cx="52" cy="128" rx="18" ry="14" fill="#ffce2c" stroke="#e9ad03" strokeWidth="2.5" />
              </svg>
            </span>
          </span>
          {/* 측면 캐릭터(새 로고) 전신 — 곡괭이 "앞"(z-order 위). jt-dig-bob으로 곡괭이질과 동기 끄덕 */}
          <span className="jt-dig-bob" style={{ position: 'absolute', left: helmetX, top: helmetTop, transformOrigin: bobOrigin, transform: 'translateX(-50%)', '--bob': Math.round(size * 0.03) + 'px' }}>
            <JitdaCharSide size={charH} mono={mono} />
          </span>
          {/* 구멍(앞 림=하단 곡선부) — 곡괭이 위. 곡괭이가 가려지는 건 이 하단 곡선부뿐(전체 타원 아님). 뒤 림과 동색·불투명이라 경계선 없음 */}
          <span style={{ position: 'absolute', left: digHoleX, top: digHoleY, width: digHoleW, height: digHoleH, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: '#aca69e', clipPath: 'inset(50% 0 0 0)', WebkitClipPath: 'inset(50% 0 0 0)' }} />
        </span>
        {/* 흙 — 회색 동그라미 3개가 구멍에서 위·바깥으로 튐 */}
        <span style={{ position: 'absolute', left: digHoleX, top: digHoleY - Math.round(size * 0.05), zIndex: 3 }}>
          {[
            { a: -54, d: 0.4,  r: 0.05,  delay: 0 },
            { a: -12, d: 0.48, r: 0.063, delay: -0.04 },
            { a: 30,  d: 0.42, r: 0.045, delay: -0.07 },
          ].map((c, i) => (
            <span key={i} style={{ position: 'absolute', left: 0, top: 0, transform: 'rotate(' + c.a + 'deg)' }}>
              <span
                className="jt-dig-dirt"
                style={{
                  display: 'block', width: Math.round(size * c.r * 2), height: Math.round(size * c.r * 2),
                  marginLeft: -Math.round(size * c.r), marginTop: -Math.round(size * c.r),
                  borderRadius: '50%', background: '#8f8a84', opacity: 0,
                  '--pop': Math.round(size * c.d) + 'px', animationDelay: c.delay + 's',
                }}
              />
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

// ── Status pill ─────────────────────────────────────────────────────
// 5상태 단방향 (2026-05-26 ③ tutorial_ended 폐기 · 2026-05-29 일시정지 폐기)
// 단계(튜토리얼/해커톤)는 색 계열, 진행도(대기/진행/종료)는 명도·아이콘으로 이중 인코딩
function StatusPill({ status, size = 'md' }) {
  const map = {
    // 5상태 단방향 — tutorial_ended는 hackathon_waiting으로 통합됨(2026-05-26)
    tutorial_waiting: { label: '튜토리얼 대기', cls: 'jt-pill-tutorial-waiting', icon: '◔' },
    tutorial_running: { label: '튜토리얼 진행', cls: 'jt-pill-tutorial-running', icon: '◐' },
    hackathon_waiting:{ label: '해커톤 대기',   cls: 'jt-pill-hack-waiting',     icon: '◔' },
    hackathon_running:{ label: '해커톤 진행',   cls: 'jt-pill-hack-running',     icon: '●' },
    hackathon_ended:  { label: '해커톤 종료',   cls: 'jt-pill-hack-ended',       icon: '■' },

    // 레거시 alias (점진적 마이그레이션용)
    tutorial_ended:   { label: '해커톤 대기',   cls: 'jt-pill-hack-waiting',     icon: '◔' }, // 폐기: hackathon_waiting로 매핑
    pending:  { label: '튜토리얼 대기', cls: 'jt-pill-tutorial-waiting', icon: '◔' },
    tutorial: { label: '튜토리얼 진행', cls: 'jt-pill-tutorial-running', icon: '◐' },
    started:  { label: '해커톤 진행',   cls: 'jt-pill-hack-running',     icon: '●' },
    ended:    { label: '해커톤 종료',   cls: 'jt-pill-hack-ended',       icon: '■' },
  };
  const m = map[status] || map.tutorial_waiting;
  const big = size === 'lg';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className={`jt-pill ${m.cls}`} style={big ? { fontSize: 12.5, padding: '5px 12px' } : {}}>
        <span style={{ fontSize: big ? 11 : 9.5, lineHeight: 1, opacity: 0.85 }}>{m.icon}</span>
        {m.label}
      </span>
    </span>
  );
}

// ── Browser chrome wrapper (desktop) ───────────────────────────────
function BrowserChrome({ url = 'jitda.io', children }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--c-stone-2)',
    }}>
      <div style={{
        flex: '0 0 auto',
        height: 36,
        background: '#ddd9d0',
        borderBottom: '1px solid var(--c-hairline-strong)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{
          flex: '0 1 320px',
          background: '#cfcbc1',
          borderRadius: 6,
          padding: '4px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--c-ink-3)',
          textAlign: 'center',
          marginLeft: 16,
        }}>
          {url}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Phone frame ────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--c-stone-2)',
      padding: 30,
    }}>
      <div style={{
        width: 340, height: 700,
        background: 'var(--c-canvas)',
        borderRadius: 36,
        border: '8px solid #1a1a20',
        boxShadow: '0 30px 60px rgba(20,20,30,0.18)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 22,
          background: '#1a1a20',
          borderRadius: '0 0 14px 14px',
          zIndex: 2,
        }} />
        <div style={{
          flex: '0 0 auto',
          height: 40,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '4px 22px 4px',
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          fontWeight: 600,
        }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>5G</span>
            <span style={{ width: 18, height: 9, border: '1.2px solid var(--c-ink)', borderRadius: 2, position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 1.4, background: 'var(--c-ink)', borderRadius: 1 }} />
            </span>
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Common app header for participant/operator desktop ─────────────
// GNB는 모든 운영자 화면에서 동일: 로고 + breadcrumb + 계정/로그아웃.
// 단일 행, 최소 높이로 유지.
function AppHeader({ breadcrumb, user, actions, brandVariant }) {
  return (
    <header style={{
      flex: '0 0 auto',
      background: 'var(--c-canvas)',
      borderBottom: '1px solid var(--c-hairline)',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      minHeight: 44,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <JitdaMark size={13} variant={brandVariant} />
        {breadcrumb && (
          <>
            <div style={{ width: 1, height: 14, background: 'var(--c-hairline-strong)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--c-slate)' }}>
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: 'var(--c-muted)' }}>›</span>}
                  <span style={i === breadcrumb.length - 1
                    ? { color: 'var(--c-ink)', fontWeight: 600 }
                    : { cursor: 'pointer' }}>{b}</span>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {actions}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingLeft: 12, borderLeft: '1px solid var(--c-hairline)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            fontSize: 12.5, color: 'var(--c-ink)', lineHeight: 1,
          }}>
            <span style={{ fontWeight: 600 }}>{user.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)' }}>{user.email}</span>
          </div>
          <button className="jt-btn jt-btn-ghost jt-btn-sm" title="로그아웃" style={{ padding: '4px 8px', fontSize: 11.5 }}>
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
}

// ── Spec annotation note (small post-it) ───────────────────────────
function SpecNote({ children, top, right, bottom, left, width = 220 }) {
  return (
    <div style={{
      position: 'absolute',
      top, right, bottom, left,
      width,
      background: '#fff7d6',
      border: '1px solid #e6d486',
      borderRadius: 6,
      padding: '8px 10px',
      fontSize: 11,
      lineHeight: 1.45,
      color: '#5a4a2a',
      fontFamily: 'var(--font-mono)',
      boxShadow: '0 4px 12px rgba(80,60,30,0.08)',
      zIndex: 4,
    }}>
      {children}
    </div>
  );
}

// ── Footer footer used in artboards (current time, ip, etc) ────────
function StatusBar({ items }) {
  return (
    <div style={{
      flex: '0 0 auto',
      background: 'var(--c-ink)',
      color: '#cfcfd7',
      padding: '6px 18px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.04em',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
    }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
          <span>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Tiny icon set (stroke style) ───────────────────────────────────
const Icon = {
  arrowRight: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  arrowLeft: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  check: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  x: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  warn: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  info: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  play: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  pause: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
  ),
  stop: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>
  ),
  user: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  users: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  heart: (s = 14, filled = false) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  external: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
  copy: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  refresh: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  ),
  settings: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  gallery: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ),
  code: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  bolt: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  comment: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  send: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  thumbsUp: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
  ),
  lightbulb: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z"/></svg>
  ),
  moreH: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
  ),
  // 손들기 — 2026-06-01 신설. B-2 진행 화면 / C-2 바이브코딩 손들기 신호.
  // lucide Hand 단순화: 4-finger silhouette. 24x24, default stroke 2.
  hand: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
  ),
  // 시계 — 진행 시간·경과 시간 표시. lucide Clock simplified.
  clock: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  // 칩 아이콘 (sparkline 보조) — lucide Activity.
  activity: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  // 검색 — lucide Search. B-2 참가자 접속정보 디렉터리 검색 필드.
  search: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  // 접속 코드 — lucide Key. 명함 코드 필드 보조 아이콘.
  key: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
  ),
};

// 디자인 시스템 — 아바타 라벨: 한글 이름 뒤 2글자 ("김민준" → "민준", "최유나" → "유나").
// 1글자 등록 fallback. 모든 아바타 (참가자·운영자·rejected outcomes 등) 공통 사용.
// 2026-05-29: 기존 첫 글자(성씨) 노출 폐기 — 동성 다인 팀 식별 불가 문제 + 친근감 향상.
function avatarLabel(name) {
  if (!name) return '';
  return name.length >= 2 ? name.slice(-2) : name;
}

// ── macOS Safari(Tahoe) 컴팩트 chrome — OpenCode 미리보기·갤러리 공용 디자인시스템 컴포넌트 ──
//   레이아웃: [좌 그룹 flex:1][주소 pill flex:0·바 정중앙][우 그룹 flex:1]
//     · 좌·우 그룹을 동일 flex로 → 주소창이 바 정중앙. pill 내부도 좌(홈)·우(새로고침) 18px 대칭 → 주소 텍스트 정중앙.
//     · 좌: 트래픽 라이트 + (파일 탐색기 토글: onToggleSidebar 있을 때만) + 뒤로/앞으로
//     · 중앙: 주소 pill — 홈(항상) · 주소 · 새로고침(스핀)
//     · 우: 새 탭에서 열기 + 주소 복사(둘 다 tutorial 시 숨김 — 연습 환경 외부 이탈·공유 차단)
//   props: url|address(주소 텍스트) · openUrl(새 탭 대상) · onRefresh · onHome(홈 클릭, 없으면 데코) ·
//          onToggleSidebar+sidebarOpen(파일 탐색기 토글) · tutorial(새 탭 열기·복사 숨김)
//   ⚠ 홈은 항상 노출(OpenCode·갤러리 공통). 파일 탐색기 토글만 OpenCode 전용 — 갤러리(D-2)는 onToggleSidebar 미전달 → 소스 버튼 없음.
function SafariChrome({ url, address, onRefresh, onHome, onToggleSidebar, sidebarOpen = false, openUrl, tutorial = false }) {
  const [spin, setSpin] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const spinT = React.useRef(null);
  const copyT = React.useRef(null);
  const addr = address != null ? address : (url != null ? url : 'sapari.jitda.run');
  const openTarget = openUrl != null ? openUrl : (url != null ? url : addr);
  const toFull = (s) => (String(s).startsWith('http') ? String(s) : 'https://' + s);
  const doRefresh = () => {
    setSpin(false);
    requestAnimationFrame(() => setSpin(true));
    if (spinT.current) clearTimeout(spinT.current);
    spinT.current = setTimeout(() => setSpin(false), 720);
    if (onRefresh) onRefresh();
  };
  const doCopy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(toFull(addr)); } catch (e) {}
    setCopied(true);
    if (copyT.current) clearTimeout(copyT.current);
    copyT.current = setTimeout(() => setCopied(false), 1500);
  };
  const doOpen = () => { try { window.open(toFull(openTarget), '_blank', 'noopener'); } catch (e) {} };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 11px', background: '#f5f5f7', borderBottom: '0.5px solid #d8d8da', flexShrink: 0, height: 38, boxSizing: 'border-box' }}>
      {/* ── 좌 그룹 (flex:1) — 트래픽 라이트 + 사이드바 토글(옵션) + 뒤로/앞으로 ──
           min-width 미지정(=auto=min-content): 좁아져도 버튼이 안 줄고 주소창이 먼저 축소(브라우저식). */}
      <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
        </div>
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="safari-chrome-btn" title="파일 탐색기" aria-label="파일 탐색기" aria-pressed={sidebarOpen} style={{ marginLeft: 2, color: sidebarOpen ? '#1d1d1f' : undefined, background: sidebarOpen ? 'rgba(0,0,0,0.08)' : undefined }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1"><rect x="2" y="3" width="12" height="10" rx="1.6" /><path d="M6.2 3v10" /></svg>
          </button>
        )}
        {/* 뒤로/앞으로 — 미리보기 히스토리 없어 데코(뒤로=활성 톤·앞으로=비활성), 사이 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button className="safari-chrome-btn" title="뒤로" aria-label="뒤로">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span style={{ width: 1, height: 13, background: '#d6d6d8', flexShrink: 0 }} />
          <button className="safari-chrome-btn" title="앞으로" aria-label="앞으로" disabled style={{ cursor: 'default', color: '#c4c4c8' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      {/* ── 중앙 — 주소 pill (좌:홈/스페이서 18px · 주소 · 우:새로고침 18px → 텍스트 정중앙) ── */}
      <div style={{ flex: '0 1 420px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 4px', width: '100%', height: 24, background: '#fff', border: '0.5px solid #d6d6d8', borderRadius: 7, fontSize: 11.5, color: '#1d1d1f' }}>
          {/* 홈 — 항상 노출(OpenCode·갤러리 공통). onHome 없으면 데코(갤러리는 단일 미리보기라 동작 없음). */}
          <button onClick={onHome} className="safari-chrome-btn safari-chrome-btn-sm" title="홈 (기본 미리보기)" aria-label="홈" style={{ flexShrink: 0, width: 18, justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2.6 7.4 8 3l5.4 4.4M4.1 6.5V13h7.8V6.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span style={{ flex: 1, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'var(--font-mono)', color: '#1d1d1f', letterSpacing: '-0.01em' }}>{addr}</span>
          <button onClick={doRefresh} className="safari-chrome-btn safari-chrome-btn-sm" title="새로고침" aria-label="새로고침" style={{ flexShrink: 0, width: 18, justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" style={{ animation: spin ? 'jt-spin 0.72s linear' : 'none' }}><path d="M8.3 5a3.3 3.3 0 1 1-1-2.35M8.3 1.5v2h-2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" /></svg>
          </button>
        </div>
      </div>
      {/* ── 우 그룹 (flex:1) — 새 탭에서 열기 + 주소 복사(둘 다 튜토리얼 숨김) ── */}
      <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
        {!tutorial && (
          <button onClick={doOpen} className="safari-chrome-btn" title="새 탭에서 열기" aria-label="새 탭에서 열기">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9.5 2.8h3.7v3.7M13.2 2.8 7.6 8.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 9.2v2.6a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6V5.6A1.6 1.6 0 0 1 4.2 4h2.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
          </button>
        )}
        {!tutorial && (
          <button onClick={doCopy} className="safari-chrome-btn" title="주소 복사" aria-label="주소 복사" style={copied ? { color: 'var(--c-mint)' } : undefined}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.4 8.4 6.4 11.4 12.6 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5.6" y="5.6" width="7.4" height="7.4" rx="1.6" stroke="currentColor" strokeWidth="1.1" /><path d="M10.4 5.6V4.1A1.6 1.6 0 0 0 8.8 2.5H4.1A1.6 1.6 0 0 0 2.5 4.1v4.7A1.6 1.6 0 0 0 4.1 10.4h1.5" stroke="currentColor" strokeWidth="1.1" /></svg>}
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  JitdaLogo, JitdaIcon, JitdaWordmark, JitdaMark, StatusPill, BrowserChrome, SafariChrome, PhoneFrame,
  AppHeader, SpecNote, StatusBar, Icon,
  avatarLabel,
  ProjectCard, BouncingDots,
});

// ─── 공용 ProjectCard (갤러리 + 운영자 모니터링 공용) ─────────────────
//
//  레이아웃 원칙:
//   · 썸네일(16:10) 위주 — 시각 정보 60%+
//   · 정보 영역은 2행 컴팩트 — 한 화면에 12+ 카드 들어옴
//   · 행 1: [제목 truncate (flex 1)] [메타 슬롯 (flex-shrink 0)]
//   · 행 2: [팀명 · 멤버 (flex 1, truncate)] [보조 메타 (옵션)]
//
//  긴 텍스트 처리:
//   · 제목·팀명: white-space:nowrap + ellipsis. 최소 너비 0 + flex 1.
//   · 메타 슬롯: flex-shrink: 0 으로 절대 줄어들지 않음.
//
//  Props:
//   · thumb         — 썸네일 노드 (보통 <LivePreview/>)
//   · ribbon        — 썸네일 위 리본 ("내 프로젝트" 등)
//   · title         — 1순위 (제목 또는 팀명)
//   · subtitle      — 2순위 (팀명·멤버 또는 상태)
//   · primaryMeta   — 우상단 메타 (좋아요 / 멤버수 / 스텝 칩)
//   · secondaryMeta — 우하단 메타 (댓글수 등, 옵션)
function ProjectCard({ title, subtitle, primaryMeta, secondaryMeta, ribbon, thumb, dim, onClick, dataAction }) {
  return (
    <div
      data-action={dataAction}
      onClick={onClick}
      role={dataAction || onClick ? 'button' : undefined}
      tabIndex={dataAction || onClick ? 0 : undefined}
      className={dataAction || onClick ? 'jt-card-interactive' : ''}
      style={{
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 'var(--r-sm)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        opacity: dim ? 0.5 : 1,
      }}>
      {thumb}

      {ribbon && (
        <span style={{
          position: 'absolute', top: 8, left: 8,
          background: 'var(--c-helmet)', color: 'var(--c-stache)',
          padding: '3px 8px', borderRadius: 3,
          fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em',
          zIndex: 2,
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
        }}>{ribbon}</span>
      )}

      <div style={{ padding: '9px 12px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            flex: 1, minWidth: 0,
            fontSize: 14, fontWeight: 700, lineHeight: 1.3,
            color: 'var(--c-ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</span>
          {primaryMeta && (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>{primaryMeta}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            flex: 1, minWidth: 0,
            fontSize: 11.5, color: 'var(--c-slate)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            display: 'flex', alignItems: 'center',
          }}>{subtitle}</span>
          {secondaryMeta && (
            <span style={{ flexShrink: 0 }}>{secondaryMeta}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// 작은 바운싱 점 — 프리뷰 로딩 / 갤러리 로딩에 공용
function BouncingDots({ size = 5, color }) {
  const dot = (delay) => ({
    width: size, height: size, borderRadius: '50%',
    background: color || 'var(--c-ink)',
    animation: `jt-bounce 1.1s ${delay}s infinite ease-in-out both`,
    display: 'inline-block',
  });
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={dot(0)} />
      <span style={dot(0.15)} />
      <span style={dot(0.3)} />
      <style>{`
        @keyframes jt-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

window.ProjectCard = ProjectCard;
window.BouncingDots = BouncingDots;

// ─── 공용 Pagination (갤러리 + 운영자 모니터링 공용) ─────────────────
//
//  레이아웃: [이전] [from–to / 총 N개] [다음]
//  Props:
//   · page         — 현재 페이지 (1-base)
//   · perPage      — 한 페이지당 항목 수
//   · total        — 총 항목 수 (필터 적용 시 필터 결과 수)
//   · prevDisabled — 이전 버튼 비활성 (보통 page === 1)
//   · nextDisabled — 다음 버튼 비활성 (보통 page * perPage >= total)
//
//  근거: 페이지정의서 §D-1 컴포넌트 #6 — "이전/다음 버튼 + '1–N / 총 N개' 표시"
function Pagination({ page, perPage, total, prevDisabled, nextDisabled }) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
      padding: '20px 0 4px'
    }}>
      <button className={`jt-btn jt-btn-secondary jt-btn-sm ${prevDisabled ? 'is-disabled' : ''}`}
        disabled={prevDisabled}
        style={{ padding: '6px 12px', gap: 4 }}>
        {Icon.arrowLeft(11)} 이전
      </button>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink)',
        background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
        padding: '6px 14px', borderRadius: 4
      }}>
        {from}–{to} <span style={{ color: 'var(--c-muted)' }}>/ 총 {total}개</span>
      </span>
      <button className={`jt-btn jt-btn-secondary jt-btn-sm ${nextDisabled ? 'is-disabled' : ''}`}
        disabled={nextDisabled}
        style={{ padding: '6px 12px', gap: 4 }}>
        다음 {Icon.arrowRight(11)}
      </button>
    </div>
  );
}

window.Pagination = Pagination;

// ─── 공용 멤버 행 (B-2 RosterTeamDetailModal + C-1 C1TeamRoom 공유) ───────
//
//  사용자 피드백 반영 디자인:
//   · 도트가 이름과 한참 떨어진 우측에 있어 시각 연결 약했음 → 아바타 우하단 인디케이터로 통합 (SNS 온라인 상태 패턴)
//   · 성씨 아바타 흐림(opacity 0.45)만으로 미접속 단서 약함 → 행 전체 bg + 이름 색까지 차별화
//   · 줄별 호버 없었음 → useState 기반 hover bg 추가
//   · "나" 표시가 호버 상태처럼 보여 직관적이지 않음 → 좌측 helmet-deep 액센트 바 + 우측 "나" 칩(mono caps, helmet-deep bg + 흰 글자)
//
//  Props: name, color(성씨 hash 색), state('on'|'off'|'pending'), isMe(C-1 한정)
//  UI 정책 (2026-05-27): pending(입장 전)은 off(미접속)과 동일 시각 처리.
//  데이터 모델(API teammates.status)은 3상태 그대로 유지되나, UI는 "접속/비접속" 2상태로 단순화.
//  근거: 운영자 task가 두 케이스 모두 "옆에 가서 확인"으로 같음 + K-12 교사 인지 부담 감소.
//  state prop이 'pending'으로 들어와도 off와 동일 렌더 → 데이터 보존, 시각 통합.
function RosterMemberRow({ name, color, state, isMe }) {
  const on = state === 'on';
  const [hover, setHover] = React.useState(false);

  // 행 bg — 우선순위: isMe > hover > 비접속 > 기본
  const rowBg = isMe ? 'var(--c-helmet-soft)' :
  hover ? 'rgba(20,19,15,0.05)' :
  !on ? 'rgba(20,19,15,0.025)' :
  'transparent';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '7px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderRadius: 6,
        background: rowBg,
        transition: 'background 120ms ease'
      }}>
      {/* 좌측 액센트 바 (isMe 전용) — 직관적 강조, 호버처럼 보이지 않게 */}
      {isMe &&
      <span style={{
        position: 'absolute', left: 2, top: 8, bottom: 8,
        width: 3, borderRadius: 2,
        background: 'var(--c-helmet-deep)'
      }} />
      }

      {/* 아바타 + 우하단 인디케이터 도트 (SNS 패턴) */}
      <div style={{ position: 'relative', flexShrink: 0, marginLeft: isMe ? 4 : 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '-0.04em',
          opacity: on ? 1 : 0.5
        }}>{name.length >= 2 ? name.slice(-2) : name}</div>
        {/* 인디케이터: 아바타 우하단 9px 도트, 흰 외곽 ring으로 분리.
            UI 2상태: on=mint(접속) / 그 외=#c94560(비접속 — `--c-rose` 토큰은 safety orange alias라 인라인 hex). */}
        <span style={{
          position: 'absolute',
          right: -1, bottom: -1,
          width: 9, height: 9, borderRadius: '50%',
          background: on ? 'var(--c-mint)' : '#c94560',
          border: '2px solid var(--c-canvas)'
        }} />
      </div>

      {/* 이름 + (isMe) "나" 칩 + (pending) "미등록" 라벨 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: on ? 'var(--c-ink)' : 'var(--c-muted)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{name}</span>
        {/* "미등록" — 한 번도 안 들어온 사람만 (state==='pending', 데이터상 not_entered).
            UI는 비접속과 같은 시각(rose 도트)으로 통합하되, 이 라벨로 "최초 입장 안 함" 차이 노출.
            mono caps + hairline outline + muted — "나" 칩(helmet solid 강조)보다 약하게. */}
        {state === 'pending' && !isMe &&
        <span className="jt-mono" style={{
          fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '1px 5px', borderRadius: 2,
          background: 'transparent', color: 'var(--c-muted)',
          border: '1px solid var(--c-hairline-strong)',
          fontWeight: 600, flexShrink: 0
        }}>미등록</span>
        }
        {isMe &&
        <span className="jt-mono" style={{
          fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '2px 6px', borderRadius: 2,
          background: 'var(--c-helmet-deep)', color: '#fff',
          fontWeight: 700, flexShrink: 0
        }}>나</span>
        }
      </div>
    </div>);

}

// 공용 푸터 범례 — B-2 모달(2상태) + C-1(3상태) 동일 어휘로 통일.
// 사용자 피드백 "아래쪽 불 디자인이 위쪽에 쓰인것과 달라" — 이모지 🟢🔘⬜ 폐기, 멤버 행 인디케이터와 동일 색 도트.
// UI 2상태 (2026-05-27): 접속 / 비접속. pending 옵션은 데이터 호환 위해 남겨두되 off와 같은 시각.
function RosterLegend({ states = ['on', 'off'] }) {
  const map = {
    on: { dot: { background: 'var(--c-mint)' }, label: '접속' },
    off: { dot: { background: '#c94560' }, label: '미접속' },
    pending: { dot: { background: '#c94560' }, label: '미접속' } // off와 동일 (UI 통합)
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      fontSize: 11.5, color: 'var(--c-muted)',
      fontFamily: 'var(--font-mono)'
    }}>
      {states.map((s) => {
        const m = map[s];
        return (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', ...m.dot }} />
            {m.label}
          </span>);

      })}
    </div>);

}

Object.assign(window, { RosterMemberRow, RosterLegend, ModalSurface });

// ─── 공용 모달 surface (§09e 표준 — 2026-05-27 추출) ──────────────
//
//  배경: 디자인 시스템 §09e Overlay·Modal에 backdrop/z-index/width/animation/A11Y는 정의돼 있으나
//  **모달 surface 자체의 외관(bg/radius/shadow/border/top strip)이 빠져 있어** 각 모달이 인라인으로
//  반복 정의하던 어휘를 통합. 사용자 결정으로 모든 모달에서 hairline border 제거 → shadow만으로 분리.
//
//  Props:
//   · width        — 숫자(px) 또는 'sm'(420)|'md'(560)|'lg'(720)|'xl'(920). 기본 480
//   · topStrip     — null | 'ink'(plain ink 12px) | 'caution'(애니메이션 사선) | 'caution-static'(고정 사선)
//   · entrance     — 'pop' | 'fade' | 'slide' (§09e 표준 3종, 기본 pop)
//   · role         — 'dialog' (기본) | 'alertdialog' (비가역 액션)
//   · variant      — 'default' (기본 — canvas + radius 10 + shadow-modal)
//                  | 'postit'  (.jt-postit-card + .jt-postit-card-static 결합 — tape + 정적 회전)
//                    ※ 'paper' variant 의도적 미지원 — 2026-06-01 deprecated.
//                    postit variant 사용 시 호출부 style로 `--postit-rot`(필수)·`--postit-tint`(선택 — 기본 canvas) 주입.
//   · ariaLabel    / ariaLabelledBy — A11Y
//   · style        — 인라인 추가 스타일 override
//   · children     — 모달 본문
function ModalSurface({
  children,
  width = 480,
  topStrip = null,
  entrance = 'pop',
  role = 'dialog',
  ariaLabel,
  ariaLabelledBy,
  variant = 'default',
  className = '',
  style = {}
}) {
  const widthMap = { sm: 420, md: 560, lg: 720, xl: 920 };
  const W = typeof width === 'number' ? width : (widthMap[width] || 480);
  const stripClass = {
    ink: 'jt-ink-strip',
    caution: 'jt-caution-strip',
    'caution-static': 'jt-caution-strip-static'
  }[topStrip];
  const entranceMod = { pop: '', fade: 'is-fade', slide: 'is-slide' }[entrance] || '';
  // variant === 'postit': .jt-postit-card 어휘로 background·shadow·tape ::before 자동 주입.
  // .jt-postit-card-static로 hover 회전·lift·active 비활성 (모달은 고정 중앙 정렬).
  // overflow:visible — tape ::before가 top:-3px로 카드 위에 튀어나오므로 hidden 금지.
  const isPostit = variant === 'postit';
  const variantClass = isPostit ? 'jt-postit-card jt-postit-card-static' : '';
  const baseStyle = isPostit ? {
    width: W,
    overflow: 'visible',
    display: 'flex', flexDirection: 'column'
  } : {
    width: W,
    background: 'var(--c-canvas)',
    borderRadius: 10,
    boxShadow: 'var(--shadow-modal)',
    // border 없음(2026-05-27 사용자 결정) — backdrop dim + shadow로 경계 충분
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column'
  };
  return (
    <div
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`jt-modal-surface ${entranceMod} ${variantClass} ${className}`.replace(/\s+/g, ' ').trim()}
      style={{ ...baseStyle, ...style }}>
      {stripClass && <div className={stripClass} style={{ flex: '0 0 auto' }} aria-hidden="true" />}
      {children}
    </div>);

}

window.ModalSurface = ModalSurface;
