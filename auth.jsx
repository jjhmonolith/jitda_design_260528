/* A. 인증 영역 — 데스크탑/태블릿 레이아웃
   왼쪽: 브랜드/안내 패널 · 오른쪽: 인증 카드  */

// Shared two-pane shell — variant 별로 좌측 패널만 갈라진다.
//   variant="site"      참가자(A-1) — 작업 시작 전 원본 (jt-blueprint-bg ink + 그리드, 헬멧 노랑 outline tag)
//   variant="blueprint" 운영자(A-2/A-3) — blue-soft + 도면 라인 (건축가 청사진 스튜디오)
// 우측 폼 카드는 두 메타포 공통(paper)으로 유지 — 입력 가독성 보호.
function AuthShell({ children, variant = 'site', leftHeadline, leftTag, leftBody, tabletMode }) {
  const isBlueprint = variant === 'blueprint';
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: tabletMode ? '1fr' : 'minmax(360px, 0.9fr) 1.1fr',
      background: 'var(--c-paper)'
    }}>
        {!tabletMode && (isBlueprint ? (
          /* 운영자 — helmet studio (helmet-soft + stache 도면 라인) */
          <aside className="jt-blueprint-studio-bg" style={{
            color: 'var(--c-stache)',
            padding: '32px 40px 28px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid rgba(20, 19, 15, 0.10)'
          }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
              <JitdaMark size={22} />

              <div style={{ flex: 1 }} />

              <div style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.18em',
                color: 'var(--c-stache)',
                border: '1.5px solid var(--c-stache)',
                padding: '5px 12px',
                marginBottom: 20,
                background: 'rgba(255, 255, 255, 0.45)',
                transform: 'rotate(-1.5deg)'
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--c-helmet-deep)',
                  boxShadow: '0 0 8px var(--c-helmet)'
                }} />
                {leftTag}
              </div>

              <h1 style={{
                fontSize: 38,
                lineHeight: 1.1,
                color: 'var(--c-stache)',
                letterSpacing: '-0.028em',
                marginBottom: 16,
                fontFamily: 'var(--font-display)'
              }}>{leftHeadline}</h1>

              <p style={{
                fontSize: 14,
                color: 'rgba(20, 19, 15, 0.68)',
                lineHeight: 1.6,
                maxWidth: 380
              }}>
                {leftBody}
              </p>

              <div style={{ flex: 1 }} />
            </div>
          </aside>
        ) : (
          /* 참가자 — 작업 시작 전 원본 디자인 (jt-blueprint-bg ink + 헬멧 노랑 outline tag) */
          <aside className="jt-blueprint-bg" style={{
            color: '#fff',
            padding: '32px 40px 28px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
              <JitdaMark size={22} mono />

              <div style={{ flex: 1 }} />

              <div style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.18em',
                color: 'var(--c-helmet)',
                border: '1.5px solid var(--c-helmet)',
                padding: '4px 10px',
                marginBottom: 18,
                transform: 'rotate(-1.5deg)'
              }}>
                {leftTag}
              </div>

              <h1 style={{
                fontSize: 38,
                lineHeight: 1.1,
                color: '#fff',
                letterSpacing: '-0.028em',
                marginBottom: 16,
                fontFamily: 'var(--font-display)'
              }}>{leftHeadline}</h1>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 380 }}>
                {leftBody}
              </p>

              <div style={{ flex: 1 }} />
            </div>
          </aside>
        ))}

        {/* 우측 폼 카드 — variant 공통 (paper + 살짝 격자) */}
        <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        background: 'var(--c-paper)',
        position: 'relative'
      }}>
          <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
            {children}
          </div>
        </section>
      </div>);

}

