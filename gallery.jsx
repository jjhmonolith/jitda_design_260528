/* D. 갤러리 영역 — D-1 목록, D-2 상세
   · 브라우저 헤더(상단 macOS chrome) 삭제 — AppHeader 동일 GNB 사용
   · B영역(운영자) LivePreview 썸네일 재활용 — 같은 16:9 그라데이션 + 인셋 카드
   · 갤러리 2차 기획 v1 반영:
     - 카드 4단 위계 (썸네일 60% → 제목 → 작성자 → ❤️)
     - 2-pane 상세 (좌: 라이브 iframe 고정, 우: 정보 스크롤)
     - 이전/다음 프로젝트 네비게이션
     - 단일 ❤️ 리액션 (4종 → 1종)
     - 프로젝트명/팀명 검색
   · 페이지 정의서 D-1/D-2:
     - 페이지네이션 (1-N / 총 M개)
     - 빈/로딩 상태
     - 프리뷰 대기 바운싱 점
     - 새 탭에서 열기
   · UX 리뷰 D-2: 본인 프로젝트인 경우 공개 설정 다이얼로그 열기 링크
*/

// 갤러리 목록(D-1) / 상세(D-2) prev/next 모두 팀명순(한글 가나다 → 영문) 고정.
// 정렬 선택 UI 없음 — Full Version 보류.

const GALLERY_HACKATHON = '2026 봄 ENK 해커톤';
const PARTICIPANT_USER = { name: '김민준', team: '터미널 사파리', role: 'participant' };

// 운영자 B-1/B-2 · 참가자 C-1과 동일한 24px 도면 격자 + paper 톤. 어휘 통일.
const GRID_BG =
  'linear-gradient(rgba(45,42,36,0.04) 1px, transparent 1px) 0 0/24px 24px,' +
  'linear-gradient(90deg, rgba(45,42,36,0.04) 1px, transparent 1px) 0 0/24px 24px,' +
  'var(--c-paper)';

// 12개 프로젝트 — 종료 후 전원 공개 시나리오까지 커버
const GALLERY_PROJECTS = [
{ team: '터미널 사파리', members: 4, title: 'AI 일정관리 봇', tagline: '사진 한 장으로 일정 등록', likes: 47, iLiked: false, live: true,
  purpose: '시험 기간이 다가올수록 마감일을 놓치는 학생이 많아요. 시간표 사진 한 장으로 일정을 자동 등록하고 D-1 알림을 보내는 봇을 만들었습니다.',
  howto: ['카카오톡에서 [+] → 시간표 사진 업로드', 'OCR이 강의/마감을 인식해 일정으로 변환', 'D-1, D-0 자동 리마인드 수신'],
  stack: ['React', 'Vision API', 'Cloudflare Workers', 'KakaoTalk Bot', 'D2 시각화'] },
{ team: 'JS의 비밀', members: 2, title: '인디 음악 디스커버리', tagline: '오늘 발견한 새 아티스트', likes: 38, iLiked: true, live: true },
{ team: '디버그 라이프', members: 4, title: '학식 매니저', tagline: '오늘 점심 뭐 먹지', likes: 35, iLiked: false, live: true },
{ team: '커널 패닉', members: 3, title: '코딩 마라톤 트래커', tagline: '얼마나 코딩했는지 보여줘', likes: 22, iLiked: true, live: true },
{ team: 'undefined', members: 3, title: '봇 마실 음료 추천', tagline: '코딩 단계별 음료', likes: 19, iLiked: false, live: true },
{ team: 'await me', members: 3, title: '러닝 페이스 메이커', tagline: '오늘 컨디션에 맞춰', likes: 14, iLiked: false, live: true },
{ team: '404 NOT FOUND', members: 4, title: '캠퍼스 분실물 지도', tagline: '잃어버린 건 다 여기에', likes: 11, iLiked: false, live: true },
{ team: '코드밍아웃', members: 4, title: '강의 자동 요약기', tagline: '오늘 수업 한 줄로', likes: 8, iLiked: false, live: true },
{ team: 'null pointer', members: 3, title: '시간표 자동 생성', tagline: '학기 시작 첫날의 구원', likes: 7, iLiked: false, live: true },
{ team: '노유진', members: 1, title: '나만의 영단어장', tagline: '하루 10개 반복 학습', likes: 5, iLiked: false, live: true },
{ team: '류재석', members: 1, title: '운동 기록 일지', tagline: '벤치프레스 다음 무게는?', likes: 3, iLiked: false, live: false },
{ team: '손미래', members: 1, title: '독서록 자동 요약', tagline: '읽은 책을 한 줄로', likes: 2, iLiked: false, live: true }];



// ─── 갤러리 전용 헤더 ────────────────────────────────────
// AppHeader 와 동일한 스타일의 GNB. 로고가 항상 좌측 고정.
// 뒤로가기는 GNB가 아닌 본문 상단(BackLink)에서 처리한다 — GNB 위계 보존.
// 참가자/운영자/심사위원 모두 접근 가능 — role 에 따라 우측 표시 조정.
function GalleryHeader({ count, role = 'participant', user, breadcrumb = ['갤러리'] }) {
  return (
    <header style={{
      flex: '0 0 auto',
      background: 'var(--c-canvas)',
      borderBottom: '1px solid var(--c-hairline)',
      padding: '8px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
      minHeight: 44
    }}>
      {/* 로고 — 항상 맨 좌측 고정 (AppHeader 와 동일) */}
      <JitdaMark size={13} />
      <div style={{ width: 1, height: 14, background: 'var(--c-hairline-strong)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--c-slate)' }}>
        <span style={{ cursor: 'pointer' }}>{GALLERY_HACKATHON}</span>
        {breadcrumb.map((b, i) =>
        <React.Fragment key={i}>
            <span style={{ color: 'var(--c-muted)' }}>›</span>
            <span style={i === breadcrumb.length - 1 ?
          { color: 'var(--c-ink)', fontWeight: 600 } :
          { cursor: 'pointer' }}>{b}</span>
          </React.Fragment>
        )}
        {typeof count === 'number' &&
        <span className="jt-pill jt-pill-info" style={{ marginLeft: 4 }}>{count}</span>
        }
      </div>
      <div style={{ flex: 1 }} />
      {role === 'participant' && user &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--c-ink)' }}>
          <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 8px', borderRadius: 4,
          background: 'var(--c-stone)',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
          color: 'var(--c-slate)'
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-mint)' }} />
            참가자
          </span>
          <span style={{ fontWeight: 600 }}>{user.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)' }}>{user.team}</span>
        </div>
      }
      {role === 'operator' &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
          <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 8px', borderRadius: 4,
          background: 'var(--c-helmet-soft)', color: 'var(--c-amber)',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
          fontWeight: 600
        }}>운영자</span>
          <span style={{ fontWeight: 600 }}>박운영</span>
        </div>
      }
    </header>);

}

// ─── 본문용 뒤로가기 링크 ──────────────────────────────────────
// GNB에 두지 않고 본문 영역 상단에 배치 (위계: GNB > 본문 헤더 > 뒤로가기 링크)
// dataAction: 와이어링 액션명 (선택). 미지정 시 액션 없는 정적 표시.
function BackLink({ label, dataAction }) {
  return (
    <button
      data-action={dataAction}
      className="jt-btn jt-btn-ghost jt-btn-sm"
      style={{
        padding: '4px 8px 4px 4px', gap: 4,
        fontSize: 12, color: 'var(--c-slate)',
        marginLeft: -8 // 시각적으로 본문 가장자리에 맞춤
      }}>
      {Icon.arrowLeft(12)} {label}
    </button>);

}

