/* B. 운영자 영역 — 팀 정보 + 상태 제어만 (튜토리얼/시작/일시정지/종료)
   · GNB(AppHeader)는 모든 운영자 화면에서 동일
   · 팀 리스트는 한 화면에 더 많이 보이도록 컴팩트 그리드 */

const OPERATOR_USER = { name: '박운영', email: 'park.unyoung@enk.kr', initial: '박' };
const HACKATHON_NAME = '2026 봄 ENK 해커톤';

// ── B-1. 해커톤 목록 ──────────────────────────────────────────
// 5상태 단방향 모델 적용 (페이지 정의서 v23848e86 · 2026-05-26: tutorial_ended 폐기, hackathon_waiting으로 통합)
function B1HackathonList() {
  const hackathons = [
  { name: '2026 봄 ENK 해커톤', org: '서울대학교 컴퓨터공학부', status: 'tutorial_waiting', teams: { multi: 8, solo: 0 }, claimed: 0, total: 240, runtime: '튜토리얼 시작 전' },
  { name: '소공포팩토리 11기 데모데이', org: '소프트웨어공작소', status: 'tutorial_running', teams: { multi: 6, solo: 12 }, claimed: 184, total: 196, runtime: '튜토리얼 42분 경과' },
  { name: '강서구 청소년 해커톤', org: '강서교육지원청', status: 'hackathon_running', teams: { multi: 10, solo: 8 }, claimed: 116, total: 122, runtime: '본행사 2시간 18분 경과' },
  { name: '엔지니어 부트캠프 8기', org: 'ENK 아카데미', status: 'hackathon_running', paused: true, teams: { multi: 10, solo: 0 }, claimed: 78, total: 80, runtime: '8분째 일시정지 중' },
  { name: '2025 겨울 해커톤 결선', org: '한국정보과학회', status: 'hackathon_ended', teams: { multi: 12, solo: 0 }, claimed: 156, total: 156, runtime: '종료 · 1주 전' },
  { name: 'KU x ENK 연합 해커톤', org: '고려대학교 SW중심대학사업단', status: 'hackathon_waiting', teams: { multi: 6, solo: 24 }, claimed: 0, total: 180, runtime: '튜토리얼 없이 시작 예정' }];


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      {/* B-1 목록: 아직 특정 해커톤 진입 전 → breadcrumb 없음 (로고만) */}
      <AppHeader user={OPERATOR_USER} />

      <div style={{ flex: 1, padding: '28px 40px', overflow: 'auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div className="jt-eyebrow" style={{ marginBottom: 6 }}>운영하는 해커톤</div>
          <h1 style={{ fontSize: 28 }}>박운영님이 맡은 해커톤 6건</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--c-slate)', marginRight: 4 }}>단계</span>
          <button className="jt-btn jt-btn-sm jt-btn-primary">전체 6</button>
          <button className="jt-btn jt-btn-sm jt-btn-secondary">튜토리얼 대기 1</button>
          <button className="jt-btn jt-btn-sm jt-btn-secondary">튜토리얼 진행 1</button>
          <button className="jt-btn jt-btn-sm jt-btn-secondary">해커톤 대기 1</button>
          <button className="jt-btn jt-btn-sm jt-btn-secondary">해커톤 진행 2</button>
          <button className="jt-btn jt-btn-sm jt-btn-secondary">해커톤 종료 1</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {hackathons.map((h, i) => <HackathonCard key={i} h={h} />)}
        </div>
      </div>
    </div>);

}

function HackathonCard({ h }) {
  const teamCount = h.teams.multi + h.teams.solo;
  const isPending = h.status === 'tutorial_waiting' || h.status === 'hackathon_waiting';
  const cta = h.status === 'hackathon_ended' ? '결과 보기' : '입장';

  return (
    <div data-action="open" role="button" tabIndex={0} className="jt-card-interactive" style={{
      background: 'var(--c-canvas)',
      border: '1px solid var(--c-hairline)',
      borderRadius: 'var(--r-md)',
      padding: 18,
      display: 'flex', flexDirection: 'column', gap: 10,
      minHeight: 160,
      opacity: h.status === 'hackathon_ended' ? 0.78 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <StatusPill status={h.status} paused={h.paused} />
        {h.runtime &&
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)' }}>{h.runtime}</span>
        }
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{h.name}</div>
        <div style={{ fontSize: 12, color: 'var(--c-slate)' }}>{h.org}</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{
        paddingTop: 12, borderTop: '1px dashed var(--c-hairline)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)'
      }}>
        <span>{teamCount}팀 · {isPending ? `총 ${h.total}명` : `접속 ${h.claimed}/${h.total}`}</span>
        <span style={{ color: 'var(--c-ink)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          {cta} {Icon.arrowRight(11)}
        </span>
      </div>
    </div>);

}

// ── B-1 빈 상태 ──────────────────────────────────────────────
function B1Empty() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      {/* B-1 빈 상태: 아직 특정 해커톤 진입 전 → breadcrumb 없음 (로고만) */}
      <AppHeader user={{ name: '김신규', email: 'kim.newop@school.go.kr', initial: '김' }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{
          maxWidth: 460,
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-hairline)',
          borderRadius: 10,
          padding: '40px 36px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'var(--c-stone)', color: 'var(--c-ink-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18
          }}>{Icon.users(22)}</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>아직 배정된 해커톤이 없어요</h2>
          <p style={{ fontSize: 13.5, color: 'var(--c-slate)', lineHeight: 1.6 }}>
            관리자가 이 계정을 해커톤 운영자로 배정하면<br />이 자리에 카드가 나타납니다.
          </p>
        </div>
      </div>
    </div>);

}

// ── 샘플 데이터 ───────────────────────────────────────────────
// 30팀 시나리오 — 학교 해커톤 표준 규모 (예: 60팀 행사의 절반).
// 다인팀 21팀 + 1인팀 9팀 = 30팀.
// 한 페이지에 12팀씩 노출 (3페이지 — 마지막 페이지 6팀).
const PENDING_TEAMS = [
// 페이지 1 (1–12)
{ name: '터미널 사파리', members: [['김민준', 'on'], ['이서윤', 'on'], ['박지호', 'on'], ['최유나', 'on']] },
{ name: '커널 패닉', members: [['정도현', 'on'], ['한예린', 'on'], ['오태웅', 'off']] },
{ name: '404 NOT FOUND', members: [['강수아', 'on'], ['윤재현', 'off'], ['임소영', 'on'], ['서지훈', 'pending']] },
{ name: 'JS의 비밀', members: [['백하늘', 'on'], ['문가람', 'on']] },
{ name: '코드밍아웃', members: [['조하준', 'on'], ['신예슬', 'on'], ['양준호', 'on'], ['구지원', 'on']] },
{ name: 'undefined', members: [['안소민', 'on'], ['권태성', 'on'], ['진하영', 'off']] },
{ name: '디버그 라이프', members: [['오민서', 'on'], ['남기범', 'on'], ['고지원', 'on'], ['배도윤', 'off']] },
{ name: 'await me', members: [['차은우', 'on'], ['주현지', 'off'], ['홍수민', 'on']] },
{ name: 'null pointer', members: [['편서준', 'on'], ['도경호', 'on'], ['금나래', 'on']] },
{ name: '세그폴트 어택', members: [['장은채', 'on'], ['우다현', 'on'], ['표지민', 'off'], ['반지호', 'on']] },
{ name: '시맨틱 메모리', members: [['천유주', 'on'], ['황민찬', 'on'], ['하예성', 'on']] },
{ name: '머지 컨플릭트', members: [['지수아', 'on'], ['엄재민', 'off']] },
// 페이지 2 (13–24)
{ name: '스택 오버플로우', members: [['형지율', 'on'], ['선우진', 'on'], ['민예나', 'on'], ['도재훈', 'on']] },
{ name: '캐시 미스', members: [['연하은', 'off'], ['추서연', 'on'], ['진민호', 'on']] },
{ name: '레이스 컨디션', members: [['빈도윤', 'on'], ['소예준', 'on']] },
{ name: '엣지 케이스', members: [['독고나윤', 'on'], ['남궁세빈', 'on'], ['갈주아', 'off'], ['로희원', 'on']] },
{ name: '런타임 에러', members: [['묵서린', 'on'], ['공태우', 'on'], ['승하린', 'on']] },
{ name: '비트 플립', members: [['단지호', 'on'], ['철민서', 'on']] },
{ name: '뉴럴 네트', members: [['옹예진', 'off'], ['모서윤', 'on'], ['편나라', 'on'], ['표현우', 'on']] },
{ name: '훅 라이프', members: [['승하준', 'on'], ['시아윤', 'on'], ['초은비', 'off']] },
{ name: '바이브 코더', members: [['단우진', 'on'], ['두지유', 'on']] },
// 엣지 케이스 샘플 — 긴 팀명(ellipsis 검증) · 다인팀 6명(아바타 행 밀도 검증)
{ name: '엔드투엔드 인터랙션 테스트 마스터즈', members: [['강현우', 'on'], ['민지우', 'on'], ['윤다인', 'off'], ['차서윤', 'on']] },
{ name: '데이터 파이프라인 크루', members: [['김도윤', 'on'], ['이수아', 'on'], ['박재현', 'on'], ['최예린', 'off'], ['정하늘', 'on'], ['한서준', 'on'], ['오민채', 'pending']] },
// 1인팀 (페이지 2 후반 + 페이지 3)
{ name: '개인 · 노유진', members: [['노유진', 'on']], solo: true },
{ name: '개인 · 류재석', members: [['류재석', 'off']], solo: true },
{ name: '개인 · 손미래', members: [['손미래', 'on']], solo: true },
// 페이지 3 (25–30)
{ name: '개인 · 진하경', members: [['진하경', 'on']], solo: true },
{ name: '개인 · 우시현', members: [['우시현', 'on']], solo: true },
{ name: '개인 · 천도현', members: [['천도현', 'off']], solo: true },
{ name: '개인 · 백서아', members: [['백서아', 'on']], solo: true },
{ name: '개인 · 명도윤', members: [['명도윤', 'on']], solo: true },
{ name: '개인 · 황태리', members: [['황태리', 'off']], solo: true }];