// ─── A-1 ──────────────────────────────────────────────
function A1CodeLogin() {
  const code = ['8', 'K', '7', 'M', '', ''];
  return (
    <AuthShell
      variant="site"
      leftTag="참가자"
      leftHeadline={<>AI 해커톤에<br />오신 것을 환영합니다.</>}
      leftBody="미리 안내한 6자리 참여 코드를 입력하세요.">
      
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 }}>
          <a data-action="operator-login" style={{ fontSize: 12.5, color: 'var(--c-slate)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
            운영자이신가요?
          </a>
        </div>

        <div style={{ minHeight: 52, marginBottom: 20, display: 'flex', alignItems: 'flex-end' }}>
          <h2 style={{ fontSize: 26, lineHeight: 1.2, margin: 0 }}>참여 코드를 입력해 주세요</h2>
        </div>

        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: 6 }}>이름</label>
        <input className="jt-input" defaultValue="최지유" style={{ marginBottom: 18 }} />

        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: 8 }}>코드</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 28 }}>
          {code.map((c, i) =>
          <div key={i} style={{
            aspectRatio: '1 / 1.15',
            border: c ? '1.5px solid var(--c-stache)' : i === 4 ? '2px solid var(--c-helmet)' : '1.5px solid var(--c-hairline-strong)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--c-stache)',
            background: c ? 'var(--c-canvas)' : i === 4 ? 'var(--c-helmet-soft)' : 'var(--c-paper)',
            boxShadow: i === 4 ? '0 0 0 4px rgba(255,203,5,0.18)' : 'none'
          }}>
              {c}
              {!c && i === 4 &&
            <div style={{ width: 1.5, height: 24, background: 'var(--c-stache)', animation: 'blink 1s infinite' }} />
            }
            </div>
          )}
        </div>
        <button data-action="submit" className="jt-btn jt-btn-lg jt-btn-helmet" style={{ width: '100%' }}>
          해커톤 참여하기 {Icon.arrowRight(15)}
        </button>

        <div style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: '1px solid var(--c-hairline)',
          fontSize: 12.5,
          color: 'var(--c-slate)',
          lineHeight: 1.55,
        }}>
          코드를 잃어버렸나요?
          <br />
          <span style={{ color: 'var(--c-muted)' }}>현장 진행자에게 새 코드를 요청하세요.</span>
        </div>
      </div>
    </AuthShell>);

}

// ─── A-1 에러: 코드를 찾을 수 없음 ──────────────────────────────
function A1CodeInvalid() {
  const code = ['8', 'K', '7', 'M', '2', 'Q'];
  return (
    <AuthShell
      variant="site"
      leftTag="참가자"
      leftHeadline={<>코드가 일치하지<br/>않습니다</>}
      leftBody="6자리 영문 대문자·숫자를 다시 확인해 주세요.">

      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 }}>
          <a data-action="operator-login" style={{ fontSize: 12.5, color: 'var(--c-slate)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
            운영자이신가요?
          </a>
        </div>

        <div style={{ minHeight: 52, marginBottom: 20, display: 'flex', alignItems: 'flex-end' }}>
          <span className="jt-tape-block">⚠ 코드 오류</span>
        </div>

        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: 6 }}>이름</label>
        <input className="jt-input" defaultValue="최지유" style={{ marginBottom: 18 }} />

        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-safety)', marginBottom: 8 }}>코드 · 오류</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 28 }}>
          {code.map((c, i) =>
          <div key={i} style={{
            aspectRatio: '1 / 1.15',
            border: '1.5px solid var(--c-safety)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
            color: 'var(--c-safety)',
            background: 'var(--c-safety-soft)',
          }}>{c}</div>
          )}
        </div>

        <button data-action="retry" className="jt-btn jt-btn-lg jt-btn-helmet" style={{ width: '100%' }}>
          다시 시도하기 {Icon.refresh(14)}
        </button>

        <div style={{
          marginTop: 24, paddingTop: 18,
          borderTop: '1px solid var(--c-hairline)',
          fontSize: 12.5, color: 'var(--c-slate)', lineHeight: 1.55,
        }}>
          코드를 잃어버렸나요?
          <br />
          <span style={{ color: 'var(--c-muted)' }}>현장 진행자에게 새 코드를 요청하세요.</span>
        </div>
      </div>
    </AuthShell>);

}

