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
//   roomEnded         대기실 ③ 해커톤 종료 안내   hackathon_ended  → [결과 보기]·[갤러리]
//
// 일시정지는 대기실에서는 발생하지 않는다(운영자는 hackathon_running 상태에서만
// pause 가능). 일시정지 오버레이는 E-6(e6-paused) — 바이브코딩 화면(C-3·C-4)
// 위에 백드롭으로 덮인다. C 영역엔 paused 별도 화면이 더 이상 없다.
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

function C1TeamRoom({ state = 'roomBefore', team = MOCK_TEAM_STANDARD }) {

  // 상태별 카피 — 시작 단계 진입 버튼([튜토리얼 시작하기]·[해커톤 입장하기])은 제거됨
  // (운영자가 단계를 전이시키면 참가자 화면이 자동으로 다음 화면으로 넘어감)
  const stateCopy = {
    roomBefore: {
      eyebrow: '대기실 ① · 시작 전 대기',
      headline: <>곧 시작됩니다.<br/>잠시만 기다려주세요.</>,
      body: '운영자가 해커톤을 시작하면 자동으로 다음 단계로 넘어가요. \n자리를 비워도 괜찮아요 — 화면만 켜두세요.',
      hint: '시작을 기다리는 중',
      illustration: 'idle',
    },
    roomAfterTutorial: {
      eyebrow: '대기실 ② · 튜토리얼 후 대기',
      headline: <>튜토리얼이 끝났습니다.<br/>해커톤이 곧 시작됩니다.</>,
      body: '운영자가 해커톤을 시작하면 코딩 환경이 자동으로 열려요. \n튜토리얼 작업물은 연습용으로 남고, 본행사는 새 프로젝트에서 시작해요.',
      hint: '해커톤 시작을 기다리는 중',
      illustration: 'tutorialDone',
    },
    roomEnded: {
      eyebrow: '대기실 ③ · 해커톤 종료',
      headline: <>수고하셨어요.<br/>다른 팀의 작품도 둘러보세요.</>,
      body: '오늘 만든 작품들이 갤러리에 모두 공개됐어요. \n마음에 드는 작품엔 ❤️ 로 응원을 남겨주세요.',
      actions: [
        { label: '결과 보기', kind: 'secondary' },
        { label: '갤러리로 가기 →', kind: 'critical' },
      ],
      illustration: 'ended',
    },
  };
  const s = stateCopy[state] ?? stateCopy.roomBefore;

  // 참가자 시점 status 매핑 (대기실 3상태 → StatusPill)
  const c1StatusMap = {
    roomBefore:        { status: 'tutorial_waiting',  paused: false },
    roomAfterTutorial: { status: 'hackathon_waiting', paused: false },
    roomEnded:         { status: 'hackathon_ended',   paused: false },
  };
  const c1Status = c1StatusMap[state] ?? c1StatusMap.roomBefore;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)', position: 'relative' }}>
        {/* GNB — 참가자 통합 JitdaToolbar. C-1은 액션 없음 (대기실은 클릭할 게 없음) */}
        <JitdaToolbar status={c1Status.status} paused={c1Status.paused} />

        {/* 본문 — 두 컬럼: 좌측 메시지·액션 / 우측 팀원 목록 */}
        <main style={{
          flex: 1, minHeight: 0,
          display: 'grid', gridTemplateColumns: '1fr 360px',
          gap: 0,
        }}>
          {/* 좌측: 일러스트 + 메시지 + 액션 */}
          <section style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 56px',
            gap: 20,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <WaitingIllustration kind={s.illustration} />

            <div className="jt-eyebrow" style={{ color: state === 'roomEnded' ? 'var(--c-mint)' : state === 'roomAfterTutorial' ? 'var(--c-tutorial)' : state === 'paused' ? 'var(--c-amber)' : 'var(--c-slate)', marginTop: 12 }}>
              {s.eyebrow}
            </div>
            <h1 style={{ fontSize: 38, lineHeight: 1.15, maxWidth: 520, letterSpacing: '-0.02em' }}>
              {s.headline}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--c-slate)', maxWidth: 460, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              {s.body}
            </p>

            {/* 액션 — 대기실 ③만 실제 버튼. ①·②·paused 는 텍스트 힌트 + 펄스만 표시. */}
            {s.actions ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {s.actions.map((a, i) => (
                  <button key={i} className={`jt-btn ${a.kind === 'critical' ? 'jt-btn-critical' : a.kind === 'primary' ? 'jt-btn-primary' : 'jt-btn-secondary'}`} style={{ padding: '12px 22px', fontSize: 14 }}>
                    {a.label}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                marginTop: 8,
                fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-muted)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--c-stone)', padding: '7px 14px', borderRadius: 999,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: state === 'paused' ? 'var(--c-amber)' : state === 'roomAfterTutorial' ? 'var(--c-tutorial)' : 'var(--c-helmet)',
                  animation: 'pulse 1.6s infinite', display: 'inline-block',
                }} />
                {s.hint}
              </div>
            )}
          </section>

          {/* 우측: 팀 정보 (참가자 정보 + 팀원 목록) */}
          <aside style={{
            background: 'var(--c-canvas)',
            borderLeft: '1px solid var(--c-hairline)',
            display: 'flex', flexDirection: 'column',
            minHeight: 0,
          }}>
            <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--c-hairline)' }}>
              <div className="jt-eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>내 팀</div>
              <div style={{
                fontSize: 20, fontWeight: 700, lineHeight: 1.25, fontFamily: 'var(--font-display)',
                wordBreak: 'keep-all',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {team.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-slate)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {team.members.filter(m => m.online === 'connected').length} / {team.members.length} 접속 중
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px' }}>
              <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', padding: '4px 8px 8px' }}>
                팀원 {team.members.length}명
              </div>
              {team.members.map((m, i) => {
                // C-1 online: 'connected'|'offline'|'idle' → RosterMemberRow state: 'on'|'off'|'pending'
                const state = m.online === 'connected' ? 'on' : m.online === 'offline' ? 'off' : 'pending';
                return (
                  <RosterMemberRow
                    key={i}
                    name={m.name}
                    color={m.color}
                    state={state}
                    isMe={m.name === team.me} />

                );
              })}
            </div>

            <div style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--c-hairline)',
              background: 'var(--c-paper)'
            }}>
              <RosterLegend states={['on', 'off']} />
            </div>
          </aside>
        </main>
      </div>
  );
}