// 진행 상태: 활동 정보만 (30팀 — published는 운영 중 자발 공개 분포 다양화).
// activity 분포: active 18 / idle 9 / paused 3.
const STARTED_TEAMS = [
// 페이지 1 (1–12)
{ name: '터미널 사파리', members: 4, activity: 'active', last: '방금', published: true },
{ name: '커널 패닉', members: 3, activity: 'active', last: '12초 전', published: false },
{ name: '404 NOT FOUND', members: 4, activity: 'idle', last: '4분 전', published: false },
{ name: 'JS의 비밀', members: 2, activity: 'active', last: '1분 전', published: true },
{ name: '코드밍아웃', members: 4, activity: 'paused', last: '23분 전', published: false },
{ name: 'undefined', members: 3, activity: 'active', last: '2분 전', published: true },
{ name: '디버그 라이프', members: 4, activity: 'active', last: '15초 전', published: false },
{ name: 'await me', members: 3, activity: 'idle', last: '7분 전', published: true },
{ name: 'null pointer', members: 3, activity: 'active', last: '30초 전', published: false },
{ name: '세그폴트 어택', members: 4, activity: 'active', last: '방금', published: true },
{ name: '시맨틱 메모리', members: 3, activity: 'idle', last: '6분 전', published: false },
{ name: '머지 컨플릭트', members: 2, activity: 'active', last: '40초 전', published: true },
// 페이지 2 (13–24)
{ name: '스택 오버플로우', members: 4, activity: 'active', last: '방금', published: false },
{ name: '캐시 미스', members: 3, activity: 'paused', last: '18분 전', published: false },
{ name: '레이스 컨디션', members: 2, activity: 'active', last: '1분 전', published: true },
{ name: '엣지 케이스', members: 4, activity: 'idle', last: '5분 전', published: true },
{ name: '런타임 에러', members: 3, activity: 'active', last: '방금', published: false },
{ name: '비트 플립', members: 2, activity: 'active', last: '20초 전', published: true },
{ name: '뉴럴 네트', members: 4, activity: 'idle', last: '8분 전', published: false },
{ name: '훅 라이프', members: 3, activity: 'active', last: '50초 전', published: true },
{ name: '바이브 코더', members: 2, activity: 'active', last: '방금', published: true },
{ name: '개인 · 노유진', members: 1, solo: true, activity: 'active', last: '방금', published: true },
{ name: '개인 · 류재석', members: 1, solo: true, activity: 'idle', last: '5분 전', published: false },
{ name: '개인 · 손미래', members: 1, solo: true, activity: 'active', last: '방금', published: true },
// 페이지 3 (25–30)
{ name: '개인 · 진하경', members: 1, solo: true, activity: 'active', last: '1분 전', published: false },
{ name: '개인 · 우시현', members: 1, solo: true, activity: 'paused', last: '14분 전', published: false },
{ name: '개인 · 천도현', members: 1, solo: true, activity: 'idle', last: '9분 전', published: true },
{ name: '개인 · 백서아', members: 1, solo: true, activity: 'active', last: '방금', published: true },
{ name: '개인 · 명도윤', members: 1, solo: true, activity: 'idle', last: '6분 전', published: false },
{ name: '개인 · 황태리', members: 1, solo: true, activity: 'active', last: '30초 전', published: true }];


// ── B-2. 대시보드 (튜토리얼 대기) ──────────────────────────
// runtime은 진행 중인 단계에서만 핵심 1줄로 표시. 대기·종료 상태는 stage strip이 맥락 전달.
function B2DashboardTutorialWaiting() {
  return <DashboardShell status="tutorial_waiting" teams={PENDING_TEAMS} mode="roster" />;
}

// ── B-2. 대시보드 (튜토리얼 진행) ──────────────────────────
function B2DashboardTutorialRunning() {
  return <DashboardShell status="tutorial_running" runtime="00:23:00 경과" teams={STARTED_TEAMS} mode="tutorial-progress" live />;
}

// ── B-2. 대시보드 (해커톤 진행) ────────────────────────────
function B2DashboardStarted() {
  return <DashboardShell status="hackathon_running" runtime="02:47:12 경과" teams={STARTED_TEAMS} mode="activity" live />;
}

// ── B-2. 대시보드 (일시정지) ───────────────────────────────
function B2DashboardPaused() {
  return <DashboardShell status="hackathon_running" paused runtime="8분 경과" teams={STARTED_TEAMS} mode="activity" />;
}

// ── B-2. 대시보드 (해커톤 종료) ────────────────────────────
function B2DashboardEnded() {
  return <DashboardShell status="hackathon_ended" teams={STARTED_TEAMS} mode="summary" />;
}