// ─── 서브 헤더 (제목 + 통계 + 검색) ────────────────────
function GallerySubHeader({ status, total, query = '', tutorialMode, backLabel, backDataAction }) {
  const titleByStatus = {
    running: <>공개된 {total}개 프로젝트</>,
    ended: <>최종 {total}개 작품</>,
    tutorial: <>튜토리얼 결과 {total}건</>
  };
  const sub = {
    running: '마음에 드는 프로젝트엔 ❤️ 좋아요로 응원해주세요. 마감 시간까지 자유롭게 둘러볼 수 있어요.',
    ended: '해커톤이 종료되어 모든 팀의 작품이 자동으로 공개됐어요. 마음에 드는 작품엔 ❤️ 로 응원을 남겨주세요.',
    tutorial: '튜토리얼에서 만든 첫 작품들을 둘러볼 수 있어요.'
  }[status];

  // 해커톤 진행 상태 — 색상 + 도트로 이중 인코딩.
  const statusPill = {
    running: { label: '해커톤 진행 중', fg: 'var(--c-mint)', bg: 'var(--c-mint-soft)', dot: 'var(--c-mint)', pulse: true },
    ended: { label: '해커톤 종료', fg: 'var(--c-slate)', bg: 'var(--c-stone)', dot: 'var(--c-slate)', pulse: false },
    tutorial: { label: '튜토리얼', fg: 'var(--c-amber)', bg: 'var(--c-helmet-soft)', dot: 'var(--c-amber)', pulse: true }
  }[status];

  return (
    <div style={{ marginBottom: 20 }}>
      {/* 뒤로가기 + 상태 pill — 같은 행. 별도 줄을 만들지 않아 카드 영역을 최대한 확보. */}
      {(backLabel || statusPill) &&
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 10, flexWrap: 'wrap'
      }}>
          {backLabel && <BackLink label={backLabel} dataAction={backDataAction} />}
          {statusPill &&
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 10px 4px 8px',
          borderRadius: 999,
          background: statusPill.bg,
          color: statusPill.fg,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '-0.005em',
          lineHeight: 1.2
        }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
                <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: statusPill.dot
            }} />
                {statusPill.pulse &&
            <span style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              background: statusPill.dot, opacity: 0.35,
              animation: 'jt-status-pulse 1.8s ease-out infinite'
            }} />
            }
              </span>
              {statusPill.label}
              {status === 'running' &&
          <span className="jt-mono" style={{
            fontSize: 10, fontWeight: 600,
            paddingLeft: 7, marginLeft: 1,
            borderLeft: `1px solid currentColor`,
            opacity: 0.65,
            letterSpacing: '0.08em'
          }}>02:14:33 동안 진행중</span>
          }
              <style>{`@keyframes jt-status-pulse { 0% { transform: scale(0.7); opacity: 0.5; } 80%,100% { transform: scale(1.6); opacity: 0; } }`}</style>
            </span>
        }
        </div>
      }
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 26, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {titleByStatus[status] || `${total}개 프로젝트`}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 4, maxWidth: 580, lineHeight: 1.55 }}>{sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)', pointerEvents: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input className="jt-input"
            defaultValue={query}
            placeholder="프로젝트명 / 팀명 검색…"
            style={{ padding: '6px 12px 6px 30px', fontSize: 12.5, width: 240, height: 32 }} />
          </div>
        </div>
      </div>
    </div>);

}


// ─── 갤러리 카드 (공용 ProjectCard 사용) ──────────────────
// ProjectCard / BouncingDots 는 shared.jsx 에 있음 (갤러리 + 운영자 공용)

// 좋아요 메타 (갤러리용)
function LikeMeta({ count, iLiked }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-mono)', fontSize: 12,
      color: iLiked ? 'var(--c-helmet-deep)' : 'var(--c-slate)',
      fontWeight: 700
    }}>
      <span style={{ display: 'inline-flex' }}>{Icon.heart(12, iLiked)}</span>
      {count}
    </span>);

}

// 댓글 메타 (갤러리용 — 갤러리 2차 기획의 댓글 시스템 반영)
function CommentMeta({ count }) {
  if (count === 0) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--c-muted)'
    }}>
      {Icon.comment(11)} {count}
    </span>);

}

// 갤러리에서 사용 — 운영자 RosterRow와 동일한 .jt-postit-card 어휘.
// 회전: 팀명 hash 4-variant (postitRotation). tint: 단일 흰색 (§18-27 단일색 정책).
// LivePreview 16:10 썸네일이 카드 식별자 역할이라 색 식별은 불필요 + RosterRow와 시각 위계 통일.
// ❤️·💬는 카드 내부 메타 표시만 — 카드 전체 클릭으로 D-2 진입 (hit-area 경합 회피).
function GalleryCard({ p, mine, dim }) {
  // 댓글 수 mock (제목 길이로 결정)
  const commentCount = p.commentCount ?? Math.max(0, (p.likes / 4 | 0) - 1);
  const rot = postitRotation(p.team);
  return (
    <div
      data-action="open-card"
      role="button"
      tabIndex={0}
      className="jt-postit-card"
      aria-label={`${p.title} · ${p.team} 프로젝트 상세 보기`}
      style={{
        '--postit-rot': rot,
        '--postit-tint': 'var(--c-canvas)',
        background: 'var(--c-canvas)',
        borderRadius: 'var(--r-xs)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        opacity: dim ? 0.5 : 1,
      }}>
      {/* 썸네일은 overflow:hidden 래퍼로 카드 상단 모서리 정렬 — 부모 overflow는 풀어둠(tape ::before 보존) */}
      <div style={{
        overflow: 'hidden',
        borderTopLeftRadius: 'var(--r-xs)',
        borderTopRightRadius: 'var(--r-xs)'
      }}>
        <LivePreview teamName={p.team} badge={null} />
      </div>

      {mine && (
        <span style={{
          position: 'absolute', top: 8, left: 8,
          background: 'var(--c-helmet)', color: 'var(--c-stache)',
          padding: '3px 8px', borderRadius: 3,
          fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em',
          zIndex: 2,
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
        }}>내 프로젝트</span>
      )}

      <div style={{ padding: '10px 12px 11px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            flex: 1, minWidth: 0,
            fontSize: 14, fontWeight: 700, lineHeight: 1.3,
            color: 'var(--c-ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{p.title}</span>
          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            <LikeMeta count={p.likes} iLiked={p.iLiked} />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            flex: 1, minWidth: 0,
            fontSize: 11.5, color: 'var(--c-slate)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            display: 'flex', alignItems: 'center',
          }}>
            {p.team} <span style={{ color: 'var(--c-hairline-strong)', margin: '0 2px' }}>·</span>
            <span className="jt-mono" style={{ fontSize: 11 }}>{p.members}명</span>
          </span>
          <span style={{ flexShrink: 0 }}>
            <CommentMeta count={commentCount} />
          </span>
        </div>
      </div>
    </div>);

}


// ─── 페이지네이션 ────────────────────────────────────────────
// Pagination 컴포넌트는 shared.jsx에 정의됨 (운영자 B영역과 공용).
// window.Pagination 으로 자동 노출되므로 별도 import 불필요.


// ─────────────────────────────────────────────────────────────
// D-1 갤러리 목록
// ─────────────────────────────────────────────────────────────

// (1) 기본 — 진행 중 (8/12 공개 + 본인 강조)
function D1GalleryList() {
  const visible = GALLERY_PROJECTS.slice(0, 8);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: GRID_BG }}>
      <GalleryHeader count={visible.length} role="participant" user={PARTICIPANT_USER} />

      <div style={{ flex: 1, padding: '24px clamp(20px, 4vw, 48px)', overflow: 'auto' }}>
        <GallerySubHeader status="running" total={visible.length} backLabel="바이브코딩으로" />
        <GalleryGrid projects={visible} mineTeam="터미널 사파리" />
        <Pagination page={1} perPage={8} total={visible.length} prevDisabled nextDisabled />
      </div>
    </div>);

}

// (2) 종료 후 — 전원 자동 공개 (12개)
// role: 'participant'(기본 · 대기실로 복귀) | 'operator'(대시보드로 돌아가기 · viewer ACTIONS 와이어링)
function D1GalleryListEnded({ role = 'participant' } = {}) {
  const isOperator = role === 'operator';
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: GRID_BG }}>
      <GalleryHeader
        count={12}
        role={role}
        user={isOperator ? undefined : PARTICIPANT_USER}
        breadcrumb={['갤러리']} />

      <div style={{ flex: 1, padding: '24px clamp(20px, 4vw, 48px)', overflow: 'auto' }}>
        <GallerySubHeader
          status="ended"
          total={12}
          backLabel={isOperator ? '대시보드로 돌아가기' : '대기실로'}
          backDataAction={isOperator ? 'back-to-dashboard' : undefined} />

        <GalleryGrid projects={GALLERY_PROJECTS} mineTeam={isOperator ? null : '터미널 사파리'} />
        <Pagination page={1} perPage={12} total={12} prevDisabled nextDisabled />
      </div>
    </div>);

}

// (3) 빈 상태 — 아직 아무도 공개하지 않음
function D1GalleryEmpty() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: GRID_BG }}>
      <GalleryHeader count={0} role="participant" user={PARTICIPANT_USER} />

      <div style={{
        flex: 1, padding: '24px clamp(20px, 4vw, 48px)', overflow: 'auto',
        display: 'flex', flexDirection: 'column'
      }}>
        <GallerySubHeader status="running" total={0} backLabel="바이브코딩으로" />

        {/* 빈 상태 카드 — 본문 영역 vertical center 배치 (flex spacer) */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* 2026-06-01 paper 폐기 → .jt-postit-card 어휘 통일.
              CTA 버튼이 있어 카드 호버 회전·lift가 산만하므로 jt-postit-card-static 결합. */}
          <div
            className="jt-postit-card jt-postit-card-static jt-postit-tape-xl"
            style={{
              width: 'min(560px, 88vw)',
              minHeight: 340,
              padding: '52px 44px',
              borderRadius: 'var(--r-xs)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 14, textAlign: 'center',
              '--postit-rot': 'var(--postit-rot-c)',
              '--postit-tint': 'var(--c-canvas)'
            }}>
            <div style={{
              width: 56, height: 56, borderRadius: 10,
              background: 'var(--c-stone)', color: 'var(--c-ink-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{Icon.gallery(26)}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>아직 공개된 작품이 없어요</div>
            <div style={{ fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.6, maxWidth: 380 }}>
              팀이 [내 프로젝트] 설정에서 <strong style={{ color: 'var(--c-ink)' }}>갤러리 공개</strong>를 켜면 여기에 라이브로 보여요.
              <br />해커톤이 종료되면 모든 팀의 작품이 자동으로 공개돼요.
            </div>
            <button className="jt-btn jt-btn-primary" style={{ marginTop: 6 }}>
              내 프로젝트를 먼저 공개해볼까요? {Icon.arrowRight(13)}
            </button>
          </div>
        </div>
      </div>
    </div>);

}

