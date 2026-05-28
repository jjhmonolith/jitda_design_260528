/* F. 심사 영역
   F-1. 심사위원 대시보드 — 해커톤 종료 후 결과물 채점
*/

const JUDGE_USER = { name: '서리림', email: 'seo.r@enk.kr', initial: '서' };

// ── F-1. 심사위원 대시보드 ────────────────────────────────────
// 컴포넌트: 프로젝트 목록 / 라이브 앱 / 채점 기준 / 코멘트 / 다음 프로젝트
//          / 기여도 보기 / 채점 진행률 / 채점 현황 표 (전체 프로젝트 내 채점 현황)
function F1JudgeDashboard({ stateVariant = 'scoring' }) {
  const isCompleted = stateVariant === 'completed';

  const projects = [
    { id: 1, team: '터미널 사파리', title: 'AI 일정관리 봇', tagline: '사진 한 장으로 일정 등록', preview: 'calendar', status: 'current', myScore: null },
    { id: 2, team: 'JS의 비밀', title: '인디 음악 디스커버리', tagline: '오늘 발견한 새 아티스트', preview: 'music', status: 'scored', myScore: 38 },
    { id: 3, team: '디버그 라이프', title: '학식 매니저', tagline: '오늘 점심 뭐 먹지', preview: 'food', status: 'scored', myScore: 31 },
    { id: 4, team: '커널 패닉', title: '코딩 마라톤 트래커', tagline: '얼마나 코딩했는지 보여줘', preview: 'chart', status: 'pending' },
    { id: 5, team: 'undefined', title: '봇 마실 음료 추천', tagline: '코딩 단계별 음료', preview: 'drink', status: 'pending' },
    { id: 6, team: 'await me', title: '러닝 페이스 메이커', tagline: '오늘 컨디션에 맞춰', preview: 'run', status: 'pending' },
    { id: 7, team: '404 NOT FOUND', title: '캠퍼스 분실물 지도', tagline: '잃어버린 건 다 여기에', preview: 'map', status: 'pending' },
    { id: 8, team: '코드밍아웃', title: '강의 자동 요약기', tagline: '오늘 수업 한 줄로', preview: 'doc', status: 'pending' },
  ];

  const scoredCount = projects.filter(p => p.status === 'scored').length;
  const total = projects.length;
  const progress = isCompleted ? total : scoredCount;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      {/* GNB — 운영자와 동일한 패턴 */}
      <AppHeader
        breadcrumb={['2026 봄 ENK 해커톤', '심사']}
        user={JUDGE_USER}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="jt-pill jt-pill-info" style={{ fontSize: 11 }}>심사위원</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 10px',
              background: 'var(--c-stone)', borderRadius: 4,
              fontSize: 11.5, fontFamily: 'var(--font-mono)',
            }}>
              <span style={{ color: 'var(--c-slate)' }}>채점 진행</span>
              <span style={{ fontWeight: 700, color: 'var(--c-ink)' }}>{progress} / {total}</span>
              <div style={{ width: 60, height: 4, background: 'var(--c-canvas)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  width: `${(progress / total) * 100}%`, height: '100%',
                  background: isCompleted ? 'var(--c-mint)' : 'var(--c-helmet)',
                }} />
              </div>
            </div>
          </div>
        }
      />

      {/* 3컬럼: 프로젝트 목록 / 라이브 앱 / 채점 패널 */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* ── 좌측: 프로젝트 목록 + 현황 표 ─────── */}
        <aside style={{
          flex: '0 0 248px',
          background: 'var(--c-canvas)',
          borderRight: '1px solid var(--c-hairline)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--c-hairline)' }}>
            <div className="jt-eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>오늘의 프로젝트</div>
            <h3 style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700 }}>채점 현황 · 8개</h3>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>
              <Chip color="var(--c-mint)" bg="var(--c-mint-soft)" label={`✓ 채점 ${scoredCount}`} />
              <Chip color="var(--c-helmet)" bg="var(--c-helmet-soft)" label="● 진행 1" />
              <Chip color="var(--c-slate)" bg="var(--c-stone)" label={`○ 남음 ${total - scoredCount - 1}`} />
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '8px 8px' }}>
            {projects.map((p, i) => (
              <ProjectListItem key={p.id} p={p} index={i + 1} />
            ))}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--c-hairline)', background: 'var(--c-paper)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 6 }}>
              마감까지
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>02:42:18</span>
              <span style={{ fontSize: 11, color: 'var(--c-slate)' }}>오늘 21:00</span>
            </div>
          </div>
        </aside>

        {/* ── 가운데: 라이브 앱 미리보기 ─────── */}
        <section style={{
          flex: 1,
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column',
          minWidth: 0,
          background: 'var(--c-stone-2)',
        }}>
          {/* 프로젝트 헤더 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
                01 / 08 · 터미널 사파리 · 4명
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 24, lineHeight: 1.2 }}>AI 일정관리 봇</h2>
                <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 4 }}>
                  강의 시간표 사진 한 장이면 끝. OCR로 일정을 뽑아 카톡으로 D-1 알림까지.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="jt-btn jt-btn-secondary jt-btn-sm">{Icon.external(11)} 새 탭에서 열기</button>
                <button className="jt-btn jt-btn-secondary jt-btn-sm">{Icon.users(11)} 기여도 보기</button>
              </div>
            </div>
          </div>

          {/* 라이브 앱 영역 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: 'var(--c-canvas)',
            border: '1px solid var(--c-hairline-strong)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* 미니 브라우저 바 */}
            <div style={{
              flex: '0 0 auto',
              padding: '8px 14px',
              background: '#f0eee9',
              borderBottom: '1px solid var(--c-hairline)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ddd9d0' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ddd9d0' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ddd9d0' }} />
              </div>
              <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)', textAlign: 'center' }}>
                terminal-safari.jitda.app
              </div>
              <span className="jt-pill" style={{
                background: 'var(--c-ink)', color: '#fff', fontSize: 9.5, padding: '3px 7px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5ae0a3' }} />
                LIVE
              </span>
            </div>

            {/* 실제 앱 모형 */}
            <div style={{ flex: 1, overflow: 'auto', padding: 24, background: '#fff7e8' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#a06a0a', letterSpacing: '0.14em' }}>AI CALENDAR BOT · LIVE</div>
              <h1 style={{ fontSize: 28, lineHeight: 1.15, marginTop: 8 }}>오늘 할 일을<br/>사진 한 장으로</h1>

              <div style={{
                marginTop: 18,
                background: 'var(--c-canvas)',
                border: '1.5px dashed #f3a995',
                borderRadius: 10,
                padding: 18,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ fontSize: 30 }}>📷</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>강의 시간표를 찍어보세요</div>
                  <div style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>OCR이 일정으로 변환합니다</div>
                </div>
                <button className="jt-btn jt-btn-sm" style={{ background: '#ff9b3e', color: '#fff', borderColor: '#ff9b3e' }}>업로드</button>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="jt-mono" style={{ fontSize: 11, color: 'var(--c-slate)', letterSpacing: '0.08em', marginBottom: 8 }}>최근 인식한 일정 · 3건</div>
                {[
                  ['데이터구조 과제', '5/22 18:00', 'D-0', 'rose'],
                  ['알고리즘 중간고사', '5/24 09:00', 'D-2', 'amber'],
                  ['종강총회', '6/8 19:00', 'D-17', 'slate'],
                ].map((row, i) => (
                  <div key={i} style={{
                    background: 'var(--c-canvas)',
                    border: '1px solid var(--c-hairline)',
                    borderRadius: 6,
                    padding: '10px 14px',
                    marginBottom: 6,
                    display: 'flex', gap: 14, alignItems: 'center',
                  }}>
                    <div style={{
                      padding: '4px 8px',
                      background: row[3] === 'rose' ? 'var(--c-safety-soft)' : row[3] === 'amber' ? 'var(--c-amber-soft)' : 'var(--c-stone)',
                      color: row[3] === 'rose' ? 'var(--c-safety)' : row[3] === 'amber' ? 'var(--c-amber)' : 'var(--c-ink-3)',
                      borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      minWidth: 40, textAlign: 'center',
                    }}>{row[2]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{row[0]}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-slate)' }}>{row[1]}</div>
                    </div>
                    <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>알림 켜기</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 우측: 채점 패널 ─────── */}
        <aside style={{
          flex: '0 0 360px',
          background: 'var(--c-canvas)',
          borderLeft: '1px solid var(--c-hairline)',
          display: 'flex', flexDirection: 'column',
          minHeight: 0,
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--c-hairline)',
          }}>
            <div className="jt-eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>심사 · 4개 항목</div>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>점수 매기기</h3>
            <p style={{ fontSize: 11.5, color: 'var(--c-slate)', marginTop: 4, lineHeight: 1.5 }}>
              각 항목 0–10점. 합계는 자동 계산됩니다.
            </p>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ScoreCriterion label="기획·문제정의" desc="누구의 어떤 문제를 푸는가" value={9} max={10} />
            <ScoreCriterion label="완성도" desc="실제로 동작하고 끝까지 흐름이 닿는가" value={8} max={10} />
            <ScoreCriterion label="기술·접근" desc="AI를 잘 활용했는가" value={7} max={10} />
            <ScoreCriterion label="발견·재미" desc="만들고 싶었던 마음이 보이는가" value={null} max={10} />

            {/* 코멘트 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>코멘트</span>
                <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>· 팀원이 함께 봅니다</span>
              </div>
              <textarea
                className="jt-input"
                rows={4}
                style={{ resize: 'none', fontSize: 12.5, lineHeight: 1.55 }}
                placeholder="짧게라도 좋으니, 인상 깊었던 점을 한 줄."
                defaultValue={'사진 한 장으로 일정을 뽑는 흐름이 부드럽고, D-0/D-2 강조가 직관적이에요. 카톡 연동까지 닿은 점이 인상적.'}
              />
            </div>

            {/* 합계 */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--c-paper)',
              border: '1px solid var(--c-hairline-strong)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 12, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>합계 (현재)</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>24</span>
              <span style={{ fontSize: 14, color: 'var(--c-muted)' }}>/ 40</span>
            </div>
          </div>

          {/* 액션 */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--c-hairline)',
            background: 'var(--c-paper)',
            display: 'flex', gap: 8,
          }}>
            <button className="jt-btn jt-btn-secondary jt-btn-sm" style={{ flex: 1 }}>
              {Icon.arrowLeft(11)} 이전
            </button>
            <button className="jt-btn jt-btn-primary jt-btn-sm" style={{ flex: 2 }}>
              저장하고 다음 {Icon.arrowRight(11)}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Chip({ color, bg, label }) {
  return (
    <span style={{
      padding: '2px 7px',
      background: bg, color,
      borderRadius: 3,
      fontWeight: 600,
    }}>{label}</span>
  );
}

function ProjectListItem({ p, index }) {
  const isCurrent = p.status === 'current';
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 4,
      background: isCurrent ? 'var(--c-helmet-soft)' : 'transparent',
      border: isCurrent ? '1px solid var(--c-helmet-deep)' : '1px solid transparent',
      marginBottom: 2,
      cursor: 'pointer',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{
        flex: '0 0 22px', height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 2,
      }}>
        {p.status === 'scored' && (
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'var(--c-mint)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11,
          }}>{Icon.check(11)}</span>
        )}
        {p.status === 'current' && (
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'var(--c-helmet)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
          }}>●</span>
        )}
        {p.status === 'pending' && (
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '1.5px solid var(--c-hairline-strong)',
            color: 'var(--c-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
          }}>{index}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600,
          color: p.status === 'pending' ? 'var(--c-ink-3)' : 'var(--c-ink)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{p.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--c-muted)', marginTop: 1 }}>
          {p.team}
        </div>
      </div>
      {p.myScore != null && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          color: 'var(--c-mint)',
          paddingTop: 2,
        }}>{p.myScore}</div>
      )}
    </div>
  );
}

