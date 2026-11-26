'use strict';

/* =========================================================
   월넛 픽셀 서재 — local-first PWA
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const STORE_KEY = 'walnut-pixel-library-v1';
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const IDEA_CATS = ['미리캔버스', '건강 공부', '영상제작', '기타'];

const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const todayStr = () => ymd(new Date());
const parseYmd = s => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const fmtDate = s => {
  const d = parseYmd(s);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEK[d.getDay()]})`;
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* 픽셀 아이콘 (연필 · 삭제) */
const PENCIL_SVG = `<svg viewBox="0 0 16 16" width="12" height="12" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="12" y="1" width="3" height="3" fill="#E8C48C"/>
  <rect x="11" y="2" width="2" height="2" fill="#C9A05E"/>
  <rect x="10" y="3" width="3" height="3" fill="currentColor"/>
  <rect x="8" y="5" width="3" height="3" fill="currentColor"/>
  <rect x="6" y="7" width="3" height="3" fill="currentColor"/>
  <rect x="4" y="9" width="3" height="3" fill="currentColor"/>
  <rect x="2" y="11" width="3" height="3" fill="#2B1D14"/>
</svg>`;
const CROSS_SVG = `<svg viewBox="0 0 16 16" width="12" height="12" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="3" y="3" width="2" height="2" fill="currentColor"/>
  <rect x="5" y="5" width="2" height="2" fill="currentColor"/>
  <rect x="7" y="7" width="2" height="2" fill="currentColor"/>
  <rect x="9" y="9" width="2" height="2" fill="currentColor"/>
  <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
  <rect x="11" y="3" width="2" height="2" fill="currentColor"/>
  <rect x="9" y="5" width="2" height="2" fill="currentColor"/>
  <rect x="5" y="9" width="2" height="2" fill="currentColor"/>
  <rect x="3" y="11" width="2" height="2" fill="currentColor"/>
</svg>`;

/* =========================================================
   상태
   ========================================================= */
const emptyState = () => ({
  version: 1,
  seeded: true,
  todos: [],
  events: [],
  shopping: [],
  ideas: [],
  videos: [],
  links: defaultLinks()
});

/* 바로가기 — 개인 주소는 저장하지 않고 일반 주소만 기본값으로 둡니다 */
const DEFAULT_LINKS = [
  { name: '네이버 블로그', url: 'https://blog.naver.com', icon: 'blog', glyph: '블' },
  { name: '워드프레스', url: 'https://wordpress.com', icon: 'wp', glyph: '워' },
  { name: '네이버 메일', url: 'https://mail.naver.com', icon: 'mail', glyph: '메' }
];
const defaultLinks = () => DEFAULT_LINKS.map(l => ({ id: uid(), name: l.name, url: l.url, icon: l.icon, glyph: l.glyph }));