// ── 대시보드 공통 셸 ──────────────────────────────────────────
// page/perPage: 팀 그리드 페이지네이션 (기본 1페이지). perPage 기본값은 mode에 따라 분기:
//   · roster (팀명 + 22px 성씨 미니 아바타, 압축 카드 ~60px 높이) → 60팀/페이지, 6열×10행
//   · tutorial-progress / activity / summary (썸네일 카드 ~210px) → 12팀/페이지, 4열×3행
// 60팀 행사 1페이지 노출. 30팀 mock은 totalTeams <= perPage라 RosterView에서 페이지네이션 숨김.
// 호출부에서 perPage 명시 시 우선. sticky 헤더의 상태 제어·접속 합계는 전체 teams 기준.
function DashboardShell({ status, paused, runtime, teams, mode, live, page = 1, perPage }) {
  const effectivePerPage = perPage ?? (mode === 'roster' ? 60 : 12);
  // 5상태별 제어 버튼: 좌측 약한 보조 / 우측 강한 Primary로 위치 분리
  // 종료(비가역)는 별도 그룹의 우측 끝 Danger Outlined로 약하게 배치
  const statusActions = {
    tutorial_waiting:
    <>
        {/* 좌측 약한 텍스트 링크 — 튜토리얼 건너뛰기 (UX 리뷰: 텍스트 링크 + 경고 모달) */}
        <a data-action="skip" style={{
        fontSize: 12.5, color: 'var(--c-slate)', textDecoration: 'underline', textUnderlineOffset: 3,
        cursor: 'pointer', marginRight: 8
      }}>
          바로 해커톤 시작하기
        </a>
        <button data-action="start" className="jt-btn jt-btn-critical" style={{ padding: '10px 18px', fontSize: 14 }}>
          {Icon.play(13)} 튜토리얼 시작
        </button>
      </>,

    tutorial_running:
    <>
        <button className="jt-btn jt-btn-secondary">{Icon.pause(12)} 일시정지</button>
        <button data-action="end-tutorial" className="jt-btn jt-btn-primary">
          튜토리얼 종료
        </button>
      </>,

    hackathon_waiting:
    <>
        <button data-action="start-hackathon" className="jt-btn jt-btn-critical">
          {Icon.play(13)} 해커톤 시작
        </button>
      </>,

    hackathon_running: paused ?
    <>
        <button data-action="resume" className="jt-btn jt-btn-primary">
          {Icon.play(13)} 재시작
        </button>
        <span style={{ width: 24 }} />
        <button data-action="end" className="jt-btn jt-btn-danger-outlined">{Icon.stop(11)} 종료</button>
      </> :

    <>
        {/* 일시정지: 좌측 Primary */}
        <button data-action="pause" className="jt-btn jt-btn-primary">
          {Icon.pause(13)} 일시정지
        </button>
        {/* 위치 분리: 종료는 우측 끝 Danger Outlined — 실수 방지(강조는 size가 아닌 outline/color로).
            sticky 헤더 룰: 모든 액션 버튼 동일 MD 높이 유지 (시각 리듬 일관). */}
        <span style={{ width: 24 }} />
        <button data-action="end" className="jt-btn jt-btn-danger-outlined">
          {Icon.stop(11)} 종료
        </button>
      </>,

    hackathon_ended: null

  }[status];

  const multiCount = teams.filter((t) => !t.solo).length;
  const soloCount = teams.filter((t) => t.solo).length;
  const claimed = mode === 'roster' ?
  teams.reduce((sum, t) => sum + t.members.filter((m) => m[1] === 'on').length, 0) :
  teams.reduce((sum, t) => sum + (t.members === 1 || t.activity === 'paused' ? 0 : t.members), 0);
  const total = mode === 'roster' ?
  teams.reduce((sum, t) => sum + t.members.length, 0) :
  teams.reduce((sum, t) => sum + (typeof t.members === 'number' ? t.members : 0), 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      {/* B-2 대시보드: 특정 해커톤 진입 상태 → 해커톤명만 노출 ("해커톤" 접두사 없음) */}
      <AppHeader breadcrumb={[HACKATHON_NAME]} user={OPERATOR_USER} />

      {/* 상시 고정 스티키 헤더 — 단일 행, 최소 높이.
            타이틀 좌측 / 세로 바 우측에 상태·런타임·접속 현황 한 행 배치 */}
      <div style={{
        flex: '0 0 auto',
        background: 'var(--c-canvas)',
        borderBottom: '1px solid var(--c-hairline)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 14,
        height: 52
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{HACKATHON_NAME}</h2>

        <div style={{
          paddingLeft: 14, marginLeft: 2,
          borderLeft: '1px solid var(--c-hairline)',
          alignSelf: 'stretch',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <StatusPill status={status} paused={paused} />
          {runtime &&
          <span style={{ fontSize: 12, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{runtime}</span>
          }
          <span style={{ color: 'var(--c-hairline-strong)' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
            <span className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>접속</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>
              {claimed}<span style={{ color: 'var(--c-muted)', fontSize: 12 }}>/{total}</span>
            </span>
          </span>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{statusActions}</div>
      </div>

      {/* 5단계 전이 인디케이터 (얇은 가로 progress) */}
      <StageStrip status={status} paused={paused} />

      {(() => {
        const pagedTeams = teams.slice((page - 1) * effectivePerPage, page * effectivePerPage);
        const totalTeams = teams.length;
        const prevDisabled = page === 1;
        const nextDisabled = page * effectivePerPage >= totalTeams;
        const pageProps = { pagedTeams, totalTeams, page, perPage: effectivePerPage, prevDisabled, nextDisabled };
        return (
          <div style={{ flex: 1, padding: '20px 32px', overflow: 'auto' }}>
            {mode === 'roster' && <RosterView teams={teams} live={live} multiCount={multiCount} soloCount={soloCount} {...pageProps} />}
            {mode === 'tutorial-progress' && <TutorialProgressView teams={teams} live={live} {...pageProps} />}
            {mode === 'activity' && <ActivityView teams={teams} live={live} multiCount={multiCount} soloCount={soloCount} paused={paused} {...pageProps} />}
            {mode === 'summary' && <SummaryView teams={teams} {...pageProps} />}
          </div>
        );
      })()}
    </div>);

}

// ── 5단계 전이 인디케이터 ────────────────────────────────────
// 모든 칩은 동일한 모양·패딩·radius로 통일. 현재 단계만 외부 인코딩(StatusPill과 동일 색계열).
// 지난 단계는 옅은 stone, 미래 단계는 outlined.
// 2026-05-26: ③ tutorial_ended 폐기 — [튜토리얼 종료] 클릭 시 즉시 ④ 해커톤 대기로 전이.
function StageStrip({ status, paused }) {
  const stages = [
  { id: 'tutorial_waiting', label: '튜토리얼 대기', on: { bg: '#ebebec', fg: '#2a2823' } },
  { id: 'tutorial_running', label: '튜토리얼 진행', on: { bg: '#e1e0fa', fg: '#2e2c8a' } },
  { id: 'hackathon_waiting', label: '해커톤 대기', on: { bg: '#ebebec', fg: '#2a2823' } },
  { id: 'hackathon_running', label: '해커톤 진행', on: { bg: 'var(--c-mint-soft)', fg: 'var(--c-mint)' } },
  { id: 'hackathon_ended', label: '해커톤 종료', on: { bg: '#ffe1de', fg: '#882019' } }];

  const currentIdx = stages.findIndex((s) => s.id === status);
  // 통일된 칩 베이스 (모양·패딩·radius·폰트 동일)
  const chipBase = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 9px',
    borderRadius: 4,
    fontSize: 10.5,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.02em',
    lineHeight: 1.2,
    border: '1px solid transparent'
  };
  return (
    <div style={{
      flex: '0 0 auto',
      background: 'var(--c-paper)',
      borderBottom: '1px solid var(--c-hairline)',
      padding: '8px 32px',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5, color: 'var(--c-muted)'
    }}>
      <span style={{ letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: 8 }}>PHASE</span>
      {stages.map((s, i) => {
        const isCurrent = i === currentIdx;
        const isPast = i < currentIdx;
        const chipStyle = isCurrent ?
        { ...chipBase, background: s.on.bg, color: s.on.fg, fontWeight: 700, borderColor: s.on.fg, borderWidth: 1 } :
        isPast ?
        { ...chipBase, background: 'var(--c-stone)', color: 'var(--c-slate)', fontWeight: 500 } :
        { ...chipBase, background: 'transparent', color: 'var(--c-muted)', borderColor: 'var(--c-hairline-strong)', fontWeight: 500 };
        return (
          <React.Fragment key={s.id}>
            <span style={chipStyle}>
              <span style={{ opacity: 0.55 }}>{String(i + 1).padStart(2, '0')}</span>
              {s.label}
              {s.auto && isCurrent && <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 2 }}>· AUTO</span>}
            </span>
            {i < stages.length - 1 && <span style={{ color: 'var(--c-hairline-strong)' }}>›</span>}
          </React.Fragment>);

      })}
      {paused &&
      <>
          <span style={{ flex: 1 }} />
          <span style={{ ...chipBase, background: 'var(--c-amber-soft)', color: 'var(--c-amber)', fontWeight: 700, borderColor: 'var(--c-amber)' }}>
            ⏸ 일시정지 중
          </span>
        </>
      }
    </div>);

}

// ── 상태별 뷰 ─────────────────────────────────────────────────
function RosterView({ teams, live, multiCount, soloCount, pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
  // 60팀/페이지 (6열 × 10행). 압축 카드(이름→도트)로 60팀 행사 1페이지 노출.
  // [전체] / [미접속] 필터 칩 — 운영자 실제 task("누가 안 들어왔지?")가 1초 안에 해결.
  // 정적 mock에선 '전체' 칩 활성 — 실제 앱에서는 클릭 시 pagedTeams가 미접속만으로 필터링.
  const offlineCount = teams.reduce((n, t) => n + (t.members.some((m) => m[1] !== 'on') ? 1 : 0), 0);
  const filterChips = [
    { id: 'all', label: '전체', count: totalTeams, active: true },
    { id: 'offline', label: '미접속', count: offlineCount, active: false }];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 16, lineHeight: 1.2, margin: 0 }}>참가자 접속 현황</h3>
          <span style={{ fontSize: 12.5, color: 'var(--c-slate)' }}>
            {totalTeams}팀
            <> · <span style={{ color: 'var(--c-mint)' }}>● 실시간</span></>
            <> · <span style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>방금 갱신</span></>
          </span>
          {/* 새로고침 — 실시간(WebSocket) 외 강제 수동 갱신. 연결 끊김·지연 대응 */}
          <button
            data-action="refresh-roster"
            title="새로고침"
            className="jt-btn jt-btn-ghost jt-btn-sm"
            style={{ padding: '4px 6px', minHeight: 0, lineHeight: 1, color: 'var(--c-slate)' }}>

            {Icon.refresh(13)}
          </button>
        </div>
        <span
          title="해커톤이 시작되면 팀을 절대 변경할 수 없습니다.\n시작 전 팀 변경이 필요하면 짓다에 문의해주세요."
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--c-muted)', cursor: 'help',
            padding: '2px 8px', borderRadius: 999,
            border: '1px solid var(--c-hairline)',
            fontSize: 11, lineHeight: 1
          }}>

          {Icon.info(12)}
          <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>팀 변경 요청</span>
        </span>
      </div>

      {/* 필터 칩 — tutorial-progress의 stepChips 동일 패턴. 활성=ink bg, 비활성=canvas outline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--c-slate)', marginRight: 4 }}>접속 상태</span>
        {filterChips.map((c) =>
        <button key={c.id} data-action={`filter-${c.id}`} className={`jt-btn jt-btn-sm ${c.active ? 'jt-btn-primary' : 'jt-btn-secondary'}`} aria-pressed={c.active}>
            {c.label} <span style={{
            marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 11,
            opacity: c.active ? 0.7 : 0.55
          }}>{c.count}</span>
          </button>
        )}
      </div>

      <RosterGrid teams={pagedTeams} />
      {totalTeams > perPage &&
      <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
      }
    </>);

}

function TutorialProgressView({ teams, live, pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
  // 30팀 기준 분포: 완료 20 / 진행 7 / 미시작 3 (기존 8/3/1 비율 보존).
  // 진행 7팀은 Step 1=3, Step 2=2, Step 3=2로 분포 가정.
  const completed = 20;
  const inProgress = 7;
  const notStarted = 3;
  const stepCounts = { step1: 3, step2: 2, step3: 2 };

  // 팀별 현재 Step 매핑 (정적 mock — i 인덱스 기반 분포).
  // i: 0–19 완료 / 20–22 Step1 / 23–24 Step2 / 25–26 Step3 / 27–29 미시작.
  const tutorialTeams = teams.map((t, i) => {
    let step;
    if (i < 20) step = 'done';
    else if (i < 23) step = 'step1';
    else if (i < 25) step = 'step2';
    else if (i < 27) step = 'step3';
    else step = 'not-started';
    return { ...t, step };
  });

  // 현재 페이지에 표시할 팀(인덱스 기반 step 분포가 페이지 슬라이싱에서 깨지지 않도록
  // tutorialTeams 전체에서 슬라이싱).
  const pagedTutorialTeams = tutorialTeams.slice((page - 1) * perPage, page * perPage);

  // Step 필터 칩 — 필터 적용 시 페이지네이션 total은 필터 결과 수로 동적 갱신해야 함
  // (정적 mock에서는 기본 노출이 '전체' 필터이므로 total = totalTeams).
  const stepChips = [
  { id: 'all', label: '전체', count: totalTeams, active: true },
  { id: 'step1', label: 'Step 1 · 기획', count: stepCounts.step1 },
  { id: 'step2', label: 'Step 2 · 기능 추가', count: stepCounts.step2 },
  { id: 'step3', label: 'Step 3 · 다듬기', count: stepCounts.step3 },
  { id: 'done', label: '완료', count: completed },
  { id: 'not-started', label: '미시작', count: notStarted }];


  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h3 style={{ fontSize: 16 }}>튜토리얼 진행률</h3>
          <span style={{ fontSize: 12.5, color: 'var(--c-slate)' }}>
            완료 {completed} · 진행 {inProgress} · 미시작 {notStarted}
            <span style={{ color: 'var(--c-muted)', marginLeft: 6, fontSize: 11 }}>(전체 {totalTeams}팀 기준)</span>
            {live && <> · <span style={{ color: 'var(--c-mint)' }}>● 실시간</span></>}
          </span>
        </div>
      </div>

      {/* 진행률 바 — 흰 박스 래퍼 없이 그대로. 완료/진행/미시작 비율만 시각화. */}
      <div style={{
        display: 'flex', height: 32, borderRadius: 4, overflow: 'hidden',
        border: '1px solid var(--c-hairline)',
        marginBottom: 22
      }}>
        <div style={{ flex: completed, background: 'var(--c-mint)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{completed}팀 완료</div>
        <div style={{ flex: inProgress, background: 'var(--c-tutorial)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{inProgress}팀 진행</div>
        <div style={{ flex: notStarted, background: 'var(--c-stone-2)', color: 'var(--c-ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{notStarted}팀 미시작</div>
      </div>

      {/* Step 필터 탭 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: 12, color: 'var(--c-slate)', marginRight: 4 }}>Step별 보기</span>
        {stepChips.map((c) =>
        <button key={c.id} className={`jt-btn jt-btn-sm ${c.active ? 'jt-btn-primary' : 'jt-btn-secondary'}`} aria-pressed={c.active}>
            {c.label} <span style={{
            marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 11,
            opacity: c.active ? 0.7 : 0.55
          }}>{c.count}</span>
          </button>
        )}
      </div>

      <TutorialTeamGrid teams={pagedTutorialTeams} />
      <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
    </>);

}

// ── 튜토리얼 팀 그리드 ────────────────────────────────────────
function TutorialTeamGrid({ teams }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
      {teams.map((t, i) => <TutorialTeamRow key={i} t={t} />)}
    </div>);

}

// 공용 프로젝트 매핑 — 팀명 → 대집 프로젝트 제목. 래퀴한 색상 hue 생성에도 쓰임.
const TEAM_PROJECTS = {
  '터미널 사파리': '방과후 출석부',
  '커널 패닉': '동아리 모집공고 보드',
  '404 NOT FOUND': '재활용 분리 가이드',
  'JS의 비밀': '진로 검사 결과 정리',
  '코드밍아웃': '학교 행사 캘린더',
  'undefined': '교내 분실물 게시판',
  '디버그 라이프': '점심 메뉴 추천기',
  'await me': '봉사활동 시간 합산기',
  'null pointer': '시간표 자동 생성',
  '세그폴트 어택': '학급 좌석 배치도',
  '시맨틱 메모리': '단어 시험 만들기',
  '머지 컨플릭트': '조별 발표 순서 추첨',
  '스택 오버플로우': '수행평가 일정표',
  '캐시 미스': '학생회 공약 게시판',
  '레이스 컨디션': '운동회 점수판',
  '엣지 케이스': '학급 시간표 메모',
  '런타임 에러': '교실 청소 당번 룰렛',
  '비트 플립': '쉬는시간 미니게임',
  '뉴럴 네트': '교과서 단원 요약기',
  '훅 라이프': '동아리 일지 작성기',
  '바이브 코더': '진로 멘토 매칭 폼',
  '개인 · 노유진': '나만의 영단어장',
  '개인 · 류재석': '운동 기록 일지',
  '개인 · 손미래': '독서록 자동 요약',
  '개인 · 진하경': '하루 명언 카드',
  '개인 · 우시현': '간단 가계부',
  '개인 · 천도현': '습관 트래커',
  '개인 · 백서아': '오답노트 정리',
  '개인 · 명도윤': '봉사활동 매칭',
  '개인 · 황태리': '학교 행사 알림'
};
function teamHue(name) {return name.length * 47 % 360;}

// ── 공용 라이브 미리보기 썸네일 ─────────────────────
// badge: 'published' | 'private' | 'auto-public' | 'tutorial' | null — 우상단에 표시할 상태
function LivePreview({ teamName, live, badge = 'private' }) {
  const project = TEAM_PROJECTS[teamName] || '프로젝트 준비 중';
  const hue = teamHue(teamName);
  const badgeMap = {
    'published':    { label: '공개',       bg: 'var(--c-mint)',           fg: '#fff' },
    'private':      { label: '비공개',     bg: 'rgba(20,19,15,0.78)',     fg: '#fff' },
    'auto-public':  { label: '종료 공개',  bg: 'var(--c-mint)',           fg: '#fff' },
    'tutorial':     { label: '튜토리얼',     bg: 'var(--c-tutorial)',       fg: '#fff' },
  };
  const b = badgeMap[badge];
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '16 / 10',
      background: `linear-gradient(135deg, oklch(0.86 0.04 ${hue}) 0%, oklch(0.78 0.05 ${hue + 30}) 100%)`,
      backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 12px), linear-gradient(135deg, oklch(0.86 0.04 ${hue}) 0%, oklch(0.78 0.05 ${hue + 30}) 100%)`,
      borderBottom: '1px solid var(--c-hairline)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 8,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <div style={{ fontSize: 9.5, color: '#3a3a3a', fontWeight: 700, letterSpacing: '-0.01em' }}>{project}</div>
        <div style={{ height: 4, width: '70%', background: 'rgba(20,19,15,0.18)', borderRadius: 1 }} />
        <div style={{ height: 4, width: '55%', background: 'rgba(20,19,15,0.12)', borderRadius: 1 }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ width: 14, height: 14, background: `oklch(0.65 0.12 ${hue})`, borderRadius: 2 }} />
          <div style={{ width: 14, height: 14, background: 'rgba(20,19,15,0.12)', borderRadius: 2 }} />
          <div style={{ width: 14, height: 14, background: 'rgba(20,19,15,0.08)', borderRadius: 2 }} />
        </div>
      </div>
      {b &&
      <span style={{
        position: 'absolute', top: 6, right: 6,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 9, fontFamily: 'var(--font-mono)',
        padding: '2px 6px', borderRadius: 2,
        background: b.bg, color: b.fg,
        letterSpacing: '0.06em', fontWeight: 700
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', opacity: 0.85 }} />
        {b.label}
      </span>
      }
      {live &&
      <span style={{
        position: 'absolute', top: 6, left: 6,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 9, fontFamily: 'var(--font-mono)',
        padding: '2px 6px', borderRadius: 2,
        background: 'rgba(255,255,255,0.92)', color: 'var(--c-mint)',
        letterSpacing: '0.04em', fontWeight: 700
      }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
          LIVE
        </span>
      }
    </div>);

}

function TutorialTeamRow({ t }) {
  const stepMap = {
    'step1': { label: 'Step 1 · 기획',     bg: 'var(--c-tutorial-soft)', fg: 'var(--c-tutorial)' },
    'step2': { label: 'Step 2 · 기능 추가', bg: 'var(--c-tutorial-soft)', fg: 'var(--c-tutorial)' },
    'step3': { label: 'Step 3 · 다듬기',    bg: 'var(--c-tutorial-soft)', fg: 'var(--c-tutorial)' },
    'done':        { label: '완료',   bg: 'var(--c-mint-soft)', fg: 'var(--c-mint)' },
    'not-started': { label: '미시작', bg: 'var(--c-stone)',     fg: 'var(--c-slate)' }
  };
  const s = stepMap[t.step] || stepMap['not-started'];

  // 갤러리 카드와 동일 셸 사용 (ProjectCard 공용). dataAction 부여로 .jt-card-interactive 활성.
  return (
    <ProjectCard
      dataAction="open-team"
      thumb={<LivePreview teamName={t.name} live={t.step !== 'not-started' && t.step !== 'done'} badge="tutorial" />}
      title={t.name}
      subtitle={<>튜토리얼 <span style={{ color: 'var(--c-hairline-strong)', margin: '0 2px' }}>·</span> <span className="jt-mono" style={{ fontSize: 11 }}>{t.members}명</span></>}
      primaryMeta={
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 3,
          background: s.bg, color: s.fg,
          fontSize: 10.5, fontWeight: 700,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
        }}>{s.label}</span>
      }
    />
  );
}

function ActivityView({ teams, live, multiCount, soloCount, paused, pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
  return (
    <>
      {paused &&
      <div style={{
        background: 'var(--c-amber-soft)', border: '1px solid var(--c-helmet-deep)',
        borderRadius: 'var(--r-sm)', padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 13, color: 'var(--c-amber)'
      }}>
          <span style={{ flexShrink: 0 }}>{Icon.warn(16)}</span>
          <div style={{ flex: 1, lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--c-ink)' }}>해커톤이 일시정지되었어요.</strong>
            <br />
            참가자들은 "작업이 그대로 보존됩니다" 안내를 보고 있어요.
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink-3)' }}>08:42 경과</span>
        </div>
      }
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h3 style={{ fontSize: 16 }}>팀 활동 현황</h3>
          <span style={{ fontSize: 12.5, color: 'var(--c-slate)' }}>
            {totalTeams}팀
            {live && <> · <span style={{ color: 'var(--c-mint)' }}>● 실시간</span></>}
          </span>
        </div>
      </div>
      <ActivityGrid teams={pagedTeams} />
      <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
    </>);

}

function SummaryView({ teams, pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
  // 30팀 기준 통계. 좋아요 카운트는 12팀(142) 비례 — 30/12 × 142 ≈ 355.
  return (
    <>
      {/* 결과 요약 — 짓다는 "제출" 개념이 없다. 종료 시 자동으로 갤러리에 전원 공개되므로
            "제출 프로젝트"·"갤러리 공개" 수치는 의미 없음. 핵심 지표만 유지. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
        { label: '참가팀', value: `${totalTeams}팀`, sub: `${totalTeams}개 프로젝트` },
        { label: '운영 시간', value: '04:20', sub: '실 작업 03:48 · 일시정지 0:32' },
        { label: '갤러리 좋아요', value: '355', sub: `${totalTeams}개 프로젝트 전원 공개됨` }].
        map((s, i) =>
        <div key={i} style={{
          background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
          borderRadius: 8, padding: 16
        }}>
            <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--c-ink)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--c-slate)' }}>{s.sub}</div>
          </div>
        )}
      </div>

      {/* 갤러리 유도 CTA — "제출" 대신 "결과물" 표현 */}
      <div style={{
        background: 'var(--c-canvas)', border: '1.5px solid var(--c-ink)',
        borderRadius: 10, padding: 18,
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 8,
          background: 'var(--c-helmet)', color: 'var(--c-stache)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{Icon.gallery(22)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>갤러리에서 결과물 보기</div>
          <div style={{ fontSize: 12.5, color: 'var(--c-slate)' }}>종료 시 모든 팀의 프로젝트가 갤러리에 자동 공개됩니다.</div>
        </div>
        <button data-action="open-gallery" className="jt-btn jt-btn-critical">갤러리 보기 {Icon.arrowRight(13)}</button>
      </div>

      <ActivityGrid teams={pagedTeams} variant="summary" />
      <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
    </>);

}

// ── 압축 명단 그리드 (대기 상태) ──────────────────────────────
// 6열 · 압축 카드(팀명 + 아바타 도트, ~48px 높이). 1280px artboard 기준 6열 10행 = 60팀 한 화면.
function RosterGrid({ teams }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
      {teams.map((t, i) => <RosterRow key={i} t={t} />)}
    </div>);

}

// 성씨 기반 색 매핑 — TeammatePortrait(E-4)의 4색 토큰 어휘 재사용 + helmet/safety 확장 6색.
// 같은 성은 항상 같은 색(deterministic). 한 팀 4명 성이 보통 다르므로 카드 안 색 분산 자연.
const ROSTER_AVATAR_PALETTE = [
'var(--c-helmet)', 'var(--c-blue)', 'var(--c-mint)', 'var(--c-amber)',
'var(--c-helmet-deep)', 'var(--c-safety)'];

function rosterAvatarColor(name) {
  return ROSTER_AVATAR_PALETTE[name.charCodeAt(0) % ROSTER_AVATAR_PALETTE.length];
}

// 짓다 어휘 디자인 호버 툴팁 — useState 기반(tokens.css 무수정). ink bg + 흰 글자 + 작은 화살표.
// OS title 속성 병행 유지 → 키보드 포커스·a11y에서도 노출됨.
function RosterAvatar({ name, on }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={`${name} · ${on ? '접속' : '미접속'}`}
      style={{
        position: 'relative',
        width: 22, height: 22, borderRadius: '50%',
        // OFF는 호버 시 더 밝은 회색(stone-2)으로 — 사용자 피드백 "off는 호버도 더 밝은 회색으로"
        background: on ? rosterAvatarColor(name) : hover ? 'var(--c-stone-2)' : 'var(--c-stone)',
        color: on ? '#fff' : hover ? 'var(--c-ink-3)' : 'var(--c-muted)',
        border: on ? 'none' : '1px dashed var(--c-hairline-strong)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        flexShrink: 0,
        // 미접속은 옅음(0.7)이 기본 상태 단서 — 호버 시 가독성 위해 1로 복원
        opacity: on || hover ? 1 : 0.7,
        cursor: 'default'
      }}>
      {name[0]}
      {hover &&
      <span style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: '50%', transform: 'translateX(-50%)',
        background: 'var(--c-ink)', color: '#fff',
        padding: '5px 9px', borderRadius: 4,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)', letterSpacing: '-0.005em',
        pointerEvents: 'none', zIndex: 10,
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        display: 'inline-flex', alignItems: 'center', gap: 6
      }}>
          <span>{name}</span>
          {/* ON/OFF 칩: 색은 달리, 글자는 흰색 통일. ON=mint solid(눈에 띄는), OFF=rose-soft(차분한 빨강).
              사용자 피드백 "on이랑 off 너무 비슷, 칩 색 다르게 + 글씨 흰색". */}
          <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '2px 6px', borderRadius: 2,
          background: on ? 'var(--c-mint)' : '#c94560',
          color: '#fff', fontWeight: 700
        }}>{on ? 'ON' : 'OFF'}</span>
          {/* 화살표 — ink bg와 같은 색 */}
          <span style={{
          position: 'absolute',
          top: '100%', left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--c-ink)'
        }} />
        </span>
      }
    </span>);

}

