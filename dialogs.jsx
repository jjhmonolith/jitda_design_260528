/* E. 공통 다이얼로그/오버레이
   E-1. 프로젝트 설정 다이얼로그 — 코딩 환경에서 "내 프로젝트" 클릭 시
   E-4. 합의 투표 — 팀 캔버스에서 "전송 요청" 클릭 시
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
          maxWidth: 'calc(100vw - 48px)',
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
// 상태별 정보 노출 정책 (2026-06-01 v4 — v1 디자인 폐기):
//  · voting-v2  — LoL 매치 수락 어휘 직접 차용. 거대 ring(480px) 중심, 미수락자 아바타만 ring 내부, 수락 버튼 ring 6시 overlap. 상세는 E4VotingV2Body 주석 참조.
//  · waiting-v2 — voting-v2 세트. 동일 거대 ring, 수락 버튼 자리에 "✓ 동의했어요" 상태 pill. 상세는 E4WaitingV2Body 주석 참조.
//  · rejected-v2 — 합의 무산. 정지된 safety ring + 84px X 아이콘 + 패자 outcome row + 자동 캔버스 복귀 카운트다운. 상세는 E4FailureV2Body 주석 참조.
function E4ConsensusVote({ stateVariant = 'voting-v2', teamSize = 'small' }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f3ee' }}>
      <CanvasContextHeader />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CanvasBackdrop />
        <div className="jt-modal-backdrop has-blur" />

        {stateVariant === 'voting-v2'   && <E4VotingV2Body teamSize={teamSize} />}
        {stateVariant === 'waiting-v2'  && <E4WaitingV2Body teamSize={teamSize} />}
        {stateVariant === 'rejected-v2' && <E4FailureV2Body teamSize={teamSize} />}
      </div>
    </div>
  );
}

// ── 캔버스 컨텍스트 헤더 — E-4 전용 ────────
// 참가자 GNB(`JitdaToolbar` from participant.jsx)로 통일 — C-3와 동일.
// [내 프로젝트][갤러리 보기] 액션 + 우측 계정정보.
function CanvasContextHeader() {
  return <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />;
}

// ── v1 헬퍼 (RingTimer · TeammatePortrait · e4Teammates) 는 2026-06-01 v1 폐기와 함께 제거 ──
// v2는 `useCountdown` + `MatchAcceptRing` (480px conic ring) + `PendingAvatar` / outcome avatar 인라인 어휘 사용.

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

// ── v1 voting / waiting body 는 2026-06-01 v1 폐기와 함께 제거. 합의 투표는 v2 (거대 ring) 만 정본. ──

// ─────────────────────────────────────────────────────────────
// V2 디자인 — LoL 매치 수락 어휘 직접 차용 (2026-05-27 신설, 2026-06-01 정본)
// ─────────────────────────────────────────────────────────────
// 거대 ring(480px) 중심 + 미수락자 아바타만 ring 내부 + 수락 버튼 ring 6시 overlap.
// 2026-06-01: v1(작은 링·4열 카드) 폐기. v2가 합의 투표 정본.

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
function MatchAcceptRing({
  remaining = 0, total = 10, full = false, size = 480, strokeWidth = 16,
  palette = 'helmet',   // 'helmet'(노랑·기본) | 'safety'(주황·rejected-v2)
  animate = true,        // false 면 energy wave SMIL 비활성 (rejected 정지 상태)
  flashIn = null,        // 'helmet'(노랑) | 'safety'(주황) — mount flash overlay tint. null 면 full에 따라 자동.
}) {
  // palette별 색상 토큰
  const colors = palette === 'safety' ? {
    stripe: '#ff6b1f',
    glow1: 'rgba(255, 107, 31, 0.55)',
    glow2: 'rgba(255, 107, 31, 0.32)',
    waveTint: 'rgba(255, 220, 200, 0.55)',
  } : {
    stripe: '#ffce2b',
    glow1: 'rgba(255, 206, 43, 0.55)',
    glow2: 'rgba(255, 206, 43, 0.32)',
    waveTint: 'rgba(255, 245, 200, 0.55)',
  };
  // 2026-05-29 v2: sweep 300°→320°로 확장, start 210°→200° 이동.
  //   목적: 버튼 양옆 빈공간 제거. consumption = 시간이 지난 비율 (0 = 풀, 1 = 완전 소진).
  const consumption = full ? 0 : Math.max(0, Math.min(1, (total - remaining) / total));
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - strokeWidth - 8;
  const innerR = r - strokeWidth / 2 - 2;
  const sweepDeg = 320;
  const startDeg = 200;                                 // gauge 시작 각도 (12시=0° 기준 CW)
  const consumedAngDeg = sweepDeg * consumption;
  const visibleAngDeg = sweepDeg - consumedAngDeg;
  const stripeInnerR = r - strokeWidth / 2;
  const stripeOuterR = r + strokeWidth / 2;
  const diagShiftDeg = (strokeWidth / r) * (180 / Math.PI);
  const boundaryAngDeg = startDeg + consumedAngDeg;     // 현재 boundary 절대 각도
  const gaugeEndAngDeg = startDeg + sweepDeg;           // 항상 고정 (5시 약간 왼쪽)
  const pt = (R, angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)];
  };
  const uid = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).slice(2, 8);

  // 게이지 잔여 영역의 평행사변형 (energy wave clip 영역으로 사용)
  const gaugeClipPath = (() => {
    if (visibleAngDeg <= 0.001) return null;
    const a0 = boundaryAngDeg;
    const a1 = gaugeEndAngDeg;
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

  // energy wave path — 폭 9° 좁은 평행사변형, 기본 위치 gauge 시작
  const waveAngDeg = 9;
  const wavePath = (() => {
    const a0 = startDeg;
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

      {/* 2. stripe group + energy wave — drop-shadow filter 가 이 group 의 shape (= 잔여 게이지) 에만 적용되어
             후방 helmet glow halo 가 stripe 줄어드는 만큼 함께 줄어듦. */}
      {visibleAngDeg > 0.001 && (
        <g style={{ filter: `drop-shadow(0 0 14px ${colors.glow1}) drop-shadow(0 0 32px ${colors.glow2})` }}>
          {/* 3. gauge fill — safety palette일 땐 solid 주황 띠 1개 path (caution stripe 어휘 폐기).
                 helmet palette는 기존 caution stripe (64 grid 평행사변형). */}
          {palette === 'safety' && gaugeClipPath && (
            <path d={gaugeClipPath} fill={colors.stripe} />
          )}
          {palette !== 'safety' && (() => {
            const totalStripes = 64;                                 // sweepDeg / 64 = 5° per stripe (sweep 320°)
            const stripeAngDeg = sweepDeg / totalStripes;
            const stripeAt = (i, startAngOffset, lenAngDeg) => {
              const a0 = startDeg + i * stripeAngDeg + startAngOffset;
              const a1 = startDeg + i * stripeAngDeg + startAngOffset + lenAngDeg;
              const [ix0, iy0] = pt(stripeInnerR, a0);
              const [ix1, iy1] = pt(stripeInnerR, a1);
              const [ox1, oy1] = pt(stripeOuterR, a1 + diagShiftDeg);
              const [ox0, oy0] = pt(stripeOuterR, a0 + diagShiftDeg);
              return `M ${ix0.toFixed(2)} ${iy0.toFixed(2)} ` +
                     `A ${stripeInnerR} ${stripeInnerR} 0 0 1 ${ix1.toFixed(2)} ${iy1.toFixed(2)} ` +
                     `L ${ox1.toFixed(2)} ${oy1.toFixed(2)} ` +
                     `A ${stripeOuterR} ${stripeOuterR} 0 0 0 ${ox0.toFixed(2)} ${oy0.toFixed(2)} Z`;
            };
            const partialIdx = Math.floor(consumedAngDeg / stripeAngDeg);     // boundary가 걸친 stripe
            const boundaryWithin = consumedAngDeg - partialIdx * stripeAngDeg; // 0 ~ stripeAngDeg
            const segments = [];
            // boundary가 stripe 내부일 때: 그 stripe의 trailing 부분만 그림
            if (boundaryWithin > 0.001 && partialIdx < totalStripes) {
              const isYellow = partialIdx % 2 === 0;
              const remainLen = stripeAngDeg - boundaryWithin;
              segments.push(
                <path key={`p${partialIdx}`}
                      d={stripeAt(partialIdx, boundaryWithin, remainLen)}
                      fill={isYellow ? colors.stripe : '#17171c'} />
              );
            }
            // 완전히 잔여인 stripes (boundary 이후)
            const firstFullIdx = boundaryWithin > 0.001 ? partialIdx + 1 : partialIdx;
            for (let i = firstFullIdx; i < totalStripes; i++) {
              const isYellow = i % 2 === 0;
              segments.push(
                <path key={i} d={stripeAt(i, 0, stripeAngDeg)} fill={isYellow ? colors.stripe : '#17171c'} />
              );
            }
            return <g>{segments}</g>;
          })()}

          {/* 4. energy wave — 좁은 밝은 streak가 ring을 따라 시계방향 traverse (SMIL animateTransform).
                 clipPath 는 boundary→gauge end 잔여 영역만 노출 → 소진된 좌측에서는 wave 보이지 않음.
                 게이지 줄어들수록 wave 보이는 cycle 비율이 짧아짐 (남은 에너지가 줄어드는 시각). */}
          {animate && (
            <g clipPath={`url(#gauge-clip-${uid})`}>
              <g>
                <path d={wavePath} fill={colors.waveTint} />
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
          )}

          {/* 5. flash-in overlay — waiting-v2 / rejected-v2 mount 시 한번 번쩍.
                 voting 부분 게이지 → 풀 게이지 점프 자연스럽게 흡수. palette 따라 cream/peach 톤. */}
          {full && gaugeClipPath && (
            <g className="jt-gauge-flash-in" style={{
              filter: palette === 'safety'
                ? `drop-shadow(0 0 40px rgba(255,220,200,0.9)) drop-shadow(0 0 90px ${colors.glow1})`
                : `drop-shadow(0 0 40px rgba(255,245,200,0.9)) drop-shadow(0 0 90px ${colors.glow1})`,
            }}>
              <path d={gaugeClipPath} fill={palette === 'safety' ? 'rgba(255, 230, 215, 0.92)' : 'rgba(255, 250, 220, 0.95)'} />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

// "더 있음" 인디케이터 — 1줄 표기 룰에서 MAX 초과 시 마지막 슬롯을 "..." 으로 채움.
// 2026-05-29: 8인+ 팀에서 두 줄 wrap 방지. hover 시 숨겨진 인원 수 툴팁.
function MoreIndicator({ size = 32, hiddenCount = 0, dashed = true }) {
  return (
    <div title={hiddenCount > 0 ? `${hiddenCount}명 더` : '더 있음'} style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.65)',
        border: dashed ? '2px dashed rgba(255,255,255,0.30)' : '2px solid rgba(255,255,255,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: Math.round(size * 0.42), fontWeight: 700,
        letterSpacing: '0.05em', lineHeight: 1,
      }}>···</div>
    </div>
  );
}

// 미수락자 아바타 (작은 점선 테두리 — "응답 대기 중" 시각 단서)
// 2026-05-29: compact prop 추가. 팀 인원 많으면(>4) 32px 축소판으로 ring 내부 공간 절약.
function PendingAvatar({ name, color, compact = false }) {
  const sz = compact ? 32 : 40;
  const fs = compact ? 11 : 12;
  const captionFs = compact ? 9 : 10;
  return (
    <div title={name + ' · 응답 대기 중'} style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 4 : 6,
    }}>
      <div style={{
        width: sz, height: sz, borderRadius: '50%',
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', fontSize: fs, fontWeight: 700, letterSpacing: '-0.04em',
        border: '2px dashed rgba(255,255,255,0.5)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>{avatarLabel(name)}</div>
      {!compact && <div style={{ fontFamily: 'var(--font-mono)', fontSize: captionFs, color: 'rgba(255,255,255,0.6)' }}>{name}</div>}
    </div>
  );
}

// ── voting-v2 fixture (4인) ─────────
const V2_TEAM_SMALL = [
  { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
  { name: '이서윤', color: 'var(--c-blue)',  state: 'pending' },
  { name: '박지호', color: 'var(--c-mint)',  state: 'pending' },
  { name: '최유나', color: 'var(--c-amber)', state: 'pending' },
];
// ── voting-v2 fixture (10인 — 큰 팀, MAX 5 초과로 "..." 트리거) ─────
const V2_TEAM_LARGE = [
  { name: '김민준', color: 'var(--c-helmet)',  state: 'requester' },
  { name: '이서윤', color: 'var(--c-blue)',    state: 'agreed' },
  { name: '박지호', color: 'var(--c-mint)',    state: 'pending' },
  { name: '최유나', color: 'var(--c-amber)',   state: 'pending' },
  { name: '정도윤', color: 'var(--c-tutorial)',state: 'pending' },
  { name: '한예준', color: 'var(--c-rebar)',   state: 'pending' },
  { name: '오시아', color: 'var(--c-deep)',    state: 'pending' },
  { name: '서지안', color: 'var(--c-safety)',  state: 'pending' },
  { name: '송하준', color: 'var(--c-ink-3)',   state: 'pending' },
  { name: '강민서', color: 'var(--c-slate)',   state: 'pending' },
];

// ── voting-v2 body (거대 ring · 6시 수락 버튼 · 미수락자만 노출) ─
// 데모: 초기 [요청자 1 + pending N-1]. t=2.5s 한 명 agree.
function E4VotingV2Body({ teamSize = 'small' } = {}) {
  const initial = teamSize === 'large' ? V2_TEAM_LARGE : V2_TEAM_SMALL;
  const [members, setMembers] = React.useState(initial);
  // small: 4명 + 이서윤만 t=2.5s에 agree.
  // large: 8명 + 박지호(인덱스 2)가 t=2.5s에 agree (이서윤은 이미 agreed로 시작).
  React.useEffect(() => {
    const flipName = teamSize === 'large' ? '박지호' : '이서윤';
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === flipName ? { ...x, state: 'agreed' } : x)), 2500);
    return () => clearTimeout(t1);
  }, [teamSize]);

  const remaining = useCountdown(10);
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
        <MatchAcceptRing remaining={remaining} total={10} size={480} />

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
              {(() => {
                const MAX = 5;
                const isLarge = pendingOnly.length > 4;
                const sz = isLarge ? 32 : 40;
                const showMore = pendingOnly.length > MAX;
                const slots = showMore ? pendingOnly.slice(0, MAX - 1) : pendingOnly;
                const hidden = pendingOnly.length - slots.length;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: isLarge ? 10 : 14, whiteSpace: 'nowrap' }}>
                    {slots.map((m, i) => <PendingAvatar key={i} {...m} compact={isLarge} />)}
                    {showMore && <MoreIndicator size={sz} hiddenCount={hidden} />}
                  </div>
                );
              })()}
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
            width: 190, height: 62, padding: 0, fontSize: 20, gap: 10, borderRadius: 10,
            fontFamily: 'var(--font-display)',
          }}>
            {Icon.bolt(18)} 수락
          </button>
        </div>
      </div>

      {/* 거절 버튼 — ring 아래 secondary. 디자인 시스템 표준 사이즈 (jt-btn 36px height) 사용.
          variant: jt-btn-danger-outlined-dark (v1 voting 거부와 semantic 통일 — 거절=danger).
          marginTop: 16 — waiting-v2 캡션과 동일 (ring 수직 중심 일치). */}
      <div style={{ marginTop: 16, height: 36, display: 'flex', alignItems: 'center' }}>
        <button data-action="reject" className="jt-btn jt-btn-danger-outlined-dark">
          {Icon.x(12)} 거절
        </button>
      </div>
    </div>
  );
}