// (4) 로딩 상태
function D1GalleryLoading() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: GRID_BG }}>
      <GalleryHeader count={null} role="participant" user={PARTICIPANT_USER} />

      <div style={{ flex: 1, padding: '24px clamp(20px, 4vw, 48px)', overflow: 'auto' }}>
        {/* 로딩 중에도 BackLink 동일 위치 */}
        <div style={{ marginBottom: 12 }}><BackLink label="바이브코딩으로" /></div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="jt-eyebrow" style={{ marginBottom: 8 }}>갤러리</div>
            <div style={{
              width: 320, height: 32, borderRadius: 6,
              background: 'linear-gradient(90deg, var(--c-stone) 25%, var(--c-stone-2) 50%, var(--c-stone) 75%)',
              backgroundSize: '200% 100%'
            }} />
            <div style={{
              width: 440, height: 14, marginTop: 10, borderRadius: 4,
              background: 'var(--c-stone)'
            }} />
          </div>
          <div style={{
            fontSize: 12, color: 'var(--c-slate)', display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
            padding: '6px 12px', borderRadius: 4
          }}>
            <BouncingDots />
            <span>작품을 불러오는 중이에요</span>
          </div>
        </div>

        {/* Skeleton grid — 신 postit 어휘 매치 (회전·tape는 의도적 제외 — placeholder 어휘) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20
        }}>
          {Array.from({ length: 8 }).map((_, i) =>
          <div key={i} style={{
            background: 'var(--c-canvas)',
            borderRadius: 'var(--r-xs)', overflow: 'hidden',
            boxShadow: 'var(--postit-shadow-rest)'
          }}>
              {/* 썸네일 — 16:10 비율 (LivePreview와 매치) */}
              <div style={{ aspectRatio: '16 / 10', background: 'var(--c-stone)' }} />
              {/* 정보 영역 — 2행 (9px 12px 10px 패딩, gap 3 — ProjectCard와 매치) */}
              <div style={{ padding: '9px 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 13, background: 'var(--c-stone-2)', borderRadius: 3 }} />
                  <div style={{ width: 32, height: 11, background: 'var(--c-stone)', borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 10, background: 'var(--c-stone)', borderRadius: 3 }} />
                  <div style={{ width: 22, height: 10, background: 'var(--c-stone)', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

// GalleryGrid — postit 카드 회전(±1.4°) + hover translateY(-3px) 여유 위해 gap 16 → 20.
function GalleryGrid({ projects, mineTeam }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 20
    }}>
      {projects.map((p, i) =>
      <GalleryCard key={i} p={p} mine={p.team === mineTeam} />
      )}
    </div>);

}

// (BouncingDots 는 shared.jsx 에 정의됨)


// ─────────────────────────────────────────────────────────────
// D-2 갤러리 상세 — 2-pane (좌: 라이브 iframe 고정, 우: 정보 스크롤)
// ─────────────────────────────────────────────────────────────

// 공통 셸 — variant 로 케이스 분기
// prev/next는 팀명순 고정 기준의 인접 프로젝트.
function D2Shell({ idx, mine, previewState = 'loaded', tab = 'info', commentsState = 'has', status = 'running', composeOpen = false, threadOpenIdx = null, threadReplyComposeOpen = false, menuOpenIdx = null, editIdx = null, deleteIdx = null }) {
  const project = GALLERY_PROJECTS[idx];
  const prev = GALLERY_PROJECTS[idx - 1];
  const next = GALLERY_PROJECTS[idx + 1];
  const prevDisabled = idx === 0;
  const nextDisabled = idx === GALLERY_PROJECTS.length - 1;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <GalleryHeader
        count={null}
        role="participant"
        user={PARTICIPANT_USER}
        breadcrumb={['갤러리', project.team]} />

      {/* 서브 툴바 — 단일 행 (디자인 시스템: 헤더는 2줄 금지)
            [뒤로] | 제목 + 액션 아이콘 ........... [← 이전] [다음 →]
            prev/next는 팀명순 고정 순서 */}
      <div style={{
        flex: '0 0 auto',
        background: 'var(--c-canvas)',
        borderBottom: '1px solid var(--c-hairline)',
        padding: '6px 24px 6px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        minHeight: 44
      }}>
        <BackLink label="갤러리 목록" />
        <div style={{ width: 1, height: 24, background: 'var(--c-hairline-strong)', margin: '0 4px' }} />

        {/* 제목 — 단일 행. 메타(팀·멤버)는 모두 다른 곳으로 분산. */}
        <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{
            fontSize: 16, fontWeight: 700, lineHeight: 1.2, margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 'min(280px, 30cqw)'
          }}>{project.title}</h2>
          {mine &&
          <span style={{
            background: 'var(--c-helmet)', color: 'var(--c-stache)',
            padding: '2px 8px', borderRadius: 3,
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em',
            flexShrink: 0
          }}>내 프로젝트</span>
          }
        </div>

        {/* 아이콘 액션 — 새로고침 → 새 탭 → (본인 한정) 공개 설정
              공개 설정 아이콘은 본인 프로젝트에서만 노출.
              해커톤 종료 후엔 전원 자동 공개되므로 더 이상 변경 불가 → disabled. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4 }}>
          <IconButton title="새로고침 (라이브 앱 상태 다시 불러오기)">{Icon.refresh(14)}</IconButton>
          <IconButton title="새 탭에서 열기">{Icon.external(14)}</IconButton>
          {mine &&
          <IconButton
            title={status === 'ended' ? '해커톤 종료 후엔 공개 설정을 변경할 수 없어요' : '공개 설정'}
            disabled={status === 'ended'}>
            {Icon.settings(14)}</IconButton>
          }
        </div>

        <div style={{ flex: 1 }} />

        {/* 이전/다음 — 우측 끝. 작은 화살표 한 쌍, 팀명순 기준 인접 프로젝트. */}
        <ProjectNavArrows
          prev={prev} next={next}
          prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
      </div>

      {/* 본문 — 2-pane · 2026-06-15 반응형: 우 정보 레일 고정 400px → clamp 유동(340~460), 라이브 패널은 minmax(0,1fr)로 자유 축소. d2 9개 상태 일괄 (프레임 캡이 ultrawide 처리) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) clamp(340px, 30%, 460px)', minHeight: 0 }}>
        <DetailLivePane project={project} state={previewState} />
        <DetailInfoPane project={project} mine={mine} tab={tab} commentsState={commentsState} composeOpen={composeOpen} threadOpenIdx={threadOpenIdx} threadReplyComposeOpen={threadReplyComposeOpen} menuOpenIdx={menuOpenIdx} editIdx={editIdx} deleteIdx={deleteIdx} />
      </div>
    </div>);

}

// 아이콘 전용 버튼 — 제목 좌측 컴팩트 액션용 (새 탭/공개 설정)
function IconButton({ children, title, disabled }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button title={title} disabled={disabled}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
      width: 32, height: 32, borderRadius: 6,
      background: hover && !disabled ? 'var(--c-stone)' : 'transparent',
      border: '1px solid transparent',
      color: disabled ? 'var(--c-muted)' : hover ? 'var(--c-ink)' : 'var(--c-ink-2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      font: 'inherit', padding: 0,
      opacity: disabled ? 0.4 : 1,
      transition: 'background 120ms ease, color 120ms ease'
    }}>
      {children}
    </button>);

}

// 프로젝트 네비 — 우측 정보 패널 헤더(팀 라인)에 들어가는 작은 화살표 한 쌍.
// tooltip으로 인접 프로젝트 제목을 보여주고, 양 끝(처음/마지막)은 비활성.
function ProjectNavArrows({ prev, next, prevDisabled, nextDisabled }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      <NavArrow dir="prev" project={prev} disabled={prevDisabled} />
      <NavArrow dir="next" project={next} disabled={nextDisabled} />
    </div>);

}

function NavArrow({ dir, project, disabled }) {
  const [hover, setHover] = React.useState(false);
  const isDisabled = disabled || !project;
  const title = isDisabled
  ? dir === 'prev' ? '처음 프로젝트입니다' : '마지막 프로젝트입니다'
  : `${dir === 'prev' ? '이전' : '다음'}: ${project.title}`;

  return (
    <button
    disabled={isDisabled}
    title={title}
    aria-label={dir === 'prev' ? '이전 프로젝트' : '다음 프로젝트'}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
      width: 32, height: 32, borderRadius: 6,
      border: 'none',
      background: isDisabled ? 'transparent' : hover ? 'var(--c-stone)' : 'transparent',
      color: isDisabled ? 'var(--c-muted)' : hover ? 'var(--c-ink)' : 'var(--c-ink-3)',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.35 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: 0, font: 'inherit',
      transition: 'background 120ms ease, color 120ms ease'
    }}>
      {dir === 'prev' ? Icon.arrowLeft(16) : Icon.arrowRight(16)}
    </button>);

}


// ─── 좌측 라이브 패널 ────────────────────────────────────
// 작품 라이브 앱 URL — project.url 없으면 팀명 슬러그로 생성 (서브도메인 형태)
function appUrl(project) {
  if (project && project.url) return project.url;
  const map = { '터미널 사파리': 'sapari', 'JS의 비밀': 'js-secret', '디버그 라이프': 'debug-life', '커널 패닉': 'kernel-panic', 'undefined': 'undef' };
  const t = (project && project.team) || 'app';
  const slug = map[t] || ('team-' + (Array.from(t).reduce((a, c) => a + c.charCodeAt(0), 0) % 90 + 10));
  return slug + '.jitda.run';
}

function DetailLivePane({ project, state }) {
  return (
    <section style={{
      background: 'var(--c-stone-2)',
      padding: 16,
      display: 'flex', flexDirection: 'column',
      minHeight: 0
    }}>
      {/* 브라우저 윈도우 (chrome + iframe 통합) */}
      <div style={{
        flex: 1,
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(20,19,15,0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        minHeight: 0
      }}>
        {/* Safari (Tahoe) chrome — 공용 SafariChrome (가운데 URL·새로고침·새탭·복사 동작) */}
        <SafariChrome url={appUrl(project)} />
        {state === 'loading' && <PreviewLoading />}
        {state === 'loaded' && <PreviewLoaded project={project} />}
      </div>
    </section>);

}

