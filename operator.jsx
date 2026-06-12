/* B. 운영자 영역 — 팀 정보 + 상태 제어만 (튜토리얼/시작/종료)
   · GNB(AppHeader)는 모든 운영자 화면에서 동일
   · 팀 리스트는 한 화면에 더 많이 보이도록 컴팩트 그리드
   · 일시정지/재시작은 2026-05-29 폐기 — 진행 중 휴식은 구두 안내로 처리 */

const OPERATOR_USER = { name: '박운영', email: 'park.unyoung@enk.kr', initial: '박' };
const HACKATHON_NAME = '2026 봄 ENK 해커톤';

// 5단계 phase 정의 — B-1 필터 stepper와 B-2 StatusPill 호버 popover가 공유.
// 색상은 StatusPill 색계열과 동일(2026-05-28 통합).
// 2026-05-29 §18-24: hackathon_waiting을 helmet 패밀리(노랑)로 — 카드 helmet-wash와 정합 + tutorial_waiting과 색 구분.
const PHASE_STAGES = [
{ id: 'tutorial_waiting',  label: '튜토리얼 대기', bg: '#ebebec',            fg: '#2a2823' },
{ id: 'tutorial_running',  label: '튜토리얼 진행', bg: '#e1e0fa',            fg: '#2e2c8a' },
{ id: 'hackathon_waiting', label: '해커톤 대기',   bg: '#fff4c2',            fg: '#6b4d00' },
{ id: 'hackathon_running', label: '해커톤 진행',   bg: 'var(--c-mint-soft)', fg: 'var(--c-mint)' },
{ id: 'hackathon_ended',   label: '해커톤 종료',   bg: '#ffe1de',            fg: '#882019' }];


// HackathonCard 포스트잇 tint — 5상태 색 여정 (blank → engaged → anticipation → live → sunset).
// 칩(PhaseFilterStepper)과 다른 매핑: 칩은 hue 진행을, 카드는 phase 위치를 표현.
// 2026-05-29 §18-23: tutorial_waiting을 paper보다 어두운 stone-wash 대신 더 밝은 canvas(#ffffff)로.
// 사용자 결정 "차라리 더 밝은 색깔" — paper 위 "blank/fresh/시작 전" 어휘로 전환.
// hackathon_waiting은 helmet-wash 유지(노랑=anticipation 어휘 그대로).
const STATUS_POSTIT_TINT = {
  tutorial_waiting: 'var(--c-canvas)',
  tutorial_running: 'var(--c-tutorial-wash)',
  hackathon_waiting: 'var(--c-helmet-wash)',
  hackathon_running: 'var(--c-mint-wash)',
  hackathon_ended: 'var(--c-safety-wash)'
};


// ── B-1. 해커톤 목록 ──────────────────────────────────────────
// 5상태 단방향 모델 적용 (페이지 정의서 v23848e86 · 2026-05-26: tutorial_ended 폐기, hackathon_waiting으로 통합)
function B1HackathonList() {
  const hackathons = [
  { name: '2026 봄 ENK 해커톤', org: '서울대학교 컴퓨터공학부', status: 'tutorial_waiting', teams: { multi: 8, solo: 0 }, claimed: 0, total: 240, runtime: '튜토리얼 시작 전' },
  { name: '소공포팩토리 11기 데모데이', org: '소프트웨어공작소', status: 'tutorial_running', teams: { multi: 6, solo: 12 }, claimed: 184, total: 196, runtime: '튜토리얼 42분 경과' },
  { name: '강서구 청소년 해커톤', org: '강서교육지원청', status: 'hackathon_running', teams: { multi: 10, solo: 8 }, claimed: 116, total: 122, runtime: '본행사 2시간 18분 경과' },
  { name: '엔지니어 부트캠프 8기', org: 'ENK 아카데미', status: 'hackathon_running', teams: { multi: 10, solo: 0 }, claimed: 78, total: 80, runtime: '본행사 1시간 12분 경과' },
  { name: '2025 겨울 해커톤 결선', org: '한국정보과학회', status: 'hackathon_ended', teams: { multi: 12, solo: 0 }, claimed: 156, total: 156, runtime: '종료 · 1주 전' },
  { name: 'KU x ENK 연합 해커톤', org: '고려대학교 SW중심대학사업단', status: 'hackathon_waiting', teams: { multi: 6, solo: 24 }, claimed: 0, total: 180, runtime: '본행사 시작 전' }];

  // 단계 필터 작동 (§18-14) — 'all' 또는 5상태 중 하나. count 0인 단계도 선택 가능(빈 상태 노출).
  const [activeFilter, setActiveFilter] = React.useState('all');
  const filtered = activeFilter === 'all' ? hackathons : hackathons.filter((h) => h.status === activeFilter);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)' }}>
      {/* B-1 목록: 아직 특정 해커톤 진입 전 → breadcrumb 없음 (로고만) */}
      <AppHeader user={OPERATOR_USER} />

      <div style={{ flex: 1, padding: '28px 40px', overflow: 'auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div className="jt-eyebrow" style={{ marginBottom: 6 }}>운영하는 해커톤</div>
          <h1 style={{ fontSize: 28 }}>박운영님이 맡은 해커톤 {hackathons.length}건</h1>
        </div>

        <PhaseFilterStepper hackathons={hackathons} active={activeFilter} onFilter={setActiveFilter} />

        {/* key 변경으로 그리드 remount → 카드 settle 재실행 (필터 시 재정렬 어휘 일관) */}
        {/* gap 14 → 22: 포스트잇 회전(±1.4°) 옆 돌출(~10px) 흡수 + tape 가시성. paddingTop 6: 첫 행 tape clearance */}
        <div key={activeFilter} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, paddingTop: 6 }}>
          {filtered.map((h, i) => <HackathonCard key={`${activeFilter}-${i}`} h={h} />)}
        </div>

        {filtered.length === 0 &&
        <div style={{
          marginTop: 24,
          padding: '32px 24px',
          background: 'var(--c-canvas)',
          border: '1px dashed var(--c-hairline-strong)',
          borderRadius: 'var(--r-sm)',
          textAlign: 'center',
          fontSize: 13.5,
          color: 'var(--c-slate)',
          lineHeight: 1.6
        }}>
            이 단계에 해당하는 해커톤이 없어요.<br />
            <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>다른 단계를 선택하거나 [전체]로 돌아가세요.</span>
          </div>
        }
      </div>
    </div>);

}

function HackathonCard({ h }) {
  const teamCount = h.teams.multi + h.teams.solo;
  const cta = '입장';
  // 포스트잇 어휘 — 회전은 해커톤명 hash 4-variant, tint는 5상태 색 여정 (§18-13).
  // border 제거 (shadow가 경계). r-md → r-xs (post-it 일관성). hackathon_ended는 opacity로 "sunset" 유지.
  const rot = postitRotation(h.name);
  const tint = STATUS_POSTIT_TINT[h.status] || 'var(--c-canvas)';

  return (
    <div data-action="open" role="button" tabIndex={0} className="jt-postit-card" style={{
      '--postit-rot': rot,
      '--postit-tint': tint,
      background: tint,
      borderRadius: 'var(--r-xs)',
      padding: 18,
      display: 'flex', flexDirection: 'column', gap: 10,
      minHeight: 160,
      opacity: h.status === 'hackathon_ended' ? 0.78 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <StatusPill status={h.status} />
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
        <span>{teamCount}팀 · 총 {h.total}명</span>
        <span style={{ color: 'var(--c-ink)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          {cta} {Icon.arrowRight(11)}
        </span>
      </div>
    </div>);

}

// ── B-1 단계 필터 stepper ──────────────────────────────────
// chip 나열 → 가로 stepper로 시각화 (2026-05-28). 색상은 PHASE_STAGES 공유.
// "전체" + 5단계, 단계 사이 chevron, 각 칩에 phase 색·번호·카운트.
// 활성 필터는 ring(border 강조)으로 표시. onFilter 작동 (§18-14).
function PhaseFilterStepper({ hackathons, active = 'all', onFilter }) {
  const total = hackathons.length;
  const counts = PHASE_STAGES.map((p) => hackathons.filter((h) => h.status === p.id).length);
  // onFilter 미전달 시 무동작 — 정적 mock 호환.
  const handle = (id) => () => onFilter && onFilter(id);

  const chipBase = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 11px',
    borderRadius: 999,
    fontSize: 12.5,
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    lineHeight: 1.2,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'var(--trans-hover)'
  };

  const allActive = active === 'all';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, color: 'var(--c-slate)', marginRight: 4 }}>단계</span>

      <button
        data-action="filter-all"
        onClick={handle('all')}
        aria-pressed={allActive}
        className="jt-btn jt-btn-sm"
        style={{
          ...chipBase,
          background: allActive ? 'var(--c-ink)' : 'var(--c-canvas)',
          color: allActive ? 'var(--c-canvas)' : 'var(--c-ink)',
          borderColor: allActive ? 'var(--c-ink)' : 'var(--c-hairline-strong)',
          fontWeight: 600
        }}>
        전체 <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, marginLeft: 2 }}>{total}</span>
      </button>

      <span style={{ width: 1, height: 18, background: 'var(--c-hairline-strong)', margin: '0 4px', alignSelf: 'center' }} />

      {PHASE_STAGES.map((p, i) => {
        const isActive = active === p.id;
        const count = counts[i];
        return (
          <React.Fragment key={p.id}>
            <button
              data-action={`filter-${p.id}`}
              onClick={handle(p.id)}
              aria-pressed={isActive}
              className="jt-btn jt-btn-sm"
              style={{
                ...chipBase,
                background: p.bg,
                color: p.fg,
                borderColor: isActive ? p.fg : 'transparent',
                boxShadow: isActive ? `0 0 0 1px ${p.fg} inset` : 'none',
                opacity: count === 0 ? 0.45 : 1
              }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55, fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
              {p.label}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, marginLeft: 2 }}>{count}</span>
            </button>
            {i < PHASE_STAGES.length - 1 &&
            <span style={{ color: 'var(--c-hairline-strong)', fontSize: 14, lineHeight: 1 }}>›</span>
            }
          </React.Fragment>);

      })}
    </div>);

}

// ── B-1 빈 상태 ──────────────────────────────────────────────
function B1Empty() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)' }}>
      {/* B-1 빈 상태: 아직 특정 해커톤 진입 전 → breadcrumb 없음 (로고만) */}
      <AppHeader user={{ name: '김신규', email: 'kim.newop@school.go.kr', initial: '김' }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        {/* 2026-06-01 paper 폐기 → .jt-postit-card 어휘 통일.
            정적 회전 -0.6° + tape — empty 카드 단일이라 정체성 부여. CTA 없으니 일반 hover OK이지만,
            상태 전환이 없는 안내 카드라 손맛만 유지하고 hover 회전→0°·lift는 산만 → static modifier 채택. */}
        <div
          className="jt-postit-card jt-postit-card-static jt-postit-tape-lg"
          tabIndex={0}
          style={{
            width: 'min(520px, 88vw)',
            minHeight: 360,
            padding: '48px 44px',
            borderRadius: 'var(--r-xs)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            '--postit-rot': 'var(--postit-rot-b)',
            '--postit-tint': 'var(--c-canvas)'
          }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'var(--c-stone)', color: 'var(--c-ink-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18
          }}>{Icon.users(22)}</div>
          <h2 style={{ fontSize: 22, marginBottom: 8, color: 'var(--c-ink)' }}>아직 배정된 해커톤이 없어요</h2>
          <p style={{ fontSize: 13.5, color: 'var(--c-slate)', lineHeight: 1.6, margin: 0 }}>
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
// 전체 32팀 — 가나다순 (한글 → 영문 → 숫자). 1인팀·다인팀 섞임 (§18-21).
const PENDING_TEAMS = [
{ name: '노유진', members: [['노유진', 'on']], solo: true },
{ name: '뉴럴 네트', members: [['옹예진', 'off'], ['모서윤', 'on'], ['편나라', 'on'], ['표현우', 'on']] },
{ name: '데이터 파이프라인 크루', members: [['김도윤', 'on'], ['이수아', 'on'], ['박재현', 'on'], ['최예린', 'off'], ['정하늘', 'on'], ['한서준', 'on'], ['오민채', 'pending']] },
{ name: '디버그 라이프', members: [['오민서', 'on'], ['남기범', 'on'], ['고지원', 'on'], ['배도윤', 'off']] },
{ name: '런타임 에러', members: [['묵서린', 'on'], ['공태우', 'on'], ['승하린', 'on']] },
{ name: '레이스 컨디션', members: [['빈도윤', 'on'], ['소예준', 'on']] },
{ name: '류재석', members: [['류재석', 'off']], solo: true },
{ name: '머지 컨플릭트', members: [['지수아', 'on'], ['엄재민', 'off']] },
{ name: '명도윤', members: [['명도윤', 'on']], solo: true },
{ name: '바이브 코더', members: [['단우진', 'on'], ['두지유', 'on']] },
{ name: '백서아', members: [['백서아', 'on']], solo: true },
{ name: '비트 플립', members: [['단지호', 'on'], ['철민서', 'on']] },
{ name: '세그폴트 어택', members: [['장은채', 'on'], ['우다현', 'on'], ['표지민', 'off'], ['반지호', 'on']] },
{ name: '손미래', members: [['손미래', 'on']], solo: true },
{ name: '스택 오버플로우', members: [['형지율', 'on'], ['선우진', 'on'], ['민예나', 'on'], ['도재훈', 'on']] },
{ name: '시맨틱 메모리', members: [['천유주', 'on'], ['황민찬', 'on'], ['하예성', 'on']] },
// 엣지 케이스 — 긴 팀명(ellipsis 검증)
{ name: '엔드투엔드 인터랙션 테스트 마스터즈', members: [['강현우', 'on'], ['민지우', 'on'], ['윤다인', 'off'], ['차서윤', 'on']] },
{ name: '엣지 케이스', members: [['독고나윤', 'on'], ['남궁세빈', 'on'], ['갈주아', 'off'], ['로희원', 'on']] },
{ name: '우시현', members: [['우시현', 'on']], solo: true },
{ name: '진하경', members: [['진하경', 'on']], solo: true },
{ name: '천도현', members: [['천도현', 'off']], solo: true },
{ name: '캐시 미스', members: [['연하은', 'off'], ['추서연', 'on'], ['진민호', 'on']] },
{ name: '커널 패닉', members: [['정도현', 'on'], ['한예린', 'on'], ['오태웅', 'off']] },
{ name: '코드밍아웃', members: [['조하준', 'on'], ['신예슬', 'on'], ['양준호', 'on'], ['구지원', 'on']] },
{ name: '터미널 사파리', members: [['김민준', 'on'], ['이서윤', 'on'], ['박지호', 'on'], ['최유나', 'on']] },
{ name: '황태리', members: [['황태리', 'off']], solo: true },
{ name: '훅 라이프', members: [['승하준', 'on'], ['시아윤', 'on'], ['초은비', 'off']] },
// 영문 (a~z)
{ name: 'await me', members: [['차은우', 'on'], ['주현지', 'off'], ['홍수민', 'on']] },
{ name: 'JS의 비밀', members: [['백하늘', 'off'], ['문가람', 'off']] },
{ name: 'null pointer', members: [['편서준', 'on'], ['도경호', 'on'], ['금나래', 'on']] },
{ name: 'undefined', members: [['안소민', 'on'], ['권태성', 'on'], ['진하영', 'off']] },
// 숫자
{ name: '404 NOT FOUND', members: [['강수아', 'on'], ['윤재현', 'off'], ['임소영', 'on'], ['서지훈', 'pending']] }];


