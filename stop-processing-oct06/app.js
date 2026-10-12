/* ============================================================
   MS 2.0 — Change Order Use Case 1  (standalone prototype)
   Scene router + all screens. Drill-down = go a level down.
   ============================================================ */

/* ---------- tiny helpers ---------- */
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

/* ============================================================
   ICONS — real IDS/Figma assets from the Create-Change-Order
   design system (public/figma/*.svg). Rendered exactly like the
   product's Icon.tsx: a fixed square box with the vector inset by
   Figma's per-icon [top,right,bottom,left] percentages. Each state
   variant is its OWN file (fills are baked, not currentColor) —
   e.g. icon-home vs icon-home-selected, icon-eye vs icon-eye-blue.
   ============================================================ */
const ICONS = {
  home:{src:'icon-home.svg',inset:[8.41,8.24,8.29,8.43]},
  homeSelected:{src:'icon-home-selected.svg',inset:[8.41,8.24,8.29,8.43]},
  clipboard:{src:'icon-clipboard.svg',inset:[8.33,16.67,8.33,16.67]},
  clipboardSelected:{src:'icon-clipboard-selected.svg',inset:[8.33,16.67,8.33,16.67]},
  refresh:{src:'icon-refresh.svg',inset:[12.5,12.45,12.5,12.47]},
  refreshSelected:{src:'icon-refresh-selected.svg',inset:[12.5,12.45,12.5,12.47]},
  gridTile:{src:'icon-grid-tile.svg',inset:[8.33,8.33,8.33,8.33]},
  thumbnail:{src:'icon-thumbnail.svg',inset:[8.33,8.33,8.33,8.33]},
  chartBar:{src:'icon-chart-bar.svg',inset:[8.33,8.33,8.33,8.33]},
  personThree:{src:'icon-person-three.svg',inset:[8.33,4.35,8.33,4.35]},
  commentPencil:{src:'icon-comment-pencil.svg',inset:[8.33,8.33,8.33,8.33]},
  circleQuestion:{src:'icon-circle-question.svg',inset:[8.33,8.33,8.33,8.33]},
  megaphone:{src:'icon-megaphone.svg',inset:[12.5,16.67,12.5,16.67]},
  image:{src:'icon-image.svg',inset:[8.34,8.31,8.33,8.35]},
  beaker:{src:'icon-beaker.svg',inset:[8.33,18.2,8.33,18.21]},
  percent:{src:'icon-percent.svg',inset:[12.5,12.5,12.5,12.5]},
  people:{src:'icon-people.svg',inset:[8.32,8.33,8.33,8.33]},
  note:{src:'icon-note.svg',inset:[12.5,12.5,12.5,12.5]},
  comment:{src:'icon-comment.svg',inset:[8.78,8.33,7.89,8.33]},
  help:{src:'icon-help.svg',inset:[8.33,8.33,8.33,8.3]},
  bell:{src:'icon-bell.svg',inset:[4.17,14.51,4.17,14.45]},
  sort:{src:'icon-sort.svg',inset:[25,33.33,25,33.33]},
  plus:{src:'icon-plus.svg',inset:[16.75,16.74,16.58,16.6]},
  arrowUp:{src:'icon-arrow-up.svg',inset:[16.75,16.34,16.6,16.5]},
  arrowLeft:{src:'icon-arrow-left.svg',inset:[16.5,16.6,16.22,16.75]},
  edit:{src:'icon-edit.svg',inset:[9.3,9.23,9.32,9.21]},
  menuCollapse:{src:'icon-menu-collapse.svg',inset:[24.97,12.5,24.97,12.5]},
  menuExpand:{src:'icon-menu-expand.svg',inset:[24.94,12.52,25,12.47]},
  attach:{src:'icon-attach.svg',inset:[8.33,29.17,8.33,25]},
  send:{src:'icon-send.svg',inset:[12.71,13.07,12.71,15.57]},
  search:{src:'icon-search.svg',inset:[7.83,8.35,8.27,7.94]},
  sliders:{src:'icon-sliders.svg',inset:[12.53,8.19,12.39,8.44]},
  sortAsc:{src:'icon-sort-asc.svg',inset:[25,12.8,24.95,12.5]},
  info:{src:'icon-info.svg',inset:[8.33,8.27,8.33,8.33]},
  chevronDown:{src:'icon-chevron-down.svg',inset:[33.36,20.74,33.26,20.92]},
  sortTable:{src:'icon-sort-table.svg',inset:[25,33.33,25,33.33]},
  check:{src:'icon-check.svg',inset:[0,0,0,0]},
  circleX:{src:'icon-circle-x.svg',inset:[0,0,0,0]},
  eye:{src:'icon-eye.svg',inset:[0,0,0,0]},
  eyeBlue:{src:'icon-eye-blue.svg',inset:[0,0,0,0]},
  close:{src:'icon-close.svg',inset:[20.63,20.67,20.81,20.81]},
  history:{src:'icon-history.svg',inset:[12.5,8.34,12.5,8.38]},
  approvals:{src:'icon-approvals.svg',inset:[8.33,8.33,8.33,8.33]},
  conversation:{src:'icon-conversation.svg',inset:[8.33,8.33,8.33,8.33]},
};
// render an icon exactly like Icon.tsx (inset-positioned <img> in a square box)
function icon(name,size=20){
  const d=ICONS[name]; if(!d) return '';
  const [t,r,b,l]=d.inset;
  return `<span class="ico-box" style="width:${size}px;height:${size}px" aria-hidden="true"><span style="position:absolute;top:${t}%;right:${r}%;bottom:${b}%;left:${l}%"><img src="figma/${d.src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block"></span></span>`;
}

/* Back-compat alias map so existing `${I.xxx}` call sites keep working,
   now backed by the real DS assets. Each entry renders at its call-site size. */
const I = {
  get home(){return icon('home',22)}, get homeSelected(){return icon('homeSelected',22)},
  get mega(){return icon('megaphone',20)}, get image(){return icon('image',20)},
  get flask(){return icon('beaker',20)}, get percent(){return icon('percent',20)},
  get people(){return icon('people',20)}, get note(){return icon('note',20)},
  get edit(){return icon('edit',20)}, get help(){return icon('help',20)},
  get bell(){return icon('bell',22)}, get editpencil(){return icon('edit',16)},
  get chat(){return icon('conversation',20)}, get clock(){return icon('history',20)},
  get list(){return icon('sortTable',20)}, get search(){return icon('search',18)},
  get eye(){return icon('eye',18)}, get eyeBlue(){return icon('eyeBlue',18)},
  get chev(){return icon('chevronDown',18)},
  // chevron-down rotated: rot-90 = -90° → points RIGHT; rot-270 = +90° → points LEFT
  get chevR(){return `<span class="rot-90">${icon('chevronDown',18)}</span>`},
  get chevL(){return `<span class="rot-270">${icon('chevronDown',18)}</span>`},
  get back(){return icon('arrowLeft',16)}, get check(){return icon('check',14)},
  get plus(){return icon('plus',18)}, get sendUp(){return icon('arrowUp',18)},
  get send(){return icon('send',20)}, get clip(){return icon('attach',20)},
  get sliders(){return icon('sliders',18)}, get sort(){return icon('sort',18)},
  // toolbar sort icon (lines + down arrow) — Figma-provided
  sortLines:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.33333 4.00933L2.66667 4C2.48986 4 2.32029 4.07024 2.19526 4.19526C2.07024 4.32029 2 4.48986 2 4.66667C2 4.84348 2.07024 5.01305 2.19526 5.13807C2.32029 5.2631 2.48986 5.33333 2.66667 5.33333L9.33333 5.34267C9.51014 5.34267 9.67971 5.27243 9.80474 5.1474C9.92976 5.02238 10 4.85281 10 4.676C10 4.49919 9.92976 4.32962 9.80474 4.2046C9.67971 4.07957 9.51014 4.00933 9.33333 4.00933Z" fill="#5A6870"/><path d="M8.00667 7.338L2.67333 7.32867C2.49652 7.32867 2.32695 7.3989 2.20193 7.52393C2.0769 7.64895 2.00667 7.81852 2.00667 7.99533C2.00667 8.17214 2.0769 8.34171 2.20193 8.46674C2.32695 8.59176 2.49652 8.662 2.67333 8.662L8.00667 8.67133C8.18348 8.67133 8.35305 8.6011 8.47807 8.47607C8.6031 8.35105 8.67333 8.18148 8.67333 8.00467C8.67333 7.82786 8.6031 7.65829 8.47807 7.53326C8.35305 7.40824 8.18348 7.338 8.00667 7.338Z" fill="#5A6870"/><path d="M6.66667 10.6713L2.66667 10.662C2.48986 10.662 2.32029 10.7322 2.19526 10.8573C2.07024 10.9823 2 11.1519 2 11.3287C2 11.5055 2.07024 11.675 2.19526 11.8001C2.32029 11.9251 2.48986 11.9953 2.66667 11.9953L6.66667 12.0047C6.84348 12.0047 7.01305 11.9344 7.13807 11.8094C7.26309 11.6844 7.33333 11.5148 7.33333 11.338C7.33333 11.1612 7.26309 10.9916 7.13807 10.8666C7.01305 10.7416 6.84348 10.6713 6.66667 10.6713Z" fill="#5A6870"/><path d="M13.7553 9.52667C13.6298 9.40221 13.4599 9.33272 13.2832 9.33347C13.1064 9.33422 12.9372 9.40515 12.8127 9.53067L12.6127 9.73067L12.626 4.66667C12.626 4.48986 12.5558 4.32029 12.4307 4.19526C12.3057 4.07024 12.1361 4 11.9593 4C11.7825 4 11.613 4.07024 11.4879 4.19526C11.3629 4.32029 11.2927 4.48986 11.2927 4.66667L11.282 9.73333L11.0887 9.54133C10.9624 9.42032 10.7937 9.35375 10.6189 9.35596C10.444 9.35818 10.277 9.429 10.1539 9.55318C10.0308 9.67735 9.96138 9.84492 9.96065 10.0198C9.95992 10.1947 10.0279 10.3628 10.15 10.488L11.4887 11.8153C11.6142 11.9398 11.7841 12.0093 11.9608 12.0085C12.1376 12.0078 12.3068 11.9368 12.4313 11.8113L13.7593 10.4667C13.883 10.3412 13.9519 10.172 13.9512 9.99584C13.9504 9.81972 13.88 9.65105 13.7553 9.52667Z" fill="#5A6870"/></svg>`,
  get sortsm(){return icon('sortTable',14)}, get info(){return icon('info',13)},
  get target(){return icon('approvals',16)}, get dl(){return icon('sortAsc',15)},
  get keep(){return icon('check',15)}, get minus(){return icon('circleX',15)},
  // stop icon (circle with rounded square) — shown on the active/running step
  stop:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.99984 1.66699C8.35166 1.66699 6.7405 2.15573 5.37009 3.07141C3.99968 3.98709 2.93158 5.28858 2.30084 6.8113C1.67011 8.33401 1.50509 10.0096 1.82663 11.6261C2.14817 13.2426 2.94185 14.7274 4.10728 15.8929C5.27272 17.0583 6.75758 17.852 8.37409 18.1735C9.9906 18.4951 11.6662 18.3301 13.1889 17.6993C14.7116 17.0686 16.0131 16.0005 16.9288 14.6301C17.8444 13.2597 18.3332 11.6485 18.3332 10.0003C18.3307 7.79093 17.452 5.67273 15.8897 4.11045C14.3274 2.54817 12.2092 1.66942 9.99984 1.66699ZM9.99984 16.667C8.6813 16.667 7.39237 16.276 6.29604 15.5435C5.19971 14.8109 4.34523 13.7697 3.84064 12.5515C3.33606 11.3334 3.20404 9.99293 3.46127 8.69972C3.71851 7.40652 4.35345 6.21863 5.2858 5.28628C6.21815 4.35393 7.40603 3.71899 8.69924 3.46176C9.99245 3.20452 11.3329 3.33654 12.5511 3.84113C13.7692 4.34571 14.8104 5.2002 15.543 6.29652C16.2755 7.39285 16.6665 8.68178 16.6665 10.0003C16.6645 11.7678 15.9615 13.4624 14.7117 14.7122C13.4619 15.962 11.7673 16.665 9.99984 16.667Z" fill="#6B6C72"/><path d="M6.66651 7.50033C6.66651 7.04009 7.0396 6.66699 7.49984 6.66699H12.4998C12.9601 6.66699 13.3332 7.04009 13.3332 7.50033V12.5003C13.3332 12.9606 12.9601 13.3337 12.4998 13.3337H7.49984C7.0396 13.3337 6.66651 12.9606 6.66651 12.5003V7.50033Z" fill="#6B6C72"/></svg>`,
  checkSm:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 12l4 4L19 6"/></svg>`,
  // bare stroked tick (Figma checkmark 235:6652) — inherits currentColor so state CSS drives the color
  tick:`<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.3 8.3l2.9 2.9 6.5-6.5"/></svg>`,
  // tree node-type tiles (white glyph on colored tile) — kept as small inline SVGs
  seg:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="M8 11v2a3 3 0 0 0 3 3h2"/></svg>`,
  tileFlask:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/></svg>`,
  tilePct:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/></svg>`,
  tileGrid:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg>`,
  tileMega:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2718 2.62386C16.1508 2.54959 16.013 2.50727 15.8711 2.50086C15.7293 2.49444 15.5882 2.52415 15.461 2.58719L10.636 4.99969H5.8335C5.17045 4.99969 4.53457 5.26309 4.06573 5.73193C3.59689 6.20077 3.3335 6.83665 3.3335 7.49969V10.833C3.3335 11.4961 3.59689 12.132 4.06573 12.6008C4.53457 13.0696 5.17045 13.333 5.8335 13.333H6.93516L8.39266 16.9764C8.43337 17.078 8.49371 17.1707 8.57022 17.249C8.64674 17.3274 8.73794 17.3899 8.83861 17.433C8.93929 17.4761 9.04747 17.4989 9.15697 17.5002C9.26648 17.5015 9.37516 17.4812 9.47683 17.4405C9.57849 17.3998 9.67115 17.3395 9.74949 17.263C9.82784 17.1864 9.89035 17.0952 9.93345 16.9946C9.97655 16.8939 9.9994 16.7857 10.0007 16.6762C10.002 16.5667 9.98171 16.458 9.941 16.3564L8.731 13.333H10.636L15.461 15.7455C15.5881 15.809 15.7293 15.839 15.8712 15.8326C16.0131 15.8261 16.151 15.7835 16.2719 15.7088C16.3927 15.6341 16.4924 15.5297 16.5615 15.4056C16.6306 15.2815 16.6669 15.1418 16.6668 14.9997V3.33303C16.6669 3.19095 16.6307 3.05122 16.5615 2.9271C16.4924 2.80298 16.3927 2.69859 16.2718 2.62386V2.62386ZM5.00016 10.833V7.49969C5.00016 7.27868 5.08796 7.06672 5.24424 6.91044C5.40052 6.75416 5.61248 6.66636 5.8335 6.66636H10.0002V11.6664H5.8335C5.61248 11.6664 5.40052 11.5786 5.24424 11.4223C5.08796 11.266 5.00016 11.054 5.00016 10.833ZM15.0002 13.6514L11.6668 11.9847V6.34803L15.0002 4.68136V13.6514Z" fill="white"/></svg>`,
  tag:`<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4 13 11 6a2 2 0 0 1 1.4-.6H18a2 2 0 0 1 2 2v5.6a2 2 0 0 1-.6 1.4l-7 7a2 2 0 0 1-2.8 0l-5.6-5.6a2 2 0 0 1 0-2.8Z" fill="#3d8b40"/><circle cx="15.5" cy="8.5" r="1.6" fill="#fff"/></svg>`,
  avatar:`figma/avatar.png`,
};

/* ---------- shared chrome — left nav (Figma nodes 2875-25673 collapsed /
   3224-25988 expanded). Change-order (refresh) intentionally omitted. ---------- */
const RAIL_MAIN = [
  {id:'home',icon:'home',sel:'homeSelected',label:'Home'},
  {id:'projects',icon:'gridTile',label:'Projects'},
  {id:'insights',icon:'chartBar',label:'Insights'},
];
const RAIL_SECONDARY = [
  {icon:'megaphone',label:'Campaigns'},{icon:'image',label:'Creatives'},
  {icon:'beaker',label:'Experiments'},{icon:'percent',label:'Promotions'},
  {icon:'personThree',label:'Audiences'},{icon:'note',label:'Experiences'},
];
const RAIL_FOOTER = [{icon:'commentPencil',label:'Feedback'},{icon:'circleQuestion',label:'Support'}];
let navExpanded = false;