function PreviewLoading() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, color: 'var(--c-slate)', background: 'var(--c-paper)'
    }}>
      <div style={{ position: 'relative', width: 220, height: 168, overflow: 'visible' }}>
        <div className="jt-swap-slot">
          <span className="jt-mascot-swap jt-mascot-swap-a"><JitdaMascotBlueprint size={92} /></span>
        </div>
        <div className="jt-swap-slot">
          <span className="jt-mascot-swap jt-mascot-swap-b"><JitdaMascotDig size={80} /></span>
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--c-ink)', fontWeight: 600 }}>앱을 불러오고 있어요</div>
      <div style={{ fontSize: 12, color: 'var(--c-muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.55 }}>
        팀이 만든 라이브 앱은 처음 열 때 서버가 기동되기까지<br />최대 30초 정도 걸려요. 잠시만 기다려주세요.
      </div>
      <div className="jt-mono" style={{
        fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--c-muted)',
        marginTop: 4
      }}>BOOT · 00:08 · 최대 00:30</div>
    </div>);

}

// 라이브 앱 (mock fidelity 가짜 미리보기) — 터미널 사파리 'AI 일정관리 봇'
function PreviewLoaded({ project }) {
  return (
    <div style={{
      flex: 1,
      padding: '32px 36px',
      display: 'flex', flexDirection: 'column', gap: 18,
      background: '#fffaf2',
      overflow: 'auto'
    }}>
      <div className="jt-mono" style={{
        fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#b87333'
      }}>AI Calendar Bot · live preview</div>

      <h2 style={{
        fontSize: 30, lineHeight: 1.18,
        fontFamily: 'var(--font-display)', fontWeight: 800,
        color: '#2a2823', letterSpacing: '-0.02em'
      }}>
        오늘 할 일을<br />사진 한 장으로
      </h2>

      <div style={{
        background: '#fff7e8',
        border: '1.5px dashed #f3a995',
        borderRadius: 10,
        padding: 18,
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8,
          background: '#ff9b3e', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20
        }}>📷</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2a2823' }}>강의 시간표를 찍어보세요</div>
          <div style={{ fontSize: 12, color: 'var(--c-slate)', marginTop: 2 }}>OCR이 일정으로 변환합니다 · 평균 3초</div>
        </div>
        <button className="jt-btn jt-btn-sm" style={{
          background: '#ff9b3e', color: '#fff', borderColor: '#ff9b3e',
          padding: '8px 14px'
        }}>업로드</button>
      </div>

      <div>
        <div className="jt-mono" style={{ fontSize: 11, color: 'var(--c-slate)', letterSpacing: '0.08em', marginBottom: 8 }}>
          최근 인식한 일정 · 3건
        </div>
        {[
        ['데이터구조 과제 제출', '5/22 18:00', 'D-0', 'rose'],
        ['알고리즘 중간고사', '5/24 09:00', 'D-2', 'amber'],
        ['종강총회', '6/8 19:00', 'D-17', 'stone']].
        map((row, i) => {
          const colors = {
            rose: { bg: 'var(--c-safety-soft)', fg: 'var(--c-safety)' },
            amber: { bg: 'var(--c-helmet-soft)', fg: 'var(--c-amber)' },
            stone: { bg: 'var(--c-stone)', fg: 'var(--c-ink)' }
          };
          const c = colors[row[3]];
          return (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '10px 0',
              borderBottom: i < 2 ? '1px solid #efe6d5' : 'none',
              fontSize: 13
            }}>
              <div style={{
                width: 44, padding: '4px 6px',
                background: c.bg, color: c.fg,
                borderRadius: 4,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                textAlign: 'center', fontWeight: 700,
                alignSelf: 'flex-start'
              }}>{row[2]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#2a2823' }}>{row[0]}</div>
                <div style={{ fontSize: 11, color: 'var(--c-slate)', fontFamily: 'var(--font-mono)' }}>{row[1]}</div>
              </div>
            </div>);

        })}
      </div>
    </div>);

}


// ─── 댓글 mock 데이터 ─────────────────────────────────────────
const COMMENT_AUTHORS = [
{ name: '이서윤', team: 'JS의 비밀', color: 'var(--c-blue)' },
{ name: '박운영', team: '운영팀', color: 'var(--c-amber)', isOperator: true },
{ name: '최유나', team: '디버그 라이프', color: 'var(--c-mint)' },
{ name: '한지원', team: '코드밍아웃', color: 'var(--c-helmet)' },
{ name: '김민준', team: '터미널 사파리', color: 'var(--c-helmet)' }];


// 대댓글은 1단계만 허용(대대댓글 금지). replies 배열 안에 들어간 항목은
// 더 이상 답글 액션을 노출하지 않는다. CommentItem `isReply` prop으로 분기.
const COMMENTS_MOCK = [
{ author: COMMENT_AUTHORS[0], body: '시간표 사진 하나로 일정이 자동 등록되는 흐름이 정말 자연스러워요. OCR 정확도가 인상 깊었습니다.', minsAgo: 4, likes: 3, iLiked: true },
{ author: COMMENT_AUTHORS[2], body: 'D-Day 카운트다운 색상 처리가 직관적이에요!', minsAgo: 12, likes: 2, iLiked: false },
{ author: COMMENT_AUTHORS[3], body: '시간표가 매주 바뀌는 학기 초에 대비해서, 사진을 다시 업로드했을 때 기존 일정을 어떻게 처리할지 안내가 있으면 좋겠어요.', minsAgo: 28, likes: 5, iLiked: false,
  replies: [
    { author: COMMENT_AUTHORS[4], body: '좋은 지적이에요! 기존 일정을 유지할지 덮어쓸지 선택하는 옵션을 다음 버전에서 추가해볼게요.', minsAgo: 22, likes: 2, iLiked: false },
    { author: COMMENT_AUTHORS[1], body: '운영팀에서도 이 부분 발표 시 강조해주시면 좋겠습니다.', minsAgo: 18, likes: 0, iLiked: false }
  ] },
{ author: COMMENT_AUTHORS[1], body: '대회 운영팀입니다. 라이브 데모 시 OCR 처리 화면을 빔으로 띄워주실 수 있을까요?', minsAgo: 42, likes: 1, iLiked: false,
  replies: [
    { author: COMMENT_AUTHORS[4], body: '네 가능합니다. 화면 미러링 어댑터만 준비해주세요!', minsAgo: 38, likes: 1, iLiked: false }
  ] }];



