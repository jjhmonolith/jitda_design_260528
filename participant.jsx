/* C. 참가자 핵심 흐름
   · OpenCode 는 별도 서비스의 iframe 으로 임베드 (색·라벨만 살짝 조정 가능 / UI 구조는 그대로)
   · 우리(짓다) 가 자유롭게 설계할 수 있는 영역은 위쪽 툴바, 그 위의 오버레이(튜토리얼 코치마크·합의 투표 등) 뿐
*/

// ─── C-1. 팀 대기실 ─────────────────────────────────────────────
// 페이지 정의서 v23848e86 + 참가자-로그인-기획 v8 (2026-05-23) 반영
//
// 팀 대기실은 "대기실 3개"로 명시된다 — 운영자가 상태를 전이하면
// 참가자 화면은 "자동 전환" (참가자 클릭 불필요):
//
//   roomBefore        대기실 ① 시작 전 대기      tutorial_waiting / 튜토리얼 미사용 hackathon_waiting
//   roomAfterTutorial 대기실 ② 튜토리얼 후 대기   튜토리얼 거친 hackathon_waiting (2026-05-26: tutorial_ended 폐기, hackathon_waiting으로 통합)
//   roomEnded         대기실 ③ 해커톤 종료 안내   hackathon_ended  → [갤러리]만 (결과 보기 폐기 2026-05-29)
//
// 일시정지/재시작은 2026-05-29 폐기 — 진행 중 휴식은 운영자 구두 안내로 처리한다.
// C·E 영역 모두 일시정지 관련 화면 없음.
//
// 이전 버전의 [튜토리얼 시작하기]·[해커톤 입장하기] 클릭 진입은 **제거**.
// tutorial_running / hackathon_running 시점에는 대기실이 아닌 C-2 / C-3·C-4 화면이 떠 있어
// 참가자는 이 컴포넌트를 보지 않는다.
//
// MOCK 팀 데이터 — 표준 케이스(4인, 짧은 팀명) 기본값으로 호환 유지.
// 학교 현장 변동성(긴 팀명, 다인팀) 검증용 변형은 아래 export.
const MOCK_TEAM_STANDARD = {
  name: '터미널 사파리',
  members: [
    { name: '김민준', color: 'var(--c-helmet)', online: 'connected' }, // 접속
    { name: '이서윤', color: 'var(--c-blue)',  online: 'idle'      }, // 입장 전 (3상태 시각 검증용 — 2026-05-27 추가)
    { name: '박지호', color: 'var(--c-mint)',  online: 'offline'   }, // 미접속
    { name: '최지유', color: 'var(--c-amber)', online: 'connected' }, // 나
  ],
  me: '최지유',
};

const MOCK_TEAM_LONG_NAME = {
  name: '사이버보안 챌린지 우승팀 9조 - 디지털선도학교',
  members: [
    { name: '김민준', color: 'var(--c-helmet)', online: 'connected' },
    { name: '이서윤', color: 'var(--c-blue)',  online: 'connected' },
    { name: '박지호', color: 'var(--c-mint)',  online: 'offline'   },
    { name: '최지유', color: 'var(--c-amber)', online: 'connected' },
  ],
  me: '최지유',
};

const MOCK_TEAM_MANY_MEMBERS = {
  name: '메가 해커톤 7조',
  members: [
    { name: '김민준', color: 'var(--c-helmet)',       online: 'connected' },
    { name: '이서윤', color: 'var(--c-blue)',        online: 'connected' },
    { name: '박지호', color: 'var(--c-mint)',        online: 'offline'   },
    { name: '최지유', color: 'var(--c-amber)',       online: 'connected' },
    { name: '정도현', color: 'var(--c-helmet-deep)', online: 'connected' },
    { name: '한예린', color: 'var(--c-safety)',      online: 'offline'   },
    { name: '오태웅', color: 'var(--c-helmet)',       online: 'connected' },
  ],
  me: '최지유',
};

// ─── C-1 · 운영자 b2-tutorial-waiting 디자인 어휘 이식 (2026-05-29 v2 채택, v1 폐기) ─────────
//
// 출처: operator.jsx DashboardShell + RosterTeamDetailModal + PhaseHover + LiveStatus 어휘를 참가자 단일팀 컨텍스트로 재구성.
//   · grain background (24px grid) — operator.jsx L440
//   · sticky meta row (52px) with hackathon name · PhaseHover · LiveStatus — operator.jsx L446
//   · 세로형 포스트잇 (단일 흰색 §18-27 + tape + rotation) — operator.jsx RosterTeamDetailModal L1648
//   · RosterMemberRow 전체 이름 행 (shared.jsx, 운영자 모달과 동일 어휘) — 미니 아바타 폐기
//
// 2026-05-29 리비전: 옆으로 긴 hero postit 폐기 → 좌측 메시지 + 우측 세로형 포스트잇 두-컬럼 레이아웃.
// 사용자 결정: "대기실에선 팀 하나만 보이니까 이름 전체 다 보이게" + "옆으로 긴 거 말고" + 포스트잇 정책 §18-27 단일 흰색 반영.

// 5단계 phase — operator.jsx PHASE_STAGES와 동일 (참가자도 같은 stepper popover 사용)
const PARTICIPANT_PHASE_STAGES = [
  { id: 'tutorial_waiting',  label: '튜토리얼 대기', bg: '#ebebec',            fg: '#2a2823' },
  { id: 'tutorial_running',  label: '튜토리얼 진행', bg: '#e1e0fa',            fg: '#2e2c8a' },
  { id: 'hackathon_waiting', label: '해커톤 대기',   bg: '#ebebec',            fg: '#2a2823' },
  { id: 'hackathon_running', label: '해커톤 진행',   bg: 'var(--c-mint-soft)', fg: 'var(--c-mint)' },
  { id: 'hackathon_ended',   label: '해커톤 종료',   bg: '#ffe1de',            fg: '#882019' },
];

// 운영자 PhaseHover 포팅 — 참가자 시점. StatusPill 호버 시 5단계 stepper popover.
function ParticipantPhaseHover({ currentStatus }) {
  const currentIdx = PARTICIPANT_PHASE_STAGES.findIndex((s) => s.id === currentStatus);
  return (
    <span className="jt-phase-hover" tabIndex={0} aria-haspopup="true" aria-label="단계 진행도 보기">
      <StatusPill status={currentStatus} />
      <div className="jt-phase-popover" role="tooltip" style={{
        position: 'absolute',
        top: 'calc(100% + 10px)', left: 0,
        zIndex: 'var(--z-popover)',
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline-strong)',
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-popover)',
        padding: '10px 12px',
        minWidth: 220,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>PHASE</div>
        {PARTICIPANT_PHASE_STAGES.map((s, i) => {
          const isCurrent = i === currentIdx;
          const isPast = i < currentIdx;
          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 9px',
              borderRadius: 6,
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              background: isCurrent ? s.bg : 'transparent',
              color: isCurrent ? s.fg : isPast ? 'var(--c-slate)' : 'var(--c-muted)',
              fontWeight: isCurrent ? 700 : 500,
              border: isCurrent ? `1px solid ${s.fg}` : '1px solid transparent',
              opacity: isPast ? 0.65 : 1,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, minWidth: 16 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {isCurrent && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>← 현재</span>}
            </div>
          );
        })}
      </div>
    </span>
  );
}

// 팀명 hash 기반 결정적 회전 — 같은 팀은 어느 화면에서나 같은 자세 (operator.jsx postitRotation 동일 알고리즘).
function heroPostitRotation(name) {
  const rotations = ['var(--postit-rot-a)', 'var(--postit-rot-b)', 'var(--postit-rot-c)', 'var(--postit-rot-d)'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) | 0;
  return rotations[((h % 4) + 4) % 4];
}

// 성씨 기반 아바타 색 — operator.jsx rosterAvatarColor와 동일 팔레트. RosterMemberRow에 주입.
const PARTICIPANT_AVATAR_PALETTE = [
  'var(--c-helmet)', 'var(--c-blue)', 'var(--c-mint)', 'var(--c-amber)',
  'var(--c-helmet-deep)', 'var(--c-safety)',
];
function participantAvatarColor(name) {
  return PARTICIPANT_AVATAR_PALETTE[name.charCodeAt(0) % PARTICIPANT_AVATAR_PALETTE.length];
}