// 진행 상태: 활동 정보 + 손들기 + 불참 신호 (30팀 — published는 운영 중 자발 공개 분포 다양화).
// 2026-06-01 v2: ActivityView 재설계 — 미리보기 그리드 폐기, 운영자 관점 신호(손들기·정체·불참) 중심.
// 신규 필드:
//   · idleMin: 마지막 *사용자 입력* 후 경과 분 (정체·위험 분류용). 0=방금.
//     ──── idleMin 정의 (2026-06-02 명확화) ────
//     사용자 입력 = 타이핑·클릭·코드 변경·새 AI 프롬프트 전송 등 학생이 능동적으로 한 행위.
//     AI 응답 대기·생성 중 시간은 idleMin에 *합산하지 않음* — 학생이 멍하니 있는 게 아니라 작업이 진행 중인 것.
//     예: 18분 전 AI 프롬프트 전송, 8분간 AI 응답 생성, 그 후 10분 가만히 → idleMin = 10 (AI 8분은 제외).
//   · firstActivity: 팀 내 멤버가 1명이라도 접속했는지 (false = 전원 미접속 → "미입장" 분류). (v14 정의 명확화)
//   · handRaisedSec: 손든 지 경과 초. null이면 안 든 상태. 120초 후 자동 해제 (UI 시연용 mock 고정).
// 분류 룰:
//   · handRaisedSec != null               → 손든 팀 (최상단)
//   · !firstActivity                       → 미입장 (팀 전원 미접속 — 별도 모달, 출석 확인 필요)
//   · idleMin >= 20                        → 🔴 위험
//   · idleMin >= 10                        → 🟡 주의
//   · 그 외                                 → 정상 (분포 카운트만)
// 시연용 mock 분포 (70팀 — 2026-06-12 손든·잠시 멈춤 zone 페이지네이션 시연 위해 40팀 증원):
//   · 손든 팀: 26팀 (오래 기다린 순 정렬 + zone 페이지네이션 — perPage 20 → 2페이지, 1페이지 꽉 채움)
//   · 불참: 4팀 (전원 미접속 가정 — 뉴럴 네트, 명도윤, 류재석, 천도현)
//   · 잠시 멈춤(주의🟡 10~19분 + 위험🔴 ≥20분): 28팀 (오래 멈춘 순 정렬 + zone 페이지네이션 — perPage 20 → 2페이지)
//   · 정상: 나머지
// 전체 70팀 — 기존 30팀 가나다순 + 말미에 시연용 추가 팀 append. 1인팀·다인팀 섞임 (§18-21).
// perPage 20(2col×10행)으로 토큰 zone 상위 10팀 높이와 맞춰 1페이지가 컬럼을 꽉 채움 → 빈 공백/바닥 페이지네이션 "헷갈림" 해소.
// 토큰 순위(AI 사용량) zone은 상위 10팀만 노출(페이지네이션 없음)이라 증원 팀은 토큰 zone에 거의 안 보임.
// tokensUsed: 본행사 시작 후 팀이 누적 사용한 토큰 합계 (2026-06-02 사용자 룰 추가).
//   데이터 흐름: 각 팀 프로젝트별로 매 AI 동작(generate·edit·chat) 종료 시점에 사용 토큰 수를 서버 전송.
//   서버는 hackathon_teams.tokens_used에 합산 누적. 운영자 화면은 폴링 또는 SSE로 동기화.
//   불참 팀(firstActivity=false)은 0 — 정의상 활동 없음.
const STARTED_TEAMS = [
{ name: '노유진', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 145, published: true, tokensUsed: 3120 },
{ name: '뉴럴 네트', members: 4, idleMin: 999, firstActivity: false, handRaisedSec: null, published: false, tokensUsed: 0 },
{ name: '디버그 라이프', members: 4, idleMin: 1, firstActivity: true, handRaisedSec: 72, published: false, tokensUsed: 18420 },
{ name: '런타임 에러', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 11280 },
{ name: '레이스 컨디션', members: 2, idleMin: 11, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 7650 },
{ name: '류재석', members: 1, solo: true, idleMin: 999, firstActivity: false, handRaisedSec: null, published: false, tokensUsed: 0 },
{ name: '머지 컨플릭트', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 9340 },
{ name: '명도윤', members: 1, solo: true, idleMin: 999, firstActivity: false, handRaisedSec: null, published: false, tokensUsed: 0 },
{ name: '바이브 코더', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 13780 },
{ name: '백서아', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 38, published: true, tokensUsed: 4980 },
{ name: '비트 플립', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 8120 },
{ name: '세그폴트 어택', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 22450 }, /* TOP 1 */
{ name: '손미래', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 2890 },
{ name: '스택 오버플로우', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 19560 }, /* TOP 3 */
{ name: '시맨틱 메모리', members: 3, idleMin: 10, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 6420 },
{ name: '엣지 케이스', members: 4, idleMin: 16, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 15240 },
{ name: '우시현', members: 1, solo: true, idleMin: 14, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 1620 },
{ name: '진하경', members: 1, solo: true, idleMin: 1, firstActivity: true, handRaisedSec: 23, published: false, tokensUsed: 3420 },
{ name: '천도현', members: 1, solo: true, idleMin: 999, firstActivity: false, handRaisedSec: null, published: true, tokensUsed: 0 },
{ name: '캐시 미스', members: 3, idleMin: 18, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 5180 },
{ name: '커널 패닉', members: 3, idleMin: 22, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 10920 },
{ name: '코드밍아웃', members: 4, idleMin: 25, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 14280 },
{ name: '터미널 사파리', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 17890 }, /* TOP 4 */
{ name: '황태리', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 9, published: true, tokensUsed: 5670 },
{ name: '훅 라이프', members: 3, idleMin: 1, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 12640 },
{ name: 'await me', members: 3, idleMin: 12, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 9810 },
{ name: 'JS의 비밀', members: 2, idleMin: 1, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 6480 },
{ name: 'null pointer', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 16320 }, /* TOP 5 */
{ name: 'undefined', members: 3, idleMin: 2, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 20180 }, /* TOP 2 */
{ name: '404 NOT FOUND', members: 4, idleMin: 13, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 8960 },
// 2026-06-12: 손든·잠시 멈춤 zone 페이지네이션 시연용 추가 팀 (큰 행사일수록 두 목록은 길어짐).
// 손든 팀 추가 (handRaisedSec != null) — 오래 기다린 순 정렬 시연.
{ name: '가비지 컬렉터', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 118, published: false, tokensUsed: 7240 },
{ name: '람다 익스프레스', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 96, published: true, tokensUsed: 6010 },
{ name: '부트스트랩', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: 64, published: false, tokensUsed: 8470 },
{ name: '시그널 노이즈', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 51, published: true, tokensUsed: 2240 },
{ name: '오버플로우', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 42, published: false, tokensUsed: 5320 },
{ name: '캐스케이드', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 28, published: true, tokensUsed: 4760 },
{ name: '패리티 비트', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 16, published: false, tokensUsed: 3980 },
{ name: '힙 정렬', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 6, published: true, tokensUsed: 1870 },
{ name: '포인터 디레프', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 132, published: false, tokensUsed: 6940 },
{ name: '비동기 어웨잇', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 124, published: true, tokensUsed: 5580 },
{ name: '클로저 트랩', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: 108, published: false, tokensUsed: 7810 },
{ name: '리졸버', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 90, published: true, tokensUsed: 2120 },
{ name: '프로미스 체인', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 80, published: false, tokensUsed: 6230 },
{ name: '스코프 호이스팅', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 69, published: true, tokensUsed: 4510 },
{ name: '리렌더', members: 4, idleMin: 0, firstActivity: true, handRaisedSec: 58, published: false, tokensUsed: 8030 },
{ name: '메모이즈', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 46, published: true, tokensUsed: 3640 },
{ name: '뮤테이션', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 34, published: false, tokensUsed: 5270 },
{ name: '디바운스', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 25, published: true, tokensUsed: 2030 },
{ name: '콜백 헬', members: 2, idleMin: 0, firstActivity: true, handRaisedSec: 18, published: false, tokensUsed: 4180 },
{ name: '패칭', members: 3, idleMin: 0, firstActivity: true, handRaisedSec: 12, published: true, tokensUsed: 5640 },
{ name: '널 체크', members: 1, solo: true, idleMin: 0, firstActivity: true, handRaisedSec: 4, published: false, tokensUsed: 1450 },
// 잠시 멈춤 팀 추가 (idleMin >= 10, 손들기 안 함) — 오래 멈춘 순 정렬 시연.
{ name: '데드락', members: 3, idleMin: 24, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 6680 },
{ name: '뮤텍스', members: 2, idleMin: 21, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 5140 },
{ name: '스레드 풀', members: 4, idleMin: 17, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 7020 },
{ name: '인덱스 아웃', members: 1, solo: true, idleMin: 15, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 2510 },
{ name: '토큰 버킷', members: 3, idleMin: 13, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 4430 },
{ name: '페이지 폴트', members: 2, idleMin: 11, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 3760 },
{ name: '세마포어', members: 3, idleMin: 26, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 6120 },
{ name: '컨텍스트 스위치', members: 2, idleMin: 23, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 5390 },
{ name: '캐시 워밍', members: 4, idleMin: 22, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 7240 },
{ name: '콜드 스타트', members: 1, solo: true, idleMin: 20, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 2280 },
{ name: '백프레셔', members: 3, idleMin: 19, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 5860 },
{ name: '스택 트레이스', members: 2, idleMin: 18, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 4730 },
{ name: '힙 덤프', members: 4, idleMin: 16, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 6510 },
{ name: '메모리 릭', members: 2, idleMin: 14, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 4060 },
{ name: '레이지 로드', members: 3, idleMin: 13, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 5180 },
{ name: '프리페치', members: 1, solo: true, idleMin: 12, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 2640 },
{ name: '워치독', members: 2, idleMin: 11, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 3920 },
{ name: '배럴 파일', members: 3, idleMin: 10, firstActivity: true, handRaisedSec: null, published: true, tokensUsed: 4850 },
{ name: '사이드 이펙트', members: 2, idleMin: 10, firstActivity: true, handRaisedSec: null, published: false, tokensUsed: 3540 }];


// ── B-2. 대시보드 (튜토리얼 대기) ──────────────────────────
// runtime은 진행 중인 단계에서만 핵심 1줄로 표시. 대기·종료 상태는 stage strip이 맥락 전달.
function B2DashboardTutorialWaiting() {
  return <DashboardShell status="tutorial_waiting" teams={PENDING_TEAMS} mode="roster" />;
}

// ── B-2. 대시보드 (튜토리얼 진행) ──────────────────────────
// 2026-05-29: PENDING_TEAMS 사용 — 튜토리얼 진행 중에도 접속 상태(ON/OFF)·멤버 명단이 운영자에게 가장 유의미한 정보.
// 대기 화면과 동일한 포스트잇(RosterRow) 어휘를 5열 칸반으로 적층.
function B2DashboardTutorialRunning() {
  return <DashboardShell status="tutorial_running" runtime="00:23:00 경과" teams={PENDING_TEAMS} mode="tutorial-progress" live />;
}

// ── B-2. 대시보드 (해커톤 진행) ────────────────────────────
function B2DashboardStarted() {
  return <DashboardShell status="hackathon_running" runtime="02:47:12 경과" teams={STARTED_TEAMS} mode="activity" live />;
}

// B2DashboardPaused 폐기 (2026-05-29): 일시정지 기능 제거.

// ── B-2. 대시보드 (해커톤 종료) ────────────────────────────
// 2026-06-12: 기본(b2-ended)은 심사 진입 배너 없는 깨끗한 결산 대시보드.
//   배너 버전은 judgingEntry로 분리 — F.심사 영역 'b2-ended-judging' 화면에서만 사용.
function B2DashboardEnded({ judgingEntry = false }) {
  return <DashboardShell status="hackathon_ended" teams={STARTED_TEAMS} mode="summary" judgingEntry={judgingEntry} />;
}

// ── 실시간 데이터 상태 인디케이터 ──────────────────────────────
// sticky 헤더 우측 클러스터. 정상=mint pulse dot, hover/stale 시 추가 정보. 새로고침 버튼 동반.
// (2026-05-29 B-1 옵션) 운영자 모든 활성 상태(waiting·running) 공통, ended에선 미노출.
function LiveStatus() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} title="실시간 연결됨 · 방금 갱신">
      <span style={{
        position: 'relative',
        display: 'inline-block',
        width: 14, height: 14,
        flexShrink: 0
      }}>
        {/* halo — scale·fade out, 1.8s 무한 반복 */}
        <span className="jt-status-pulse" style={{
          position: 'absolute', inset: 2,
          background: 'var(--c-mint)', borderRadius: '50%'
        }} />
        {/* solid 코어 */}
        <span style={{
          position: 'absolute', inset: 4,
          background: 'var(--c-mint)', borderRadius: '50%'
        }} />
      </span>
      <button
        data-action="refresh"
        title="새로고침"
        className="jt-btn jt-btn-ghost jt-btn-sm"
        style={{ padding: '4px 6px', minHeight: 0, lineHeight: 1, color: 'var(--c-slate)' }}>
        {Icon.refresh(13)}
      </button>
    </span>);

}

// ── 대시보드 공통 셸 ──────────────────────────────────────────
// page/perPage: 팀 그리드 페이지네이션 (기본 1페이지). perPage 기본값은 mode에 따라 분기:
//   · roster (팀명 + 22px 성씨 미니 아바타, 압축 카드 ~60px 높이) → 60팀/페이지, 6열×10행
//   · tutorial-progress / activity / summary (썸네일 카드 ~210px) → 12팀/페이지, 4열×3행
// 60팀 행사 1페이지 노출. 30팀 mock은 totalTeams <= perPage라 RosterView에서 페이지네이션 숨김.
// 호출부에서 perPage 명시 시 우선. sticky 헤더의 상태 제어·접속 합계는 전체 teams 기준.
function DashboardShell({ status, runtime, teams, mode, live, page = 1, perPage, judgingEntry = false }) {
  const effectivePerPage = perPage ?? (mode === 'roster' ? 60 : 12);
  // 5상태별 제어 버튼: 좌측 약한 보조 / 우측 강한 Primary로 위치 분리
  // 종료(비가역)는 별도 그룹의 우측 끝.
  // 2026-05-29: 일시정지/재시작 버튼 제거 — 진행 중 휴식은 운영자 구두 안내로 처리
  // 2026-05-29 §18-25: 해커톤 종료 jt-btn-danger-outlined → jt-btn-danger (filled).
  // 사용자 보고 "잘 눈에 안 띔" — 모달이 이미 실수 방지 안전망 역할, 버튼 자체는 명확히 노출.
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

    hackathon_running:
    <>
        {/* 진행 중에도 운영자가 현재 공개된 작품을 미리 둘러볼 수 있도록 갤러리 진입 (2026-06-02). */}
        <button data-action="open-gallery" className="jt-btn jt-btn-secondary">
          {Icon.gallery(13)} 갤러리
        </button>
        <button data-action="end" className="jt-btn jt-btn-danger">
          {Icon.stop(11)} 종료
        </button>
      </>,

    hackathon_ended: null

  }[status];

  const multiCount = teams.filter((t) => !t.solo).length;
  const soloCount = teams.filter((t) => t.solo).length;
  // sticky 헤더는 보편 메타데이터(phase·runtime·실시간·actions)만 — 접속 N/M은 결정 지표가 분명한 RosterView 헤더로 이관 (2026-05-29 B-1).
  const showLiveStatus = status !== 'hackathon_ended';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)' }}>
      {/* B-2 대시보드: GNB는 로고+계정만 (해커톤명은 아래 sticky 헤더의 h2에서 단일 노출 — 2026-05-28) */}
      <AppHeader user={OPERATOR_USER} />

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
          <PhaseHover currentStatus={status} />
          {runtime &&
          <span style={{ fontSize: 12, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{runtime}</span>
          }
        </div>

        <div style={{ flex: 1 }} />
        {/* 데이터 상태 cluster — 모든 활성 상태에서 동일. ended에선 미노출. */}
        {showLiveStatus && <LiveStatus />}
        {showLiveStatus && statusActions && <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--c-hairline)', margin: '0 4px' }} />}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{statusActions}</div>
      </div>

      {/* 5단계 전이 인디케이터는 sticky 헤더의 PhaseHover(StatusPill 호버)로 이동 — 2026-05-28 */}

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
            {mode === 'activity' && <ActivityView teams={teams} totalTeams={teams.length} />}
            {mode === 'summary' && <SummaryView teams={teams} judgingEntry={judgingEntry} {...pageProps} />}
          </div>
        );
      })()}
    </div>);

}