// ─── 우측 정보 패널 ────────────────────────────────────
// tab: 'info' | 'comments'
// commentsState: 'has' | 'empty'
function DetailInfoPane({ project, mine, tab = 'info', commentsState = 'has', composeOpen = false, threadOpenIdx = null, threadReplyComposeOpen = false, menuOpenIdx = null, editIdx = null, deleteIdx = null }) {
  const purpose = project.purpose ||
  `${project.team}가 만든 작품이에요. 자세한 목적은 팀이 아직 작성하지 않았어요.`;
  const howto = project.howto || ['카드를 누르면 라이브 앱이 열려요', '좌측 화면에서 직접 사용해보세요', '마음에 들면 ❤️ 좋아요를 눌러주세요'];
  const stack = project.stack || ['React', 'Node.js'];

  const commentCount = commentsState === 'empty' ? 0 : COMMENTS_MOCK.length;

  // 스레드 뷰 진입 여부 — 헤더/탭은 유지, 본문+sticky만 교체
  const sortedComments = [...COMMENTS_MOCK].sort((a, b) => b.minsAgo - a.minsAgo);
  const inThread = tab === 'comments' && threadOpenIdx !== null && sortedComments[threadOpenIdx];
  const threadParent = inThread ? sortedComments[threadOpenIdx] : null;

  return (
    <aside style={{
      background: GRID_BG,
      borderLeft: '1px solid var(--c-hairline)',
      display: 'flex', flexDirection: 'column',
      minHeight: 0
    }}>
      {/* 헤더 — 팀 + 제목 (좌) / 좋아요 (우). 격자 배경 위 canvas 띠. 좋아요는 세로 가운데 정렬. */}
      <div style={{
        padding: '18px 22px 14px',
        background: 'var(--c-canvas)',
        borderBottom: '1px solid var(--c-hairline)',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="jt-mono" style={{
            fontSize: 10.5, color: 'var(--c-muted)', letterSpacing: '0.12em',
            marginBottom: 4, textTransform: 'uppercase'
          }}>
            {project.team} · {project.members}명
          </div>
          <h2 style={{
            fontSize: 21, lineHeight: 1.25,
            fontFamily: 'var(--font-display)', fontWeight: 800,
            letterSpacing: '-0.022em'
          }}>{project.title}</h2>
        </div>
        <LikeActionInline project={project} mine={mine} />
      </div>

      {/* 탭 — 짓다 어휘 인라인 (2026-06-01). 디자인 시스템 jt-tab 미사용.
            배경 paper + 하단 hairline. 각 탭이 작은 도면 시트 라벨처럼 자리. */}
      <div role="tablist" style={{
        display: 'flex',
        background: 'var(--c-paper)',
        borderBottom: '1px solid var(--c-hairline)',
        flexShrink: 0
      }}>
        <PanelTab active={tab === 'info'} label="정보" />
        <PanelTab active={tab === 'comments'} label="댓글" badge={commentCount} />
      </div>

      {/* 스레드 모드 전용 백 액션 — 격자 배경 위 .jt-btn-secondary 정식 어휘 사용
            (디자인 시스템 §06 Buttons — "건너뛰기"와 동일 변형, 2026-06-01). */}
      {inThread &&
      <div style={{
        flexShrink: 0,
        padding: '12px 18px 2px',
        display: 'flex', alignItems: 'center'
      }}>
          <button
            data-action="close-thread"
            aria-label="댓글 목록으로 돌아가기"
            className="jt-btn jt-btn-sm jt-btn-ghost"
            style={{ gap: 6 }}>
            <span style={{ display: 'inline-flex' }}>{Icon.arrowLeft(13)}</span>
            <span>댓글 목록</span>
          </button>
        </div>
      }

      {/* 본문 (탭별) */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {tab === 'info' ?
        <div style={{ padding: '22px 18px 20px' }}>
            {/* 큰 흰 포스트잇 — 각도 0, 정보 영역 가독성 우선. 디자인 시스템 .jt-postit-card 어휘 사용. */}
            <div
              className="jt-postit-card jt-postit-card-static jt-postit-tape-xl"
              style={{
                '--postit-rot': '0deg',
                '--postit-tint': 'var(--c-canvas)',
                padding: '22px 22px 10px',
                width: '100%'
              }}>
              <Section index={1} icon="📋" label="목적">
              <p style={{ fontSize: 13, color: 'var(--c-ink-2)', lineHeight: 1.6, margin: 0 }}>{purpose}</p>
            </Section>

            <Section index={2} icon="🔧" label="사용법">
              <ol style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: 10
            }}>
                {howto.map((h, i) =>
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--c-ink-2)', lineHeight: 1.5 }}>
                    {/* STEP 마커 — helmet 노란 점 + mono "STEP 01" 라벨, 공사 단계 어휘 */}
                    <span style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 1
                }}>
                      <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--c-helmet)',
                    boxShadow: '0 0 0 2px var(--c-helmet-soft)'
                  }} />
                      <span className="jt-mono" style={{
                    fontSize: 9.5, color: 'var(--c-amber)', fontWeight: 700,
                    letterSpacing: '0.08em'
                  }}>STEP 0{i + 1}</span>
                    </span>
                    <span style={{ flex: 1 }}>{h}</span>
                  </li>
              )}
              </ol>
            </Section>

            <Section index={3} icon="👥" label="팀 멤버">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['김민준', '이서윤', '박지호', '최유나'].slice(0, project.members).map((m, i) => {
                const colors = ['var(--c-helmet)', 'var(--c-blue)', 'var(--c-mint)', 'var(--c-amber)'];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'var(--c-stone)', padding: '4px 10px 4px 4px', borderRadius: 999,
                    fontSize: 12
                  }}>
                      <div className="jt-avatar" style={{
                      width: 20, height: 20, background: colors[i % 4],
                      color: '#fff', fontSize: 8.5,
                      fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
                    }}>{m.length >= 2 ? m.slice(-2) : m}</div>
                      {m}
                    </div>);

              })}
              </div>
            </Section>
            </div>
          </div> :

        (inThread ?
        <CommentThreadBody parent={threadParent} /> :
        <CommentsPanel state={commentsState} mine={mine} menuOpenIdx={menuOpenIdx} editIdx={editIdx} deleteIdx={deleteIdx} />)
        }
      </div>

      {/* 하단 sticky — 댓글 탭일 때만 작성 폼 노출. 트리거 단계 폐기, 항상 펼친 입력 폼.
            · 일반 댓글 모드: 본 댓글 작성
            · 스레드 모드: 답글 작성 — 부모 댓글 대상 */}
      {tab === 'comments' &&
      <div style={{
        flexShrink: 0,
        padding: '12px 18px 14px',
        borderTop: '1px solid var(--c-hairline)',
        background: 'var(--c-canvas)'
      }}>
          {inThread ?
          <CommentCompose mode="reply" replyToName={threadParent.author.name} /> :
          <CommentCompose />
          }
        </div>
      }

      {/* 좋아요는 상단 헤더 우측 LikeActionInline으로 이동 (2026-06-01). 하단 sticky LikeActionBar 폐기. */}
    </aside>);

}

// PanelTab — 짓다 공사장 어휘로 인라인 재디자인 (2026-06-01). 디자인 시스템 미수정.
//   · active: 상단 3px helmet 노란 stripe + canvas 흰 배경 + ink 굵은 한글
//   · inactive: paper 톤 + ink-3, 한글 살짝 흐림
function PanelTab({ active, label, badge }) {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      role="tab"
      aria-selected={active}
      data-action={active ? undefined : (label === '정보' ? 'tab-info' : 'tab-comments')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, position: 'relative',
        padding: '14px 8px 12px',
        background: active ? 'var(--c-canvas)' : (hover ? 'rgba(20,19,15,0.025)' : 'transparent'),
        border: 'none',
        borderBottom: active ? '1px solid var(--c-canvas)' : '1px solid var(--c-hairline)',
        marginBottom: -1,
        cursor: active ? 'default' : 'pointer',
        font: 'inherit',
        color: active ? 'var(--c-ink)' : 'var(--c-ink-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        fontSize: 13.5, fontWeight: active ? 700 : 500,
        transition: 'background-color 150ms ease, color 150ms ease'
      }}>
      {/* 상단 helmet stripe — active 표시 (공사장 신호 어휘) */}
      {active &&
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'var(--c-helmet)'
      }} />
      }
      {label}
      {typeof badge === 'number' && badge > 0 &&
      <span className="jt-mono" style={{
        fontSize: 10.5, padding: '1px 6px',
        borderRadius: 'var(--r-pill)',
        background: active ? 'var(--c-ink)' : 'var(--c-stone)',
        color: active ? '#fff' : 'var(--c-slate)',
        fontWeight: 700, lineHeight: 1.4
      }}>{badge}</span>
      }
    </button>);

}