// ─── A-1 상태: 해커톤 미시작 ───────────────────────────────────
function A1NotStarted() {
  return (
    <AuthShell
      variant="site"
      leftTag="참가자"
      leftHeadline={<>아직 행사가<br/>시작되지 않았어요</>}
      leftBody={<>안내된 시작 시각에 다시 접속해 주세요.<br />운영자가 시작 버튼을 누르면 팀 대기실이 열립니다.</>}>

      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div className="jt-stamp" style={{ color: 'var(--c-blue)', marginBottom: 18 }}>해커톤 · 시작 전</div>

        <h2 style={{ fontSize: 26, lineHeight: 1.25, marginBottom: 10 }}>
          코드 확인 완료
          <br/>
          <span style={{ color: 'var(--c-slate)', fontWeight: 600 }}>곧 시작합니다</span>
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.6, marginBottom: 22 }}>
          <strong style={{ color: 'var(--c-ink)' }}>전북교육청 바이브코딩 캠프</strong>에 정상 등록되었습니다.
          시작 시각이 되면 이 화면이 자동으로 팀 대기실로 전환됩니다.
        </p>

        <div style={{
          width: '100%',
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-hairline)',
          borderRadius: 10,
          padding: '16px 18px',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 16,
          overflow: 'visible',
        }}>
          <div style={{ flexShrink: 0, overflow: 'visible', display: 'flex', alignItems: 'flex-end' }}>
            <JitdaMascot size={54} />
          </div>
          <div style={{ flex: 1, lineHeight: 1.5 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 2 }}>운영자의 시작을 기다리는 중</div>
            <div style={{ fontSize: 12, color: 'var(--c-slate)' }}>접속이 유지되고 있어요.</div>
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: 8 }}>
          <button className="jt-btn jt-btn-secondary" style={{ flex: 1, padding: '12px 16px' }}>{Icon.refresh(13)} 지금 새로고침</button>
          <button className="jt-btn jt-btn-ghost" style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--c-hairline-strong)' }}>{Icon.x(13)} 코드 다시 입력</button>
        </div>

        <p style={{ marginTop: 18, fontSize: 12, color: 'var(--c-muted)' }}>
          시작 시각이 지났는데도 이 화면이 보이면 현장 운영자에게 알려주세요.
        </p>
      </div>
    </AuthShell>);

}

// ─── A-1 상태: 해커톤 종료 ────────────────────────────────────
function A1Ended() {
  return (
    <AuthShell
      variant="site"
      leftTag="참가자"
      leftHeadline={<>이 해커톤은<br/>이미 종료되었어요</>}
      leftBody="팀이 만든 프로젝트는 갤러리에서 계속 볼 수 있습니다.">

      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div className="jt-stamp" style={{ color: 'var(--c-slate)', marginBottom: 18 }}>해커톤 · 종료</div>

        <h2 style={{ fontSize: 26, lineHeight: 1.25, marginBottom: 10 }}>
          전북교육청 바이브코딩 캠프<br/>
          <span style={{ color: 'var(--c-slate)', fontWeight: 600 }}>2026. 05. 18 종료</span>
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.6, marginBottom: 22 }}>
          작업 환경은 더 이상 열 수 없지만 우리 팀이 만든 결과물은 그대로 남아 있습니다.
        </p>

        <div style={{
          width: '100%',
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-hairline)',
          borderRadius: 10,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 18,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'var(--c-stone)', color: 'var(--c-ink-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{Icon.gallery(22)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>우리 팀 프로젝트</div>
            <div style={{ fontSize: 12, color: 'var(--c-slate)' }}>커널 패닉 · "방과후 출석부" · 좋아요 12</div>
          </div>
          <button className="jt-btn jt-btn-primary jt-btn-sm">갤러리 보기 {Icon.arrowRight(11)}</button>
        </div>

        <button className="jt-btn jt-btn-secondary" style={{ width: '100%', padding: '12px 16px', justifyContent: 'flex-start', gap: 10 }}>
          {Icon.arrowLeft(13)} 코드 다시 입력
        </button>
      </div>
    </AuthShell>);

}

// ─── A-1 스페어 코드 클레임 ────────────────────────────────
// v4 기획서: 스페어 코드는 향후 작업으로 분리. 1차에서는 정상 코드 단일 종류만 지원.
// 명단 누락은 어드민이 발급한 "예비 코드"(가짜 이름·이메일 정상 코드)로 대응.
// 따라서 A-1은 코드+이름 단일 폼이며, 폼 전환·이메일 분기는 없다.