// ── waiting-v2 body (거대 ring · 6시 "동의 완료" pill · 미수락자만 노출) ─
// voting-v2 와 동일 ring 어휘. 본인 동의 후 다른 팀원 대기. 취소 불가.
// 데모: 본인=이서윤 가정. 진입 시 이서윤 agreed 확정. t=3s 다음 팀원 agree.
function E4WaitingV2Body({ teamSize = 'small' } = {}) {
  // small: V2_TEAM_SMALL 기반 + 이서윤 agreed 로 override
  // large: V2_TEAM_LARGE 그대로 (이서윤 이미 agreed)
  const initial = teamSize === 'large'
    ? V2_TEAM_LARGE
    : V2_TEAM_SMALL.map(m => m.name === '이서윤' ? { ...m, state: 'agreed' } : m);
  const [members, setMembers] = React.useState(initial);
  React.useEffect(() => {
    // small: t=3s에 박지호 agree. large: t=3s에 정도윤 agree.
    const flipName = teamSize === 'large' ? '정도윤' : '박지호';
    const t1 = setTimeout(() => setMembers(m => m.map(x => x.name === flipName ? { ...x, state: 'agreed' } : x)), 3000);
    return () => clearTimeout(t1);
  }, [teamSize]);

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
              {(() => {
                const MAX = 5;
                const isLarge = pendingOnly.length > 4;
                const sz = isLarge ? 32 : 40;
                const showMore = pendingOnly.length > MAX;
                const slots = showMore ? pendingOnly.slice(0, MAX - 1) : pendingOnly;
                const hidden = pendingOnly.length - slots.length;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: isLarge ? 10 : 14, whiteSpace: 'nowrap' }}>
                    {slots.map((m, i) => <PendingAvatar key={i} {...m} compact={isLarge} />)}
                    {showMore && <MoreIndicator size={sz} hiddenCount={hidden} />}
                  </div>
                );
              })()}
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
            width: 190, height: 62, padding: 0, fontSize: 20, gap: 10, borderRadius: 10,
            fontFamily: 'var(--font-display)',
            cursor: 'default', opacity: 1,  /* disabled 의 opacity 0.4 override — 정보 상태이므로 흐려지면 안 됨 */
          }}>
            {Icon.check(18)} 수락했어요
          </button>
        </div>
      </div>

      {/* ring 아래 캡션 — voting-v2 의 거절 버튼 자리(height 36 / marginTop 16)와 매칭 → 두 화면 ring 수직 중심 일치. */}
      <div style={{
        marginTop: 16, height: 36, display: 'flex', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>응답 취소 불가 · 타이머 종료 대기</div>
    </div>
  );
}