function RosterRow({ t }) {
  const onCount = t.members.filter((m) => m[1] === 'on').length;
  const anyOff = onCount < t.members.length;
  return (
    <div
      data-action="open-team"
      role="button"
      tabIndex={0}
      className="jt-card-interactive"
      aria-label={`${t.name} 팀 상세 보기`}
      style={{
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 'var(--r-xs)',
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 6,
        minHeight: 60
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span title={t.name} style={{
          fontSize: 12.5, fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          minWidth: 0
        }}>{t.name}</span>
        <span className="jt-mono" style={{
          fontSize: 10, color: anyOff ? 'var(--c-muted)' : 'var(--c-mint)',
          flexShrink: 0
        }}>
          {onCount}/{t.members.length}
        </span>
      </div>
      {/* 성씨 미니 아바타 — TeammatePortrait(60px) 미니어처(22px). 호버 시 디자인 툴팁(이름 + ON/OFF).
          5명까지만 노출, 초과분은 +N 칩 (카드 폭 ≈170px · 22px×5+4×4+칩 ≈140px) */}
      <div style={{ display: 'flex', gap: 4 }}>
        {t.members.slice(0, 5).map(([name, state], i) =>
        <RosterAvatar key={i} name={name} on={state === 'on'} />
        )}
        {t.members.length > 5 &&
        <span
          title={t.members.slice(5).map(([n, s]) => `${n} · ${s === 'on' ? '접속' : '미접속'}`).join('\n')}
          className="jt-mono"
          style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--c-stone)', color: 'var(--c-ink-3)',
            border: '1px dashed var(--c-hairline-strong)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
            flexShrink: 0
          }}>
            +{t.members.length - 5}
          </span>
        }
      </div>
    </div>);

}