// 상태별 배지 — 참가자 대기실 3종 (일시정지는 e6-paused 오버레이로 분리)
function ParticipantStatusBadge({ state }) {
  const map = {
    roomBefore:        { label: '대기 중',        cls: 'jt-pill-pending' },
    roomAfterTutorial: { label: '튜토리얼 완료 · 대기', cls: 'jt-pill-pending' },
    roomEnded:         { label: '해커톤 종료',    cls: 'jt-pill-ended' },
  };
  const m = map[state] ?? map.roomBefore;
  return (
    <span className={`jt-pill ${m.cls}`}>
      <span className="dot" />
      {m.label}
    </span>
  );
}

// PresenceDot — 폐기됨(2026-05-27): shared.jsx의 공용 RosterMemberRow가 아바타 우하단 인디케이터로 통합.
// 호출처 0 확인 후 삭제.

// 대기 상태 일러스트 — SVG 단순 도형, 텍스처/그림 X
function WaitingIllustration({ kind }) {
  const common = {
    width: 180, height: 120,
  };
  if (kind === 'tutorialDone') {
    return (
      <svg {...common} viewBox="0 0 180 120">
        <rect x="20" y="30" width="140" height="80" rx="6" fill="var(--c-tutorial-soft)" stroke="var(--c-tutorial)" strokeWidth="1.5" />
        <rect x="32" y="44" width="60" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.35" />
        <rect x="32" y="58" width="100" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.25" />
        <rect x="32" y="72" width="80" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.25" />
        <circle cx="148" cy="44" r="10" fill="var(--c-mint)" />
        <path d="M 143 44 L 147 48 L 153 41" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'tutorial') {
    return (
      <div style={{ position: 'relative', width: 180, height: 120 }}>
        <svg {...common} viewBox="0 0 180 120">
          <rect x="20" y="30" width="140" height="80" rx="6" fill="var(--c-tutorial-soft)" stroke="var(--c-tutorial)" strokeWidth="1.5" />
          <rect x="32" y="44" width="60" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.5" />
          <rect x="32" y="58" width="100" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.3" />
          <rect x="32" y="72" width="80" height="6" rx="3" fill="var(--c-tutorial)" opacity="0.3" />
          <circle cx="148" cy="44" r="8" fill="var(--c-tutorial)" />
          <text x="148" y="48" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">1</text>
        </svg>
      </div>
    );
  }
  if (kind === 'go') {
    return (
      <svg {...common} viewBox="0 0 180 120">
        <circle cx="90" cy="60" r="44" fill="var(--c-helmet-soft)" stroke="var(--c-helmet-deep)" strokeWidth="1.5" />
        <path d="M 75 50 L 75 70 L 110 60 Z" fill="var(--c-ink)" />
      </svg>
    );
  }
  if (kind === 'ended') {
    return (
      <svg {...common} viewBox="0 0 180 120">
        <rect x="40" y="40" width="100" height="60" rx="4" fill="var(--c-mint-soft)" stroke="var(--c-mint)" strokeWidth="1.5" />
        <path d="M 70 70 L 85 84 L 115 56" stroke="var(--c-mint)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'paused') {
    return (
      <svg {...common} viewBox="0 0 180 120">
        <circle cx="90" cy="60" r="40" fill="var(--c-amber-soft)" stroke="var(--c-amber)" strokeWidth="1.5" />
        <rect x="78" y="44" width="8" height="32" rx="2" fill="var(--c-amber)" />
        <rect x="94" y="44" width="8" height="32" rx="2" fill="var(--c-amber)" />
      </svg>
    );
  }
  // idle (default waiting)
  return (
    <svg {...common} viewBox="0 0 180 120">
      <circle cx="90" cy="60" r="30" fill="none" stroke="var(--c-hairline-strong)" strokeWidth="1.5" strokeDasharray="4 4">
        <animateTransform attributeName="transform" type="rotate" from="0 90 60" to="360 90 60" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="60" r="6" fill="var(--c-helmet)" />
      <circle cx="90" cy="36" r="3" fill="var(--c-helmet)" opacity="0.6" />
      <circle cx="114" cy="60" r="3" fill="var(--c-blue)" opacity="0.6" />
      <circle cx="90" cy="84" r="3" fill="var(--c-mint)" opacity="0.6" />
      <circle cx="66" cy="60" r="3" fill="var(--c-amber)" opacity="0.6" />
    </svg>
  );
}

// 호환 alias — 새 대기실 모델 (대기실 ①·②·③). 일시정지는 e6-paused로 이동.
function C1RoomBefore() { return <C1TeamRoom state="roomBefore" />; }
function C1RoomAfterTutorial() { return <C1TeamRoom state="roomAfterTutorial" />; }
function C1RoomEnded() { return <C1TeamRoom state="roomEnded" />; }
// 과거 명칭 호환 — 대기실 ①로 폴백 (튜토리얼/해커톤 진입 버튼은 제거됨)
function C1Waiting() { return <C1RoomBefore />; }
function C1Ended() { return <C1RoomEnded />; }





// ─── 짓다 툴바 (참가자 GNB 통합) ─────────────────────────────────
// 모든 참가자 화면(C-1·C-2·C-3·C-4) + 그 위 모달(E-4·E-5) 공용.
// 구조: 로고 | 해커톤명 | StatusPill | (flex) | actions(있으면) | 계정정보(이름·팀명·아바타)
// 룰:
//  · 팀원 아바타 묶음·"팀·N명" pill·남은시간·서버재시작 모두 제거 (사용자 결정 2026-05-26)
//  · 우측 계정정보는 모든 화면 공통 (기본값 = 최지유 · 터미널 사파리)
//  · 액션 버튼은 화면별로 prop 주입: C-1·C-2(없음), C-3·C-4·E-4·E-5([내 프로젝트][갤러리 보기])
function JitdaToolbar({ status, paused, actions, user = DEFAULT_PARTICIPANT_USER }) {
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
      <JitdaMark size={18} />
      <div style={{ width: 1, background: 'var(--c-hairline-strong)', height: 14 }} />
      <span style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>2026 봄 ENK 해커톤</span>
      {status && <StatusPill status={status} paused={paused} />}
      <div style={{ flex: 1 }} />
      {actions}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>
          {user.name} · {user.team}
        </span>
        <div className="jt-avatar" style={{
          background: user.color, color: '#fff',
          width: 26, height: 26, fontSize: 12,
        }}>{user.name[0]}</div>
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


// ─── OpenCode 셸 ─────────────────────────────────────────────
// opencode 의 실제 웹 UI (다크 모드 SaaS 스타일) 를 그대로 임베드.
// 짓다 가 자유롭게 바꿀 수 있는 부분: 액센트 색·상태바 라벨 정도.
// 본문 카드·프롬프트 박스·상단 바 구조는 opencode 원본 그대로.
function OpenCodeShell({
  title = 'Drink recommender app',
  serverHost = '127.0.0.1:4096',
  mcpCount = 7,
  mode = 'Build',
  model = 'Claude Opus 4.5',
  agent = 'Default',
  promptCard,
  body,
  promptInput,
  overlay,
}) {
  const defaultPromptCard = "코딩 단계마다 어울리는 음료를 추천해주는 한 페이지 앱을 만들어줘. 카드 4개로, 각 카드에 음료 이름과 한 줄 설명.";
  const defaultBody = (
    <>
      <OcStepsRow text="Show steps · 2m, 04s" />
      <OcResponseLabel />
      <OcParagraph>
        좋아요. 한 페이지 앱으로 음료 카드 4개를 만들었어요. 살구색 배경에 깔끔한 카드 레이아웃, 각 카드에 음료 이름과 한 줄 설명이 들어가요.
      </OcParagraph>
      <OcFileRow file="src/App.tsx" />
      <OcFileRow file="src/components/BrewList.tsx" />
      <OcFileRow file="src/styles.css" />
      <OcParagraph muted>
        미리보기 패널에서 결과를 확인하실 수 있어요. 카드를 누르면 어떤 상황에 어울리는 음료인지 펼쳐서 보여줄까요?
      </OcParagraph>
    </>
  );

  return (
    <div style={{
      flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'column',
      background: '#0d0d11',
      color: '#d4d4dc',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* opencode 내부 상단 바 */}
      <div style={{
        flex: '0 0 auto',
        height: 42,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #1c1c22',
        fontSize: 12.5,
      }}>
        {/* 햄버거 메뉴 */}
        <button style={{ background: 'none', border: 'none', color: '#8a8a92', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </button>

        {/* 세션 제목 + 드롭다운 */}
        <button style={{
          background: 'none', border: 'none', color: '#d4d4dc',
          cursor: 'pointer', padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', fontSize: 12.5,
        }}>
          <span>{title}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <div style={{ flex: 1 }} />

        {/* 우측 상태 + 패널 토글 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#8a8a92', fontSize: 11.5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="14" rx="1.5"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
            <span>{serverHost}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            <span>{mcpCount} MCP</span>
          </span>
          <div style={{ display: 'flex', gap: 6, color: '#6a6a72' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/></svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
        padding: '24px 32px 0',
      }}>
        {/* 세션 제목 */}
        <h2 style={{
          fontSize: 17, fontWeight: 600,
          color: '#e8e8ee',
          margin: '0 0 16px',
          fontFamily: 'var(--font-body)',
          letterSpacing: '-0.005em',
        }}>{title}</h2>

        {/* 사용자 프롬프트 카드 */}
        <div style={{
          background: '#1a1a20',
          border: '1px solid #232329',
          borderRadius: 4,
          padding: '14px 18px',
          fontSize: 13.5, lineHeight: 1.55,
          color: '#d4d4dc',
          marginBottom: 18,
        }}>
          {promptCard ?? defaultPromptCard}
        </div>

        {body ?? defaultBody}

        <div style={{ flex: 1 }} />
      </div>

      {/* 프롬프트 입력 박스 — 하단 고정 */}
      <div style={{
        flex: '0 0 auto',
        margin: '12px 24px 16px',
        background: '#1a1a20',
        border: '1px solid #232329',
        borderRadius: 4,
        padding: '14px 16px 10px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          fontSize: 13, lineHeight: 1.5,
          color: promptInput ? '#d4d4dc' : '#5e5e68',
          minHeight: 36,
          fontFamily: 'var(--font-body)',
        }}>
          {promptInput ?? <span>Ask anything… <span style={{ color: '#4a4a52' }}>"Implement caching for this endpoint"</span></span>}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          fontSize: 12, color: '#8a8a92',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <span style={{ color: '#d4d4dc' }}>{mode}</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <span style={{ color: '#d4d4dc' }}>{model}</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <span>{agent}</span>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', color: '#6a6a72', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          <button style={{
            background: '#2a2a32', border: 'none', color: '#d4d4dc',
            cursor: 'pointer', padding: '4px 8px', borderRadius: 3,
            display: 'flex', alignItems: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </button>
        </div>
      </div>

      {/* 짓다 가 올려놓는 오버레이 (튜토리얼 코치마크, 합의 투표 등) */}
      {overlay}
    </div>
  );
}

// OpenCode 내부에서 쓰이는 UI primitive 들
function OcStepsRow({ text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      color: '#8a8a92', fontSize: 12.5,
      marginBottom: 12, cursor: 'pointer',
      fontFamily: 'var(--font-body)',
    }}>
      <span>{text}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  );
}

function OcResponseLabel() {
  return (
    <div style={{
      fontSize: 12.5, color: '#8a8a92',
      marginBottom: 8,
      fontFamily: 'var(--font-body)',
    }}>Response</div>
  );
}

function OcParagraph({ children, muted }) {
  return (
    <p style={{
      fontSize: 13.5, lineHeight: 1.65,
      color: muted ? '#a8a8b0' : '#d4d4dc',
      margin: '0 0 14px',
      fontFamily: 'var(--font-body)',
    }}>{children}</p>
  );
}

function OcFileRow({ file }) {
  // file pill — 보라/회색 카드에 청록 png 아이콘
  const ext = file.split('.').pop();
  const base = file.replace(/\.[^.]+$/, '');
  return (
    <div style={{
      background: '#1a1a20',
      border: '1px solid #232329',
      borderRadius: 4,
      padding: '10px 14px',
      marginBottom: 6,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 16, height: 16,
        background: '#2dd4bf',
        borderRadius: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#062e29', fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
      }}>{ext.toUpperCase().slice(0, 3)}</div>
      <span style={{ fontSize: 13, color: '#d4d4dc', fontFamily: 'var(--font-body)' }}>
        {base}<span style={{ color: '#e8e8ee', fontWeight: 600 }}>.{ext}</span>
      </span>
      <div style={{ flex: 1 }} />
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6a6a72" strokeWidth="2">
        <polyline points="8 6 14 12 8 18"/>
        <polyline points="14 6 20 12 14 18" opacity="0.5"/>
      </svg>
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
function C2Tutorial({ step = 2 }) {
  const steps = [
    {
      n: 1, title: '한 문장으로 앱 만들기',
      eyebrow: 'STEP 1 · 기획',
      hint: 'AI에게 만들고 싶은 앱을 한 문장으로 말해보세요. 결과가 바로 화면에 뜹니다.',
      prompt: '간단한 투두 리스트 앱을 만들어줘. 할 일 추가, 완료 체크, 삭제 기능이 있으면 좋겠어.',
    },
    {
      n: 2, title: '자연어로 기능 추가',
      eyebrow: 'STEP 2 · 기능 추가',
      hint: '만든 앱에 새 기능을 더해봐요. "이런 거 넣어줘" 라고 말해도 돼요.',
      prompt: '할 일에 우선순위를 표시할 수 있게 해줘. 높음은 빨강, 중간은 노랑, 낮음은 초록으로 보여줘.',
    },
    {
      n: 3, title: '마음에 안 드는 부분 다듬기',
      eyebrow: 'STEP 3 · 다듬기',
      hint: '디자인이나 UX 가 어색하다면 그것도 말로 고칠 수 있어요.',
      prompt: '전체적으로 디자인이 좀 심심해. 색감을 더 예쁘게 바꾸고, 완료된 할 일은 취소선으로 표시해줘.',
    },
  ];
  const curr = steps[step - 1];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        {/* C-2 튜토리얼: 액션 버튼 없음 (사용자 결정 — 튜토리얼 중 메뉴 접근 차단) */}
        <JitdaToolbar status="tutorial_running" />

        {/* 가이드 패널 — 캔버스 상단 접이식 카드 (전폭, 1인팀·다인팀 공통 위치) */}
        <section style={{
          flex: '0 0 auto',
          background: 'var(--c-canvas)',
          borderBottom: '1px solid var(--c-hairline)',
          padding: '16px 28px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {/* 상단 줄: 프로그레스 + 단계 라벨 + 액션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
              background: 'var(--c-tutorial)', color: '#fff',
              padding: '3px 8px', borderRadius: 3,
            }}>TUTORIAL</span>

            {/* 프로그레스 스텝퍼 — Step 1/3, 2/3, 3/3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {steps.map((s, i) => {
                const idx = i + 1;
                const isDone = idx < step;
                const isCurr = idx === step;
                return (
                  <React.Fragment key={idx}>
                    <button title={s.title} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', padding: 0,
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: isDone ? 'var(--c-mint)' : isCurr ? 'var(--c-tutorial)' : 'transparent',
                        color: isDone || isCurr ? '#fff' : 'var(--c-muted)',
                        border: !isDone && !isCurr ? '1.5px solid var(--c-hairline-strong)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
                      }}>{isDone ? '✓' : idx}</span>
                      <span style={{
                        fontSize: 11.5, fontWeight: isCurr ? 700 : 500,
                        color: isCurr ? 'var(--c-ink)' : isDone ? 'var(--c-slate)' : 'var(--c-muted)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
                      }}>STEP {idx}</span>
                    </button>
                    {idx < steps.length && (
                      <span style={{
                        width: 18, height: 1,
                        background: isDone ? 'var(--c-mint)' : 'var(--c-hairline)',
                      }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div style={{ flex: 1 }} />

            <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{ padding: '4px 10px', fontSize: 11.5 }}>
              건너뛰기
            </button>
            <button className="jt-btn jt-btn-ghost jt-btn-sm" title="가이드 접기" style={{ padding: '4px 8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </div>

          {/* 가이드 본문 — 좌(설명·프롬프트) + 우(다음 단계 액션) */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto',
            gap: 16, alignItems: 'stretch',
          }}>
            <div style={{
              padding: '14px 16px',
              background: 'var(--c-tutorial-soft)',
              borderLeft: '3px solid var(--c-tutorial)',
              borderRadius: 4,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div className="jt-eyebrow" style={{ color: 'var(--c-tutorial)', fontSize: 10 }}>{curr.eyebrow}</div>
              <h2 style={{ fontSize: 18, lineHeight: 1.25 }}>
                {curr.title}
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--c-ink-2)', lineHeight: 1.55, margin: 0 }}>
                {curr.hint}
              </p>

              {/* 프롬프트 예시 + 복사 — 핵심 컴포넌트 */}
              <div style={{
                display: 'flex', gap: 8, alignItems: 'stretch',
                background: 'var(--c-canvas)',
                border: '1px solid var(--c-hairline-strong)',
                borderRadius: 4,
                marginTop: 4,
              }}>
                <div style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5,
                  color: 'var(--c-ink)',
                  minWidth: 0,
                }}>
                  <span style={{ color: 'var(--c-tutorial)', fontWeight: 700 }}>›</span> {curr.prompt}
                </div>
                <button style={{
                  background: 'var(--c-ink)', color: '#fff',
                  border: 'none', padding: '0 14px',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                  borderRadius: '0 3px 3px 0',
                  flexShrink: 0,
                }}>
                  {Icon.copy(11)} 복사
                </button>
              </div>
              <span style={{ fontSize: 11, color: 'var(--c-slate)' }}>
                ← 아래 캔버스에 붙여넣고 [전송] 을 눌러보세요.
              </span>
            </div>

            {/* 단계 이동 */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'stretch', gap: 6,
              padding: '4px 0',
              minWidth: 200,
            }}>
              <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{ fontSize: 12, padding: '7px 10px', justifyContent: 'flex-start' }} disabled={step <= 1}>
                {Icon.arrowLeft(11)} 이전 단계 다시 보기
              </button>
              <button className="jt-btn jt-btn-primary" style={{ fontSize: 13, padding: '10px 14px', justifyContent: 'center' }}>
                다음 단계 {Icon.arrowRight(12)}
              </button>
              <span style={{
                fontSize: 10.5, color: 'var(--c-muted)',
                textAlign: 'center', fontFamily: 'var(--font-mono)',
              }}>다인팀: 팀원 누구나 클릭 가능</span>
            </div>
          </div>
        </section>

        {/* OpenCode iframe — 가이드 카드 바로 아래 (전폭) */}
        <OpenCodeShell
          title="자기소개 웹페이지 만들기"
          promptCard="내 자기소개 웹페이지를 만들어줘. 이름, 소개글, 취미, 연락처 섹션이 있으면 좋겠어. 깔끔하고 모던한 디자인으로."
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
            <span style={{ color: '#8a8a92' }}>
              <span style={{ color: 'var(--c-tutorial)' }}>›</span> {curr.prompt}
              <span style={{
                display: 'inline-block', width: 2, height: 16,
                background: '#d4d4dc', verticalAlign: 'middle', marginLeft: 1,
                animation: 'blink 1s steps(1) infinite',
              }} />
            </span>
          }
        />
      </div>
  );
}