// ─── 좋아요 인라인 — 디자인 시스템 .jt-like-btn 어휘 사용 (tokens.css §Like Button).
//   · 기본(iLiked=false): canvas + stache 테두리 + 빈 하트
//   · is-active(iLiked=true): helmet 노란 fill + 채워진 하트 + lift shadow
//   · hover: helmet-soft 채움 + 노랑 그림자 (CSS에서 자동 처리)
//   · mine=true: disabled (본인 작품은 좋아요 불가). 받은 좋아요 시각화 위해 is-active 유지.
function LikeActionInline({ project, mine }) {
  const { likes, iLiked } = project;
  const active = iLiked || mine; // mine은 받은 좋아요 카운트를 강조해 보여줌

  return (
    <button
      className={`jt-like-btn ${active ? 'is-active' : ''}`}
      disabled={mine}
      aria-disabled={mine ? 'true' : undefined}
      title={mine ? '본인 프로젝트엔 좋아요를 누를 수 없어요' : (iLiked ? '좋아요 취소' : '좋아요')}>
      <span style={{ display: 'inline-flex' }}>{Icon.heart(16, active)}</span>
      <span className="jt-like-count">{likes}</span>
    </button>);

}

// ─── 좋아요 액션 바 — D-2 의 1차 CTA. 시각적 위계 최상위. ──────
function LikeActionBar({ project, mine }) {
  return (
    <div style={{
      padding: '14px 20px 16px',
      borderTop: '1px solid var(--c-hairline)',
      background: 'var(--c-paper)',
      flexShrink: 0
    }}>
      {mine ?
      // 본인 프로젝트 — 좋아요 누르지 못함. 받은 좋아요 수를 강조해 보여주는 카드.
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        background: 'var(--c-canvas)',
        border: '1px dashed var(--c-hairline-strong)',
        borderRadius: 10
      }}>
          <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'var(--c-helmet-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--c-stache)', flexShrink: 0
        }}>{Icon.heart(20, true)}</div>
          <div style={{ flex: 1, lineHeight: 1.35 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)', fontFamily: 'var(--font-display)' }}>
              {project.likes}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>명</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>
              본인 작품에 좋아요를 눌렀어요
            </div>
          </div>
        </div> :

      // 타인 프로젝트 — 메인 CTA. 좋아요 안 누른 상태는 solid coral, 누른 상태는 soft confirmation.
      <LikeCTAButton project={project} />
      }
    </div>);

}

function LikeCTAButton({ project }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  if (project.iLiked) {
    // 누른 상태 — soft helmet 확정 (stache 글자 + helmet border)
    return (
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%',
          minHeight: 64,
          boxSizing: 'border-box',
          background: hover ? 'var(--c-canvas)' : 'var(--c-helmet-soft)',
          border: '1.5px solid var(--c-helmet)',
          color: 'var(--c-stache)',
          padding: '12px 18px',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', font: 'inherit',
          transition: 'background 120ms ease'
        }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, color: 'var(--c-helmet-deep)'
        }}>{Icon.heart(22, true)}</span>
        <div style={{ flex: 1, textAlign: 'left', lineHeight: 1.25 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>
            {hover ? '좋아요 취소할까요?' : '좋아요 눌렀어요'}
          </div>
          <div style={{ fontSize: 11, opacity: 0.85, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {project.likes}명이 함께 좋아해요
          </div>
        </div>
      </button>);

  }

  // 안 누른 상태 — 메인 CTA. helmet solid + stache 글자
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {setHover(false);setPress(false);}}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        width: '100%',
        minHeight: 64,
        boxSizing: 'border-box',
        background: hover ? 'var(--c-helmet-deep)' : 'var(--c-helmet)',
        border: 'none',
        color: 'var(--c-stache)',
        padding: '12px 18px',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', font: 'inherit',
        boxShadow: press ?
        '0 1px 0 rgba(20,19,15,0.20) inset' :
        hover ?
        '0 6px 18px rgba(255,206,43,0.45), 0 1px 0 rgba(255,255,255,0.4) inset' :
        '0 3px 10px rgba(255,206,43,0.32), 0 1px 0 rgba(255,255,255,0.4) inset',
        transform: press ? 'translateY(1px)' : 'translateY(0)',
        transition: 'background 120ms ease, box-shadow 160ms ease, transform 80ms ease'
      }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28
      }}>{Icon.heart(22, true)}</span>
      <span style={{ flex: 1, textAlign: 'left', fontWeight: 800, fontSize: 15, letterSpacing: '-0.005em' }}>
        좋아요
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 999,
        background: 'rgba(20,19,15,0.12)',
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700
      }}>{project.likes}</span>
    </button>);

}