// ── 컴팩트 활동 그리드 (진행 상태) ──────────────────────────────
// 4열 · 컴팩트 카드 (메타 + 도트). 12팀이 한 화면에 보임.
function ActivityGrid({ teams }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
      {teams.map((t, i) => <ActivityRow key={i} t={t} />)}
    </div>);

}

function ActivityRow({ t }) {
  const tone = t.activity === 'paused' ? 'var(--c-amber)' :
  t.activity === 'idle' ? 'var(--c-slate)' :
  'var(--c-mint)';
  const label = t.activity === 'active' ? '작업 중' :
  t.activity === 'idle' ? '대기' :
  '일시정지';

  // 갤러리 카드와 동일 셸 (ProjectCard 공용)
  return (
    <ProjectCard
      dataAction="open-team"
      thumb={<LivePreview teamName={t.name} live={t.activity === 'active'} badge={t.published ? 'published' : 'private'} />}
      title={t.name}
      subtitle={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: tone }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          {label}
        </span>
      }
      primaryMeta={
        <span className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)' }}>
          {t.members}명
        </span>
      }
    />
  );
}

function TeamTag({ label, tone }) {
  const map = {
    amber: { bg: 'var(--c-helmet-soft)', fg: 'var(--c-amber)' },
    stone: { bg: 'var(--c-stone)', fg: 'var(--c-slate)' }
  };
  const c = map[tone] || map.stone;
  return (
    <span className="jt-mono" style={{
      fontSize: 9, padding: '1px 4px',
      background: c.bg, color: c.fg,
      borderRadius: 3, letterSpacing: '0.06em',
      flexShrink: 0
    }}>{label}</span>);

}