// ─── A-3 OAuth callback ────────────────────────────────
// 카피 정책: 개발자 단어(토큰·OAuth·세션·STATUS) 노출 금지. 사용자가 다음에 할 행동에 도움이 되는 정보만.
function A3OAuthCallback() {
  return (
    <AuthShell
      variant="blueprint"
      leftTag="운영자"
      leftHeadline={<>로그인을<br />처리하고 있어요</>}
      leftBody={<>잠시만 기다리시면 자동으로 다음 화면으로 이동합니다.</>}>

      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '2.5px solid var(--c-hairline)',
          borderTopColor: 'var(--c-ink)',
          animation: 'jt-spin 0.9s linear infinite',
          marginBottom: 24
        }} />
        <style>{`@keyframes jt-spin { to { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: 22, lineHeight: 1.3, marginBottom: 8 }}>로그인하는 중이에요</h2>
        <p style={{ fontSize: 13.5, color: 'var(--c-slate)', lineHeight: 1.6 }}>
          Google 인증을 확인하고 있어요.
          <br />
          잠시만 기다려 주세요.
        </p>

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--c-muted)' }}>
          5초 이상 멈추면 <a style={{ color: 'var(--c-ink)', fontWeight: 600 }}>로그인 화면으로 돌아가기 →</a>
        </div>
      </div>
    </AuthShell>);

}

// ─── A-2 Operator login (Google + Email) ──────────────
function A2OperatorLogin() {
  return (
    <AuthShell
      variant="blueprint"
      leftTag="운영자"
      leftHeadline={<>운영자 콘솔에<br />로그인합니다</>}
      leftBody="Google 또는 이메일로 로그인하세요.">

      <div style={{ width: '100%', maxWidth: 440 }}>
        <h2 style={{ fontSize: 26, lineHeight: 1.2, marginBottom: 6 }}>운영자 로그인</h2>
        <p style={{ fontSize: 13.5, color: 'var(--c-slate)', marginBottom: 24, lineHeight: 1.55 }}>로그인하면 관리중인 해커톤을 확인할 수 있어요.

        </p>

        {/* Google */}
        <button data-action="google" className="jt-btn jt-btn-secondary" style={{
          width: '100%', padding: '13px 16px', fontSize: 14,
          justifyContent: 'center', gap: 10, marginBottom: 18
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.581-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
          </svg>
          <span>Google 계정으로 로그인</span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 18px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
          <span className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.16em' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
        </div>

        {/* Email form */}
        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: 6, display: 'block' }}>이메일</label>
        <input className="jt-input" defaultValue="park@school.go.kr" style={{ marginBottom: 12 }} />

        <label className="jt-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: 6, display: 'block' }}>비밀번호</label>
        <input className="jt-input" type="password" defaultValue="••••••••••" style={{ marginBottom: 18 }} />

        <button data-action="email" className="jt-btn jt-btn-primary" style={{ width: '100%', padding: '13px 16px', fontSize: 14, marginBottom: 14 }}>
          이메일로 로그인 {Icon.arrowRight(14)}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--c-slate)' }}>
          <a style={{ color: 'var(--c-slate)', textDecoration: 'underline', textUnderlineOffset: 3 }}>비밀번호 재설정</a>
          <a data-action="signup" style={{ color: 'var(--c-ink)', fontWeight: 600 }}>운영자 회원가입 →</a>
        </div>

        <div style={{
          marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--c-hairline)',
          fontSize: 12.5, color: 'var(--c-slate)', textAlign: 'center'
        }}>
          참가자이신가요? <a style={{ color: 'var(--c-ink)', fontWeight: 600 }}>코드로 참여 →</a>
        </div>
      </div>
    </AuthShell>);

}

// ─── A-2 변형: Google 로그인 진행 중 ──────────────────────────
function A2GoogleInFlight() {
  return (
    <AuthShell
      variant="blueprint"
      leftTag="운영자"
      leftHeadline={<>팝업 창에서<br/>계속해 주세요</>}
      leftBody={<>새 창에서 Google 인증을 마치면 자동으로 돌아옵니다.<br />창이 보이지 않으면 팝업 차단을 확인하세요.</>}>

      <div style={{ width: '100%', maxWidth: 440 }}>
        <h2 style={{ fontSize: 26, lineHeight: 1.2, marginBottom: 24 }}>운영자 로그인</h2>

        {/* Google 진행 중 버튼 */}
        <button className="jt-btn jt-btn-secondary is-disabled" disabled style={{
          width: '100%', padding: '13px 16px', fontSize: 14,
          justifyContent: 'center', gap: 10, marginBottom: 14,
          opacity: 1, background: 'var(--c-canvas)',
          borderColor: 'var(--c-blueprint)',
          color: 'var(--c-blueprint)',
        }}>
          <span style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid currentColor', borderTopColor: 'transparent',
            animation: 'jt-spin 0.9s linear infinite',
          }} />
          <span>Google 로그인 창에서 계속하세요…</span>
        </button>
        <style>{`@keyframes jt-spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{
          background: 'var(--c-blue-soft)',
          border: '1px solid #c8d4e3',
          borderRadius: 6,
          padding: '12px 14px',
          fontSize: 12.5,
          color: 'var(--c-blueprint)',
          lineHeight: 1.55,
          marginBottom: 18,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            {Icon.info(13)} 30초 후 자동으로 취소됩니다
          </div>
          <div style={{ color: '#3e5876' }}>
            창이 안 보이면 브라우저 작업표시줄을 확인하세요. 계속 안 열리면 아래 이메일 로그인을 사용할 수 있습니다.
          </div>
        </div>

        <button className="jt-btn jt-btn-ghost" style={{
          width: '100%', padding: '10px', fontSize: 13,
          border: '1px solid var(--c-hairline-strong)', marginBottom: 18,
        }}>
          {Icon.x(13)} 취소하고 다시 로그인
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 18px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
          <span className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.16em' }}>또는 · 이메일</span>
          <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
        </div>

        <input className="jt-input" placeholder="이메일" style={{ marginBottom: 8, opacity: 0.5 }} disabled />
        <input className="jt-input" type="password" placeholder="비밀번호" style={{ opacity: 0.5 }} disabled />
      </div>
    </AuthShell>);

}