// ─── 댓글 패널 ────────────────────────────────────────────────
//
// 갤러리 2차 기획 반영:
//  · 텍스트 피드백 + 구조화된 템플릿(잘한 점/개선 제안)
//  · 운영자 숨김 권한 + 신고 기능
//  · 본인 댓글 수정/삭제
//
// CommentsPanel — 본문만 책임. 작성 진입(트리거/폼)은 부모에서 sticky로 처리.
function CommentsPanel({ state, mine, menuOpenIdx = null, editIdx = null, deleteIdx = null }) {
  if (state === 'empty') {
    return (
      <div style={{ padding: '20px 22px' }}>
        <div style={{
          padding: '36px 16px',
          textAlign: 'center',
          border: '1px dashed var(--c-hairline-strong)',
          borderRadius: 8,
          background: 'var(--c-paper)'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, margin: '0 auto 10px',
            background: 'var(--c-stone)', color: 'var(--c-ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>{Icon.comment(20)}</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>첫 댓글의 주인공이 되어보세요</div>
          <div style={{ fontSize: 11.5, color: 'var(--c-slate)', lineHeight: 1.55 }}>
            이 프로젝트에 대한 생각을<br />자유롭게 남겨주세요
          </div>
        </div>
      </div>);

  }

  return (
    <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 먼저 단 댓글이 위에 나오도록 시간 역순 정렬 (minsAgo 큰 값 = 오래 전) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[...COMMENTS_MOCK].sort((a, b) => b.minsAgo - a.minsAgo).map((c, i) =>
        <CommentItem
          key={i}
          c={c}
          idx={i}
          mine={c.author.name === '한지원'}
          menuOpen={menuOpenIdx === i}
          editingNow={editIdx === i}
        />
        )}
      </div>
    </div>);

}


// CommentComposeTrigger 폐기 (2026-06-01) — 트리거 단계 없이 CommentCompose가 항상 펼친 상태로 sticky 노출.



// CommentCompose — 항상 펼친 입력 폼. 디자인 시스템 .jt-input 어휘 기반.
//   · 트리거 단계 폐기 — 처음부터 textarea 노출, 바로 입력 가능
//   · 좌측 아바타 + 멀티라인 textarea + 우하단 CTA
//   · mode='reply'는 placeholder/CTA 문구만 변경
function CommentCompose({ mode = 'comment', replyToName = null }) {
  const isReply = mode === 'reply';
  const placeholder = isReply
    ? (replyToName ? `${replyToName}님에게 답글 남기기…` : '답글 남기기…')
    : '댓글 남기기…';
  const ctaLabel = isReply ? '답글 달기' : '댓글 달기';
  const avatarSize = 26;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8
    }}>
      {/* 좌측 아바타 — 다른 CommentItem과 동일 어휘. 작성자(김민준) 색 helmet + 흰 글씨. */}
      <div className="jt-avatar" style={{
        width: avatarSize, height: avatarSize,
        background: 'var(--c-helmet)', color: '#fff',
        fontSize: 10, flexShrink: 0,
        fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
        marginTop: 4
      }}>민준</div>
      {/* textarea + 별도 액션 행 — Slack·페이스북 표준 패턴.
            textarea 박스 안에 버튼을 absolute 배치하면 줄 늘어남 시 가려짐·접근성 문제. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <textarea
          className="jt-input"
          placeholder={placeholder}
          rows={3}
          style={{
            width: '100%',
            fontSize: 13, lineHeight: 1.55,
            resize: 'none',
            fontFamily: 'inherit'
          }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="jt-btn jt-btn-sm jt-btn-primary">
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>);

}


// 댓글 포스트잇 — 색 변주 폐기 (2026-06-01).
//   · 전부 canvas(흰색) 단일 톤. tape은 디자인 시스템 기본값(ink-alpha) 사용 → 인라인 override 없음
//   · 회전만 작성자 이름 hash로 결정 — ±1.4° 이내, 캔버스에 핀 꽂힌 느낌만 유지
//   · 색은 시각 신호 과부하 + 의미 색계열(mint/safety 등)과 혼동 우려가 있어 제거
function postitHash(name) {
  return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
}

function postitStyle(name) {
  const h = postitHash(name);
  const angles = [-1.4, -0.9, -0.4, 0.4, 0.9, 1.4];
  // tape는 디자인 시스템 기본값(rgba 20,19,15,0.10)을 그대로 사용 — 별도 색 주입 안 함
  return {
    color: { bg: 'var(--c-canvas)' },
    angle: angles[h % angles.length]
  };
}


// CommentItem — 짓다 포스트잇 패턴 (2026-06-01 재디자인).
//   · 본문은 stone 배경 둥근 버블에 작성자 이름과 함께 담김
//   · 버블 밖 하단에 작은 메타 액션 행(시각·수정·삭제 등)
//   · 답글 진입 영역은 메타 액션 행 아래(원댓글 한정)
//   · isReply=true : 대댓글(작은 아바타·버블, 답글 진입 미노출 → 대대댓글 차단)
//   · idx : 댓글 목록에서의 인덱스 (스레드 열기 와이어링용)
function CommentItem({ c, idx, mine, isReply = false, inThread = false, menuOpen = false, editingNow = false, tint = null, onRequestEdit, onRequestDelete }) {
  const avatarSize = isReply ? 26 : 32;
  const avatarFont = isReply ? 9.5 : 11;
  const bodyFont = isReply ? 12.5 : 13;
  const nameFont = isReply ? 12 : 12.5;
  const replies = Array.isArray(c.replies) ? c.replies : [];
  const hasReplies = replies.length > 0;
  const postit = postitStyle(c.author.name);
  // 인터랙션 state — 외부 prop으로 viewer 정적 시연 가능
  const [showMenu, setShowMenu] = React.useState(menuOpen);

  // 아바타는 포스트잇 박스 안 상단 행에 통합(이전: 박스 외부 좌측). 박스 자체가 단일 카드 단위.
  const innerAvatarSize = isReply ? 22 : 26;
  const innerAvatarFont = isReply ? 9 : 10;

  return (
    <div>
      {/* 포스트잇 — 디자인 시스템 어휘 .jt-postit-card 사용 (tokens.css L451).
            · --postit-rot / --postit-tint / --postit-tape : 카드별 인라인 주입
            · 댓글은 카드 자체가 인터랙션 대상 아님 → .jt-postit-card-static(hover/active 비활성)
            · tape::before는 상단 중앙 -2도로 자동 렌더 — 별도 인라인 tape 미설치 */}
      <div
        className="jt-postit-card jt-postit-card-static"
        style={{
          '--postit-rot': `${postit.angle}deg`,
          '--postit-tint': tint || postit.color.bg,
          padding: isReply ? '12px 14px' : '14px 16px',
          display: 'block',
          width: '100%', boxSizing: 'border-box',
          marginTop: 8, marginBottom: 4
        }}>

          {/* 상단 행 — 아바타 + 이름 + 뱃지 (좌) / 시각 (우) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            marginBottom: 6
          }}>
            <div className="jt-avatar" style={{
              width: innerAvatarSize, height: innerAvatarSize,
              background: c.author.color, color: '#fff',
              fontSize: innerAvatarFont, flexShrink: 0,
              fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
            }}>{c.author.name.length >= 2 ? c.author.name.slice(-2) : c.author.name}</div>
            <span style={{ fontSize: nameFont, fontWeight: 700, color: 'var(--c-ink)' }}>
              {c.author.name}
            </span>
            {c.author.isOperator &&
            <span className="jt-mono" style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 3,
              background: 'rgba(255,255,255,0.6)', color: 'var(--c-amber)',
              fontWeight: 700, letterSpacing: '0.06em'
            }}>운영자</span>
            }
            {mine &&
            <span className="jt-mono" style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 3,
              background: 'rgba(255,255,255,0.7)', color: 'var(--c-ink-2)',
              fontWeight: 700, letterSpacing: '0.06em'
            }}>나</span>
            }
            <span style={{ flex: 1 }} />
            <span className="jt-mono" style={{
              fontSize: 10, color: 'var(--c-ink-3)', opacity: 0.7,
              flexShrink: 0
            }}>{c.minsAgo}분 전</span>
            {/* 더보기 — 본인 댓글에만 노출(타인 댓글 액션 = 신고만 가능했으나 기능 폐기).
                  클릭 시 팝오버 메뉴 토글. 박스 내부에 자리 잡아 패널 밖 노출 위험 제거. */}
            {mine &&
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                title="더보기"
                onClick={() => setShowMenu(v => !v)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--c-ink-3)', opacity: showMenu ? 1 : 0.55,
                  padding: 0, marginLeft: 2,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                }}>{Icon.moreH(14)}</button>
              {showMenu &&
              <CommentMenu
                onEdit={() => { setShowMenu(false); onRequestEdit && onRequestEdit(idx); }}
                onDeleteRequest={() => { setShowMenu(false); onRequestDelete && onRequestDelete(idx); }}
                onClose={() => setShowMenu(false)} />
              }
            </div>
            }
          </div>

          {/* 본문 — 수정/삭제는 인라인이 아니라 하단 sticky 재활용·모달로 분리됐으므로
                포스트잇 안에선 항상 텍스트만. 편집 중이면 약간 흐리게 + 좌측 helmet 액센트로 시그널. */}
          <div style={{
            fontSize: bodyFont,
            color: 'var(--c-ink)',
            lineHeight: 1.55,
            opacity: editingNow ? 0.5 : 1,
            transition: 'opacity 120ms ease'
          }}>
            {c.body}
          </div>

          {/* 답글 진입 영역 — 원댓글에만, 포스트잇 안 본문 하단에 위치.
                · 답글 있음: RepliesSummary (아바타 스택 + N개의 답글 + 마지막 시각)
                · 답글 없음: ReplyOpenButton (동일 pill 디자인)
                · 대대댓글(isReply): 둘 다 없음 → 대대댓글 차단
                · 스레드 안(inThread): 둘 다 없음 → 이미 답글이 펼쳐져 있음 */}
          {!isReply && !inThread &&
          <div style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: '1px dashed rgba(20,19,15,0.12)'
          }}>
              {hasReplies ?
              <RepliesSummary replies={replies} idx={idx} /> :
              <ReplyOpenButton idx={idx} />
              }
            </div>
          }
        </div>

        {/* 포스트잇 밖 영역 폐기 — 메타·답글 진입 모두 포스트잇 안으로 통합 (2026-06-01). */}
    </div>);

}

// Section — 큰 포스트잇 안의 한 블록. 단순 헤더 + 본문 + 섹션 간 점선 hairline.
function Section({ icon, label, children }) {
  return (
    <div style={{
      padding: '14px 4px',
      borderBottom: '1px dashed var(--c-hairline)'
    }}>
      <div className="jt-mono" style={{
        fontSize: 10.5, color: 'var(--c-slate)', letterSpacing: '0.12em',
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ textTransform: 'uppercase' }}>{label}</span>
      </div>
      {children}
    </div>);

}


// 스레드 백 버튼 — 격자 배경 위 텍스트 버튼.
//   hover: helmet-soft 살짝 채움 + 화살표 -2px shift + ink 톤 진해짐. 클릭 가능 시그널.
function ThreadBackButton() {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      data-action="close-thread"
      aria-label="댓글 목록으로 돌아가기"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--c-helmet-soft)' : 'transparent',
        border: '1px solid ' + (hover ? 'var(--c-helmet)' : 'transparent'),
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 12px 6px 10px', borderRadius: 'var(--r-pill)',
        color: hover ? 'var(--c-ink)' : 'var(--c-ink-2)',
        font: 'inherit', fontSize: 12.5, fontWeight: 700,
        transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease'
      }}>
      <span style={{
        display: 'inline-flex',
        transform: hover ? 'translateX(-2px)' : 'translateX(0)',
        transition: 'transform 160ms ease'
      }}>{Icon.arrowLeft(14)}</span>
      <span>댓글 목록</span>
    </button>);

}


// CommentThreadBody — 스레드의 본문 영역만(부모 댓글 + 답글 풀펼침).
//   헤더·탭·스레드 백 바·sticky 답글 폼은 모두 DetailInfoPane이 책임.
//   부모 댓글은 inThread=true 로 답글 진입 영역 숨김.
function CommentThreadBody({ parent }) {
  const replies = Array.isArray(parent.replies) ? parent.replies : [];

  return (
    <div style={{
      padding: '6px 22px 22px',
      display: 'flex', flexDirection: 'column', gap: 14
    }}>
      {/* 부모 댓글 — 흰 포스트잇 그대로 유지. 답글이 색으로 그루핑된다. */}
      <CommentItem
        c={parent}
        mine={parent.author.name === '한지원'}
        inThread={true} />

      {/* 답글 영역 — 들여쓰기 폐기, 부모 아래 중앙 정렬로 폭만 살짝 줄여 나열 (2026-06-01). */}
      {replies.length > 0 &&
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 12
      }}>
          {replies.map((r, ri) =>
          <div key={ri} style={{ width: '90%' }}>
            <CommentItem
              c={r}
              mine={r.author.name === '한지원'}
              isReply={true}
              tint="var(--c-helmet-wash)" />
          </div>
          )}
        </div>
      }
    </div>);

}