// ── B-2. 종료 확인 모달 (Stage 1 — 이름 타이핑) ──────────────
function B2EndModal() {
  return (
    <DashboardModalShell status="hackathon_running">
      <ModalSurface width={480} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        {/* 단계 표시 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--c-safety)', fontWeight: 700 }}>1 · 확인</span>
          <span style={{ width: 18, height: 1, background: 'var(--c-hairline-strong)' }} />
          <span>2 · 30초 유예</span>
          <span style={{ width: 18, height: 1, background: 'var(--c-hairline-strong)' }} />
          <span>3 · 종료됨</span>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 6 }}>해커톤을 정말 종료할까요?</h2>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            다음 단계에서 <strong style={{ color: 'var(--c-ink)' }}>30초 카운트다운</strong>이 시작되고, 모든 참가자에게 종료 예고가 전송됩니다.
            <br />
            카운트다운이 끝나면 해커톤이 종료되며 <strong style={{ color: 'var(--c-ink)' }}>되돌릴 수 없습니다.</strong>
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12.5, color: 'var(--c-ink-2)', display: 'block', marginBottom: 6 }}>
            계속하려면 해커톤 이름을 정확히 입력하세요
          </label>
          <div style={{
            padding: '8px 12px',
            background: 'var(--c-stone)',
            borderRadius: 'var(--r-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--c-ink-2)',
            marginBottom: 8,
            userSelect: 'all'
          }}>
            {HACKATHON_NAME}
          </div>
          <input
            className="jt-input"
            defaultValue="2026 봄 ENK"
            style={{
              fontFamily: 'var(--font-mono)',
              borderColor: 'var(--c-amber)',
              background: '#fffaf0'
            }} />
          
          <div style={{ fontSize: 11.5, color: 'var(--c-amber)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            {Icon.warn(11)} 4글자 더 입력하세요
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary">취소</button>
          <button data-action="proceed" className="jt-btn jt-btn-critical-static">계속 →</button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);

}

// ── B-2. 종료 확인 모달 (Stage 2 — 30초 카운트다운 + 참가자 예고) ─
// 카운트다운 애니메이션 (2026-05-27):
//   · rAF 60fps로 30초 → 0초까지 부드럽게 감소. 1초 단위로 숫자 ceil 표시.
//   · 호는 12시(top)에서 시작해 시계방향으로 사라짐 (conic-gradient · 시계 바늘 어휘).
//   · 링/태이프/참가자 미리보기 3곳이 동일한 remaining 값을 공유 — sync 보장.
function B2EndModalCountdown() {
  const TOTAL = 30;
  const startedAtRef = React.useRef(null);
  if (startedAtRef.current === null) startedAtRef.current = Date.now();
  const [remaining, setRemaining] = React.useState(TOTAL);
  const confirmBtnRef = React.useRef(null);

  React.useEffect(() => {
    let raf;
    let fired = false;
    const tick = () => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const left = Math.max(0, TOTAL - elapsed);
      setRemaining(left);
      if (left > 0) {
        raf = requestAnimationFrame(tick);
      } else if (!fired) {
        // 0초 도달 → [즉시 종료]와 동일 동작. viewer ACTIONS 위임이 'b2-ended'로 라우팅.
        // 정책: 어드민-역할-기획.md §해커톤 상태 모델 "30초 카운트다운 2단계" 규칙.
        fired = true;
        confirmBtnRef.current?.click();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, []);

  const elapsed = Math.max(0, Math.min(TOTAL, TOTAL - remaining));
  const consumedDeg = Math.max(0, Math.min(360, (elapsed / TOTAL) * 360));
  const display = remaining <= 0 ? 0 : Math.ceil(remaining);

  return (
    <DashboardModalShell status="hackathon_running">
      <ModalSurface width={520} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span>1 · 확인 {Icon.check(10)}</span>
          <span style={{ width: 18, height: 1, background: 'var(--c-ink)' }} />
          <span style={{ color: 'var(--c-safety)', fontWeight: 700 }}>2 · 30초 유예</span>
          <span style={{ width: 18, height: 1, background: 'var(--c-hairline-strong)' }} />
          <span>3 · 종료됨</span>
        </div>

        {/* 카운트다운 큰 표시 */}
        <div style={{
          background: 'var(--c-safety-soft)',
          border: '1px solid var(--c-safety)',
          borderRadius: 10,
          padding: '20px 22px',
          display: 'flex', alignItems: 'center', gap: 18,
          marginBottom: 18
        }}>
          {/* conic ring — 12시(top) 시작 · 시계방향으로 소비된 영역(soft)이 커짐 */}
          <div className="jt-countdown-ring-critical" style={{
            position: 'relative',
            width: 80, height: 80,
            flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: `conic-gradient(from 0deg, var(--c-safety-soft) 0deg ${consumedDeg}deg, var(--c-safety) ${consumedDeg}deg 360deg)`,
            }} />
            <div style={{
              position: 'relative',
              width: 68, height: 68, borderRadius: '50%',
              background: 'var(--c-canvas)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
              color: 'var(--c-safety)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {display}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <span className="jt-tape">⚠ {display}초 뒤 종료</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--c-safety-deep)', lineHeight: 1.55 }}>
              마음이 바뀌었다면 지금 [종료 취소]를 눌러주세요.
              <br />
              아무 동작이 없으면 0초에 자동으로 종료됩니다.
            </div>
          </div>
        </div>

        {/* 참가자 측 정책 안내 (예고 화면 없음) */}
        <div style={{
          background: 'var(--c-paper)',
          border: '1px solid var(--c-hairline)',
          borderRadius: 8,
          padding: '12px 14px',
          marginBottom: 18,
          fontSize: 12,
          color: 'var(--c-slate)',
          lineHeight: 1.55,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1.2, color: 'var(--c-ink-3)' }}>ⓘ</span>
          <span>
            참가자에게는 종료 예고가 표시되지 않습니다 — 30초는 운영자만의 유예 시간이며, 종료가 확정되는 시점에 참가자 화면이 곧바로 <strong style={{ color: 'var(--c-ink)' }}>해커톤 종료 안내(대기실 ③)</strong>로 전환됩니다.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary" style={{ borderColor: 'var(--c-ink)' }}>
            종료 취소
          </button>
          <button ref={confirmBtnRef} data-action="confirm" className="jt-btn jt-btn-critical-static">즉시 종료</button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);

}