function sampleState() {
  const now = new Date();
  const iso = (offset) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return ymd(d);
  };
  return {
    version: 1,
    seeded: true,
    links: defaultLinks(),
    todos: [
      { id: uid(), text: '미리캔버스 요소 제출하기', done: false, star: true, createdAt: Date.now() },
      { id: uid(), text: '블로그 글 임시저장 마무리', done: false, star: false, createdAt: Date.now() },
      { id: uid(), text: '저녁 산책 20분', done: false, star: false, createdAt: Date.now() }
    ],
    events: [
      { id: uid(), date: iso(0), text: '미리캔버스 심사 결과 확인', done: false },
      { id: uid(), date: iso(1), text: '책상 스탠드 램프 정리', done: false },
      { id: uid(), date: iso(3), text: '주말 장보기', done: false }
    ],
    shopping: [
      { id: uid(), name: '지퍼백 (소분용)', qty: '1팩', cat: '생활', done: false, createdAt: Date.now() },
      { id: uid(), name: '색연필 리필심', qty: '2색', cat: '작업', done: false, createdAt: Date.now() }
    ],
    ideas: [
      {
        id: uid(), cat: '미리캔버스', title: '겨울 창가 손그림 요소',
        body: '눈 내리는 창가 + 월넛 책상 위 스탠드 조명. 인쇄용 최대 크기로, 템플릿 위에 얹기 좋은 꾸미기 요소로.',
        tags: ['겨울', '손그림', '꾸미기'], createdAt: Date.now(), updatedAt: Date.now()
      },
      {
        id: uid(), cat: '건강 공부', title: '포도당신생합성 정리',
        body: '간에서 젖산·글리세롤·아미노산로 포도당을 다시 만드는 경로. 저탄고지 맥락에서 어디까지가 확립된 사실인지 구분해서 정리해 두기.',
        tags: ['대사', '간'], createdAt: Date.now(), updatedAt: Date.now()
      },
      {
        id: uid(), cat: '영상제작', title: '릴스 첫 3초 훅',
        body: '손이 프레임에 들어오는 클로즈업으로 시작 → 결과물 컷. 자막은 한 줄만, 소리는 그대로 살리기.',
        tags: ['릴스', '인트로'], createdAt: Date.now(), updatedAt: Date.now()
      }
    ],
    videos: [
      {
        id: uid(), url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        title: 'Big Buck Bunny (색감 레퍼런스)', memo: '따뜻한 조명 톤 참고용으로 저장',
        tags: ['레퍼런스', '색감'], thumb: '', platform: 'youtube', createdAt: Date.now()
      },
      {
        id: uid(), url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        title: '짧은 구성 참고 영상', memo: '15초 안에 끝나는 구성 아이디어',
        tags: ['구성'], thumb: '', platform: 'youtube', createdAt: Date.now() - 1000
      },
      {
        id: uid(), url: 'https://www.instagram.com/',
        title: '릴스 오프닝 훅 모음', memo: '첫 3초 클로즈업 → 결과 컷 순서 참고',
        tags: ['릴스', '인트로'], thumb: '', platform: 'instagram', createdAt: Date.now() - 2000
      },
      {
        id: uid(), url: 'https://ko.wikipedia.org/wiki/픽셀_아트',
        title: '픽셀 아트 읽을거리', memo: '도트 팔레트 고르는 법 정리해 둔 글',
        tags: ['도트', '공부'], thumb: '', platform: 'other', createdAt: Date.now() - 3000
      }
    ]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return sampleState();
    const parsed = JSON.parse(raw);
    const safe = emptyState();
    for (const k of ['todos', 'events', 'shopping', 'ideas', 'videos', 'links']) {
      if (Array.isArray(parsed[k])) safe[k] = parsed[k];
    }
    safe.seeded = parsed.seeded !== false;
    return safe;
  } catch (e) {
    console.warn('저장된 기록을 읽지 못했어요.', e);
    return sampleState();
  }
}

let state = loadState();

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn(e);
    showToast('저장 공간이 가득 찼어요. 썸네일을 줄이거나 백업 후 정리해 주세요.');
  }
}

/* =========================================================
   공용 UI
   ========================================================= */
let toastTimer = null;
function showToast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function setBadge(name, value) {
  $$(`[data-badge="${name}"]`).forEach(el => {
    el.textContent = value;
    el.classList.toggle('is-zero', value === 0);
  });
}

function updateBadges() {
  const openTodos = state.todos.filter(t => !t.done).length;
  const shops = state.shopping.filter(s => !s.done).length;
  const monthPrefix = todayStr().slice(0, 7);
  const monthEvents = state.events.filter(e => e.date && e.date.startsWith(monthPrefix)).length;
  setBadge('todo', openTodos);
  setBadge('shopping', shops);
  setBadge('ideas', state.ideas.length);
  setBadge('videos', state.videos.length);
  setBadge('calendar', monthEvents);
  $$('#todoFilters .chip').forEach(chip => {
    const f = chip.dataset.filter;
    const n = f === 'all' ? state.todos.length : state.todos.filter(t => (f === 'done' ? t.done : !t.done)).length;
    const b = chip.querySelector('b');
    if (b) b.textContent = n;
  });
  $$('#ideaTabs .chip').forEach(chip => {
    const b = chip.querySelector('b');
    if (b) b.textContent = state.ideas.filter(i => i.cat === chip.dataset.cat).length;
  });
  $('#shopSummary').textContent = `${shops}개 남음 · 담은 것 ${state.shopping.length}개`;
  $('#storageInfo').textContent = `저장 ${(JSON.stringify(state).length / 1024).toFixed(1)}KB`;
}

/* =========================================================
   화면 전환
   ========================================================= */
let currentView = 'room';

function openView(view) {
  const panel = view === 'room' ? null : $(`#panel-${view}`);
  if (view !== 'room' && !panel) return;
  $$('.panel').forEach(p => { p.hidden = true; });
  currentView = view;
  $$('.dock-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if (panel) {
    panel.hidden = false;
    const body = panel.querySelector('.panel-body');
    if (body) body.scrollTop = 0;
    if (view === 'todo') renderTodos();
    if (view === 'calendar') renderCalendar();
    if (view === 'shopping') renderShopping();
    if (view === 'ideas') renderIdeas();
    if (view === 'videos') renderVideos();
    if (view === 'links') renderLinks();
  }
  if (view === 'room') room.start(); else room.pause();
}

