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
{ team: '개인 · 노유진', members: 1, title: '나만의 영단어장', tagline: '하루 10개 반복 학습', likes: 5, iLiked: false, live: true },
{ team: '개인 · 류재석', members: 1, title: '운동 기록 일지', tagline: '벤치프레스 다음 무게는?', likes: 3, iLiked: false, live: false },
{ team: '개인 · 손미래', members: 1, title: '독서록 자동 요약', tagline: '읽은 책을 한 줄로', likes: 2, iLiked: false, live: true }];



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
      <JitdaMark size={18} />
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
function BackLink({ label }) {
  return (
    <button className="jt-btn jt-btn-ghost jt-btn-sm" style={{
      padding: '4px 8px 4px 4px', gap: 4,
      fontSize: 12, color: 'var(--c-slate)',
      marginLeft: -8 // 시각적으로 본문 가장자리에 맞춤
    }}>
      {Icon.arrowLeft(12)} {label}
    </button>);

}

// ─── 서브 헤더 (제목 + 통계 + 검색) ────────────────────
function GallerySubHeader({ status, total, query = '', tutorialMode, backLabel }) {
  const titleByStatus = {
    running: <>공개된 {total}개 프로젝트</>,
    ended: <>최종 {total}개 작품</>,
    tutorial: <>튜토리얼 결과 {total}건</>
  };
  const sub = {
    running: '마음에 드는 프로젝트엔 ❤️ 좋아요로 응원해주세요. 마감 시간까지 자유롭게 둘러볼 수 있어요.',
    ended: '해커톤이 종료되어 모든 팀의 작품이 자동으로 공개됐어요. 좋아요는 종료 후 7일간 누를 수 있어요.',
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
          {backLabel && <BackLink label={backLabel} />}
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
              {status === 'ended' &&
          <span className="jt-mono" style={{
            fontSize: 10, fontWeight: 600,
            paddingLeft: 7, marginLeft: 1,
            borderLeft: `1px solid currentColor`,
            opacity: 0.55,
            letterSpacing: '0.08em'
          }}>SEALED · 18:20</span>
          }
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

// 갤러리에서 사용 — ProjectCard 래퍼
function GalleryCard({ p, mine, dim }) {
  // 댓글 수 mock (제목 길이로 결정)
  const commentCount = p.commentCount ?? Math.max(0, (p.likes / 4 | 0) - 1);
  return (
    <ProjectCard
      dataAction="open-card"
      thumb={<LivePreview teamName={p.team} live={p.live} badge={null} />}
      ribbon={mine ? '내 프로젝트' : null}
      dim={dim}
      title={p.title}
      subtitle={
      <>
          {p.team} <span style={{ color: 'var(--c-hairline-strong)', margin: '0 2px' }}>·</span>
          <span className="jt-mono" style={{ fontSize: 11 }}>{p.members}명</span>
        </>
      }
      primaryMeta={<LikeMeta count={p.likes} iLiked={p.iLiked} />}
      secondaryMeta={<CommentMeta count={commentCount} />} />);


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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <GalleryHeader count={visible.length} role="participant" user={PARTICIPANT_USER} />

      <div style={{ flex: 1, padding: '24px 40px', overflow: 'auto' }}>
        <GallerySubHeader status="running" total={visible.length} backLabel="바이브코딩으로" />
        <GalleryGrid projects={visible} mineTeam="터미널 사파리" />
        <Pagination page={1} perPage={8} total={visible.length} prevDisabled nextDisabled />
      </div>
    </div>);

}

// (2) 종료 후 — 전원 자동 공개 (12개)
function D1GalleryListEnded() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <GalleryHeader count={12} role="participant" user={PARTICIPANT_USER} breadcrumb={['갤러리']} />

      <div style={{ flex: 1, padding: '24px 40px', overflow: 'auto' }}>
        <GallerySubHeader status="ended" total={12} backLabel="대기실로" />
        <GalleryGrid projects={GALLERY_PROJECTS} mineTeam="터미널 사파리" />
        <Pagination page={1} perPage={12} total={12} prevDisabled nextDisabled />
      </div>
    </div>);

}