// ── B-2. 튜토리얼 건너뛰기 경고 모달 ──────────────────────────
function B2SkipTutorialModal() {
  return (
    <DashboardModalShell status="tutorial_waiting">
      <ModalSurface width={480} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>튜토리얼 없이 바로 시작할까요?</h2>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            튜토리얼을 건너뛰면 <strong style={{ color: 'var(--c-ink)' }}>이전 상태로 되돌릴 수 없습니다.</strong> 비개발자 참가자가 많다면 튜토리얼을 권장합니다.
          </p>
        </div>

        <div style={{
          background: 'var(--c-paper)', border: '1px solid var(--c-hairline)',
          borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 18,
          fontSize: 13.5, color: 'var(--c-ink-2)', lineHeight: 1.55
        }}>
          튜토리얼을 <strong style={{ color: 'var(--c-ink)' }}>건너뛰고 바로 해커톤을 시작</strong>합니다.
          <br />
          이후에는 <strong style={{ color: 'var(--c-safety)' }}>다시 튜토리얼로 돌아갈 수 없습니다.</strong>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary">취소</button>
          <button data-action="proceed" className="jt-btn jt-btn-critical-static">
            건너뛰고 시작
          </button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);

}

// 모달 공통 — 뒤 대시보드 흐리게
function DashboardModalShell({ children, status }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--c-backdrop-strong)', zIndex: 2 }} />
      <div style={{ filter: 'blur(2px)', opacity: 0.5, pointerEvents: 'none' }}>
        {/* 모달 뒷배 대시보드: 특정 해커톤 진입 상태 → 해커톤명만 노출 */}
        <AppHeader breadcrumb={[HACKATHON_NAME]} user={OPERATOR_USER} />
        <div style={{
          background: 'var(--c-canvas)', borderBottom: '1px solid var(--c-hairline)',
          padding: '10px 32px', minHeight: 52,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{HACKATHON_NAME}</h2>
          <StatusPill status={status} />
        </div>
        <div style={{ padding: 40, height: 600 }} />
      </div>

      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 3
      }}>
        {children}
      </div>
    </div>);

}

// ─ B-2 신규 확인 모달 3종 (2026-05-26 추가) ─────────────────
// 어드민-역할-기획.md "단방향 전이 — 모두 확인 필수" 규칙 반영