// 세로형 팀 포스트잇 — 운영자 RosterTeamDetailModal과 동일 어휘 (포스트잇 모달 zoom-in).
//   · 단일 흰색 (§18-27): var(--c-canvas)
//   · 폭 440px (사용자 결정 유지) · 세로 auto
//   · tape — .jt-postit-card ::before 자동 주입 (상단 중앙, ink-alpha)
//   · 카드 전체에 deterministic 회전 (heroPostitRotation) — postit 손맛
//   · 본문: 공용 RosterMemberRow (shared.jsx) — 전체 이름 + 28px 아바타 + 우하단 인디케이터 도트 + 본인 강조
//   · 푸터: 공용 RosterLegend
function TeamPostitV2({ team, ended }) {
  const onCount = team.members.filter((m) => m.online === 'connected').length;
  const total = team.members.length;
  // 2026-06-01 paper 폐기 (§19 deprecated) → .jt-postit-card 어휘 복귀.
  // 인터랙션이 없는 단일 패널이라 hover 회전·lift 불필요 → jt-postit-card-static 결합.
  const rot = heroPostitRotation(team.name);
  return (
    <div
      className="jt-postit-card jt-postit-card-static jt-postit-tape-lg"
      tabIndex={0}
      style={{
        width: '100%', maxWidth: 440, flexShrink: 1,
        display: 'flex', flexDirection: 'column',
        borderRadius: 'var(--r-xs)',
        opacity: ended ? 0.92 : 1,
        '--postit-rot': rot,
        '--postit-tint': 'var(--c-canvas)',
      }}>
      {/* 헤더 — 포스트잇 어휘는 paper safe area 불필요 → padding 36→24 축소. tape ::before와는 top -3px라 본문 padding과 충돌 없음. */}
      <div style={{
        flex: '0 0 auto',
        padding: '24px 28px 18px',
        borderBottom: '1px solid var(--c-hairline)',
      }}>
        <div title={team.name} style={{
          fontSize: 22, fontWeight: 700, lineHeight: 1.25,
          fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
          color: ended ? 'var(--c-ink-2)' : 'var(--c-ink)',
          wordBreak: 'keep-all',
        }}>{team.name}</div>
        <div style={{
          fontSize: 12, color: 'var(--c-slate)', marginTop: 4,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
        }}>
          {ended ? `${total}명 참여 · 종료됨` : `${onCount} / ${total} 접속 중`}
        </div>
      </div>

      {/* 본문 — 공용 RosterMemberRow. team.me로 본인 강조. idle은 'pending'으로 매핑. */}
      <div style={{
        flex: '1 1 auto', minHeight: 0,
        padding: '12px 20px 10px',
        display: 'flex', flexDirection: 'column', gap: 2,
        overflow: 'auto',
      }}>
        <div className="jt-mono" style={{
          fontSize: 10.5, color: 'var(--c-muted)',
          letterSpacing: '0.08em', padding: '4px 8px 6px',
          flexShrink: 0,
        }}>
          팀원 {total}명
        </div>
        {team.members.map((m, i) => {
          const memberState = m.online === 'connected' ? 'on' : m.online === 'idle' ? 'pending' : 'off';
          return (
            <RosterMemberRow
              key={i}
              name={m.name}
              color={m.color || participantAvatarColor(m.name)}
              state={memberState}
              isMe={m.name === team.me}
            />
          );
        })}
      </div>

      {/* 푸터 — 공용 RosterLegend. */}
      <div style={{
        flex: '0 0 auto',
        padding: '14px 24px 20px',
        borderTop: '1px solid var(--c-hairline)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <RosterLegend states={['on', 'off']} />
      </div>
    </div>
  );
}

// ── C-1 v2 메인 ─────────────────────────────────────────────
// state: 'roomBefore' | 'roomAfterTutorial' | 'roomEnded'
// team: MOCK_TEAM_STANDARD 등.
function C1TeamRoomV2({ state = 'roomBefore', team = MOCK_TEAM_STANDARD }) {
  const stateMap = {
    roomBefore: {
      status: 'tutorial_waiting',
      eyebrow: '곧 시작됩니다',
      headline: <>잠시만 기다려주세요.<br />화면만 켜두면 자동으로 시작돼요.</>,
      body: '운영자가 튜토리얼을 시작하면 다음 단계로 자동 전환됩니다. 자리를 비워도 괜찮아요.',
      hintLabel: '시작을 기다리는 중',
      hintColor: 'var(--c-helmet)',
      actions: null,
      ended: false,
    },
    roomAfterTutorial: {
      status: 'hackathon_waiting',
      eyebrow: '튜토리얼 완료',
      headline: <>튜토리얼이 끝났습니다.<br />해커톤이 곧 시작됩니다.</>,
      body: '운영자가 해커톤을 시작하면 코딩 환경이 자동으로 열려요. 본행사는 새 프로젝트에서 시작합니다. 기다리는 동안 튜토리얼 갤러리에서 다른 팀의 결과를 둘러볼 수 있어요.',
      hintLabel: '해커톤 시작을 기다리는 중',
      hintColor: 'var(--c-tutorial)',
      actions: [{ label: '튜토리얼 갤러리 둘러보기', kind: 'secondary', icon: Icon.gallery(13), action: 'open-tutorial-gallery' }],
      ended: false,
    },
    roomEnded: {
      status: 'hackathon_ended',
      eyebrow: '해커톤 종료',
      headline: <>수고하셨어요.<br />다른 팀의 작품도 둘러보세요.</>,
      body: '오늘 만든 작품들이 갤러리에 모두 공개됐어요. 마음에 드는 작품엔 ❤️ 로 응원을 남겨주세요.',
      hintLabel: null,
      actions: [{ label: '갤러리로 가기', kind: 'critical', icon: Icon.gallery(13), action: 'open-gallery' }],
      ended: true,
    },
  };
  const s = stateMap[state] ?? stateMap.roomBefore;

  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      // 운영자 b2-tutorial-waiting과 동일 grain — 24px grid (operator.jsx L440).
      background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)',
    }}>
      {/* GNB — AppHeader 어휘 (운영자와 동일) 차용. 우측은 참가자 정보 (이름·팀명·아바타). */}
      <AppHeader
        user={null}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            paddingRight: 12, borderRight: '1px solid var(--c-hairline)',
          }}>
            <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>
              {DEFAULT_PARTICIPANT_USER.name} · {DEFAULT_PARTICIPANT_USER.team}
            </span>
            <div className="jt-avatar" style={{
              background: DEFAULT_PARTICIPANT_USER.color, color: '#fff',
              width: 26, height: 26, fontSize: 10,
              fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
            }}>{DEFAULT_PARTICIPANT_USER.name.slice(-2)}</div>
          </div>
        }
      />

      {/* Sticky meta row — 운영자 DashboardShell sticky header 동일 구조 (52px).
          해커톤명 | divider | PhaseHover | (flex) | LiveStatus */}
      <div style={{
        flex: '0 0 auto',
        background: 'var(--c-canvas)',
        borderBottom: '1px solid var(--c-hairline)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 14,
        height: 52,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>2026 봄 ENK 해커톤</h2>
        <div style={{
          paddingLeft: 14, marginLeft: 2,
          borderLeft: '1px solid var(--c-hairline)',
          alignSelf: 'stretch',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <ParticipantPhaseHover currentStatus={s.status} />
        </div>
        <div style={{ flex: 1 }} />
      </div>

      {/* 본문 — 3:2 컬럼: 좌측 메시지 / 우측 세로형 팀 포스트잇.
          "좌측은 멘트, 우측은 포스트잇" + "3:2 정도" 사용자 결정. 메시지 좌측 hugs, 포스트잇 컬럼 중앙. */}
      <main style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
        gap: 32,
        padding: '40px 56px 40px 80px',
        alignItems: 'center',
        overflow: 'auto',
      }}>
        {/* 좌측: 메시지 + hint/CTA. 좌측 정렬 + 좌측 컬럼 시작점에 hugs. */}
        <section style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          textAlign: 'left', maxWidth: 560,
          justifySelf: 'start',
        }}>
          {!s.ended && (
            <div style={{ marginBottom: 2, overflow: 'visible' }}>
              {/* 튜토리얼 대기 = 도면 검토(BLUEPRINT) / 해커톤 대기 = 곡괭이질(DIG, "이제 짓는다") */}
              {state === 'roomAfterTutorial'
                ? <JitdaMascotDig size={96} />
                : <JitdaMascotBlueprint size={104} />}
            </div>
          )}
          <div className="jt-eyebrow" style={{
            fontSize: 11, letterSpacing: '0.16em',
            color: s.ended ? 'var(--c-safety-deep)' :
                   state === 'roomAfterTutorial' ? 'var(--c-tutorial)' :
                   'var(--c-helmet-deep)',
          }}>{s.eyebrow}</div>
          <h1 style={{
            fontSize: 38, lineHeight: 1.18, letterSpacing: '-0.025em',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            color: 'var(--c-ink)',
            margin: 0,
          }}>{s.headline}</h1>
          <p style={{
            fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.65,
            margin: 0,
          }}>{s.body}</p>

          {/* Hint pulse + CTA 버튼 — 메시지 바로 아래 (단일 좌측 컬럼 안).
              roomAfterTutorial은 둘 다 노출(대기 중 pulse + 튜토리얼 갤러리 진입), roomEnded는 CTA만, roomBefore는 hint만. */}
          {s.hintLabel && (
            <div style={{
              alignSelf: 'flex-start', marginTop: 6,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--c-canvas)',
              border: '1px solid var(--c-hairline)',
              padding: '8px 16px', borderRadius: 999,
              fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-slate)',
              boxShadow: '0 1px 2px rgba(20,19,15,0.04)',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: s.hintColor,
                animation: 'pulse 1.6s infinite', display: 'inline-block',
              }} />
              {s.hintLabel}
            </div>
          )}
          {s.actions && (
            <div style={{ display: 'flex', gap: 10, marginTop: s.hintLabel ? 4 : 10 }}>
              {s.actions.map((a, i) => (
                <button
                  key={i}
                  data-action={a.action}
                  className={`jt-btn ${a.kind === 'critical' ? 'jt-btn-critical' : a.kind === 'primary' ? 'jt-btn-primary' : 'jt-btn-secondary'}`}
                  style={{ padding: '12px 22px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 우측: 세로형 팀 포스트잇 — 컬럼 좌측 정렬(2026-05-29 사용자 결정 "너무 오른쪽 치우침"). */}
        <div style={{ justifySelf: 'start', width: '100%', minWidth: 0 }}>
          <TeamPostitV2 team={team} ended={s.ended} />
        </div>
      </main>
    </div>
  );
}

// v2 alias — 3상태 (운영자 b2-tutorial-waiting 디자인 어휘 이식)
function C1RoomBeforeV2() { return <C1TeamRoomV2 state="roomBefore" />; }
function C1RoomAfterTutorialV2() { return <C1TeamRoomV2 state="roomAfterTutorial" />; }
function C1RoomEndedV2() { return <C1TeamRoomV2 state="roomEnded" />; }





// ─── 짓다 툴바 (참가자 GNB 통합) ─────────────────────────────────
// 모든 참가자 화면(C-1·C-2·C-3·C-4) + 그 위 모달(E-4·E-5) 공용.
// 구조: 로고 | 해커톤명 | StatusPill | (flex) | actions(있으면) | 계정정보(이름·팀명·아바타)
// 룰:
//  · 팀원 아바타 묶음·"팀·N명" pill·남은시간·서버재시작 모두 제거 (사용자 결정 2026-05-26)
//  · 우측 계정정보는 모든 화면 공통 (기본값 = 최지유 · 터미널 사파리)
//  · 액션 버튼은 화면별로 prop 주입: C-1·C-2(없음), C-3·C-4·E-4·E-5([내 프로젝트][갤러리 보기])
function JitdaToolbar({ status, actions, user = DEFAULT_PARTICIPANT_USER }) {
  return (
    <header style={{
      flex: '0 0 auto',
      background: 'var(--c-canvas)',
      borderBottom: '1px solid var(--c-hairline)',
      padding: '8px 24px',
      minHeight: 44,
      display: 'flex', alignItems: 'center', gap: 14,
      fontSize: 13,
    }}>
      <JitdaMark size={13} />
      <div style={{ width: 1, background: 'var(--c-hairline-strong)', height: 14 }} />
      <span style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>2026 봄 ENK 해커톤</span>
      {status && <StatusPill status={status} />}
      <div style={{ flex: 1 }} />
      {actions}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>
          {user.name} · {user.team}
        </span>
        <div className="jt-avatar" style={{
          background: user.color, color: '#fff',
          width: 26, height: 26, fontSize: 10,
          fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
        }}>{user.name.length >= 2 ? user.name.slice(-2) : user.name}</div>
      </div>
    </header>
  );
}

const DEFAULT_PARTICIPANT_USER = {
  name: '최지유',
  team: '터미널 사파리',
  color: 'var(--c-amber)',
};

// 참가자 캔버스(C-3·C-4·E-4·E-5)에서 GNB 우측에 들어가는 액션 묶음.
// [내 프로젝트][갤러리 보기] — 서버 재시작은 사용자 결정으로 제거.
// 손들기는 toolbar가 아니라 composer 하단 액션 바(OpenCodeShell)에 위치 — 2026-06-22 사용자 결정
//   ("toolbar는 눈에 안 띄고 규칙도 없음, 손들기는 입력창 액션 바 안에").
function ParticipantCanvasActions() {
  return (
    <>
      <button className="jt-btn jt-btn-secondary jt-btn-sm" style={{ padding: '5px 10px', fontSize: 11.5 }}>
        {Icon.settings(11)} 내 프로젝트
      </button>
      <button className="jt-btn jt-btn-primary jt-btn-sm" style={{ padding: '5px 10px', fontSize: 11.5 }}>
        {Icon.gallery(12)} 갤러리 보기
      </button>
    </>
  );
}

// 손들기 토글 — C-2 튜토리얼·C-3·C-4 코딩 화면 composer 하단 액션 바(전송 버튼 옆)에 위치.
// 기획: 03-planning/product/2026-06-01_손들기-기획.md §6-1. 2026-06-22 위치 변경: toolbar → composer 액션 바.
// 2026-06-22: 튜토리얼(C-2)에도 노출(기획 §5-1 "튜토리얼 제외" 룰 폐기 — 사용자 결정).
// 정책(v2): 팀 단위 신호 — 만장일치 합의 없이 팀원 누구나 누르면 즉시 팀 전체가 손든 상태가 되고,
//   누구나 다시 눌러 끌 수 있다. (전송 합의 E-4 의 만장일치 투표와는 별개 — 손들기는 즉시 토글.)
//   해제 경로: ① 학생 재클릭(취소) ② 운영자 [✓ 해결]. 시간 자동 해제 없음.
//   상태는 hand_raised_at(team 레벨)이므로 실제 구현 시 팀원 전원에게 동일 버튼 상태로 동기화.
// 시각: 정상 = 중립(canvas+hairline) / 손든 = helmet(브랜드 노랑) filled. oc-hand-btn (tokens.css).
function HandRaiseButton() {
  const [raised, setRaised] = React.useState(false);
  return (
    <button
      type="button"
      data-action="raise-hand"
      onClick={() => setRaised((v) => !v)}
      aria-pressed={raised}
      title={raised
        ? '취소하기 — 팀원 누구나 끌 수 있어요'
        : '도움을 요청해요 — 누르면 팀 전체가 손든 상태가 돼요'}
      className={'oc-hand-btn' + (raised ? ' is-raised' : '')}>
      {Icon.hand(13)} {raised ? '손든 상태' : '손들기'}
    </button>
  );
}

// 튜토리얼(C-2) 전용 — [내 프로젝트] 등 메뉴는 차단하되 [튜토리얼 갤러리]만 허용 (2026-06-22).
// 진행 중에도 다른 팀의 튜토리얼 결과를 둘러볼 수 있게.
function ParticipantTutorialGalleryAction() {
  return (
    <button data-action="open-tutorial-gallery" className="jt-btn jt-btn-secondary jt-btn-sm" style={{ padding: '5px 10px', fontSize: 11.5 }}>
      {Icon.gallery(12)} 튜토리얼 갤러리
    </button>
  );
}


// ─── OpenCode 임베드 셸 (minimal embed · 하이파이 재설계 2026-06-08) ──────────
// 참가자가 보는 OpenCode = enk-opencode MINIMAL_MODE: 헤더·파일/검토/컨텍스트 탭·
// 터미널·모델 선택기 전부 숨김. 좌(대화 타임라인 + composer) · 우(라이브 미리보기 iframe).
// composer 는 BlockSuite doc 에디터(참조 블록·드로잉·첨부)를 짓다 토큰으로 재현.
// ⚠ 모델명 노출 금지 (운영 빌드 sonnet 4.6 고정·가림 정합).
// 근거: enk-opencode feature/add-context-ux2 — components/blocksuite/·doc-submit/·prompt-input/.
//
// Props (전부 optional · 하위호환):
//   promptCard    사용자 발화 (paper-edge 메시지). title 은 임베드라 미표시.
//   body          AI 응답 본문 (없으면 기본 샘플 — 도구호출·문단·diff)
//   draft|promptInput  composer 초안 텍스트 (draft 우선)
//   composerRef   composer 안 참조 블록 노드 (OcReferenceBlock)
//   dock          composer 위 동적 dock 노드 (질문/권한/Todo 등)
//   sendAction    전송 버튼 data-action (1인팀 즉시전송=없음 / 다인팀 합의=‘request-send’). 버튼 디자인은 공용 단일.
//   preview       우측 미리보기 노드 (지정 시 previewState 무시)
//   previewState  'ready' | 'empty' | 'spawning' | 'generating' (기본 ready)
//   previewUrl    미리보기 슬림 헤더 주소 pill
//   leftWidth     좌측 대화 컬럼 폭 (기본 460)
//   overlay       셸 위 absolute 오버레이 (팀 커서·코치마크 등)
function OpenCodeShell({
  title,
  promptCard,
  body,
  draft,
  promptInput,
  composerRef,
  dock,
  sendAction,
  onSend,
  preview,
  previewState = 'ready',
  previewUrl = 'sapari.jitda.run',
  files,
  tutorial = false,
  leftWidth = 460,
  overlay,
}) {
  // ── 입력창 높이 UX: '작은' 높이와 '확대' 높이를 각각 기억(둘 다 기본값으로 시작). ──
  //   '자동 확대' ON + 포커스 → 확대 높이 / blur → 작은 높이. 핸들 드래그는 *현재 모드*의 높이를 갱신.
  const DOC_MIN = 44, DOC_MAX = 460;
  const [smallH, setSmallH] = React.useState(54);   // 작은 상태 기억 높이
  const [bigH, setBigH] = React.useState(300);      // 확대 상태 기억 높이
  const [autoExpand, setAutoExpand] = React.useState(true); // 기본 ON
  const [focused, setFocused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [attachOpen, setAttachOpen] = React.useState(false); // 첨부(+) 메뉴 — 이미지·캡처·파일
  const attachBtnRef = React.useRef(null);
  const [attachPos, setAttachPos] = React.useState(null); // 버튼 화면 좌표(고정 팝오버 — composer overflow 탈출)
  const toggleAttach = () => {
    setAttachOpen((v) => {
      if (!v && attachBtnRef.current) {
        const r = attachBtnRef.current.getBoundingClientRect();
        setAttachPos({ left: r.left, bottom: window.innerHeight - r.top + 8 });
      }
      return !v;
    });
  };

  // ── 좌(대화)/우(미리보기) 분할 — 가운데 세로 핸들 드래그로 좌측 폭 조절. ──
  const COL_MIN = 340, COL_MAX = 760;       // 좌측 컬럼 폭 한계
  const shellRef = React.useRef(null);
  const [colW, setColW] = React.useState(leftWidth);
  const [colDragging, setColDragging] = React.useState(false);
  const onColHandleDown = (e) => {
    e.preventDefault();
    const rect = shellRef.current ? shellRef.current.getBoundingClientRect() : null;
    setColDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev) => {
      // 셸 좌측 기준 마우스 X → 컬럼 폭 (우측 미리보기 최소폭 360 확보).
      const max = rect ? Math.min(COL_MAX, rect.width - 360) : COL_MAX;
      const raw = rect ? ev.clientX - rect.left : colW;
      setColW(Math.min(max, Math.max(COL_MIN, raw)));
    };
    const onUp = () => {
      setColDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // + 버튼은 mousedown preventDefault 로 입력창 포커스를 유지 → 클릭 시점의 포커스 상태가 그대로 보존됨.
  //   (포커스 상태에서 누르면 확대 유지 / 비포커스면 작은 상태 유지)
  const isBig = autoExpand && focused;
  const docHeight = isBig ? bigH : smallH;
  const onDocFocus = () => setFocused(true);
  const onDocBlur = () => setFocused(false);
  const toggleAuto = () => setAutoExpand((v) => !v);
  const onHandleDown = (e) => {
    e.preventDefault();
    const big = isBig;                       // 드래그 시작 시점의 모드 고정
    const startY = e.clientY;
    const startH = big ? bigH : smallH;
    setDragging(true);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev) => {
      const next = Math.min(DOC_MAX, Math.max(DOC_MIN, startH - (ev.clientY - startY)));
      if (big) setBigH(next); else setSmallH(next);   // 현재 모드의 기억 높이만 갱신
    };
    const onUp = () => {
      setDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── 셸 전체 폭 추적 — 자동 확대(isBig) 시 composer 를 미리보기 영역까지 전체 폭으로 확장. ──
  const [shellW, setShellW] = React.useState(0);
  React.useLayoutEffect(() => {
    const measure = () => { if (shellRef.current) setShellW(shellRef.current.getBoundingClientRect().width); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const COMPOSER_GUTTER = 28; // 좌우 margin 14*2
  // 작은 상태: 좌측 컬럼 폭 / 확대 상태: 셸 전체 폭(미리보기 침범).
  const composerWidth = (isBig && shellW ? shellW : colW) - COMPOSER_GUTTER;

  const defaultPromptCard = "코딩 단계마다 어울리는 음료를 추천해주는 한 페이지 앱을 만들어줘. 카드 4개로, 각 카드에 음료 이름과 한 줄 설명.";
  const defaultBody = (
    <>
      <OcToolGroup label="탐색됨" summary="1개 읽음 · 3개 검색" />
      <OcParagraph>
        좋아요. 한 페이지 앱으로 음료 카드 4개를 만들었어요. 살구색 배경에 깔끔한 카드 레이아웃, 각 카드에 음료 이름과 한 줄 설명이 들어가요.
      </OcParagraph>
      <OcDiffDisclosure
        label="수정됨"
        files={[
          { file: 'src/App.tsx', adds: 18, dels: 4 },
          { file: 'src/components/BrewList.tsx', adds: 42, dels: 0 },
          { file: 'src/styles.css', adds: 9, dels: 2 },
        ]}
      />
      <OcParagraph muted>
        오른쪽 미리보기에서 결과를 확인해 주세요. 카드를 누르면 어떤 상황에 어울리는 음료인지 펼쳐서 보여줄까요?
      </OcParagraph>
    </>
  );
  const composerDraft = draft ?? promptInput;
  const previewNode = preview ?? (
    previewState === 'empty' ? <OcPreviewEmpty />
    : previewState === 'spawning' ? <OcPreviewSpawning />
    : previewState === 'generating' ? <OcPreviewGenerating />
    : <OcDefaultPreview />
  );

  return (
    <div ref={shellRef} style={{
      flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'row',
      background: 'var(--c-paper)',
      color: 'var(--c-ink)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── 좌측: 대화 타임라인 + composer ── */}
      <div style={{
        flex: '0 0 ' + colW + 'px',
        minWidth: 0,
        display: 'flex', flexDirection: 'column',
        background: 'var(--c-paper)',
        position: 'relative',
      }}>
        {/* 스레드 스크롤 — 대화 영역 격자 배경 (다른 화면과 동일 24px 그리드) */}
        <div className="oc-canvas-grid" style={{
          flex: 1, minHeight: 0,
          overflowY: 'auto',
          padding: '22px 20px 10px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <OcUserMessage>{promptCard ?? defaultPromptCard}</OcUserMessage>
          {body ?? defaultBody}
        </div>

        {/* composer dock (질문/권한/Todo 등 — AI 상태 시 입력창 위로) */}
        {dock && (
          <div style={{ flex: '0 0 auto', margin: '0 14px 0' }}>{dock}</div>
        )}

        {/* composer — BlockSuite doc 표면 재현. 확대 시 폭이 미리보기 영역까지 확장(전체 폭). */}
        <div className="oc-composer" style={{
          flex: '0 0 auto',
          margin: '10px 14px 14px',
          // 확대 시 컬럼을 벗어나 미리보기 위로 오버레이 → 전체 폭. 작은 상태는 컬럼 폭.
          alignSelf: 'flex-start',
          width: composerWidth,
          position: 'relative',
          zIndex: isBig ? 6 : 1,
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-hairline-strong)',
          borderRadius: 10,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isBig
            ? '0 18px 48px rgba(15,15,20,0.18), 0 4px 12px rgba(15,15,20,0.10)'
            : '0 6px 22px rgba(15,15,20,0.06), 0 1px 2px rgba(15,15,20,0.04)',
          transition: (dragging || colDragging)
            ? 'none'
            : 'width var(--dur-base) var(--ease-decelerate), box-shadow var(--dur-base) var(--ease-standard)',
        }}>
          {/* 상단 리사이즈 핸들 (prompt-doc-resize-handle) — 드래그로 입력창 높이 조절 */}
          <div className={'oc-resize-handle' + (dragging ? ' is-dragging' : '')} title="입력창 높이 조절 (드래그)" aria-label="입력창 높이 조절" onMouseDown={onHandleDown}>
            <span className="oc-resize-bar" />
          </div>
          {/* doc 본문 (참조 블록 + 초안) — 클릭/포커스 시 높이 확장, 드래그/확대 토글 적용 */}
          <div tabIndex={0} onFocus={onDocFocus} onBlur={onDocBlur} style={{
            padding: '2px 14px 12px',
            height: docHeight,
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 9,
            cursor: 'text', outline: 'none',
            // 폭(composer width)과 동일 duration·easing → 코너가 직선 대각선으로 자연스럽게 확대/축소.
            transition: (dragging || colDragging) ? 'none' : 'height var(--dur-base) var(--ease-decelerate)',
          }}>
            {composerRef}
            <div style={{
              fontSize: 13.5, lineHeight: 1.55,
              color: composerDraft ? 'var(--c-ink)' : 'var(--c-muted)',
              fontFamily: 'var(--font-body)',
            }}>
              {composerDraft ?? <span>무엇이든 만들어 달라고 말해보세요… <span style={{ color: 'var(--c-muted)', opacity: 0.7 }}>"이 카드를 두 줄 그리드로 바꿔줘"</span></span>}
            </div>
          </div>

          {/* 액션 바 (prompt-draw-actions) — 좌: 이미지·히스토리 / 우: 전송(공용 단일) */}
          <div style={{
            height: 44, padding: '0 8px',
            borderTop: '1px solid var(--c-hairline)',
            background: 'var(--c-paper)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* 첨부 (+) — 클릭 시 위로 확장되는 이미지·캡처·파일 메뉴 (composer overflow 탈출 위해 fixed) */}
              <div style={{ position: 'relative' }}>
                {attachOpen && attachPos && (
                  <>
                    {/* 바깥 클릭 닫힘 — mousedown preventDefault 로 입력창 포커스 유지(닫아도 자동 확대 안 풀림) */}
                    <div onMouseDown={(e) => e.preventDefault()} onClick={() => setAttachOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
                    <div className="oc-attach-menu" role="menu" style={{ left: attachPos.left, bottom: attachPos.bottom }}>
                      {/* 이미지·파일: 포커스 유지(선택해도 자동 확대 안 풀림) */}
                      <button className="oc-attach-item" role="menuitem" onMouseDown={(e) => e.preventDefault()} onClick={() => setAttachOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4.5" width="14" height="11" rx="2"/><circle cx="7.3" cy="8.6" r="1.3"/><path d="M4.5 14.5 8.5 10.5l2.5 2.5 2-2 2.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        이미지
                      </button>
                      {/* 캡처: 화면 캡처를 위해 입력창 포커스 해제 → 자동 확대 풀림(유일 예외) */}
                      <button className="oc-attach-item" role="menuitem" onClick={() => { setFocused(false); setAttachOpen(false); }}>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6.5 5 7.7 3h4.6L13.5 5H16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 5z" strokeLinejoin="round"/><circle cx="10" cy="10.3" r="2.8"/></svg>
                        캡처
                      </button>
                      <button className="oc-attach-item" role="menuitem" onMouseDown={(e) => e.preventDefault()} onClick={() => setAttachOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 2.5H5.5A1.5 1.5 0 0 0 4 4v12a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 16 16V7.5z" strokeLinejoin="round"/><path d="M11 2.5V7.5H16" strokeLinejoin="round"/></svg>
                        파일
                      </button>
                    </div>
                  </>
                )}
                <button
                  ref={attachBtnRef}
                  className={'oc-attach-btn' + (attachOpen ? ' is-open' : '')}
                  aria-label="첨부 추가" aria-haspopup="menu" aria-expanded={attachOpen}
                  title="이미지·캡처·파일 첨부"
                  onMouseDown={(e) => e.preventDefault()}  /* 입력창 blur 방지 — 포커스 유지(자동 확대 깜빡임 제거) */
                  onClick={toggleAttach}
                >
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 4.5v11M4.5 10h11" strokeLinecap="round"/></svg>
                </button>
              </div>
              <span style={{ width: 1, height: 16, background: 'var(--c-hairline)', margin: '0 4px' }} />
              {/* 실행취소 / 다시실행 (프롬프트 내역) */}
              <button className="oc-icon-btn" aria-label="실행 취소" disabled>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8.33 4.58 2.92 10l5.41 5.42M3.33 10h13.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="oc-icon-btn" aria-label="다시 실행" disabled>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M11.67 4.58 17.08 10l-5.41 5.42M16.67 10H2.92" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span style={{ width: 1, height: 16, background: 'var(--c-hairline)', margin: '0 2px 0 4px' }} />
              {/* 자동 확대 토글 — ON이면 입력창 클릭(포커스) 시 자동으로 커짐. OFF면 핸들 드래그로 수동 */}
              <button className="oc-auto-toggle" role="switch" aria-checked={autoExpand} title="켜면 입력창을 클릭할 때 자동으로 커져요" onClick={toggleAuto}>
                <span className={'oc-auto-track' + (autoExpand ? ' is-on' : '')}><span className="oc-auto-thumb" /></span>
                <span style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', color: autoExpand ? 'var(--c-ink-2)' : 'var(--c-muted)' }}>자동 확대</span>
              </button>
            </div>

            {/* 우측 클러스터 — 손들기(C-2 튜토리얼·C-3·C-4 전부) + 전송(공용 단일).
                2026-06-22 사용자 결정: 튜토리얼도 도움 요청 가능해야 함 → 기획 §5-1 "튜토리얼 제외" 폐기. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HandRaiseButton />
              {/* 전송 — 1인팀 즉시전송·다인팀 합의전송 공용 단일 버튼 (data-action 으로 분기) */}
              <button className="oc-send-btn" aria-label="전송" data-action={sendAction} onClick={onSend}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M10 16V4M10 4l5 5M10 4 5 9" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 좌/우 분할 핸들 (col-resize) — 드래그로 대화/미리보기 폭 조절 ── */}
      <div
        className={'oc-split-handle' + (colDragging ? ' is-dragging' : '')}
        title="대화·미리보기 폭 조절 (드래그)"
        aria-label="대화·미리보기 폭 조절"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={onColHandleDown}
      >
        <span className="oc-split-grip" />
      </div>

      {/* ── 우측: 사파리형 미리보기 브라우저 (탐색기·탭·검색 — files 있을 때만 활성) ── */}
      <OcBrowser
        previewNode={<div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>{previewNode}</div>}
        previewUrl={previewUrl}
        tutorial={tutorial}
        files={files}
        active={previewState}
      />

      {/* 짓다 오버레이 (팀 커서·코치마크·합의 등) */}
      {overlay}
    </div>
  );
}

// ─ OpenCode 내부 primitive ─────────────────────────────────────

// 사용자 발화 — 종이 가장자리 polygon clip-path (BlockSuite user-message paper-edge).
const OC_PAPER_EDGE = 'polygon(1.2% 3.51%, 18.06% 2.84%, 33.6% 3.61%, 49.6% 2.26%, 66.99% 3.48%, 81.87% 3.03%, 99.54% 2.37%, 99.2% 34.59%, 98.4% 65.43%, 99.32% 96.75%, 75.11% 98.01%, 49.32% 97.49%, 25.89% 97%, 1.45% 98.25%, 0.7% 65.72%, 1.6% 35.18%, 0.56% 3.73%)';

function OcUserMessage({ children }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <div style={{
        background: 'var(--c-helmet-wash)',
        padding: '13px 18px',
        fontSize: 13.5, lineHeight: 1.55,
        color: 'var(--c-ink)',
        clipPath: OC_PAPER_EDGE,
        WebkitClipPath: OC_PAPER_EDGE,
        fontFamily: 'var(--font-body)',
      }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 6 }}>
        <button className="oc-mini-btn" aria-label="복사">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="7" width="9" height="9" rx="1.5"/><path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v6.5A1.5 1.5 0 0 0 5 13h2"/></svg>
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)' }}>1분 27초</span>
      </div>
    </div>
  );
}

// 도구호출 그룹 헤더 (collapsible) — "탐색됨 · 1개 읽음 3개 검색"
function OcToolGroup({ label, summary }) {
  return (
    <div className="oc-row-interactive" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      color: 'var(--c-slate)', fontSize: 12,
      padding: '3px 7px', margin: '0 -7px',
      fontFamily: 'var(--font-mono)',
    }}>
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="7 5 12 10 7 15" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span style={{ color: 'var(--c-ink-2)', fontWeight: 600 }}>{label}</span>
      {summary && <span style={{ color: 'var(--c-muted)' }}>· {summary}</span>}
    </div>
  );
}

// "Show steps" 행 (C-2/C-4 body 에서 사용) — 하위호환 유지.
function OcStepsRow({ text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      color: 'var(--c-slate)', fontSize: 12,
      cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '2px 0',
    }}>
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="7 5 12 10 7 15"/></svg>
      <span>{text}</span>
    </div>
  );
}

function OcResponseLabel() { return null; }

function OcParagraph({ children, muted }) {
  return (
    <p style={{
      fontSize: 13.5, lineHeight: 1.65,
      color: muted ? 'var(--c-slate)' : 'var(--c-ink-2)',
      margin: 0, fontFamily: 'var(--font-body)',
    }}>{children}</p>
  );
}

// 변경 파일 disclosure — "수정됨 · 3 파일" + 파일별 diff 바(add mint / del safety).
function OcDiffDisclosure({ label, files }) {
  const totalAdds = files.reduce((s, f) => s + (f.adds || 0), 0);
  const totalDels = files.reduce((s, f) => s + (f.dels || 0), 0);
  return (
    <div style={{
      border: '1px solid var(--c-hairline)',
      borderRadius: 8, overflow: 'hidden',
      background: 'var(--c-canvas)',
    }}>
      <div className="oc-row-interactive" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        borderRadius: 0,
        borderBottom: '1px solid var(--c-hairline)',
        fontFamily: 'var(--font-mono)', fontSize: 12,
      }}>
        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="var(--c-slate)" strokeWidth="1.7"><polyline points="5 8 10 13 15 8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ color: 'var(--c-ink-2)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: 'var(--c-muted)' }}>· {files.length} 파일</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: 'var(--c-mint)', fontWeight: 700 }}>+{totalAdds}</span>
        <span style={{ color: 'var(--c-safety)', fontWeight: 700 }}>−{totalDels}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {files.map((f, i) => (
          <div key={i} className="oc-row-interactive" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 12px',
            borderRadius: 0,
            borderTop: i ? '1px solid var(--c-hairline)' : 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink-2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.file}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-mint)', fontWeight: 700 }}>+{f.adds}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: f.dels ? 'var(--c-safety)' : 'var(--c-muted)', fontWeight: 700 }}>−{f.dels}</span>
            <OcDiffBar adds={f.adds} dels={f.dels} />
          </div>
        ))}
      </div>
    </div>
  );
}

// 미니 diff 바 — 5칸, add(mint)·del(safety)·미변경(stone) 비율 표시.
function OcDiffBar({ adds, dels }) {
  const total = (adds || 0) + (dels || 0);
  const cells = 5;
  const addN = total === 0 ? 0 : Math.max(adds > 0 ? 1 : 0, Math.round((adds / total) * cells));
  const delN = total === 0 ? 0 : Math.min(cells - addN, Math.max(dels > 0 ? 1 : 0, Math.round((dels / total) * cells)));
  const restN = cells - addN - delN;
  const seg = (n, color, key) => Array.from({ length: n }).map((_, j) => (
    <span key={key + j} style={{ width: 5, height: 9, borderRadius: 1.5, background: color }} />
  ));
  return (
    <div style={{ display: 'flex', gap: 2, marginLeft: 2 }}>
      {seg(addN, 'var(--c-mint)', 'a')}
      {seg(delN, 'var(--c-safety)', 'd')}
      {seg(restN, 'var(--c-stone-2)', 'r')}
    </div>
  );
}

// 파일 행 (C-2/C-4 body 에서 사용) — 하위호환 유지.
function OcFileRow({ file, status }) {
  const ext = file.split('.').pop();
  const base = file.replace(/\.[^.]+$/, '');
  const statusColor = status === 'added' ? 'var(--c-mint)' : status === 'deleted' ? 'var(--c-safety)' : 'var(--c-helmet-deep)';
  const statusLabel = status === 'added' ? 'A' : status === 'deleted' ? 'D' : 'M';
  return (
    <div style={{
      background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
      borderRadius: 6, padding: '8px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 18, height: 18, background: 'var(--c-paper)',
        border: '1px solid var(--c-hairline-strong)', borderRadius: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--c-ink-3)', fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
      }}>{ext.toUpperCase().slice(0, 3)}</div>
      <span style={{ fontSize: 12.5, color: 'var(--c-ink-2)', fontFamily: 'var(--font-mono)' }}>
        {base}<span style={{ color: 'var(--c-ink)', fontWeight: 600 }}>.{ext}</span>
      </span>
      <div style={{ flex: 1 }} />
      {status && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: statusColor, fontWeight: 700,
          padding: '2px 6px', borderRadius: 3, background: 'var(--c-paper)', border: '1px solid ' + statusColor,
        }}>{statusLabel}</span>
      )}
    </div>
  );
}

// composer 안 참조 블록 — 파일/라인 컨텍스트 카드 (context-add).
function OcReferenceBlock({ name = 'App.tsx', path = 'src/App.tsx', lines, adds, dels }) {
  return (
    <div className="oc-ref-block" style={{
      display: 'flex', alignItems: 'center', gap: 9,
      background: 'var(--c-paper)',
      border: '1px solid var(--c-hairline)',
      borderRadius: 7, padding: '7px 9px',
      alignSelf: 'flex-start', maxWidth: '100%',
    }}>
      <div style={{
        width: 26, height: 26, flexShrink: 0,
        background: 'var(--c-canvas)', border: '1px solid var(--c-hairline-strong)',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--c-slate)',
      }}>
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="7 6 3 10 7 14"/><polyline points="13 6 17 10 13 14"/></svg>
      </div>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c-ink)', fontFamily: 'var(--font-mono)' }}>{name}</span>
        <span style={{ fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {lines ? lines + ' · ' : ''}{path}
        </span>
      </div>
      {(adds != null || dels != null) && (
        <div style={{ display: 'flex', gap: 6, marginLeft: 4, flexShrink: 0 }}>
          {adds != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-mint)', fontWeight: 700 }}>+{adds}</span>}
          {dels != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-safety)', fontWeight: 700 }}>−{dels}</span>}
        </div>
      )}
      <div style={{ flex: 1 }} />
      <button className="oc-mini-btn" aria-label="참조 제거" style={{ flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// 아이콘 버튼 공용 스타일 (26×26 ghost).
function ocIconBtnStyle({ active = false } = {}) {
  return {
    background: active ? 'var(--c-stone)' : 'transparent',
    border: 'none',
    color: active ? 'var(--c-ink)' : 'var(--c-ink-3)',
    cursor: 'pointer',
    width: 26, height: 26, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

// composer 액션 바 아이콘 버튼 (prompt-draw-actions, ~30×30 ghost).
function ocPromptIconBtn({ disabled = false } = {}) {
  return {
    background: 'transparent', border: 'none',
    color: 'var(--c-ink-3)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    width: 30, height: 30, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

// 우측 미리보기 슬림 헤더 — ●live · 주소 pill · 새로고침.
function OcPreviewHeader({ url = 'sapari.jitda.run', live = true }) {
  return (
    <div style={{
      flex: '0 0 auto', height: 38,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 12px',
      borderBottom: '1px solid var(--c-hairline)',
      background: 'var(--c-paper)',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: live ? 'var(--c-mint)' : 'var(--c-muted)',
        boxShadow: live ? '0 0 0 3px rgba(9,108,77,0.14)' : 'none',
        flexShrink: 0,
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 999, padding: '3px 12px',
        minWidth: 0, maxWidth: 340,
      }}>
        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="var(--c-muted)" strokeWidth="1.5"><rect x="4" y="8.5" width="12" height="8" rx="1.5"/><path d="M6.5 8.5V6.5a3.5 3.5 0 0 1 7 0v2"/></svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
      </div>
      <div style={{ flex: 1 }} />
      <button className="oc-icon-btn" aria-label="미리보기 새로고침">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.5 6.5A6 6 0 1 0 16.5 11" strokeLinecap="round"/><path d="M15.8 3.5v3.2h-3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

// 미리보기 미준비 — codle-preview-loader (86×70, 5블록 staggered) + 안내.
function OcPreviewEmpty() {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--c-canvas)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 18,
    }}>
      <JitdaMascot size={72} />
      <span style={{ fontSize: 12.5, color: 'var(--c-muted)', fontFamily: 'var(--font-body)' }}>아직 미리보기가 준비되지 않았습니다</span>
    </div>
  );
}

// 미리보기 서버 기동 중 — BLUEPRINT 마스코트(준비·검토 중) + 안내.
function OcPreviewSpawning() {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--c-canvas)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <JitdaMascotBlueprint size={100} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--c-ink-2)' }}>작업 환경을 준비하고 있어요</span>
        <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>잠시만 기다려 주세요 · 보통 10초 이내</span>
      </div>
    </div>
  );
}

// 미리보기 생성 중 — AI가 사용자 프롬프트로 결과물을 능동 생성하는 순간(sending).
// 짓다 브랜드 동사("짓다=생성")와 곡괭이질(DIG) 은유 일치 — 마스코트-애니메이션-가이드 §4 1순위.
function OcPreviewGenerating() {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--c-canvas)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
      overflow: 'visible',
    }}>
      <JitdaMascotDig size={84} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--c-ink-2)' }}>AI가 화면을 만들고 있어요</span>
        <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>곡괭이질하듯 짓는 중이에요 · 잠시만 기다려 주세요</span>
      </div>
    </div>
  );
}

// OpenCode 셸 자체를 못 띄움 — 작업 환경(서버) 연결 실패. 미리보기 한 칸이 아니라
// 본문 전체(대화+미리보기)를 덮는 에러. C-2 튜토리얼·C-3 1인팀·C-4 다인팀 공용.
// 툴바는 화면 래퍼가 유지, 이 컴포넌트는 그 아래 본문 영역만 채운다.
// 디자인: 운영자 B1Empty 어휘 재사용 — 격자 배경 + 중앙 단일 포스트잇 카드(tape·정적 -0.6° 회전).
//   배지만 안내(stone) 대신 경고(safety) 톤으로 에러 신호, 카드 안에 [다시 시도] CTA.
function OcServerError() {
  return (
    <div style={{
      flex: 1, minHeight: 0,
      background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
    }}>
      <div
        className="jt-postit-card jt-postit-card-static jt-postit-tape-lg"
        tabIndex={0}
        style={{
          width: 'min(460px, 88vw)',
          padding: '44px 40px 40px',
          borderRadius: 'var(--r-xs)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          '--postit-rot': 'var(--postit-rot-b)',
          '--postit-tint': 'var(--c-canvas)',
        }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: 'var(--c-safety-soft)', color: 'var(--c-safety-deep)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>{Icon.warn(24)}</div>
        <h2 style={{ fontSize: 22, marginBottom: 8, color: 'var(--c-ink)' }}>서버를 불러오지 못했어요</h2>
        <p style={{ fontSize: 13.5, color: 'var(--c-slate)', lineHeight: 1.6, margin: 0 }}>
          작업 환경에 연결하지 못했어요. 네트워크 상태를 확인하고<br />다시 시도해 주세요. 몇 번 해도 안 되면 운영자에게 알려 주세요.
        </p>
        <button data-action="retry" className="jt-btn jt-btn-primary" style={{ marginTop: 24, padding: '11px 22px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {Icon.refresh(15)}
          다시 시도
        </button>
      </div>
    </div>
  );
}

// 우측 미리보기 기본 — 음료 추천 앱의 가짜 렌더 (살구색 배경 + 4 카드).
function OcDefaultPreview() {
  const cards = [
    { name: '에스프레소', desc: '집중력이 필요한 디버깅 시간에' },
    { name: '카페라떼', desc: '느긋한 페어 프로그래밍에' },
    { name: '아메리카노', desc: '긴 코드 리뷰 마라톤에' },
    { name: '콜드브루', desc: '여름 오후의 산뜻한 리팩터' },
  ];
  return (
    <div style={{ flex: 1, minWidth: 0, background: '#fdeed7', padding: '32px 40px', overflow: 'auto' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <header style={{ textAlign: 'center', marginBottom: 6 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#3b2a14', letterSpacing: '-0.01em' }}>오늘의 음료</h3>
          <p style={{ fontSize: 12.5, color: '#7a5d35', margin: '6px 0 0' }}>지금 작업에 어울리는 한 잔을 골라보세요</p>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {cards.map((c, i) => (
            <div key={i} className="oc-preview-card" style={{ background: '#fff7e8', border: '1px solid #e8c98b', borderRadius: 10, padding: '14px 14px 12px', boxShadow: '0 1px 2px rgba(110,72,20,0.08)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#3b2a14' }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: '#7a5d35', marginTop: 4, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





// ── 사파리형 미리보기 브라우저 (탐색기 사이드바 + 파일 탭 + 파일 검색) ───────────────
//
//  설계 의도: 참가자가 AI가 만든 컨테이너의 코드 베이스를 실제 사파리 창처럼 탐색.
//   · 사이드바(좌측, 토글 개폐) = 파일 탐색기 (상단에 파일명 검색창)
//   · 상단 탭 스트립(사파리형 둥근 탭) = 0번 미리보기(라이브 앱) 고정 + 파일은 새 탭으로
//   · 기존 미리보기 기능 전부 유지 (주소창·새로고침·새 탭 열기·복사)
//
//  하위호환: files 없음 | tutorial | active!=='ready' → 기존 SafariChrome+미리보기와 동일하게 렌더.
//   기본 상태(사이드바 닫힘·탭 1개)에선 탭 스트립을 숨겨 현재 화면과 픽셀 동일.

// 트리를 평면 파일 목록으로 (검색 필터용)
function ocFlattenFiles(nodes, out) {
  out = out || [];
  (nodes || []).forEach((n) => {
    if (n.type === 'dir') ocFlattenFiles(n.children, out);
    else out.push(n);
  });
  return out;
}

// 파일 확장자 → 배지 텍스트 (OcFileRow 어휘 재사용)
function ocExtBadge(name) {
  const ext = name.split('.').pop();
  return ext.toUpperCase().slice(0, 3);
}

// 코드 뷰 — 줄번호 거터 + monospace, 주석 라인 muted 틴팅 (읽기 전용 미리보기).
function OcCodeView({ path, content }) {
  const lines = (content || '').replace(/\n$/, '').split('\n');
  const isComment = (s) => {
    const t = s.trim();
    return t.startsWith('//') || t.startsWith('/*') || t.startsWith('*');
  };
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', background: 'var(--c-canvas)', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7 }}>
      <div style={{ display: 'flex', minHeight: '100%' }}>
        {/* 줄번호 거터 */}
        <div style={{ flexShrink: 0, padding: '14px 0', textAlign: 'right', color: 'var(--c-ink-3)', opacity: 0.5, userSelect: 'none', background: 'var(--c-paper)', borderRight: '1px solid var(--c-hairline)' }}>
          {lines.map((_, i) => (
            <div key={i} style={{ padding: '0 12px' }}>{i + 1}</div>
          ))}
        </div>
        {/* 코드 본문 */}
        <pre style={{ flex: 1, margin: 0, padding: '14px 16px', whiteSpace: 'pre', color: 'var(--c-ink-2)', fontFamily: 'var(--font-mono)' }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ color: isComment(ln) ? 'var(--c-slate)' : 'var(--c-ink-2)', minHeight: '1.7em' }}>{ln || ' '}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// 파일 탐색기 트리 (재귀) — 디렉터리 펼침/접힘, 파일 클릭→탭 오픈. 검색 시 평면 결과.
function OcFileTree({ nodes, depth = 0, expanded, onToggleDir, onOpen, activePath }) {
  return (
    <>
      {(nodes || []).map((n, i) => {
        const key = (n.path || n.name) + i;
        if (n.type === 'dir') {
          const dirKey = n.name + '/' + depth + '/' + i;
          const open = expanded[dirKey] !== false; // 기본 펼침
          return (
            <React.Fragment key={key}>
              <button
                className="oc-tree-row"
                onClick={() => onToggleDir(dirKey)}
                style={{ paddingLeft: 10 + depth * 14 }}
              >
                <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0, color: '#9b9ba3', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.12s ease' }}><polyline points="7 5 12 10 7 15" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="#4aa3ff" stroke="#1a8cff" strokeWidth="0.8" style={{ flexShrink: 0 }}><path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h3.2l1.4 1.6H16a1.5 1.5 0 0 1 1.5 1.5v7.4A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5z" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink-2)' }}>{n.name}</span>
              </button>
              {open && (
                <OcFileTree nodes={n.children} depth={depth + 1} expanded={expanded} onToggleDir={onToggleDir} onOpen={onOpen} activePath={activePath} />
              )}
            </React.Fragment>
          );
        }
        const active = n.path === activePath;
        return (
          <button
            key={key}
            className={'oc-tree-row' + (active ? ' is-active' : '')}
            onClick={() => onOpen(n)}
            style={{ paddingLeft: 10 + (depth + 1) * 14 }}
            title={n.path}
          >
            <span style={{
              width: 16, height: 16, flexShrink: 0,
              background: active ? '#eaf2fe' : '#eef0f4',
              border: '1px solid ' + (active ? '#9cc6fb' : '#d6d8dd'), borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: active ? '#006ef5' : '#5b6270', fontFamily: 'var(--font-mono)', fontSize: 7, fontWeight: 700,
            }}>{ocExtBadge(n.name)}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? '#006ef5' : 'var(--c-ink-2)', fontWeight: active ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
          </button>
        );
      })}
    </>
  );
}

// 사파리형 탭 — 미리보기 탭은 닫기(×) 없음.
function OcFileTab({ label, icon, active, onClick, onClose }) {
  return (
    <div
      className={'oc-browser-tab' + (active ? ' is-active' : '')}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {icon}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>{label}</span>
      {onClose && (
        <button
          className="oc-browser-tab-close"
          aria-label="탭 닫기"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}

function OcBrowser({ previewNode, previewUrl = 'sapari.jitda.run', tutorial = false, files, active = 'ready' }) {
  // 파일 탐색기 토글·홈 버튼은 OpenCode 전 화면에서 항상 노출(파일 없음·튜토리얼·미준비 포함). 갤러리는 OcBrowser 미사용.
  // hasFiles = 트리 데이터 유무 — 탐색기 콘텐츠·검색·파일 탭 활성 여부만 결정(토글 노출과 무관). 없으면 빈 상태 표시.
  const hasFiles = !!(files && files.tree && files.tree.length);

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState({});
  // 탭: 0번 = 미리보기(고정). 파일 탭은 path 로 식별.
  const [tabs, setTabs] = React.useState([{ kind: 'preview' }]);
  const [activeId, setActiveId] = React.useState('preview');

  const activeTab = tabs.find((t) => (t.kind === 'preview' ? 'preview' : t.path) === activeId) || tabs[0];
  const onFileTab = activeTab && activeTab.kind === 'file';
  const address = onFileTab ? activeTab.path : previewUrl;

  const openFile = (node) => {
    setTabs((prev) => (prev.some((t) => t.path === node.path) ? prev : [...prev, { kind: 'file', path: node.path, name: node.name }]));
    setActiveId(node.path);
  };
  const closeTab = (path) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.path === path);
      const next = prev.filter((t) => t.path !== path);
      if (activeId === path) {
        const fallback = next[Math.max(0, idx - 1)] || next[0];
        setActiveId(fallback.kind === 'preview' ? 'preview' : fallback.path);
      }
      return next;
    });
  };
  const toggleDir = (dirKey) => setExpanded((e) => ({ ...e, [dirKey]: e[dirKey] === false ? true : false }));

  const flat = hasFiles ? ocFlattenFiles(files.tree) : [];
  const matches = query ? flat.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())) : null;
  // 탭 스트립은 파일이 여러 개 열렸을 때(미리보기 + 파일 1개 이상)만 노출 — 사이드바 개폐와 무관.
  const showStrip = hasFiles && tabs.length > 1;

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--c-canvas)' }}>
      {/* ── 상단 chrome — 공용 SafariChrome(디자인시스템). OpenCode는 파일 탐색기 토글 항상 노출. ── */}
      <SafariChrome
        address={address}
        openUrl={previewUrl}
        tutorial={tutorial}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        onHome={() => setActiveId('preview')}
      />

      {/* ── 본문: [사이드바 탐색기 (전체 높이)] + [탭 스트립 + 활성 탭 콘텐츠] ──
           사파리 레퍼런스처럼 사이드바는 chrome 바로 아래부터 전체 높이를 차지하고,
           탭 스트립은 우측 콘텐츠 컬럼 상단에만 위치 (사이드바와 겹치지 않음). */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {sidebarOpen && (
          <div className="oc-file-sidebar" style={{ width: 196, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f9f9f9', borderRight: '1px solid #e7e7e9' }}>
            {hasFiles ? (
              <>
                {/* 검색창 */}
                <div style={{ padding: '8px 8px 6px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 26, padding: '0 8px', background: '#ffffff', border: '1px solid #d8d8dc', borderRadius: 7 }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#86868b" strokeWidth="1.4" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="4.2" /><path d="M10.2 10.2 13.5 13.5" strokeLinecap="round" /></svg>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="파일 검색"
                      style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-ink)' }}
                    />
                    {query && (
                      <button className="oc-browser-tab-close" aria-label="검색 지우기" onClick={() => setQuery('')}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* 트리 / 검색결과 */}
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '2px 6px 10px' }}>
                  {matches
                    ? (matches.length
                        ? matches.map((f, i) => {
                            const fa = f.path === activeId;
                            return (
                            <button key={f.path + i} className={'oc-tree-row' + (fa ? ' is-active' : '')} onClick={() => openFile(f)} style={{ paddingLeft: 10 }} title={f.path}>
                              <span style={{ width: 16, height: 16, flexShrink: 0, background: fa ? '#eaf2fe' : '#eef0f4', border: '1px solid ' + (fa ? '#9cc6fb' : '#d6d8dd'), borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fa ? '#006ef5' : '#5b6270', fontFamily: 'var(--font-mono)', fontSize: 7, fontWeight: 700 }}>{ocExtBadge(f.name)}</span>
                              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, alignItems: 'flex-start' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: fa ? '#006ef5' : 'var(--c-ink-2)', fontWeight: fa ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{f.name}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--c-ink-3)', opacity: 0.7 }}>{f.path}</span>
                              </span>
                            </button>
                            );
                          })
                        : <div style={{ padding: '14px 10px', fontSize: 11.5, color: 'var(--c-muted)', fontFamily: 'var(--font-body)' }}>일치하는 파일이 없어요</div>)
                    : <OcFileTree nodes={files.tree} expanded={expanded} onToggleDir={toggleDir} onOpen={openFile} activePath={onFileTab ? activeTab.path : null} />}
                </div>
              </>
            ) : (
              /* 파일 없음(아직 코드 생성 전·튜토리얼 초기 등) — 빈 상태 */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '20px 16px', textAlign: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--c-ink-3)" strokeWidth="1.4" style={{ opacity: 0.5 }}><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l1.6 1.8H19.5A1.5 1.5 0 0 1 21 9.3v8.2A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 11.5, color: 'var(--c-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>아직 생성된 파일이 없어요<br />코드를 만들면 여기에 표시돼요</span>
              </div>
            )}
          </div>
        )}
        {/* 우측 컬럼: 탭 스트립(콘텐츠 영역 상단만) + 활성 탭 콘텐츠 */}
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {showStrip && (
            <div className="oc-browser-tabstrip" role="tablist">
              {tabs.map((t) => (
                t.kind === 'preview'
                  ? <OcFileTab key="preview" label="미리보기" active={activeId === 'preview'} onClick={() => setActiveId('preview')}
                      icon={<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ flexShrink: 0, color: 'var(--c-slate)' }}><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c1.8 1.6 1.8 10.4 0 12M8 2c-1.8 1.6-1.8 10.4 0 12" /></svg>} />
                  : <OcFileTab key={t.path} label={t.name} active={activeId === t.path} onClick={() => setActiveId(t.path)} onClose={() => closeTab(t.path)}
                      icon={<span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 7, fontWeight: 700, color: '#5b6270', background: '#eef0f4', border: '1px solid #d6d8dd', borderRadius: 2, padding: '1px 3px' }}>{ocExtBadge(t.name)}</span>} />
              ))}
            </div>
          )}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
            {onFileTab
              ? <OcCodeView path={activeTab.path} content={(files.contents || {})[activeTab.path] || ''} />
              : previewNode}
          </div>
        </div>
      </div>
    </div>
  );
}

// 튜토리얼 진행 스텝퍼 — 노드는 전부, 라벨은 현재 단계만(4단계 폭 대응). tutorial 현재·mint 완료.
function C2Stepper({ steps, step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const isDone = idx < step;
        const isCurr = idx === step;
        return (
          <React.Fragment key={idx}>
            <button className="oc-step-btn" title={(s.name || '') + ' — ' + s.title}>
              <span className="oc-step-node" style={{
                width: 21, height: 21, borderRadius: '50%',
                background: isDone ? 'var(--c-mint)' : isCurr ? 'var(--c-tutorial)' : 'var(--c-canvas)',
                color: isDone || isCurr ? '#fff' : 'var(--c-muted)',
                border: isDone || isCurr ? 'none' : '1.5px solid var(--c-hairline-strong)',
                boxShadow: isCurr ? '0 0 0 3px var(--c-tutorial-soft)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700,
              }}>{isDone ? '✓' : idx}</span>
              {isCurr && (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-ink)', whiteSpace: 'nowrap' }}>{s.name}</span>
              )}
            </button>
            {idx < steps.length && (
              <span style={{ width: 14, height: 2, borderRadius: 2, background: isDone ? 'var(--c-mint)' : 'var(--c-hairline-strong)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 복사 버튼 — 클릭 시 "복사 완료"(체크) 로 전환 후 1.6초 뒤 복귀.
function OcCopyButton({ label = '복사', style }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  const onClick = () => {
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button className={'oc-paste-copy' + (copied ? ' is-copied' : '')} onClick={onClick} style={style} aria-live="polite">
      {copied
        ? <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="4 10 8.5 14.5 16 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : Icon.copy(11)}
      <span className="oc-copy-label">{copied ? <>복사<br />완료</> : label}</span>
    </button>
  );
}

// 튜토리얼 가이드 포스트잇 — 우측 상단 열기/접기 (controlled). 상단 배너 대신(2026-06-10).
// 짓다 postit 어휘(jt-postit-card·tape·rotation, C-1 팀 포스트잇과 연결) + 튜토리얼 보라 틴트.
// 단계 이동: 이전=항상 / 다음=현재 단계 완료 시 활성+glow(앞 단계 미리보기 차단). 접힘 시 완료 이벤트로 자동 열림.
// 예시 한 줄 — 클릭 시 복사(체크 플래시). compose '예시 보기'·plan '계획 다듬기' 폴백.
function OcExampleRow({ text }) {
  const [c, setC] = React.useState(false);
  const t = React.useRef(null);
  const click = () => { setC(true); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setC(false), 1300); };
  return (
    <button className="oc-example-row" onClick={click} title="복사">
      <span style={{ color: 'var(--c-slate)', flexShrink: 0 }}>›</span>
      <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>{text}</span>
      {c
        ? <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="var(--c-mint)" strokeWidth="2.2" style={{ flexShrink: 0 }}><polyline points="4 10 8.5 14.5 16 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <span style={{ flexShrink: 0, color: 'var(--c-muted)', display: 'inline-flex' }}>{Icon.copy(11)}</span>}
    </button>
  );
}

// 단계별 동작 블록 — action(plan/paste/edit/compose)에 따라 다르게.
function PostitActionBlock({ step }) {
  const [showEx, setShowEx] = React.useState(false);

  // 직접 작성 — 예시는 '보기' 토글 뒤로(복붙 유도 아님), 첨부·구체적으로 다시 지시 팁.
  if (step.action === 'compose') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--c-ink-2)', lineHeight: 1.5 }}>{step.hint}</span>
        <button className="oc-examples-toggle" onClick={() => setShowEx((v) => !v)} aria-expanded={showEx}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>💡 막막하면 예시 보기</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showEx ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-standard)' }}><polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {showEx && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {step.examples.map((ex, i) => <OcExampleRow key={i} text={ex} />)}
          </div>
        )}
        <span style={{ fontSize: 10.5, color: 'var(--c-muted)', lineHeight: 1.45 }}>{step.post}</span>
      </div>
    );
  }

  // 기획/만들기/바꾸기 — 제시 프롬프트 + 복사
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 기획 노하우 칩 */}
      {step.action === 'plan' && step.know && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {step.know.map((k, i) => (
            <span key={i} className="oc-knowhow-chip">💡 {k}</span>
          ))}
        </div>
      )}

      <span style={{ fontSize: 12, color: 'var(--c-ink-2)', lineHeight: 1.5 }}>{step.hint}</span>

      <div style={{ display: 'flex', alignItems: 'stretch', background: 'var(--c-canvas)', border: '1px solid var(--c-hairline-strong)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.45, color: 'var(--c-ink)', minWidth: 0 }}>
          <span style={{ color: 'var(--c-tutorial)', fontWeight: 700, marginRight: 4 }}>&rsaquo;</span>{step.prompt}
        </div>
        <OcCopyButton style={{ fontSize: 11.5 }} />
      </div>

      {/* 바꾸기 — 선택지 칩 */}
      {step.options && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10.5, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)' }}>밑줄(___) 자리에 넣어볼 것:</span>
          {step.options.map((o, i) => <span key={i} className="oc-option-chip">{o}</span>)}
        </div>
      )}

      {/* 기획 — AI 계획 검토·다듬기 예시 */}
      {step.action === 'plan' && step.refine && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
          <span style={{ fontSize: 10.5, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)' }}>AI가 계획을 보여주면, 이렇게 답해 다듬어요:</span>
          {step.refine.map((r, i) => <OcExampleRow key={i} text={r} />)}
        </div>
      )}

      <span style={{ fontSize: 10.5, color: 'var(--c-muted)', lineHeight: 1.45 }}>{step.post}</span>
    </div>
  );
}

// 튜토리얼 가이드 포스트잇 — 우측 상단 열기/접기 (controlled). v8: 4단계·action별 렌더.
// 짓다 postit 어휘(jt-postit-card·tape·rotation, C-1 팀 포스트잇과 연결) + 튜토리얼 보라 틴트.
// 단계 이동: 이전=항상 / 다음=현재 단계 완료 시 활성+glow. 접힘 시 완료 이벤트로 자동 열림.
function TutorialPostit({ steps, step, done, sending, open, onToggle, onNext, onPrev, canNext }) {
  const curr = steps[step - 1];
  const isLast = step >= steps.length;
  const rightDisabled = isLast ? !done : !canNext;
  const rightGlow = isLast ? done : canNext;

  // 접힘 — 소형 포스트잇 칩 (한 줄, 클릭 시 펼침). 작게 두어 미리보기를 거의 안 가림
  if (!open) {
    return (
      <div className="oc-postit-wrap" style={{ position: 'absolute', top: 16, right: 18, zIndex: 'var(--z-overlay)' }}>
        <button onClick={onToggle} className="jt-postit-card" title="튜토리얼 가이드 펼치기" aria-label="튜토리얼 가이드 펼치기"
          style={{
            padding: '7px 11px 8px', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--r-xs)', display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
            '--postit-rot': 'var(--postit-rot-b)', '--postit-tint': 'var(--c-tutorial-soft)',
          }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: done ? 'var(--c-mint)' : 'var(--c-tutorial)' }} />
          {sending && <BouncingDots size={4} color="var(--c-tutorial)" />}
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-ink)' }}>튜토리얼 <span style={{ color: 'var(--c-tutorial)', fontFamily: 'var(--font-mono)' }}>{step}/{steps.length}</span></span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c-slate)" strokeWidth="2"><polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    );
  }

  // 펼침 — 가이드 포스트잇 (플로팅). 미리보기를 일부 가리지만, 보려면 접으면 됨
  const statusNode = sending
    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-tutorial)' }}><BouncingDots size={4} color="var(--c-tutorial)" /> AI가 작업하는 중이에요…</span>
    : isLast && done ? <span style={{ color: 'var(--c-mint)', fontWeight: 700 }}>🎉 모든 단계 완료! 이제 무엇이든 만들 수 있어요</span>
    : done ? <span style={{ color: 'var(--c-tutorial)', fontWeight: 700 }}>잘했어요! 다음 단계로 가볼까요?</span>
    : <span style={{ color: 'var(--c-slate)' }}>입력창에 보내면 다음 단계가 열려요</span>;

  return (
    <div className="oc-postit-wrap" style={{ position: 'absolute', top: 16, right: 18, zIndex: 'var(--z-overlay)' }}>
      <div className="jt-postit-card jt-postit-card-static jt-postit-tape-lg"
        style={{
          width: 336, maxHeight: 'calc(100% - 32px)', overflowY: 'auto',
          padding: '15px 18px 16px', borderRadius: 'var(--r-xs)',
          display: 'flex', flexDirection: 'column', gap: 11,
          '--postit-rot': 'var(--postit-rot-b)', '--postit-tint': 'var(--c-tutorial-soft)',
        }}>
        {/* 헤더 — 라벨 + 접기 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="jt-eyebrow" style={{ color: 'var(--c-tutorial)', fontSize: 10 }}>튜토리얼 가이드</span>
          <div style={{ flex: 1 }} />
          <button className="oc-mini-btn" onClick={onToggle} title="가이드 접기" aria-label="가이드 접기">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <C2Stepper steps={steps} step={step} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 style={{ fontSize: 17, lineHeight: 1.25, margin: 0 }}>{curr.title}</h2>
          <p style={{ fontSize: 12.5, color: 'var(--c-ink-2)', lineHeight: 1.5, margin: 0 }}>{curr.concept}</p>
        </div>

        <PostitActionBlock step={curr} />

        <div style={{ display: 'flex', gap: 7 }}>
          <button className="jt-btn jt-btn-secondary jt-btn-sm" onClick={onPrev} disabled={step <= 1} title="이전 단계" style={{ flex: '0 0 auto', justifyContent: 'center' }}>{Icon.arrowLeft(12)}</button>
          <button
            className={'jt-btn jt-btn-primary jt-btn-sm' + (rightGlow ? ' oc-next-ready' : '')}
            onClick={isLast ? onToggle : onNext}
            disabled={rightDisabled}
            style={{ flex: 1, justifyContent: 'center' }}>
            {isLast ? '자유롭게 연습하기' : '다음 단계'} {!isLast && Icon.arrowRight(12)}
          </button>
        </div>

        <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textAlign: 'center', lineHeight: 1.4 }}>{statusNode}</span>
      </div>
    </div>
  );
}

// ─── C-2. 셀프 튜토리얼 ─────────────────────────────────────────
// 페이지 정의서 v23848e86 컴포넌트 (8):
// 1. 가이드 패널 — **캔버스 상단 접이식 카드** (1인팀·다인팀 공통 위치)
// 2. 단계 프로그레스 (Step n/3)  3. 현재 단계 제목
// 4. 프롬프트 예시 + [복사]      5. IDE (OpenCode 임베드)
// 6. [다음 단계] 버튼           7. 건너뛰기 / 이전 단계
// 8. 다인팀 동시편집 (가이드 위치는 1인팀과 동일)
function C2Tutorial({ step: initialStep = 2 }) {
  // v8 커리큘럼 — 4단계 스캐폴딩(기획→만들기→바꾸기→내 손으로). 기획은 단순 복붙이 아니라
  // 전문 바이브코더의 노하우(계획부터·AI 계획 검토·다듬기)를 체험. 템플릿: 자기소개 페이지.
  const steps = [
    {
      n: 1, name: '기획', action: 'plan',
      title: '바로 만들지 말고, 계획부터',
      concept: '바이브코딩은 코드를 몰라도 돼요. AI에게 말로 부탁하면 AI가 만들어 줍니다. 잘하는 사람들의 비결은, 바로 "만들어줘"가 아니라 "어떻게 만들지 계획부터 세워줘"라고 하는 거예요. 계획은 글이라 고치기 쉽거든요.',
      know: ['바로 "만들어줘" 하지 말고, "먼저 계획을 세워줘"라고 부탁하기', 'AI가 짠 계획을 그대로 받지 말고, 빼거나 더해 내 것으로 다듬기'],
      hint: '아래 [복사]를 누른 뒤, 화면 왼쪽 아래 입력창에 붙여넣고 전송(↑) 버튼을 누르세요. AI가 "이렇게 만들면 어때요?" 하고 만들 계획을 글로 보여줘요.',
      prompt: '내 자기소개 웹페이지를 만들고 싶어. 어떤 내용(섹션)과 디자인이 좋을지, 바로 만들지 말고 먼저 계획을 세워줘. 정해야 할 게 있으면 나한테 물어봐줘.',
      refine: ['취미 소개는 빼고 시작하자', '연락처에 이메일 주소도 넣어줘', '화려하지 않게, 전체적으로 단순하고 깔끔하게'],
      post: 'AI가 보여준 계획을 읽어 보고, 빼거나 더하고 싶은 게 있으면 위 예시처럼 말해서 다듬어 보세요. (코드보다 계획을 고치는 게 훨씬 쉬워요.)',
    },
    {
      n: 2, name: '만들기', action: 'paste',
      title: '계획대로 진짜 만들기',
      concept: '계획이 마음에 들면, 이제 "그 계획대로 만들어줘"라고만 하면 돼요. 진짜로 동작하는 웹페이지가 화면 오른쪽에 나타납니다.',
      hint: '아래 [복사] → 왼쪽 아래 입력창에 붙여넣고 전송(↑). 잠시 기다리면 AI가 페이지를 만들어요.',
      prompt: '좋아, 방금 그 계획대로 만들어줘. 깔끔하고 보기 좋은 디자인으로.',
      post: '만들어지면 화면 오른쪽 "미리보기"에서 직접 스크롤하고 눌러 보세요. 방금 말 몇 마디로 진짜 페이지가 생겼어요!',
    },
    {
      n: 3, name: '바꾸기', action: 'edit',
      title: '한 군데씩, 내 맘대로 바꾸기',
      concept: 'AI에게 줄 문장에는 정답이 없어요. 단어 하나만 바꿔도 결과가 달라집니다. 단, 한 번에 한 가지만 바꿔야 무엇이 달라졌는지 알 수 있어요.',
      hint: '아래 [복사]한 뒤, 입력창에서 밑줄(___) 자리를 아래 보기 중 하나로 직접 바꿔 적고 전송해 보세요.',
      prompt: '내 이름 글씨를 ___ 느낌으로 꾸며줘.',
      options: ['네온', '손글씨', '큼직한'],
      post: '핵심은 정해진 문장을 그대로 보내는 게 아니라, 입력창에서 단어를 직접 바꿔 보는 거예요. 마음에 들 때까지 한 단어씩 바꿔 보세요.',
    },
    {
      n: 4, name: '내 손으로', action: 'compose',
      title: '이제 내 말로 직접 고치기',
      concept: '이게 진짜 바이브코딩이에요. 화면 오른쪽 미리보기를 보면서, 마음에 안 드는 곳을 내 말로 직접 고쳐 보세요. 어떻게 바꿀지(코드)는 AI가 알아서 합니다.',
      hint: '① 미리보기에서 바꾸고 싶은 곳을 한 군데 정하고 ② 왼쪽 아래 입력창에 직접 적어 전송하세요. 뭐라고 쓸지 막막하면 아래 예시를 참고하세요.',
      examples: ['소개글 글씨가 너무 작아. 더 크고 줄 간격도 넓게 해줘', '프로필 사진 자리를 동그란 모양으로 바꿔줘', '배경색을 연한 파스텔 색으로 바꿔줘'],
      post: '참고하고 싶은 화면이 있으면 입력창의 [이미지] 버튼으로 사진을 붙일 수 있어요. 결과가 마음에 안 들면 "원래대로"가 아니라, 원하는 모습을 더 구체적으로 다시 말하면 됩니다 — 예: "버튼을 더 연한 파랑으로, 모서리는 둥글게".',
    },
  ];
  const [step, setStep] = React.useState(initialStep);
  const [completedThrough, setCompletedThrough] = React.useState(initialStep - 1); // 앞 단계까지 완료된 상태로 진입
  const [guideOpen, setGuideOpen] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const sendTimer = React.useRef(null);
  const curr = steps[step - 1];
  const currentDone = completedThrough >= step;
  const canNext = currentDone && step < steps.length;

  // 전송(입력창 ↑) → AI 반영(프로토타입 지연) → 단계 완료. 접혀 있었다면 자동으로 펴짐(완료 이벤트 자동 열림).
  const handleSend = () => {
    if (currentDone || sending) return;
    setSending(true);
    if (sendTimer.current) clearTimeout(sendTimer.current);
    sendTimer.current = setTimeout(() => {
      setSending(false);
      setCompletedThrough((c) => Math.max(c, step));
      setGuideOpen(true);
    }, 1500);
  };
  const goNext = () => { if (currentDone && step < steps.length) { setStep(step + 1); setGuideOpen(true); } };
  const goPrev = () => { if (step > 1) { setStep(step - 1); setGuideOpen(true); } };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        {/* C-2 튜토리얼: [튜토리얼 갤러리]만 허용 — 그 외 메뉴는 차단 (2026-06-22) */}
        <JitdaToolbar status="tutorial_running" actions={<ParticipantTutorialGalleryAction />} />

        {/* 튜토리얼 구분 띠 — 주황 테이프. 본 해커톤과 헷갈리지 않게, 포스트잇 접어도 항상 보임 */}
        <div className="oc-tutorial-strip">
          <span className="jt-tape">튜토리얼</span>
          <span style={{ color: 'var(--c-ink-2)' }}>지금은 연습이에요 — 여기서 만든 건 본 해커톤으로 이어지지 않아요.</span>
          <div style={{ flex: 1 }} />
          <span className="oc-guide-hint">
            아래에서 단계별 가이드를 확인하세요
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>

        {/* 가이드는 우측 상단 플로팅 포스트잇(접으면 소형 칩). relative 컨테이너 내부 absolute. */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* OpenCode 임베드 (튜토리얼 환경). 전송 → 단계 완료 트리거 */}
          <OpenCodeShell
            tutorial
            title="자기소개 웹페이지 만들기"
            promptCard="내 자기소개 웹페이지를 만들어줘. 이름, 소개글, 취미, 연락처 섹션이 있으면 좋겠어. 깔끔하고 모던한 디자인으로."
            onSend={handleSend}
            body={
              <>
                <OcStepsRow text="Show steps · 1m, 38s" />
                <OcResponseLabel />
                <OcParagraph>
                  좋아요. 한 줄로 동작하는 자기소개 페이지를 만들었어요. 이름·소개글·취미·연락처 4개 섹션으로 깔끔하게 정리했어요.
                </OcParagraph>
                <OcFileRow file="src/App.tsx" />
                <OcFileRow file="src/styles.css" />
                <OcParagraph muted>
                  화이트 배경에 차분한 회색 텍스트, 가운데 정렬로 모던한 느낌이에요. 미리보기에서 결과를 확인해주세요.
                </OcParagraph>
              </>
            }
            promptInput={
              curr.prompt ? (
                <span style={{ color: 'var(--c-ink-2)' }}>
                  <span style={{ color: 'var(--c-tutorial)', marginRight: 4 }}>&rsaquo;</span>{curr.prompt}
                  <span style={{
                    display: 'inline-block', width: 2, height: 16,
                    background: 'var(--c-ink-3)', verticalAlign: 'middle', marginLeft: 1,
                    animation: 'blink 1s steps(1) infinite',
                  }} />
                </span>
              ) : (
                <span style={{ color: 'var(--c-muted)' }}>
                  여기에 바꾸고 싶은 점을 내 말로 적어보세요…
                  <span style={{
                    display: 'inline-block', width: 2, height: 16,
                    background: 'var(--c-ink-3)', verticalAlign: 'middle', marginLeft: 1,
                    animation: 'blink 1s steps(1) infinite',
                  }} />
                </span>
              )
            }
          />
          {/* 튜토리얼 가이드 포스트잇 — 우측 상단, 열기/접기 (controlled) */}
          <TutorialPostit
            steps={steps} step={step}
            done={currentDone} sending={sending}
            open={guideOpen} onToggle={() => setGuideOpen((o) => !o)}
            onNext={goNext} onPrev={goPrev} canNext={canNext}
          />
        </div>
      </div>
  );
}


// 서버 오류 (튜토리얼) — 툴바 + 튜토리얼 띠 유지, 본문 전체 OcServerError.
// 가이드가 사라지므로 띠의 "단계별 가이드 확인" 힌트는 제거(가리킬 대상 없음).
function C2TutorialError() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        <JitdaToolbar status="tutorial_running" />
        <div className="oc-tutorial-strip">
          <span className="jt-tape">튜토리얼</span>
          <span style={{ color: 'var(--c-ink-2)' }}>지금은 연습이에요 — 여기서 만든 건 본 해커톤으로 이어지지 않아요.</span>
        </div>
        <OcServerError />
      </div>
  );
}


