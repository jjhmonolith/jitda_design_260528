/* ════════════════════════════════════════════════════════════════════
   심사 영역 (통합 파일 — 2026-06-10)
   심사 기능 전 화면을 역할 무관 한 파일로 모음 (개발 시 분산 방지).
   - 심사위원(F): F1RubricConfig(온보딩) · F1JudgeDashboard(채점 중/완료) · F2AwardCeremony(발표·시상)
   - 참여자(C): C5SubmitIntro(산출물 제출/완료) · CParticipantResult(결과 뷰)
   - 운영자(B): B3RubricSettings · B3JudgeManagement · B3ResultsTally · JudgingEntryBanner(b2-ended 진입 CTA)
   설계 원칙: 채점은 사람 심사위원, 플랫폼은 데이터 열람·반영 지원. 자동 합산 점수 없음.
   의존: OPERATOR_USER/HACKATHON_NAME(operator.jsx) · DEFAULT_PARTICIPANT_USER(participant.jsx) · AppHeader/Icon(shared.jsx)
         → babel 전역 스코프, 렌더 시점에 해석되므로 로드 순서 무관.
   기획: 03-planning/product/2026-06-10_심사-평가-기능-기획.md
   ════════════════════════════════════════════════════════════════════ */

/* F. 심사 영역  (2026-06-10 전면 재설계)
   설계 원칙: 채점은 사람 심사위원이 한다. 플랫폼은 심사위원이 판단에 필요한
   데이터(라이브 앱·프롬프트 과정 요약·기여도)를 한 화면에서 열람하고 점수에
   반영하도록 돕는다. 자동 합산 점수 트랙 없음 — 루브릭이 유일한 점수원.
   기획: 03-planning/product/2026-06-10_심사-평가-기능-기획.md

   화면:
   - F-1  심사위원 대시보드 (채점 중)      F1JudgeDashboard
   - F-1  심사위원 대시보드 (채점 완료)    F1JudgeDashboard stateVariant="completed"
   - F-2  결과 발표·시상                    F2AwardCeremony
*/

const JUDGE_USER = { name: '서리림', email: 'seo.r@enk.kr' };

// 과정 가중 루브릭 — 운영자 설정 가능. 가중치 합 100.
// (문제 30이 아니라 과정 30 > 결과물 25 — AI 모델 성능 혼동 회피, 기획 §2.2)
const RUBRIC = [
  { key: 'problem', label: '문제 정의·아이디어', weight: 20, desc: '누구의 어떤 문제를 풀었나', src: '산출물 소개' },
  { key: 'process', label: '과정·프롬프트 사고력', weight: 30, desc: '문제를 어떻게 분해해 AI에게 시켰나', src: '과정 요약', star: true },
  { key: 'output',  label: '결과물 완성·실용', weight: 25, desc: '실제로 동작하고 끝까지 닿는가', src: '라이브 앱' },
  { key: 'collab',  label: '협업·기여 균형', weight: 15, desc: '팀원이 고루 참여했나 (팀)', src: '기여도' },
  { key: 'present', label: '발표·전달', weight: 10, desc: '문제·해결을 잘 설명했나', src: '산출물 소개' },
];

// 심사 큐 (운영자가 이 심사위원에게 배정한 분담분)
const JUDGE_QUEUE = [
  { id: 1, team: '터미널 사파리', title: 'AI 일정관리 봇', members: 4, solo: false, status: 'current' },
  { id: 2, team: 'JS의 비밀',     title: '인디 음악 디스커버리', members: 3, solo: false, status: 'scored', score: 84 },
  { id: 3, team: '디버그 라이프', title: '학식 매니저', members: 1, solo: true, status: 'scored', score: 71 },
  { id: 4, team: '커널 패닉',     title: '코딩 마라톤 트래커', members: 4, solo: false, status: 'scored', score: 78 },
  { id: 5, team: 'undefined',     title: '음료 추천 봇', members: 2, solo: false, status: 'pending' },
  { id: 6, team: 'await me',      title: '러닝 페이스메이커', members: 3, solo: false, status: 'pending' },
  { id: 7, team: '404 NOT FOUND', title: '캠퍼스 분실물 지도', members: 4, solo: false, status: 'pending' },
  { id: 8, team: '코드밍아웃',    title: '강의 자동 요약기', members: 2, solo: false, status: 'pending' },
];

// 현재 채점 중 프로젝트의 임시 점수 (5단계 척도 ●●●●○ 중 채워진 칸)
const DRAFT_SCORE = { problem: 4, process: 5, output: 3, collab: 4, present: 4 };