// ── B-2 StatusPill 호버 popover ──────────────────────────────
// 2026-05-28: 상시 노출 StageStrip을 폐기, StatusPill 호버 시 5단계 stepper를 popover로 노출.
// CSS: tokens.css `.jt-phase-hover` / `.jt-phase-popover`로 가시성 토글.
function PhaseHover({ currentStatus }) {
  const currentIdx = PHASE_STAGES.findIndex((s) => s.id === currentStatus);
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
        display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>PHASE</div>
        {PHASE_STAGES.map((s, i) => {
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
              opacity: isPast ? 0.65 : 1
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, minWidth: 16 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {isCurrent && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>← 현재</span>}
            </div>);

        })}
      </div>
    </span>);

}

// ── 5단계 전이 인디케이터 (legacy — 2026-05-28부터 미사용, PhaseHover로 대체) ────────
// 보존 사유: 향후 다른 화면(에러·점검 모드 등)에서 재사용 가능성. 제거는 1주 무사용 확인 후.
// 2026-05-26: ③ tutorial_ended 폐기 — [튜토리얼 종료] 클릭 시 즉시 ④ 해커톤 대기로 전이.
function StageStrip({ status }) {
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
    </div>);

}

// ── 상태별 뷰 ─────────────────────────────────────────────────
function RosterView({ teams, live, multiCount, soloCount, pagedTeams, totalTeams, page, perPage, prevDisabled, nextDisabled }) {
  // 60팀/페이지 (6열 × 10행). 압축 카드(도트)로 60팀 행사 1페이지 노출.
  // 미접속 필터: 별행 [전체]/[미접속] 2-chip → 상단 우측 단일 토글 (2026-05-29 §18-9).
  // 토글 작동 + 카드 재정렬 settle 애니메이션 (§18-11). 색 신호(safety-wash) 1차 식별 + 토글 드릴다운.
  const [showOfflineOnly, setShowOfflineOnly] = React.useState(false);
  const offlineCount = teams.reduce((n, t) => n + (t.members.some((m) => m[1] !== 'on') ? 1 : 0), 0);
  // 필터 ON: 전체 teams에서 미접속 포함 팀만(offlineCount ≤ perPage 가정) → 페이지네이션 자동 숨김.
  // 필터 OFF: 상위 DashboardShell이 페이지네이션한 pagedTeams 그대로 사용.
  const displayedTeams = showOfflineOnly ?
  teams.filter((t) => t.members.some((m) => m[1] !== 'on')) :
  pagedTeams;
  const showPagination = !showOfflineOnly && totalTeams > perPage;

  // RosterView 결정 지표(2026-05-29): 총 팀수 / 전원 접속 팀수 / 접속 인원 / 총 인원.
  // 팀 metric은 "전원 접속한 팀 수" — 운영자가 튜토리얼 시작 임계로 쓰는 metric.
  // 부분 접속 팀은 post-it tint(safety-wash)로 별도 시각화되어 있음.
  const connectedTeams = teams.reduce((n, t) => n + (t.members.every((m) => m[1] === 'on') ? 1 : 0), 0);
  const connectedMembers = teams.reduce((sum, t) => sum + t.members.filter((m) => m[1] === 'on').length, 0);
  const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, lineHeight: 1.2, margin: 0 }}>참가자 접속 현황</h3>
          <span style={{ fontSize: 12.5, color: 'var(--c-slate)', display: 'inline-flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>
                {connectedTeams}<span style={{ color: 'var(--c-muted)', fontSize: 12 }}>/{totalTeams}</span>
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>팀</span>
            </span>
            <span style={{ color: 'var(--c-hairline-strong)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>
                {connectedMembers}<span style={{ color: 'var(--c-muted)', fontSize: 12 }}>/{totalMembers}</span>
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>명</span>
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* 미접속만 보기 — `.jt-switch` 정식 primitive (§18-10). 작동 토글 (§18-11).
              label로 감싸 라벨 클릭도 토글 가능. 활성 시 pill: safety border + safety-wash bg로 강조. */}
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', userSelect: 'none',
            padding: '4px 4px 4px 10px',
            borderRadius: 999,
            border: `1px solid ${showOfflineOnly ? 'var(--c-safety)' : 'var(--c-hairline)'}`,
            background: showOfflineOnly ? 'var(--c-safety-wash)' : 'transparent',
            transition: 'border-color var(--dur-fast) var(--ease-standard), background-color var(--dur-fast) var(--ease-standard)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-safety)' }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink)' }}>미접속만 보기</span>
            <span className="jt-mono" style={{ fontSize: 11, color: showOfflineOnly ? 'var(--c-safety-deep)' : 'var(--c-muted)' }}>{offlineCount}</span>
            <button
              type="button"
              role="switch"
              aria-checked={showOfflineOnly}
              aria-label="미접속 포함된 팀만 보기"
              data-action="toggle-offline"
              onClick={() => setShowOfflineOnly((v) => !v)}
              className="jt-switch is-safety is-sm" />
          </label>
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
      </div>

      {/* key로 wrapper 강제 remount → 자식 카드 모두 jt-postit-settle 재실행 (필터 토글 시 재정렬 어휘) */}
      <div key={showOfflineOnly ? 'off' : 'all'}>
        <RosterGrid teams={displayedTeams} />
      </div>
      {showPagination &&
      <Pagination page={page} perPage={perPage} total={totalTeams} prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
      }
    </>);

}

const TUTORIAL_STEP_ORDER = ['not-started', 'step1', 'step2', 'step3', 'done'];

function TutorialProgressView({ teams, live }) {
  // 초기 분포: 완료 20 / Step1·2·3 진행 7 / 미시작 잔여 (PENDING_TEAMS 32팀 기준).
  const initialSteps = React.useMemo(() => teams.map((_, i) => {
    if (i < 20) return 'done';
    if (i < 23) return 'step1';
    if (i < 25) return 'step2';
    if (i < 27) return 'step3';
    return 'not-started';
  }), [teams]);

  // 실시간 갱신 시뮬레이션 — live=true일 때 ~2.2s마다 done이 아닌 팀 1개를 다음 step으로 advance.
  // moved Set: "한 번이라도 이동한" 팀 인덱스. 초기 마운트엔 wrapper 클래스 미부여(=무애니), 이후
  // 이동 시 wrapper key가 step 포함이라 remount되며 .jt-kanban-card-enter keyframe 재생.
  const [steps, setSteps] = React.useState(initialSteps);
  const [moved, setMoved] = React.useState(() => new Set());

  React.useEffect(() => {
    if (!live) return;
    const tick = setInterval(() => {
      setSteps((prev) => {
        const movable = [];
        prev.forEach((s, i) => { if (s !== 'done') movable.push(i); });
        if (!movable.length) return prev;
        const idx = movable[Math.floor(Math.random() * movable.length)];
        const next = prev.slice();
        next[idx] = TUTORIAL_STEP_ORDER[TUTORIAL_STEP_ORDER.indexOf(next[idx]) + 1];
        setMoved((m) => { const n = new Set(m); n.add(idx); return n; });
        return next;
      });
    }, 2200);
    return () => clearInterval(tick);
  }, [live]);

  const tutorialTeams = teams.map((t, i) => ({ ...t, step: steps[i], _moved: moved.has(i) }));

  // 칸반 5열 — 미시작 → Step 1·2·3 → 완료. accent=헤더 라인, bg=컬럼 zone 옅은 wash, barColor=진행률 바 단계 색.
  // 진행률 바: tutorial 한 색을 paper와 mix해 step1·2·3에 단계별 농도(라이트→딥) 부여. progression 시각 단서.
  const columns = [
    { id: 'not-started', label: '미시작',           accent: 'var(--c-slate)',    bg: 'rgba(45, 42, 36, 0.04)',   barColor: 'var(--c-stone-2)' },
    { id: 'step1',       label: 'Step 1 · 기획',     shortLabel: 'Step 1', accent: 'var(--c-tutorial)', bg: 'rgba(46, 44, 138, 0.045)', barColor: 'color-mix(in oklab, var(--c-tutorial) 28%, var(--c-paper))' },
    { id: 'step2',       label: 'Step 2 · 기능 추가', shortLabel: 'Step 2', accent: 'var(--c-tutorial)', bg: 'rgba(46, 44, 138, 0.045)', barColor: 'color-mix(in oklab, var(--c-tutorial) 58%, var(--c-paper))' },
    { id: 'step3',       label: 'Step 3 · 다듬기',   shortLabel: 'Step 3', accent: 'var(--c-tutorial)', bg: 'rgba(46, 44, 138, 0.045)', barColor: 'var(--c-tutorial)' },
    { id: 'done',        label: '완료',             accent: 'var(--c-mint)',     bg: 'rgba(56, 167, 84, 0.05)',  barColor: 'var(--c-mint)' }
  ].map((c) => ({ ...c, teams: tutorialTeams.filter((t) => t.step === c.id) }));

  const completed = columns.find((c) => c.id === 'done').teams.length;
  const inProgress = columns.filter((c) => c.id === 'step1' || c.id === 'step2' || c.id === 'step3').
    reduce((s, c) => s + c.teams.length, 0);
  const notStarted = columns.find((c) => c.id === 'not-started').teams.length;

  // 결정 지표: 완료 팀수 / 총 팀수 (% 제외 — 운영자에게 실제 의미 있는 건 절대 숫자, 2026-05-29 사용자 피드백).
  const totalTeamsCount = teams.length;

  return (
    <>
      {/* 헤더 — 큰 숫자 메트릭 한 줄. live/refresh는 sticky 헤더 LiveStatus로 이관. */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, lineHeight: 1.2, margin: 0 }}>튜토리얼 진행률</h3>
        <span style={{ fontSize: 12.5, color: 'var(--c-slate)', display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>
            {completed}<span style={{ color: 'var(--c-muted)', fontSize: 12 }}>/{totalTeamsCount}</span>
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>팀 완료</span>
        </span>
      </div>

      {/* 5-단계 stacked 진행률 바 — 컬럼 색과 정합, hover로 단계별 팀 수 노출. width 전환으로 실시간 이동 시 부드러운 흐름. */}
      <TutorialProgressBar columns={columns} totalTeamsCount={totalTeamsCount} />

      <TutorialKanban columns={columns} />
    </>);

}

// ── 튜토리얼 진행률 바 — 5단계 stacked + hover 툴팁 ─────────────
// 각 segment 폭 = column.teams.length / totalTeamsCount * 100%. 빈 단계는 width 0 → 자연스러운 collapse.
// width 전환(--dur-base)으로 실시간 카드 이동과 동기화된 페이싱.
function TutorialProgressBar({ columns, totalTeamsCount }) {
  const [hoverCol, setHoverCol] = React.useState(null);

  // 누적 % — hover 툴팁의 left 위치 계산용.
  let cumulative = 0;
  const segments = columns.map((col) => {
    const pct = totalTeamsCount ? col.teams.length / totalTeamsCount * 100 : 0;
    const seg = { ...col, pct, centerPct: cumulative + pct / 2 };
    cumulative += pct;
    return seg;
  });
  const hovered = segments.find((s) => s.id === hoverCol);

  return (
    <div style={{ position: 'relative', marginBottom: 22 }}>
      <div style={{
        display: 'flex',
        height: 8,
        background: 'var(--c-stone)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        {segments.map((seg) =>
          <div
            key={seg.id}
            onMouseEnter={seg.teams.length > 0 ? () => setHoverCol(seg.id) : undefined}
            onMouseLeave={() => setHoverCol(null)}
            style={{
              width: `${seg.pct}%`,
              background: seg.barColor,
              transition: 'width var(--dur-base) var(--ease-decelerate), filter var(--dur-fast) var(--ease-standard)',
              filter: hoverCol === seg.id ? 'brightness(1.12)' : 'none',
              cursor: seg.teams.length > 0 ? 'default' : undefined
            }} />
        )}
      </div>
      {/* 범례 — 색 dot + 라벨 + 카운트 (v12 사용자 룰: b2-started 분포 바와 동일 어휘 추가) */}
      <div style={{
        display: 'flex', gap: 18,
        marginTop: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--c-slate)',
        letterSpacing: '0.02em'
      }}>
        {segments.map((seg) =>
          <span key={seg.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: seg.barColor,
              opacity: seg.teams.length > 0 ? 1 : 0.4
            }} />
            <span style={{ color: seg.teams.length > 0 ? 'var(--c-ink-3)' : 'var(--c-muted)' }}>{seg.shortLabel || seg.label}</span>
            <strong style={{
              fontWeight: 700,
              color: seg.teams.length > 0 ? 'var(--c-ink)' : 'var(--c-muted)'
            }}>{seg.teams.length}</strong>
          </span>
        )}
      </div>
      {hovered &&
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: `${hovered.centerPct}%`,
          transform: 'translateX(-50%)',
          background: 'var(--c-ink)', color: '#fff',
          padding: '5px 9px', borderRadius: 4,
          fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)', letterSpacing: '-0.005em',
          pointerEvents: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          zIndex: 10,
          display: 'inline-flex', alignItems: 'baseline', gap: 5
        }}>
          <span>{hovered.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, opacity: 0.85 }}>
            <strong style={{ fontWeight: 700 }}>{hovered.teams.length}</strong>팀
          </span>
          {/* 화살표 */}
          <span style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--c-ink)'
          }} />
        </div>
      }
    </div>);

}

// ── 튜토리얼 칸반 — 5열 (미시작 · Step1·2·3 · 완료) ─────────────
// 컨셉: "설계 격자지 위에 포스트잇 적층". DashboardShell 루트의 24px grid bg를 그대로 노출,
// 컬럼은 박스 없는 투명 zone. 컬럼 사이 dashed 수직선(드래프팅 가이드)으로 구분.
// 포스트잇 = RosterRow (대기 화면과 100% 동일 어휘: tape · rotation · ON/OFF count · 22px 미니 아바타).
// 페이지네이션 (2026-06-12 사용자 룰): 컬럼당 10팀, *컬럼별 독립* 페이지네이션.
//   각 컬럼이 자체 페이지 상태를 가짐 — 한 컬럼만 10초과면 그 컬럼 하단에만 페이지네이션 노출.
//   (구: 전체 칸 합산 단일 페이지네이션 → 폐기. 컬럼별로 팀 수가 달라 합산 페이징은 부적절.)
const TUTORIAL_PER_COL = 10;

function TutorialKanban({ columns }) {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 0
      }}>
        {columns.map((col, i) =>
        <TutorialKanbanColumn key={col.id} column={col} index={i} isLast={i === columns.length - 1} />
        )}
      </div>
    </div>);

}