// ── Mock 코드 베이스 (정적) — OcBrowser 탐색기·코드 뷰용. 실제 앱 아님, 디자인 사양 더미. ──

// C-3: 1인팀 음료 추천 앱 (defaultBody diff 3파일 + 골격)
const C3_FILES = {
  tree: [
    { type: 'dir', name: 'src', children: [
      { type: 'dir', name: 'components', children: [
        { type: 'file', name: 'BrewList.tsx', path: 'src/components/BrewList.tsx' },
      ] },
      { type: 'file', name: 'App.tsx', path: 'src/App.tsx' },
      { type: 'file', name: 'main.tsx', path: 'src/main.tsx' },
      { type: 'file', name: 'styles.css', path: 'src/styles.css' },
    ] },
    { type: 'file', name: 'index.html', path: 'index.html' },
    { type: 'file', name: 'package.json', path: 'package.json' },
  ],
  contents: {
    'src/App.tsx': "import { BrewList } from './components/BrewList'\nimport './styles.css'\n\n// 코딩 단계마다 어울리는 음료를 추천하는 한 페이지 앱\nexport default function App() {\n  return (\n    <main className=\"app\">\n      <header>\n        <h1>오늘의 음료</h1>\n        <p>지금 작업에 어울리는 한 잔을 골라보세요</p>\n      </header>\n      <BrewList />\n    </main>\n  )\n}\n",
    'src/components/BrewList.tsx': "type Brew = { name: string; desc: string }\n\nconst BREWS: Brew[] = [\n  { name: '에스프레소', desc: '집중력이 필요한 디버깅 시간에' },\n  { name: '카페라떼', desc: '느긋한 페어 프로그래밍에' },\n  { name: '아메리카노', desc: '긴 코드 리뷰 마라톤에' },\n  { name: '콜드브루', desc: '여름 오후의 산뜻한 리팩터' },\n]\n\nexport function BrewList() {\n  return (\n    <div className=\"grid\">\n      {BREWS.map((b) => (\n        <article key={b.name} className=\"card\">\n          <h3>{b.name}</h3>\n          <p>{b.desc}</p>\n        </article>\n      ))}\n    </div>\n  )\n}\n",
    'src/styles.css': ":root {\n  --bg: #fdeed7;\n  --card: #fff7e8;\n  --line: #e8c98b;\n}\n.app { background: var(--bg); padding: 32px 40px; min-height: 100vh; }\n.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n.card {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: 10px;\n  padding: 14px;\n}\n",
    'src/main.tsx': "import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<App />)\n",
    'index.html': "<!doctype html>\n<html lang=\"ko\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>오늘의 음료</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n",
    'package.json': "{\n  \"name\": \"todays-brew\",\n  \"private\": true,\n  \"version\": \"0.1.0\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  }\n}\n",
  },
};