document.addEventListener('click', (e) => {
  const viewBtn = e.target.closest('[data-view]');
  if (viewBtn) {
    e.preventDefault();
    openView(viewBtn.dataset.view);
    return;
  }
  const closeBtn = e.target.closest('.close-panel');
  if (closeBtn) {
    openView('room');
    return;
  }
  const backdrop = e.target.closest('.modal');
  if (backdrop && !e.target.closest('[data-close-modal]') && e.target === backdrop) closeModal(backdrop);
  const closers = e.target.closest('[data-close-modal]');
  if (closers) closeModal(closers.closest('.modal'));
});

function openModal(el) { el.hidden = false; }
function closeModal(el) { if (el) el.hidden = true; }

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = $$('.modal').find(m => !m.hidden);
    if (modal) { closeModal(modal); return; }
    if (currentView !== 'room') openView('room');
  }
});

/* =========================================================
   1. 해야 할 일
   ========================================================= */
let todoFilter = 'all';

function renderTodos() {
  const list = $('#todoList');
  const items = state.todos
    .filter(t => todoFilter === 'all' ? true : todoFilter === 'done' ? t.done : !t.done)
    .sort((a, b) => (Number(a.done) - Number(b.done)) || (Number(b.star) - Number(a.star)) || (a.createdAt - b.createdAt));

  list.innerHTML = items.map(t => `
    <li class="todo-item${t.done ? ' done' : ''}" data-id="${t.id}">
      <button class="check${t.done ? ' on' : ''}" data-act="toggle" aria-label="${t.done ? '완료 취소' : '완료 체크'}" aria-pressed="${t.done}">✓</button>
      <span class="txt">${esc(t.text)}</span>
      <button class="star${t.star ? ' on' : ''}" data-act="star" aria-label="중요 표시" aria-pressed="${!!t.star}">${t.star ? '★' : '☆'}</button>
      <button class="del" data-act="del" aria-label="삭제">✕</button>
    </li>`).join('');

  $('#todoEmpty').hidden = items.length > 0;
  if (items.length === 0) {
    $('#todoEmpty').textContent = state.todos.length === 0
      ? '아직 적어 둔 게 없어요. 오늘 할 일 하나만 적어 볼까요?'
      : '이 필터에는 항목이 없어요.';
  }
  updateBadges();
}

$('#todoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#todoInput');
  const text = input.value.trim();
  if (!text) return;
  state.todos.push({ id: uid(), text, done: false, star: false, createdAt: Date.now() });
  input.value = '';
  save();
  renderTodos();
  renderNote();
  showToast('할 일을 적어 두었어요');
});

$('#todoList').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.todo-item').dataset.id;
  const item = state.todos.find(t => t.id === id);
  if (!item) return;
  const act = btn.dataset.act;
  if (act === 'toggle') item.done = !item.done;
  if (act === 'star') item.star = !item.star;
  if (act === 'del') state.todos = state.todos.filter(t => t.id !== id);
  save();
  renderTodos();
  renderNote();
});

$('#todoFilters').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  todoFilter = chip.dataset.filter;
  $$('#todoFilters .chip').forEach(c => c.classList.toggle('active', c === chip));
  renderTodos();
});

/* =========================================================
   2. 일정 달력
   ========================================================= */
const now0 = new Date();
let calCursor = { y: now0.getFullYear(), m: now0.getMonth() };
let selectedDate = todayStr();

function eventsOn(dateStr) {
  return state.events.filter(e => e.date === dateStr);
}

function renderCalendar() {
  const { y, m } = calCursor;
  $('#calTitle').textContent = `${y}년 ${MONTH_NAMES[m]}`;

  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const cells = [];
  const total = Math.ceil((startDow + daysInMonth) / 7) * 7;

  for (let i = 0; i < total; i++) {
    let dNum, dateObj, other = false;
    if (i < startDow) {
      dNum = prevDays - startDow + 1 + i;
      dateObj = new Date(y, m - 1, dNum);
      other = true;
    } else if (i >= startDow + daysInMonth) {
      dNum = i - (startDow + daysInMonth) + 1;
      dateObj = new Date(y, m + 1, dNum);
      other = true;
    } else {
      dNum = i - startDow + 1;
      dateObj = new Date(y, m, dNum);
    }
    const ds = ymd(dateObj);
    const has = eventsOn(ds).length > 0;
    const isToday = ds === todayStr();
    const isSel = ds === selectedDate;
    cells.push(`<button class="cal-cell${other ? ' other' : ''}${has ? ' has' : ''}${isToday ? ' today' : ''}${isSel ? ' sel' : ''}"
      role="gridcell" data-date="${ds}" aria-label="${dateObj.getMonth() + 1}월 ${dNum}일${has ? ', 일정 있음' : ''}"
      aria-selected="${isSel}"><span class="num">${dNum}</span></button>`);
  }
  $('#calGrid').innerHTML = cells.join('');

  const list = $('#calEvents');
  const dayEvents = eventsOn(selectedDate);
  $('#calDayTitle').textContent = `${fmtDate(selectedDate)} 일정`;
  list.innerHTML = dayEvents.map(ev => `
    <li class="event-item${ev.done ? ' done' : ''}" data-id="${ev.id}">
      <button class="check${ev.done ? ' on' : ''}" data-act="toggle" aria-label="완료 체크">✓</button>
      <span class="txt">${esc(ev.text)}</span>
      <button class="del" data-act="del" aria-label="삭제">✕</button>
    </li>`).join('');
  $('#calEmpty').hidden = dayEvents.length > 0;
  $('#eventInput').placeholder = `${fmtDate(selectedDate)}에 일정 적기`;
  updateBadges();
}