// ════════════════════════════════════════════════════════════════════
//  F-1. 심사위원 대시보드
// ════════════════════════════════════════════════════════════════════
function F1JudgeDashboard({ stateVariant = 'scoring', tab = 'process' }) {
  const isCompleted = stateVariant === 'completed';
  const queue = isCompleted
    ? JUDGE_QUEUE.map(p => p.status === 'pending'
        ? { ...p, status: 'scored', score: 70 + (p.id * 3) % 20 }
        : p)
    : JUDGE_QUEUE;
  const scored = queue.filter(p => p.status === 'scored').length;
  const total = queue.length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <AppHeader
        breadcrumb={['2026 봄 ENK 해커톤', '심사']}
        user={JUDGE_USER}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="jt-pill jt-pill-info" style={{ fontSize: 11 }}>심사위원</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '5px 11px',
              background: 'var(--c-stone)', borderRadius: 999,
              fontSize: 11.5, fontFamily: 'var(--font-mono)',
            }}>
              <span style={{ color: 'var(--c-slate)' }}>내 분담</span>
              <span style={{ fontWeight: 700, color: 'var(--c-ink)' }}>{isCompleted ? total : scored} / {total}</span>
              <div style={{ width: 64, height: 5, background: 'var(--c-canvas)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${((isCompleted ? total : scored) / total) * 100}%`, height: '100%', background: isCompleted ? 'var(--c-mint)' : 'var(--c-helmet)' }} />
              </div>
            </div>
          </div>
        }
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* ── 좌: 심사 큐 ───────────────────────────────── */}
        <aside style={{ flex: '0 1 256px', minWidth: 200, background: 'var(--c-canvas)', borderRight: '1px solid var(--c-hairline)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '13px 16px 11px', borderBottom: '1px solid var(--c-hairline)' }}>
            <div className="jt-eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>내 심사 분담</div>
            <h3 style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700 }}>프로젝트 {total}개</h3>
            <div style={{ display: 'flex', gap: 5, marginTop: 8, fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>
              <JChip color="var(--c-mint)" bg="var(--c-mint-soft)" label={`✓ ${isCompleted ? total : scored}`} />
              {!isCompleted && <JChip color="var(--c-amber)" bg="var(--c-helmet-soft)" label="● 진행 1" />}
              {!isCompleted && <JChip color="var(--c-slate)" bg="var(--c-stone)" label={`○ ${total - scored - 1}`} />}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
            {queue.map((p, i) => <JudgeQueueItem key={p.id} p={p} index={i + 1} completed={isCompleted} />)}
          </div>

          <div style={{ padding: '11px 16px', borderTop: '1px solid var(--c-hairline)', background: 'var(--c-paper)' }}>
            <div style={{ fontSize: 10, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 5 }}>심사 마감까지</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{isCompleted ? '00:41:05' : '02:42:18'}</span>
              <span style={{ fontSize: 11, color: 'var(--c-slate)' }}>오늘 21:00</span>
            </div>
          </div>
        </aside>

        {/* ── 중: 라이브 앱 + 보조 데이터 (열람 레이어) ──────── */}
        <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--c-stone-2)', padding: '14px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em', marginBottom: 3 }}>01 / {String(total).padStart(2, '0')} · 터미널 사파리 · 4명</div>
              <h2 style={{ fontSize: 21, lineHeight: 1.15 }}>AI 일정관리 봇</h2>
            </div>
            <div style={{ display: 'flex', gap: 6, flex: '0 0 auto' }}>
              <button className="jt-btn jt-btn-secondary jt-btn-sm">{Icon.external(11)} 새 탭에서 열기</button>
            </div>
          </div>

          {/* 라이브 앱 */}
          <div style={{ flex: '1.25 1 0', minHeight: 0, background: 'var(--c-canvas)', border: '1px solid var(--c-hairline-strong)', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: '0 0 auto', padding: '7px 13px', background: '#f0eee9', borderBottom: '1px solid var(--c-hairline)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: '#ddd9d0' }} />)}
              </div>
              <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)', textAlign: 'center' }}>terminal-safari.jitda.app</div>
              <span className="jt-pill" style={{ background: 'var(--c-ink)', color: '#fff', fontSize: 9.5, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5ae0a3' }} /> LIVE
              </span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 20, background: '#fff7e8' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a06a0a', letterSpacing: '0.14em' }}>AI CALENDAR BOT · LIVE</div>
              <h1 style={{ fontSize: 24, lineHeight: 1.15, marginTop: 6 }}>오늘 할 일을<br />사진 한 장으로</h1>
              <div style={{ marginTop: 14, background: 'var(--c-canvas)', border: '1.5px dashed #f3a995', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 26 }}>📷</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>강의 시간표를 찍어보세요</div>
                  <div style={{ fontSize: 11, color: 'var(--c-slate)' }}>OCR이 일정으로 변환합니다</div>
                </div>
                <button className="jt-btn jt-btn-sm jt-btn-helmet">업로드</button>
              </div>
              <div style={{ marginTop: 12 }}>
                {[['데이터구조 과제', '5/22 18:00', 'D-0', 'safety'], ['알고리즘 중간고사', '5/24 09:00', 'D-2', 'amber'], ['종강총회', '6/8 19:00', 'D-17', 'slate']].map((r, i) => (
                  <div key={i} style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 6, padding: '8px 12px', marginBottom: 5, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ padding: '3px 7px', background: r[3] === 'safety' ? 'var(--c-safety-soft)' : r[3] === 'amber' ? 'var(--c-amber-soft)' : 'var(--c-stone)', color: r[3] === 'safety' ? 'var(--c-safety-deep)' : r[3] === 'amber' ? 'var(--c-amber)' : 'var(--c-ink-3)', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, minWidth: 38, textAlign: 'center' }}>{r[2]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r[0]}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-slate)' }}>{r[1]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 보조 데이터 탭 — 채점하며 동시에 보는 열람 레이어 */}
          <div style={{ flex: '1 1 0', minHeight: 0, marginTop: 10, marginBottom: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: -1, position: 'relative', zIndex: 1 }}>
              {[['process', '과정 요약'], ['contrib', '기여도'], ['intro', '산출물 소개'], ['ref', '참고']].map(([k, lbl]) => (
                <JudgeTab key={k} active={tab === k} label={lbl} flag={k === 'process'} />
              ))}
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--c-canvas)', border: '1px solid var(--c-hairline-strong)', borderRadius: '0 8px 8px 8px', padding: 14 }}>
              {tab === 'process' && <ProcessSummaryPanel />}
              {tab === 'contrib' && <ContribPanel />}
              {tab === 'intro' && <IntroPanel />}
              {tab === 'ref' && <RefPanel />}
            </div>
          </div>
        </section>

        {/* ── 우: 루브릭 채점 ───────────────────────────── */}
        <aside style={{ flex: '0 1 376px', minWidth: 300, background: 'var(--c-canvas)', borderLeft: '1px solid var(--c-hairline)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid var(--c-hairline)' }}>
            <div className="jt-eyebrow" style={{ fontSize: 10.5, marginBottom: 5 }}>심사 · 과정 가중 루브릭</div>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>점수 매기기</h3>
            <p style={{ fontSize: 11.5, color: 'var(--c-slate)', marginTop: 4, lineHeight: 1.5 }}>각 항목 1–5점. 가중 합산으로 100점 환산됩니다.</p>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
            {RUBRIC.map(c => <RubricRow key={c.key} c={c} value={DRAFT_SCORE[c.key]} disabled={false} />)}

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>심사평</span>
                <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>· 결과 발표 후 팀이 함께 봅니다</span>
              </div>
              <textarea className="jt-input" rows={3} style={{ resize: 'none', fontSize: 12.5, lineHeight: 1.55 }}
                defaultValue={'검색 구조를 세 번에 걸쳐 다듬은 과정이 인상적. 사진→일정 흐름이 자연스럽고, 막혔던 결제 단계를 분리해 풀어낸 판단이 좋았어요.'} />
            </div>
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--c-hairline)', background: 'var(--c-paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '9px 13px', background: 'var(--c-canvas)', border: '1px solid var(--c-hairline-strong)', borderRadius: 6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>가중 합계</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 27, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>82</span>
              <span style={{ fontSize: 13, color: 'var(--c-muted)' }}>/ 100</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="prev" style={{ flex: 1 }}>{Icon.arrowLeft(11)} 이전</button>
              <button className="jt-btn jt-btn-primary jt-btn-sm" data-action="save-next" style={{ flex: 2 }}>저장하고 다음 {Icon.arrowRight(11)}</button>
            </div>
          </div>
        </aside>
      </div>

      {/* 채점 완료 시 하단 제출 바 */}
      {isCompleted && (
        <div style={{ flex: '0 0 auto', background: 'var(--c-mint-wash)', borderTop: '1px solid var(--c-mint-soft)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--c-mint)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{Icon.check(14)}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c-mint)' }}>분담 {total}개 채점 완료</div>
            <div style={{ fontSize: 11.5, color: 'var(--c-ink-3)' }}>제출 후에도 마감 전까지 점수를 수정할 수 있어요.</div>
          </div>
          <button className="jt-btn jt-btn-sm jt-btn-secondary" data-action="review">다시 검토</button>
          <button className="jt-btn jt-btn-sm jt-btn-primary" data-action="submit">심사 제출하기 {Icon.arrowRight(12)}</button>
        </div>
      )}
    </div>
  );
}

// ── 보조 데이터 패널들 ──────────────────────────────────────────────
function ProcessSummaryPanel() {
  const highlights = [
    { kind: '반복 개선', tone: 'amber', text: '검색 결과 정렬을 3회에 걸쳐 다듬음 — 최신순 → 관련도순 → 카테고리 필터 추가', n: '프롬프트 #8·#14·#21' },
    { kind: '문제 해결', tone: 'mint', text: '결제 흐름에서 막힘 → 단계를 분리하라고 직접 지시해 해결', n: '프롬프트 #29' },
    { kind: '좋은 분해', tone: 'blue', text: '처음부터 데이터 구조(일정·알림·반복)를 명확히 정의하고 시작', n: '프롬프트 #1·#2' },
  ];
  const toneMap = {
    amber: ['var(--c-helmet-soft)', 'var(--c-amber)'],
    mint: ['var(--c-mint-soft)', 'var(--c-mint)'],
    blue: ['var(--c-blue-soft)', 'var(--c-blue)'],
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="jt-eyebrow" style={{ fontSize: 10 }}>과정 요약</span>
        <span style={{ fontSize: 10.5, color: 'var(--c-muted)' }}>AI가 47개 프롬프트에서 핵심 분기를 추렸습니다</span>
        <div style={{ flex: 1 }} />
        <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{ fontSize: 11 }}>{Icon.code(11)} 원본 프롬프트 전체 (47)</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {highlights.map((h, i) => {
          const [bg, fg] = toneMap[h.tone];
          return (
            <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '9px 11px', background: 'var(--c-paper)', border: '1px solid var(--c-hairline)', borderRadius: 6 }}>
              <span style={{ flex: '0 0 auto', padding: '3px 8px', background: bg, color: fg, borderRadius: 4, fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{h.kind}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--c-ink-2)' }}>{h.text}</div>
                <div style={{ fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{h.n}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 9, padding: '7px 11px', background: 'var(--c-stone-wash)', borderRadius: 6, fontSize: 10.5, color: 'var(--c-slate)', display: 'flex', alignItems: 'center', gap: 7 }}>
        {Icon.info(12)} 요약이 미심쩍으면 <b style={{ color: 'var(--c-ink-3)' }}>원본 전체 보기</b>로 직접 확인하세요. 요약은 보조일 뿐 점수에 자동 반영되지 않습니다.
      </div>
    </div>
  );
}

function ContribPanel() {
  const members = [
    { name: '김민준', color: 'var(--c-blue)', pct: 38 },
    { name: '이서윤', color: 'var(--c-mint)', pct: 31 },
    { name: '박지호', color: 'var(--c-amber)', pct: 19 },
    { name: '최유나', color: 'var(--c-safety)', pct: 12 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="jt-eyebrow" style={{ fontSize: 10 }}>팀원별 기여도</span>
        <span style={{ fontSize: 10.5, color: 'var(--c-muted)' }}>전송된 프롬프트 작성자 기준 · 균형 지수 0.81</span>
      </div>
      <div style={{ display: 'flex', height: 14, borderRadius: 4, overflow: 'hidden', marginBottom: 12, border: '1px solid var(--c-hairline)' }}>
        {members.map((m, i) => <div key={i} style={{ width: `${m.pct}%`, background: m.color }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {members.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: m.color, flex: '0 0 auto' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, flex: '0 0 64px' }}>{m.name}</span>
            <div style={{ flex: 1, height: 6, background: 'var(--c-stone)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${m.pct}%`, height: '100%', background: m.color }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flex: '0 0 36px', textAlign: 'right' }}>{m.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <div className="jt-postit-card" style={{ '--postit-rot': '-0.6deg', '--postit-tint': 'var(--c-canvas)', maxWidth: 560 }}>
      <div style={{ padding: '4px 2px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>팀이 직접 쓴 소개</div>
        <div style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--c-amber)', marginBottom: 3 }}>어떤 문제를 풀었나</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--c-ink-2)' }}>강의 시간표·과제 마감을 일일이 손으로 옮겨 적다 놓치는 일이 잦았다. 사진 한 장이면 일정이 자동 등록되게 만들었다.</div>
        </div>
        <div style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--c-mint)', marginBottom: 4 }}>핵심 기능 3가지</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['📷 사진 OCR 일정 등록', '🔔 D-1 카톡 알림', '🔁 반복 일정 자동화'].map((t, i) => (
              <span key={i} style={{ padding: '4px 9px', background: 'var(--c-paper)', border: '1px solid var(--c-hairline)', borderRadius: 999, fontSize: 11.5 }}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--c-blue)', marginBottom: 3 }}>꼭 봐야 할 시연 포인트</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--c-ink-2)' }}>상단 "업로드" → 샘플 시간표 선택 → 3건이 자동 인식되어 D-day 배지로 정렬되는 흐름.</div>
        </div>
      </div>
    </div>
  );
}

function RefPanel() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="jt-eyebrow" style={{ fontSize: 10 }}>참고 지표</span>
        <span className="jt-pill" style={{ background: 'var(--c-stone)', color: 'var(--c-slate)', fontSize: 9.5, padding: '2px 8px' }}>점수 미반영 · 참고용</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[['동료 평가', '★ 14표', '갤러리 좋아요와 분리'], ['반복 개선', '24 회', '프롬프트 재시도 횟수'], ['기여 균형', '0.81', '1.0에 가까울수록 균형']].map((m, i) => (
          <div key={i} style={{ padding: '11px 13px', background: 'var(--c-paper)', border: '1px solid var(--c-hairline)', borderRadius: 6 }}>
            <div style={{ fontSize: 10.5, color: 'var(--c-muted)' }}>{m[0]}</div>
            <div style={{ fontSize: 19, fontWeight: 700, fontFamily: 'var(--font-display)', margin: '2px 0' }}>{m[1]}</div>
            <div style={{ fontSize: 10, color: 'var(--c-slate)' }}>{m[2]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 9, padding: '7px 11px', background: 'var(--c-stone-wash)', borderRadius: 6, fontSize: 10.5, color: 'var(--c-slate)', display: 'flex', alignItems: 'center', gap: 7 }}>
        {Icon.warn(12)} 토큰 사용량은 평가 지표가 아닙니다 — 많이 썼다고 잘한 게 아니므로 심사 화면에 노출하지 않습니다.
      </div>
    </div>
  );
}

// ── 큐 아이템 ───────────────────────────────────────────────────────
function JudgeQueueItem({ p, index, completed }) {
  const isCurrent = p.status === 'current' && !completed;
  const isScored = p.status === 'scored' || completed;
  return (
    <div data-action={isCurrent ? undefined : 'open'} style={{
      padding: '8px 10px', borderRadius: 6, marginBottom: 2, cursor: 'pointer',
      background: isCurrent ? 'var(--c-helmet-soft)' : 'transparent',
      border: isCurrent ? '1px solid var(--c-helmet-deep)' : '1px solid transparent',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{ flex: '0 0 20px', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {isScored && <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--c-mint)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.check(11)}</span>}
        {isCurrent && <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--c-helmet)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>●</span>}
        {!isScored && !isCurrent && <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--c-hairline-strong)', color: 'var(--c-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{index}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: isScored || isCurrent ? 'var(--c-ink)' : 'var(--c-ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
          {p.team}{p.solo && <span style={{ padding: '0 5px', background: 'var(--c-stone)', borderRadius: 3, fontSize: 9 }}>솔로</span>}
        </div>
      </div>
      {isScored && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--c-mint)', paddingTop: 2 }}>{p.score}</div>}
    </div>
  );
}

// ── 루브릭 한 항목 (1~5 점 + 가중치) ────────────────────────────────
function RubricRow({ c, value, disabled }) {
  return (
    <div style={{ opacity: disabled ? 0.5 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</span>
        {c.star && <span title="과정 가중 핵심" style={{ color: 'var(--c-amber)', fontSize: 11 }}>★</span>}
        <span className="jt-pill" style={{ background: c.star ? 'var(--c-helmet-soft)' : 'var(--c-stone)', color: c.star ? 'var(--c-amber)' : 'var(--c-slate)', fontSize: 9.5, padding: '1px 6px', fontFamily: 'var(--font-mono)' }}>{c.weight}%</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: value ? 'var(--c-ink)' : 'var(--c-muted)' }}>{value || '—'}<span style={{ color: 'var(--c-muted)', fontWeight: 400 }}>/5</span></span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => {
          const active = value && i <= value;
          return (
            <button key={i} style={{
              flex: 1, height: 26, borderRadius: 4, cursor: disabled ? 'default' : 'pointer', padding: 0,
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              background: active ? 'var(--c-ink)' : 'var(--c-paper)',
              color: active ? '#fff' : 'var(--c-muted)',
              border: i === value ? '1.5px solid var(--c-ink)' : '1px solid var(--c-hairline-strong)',
            }}>{i}</button>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--c-muted)' }}>
        <span>{c.desc}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--c-slate)' }}>↪ {c.src}</span>
      </div>
    </div>
  );
}

function JudgeTab({ active, label, flag }) {
  return (
    <div data-action={active ? undefined : 'tab'} style={{
      padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: active ? 700 : 500,
      color: active ? 'var(--c-ink)' : 'var(--c-slate)',
      background: active ? 'var(--c-canvas)' : 'transparent',
      border: active ? '1px solid var(--c-hairline-strong)' : '1px solid transparent',
      borderBottom: active ? '1px solid var(--c-canvas)' : '1px solid transparent',
      borderRadius: '8px 8px 0 0',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {flag && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-amber)' }} />}
    </div>
  );
}

function JChip({ color, bg, label }) {
  return <span style={{ padding: '2px 7px', background: bg, color, borderRadius: 3, fontWeight: 700 }}>{label}</span>;
}

// ════════════════════════════════════════════════════════════════════
//  F-2. 결과 발표·시상  (운영자 발표 모드)
// ════════════════════════════════════════════════════════════════════
function F2AwardCeremony() {
  const specials = [
    { icon: '💬', label: '베스트 프롬프트', team: '터미널 사파리', tint: 'var(--c-helmet-soft)' },
    { icon: '🤝', label: '베스트 협업',     team: '커널 패닉',     tint: 'var(--c-mint-soft)' },
    { icon: '📈', label: '성장상',          team: '404 NOT FOUND', tint: 'var(--c-blue-soft)' },
    { icon: '👏', label: '관객상',          team: '코드밍아웃',     tint: 'var(--c-safety-soft)' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <AppHeader
        breadcrumb={['2026 봄 ENK 해커톤', '결과 발표']}
        user={JUDGE_USER}
        actions={
          <span className="jt-pill" style={{ background: 'var(--c-ink)', color: '#fff', fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ae0a3' }} /> 발표 모드
          </span>
        }
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', textAlign: 'center' }}>
        <div className="jt-eyebrow" style={{ fontSize: 11, marginBottom: 4 }}>심사위원 5인 채점 · 24팀</div>
        <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>오늘의 수상 팀</h1>

        {/* 포디움 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginTop: 26 }}>
          <PodiumCard rank="🥈 최우수" team="JS의 비밀" title="인디 음악 디스커버리" score={84} h={150} tint="var(--c-stone)" />
          <PodiumCard rank="🏆 대상" team="터미널 사파리" title="AI 일정관리 봇" score={91} h={196} tint="var(--c-helmet-soft)" big />
          <PodiumCard rank="🥉 우수" team="커널 패닉" title="코딩 마라톤 트래커" score={78} h={124} tint="var(--c-amber-soft)" />
        </div>

        {/* 특별상 */}
        <div style={{ marginTop: 34, width: '100%', maxWidth: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
            <span className="jt-eyebrow" style={{ fontSize: 10.5 }}>특별상</span>
            <div style={{ flex: 1, height: 1, background: 'var(--c-hairline)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {specials.map((s, i) => (
              <div key={i} className="jt-postit-card" style={{ '--postit-rot': `${i % 2 ? 1.2 : -1.0}deg`, '--postit-tint': s.tint, padding: '14px 12px' }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-slate)', marginTop: 2 }}>{s.team}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: '0 0 auto', borderTop: '1px solid var(--c-hairline)', background: 'var(--c-canvas)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>대상 → 특별상 순서로 한 카테고리씩 공개</span>
        <div style={{ flex: 1 }} />
        <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="gallery">{Icon.gallery(12)} 갤러리 보기</button>
        <button className="jt-btn jt-btn-primary jt-btn-sm" data-action="next">다음 {Icon.arrowRight(12)}</button>
      </div>
    </div>
  );
}

function PodiumCard({ rank, team, title, score, h, tint, big }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: big ? 220 : 184 }}>
      <div className="jt-postit-card" style={{ '--postit-rot': '-0.8deg', '--postit-tint': tint, width: '100%', padding: big ? '16px 14px' : '13px 12px', marginBottom: 10 }}>
        <div style={{ fontSize: big ? 15 : 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{rank}</div>
        <div style={{ fontSize: big ? 15 : 13, fontWeight: 700, marginTop: 8 }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)', marginTop: 2 }}>{team}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'center', marginTop: 9 }}>
          <span style={{ fontSize: big ? 30 : 24, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{score}</span>
          <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>/ 100</span>
        </div>
      </div>
      <div style={{ width: '100%', height: h, background: big ? 'var(--c-helmet)' : 'var(--c-stone-2)', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 12, color: big ? 'var(--c-stache)' : 'var(--c-slate)', fontFamily: 'var(--font-display)', fontSize: big ? 40 : 30, fontWeight: 700 }}>
        {rank.split(' ')[0]}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  F-1 (온보딩). 루브릭 기준 안내  (심사위원 첫 진입 — 기획 §4.3, Full)
//  심사위원이 채점 전 이번 행사의 평가 기준을 읽기전용으로 확인.
// ════════════════════════════════════════════════════════════════════
function F1RubricConfig() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <AppHeader
        breadcrumb={['2026 봄 ENK 해커톤', '심사']}
        user={JUDGE_USER}
        actions={<span className="jt-pill jt-pill-info" style={{ fontSize: 11 }}>심사위원</span>}
      />
      <main style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '36px 24px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div className="jt-eyebrow" style={{ fontSize: 11, letterSpacing: '0.16em', marginBottom: 8 }}>심사 안내</div>
            <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}>이 행사의 채점 기준</h1>
            <p style={{ fontSize: 13.5, color: 'var(--c-slate)', marginTop: 8 }}>운영자가 설정한 항목입니다. 각 항목 1–5점, 가중 합산으로 100점 환산됩니다.</p>
          </div>

          <div style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 18 }}>
            {RUBRIC.map((c, i) => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < RUBRIC.length - 1 ? '1px solid var(--c-hairline)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</span>
                    {c.star && <span title="과정 가중 핵심" style={{ color: 'var(--c-amber)', fontSize: 12 }}>★</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--c-muted)', marginTop: 2 }}>{c.desc} · 근거: {c.src}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)' }}>1–5</span>
                <span className="jt-pill" style={{ background: c.star ? 'var(--c-helmet-soft)' : 'var(--c-stone)', color: c.star ? 'var(--c-amber)' : 'var(--c-slate)', fontSize: 11, padding: '3px 10px', fontFamily: 'var(--font-mono)', minWidth: 44, textAlign: 'center' }}>{c.weight}%</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 18px', background: 'var(--c-helmet-wash)', border: '1px solid var(--c-helmet-soft)', borderRadius: 'var(--r-md)', marginBottom: 22 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>{Icon.info(14)} 이번 심사의 특징</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.7, color: 'var(--c-ink-2)' }}>
              <li><b>과정(30) &gt; 결과물(25)</b> — 결과물 완성도는 AI 성능이 좌우합니다. <b>어떻게 만들었나</b>(프롬프트 개선 궤적)를 중심으로 보세요.</li>
              <li>심사평은 필수입니다 — 결과 발표 후 팀이 함께 봅니다.</li>
              <li>토큰 사용량·동료 평가는 참고용일 뿐 점수에 반영하지 않습니다.</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="jt-btn jt-btn-primary" data-action="start" style={{ padding: '12px 28px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              채점 시작하기 {Icon.arrowRight(13)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
//  심사 단계 (B 영역 신규 — 2026-06-10)
//  종료 → 루브릭 설정 → 심사위원 관리 → (심사위원 채점 F) → 결과 집계 → 발표
//  설계 원칙: 채점은 사람 심사위원, 운영자는 설정·배정·집계·발표 제어.
// ════════════════════════════════════════════════════════════════════

// 운영자 심사 화면 공통 셸 — AppHeader(심사 breadcrumb) + grain + footer.
function JudgingShell({ crumb, children, footer }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)' }}>
      <AppHeader user={OPERATOR_USER} breadcrumb={[HACKATHON_NAME, crumb]} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 32px' }}>{children}</div>
      {footer && (
        <div style={{ flex: '0 0 auto', background: 'var(--c-canvas)', borderTop: '1px solid var(--c-hairline)', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// 심사 진입 배너 — b2-ended(SummaryView) 상단.
function JudgingEntryBanner({ totalTeams }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
      background: 'var(--c-helmet-wash)', border: '1px solid var(--c-helmet-soft)', borderRadius: 'var(--r-md)' }}>
      <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--c-helmet)', color: 'var(--c-stache)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{Icon.settings(20)}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>심사 단계를 시작하세요</div>
        <div style={{ fontSize: 12.5, color: 'var(--c-ink-3)', marginTop: 2 }}>
          산출물 제출 완료 <b style={{ color: 'var(--c-ink)' }}>{totalTeams}팀</b> · 루브릭을 정하고 심사위원에게 작품을 배정합니다.
        </div>
      </div>
      <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="start-rubric">루브릭 설정</button>
      <button className="jt-btn jt-btn-helmet jt-btn-sm" data-action="start-judging" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>심사 시작 {Icon.arrowRight(12)}</button>
    </div>
  );
}

// 심사 단계 진행 stepper (1 루브릭 · 2 심사위원 · 3 채점 · 4 집계·발표)
function JudgingStepper({ active }) {
  const steps = ['루브릭 설정', '심사위원 배정', '채점 진행', '집계·발표'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      {steps.map((s, i) => {
        const on = i === active, done = i < active;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--c-hairline-strong)', fontSize: 12 }}>›</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999,
              background: on ? 'var(--c-ink)' : done ? 'var(--c-mint-soft)' : 'var(--c-stone)',
              color: on ? '#fff' : done ? 'var(--c-mint)' : 'var(--c-slate)', fontSize: 11.5, fontWeight: on ? 700 : 500 }}>
              <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{done ? '✓' : i + 1}</span>{s}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── B-3. 루브릭 설정 ──────────────────────────────────────────────
const RUBRIC_PRESETS = [
  { key: 'process', label: '기본 (과정 가중)', desc: '과정 30 > 결과물 25', saved: true },
  { key: 'output', label: '결과물 중심', desc: '결과물 35 · 완성도 우선', saved: false },
  { key: 'collab', label: '협업 가중', desc: '협업 25 · 팀워크 강조', saved: false },
];
const OP_RUBRIC = [
  { label: '문제 정의·아이디어', weight: 20, scale: '1–5', desc: '누구의 어떤 문제를 풀었나', star: false },
  { label: '과정·프롬프트 사고력', weight: 30, scale: '1–5', desc: '문제를 어떻게 분해해 AI에게 시켰나', star: true },
  { label: '결과물 완성·실용', weight: 25, scale: '1–5', desc: '실제로 동작하고 끝까지 닿는가', star: false },
  { label: '협업·기여 균형', weight: 15, scale: '1–5', desc: '팀원이 고루 참여했나 (팀)', star: false },
  { label: '발표·전달', weight: 10, scale: '1–5', desc: '문제·해결을 잘 설명했나', star: false },
];

function B3RubricSettings() {
  const total = OP_RUBRIC.reduce((s, r) => s + r.weight, 0);
  return (
    <JudgingShell crumb="심사 설정"
      footer={<>
        <span style={{ fontSize: 11.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>심사위원이 이 기준으로 채점합니다 · 자동 합산 점수 없음</span>
        <div style={{ flex: 1 }} />
        <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="cancel">취소</button>
        <button className="jt-btn jt-btn-primary jt-btn-sm" data-action="save" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>저장하고 다음 {Icon.arrowRight(12)}</button>
      </>}>
      <JudgingStepper active={0} />
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontFamily: 'var(--font-display)' }}>루브릭 설정</h1>
        <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 4 }}>심사 항목과 배점을 정합니다. 바이브코딩은 결과물보다 <b style={{ color: 'var(--c-ink-2)' }}>과정</b>에 무게를 두는 기본 프리셋을 권합니다.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 300px) minmax(0, 1fr) minmax(220px, 280px)', gap: 18, alignItems: 'start' }}>
        {/* 좌 — 프리셋 */}
        <div>
          <div className="jt-eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>프리셋</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RUBRIC_PRESETS.map((p, i) => (
              <div key={i} data-action="select-preset" style={{ padding: '11px 13px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                background: p.saved ? 'var(--c-helmet-soft)' : 'var(--c-canvas)',
                border: p.saved ? '1px solid var(--c-helmet-deep)' : '1px solid var(--c-hairline)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.label}</span>
                  {p.saved && <span className="jt-pill" style={{ background: 'var(--c-helmet)', color: 'var(--c-stache)', fontSize: 9, padding: '1px 6px' }}>적용됨</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--c-slate)', marginTop: 3 }}>{p.desc}</div>
              </div>
            ))}
            <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{ justifyContent: 'flex-start', marginTop: 2 }}>+ 새 템플릿으로 저장</button>
          </div>
        </div>

        {/* 중 — 항목 테이블 */}
        <div style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 28px', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--c-hairline)', background: 'var(--c-paper)', fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            <span>항목</span><span style={{ textAlign: 'center' }}>배점</span><span style={{ textAlign: 'center' }}>척도</span><span />
          </div>
          {OP_RUBRIC.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 28px', gap: 8, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--c-hairline)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</span>
                  {r.star && <span title="과정 가중 핵심" style={{ color: 'var(--c-amber)', fontSize: 11 }}>★</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 1 }}>{r.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <input className="jt-input" defaultValue={r.weight} style={{ width: 42, textAlign: 'center', padding: '5px 4px', fontFamily: 'var(--font-mono)', fontWeight: 700 }} />
                <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>%</span>
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-slate)' }}>{r.scale}</div>
              <button data-action="delete-item" className="jt-icon-btn" style={{ color: 'var(--c-muted)', width: 24, height: 24 }} title="삭제">{Icon.x(13)}</button>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', background: 'var(--c-paper)' }}>
            <button data-action="add-item" className="jt-btn jt-btn-ghost jt-btn-sm" style={{ padding: '4px 8px' }}>+ 항목 추가</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>합계</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: total === 100 ? 'var(--c-mint)' : 'var(--c-safety)' }}>{total}</span>
              <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>/ 100 {total === 100 && Icon.check(12)}</span>
            </div>
          </div>
        </div>

        {/* 우 — 보조 설정 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="jt-eyebrow" style={{ fontSize: 10 }}>보조 데이터 (점수 미반영)</div>
          <ToggleCard label="동료 평가" desc="참가자 상호 투표 · 심사 참고용" on />
          <ToggleCard label="자동 지표" desc="반복 횟수·기여 균형 · 트리아지" on={false} />
          <div style={{ padding: '10px 12px', background: 'var(--c-stone-wash)', borderRadius: 'var(--r-sm)', fontSize: 10.5, color: 'var(--c-slate)', display: 'flex', gap: 7, lineHeight: 1.5 }}>
            {Icon.warn(13)} 토큰 사용량은 평가 지표가 아닙니다. 보조 데이터는 점수에 자동 반영되지 않고 심사위원 참고로만 쓰입니다.
          </div>
        </div>
      </div>
    </JudgingShell>
  );
}

function ToggleCard({ label, desc, on }) {
  return (
    <div data-action="toggle" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 13px', background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: 'var(--c-muted)', marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{ width: 36, height: 20, borderRadius: 999, background: on ? 'var(--c-mint)' : 'var(--c-stone-2)', position: 'relative', flex: '0 0 auto', transition: 'background .15s' }}>
        <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
}

// ── B-3. 심사위원 관리 (초대·배정) ───────────────────────────────
const JUDGES = [
  { name: '서리림', email: 'seo.r@enk.kr', status: 'scoring', assigned: 12, done: 8 },
  { name: '정도현', email: 'jung.dh@univ.ac.kr', status: 'accepted', assigned: 12, done: 3 },
  { name: '한가람', email: 'han.g@enk.kr', status: 'accepted', assigned: 12, done: 0 },
  { name: '오세진', email: 'oh.sj@corp.com', status: 'invited', assigned: 12, done: 0 },
  { name: '문보경', email: 'moon.bk@univ.ac.kr', status: 'invited', assigned: 12, done: 0 },
];
const JUDGE_STATUS = {
  invited: { label: '초대 중', bg: 'var(--c-stone)', fg: 'var(--c-slate)' },
  accepted: { label: '수락', bg: 'var(--c-blue-soft)', fg: 'var(--c-blue)' },
  scoring: { label: '채점 중', bg: 'var(--c-helmet-soft)', fg: 'var(--c-amber)' },
};

function B3JudgeManagement({ tab = 'invite' }) {
  return (
    <JudgingShell crumb="심사위원"
      footer={<>
        <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="back">{Icon.arrowLeft(12)} 뒤로</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>심사위원 {JUDGES.length}명 · 60팀 배정</span>
        <button className="jt-btn jt-btn-primary jt-btn-sm" data-action="start-judging" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>심사 시작 {Icon.arrowRight(12)}</button>
      </>}>
      <JudgingStepper active={1} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: 'var(--font-display)' }}>심사위원 관리</h1>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 4 }}>심사위원을 초대하고 작품을 분담합니다.</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--c-stone)', padding: 3, borderRadius: 999 }}>
          {[['invite', '초대'], ['assign', '배정 현황']].map(([k, l]) => (
            <span key={k} data-action="tab" style={{ padding: '6px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: tab === k ? 700 : 500, cursor: 'pointer',
              background: tab === k ? 'var(--c-canvas)' : 'transparent', color: tab === k ? 'var(--c-ink)' : 'var(--c-slate)',
              boxShadow: tab === k ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-md)', overflow: 'hidden', maxWidth: 860 }}>
        {tab === 'invite' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: 8, padding: '10px 18px', borderBottom: '1px solid var(--c-hairline)', background: 'var(--c-paper)', fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              <span>이름</span><span>이메일</span><span style={{ textAlign: 'center' }}>상태</span>
            </div>
            {JUDGES.map((j, i) => {
              const st = JUDGE_STATUS[j.status];
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: 8, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--c-hairline)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="jt-avatar" style={{ background: 'var(--c-stone-2)', color: 'var(--c-ink-3)', width: 26, height: 26, fontSize: 10, fontWeight: 700 }}>{j.name.slice(-2)}</div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{j.name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--c-slate)' }}>{j.email}</span>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                    <span className="jt-pill" style={{ background: st.bg, color: st.fg, fontSize: 10.5, padding: '3px 10px' }}>{st.label}</span>
                    {j.status === 'invited' && <button data-action="copy-link" className="jt-icon-btn" style={{ width: 24, height: 24, color: 'var(--c-muted)' }} title="초대 링크 복사">{Icon.copy(12)}</button>}
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '12px 18px', background: 'var(--c-paper)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="jt-input" placeholder="심사위원 이메일 입력" style={{ flex: 1, maxWidth: 320 }} />
              <button data-action="add-judge" className="jt-btn jt-btn-secondary jt-btn-sm">{Icon.send(12)} 초대 보내기</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr 70px', gap: 10, padding: '10px 18px', borderBottom: '1px solid var(--c-hairline)', background: 'var(--c-paper)', fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              <span>심사위원</span><span style={{ textAlign: 'center' }}>분담</span><span>진행률</span><span style={{ textAlign: 'right' }}>완료</span>
            </div>
            {JUDGES.map((j, i) => {
              const pct = Math.round((j.done / j.assigned) * 100);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr 70px', gap: 10, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--c-hairline)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{j.name}</span>
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{j.assigned}팀</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--c-stone)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--c-mint)' : 'var(--c-helmet)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)', minWidth: 32 }}>{pct}%</span>
                  </div>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700 }}>{j.done}/{j.assigned}</span>
                </div>
              );
            })}
            <div style={{ padding: '12px 18px', background: 'var(--c-paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>60팀을 균등 분담 (팀당 2인 교차 채점 · Full)</span>
              <button data-action="auto-assign" className="jt-btn jt-btn-secondary jt-btn-sm">{Icon.refresh(12)} 자동 배정</button>
            </div>
          </>
        )}
      </div>
    </JudgingShell>
  );
}

// ── B-3. 심사 결과 집계·발표 제어 ────────────────────────────────
const TALLY = [
  { team: '터미널 사파리', title: 'AI 일정관리 봇', scores: [91, 89], award: '대상' },
  { team: 'JS의 비밀', title: '인디 음악 디스커버리', scores: [84, 86], award: '최우수' },
  { team: '커널 패닉', title: '코딩 마라톤 트래커', scores: [79, 77], award: '우수' },
  { team: '디버그 라이프', title: '학식 매니저', scores: [76, 76], award: null },
  { team: 'await me', title: '러닝 페이스메이커', scores: [74, 72], award: null },
];

function B3ResultsTally() {
  const avg = (s) => (s.reduce((a, b) => a + b, 0) / s.length).toFixed(1);
  return (
    <JudgingShell crumb="결과 집계"
      footer={<>
        <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="back">{Icon.arrowLeft(12)} 뒤로</button>
        <div style={{ flex: 1 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--c-slate)', cursor: 'pointer' }}>
          <span data-action="toggle-public" style={{ width: 34, height: 19, borderRadius: 999, background: 'var(--c-mint)', position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: 2, left: 17, width: 15, height: 15, borderRadius: '50%', background: '#fff' }} />
          </span>
          참가자에게 점수 공개
        </label>
        <button className="jt-btn jt-btn-helmet jt-btn-sm" data-action="start-awards" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>발표 시작 {Icon.arrowRight(12)}</button>
      </>}>
      <JudgingStepper active={3} />
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontFamily: 'var(--font-display)' }}>심사 결과 집계</h1>
        <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 4 }}>심사위원 5인의 루브릭 채점을 모았습니다. <b style={{ color: 'var(--c-ink-2)' }}>플랫폼 자동 점수가 아니라</b> 심사위원 점수의 합의·평균입니다.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* 점수 행렬 */}
        <div style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--c-hairline)', background: 'var(--c-paper)' }}>
            <span className="jt-eyebrow" style={{ fontSize: 10 }}>점수 집계 · 심사위원 5인</span>
            <button data-action="export-csv" className="jt-btn jt-btn-ghost jt-btn-sm" style={{ padding: '3px 8px', fontSize: 11 }}>CSV 내려받기</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 60px', gap: 6, padding: '9px 16px', borderBottom: '1px solid var(--c-hairline)', fontSize: 10, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            <span>팀</span><span style={{ textAlign: 'center' }}>서리림</span><span style={{ textAlign: 'center' }}>정도현</span><span style={{ textAlign: 'right' }}>평균</span>
          </div>
          {TALLY.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 60px', gap: 6, alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid var(--c-hairline)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)' }}>{t.team}</div>
              </div>
              {t.scores.map((s, k) => <span key={k} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--c-slate)' }}>{s}</span>)}
              <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{avg(t.scores)}</span>
            </div>
          ))}
        </div>

        {/* 시상 카테고리 확정 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="jt-eyebrow" style={{ fontSize: 10 }}>시상 카테고리 확정</div>
          {[['🏆 대상', '터미널 사파리', '90.0', 'var(--c-helmet-soft)'], ['🥈 최우수', 'JS의 비밀', '85.0', 'var(--c-stone)'], ['🥉 우수', '커널 패닉', '78.0', 'var(--c-amber-soft)']].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', background: a[3], borderRadius: 'var(--r-sm)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, flex: '0 0 78px' }}>{a[0]}</span>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{a[1]}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700 }}>{a[2]}</span>
            </div>
          ))}
          {/* 동률 경고 */}
          <div style={{ padding: '11px 13px', border: '1px solid var(--c-safety-soft)', background: 'var(--c-safety-wash)', borderRadius: 'var(--r-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: 'var(--c-safety-deep)' }}>{Icon.warn(13)} 동률 — 우수 한 자리</div>
            <div style={{ fontSize: 11.5, color: 'var(--c-ink-3)', margin: '5px 0 8px' }}>디버그 라이프 · await me 가 76.0 동점입니다.</div>
            <button data-action="resolve-tie" className="jt-btn jt-btn-secondary jt-btn-sm" style={{ fontSize: 11 }}>동률 처리</button>
          </div>
          <button data-action="add-special-award" className="jt-btn jt-btn-ghost jt-btn-sm" style={{ justifyContent: 'flex-start' }}>+ 특별상 추가 (베스트 프롬프트·협업·성장상…)</button>
        </div>
      </div>
    </JudgingShell>
  );
}


// ════════════════════════════════════════════════════════════════════
//  C-5. 산출물 제출·소개  (심사 데이터원 — 기획 §4.2)
//  해커톤 종료 직전 팀이 작품 소개 작성. AI 자동 초안 → 편집.
//  발표(10)·문제정의(20) 채점 데이터원. judge.jsx IntroPanel과 동일 내용.
// ════════════════════════════════════════════════════════════════════
function C5SubmitIntro({ stateVariant = 'editing' }) {
  const submitted = stateVariant === 'submitted';
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)',
    }}>
      <AppHeader
        user={null}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 12, borderRight: '1px solid var(--c-hairline)' }}>
            <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>
              {DEFAULT_PARTICIPANT_USER.name} · {DEFAULT_PARTICIPANT_USER.team}
            </span>
            <div className="jt-avatar" style={{ background: DEFAULT_PARTICIPANT_USER.color, color: '#fff', width: 26, height: 26, fontSize: 10, fontWeight: 700, letterSpacing: '-0.04em' }}>
              {DEFAULT_PARTICIPANT_USER.name.slice(-2)}
            </div>
          </div>
        }
      />

      <main style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <div>
              <div className="jt-eyebrow" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--c-helmet-deep)', marginBottom: 7 }}>마무리 단계</div>
              <h1 style={{ fontSize: 30, lineHeight: 1.18, letterSpacing: '-0.025em', fontFamily: 'var(--font-display)', fontWeight: 800 }}>우리 작품을 소개해 주세요</h1>
              <p style={{ fontSize: 13.5, color: 'var(--c-slate)', lineHeight: 1.6, marginTop: 8, maxWidth: 520 }}>
                심사위원이 가장 먼저 보는 정보예요. AI가 대화 기록으로 초안을 써뒀으니 다듬기만 하면 됩니다.
              </p>
            </div>
            {!submitted && (
              <div style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', padding: '7px 13px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 12, boxShadow: '0 1px 2px rgba(20,19,15,0.04)' }}>
                {Icon.clock(13)} <span style={{ color: 'var(--c-slate)' }}>제출 마감</span> <b style={{ color: 'var(--c-safety-deep)' }}>5:00</b>
              </div>
            )}
          </div>

          <div className="jt-postit-card jt-postit-tape-lg" style={{ '--postit-rot': '-0.4deg', '--postit-tint': 'var(--c-canvas)', padding: '26px 26px 22px' }}>
            <SubmitField label="작품 이름">
              <input className="jt-input" defaultValue="AI 일정관리 봇" disabled={submitted}
                style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)' }} />
            </SubmitField>

            <SubmitField label="어떤 문제를 풀었나요?" ai>
              <textarea className="jt-input" rows={2} disabled={submitted} style={{ resize: 'none', fontSize: 13, lineHeight: 1.6 }}
                defaultValue="강의 시간표·과제 마감을 일일이 손으로 옮겨 적다 놓치는 일이 잦았다. 사진 한 장이면 일정이 자동 등록되게 만들었다." />
            </SubmitField>

            <SubmitField label="핵심 기능 3가지" ai>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['📷 사진 OCR 일정 등록', '🔔 D-1 카톡 알림', '🔁 반복 일정 자동화'].map((t, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--c-paper)', border: '1px solid var(--c-hairline)', borderRadius: 999, fontSize: 12.5 }}>
                    {t}{!submitted && <span style={{ color: 'var(--c-muted)', cursor: 'pointer', fontSize: 13 }}>×</span>}
                  </span>
                ))}
                {!submitted && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 12px', border: '1px dashed var(--c-hairline-strong)', borderRadius: 999, fontSize: 12.5, color: 'var(--c-slate)', cursor: 'pointer' }}>+ 추가</span>}
              </div>
            </SubmitField>

            <SubmitField label="심사위원이 꼭 봐야 할 시연 포인트" last>
              <textarea className="jt-input" rows={2} disabled={submitted} style={{ resize: 'none', fontSize: 13, lineHeight: 1.6 }}
                defaultValue="상단 “업로드” → 샘플 시간표 선택 → 3건이 자동 인식되어 D-day 배지로 정렬되는 흐름." />
            </SubmitField>
          </div>

          {submitted ? (
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--c-mint-wash)', border: '1px solid var(--c-mint-soft)', borderRadius: 'var(--r-md)' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-mint)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{Icon.check(15)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c-mint)' }}>제출 완료</div>
                <div style={{ fontSize: 11.5, color: 'var(--c-ink-3)' }}>마감 전까지 언제든 다시 수정할 수 있어요.</div>
              </div>
              <button className="jt-btn jt-btn-secondary jt-btn-sm" data-action="edit">다시 수정</button>
            </div>
          ) : (
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="jt-btn jt-btn-secondary" data-action="ai-regenerate" style={{ padding: '11px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {Icon.refresh(13)} AI로 초안 다시 쓰기
              </button>
              <div style={{ flex: 1 }} />
              <button className="jt-btn jt-btn-helmet" data-action="submit" style={{ padding: '11px 24px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                제출하기 {Icon.send(13)}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SubmitField({ label, ai, last, children }) {
  return (
    <div style={{ marginBottom: last ? 0 : 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c-ink-2)' }}>{label}</span>
        {ai && (
          <span className="jt-pill" style={{ background: 'var(--c-tutorial-soft)', color: 'var(--c-tutorial)', fontSize: 9.5, padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            ✨ AI 초안
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  C-결과. 참가자 결과 뷰  (심사 후 본인 팀 결과 — 기획 §4.4, Full)
//  c1-ended(종료 직후 갤러리 유도)와 구분 — 이건 심사 완료 후 결과 확인.
// ════════════════════════════════════════════════════════════════════
function CParticipantResult({ scorePublic = true, awarded = true }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0 / 24px 24px, var(--c-paper)',
    }}>
      <AppHeader
        user={null}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 12, borderRight: '1px solid var(--c-hairline)' }}>
            <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-muted)' }}>
              {DEFAULT_PARTICIPANT_USER.name} · {DEFAULT_PARTICIPANT_USER.team}
            </span>
            <div className="jt-avatar" style={{ background: DEFAULT_PARTICIPANT_USER.color, color: '#fff', width: 26, height: 26, fontSize: 10, fontWeight: 700, letterSpacing: '-0.04em' }}>
              {DEFAULT_PARTICIPANT_USER.name.slice(-2)}
            </div>
          </div>
        }
      />

      <main style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '36px 24px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div className="jt-eyebrow" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--c-helmet-deep)', marginBottom: 8 }}>심사 결과</div>
            <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}>터미널 사파리 · AI 일정관리 봇</h1>
          </div>

          <div className="jt-postit-card" style={{ '--postit-rot': '-0.6deg', '--postit-tint': awarded ? 'var(--c-helmet-wash)' : 'var(--c-canvas)', padding: '26px 24px', textAlign: 'center', marginBottom: 18 }}>
            {awarded && <div style={{ fontSize: 40, lineHeight: 1 }}>🏆</div>}
            {awarded && <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 8 }}>대상</div>}
            {scorePublic ? (
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginTop: awarded ? 12 : 0 }}>
                <span style={{ fontSize: 44, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>91</span>
                <span style={{ fontSize: 16, color: 'var(--c-muted)' }}>/ 100</span>
              </div>
            ) : (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--c-slate)' }}>점수는 공개하지 않습니다 — 심사평으로 확인하세요.</div>
            )}
            {awarded && <div style={{ marginTop: 10, display: 'inline-flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="jt-pill" style={{ background: 'var(--c-mint-soft)', color: 'var(--c-mint)', fontSize: 11, padding: '3px 10px' }}>🤝 베스트 협업</span>
            </div>}
          </div>

          <div style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)', borderRadius: 'var(--r-md)', padding: '18px 20px', marginBottom: 20 }}>
            <div className="jt-eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>심사평</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 30, lineHeight: 1, color: 'var(--c-helmet-deep)', fontFamily: 'var(--font-display)' }}>“</span>
              <p style={{ flex: 1, fontSize: 14, lineHeight: 1.7, color: 'var(--c-ink-2)' }}>
                검색 구조를 세 번에 걸쳐 다듬은 과정이 인상적입니다. 사진→일정 흐름이 자연스럽고, 막혔던 결제 단계를 분리해 풀어낸 판단이 좋았어요.
              </p>
            </div>
            <div style={{ marginTop: 10, textAlign: 'right', fontSize: 11.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>— 심사위원 5인의 채점</div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="jt-btn jt-btn-secondary" data-action="open-gallery-team" style={{ padding: '11px 18px' }}>{Icon.gallery(13)} 우리 작품 보기</button>
            <button className="jt-btn jt-btn-critical" data-action="open-gallery-all" style={{ padding: '11px 20px' }}>전체 갤러리 보기 {Icon.arrowRight(13)}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, {
  // 심사위원 (F)
  F1RubricConfig, F1JudgeDashboard, F2AwardCeremony,
  // 참여자 (C-5 산출물 제출 / C-결과)
  C5SubmitIntro, CParticipantResult,
  // 운영자 (B-3 심사 단계) + b2-ended 진입 배너(operator SummaryView에서 참조)
  B3RubricSettings, B3JudgeManagement, B3ResultsTally, JudgingEntryBanner,
});