function TutorialKanbanColumn({ column, index, isLast }) {
  const { paged, page, totalPages, onPrev, onNext } = useColumnPaging(column.teams, TUTORIAL_PER_COL);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: column.bg,
      padding: '0 12px',
      // 컬럼 사이 dashed 수직선 — 부모 grid stretch로 컬럼이 같은 높이가 되어 끝까지 내려옴.
      borderRight: isLast ? 'none' : '1px dashed rgba(45,42,36,0.20)',
      minHeight: 280
    }}>
      {/* 컬럼 헤더 — 박스 없이 step bg 위에 라벨만. 좌측 step accent 짧은 선(8px)이 단계 의미 단서. */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 18,
        padding: '10px 2px 10px',
        borderBottom: '1px solid rgba(45,42,36,0.12)'
      }}>
        <span style={{
          display: 'inline-block',
          width: 10, height: 3,
          background: column.accent,
          borderRadius: 1,
          flexShrink: 0
        }} />
        <span className="jt-mono" style={{
          fontSize: 9.5, color: 'var(--c-muted)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          flexShrink: 0
        }}>{String(index + 1).padStart(2, '0')}</span>
        <span style={{
          fontSize: 12.5, fontWeight: 700, color: 'var(--c-ink)',
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          minWidth: 0, flex: 1
        }}>{column.label}</span>
        <span className="jt-mono" style={{
          fontSize: 11, fontWeight: 700, color: column.accent,
          letterSpacing: '0.02em', flexShrink: 0
        }}>{column.teams.length}</span>
      </div>
      {/* 포스트잇 적층 zone — flex:1로 컬럼 본문이 stretch된 높이를 채움(빈 컬럼에서도 dashed가 끝까지). */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        paddingTop: 4, paddingBottom: 14,
        flex: 1
      }}>
        {paged.length === 0 &&
          <div className="jt-mono" style={{
            fontSize: 10, color: 'var(--c-muted)', textAlign: 'center',
            padding: '20px 0', letterSpacing: '0.08em',
            opacity: 0.5
          }}>·  ·  ·</div>
        }
        {paged.map((t) =>
          // key에 step 포함 → 팀이 이동하면 wrapper remount → entrance keyframe 재생.
          // 초기 마운트 시점엔 _moved=false이므로 클래스 미부여(애니메이션 없음).
          <div key={`${t.name}-${t.step}`} className={t._moved ? 'jt-kanban-card-enter' : undefined}>
            <RosterRow t={t} />
          </div>
        )}
      </div>
      {/* 컬럼별 페이지네이션 — 이 컬럼이 10팀 초과일 때만 하단에 노출 (marginTop:auto로 바닥 정렬). */}
      {totalPages > 1 &&
      <KanbanPagination compact page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} />
      }
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
  // 1인팀 — 가나다순
  '노유진': '나만의 영단어장',
  '류재석': '운동 기록 일지',
  '명도윤': '봉사활동 매칭',
  '백서아': '오답노트 정리',
  '손미래': '독서록 자동 요약',
  '우시현': '간단 가계부',
  '진하경': '하루 명언 카드',
  '천도현': '습관 트래커',
  '황태리': '학교 행사 알림'
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

// ── B-2 ⑤ 해커톤 진행 — 운영자 액션 중심 칸반 (2026-06-02 v3) ──
//
// v1: 30팀 라이브 미리보기 그리드 (폐기 — 운영자 의사결정 무익).
// v2 (2026-06-01): 4단 우선순위 row-list + 포스트잇 통일.
// v3 (2026-06-02): 튜토리얼 운영자 페이지(TutorialProgressView/TutorialKanban) 어휘 정렬 + UX 라이팅 정비.
//   변경 사항:
//     - P0/P1/P3 코드 라벨 폐기 → 운영자 언어("지금 손들었어요" 등) 채택
//     - 5열 칸반: 손든 팀 zone(span 2) + 챙겨야 할 팀 zone(span 3). 튜토리얼 칸반과 동일한 dashed 수직 divider
//     - 손든 팀 포스트잇: helmet-soft tint로 시각 강조 (§18-27 단일 흰색 룰의 합리적 예외 — 상태 신호로서)
//     - 챙겨야 할 팀 포스트잇: 흰색 유지 + 좌측 alert dot으로 위험/주의 분리 (§18-18 룰)
//     - 팀 카드 크기: RosterRow와 동일 60px 컴팩트 (다른 화면과 일관)
//     - 불참 팀: 접힘 섹션으로 강등 (행사 안 들어온 팀은 운영자 의사결정 거의 영향 없음 — 출석 확인용 ledger)
// 정렬 원칙: 칸반 내부 카드는 심각도 큰 순 (손든 팀 = 오래 기다린 순, 정체 팀 = 오래 멈춘 순)
// FLIP 애니메이션 hook — 자식 DOM 위치가 바뀌면 Web Animations API로 부드럽게 보간.
// 사용: const setRef = useFlip([deps]); ... <div ref={setRef(key)}>
// 자식이 absolute나 transform 등으로 이미 움직이는 경우 충돌 가능 — 정적 flow 자식에만 적용.
function useFlip(deps) {
  const refs = React.useRef(new Map());
  const prev = React.useRef(new Map());
  React.useLayoutEffect(() => {
    refs.current.forEach((el, key) => {
      if (!el || !el.isConnected) return;
      const newRect = el.getBoundingClientRect();
      const oldRect = prev.current.get(key);
      if (oldRect && (oldRect.top !== newRect.top || oldRect.left !== newRect.left)) {
        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;
        if (typeof el.animate === 'function') {
          el.animate([
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: 'translate(0, 0)' }],
            { duration: 480, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
        }
      }
      prev.current.set(key, newRect);
    });
    Array.from(prev.current.keys()).forEach((key) => {
      if (!refs.current.has(key)) prev.current.delete(key);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return React.useCallback((key) => (el) => {
    if (el) refs.current.set(key, el);else
    refs.current.delete(key);
  }, []);
}

function ActivityView({ teams: initialTeams, totalTeams }) {
  const [absentOpen, setAbsentOpen] = React.useState(false);
  const [teams, setTeams] = React.useState(initialTeams);

  // 라이브 시뮬레이션 — 토큰 증가, 손든 팀 가끔 해제, 새 손든 팀 가끔 등장.
  React.useEffect(() => {
    const tick = setInterval(() => {
      setTeams((prev) => {
        // 30% 확률로 일부 활동 팀 토큰 증가 (순위 변동 유도)
        return prev.map((t) => {
          if (!t.firstActivity) return t;
          // 손든 카운트다운(시각 효과 — 자동 해제는 아님)
          let next = t;
          if (t.handRaisedSec != null) {
            next = { ...next, handRaisedSec: t.handRaisedSec + 2 };
          }
          // 토큰 증가
          if (Math.random() < 0.35) {
            const delta = 200 + Math.floor(Math.random() * 1800);
            next = { ...next, tokensUsed: t.tokensUsed + delta };
          }
          return next;
        });
      });
    }, 2200);
    return () => clearInterval(tick);
  }, []);

  // 손든 해결 핸들러 — 카드 즉시 제거
  const resolveHandRaise = React.useCallback((teamName) => {
    setTeams((prev) => prev.map((t) =>
    t.name === teamName ? { ...t, handRaisedSec: null } : t)
    );
  }, []);

  // 분류
  const handRaised = teams.
    filter((t) => t.handRaisedSec != null).
    sort((a, b) => b.handRaisedSec - a.handRaisedSec);

  const absent = teams.filter((t) => !t.firstActivity);

  // 활동 팀 = 입장 후 활동 있는 모든 팀 (손든 팀도 포함 — 손든 팀은 별도 zone에 노출되지만 정상/주의/위험 단계에도 분류).
  // 분포 바 100% 보장: normalCount + warning + risky + absent.length == teams.length.
  const activeTeams = teams.filter((t) => t.firstActivity);
  const risky = activeTeams.
    filter((t) => t.idleMin >= 20).
    sort((a, b) => b.idleMin - a.idleMin);
  const warning = activeTeams.
    filter((t) => t.idleMin >= 10 && t.idleMin < 20).
    sort((a, b) => b.idleMin - a.idleMin);
  // 잠시 멈춤 zone 카드는 손든 팀 제외 (손든 zone과 중복 노출 회피)
  const alerts = [...risky, ...warning].filter((t) => t.handRaisedSec == null);
  const normalCount = activeTeams.filter((t) => t.idleMin < 10).length;

  const tokenRanked = teams.
    filter((t) => t.firstActivity && t.tokensUsed > 0).
    sort((a, b) => b.tokensUsed - a.tokensUsed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
      <ActivityHeader
        normalCount={normalCount}
        totalTeams={totalTeams}
        absentCount={absent.length}
        onAbsentClick={() => setAbsentOpen(true)} />

      <ActivityDistributionBar
        segments={[
        { id: 'normal', label: '정상',  count: normalCount,    color: 'var(--c-mint)' },
        { id: 'warn',   label: '주의',  count: warning.length, color: 'var(--c-helmet)' },
        { id: 'risk',   label: '위험',  count: risky.length,   color: 'var(--c-safety)' },
        { id: 'absent', label: '불참',  count: absent.length,  color: 'var(--c-stone-2)' }]}

        totalTeams={totalTeams} />


      {/* 6열 단일 칸반 — 토큰 2col(카드+막대) + 손든 2col + 잠시 멈춤 2col. 각 zone 10행. */}
      <ActivityKanban
        tokenRanked={tokenRanked}
        handRaised={handRaised}
        alerts={alerts}
        onResolveHandRaise={resolveHandRaise} />

      {/* 불참 팀 모달 — 헤더 우측 텍스트 버튼 클릭으로 열림. */}
      {absentOpen && <AbsentTeamsModal teams={absent} onClose={() => setAbsentOpen(false)} />}
    </div>);

}

// 토큰 수 축약 — 1.2M / 22.5k / 820 (2026-06-02 사용자 룰).
// 천 단위 미만: 그대로. < 1M: "x.xk". ≥ 1M: "x.xM". 정수면 소숫점 생략.
// 사용처: TokenBarCell (TokenLeaderZone 내부).
function formatTokens(n) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return k >= 100 ? `${Math.round(k)}k` : `${k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  const m = n / 1_000_000;
  return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1).replace(/\.0$/, '')}M`;
}

// ── 불참 팀 모달 — 포스트잇 모달 어휘 (RosterTeamDetailModal 차용) ──
// 2026-06-02 사용자 룰: 헤더 우측 텍스트 버튼 클릭 → 포스트잇 모달로 목록 열람.
// 모달 본문은 작은 포스트잇 grid + 페이지네이션 (한 페이지 10팀).
const ABSENT_PER_PAGE = 10;

function AbsentTeamsModal({ teams, onClose }) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(teams.length / ABSENT_PER_PAGE));
  const clampedPage = Math.min(page, totalPages);
  const pagedTeams = teams.slice(
    (clampedPage - 1) * ABSENT_PER_PAGE,
    clampedPage * ABSENT_PER_PAGE
  );
  // 모달 자체 회전·tape는 첫 팀명 hash로 결정 (시각 정체성)
  const modalRot = postitRotation(teams[0]?.name || 'absent');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="행사에 입장하지 않은 팀 목록"
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
      {/* 백드롭 */}
      <div
        onClick={onClose}
        data-action="close-absent"
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--c-backdrop)',
          backdropFilter: 'blur(var(--backdrop-blur))',
          cursor: 'pointer'
        }} />
      {/* 모달 카드 */}
      <ModalSurface
        width={680}
        variant="postit"
        entrance="fade"
        ariaLabel="행사에 입장하지 않은 팀 목록"
        className="jt-postit-tape-lg"
        style={{
          maxHeight: 'calc(100% - 80px)',
          '--postit-rot': modalRot,
          '--postit-tint': 'var(--c-canvas)'
        }}>

        {/* 헤더 */}
        <div style={{
          flex: '0 0 auto',
          padding: '22px 28px 14px',
          borderBottom: '1px solid var(--c-hairline)',
          display: 'flex', alignItems: 'baseline', gap: 10
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.25 }}>
            행사에 입장하지 않은 팀
          </h2>
          <span className="jt-mono" style={{
            fontSize: 12, fontWeight: 700, color: 'var(--c-ink-3)',
            letterSpacing: '0.02em'
          }}>{teams.length}팀</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            data-action="close-absent"
            aria-label="닫기"
            className="jt-icon-btn"
            style={{ color: 'var(--c-slate)' }}>
            {Icon.x(14)}
          </button>
        </div>

        {/* 안내 한 줄 */}
        <div style={{
          flex: '0 0 auto',
          padding: '10px 28px 0',
          fontSize: 12, color: 'var(--c-slate)',
          fontFamily: 'var(--font-mono)', letterSpacing: '0.02em'
        }}>
          팀원 전원 미접속 · 출석 확인이 필요해요
        </div>

        {/* 본문 — 팀원 목록(RosterMemberRow)과 동일 리스트 어휘 (2026-06-02 사용자 룰 v5). */}
        <div style={{
          flex: '1 1 auto', minHeight: 0,
          padding: '10px 18px 14px',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 2
        }}>
          <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', padding: '6px 8px 6px', flexShrink: 0 }}>
            미입장 {teams.length}팀
          </div>
          {pagedTeams.map((t) => <AbsentTeamRow key={t.name} team={t} />)}
        </div>

        {/* 페이지네이션 (한 페이지 10팀) */}
        {totalPages > 1 &&
        <div style={{ flex: '0 0 auto', borderTop: '1px solid var(--c-hairline)' }}>
            <KanbanPagination
            page={clampedPage}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />

          </div>
        }
      </ModalSurface>
    </div>);

}

// ── 진행 화면 헤더 — 큰 숫자 메트릭 ───────────────────────────
// 튜토리얼 대시보드 헤더(line 758~767)와 동일 어휘 — h3 + 큰 숫자 + /총팀 + 의미 라벨.
// 결정 지표: "순항 N / 총 M" — 운영자의 baseline (튜토리얼 "팀 완료"와 같은 위계).
// 우측: 불참 팀 텍스트 버튼 (사용자 룰 2026-06-02 — 갤러리 공개 자리에 배치, 클릭 시 포스트잇 모달).
function ActivityHeader({ normalCount, totalTeams, absentCount, onAbsentClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
      <h3 style={{ fontSize: 16, lineHeight: 1.2, margin: 0 }}>해커톤 진행상황</h3>
      <span style={{ fontSize: 12.5, color: 'var(--c-slate)', display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>
          {normalCount}<span style={{ color: 'var(--c-muted)', fontSize: 12 }}>/{totalTeams}</span>
        </span>
        <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>순항</span>
      </span>
      <span style={{ flex: 1 }} />
      {absentCount > 0 &&
      <button
        type="button"
        data-action="open-absent"
        onClick={onAbsentClick}
        title="행사에 입장하지 않은 팀 목록 보기"
        style={{
          all: 'unset',
          display: 'inline-flex', alignItems: 'baseline', gap: 4,
          cursor: 'pointer',
          fontSize: 12.5,
          color: 'var(--c-slate)',
          padding: '2px 4px',
          borderRadius: 4,
          transition: 'color var(--dur-fast) var(--ease-standard), background-color var(--dur-fast) var(--ease-standard)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--c-ink)';
          e.currentTarget.style.background = 'var(--c-stone)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--c-slate)';
          e.currentTarget.style.background = 'transparent';
        }}>
          <span>행사 미입장</span>
          <span style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: 'var(--c-ink)', letterSpacing: '-0.01em'
        }}>{absentCount}</span>
          <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>팀</span>
          <span style={{ marginLeft: 4, color: 'var(--c-muted)', fontSize: 10, display: 'inline-flex', alignSelf: 'center' }}>{Icon.arrowRight(11)}</span>
        </button>
      }
    </div>);

}