$('#calPrev').addEventListener('click', () => {
  calCursor.m -= 1;
  if (calCursor.m < 0) { calCursor.m = 11; calCursor.y -= 1; }
  renderCalendar();
});
$('#calNext').addEventListener('click', () => {
  calCursor.m += 1;
  if (calCursor.m > 11) { calCursor.m = 0; calCursor.y += 1; }
  renderCalendar();
});
$('#calToday').addEventListener('click', () => {
  const t = new Date();
  calCursor = { y: t.getFullYear(), m: t.getMonth() };
  selectedDate = todayStr();
  renderCalendar();
});

$('#calGrid').addEventListener('click', (e) => {
  const cell = e.target.closest('.cal-cell');
  if (!cell) return;
  const ds = cell.dataset.date;
  const d = parseYmd(ds);
  selectedDate = ds;
  if (d.getMonth() !== calCursor.m || d.getFullYear() !== calCursor.y) {
    calCursor = { y: d.getFullYear(), m: d.getMonth() };
  }
  renderCalendar();
});

$('#calEvents').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.event-item').dataset.id;
  const item = state.events.find(ev => ev.id === id);
  if (!item) return;
  if (btn.dataset.act === 'toggle') item.done = !item.done;
  if (btn.dataset.act === 'del') state.events = state.events.filter(ev => ev.id !== id);
  save();
  renderCalendar();
  renderNote();
});

$('#eventForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#eventInput');
  const text = input.value.trim();
  if (!text) return;
  state.events.push({ id: uid(), date: selectedDate, text, done: false });
  input.value = '';
  save();
  renderCalendar();
  renderNote();
  showToast(`${fmtDate(selectedDate)}에 일정을 적었어요`);
});

/* =========================================================
   3. 사야 할 것
   ========================================================= */
function renderShopping() {
  const order = { '생활': 0, '작업': 1, '기타': 2 };
  const items = [...state.shopping].sort((a, b) =>
    (Number(a.done) - Number(b.done)) || ((order[a.cat] ?? 3) - (order[b.cat] ?? 3)) || (a.createdAt - b.createdAt));

  $('#shopList').innerHTML = items.map(s => `
    <li class="shop-item${s.done ? ' done' : ''}" data-id="${s.id}">
      <button class="check${s.done ? ' on' : ''}" data-act="toggle" aria-label="구매 완료">✓</button>
      <span class="name">${esc(s.name)}</span>
      ${s.qty ? `<span class="qty">${esc(s.qty)}</span>` : ''}
      <span class="cat-badge ${esc(s.cat)}">${esc(s.cat)}</span>
      <button class="del" data-act="del" aria-label="삭제">✕</button>
    </li>`).join('');
  $('#shopEmpty').hidden = items.length > 0;
  updateBadges();
}

$('#shopForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#shopName').value.trim();
  if (!name) return;
  state.shopping.push({
    id: uid(), name,
    qty: $('#shopQty').value.trim(),
    cat: $('#shopCat').value,
    done: false, createdAt: Date.now()
  });
  $('#shopName').value = '';
  $('#shopQty').value = '';
  save();
  renderShopping();
  showToast('바구니에 담아 두었어요');
});

$('#shopList').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.shop-item').dataset.id;
  const item = state.shopping.find(s => s.id === id);
  if (!item) return;
  if (btn.dataset.act === 'toggle') item.done = !item.done;
  if (btn.dataset.act === 'del') state.shopping = state.shopping.filter(s => s.id !== id);
  save();
  renderShopping();
});

$('#shopClearDone').addEventListener('click', () => {
  const doneCount = state.shopping.filter(s => s.done).length;
  if (!doneCount) { showToast('비울 완료 항목이 없어요'); return; }
  state.shopping = state.shopping.filter(s => !s.done);
  save();
  renderShopping();
  showToast(`완료한 ${doneCount}개를 비웠어요`);
});

