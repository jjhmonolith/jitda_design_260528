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

function JitdaIcon({ size = 36, mono = false }) {
  // 캐릭터(병아리) 단독. viewBox는 원본 SVG에서 캐릭터 영역만 잘라낸 박스.
  // mono=true → 다크 디테일(눈·콧수염)만 흰색 스왑. 노란 몸체·악센트는 브랜드 식별 위해 어두운 배경에서도 유지.
  const ink = mono ? '#ffffff' : '#3f3934';
  const body = '#ffce2c';
  const bodyAccent = '#e9ad03';
  const VB_W = 230, VB_H = 200;
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
      {/* 패스 순서는 원본 jitda_logo.svg와 동일 — 본디 노란 몸체가 마지막에 그려져 눈 위쪽 일부를 자연스럽게 가린다. 순서 바꾸면 "눈이 모자 밖으로 튀어나옴" 버그. */}
      <circle fill={ink} cx="165.56" cy="196.37" r="15.27"/>
      <circle fill={ink} cx="63.8" cy="196.37" r="15.27"/>
      <path fill={ink} d="M123.33,205.18c-1.15-1.53-2.93-2.41-4.84-2.41h-7.94c-1.91,0-3.69.88-4.84,2.41-5.24,6.95-20.94,27.08-33.19,35.44-1.65,1.13-.91,3.69,1.09,3.69h20.6l20.31-22.73,20.31,22.73h20.6c2,0,2.74-2.56,1.09-3.69-12.24-8.36-27.95-28.49-33.18-35.44Z"/>
      <path fill={bodyAccent} d="M142.5,104.68c1.37.13,3.05-.71,3.21-2.2.88-8.38,1.95-16.54,3.84-24.79,1.49-6.54,3.04-12.91,5.53-19.03-3.22-1.59-6.54-2.97-10.04-4.21-1.76-.62-3.39-1.27-5.36-1.54l-.05,49.34c0,1.51,1.65,2.31,2.87,2.43Z"/>
      <path fill={bodyAccent} d="M76.28,65.06c.02.07.04.15.06.23.02.08.03.16.04.25.04.25.07.52.17.75.09.23-.2.59.08.69l.31.5c.59,2.13,1.14,4.27,1.66,6.41.17.72.34,1.43.5,2.15.33,1.43.63,2.87.93,4.31.15.72.29,1.44.43,2.17.26,1.35.5,2.7.72,4.05.03.19.06.39.1.58.22,1.36.44,2.72.63,4.09.52,3.65.94,7.32,1.27,11.01.02.19.05.37.11.54.03.09.06.17.1.25.07.16.16.31.27.45.1.14.22.27.35.39.13.12.27.22.42.32.22.14.46.25.71.34.08.03.17.05.25.07.25.07.51.1.76.11.09,0,.19,0,.28,0,.29-.02.57-.06.85-.14.18-.05.36-.12.53-.19.51-.23.95-.59,1.22-1.06.18-.31.28-.68.28-1.1l.02-37.92-.03-11.38c-5.34,1.43-10.35,3.39-15.25,5.68l.74,2.16,1.49,4.31Z"/>
      <path fill={body} d="M224.15,164.76c-1.59-7.38-5.45-15.08-13.34-17.77l-.14-11.8c-.07-1.17-.16-2.34-.26-3.5-.63-7.16-1.88-14.19-4.15-21.1-.2-.6-.4-1.19-.61-1.79-3.49-9.84-8.73-18.96-15.46-27.2-6.66-8.16-14.67-15.01-23.92-20.53l-6.5-3.63c-1.35-.75-4.04-.28-4.65,1.23-2.49,6.12-4.04,12.49-5.53,19.03-1.88,8.25-2.96,16.41-3.84,24.79-.16,1.49-1.84,2.33-3.21,2.2-1.22-.12-2.87-.92-2.87-2.43l.05-49.34-.03-2.21c-.06-4.79-6.91-7.09-11.82-8.06-4.41-.88-8.89-1.31-13.36-1.3-4.36,0-8.72.43-13.03,1.27-5.18,1-11.57,3.06-12.02,8.1-.07.79-.13,1.56-.12,2.2l.03,11.37-.02,37.92c0,.42-.11.79-.28,1.1-.27.47-.71.82-1.23,1.06-.17.08-.35.14-.53.19-.28.08-.56.12-.85.14-.09,0-.19,0-.28,0-.25,0-.51-.04-.76-.11-.08-.02-.17-.05-.25-.07-.25-.09-.49-.2-.71-.34-.15-.09-.29-.2-.42-.32s-.25-.25-.35-.38c-.1-.14-.19-.29-.27-.45-.04-.08-.07-.16-.1-.25-.06-.17-.09-.35-.11-.54-.11-1.3-.31-2.58-.45-3.87-.07-.89-.16-1.81-.29-2.81-.09-.74-.19-1.41-.28-2.12-.1-.74-.15-1.48-.25-2.21-.2-1.36-.41-2.73-.63-4.09-.03-.15-.05-.31-.08-.46-2.97-18.93-6.45-26.61-7.08-27.89l-.07-.21c-1.06-1.32-2.73-1.83-4.6-1.21-14.3,7.21-26.49,17.59-35.2,30.36-3.38,4.95-6.23,9.92-8.54,15.36-1.11,2.61-2.12,5.23-3,7.87-1.78,5.33-3.04,10.76-3.56,16.4l-.42,4.62-.37,4-.1,10.99c-8.13,2.82-12.33,11.19-13.53,18.91-.3,1.94.67,3.88,2.43,4.97,2.81,1.74,5.8,2.93,9,4.2,3.52,1.4,7.07,2.7,10.67,3.92,9.8,3.31,19.86,5.93,30.08,7.94,16.75,3.3,33.92,4.94,50.99,5.21h6.58s6.44,0,6.44,0c15.64-.37,31.15-1.6,46.56-4.37,1.3-.23,2.6-.48,3.9-.73,10.06-1.96,19.93-4.47,29.57-7.62,3.28-1.07,6.55-2.22,9.78-3.44l9.99-4.39c2.91-1.28,4.02-3.94,3.4-6.82Z"/>
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

function JitdaMark({ size = 26, mono = false, iconSize, gap }) {
  // size = "jitda" 워드마크 높이(px). iconSize 미지정 시 size*1.55(아이콘이 한 단계 크게).
  // gap = 워드마크/아이콘 간 간격(px). 미지정 시 size*0.32.
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
      aria-label="짓다 Jitda"
    >
      <JitdaIcon size={icon} mono={mono} />
      <JitdaWordmark size={size} mono={mono} />
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
function AppHeader({ breadcrumb, user, actions }) {
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
        <JitdaMark size={13} />
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
};

// 디자인 시스템 — 아바타 라벨: 한글 이름 뒤 2글자 ("김민준" → "민준", "최유나" → "유나").
// 1글자 등록 fallback. 모든 아바타 (참가자·운영자·rejected outcomes 등) 공통 사용.
// 2026-05-29: 기존 첫 글자(성씨) 노출 폐기 — 동성 다인 팀 식별 불가 문제 + 친근감 향상.
function avatarLabel(name) {
  if (!name) return '';
  return name.length >= 2 ? name.slice(-2) : name;
}

Object.assign(window, {
  JitdaLogo, JitdaIcon, JitdaWordmark, JitdaMark, StatusPill, BrowserChrome, PhoneFrame,
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