// ── 4-단계 분포 stacked bar — TutorialProgressBar 어휘 차용 ────
// 각 segment 폭 = count / totalTeams * 100%. hover 시 단계명·팀 수 툴팁.
// 색상 위계: 정상(mint) → 주의(helmet) → 위험(safety) → 불참(stone-2 회색).
function ActivityDistributionBar({ segments, totalTeams }) {
  const [hoverId, setHoverId] = React.useState(null);

  let cumulative = 0;
  const computed = segments.map((seg) => {
    const pct = totalTeams ? seg.count / totalTeams * 100 : 0;
    const s = { ...seg, pct, centerPct: cumulative + pct / 2 };
    cumulative += pct;
    return s;
  });
  const hovered = computed.find((s) => s.id === hoverId);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        height: 8,
        background: 'var(--c-stone)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        {computed.map((seg) =>
        <div
          key={seg.id}
          onMouseEnter={seg.count > 0 ? () => setHoverId(seg.id) : undefined}
          onMouseLeave={() => setHoverId(null)}
          style={{
            width: `${seg.pct}%`,
            background: seg.color,
            transition: 'width var(--dur-base) var(--ease-decelerate), filter var(--dur-fast) var(--ease-standard)',
            filter: hoverId === seg.id ? 'brightness(1.12)' : 'none',
            cursor: seg.count > 0 ? 'default' : undefined
          }} />

        )}
      </div>
      {/* 범례 — 항상 노출, mono 작은 글자. 색 dot + 라벨 + 카운트 */}
      <div style={{
        display: 'flex', gap: 18,
        marginTop: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--c-slate)',
        letterSpacing: '0.02em'
      }}>
        {computed.map((seg) =>
        <span key={seg.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: seg.color,
            opacity: seg.count > 0 ? 1 : 0.4
          }} />
            <span style={{ color: seg.count > 0 ? 'var(--c-ink-3)' : 'var(--c-muted)' }}>{seg.label}</span>
            <strong style={{
            fontWeight: 700,
            color: seg.count > 0 ? 'var(--c-ink)' : 'var(--c-muted)'
          }}>{seg.count}</strong>
          </span>
        )}
      </div>
      {hovered &&
      <div style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: `${hovered.centerPct}%`,
        transform: 'translateX(-50%)',
        background: 'var(--c-ink)', color: '#fff',
        padding: '5px 9px', borderRadius: 4,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
        fontFamily: 'var(--font-body)', letterSpacing: '-0.005em',
        pointerEvents: 'none',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        zIndex: 10,
        display: 'inline-flex', alignItems: 'baseline', gap: 5
      }}>
          <span>{hovered.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, opacity: 0.85 }}>
            <strong style={{ fontWeight: 700 }}>{hovered.count}</strong>팀
          </span>
          <span style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--c-ink)'
        }} />
        </div>
      }
    </div>);

}

// ── 활동 칸반 — 손든 팀(2col) + 챙겨야 할 팀(3col) ────────────
// 튜토리얼 칸반(TutorialKanban/TutorialKanbanColumn)과 동일 어휘:
//   · 5컬럼 grid, gap 0
//   · 각 zone은 wash bg + 12px 좌우 padding
//   · zone 사이 dashed 수직 divider (튜토리얼 컬럼 divider와 동일 어휘)
//   · zone 헤더: accent 10×3 short bar + 의미 라벨 + 우측 count
//   · 본문은 minHeight 280px, 빈 zone은 "·  ·  ·" placeholder
// 활동 칸반 (2026-06-02 v7): 5열 grid · 3 zone 비균등.
//   토큰 zone(span 1): 카드 1열 적층, 카드 안 두번째 행에 가로 막대 그래프 통합.
//   손든 zone(span 2): 2col sub-grid × 10행 = 20 카드/페이지
//   잠시 멈춤 zone(span 2): 2col sub-grid × 10행 = 20 카드/페이지
// 페이지당 10행 (2026-06-12 갱신): 토큰 zone 상위 10팀 높이와 맞춰 2col zone도 페이지당 20카드(10행)로 채움.
//   → 카드가 컬럼 높이를 채워 페이지네이션이 바로 아래 붙음(빈 공백 + 바닥 페이지네이션의 "헷갈림" 해소).
const ROWS_PER_PAGE = 10;
const TOKEN_TOP_N = 10; // 토큰 순위 상위 노출 수 (페이지네이션 대신 상위 N만 고정 노출)
const HAND_RAISED_PER_PAGE = ROWS_PER_PAGE * 2; // 2col × 10행 = 20
const ALERTS_PER_PAGE = ROWS_PER_PAGE * 2; // 2col × 10행 = 20

// 페이지네이션 (2026-06-12 사용자 룰): zone별 *독립* 페이지네이션.
//   각 zone(토큰·손든·잠시 멈춤)이 자체 페이지 상태를 가짐 — 해당 zone이 perPage 초과일 때만 그 zone 하단에 노출.
//   (구: 세 zone 중 최대 페이지 수로 합산 단일 페이지네이션 → 폐기. zone마다 팀 수가 달라 합산 페이징은 부적절.)
function ActivityKanban({ tokenRanked, handRaised, alerts, onResolveHandRaise }) {
  const maxTokens = tokenRanked[0]?.tokensUsed || 1;

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 0
      }}>
        {/* 토큰 zone — 단일 col 카드 적층 (각 카드 안에 막대 그래프 통합). zone 내부에서 자체 페이지네이션. */}
        <TokenLeaderZone
          teams={tokenRanked}
          maxTokens={maxTokens}
          isLast={false} />

        {/* 손든 zone (v10: helmet 어휘 회귀 — 사용자 결정. 주의(helmet-wash)와는 채도/명도 차이로 분리) */}
        <ActivityKanbanZone
          span={2}
          cols={2}
          accent="var(--c-helmet-deep)"
          bg="rgba(255, 206, 43, 0.07)"
          icon={Icon.hand(13)}
          label="지금 손들었어요"
          sub="학생이 도움을 요청했어요"
          count={handRaised.length}
          countColor="var(--c-helmet-deep)"
          emptyMessage="손든 팀 없음 — 좋아요"
          emptyMint={false}
          isLast={false}
          items={handRaised}
          perPage={HAND_RAISED_PER_PAGE}
          renderItem={(t) => <HandRaisedPostit key={t.name} team={t} onResolve={onResolveHandRaise} />} />

        {/* 잠시 멈춤 zone (safety 어휘) */}
        <ActivityKanbanZone
          span={2}
          cols={2}
          accent="var(--c-safety)"
          bg="rgba(255, 107, 31, 0.045)"
          icon={Icon.clock(13)}
          label="잠시 멈춰 있어요"
          sub="10분 이상 입력 없음"
          info={'기준: 마지막 학생 입력 후 경과 시간\n• AI 응답 대기·생성 중은 제외해요\n• 🟡 주의 10~20분  • 🔴 위험 20분 이상'}
          count={alerts.length}
          countColor={alerts.length > 0 ? 'var(--c-safety-deep)' : 'var(--c-muted)'}
          emptyMessage="모든 팀 잘 가고 있어요"
          emptyMint={true}
          isLast={true}
          items={alerts}
          perPage={ALERTS_PER_PAGE}
          renderItem={(t) => <AlertPostit key={t.name} team={t} />} />
      </div>
    </div>);

}

// ── 토큰 zone — 단일 col 카드 적층, 카드 안에 막대 그래프 통합 (2026-06-02 v7) ─
// span 1. 카드 1행: 순위 + 팀명. 2행: 가로 막대 + 축약 라벨. 인원수 표시 제거.
function TokenLeaderZone({ teams, maxTokens, isLast }) {
  const isEmpty = teams.length === 0;
  // 페이지네이션 없음 (2026-06-12 사용자 룰) — 순위는 상위권만 의미 있으므로 상위 TOKEN_TOP_N팀만 고정 노출.
  const paged = teams.slice(0, TOKEN_TOP_N);
  const startRank = 1;
  // FLIP — 순위 변동 시 카드 위치 부드럽게 (Web Animations API).
  const keySig = paged.map((t) => t.name).join('|');
  const setFlipRef = useFlip([keySig]);
  return (
    <div style={{
      gridColumn: 'span 1',
      display: 'flex', flexDirection: 'column',
      background: 'rgba(46, 44, 138, 0.045)', /* v12: 보라(tutorial) wash — 막대 색과 시각 정합 */
      padding: '0 10px',
      borderRight: isLast ? 'none' : '1px dashed rgba(45,42,36,0.20)',
      minHeight: 320
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 14,
        padding: '12px 2px 12px',
        borderBottom: '1px solid rgba(45,42,36,0.12)'
      }}>
        <span style={{
          display: 'inline-block',
          width: 10, height: 3,
          background: 'var(--c-tutorial)',
          borderRadius: 1,
          flexShrink: 0
        }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--c-tutorial)',
          flexShrink: 0
        }}>
          {Icon.bolt(13)}
        </span>
        <span style={{
          fontSize: 13.5, fontWeight: 700, color: 'var(--c-ink)',
          letterSpacing: '-0.005em',
          flexShrink: 0
        }}>AI 사용량 순위</span>
        <span style={{ flex: 1 }} />
      </div>
      {isEmpty ?
      <KanbanEmpty message="아직 토큰 사용 기록 없음" /> :

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8, /* rowGap 8 (다른 zone과 동일) */
        paddingTop: 4, paddingBottom: 16,
        flex: 1
      }}>
          {paged.map((t, i) =>
        <div key={t.name} ref={setFlipRef(t.name)}>
              <TokenTeamCard team={t} rank={startRank + i} max={maxTokens} />
            </div>
        )}
        </div>
      }
    </div>);

}

// 토큰 카드 — v12: 전부 흰색 카드 + 모든 막대 tutorial purple 통일 (사용자 룰).
function TokenTeamCard({ team, rank, max }) {
  const rot = postitRotation(team.name);
  const tokensLabel = formatTokens(team.tokensUsed);
  const fullLabel = team.tokensUsed.toLocaleString('en-US');
  const pct = Math.max(2, Math.round(team.tokensUsed / max * 100));
  const barColor = 'var(--c-tutorial)';
  return (
    <div
      className="jt-postit-card jt-postit-card-static"
      aria-label={`${team.name} 팀 — ${rank}위, 토큰 ${fullLabel}`}
      title={`${team.name} · ${fullLabel} tokens`}
      style={{
        '--postit-rot': rot,
        '--postit-tint': 'var(--c-canvas)',
        background: 'var(--c-canvas)',
        borderRadius: 'var(--r-xs)',
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 6,
        height: 66 /* 3 zone 카드 높이 통일 (2026-06-12): 손든 해결버튼 카드와 동일 높이 */
      }}>
      {/* 1행 — 순위 + 팀명 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="jt-mono" style={{
          fontSize: 10, fontWeight: 700,
          color: 'var(--c-muted)',
          letterSpacing: '0.02em',
          flexShrink: 0,
          minWidth: 22
        }}>
          #{rank}
        </span>
        <span title={team.name} style={{
          flex: 1, minWidth: 0,
          fontSize: 12.5, fontWeight: 700,
          color: 'var(--c-ink)', letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{team.name}</span>
      </div>
      {/* 2행 — 가로 막대 + 라벨 (1등만 blue) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 'auto'
      }}>
        <div style={{
          flex: 1, minWidth: 0,
          height: 6,
          background: 'var(--c-stone)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: barColor,
            borderRadius: 3,
            transition: 'width var(--dur-base) var(--ease-decelerate)'
          }} />
        </div>
        <span className="jt-mono" style={{
          fontSize: 10.5, fontWeight: 700,
          color: 'var(--c-ink)',
          letterSpacing: '-0.005em',
          flexShrink: 0,
          minWidth: 42, textAlign: 'right'
        }}>{tokensLabel}</span>
      </div>
    </div>);

}

// ── 칸반 zone — 튜토리얼 TutorialKanbanColumn(L867) 어휘 차용 ─
// cols: zone 내부 sub-grid 열 수. 손든=2 / 챙겨야 할=3 → 튜토리얼 1컬럼 폭(~225px)과 동일 카드 사이즈.
// span: 외부 5컬럼 grid에서 차지하는 column 수.
// info: sub 옆에 (i) 아이콘 + native title 툴팁. 정체 기준 같이 명확화 필요할 때.
function ActivityKanbanZone({ span, cols, accent, bg, icon, label, sub, info, count, countColor, isLast, emptyMessage, emptyMint, items, perPage, renderItem }) {
  // zone 자체 페이지네이션 (2026-06-12) — items를 perPage 단위로 슬라이스, 해당 zone 하단에만 노출.
  const { paged, page, totalPages, onPrev, onNext } = useColumnPaging(items, perPage);
  const isEmpty = items.length === 0;
  const childArr = paged.map((t) => renderItem(t));
  // FLIP — 자식 카드(React key=팀명) 위치 변경 시 부드럽게 보간.
  // deps: 자식 key 시퀀스 (위치 바뀜 감지).
  const keySig = childArr.map((c) => c.key).join('|');
  const setFlipRef = useFlip([keySig]);
  return (
    <div style={{
      gridColumn: `span ${span}`,
      display: 'flex', flexDirection: 'column',
      background: bg,
      padding: '0 10px', /* v9: padding 16→10 (카드 사이 거리 축소) */
      borderRight: isLast ? 'none' : '1px dashed rgba(45,42,36,0.20)',
      minHeight: 320
    }}>
      {/* zone 헤더 — 튜토리얼 컬럼 헤더와 동일 어휘 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 14,
        padding: '12px 2px 12px',
        borderBottom: '1px solid rgba(45,42,36,0.12)'
      }}>
        <span style={{
          display: 'inline-block',
          width: 10, height: 3,
          background: accent,
          borderRadius: 1,
          flexShrink: 0
        }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: accent,
          flexShrink: 0
        }}>
          {icon}
        </span>
        <span style={{
          fontSize: 13.5, fontWeight: 700, color: 'var(--c-ink)',
          letterSpacing: '-0.005em',
          flexShrink: 0
        }}>{label}</span>
        <span style={{
          fontSize: 11.5, color: 'var(--c-slate)',
          flexShrink: 0,
          minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>· {sub}</span>
        {info &&
        <span
          title={info}
          aria-label={info}
          style={{
            color: 'var(--c-muted)', display: 'inline-flex',
            cursor: 'help', flexShrink: 0
          }}>
            {Icon.info(12)}
          </span>
        }
        <span style={{ flex: 1 }} />
        <span className="jt-mono" style={{
          fontSize: 12, fontWeight: 700,
          color: countColor || accent,
          letterSpacing: '0.02em', flexShrink: 0
        }}>{count}</span>
      </div>
      {/* 본문 — sub-grid (zone span과 동일 cols). 카드 폭이 외부 5컬럼 grid의 1컬럼 폭과 일치 → 튜토리얼 칸반 카드와 동일 사이즈. */}
      {isEmpty ?
      <KanbanEmpty message={emptyMessage} mint={emptyMint} /> :

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        // columnGap = zone padding의 2배 → 토큰 zone(single col) 카드 폭과 동일 정렬.
        // v9: padding 10 → columnGap 20 (직전 32에서 축소).
        columnGap: 20,
        rowGap: 8,
        paddingTop: 4, paddingBottom: 16,
        flex: 1,
        alignContent: 'start'
      }}>
          {childArr.map((child) =>
        <div key={child.key} ref={setFlipRef(child.key)}>{child}</div>
        )}
        </div>
      }
      {/* zone별 페이지네이션 — 이 zone 팀이 perPage 초과일 때만 하단에 노출. */}
      {totalPages > 1 &&
      <KanbanPagination compact page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} />
      }
    </div>);

}

function KanbanEmpty({ message, mint = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '32px 12px 28px',
      color: mint ? 'var(--c-mint)' : 'var(--c-muted)',
      fontSize: 12.5,
      fontWeight: mint ? 600 : 500,
      opacity: mint ? 1 : 0.7,
      letterSpacing: '-0.005em',
      flex: 1
    }}>
      {mint && Icon.check(14)}
      <span>{message}</span>
    </div>);

}

// ── 칸반 컬럼별 페이지네이션 hook (2026-06-12 사용자 룰) ─────────────
// 각 칸반 컬럼/zone이 독립 페이지 상태를 가짐 (전체 칸 합산 페이지네이션 폐기).
// 컬럼마다 팀 수가 달라도 다른 컬럼에 영향 없이 해당 컬럼만 페이지 이동.
function useColumnPaging(items, perPage) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const clampedPage = Math.min(page, totalPages);
  const paged = items.slice((clampedPage - 1) * perPage, clampedPage * perPage);
  return {
    paged,
    page: clampedPage,
    totalPages,
    onPrev: () => setPage(() => Math.max(1, clampedPage - 1)),
    onNext: () => setPage(() => Math.min(totalPages, clampedPage + 1))
  };
}