/* =========================================================
   4. 아이디어 저장함
   ========================================================= */
let ideaCat = IDEA_CATS[0];
let ideaQuery = '';
let editingIdeaId = null;

function ideaMatches(idea, q) {
  if (!q) return true;
  const hay = `${idea.title} ${idea.body} ${(idea.tags || []).join(' ')}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderIdeas() {
  const items = state.ideas
    .filter(i => i.cat === ideaCat && ideaMatches(i, ideaQuery))
    .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

  $('#ideaGrid').innerHTML = items.map(i => `
    <article class="idea-card" data-id="${i.id}">
      <div class="idea-top">
        <h3>${esc(i.title)}</h3>
        <span class="idea-cat">${esc(i.cat)}</span>
      </div>
      ${i.body ? `<p class="body">${esc(i.body)}</p>` : ''}
      ${(i.tags && i.tags.length) ? `<div class="tags">${i.tags.map(t => `<span class="tag-chip">#${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="idea-actions">
        <button type="button" class="icon-mini" data-act="edit" aria-label="아이디어 고치기">${PENCIL_SVG}</button>
        <button type="button" class="icon-mini" data-act="del" aria-label="아이디어 삭제">${CROSS_SVG}</button>
      </div>
      <div class="idea-date">${new Date(i.updatedAt || i.createdAt).getMonth() + 1}월 ${new Date(i.updatedAt || i.createdAt).getDate()}일 기록</div>
    </article>`).join('');

  pagesEmpty();
  $$('#ideaTabs .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === ideaCat));
  updateBadges();
}

function pagesEmpty() {
  const has = $('#ideaGrid').children.length > 0;
  $('#ideasEmpty').hidden = has;
  if (!has) {
    $('#ideasEmpty').textContent = ideaQuery
      ? `'${ideaQuery}' 검색 결과가 없어요.`
      : '이 칸은 아직 비어 있어요. 떠오른 생각을 붙여 두세요.';
  }
}

$('#ideaTabs').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  ideaCat = chip.dataset.cat;
  renderIdeas();
});

$('#ideaSearch').addEventListener('input', (e) => {
  ideaQuery = e.target.value.trim();
  renderIdeas();
});

function openIdeaEditor(idea) {
  editingIdeaId = idea ? idea.id : null;
  $('#ideaModalTitle').textContent = idea ? '아이디어 고치기' : '아이디어 적기';
  $('#ideaCat').value = idea ? idea.cat : ideaCat;
  $('#ideaTitle').value = idea ? idea.title : '';
  $('#ideaBody').value = idea ? (idea.body || '') : '';
  $('#ideaTags').value = idea ? (idea.tags || []).join(', ') : '';
  openModal($('#ideaModal'));
  setTimeout(() => $('#ideaTitle').focus(), 40);
}

$('#ideaAddBtn').addEventListener('click', () => openIdeaEditor(null));

$('#ideaGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.idea-card').dataset.id;
  const idea = state.ideas.find(i => i.id === id);
  if (!idea) return;
  if (btn.dataset.act === 'edit') openIdeaEditor(idea);
  if (btn.dataset.act === 'del') {
    state.ideas = state.ideas.filter(i => i.id !== id);
    save();
    renderIdeas();
    showToast('아이디어를 지웠어요');
  }
});

$('#ideaForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#ideaTitle').value.trim();
  if (!title) return;
  const payload = {
    cat: $('#ideaCat').value,
    title,
    body: $('#ideaBody').value.trim(),
    tags: $('#ideaTags').value.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
    updatedAt: Date.now()
  };
  if (editingIdeaId) {
    const idea = state.ideas.find(i => i.id === editingIdeaId);
    if (idea) Object.assign(idea, payload);
  } else {
    state.ideas.push(Object.assign({ id: uid(), createdAt: Date.now() }, payload));
  }
  ideaCat = payload.cat;
  save();
  closeModal($('#ideaModal'));
  renderIdeas();
  showToast(editingIdeaId ? '아이디어를 고쳤어요' : '아이디어를 붙여 두었어요');
  editingIdeaId = null;
});

/* =========================================================
   5. 영상 아이디어 링크 피드
   ========================================================= */
let videoFilter = 'all';
let editingVideoId = null;
let pendingThumb = '';
let editingThumb = '';

function youtubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/(shorts|embed|live|v)\/([\w-]{6,})/);
      if (m) return m[2];
    }
  } catch (e) { /* invalid URL */ }
  return null;
}

function detectPlatform(url) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return 'other'; }
  if (youtubeId(url) || host.includes('youtube')) return 'youtube';
  if (host.includes('instagram')) return 'instagram';
  return 'other';
}

function platformLabel(p) {
  return p === 'youtube' ? 'YouTube' : p === 'instagram' ? 'Instagram' : 'LINK';
}

function thumbFor(video) {
  if (video.thumb) return video.thumb;
  const yid = youtubeId(video.url);
  if (yid) return `https://img.youtube.com/vi/${yid}/hqdefault.jpg`;
  return '';
}

function normalizeUrl(raw) {
  const s = raw.trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
}

function renderVideos() {
  const items = [...state.videos]
    .filter(v => {
      if (videoFilter === 'all') return true;
      const p = v.platform || detectPlatform(v.url);
      if (videoFilter === 'other') return p !== 'youtube' && p !== 'instagram';
      return p === videoFilter;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  $('#videoFeed').innerHTML = items.map(v => {
    const plat = v.platform || detectPlatform(v.url);
    const thumb = thumbFor(v);
    return `
    <article class="video-card" data-id="${v.id}" tabindex="0" role="link" aria-label="${esc(v.title || hostOf(v.url))} 링크 열기">
      <div class="video-thumb">
        <div class="ph">${plat === 'youtube' ? '▶' : plat === 'instagram' ? '◎' : '▤'}</div>
        ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}
        <span class="plat-badge ${plat}">${platformLabel(plat)}</span>
        <span class="play-dot">▶</span>
      </div>
      <div class="video-body">
        <h3>${esc(v.title || hostOf(v.url) || '링크')}</h3>
        ${v.memo ? `<p class="memo">${esc(v.memo)}</p>` : ''}
        ${(v.tags && v.tags.length) ? `<div class="tags">${v.tags.map(t => `<span class="tag-chip">#${esc(t)}</span>`).join('')}</div>` : ''}
        <span class="host">${esc(hostOf(v.url))}</span>
        <div class="video-actions">
          <button type="button" class="icon-mini" data-act="edit" aria-label="링크 고치기">${PENCIL_SVG}</button>
          <button type="button" class="icon-mini" data-act="del" aria-label="링크 삭제">${CROSS_SVG}</button>
        </div>
      </div>
    </article>`;
  }).join('');

  $('#videosEmpty').hidden = items.length > 0;
  $('#videoCount').textContent = `${items.length}개`;
  updateBadges();

  // 썸네일이 없거나 깨지면 픽셀 플레이스홀더가 보이도록
  $$('#videoFeed img').forEach(img => {
    img.addEventListener('error', () => img.remove(), { once: true });
  });
}

$('#videoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = normalizeUrl($('#videoUrl').value);
  if (!url) return;
  const plat = detectPlatform(url);
  const customThumbUrl = normalizeUrl($('#videoThumbUrl').value.trim());
  state.videos.push({
    id: uid(),
    url,
    title: $('#videoTitle').value.trim(),
    memo: $('#videoMemo').value.trim(),
    tags: $('#videoTags').value.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
    thumb: pendingThumb || (/^https?:\/\//i.test(customThumbUrl) ? customThumbUrl : ''),
    platform: plat,
    createdAt: Date.now()
  });
  $('#videoForm').reset();
  pendingThumb = '';
  $('#videoAutoThumb').hidden = true;
  $('#videoAutoThumb').textContent = '';
  save();
  renderVideos();
  showToast(plat === 'youtube' ? '유튜브 링크를 담았어요 — 썸네일이 자동으로 붙었어요' : '링크를 담았어요');
});

function updateThumbPreview() {
  const box = $('#videoAutoThumb');
  const yid = youtubeId($('#videoUrl').value);
  const custom = pendingThumb || normalizeUrl($('#videoThumbUrl').value.trim());
  let src = '';
  let label = '';
  if (custom) {
    src = custom;
    label = pendingThumb ? '올린 이미지가 카드 썸네일로 붙어요' : '이 이미지가 카드 썸네일로 붙어요';
  } else if (yid) {
    src = `https://img.youtube.com/vi/${yid}/mqdefault.jpg`;
    label = '유튜브 썸네일이 자동으로 붙어요';
  }
  if (!src) {
    box.hidden = true;
    box.textContent = '';
    return;
  }
  box.hidden = false;
  box.innerHTML = `<img src="${esc(src)}" alt="썸네일 미리보기"> ${esc(label)}`;
  const img = box.querySelector('img');
  if (img) img.addEventListener('error', () => { box.hidden = true; }, { once: true });
}

$('#videoUrl').addEventListener('input', updateThumbPreview);
$('#videoThumbUrl').addEventListener('input', () => { pendingThumb = ''; updateThumbPreview(); });

$('#videoThumbFile').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    pendingThumb = await compressImage(file, 640, 0.72);
    updateThumbPreview();
    showToast('썸네일 이미지를 준비했어요');
  } catch (err) {
    console.warn(err);
    showToast('이미지를 읽지 못했어요');
  }
  e.target.value = '';
});

