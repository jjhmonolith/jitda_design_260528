/* E. 공통 다이얼로그/오버레이
   E-1. 프로젝트 설정 다이얼로그 — 코딩 환경에서 "내 프로젝트" 클릭 시
   E-4. 합의 투표 — 팀 캔버스에서 "전송 요청" 클릭 시
   E-5. AI 선택지 투표 — AI가 선택지를 제시했을 때
*/

// ── AI 자동 채우기 버튼 ─────────────────────────────────
// jt-btn-sm 사이즈에 맞춰 다이얼로그 톤과 조화. AI 느낌은 절제된 디테일로:
//  · canvas 바탕 + helmet-deep ↔ helmet 그라데이션 텍스트(WebKit clip)
//  · 작은 sparkle SVG 가 은은하게 펄스 (1.6s 루프)
//  · 호버 시: 보더만 진해지고 sparkle 깜빡임 가속
//  · 로딩: sparkle 회전 + "분석 중…" 라벨
// AI 자동 채우기 버튼 — 디자인 시스템 `.jt-btn-critical` shine sweep 어휘 적용
// (검정 본체 + helmet 글자 + helmet ring + shine sweep — 한 화면 단일 핵심 액션)
// sparkle 아이콘은 helmet 색으로 그대로 유지 (AI 정체성)
function AiAutofillButton({ loading: loadingProp = false }) {
  const [loading, setLoading] = React.useState(loadingProp);
  const onClick = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1800); // 시연용
  };

  return (
    <>
      <style>{`
        @keyframes ai-sparkle-pulse { 0%,100% { opacity: 0.85; transform: scale(0.95) rotate(0deg); } 50% { opacity: 1; transform: scale(1.1) rotate(15deg); } }
      `}</style>
      <button
        onClick={onClick}
        title="현재 미리보기를 분석해 제목·목적·사용법을 자동으로 채워요"
        className={`jt-btn ${loading ? 'jt-btn-critical-static' : 'jt-btn-critical'} jt-btn-sm`}
        style={{
          cursor: loading ? 'progress' : 'pointer',
        }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14,
          color: 'var(--c-helmet)',
          animation: loading
            ? 'jt-spin 1.1s linear infinite'
            : 'ai-sparkle-pulse 1.6s ease-in-out infinite',
        }}>
          <SparkleSVG size={13} />
        </span>
        {loading ? '분석 중…' : 'AI로 자동 채우기'}
      </button>
    </>
  );
}

function SparkleSVG({ size = 12, style }) {
  // 4-point sparkle (별표/십자형)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M12 2 L13.5 9 L20.5 10.5 L13.5 12 L12 19 L10.5 12 L3.5 10.5 L10.5 9 Z"/>
    </svg>
  );
}