// ─── A-2 변형: 팝업 차단 안내 ─────────────────────────────────
function A2PopupBlocked() {
  return (
    <AuthShell
      variant="blueprint"
      leftTag="운영자"
      leftHeadline={<>팝업이 막혀서<br/>창이 안 열렸어요</>}
      leftBody={<>학교·기관 브라우저는 팝업을 기본 차단하는 경우가 많습니다.<br />두 가지 우회 경로를 안내합니다.</>}>

      <div style={{ width: '100%', maxWidth: 460 }}>
        <h2 style={{ fontSize: 24, lineHeight: 1.25, marginBottom: 6 }}>로그인 창이 안 열렸어요</h2>
        <p style={{ fontSize: 13.5, color: 'var(--c-slate)', marginBottom: 22, lineHeight: 1.55 }}>
          이 브라우저가 Google 로그인 팝업을 차단했습니다.
        </p>

        {/* 옵션 A — 같은 페이지 리다이렉트 */}
        <div style={{
          border: '1.5px solid var(--c-ink)',
          background: 'var(--c-canvas)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
        }}>
          <div className="jt-mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--c-ink)', marginBottom: 6 }}>옵션 A · 추천</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>이 창에서 바로 인증하기</h3>
          <p style={{ fontSize: 12.5, color: 'var(--c-slate)', marginBottom: 12, lineHeight: 1.5 }}>
            팝업 없이 이 페이지에서 Google로 이동했다가 자동으로 돌아옵니다.
          </p>
          <button className="jt-btn jt-btn-primary" style={{ width: '100%', padding: '12px 16px', fontSize: 14 }}>
            리다이렉트로 로그인 {Icon.external(14)}
          </button>
        </div>

        {/* 옵션 B — 팝업 해제 */}
        <div style={{
          border: '1px solid var(--c-hairline)',
          background: 'var(--c-canvas)',
          borderRadius: 8,
          padding: 14,
          marginBottom: 12,
        }}>
          <div className="jt-mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--c-slate)', marginBottom: 6 }}>옵션 B</div>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>팝업 허용 후 다시 시도</h3>
          <ol style={{ fontSize: 12.5, color: 'var(--c-slate)', paddingLeft: 18, lineHeight: 1.7, margin: 0 }}>
            <li>주소창 오른쪽의 <strong style={{ color: 'var(--c-ink)' }}>차단 아이콘</strong>을 클릭</li>
            <li>"jitda.io의 팝업 항상 허용" 선택</li>
            <li>아래 버튼을 다시 누르세요</li>
          </ol>
          <button className="jt-btn jt-btn-secondary" style={{ width: '100%', padding: '10px 14px', fontSize: 13, marginTop: 12 }}>
            {Icon.refresh(13)} 다시 시도
          </button>
        </div>

        {/* 옵션 C — 이메일 폴백 */}
        <div style={{
          fontSize: 12.5, color: 'var(--c-slate)', textAlign: 'center', padding: '8px 0',
        }}>
          또는 <a style={{ color: 'var(--c-ink)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>이메일+비밀번호 로그인</a>으로 우회
        </div>
      </div>
    </AuthShell>);

}

// ─── A-3 변형: 인증 실패 + 5초 카운트다운 ─────────────────────
// 카피 정책: googleError · state mismatch 같은 개발자 식별자 노출 금지.
// 사용자가 다음에 무엇을 해야 하는지(다시 시도 / 이메일로 로그인)에만 집중.
function A3OAuthFailed() {
  return (
    <AuthShell
      variant="blueprint"
      leftTag="운영자"
      leftHeadline={<>로그인을 마치지<br/>못했어요</>}
      leftBody={<>다시 시도하거나 이메일로 로그인할 수 있어요.</>}>

      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <span className="jt-tape" style={{ marginBottom: 24 }}>⚠ 로그인 실패</span>

        <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.6, marginBottom: 24 }}>
          잠깐의 문제일 수 있어요.
          <br />
          다시 시도하면 대부분 해결됩니다.
        </p>

        <div style={{ width: '100%', display: 'flex', gap: 8, marginBottom: 14 }}>
          <button data-action="back-to-login" className="jt-btn jt-btn-secondary" style={{ flex: 1, padding: '12px 14px' }}>{Icon.arrowLeft(13)} 로그인으로 돌아가기</button>
          <button data-action="retry" className="jt-btn jt-btn-primary" style={{ flex: 1, padding: '12px 14px' }}>{Icon.refresh(13)} 다시 시도</button>
        </div>

        <div style={{
          width: '100%',
          padding: '8px 12px',
          background: 'var(--c-stone)',
          borderRadius: 6,
          fontSize: 12, color: 'var(--c-slate)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>5초 후 자동으로 돌아갑니다</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--c-ink)', fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid var(--c-ink-3)', borderRightColor: 'transparent',
              animation: 'jt-spin 1.2s linear infinite',
            }} />
            03
          </span>
        </div>
      </div>
    </AuthShell>);

}