// ── 칸반 페이지네이션 — 디자인 시스템 Pagination(shared.jsx) 칩 어휘 정렬 (2026-06-12) ─
// DS 어휘: jt-btn-secondary 버튼(이전/다음) + 박스형 mono 칩(canvas bg + hairline border)로 페이지 표기.
//   (구: jt-btn-ghost + 맨 span → 다른 화면 페이지네이션과 시각 불일치. 사용자 지적으로 DS 정렬.)
//   카드 개수 대신 페이지 카운트("p / total")를 칩에 표기 — 칸반 컬럼은 항목 범위보다 페이지가 직관적.
// compact=true: 컬럼/zone 하단용 — marginTop:auto로 stretch된 컬럼 바닥 정렬, 상단 패딩 축소.
function KanbanPagination({ page, totalPages, onPrev, onNext, compact = false }) {
  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
      padding: compact ? '12px 0 4px' : '20px 0 4px',
      ...(compact ? { marginTop: 'auto' } : {})
    }}>
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        className={`jt-btn jt-btn-secondary jt-btn-sm ${prevDisabled ? 'is-disabled' : ''}`}
        style={{ padding: '6px 12px', gap: 4 }}>
        {Icon.arrowLeft(11)} 이전
      </button>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink)',
        background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
        padding: '6px 14px', borderRadius: 4,
        whiteSpace: 'nowrap', flexShrink: 0
      }}>
        {page} <span style={{ color: 'var(--c-muted)' }}>/ {totalPages}</span>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={`jt-btn jt-btn-secondary jt-btn-sm ${nextDisabled ? 'is-disabled' : ''}`}
        style={{ padding: '6px 12px', gap: 4 }}>
        다음 {Icon.arrowRight(11)}
      </button>
    </div>);

}

// ── 손든 팀 포스트잇 ──────────────────────────────────────────
// 사용자 룰(2026-06-02): 손든 팀은 포스트잇 색으로 강조.
// §18-27 단일 흰색 룰의 합리적 예외 — *팀 정체성*이 아닌 *현재 상태 신호*로 색 부여.
// helmet-soft 옅은 노랑 tint + tape는 그대로. 다른 화면(RosterRow 등)에선 같은 팀이라도 흰색 유지 → 색은 "이 화면 이 순간" 한정.
// 컴팩트 사이즈 (RosterRow와 동일 60px 높이) — 다른 화면과 일관.
//
// 손들기 해제 정책 (2026-06-02 사용자 룰 갱신):
//   2분 자동 해제 폐기. 해제 경로 2가지만 — ① 운영자 [해결] 버튼  ② 학생이 직접 손들기 토글 끔.
//   → 카드 우측 하단 [해결] chip 버튼으로 운영자 액션 채널 제공.
// 손든 포스트잇 — helmet 어휘 (v10 2026-06-02 사용자 결정).
// 주의(helmet-wash)와는 명도 차이(helmet-soft #fff4c2 vs helmet-wash #fbf6df)로 분리.
function HandRaisedPostit({ team, onResolve }) {
  const elapsed = formatHandRaisedElapsed(team.handRaisedSec);
  const memberLabel = team.solo ? '1인' : `${team.members}명`;
  const rot = postitRotation(team.name);
  return (
    <div
      className="jt-postit-card jt-postit-card-static"
      aria-label={`${team.name} 팀 — 손들기 ${elapsed} 전`}
      title={`${team.name} · ${memberLabel} · 손든지 ${elapsed} 전`}
      style={{
        '--postit-rot': rot,
        '--postit-tint': 'var(--c-helmet-soft)',
        background: 'var(--c-helmet-soft)',
        borderRadius: 'var(--r-xs)',
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 4,
        height: 66 /* 3 zone 카드 높이 통일 (2026-06-12) */
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--c-helmet-deep)', display: 'inline-flex', flexShrink: 0 }}>
          {Icon.hand(13)}
        </span>
        <span title={team.name} style={{
          flex: 1, minWidth: 0,
          fontSize: 12.5, fontWeight: 700,
          color: 'var(--c-stache)', letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{team.name}</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
        marginTop: 'auto'
      }}>
        <span className="jt-mono" style={{
          fontSize: 10.5, fontWeight: 700,
          color: 'var(--c-helmet-deep)',
          letterSpacing: '0.02em'
        }}>
          {elapsed} 전
        </span>
        <button
          type="button"
          data-action="resolve-hand-raise"
          onClick={(e) => {
            e.stopPropagation();
            onResolve && onResolve(team.name);
          }}
          title="해결됨으로 표시 — 이 손들기를 끕니다"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            height: 18, padding: '0 9px',
            border: '1px solid var(--c-stache)',
            background: 'var(--c-canvas)',
            color: 'var(--c-stache)',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'inherit',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '-0.005em',
            cursor: 'pointer',
            transition: 'background-color var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--c-stache)';
            e.currentTarget.style.color = 'var(--c-canvas)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--c-canvas)';
            e.currentTarget.style.color = 'var(--c-stache)';
          }}>
          {Icon.check(11)} 해결
        </button>
      </div>
    </div>);

}