function B2TutorialStartConfirm() {
  return (
    <DashboardModalShell status="tutorial_waiting">
      <ModalSurface width={480} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>튜토리얼을 시작하시겠습니까?</h2>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            참가자 12팀에게 셀프 튜토리얼 가이드가 표시됩니다.<br/>
            시작 후에는 <strong style={{ color: 'var(--c-ink)' }}>이전 상태로 되돌릴 수 없습니다.</strong>
          </p>
        </div>
        <div style={{
          background: 'var(--c-paper)', border: '1px solid var(--c-hairline)',
          borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 18,
          fontSize: 13.5, color: 'var(--c-ink-2)', lineHeight: 1.55
        }}>
          튜토리얼: <strong>나만의 투두 앱 만들기</strong> (3단계)<br/>
          참가자 화면이 자동으로 셀프 튜토리얼로 전환됩니다.
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary">취소</button>
          <button data-action="confirm" className="jt-btn jt-btn-critical-static">{Icon.play(13)} 튜토리얼 시작</button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);
}

function B2TutorialEndConfirm() {
  // 완료 현황 표시 — 현 디자인 샘플: 10/12
  return (
    <DashboardModalShell status="tutorial_running">
      <ModalSurface width={520} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>튜토리얼을 종료하시겠습니까?</h2>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            종료 후에는 <strong style={{ color: 'var(--c-ink)' }}>튜토리얼로 돌아갈 수 없습니다.</strong> 미완료 팀이 있더라도 다음 단계로 넘어갑니다.
          </p>
        </div>
        <div style={{
          background: 'var(--c-paper)', border: '1px solid var(--c-hairline)',
          borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 18
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--c-slate)' }}>현재 완료 현황</span>
            <span className="jt-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)' }}>10 / 12명</span>
          </div>
          <div style={{ height: 6, background: 'var(--c-stone)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: '83%', height: '100%', background: 'var(--c-mint)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-slate)' }}>
            미완료: <strong style={{ color: 'var(--c-amber)' }}>2팀</strong> (404 NOT FOUND, 코드밍아웃)
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary">취소</button>
          <button data-action="confirm" className="jt-btn jt-btn-critical-static">튜토리얼 종료</button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);
}

function B2HackathonStartConfirm() {
  return (
    <DashboardModalShell status="hackathon_waiting">
      <ModalSurface width={480} topStrip="caution" role="alertdialog">
        <div style={{ padding: '24px 28px 22px' }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>해커톤을 시작하시겠습니까?</h2>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            참가자 12팀에게 본 해커톤 환경(새 프로젝트)이 열립니다. 시작 후에는 <strong style={{ color: 'var(--c-ink)' }}>이전 상태로 되돌릴 수 없습니다.</strong>
          </p>
        </div>
        <div style={{
          background: 'var(--c-paper)', border: '1px solid var(--c-hairline)',
          borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 18,
          fontSize: 13.5, color: 'var(--c-ink-2)', lineHeight: 1.55
        }}>
          참가자 화면이 자동으로 코딩 환경(C-3·C-4)으로 전환됩니다.<br/>
          <span style={{ color: 'var(--c-slate)', fontSize: 12.5 }}>예정 시간: 4시간 · 종료 후 갤러리 자동 공개</span>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button data-action="cancel" className="jt-btn jt-btn-secondary">취소</button>
          <button data-action="confirm" className="jt-btn jt-btn-critical-static">{Icon.play(13)} 해커톤 시작</button>
        </div>
        </div>
      </ModalSurface>
    </DashboardModalShell>);
}

// ─ B-2 RosterRow 카드 클릭 → 팀 상세 모달 (2026-05-27) ───────────
// 운영자가 명단 한 줄을 클릭하면 해당 팀의 멤버 4명 이름·접속 상태를 작은 모달로 확인.
// C-1 C1TeamRoom과 공통 어휘: shared.jsx의 RosterMemberRow + RosterLegend 공용 컴포넌트 사용.
function RosterTeamDetailModal({ team }) {
  const onCount = team.members.filter((m) => m[1] === 'on').length;
  return (
    <ModalSurface
      width={380}
      topStrip="ink"
      ariaLabel={`${team.name} 팀 상세`}
      style={{ maxHeight: '100%', minHeight: 0 }}>

      {/* 헤더 — 인터랙션 모달(스크롤 멤버 리스트) 규칙에 따라 borderBottom 추가 (2026-05-27 디자인 시스템 §09e 규칙).
          닫기 버튼 없음(백드롭 클릭으로 close) */}
      <div style={{
        flex: '0 0 auto',
        padding: '20px 24px 14px',
        borderBottom: '1px solid var(--c-hairline)'
      }}>
        <div className="jt-mono" style={{
          fontSize: 10.5, color: 'var(--c-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4
        }}>팀 상세</div>
        <div style={{
          fontSize: 20, fontWeight: 700, lineHeight: 1.25,
          fontFamily: 'var(--font-display)', wordBreak: 'keep-all'
        }}>{team.name}</div>
        <div style={{ fontSize: 12, color: 'var(--c-slate)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          {onCount} / {team.members.length} 접속 중
        </div>
      </div>

      {/* 본문 — 멤버 행: RosterMemberRow 공용 컴포넌트 (B-2 모달 + C-1 동일 어휘).
          maxHeight 320 으로 7명 케이스부터 내부 스크롤 발생. 다인팀(8+) · 30+ 명에서도 모달이 무한정 길어지지 않음. */}
      <div style={{ flex: '1 1 auto', minHeight: 0, maxHeight: 320, padding: '8px 10px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
        <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', padding: '6px 8px 6px', flexShrink: 0 }}>
          팀원 {team.members.length}명
        </div>
        {team.members.map(([name, state], i) =>
        <RosterMemberRow key={i} name={name} color={rosterAvatarColor(name)} state={state} />
        )}
      </div>

      {/* 푸터 범례 — 공용 RosterLegend, 멤버 행 인디케이터와 동일 도트 어휘 */}
      <div style={{
        flex: '0 0 auto',
        padding: '10px 18px',
        borderTop: '1px solid var(--c-hairline)',
        background: 'var(--c-paper)'
      }}>
        <RosterLegend states={['on', 'off']} />
      </div>
    </ModalSurface>);

}

// B-2 RosterDetail 화면 셸 — RosterView 뒷배(블러) + 백드롭 + 모달 중앙
function B2RosterDetail() {
  // 시뮬: 데이터 파이프라인 크루(7명, 5 ON / 2 OFF) — 다인팀 케이스에서 모달 본문 스크롤 발생을 시각화.
  // 실제 앱은 selectedTeam state로 동적. 4명 이하 팀은 스크롤 미발생 → mock 시뮬 부적합.
  const team = PENDING_TEAMS.find((t) => t.name === '데이터 파이프라인 크루') ?? PENDING_TEAMS[2];
  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', filter: 'blur(2px)', opacity: 0.55, pointerEvents: 'none', minHeight: 0 }}>
        <DashboardShell status="tutorial_waiting" teams={PENDING_TEAMS} mode="roster" />
      </div>
      {/* 백드롭 클릭 시 닫힘 */}
      <div data-action="close-roster-detail" style={{
        position: 'absolute', inset: 0,
        background: 'var(--c-backdrop-strong)',
        zIndex: 2, cursor: 'pointer'
      }} />
      {/* 모달 wrapper — 상하 60px 인셋으로 높이 컨텍스트 부여, 안쪽 모달이 maxHeight: 100% 로 받음 */}
      <div style={{
        position: 'absolute', top: 60, bottom: 60, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center',
        zIndex: 3
      }}>
        <RosterTeamDetailModal team={team} />
      </div>
    </div>);

}

Object.assign(window, {
  B1HackathonList, B1Empty,
  B2DashboardTutorialWaiting, B2DashboardTutorialRunning,
  B2DashboardHackathonWaiting: () => <DashboardShell status="hackathon_waiting" teams={PENDING_TEAMS} mode="roster" />,
  B2DashboardStarted, B2DashboardPaused, B2DashboardEnded,
  B2EndModal, B2EndModalCountdown, B2SkipTutorialModal,
  B2TutorialStartConfirm, B2TutorialEndConfirm, B2HackathonStartConfirm,
  B2RosterDetail, RosterTeamDetailModal
});