$('#videoFilters').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  videoFilter = chip.dataset.plat;
  $$('#videoFilters .chip').forEach(c => c.classList.toggle('active', c === chip));
  renderVideos();
});

$('#videoFeed').addEventListener('click', (e) => {
  const actEl = e.target.closest('button[data-act]');
  const card = e.target.closest('.video-card');
  if (!card) return;
  const video = state.videos.find(v => v.id === card.dataset.id);
  if (!video) return;

  if (actEl) {
    e.stopPropagation();
    const act = actEl.dataset.act;
    if (act === 'del') {
      state.videos = state.videos.filter(v => v.id !== video.id);
      save();
      renderVideos();
      showToast('링크를 지웠어요');
    } else if (act === 'edit') {
      editingVideoId = video.id;
      $('#editUrl').value = video.url;
      $('#editTitle').value = video.title || '';
      $('#editMemo').value = video.memo || '';
      $('#editTags').value = (video.tags || []).join(', ');
      editingThumb = video.thumb && video.thumb.startsWith('data:') ? video.thumb : '';
      $('#editThumb').value = video.thumb && !video.thumb.startsWith('data:') ? video.thumb : '';
      openModal($('#videoModal'));
    }
    return;
  }
  window.open(video.url, '_blank', 'noopener');
});