function formatHandRaisedElapsed(sec) {
  if (sec < 60) return `${sec}초`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m}분` : `${m}분 ${s}초`;
}

// ── 챙겨야 할 팀 (정체) 포스트잇 ─────────────────────────────
// 손든 팀과 달리 *카드 색은 흰색* 유지 (§18-27, §18-18 룰).
// 시그널: 좌측 dot(위험=safety / 주의=helmet) + 우측 mono 무활동 시간 색·weight.
// 컴팩트 사이즈 (RosterRow와 동일 60px) — 화면 어휘 일관.
function AlertPostit({ team }) {
  const severity = team.idleMin >= 20 ? 'risky' : 'warning';
  const tone = severity === 'risky' ? 'var(--c-safety-deep)' : 'var(--c-helmet-deep)';
  const dotColor = severity === 'risky' ? 'var(--c-safety)' : 'var(--c-helmet)';
  const dotHalo = severity === 'risky' ? 'rgba(255,107,31,0.18)' : 'rgba(255,206,43,0.18)';
  // 사용자 룰 (2026-06-02): 위험·주의 카드 색 분리. 손든 helmet-soft와 충돌 회피 위해 주의는 helmet-wash(더 옅은 노랑), 위험은 safety-soft(옅은 주황).
  // 위계: helmet-soft(손든) > safety-soft(위험) > helmet-wash(주의) > 흰색(정상) — 옅은 spectrum에서 손든이 가장 강조 유지.
  const tint = severity === 'risky' ? 'var(--c-safety-soft)' : 'var(--c-helmet-wash)';
  const severityLabel = severity === 'risky' ? '위험' : '주의';
  const severityDesc = severity === 'risky' ?
  '위험 — 20분 이상 학생 입력 없음 (AI 응답 시간은 제외). 직접 살펴봐주세요.' :
  '주의 — 10~20분 학생 입력 없음 (AI 응답 시간은 제외). 슬슬 확인해보세요.';
  const memberLabel = team.solo ? '1인' : `${team.members}명`;
  const rot = postitRotation(team.name);
  return (
    <div
      className="jt-postit-card jt-postit-card-static"
      aria-label={`${team.name} 팀 — ${severityLabel}, ${team.idleMin}분 입력 없음`}
      title={`${team.name} · ${memberLabel} · ${team.idleMin}분째 입력 없음`}
      style={{
        '--postit-rot': rot,
        '--postit-tint': tint,
        background: tint,
        borderRadius: 'var(--r-xs)',
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 6,
        height: 66 /* 3 zone 카드 높이 통일 (2026-06-12) */
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          title={severityDesc}
          aria-label={severityLabel}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
            cursor: 'help',
            boxShadow: severity === 'risky' ? `0 0 0 3px ${dotHalo}` : 'none'
          }} />
        <span title={team.name} style={{
          flex: 1, minWidth: 0,
          fontSize: 12.5, fontWeight: 700,
          color: 'var(--c-ink)', letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{team.name}</span>
        <span className="jt-mono" style={{
          fontSize: 10, color: 'var(--c-muted)',
          flexShrink: 0
        }}>{memberLabel}</span>
      </div>
      <div className="jt-mono" style={{
        fontSize: 11, fontWeight: 700,
        color: tone,
        letterSpacing: '0.02em',
        marginTop: 'auto'
      }}>
        {team.idleMin}분째 멈춤
      </div>
    </div>);

}

// 미입장 팀 row — 팀원 목록(RosterMemberRow, shared.jsx L572)과 동일 시각 어휘.
// 28px 아바타(팀명 끝 2자, opacity 0.5) + 우하단 회색 도트 + 팀명(muted) + 우측 인원 mono.
// 사용자 룰 v5 (2026-06-02): 미입장 모달은 포스트잇 grid 폐기, 리스트 형태로 통일.
function AbsentTeamRow({ team }) {
  const memberLabel = team.solo ? '1인' : `${team.members}명`;
  const teamLabel = team.name.length >= 2 ? team.name.slice(-2) : team.name;
  const color = rosterAvatarColor(team.name);
  const [hover, setHover] = React.useState(false);
  return (
    <div
      data-action="open-team"
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`${team.name} 팀 — 미입장, ${memberLabel}`}
      style={{
        position: 'relative',
        padding: '7px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderRadius: 6,
        background: hover ? 'rgba(20,19,15,0.05)' : 'rgba(20,19,15,0.025)',
        cursor: 'pointer',
        transition: 'background 120ms ease'
      }}>
      {/* 아바타 + 우하단 미입장 도트 (RosterMemberRow off 상태와 동일) */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '-0.04em',
          opacity: 0.5
        }}>{teamLabel}</div>
        <span style={{
          position: 'absolute',
          right: -1, bottom: -1,
          width: 9, height: 9, borderRadius: '50%',
          background: '#c94560',
          border: '2px solid var(--c-canvas)'
        }} />
      </div>
      {/* 팀명 (muted) */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--c-muted)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{team.name}</span>
      </div>
      {/* 우측 인원 mono */}
      <span className="jt-mono" style={{
        fontSize: 10.5, color: 'var(--c-muted)',
        flexShrink: 0
      }}>{memberLabel}</span>
    </div>);

}

// ── B-2 종료 — 결산 대시보드 (2026-06-02 재설계) ────────────────
// 이전: 핵심 지표 3 + 갤러리 CTA 띠 + 12팀 카드 그리드(D-1 갤러리와 중복).
// 결정: 카드 그리드는 D-1 갤러리와 어휘 중복이라 제거. 운영자가 종료 직후 알아야 할 정보는
//   ① 운영 결산(고정) — 행사 끝나면 안 바뀜: 참가팀·운영시간·AI 사용량 총량/곡선/순위
//   ② 갤러리 호응(라이브) — 종료 후에도 누적: 좋아요/댓글 총량·순위 + 갤러리 진입
//   두 영역의 시간 성격이 다르다는 점을 eyebrow 라벨·LIVE pulse로 시각 분리.
// 토큰·좋아요 순위는 b2-started TokenLeaderZone과 동일 어휘(jt-mono #N + 가로 막대)를 사용해
// 진행→종료 흐름의 시각 정합을 유지.
function SummaryView({ teams, totalTeams, judgingEntry = false }) {
  // ── 운영 결산(고정) ────────────────────────────────────────
  const totalTokens = React.useMemo(
    () => teams.reduce((s, t) => s + (t.tokensUsed || 0), 0),
    [teams]
  );
  const tokenRanked = React.useMemo(
    () => [...teams]
      .filter((t) => (t.tokensUsed || 0) > 0)
      .sort((a, b) => b.tokensUsed - a.tokensUsed),
    [teams]
  );
  const totalMembers = React.useMemo(
    () => teams.reduce((s, t) => s + (t.members || 0), 0),
    [teams]
  );
  const avgTokensPerTeam = totalTeams ? Math.round(totalTokens / totalTeams) : 0;

  // ── 갤러리 호응(라이브) ─────────────────────────────────────
  // 좋아요 mock은 토큰 활동량과 약한 양의 상관 + deterministic 노이즈로 산출.
  // 토큰 ≈ 활동 강도지만 "많이 쓴 팀이 꼭 인기 있는 건 아니다"라는 차이가 드러나도록 노이즈 비중을 크게.
  const [likesMap, setLikesMap] = React.useState(() => {
    const map = {};
    teams.forEach((t, i) => {
      const base = Math.round((t.tokensUsed || 0) / 850);
      const seed = (t.name.charCodeAt(0) * 7 + i * 13) % 28;
      map[t.name] = Math.max(3, base + seed);
    });
    return map;
  });
  const [commentsTotal, setCommentsTotal] = React.useState(48);

  // 라이브 시뮬 — 2.8초마다 일부 팀 좋아요 +1, 가끔 댓글 +1.
  // 종료 후에도 갤러리는 계속 운영되어 호응이 누적된다는 신호.
  React.useEffect(() => {
    const tick = setInterval(() => {
      setLikesMap((prev) => {
        const next = { ...prev };
        const names = Object.keys(prev);
        const picks = 1 + Math.floor(Math.random() * 3);
        for (let k = 0; k < picks; k++) {
          const idx = Math.floor(Math.random() * names.length);
          next[names[idx]] = next[names[idx]] + 1;
        }
        return next;
      });
      if (Math.random() < 0.35) setCommentsTotal((c) => c + 1);
    }, 2800);
    return () => clearInterval(tick);
  }, []);

  const likesTotal = React.useMemo(
    () => Object.values(likesMap).reduce((s, v) => s + v, 0),
    [likesMap]
  );
  const likeRanked = React.useMemo(
    () => [...teams]
      .map((t) => ({ name: t.name, members: t.members, likes: likesMap[t.name] || 0 }))
      .sort((a, b) => b.likes - a.likes),
    [teams, likesMap]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 심사 단계 진입 — 종료 후 다음 액션 (2026-06-10 심사 흐름).
          2026-06-12: 심사 기능 미개발 → b2-ended 기본은 배너 없는 깨끗한 버전.
          배너 버전은 judgingEntry prop으로 분리, F.심사 영역 'b2-ended-judging' 화면에서만 노출. */}
      {judgingEntry && <JudgingEntryBanner totalTeams={totalTeams} />}

      {/* 핵심 KPI 3카드 — 참가팀·운영시간·AI 사용량 누적 */}
      <SummaryKpiRow
        totalTeams={totalTeams}
        totalMembers={totalMembers}
        totalTokens={totalTokens}
        avgPerTeam={avgTokensPerTeam} />

      {/* 좌우 2단 — 운영 결산(고정) | 갤러리 호응(라이브)
          두 영역의 시간 성격 차이(확정 vs 누적)를 좌우 병치로 시각화.
          각 영역 내부는 본문(곡선/타일) 위, 순위 TOP 5 아래의 세로 스택. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, alignItems: 'stretch' }}>
        {/* 좌 — 운영 결산: AI 사용량 (행사 종료 시점 확정) */}
        <SummaryBlock
          eyebrow="운영 결산"
          eyebrowDot="var(--c-ink)"
          title="AI 사용량"
          titleIcon={<span style={{ color: 'var(--c-tutorial)', display: 'inline-flex' }}>{Icon.bolt(14)}</span>}>
          <SummaryAiUsage
            totalTokens={totalTokens}
            avgPerTeam={avgTokensPerTeam}
            tokenRanked={tokenRanked} />
        </SummaryBlock>

        {/* 우 — 갤러리 호응: 좋아요·댓글 (라이브 누적) */}
        <SummaryBlock
          eyebrow="갤러리 호응"
          eyebrowDot="var(--c-mint)"
          eyebrowNote={<SummaryLiveLabel />}
          title="좋아요 · 댓글"
          titleIcon={<span style={{ color: 'var(--c-safety)', display: 'inline-flex' }}>{Icon.heart(13)}</span>}
          action={
          <button data-action="open-gallery" className="jt-btn jt-btn-critical" style={{ padding: '6px 12px', fontSize: 12.5 }}>
              {Icon.gallery(12)} 갤러리 열어보기
            </button>
          }>
          <SummaryGalleryResponse
            likesTotal={likesTotal}
            commentsTotal={commentsTotal}
            totalTeams={totalTeams}
            likeRanked={likeRanked} />
        </SummaryBlock>
      </div>
    </div>);

}

// ── 결산 KPI 3카드 ──────────────────────────────────────────
// 참가팀(인원) · 운영시간(튜토+본행사 분리) · AI 사용량(평균 동반)
function SummaryKpiRow({ totalTeams, totalMembers, totalTokens, avgPerTeam }) {
  const items = [
  { label: '참가팀', value: `${totalTeams}팀`, sub: `${totalMembers}명 참여`, mono: false },
  { label: '운영 시간', value: '04:20', sub: '튜토리얼 0:32 · 본행사 3:48', mono: true },
  { label: 'AI 사용량', value: formatTokens(totalTokens), sub: `누적 토큰 · 팀 평균 ${formatTokens(avgPerTeam)}`, mono: true }];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {items.map((s, i) =>
      <div key={i} style={{
        background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
        borderRadius: 8, padding: '14px 16px'
      }}>
          <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontFamily: s.mono ? 'var(--font-mono)' : 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--c-ink)', lineHeight: 1.05 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: 'var(--c-slate)', marginTop: 4 }}>{s.sub}</div>
        </div>
      )}
    </div>);

}

// ── 결산 영역 래퍼 — eyebrow + title + (action) + 본문 카드 ──
// eyebrow는 영역 성격(운영 결산=고정 / 갤러리 호응=라이브) 구분. 도트 색으로 가시화.
function SummaryBlock({ eyebrow, eyebrowDot, eyebrowNote, title, titleIcon, action, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* 영역 라벨 행 — 카드 바깥, 작은 eyebrow 어휘 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {eyebrowDot &&
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: eyebrowDot, flexShrink: 0 }} />
          }
          <span className="jt-mono" style={{
            fontSize: 11, color: 'var(--c-ink-3, var(--c-muted))',
            letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700
          }}>{eyebrow}</span>
        </span>
        {eyebrowNote &&
        <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>{eyebrowNote}</span>
        }
      </div>
      {/* 본문 카드 */}
      <div style={{
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 10,
        padding: 18
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          {titleIcon}
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.005em' }}>{title}</h3>
          <span style={{ flex: 1 }} />
          {action}
        </div>
        {children}
      </div>
    </section>);

}

// ── 라이브 라벨 — 누적 중 안내 ──────
// 2026-06-12: LIVE 칩(mint pulse 도트 + LIVE 워드) 제거 — 안내 문구만 유지 (사용자 피드백).
//   (이전: b2-started LiveStatus 어휘 차용 / 마지막 갱신 시각은 노이즈라 제거 — 2026-06-02.)
function SummaryLiveLabel() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>
        종료 후에도 누적 중
      </span>
    </span>);

}

// ── AI 사용량 본문 — 세로 stacking (좌우 2단 grid 안에서 한 컬럼) ──
// 위: 큰 숫자 + 누적 곡선 / 구분선 / 아래: 팀별 순위(podium TOP 3 + 미니 행 4·5)
// "전체 N팀" 클릭 → 모달로 막대 리스트 전체 노출 (2026-06-02 사용자 룰).
function SummaryAiUsage({ totalTokens, avgPerTeam, tokenRanked }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 큰 숫자 + 곡선 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {formatTokens(totalTokens)}
          </span>
          <span style={{ fontSize: 12, color: 'var(--c-slate)' }}>
            토큰 누적 · 팀 평균 <span className="jt-mono" style={{ color: 'var(--c-ink)' }}>{formatTokens(avgPerTeam)}</span>
          </span>
        </div>
        <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
          시간대별 누적 사용량
        </div>
        <SummaryTokenCurve totalTokens={totalTokens} />
      </div>
      {/* 구분선 */}
      <div style={{ borderTop: '1px dashed var(--c-hairline)' }} />
      {/* 팀별 순위 — 1·2·3등 시상대 + 4·5등 행 (2026-06-02 사용자 룰: 시상대 어휘 + 막대 제거) */}
      <div>
        <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>팀별 순위</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            data-action="open-token-all"
            onClick={() => setModalOpen(true)}
            className="jt-btn jt-btn-ghost"
            style={{ padding: '4px 6px', fontSize: 11, color: 'var(--c-slate)', minHeight: 0, letterSpacing: 0, textTransform: 'none', fontFamily: 'var(--font-body)' }}>

            전체 {tokenRanked.length}팀 {Icon.arrowRight(10)}
          </button>
        </div>
        {/* Podium — 1·2·3등 시상대 (2등 좌, 1등 가운데 가장 높음, 3등 우) */}
        <SummaryPodium
          top3={tokenRanked.slice(0, 3).map((t) => ({ name: t.name, value: t.tokensUsed }))}
          valueFormatter={formatTokens} />

        {/* 4·5등 — 막대 없이 작은 행 */}
        {tokenRanked.length > 3 &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 14, borderTop: '1px solid var(--c-hairline)', paddingTop: 8 }}>
            {tokenRanked.slice(3, 5).map((t, i) =>
          <SummaryRankRowMini
            key={t.name}
            rank={4 + i}
            name={t.name}
            value={formatTokens(t.tokensUsed)} />

          )}
          </div>
        }
      </div>
      {/* 전체 N팀 모달 — 막대 + 순위 행으로 간소화된 전체 리스트 */}
      {modalOpen && <AiUsageTeamsModal teams={tokenRanked} onClose={() => setModalOpen(false)} />}
    </div>);

}

// ── 전체 N팀 모달 — AI 사용량 막대 리스트 (간소화) ──────────
// 디자인: AbsentTeamsModal 포스트잇 어휘 차용. 본문은 스크롤 가능한 막대 행 리스트.
// 막대 색은 tutorial purple (영역 정체성). 값은 토큰 축약 단위.
function AiUsageTeamsModal({ teams, onClose }) {
  const total = teams.length;
  const maxValue = teams[0]?.tokensUsed || 1;
  const modalRot = postitRotation(teams[0]?.name || 'ai-usage');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="팀별 AI 사용량 전체 순위"
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
      {/* 백드롭 */}
      <div
        onClick={onClose}
        data-action="close-token-all"
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--c-backdrop)',
          backdropFilter: 'blur(var(--backdrop-blur))',
          cursor: 'pointer'
        }} />
      {/* 모달 카드 */}
      <ModalSurface
        width={680}
        variant="postit"
        entrance="fade"
        ariaLabel="팀별 AI 사용량 전체 순위"
        className="jt-postit-tape-lg"
        style={{
          maxHeight: 'calc(100% - 80px)',
          '--postit-rot': modalRot,
          '--postit-tint': 'var(--c-canvas)'
        }}>

        {/* 헤더 */}
        <div style={{
          flex: '0 0 auto',
          padding: '22px 28px 14px',
          borderBottom: '1px solid var(--c-hairline)',
          display: 'flex', alignItems: 'baseline', gap: 10
        }}>
          <span style={{ color: 'var(--c-tutorial)', display: 'inline-flex', alignSelf: 'center' }}>{Icon.bolt(15)}</span>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.25 }}>
            팀별 AI 사용량
          </h2>
          <span className="jt-mono" style={{
            fontSize: 12, fontWeight: 700, color: 'var(--c-ink-3)',
            letterSpacing: '0.02em'
          }}>{total}팀 · 행사 종료 시점 확정</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            data-action="close-token-all"
            aria-label="닫기"
            className="jt-icon-btn"
            style={{ color: 'var(--c-slate)' }}>
            {Icon.x(14)}
          </button>
        </div>

        {/* 본문 — 막대 행 리스트 (스크롤) */}
        <div style={{
          flex: '1 1 auto', minHeight: 0,
          padding: '14px 18px 18px',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {teams.map((t, i) =>
          <AiUsageTeamRow
            key={t.name}
            rank={i + 1}
            name={t.name}
            value={formatTokens(t.tokensUsed)}
            pct={Math.max(2, Math.round(t.tokensUsed / maxValue * 100))} />

          )}
        </div>
      </ModalSurface>
    </div>);

}

// 모달 본문 단일 행 — #순위 · 팀명 · 가로 막대 · 값
function AiUsageTeamRow({ rank, name, value, pct }) {
  const isTop3 = rank <= 3;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '7px 6px',
      borderRadius: 4
    }}>
      <span className="jt-mono" style={{
        fontSize: isTop3 ? 12.5 : 11,
        fontWeight: 700,
        color: isTop3 ? 'var(--c-ink)' : 'var(--c-muted)',
        minWidth: 28, textAlign: 'right',
        letterSpacing: '0.02em',
        flexShrink: 0
      }}>#{rank}</span>
      <span title={name} style={{
        width: 130, minWidth: 0,
        fontSize: 13, fontWeight: 600,
        color: 'var(--c-ink)', letterSpacing: '-0.005em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        flexShrink: 0
      }}>{name}</span>
      <div style={{
        flex: 1, minWidth: 0,
        height: 6,
        background: 'var(--c-stone)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: 'var(--c-tutorial)',
          borderRadius: 3,
          transition: 'width var(--dur-base) var(--ease-decelerate)'
        }} />
      </div>
      <span className="jt-mono" style={{
        fontSize: 12, fontWeight: 700,
        color: 'var(--c-ink)',
        minWidth: 52, textAlign: 'right',
        letterSpacing: '-0.005em',
        flexShrink: 0
      }}>{value}</span>
    </div>);

}

// ── 시상대 podium — 1·2·3등 (2026-06-02 사용자 룰) ─────────────
// 배치: [2등 좌] [1등 가운데(가장 높음)] [3등 우]. 메달 어휘: 1등 helmet(gold) / 2등 stone-2(silver) / 3등 helmet-deep(bronze 대신 진한 노랑).
// 팀명·값은 시상대 위, 큰 #N은 시상대 안.
function SummaryPodium({ top3, valueFormatter, valueSuffix, valueSuffixColor }) {
  const PODIUM = [
  { rank: 2, height: 64, bg: 'var(--c-stone-2)', numColor: 'var(--c-ink)' },
  { rank: 1, height: 92, bg: 'var(--c-helmet)', numColor: 'var(--c-ink)' },
  { rank: 3, height: 48, bg: 'var(--c-helmet-deep)', numColor: '#fff' }];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8, alignItems: 'end'
    }}>
      {PODIUM.map(({ rank, height, bg, numColor }) => {
        const t = top3[rank - 1];
        const hasValue = t && t.value !== undefined && t.value !== null;
        return (
          <div key={rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
            {/* 팀명 */}
            <div title={t?.name} style={{
              fontSize: 12, fontWeight: 700,
              color: 'var(--c-ink)', letterSpacing: '-0.005em',
              textAlign: 'center', maxWidth: '100%',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>{t?.name || '—'}</div>
            {/* 값 */}
            <div className="jt-mono" style={{
              fontSize: 11.5, fontWeight: 700,
              color: 'var(--c-ink)',
              display: 'inline-flex', alignItems: 'center', gap: 3,
              minHeight: 14
            }}>
              {hasValue ? valueFormatter(t.value) : ''}
              {valueSuffix && hasValue && <span style={{ color: valueSuffixColor || 'currentColor', display: 'inline-flex' }}>{valueSuffix}</span>}
            </div>
            {/* 시상대 블록 */}
            <div style={{
              width: '100%', height,
              background: bg,
              borderTopLeftRadius: 6, borderTopRightRadius: 6,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 6,
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              color: numColor,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              boxShadow: rank === 1 ? '0 2px 0 rgba(45,42,36,0.10)' : 'none'
            }}>
              {rank}
            </div>
          </div>);

      })}
    </div>);

}

// ── 미니 순위 행 — 막대 없는 단순 행 (시상대 podium의 4·5등용) ──
function SummaryRankRowMini({ rank, name, value, valueSuffix, valueSuffixColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '4px 4px'
    }}>
      <span className="jt-mono" style={{
        fontSize: 10.5, fontWeight: 700,
        color: 'var(--c-muted)',
        minWidth: 22, textAlign: 'right',
        letterSpacing: '0.02em',
        flexShrink: 0
      }}>#{rank}</span>
      <span title={name} style={{
        flex: 1, minWidth: 0,
        fontSize: 12.5, fontWeight: 600,
        color: 'var(--c-ink)', letterSpacing: '-0.005em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{name}</span>
      <span className="jt-mono" style={{
        fontSize: 11.5, fontWeight: 700,
        color: 'var(--c-ink)',
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 3
      }}>
        {value}
        {valueSuffix && <span style={{ color: valueSuffixColor || 'currentColor', display: 'inline-flex' }}>{valueSuffix}</span>}
      </span>
    </div>);

}

// ── 누적 토큰 곡선 — SVG 라인 차트 ─────────────────────────
// X축: 0:00(행사 시작) ~ 4:20(종료). 0:32 지점에 튜토→본행사 점선 구분.
// Y축: 0 ~ totalTokens. 곡선은 "초반 완만 → 종료 직전 가파름"의 막판 몰아치기형 mock.
// 색은 b2-started TokenLeaderZone과 동일한 tutorial purple로 시각 일관성.
function SummaryTokenCurve({ totalTokens }) {
  const W = 720, H = 130;
  const PAD_L = 42, PAD_R = 12, PAD_T = 10, PAD_B = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const N = 64;
  const points = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // S-curve with late acceleration. 0~0.7은 완만, 0.7~1은 가속.
    let f;
    if (t < 0.7) {
      f = 0.38 * Math.pow(t / 0.7, 1.6);
    } else {
      const u = (t - 0.7) / 0.3;
      f = 0.38 + 0.62 * Math.pow(u, 1.4);
    }
    points.push({
      x: PAD_L + t * innerW,
      y: PAD_T + (1 - f) * innerH,
      v: f * totalTokens
    });
  }

  const pathD = points.map((p, i) =>
  i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(' ');
  const areaD = pathD + ` L ${(PAD_L + innerW).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} L ${PAD_L} ${(PAD_T + innerH).toFixed(1)} Z`;

  // 행사 0:00 ~ 4:20 = 260분. 튜토 종료 0:32 = 32분 → 32/260 ≈ 0.123
  const tutorialEndT = 32 / 260;
  const xLabels = [
  { t: 0, label: '0:00' },
  { t: tutorialEndT, label: '튜토 종료', dim: true },
  { t: 1 / 260 * 60, label: '1:00' },
  { t: 2 / 260 * 60, label: '2:00' },
  { t: 3 / 260 * 60, label: '3:00' },
  { t: 1, label: '4:20', strong: true }];


  const yTicks = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible', height: 'auto' }} preserveAspectRatio="xMidYMid meet">
      {/* gridlines + Y 라벨 */}
      {yTicks.map((y, i) =>
      <g key={i}>
          <line
          x1={PAD_L} x2={PAD_L + innerW}
          y1={PAD_T + (1 - y) * innerH} y2={PAD_T + (1 - y) * innerH}
          stroke="var(--c-hairline)" strokeWidth="1"
          strokeDasharray={y === 0 ? '0' : '2 3'} />

          <text
          x={PAD_L - 8} y={PAD_T + (1 - y) * innerH + 3}
          fontSize="9.5" fill="var(--c-muted)" textAnchor="end"
          fontFamily="var(--font-mono)" letterSpacing="0.02em">

            {formatTokens(Math.round(y * totalTokens))}
          </text>
        </g>
      )}
      {/* 튜토리얼/본행사 구분선 */}
      <line
        x1={PAD_L + tutorialEndT * innerW} x2={PAD_L + tutorialEndT * innerW}
        y1={PAD_T} y2={PAD_T + innerH}
        stroke="var(--c-hairline-strong)" strokeWidth="1" strokeDasharray="1 3" />
      {/* area fill */}
      <path d={areaD} fill="var(--c-tutorial)" fillOpacity="0.10" />
      {/* curve */}
      <path d={pathD} fill="none" stroke="var(--c-tutorial)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* 끝점 — pulse 없는 정적 dot */}
      <circle cx={points[N].x} cy={points[N].y} r="6" fill="var(--c-tutorial)" fillOpacity="0.18" />
      <circle cx={points[N].x} cy={points[N].y} r="3.5" fill="var(--c-tutorial)" />
      {/* X축 라벨 */}
      {xLabels.map((l, i) =>
      <text key={i}
      x={PAD_L + l.t * innerW} y={H - 6}
      fontSize="9.5"
      fill={l.dim ? 'var(--c-muted)' : l.strong ? 'var(--c-ink)' : 'var(--c-slate)'}
      fontWeight={l.strong ? 700 : 400}
      textAnchor="middle"
      fontFamily="var(--font-mono)" letterSpacing="0.02em">

          {l.label}
        </text>
      )}
    </svg>);

}

// ── 갤러리 호응 본문 — 세로 stacking (좌우 2단 grid 안에서 한 컬럼) ──
// 위: 좋아요·댓글 타일 + 안내 박스 / 구분선 / 아래: 좋아요 순위 TOP 5 (라이브)
function SummaryGalleryResponse({ likesTotal, commentsTotal, totalTeams, likeRanked }) {
  const topLikes = likeRanked[0]?.likes || 1;
  const likesPerTeam = totalTeams ? (likesTotal / totalTeams).toFixed(1) : '0';
  const commentsPerTeam = totalTeams ? (commentsTotal / totalTeams).toFixed(1) : '0';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 타일 + 안내 */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <SummaryMetricTile
            icon={Icon.heart(13)}
            iconColor="var(--c-safety)"
            label="좋아요"
            value={likesTotal}
            sub={`팀 평균 ${likesPerTeam}`} />

          <SummaryMetricTile
            icon={Icon.comment(13)}
            iconColor="var(--c-mint)"
            label="댓글"
            value={commentsTotal}
            sub={`팀 평균 ${commentsPerTeam}`} />

        </div>
        {/* 안내 — 종료 후에도 갤러리는 계속 운영된다는 정책 신호 */}
        <div style={{
          padding: '10px 12px',
          background: 'var(--c-paper)',
          borderRadius: 8,
          border: '1px dashed var(--c-hairline-strong)',
          display: 'flex', alignItems: 'flex-start', gap: 8
        }}>
          <span style={{ color: 'var(--c-mint)', flexShrink: 0, paddingTop: 1, display: 'inline-flex' }}>{Icon.info(13)}</span>
          <div style={{ fontSize: 12, color: 'var(--c-slate)', lineHeight: 1.5 }}>
            <b style={{ color: 'var(--c-ink)' }}>갤러리는 종료 후에도 계속 운영됩니다.</b> 모든 팀의 결과물이 자동 공개되며, 좋아요·댓글은 계속 누적됩니다.
          </div>
        </div>
      </div>
      {/* 구분선 */}
      <div style={{ borderTop: '1px dashed var(--c-hairline)' }} />
      {/* 좋아요 순위 TOP 5 (라이브) */}
      <div>
        <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>팀별 인기 · TOP 5</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 9.5, fontWeight: 700, color: 'var(--c-mint)',
            letterSpacing: '0.04em', textTransform: 'none'
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-mint)', display: 'inline-block' }} />
            지금 기준
          </span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className="jt-btn jt-btn-ghost"
            style={{ padding: '4px 6px', fontSize: 11, color: 'var(--c-slate)', minHeight: 0, letterSpacing: 0, textTransform: 'none', fontFamily: 'var(--font-body)' }}>

            전체 {totalTeams}팀 {Icon.arrowRight(10)}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {likeRanked.slice(0, 5).map((t, i) =>
          <SummaryRankRow
            key={t.name}
            rank={i + 1}
            name={t.name}
            value={`${t.likes}`}
            valueSuffix={Icon.heart(11)}
            valueSuffixColor="var(--c-safety)"
            pct={Math.max(6, Math.round(t.likes / topLikes * 100))}
            barColor="var(--c-safety)" />

          )}
        </div>
      </div>
    </div>);

}

// ── 메트릭 타일 — 좋아요/댓글 합계 (아이콘 + 큰 숫자 + 평균) ──
function SummaryMetricTile({ icon, iconColor, label, value, sub }) {
  return (
    <div style={{
      background: 'var(--c-paper)',
      border: '1px solid var(--c-hairline)',
      borderRadius: 8,
      padding: '11px 14px'
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ color: iconColor, display: 'inline-flex' }}>{icon}</span>
        <span className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>{sub}</span>
      </div>
    </div>);

}

// ── 순위 행 — #N + 팀명 + 가로 막대 + 값 (좌측 정렬) ──────
// b2-started TokenTeamCard와 동일 어휘(#N · jt-mono · stone bg · 색 fill).
function SummaryRankRow({ rank, name, value, valueSuffix, valueSuffixColor, pct, barColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 4px',
      borderRadius: 4
    }}>
      <span className="jt-mono" style={{
        fontSize: 11, fontWeight: 700,
        color: rank === 1 ? 'var(--c-ink)' : 'var(--c-muted)',
        minWidth: 22, textAlign: 'right',
        letterSpacing: '0.02em',
        flexShrink: 0
      }}>#{rank}</span>
      <span title={name} style={{
        flex: 1, minWidth: 0,
        fontSize: 12.5, fontWeight: 600,
        color: 'var(--c-ink)', letterSpacing: '-0.005em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{name}</span>
      <div style={{
        width: 64, height: 4,
        background: 'var(--c-stone)',
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: barColor,
          transition: 'width var(--dur-base) var(--ease-decelerate)'
        }} />
      </div>
      <span className="jt-mono" style={{
        fontSize: 11, fontWeight: 700,
        color: 'var(--c-ink)',
        minWidth: 44, textAlign: 'right',
        letterSpacing: '-0.005em',
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3
      }}>
        {value}
        {valueSuffix && <span style={{ color: valueSuffixColor || 'currentColor', display: 'inline-flex' }}>{valueSuffix}</span>}
      </span>
    </div>);

}

// ── 압축 명단 그리드 (대기 상태) ──────────────────────────────
// 6열 · 포스트잇 카드(팀명 + 아바타 도트, ~60px 높이). 1280px artboard 기준 6열 10행 = 60팀 한 화면.
// 2026-05-29: 포스트잇 어휘 도입. gap 8 유지 (10행 × 60 + 9×8 = 672px → 60팀 1페이지 보존).
// padding-top 4: 첫 행 카드 tape(-3px) 노출 여유. 회전 ±1.4°는 190px 카드에서 1.5px 미만 옆 돌출, gap 8 안에 흡수.
function RosterGrid({ teams }) {
  // roster mode — 대기실. 미접속 chip 3-state 활성 (§18-16).
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8, paddingTop: 4 }}>
      {teams.map((t, i) => <RosterRow key={i} t={t} showOfflineAccent />)}
    </div>);

}

// 회전은 4-variant deterministic (team-name hash) — 같은 팀은 렌더마다 같은 자세.
// tint는 팀 정체성 3-variant (§18-15) — 같은 팀은 어느 화면에서나 같은 색.
// 미접속 신호는 카운트 위치의 chip 3-state로 분리 (§18-16, roster mode 한정).
const POSTIT_ROTATIONS = [
'var(--postit-rot-a)',
'var(--postit-rot-b)',
'var(--postit-rot-c)',
'var(--postit-rot-d)'];

function postitRotation(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) | 0;
  return POSTIT_ROTATIONS[((h % 4) + 4) % 4];
}

// 팀 포스트잇 단일 흰색 정책 (§18-27, 2026-05-29 사용자 결정):
//   전체 팀 카드 `--c-canvas` (#ffffff). 다인/1인팀 무관. RosterRow + 카드별 모달 공통.
// 이전 정책(§18-15 hash 3톤 / §18-17 mono / §18-20 2색 / §18-25 노랑 / §18-26 white·green A/B) 모두 폐기.
function teamIdentityTint(_team) {
  return 'var(--c-canvas)';
}

// 성씨 기반 색 매핑 — TeammatePortrait(E-4)의 4색 토큰 어휘 재사용 + helmet/safety 확장 6색.
// 같은 성은 항상 같은 색(deterministic). 한 팀 4명 성이 보통 다르므로 카드 안 색 분산 자연.
const ROSTER_AVATAR_PALETTE = [
'var(--c-helmet)', 'var(--c-blue)', 'var(--c-mint)', 'var(--c-amber)',
'var(--c-helmet-deep)', 'var(--c-safety)'];

function rosterAvatarColor(name) {
  return ROSTER_AVATAR_PALETTE[name.charCodeAt(0) % ROSTER_AVATAR_PALETTE.length];
}

// 22px 원 안에 한글 2자(이름 뒤 2글자). 1자만 등록된 경우 fallback.
function rosterAvatarLabel(name) {
  return name.length >= 2 ? name.slice(-2) : name;
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
        fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '-0.04em',
        flexShrink: 0,
        // 미접속은 옅음(0.7)이 기본 상태 단서 — 호버 시 가독성 위해 1로 복원
        opacity: on || hover ? 1 : 0.7,
        cursor: 'default'
      }}>
      {rosterAvatarLabel(name)}
      {hover &&
      <span style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: '50%', transform: 'translateX(-50%)',
        background: 'var(--c-ink)', color: '#fff',
        padding: '5px 9px', borderRadius: 4,
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
        fontFamily: 'var(--font-body)', letterSpacing: '-0.005em',
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

// showOfflineAccent: roster mode(대기실)만 true. tutorial-progress·activity mode에서는 false —
// 미접속 신호 노출 안 함 (§18-15: 색=팀 정체성, 상태=신호 분리).
// 3-state via 카운트 색·weight (§18-18, 마일드 — chip 폐기):
//   전원 접속 = muted weight 500 / 일부 미접속 = safety weight 600 / 전원 미접속 = safety-deep weight 700
function RosterRow({ t, showOfflineAccent = false }) {
  const onCount = t.members.filter((m) => m[1] === 'on').length;
  const offCount = t.members.length - onCount;
  const anyOff = offCount > 0;
  const allOff = onCount === 0;
  // 회전: 팀명 hash 4-variant. tint: 단일 흰색(§18-27).
  const rot = postitRotation(t.name);
  const tint = teamIdentityTint(t);
  const ariaSuffix = !showOfflineAccent ? '' :
    allOff ? ' · 전원 미접속' :
    anyOff ? ` · ${offCount}명 미접속` :
    '';
  return (
    <div
      data-action="open-team"
      role="button"
      tabIndex={0}
      className="jt-postit-card"
      aria-label={`${t.name} 팀 상세 보기${ariaSuffix}`}
      style={{
        '--postit-rot': rot,
        '--postit-tint': tint,
        background: tint,
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
        {/* 카운트 N/M — 색·weight로 3-state 분리 (§18-18, 마일드). chip 제거. */}
        <span className="jt-mono" style={{
          fontSize: 10,
          fontWeight: showOfflineAccent && allOff ? 700 :
                      showOfflineAccent && anyOff ? 600 :
                      500,
          color: showOfflineAccent && allOff ? 'var(--c-safety-deep)' :
                 showOfflineAccent && anyOff ? 'var(--c-safety)' :
                 'var(--c-muted)',
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
  const tone = t.activity === 'idle' ? 'var(--c-slate)' : 'var(--c-mint)';
  const label = t.activity === 'active' ? '작업 중' : '대기';

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

// ── B-2. 종료 확인 모달 (Stage 1 — "종료" 키워드 입력) ──────────────
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
            다음 단계에서 <strong style={{ color: 'var(--c-ink)' }}>30초 카운트다운</strong>이 시작됩니다.
            <br />
            카운트다운이 끝나면 해커톤이 종료되며 <strong style={{ color: 'var(--c-ink)' }}>되돌릴 수 없습니다.</strong>
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12.5, color: 'var(--c-ink-2)', display: 'block', marginBottom: 6 }}>
            계속하려면 <strong style={{ color: 'var(--c-ink)', fontFamily: 'var(--font-mono)' }}>종료</strong>를 입력하세요
          </label>
          <input
            className="jt-input"
            defaultValue="종"
            style={{
              fontFamily: 'var(--font-mono)',
              borderColor: 'var(--c-amber)',
              background: '#fffaf0'
            }} />

          <div style={{ fontSize: 11.5, color: 'var(--c-amber)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            {Icon.warn(11)} 1글자 더 입력하세요
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--c-backdrop-strong)', zIndex: 2 }} />
      <div style={{ filter: 'blur(2px)', opacity: 0.5, pointerEvents: 'none' }}>
        {/* 모달 뒷배 대시보드: GNB는 로고+계정만 (2026-05-28 — DashboardShell과 정렬) */}
        <AppHeader user={OPERATOR_USER} />
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
          참가자 화면이 자동으로 코딩 환경으로 전환됩니다.
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
  // 2026-06-01 paper 폐기 → 포스트잇 모달(ModalSurface variant="postit").
  // RosterRow와 동일 어휘로 zoom-in 시각 일관성 — 같은 팀명 hash로 같은 회전·tint 자세 유지.
  const rot = postitRotation(team.name);
  const tint = teamIdentityTint(team);
  return (
    <ModalSurface
      width={440}
      topStrip={null}
      entrance="fade"
      ariaLabel={`${team.name} 팀 상세`}
      variant="postit"
      className="jt-postit-tape-lg"
      style={{
        maxHeight: '100%', minHeight: 0,
        '--postit-rot': rot,
        '--postit-tint': tint
      }}>

      {/* 헤더 — 인터랙션 모달(스크롤 멤버 리스트) 규칙(§08): borderBottom 유지.
          포스트잇 어휘는 padding 축소 가능 — paper 가장자리·접힘 safe area 불필요. */}
      <div style={{
        flex: '0 0 auto',
        padding: '24px 28px 16px',
        borderBottom: '1px solid var(--c-hairline)'
      }}>
        <div style={{
          fontSize: 20, fontWeight: 700, lineHeight: 1.25,
          fontFamily: 'var(--font-display)', wordBreak: 'keep-all'
        }}>{team.name}</div>
        <div style={{ fontSize: 12, color: 'var(--c-slate)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          {onCount} / {team.members.length} 접속 중
        </div>
      </div>

      {/* 본문 — 멤버 행: RosterMemberRow 공용 컴포넌트. maxHeight 320 스크롤 */}
      <div style={{ flex: '1 1 auto', minHeight: 0, maxHeight: 320, padding: '12px 18px 14px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
        <div className="jt-mono" style={{ fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', padding: '6px 8px 6px', flexShrink: 0 }}>
          팀원 {team.members.length}명
        </div>
        {team.members.map(([name, state], i) =>
        <RosterMemberRow key={i} name={name} color={rosterAvatarColor(name)} state={state} />
        )}
      </div>

      {/* 푸터 범례 */}
      <div style={{
        flex: '0 0 auto',
        padding: '14px 24px 20px',
        borderTop: '1px solid var(--c-hairline)'
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
      {/* 백드롭으로 사용되는 RosterView — 포스트잇 settle 애니 비활성화 (§18-12). 모달 등장 시 시각 노이즈 회피 */}
      <div className="jt-roster-backdrop" style={{ flex: 1, display: 'flex', flexDirection: 'column', filter: 'blur(2px)', opacity: 0.55, pointerEvents: 'none', minHeight: 0 }}>
        <DashboardShell status="tutorial_waiting" teams={PENDING_TEAMS} mode="roster" />
      </div>
      {/* 백드롭 클릭 시 닫힘 */}
      <div data-action="close-roster-detail" style={{
        position: 'absolute', inset: 0,
        background: 'var(--c-backdrop-strong)',
        zIndex: 2, cursor: 'pointer'
      }} />
      {/* 모달 wrapper — 상하 60px 인셋으로 높이 컨텍스트 부여, 안쪽 모달이 maxHeight: 100% 로 받음.
          2026-06-01: jt-paper-surface-wrap(drop-shadow) → 단순 position wrapper. shadow는 postit 어휘가 담당. */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        maxHeight: 'calc(100% - 120px)', display: 'flex',
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
  B2DashboardStarted, B2DashboardEnded,
  B2EndModal, B2EndModalCountdown, B2SkipTutorialModal,
  B2TutorialStartConfirm, B2TutorialEndConfirm, B2HackathonStartConfirm,
  B2RosterDetail, RosterTeamDetailModal,
  // 갤러리 D-1 카드(postit) 어휘 재사용 — 운영자 RosterRow와 동일 회전 hash + LivePreview 썸네일
  postitRotation, LivePreview
});