function renderRail(){
  const rail = $('#rail');
  rail.classList.toggle('rail--expanded', navExpanded);
  rail.innerHTML = '';
  // logo header (+ collapse toggle when expanded / logo mark toggles when collapsed)
  if(navExpanded){
    rail.appendChild(el(`<div class="rail__logo rail__logo--x">
      <img src="figma/logo-mark.svg" alt="" style="width:30px;height:auto">
      <img src="figma/logo-wordmark.svg" alt="Marketing Studio" style="height:20px;margin-left:6px">
      <button class="rail__collapse" id="navToggle" aria-label="Collapse menu">${icon('menuCollapse',20)}</button>
    </div>`));
  } else {
    // collapsed: M logo by default; swaps to the expand icon on hover (July-31 LeftNav)
    rail.appendChild(el(`<button class="rail__logo rail__logoBtn" id="navToggle" aria-label="Expand menu">
      <img class="rail__logoMark" src="figma/logo-mark.svg" alt="Marketing Studio" style="width:30px;height:auto;display:block">
      <span class="rail__logoExpand">${icon('menuExpand',20)}</span>
    </button>`));
  }
  const item=(it,i,grp)=>{
    const sel = grp==='main' && i===0;   // Home active throughout this flow
    const ic = icon(sel&&it.sel?it.sel:it.icon,20);
    return el(`<button class="navItem ${sel?'navItem--selected':''}"><span class="navItem__icon">${ic}</span>${navExpanded?`<span class="navItem__label">${it.label}</span>`:''}</button>`);
  };
  const grpMain=el(`<div class="rail__group"></div>`);
  RAIL_MAIN.forEach((it,i)=>grpMain.appendChild(item(it,i,'main')));
  rail.appendChild(grpMain);
  rail.appendChild(el(`<div class="rail__divider"></div>`));
  const grpSec=el(`<div class="rail__group"></div>`);
  RAIL_SECONDARY.forEach((it,i)=>grpSec.appendChild(item(it,i,'sec')));
  rail.appendChild(grpSec);
  rail.appendChild(el(`<div class="rail__spacer"></div>`));
  const grpFoot=el(`<div class="rail__group"></div>`);
  RAIL_FOOTER.forEach((it,i)=>grpFoot.appendChild(item(it,i,'foot')));
  rail.appendChild(grpFoot);
  // avatar row — pink/white avatar + name (kept per request)
  rail.appendChild(el(`<div class="navItem navItem--avatar"><img class="rail__avatar" src="figma/avatar.png" alt="">${navExpanded?`<span class="navItem__label">Raashi Lathiya</span>`:''}</div>`));
  // toggle wiring
  const t=$('#navToggle'); if(t) t.onclick=()=>{ navExpanded=!navExpanded; renderRail(); };
}

function topbar(crumbHTML){
  // the edit (rename) pencil belongs to project crumbs; plain Home has none
  const isHome = crumbHTML === '<span>Home</span>';
  return `<div class="topbar">
    <div class="crumb">${crumbHTML}${isHome?'':`<span class="edit">${I.editpencil}</span>`}</div>
    <div class="topbar__spacer"></div>
    <span class="bell">${I.bell}</span>
  </div>`;
}

/* AI panel scaffold. opts: {step, stepLoading, body, composer='Ask Marketing Agent', draft}
   stepLoading=true → the step marker shows the II spinner; else the green check. */