$('#videoFeed').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const actEl = e.target.closest('button[data-act]');
  if (actEl) { e.preventDefault(); actEl.click(); return; }
  const card = e.target.closest('.video-card');
  if (card && e.target === card) {
    e.preventDefault();
    const video = state.videos.find(v => v.id === card.dataset.id);
    if (video) window.open(video.url, '_blank', 'noopener');
  }
});

$('#editThumb').addEventListener('input', () => { editingThumb = ''; });

$('#editThumbFile').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    editingThumb = await compressImage(file, 640, 0.72);
    showToast('새 썸네일을 준비했어요 — 저장을 눌러 주세요');
  } catch (err) {
    console.warn(err);
    showToast('이미지를 읽지 못했어요');
  }
  e.target.value = '';
});

$('#videoEditForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const video = state.videos.find(v => v.id === editingVideoId);
  if (!video) { closeModal($('#videoModal')); return; }
  video.url = normalizeUrl($('#editUrl').value);
  video.title = $('#editTitle').value.trim();
  video.memo = $('#editMemo').value.trim();
  video.tags = $('#editTags').value.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
  const t = $('#editThumb').value.trim();
  video.thumb = editingThumb || (t ? normalizeUrl(t) : '');
  video.platform = detectPlatform(video.url);
  save();
  closeModal($('#videoModal'));
  renderVideos();
  showToast('링크를 고쳤어요');
});

/* 썸네일 이미지 파일 → DataURL 압축 */
function compressImage(file, maxW = 640, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const c = cv.getContext('2d');
        c.drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* =========================================================
   6. 바로가기 (블로그 · 워드프레스 · 메일)
   ========================================================= */
let editingLinkId = null;

function renderLinks() {
  const list = $('#linkList');
  list.innerHTML = state.links.map(l => {
    const host = hostOf(l.url) || l.url;
    return `
    <li class="link-item" data-id="${l.id}">
      <span class="link-icon ${esc(l.icon || 'other')}" aria-hidden="true">${esc(l.glyph || (l.name || '?').trim().slice(0, 1))}</span>
      <span class="link-text">
        <b>${esc(l.name)}</b>
        <span class="link-host">${esc(host)}</span>
      </span>
      <span class="link-actions">
        <button type="button" class="pix-btn accent tiny" data-act="open" aria-label="${esc(l.name)} 열기">열기</button>
        <button type="button" class="icon-mini" data-act="edit" aria-label="${esc(l.name)} 주소 수정">${PENCIL_SVG}</button>
      </span>
    </li>`;
  }).join('');
}

$('#linkList').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.link-item').dataset.id;
  const link = state.links.find(l => l.id === id);
  if (!link) return;
  if (btn.dataset.act === 'open') {
    window.open(link.url, '_blank', 'noopener');
  } else if (btn.dataset.act === 'edit') {
    editingLinkId = id;
    $('#linkName').value = link.name || '';
    $('#linkUrl').value = link.url || '';
    openModal($('#linkModal'));
    setTimeout(() => $('#linkName').focus(), 40);
  }
});

$('#linkForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const link = state.links.find(l => l.id === editingLinkId);
  if (!link) { closeModal($('#linkModal')); return; }
  const name = $('#linkName').value.trim();
  const url = normalizeUrl($('#linkUrl').value);
  if (!name || !url) return;
  link.name = name;
  link.url = url;
  save();
  closeModal($('#linkModal'));
  renderLinks();
  showToast('SNS 주소를 고쳤어요');
  editingLinkId = null;
});