// 더보기 팝오버 — ⋯ 버튼 아래 우정렬 카드. 본인 댓글에서만 호출됨(수정/삭제).
//   · 신고 기능 폐기 — 타인 댓글에선 부모(CommentItem)가 ⋯ 자체를 안 띄움
function CommentMenu({ onEdit, onDeleteRequest, onClose }) {
  return (
    <>
      {/* 배경 클릭 영역 — 메뉴 외부 클릭 시 닫힘 */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 10, background: 'transparent'
      }} />
      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', right: 0,
        minWidth: 130, zIndex: 11,
        background: 'var(--c-canvas)',
        border: '1px solid var(--c-hairline)',
        borderRadius: 'var(--r-sm)',
        boxShadow: '0 6px 18px rgba(20,19,15,0.12)',
        padding: 4,
        display: 'flex', flexDirection: 'column'
      }}>
        <MenuRow icon={Icon.edit ? Icon.edit(13) : '✎'} label="수정" onClick={onEdit} />
        <MenuRow icon="🗑" label="삭제" onClick={onDeleteRequest} danger />
      </div>
    </>);

}

function MenuRow({ icon, label, onClick, danger }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px',
        background: hover ? 'var(--c-stone)' : 'transparent',
        border: 'none', borderRadius: 'var(--r-xs)',
        cursor: 'pointer', font: 'inherit',
        fontSize: 12.5, fontWeight: 600,
        color: danger ? 'var(--c-safety)' : 'var(--c-ink-2)',
        textAlign: 'left'
      }}>
      <span style={{ width: 14, display: 'inline-flex', justifyContent: 'center', fontSize: 12 }}>{icon}</span>
      {label}
    </button>);

}

// 수정 모드 — 본문 자리에 textarea + 취소/완료 버튼
function CommentEditForm({ body, onCancel, onSave }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea
        defaultValue={body}
        rows={3}
        style={{
          width: '100%',
          fontSize: 13, lineHeight: 1.55,
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid var(--c-hairline-strong)',
          borderRadius: 'var(--r-xs)',
          padding: '8px 10px',
          resize: 'vertical',
          fontFamily: 'inherit', outline: 'none',
          color: 'var(--c-ink)'
        }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--c-slate)', padding: '6px 10px',
            font: 'inherit'
          }}>취소</button>
        <button
          onClick={onSave}
          className="jt-btn jt-btn-sm jt-btn-primary">저장</button>
      </div>
    </div>);

}

// 삭제 확인 — 본문 자리에 인라인 컨펌. 모달 띄우지 않음(컨텍스트 유지).
function CommentDeleteConfirm({ onCancel, onConfirm }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.65)',
      border: '1px solid var(--c-safety-soft)',
      borderRadius: 'var(--r-xs)',
      padding: '10px 12px',
      display: 'flex', flexDirection: 'column', gap: 8
    }}>
      <div style={{ fontSize: 12.5, color: 'var(--c-ink)', lineHeight: 1.5 }}>
        이 댓글을 삭제할까요? <span style={{ color: 'var(--c-slate)' }}>되돌릴 수 없어요.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--c-slate)', padding: '4px 10px',
            font: 'inherit'
          }}>취소</button>
        <button
          onClick={onConfirm}
          className="jt-btn jt-btn-sm jt-btn-danger">삭제</button>
      </div>
    </div>);

}


// 답글 0개일 때의 "답글 달기" 진입점 — 디자인시스템 .jt-btn-sm jt-btn-ghost 어휘.
function ReplyOpenButton({ idx }) {
  return (
    <button
      data-action={typeof idx === 'number' ? `open-thread-${idx}` : 'open-thread'}
      className="jt-btn jt-btn-sm jt-btn-ghost"
      style={{ gap: 6 }}>
      <span style={{ display: 'inline-flex' }}>{Icon.comment(13)}</span>
      <span>답글 달기</span>
    </button>);

}


// 답글 요약 (Slack 패턴) — 본문 노출 없이 한 줄로 접힘
//   [작은 아바타 stack · 최대 3개] [N개의 답글] [· 마지막 답글 시각]
//   클릭 영역 hover: 약한 배경. 실제 클릭 인터랙션은 디자인 단계에선 미정 — 추후 답글 펼침 토글 또는 별도 패널.
function RepliesSummary({ replies, idx }) {
  const [hover, setHover] = React.useState(false);
  const stack = replies.slice(0, 3);
  const lastMins = Math.min(...replies.map(r => r.minsAgo));

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-action={typeof idx === 'number' ? `open-thread-${idx}` : 'open-thread'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        alignSelf: 'flex-start',
        background: hover ? 'var(--c-stone)' : 'transparent',
        border: '1px solid transparent',
        borderRadius: 999,
        padding: '4px 12px 4px 6px',
        cursor: 'pointer',
        font: 'inherit',
        transition: 'background 120ms ease'
      }}>
      {/* 아바타 stack — 왼쪽 우선, -8px overlap, 흰 테두리 */}
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {stack.map((r, ri) =>
        <div key={ri} className="jt-avatar" style={{
          width: 22, height: 22, background: r.author.color, color: '#fff',
          fontSize: 9, flexShrink: 0,
          fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.04em',
          border: '2px solid var(--c-canvas)',
          marginLeft: ri === 0 ? 0 : -8,
          position: 'relative', zIndex: stack.length - ri
        }}>{r.author.name.length >= 2 ? r.author.name.slice(-2) : r.author.name}</div>
        )}
      </div>
      <span style={{ fontSize: 12, color: 'var(--c-ink)', fontWeight: 700 }}>
        {replies.length}개의 답글
      </span>
      <span className="jt-mono" style={{ fontSize: 11, color: 'var(--c-slate)' }}>
        {lastMins}분 전 마지막 답글
      </span>
    </button>);

}


// ─────────────────────────────────────────────────────────────
// D-2 케이스별 export
// ─────────────────────────────────────────────────────────────
function D2GalleryDetail() {
  return <D2Shell idx={1} mine={false} previewState="loaded" tab="info" />;
}
function D2GalleryDetailLoading() {
  return <D2Shell idx={2} mine={false} previewState="loading" tab="info" />;
}
function D2GalleryDetailFirst() {
  return <D2Shell idx={0} mine={true} previewState="loaded" tab="info" />;
}
function D2GalleryDetailLast() {
  return <D2Shell idx={GALLERY_PROJECTS.length - 1} mine={false} previewState="loaded" tab="info" />;
}
function D2GalleryDetailMine() {
  // 본인 프로젝트 — 좋아요 비활성 + 공개 설정 링크 활성
  return <D2Shell idx={0} mine={true} previewState="loaded" tab="info" />;
}

// 댓글 탭 — 통합 액션(댓글 N · 댓글 달기) + 댓글 4건. 답글 있는 댓글엔 요약 줄 자동 노출.
function D2GalleryDetailComments() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" />;
}

// D2GalleryDetailCommentsCompose 폐기 (2026-06-01) — 작성 폼이 기본 화면에 항상 펼쳐져 있어 별도 케이스 불필요.

// 댓글 빈 상태 — 첫 댓글 작성 유도
function D2GalleryDetailCommentsEmpty() {
  return <D2Shell idx={5} mine={false} previewState="loaded" tab="comments" commentsState="empty" />;
}

// 스레드 뷰 — 한지원 댓글(시간 역순 정렬 후 index 1)의 스레드 풀펼침
// 우측 패널 전체가 스레드로 교체. 답글 본문 펼침 + 하단 답글 작성 폼.
function D2GalleryDetailCommentsThread() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" threadOpenIdx={1} />;
}

// 스레드 뷰 + 답글 작성 폼 활성 상태
function D2GalleryDetailCommentsThreadCompose() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" threadOpenIdx={1} threadReplyComposeOpen={true} />;
}

// 더보기 메뉴 열림 (한지원 댓글 = idx 1, 본인 → 수정/삭제 메뉴)
function D2GalleryDetailCommentsMenu() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" menuOpenIdx={1} />;
}

// 수정 모드 (한지원 댓글 = idx 1, 본문 → textarea + 취소/저장)
function D2GalleryDetailCommentsEdit() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" editIdx={1} />;
}

// 삭제 확인 (한지원 댓글 = idx 1, 본문 → 인라인 컨펌)
function D2GalleryDetailCommentsDelete() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" deleteIdx={1} />;
}

Object.assign(window, {
  D1GalleryList, D1GalleryListEnded, D1GalleryEmpty, D1GalleryLoading,
  D2GalleryDetail, D2GalleryDetailLoading, D2GalleryDetailFirst, D2GalleryDetailLast, D2GalleryDetailMine,
  D2GalleryDetailComments, D2GalleryDetailCommentsEmpty,
  D2GalleryDetailCommentsThread, D2GalleryDetailCommentsThreadCompose,
  D2GalleryDetailCommentsMenu, D2GalleryDetailCommentsEdit, D2GalleryDetailCommentsDelete
});