function aiPanel(opts){
  /* A STOPPED TASK IS NOT A DONE TASK — the tracker keeps naming it, but
     its marker must not become the green check, or the flow reads as
     having finished what it was interrupted in the middle of. */
  /* AN INTERRUPTED TRACKER ROW CARRIES THE ATTENTION DOT AND A RESUME
     CONTROL (user, 2026-10-07, with the reference). It used to show the
     stop glyph on both sides, which said "stoppable" about a row that had
     already stopped — the left marker is the same amber dot the stop
     message uses, and the right control becomes PLAY, because resuming is
     the only thing left to do from here. */
  const marker = opts.stepStopped
    ? `<span class="chk chk--stopped">${ATTENTION_ICON}</span>`
    : opts.stepLoading
    ? `<span class="chk chk--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
    : `<span class="chk">${I.checkSm}</span>`;
  const trailing = opts.stepStopped ? PLAY_ICON : I.stop;
  const step = opts.step ? `<div class="ai__step">
      ${marker}
      <span class="cv">${opts.step} <span class="dot dot--chev">${I.chev}</span></span>
      <span class="dot">${trailing}</span>
    </div>` : '';
  const draft = opts.draft || '';
  const filled = draft ? ' promptBox__input--filled' : '';
  return `<aside class="ai${opts.opening?' ai--opening':''}">
    <div class="ai__tabs">
      <button class="ai__tab active">${I.chat}</button>
      <button class="ai__tab">${I.clock}</button>
      <button class="ai__tab">${icon('approvals',20)}</button>
    </div>
    ${step}
    <div class="ai__body">${opts.body}</div>
    ${opts.composerHTML ? `<div class="ai__composer">${opts.composerHTML}</div>` : `<div class="ai__composer">
      <div class="promptBox">
        <div class="promptBox__content">
          <div class="promptBox__input" id="composerInput" data-ph="Ask Marketing Agent"><span class="promptBox__ph">Ask Marketing Agent</span></div>
          <div class="promptBox__actions">
            <button class="promptBox__ctrl">${icon('attach',20)}</button>
            <button class="promptBox__send">${icon('send',20)}</button>
          </div>
        </div>
      </div>
    </div>`}
  </aside>`;
}

/* ---------- conversation-widget builders (real DS markup) ---------- */
const userBubble = (text,time='20:33 pm')=>`<div class="chatMsgGroup chatMsgGroup--user">
  <div class="chatBubble chatBubble--user">${text}</div>
  <span class="chatTime">${time}</span></div>`;
const agentMsg = (inner,time='20:33 pm')=>`<div class="chatMsgGroup">${inner}${time?`<span class="chatTime">${time}</span>`:''}</div>`;
const bubble = (html)=>`<div class="chatBubble">${html}</div>`;
const disclosure = (label,steps=[])=>`<div class="chatStatusBlock">
    <button class="chatStatus" data-disclosure><span>${label}</span><span class="chatStatus__chev">${I.chev}</span></button>
    <ul class="chatStatus__steps agentTasks__list--settled" style="display:none">${steps.map(s=>`<li class="agentTask agentTask--done"><span class="agentTask__check">${I.tick}</span><span class="agentTask__label">${s}</span></li>`).join('')}</ul>
  </div>`;
const objectCard = (ic,name)=>`<div class="objectCard"><div class="objectCard__left"><span class="objectCard__iconTile">${icon(ic,16)}</span><span class="objectCard__name">${name}</span></div><button class="objectCard__eye">${icon('eyeBlue',20)}</button></div>`;
const replyBtn = (text,id)=>`<button class="cardReplyBtn" id="${id}">${text}</button>`;
const recordedReply = (text)=>`<div class="cardReply"><img class="cardReply__avatar" src="figma/avatar.png" alt="">${text}</div>`;
const DL_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5239 11.1493C7.58581 11.2114 7.65937 11.2607 7.74037 11.2944C7.82136 11.328 7.9082 11.3453 7.9959 11.3453C8.04819 11.3453 8.10031 11.3393 8.15123 11.3273C8.28131 11.2958 8.39902 11.2262 8.48923 11.1273C8.62256 10.9873 10.1386 9.48133 11.1366 8.48867C11.2004 8.42734 11.2514 8.35392 11.2865 8.27269C11.3217 8.19146 11.3403 8.10405 11.3413 8.01554C11.3423 7.92704 11.3257 7.83922 11.2924 7.75721C11.2591 7.6752 11.2098 7.60063 11.1474 7.53787C11.085 7.47511 11.0107 7.4254 10.9289 7.39165C10.8471 7.3579 10.7593 7.34078 10.6708 7.34128C10.5823 7.34179 10.4948 7.35992 10.4134 7.39461C10.332 7.4293 10.2582 7.47986 10.1966 7.54333C9.54323 8.19267 9.04656 8.686 8.66323 9.06867L8.66656 2.66667C8.66656 2.48986 8.59633 2.32029 8.4713 2.19526C8.34628 2.07024 8.17671 2 7.9999 2C7.82309 2 7.65352 2.07024 7.52849 2.19526C7.40347 2.32029 7.33323 2.48986 7.33323 2.66667V9.06667L5.80523 7.53733C5.67967 7.4157 5.51136 7.34826 5.33655 7.34953C5.16175 7.35079 4.99443 7.42067 4.87065 7.54411C4.74686 7.66754 4.67651 7.83466 4.67475 8.00946C4.67299 8.18426 4.73996 8.35276 4.86123 8.47867L7.5239 11.1493Z" fill="#0365AC"/><path d="M13.3332 7.35333C13.1564 7.35333 12.9868 7.42357 12.8618 7.5486C12.7368 7.67362 12.6666 7.84319 12.6666 8.02L12.6606 12.02C12.6606 12.1968 12.5903 12.3664 12.4653 12.4914C12.3403 12.6164 12.1707 12.6867 11.9939 12.6867L3.9939 12.6747C3.81709 12.6747 3.64752 12.6044 3.52249 12.4794C3.39747 12.3544 3.32723 12.1848 3.32723 12.008L3.33323 8.008C3.33323 7.83119 3.26299 7.66162 3.13797 7.5366C3.01294 7.41157 2.84337 7.34133 2.66656 7.34133C2.48975 7.34133 2.32018 7.41157 2.19516 7.5366C2.07013 7.66162 1.9999 7.83119 1.9999 8.008L1.9939 12.008C1.9939 12.5384 2.20461 13.0471 2.57968 13.4222C2.95476 13.7973 3.46346 14.008 3.9939 14.008L11.9939 14.02C12.5243 14.02 13.033 13.8093 13.4081 13.4342C13.7832 13.0591 13.9939 12.5504 13.9939 12.02L13.9999 8.02C13.9999 7.84319 13.9297 7.67362 13.8046 7.5486C13.6796 7.42357 13.51 7.35333 13.3332 7.35333Z" fill="#0365AC"/></svg>`;
const dlLink = ()=>`<span class="link-dl">Download change summary ${DL_ICON}</span>`;
// "View in Campaign Manager" external link (Figma 5356:78474) — sits 12px under an object card
const EXT_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 3.5H4.5C3.39543 3.5 2.5 4.39543 2.5 5.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5H10.5C11.6046 13.5 12.5 12.6046 12.5 11.5V9.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9.5 2.5H13.5V6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.2 2.8L8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const cmLink = ()=>`<div class="link-cm">View in Campaign Manager ${EXT_ICON}</div>`;
// copy glyph for the experience-detail ID readout (Figma 1:38730)
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:-2px"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="#6b6c72"/><path d="M10.5 3.5V3.5C10.5 2.39543 9.60457 1.5 8.5 1.5H4.5C2.84315 1.5 1.5 2.84315 1.5 4.5V8.5C1.5 9.60457 2.39543 10.5 3.5 10.5V10.5" stroke="#6b6c72"/></svg>`;

/* agent working loader — assist GIF + subtask checklist.
   tasks: [{label, state:'idle'|'active'|'done'}] */
/* STOPPING IS A PAUSE, NOT A CUT (user, 2026-10-06: "the stop needs to
   feel like a pause, richen the animation"). `paused:true` keeps the
   SAME loader on screen and settles it in place instead of swapping it
   out: the spinner winds down to a still stop glyph, the shimmer freezes
   mid-sweep, the running substep stops shimmering and holds, and the
   label says what happened. The work you were watching stays where it
   was — which is what a pause looks like. */
function agentLoader(label, tasks, bare=false, paused=false){
  // Figma "Doing some tasks" (7463-9100): bare stroked tick per row (no green circle).
  // During loading a fade hierarchy applies (done=dark, active/pending=faded); once
  // ALL steps are done the whole list settles to the done color.
  const allDone = tasks.length && tasks.every(t=>t.state==='done');
  const list = bare ? '' : `<ul class="agentTasks__list${allDone?' agentTasks__list--settled':''}">${tasks.map(t=>`
    <li class="agentTask ${t.state==='done'?'agentTask--done':t.state==='active'?'agentTask--active':'agentTask--idle'}">
      <span class="agentTask__check">${I.tick}</span>
      <span class="agentTask__label">${t.label}</span>
    </li>`).join('')}</ul>`;
  /* paused: the GIF spinner is replaced by the stop glyph (a GIF cannot be
     frozen mid-frame, so the swap IS the wind-down) and the label drops its
     shimmer for still text. `.agentTasks--paused` settles the substeps. */
  const head = paused
    ? `<span class="agentTasks__paused">${I.stop}</span><span class="agentTasks__label">${label}</span>`
    : `<img class="agentTasks__loader spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"><span class="agentTasks__label agentTasks__label--shimmer">${label}</span>`;
  return `<div class="chatMsgGroup"><div class="agentTasks${paused?' agentTasks--paused':''}">
    <div class="agentTasks__head">${head}</div>
    ${list}
  </div></div>`;
}

/* AN INTERRUPTED TASK USES THE INFO NOTE'S CONTAINER, WITH AN ATTENTION
   ICON — "this is not info, it is semi warning" (user, 2026-10-06,
   supplying Figma node 59:65930 in MS 2.0 - Targeted Offer Oct).
   The CONTAINER is the flow builds' `.infoNote` (white box inside the
   grey bubble, `#6b6c72` body text — both confirmed against the node).
   The ICON is NOT the purple info dot: the node binds `Ui/Attention`,
   measured off the render as a 16px dot at #d94e00. A stop sits between
   information and failure — it is not something the agent got wrong
   (so not the red `.msgErr`), but it does want attention. */
/* resume control for an interrupted tracker row: same 20px ring as the
   stop glyph so the two swap without the row shifting */
const PLAY_ICON = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.25" stroke="#6b6c72" stroke-width="1.5"/><path d="M8.2 6.9v6.2l5-3.1-5-3.1Z" fill="#6b6c72"/></svg>`;

/* status badge — only the positive variant is used here (QA "Verified") */
/* STATUS COLOURS FOLLOW THE SIBLING BUILDS (user, 2026-10-12: "you're not using
   the right status colours"): Published/Verified green, Draft blue, Error red,
   anything else neutral. One helper, so no table can invent its own. */
const badge = (t)=>{
  if(t==='Published'||t==='Verified'||t==='Match') return `<span class="badge badge--pos">${t}</span>`;
  if(t==='Draft') return `<span class="badge badge--draft">${t}</span>`;
  if(t==='Error'||t==='Mismatch') return `<span class="badge badge--err">${t}</span>`;
  if(t==='Edited') return `<span class="badge badge--edited">${t}</span>`;
  return `<span class="badge badge--neutral">${t}</span>`;
};

const ATTENTION_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#d94e00"/><rect x="7.25" y="3.6" width="1.5" height="5.2" rx="0.75" fill="#fff"/><circle cx="8" cy="11.4" r="0.95" fill="#fff"/></svg>`;

function bootCanvas(){
  return `<div class="bootLoader"><img class="bootLoader__gif spinnerII" src="figma/spinner-ii.gif" alt=""><span class="bootLoader__shimmer">Creating a project</span></div>`;
}

const scenes = {};

/* ---- HOME ---- */
scenes.home = (state={})=>{
  const spark = `<svg class="spark" viewBox="0 0 200 48" preserveAspectRatio="none"><polyline points="0,34 30,20 60,30 90,12 120,26 150,16 180,28 200,18" fill="none" stroke="#5d47d5" stroke-width="2"/></svg>`;
  const metric = (label,val,delta,cls)=>`<div class="mcard">
      <div class="ml">${label} ${icon('info',14)}</div><div class="mv">${val}</div><div class="md ${cls}">${delta}</div>${spark}
      <div class="mfoot"><span>6/1 – 6/7</span><span class="mlink">Link <span class="chev-right">${icon('chevronDown',14)}</span></span></div>
    </div>`;
  // 4th card renders as a skeleton placeholder (per Figma home)
  const metricSkel = `<div class="mcard mcard--skel">
      <span class="cfskel" style="width:70%;height:12px"></span>
      <span class="cfskel" style="width:45%;height:22px;margin-top:14px"></span>
      <span class="cfskel" style="width:100%;height:56px;margin-top:22px;border-radius:10px"></span>
      <span class="cfskel" style="width:30%;height:10px;margin-top:14px"></span>
    </div>`;
  // homepage shortcut icons (purple-filled to sit on the light-purple .si tile)
  const scCampaign = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2713 2.6241C16.1503 2.54984 16.0125 2.50751 15.8707 2.5011C15.7288 2.49469 15.5877 2.52439 15.4605 2.58744L10.6355 4.99994H5.83301C5.16997 4.99994 4.53408 5.26333 4.06524 5.73217C3.5964 6.20101 3.33301 6.8369 3.33301 7.49994V10.8333C3.33301 11.4963 3.5964 12.1322 4.06524 12.601C4.53408 13.0699 5.16997 13.3333 5.83301 13.3333H6.93467L8.39217 16.9766C8.43288 17.0783 8.49322 17.1709 8.56974 17.2493C8.64625 17.3276 8.73745 17.3901 8.83813 17.4332C8.9388 17.4763 9.04698 17.4992 9.15648 17.5005C9.26599 17.5018 9.37468 17.4815 9.47634 17.4408C9.57801 17.4001 9.67066 17.3397 9.749 17.2632C9.82735 17.1867 9.88986 17.0955 9.93296 16.9948C9.97606 16.8941 9.99892 16.786 10.0002 16.6765C10.0015 16.567 9.98122 16.4583 9.94051 16.3566L8.73051 13.3333H10.6355L15.4605 15.7458C15.5876 15.8093 15.7288 15.8392 15.8707 15.8328C16.0126 15.8264 16.1505 15.7838 16.2714 15.709C16.3922 15.6343 16.4919 15.5299 16.561 15.4058C16.6302 15.2817 16.6664 15.142 16.6663 14.9999V3.33327C16.6664 3.1912 16.6302 3.05146 16.561 2.92734C16.4919 2.80322 16.3922 2.69884 16.2713 2.6241ZM4.99967 10.8333V7.49994C4.99967 7.27892 5.08747 7.06696 5.24375 6.91068C5.40003 6.7544 5.61199 6.6666 5.83301 6.6666H9.99967V11.6666H5.83301C5.61199 11.6666 5.40003 11.5788 5.24375 11.4225C5.08747 11.2662 4.99967 11.0543 4.99967 10.8333ZM14.9997 13.6516L11.6663 11.9849V6.34827L14.9997 4.6816V13.6516Z" fill="#5d47d5"/></svg>`;
  const scExperiment =`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.0546 14.6359L12.5004 8.12091V3.33341C12.7214 3.33341 12.9334 3.24562 13.0897 3.08934C13.2459 2.93306 13.3337 2.7211 13.3337 2.50008C13.3337 2.27907 13.2459 2.06711 13.0897 1.91083C12.9334 1.75455 12.7214 1.66675 12.5004 1.66675H7.5004C7.27938 1.66675 7.06742 1.75455 6.91114 1.91083C6.75486 2.06711 6.66706 2.27907 6.66706 2.50008C6.66706 2.7211 6.75486 2.93306 6.91114 3.08934C7.06742 3.24562 7.27938 3.33341 7.5004 3.33341V8.12091L3.94706 14.6359C3.73932 15.0166 3.63419 15.4448 3.64201 15.8785C3.64983 16.3121 3.77032 16.7363 3.99165 17.1092C4.21299 17.4822 4.52754 17.7912 4.90442 18.0058C5.28129 18.2205 5.70752 18.3333 6.14123 18.3334H13.8596C14.2933 18.3335 14.7197 18.2207 15.0967 18.0061C15.4737 17.7916 15.7883 17.4826 16.0098 17.1096C16.2312 16.7366 16.3518 16.3124 16.3596 15.8787C16.3675 15.445 16.2623 15.0167 16.0546 14.6359ZM9.0654 8.73258C9.13216 8.61013 9.16711 8.47288 9.16706 8.33341V3.33341H10.8337V8.33341C10.8337 8.47288 10.8686 8.61013 10.9354 8.73258L12.5362 11.6667H7.4654L9.0654 8.73258ZM14.5762 16.2592C14.5035 16.3845 14.3988 16.4881 14.2729 16.5597C14.147 16.6313 14.0044 16.6682 13.8596 16.6667H6.14123C5.99664 16.6668 5.85453 16.6292 5.72886 16.5577C5.6032 16.4861 5.49831 16.3831 5.4245 16.2588C5.35069 16.1345 5.3105 15.9931 5.30788 15.8485C5.30526 15.7039 5.3403 15.5612 5.40956 15.4342L6.55623 13.3334H13.4454L14.5912 15.4342C14.6616 15.5609 14.6973 15.7039 14.6947 15.8488C14.692 15.9936 14.6512 16.1352 14.5762 16.2592Z" fill="#5d47d5"/></svg>`;
  const scIpd = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.6709 4.16699C8.05161 4.16699 9.1709 5.28628 9.1709 6.66699C9.1709 8.0477 8.05161 9.16699 6.6709 9.16699C5.29019 9.16699 4.1709 8.0477 4.1709 6.66699C4.1709 5.28628 5.29019 4.16699 6.6709 4.16699ZM6.6709 5.83366C6.21066 5.83366 5.83756 6.20675 5.83756 6.66699C5.83756 7.12723 6.21066 7.50033 6.6709 7.50033C7.13114 7.50033 7.50423 7.12723 7.50423 6.66699C7.50423 6.20675 7.13114 5.83366 6.6709 5.83366Z" fill="#5d47d5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.8376 1.66699C17.2183 1.66699 18.3376 2.78628 18.3376 4.16699V15.8337C18.3376 17.2144 17.2183 18.3337 15.8376 18.3337H4.1709C2.79019 18.3337 1.6709 17.2144 1.6709 15.8337V4.16699C1.6709 2.78628 2.79019 1.66699 4.1709 1.66699H15.8376ZM13.978 12.904C13.6449 12.5043 13.0303 12.5042 12.6971 12.904L10.4779 15.5675C10.1875 15.9158 9.67162 15.9678 9.31738 15.6847L7.19173 13.9839C6.8874 13.7405 6.45439 13.7404 6.15006 13.9839L3.41081 16.1755C3.54131 16.4652 3.83249 16.667 4.1709 16.667H15.8376C16.2092 16.667 16.5236 16.4236 16.631 16.0876L13.978 12.904ZM4.1709 3.33366C3.71066 3.33366 3.33757 3.70675 3.33757 4.16699V14.0994L5.10921 12.6826C6.02224 11.9522 7.31955 11.9522 8.23258 12.6826L9.72021 13.8724L11.417 11.8363C12.4165 10.6372 14.2587 10.6372 15.2581 11.8363L16.6709 13.5314V4.16699C16.6709 3.70675 16.2978 3.33366 15.8376 3.33366H4.1709Z" fill="#5d47d5"/></svg>`;
  const shortcuts = [
    ['Create campaign','Build email, push, or in-app campaigns with AI-assisted copy.', scCampaign],
    ['Run experiment','A/B test subject lines, offers and send times at scale.', scExperiment],
    ['Create IPD','Design in-product display creatives for targeted placements.', scIpd],
  ].map(([t,d,ic])=>`<div class="scard"><div class="si">${ic}</div><div><div class="st">${t}</div><div class="sd">${d}</div></div></div>`).join('');
  return `<div class="content">
    ${topbar('<span>Home</span>')}
    <div class="scroll"><div class="pad">
      <div class="home-hero">
        <h1>Good Morning, Raashi.</h1>
        <div class="sub">What would you like to do today?</div>
        <div class="promptBox" id="homePrompt">
          <div class="promptBox__content">
            ${state.fileChip?`<div class="fileChip"><span class="fileChip__ico">${icon('note',14)}</span><span class="fileChip__name">${FILE_NAME()}</span><span class="fileChip__x">${icon('close',12)}</span></div>`:''}
            <div class="promptBox__input" id="homeInput"><span class="promptBox__ph">Ask Marketing Agent</span></div>
            <div class="promptBox__actions">
              <button class="promptBox__ctrl">${icon('plus',18)}</button>
              <button class="promptBox__send" id="homeSend">${icon('arrowUp',18)}</button>
            </div>
          </div>
        </div>
        <!-- Simulate a scenario: dashed pill → export scenario -->
        <div class="simWrap">
          <button class="simPill" id="simPill" type="button">${icon('plus',14)} Simulate a scenario ${I.chev}</button>
          <div class="simMenu hidden" id="simMenu">
            <button class="simMenu__item" data-sim="s1">Stopped at thinking &mdash; C1</button>
            <button class="simMenu__item" data-sim="s2">Stopped at thinking &mdash; C2</button>
            <button class="simMenu__item" data-sim="s3">Stopped at doing</button>
            <button class="simMenu__item" data-sim="s4">Stopped at doing &mdash; applying changes</button>
          </div>
        </div>
      </div>
      <div class="home-sec">
        <h3>You Top Metrics</h3><div class="note">Insights only for QBO US Active IPD Campaigns</div>
        <div class="metrics">
          ${metric('IPD Impressions','6.4M','→ No Change vs last week','flat')}
          ${metric('IPD Impressions','6.4M','↑ 9K this week','up')}
          ${metric('IPD Impressions','6.4M','↑ 12K vs last week','up')}
          ${metricSkel}
          ${metric('IPD Impressions','6.4M','↓ 0.2 vs last week','dn')}
        </div>
        <h3>Your Shortcuts</h3><div style="height:6px"></div>
        <div class="shortcuts">${shortcuts}</div>
        <h3>Your Projects</h3><div style="height:6px"></div>
        <div class="projTbl">
          <div class="projTbl__head">${'<span>Name</span>'.repeat(5)}</div>
          <div class="projTbl__row"></div>
        </div>
      </div>
    </div></div>
  </div>`;
};

/* ============================================================
   STOP PROCESSING — the interaction this block exists to show.

   Every scenario runs the standard intake (boot "Creating a project"
   → C1 → …) and then the user STOPS it mid-flight from the composer's
   stop control. Stopping always does three things:
     1) the running loader is replaced by a stopped message, as the
        agent's own turn ("I've stopped … Let me know how to proceed.")
     2) the prompt that was stopped becomes an AFFORDANCE under the
        composer, so it can be put back without retyping
     3) the composer returns to its resting state, send disabled
   Clicking that affordance — or pressing Tab — enters it as the
   composer's draft; sending it runs the flow again from where it
   stopped.

   THREE SCENARIOS:
     s1  stopped at thinking, in C1   (centred, no canvas)
     s2  stopped at thinking, in C2   (two-pane, mid-plan)
     s3  stopped at doing             (the agent comes back with
                                       questions rather than an error)
   ============================================================ */
const SP_PROMPT  = 'I want to create a campaign from this creative brief sheet';
/* s2 IS A CHANGE ORDER, so it opens with its own prompt — the recall chip
   and the resent turn have to echo the request that was actually stopped,
   not s1's create. `PROMPT()` is the prompt for whichever scenario is
   running; everything that shows the user's words goes through it. */
const S2_PROMPT  = 'I want to execute a change order for the ELM9071 campaign';
/* s2 AND s3 are both change orders (typed, no attachment); only s1 opens
   from the creative brief */
const S4_PROMPT  = 'Find IPD experiences that use "Flexible solutions for growth" as their headline';
const isChangeOrder = ()=> scenario==='s2' || scenario==='s3' || scenario==='s4';
const PROMPT = ()=> scenario==='s4' ? S4_PROMPT : isChangeOrder() ? S2_PROMPT : SP_PROMPT;
/* THE ATTACHMENT PER PROMPT: only s1 (the brief sheet) has one. The change-order
   prompt was briefly given "Change order - ELM9071 campaign" and then reverted
   (user, 2026-10-12: "remove attachment, kept rest as is"); s4 is a search. */
const HAS_FILE  = ()=> scenario==='s1';
const FILE_NAME = ()=> 'name of file.doc';
const SP_PROJECT = 'ELM9071 campaign';
const SP_CRUMB   = `<span>Home</span> <span class="sep">/</span> <span>${SP_PROJECT}</span>`;
/* the substeps the "Doing some tasks" loader ticks through (from the still) */
const SP_TASKS   = ['cm.offerSchema','ixp.splitConfig','ixp.splitConfig'];
/* the other loaders' substeps, shared by the timed runners and the key states */
const PLAN_SUBS  = ['Reading your request','Mapping the work','Ordering the tasks'];
/* s2's running task ticks these on BOTH the canvas and the panel loader
   (Figma frame) — one list, so the two views never disagree */
const S2_SUBS    = ['cm.offerSchema','ixp.splitConfig','ixp.splitConfig'];

/* the user's opening turn — the brief sheet comes in as a file chip */
const SP_USER = ()=> !HAS_FILE()
  ? userBubble(PROMPT())
  : userBubble(`<span class="bubbleFile"><span class="bubbleFile__ico">${icon('note',14)}</span>${FILE_NAME()}</span><br>${PROMPT()}`);
/* "created a project", under its own settled disclosure */
/* the disclosure describes what the agent actually did: s1/s3 read an
   attached brief, s2 read a typed request */
const SP_CREATED = ()=> isChangeOrder()
  ? agentMsg(disclosure('Read your request, created a project',['Read your request','Looking up the campaign','Setting up the project'])
      + `<div class="chatBubble">I have created "<span class="chatBubble__name">${SP_PROJECT}</span>" project for you.</div>`)
  : agentMsg(disclosure('Read your brief, created a project',['Read your brief','Reading the brief sheet','Setting up the project'])
      + `<div class="chatBubble">I have created "<span class="chatBubble__name">${SP_PROJECT}</span>" project for you.</div>`);

/* THE STOPPED MESSAGE. A bare bubble carrying the error row — the same
   `.msgErr` the flow builds use for a validation failure, because this
   reads the same way: something did not finish, and the agent is
   waiting on the user. No object card (nothing was produced) and no
   question pill (the answer is a new prompt, not an approval). */
/* `arriving` marks the render that INTRODUCES this message, so its
   entrance animation plays once instead of replaying on every later beat
   (the chip arrival, a re-render) — see `.chatBubble--settling`. */
const SP_STOPPED = (what, arriving)=> agentMsg(`<div class="chatBubble${arriving?' chatBubble--settling':''}"><div class="infoNote">${ATTENTION_ICON}<span>I've stopped ${what}. Let me know how to proceed.</span></div></div>`);

/* ---- THE COMPOSER, IN ITS THREE STATES ----
   running  — the stop control sits between attach and send, and send is
              inert: while the agent is working, stopping is the only
              thing the composer can do
   stopped  — stop control gone, and the stopped prompt hangs underneath
              as an affordance
   resting  — the plain expanded composer
   `draft` fills the input (what the affordance does when clicked). */
function spComposer(opts={}){
  const {running=false, recall='', draft=''} = opts;
  const filled = draft ? ' promptBox__input--filled' : '';
  const inner  = draft || `<span class="promptBox__ph">Ask Marketing Agent</span>`;
  /* THE PROMPT'S ATTACHMENT COMES BACK WITH IT. The stopped prompt arrived
     with the creative brief attached, so recalling the prompt without its
     file would resend a different request from the one that was stopped.
     Same `.fileChip` the home composer uses, above the input. */
  /* only a prompt that HAD an attachment gets one back (s2's change
     order was typed, no file) */
  const file = (draft && opts.file!==false && HAS_FILE()) ? `<div class="fileChip"><span class="fileChip__ico">${icon('note',14)}</span><span class="fileChip__name">${FILE_NAME()}</span><span class="fileChip__x" data-spfilex>${icon('close',12)}</span></div>` : '';
  /* SEND AND STOP ARE THE SAME SLOT, NOT TWO BUTTONS (user, 2026-10-07:
     "today we're showing send and stop both. make it either or depending
     on the state"). While the agent runs, stopping is the only thing the
     composer can do, so that slot IS stop; the moment it is idle the slot
     is send. They never appear together, and the control row keeps its
     shape because one always occupies the position.
     Send is still dimmed when idle with an empty box — there is nothing
     to send, but it is the right control for the state. */
  const action = running
    ? `<button class="promptBox__ctrl promptBox__stop" data-spstop title="Stop">${I.stop}</button>`
    : `<button class="promptBox__send${draft?'':' promptBox__send--off'}" id="spSend" title="Send">${icon('send',18)}</button>`;
  /* THE CHIP SITS INSIDE THE BOX, ABOVE THE INPUT (user, 2026-10-07:
     "also have the chip inside the prompt box at the top"). It used to
     hang underneath as a sibling; inside, it reads as part of what you
     are about to send rather than a separate suggestion. */
  /* THE CHIP SITS IN THE ACTIONS ROW, BOTTOM-LEFT, grouped with attach and send
     (user, 2026-10-12: "keep it in the bottom left of the row when we have the
     send and attach action"). It used to be a row above the input. */
  const chip = recall ? `<button class="recallChip" data-sprecall title="Tab to enter">${icon('plus',14)}<span>${recall}</span></button>` : '';
  /* CLEAR, top-right of the box (user, 2026-10-07: "give me an X at the top
     right corner that allows me to clear a prompt instead of having to
     select the entire text"). Only while there is a draft and the agent is
     idle — an empty box has nothing to clear, and a running one is stop's.
     Clearing drops the draft (and the attachment that came with it); the
     recall chip does NOT come back: the handler passes recall:false. */
  const clear = (draft && !running) ? `<button class="promptBox__clear" data-spclear title="Clear">${icon('close',12)}</button>` : '';
  const box = `<div class="promptBox promptBox--centered promptBox--expanded${clear?' promptBox--clearable':''}"><div class="promptBox__content">
    ${clear}
    ${file}
    <div class="promptBox__input${filled}" id="spInput">${inner}</div>
    <div class="promptBox__actions">${chip}<span class="promptBox__grow"></span><button class="promptBox__ctrl">${icon('attach',18)}</button>${action}</div>
  </div></div>`;
  /* THE PROMPT PROMPTER: the stopped prompt, kept as a one-click chip
     under the box. Tab enters it too — the hint says so on hover.
     IT IS AN OFFER, SO IT IS CONSUMED: once the prompt is in the box the
     chip goes away (the caller passes recall:'' when there is a draft),
     otherwise the same sentence reads twice, once as a chip and once as
     the thing it just filled in. */
  return box;
}

/* ---- C1: centred column, no canvas, no right pane ---- */
/* THE COMPOSER IS PINNED, NOT SCROLLED (user, 2026-10-07: "prompt box
   should not scroll, right?"). It used to sit inside `.scroll`, so a long
   transcript carried it off the bottom of the screen and there was no way
   to type without scrolling back. Now only the conversation scrolls; the
   composer sits below it in a fixed row, in the same 588 column. */
function spC1(bodyHTML, composer, crumb, arriving){
  return `<div class="content content--centered${arriving?' content--arriving':''}">${topbar(crumb || SP_CRUMB)}
    <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${bodyHTML}</div></div></div>
    <div class="composerDock"><div class="composerDock__inner">${composer}</div></div>
  </div>`;
}

/* ============================================================
   SCENARIO 1 — STOPPED AT THINKING, IN C1
   The flow is still in the centred conversation: the project has been
   created and the agent is working through its tasks. The user stops
   it there, then puts the prompt back and it runs on.
   ============================================================ */
scenes.s1 = (state={})=>{
  const phase = state.phase;
  if(phase==='bootfull'){
    return `<div class="content">${topbar(`<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>`)}
      <div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  let b = SP_USER();
  if(phase!=='msg-user') b += SP_CREATED();
  /* RUNNING — the "Doing some tasks" loader with its ticking substeps */
  if(phase==='working') return spC1(b + agentLoader('Thinking', state.tasks||[]), spComposer({running:true}));
  /* PAUSING — the first beat of the stop: the loader settles in place,
     still on screen, before the note arrives */
  if(phase==='pausing') return spC1(b + agentLoader('Stopping', state.tasks||[], false, true), spComposer({}));
  /* STOPPED — the note has arrived and the settled loader has collapsed
     away. It is NOT kept as history: the note already says what happened,
     and on resume the same substeps would appear twice. */
  if(phase==='stopped') return spC1(b + SP_STOPPED('creating your campaign', state.recall===false), spComposer({recall:(state.recall!==false && !state.draft && !state.dismissed)?PROMPT():'', draft:state.draft||'', file:!state.detached}));
  /* RESUMED — the stopped turn stays in history, the prompt is re-sent,
     and the agent picks the tasks back up */
  if(phase==='resumed'){
    const conv = b + SP_STOPPED('creating your campaign') + SP_RESENT();
    return spC1(conv + agentLoader('Thinking', state.tasks||[]), spComposer({running:true}));
  }
  return spC1(b, spComposer({}));
};

/* ============================================================
   SCENARIO 2 — STOPPED AT THINKING, IN C2
   Same stop, one phase later: the canvas has opened, so the
   conversation lives in the right-hand panel and the stop happens
   while a PLAN is executing. The sticky task tracker is therefore on
   screen too, and it has to settle: a stopped task is not a done task,
   so its marker drops out of the spinner without turning into a check.
   ============================================================ */
/* ============================================================
   SCENARIO 2 — STOPPED AT THINKING, IN C2 (Figma frame "Stopped at
   thinking - C2").
   A CHANGE ORDER, not a create: three tasks, the first two already
   approved and recorded, the third running on the canvas when the user
   stops it. Two things make this scenario different from s1:
     - the canvas is a REAL progress screen ("Setting things up"), not a
       skeleton — the work is visible while it runs
     - STOPPING COLLAPSES C2 BACK TO C1: the canvas closes and the
       conversation becomes the full-width centred column again, carrying
       its whole history. The crumb drops its "Change order - " prefix
       with it.
   ============================================================ */
const S2_PROJECT = 'ELM9071 campaign';
/* the crumb gains "Change order - " only while the change order is OPEN
   on the canvas; collapsing back to C1 drops it */
const S2_CRUMB_C2 = `<span>Home</span> <span class="sep">/</span> <span>Change order - ${S2_PROJECT}</span>`;
const S2_CRUMB_C1 = `<span>Home</span> <span class="sep">/</span> <span>${S2_PROJECT}</span>`;
/* THE PLAN TABLE'S HEADER IS "Task | What happens", BUT BOTH CELLS BELONG
   TO ONE TASK — the marker sits under "Task" and the task NAME under
   "What happens" (user, 2026-10-07, with the Figma reference). An earlier
   pass read the header as two separate data columns and INVENTED a
   description per row ("The IDs on the billing offers are updated"); no
   such copy exists in the design. */
const S2_TASKS = [
  'Change billing offer IDs',
  'Change IPD content to reflect new pricing',
  'Change images to reflect new pricing',
  'Review change summary',
  'Update the campaign',
];
const S3_TASKS = [
  'Create a draft of the campaign',
  'Build the experiences',
  'Review the campaign',
];

function s2PlanRows(done=0, running=-1, stopped=-1, tasks){
  const marker=(i)=>{
    if(i<done)        return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===running)   return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    if(i===stopped)   return `<span class="planNum planNum--stopped">${I.stop}</span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return (tasks||S2_TASKS).map((task,i)=>`<div class="planTable__row">${marker(i)}<span>${task}</span></div>`).join('');
}
const S2_PLAN = (done=0,running=-1,stopped=-1,recorded=false,tasks,intro)=> agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">${intro||'I will make the changes in the following order:'}</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${s2PlanRows(done,running,stopped,tasks)}</div>${recorded?'':`<p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>`}${recorded?recordedReply('Looks good'):replyBtn('Looks good','s2ApprovePlan')}</div>`);

/* THE TWO COMPLETED TASKS, as recorded turns. Each is the same shape:
   what changed, the object it produced, and the approval that moved the
   flow on — exactly as the Figma panel shows them. */
const S2_TASK1 = (live=false)=> agentMsg(`<div class="chatBubble">Changed the billing offers IDs${objectCard('edit',`Change IDs: Billing offers - ${S2_PROJECT}`)}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${live?replyBtn('Approve','s2T1Ok'):recordedReply('Approved')}</div>`);
const S2_TASK2 = (live=false)=> agentMsg(`<div class="chatBubble">Changed IPD content and images to reflect new pricing${objectCard('edit',`Change IPD content and images: Placement - ${S2_PROJECT}`)}<div class="bubble-q">Does this look ok? I'll then proceed to task 3.</div>${live?replyBtn('Proceed','s2T2Ok'):recordedReply('Proceed')}</div>`);

/* THE C2 CANVAS IS A REAL PROGRESS SCREEN, not a skeleton: title,
   subtext, a determinate bar, and the substeps as radio rows. It mirrors
   the panel's loader, so what the canvas shows and what the conversation
   says are the same thing seen twice. */
function settingUpCanvas(tasks=[], paused=false, label='Doing some tasks'){
  const doneCount = tasks.filter(t=>t.state==='done').length;
  const activeIdx = tasks.findIndex(t=>t.state==='active');
  /* the bar fills by completed substeps, with the running one counting
     half — so it always advances when a step starts, not only when it ends */
  const pct = tasks.length ? Math.round(((doneCount + (activeIdx>=0?0.5:0)) / tasks.length) * 100) : 0;
  const rows = tasks.map(t=>`<li class="suTask suTask--${t.state}"><span class="suTask__dot"></span><span class="suTask__label">${t.label}</span></li>`).join('');
  /* THE CANVAS SAYS "Stopping" TOO (user, 2026-10-07: "show stopping in
     canvas too?"). While paused it was still headed "Setting things up /
     Doing some tasks" next to a panel that already said Stopping — the
     two halves of the same screen disagreed about what was happening.
     The bar also freezes where it got to rather than reading as progress. */
  return `<div class="suCanvas${paused?' suCanvas--paused':''}">
    <div class="suCanvas__t">${paused?'Stopping':'Setting things up'}</div>
    <div class="suCanvas__sub">${paused?'Finishing what\'s in progress':'Subtext if required'}</div>
    <div class="suBar${paused?' suBar--paused':''}"><span class="suBar__fill" style="width:${pct}%"></span></div>
    <div class="suHead"><span class="suHead__dot"></span><span class="suHead__label">${paused?'Stopping':label}</span></div>
    <ul class="suList">${rows}</ul>
  </div>`;
}


/* TASKS 1 AND 2 ARE REAL STEPS, NOT HISTORY (user, 2026-10-12: "we approve
   plan and directly skip 2 proceeds. add those steps"; applies to stopped at
   thinking AND stopped at doing). After "Looks good" each task runs its loader,
   shows what it changed with the object card, and waits for the user's
   "Approved" / "Proceed" before the next one starts. Task 3 is the one that
   gets stopped. Phases: t1 | t1ok | t2 | t2ok. */
const TASK_SUBS = ['cm.offerSchema','ixp.splitConfig','ixp.splitConfig'];
const TASK_CRUMB = { s2:()=>S2_CRUMB_C2, s3:()=>S3_CRUMB_C2 };
function taskBillingTable(hl=true){
  const cols = ['Billing code','QA status','Title','No. of offers','Start date','End date','SKU'];
  const head = cols.map(c=>`<th><span class="th-inner">${c} ${icon('info',13)}</span><span class="sort">${I.sortsm}</span></th>`).join('');
  const rows = [['20059622','70% (Email)','19',1],['20059628','90% (Email)','19',1],['No billing code','Controls / free trial offers','27',0]]
    .map(([code,title,off,changed])=>`<tr${changed&&hl?' class="rowdone"':''}><td>${code}</td><td>${badge('Verified')}</td><td>${title}</td><td>${off}</td><td>01/28/2026</td><td>04/22/2026</td><td>QB Live Assisted</td></tr>`).join('');
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
/* WHAT AN EARLIER STOP IN A TASK BEAT LEFT BEHIND (note + resent prompt),
   in the slot it belongs to. Reset per run. */
let taskLog = {thinking:'', t1:'', t2:''};
/* "Looks good" → Thinking in C1. Stoppable like every other loader. */
function planThinkPhase(scene, state, b){
  const ph = state.phase;
  if(ph!=='thinking' && ph!=='pausing-think' && ph!=='stopped-think') return null;
  const plan = S2_PLAN(0,-1,-1,true) + taskLog.thinking;
  if(ph==='thinking')      return spC1(b + plan + agentLoader('Thinking', state.tasks||[]), spComposer({running:true}));
  if(ph==='pausing-think') return spC1(b + plan + agentLoader('Stopping', state.tasks||[], false, true), spComposer({}));
  /* NO RECALL AFFORDANCE HERE: the prompt was sent long ago and a lot has
     happened since (user, 2026-10-12). The note alone, and the composer. */
  return spC1(b + plan + SP_STOPPED('before starting the changes', state.recall===false),
    spComposer({draft:state.draft||''}));
}
const TASK_WHAT = {1:'changing the billing offer IDs', 2:'changing the IPD content and images'};
function taskPhase(scene, state, b){
  /* IF A LOADER IS RUNNING, THE COMPOSER SLOT IS STOP (user, 2026-10-12: "why
     does the prompt box show disabled send when it should be the stop
     button? This is a repetitive issue"). Every running beat here (t1, t2,
     t2think) is stoppable; stopping pauses it in place, writes the note and
     offers the prompt back; sending resumes the same beat. */
  const m = /^(pausing-|stopped-)?t([12])(ok|think)?$/.exec(state.phase||''); if(!m) return null;
  const halt = m[1]==='pausing-' ? 'pausing' : m[1]==='stopped-' ? 'stopped' : '';
  const n = +m[2], ok = m[3]==='ok', think = m[3]==='think';
  const done = n-1;
  const plan = S2_PLAN(ok?n:done, -1, -1, true) + taskLog.thinking + taskLog.t1;
  const prior = n===2 ? S2_TASK1() + taskLog.t2 : '';
  const tasks = ok ? TASK_SUBS.map(l=>({label:l,state:'done'})) : (state.tasks||[]);
  /* THINK FIRST, THEN THE SKELETON, THEN THE OUTPUT (user, 2026-10-12). While
     it thinks the canvas keeps the PREVIOUS task's artifact; the skeleton only
     appears once the work starts. */
  const hl = state.hl!==false;
  const canvasBody = think ? `<div class="pad">${veiledBlock(`<h2 class="page-h">Billing offers - ${SP_PROJECT}</h2>${taskBillingTable(hl)}`)}</div>`
    : !ok ? `<div class="pad">${skeletonCanvas()}</div>`
    : `<div class="pad"><h2 class="page-h">${n===1?'Billing offers':'Placement'} - ${SP_PROJECT}</h2>${n===1?taskBillingTable(hl):s3PlacementTable(hl)}</div>`;
  /* EVERY ARTIFACT CANVAS CARRIES THE FOOTER ACTION BAR (user, 2026-10-12: "where
     is the action bar?"); the skeleton does not, as in the sibling builds. Under
     the film while thinking. */
  const foot = (ok || think) ? hlFoot(hl,think) : '';
  const canvas = `<div class="content s4Content">${topbar(TASK_CRUMB[scene]())}<div class="scroll">${canvasBody}</div>${foot}</div>`;
  const result = ok ? (n===1 ? S2_TASK1(true) : S2_TASK2(true))
    : halt==='pausing' ? agentLoader('Stopping', tasks, false, true)
    : halt==='stopped' ? SP_STOPPED(TASK_WHAT[n], state.recall===false)
    : agentLoader(think?'Thinking':'Doing some tasks', tasks);
  const composer = ok || halt==='pausing' ? spComposer({})
    : halt==='stopped' ? spComposer({draft:state.draft||''})   // late stop: no recall affordance
    : spComposer({running:true});
  return canvas + aiPanel({
    step:`${n}.  ${S2_TASKS[n-1]}`, stepLoading:!ok && !halt, stepStopped:!!halt,
    body: b + plan + prior + result,
    composerHTML: composer,
  });
}

/* THE INTERRUPTED TASK STARTS ON THE ARTIFACT THE PREVIOUS ONE PRODUCED (user, 2026-10-12): the
   canvas does not drop to a "Setting things up" screen between tasks; it
   keeps showing the previous result while the conversation thinks. */
/* UNDER THE FILM: the previous artifact stays, veiled, while the agent works on
   the next output (user, 2026-10-12: "give that white translucent cover so we
   see that something was happening there"). */
/* THE WHOLE ARTIFACT GOES UNDER THE FILM, HEADING INCLUDED (user, 2026-10-12:
   "why is this title completely visible?") */
const veiledBlock = (inner)=> `<div class="s4Body s4Body--veiled">${inner}<div class="s4Veil"></div></div>`;
/* A TABLE WITHOUT A CHECKBOX COLUMN GETS THE HIGHLIGHT-ONLY BAR: no "0 of n
   selected", no Keep/Remove/View (user, 2026-10-12: "there is no checkbox in this
   table, so do not give zero of four selected"). Same bar the sibling builds use. */
const hlFoot = (hlOn=true, veiled=false)=> `<div class="selbar selbar--footer${veiled?' selbar--veiled':''}"><label class="hlToggle"><input type="checkbox" data-hlchanges${hlOn?' checked':''}> Highlight changes</label>${veiled?'<div class="s4Veil"></div>':''}</div>`;
const s2PrevArtifact = (hl=true)=> `<div class="pad">${veiledBlock(`<h2 class="page-h">Billing offers - ${SP_PROJECT}</h2>${taskBillingTable(hl)}`)}</div>`;

scenes.s2 = (state={})=>{
  const phase = state.phase;
  if(phase==='bootfull'){
    return `<div class="content">${topbar(`<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>`)}
      <div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  /* C1 part of the intake — identical to s1, up to the plan card.
     EVERY EARLY PHASE MUST RETURN HERE. `msg-user` and `msg-created` used
     to fall through to the C2/stopped branches below, so stepping back to
     them rendered the COMPLETE conversation — the end of the flow shown
     before its beginning (user, 2026-10-07: "why does complete
     conversation show before we see project creation and other loader
     before plan???"). */
  let b = SP_USER();
  if(phase!=='msg-user') b += SP_CREATED();
  if(phase==='msg-user' || phase==='msg-created') return spC1(b, spComposer({running:true}));
  if(phase==='planning') return spC1(b + agentLoader('Creating a plan', state.tasks||[]), spComposer({running:true}));
  if(phase==='plan')     return spC1(b + S2_PLAN(0,-1,-1,false), spComposer({}));
  /* "Looks good" does NOT jump to C2 (user, 2026-10-12): the agent first
     thinks for a couple of seconds in the same centred loader as the intake,
     then the canvas opens with the skeleton. */
  { const t = planThinkPhase('s2', state, b); if(t) return t; }

  { const t = taskPhase('s2', state, b); if(t) return t; }
  /* THE STOP COMES RIGHT AFTER APPROVING THE FIRST OBJECT (user, 2026-10-12:
     "what we're illustrating post proceed on the 2nd object, we do now on
     triggering approve on the 1st"). Task 1 is done and recorded; task 2 is
     the one that gets interrupted. Task 2's own run only exists in s3. */
  const RUNNING = 1;   // task 2 of 5
  const history = b + S2_PLAN(1,-1,-1,true) + S2_TASK1();

  /* ---- C2: the change order is OPEN, canvas on the left ---- */
  if(phase==='working' || phase==='pausing'){
    const paused = phase==='pausing';
    const hl = state.hl!==false;
    const canvas = `<div class="content s4Content">${topbar(S2_CRUMB_C2)}
      <div class="scroll">${s2PrevArtifact(hl)}</div>${hlFoot(hl,true)}</div>`;
    return canvas + aiPanel({
      step:`${RUNNING+1}.  ${S2_TASKS[RUNNING]}`, stepLoading:!paused, stepStopped:paused,
      body: history + agentLoader(paused?'Stopping':'Thinking', state.tasks||[], false, paused),
      composerHTML: spComposer({running:!paused}),
    });
  }

  /* ---- THE COLLAPSE ITSELF ----
     One frame of the C2 layout with both panes animating out, so the
     canvas and conversation LEAVE rather than being cut. */
  if(phase==='closing'){
    const hl = state.hl!==false;
    const canvas = `<div class="content content--closing s4Content">${topbar(S2_CRUMB_C2)}
      <div class="scroll">${s2PrevArtifact(hl)}</div>${hlFoot(hl,true)}</div>`;
    return canvas + aiPanel({
      step:`${RUNNING+1}.  ${S2_TASKS[RUNNING]}`, stepStopped:true,
      body: history + agentLoader('Stopping', state.tasks||[], false, true),
      composerHTML: spComposer({}),
    }).replace('<aside class="ai', '<aside class="ai ai--closing');
  }

  /* ---- STOPPING COLLAPSES BACK TO C1 ----
     The canvas closes with the work it was showing, so the conversation
     returns to the full-width centred column it came from, carrying its
     whole history. The crumb drops "Change order - " with it: there is
     no change order open any more. */
  if(phase==='stopped'){
    /* late stop: no recall affordance (user, 2026-10-12) */
    return spC1(history + SP_STOPPED('changing the IPD content', state.recall===false),
      spComposer({draft:state.draft||''}),
      S2_CRUMB_C1, state.arriving);
  }
  if(phase==='resumed'){
    return spC1(history + SP_STOPPED('changing the IPD content') + SP_RESENT()
      + agentLoader('Thinking', state.tasks||[]),
      spComposer({running:true}), S2_CRUMB_C1);
  }
  return spC1(history, spComposer({}), S2_CRUMB_C1);
};


/* ============================================================
   SCENARIO 3 — STOPPED AT DOING
   The stop lands while the agent is actually BUILDING something, not
   thinking about it. Work is half-done, so the agent cannot simply
   wait: it reports where it got to and asks the sensible questions it
   needs answered before it can carry on. The recall affordance is
   still there, but here the real next move is answering.
   ============================================================ */
const S3_QS = [
  'Should I keep the two experiences I already created, or start over?',
  'The brief has no end date for the campaign. What should I set?',
];
/* STOPPED AT DOING carries the same amber dot as the other two, so a stop
   reads the same wherever it lands. What differs is what follows it: work
   was half-finished, so the agent shows what exists and asks the questions
   it needs answered. It says "stopped" ONCE — the state, then the count. */
const S3_ASK = ()=> agentMsg(`<div class="chatBubble"><div class="infoNote">${ATTENTION_ICON}<span>I've stopped while building your experiences. Two of five were created.</span></div>${objectCard('note','2 experiences - ELM9071 campaign')}<div class="bubble-q">Before I carry on, I need two things from you:</div><ul class="askList">${S3_QS.map(q=>`<li>${q}</li>`).join('')}</ul></div>`);

/* ============================================================
   SCENARIO 3 — STOPPED AT DOING (Figma frame "Stopped at doing - C2")
   A change order like s2, but the stop lands while the agent is BUILDING,
   so work is genuinely half-finished. The canvas plays "Setting things
   up" and then a skeleton table; stopping during the skeleton produces
   TWO CONSECUTIVE UPDATES — the stop message, then a summary with the
   standing count and the partial artifact.
   ============================================================ */
const S3_CRUMB_C2 = `<span>Home</span> <span class="sep">/</span> <span>Change order - ${SP_PROJECT}</span>`;
/* the four placements that WERE completed before the stop. Six more were
   pending, which is why the artifact is "(partial)". */
const S3_PLACEMENTS = [
  ['Hellobox - Chart of Accounts','Hellobox - Image','1','19'],
  ['Hellobox - Expenses','Hellobox - Image','2','19'],
  ['Hellobox - Payments Deposit','Hellobox - Image','3','27'],
  ['Banner - Shell','Banner','N/A','27'],
];
const S3_DONE = 4, S3_PENDING = 6;
const S3_ARTIFACT = `Placement (partial) - ${SP_PROJECT}`;

/* the canvas after the stop: only the completed placements, highlighted
   so it is clear these are the rows the interrupted run produced */
function s3PlacementTable(hl=true){
  const cols = ['Placement name','QA status','Template','Impression cap','No. of offers','Last updated'];
  const head = cols.map(c=>`<th><span class="th-inner">${c} ${icon('info',13)}</span><span class="sort">${I.sortsm}</span></th>`).join('');
  const rows = S3_PLACEMENTS.map(([name,tmpl,cap,off])=>`<tr${hl?' class="rowdone"':''}>
      <td>${name}</td><td>${badge('Verified')}</td><td>${tmpl}</td>
      <td>${cap}</td><td>${off}</td><td>06/30 18:30PST</td></tr>`).join('');
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* THE STOP IS ONE AGENT RESPONSE, NOT TWO (user, 2026-10-07: "these 2
   should be 1 combined ai response", with the reference). It was built as
   two bubbles with two timestamps; the reference is a SINGLE bubble —
   the stop note, then the standing table, the artifact and the choices,
   all under one time. They are one answer to one event: the agent stopped,
   and this is everything that follows from it.
   The note keeps its white `.infoNote` card INSIDE the bubble, which is
   what separates "what happened" from "what now" without splitting the
   turn. */
const S3_STOPPED = ()=> `<div class="infoNote">${ATTENTION_ICON}<span>I've stopped partway through updating your placements</span></div>`;
/* THE PARTIAL-STOP BUBBLE (user, 2026-10-12): note, then the object ("n are
   ready for your review"), THEN the standing table, then three options: keep
   what was done, roll it back, or CONTINUE WITH THE REMAINING ones (label chosen by the user, 2026-10-12). The recorded
   form keeps whichever option was taken. */
const partialStop = ({arriving, note, done, pending, noun, artifact, live})=> agentMsg(`<div class="chatBubble${arriving?' chatBubble--settling':''}">${note}
    <div class="bubble-q">${done} ${noun} are ready for your review.</div>
    ${objectCard('edit',artifact)}
    <div class="bubble-q">Here's where your ${noun.slice(0,-1)} updates stand:</div>
    <div class="standTbl">
      <div class="standTbl__row"><span>Completed</span><span>${done}</span></div>
      <div class="standTbl__row"><span>Pending</span><span>${pending}</span></div>
    </div>
    <div class="bubble-q">What would you like to do next?</div>
    <div class="replyStack">
      ${live ? replyBtn(`Keep ${done} updated ${noun}`,'s3Keep') + replyBtn(`Rollback ${done} updated ${noun}`,'s3Rollback') + replyBtn(`Continue with the remaining ${pending} ${noun}`,'s3Complete')
             : recordedReply(resumeText || `Keep ${done} updated ${noun}`)}
    </div></div>`);
const S3_SUMMARY = (live=true, arriving=false)=> partialStop({arriving, note:S3_STOPPED(), done:S3_DONE, pending:S3_PENDING, noun:'placements', artifact:S3_ARTIFACT, live});

scenes.s3 = (state={})=>{
  const phase = state.phase;
  if(phase==='bootfull'){
    return `<div class="content">${topbar(`<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>`)}
      <div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  let b = SP_USER();
  if(phase!=='msg-user') b += SP_CREATED();
  if(phase==='msg-user' || phase==='msg-created') return spC1(b, spComposer({running:true}));
  if(phase==='planning') return spC1(b + agentLoader('Creating a plan', state.tasks||[]), spComposer({running:true}));
  if(phase==='plan')     return spC1(b + S2_PLAN(0,-1,-1,false), spComposer({}));
  { const t = planThinkPhase('s3', state, b); if(t) return t; }

  { const t = taskPhase('s3', state, b); if(t) return t; }
  /* s3 MATCHES s2 UP TO THE APPROVAL OF THE FIRST OBJECT (user, 2026-10-12):
     task 1 is done and recorded, task 2 is the one interrupted. Unlike s2 the
     stop lands at the SKELETON (doing), after the Thinking beat over task 1's
     artifact. There is no "Setting things up" screen any more: the canvas
     already shows the previous artifact while the agent thinks. */
  const RUNNING = 1;
  const history = b + S2_PLAN(1,-1,-1,true) + S2_TASK1();

  /* ---- C2 ----
     THE CANVAS PLAYS TWO BEATS BEFORE THE STOP (user, 2026-10-07:
     "initially show setting things up loader in canvas then the skeleton
     loader. if stop is triggered at skeleton loader then this is the
     flow"). `setup` is the progress screen, `working` the skeleton table
     that follows it — the stop belongs to the second. */
  if(phase==='setup' || phase==='working' || phase==='pausing'){
    const paused = phase==='pausing';
    const body = phase==='setup'
      ? settingUpCanvas(state.tasks||[], false)
      /* NO TITLE WHILE THE TABLE IS STILL A SKELETON (user, 2026-10-07:
         "no title at this state") — the artifact is not named until it
         exists; a heading over placeholder rows claims a result that has
         not been produced yet. The title arrives with the real rows. */
      : `<div class="pad">${skeletonCanvas()}</div>`;
    const canvas = `<div class="content">${topbar(S3_CRUMB_C2)}
      <div class="scroll${phase==='setup'?' scroll--center':''}">${body}</div></div>`;
    return canvas + aiPanel({
      step:`${RUNNING+1}.  ${S2_TASKS[RUNNING]}`, stepLoading:!paused, stepStopped:paused,
      body: history + agentLoader(paused?'Stopping':'Doing some tasks', state.tasks||[], false, paused),
      composerHTML: spComposer({running:!paused}),
    });
  }

  /* ---- STOPPED ----
     s3 STAYS IN C2, unlike s2: the run produced real placements, so the
     canvas has something to show — the four that completed, highlighted,
     under the partial artifact's name. The tracker reads as an
     interruption rather than naming the task. */
  /* `--arriving` plays the table's entrance once, on the render that
     introduces it — not on the later beats that re-render the panel */
  const arriving = phase==='resolving' ? ' pad--arriving' : '';
  const hl = state.hl!==false;
  const canvas = `<div class="content s4Content">${topbar(S3_CRUMB_C2)}<div class="scroll"><div class="pad${arriving}">
    <h2 class="page-h">${S3_ARTIFACT}</h2>${s3PlacementTable(hl)}</div></div>${hlFoot(hl,false)}</div>`;

  /* ---- SETTLING ----
     A BEAT OF LOADING BETWEEN THE STOP AND THE RESULT (user, 2026-10-07:
     "before we reach here and after stop is triggered, give a couple of
     seconds of loading before we show the artifact and ai response").
     Stopping does not instantly reveal a finished artifact: the agent has
     to work out what it actually completed before it can show four rows
     and a count. The canvas keeps its skeleton and the panel keeps a
     loader, so the pause reads as the agent taking stock rather than the
     screen being empty. */
  if(phase==='settling'){
    const settlingCanvas = `<div class="content">${topbar(S3_CRUMB_C2)}
      <div class="scroll"><div class="pad">${skeletonCanvas()}</div></div></div>`;
    return settlingCanvas + aiPanel({
      step:'&lt;interruption notification&gt;', stepStopped:true,
      body: history + agentLoader('Checking what completed', state.tasks||[], true),
      composerHTML: spComposer({}),
    });
  }
  /* ---- THE CANVAS RESOLVES FIRST ----
     A MOMENT'S DIFFERENCE BETWEEN THE TWO PANES (user, 2026-10-07:
     "canvas and conversation update exactly together. give just a
     moment's difference to show animation effect?"). The table and the
     agent's response used to land in the same render, so the whole screen
     changed at once and nothing read as movement. The canvas resolves
     first — the placements appear — and the response follows a beat
     later, which is also the honest order: the agent can only report on
     work once that work is on screen. */
  if(phase==='resolving'){
    return canvas + aiPanel({
      step:'&lt;interruption notification&gt;', stepStopped:true,
      body: history + agentLoader('Checking what completed', state.tasks||[], true),
      composerHTML: spComposer({}),
    });
  }
  if(phase==='stopped'){
    return canvas + aiPanel({
      step:'&lt;interruption notification&gt;', stepStopped:true,
      body: history + S3_SUMMARY(true, state.recall===false),
      composerHTML: spComposer({draft:state.draft||''}),   // late stop: no recall affordance
    });
  }
  if(phase==='resumed'){
    return canvas + aiPanel({
      step:'&lt;interruption notification&gt;', stepStopped:true,
      /* the recorded form keeps the choice that was taken and drops the
         one that was not */
      body: history + S3_SUMMARY(false) + RESENT_IF_TYPED() + agentLoader('Doing some tasks', state.tasks||[]),
      composerHTML: spComposer({running:true}),
    });
  }
  return canvas + aiPanel({body:history, composerHTML:spComposer({})});
};


/* ============================================================
   SCENARIO 4 — APPLYING CHANGES (user, 2026-10-12, with the reference frame
   and the long voice note). A FULL flow, not a single stop point: find
   experiences by headline → (thinking, C1) → C2 loader → results table →
   the user selects rows and asks for a content change → plan → applying,
   row by row. EVERY running beat is stoppable: stop at thinking in C1,
   stop at thinking in C2 (the C2 loader or the planning loader), and stop
   at doing (applying, 3 of 7 done). The plan has ONE content task, not one
   per field (user: "there should not be two separate steps… both of these
   things are to happen together"); the audience add is listed as the task
   after it and is never reached.
   ============================================================ */
const S4_PROJECT = 'QB Payroll experiences';
const S4_CRUMB_C1 = `<span>Home</span> <span class="sep">/</span> <span>${S4_PROJECT}</span>`;
const S4_CRUMB_C2 = `<span>Home</span> <span class="sep">/</span> <span>Change order - ${S4_PROJECT}</span>`;
const S4_CHANGE = 'Change the headline to "Adaptable Solutions for Success" and the body copy to "Save time with smart reminders" for these experiences, and add the Medium Price Sensitivity audience';
const S4_TASKS = ['Change headline and body copy', 'Add audience "Medium Price Sensitivity"'];
const S4_TOTAL = 7, S4_DONE = 3;
/* the autopilot picks SOME, not all (user, 2026-10-12: "don't select all. select
   some"); applying, the artifact and the summary follow the selection */
const S4_PICK = [0,1,2,3,4];
const S4_OLD = {head:'Flexible solutions for growth', body:'Save time with reminders, and less manual work.'};
const S4_NEW = {head:'Adaptable Solutions for Success', body:'Save time with smart reminders'};
/* OUR table structure, not the reference's two-line cell (user: "we will
   use our structure where we have experience ID, experience name, status,
   and then maybe we show headline") */
const S4_COLS = ['Experience','Experience ID','Status','Headline','Body copy','Last updated'];
const S4_ROWS = [
  ['ELM9684-IPD-QBOPayroll','1113460','Published'],['ELM9533-IPD-QBOPayroll','1113472','Draft'],
  ['ELM4217-IPD-QBOPayroll','1113488','Published'],['ELM7856-IPD-QBOPayroll','1113491','Draft'],
  ['ELM3041-IPD-QBOPayroll','1113507','Published'],['ELM6198-IPD-QBOPayroll','1113515','Published'],
  ['ELM8724-IPD-QBOPayroll','1113529','Draft'],
];
const S4_ARTIFACT = `Changed headline and body copy - ${S4_PROJECT}`;
const S4_ARTIFACT_PARTIAL = `Changed headline and body copy (partial) - ${S4_PROJECT}`;
const SELCTX_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 3v5.5A3.5 3.5 0 0 0 7.5 12H14" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round"/><path d="M10.8 8.4 14.4 12l-3.6 3.6" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const selThread = (n)=>`<div class="selCtx">${SELCTX_ICON}<span>Selected ${n} experience${n===1?'':'s'}</span></div>`;

/* THE APP'S OWN TABLE (.tbl-wrap/.tbl, .cbcol/.cb, td.edited, .skel rows).
   mode: 'skeleton' (all rows loading) | 'pick' (live checkboxes) |
   'applying' (first `applied` rows changed, the rest skeleton) |
   'result' (first `applied` rows changed, the rest as they were). */
/* `frozen`: a pick list that is no longer being picked (the ask has been
   sent) keeps its ticks but takes no clicks. A RESULT TABLE HAS NO SELECTION
   (user, 2026-10-12: "why are these checkboxes selected?"): the artifact is
   something to review, not a selection the user made. */
/* `revealed`: THE RESULTS ARRIVE ONE ROW AT A TIME (user, 2026-10-12: "show
   the search results also appear one after the other, a very mature loading
   state"). Rows past `revealed` are still skeleton; the newest real row plays
   a short entrance (`landing`). */
function s4Table({mode, applied=0, selected=new Set(), frozen=false, revealed=S4_ROWS.length, landing=false, rowsIdx=null, hl=true}){
  /* applying / result tables list ONLY the selected experiences; `hl` is the
     footer's "Highlight changes" toggle */
  const idx = rowsIdx || S4_ROWS.map((_,i)=>i);
  const pick = mode==='pick';
  const allOn = pick && selected.size===S4_ROWS.length;
  /* NO `disabled` ANYWHERE (user, 2026-10-12: "show normal selection, not
     disabled or whatever this new weird state is"): a frozen or result table
     draws ordinary checkboxes and is made inert in wire() instead, so the
     boxes never go faded. */
  const head = `<th class="cbcol"><input type="checkbox" class="cb"${pick&&!frozen?` data-selall${allOn?' checked':''}`:`${pick&&allOn?' checked':''}`}></th>` + S4_COLS.map(c=>`<th><span class="th-inner">${c}<span class="sort">${I.sortsm}</span></span></th>`).join('');
  const skelRow = (i)=>`<tr><td class="cbcol"><span class="skel skel--check"></span></td>${S4_COLS.map((c,j)=>`<td><span class="skel" style="width:${50+((i*7+j*11)%40)}%"></span></td>`).join('')}</tr>`;
  const body = idx.map((i,k)=>{
    const [name,id,status] = S4_ROWS[i];
    if(mode==='skeleton' || (mode==='applying' && k>=applied) || (pick && i>=revealed)) return skelRow(i);
    const done = (mode==='applying'||mode==='result') && k<applied;
    const cb = pick ? `<input type="checkbox" class="cb"${frozen?'':` data-selrow="${i}"`}${selected.has(i)?' checked':''}>` : `<input type="checkbox" class="cb">`;
    const rowIn = landing && i===revealed-1 ? ' class="rowIn"' : '';
    return `<tr${rowIn}${pick?` data-selrowtr="${i}"`:''}><td class="cbcol">${cb}</td><td>${name}</td><td>${id}</td><td>${badge(status)}</td>
      <td${done&&hl?' class="edited"':''}>${done?S4_NEW.head:S4_OLD.head}</td><td${done&&hl?' class="edited"':''}>${done?S4_NEW.body:S4_OLD.body}</td><td>06/30 18:30PST</td></tr>`;
  }).join('');
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}
/* "Highlight changes" is a WORKING toggle, never disabled (user, 2026-10-12:
   "highlight changes checkbox needs to work, right?") */
/* `veiled`: while changes apply the footer sits under the same film as the
   table, toggle included (user, 2026-10-12: "highlight changes should also be
   under that, no?"). The film lifts with the stop. */
const s4Foot = (n, hl, total=S4_TOTAL, hlOn=true, veiled=false)=> `<div class="selbar selbar--footer${veiled?' selbar--veiled':''}">${n} of ${total} selected${hl?`<span class="selbar__vd"></span><label class="hlToggle"><input type="checkbox" data-hlchanges${hlOn?' checked':''}> Highlight changes</label>`:''}
  <div class="acts"><span class="act ${n?'act--on':'act--off'}">${I.keep} Keep (${n})</span><span class="act ${n?'act--on':'act--off'}">${I.minus} Remove (${n})</span><span class="act act--view ${n?'act--on':'act--off'}">${I.eye} View (${n})</span></div>${veiled?'<div class="s4Veil"></div>':''}</div>`;
/* the stop control is ICON ONLY (user, 2026-10-12: "remove label. use only icon") */
const s4StopBtn = ()=> `<button class="s4Btn s4Btn--icon" data-spstop title="Stop" aria-label="Stop">${I.stop}</button>`;
const s4Pill = (n,paused,total)=> `<div class="s4Pill">${paused?`<span class="agentTasks__paused">${I.stop}</span><b>Stopping</b>`:`<img class="spinnerII" src="figma/spinner-ii.gif" alt="" width="16" height="16"><b>Applying changes ${n}/${total}</b><span class="s4Pill__sub">You can continue with other tasks</span>${s4StopBtn()}`}</div>`;
/* `veil`: WHILE CHANGES APPLY THE TABLE IS UNDER A TRANSLUCENT LAYER AND NOT
   INTERACTIVE (user, 2026-10-12, from the reference: "these experiences when
   loading have a translucent layer making it non interactive"). The rows
   stay readable, so you can watch them fill, but nothing in them takes a click. */
const s4Pager = ()=> `<div class="pager"><span>1-${S4_TOTAL} of ${S4_TOTAL} items</span><span class="nav"><span class="is-off">${I.chevL}</span><span>Page</span><span class="box">1</span><span>of 1</span><span class="is-off">${I.chevR}</span></span></div>`;
const s4Canvas = ({crumb=S4_CRUMB_C1, title='', table, pill='', foot='', veil=false, pager=false})=> `<div class="content s4Content">${topbar(crumb)}
  <div class="scroll"><div class="pad">
    <div class="s4Body${veil?' s4Body--veiled':''}">${title?`<h2 class="page-h">${title}</h2>`:''}
      <div class="toolbar"><div class="search">${I.search}<span>Search</span></div><span class="iconbtn">${I.sliders}</span></div>
      ${table}${pager?s4Pager():''}${veil?'<div class="s4Veil"></div>':''}
    </div></div></div>${pill}${foot}</div>`;
/* THE STOP PLAYS OUT INSIDE THE PROGRESS CARD (user, 2026-10-12: "we were at this
   stage, so rich; accommodate stopping also"). It used to vanish on stop and be
   replaced by a plain loader. mode: running → pausing ("Stopping") → settling
   ("Checking what completed") → stopped ("Stopped at n/total", kept as the record). */
const s4Card = (n,mode,total)=>{
  const spin = `<img class="spinnerII" src="figma/spinner-ii.gif" alt="" width="18" height="18">`;
  const inner = mode==='pausing'  ? `<span class="agentTasks__paused">${I.stop}</span><span>Stopping</span>`
              : mode==='settling' ? `${spin}<span>Checking what completed</span>`
              : mode==='stopped'  ? `<span class="s4Apply__dot">${ATTENTION_ICON}</span><span>Stopped at ${n}/${total}</span>`
              : `${spin}<span>Applying changes ${n}/${total}</span>${s4StopBtn()}`;
  return agentMsg(`<div class="chatBubble">Changing headline and body copy…<div class="s4Apply s4Apply--${mode}">${inner}</div></div>`);
};

/* conversation pieces */
const S4_CREATED = ()=> agentMsg(disclosure('Read your request, created a project',['Read your request','Looking up IPD experiences','Setting up the project'])
  + `<div class="chatBubble">I have created "<span class="chatBubble__name">${S4_PROJECT}</span>" project for you.</div>`);
const S4_RESULTS = `IPD experiences - "${S4_OLD.head}"`;
/* THE RESULTS ARE AN OBJECT IN THE CONVERSATION (user, 2026-10-12: "when
   search results is created where is the object?"): same shape as every
   other search in the prototypes, a settled disclosure and a results card. */
const S4_FOUND = ()=> agentMsg(disclosure('Searched IPD experiences, compiled the results',['Looking up IPD experiences','Matching the headline','Compiling the results'])
  + `<div class="chatBubble">I found ${S4_TOTAL} IPD experiences with that headline.${objectCard('search',S4_RESULTS)}<div class="bubble-q">Select the ones you want to work with.</div></div>`);
/* THE SELECTION THREAD IS ITS OWN TURN (`.convoTurn`, as in the sibling builds):
   60px of its own padding above the stroke, so the context line never sits on
   the previous message's timestamp (user, 2026-10-12: "fix this spacing!!!"). */
/* `.selTurn` = the 60px top padding only. `.convoTurn` also FILLS the viewport
   (min-height 100%+40px), which left an empty tail before the plan card and
   pushed the context line out of the fold (user, 2026-10-12: "why is
   conversation empty?" / "why do I not see select n experiences"). */
const S4_ASK = (n)=> `<div class="selTurn">${selThread(n)}${userBubble(S4_CHANGE)}</div>`;
const S4_STOPPED = ()=> `<div class="infoNote">${ATTENTION_ICON}<span>I've stopped partway through applying your changes</span></div>`;
const S4_SUMMARY = (live=true, arriving=false, total=S4_TOTAL)=> partialStop({arriving, note:S4_STOPPED(), done:S4_DONE, pending:total-S4_DONE, noun:'experiences', artifact:S4_ARTIFACT_PARTIAL, live});

/* WHAT AN EARLIER STOP LEFT IN THE TRANSCRIPT. A stop at thinking writes a
   note and, on resume, the resent prompt; later phases must carry both. One
   slot per place a stop can land before the applying step. Reset per run. */
let s4Log = {search:'', open:'', plan:''};
const S4_THINK_SUBS = ['Looking up IPD experiences','Matching the headline','Collecting the results'];
const S4_PLAN_SUBS  = PLAN_SUBS;

scenes.s4 = (state={})=>{
  const phase = state.phase;
  const sel = new Set(state.selected||[]);
  const n = sel.size;
  if(phase==='bootfull'){
    return `<div class="content">${topbar(`<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>`)}
      <div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  let b = SP_USER();
  if(phase!=='msg-user') b += S4_CREATED();
  if(phase==='msg-user' || phase==='msg-created') return spC1(b, spComposer({running:true}), S4_CRUMB_C1);

  /* ---- C1: thinking about the search — stop here = stopped at thinking, C1 ---- */
  b += s4Log.search;
  if(phase==='searching')  return spC1(b + agentLoader('Thinking', state.tasks||[]), spComposer({running:true}), S4_CRUMB_C1);
  if(phase==='pausing-c1') return spC1(b + agentLoader('Stopping', state.tasks||[], false, true), spComposer({}), S4_CRUMB_C1);
  if(phase==='stopped-c1'){
    return spC1(b + SP_STOPPED('looking up your experiences', state.recall===false),
      spComposer({recall:(state.recall!==false && !state.draft && !state.dismissed)?PROMPT():'', draft:state.draft||''}), S4_CRUMB_C1);
  }

  /* ---- C2 opens: the loader first, then the results ---- */
  const resultsCanvas = (mode, extra={})=> s4Canvas({crumb:S4_CRUMB_C1, title:mode==='skeleton'?'':`IPD experiences with the headline "${S4_OLD.head}"`, table:s4Table({mode, selected:sel}), foot:mode==='skeleton'?'':s4Foot(n,false), pager:mode!=='skeleton', ...extra});
  b += s4Log.open;
  if(phase==='opening' || phase==='landing' || phase==='pausing-c2' && state.from==='opening' || phase==='stopped-c2' && state.from==='opening'){
    const paused = phase!=='opening' && phase!=='landing';
    /* rows already on screen stay through a pause or a stop */
    const revealed = state.revealed||0;
    const landingCanvas = revealed ? s4Canvas({crumb:S4_CRUMB_C1, title:`IPD experiences with the headline "${S4_OLD.head}"`, table:s4Table({mode:'pick', frozen:true, revealed, landing:phase==='landing'}), foot:s4Foot(0,false)}) : resultsCanvas('skeleton');
    const body = phase==='stopped-c2' ? SP_STOPPED('loading your experiences', state.recall===false)
               : agentLoader(paused?'Stopping':'Thinking', state.tasks||[], false, paused);
    const composer = phase==='stopped-c2'
      ? spComposer({recall:(state.recall!==false && !state.draft && !state.dismissed)?PROMPT():'', draft:state.draft||''})
      : spComposer({running:!paused});
    return landingCanvas + aiPanel({body:b + body, composerHTML:composer});
  }
  b += S4_FOUND();
  if(phase==='results'){
    return resultsCanvas('pick') + aiPanel({body:b, composerHTML:spComposer({draft:state.draft||''})});
  }

  /* ---- the ask, then the plan ---- */
  b += S4_ASK(n) + s4Log.plan;
  /* veiled while planning / thinking; clear once stopped or resting on the plan */
  const pickedCanvas = (veiled)=> s4Canvas({crumb:S4_CRUMB_C2, title:`IPD experiences with the headline "${S4_OLD.head}"`, table:s4Table({mode:'pick', selected:sel, frozen:true}), foot:s4Foot(n,false,S4_TOTAL,true,veiled), pager:true, veil:veiled});
  if(phase==='planning' || phase==='pausing-c2' || phase==='stopped-c2'){
    const paused = phase!=='planning';
    /* a stop during the post-plan Thinking keeps the recorded plan on screen */
    const fromThink = state.from==='thinking';
    const body = (fromThink ? S2_PLAN(0,-1,-1,true,S4_TASKS) : '')
               + (phase==='stopped-c2' ? SP_STOPPED(fromThink?'before applying your changes':'planning your changes', state.recall===false)
               : agentLoader(paused?'Stopping':'Creating a plan', state.tasks||[], false, paused));
    const composer = phase==='stopped-c2'
      ? spComposer({recall:(state.recall!==false && !state.draft && !state.dismissed)?S4_CHANGE:'', draft:state.draft||''})
      : spComposer({running:!paused});
    return pickedCanvas(phase!=='stopped-c2') + aiPanel({body:b + body, composerHTML:composer});
  }
  if(phase==='plan')     return pickedCanvas(false) + aiPanel({body:b + S2_PLAN(0,-1,-1,false,S4_TASKS), composerHTML:spComposer({})});
  if(phase==='thinking') return pickedCanvas(true) + aiPanel({body:b + S2_PLAN(0,-1,-1,true,S4_TASKS) + agentLoader('Thinking', state.tasks||[]), composerHTML:spComposer({running:true})});

  /* ---- applying: task 1 runs row by row; the stop lands at 3/7 ---- */
  const applied = state.applied===undefined ? S4_DONE : state.applied;
  const history = b + S2_PLAN(0,0,-1,true,S4_TASKS);
  const tracker = `1.  ${S4_TASKS[0]}`;
  const picked = [...sel].sort((a,b)=>a-b);
  const hl = state.hl!==false;
  if(phase==='applying' || phase==='pausing'){
    const paused = phase==='pausing';
    return s4Canvas({crumb:S4_CRUMB_C2, title:S4_ARTIFACT, table:s4Table({mode:'applying', applied, rowsIdx:picked, hl}), pill:s4Pill(applied,paused,n), foot:s4Foot(0,true,n,hl,true), veil:true})
      + aiPanel({step:tracker, stepLoading:!paused, stepStopped:paused, body:history + s4Card(applied,paused?'pausing':'running',n), composerHTML:spComposer({running:!paused})});
  }
  const stoppedCanvas = (arriving, appliedN=S4_DONE)=> s4Canvas({crumb:S4_CRUMB_C2, title:appliedN>=n?S4_ARTIFACT:S4_ARTIFACT_PARTIAL, table:s4Table({mode:'result', applied:appliedN, rowsIdx:picked, hl}), foot:s4Foot(0,true,n,hl)})
    .replace('<div class="pad">', `<div class="pad${arriving?' pad--arriving':''}">`);
  const interrupted = {step:'&lt;interruption notification&gt;', stepStopped:true};
  if(phase==='settling'){
    return s4Canvas({crumb:S4_CRUMB_C2, title:S4_ARTIFACT, table:s4Table({mode:'applying', applied:S4_DONE, rowsIdx:picked, hl}), foot:s4Foot(0,true,n,hl,true), veil:true})
      + aiPanel({...interrupted, body:history + s4Card(S4_DONE,'settling',n), composerHTML:spComposer({})});
  }
  if(phase==='resolving'){
    return stoppedCanvas(true) + aiPanel({...interrupted, body:history + s4Card(S4_DONE,'settling',n), composerHTML:spComposer({})});
  }
  if(phase==='stopped'){
    return stoppedCanvas(false) + aiPanel({...interrupted, body:history + s4Card(S4_DONE,'stopped',n) + S4_SUMMARY(true, state.recall===false, n),
      composerHTML:spComposer({draft:state.draft||''})});   // late stop: the three options are the affordance
  }
  if(phase==='resumed'){
    return stoppedCanvas(false, state.applied!==undefined?state.applied:S4_DONE) + aiPanel({...interrupted, body:history + s4Card(S4_DONE,'stopped',n) + S4_SUMMARY(false,false,n) + RESENT_IF_TYPED() + agentLoader('Doing some tasks', state.tasks||[]), composerHTML:spComposer({running:true})});
  }
  return stoppedCanvas(false) + aiPanel({body:history, composerHTML:spComposer({})});
};

/* the canvas skeleton that sits behind every C2 state here — the block is
   about the conversation, so the canvas stays a loading shell throughout */
/* THE SKELETON MIRRORS THE SCREEN IT IS STANDING IN FOR (user,
   2026-10-07: "richer loader please", with the reference). A flat grid of
   identical bars reads as "loading something"; this reads as "loading
   THIS" — a block of summary lines above, then a table with its own
   leading column, header cells and per-column cell widths, because the
   real placement table has a narrow name column and short value columns.
   Widths are deliberately uneven: real content is uneven, and bars of one
   length look like a progress meter rather than text. */
function skeletonCanvas(){
  /* the summary lines above the table — long, long, medium, long, short */
  const leadW = ['22%','92%','68%','92%','14%'];
  const lead = leadW.map(w=>`<span class="cfskel skelLine" style="width:${w}"></span>`).join('');
  /* per-column widths, so each column keeps its own rhythm down the table */
  const cellW = [['62%','74%','55%','70%','50%','72%','58%'],
                 ['40%','44%','42%','40%','40%','38%','42%'],
                 ['30%','32%','28%','30%','26%','30%','28%'],
                 ['20%','20%','18%','20%','22%','18%','20%'],
                 ['28%','30%','26%','30%','24%','28%','26%']];
  const rows = Array.from({length:7},(_,r)=>
    `<div class="skelRow"><span></span>${cellW.map(col=>
      `<span class="cfskel" style="width:${col[r]};height:10px"></span>`).join('')}</div>`).join('');
  const head = `<div class="skelTbl__head"><span></span>${
    ['58%','48%','52%','46%','50%'].map(w=>`<span class="cfskel" style="width:${w};height:10px"></span>`).join('')}</div>`;
  return `<div class="skelLead">${lead}</div>
    <div class="skelTbl">${head}${rows}</div>`;
}


/* ============================================================
   RUNNERS + ROUTER
   ============================================================ */
let timers = [];
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }
let scenario = 's1';
/* WHAT THE USER SENT TO RESUME. It has to outlive the render that created
   it: `runSubs` re-renders on every substep tick with only {phase,tasks},
   so an answer carried in scene state is lost on the first tick. */
let resumeText = '';
let resumeFile = true;               // was the brief still attached when resent?
/* the resent turn, with the attachment if it went back with the prompt */
/* A CHIP REPLY INSIDE AN AI CARD IS RECORDED IN THE CARD, NEVER ALSO AS A USER
   PROMPT BUBBLE (user, 2026-10-12: "when do we give that as a new user prompt?
   anything given in AI chip as a response?"). Only a composer send produces the
   resent bubble; `resumeVia` says which it was. */
let resumeVia = 'composer';
/* LOCAL vs THE GITHUB PROTOTYPE (user, 2026-10-12): on the published build the three
   partial-stop options (Keep / Rollback / Continue) are shown but take no action, so
   reviewers are not led further; locally they stay fully interactive. One codebase:
   the host decides. `?remote=1` previews the published behaviour on localhost. */
const IS_LOCAL = (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol==='file:')
  && !new URLSearchParams(location.search).has('remote');
const RESENT_IF_TYPED = ()=> resumeVia==='composer' ? SP_RESENT() : '';
/* a resend carries the prompt's own attachment (see HAS_FILE / FILE_NAME); s4 has none */
const SP_RESENT = ()=> userBubble((resumeFile && HAS_FILE())
  ? `<span class="bubbleFile"><span class="bubbleFile__ico">${icon('note',14)}</span>${FILE_NAME()}</span><br>${resumeText||PROMPT()}`
  : (resumeText||PROMPT()));
let current  = {name:'home', state:{}};
const TYPE_MS = 18;

function render(scene, state){
  current = {name:scene, state};
  /* ANY RENDER NOT DRIVEN BY AN ARROW DROPS THE CACHED ARROW INDEX (2026-10-12).
     A button click (Looks good, Approved, Proceed, send) or a runner's tick
     changes what is on screen without going through stepTo, and a stale index
     made the next arrow count from where the user HAD been rather than from
     what they can see. Re-deriving from the screen every time is what
     keyIdxFromCurrent and PHASE_ALIAS exist for. */
  if(!stepping) keyIdx = -1;
  const main = $('#main');
  main.innerHTML = scenes[scene](state);
  wire(scene, state);
  const b = main.querySelector('.ai__body'); if(b) b.scrollTop = b.scrollHeight;
  const cc = main.querySelector('.content--centered .scroll'); if(cc) cc.scrollTop = cc.scrollHeight;
}
function go(name, state={}){ clearTimers(); if(!stepping) clearKeyIdx(); render(name, state); }

function typeInto(input, text, done){
  if(!input){ done&&done(); return; }
  input.classList.add('promptBox__input--filled');
  input.innerHTML = '<span class="promptBox__caret"></span>';
  let i = 0;
  const tick = ()=>{
    i++; input.textContent = text.slice(0,i);
    if(i<text.length) timers.push(setTimeout(tick,TYPE_MS));
    else { input.innerHTML = text + '<span class="promptBox__caret"></span>'; timers.push(setTimeout(()=>done&&done(),650)); }
  };
  timers.push(setTimeout(tick,140));
}

/* tick a loader's substeps across `dur`, then call done() */
/* `extra` rides along on every tick (e.g. s4's `selected`), so a loader never
   drops state the scene needs (user, 2026-10-12: "0 of 7 selected" during planning) */
function runSubs(scene, phase, label, subs, dur, done, extra={}){
  const tick=(a)=>render(scene,{...extra, phase,tasks:subs.map((l,j)=>({label:l,state:j<a?'done':j===a?'active':'idle'}))});
  tick(0);
  const slot=(dur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1), Math.round(slot*(i+1)))));
  /* THE FLOW KEEPS RUNNING FROM WHEREVER YOU LAND — arrows navigate, they
     do not freeze (user, 2026-10-07: "arrow key usage still doesn't
     automatically start moving the flow. it should not block me").
     An earlier fix suppressed this `done` for stepped-to loaders to stop
     the index desyncing; that cured the bounce by blocking the flow,
     which is worse. The desync is fixed in `advanceKeyIdx` instead: when
     a runner advances the screen on its own, the cached index follows it,
     so the next arrow press still moves from what you can actually see. */
  if(done) timers.push(setTimeout(done, dur));
}

/* ---- INTAKE (shared by all three scenarios) ----
   boot "Creating a project" → C1 prompt → created → then each scenario's
   own first loader. The stop is never on a timer: the flow runs until the
   USER stops it, which is the whole point of the block. */
function runIntake(scene, after){
  resumeText = ''; resumeFile = true;  // a fresh run carries nothing over
  taskLog = {thinking:'', t1:'', t2:''};
  render(scene,{phase:'bootfull'});
  const a=2400, b=a+600, ldr=b+900;
  timers.push(setTimeout(()=>render(scene,{phase:'msg-user'}),a));
  timers.push(setTimeout(()=>render(scene,{phase:'msg-created'}),b));
  timers.push(setTimeout(after, ldr));
}

/* s1 — straight into "Doing some tasks" and stay there, running, until stopped */
/* THE WORKING LOOP IS ITS OWN FUNCTION so the intake and the arrow keys
   share ONE definition — arrowing into a running state must start the same
   motion the timed run would, not a frozen copy of it. */
function runS1Working(){
  runSubs('s1','working','Doing some tasks',SP_TASKS,4800,
    /* it keeps working: hold on the last substep so there is always
       something to stop. Nothing advances on its own. */
    ()=>render('s1',{phase:'working',tasks:SP_TASKS.map((l,j)=>({label:l,state:j<2?'done':'active'}))}));
}
function runS1(){ runIntake('s1', runS1Working); }
/* s1 resume — the prompt was put back and sent; the tasks pick up again */
function runS1Resume(){
  runSubs('s1','resumed','Doing some tasks',SP_TASKS,4200,
    ()=>render('s1',{phase:'resumed',tasks:SP_TASKS.map(l=>({label:l,state:'done'}))}));
}

/* s2 — intake → plan card → (user confirms) → C2, task 1 running */
function runS2Planning(){
  runSubs('s2','planning','Creating a plan',PLAN_SUBS,3600, ()=>go('s2',{phase:'plan'}));
}
function runS2(){ runIntake('s2', runS2Planning); }
/* task 3 running on the canvas — it HOLDS on the last substep so there
   is always something to stop, like s1's working loop */
const S2_HOLD = ()=> S2_SUBS.map((l,j)=>({label:l,state:j<2?'done':'active'}));
/* tasks 1 and 2: loader, then the result waiting for the user's approval */
const THINK_SUBS = ['Reading the plan','Preparing the changes','Getting started'];
/* "Looks good" → a couple of seconds of Thinking in C1 → task 1 (s2 AND s3) */
function runPlanThinking(scene){
  runSubs(scene,'thinking','Thinking',THINK_SUBS,2800, ()=>runTask(scene,1));
}
const runS2Thinking = ()=> runPlanThinking('s2');
function runTask(scene, n){
  const work = ()=> runSubs(scene,'t'+n,'Doing some tasks',TASK_SUBS,2600, ()=>render(scene,{phase:'t'+n+'ok'}));
  /* task 2 thinks over task 1's artifact before the skeleton appears */
  if(n===2) runSubs(scene,'t2think','Thinking',THINK_SUBS,2400, work); else work();
}
function runS2Task(){
  runSubs('s2','working','Doing some tasks',S2_SUBS,5200,
    ()=>render('s2',{phase:'working',tasks:S2_HOLD()}));
}
function runS2Resume(){
  runSubs('s2','resumed','Doing some tasks',S2_SUBS,4200,
    ()=>render('s2',{phase:'resumed',tasks:S2_HOLD()}));
}

/* s3 — same up to the plan, then task 2 (building) is what gets stopped */
function runS3Planning(){
  runSubs('s3','planning','Creating a plan',PLAN_SUBS,3600, ()=>go('s3',{phase:'plan'}));
}
function runS3(){ runIntake('s3', runS3Planning); }
/* s3 is the same change order as s2, so it ticks the same substeps */
const S3_SUBS = S2_SUBS;
/* TWO CANVAS BEATS: the "Setting things up" progress screen, then the
   skeleton table the placements are being built into. The stop belongs to
   the SECOND — that is the state the user's frame shows being
   interrupted. The substep list runs across both so the panel's loader
   never restarts. */
const S3_HOLD = ()=> S3_SUBS.map((l,j)=>({label:l,state:j<2?'done':'active'}));
/* Approve on object 1 → Thinking over the billing artifact (t2think) → the
   skeleton, ticking and holding so there is always something to stop. The
   old "Setting things up" beat is gone (user, 2026-10-12): the previous
   artifact is on the canvas while the agent thinks, which does that job. */
function runS3Working(){
  runSubs('s3','working','Doing some tasks',S3_SUBS,4200,
    ()=>render('s3',{phase:'working',tasks:S3_HOLD()}));
}
function runS3Task(){
  runSubs('s3','t2think','Thinking',THINK_SUBS,2400, runS3Working);
}
function runS3Resume(){
  runSubs('s3','resumed','Building the experiences',S3_SUBS,4200,
    ()=>render('s3',{phase:'resumed',tasks:S3_SUBS.map(l=>({label:l,state:'done'}))}));
}


/* s4 runners. Each running beat is its own function so the arrow keys and
   a resume can re-enter it (same rule as s1's working loop). */
function runS4(){ s4Log = {search:'', open:'', plan:''}; runIntake('s4', runS4Search); }
/* C1 thinking. It used to HOLD until the user stopped it, so that stopping
   at thinking in C1 was always available; held, it just read as stuck (user,
   2026-10-12: "it is not moving forward from here?"). Now it runs its three
   steps (~4s, the window in which a stop lands in C1) and moves on to C2 by
   itself. */
function runS4Search(){
  runSubs('s4','searching','Thinking',S4_THINK_SUBS,4200, runS4Open);
}
/* after a resume from the C1 stop: a couple of seconds of the same thinking,
   then C2 opens (user: "in a couple of seconds, we move to C2 where you show
   the loader, and then the table") */
function runS4SearchResume(){
  runSubs('s4','searching','Thinking',S4_THINK_SUBS,2600, runS4Open);
}
function runS4Open(){
  runSubs('s4','opening','Thinking',S4_THINK_SUBS,3000, runS4Landing);
}
/* the rows stream in under a still-running "Thinking"; the found card lands
   only once the last row has */
const S4_ROW_MS = 260;
function runS4Landing(){
  const done = S4_THINK_SUBS.map(l=>({label:l,state:'done'}));
  const step=(k)=>render('s4',{phase:'landing',revealed:k,tasks:done});
  step(1);
  for(let k=2;k<=S4_ROWS.length;k++) timers.push(setTimeout(()=>step(k), S4_ROW_MS*(k-1)));
  timers.push(setTimeout(runS4Results, S4_ROW_MS*(S4_ROWS.length-1)+700));
}
/* THE RESULTS PICK THEMSELVES (autopilot, like the sibling flows): the table
   lands, all seven get selected and the change ask types itself. A click on
   any checkbox takes over from the autopilot; send is always the user's. */
function runS4Results(){
  render('s4',{phase:'results',selected:[]});
  timers.push(setTimeout(()=>render('s4',{phase:'results',selected:S4_PICK}),1500));
  /* THE ASK TYPES ITSELF BUT THE USER SENDS IT (user, 2026-10-12: "allow me
     to trigger send"). The typed text is handed back as a real draft so the
     send control goes live and the X can clear it; nothing advances until
     send is clicked. */
  timers.push(setTimeout(()=>{
    const inp=$('#spInput'); if(!inp) return;
    typeInto(inp, S4_CHANGE, ()=>render('s4',{phase:'results',selected:S4_PICK,draft:S4_CHANGE}));
  },2600));
}
function runS4Planning(){
  const selected = (current.state&&current.state.selected&&current.state.selected.length) ? current.state.selected : S4_PICK;
  runSubs('s4','planning','Creating a plan',S4_PLAN_SUBS,3600, ()=>go('s4',{phase:'plan',selected}), {selected});
}
function runS4Thinking(){
  const selected = current.state.selected || S4_PICK;
  runSubs('s4','thinking','Thinking',THINK_SUBS,2800, ()=>runS4Apply(selected), {selected});
}
function runS4Apply(selected){
  const step=(k)=>render('s4',{phase:'applying',applied:k,selected});
  step(0);
  for(let k=1;k<=S4_DONE;k++) timers.push(setTimeout(()=>step(k), 1500*k));
}
function runS4ApplyResume(){
  const selected = current.state.selected || S4_PICK;
  /* "Continue with the remaining n" finishes the table; the other two leave it as it was */
  const applied = /^Continue/.test(resumeText||'') ? selected.length : S4_DONE;
  runSubs('s4','resumed','Doing some tasks',S2_SUBS,4200,
    ()=>render('s4',{phase:'resumed',selected,applied,tasks:S2_SUBS.map(l=>({label:l,state:'done'}))}), {selected});
}
/* RESUME DEPENDS ON WHERE THE STOP WAS. The note that was shown and the
   prompt that was just resent both stay in the transcript for the rest of
   the run, in the slot that stop belongs to. */
function runS4Resume(){
  const st = current.state||{};
  if(st.phase==='stopped-c1'){ s4Log.search += SP_STOPPED('looking up your experiences') + SP_RESENT(); runS4SearchResume(); return; }
  if(st.phase==='stopped-c2' && st.from==='opening'){ s4Log.open += SP_STOPPED('loading your experiences') + SP_RESENT(); runS4Open(); return; }
  if(st.phase==='stopped-c2' && st.from==='thinking'){ s4Log.plan += SP_STOPPED('before applying your changes') + SP_RESENT(); runS4Thinking(); return; }
  if(st.phase==='stopped-c2'){ s4Log.plan += SP_STOPPED('planning your changes') + SP_RESENT(); runS4Planning(); return; }
  runS4ApplyResume();
}
/* the s4 stop: which beats follow depends on what was running */
function s4Stop(state){
  clearTimers();
  const t=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const ph = state.phase;
  if(ph==='searching'){
    render('s4',{...state, phase:'pausing-c1'});
    t(()=>render('s4',{phase:'stopped-c1',recall:false}),1100);
    t(()=>render('s4',{phase:'stopped-c1',recall:true}),2000);
    return;
  }
  if(ph==='opening' || ph==='landing' || ph==='planning' || ph==='thinking'){
    const from = ph==='landing' ? 'opening' : ph;
    render('s4',{...state, phase:'pausing-c2', from});
    t(()=>render('s4',{phase:'stopped-c2',from,selected:state.selected,revealed:state.revealed,recall:false}),1100);
    t(()=>render('s4',{phase:'stopped-c2',from,selected:state.selected,revealed:state.revealed,recall:true}),2000);
    return;
  }
  /* applying — same beats as s3: pause, take stock, canvas first, then the summary */
  render('s4',{...state, phase:'pausing'});
  const settleAt=1200, settleDur=4000, resolveLead=420, noteAt=settleAt+settleDur;
  t(()=>render('s4',{...state, phase:'settling'}), settleAt);
  t(()=>render('s4',{...state, phase:'resolving'}), noteAt-resolveLead);
  t(()=>render('s4',{...state, phase:'stopped', recall:false}), noteAt);
  t(()=>render('s4',{...state, phase:'stopped', recall:true}), noteAt+900);
}

/* ---- what a stop does, per scenario ---- */
const STOP_TO   = {s1:'stopped', s2:'stopped', s3:'stopped', s4:'stopped'};
const RESUME_RUN = {s1:runS1Resume, s2:runS2Resume, s3:runS3Resume, s4:runS4Resume};
const START_RUN  = {s1:runS1, s2:runS2, s3:runS3, s4:runS4};

function wire(name, state){
  const main = $('#main');
  /* settled disclosures open and close */
  main.querySelectorAll('[data-disclosure]').forEach(d=>d.onclick=()=>{
    const ul=d.parentElement.querySelector('.chatStatus__steps'); const chev=d.querySelector('.chatStatus__chev');
    const open=ul.style.display!=='none'; ul.style.display=open?'none':'flex'; chev.classList.toggle('chatStatus__chev--open',!open);
  });

  /* ── HOME: the pill picks a scenario, then types its prompt ── */
  if(name==='home'){
    const send=main.querySelector('#homeSend');
    if(send) send.onclick=(e)=>{ e.stopPropagation(); START_RUN[scenario](); };
    const pill=main.querySelector('#simPill'), menu=main.querySelector('#simMenu');
    if(pill&&menu){
      pill.onclick=(e)=>{ e.stopPropagation(); menu.classList.toggle('hidden'); };
      menu.querySelectorAll('[data-sim]').forEach(b=>b.onclick=(e)=>{
        e.stopPropagation(); scenario=b.dataset.sim;
        go('home',{autotype:PROMPT(), fileChip:HAS_FILE()});
      });
      document.addEventListener('click',()=>menu.classList.add('hidden'),{once:true});
    }
    if(state.autotype) timers.push(setTimeout(()=>typeInto(main.querySelector('#homeInput'), state.autotype, null), 300));
    return;
  }

  /* ── "Looks good" on the plan card opens the canvas (C2) and starts the
       task that is going to be interrupted. ── */
  /* the two choices s3 offers after a stop. Both resume the flow with the
     user's decision as their turn, so the transcript records WHICH was
     taken rather than silently continuing. */
  /* Keep / Rollback / Complete the remaining: each records its own label as the
     user's turn, then resumes */
  ['#s3Keep','#s3Rollback','#s3Complete'].forEach(sel=>{ const b=main.querySelector(sel); if(!b) return;
    if(!IS_LOCAL){ b.onclick=(e)=>e.preventDefault(); b.classList.add('cardReplyBtn--inert'); return; }   // published build: no further interaction
    b.onclick=()=>{ clearTimers(); resumeText = b.textContent.trim(); resumeFile = false; resumeVia = 'chip'; RESUME_RUN[name](); }; });

  const approve = main.querySelector('#s2ApprovePlan');
  if(approve) approve.onclick=()=>{ clearTimers(); if(name==='s4') runS4Thinking(); else runPlanThinking(name); };
  const t1ok = main.querySelector('#s2T1Ok'), t2ok = main.querySelector('#s2T2Ok');
  /* s2: approving the first object starts the task that gets stopped */
  if(t1ok) t1ok.onclick=()=>{ clearTimers(); (name==='s2' ? runS2Task : runS3Task)(); };
  if(t2ok) t2ok.onclick=()=>{ clearTimers(); (name==='s2'?runS2Task:runS3Task)(); };

  /* ── THE STOP CONTROL. Stopping is immediate: every pending timer is
       dropped, so nothing the agent had queued lands after the user has
       said stop. ── */
  /* "Highlight changes" works on every artifact canvas */
  const hlc = main.querySelector('[data-hlchanges]'); if(hlc) hlc.onchange=()=>render(name,{...state, hl:hlc.checked});
  /* s4 picks its own stop beats by phase */
  if(name==='s4'){
    main.querySelectorAll('[data-spstop]').forEach(b=>b.onclick=()=>s4Stop(state));
    /* the results picker: any click takes over from the autopilot */
    /* every table that is not the live picker keeps its boxes as drawn */
    if(state.phase!=='results') main.querySelectorAll('.tbl .cb').forEach(cb=>cb.onclick=(e)=>e.preventDefault());
    if(state.phase==='results'){
      const pick=(next)=>{ clearTimers(); render('s4',{...state, selected:[...next]}); };
      main.querySelectorAll('[data-selrow]').forEach(cb=>cb.onclick=(e)=>{ e.stopPropagation(); const sx=new Set(state.selected||[]); const i=+cb.dataset.selrow; sx.has(i)?sx.delete(i):sx.add(i); pick(sx); });
      const all=main.querySelector('[data-selall]'); if(all) all.onclick=(e)=>{ e.stopPropagation(); pick(all.checked ? S4_ROWS.map((_,i)=>i) : []); };
    }
  }
  /* s2/s3 task beats: stop pauses THAT beat in place */
  const taskBeat = (name==='s2'||name==='s3') && /^(thinking|t[12](think)?)$/.test(state.phase||'');
  if(taskBeat) main.querySelectorAll('[data-spstop]').forEach(b=>b.onclick=()=>{
    clearTimers();
    const key = state.phase==='thinking' ? 'think' : state.phase;
    render(name,{...state, phase:'pausing-'+key});
    timers.push(setTimeout(()=>render(name,{phase:'stopped-'+key, recall:false}),1100));
    timers.push(setTimeout(()=>render(name,{phase:'stopped-'+key, recall:true}),2000));
  });
  if(name!=='s4' && !taskBeat) main.querySelectorAll('[data-spstop]').forEach(stop=>{ stop.onclick=()=>{
    /* THE STOP IS A SEQUENCE OF BEATS, so nothing arrives at the same time
       as something else (user, 2026-10-06: the note and the prompt chip
       "are both appearing together right now and one is likely to get
       missed out"):
         1. the loader settles in place                    (pausing)
         2. s2 only: both panes animate out                (closing)
         3. the stopped note writes in                     (stopped)
         4. the prompt chip appears beneath it             (stopped + recall)
       The note is what happened; the chip is what you can do about it, so
       it waits until the note has been read. */
    clearTimers();
    /* the collapse animates between REAL widths, measured now — the panel
       is 25vw and the canvas takes the rest, so hard-coded px would only
       be right at one viewport */
    if(name==='s2'){
      const a=main.querySelector('aside.ai'), c=main.querySelector('.content'), m=main.closest('.main')||main;
      if(a&&c){
        const full = Math.round(m.getBoundingClientRect().width);
        document.documentElement.style.setProperty('--ai-anim-from', Math.round(a.getBoundingClientRect().width)+'px');
        /* THE PANEL'S TARGET WIDTH IS WHATEVER MAKES ITS CENTRED COLUMN
           LAND ON C1'S COLUMN. The panel keeps its right edge and grows
           leftward, so a centred column inside it sits at
           `panelRight - W/2 - COL/2`. Solving that for C1's column left
           gives W — so the content glides once, in proportion, and
           arrives exactly where C1 puts it. Growing to the full content
           width instead left it 366px short of C1 and the handoff jumped. */
        const COL_W = 588;
        const mBox = m.getBoundingClientRect();
        const aBox = a.getBoundingClientRect();
        const c1ColLeft = mBox.left + (mBox.width - COL_W)/2;
        /* +36 = 2x the 18px residual between the panel's border box and
           where its content actually centres (panel border + the body's
           own box). Measured, not derived: without it the column lands
           472..1060 against C1's 454..1042. */
        const targetW = 2 * (aBox.right - c1ColLeft - COL_W/2) + 36;
        document.documentElement.style.setProperty('--ai-anim-to', Math.round(targetW)+'px');
        document.documentElement.style.setProperty('--cv-anim-from', Math.round(c.getBoundingClientRect().width)+'px');
        /* THE CONTENT'S FINAL POSITION, MEASURED FROM THE PANEL'S RIGHT
           EDGE — the only edge that does not move while the panel grows.
           Anchoring there puts the 588 column at its final screen
           position from the first frame, so it never moves or reflows;
           only the panel's left edge animates past it. */
        const COL = 588;
        const panelRight = Math.round(a.getBoundingClientRect().right);
        /* C1's column is centred in the CONTENT CARD, which has its own
           1px border and sits inside `.main`'s padding — so compute the
           final centre from the canvas's own box, not from `.main`. That
           5px discrepancy is exactly this. */
        const cv = c.getBoundingClientRect();
        const finalColRight = Math.round(cv.left + (full + COL)/2);
        document.documentElement.style.setProperty('--c1-col', COL+'px');
        /* +5 corrects a residual offset between the panel's inner box and
           C1's content card (panel border + card border + the dock's own
           padding). Measured, not derived — chasing it through four
           nested boxes is not worth the fragility. */
        document.documentElement.style.setProperty('--c1-inset', Math.max(0, panelRight - finalColRight + 5)+'px');
        /* the composer's real height, so the absolutely-positioned body
           ends exactly where it begins */
        const comp = a.querySelector('.ai__composer');
        if(comp) document.documentElement.style.setProperty('--c1-composer-h', Math.round(comp.getBoundingClientRect().height)+'px');
      }
    }
    render(name,{...state, phase:'pausing', draft:''});
    /* s2 ends in C1, so the two panes have to LEAVE before it arrives —
       an extra beat the other scenarios do not need, since they never
       opened a canvas to close (user, 2026-10-07: "show the transition
       from c2 to c1 in a smooth animation, not abrupt"). */
    const closes = name==='s2';
    /* TIMING OF THE s2 STOP (user, 2026-10-07: "for a couple of seconds
       show that it's stopping, then the left panel collapses and the one
       on the right expands"):
         0ms     "Stopping" — the loader settles and HOLDS, long enough to
                 read as a deliberate pause rather than a flicker
         1400ms  the collapse begins (620ms of movement)
         2120ms  the note arrives, after the panes have finished moving
       The note must NOT land mid-collapse: it then re-lays-out while the
       box around it is still changing size, which is what made it dither. */
    /* s2 HOLDS "Stopping" FOR 3s BEFORE THE PANES MOVE (user, 2026-10-07;
       was 4.5s, then "make it 3 seconds"). Long enough that the stop reads
       as settled work rather than a transition cue. */
    /* The collapse is STAGGERED: canvas 0-420ms, conversation 260-720ms.
       THE NOTE MUST NOT LAND ON THE HEELS OF THAT — the C1 swap replaces
       the whole DOM, so if it fires while the expansion is still settling
       the screen changes twice in quick succession and reads as a jump
       (user, 2026-10-07: "flow 2 animation is jumpy now"). When the
       stagger pushed the movement from 620ms to 720ms I left the old
       100ms margin, which is what broke it. 320ms of stillness after the
       panes stop, before anything else happens. */
    /* canvas 0-560ms, conversation 220-940ms, so the movement spans 940ms.
       Longer and more gently eased than before — the collapse is the
       block's biggest motion and reads better unhurried. */
    const closeAt = 3000, closeDur = 940, settleGap = 320;
    /* s3 takes stock before it can show a result: the stop is followed by
       a loading beat ("Checking what completed") and only then the
       artifact and the summary. s1/s2 have nothing to compute, so they go
       straight from the pause to the note. */
    const settles = name==='s3' || name==='s4';
    /* 4s of "Checking what completed" (user, 2026-10-07) — it is the beat
       that does the apparent work, so it carries the wait */
    const settleAt = 1200, settleDur = 4000;
    /* the canvas resolves 420ms before the response, so the two panes do
       not change in the same frame */
    const resolveLead = 420;
    const noteAt = closes ? closeAt + closeDur + settleGap
                 : settles ? settleAt + settleDur
                 : 1100;
    if(closes)  timers.push(setTimeout(()=>render(name,{...state, phase:'closing', draft:''}), closeAt));
    if(settles) timers.push(setTimeout(()=>render(name,{...state, phase:'settling', draft:''}), settleAt));
    if(settles) timers.push(setTimeout(()=>render(name,{...state, phase:'resolving', draft:''}), noteAt - resolveLead));
    timers.push(setTimeout(()=>render(name,{...state, phase:STOP_TO[name], draft:'', recall:false, arriving:closes}), noteAt));
    timers.push(setTimeout(()=>render(name,{...state, phase:STOP_TO[name], draft:'', recall:true}), noteAt+900));
  }; });


  /* ── THE PROMPT PROMPTER. Clicking it puts the stopped prompt back in
       the composer as a draft — it does NOT re-send on its own, because
       the user may want to edit it first. ── */
  const recall = main.querySelector('[data-sprecall]');
  if(recall) recall.onclick=()=>render(name,{...state, draft:PROMPT(), detached:false});

  /* THE X DISMISSES THE PROMPT FOR GOOD (user, 2026-10-12: "once I trigger
     close, I should not see my prompt affordance"). It used to empty the box
     and let the recall chip come back, so the prompt the user had just
     rejected was offered to them again. Closing is a decision: the draft
     goes, and the chip stays gone. `dismissed` rather than `recall:false`, because
     the latter doubles as the note's arriving flag and would replay its entrance. */
  const clearBtn = main.querySelector('[data-spclear]');
  if(clearBtn) clearBtn.onclick=(e)=>{ e.stopPropagation(); render(name,{...state, draft:'', detached:false, dismissed:true}); };

  /* the attachment can be taken off again without losing the prompt */
  const filex = main.querySelector('[data-spfilex]');
  if(filex) filex.onclick=(e)=>{ e.stopPropagation(); render(name,{...state, detached:true}); };

  /* ── SEND. Only live once something is in the box. Sending the recalled
       prompt resumes the flow from where it was stopped. ── */
  const send = main.querySelector('#spSend');
  if(send) send.onclick=()=>{
    const inp=main.querySelector('#spInput');
    const txt=(inp && !inp.querySelector('.promptBox__ph')) ? inp.textContent.trim() : '';
    if(!txt) return;
    clearTimers();
    resumeVia = 'composer';
    if(name==='s4' && state.phase==='results'){ if(!(state.selected||[]).length) return; runS4Planning(); return; }
    /* resuming a stopped task beat re-runs that beat, carrying the note and the resent prompt */
    if((name==='s2'||name==='s3') && /^stopped-/.test(state.phase||'')){
      resumeText = txt; resumeFile = false;
      const key = state.phase.slice(8);
      if(key==='think'){ taskLog.thinking += SP_STOPPED('before starting the changes') + SP_RESENT(); runPlanThinking(name); return; }
      const n = +key[1];
      taskLog['t'+n] += SP_STOPPED(TASK_WHAT[n]) + SP_RESENT();
      if(key==='t2think') runS3Task(); else runTask(name,n);
      return;
    }
    resumeText = txt;
    resumeFile = HAS_FILE() && !state.detached && !!main.querySelector('.fileChip');
    RESUME_RUN[name]();
  };
}

/* TAB enters the recalled prompt — the keyboard equivalent of clicking the
   chip (the chip's own title says so). Only while a stop is showing, and
   only when the box is still empty, so Tab never overwrites real typing. */
document.addEventListener('keydown',(e)=>{
  if(e.key!=='Tab') return;
  const chip=$('[data-sprecall]'); if(!chip) return;
  const inp=$('#spInput'); if(inp && !inp.querySelector('.promptBox__ph')) return;
  e.preventDefault(); chip.click();
});

/* ============================================================
   KEY STATES — arrow-key navigation.
   The timed run is how the interaction FEELS; these are the states
   worth looking AT. Left/right step between them with no timers, so a
   state can be held still and compared. Each entry is what to render,
   with every loader frozen on a sensible frame (a spinner mid-run, all
   ticks done where the step has finished) because a key state has to be
   a complete picture on its own, not a moment a timer was passing
   through.
   ============================================================ */
const atStep = (labels, activeIdx)=> labels.map((label,j)=>({label,state:j<activeIdx?'done':j===activeIdx?'active':'idle'}));

/* A KEY STATE EITHER HOLDS STILL OR PLAYS — whichever is true of the real
   state. A static frame is right for a resting state (the plan card, the
   stopped note): there is nothing in motion to see. But a state the agent
   is WORKING in is defined by its motion, and freezing it meant arrowing
   into the flow killed it for good — the timers were cleared and nothing
   ever restarted them (user, 2026-10-06: "why does triggering left and
   right keys stop it from working completely on its own?").
   So a running state's entry calls its RUNNER, not `render`: it picks the
   loader back up and keeps ticking, and stays stoppable. */
const KEY_STATES = {
  s1:[
    ()=>render('s1',{phase:'bootfull'}),
    ()=>render('s1',{phase:'msg-user'}),
    ()=>render('s1',{phase:'msg-created'}),
    ()=>runS1Working(),
    ()=>render('s1',{phase:'stopped'}),
    ()=>render('s1',{phase:'stopped',draft:SP_PROMPT}),
    ()=>runS1Resume(),
  ],
  s2:[
    ()=>render('s2',{phase:'bootfull'}),
    ()=>render('s2',{phase:'msg-user'}),
    ()=>render('s2',{phase:'msg-created'}),
    ()=>runS2Planning(),
    ()=>render('s2',{phase:'t1ok'}),
    ()=>runS2Task(),
    ()=>render('s2',{phase:'stopped'}),
    ()=>render('s2',{phase:'stopped',draft:S2_PROMPT}),
    ()=>runS2Resume(),
  ],
  s3:[
    ()=>render('s3',{phase:'bootfull'}),
    ()=>render('s3',{phase:'msg-user'}),
    ()=>render('s3',{phase:'msg-created'}),
    ()=>runS3Planning(),
    ()=>render('s3',{phase:'t1ok'}),
    ()=>runS3Task(),
    ()=>render('s3',{phase:'stopped'}),
    ()=>render('s3',{phase:'stopped',draft:S2_PROMPT}),
    ()=>runS3Resume(),
  ],
};
KEY_STATES.s4 = [
  ()=>render('s4',{phase:'bootfull'}),
  ()=>render('s4',{phase:'msg-user'}),
  ()=>render('s4',{phase:'msg-created'}),
  ()=>runS4Search(),
  ()=>runS4Results(),
  ()=>go('s4',{phase:'plan',selected:S4_PICK}),
  ()=>runS4Apply(S4_PICK),
  ()=>render('s4',{phase:'stopped',selected:S4_PICK}),
  ()=>render('s4',{phase:'stopped',selected:S4_PICK,draft:S4_CHANGE}),
  ()=>runS4ApplyResume(),
];
let keyIdx = -1;                 // -1 = not stepping; the timed run is driving

/* Step to a key state. Any pending timer is dropped first: stepping is a
   deliberate jump, and a timer landing afterwards would overwrite it. */
let stepping = false;            // true only while stepTo runs its entry
function stepTo(i){
  const list = KEY_STATES[scenario]; if(!list) return;
  const idx = Math.max(0, Math.min(list.length-1, i));
  clearTimers();
  /* the entry may call go() synchronously (a runner's first render), which
     would otherwise clear the index we are in the middle of setting */
  stepping = true;
  try { list[idx](); } finally { stepping = false; }
  keyIdx = idx;
  /* A RUNNING STATE REACHED BY ARROW MUST NOT HOLD FOREVER (user, 2026-10-12:
     "it should bring me to those states but not have me stuck there forever").
     The holding states (working / searching / applying) wait for the USER's
     stop when the flow is driven from the prompt, which is the block's point.
     Arrowed into, nobody is going to press stop, so the state plays for a
     few seconds and then triggers its own stop, and the flow moves on to the
     stopped state exactly as it would have. Only the holding states: the
     others advance on their own already. `keyIdx` is dropped first, so the
     next arrow continues from what is then on screen. */
  const HOLDS = new Set(['working','applying']);
  timers.push(setTimeout(()=>{
    const st = current.state||{};
    if(!HOLDS.has(st.phase)) return;
    const stop = $('[data-spstop]'); if(!stop) return;
    keyIdx = -1; stop.click();
  }, ARROW_HOLD_MS));
}
const ARROW_HOLD_MS = 6000;
/* STEPPING ONTO A STATE WHOSE RUNNER ADVANCES PAST IT DESYNCS `keyIdx`
   FROM THE SCREEN, AND THAT IS WHAT FEELS STUCK (user, 2026-10-07: "left
   right key usage gets me stuck"). `runS2Planning` ends in
   `go('s2',{phase:'plan'})`, so ~3.6s after you step onto `planning` the
   screen becomes `plan` while `keyIdx` still says `planning` — right-arrow
   then "advances" to the state already on screen, and nothing moves.
   Any render that was NOT driven by stepTo must therefore drop the cached
   index, so the next arrow re-derives it from what is actually rendered. */
function clearKeyIdx(){ keyIdx = -1; }

/* WHICH KEY STATE THE SCREEN IS AT, so the first arrow press continues
   from what is on screen rather than snapping to the start.
   THIS MUST NOT BE DERIVED BY PARSING THE ENTRY FUNCTIONS. An earlier
   version read `phase:'…'` out of `fn.toString()`, which broke twice:
   a running state's entry is a RUNNER call (`()=>runS2Task()`) with no
   phase string in it at all, and two states can share one phase (stopped
   with and without the recalled draft), so `findIndex` always returned
   the first and right-arrow jumped BACKWARDS — the loop that felt stuck
   (user, 2026-10-07: "left right key usage gets me stuck").
   Each scenario now declares its own phase order explicitly. */
/* A LOADER THAT ONLY INTRODUCES THE NEXT STATE IS NOT A KEY STATE OF ITS
   OWN. `planning` exists solely to arrive at `plan`, so listing both made
   them adjacent stops that each rendered the other: left from `plan` hit
   `planning`, whose runner returned to `plan`, and the next left did it
   again — the 3↔4 loop the user hit over and over. Stepping now moves
   between SETTLED states; landing on one still plays its own intro
   animation, so nothing is lost visually. */
const KEY_PHASES = {
  s1:['bootfull','msg-user','msg-created','working','stopped','stopped-draft','resumed'],
  s2:['bootfull','msg-user','msg-created','plan','t1ok','working','stopped','stopped-draft','resumed'],
  s3:['bootfull','msg-user','msg-created','plan','t1ok','working','stopped','stopped-draft','resumed'],
  s4:['bootfull','msg-user','msg-created','searching','results','plan','applying','stopped','stopped-draft','resumed'],
};
/* the planning loader maps to the state it is arriving at, so arrowing
   while it runs continues from there rather than returning -1 */
/* TASKS 1-2 ARE KEY STATES TOO (2026-10-12): their running beats map to the
   result they arrive at, the same rule as planning→plan. Without this an arrow
   pressed mid-task found no index and snapped to the start. */
const PHASE_ALIAS = {planning:'plan', thinking:'plan', t1:'t1ok', t2:'t2ok', t2think:'working', 'pausing-think':'plan', 'stopped-think':'plan', 'pausing-t1':'t1ok', 'stopped-t1':'t1ok', 'pausing-t2':'t2ok', 'stopped-t2':'t2ok', 'pausing-t2think':'working', 'stopped-t2think':'working', setup:'working', opening:'results', landing:'results', 'pausing-c1':'searching', 'stopped-c1':'searching', 'pausing-c2':'results', 'stopped-c2':'results', pausing:'stopped', closing:'stopped', settling:'stopped', resolving:'stopped'};
function keyIdxFromCurrent(){
  if(keyIdx>=0) return keyIdx;
  const order = KEY_PHASES[scenario]||[];
  const st = current.state||{};
  /* the draft variant is a distinct STATE sharing one phase, so key on both */
  let key = st.phase==='stopped' && st.draft ? 'stopped-draft' : st.phase;
  key = PHASE_ALIAS[key] || key;
  return order.indexOf(key);
}

document.addEventListener('keydown',(e)=>{
  /* never steal a key while the user is typing in the composer */
  if(e.target && e.target.isContentEditable) return;
  if(current.name==='home') return;
  if(e.key==='ArrowRight'){ e.preventDefault(); stepTo(keyIdxFromCurrent()+1); return; }
  if(e.key==='ArrowLeft'){  e.preventDefault(); stepTo(keyIdxFromCurrent()-1); return; }
  /* S TRIGGERS THE STOP — the same action as the composer's stop control,
     available whenever the agent is actually running (user, 2026-10-06:
     "allow me to trigger stop"). */
  if(e.key==='s' || e.key==='S'){
    const stop = $('[data-spstop]'); if(!stop) return;
    e.preventDefault(); keyIdx = -1; stop.click();
  }
});

renderRail();
go('home',{});