// C-4: 다인팀 OCR 일정봇 (화면에 노출된 3파일 + 골격)
const C4_FILES = {
  tree: [
    { type: 'dir', name: 'src', children: [
      { type: 'dir', name: 'pages', children: [
        { type: 'file', name: 'UploadPage.tsx', path: 'src/pages/UploadPage.tsx' },
      ] },
      { type: 'dir', name: 'components', children: [
        { type: 'file', name: 'EventCard.tsx', path: 'src/components/EventCard.tsx' },
      ] },
      { type: 'dir', name: 'lib', children: [
        { type: 'file', name: 'mockOcr.ts', path: 'src/lib/mockOcr.ts' },
      ] },
      { type: 'file', name: 'App.tsx', path: 'src/App.tsx' },
      { type: 'file', name: 'main.tsx', path: 'src/main.tsx' },
      { type: 'file', name: 'styles.css', path: 'src/styles.css' },
    ] },
    { type: 'file', name: 'index.html', path: 'index.html' },
    { type: 'file', name: 'package.json', path: 'package.json' },
  ],
  contents: {
    'src/pages/UploadPage.tsx': "import { useState } from 'react'\nimport { EventCard } from '../components/EventCard'\nimport { mockOcr, type ScheduleEvent } from '../lib/mockOcr'\n\n// 강의 시간표 사진 업로드 → OCR 모킹 → 일정 카드 리스트\nexport function UploadPage() {\n  const [events, setEvents] = useState<ScheduleEvent[]>([])\n\n  async function handleUpload(file: File) {\n    const parsed = await mockOcr(file)\n    setEvents(parsed)\n  }\n\n  return (\n    <section className=\"upload\">\n      <input type=\"file\" accept=\"image/*\"\n        onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />\n      <ul className=\"events\">\n        {events.map((ev) => <EventCard key={ev.id} event={ev} />)}\n      </ul>\n    </section>\n  )\n}\n",
    'src/components/EventCard.tsx': "import type { ScheduleEvent } from '../lib/mockOcr'\n\nfunction dday(date: string): number {\n  const ms = new Date(date).getTime() - Date.now()\n  return Math.ceil(ms / 86_400_000)\n}\n\nexport function EventCard({ event }: { event: ScheduleEvent }) {\n  const d = dday(event.date)\n  const urgent = d <= 3\n  return (\n    <li className=\"event-card\">\n      <span className=\"title\">{event.title}</span>\n      <span className=\"date\">{event.date}</span>\n      {/* 시험 기간이 가까운 일정은 빨간 D-day 뱃지로 강조 */}\n      <span className={urgent ? 'dday urgent' : 'dday'}>D-{d}</span>\n    </li>\n  )\n}\n",
    'src/lib/mockOcr.ts': "export type ScheduleEvent = {\n  id: string\n  title: string\n  date: string\n}\n\n// OCR API 는 우선 모킹으로 처리 — 추후 실제 OCR 연동\nexport async function mockOcr(_file: File): Promise<ScheduleEvent[]> {\n  await new Promise((r) => setTimeout(r, 400))\n  return [\n    { id: '1', title: '자료구조 중간고사', date: '2026-06-18' },\n    { id: '2', title: '운영체제 과제 제출', date: '2026-06-22' },\n    { id: '3', title: '데이터베이스 퀴즈', date: '2026-06-30' },\n  ]\n}\n",
    'src/App.tsx': "import { UploadPage } from './pages/UploadPage'\nimport './styles.css'\n\nexport default function App() {\n  return (\n    <main className=\"app\">\n      <h1>AI 일정관리 봇</h1>\n      <UploadPage />\n    </main>\n  )\n}\n",
    'src/main.tsx': "import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<App />)\n",
    'src/styles.css': ".app { max-width: 640px; margin: 0 auto; padding: 32px 20px; }\n.events { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }\n.event-card { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #e3e1da; border-radius: 10px; }\n.dday { margin-left: auto; font-weight: 700; }\n.dday.urgent { color: #e5484d; }\n",
    'index.html': "<!doctype html>\n<html lang=\"ko\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>AI 일정관리 봇</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n",
    'package.json': "{\n  \"name\": \"schedule-ocr-bot\",\n  \"private\": true,\n  \"version\": \"0.1.0\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  }\n}\n",
  },
};