// ── rejected v2 body (LoL 매치 무산 어휘 · safety palette · 풀 ring 정지) ──
// 2026-05-29: v2 세트 (voting-v2 / waiting-v2) 연속성. 게이지 풀 + safety 주황 stripes + energy wave 정지.
// 내부: safety X icon + "합의가 무산됐어요" 헤드라인 + 4 결과 portraits + 6시 [캔버스로 돌아가기] CTA.
// 어휘 변경: helmet 노랑(가능성·진행) → safety 주황(실패·돌아가기). flash-in 도 주황 톤.
// rejected-v2 fixtures — 4가지 outcome (요청자·동의·거절·응답없음) 모두 보이도록 구성
const V2_OUTCOMES_SMALL = [
  { name: '김민준', color: 'var(--c-helmet)', state: 'requester' },
  { name: '이서윤', color: 'var(--c-blue)',  state: 'agreed' },
  { name: '박지호', color: 'var(--c-mint)',  state: 'rejected' },
  { name: '최유나', color: 'var(--c-amber)', state: 'timeout' },
];
// 10인 outcomes — losers(rejected+timeout) 6명으로 MAX 5 초과 → "..." 트리거
const V2_OUTCOMES_LARGE = [
  { name: '김민준', color: 'var(--c-helmet)',  state: 'requester' },
  { name: '이서윤', color: 'var(--c-blue)',    state: 'agreed' },
  { name: '박지호', color: 'var(--c-mint)',    state: 'agreed' },
  { name: '최유나', color: 'var(--c-amber)',   state: 'agreed' },
  { name: '정도윤', color: 'var(--c-tutorial)',state: 'rejected' },
  { name: '한예준', color: 'var(--c-rebar)',   state: 'rejected' },
  { name: '오시아', color: 'var(--c-deep)',    state: 'rejected' },
  { name: '서지안', color: 'var(--c-safety)',  state: 'timeout' },
  { name: '송하준', color: 'var(--c-ink-3)',   state: 'timeout' },
  { name: '강민서', color: 'var(--c-slate)',   state: 'timeout' },
];