/* =========================================================
   설정 · 백업
   ========================================================= */
$('#btnSettings').addEventListener('click', () => {
  updateBadges();
  openModal($('#settingsModal'));
});

$('#btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `walnut-library-${todayStr().replace(/-/g, '')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  showToast('백업 파일을 내보냈어요');
});

$('#btnImport').addEventListener('click', () => $('#importFile').click());

$('#importFile').addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object') throw new Error('형식이 달라요');
      const keys = ['todos', 'events', 'shopping', 'ideas', 'videos', 'links'];
      if (!keys.some(k => Array.isArray(data[k]))) throw new Error('서재 백업이 아니에요');
      if (!window.confirm('지금 서재 기록을 이 백업 파일로 바꿀까요?\n지금 기록은 사라지고 파일 내용으로 채워져요.')) return;
      const next = emptyState();
      for (const k of keys) {
        if (Array.isArray(data[k])) next[k] = data[k];
      }
      state = next;
      save();
      renderAll();
      closeModal($('#settingsModal'));
      showToast('백업을 불러왔어요');
    } catch (err) {
      console.warn(err);
      showToast('이 파일은 서재 백업 형식이 아니에요');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

$('#btnReset').addEventListener('click', () => {
  if (!window.confirm('서재의 모든 기록을 지울까요? 되돌릴 수 없어요. (백업 파일이 있으면 나중에 복원할 수 있어요)')) return;
  state = emptyState();
  save();
  renderAll();
  closeModal($('#settingsModal'));
  showToast('서재를 비웠어요');
});

/* =========================================================
   오늘의 서재 카드
   ========================================================= */
function renderNote() {
  const t = todayStr();
  $('#todayLabel').textContent = fmtDate(t);
  $('#noteDate').textContent = fmtDate(t);
  const evs = eventsOn(t);
  const list = $('#noteEvents');
  if (evs.length === 0) {
    list.innerHTML = '<li class="none">오늘은 적어 둔 일정이 없어요.</li>';
  } else {
    list.innerHTML = evs.slice(0, 4).map(e => `<li class="${e.done ? 'done' : ''}">${esc(e.text)}</li>`).join('');
  }
}

/* =========================================================
   픽셀 방 (room.js)
   ========================================================= */
const room = window.WalnutRoom.create(document.getElementById('room'));

document.addEventListener('visibilitychange', () => {
  if (document.hidden) room.pause();
  else if (currentView === 'room') room.start();
});

/* =========================================================
   곰인형 대화
   ========================================================= */
const bearLines = {
  chair: [
    '오늘도 파이팅! 🧸',
    '여기 앉아서 잠깐 쉬어 가~',
    '하나만 해도 오늘 잘한 거야!',
    '물 한 잔 마시는 거 잊지 마!'
  ],
  shelf: [
    '서재 지킴이 곰이에요!',
    '책장 위에서 다 보고 있어요 👀',
    '오늘 기분은 어때요?'
  ],
  rug: [
    '쿨쿨... 러그가 제일 좋아요',
    '같이 낮잠 잘래요?',
    '바닥이 따뜻해요 🌰'
  ]
};
const bearIndex = { chair: 0, shelf: 0, rug: 0 };
let bubbleTimer = null;

function speakBear(name, anchor) {
  const lines = bearLines[name];
  const text = lines[bearIndex[name] % lines.length];
  bearIndex[name] += 1;
  const bubble = $('#bubble');
  bubble.textContent = text;
  const atRight = anchor.left > 72;
  bubble.classList.toggle('at-right', atRight);
  if (atRight) {
    bubble.style.left = 'auto';
    bubble.style.right = '2%';
  } else {
    bubble.style.left = anchor.left + '%';
    bubble.style.right = 'auto';
  }
  bubble.style.top = anchor.top + '%';
  bubble.classList.add('show');
  room.hopBear(name);
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2600);
}

$('#bearChair').addEventListener('click', () => speakBear('chair', { left: 78, top: 49 }));
$('#bearShelf').addEventListener('click', () => speakBear('shelf', { left: 94, top: 13 }));
$('#bearRug').addEventListener('click', () => speakBear('rug', { left: 57, top: 82 }));

/* =========================================================
   초기화
   ========================================================= */
function renderAll() {
  renderTodos();
  renderCalendar();
  renderShopping();
  renderIdeas();
  renderVideos();
  renderLinks();
  renderNote();
  updateBadges();
}

renderAll();
openView('room');
room.start();

// 서비스 워커
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW 등록 실패', err));
  });
}