function ScoreCriterion({ label, desc, value, max }) {
  const isEmpty = value == null;
  const v = value ?? 0;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--c-muted)', flex: 1 }}>· {desc}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
          color: isEmpty ? 'var(--c-muted)' : 'var(--c-ink)',
          minWidth: 36, textAlign: 'right',
        }}>
          {isEmpty ? '—' : v} / {max}
        </span>
      </div>
      {/* 0-10 스텝 트랙 */}
      <div style={{
        display: 'flex', gap: 3,
        height: 22,
      }}>
        {Array.from({ length: max + 1 }).map((_, i) => {
          const active = !isEmpty && i <= v;
          const tone = i <= 3 ? 'var(--c-safety-soft)' : i <= 7 ? 'var(--c-amber-soft)' : 'var(--c-mint-soft)';
          const activeTone = i <= 3 ? 'var(--c-safety)' : i <= 7 ? 'var(--c-amber)' : 'var(--c-mint)';
          return (
            <button key={i} style={{
              flex: 1,
              background: active ? activeTone : tone,
              border: i === v && !isEmpty ? '1.5px solid var(--c-ink)' : '1px solid transparent',
              borderRadius: 2,
              fontSize: 9.5, fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: active ? '#fff' : 'var(--c-ink-3)',
              cursor: 'pointer',
              padding: 0,
              opacity: isEmpty ? 0.5 : 1,
            }}>{i}</button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { F1JudgeDashboard });