// ─── C-3. 1인팀 코딩 환경 ───────────────────────────────────────
// 짓다 툴바 + opencode iframe (전체). MVP HackathonProgress.tsx 와 동일 구조.
function C3PersonalCoding() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
        <JitdaToolbar status="hackathon_running" actions={<ParticipantCanvasActions />} />
        <OpenCodeShell />
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
            <span>
              일정 카드를 누르면 D-1 알림 설정 토글이 나오게 해줘. 토글은 카카오톡 색(노랑) 으로.
              <span style={{
                display: 'inline-block', width: 2, height: 16,
                background: '#d4d4dc', verticalAlign: 'middle', marginLeft: 1,
                animation: 'blink 1s steps(1) infinite',
              }} />
            </span>
          }
          overlay={
            <>
              {/* 다른 팀원 커서들 — opencode 텍스트 영역 위에 오버레이 */}
              <TeamCursor top={210} left={420} name="이서윤" color="var(--c-blue)" />
              <TeamCursor top={340} left={180} name="박지호" color="var(--c-mint)" />

              {/* 짓다 가 추가한 팀 모드 액션 바 — opencode 프롬프트 박스 위에 */}
              <div style={{
                position: 'absolute',
                left: 24, right: 24, bottom: 124,
                display: 'flex', alignItems: 'center', gap: 10,
                pointerEvents: 'none',
              }}>
                <div style={{
                  background: 'rgba(13, 13, 17, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid #2a2a32',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 11, color: '#d4d4dc',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  pointerEvents: 'auto',
                }}>
                  <span style={{ color: 'var(--c-helmet)' }}>●</span>
                  김민준이 작성 중 · 38자
                </div>
                <div style={{ flex: 1 }} />
                <button style={{
                  background: 'var(--c-helmet)',
                  color: 'var(--c-ink)',
                  border: '1px solid var(--c-helmet-deep)',
                  padding: '7px 14px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  팀에 전송 요청 →
                </button>
              </div>
            </>
          }
        />
      </div>
  );
}

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
  // \ub300\uae30\uc2e4 \ubaa8\ub378 (\ub300\uae30\uc2e4 \u2460\u00b7\u2461\u00b7\u2462) \u2014 \uc77c\uc2dc\uc815\uc9c0\ub294 dialogs.jsx\uc758 E6Paused\ub85c \ubd84\ub9ac
  C1RoomBefore, C1RoomAfterTutorial, C1RoomEnded, C1TeamRoom,
  // \uacfc\uac70 \uba85\uce6d \ud638\ud658 \u2014 \uce94\ubc84\uc2a4 \uad6c\uc131\uc6d0\uc774 \uc544\uc9c1 \uc774\uc804 \uc774\ub984\uc73c\ub85c \ubd80\ub97c \uc218 \uc788\uc74c
  C1Waiting, C1Ended,
  C2Tutorial, C3PersonalCoding, C4TeamCanvas,
  OpenCodeShell, JitdaToolbar, ParticipantCanvasActions,
  // MOCK \ud300 \ubcc0\ud615 \u2014 viewer edge case \ub4f1\ub85d\uc6a9
  MOCK_TEAM_STANDARD, MOCK_TEAM_LONG_NAME, MOCK_TEAM_MANY_MEMBERS,
});