// ── E-1. 프로젝트 설정 다이얼로그 ──────────────────────────────
// 화면 상태: 비공개 기본 / 공개 활성화 / 저장 중 / 저장 완료 / 미저장
//
// 2026-05-27 v2 — B-2 모달 표준 정렬 (사용자 피드백 반영):
//   · 셸: width 560, radius 10, hairline border, overflow hidden (B-2 패턴)
//   · 상단 jt-caution-strip-static (정적 사선 12px) — 모든 stateVariant 동일
//     (애니메이션 사선은 E1UnsavedCloseConfirm 미저장 닫기 경고 모달 한정)
//   · X 닫기 버튼 제거 — 닫기는 푸터 [취소]·[닫기]로 처리 (B-2 모달 전부 X 없음)
//   · 헤더는 본문 패딩 안의 h2(20) + p(13 slate) (B-2 표준)
//   · 안내 박스 = paper bg + hairline + radius 6 (B-2 안내 박스 패턴)
function E1ProjectSettings({ stateVariant = 'editing' }) {
  // 컨텍스트: 1인팀 코딩 환경(C-3) 위에 떠 있는 모달
  const isPublic = stateVariant !== 'private';
  const isSaving = stateVariant === 'saving';
  const isSaved = stateVariant === 'saved';
  const hasUnsaved = stateVariant === 'unsaved';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      {/* 배경 컨텍스트 — 흐릿하게 코딩 환경 일부 보임 */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <BlurredCodingBackground />

        {/* dim overlay */}
        <div className="jt-modal-backdrop" />

        {/* 다이얼로그 — B-2 모달 셸 표준 (outer border 없음, 그림자만으로 분리) */}
        <div role="dialog" aria-modal="true" aria-labelledby="e1-settings-title" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 560,
          background: 'var(--c-canvas)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-modal)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '88%',
          overflow: 'hidden',
          animation: 'jt-modal-pop-in var(--dur-base) var(--ease-standard)',
        }}>
          {/* 상단 caution-strip — 항상 정적 (애니메이션은 미저장 닫기 경고 모달 한정) */}
          <div className="jt-caution-strip-static" aria-hidden="true" />

          {/* 헤더 — B-2 표준 (h2 + p, X 버튼 없음).
              인터랙션 모달이므로 디자인 시스템 §HEADER DIVIDER 룰에 따라 헤더 아래 hairline 필수 */}
          <div style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid var(--c-hairline)',
            flexShrink: 0,
          }}>
            <h2 id="e1-settings-title" style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>
              갤러리에 어떻게 보여줄까요?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55, margin: 0 }}>
              방문자에게 어떤 앱인지 보여주는 정보를 설정해요.
            </p>
          </div>

          {/* 본문 — 스크롤 영역 */}
          <div style={{
            flex: 1,
            padding: '18px 28px',
            display: 'flex', flexDirection: 'column', gap: 14,
            overflow: 'auto',
          }}>
            {/* 갤러리 공개 토글 — B-2 안내 박스 패턴 (paper bg + hairline + r-sm). ON 시 border mint */}
            <div style={{
              background: 'var(--c-paper)',
              border: `1px solid ${isPublic ? 'var(--c-mint)' : 'var(--c-hairline)'}`,
              borderRadius: 'var(--r-sm)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color var(--dur-fast) var(--ease-standard)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c-ink)' }}>
                    갤러리에 공개하기
                  </span>
                  {isPublic && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: 'var(--c-mint-soft)', color: 'var(--c-mint)',
                      padding: '2px 8px', borderRadius: 999,
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-mint)' }} />
                      ON
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--c-slate)', lineHeight: 1.5 }}>
                  지금 만들고 있는 앱이 갤러리에 노출되고, 다른 참가자가 살펴볼 수 있어요.
                </div>
              </div>
              <button style={{
                width: 44, height: 24,
                background: isPublic ? 'var(--c-ink)' : 'var(--c-hairline-strong)',
                borderRadius: 999,
                border: 'none', cursor: 'pointer',
                position: 'relative', flexShrink: 0,
                transition: 'background var(--dur-fast) var(--ease-standard)',
              }} aria-pressed={isPublic} aria-label="갤러리에 공개하기">
                <span style={{
                  position: 'absolute',
                  top: 3, left: isPublic ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left var(--dur-fast) var(--ease-standard)',
                }} />
              </button>
            </div>

            {/* Progressive Disclosure — 공개 ON 일 때만 하위 필드 노출 */}
            {isPublic ? (
              <>
                {/* 정보 입력 그룹 헤더 + AI 자동 채우기 */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 6,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 2 }}>
                      갤러리에 보여줄 정보
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>
                      방문자에게 어떤 앱인지 알려주세요
                    </div>
                  </div>
                  <AiAutofillButton />
                </div>

                <FieldRow label="제목" hint="갤러리 카드에 크게 표시돼요" counter="14 / 255">
                  <input className="jt-input" defaultValue="AI 일정관리 봇" />
                </FieldRow>

                <FieldRow label="목적" hint="이 앱이 무엇을 도와주는 도구인지 짧게">
                  <textarea className="jt-input" rows={3} style={{ resize: 'none', lineHeight: 1.55 }}
                    defaultValue={'강의 시간표 사진 한 장이면 끝. OCR로 일정을 뽑아 카톡으로 D-1 알림까지 자동으로 보내요.'} />
                </FieldRow>

                <FieldRow label="사용법" hint="한 줄에 한 단계씩 적으면 1·2·3 으로 보여줘요">
                  <textarea className="jt-input" rows={4} style={{ resize: 'none', lineHeight: 1.55, fontFamily: 'var(--font-body)' }}
                    defaultValue={'시간표 사진을 업로드합니다\n인식된 일정을 확인합니다\nD-1 카톡 알림을 켭니다'} />
                </FieldRow>

                {/* 공개 URL — B-2 안내 박스 패턴 */}
                <div style={{ marginTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-ink)' }}>공개 URL</span>
                    <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>· 갤러리 방문자가 접속할 주소</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--c-paper)',
                    border: '1px solid var(--c-hairline)',
                    borderRadius: 'var(--r-sm)',
                    padding: '10px 12px',
                  }}>
                    <span className="jt-dot live" aria-hidden="true" />
                    <span style={{
                      flex: 1, minWidth: 0,
                      fontFamily: 'var(--font-mono)', fontSize: 12.5,
                      color: 'var(--c-ink)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>terminal-safari.jitda.app</span>
                    <button className="jt-btn jt-btn-secondary jt-btn-sm" style={{ gap: 5 }}>
                      {Icon.copy(11)} 복사
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* 비공개 상태 — B-2 안내 박스 패턴 + SVG lock 아이콘 */
              <div style={{
                background: 'var(--c-paper)',
                border: '1px solid var(--c-hairline)',
                borderRadius: 'var(--r-sm)',
                padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--c-stone)', color: 'var(--c-ink-3)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 4 }}>
                    공개하면 더 자세히 알려줄 수 있어요
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--c-ink-2)', lineHeight: 1.55 }}>
                    갤러리에 공개되면 제목·목적·사용법을 입력해 다른 참가자에게 어떤 앱인지 보여줄 수 있어요. 해커톤이 종료되면 자동으로 공개돼요.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 — 상태 인디케이터 좌측, 액션 버튼 우측 (B-2 모달 패턴, 별도 구분선 없음) */}
          <div style={{
            padding: '14px 28px 22px',
            display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0,
          }}>
            {hasUnsaved && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: 'var(--c-amber)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--c-amber)',
                  animation: 'jt-status-pulse 1.8s var(--ease-decelerate) infinite',
                }} />
                저장되지 않은 변경
              </span>
            )}
            {isSaving && (
              <span style={{ fontSize: 12, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="jt-spin" style={{
                  width: 10, height: 10, borderRadius: '50%',
                  border: '2px solid var(--c-hairline-strong)',
                  borderTopColor: 'var(--c-ink)',
                }} />
                저장 중…
              </span>
            )}
            {isSaved && (
              <span style={{ fontSize: 12, color: 'var(--c-mint)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {Icon.check(12)}
                저장 완료 · 갤러리에 반영됐어요
              </span>
            )}
            <div style={{ flex: 1 }} />
            <button data-action="cancel" className="jt-btn jt-btn-secondary">{isSaved ? '닫기' : '취소'}</button>
            <button data-action="save" className={`jt-btn jt-btn-primary ${isSaving || isSaved ? 'is-disabled' : ''}`} style={isSaved ? {
              background: 'var(--c-mint)', borderColor: 'var(--c-mint)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            } : undefined}>
              {isSaving ? '저장 중…' : isSaved ? (
                <>
                  {Icon.check(12)}
                  저장됨
                </>
              ) : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, hint, counter, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-ink)' }}>{label}</span>
        {hint && <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>· {hint}</span>}
        <div style={{ flex: 1 }} />
        {counter && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)' }}>{counter}</span>}
      </div>
      {children}
    </div>
  );
}

// 흐릿한 OpenCode 배경 — 모달이 어디서 떴는지 컨텍스트 제공
function BlurredCodingBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      filter: 'blur(3px) saturate(0.7)',
      pointerEvents: 'none',
      background: '#0d0d11',
    }}>
      <div style={{ height: 42, background: '#0d0d11', borderBottom: '1px solid #1c1c22' }} />
      <div style={{ padding: 32 }}>
        <div style={{ width: 240, height: 14, background: '#2a2a32', borderRadius: 3, marginBottom: 18 }} />
        <div style={{
          background: '#1a1a20',
          border: '1px solid #232329',
          borderRadius: 4,
          padding: 16,
          marginBottom: 20,
          height: 40,
        }} />
        {[90, 70, 80, 60].map((w, i) => (
          <div key={i} style={{ height: 10, background: '#1a1a20', borderRadius: 2, marginBottom: 10, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}


// ── E-4. 합의 투표 (캔버스 내) ────────────────────────────────
// 시나리오: 팀 캔버스(C-4) 위에 합의 투표 풀스크린 오버레이가 떠 있는 상태.
// LoL 매치 수락 화면의 어휘를 짓다 공사장 브랜드(헬멧 노랑·안전 테이프)로 흡수.
//
// 룰 (2026-05-26 사용자 결정):
//  · 정족수 = 만장일치 (어드민 설정 옵션 제거). 접속 중인 팀원 전원 동의.
//  · 타임아웃 15초 (이전 10초). 미응답 시 자동 거절.
//  · 프롬프트 모달 열린 동안에도 타이머 계속 흐름 (우상단 미니 링으로 가시화).
//  · 거절 안내 헤드라인은 고정 문구 "합의가 무산됐어요" — 이름 명시 폐지(사회적 압박 회피).
//  · 별도 cooldown 화면 제거. 2026-05-26 v2: rejected 푸터의 5초 ring + 비활성 [재요청] 버튼도 폐기 — 무산 직후 재요청은 핵심 액션이 아님.
//
// 상태별 정보 노출 정책 (2026-05-27 v3 갱신):
//  · voting     — 링 + 헤드라인 + 큰 CTA + 4열 포트레이트. 상세는 E4VotingBody 주석 참조.
//  · waiting    — 동의 후 팀원 응답 대기. 상세는 E4WaitingBody 주석 참조.
//  · rejected   — 합의 무산. 상세는 E4FailureBody 주석 참조.
//  · voting-v2  — 2026-05-27 신설. LoL 매치 수락 어휘 직접 차용 — 거대 ring(480px) 중심, 미수락자 아바타만 ring 내부, 수락 버튼 ring 6시 overlap. 상세는 E4VotingV2Body 주석 참조.
//  · waiting-v2 — 2026-05-27 신설. voting-v2 세트. 동일 거대 ring, 수락 버튼 자리에 "✓ 동의했어요" 상태 pill.
function E4ConsensusVote({ stateVariant = 'voting' }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f3ee' }}>
      <CanvasContextHeader />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CanvasBackdrop />
        <div className="jt-modal-backdrop has-blur" />

        {stateVariant === 'voting'     && <E4VotingBody />}
        {stateVariant === 'waiting'    && <E4WaitingBody />}
        {stateVariant === 'voting-v2'  && <E4VotingV2Body />}
        {stateVariant === 'waiting-v2' && <E4WaitingV2Body />}
        {stateVariant === 'rejected'   && <E4FailureBody />}
      </div>
    </div>
  );
}

// ── 캔버스 컨텍스트 헤더 — E-4 / E-5 공용 ────────
// 참가자 GNB(`JitdaToolbar` from participant.jsx)로 통일 — C-3와 동일.
// [내 프로젝트][갤러리 보기] 액션 + 우측 계정정보.
function CanvasContextHeader() {
  return <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />;
}

// ── 원형 카운트다운 링 ────────────────────────────────────────
// LoL 매치 수락 UI 어휘: 남은 시간만큼 헬멧 노랑 호가 12시(top)부터 시계방향으로 채워짐. 시간이 흐르면 12시에서부터 호가 사라짐.
// 외곽 halo는 `jt-countdown-ring-critical` 재사용(2.4s pulse).
//
// 애니메이션 (2026-05-26):
//   · `animate=true`(기본) — rAF로 60fps 부드러운 호 감소 + 1초 단위 숫자 ceil.
//     0에 도달하면 정지. 마운트 시점 기준으로 흐름.
//   · `animate=false` — `seconds` 값으로 정적 표시 (스크린샷용·rejected 시 멈춤).
//   · `seconds` prop = 시작값(default total). voting=15, cooldown=5 등으로 매번 새로 시작.
//
// 다른 화면(e4 ↔ e4-prompt) 간 "같이 흐르는" 효과는 마운트 시점이 가까우면 시각적으로 합치됨.
// 실제 앱에서는 전역 상태 또는 서버 타임스탬프로 정확 동기화 필요.
function RingTimer({ seconds: initialSeconds = null, total = 15, size = 168, color = 'var(--c-helmet)', track = 'var(--c-stone)', pulse = true, label = 'SEC', animate = true }) {
  const startSeconds = initialSeconds ?? total;
  const startedAtRef = React.useRef(null);
  if (startedAtRef.current === null) startedAtRef.current = Date.now();

  const [remaining, setRemaining] = React.useState(startSeconds);

  React.useEffect(() => {
    if (!animate) {
      setRemaining(startSeconds);
      return;
    }
    let raf;
    const tick = () => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const left = Math.max(0, startSeconds - elapsed);
      setRemaining(left);
      if (left > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [animate, startSeconds]);

  // 회색(소비) 영역이 12시에서 시작해 시계방향으로 늘어남 — 시계 바늘처럼.
  // elapsed가 커질수록 grayDeg가 0→360°로 증가하면서 회색 sector가 12시에서 시계방향으로 회전.
  const elapsed = Math.max(0, Math.min(total, total - remaining));
  const grayDeg = Math.max(0, Math.min(360, (elapsed / total) * 360));
  const inner = Math.round(size * 0.78);
  const numFontSize = Math.round(size * 0.26);
  const display = remaining <= 0 ? 0 : Math.ceil(remaining);

  return (
    <div
      className={pulse ? 'jt-countdown-ring-critical' : undefined}
      style={{
        position: 'relative',
        width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
      {/* conic ring — 12시(top) 시작 · 시계 바늘처럼 시계방향 진행.
         소비된 시간(track 색)이 12시→3시→6시→9시→12시 순서로 sector가 커진다. */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${track} 0deg ${grayDeg}deg, ${color} ${grayDeg}deg 360deg)`,
      }} />
      {/* inner disc */}
      <div style={{
        position: 'relative',
        width: inner, height: inner, borderRadius: '50%',
        background: 'var(--c-canvas)',
        boxShadow: 'inset 0 1px 2px rgba(20,19,15,0.08)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: numFontSize, lineHeight: 1,
          color: 'var(--c-ink)', letterSpacing: '-0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}>{String(display).padStart(2, '0')}</span>
        {label && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: Math.max(9, Math.round(size * 0.06)),
            color: 'var(--c-muted)', letterSpacing: '0.18em',
          }}>{label}</span>
        )}
      </div>
    </div>
  );
}

// ── 팀원 포트레이트 카드 (voting / rejected 공용) ────────────
// LoL 매치 수락 화면의 팀원 슬롯 패턴. 동그란 아바타 + 상태 ring + 상태 칩.
// 2026-05-27 v2: 카드 자체에 상태별 fill 적용 — 멀리서도 동의/거절/대기 식별 가능.
//   agreed=mint-soft 채움 + mint 보더 / rejected=safety-soft 채움 + safety 보더 / pending=옅은 stone bg + 점선 보더
function TeammatePortrait({ name, color, state }) {
  const map = {
    requester:{
      ring: 'var(--c-helmet)', label: '요청자',
      chipBg: 'var(--c-helmet-soft)', chipFg: 'var(--c-ink)', icon: Icon.check(11),
      cardBg: 'var(--c-helmet-soft)', cardBorder: 'var(--c-helmet)', cardBorderStyle: 'solid',
    },
    agreed:   {
      ring: 'var(--c-mint)', label: '동의',
      chipBg: '#ffffff', chipFg: 'var(--c-mint)', icon: Icon.check(11),
      cardBg: 'var(--c-mint-soft)', cardBorder: 'var(--c-mint)', cardBorderStyle: 'solid',
    },
    rejected: {
      ring: 'var(--c-safety)', label: '거절',
      chipBg: '#ffffff', chipFg: 'var(--c-safety-deep)', icon: Icon.x(11),
      cardBg: 'var(--c-safety-soft)', cardBorder: 'var(--c-safety)', cardBorderStyle: 'solid',
    },
    pending:  {
      ring: 'var(--c-stone-2)', label: '대기 중',
      chipBg: 'var(--c-stone)', chipFg: 'var(--c-ink-3)', icon: '⏳',
      cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'var(--c-stone-2)', cardBorderStyle: 'dashed',
    },
    timeout:  {
      ring: 'var(--c-stone-2)', label: '응답 없음',
      chipBg: 'var(--c-stone)', chipFg: 'var(--c-muted)', icon: '–',
      cardBg: '#ebebec', cardBorder: 'var(--c-stone-2)', cardBorderStyle: 'solid',
    },
    offline:  {
      ring: 'var(--c-stone-2)', label: '오프라인',
      chipBg: '#ebebec', chipFg: 'var(--c-muted)', icon: '–',
      cardBg: '#ebebec', cardBorder: 'var(--c-stone-2)', cardBorderStyle: 'solid',
    },
  };
  const s = map[state] || map.pending;
  const isReject = state === 'rejected';
  const isMuted  = state === 'offline' || state === 'timeout';
  return (
    <div
      style={{
        position: 'relative',
        width: 124, padding: '16px 12px 14px',
        background: s.cardBg,
        border: `2px ${s.cardBorderStyle} ${s.cardBorder}`,
        borderRadius: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        opacity: isMuted ? 0.65 : 1,
        overflow: 'hidden',
        transition: 'background-color var(--dur-base) var(--ease-decelerate), border-color var(--dur-base) var(--ease-decelerate)',
      }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: color, color: '#fff',
        border: `3px solid ${s.ring}`,
        boxShadow: isReject ? '0 0 0 4px rgba(255,107,31,0.25)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
      }}>{name[0]}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-ink)' }}>{name}</div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: s.chipBg, color: s.chipFg,
        padding: '4px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700,
        fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
      }}>
        {typeof s.icon === 'string' ? <span>{s.icon}</span> : s.icon}
        {s.label}
      </span>
    </div>
  );
}

// ── 4명 팀원 픽스처 (4가지 칩을 한 화면에서 보여주기) ───
// 요청자(자동 동의) / 동의 / 거절 / 무응답(timeout) — 만장일치 룰에서 한 명이 거절하거나
// 한 명이라도 응답 없으면 합의 무산. 한 시나리오로 모든 상태 시각화.
function e4Teammates() {
  return [
    { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
    { name: '이서윤', color: 'var(--c-blue)',  state: 'agreed' },
    { name: '박지호', color: 'var(--c-mint)',  state: 'rejected' },
    { name: '최유나', color: 'var(--c-amber)', state: 'timeout' },
  ];
}

// 풀스크린 다크 오버레이 위에서 쓰는 공용 카피·구분선 톤
const E4_LIGHT = '#fff';
const E4_LIGHT_2 = 'rgba(255,255,255,0.78)';
const E4_LIGHT_3 = 'rgba(255,255,255,0.6)';

function E4Headline({ title, sub, accent }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 720 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
        color: accent || E4_LIGHT, letterSpacing: '-0.022em',
        marginBottom: 8, lineHeight: 1.18,
      }}>{title}</h2>
      {sub && (
        <div style={{ fontSize: 14, color: E4_LIGHT_2, lineHeight: 1.55 }}>{sub}</div>
      )}
    </div>
  );
}

function E4Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, color: E4_LIGHT_3,
      letterSpacing: '0.22em', textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function E4Divider({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      width: 560, color: E4_LIGHT_3,
      fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }} />
      <span>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }} />
    </div>
  );
}

// ── voting body (링·헤드라인·CTA·팀원 카드) ────────────
// 2026-05-27 v2: 사용자 결정 — 레이아웃 B안(버튼 위·카드 아래) 채택.
//   · "현재 응답"이 맨 아래(post-decision 모니터링 어휘)
//   · CTA 버튼 사이즈 증대(18×40 padding, fontSize 16/17 — 시간 압박 화면 핵심 액션 시각 위계 강화)
//   · 카드 자체에 상태별 fill 적용(agreed=mint-soft·rejected=safety-soft·pending=neutral) — 멀리서도 식별
//   · voting 중 실시간 상태 변경 시뮬레이션 — t=2.5s 이서윤 agree, t=6.5s 박지호 agree, 최유나는 timeout 까지 pending
function E4VotingBody() {
  const [members, setMembers] = React.useState([
    { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
    { name: '이서윤', color: 'var(--c-blue)',  state: 'pending' },
    { name: '박지호', color: 'var(--c-mint)',  state: 'pending' },
    { name: '최유나', color: 'var(--c-amber)', state: 'pending' },
  ]);

  React.useEffect(() => {
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === '이서윤' ? { ...x, state: 'agreed' } : x)), 2500);
    const t2 = setTimeout(() => setMembers(m => m.map(x => x.name === '박지호' ? { ...x, state: 'agreed' } : x)), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div role="alertdialog" aria-modal="true" aria-label="팀 합의 투표" style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 22,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      <E4Eyebrow>자동 거절까지</E4Eyebrow>
      <RingTimer seconds={15} total={15} size={140} color="var(--c-helmet)" track="rgba(255,255,255,0.14)" pulse />
      <E4Headline
        title="이 프롬프트, 보낼까요?"
        sub={<><strong style={{ color: 'var(--c-helmet)' }}>김민준</strong>님이 전송을 요청했어요</>}
      />

      {/* CTA — 디자인 시스템 클래스 기반. inline은 size override만 (height/padding/fontSize/borderRadius/gap).
          시각/hover/active/focus는 jt-btn-danger-outlined-dark / jt-btn-critical 이 담당. */}
      <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
        <button data-action="reject" className="jt-btn jt-btn-danger-outlined-dark" style={{
          height: 64, padding: '0 26px', fontSize: 16, gap: 8, borderRadius: 12, borderWidth: 2,
        }}>
          {Icon.x(16)} 거부
        </button>
        <button data-action="agree" className="jt-btn jt-btn-critical on-dark" style={{
          height: 64, padding: '0 52px', fontSize: 17, gap: 10, borderRadius: 12,
        }}>
          {Icon.bolt(16)} 동의 · AI에 전송
        </button>
      </div>

      <E4Divider>현재 응답</E4Divider>

      <div style={{ display: 'flex', gap: 14 }}>
        {members.map((m, i) => (
          <TeammatePortrait key={i} {...m} />
        ))}
      </div>
    </div>
  );
}

// ── waiting body (동의 후 다른 팀원 응답 대기) ──────────────
// 2026-05-27 신설: 본인이 동의 클릭 → e4 → e4-waiting → (전원 동의 or timeout).
// 취소 불가(사용자 결정 — 한 번 동의하면 15s 타이머 끝까지 고정. 투표 의미 보존).
// voting 과 동일 vertical 구조(CTA 슬롯에 상태 pill 대체) → 화면 전환 시 시각 점프 최소화.
// 데모 — 본인=이서윤 가정. 진입 시 이서윤 agreed 확정. t=3s 박지호 추가 agree, 최유나는 timeout 까지 pending.
function E4WaitingBody() {
  const [members, setMembers] = React.useState([
    { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
    { name: '이서윤', color: 'var(--c-blue)',  state: 'agreed' },
    { name: '박지호', color: 'var(--c-mint)',  state: 'pending' },
    { name: '최유나', color: 'var(--c-amber)', state: 'pending' },
  ]);

  React.useEffect(() => {
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === '박지호' ? { ...x, state: 'agreed' } : x)), 3000);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-label="팀원 응답 대기 중" style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 22,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      <E4Eyebrow>자동 거절까지</E4Eyebrow>
      <RingTimer seconds={15} total={15} size={140} color="var(--c-helmet)" track="rgba(255,255,255,0.14)" pulse />
      <E4Headline
        title="팀원 응답을 기다리고 있어요"
        sub="모두 동의하면 AI에 자동으로 전송됩니다"
      />

      {/* CTA 슬롯 자리에 상태 pill — 본인이 이미 동의했음 확정 표시 */}
      <div style={{ display: 'flex', marginTop: 12 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.10)',
          color: '#fff',
          border: '1.5px solid rgba(255,255,255,0.22)',
          padding: '18px 32px', borderRadius: 999,
          fontSize: 15, fontWeight: 700,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--c-mint)', color: '#fff',
          }}>{Icon.check(14)}</span>
          동의했어요 · 응답 완료
        </div>
      </div>

      <E4Divider>현재 응답</E4Divider>

      <div style={{ display: 'flex', gap: 14 }}>
        {members.map((m, i) => (
          <TeammatePortrait key={i} {...m} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V2 디자인 — LoL 매치 수락 어휘 직접 차용 (2026-05-27 신설)
// ─────────────────────────────────────────────────────────────
// 거대 ring(480px) 중심 + 미수락자 아바타만 ring 내부 + 수락 버튼 ring 6시 overlap.
// 기존 e4(작은 링 + 4열 카드)는 유지. e4-v2·e4-waiting-v2는 alternate set.

// rAF 카운트다운 헬퍼 — voting-v2·waiting-v2 둘 다 공유
function useCountdown(total) {
  const startedAtRef = React.useRef(null);
  if (startedAtRef.current === null) startedAtRef.current = Date.now();
  const [remaining, setRemaining] = React.useState(total);
  React.useEffect(() => {
    let raf;
    const tick = () => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const left = Math.max(0, total - elapsed);
      setRemaining(left);
      if (left > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [total]);
  return remaining;
}

// 거대 ring 컴포넌트 — SVG 기반 (2026-05-27 v6 갱신)
// caution stripe = ring 곡률을 따라가는 노랑/검정 교차 segment (사선 텍스처 폐기).
// 게이지 방향: 6시 수락 버튼의 좌측 끝(≈7시) 부터 시계방향으로 채워 우측 끝(≈5시)에서 100% 도달.
// 버튼 영역 60° (300° sweep)는 게이지 비노출.
// full=true 면 100% 고정 표시 (waiting-v2).
// 구현: 노랑 base 풀 ring + 검정 stripe overlay(dasharray로 일정 간격 punctuate) + mask로 게이지 호 길이 제한
function MatchAcceptRing({ remaining = 0, total = 15, full = false, size = 480, strokeWidth = 16 }) {
  const fraction = full ? 1 : Math.max(0, Math.min(1, (total - remaining) / total));
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - strokeWidth - 8;
  const innerR = r - strokeWidth / 2 - 2;
  const C = 2 * Math.PI * r;
  const sweepDeg = 300;
  const sweepLen = C * (sweepDeg / 360);
  const visibleAngDeg = sweepDeg * fraction;
  const stripeInnerR = r - strokeWidth / 2;
  const stripeOuterR = r + strokeWidth / 2;
  const diagShiftDeg = (strokeWidth / r) * (180 / Math.PI);             // 45° 사선
  const pt = (R, angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)];
  };
  // unique id (한 페이지에 voting-v2 + waiting-v2 동시 렌더 시 clipPath 충돌 방지)
  const uid = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).slice(2, 8);

  // 게이지 전체 영역의 평행사변형 path (energy wave clip 영역으로 사용)
  const gaugeClipPath = (() => {
    if (fraction <= 0) return null;
    const a0 = 210;
    const a1 = 210 + visibleAngDeg;
    const [ix0, iy0] = pt(stripeInnerR, a0);
    const [ix1, iy1] = pt(stripeInnerR, a1);
    const [ox1, oy1] = pt(stripeOuterR, a1 + diagShiftDeg);
    const [ox0, oy0] = pt(stripeOuterR, a0 + diagShiftDeg);
    const largeArc = visibleAngDeg > 180 ? 1 : 0;
    return `M ${ix0.toFixed(2)} ${iy0.toFixed(2)} ` +
           `A ${stripeInnerR} ${stripeInnerR} 0 ${largeArc} 1 ${ix1.toFixed(2)} ${iy1.toFixed(2)} ` +
           `L ${ox1.toFixed(2)} ${oy1.toFixed(2)} ` +
           `A ${stripeOuterR} ${stripeOuterR} 0 ${largeArc} 0 ${ox0.toFixed(2)} ${oy0.toFixed(2)} Z`;
  })();

  // energy wave path — 폭 8° 정도의 좁은 평행사변형, 7시 시작 위치
  const waveAngDeg = 9;
  const wavePath = (() => {
    const a0 = 210;
    const a1 = a0 + waveAngDeg;
    const [ix0, iy0] = pt(stripeInnerR, a0);
    const [ix1, iy1] = pt(stripeInnerR, a1);
    const [ox1, oy1] = pt(stripeOuterR, a1 + diagShiftDeg);
    const [ox0, oy0] = pt(stripeOuterR, a0 + diagShiftDeg);
    return `M ${ix0.toFixed(2)} ${iy0.toFixed(2)} ` +
           `A ${stripeInnerR} ${stripeInnerR} 0 0 1 ${ix1.toFixed(2)} ${iy1.toFixed(2)} ` +
           `L ${ox1.toFixed(2)} ${oy1.toFixed(2)} ` +
           `A ${stripeOuterR} ${stripeOuterR} 0 0 0 ${ox0.toFixed(2)} ${oy0.toFixed(2)} Z`;
  })();

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible',
      }}
    >
      <defs>
        {gaugeClipPath && (
          <clipPath id={`gauge-clip-${uid}`}>
            <path d={gaugeClipPath} />
          </clipPath>
        )}
      </defs>

      {/* 1. inner dark disc — filter 영향 없는 위치 (drop-shadow halo 안 새도록 SVG element 가 아닌 stripe group에만 filter 적용) */}
      <circle cx={cx} cy={cy} r={innerR}
              fill="rgba(13,13,17,0.94)" />

      {/* 2. stripe group + energy wave — drop-shadow filter 가 이 group 의 shape (= 게이지가 채워진 부분) 에만 적용되어
             후방 helmet glow halo 가 게이지와 함께 자람 (이전 SVG 전체 filter 폐기 — dark disc 까지 halo 캐스팅했음). */}
      {fraction > 0 && (
        <g style={{ filter: 'drop-shadow(0 0 14px rgba(255,206,43,0.55)) drop-shadow(0 0 32px rgba(255,206,43,0.32))' }}>
          {/* 3. caution stripe — 평행사변형 path (두 호 + 두 대각선) ring 곡률 따라 사선 무늬 */}
          {(() => {
            const stripeArcLen = 18;
            const stripeAngDeg = (stripeArcLen / r) * (180 / Math.PI);
            const visibleArc = sweepLen * fraction;
            const numFullStripes = Math.floor(visibleArc / stripeArcLen);
            const partialArc = visibleArc - numFullStripes * stripeArcLen;
            const partialAngDeg = (partialArc / r) * (180 / Math.PI);
            const stripeAt = (i, lenAngDeg) => {
              const a0 = 210 + i * stripeAngDeg;
              const a1 = a0 + lenAngDeg;
              const [ix0, iy0] = pt(stripeInnerR, a0);
              const [ix1, iy1] = pt(stripeInnerR, a1);
              const [ox1, oy1] = pt(stripeOuterR, a1 + diagShiftDeg);
              const [ox0, oy0] = pt(stripeOuterR, a0 + diagShiftDeg);
              return `M ${ix0.toFixed(2)} ${iy0.toFixed(2)} ` +
                     `A ${stripeInnerR} ${stripeInnerR} 0 0 1 ${ix1.toFixed(2)} ${iy1.toFixed(2)} ` +
                     `L ${ox1.toFixed(2)} ${oy1.toFixed(2)} ` +
                     `A ${stripeOuterR} ${stripeOuterR} 0 0 0 ${ox0.toFixed(2)} ${oy0.toFixed(2)} Z`;
            };
            const segments = [];
            for (let i = 0; i < numFullStripes; i++) {
              const isYellow = i % 2 === 0;
              segments.push(
                <path key={i} d={stripeAt(i, stripeAngDeg)} fill={isYellow ? '#ffce2b' : '#17171c'} />
              );
            }
            if (partialAngDeg > 0.001) {
              const i = numFullStripes;
              const isYellow = i % 2 === 0;
              segments.push(
                <path key={`p${i}`} d={stripeAt(i, partialAngDeg)} fill={isYellow ? '#ffce2b' : '#17171c'} />
              );
            }
            return <g>{segments}</g>;
          })()}

          {/* 4. energy wave — 좁은 밝은 streak가 ring을 따라 시계방향 traverse (SMIL animateTransform).
                 clipPath로 visible 게이지 영역에 한정 → 가득 차지 않은 voting 중에는 채워진 부분에서만 보임.
                 "에너지가 차오르듯 일렁이는" 느낌 (이전 깜빡 pulse 폐기). */}
          <g clipPath={`url(#gauge-clip-${uid})`}>
            <g>
              <path d={wavePath} fill="rgba(255, 245, 200, 0.55)" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${cx} ${cy}`}
                to={`${sweepDeg} ${cx} ${cy}`}
                dur="2.6s"
                repeatCount="indefinite"
              />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
}

// 미수락자 아바타 (작은 점선 테두리 — "응답 대기 중" 시각 단서)
function PendingAvatar({ name, color }) {
  return (
    <div title={name + ' · 응답 대기 중'} style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
        border: '2px dashed rgba(255,255,255,0.5)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>{name[0]}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{name}</div>
    </div>
  );
}

// ── voting-v2 body (거대 ring · 6시 수락 버튼 · 미수락자만 노출) ─
// 데모: 초기 [김민준=요청자 / 이서윤·박지호·최유나=pending]. t=2.5s 이서윤 agree → pending 3→2.
function E4VotingV2Body() {
  const [members, setMembers] = React.useState([
    { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
    { name: '이서윤', color: 'var(--c-blue)',  state: 'pending' },
    { name: '박지호', color: 'var(--c-mint)',  state: 'pending' },
    { name: '최유나', color: 'var(--c-amber)', state: 'pending' },
  ]);
  React.useEffect(() => {
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === '이서윤' ? { ...x, state: 'agreed' } : x)), 2500);
    return () => clearTimeout(t1);
  }, []);

  const remaining = useCountdown(15);
  const pendingOnly = members.filter(m => m.state === 'pending');
  const display = remaining <= 0 ? 0 : Math.ceil(remaining);

  return (
    <div role="alertdialog" aria-modal="true" aria-label="팀 합의 투표 (v2)" style={{
      position: 'absolute', inset: 0, zIndex: 51,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 0,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      {/* 거대 ring + 내부 콘텐츠 */}
      <div style={{ position: 'relative', width: 480, height: 480 }}>
        <MatchAcceptRing remaining={remaining} total={15} size={480} />

        {/* ring 내부 콘텐츠 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 80, textAlign: 'center', gap: 14,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'rgba(255,255,255,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>자동 거절까지 · {String(display).padStart(2, '0')}s</div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.022em',
            margin: 0, lineHeight: 1.2,
          }}>이 프롬프트, 보낼까요?</h2>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--c-helmet)' }}>김민준</strong>님이 전송을 요청했어요
          </div>

          {pendingOnly.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>응답 대기 · {pendingOnly.length}명</div>
              <div style={{ display: 'flex', gap: 14 }}>
                {pendingOnly.map((m, i) => <PendingAvatar key={i} {...m} />)}
              </div>
            </div>
          )}
        </div>

        {/* 수락 버튼 — ring 6시 깊게 overlap. 디자인 시스템 jt-btn-critical 사용.
            inline은 size/radius/font 만 override — bg·color·border·shadow·hover는 클래스가 담당. */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 0 24px rgba(255,206,43,0.45)) drop-shadow(0 14px 24px rgba(0,0,0,0.55))',
        }}>
          <button data-action="agree" className="jt-btn jt-btn-critical on-dark" style={{
            width: 220, height: 60, padding: 0, fontSize: 17, gap: 10, borderRadius: 10,
            fontFamily: 'var(--font-display)',
          }}>
            {Icon.bolt(16)} 수락
          </button>
        </div>
      </div>

      {/* 거절 버튼 — ring 아래 secondary. jt-btn-ghost-dark (다크 backdrop ghost variant).
          높이 40 고정 — waiting-v2 의 캡션 영역과 동일 height로 둬서 두 화면 ring 수직 중심이 일치. */}
      <div style={{ marginTop: 48, height: 40, display: 'flex', alignItems: 'center' }}>
        <button data-action="reject" className="jt-btn jt-btn-ghost-dark" style={{
          height: 40, padding: '0 28px', fontSize: 13.5, gap: 8, borderRadius: 10,
          borderWidth: 1.5,
        }}>
          {Icon.x(13)} 거절
        </button>
      </div>
    </div>
  );
}

// ── waiting-v2 body (거대 ring · 6시 "동의 완료" pill · 미수락자만 노출) ─
// voting-v2 와 동일 ring 어휘. 본인 동의 후 다른 팀원 대기. 취소 불가.
// 데모: 본인=이서윤 가정. 진입 시 이서윤 agreed 확정. t=3s 박지호 추가 agree.
function E4WaitingV2Body() {
  const [members, setMembers] = React.useState([
    { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
    { name: '이서윤', color: 'var(--c-blue)',  state: 'agreed' },
    { name: '박지호', color: 'var(--c-mint)',  state: 'pending' },
    { name: '최유나', color: 'var(--c-amber)', state: 'pending' },
  ]);
  React.useEffect(() => {
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === '박지호' ? { ...x, state: 'agreed' } : x)), 3000);
    return () => clearTimeout(t1);
  }, []);

  // waiting-v2: 카운트다운 미사용 — 게이지 full 고정. (실 앱에서 timeout 시 e4-rejected 자동 전이는 서버 이벤트로 처리)
  const pendingOnly = members.filter(m => m.state === 'pending');

  return (
    <div role="status" aria-live="polite" aria-label="팀원 응답 대기 (v2)" style={{
      position: 'absolute', inset: 0, zIndex: 51,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 0,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      <div style={{ position: 'relative', width: 480, height: 480 }}>
        {/* waiting-v2: full 게이지 고정 노출 (본인 동의 후 다른 사람 대기 중) */}
        <MatchAcceptRing full={true} size={480} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 80, textAlign: 'center', gap: 14,
        }}>
          {/* waiting-v2: 카운트다운 텍스트 제거 — 게이지가 이미 100% 이므로 시각·의미 충돌 회피 */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--c-helmet)', letterSpacing: '0.24em', textTransform: 'uppercase',
            opacity: 0.85,
          }}>응답 전송됨</div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.022em',
            margin: 0, lineHeight: 1.25,
          }}>팀원 응답을 기다리고 있어요</h2>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
            모두 동의하면 AI에 자동으로 전송됩니다
          </div>

          {pendingOnly.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>응답 대기 · {pendingOnly.length}명</div>
              <div style={{ display: 'flex', gap: 14 }}>
                {pendingOnly.map((m, i) => <PendingAvatar key={i} {...m} />)}
              </div>
            </div>
          )}
        </div>

        {/* 6시 상태 버튼 — 수락 버튼과 동일 위치·크기·모양, 색만 mint (jt-btn-success-static.on-dark).
            disabled 처리(클릭 불가) + 응답 완료를 의미. */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 0 20px rgba(34,180,135,0.4)) drop-shadow(0 14px 24px rgba(0,0,0,0.55))',
        }}>
          <button disabled className="jt-btn jt-btn-success-static on-dark" style={{
            width: 220, height: 60, padding: 0, fontSize: 17, gap: 10, borderRadius: 10,
            fontFamily: 'var(--font-display)',
            cursor: 'default', opacity: 1,  /* disabled 의 opacity 0.4 override — 정보 상태이므로 흐려지면 안 됨 */
          }}>
            {Icon.check(16)} 동의했어요
          </button>
        </div>
      </div>

      {/* ring 아래 캡션 — voting-v2 의 거절 버튼 자리에 매칭하는 height 40 영역으로 두 화면 ring 수직 중심 일치. */}
      <div style={{
        marginTop: 48, height: 40, display: 'flex', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>응답 취소 불가 · 타이머 종료 대기</div>
    </div>
  );
}

// ── rejected body (실패 안내 + 포트레이트 + 캔버스 복귀 CTA) ──
// 거절/타임아웃을 통합한 단일 화면. 헤드라인은 고정 문구 "합의가 무산됐어요"
// (이름 명시 폐지 — 사회적 압박/책임 전가 회피).
// 2026-05-26 v2: 5초 ring + 재요청 (대기 중) 버튼 폐기 — 무산 직후 재요청은 핵심 액션이 아님.
// 핵심 액션은 "캔버스로 돌아가서 수정"이므로 primary CTA 단일화로 시선 집중.
function E4FailureBody() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 18,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: '50%',
        background: 'var(--c-safety)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(255,107,31,0.45), 0 0 0 6px rgba(255,107,31,0.18)',
      }}>{Icon.x(48)}</div>

      <E4Headline
        title="합의가 무산됐어요"
        sub="캔버스를 수정한 뒤 다시 시도하세요"
      />

      <E4Divider>합의 실패</E4Divider>

      <div style={{ display: 'flex', gap: 14 }}>
        {e4Teammates().map((m, i) => (
          <TeammatePortrait key={i} {...m} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
        <button
          data-action="back-to-canvas"
          className="jt-btn jt-btn-primary"
          style={{
            padding: '16px 36px',
            fontSize: 15.5,
            fontWeight: 700,
            gap: 10,
            boxShadow: '0 8px 24px rgba(20,19,15,0.35)',
          }}
        >
          {Icon.arrowLeft(16)} 캔버스로 돌아가기
        </button>
      </div>
    </div>
  );
}

function CanvasBackdrop() {
  // OpenCode 다크 UI 의 흐릿한 모습 — 합의 투표/AI 선택지 카드의 배경 컨텍스트
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0d0d11',
      filter: 'blur(1.5px)',
      overflow: 'hidden',
    }}>
      {/* opencode 상단 바 */}
      <div style={{ height: 42, background: '#0d0d11', borderBottom: '1px solid #1c1c22', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 14, height: 12, background: '#2a2a32', borderRadius: 2 }} />
        <div style={{ width: 280, height: 12, background: '#2a2a32', borderRadius: 2 }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 100, height: 8, background: '#1c1c22', borderRadius: 2 }} />
        <div style={{ width: 60, height: 8, background: '#1c1c22', borderRadius: 2 }} />
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* 세션 제목 */}
        <div style={{ width: 280, height: 17, background: '#2a2a32', borderRadius: 3, marginBottom: 16 }} />
        {/* 프롬프트 카드 */}
        <div style={{
          background: '#1a1a20',
          border: '1px solid #232329',
          borderRadius: 4,
          padding: '14px 18px',
          marginBottom: 18,
        }}>
          <div style={{ height: 11, background: '#2a2a32', borderRadius: 2, marginBottom: 6 }} />
          <div style={{ height: 11, background: '#2a2a32', borderRadius: 2, width: '78%' }} />
        </div>
        {/* Show steps */}
        <div style={{ width: 140, height: 10, background: '#1a1a20', borderRadius: 2, marginBottom: 14 }} />
        {/* Response */}
        <div style={{ width: 80, height: 10, background: '#1a1a20', borderRadius: 2, marginBottom: 8 }} />
        <div style={{ height: 10, background: '#1a1a20', borderRadius: 2, marginBottom: 6 }} />
        <div style={{ height: 10, background: '#1a1a20', borderRadius: 2, width: '90%', marginBottom: 6 }} />
        <div style={{ height: 10, background: '#1a1a20', borderRadius: 2, width: '70%', marginBottom: 14 }} />
        {/* File rows */}
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 36, background: '#1a1a20', border: '1px solid #232329', borderRadius: 4, marginBottom: 6, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
            <div style={{ width: 16, height: 16, background: '#2dd4bf', borderRadius: 2 }} />
            <div style={{ width: 180, height: 10, background: '#2a2a32', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}


// ── E-5. AI 선택지 투표 ───────────────────────────────────────
// AI가 여러 선택지를 제시했을 때 팀 모드 투표
function E5AIChoiceVote() {
  const choices = [
    { id: 'A', label: '카드 리스트', desc: '각 일정을 큰 카드로 보여주고 좌우 스와이프로 D-day 정렬', votes: ['김민준'], color: 'var(--c-helmet)' },
    { id: 'B', label: '캘린더 뷰', desc: '월별 캘린더에 점으로 표시. 클릭하면 상세 일정 모달', votes: ['이서윤', '박지호'], color: 'var(--c-blue)' },
    { id: 'C', label: '타임라인', desc: '오늘부터 시간 순으로 위→아래 정렬. 시험 D-7 자동 강조', votes: [], color: 'var(--c-mint)' },
    { id: 'D', label: '기타 (직접 작성)', desc: '선택하면 캔버스로 돌아가서 직접 프롬프트를 다듬어요', votes: [], color: 'var(--c-muted)', isOther: true },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f3ee' }}>
      {/* GNB — C-3과 동일 (참가자 통합 JitdaToolbar) */}
      <CanvasContextHeader />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CanvasBackdrop />
        <div className="jt-modal-backdrop is-soft" />

        <div role="dialog" aria-modal="true" aria-label="AI 선택지 합의 투표" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'var(--modal-w-lg)',
          maxHeight: '88%',
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-ink)',
          borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'jt-modal-pop-in var(--dur-base) var(--ease-standard)',
        }}>
          {/* 상단 AI 출처 표시 */}
          <div style={{
            background: '#17171c',
            color: '#fff',
            padding: '14px 22px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--c-helmet)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c-ink)', fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
            }}>AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, opacity: 0.65, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>OPENCODE · CLAUDE HAIKU 4.5</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>일정을 어떻게 보여줄지 3가지 방향을 떠올렸어요. 팀이 골라주면 그 방향으로 만들어 갈게요.</div>
            </div>
          </div>

          {/* 본문 */}
          <div style={{ padding: '18px 22px', overflow: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 20 }}>어떤 방식으로 보여줄까요?</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-slate)' }}>
                투표 3 / 4명 · 과반 통과
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {choices.map((c, i) => {
                const myChoice = c.id === 'B'; // 박지호가 B를 골랐다고 가정
                const isLeading = c.votes.length === 2;
                return (
                  <div key={i} style={{
                    border: `1px solid ${myChoice ? 'var(--c-ink)' : 'var(--c-hairline)'}`,
                    borderLeft: `4px solid ${isLeading ? 'var(--c-helmet)' : myChoice ? 'var(--c-ink)' : c.color}`,
                    borderRadius: 4,
                    padding: '12px 14px',
                    background: c.isOther ? 'var(--c-stone)' : myChoice ? 'var(--c-helmet-soft)' : 'var(--c-canvas)',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 32, height: 32,
                      borderRadius: 4,
                      border: `1px solid ${myChoice ? 'var(--c-ink)' : 'var(--c-hairline-strong)'}`,
                      background: myChoice ? 'var(--c-ink)' : 'var(--c-canvas)',
                      color: myChoice ? '#fff' : 'var(--c-ink-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
                      flexShrink: 0,
                    }}>{c.id}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</span>
                        {isLeading && (
                          <span className="jt-pill" style={{
                            background: 'var(--c-helmet)', color: 'var(--c-ink)',
                            fontSize: 10, padding: '2px 6px',
                          }}>리딩</span>
                        )}
                        {myChoice && (
                          <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--c-ink)' }}>내가 선택함</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--c-slate)', lineHeight: 1.5 }}>{c.desc}</div>
                    </div>
                    {/* 투표한 사람들 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, minWidth: 80 }}>
                      {c.votes.length > 0 ? (
                        <>
                          <div style={{ display: 'flex' }}>
                            {c.votes.map((v, j) => (
                              <div key={j} className="jt-avatar" style={{
                                width: 22, height: 22, fontSize: 10,
                                background: ['var(--c-helmet)', 'var(--c-blue)', 'var(--c-mint)', 'var(--c-amber)'][['김민준', '이서윤', '박지호', '최유나'].indexOf(v)],
                                color: '#fff', marginLeft: j > 0 ? -6 : 0,
                                border: '2px solid var(--c-canvas)',
                              }}>{v[0]}</div>
                            ))}
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-slate)' }}>{c.votes.length}표</span>
                        </>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)' }}>0표</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 미투표 알림 */}
            <div style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'var(--c-stone)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 12, color: 'var(--c-ink-3)',
            }}>
              <span style={{ color: 'var(--c-amber)' }}>{Icon.info(13)}</span>
              <span><strong style={{ color: 'var(--c-amber)' }}>최유나</strong>님이 아직 투표하지 않았어요</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)' }}>과반 충족 시 자동 확정</span>
            </div>
          </div>

          <div style={{
            padding: '12px 22px',
            background: 'var(--c-paper)',
            borderTop: '1px solid var(--c-hairline)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 11, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>
              결정은 과반(3명) 충족 시 자동 확정 · "기타" 선택 시 캔버스로 복귀
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── E-1b. 변경사항 미저장 종료 경고 ────────────────────────────
// E-1 위에 떠 있는 confirm 다이얼로그. 트리거: [취소] / esc — hasUnsaved 일 때만 노출
//
// 2026-05-27 v2 — B-2 모달 표준 정렬:
//   · 셸: width 480, radius 10, outer border 없음, shadow-modal, overflow hidden
//   · 상단 jt-caution-strip (애니메이션) — 비가역 액션 긴급도 강조
//   · 헤더 — h2(20) + p(13 slate), B-2 종료 모달과 동일 (helmet-soft 헤더 bg 제거)
//   · 푸터 — [그냥 닫기 secondary] + [저장하고 닫기 critical-static]
function E1UnsavedCloseConfirm() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* 뒷배 — E-1 다이얼로그가 흐릿하게 깔린 컨텍스트 */}
        <BlurredCodingBackground />
        <div className="jt-modal-backdrop is-strong" />

        {/* 경고 다이얼로그 — B-2 모달 셸 표준 */}
        <div role="alertdialog" aria-modal="true" aria-label="저장하지 않은 변경사항" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          background: 'var(--c-canvas)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          animation: 'jt-modal-pop-in var(--dur-base) var(--ease-standard)',
        }}>
          {/* 상단 caution-strip — 애니메이션 (비가역 경고 강도 ↑) */}
          <div className="jt-caution-strip" aria-hidden="true" />

          {/* 헤더 + 본문 — B-2 표준 (h2 + p, X 버튼 없음, 단색 canvas) */}
          <div style={{ padding: '24px 28px 0' }}>
            <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>
              저장하지 않고 닫을까요?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55, margin: 0 }}>
              변경한 내용이 저장되지 않은 상태예요. 닫으면 <strong style={{ color: 'var(--c-ink)' }}>변경 내용이 사라져요.</strong>
            </p>
          </div>

          {/* 푸터 — [그냥 닫기] + [저장하고 닫기] (B-2 표준 우측 정렬) */}
          <div style={{
            padding: '20px 28px 22px',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            <button data-action="cancel" className="jt-btn jt-btn-secondary">그냥 닫기</button>
            <button data-action="save-close" className="jt-btn jt-btn-critical-static">저장하고 닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── E-6. 일시정지 오버레이 ─────────────────────────────────────
// 운영자가 hackathon_running 상태에서 [일시정지]를 누르면 참가자 바이브코딩
// 화면(C-3 1인팀 / C-4 다인팀) 위에 백드롭으로 덮여 등장.
// 참가자는 직접 닫을 수 없고 운영자의 [재시작]만 해제 — 작업물은 그대로 보존.
//
// 디자인 일관성: E-4 합의 무산(`E4FailureBody`) 패턴을 그대로 따른다.
//  · 풀스크린 다크 dim(0.40) + 블러된 OpenCode 셀(CanvasBackdrop)을 배경으로 깐다
//  · 가운데 84×84 헬멧 옐로우 아이콘 원(⏸) + halo
//  · E4Headline display 32px 타이틀 + 보조 카피
//  · E4Divider mono caps 구분선
//  · CTA 대신 "운영자의 재시작을 기다리는 중" 펄스 칩 (참가자 직접 액션 불가)
//
// GNB는 `<JitdaToolbar status="hackathon_running" paused />`로 ⏸ 일시정지 pill 노출.
function E6Paused() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f3ee' }}>
      <JitdaToolbar status="hackathon_running" paused actions={<ParticipantCanvasActions />} />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CanvasBackdrop />
        <div className="jt-modal-backdrop has-blur" />

        <E6PausedBody />
      </div>
    </div>
  );
}

// ── paused body — E-4 합의 무산과 동일 위계·간격·타입스케일 ────
function E6PausedBody() {
  return (
    <div role="alertdialog" aria-modal="true" aria-label="해커톤 일시정지" style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 18,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      {/* 84px 원형 아이콘 — E4FailureBody와 동일 사이즈·shadow 스타일 (색만 helmet 옐로우) */}
      <div
        className="jt-countdown-ring-critical"
        style={{
          width: 84, height: 84, borderRadius: '50%',
          background: 'var(--c-helmet)', color: 'var(--c-stache)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(230,181,0,0.45), 0 0 0 6px rgba(255,206,43,0.22)',
        }}>{Icon.pause(40)}</div>

      <E4Headline
        title="잠시 멈췄어요"
        sub="운영자가 재시작하면 작업이 그대로 이어집니다"
      />

      <E4Divider>작업 보존됨</E4Divider>

      {/* CTA 대신 상태 칩 — 참가자는 직접 액션 불가 (운영자 [재시작]만 해제) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: E4_LIGHT,
          letterSpacing: '0.02em',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.22)',
          padding: '12px 22px',
          borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          backdropFilter: 'blur(4px)',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--c-helmet)',
            boxShadow: '0 0 0 4px rgba(255,206,43,0.22)',
            animation: 'pulse 1.6s infinite',
            display: 'inline-block',
          }} />
          운영자의 재시작을 기다리는 중
        </div>
      </div>
    </div>
  );
}

// E-7 폐기 (2026-05-27): 참가자에게는 종료 예고 없음 정책.
// 30초 유예는 운영자 전용이며, 종료 확정 시 참가자 화면은 C-3/C-4 → 대기실 ③(c1-ended)로 직접 전환.
// 참가자-로그인-기획.md §자동 전환 매트릭스 "[해커톤 종료] → 대기실 ③"와 정합.

Object.assign(window, { E1ProjectSettings, E1UnsavedCloseConfirm, E4ConsensusVote, E5AIChoiceVote, E6Paused });