// ─── C-3. 1인팀 코딩 환경 ───────────────────────────────────────
// 짓다 툴바(원본 유지) + OpenCode minimal 임베드 셸. 1인팀은 즉시전송(합의 없음).
// previewState 로 미리보기 3상태 분기: ready(완성앱)·empty(미준비)·spawning(서버 기동).
function C3PersonalCoding({ previewState = 'ready' }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />
        <OpenCodeShell
          previewState={previewState}
          files={C3_FILES}
          composerRef={previewState === 'ready' ? <OcReferenceBlock name="App.tsx" path="src/App.tsx" lines="L12-28" /> : undefined}
        />
      </div>
  );
}
// 미리보기 미준비 (서버는 떴으나 앱 빌드 전) — 결정4: 완성앱과 함께 별도 화면.
function C3PersonalCodingEmpty() { return <C3PersonalCoding previewState="empty" />; }
// 서버 기동 중 (SpawnLoading) — 페이지정의서 C-3 상태표 "서버 기동 중".
function C3PersonalCodingSpawning() { return <C3PersonalCoding previewState="spawning" />; }
// AI 생성 중 — sending 순간 미리보기 패널에 DIG 마스코트(마스코트-애니메이션-가이드 §4 1순위).
function C3PersonalCodingGenerating() { return <C3PersonalCoding previewState="generating" />; }
// 서버 오류 — OpenCode 셸 자체를 못 띄움. 툴바 유지 + 본문 전체 OcServerError + [다시 시도]. (해커톤 진행)
function C3PersonalCodingError() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />
        <OcServerError />
      </div>
  );
}