// (3) 빈 상태 — 아직 아무도 공개하지 않음
function D1GalleryEmpty() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <GalleryHeader count={0} role="participant" user={PARTICIPANT_USER} />

      <div style={{ flex: 1, padding: '24px 40px', overflow: 'auto' }}>
        <GallerySubHeader status="running" total={0} backLabel="바이브코딩으로" />

        <div style={{
          marginTop: 12,
          background: 'var(--c-canvas)',
          border: '1px dashed var(--c-hairline-strong)',
          borderRadius: 8,
          padding: '52px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 14, textAlign: 'center'
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
    </div>);

}

// (4) 로딩 상태
function D1GalleryLoading() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c-paper)' }}>
      <GalleryHeader count={null} role="participant" user={PARTICIPANT_USER} />

      <div style={{ flex: 1, padding: '24px 40px', overflow: 'auto' }}>
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

        {/* Skeleton grid — 신 카드 디자인 (compact 2행) 매치 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16
        }}>
          {Array.from({ length: 8 }).map((_, i) =>
          <div key={i} style={{
            background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
            borderRadius: 8, overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(20,19,15,0.04)'
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

// GalleryGrid + BouncingDots 는 shared.jsx 의 ProjectCard / BouncingDots 를 활용
function GalleryGrid({ projects, mineTeam }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 16
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
function D2Shell({ idx, mine, previewState = 'loaded', tab = 'info', commentsState = 'has' }) {
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
            maxWidth: 280
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

        {/* 아이콘 액션 — 새로고침 → 새 탭 → 공개 설정 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4 }}>
          <IconButton title="새로고침 (라이브 앱 상태 다시 불러오기)">{Icon.refresh(14)}</IconButton>
          <IconButton title="새 탭에서 열기">{Icon.external(14)}</IconButton>
          <IconButton
            title={mine ? '공개 설정' : '본인 프로젝트만 공개 설정이 가능해요'}
            disabled={!mine}>
            {Icon.settings(14)}</IconButton>
        </div>

        <div style={{ flex: 1 }} />

        {/* 이전/다음 — 우측 끝. 작은 화살표 한 쌍, 팀명순 기준 인접 프로젝트. */}
        <ProjectNavArrows
          prev={prev} next={next}
          prevDisabled={prevDisabled} nextDisabled={nextDisabled} />
      </div>

      {/* 본문 — 2-pane */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: 0 }}>
        <DetailLivePane project={project} state={previewState} />
        <DetailInfoPane project={project} mine={mine} tab={tab} commentsState={commentsState} />
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
        {/* Safari (Tahoe) 스타일 chrome — 컴팩트, 데코레이션 전용 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '5px 11px',
          background: '#f5f5f7',
          borderBottom: '0.5px solid #d8d8da',
          flexShrink: 0,
          height: 32, boxSizing: 'border-box'
        }}>
          {/* 트래픽 라이트 — 작고 모던하게 */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06)' }} />
          </div>

          {/* 사이드바 아이콘 (SF Symbol 톤 — 얇은 스트로크) */}
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginLeft: 4 }}>
            <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="#86868b" strokeWidth="0.9" />
            <line x1="5" y1="2.5" x2="5" y2="11.5" stroke="#86868b" strokeWidth="0.9" />
          </svg>

          {/* 중앙 pill 주소창 */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0 10px',
              width: '100%', maxWidth: 380, height: 22,
              background: '#ffffff',
              border: '0.5px solid #d6d6d8',
              borderRadius: 6,
              fontSize: 11.5,
              color: '#1d1d1f'
            }}>
              {/* aA 리더 아이콘 (Tahoe Safari) */}
              <span style={{
                fontSize: 10, color: '#86868b', flexShrink: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                letterSpacing: '-0.04em', lineHeight: 1
              }}>
                <span style={{ fontSize: 8.5 }}>a</span>
                <span style={{ fontSize: 11 }}>A</span>
              </span>
              <span style={{
                flex: 1, textAlign: 'center',
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                color: state === 'loading' ? '#86868b' : '#1d1d1f',
                fontWeight: 400, letterSpacing: '-0.01em'
              }}>
                {state === 'loading' ? '연결 중…' : project.title}
              </span>
              {/* 새로고침 — 얇은 SVG */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8.3 5a3.3 3.3 0 1 1-1-2.35M8.3 1.5v2h-2" stroke="#86868b" strokeWidth="0.9" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

          {/* 우측 액션 (공유 · 탭 그룹) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11,
            flexShrink: 0
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5v7" stroke="#86868b" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M4.8 3.7L7 1.5l2.2 2.2" stroke="#86868b" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M3 7.5v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4" stroke="#86868b" strokeWidth="0.9" strokeLinecap="round" fill="none" />
            </svg>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="2.5" width="5" height="9" rx="1" stroke="#86868b" strokeWidth="0.9" fill="none" />
              <rect x="7.5" y="2.5" width="5" height="9" rx="1" stroke="#86868b" strokeWidth="0.9" fill="none" />
            </svg>
          </div>
        </div>
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
      <div style={{
        width: 64, height: 64, borderRadius: 10,
        background: 'var(--c-canvas)', border: '1px solid var(--c-hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <BouncingDots size={6} />
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


const COMMENTS_MOCK = [
{ author: COMMENT_AUTHORS[0], body: '시간표 사진 하나로 일정이 자동 등록되는 흐름이 정말 자연스러워요. OCR 정확도가 인상 깊었습니다.', minsAgo: 4, likes: 3, iLiked: true },
{ author: COMMENT_AUTHORS[2], body: 'D-Day 카운트다운 색상 처리가 직관적이에요!', minsAgo: 12, likes: 2, iLiked: false },
{ author: COMMENT_AUTHORS[3], body: '시간표가 매주 바뀌는 학기 초에 대비해서, 사진을 다시 업로드했을 때 기존 일정을 어떻게 처리할지 안내가 있으면 좋겠어요.', minsAgo: 28, likes: 5, iLiked: false },
{ author: COMMENT_AUTHORS[1], body: '대회 운영팀입니다. 라이브 데모 시 OCR 처리 화면을 빔으로 띄워주실 수 있을까요?', minsAgo: 42, likes: 1, iLiked: false }];



// ─── 우측 정보 패널 ────────────────────────────────────
// tab: 'info' | 'comments'
// commentsState: 'has' | 'empty'
function DetailInfoPane({ project, mine, tab = 'info', commentsState = 'has' }) {
  const purpose = project.purpose ||
  `${project.team}가 만든 작품이에요. 자세한 목적은 팀이 아직 작성하지 않았어요.`;
  const howto = project.howto || ['카드를 누르면 라이브 앱이 열려요', '좌측 화면에서 직접 사용해보세요', '마음에 들면 ❤️ 좋아요를 눌러주세요'];
  const stack = project.stack || ['React', 'Node.js'];

  const commentCount = commentsState === 'empty' ? 0 : COMMENTS_MOCK.length;

  return (
    <aside style={{
      background: 'var(--c-canvas)',
      borderLeft: '1px solid var(--c-hairline)',
      display: 'flex', flexDirection: 'column',
      minHeight: 0
    }}>
      {/* 헤더 — 팀 + 제목 + 태그라인 (탭 무관 항상 표시) */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--c-hairline)' }}>
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
        <p style={{ fontSize: 13, color: 'var(--c-slate)', marginTop: 6, lineHeight: 1.55 }}>
          {project.tagline}
        </p>
      </div>

      {/* 탭 — 정보 / 댓글 (jt-tab 시스템 컴포넌트, 2026-05-27 표준화) */}
      <div className="jt-tab-bar" role="tablist">
        <PanelTab active={tab === 'info'} label="정보" />
        <PanelTab active={tab === 'comments'} label="댓글" badge={commentCount} />
      </div>

      {/* 본문 (탭별) */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {tab === 'info' ?
        <>
            <Section icon="📋" label="목적">
              <p style={{ fontSize: 13, color: 'var(--c-ink-2)', lineHeight: 1.6, margin: 0 }}>{purpose}</p>
            </Section>

            <Section icon="🔧" label="사용법">
              <ol style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
                {howto.map((h, i) =>
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--c-ink-2)', lineHeight: 1.5 }}>
                    <span className="jt-mono" style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--c-stone)', color: 'var(--c-ink-2)',
                  fontSize: 11, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                }}>{i + 1}</span>
                    <span>{h}</span>
                  </li>
              )}
              </ol>
            </Section>

            <Section icon="👥" label="팀 멤버">
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
                      color: '#fff', fontSize: 10
                    }}>{m[0]}</div>
                      {m}
                    </div>);

              })}
              </div>
            </Section>
          </> :

        <CommentsPanel state={commentsState} mine={mine} />
        }
      </div>

      {/* 하단 sticky 액션 — 좋아요 (탭 무관 항상 노출) */}
      <LikeActionBar project={project} mine={mine} />
    </aside>);

}