// ─── A-4 Operator signup (email + 약관 동의) ──────────────
// 좌측: blueprint variant + "OPERATOR · 운영자" 태그 + 큰 헤드라인
// 우측: 폼(이름·이메일·비밀번호·확인) + "전체 동의" 배너 + 약관 3종 (.jt-checkbox 신규 primitive)
// 참고: 디자인 시스템에 체크박스가 없어 .jt-checkbox 정식 등록(2026-05-29 tokens.css §Checkbox).
//      `.jt-switch`(iOS 토글)는 "기능 on/off 상태", 약관 동의는 "선택·확인 행위"로 의미가 다르므로 분리.
function A4OperatorSignup() {
  const required = <span className="jt-checkbox-required">(필수)</span>;
  const labelStyle = { fontSize: 12.5, color: 'var(--c-ink)', fontWeight: 600, marginBottom: 8, display: 'block' };
  return (
    <AuthShell
      variant="blueprint"
      leftTag="OPERATOR · 운영자"
      leftHeadline={<>운영자 계정을<br/>만듭니다</>}
      leftBody="이메일로 가입하고 직접 해커톤을 운영해 보세요.">

      <div style={{ width: '100%', maxWidth: 460 }}>
        <h2 style={{ fontSize: 26, lineHeight: 1.2, marginBottom: 6 }}>운영자 회원가입</h2>
        <p style={{ fontSize: 13.5, color: 'var(--c-slate)', marginBottom: 24, lineHeight: 1.55 }}>
          가입하면 해커톤을 운영할 수 있어요.
        </p>

        {/* 이름 */}
        <label style={labelStyle}>이름 {required}</label>
        <input className="jt-input" placeholder="박운영" style={{ marginBottom: 18 }} />

        {/* 이메일 */}
        <label style={labelStyle}>이메일 {required}</label>
        <input className="jt-input" placeholder="park@school.go.kr" style={{ marginBottom: 18 }} />

        {/* 비밀번호 + 도움말 */}
        <label style={labelStyle}>비밀번호 {required}</label>
        <input className="jt-input" type="password" placeholder="8자 이상, 영문·숫자 포함" style={{ marginBottom: 6 }} />
        <p style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          8자 이상, 영문과 숫자를 포함해 주세요.
        </p>

        {/* 비밀번호 확인 */}
        <label style={labelStyle}>비밀번호 확인 {required}</label>
        <input className="jt-input" type="password" placeholder="비밀번호를 다시 입력" style={{ marginBottom: 20 }} />

        {/* 전체 동의 배너 (그룹 헤더) */}
        <div className="jt-checkbox-banner" role="button" tabIndex={0}>
          <button
            type="button"
            role="checkbox"
            aria-checked="false"
            aria-label="전체 항목에 동의"
            className="jt-checkbox"
            data-action="agree-all">
            {Icon.check(13)}
          </button>
          <span>전체 항목에 동의합니다.</span>
        </div>

        {/* 약관 그룹 라벨 */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.14em',
          color: 'var(--c-muted)',
          margin: '20px 0 0',
          textTransform: 'uppercase',
        }}>약관 및 정보 이용 동의</div>

        {/* 개별 약관 3종 */}
        <div style={{ marginTop: 4 }}>
          {[
            { id: 'privacy', label: '개인정보 처리 방침' },
            { id: 'tos',     label: '서비스 이용 약관' },
            { id: 'collect', label: '개인정보 수집 동의' },
          ].map((it) => (
            <label key={it.id} className="jt-checkbox-row" htmlFor={`agree-${it.id}`}>
              <button
                id={`agree-${it.id}`}
                type="button"
                role="checkbox"
                aria-checked="false"
                className="jt-checkbox"
                data-action={`agree-${it.id}`}>
                {Icon.check(12)}
              </button>
              <span className="jt-checkbox-label">
                {it.label} {required}
              </span>
              <a className="jt-checkbox-link" data-action={`view-${it.id}`}>
                내용 보기 ›
              </a>
            </label>
          ))}
        </div>

        {/* 가입하기 — 미동의 상태 disabled (회색) */}
        <button
          data-action="submit"
          disabled
          className="jt-btn jt-btn-primary is-disabled"
          style={{
            width: '100%', padding: '14px 16px', fontSize: 14,
            marginTop: 24, marginBottom: 14,
            opacity: 0.55, cursor: 'not-allowed',
            background: 'var(--c-ink-3)', borderColor: 'var(--c-ink-3)',
          }}>
          가입하기 {Icon.arrowRight(14)}
        </button>

        <div style={{
          paddingTop: 16, borderTop: '1px solid var(--c-hairline)',
          fontSize: 12.5, color: 'var(--c-slate)', textAlign: 'center'
        }}>
          이미 계정이 있으신가요? <a data-action="back-to-login" style={{ color: 'var(--c-ink)', fontWeight: 600 }}>로그인 →</a>
        </div>
      </div>
    </AuthShell>);

}

Object.assign(window, {
  A1CodeLogin, A1CodeInvalid, A1NotStarted, A1Ended,
  A2OperatorLogin, A2GoogleInFlight, A2PopupBlocked,
  A3OAuthCallback, A3OAuthFailed,
  A4OperatorSignup,
});