// ─── C-4. 다인팀 코딩 환경 ───────────────────────────────────────
// 짓다 툴바 (팀 정보 노출) + opencode iframe.
// 팀 모드 차이: 프롬프트 박스 옆에 [전송 요청] 버튼 (E-4 트리거),
//              opencode 위에 다른 팀원 커서 마커 오버레이.
function C4TeamCanvas() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />
        <OpenCodeShell
          title="AI 일정관리 봇 · 팀 캔버스"
          promptCard="강의 시간표 사진을 업로드하면 일정을 자동으로 뽑아내는 화면을 만들어줘. OCR API는 우선 모킹으로 처리하고, 인식된 일정은 카드 리스트로 보여줘."
          body={
            <>
              <OcStepsRow text="Show steps · 3m, 12s" />
              <OcResponseLabel />
              <OcParagraph>
                좋아요. 사진 업로드 → OCR 모킹 → 카드 리스트 흐름으로 만들었어요. 시험 기간이 가까운 일정은 빨간 D-day 뱃지로 강조했어요.
              </OcParagraph>
              <OcFileRow file="src/pages/UploadPage.tsx" />
              <OcFileRow file="src/components/EventCard.tsx" />
              <OcFileRow file="src/lib/mockOcr.ts" />
            </>
          }
          promptInput={
            <span style={{ color: 'var(--c-ink-2)' }}>
              일정 카드를 누르면 D-1 알림 설정 토글이 나오게 해줘. 토글은 카카오톡 색(노랑) 으로.
              <span style={{
                display: 'inline-block', width: 2, height: 16,
                background: 'var(--c-ink-3)', verticalAlign: 'middle', marginLeft: 1,
                animation: 'blink 1s steps(1) infinite',
              }} />
            </span>
          }
          files={C4_FILES}
          composerRef={<OcReferenceBlock name="UploadPage.tsx" path="src/pages/UploadPage.tsx" lines="L8-40" />}
          sendAction="request-send"
          dock={
            /* 팀원 프레즌스 — composer 바로 위. 전송은 composer 공용 단일 버튼이 합의(E-4) 트리거. */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 0' }}>
              <div style={{ display: 'inline-flex' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--c-helmet)', color: 'var(--c-stache)', border: '1.5px solid var(--c-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, fontFamily: 'var(--font-body)' }}>민준</span>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--c-blue)', color: '#fff', border: '1.5px solid var(--c-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, fontFamily: 'var(--font-body)', marginLeft: -6 }}>서윤</span>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--c-mint)', color: '#fff', border: '1.5px solid var(--c-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, fontFamily: 'var(--font-body)', marginLeft: -6 }}>지호</span>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span className="jt-dot live" style={{ width: 6, height: 6 }} />
                김민준이 작성 중 · 38자
              </span>
            </div>
          }
        />
        {/* 팀원 커서는 미리보기(라이브 앱)가 아니라 composer doc 내부에 색깔 caret+이름표로
            표시(원 소스 affine-doc-remote-selection-widget). 미리보기 위 오버레이 커서 제거. */}
      </div>
  );
}