function E4FailureV2Body({ teamSize = 'small' } = {}) {
  const members = teamSize === 'large' ? V2_OUTCOMES_LARGE : V2_OUTCOMES_SMALL;

  // 3초 카운트다운 후 자동 [돌아가기] click — 실 운영에서 timeout 시 자동 캔버스 복귀.
  const [autoSecs, setAutoSecs] = React.useState(3);
  React.useEffect(() => {
    if (autoSecs <= 0) {
      // 0 도달 — 버튼 click dispatch (viewer ACTIONS 위임으로 라우팅)
      const btn = document.querySelector('[role="alertdialog"] [data-action="back-to-canvas"]');
      btn?.click();
      return;
    }
    const t = setTimeout(() => setAutoSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [autoSecs]);
  // outcome avatar 어휘: 32px circle + state-driven ring + 작은 칩
  const outcomeLabel = {
    requester: { ring: 'var(--c-helmet)', chip: '요청자', chipBg: 'var(--c-helmet-soft)', chipFg: 'var(--c-stache)' },
    agreed:    { ring: 'var(--c-mint)',   chip: '동의',   chipBg: '#ffffff',               chipFg: 'var(--c-mint)' },
    rejected:  { ring: 'var(--c-safety)', chip: '거절',   chipBg: '#ffffff',               chipFg: 'var(--c-safety-deep)' },
    timeout:   { ring: 'rgba(255,255,255,0.35)', chip: '응답 없음', chipBg: 'rgba(255,255,255,0.10)', chipFg: 'rgba(255,255,255,0.6)' },
  };

  return (
    <div role="alertdialog" aria-modal="true" aria-label="합의 무산 (v2)" style={{
      position: 'absolute', inset: 0, zIndex: 51,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', gap: 0,
      animation: 'jt-modal-fade-in var(--dur-base) var(--ease-decelerate)',
    }}>
      <div style={{ position: 'relative', width: 480, height: 480 }}>
        {/* 정지된 풀 게이지 — safety palette + animate=false (에너지 정지) */}
        <MatchAcceptRing full={true} palette="safety" animate={false} size={480} />

        {/* 내부 콘텐츠 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 70, textAlign: 'center', gap: 14,
        }}>
          {/* 84px safety X — v1 rejected와 동일 어휘 */}
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'var(--c-safety)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 28px rgba(255,107,31,0.45), 0 0 0 6px rgba(255,107,31,0.18)',
            marginBottom: 4,
          }}>{Icon.x(48)}</div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.022em',
            margin: 0, lineHeight: 1.25,
          }}>합의가 무산됐어요</h2>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
            캔버스를 수정한 뒤 다시 시도하세요
          </div>

          {/* outcome portraits — 실패 원인이 된 사람(rejected/timeout)만 1줄로 표기. MAX 5 초과 시 "...". */}
          {(() => {
            const losers = members.filter(m => m.state === 'rejected' || m.state === 'timeout');
            if (losers.length === 0) return null;
            const MAX = 5;
            const isLarge = losers.length > 4;
            const sz = isLarge ? 32 : 40;
            const fs = isLarge ? 11 : 13;
            const showMore = losers.length > MAX;
            const slots = showMore ? losers.slice(0, MAX - 1) : losers;
            const hidden = losers.length - slots.length;
            return (
              <div style={{
                marginTop: 10, display: 'flex', justifyContent: 'center',
                gap: isLarge ? 10 : 14, whiteSpace: 'nowrap',
              }}>
                {slots.map((m, i) => {
                  const o = outcomeLabel[m.state];
                  const isMuted = m.state === 'timeout';
                  return (
                    <div key={i} style={{
                      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      opacity: isMuted ? 0.7 : 1,
                    }}>
                      <div style={{
                        width: sz, height: sz, borderRadius: '50%',
                        background: m.color, color: '#fff',
                        border: `2px solid ${o.ring}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: fs, fontWeight: 700,
                        boxShadow: m.state === 'rejected' ? '0 0 0 3px rgba(255,107,31,0.25)' : 'none',
                      }}>{avatarLabel(m.name)}</div>
                      {!isLarge && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>{m.name}</div>}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: o.chipBg, color: o.chipFg,
                        padding: '2px 7px', borderRadius: 999,
                        fontSize: 9.5, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
                      }}>{o.chip}</span>
                    </div>
                  );
                })}
                {showMore && <MoreIndicator size={sz} hiddenCount={hidden} dashed={false} />}
              </div>
            );
          })()}
        </div>

        {/* 6시 캔버스로 돌아가기 버튼 — voting-v2 수락 버튼 자리·크기 동일 */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 0 24px rgba(255,206,43,0.45)) drop-shadow(0 14px 24px rgba(0,0,0,0.55))',
        }}>
          <button data-action="back-to-canvas" className="jt-btn jt-btn-critical on-dark" style={{
            width: 190, height: 62, padding: 0, fontSize: 18, gap: 10, borderRadius: 10,
            fontFamily: 'var(--font-display)',
          }}>
            {Icon.arrowLeft(16)} 돌아가기
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, opacity: 0.7, letterSpacing: '0.02em', marginLeft: 2 }}>({autoSecs}s)</span>
          </button>
        </div>
      </div>

      {/* ring 아래 — 캡션 폐기. 빈 placeholder로 voting/waiting 와 동일 height 36 / marginTop 16 유지 (ring 수직 정렬). */}
      <div style={{ marginTop: 16, height: 36 }} aria-hidden="true" />
    </div>
  );
}

// ── v1 rejected body 는 2026-06-01 v1 폐기와 함께 제거. v2(E4FailureV2Body)가 정본. ──

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
          maxWidth: 'calc(100vw - 48px)',
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

// E-6 폐기 (2026-05-29): 일시정지/재시작 기능 자체를 제거.
// 진행 중 휴식은 운영자 구두 안내로 처리하고, 작업물은 자동 저장된다.
// 어드민 기획 v11 · 로그인 기획 v9 정합.

// E-7 폐기 (2026-05-27): 참가자에게는 종료 예고 없음 정책.
// 30초 유예는 운영자 전용이며, 종료 확정 시 참가자 화면은 C-3/C-4 → 대기실 ③(c1-ended)로 직접 전환.
// 참가자-로그인-기획.md §자동 전환 매트릭스 "[해커톤 종료] → 대기실 ③"와 정합.

Object.assign(window, { E1ProjectSettings, E1UnsavedCloseConfirm, E4ConsensusVote });