function PanelTab({ active, label, badge }) {
  return (
    <button
      className={`jt-tab ${active ? 'is-active' : ''}`}
      role="tab"
      aria-selected={active}
      data-action={active ? undefined : (label === '정보' ? 'tab-info' : 'tab-comments')}
    >
      {label}
      {typeof badge === 'number' && badge > 0 &&
      <span className="jt-tab-badge">{badge}</span>
      }
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
function CommentsPanel({ state, mine }) {
  if (state === 'empty') {
    return (
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CommentCompose />
        <div style={{
          padding: '32px 16px',
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
      <CommentCompose />

      <div style={{ fontSize: 11.5, color: 'var(--c-slate)' }}>
        댓글 <strong style={{ color: 'var(--c-ink)' }}>{COMMENTS_MOCK.length}</strong>
      </div>

      {/* 먼저 단 댓글이 위에 나오도록 시간 역순 정렬 (minsAgo 큰 값 = 오래 전) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[...COMMENTS_MOCK].sort((a, b) => b.minsAgo - a.minsAgo).map((c, i) =>
        <CommentItem key={i} c={c} mine={c.author.name === '한지원'} />
        )}
      </div>
    </div>);

}


function CommentCompose() {
  // 단순 댓글 입력 — 템플릿 분리 없음. 포커스 전엔 한 줄, 포커스 시 확장.
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{
      background: 'var(--c-canvas)',
      border: `1px solid ${focused ? 'var(--c-ink)' : 'var(--c-hairline-strong)'}`,
      borderRadius: 'var(--r-sm)',
      padding: focused ? '10px 10px 10px 10px' : '4px 4px 4px 10px',
      display: 'flex', flexDirection: 'column', gap: focused ? 8 : 0,
      transition: 'border-color 120ms ease, padding 120ms ease'
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: focused ? 'flex-start' : 'center' }}>
        <div className="jt-avatar" style={{
          width: 24, height: 24, background: 'var(--c-helmet)', color: '#fff',
          fontSize: 11, flexShrink: 0
        }}>김</div>
        <textarea
          placeholder="댓글 남기기…"
          rows={focused ? 3 : 1}
          onFocus={() => setFocused(true)}
          style={{
            flex: 1,
            fontSize: 12.5, lineHeight: 1.55,
            border: 'none',
            padding: focused ? '4px 0' : '6px 0',
            resize: 'none',
            background: 'transparent',
            fontFamily: 'inherit',
            outline: 'none',
            color: 'var(--c-ink)'
          }} />
        
        {!focused &&
        <span style={{
          flexShrink: 0,
          padding: '6px 10px',
          fontSize: 11.5,
          color: 'var(--c-muted)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em'
        }}>댓글 달기</span>
        }
      </div>

      {focused &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 32 }}>
          <span style={{ flex: 1 }} />
          <button
          onClick={() => setFocused(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--c-slate)', padding: '6px 8px',
            font: 'inherit'
          }}>취소</button>
          <button className="jt-btn jt-btn-sm" style={{
          padding: '6px 14px', fontSize: 12,
          background: 'var(--c-canvas)',
          color: 'var(--c-ink)',
          border: '1px solid var(--c-hairline-strong)',
          fontWeight: 700
        }}>댓글 달기</button>
        </div>
      }
    </div>);

}


function CommentItem({ c, mine }) {
  return (
    <div style={{ display: 'flex', gap: 9 }}>
      <div className="jt-avatar" style={{
        width: 28, height: 28, background: c.author.color, color: '#fff',
        fontSize: 11, flexShrink: 0
      }}>{c.author.name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 메타 행 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--c-slate)', marginBottom: 5
        }}>
          <span style={{ fontWeight: 700, color: 'var(--c-ink)' }}>{c.author.name}</span>
          {c.author.isOperator &&
          <span className="jt-mono" style={{
            fontSize: 9.5, padding: '1px 5px', borderRadius: 3,
            background: 'var(--c-helmet-soft)', color: 'var(--c-amber)',
            fontWeight: 700, letterSpacing: '0.06em'
          }}>운영자</span>
          }
          {mine &&
          <span className="jt-mono" style={{
            fontSize: 9.5, padding: '1px 5px', borderRadius: 3,
            background: 'var(--c-stone)', color: 'var(--c-ink-2)',
            fontWeight: 700, letterSpacing: '0.06em'
          }}>나</span>
          }
          <span style={{ color: 'var(--c-hairline-strong)' }}>·</span>
          <span className="jt-mono" style={{ fontSize: 10.5 }}>{c.minsAgo}분 전</span>
          <span style={{ flex: 1 }} />
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--c-muted)', padding: 2, display: 'inline-flex'
          }} title="더보기">{Icon.moreH(13)}</button>
        </div>

        {/* 본문 */}
        <div style={{ fontSize: 13, color: 'var(--c-ink-2)', lineHeight: 1.55, marginBottom: mine || true ? 6 : 0 }}>
          {c.body}
        </div>

        {/* 액션 — 본인 댓글만 수정/삭제 노출. 답글·좋아요 기능은 현재 없으므로 미노출.
              타인 댓글의 신고는 위쪽 더보기(⋯) 메뉴로 이동. */}
        {mine &&
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5 }}>
            <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--c-slate)', padding: 0, font: 'inherit'
          }}>수정</button>
            <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--c-slate)', padding: 0, font: 'inherit'
          }}>삭제</button>
          </div>
        }
      </div>
    </div>);

}

function Section({ icon, label, children }) {
  return (
    <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--c-hairline)' }}>
      <div className="jt-mono" style={{
        fontSize: 10.5, color: 'var(--c-slate)', letterSpacing: '0.12em',
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6
      }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ textTransform: 'uppercase' }}>{label}</span>
      </div>
      {children}
    </div>);

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

// 댓글 탭 — 댓글 4건 + 작성 폼
function D2GalleryDetailComments() {
  return <D2Shell idx={0} mine={false} previewState="loaded" tab="comments" commentsState="has" />;
}

// 댓글 빈 상태 — 첫 댓글 작성 유도
function D2GalleryDetailCommentsEmpty() {
  return <D2Shell idx={5} mine={false} previewState="loaded" tab="comments" commentsState="empty" />;
}

Object.assign(window, {
  D1GalleryList, D1GalleryListEnded, D1GalleryEmpty, D1GalleryLoading,
  D2GalleryDetail, D2GalleryDetailLoading, D2GalleryDetailFirst, D2GalleryDetailLast, D2GalleryDetailMine,
  D2GalleryDetailComments, D2GalleryDetailCommentsEmpty
});