// 서버 오류 (다인팀) — 툴바는 C-3와 동일(hackathon_running + 캔버스 액션)이라 본문은 같은 OcServerError.
// 다인팀 컨텍스트 구분을 위해 별도 화면으로 등록(viewer/Renewal). 시각은 C-3 오류와 동일.
function C4TeamCanvasError() { return <C3PersonalCodingError />; }

function TeamCursor({ top, left, name, color }) {
  return (
    <div style={{ position: 'absolute', top, left, pointerEvents: 'none', zIndex: 5 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
        <path d="M3 3 L3 17 L8 12 L11 19 L14 18 L11 11 L17 11 Z" fill={color} stroke="#fff" strokeWidth="1.5" />
      </svg>
      <div style={{
        marginTop: 2, marginLeft: 12,
        background: color, color: '#fff',
        padding: '2px 8px', borderRadius: 4,
        fontSize: 10.5, fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
      }}>{name}</div>
    </div>
  );
}

Object.assign(window, {
  // C-1 \ub300\uae30\uc2e4 (v1 \ud3d0\uae30 2026-05-29 \u2014 v2 \ub2e8\uc77c \ucc44\ud0dd). C1TeamRoomV2(state, team)\uc5d0 \uc9c1\uc811 props.
  C1RoomBeforeV2, C1RoomAfterTutorialV2, C1RoomEndedV2, C1TeamRoomV2,
  C2Tutorial, C2TutorialError, C3PersonalCoding, C3PersonalCodingEmpty, C3PersonalCodingSpawning, C3PersonalCodingGenerating, C3PersonalCodingError, C4TeamCanvas, C4TeamCanvasError,
  OpenCodeShell, OcReferenceBlock, OcPreviewEmpty, OcPreviewSpawning, OcPreviewGenerating, OcServerError, JitdaToolbar, ParticipantCanvasActions,
  OcBrowser, OcFileTree, OcFileTab, OcCodeView,
  // MOCK \ud300 \ubcc0\ud615 \u2014 viewer edge case \ub4f1\ub85d\uc6a9
  MOCK_TEAM_STANDARD, MOCK_TEAM_LONG_NAME, MOCK_TEAM_MANY_MEMBERS,
});
