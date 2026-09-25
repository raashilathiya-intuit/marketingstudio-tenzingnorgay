/* ============================================================
   MS 2.0 — BUILDING BLOCKS
   A reference library of reusable screens, not a flow. Nothing
   auto-types, there is no AI panel and no conversation: each page
   shows a screen on its own so it can be looked at, compared and
   copied into a flow build.

   FIRST BLOCK: the COMPARISON SCREENS. The rollback flow
   (rollback-experiences-aug28) built a version-vs-version comparison
   for the CREATIVE tab; the same treatment is wanted for the other
   tabs (Experience meta, Audience, Billing offer, Experiment), so
   this page holds them side by side as they get built.

   Chrome, tokens and helpers are COPIED VERBATIM from the rollback
   build so the screens stay pixel-identical to the real flow.
   ============================================================ */

/* ---------- tiny helpers ---------- */
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
  /* document-with-lines (IDS): a CHANGE action, not a search. The SVG is
     CROPPED to its artwork (viewBox 2.5 2.5 15 15) the same way icon-search is,
     so this inset only nudges it — matching search's ~8% makes the two render
     at the same size in an object card. Do NOT re-add a 12.5% inset here: the
     crop already removed that padding, and insetting again shrinks it twice. */
  changeDoc:{src:'icon-change-doc.svg',inset:[7.9,8.2,8.2,7.9]},
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

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:-2px"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="#6b6c72"/><path d="M10.5 3.5V3.5C10.5 2.39543 9.60457 1.5 8.5 1.5H4.5C2.84315 1.5 1.5 2.84315 1.5 4.5V8.5C1.5 9.60457 2.39543 10.5 3.5 10.5V10.5" stroke="#6b6c72"/></svg>`;

/* status badge */
const badge = (t)=>{
  if(t==='Published'||t==='Verified') return `<span class="badge badge--pos">${t}</span>`;
  if(t==='Draft') return `<span class="badge badge--draft">${t}</span>`;   // blue #d6ebff/#0a73dc (nodes 25033/25303)
  if(t==='Edited') return `<span class="badge badge--edited">${t}</span>`;
  return `<span class="badge badge--neutral">${t}</span>`;
};

const IMAGE_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" stroke-width="1.5"/><circle cx="5.6" cy="5.6" r="1.1" fill="currentColor"/><path d="M2.6 11.4L6 8l2.5 2.5L11 8l2.6 3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const DETAIL_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33331 4C1.33331 2.89543 2.22874 2 3.33331 2H4.66665C5.77122 2 6.66665 2.89543 6.66665 4V5.33333C6.66665 6.4379 5.77122 7.33333 4.66665 7.33333H3.33331C2.22874 7.33333 1.33331 6.4379 1.33331 5.33333V4ZM3.33331 3.33333C2.96512 3.33333 2.66665 3.63181 2.66665 4V5.33333C2.66665 5.70152 2.96512 6 3.33331 6H4.66665C5.03484 6 5.33331 5.70152 5.33331 5.33333V4C5.33331 3.63181 5.03484 3.33333 4.66665 3.33333H3.33331Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33331 10.6667C1.33331 9.5621 2.22874 8.66667 3.33331 8.66667H4.66665C5.77122 8.66667 6.66665 9.5621 6.66665 10.6667V12C6.66665 13.1046 5.77122 14 4.66665 14H3.33331C2.22874 14 1.33331 13.1046 1.33331 12V10.6667ZM3.33331 10C2.96512 10 2.66665 10.2985 2.66665 10.6667V12C2.66665 12.3682 2.96512 12.6667 3.33331 12.6667H4.66665C5.03484 12.6667 5.33331 12.3682 5.33331 12V10.6667C5.33331 10.2985 5.03484 10 4.66665 10H3.33331Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 9.33333C7.99998 8.96514 8.29846 8.66667 8.66665 8.66667H14C14.3682 8.66667 14.6666 8.96514 14.6666 9.33333C14.6666 9.70152 14.3682 10 14 10H8.66665C8.29846 10 7.99998 9.70152 7.99998 9.33333Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 2.66667C7.99998 2.29848 8.29846 2 8.66665 2H14C14.3682 2 14.6666 2.29848 14.6666 2.66667C14.6666 3.03486 14.3682 3.33333 14 3.33333H8.66665C8.29846 3.33333 7.99998 3.03486 7.99998 2.66667Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 12C7.99998 11.6318 8.29846 11.3333 8.66665 11.3333H11.3333C11.7015 11.3333 12 11.6318 12 12C12 12.3682 11.7015 12.6667 11.3333 12.6667H8.66665C8.29846 12.6667 7.99998 12.3682 7.99998 12Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 5.33333C7.99998 4.96514 8.29846 4.66667 8.66665 4.66667H11.3333C11.7015 4.66667 12 4.96514 12 5.33333C12 5.70152 11.7015 6 11.3333 6H8.66665C8.29846 6 7.99998 5.70152 7.99998 5.33333Z" fill="currentColor"/></svg>`;

const CREATIVE_HEADLINE = 'Get 90% off Payroll for the next 3 months*';
const CREATIVE_BODY = "Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically.";
const CREATIVE_CTA = 'Claim your offer';

function cdPair(label,value,edited,link){
  const v = `<span class="cd-pair__v${link?' cd-pair__v--link':''}${edited?' cd-hl':''}">${value}</span>`;
  return `<div class="cd-pair"><div class="cd-pair__k">${label}</div>${v}</div>`;
}

function helloboxCreative(hl=false, opts={}){
  // opts lets a caller preview a DIFFERENT creative's copy (o.head/body/cta/
  // terms) and mark individual fields as changed (o.ctaHl)
  const head = opts.head || CREATIVE_HEADLINE;
  const body = opts.body || CREATIVE_BODY;
  const cta  = opts.cta  || CREATIVE_CTA;
  const terms= opts.terms|| 'Offer valid for new paid subscriptions only.';
  const ctaCls = opts.ctaHl ? ' cd-hl-border' : '';
  return `<div class="preview-wrap preview-wrap--wide">
        <div class="hellobox">
          <div class="art${hl?' cd-hl-border':''}">${I.tag}</div>
          <div class="body">
            <span class="lt">limited time</span>
            <h4><span class="${hl?'cd-hl':''}">${head}</span></h4>
            <p>${body}</p>
            <span class="cta${ctaCls}">${cta}</span>
            <div class="fine">${terms} <a href="#">Terms apply</a></div>
          </div>
        </div>
        <div class="preview-cap">Preview · ${opts.tmpl||'helloboxThirdParty'} · SBSEG QBO Hellobox AppAccountsettings</div>
      </div>`;
}

const hlBar=(on)=>`<div style="height:16px"></div><div class="selbar selbar--hlonly"><label class="hlToggle"><input type="checkbox" data-hlchanges${on?' checked':''}> Highlight changes</label></div>`;
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

function aiPanel(opts){
  const marker = opts.stepLoading
    ? `<span class="chk chk--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
    : `<span class="chk">${I.checkSm}</span>`;
  const step = opts.step ? `<div class="ai__step">
      ${marker}
      <span class="cv">${opts.step} <span class="dot dot--chev">${I.chev}</span></span>
      <span class="dot">${I.stop}</span>
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
    <div class="ai__composer">
      <div class="promptBox">
        <div class="promptBox__content">
          ${opts.chip?`<div class="selBar"><span>${opts.chip}</span><span class="selBar__x" data-chipclear>${icon('close',14)}</span></div>`:''}
          <div class="promptBox__input${filled}" id="composerInput" data-ph="${opts.composer||'Ask Marketing Agent'}">${draft || `<span class="promptBox__ph">${opts.composer||'Ask Marketing Agent'}</span>`}</div>
          <div class="promptBox__actions">
            <button class="promptBox__ctrl">${icon('attach',20)}</button>
            <button class="promptBox__send" id="composerSend">${icon('send',20)}</button>
          </div>
        </div>
      </div>
    </div>
  </aside>`;
}

const RB1_PLAN_TASKS = ['Review the comparison','Review the rolled back experience'];
function rb1PlanRows(done=0, loading=-1){
  const marker=(i)=>{
    if(i<done) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loading) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return RB1_PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
const RB1_PLAN = (done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${rb1PlanRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${active?replyBtn('Looks good','rb1ApprovePlan'):recordedReply('Looks good')}</div>`);
// task 1: the comparison is on the canvas
const RB1_CMP = (active)=> agentMsg(`<div class="chatBubble">Here's Version 3 against the Version 4 draft. Only the CTA text and CTA URL change.${objectCard('edit','Compare versions - ELM9071-IPD-Hell…')}<div class="bubble-q">Does this look ok? I'll then roll it back.</div>${active?replyBtn('Approve','rb1ApproveCmp'):recordedReply('Approve')}</div>`);

/* ============================================================
   COMPARISON SCREENS
   The experience being compared. Same data as the rollback flow so
   the CREATIVE screen here is the one that flow shows.
   ============================================================ */
const CMP_EID  = '0c1f0179-6e06-4aeb-8e18-254d8395e5ce';
const CMP_NAME = 'ELM9071-IPD-HelloChartAcc-US-QBL-QBLAST-NAQL-XSLL';
const CMP_PROJECT = 'QB Payroll Targeted offers';
const CMP_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${CMP_PROJECT}</span>`;
/* the two versions every tab compares */
const CMP_VA = 'Version 3 (current)';
const CMP_VB = 'Version 4 (new draft)';

/* ---- CREATIVE (built) ----
   Only the CTA text and CTA URL differ, so those two rows carry the
   yellow highlight in the new-draft column. */
const CMP_CREATIVE_FIELDS = [
  ['Headline','All the extras for a month, at no added cost.','All the extras for a month, at no added cost.'],
  ['Body','Growing teams come with more moving parts. Get deeper reporting, stramline onboarding, and manage yout growing team with fewer manual steps. Try Elite features for next 30 days at no additional cost.',
          'Growing teams come with more moving parts. Get deeper reporting, stramline onboarding, and manage yout growing team with fewer manual steps. Try Elite features for next 30 days at no additional cost.'],
  ['CTA text','Try now','Approve'],
  ['CTA URL','/app/obillupgrade?product-=PAYROLL&p_prioritycode=ELM9533_QBModalInter_upgradeonus_upgradeonus',
             '/app/obillupgrade?product-=PAYROLL&p_prioritycode=ELM9533_QBModalInter_upgradeonus_2clickupgradeonus'],
  ['Secondary CTA','Learn more','Learn more'],
  ['Image','multitasking.svg','multitasking.svg'],
  ['Terms','Terms apply. Upgrade charged after 30 days.','Terms apply. Upgrade charged after 30 days.'],
];

/* THE COMPARISON TABLE IS THE SHARED PRIMITIVE. Every tab's screen is
   the same three columns — Fields / version A / version B — with the
   changed rows highlighted in the B column only, so the eye lands on
   what would change. A new tab only has to supply its own field list. */
function cmpTable(fields, hl=true){
  const rows = fields.map(([k,cur,next,kind])=>{
    /* a JOIN row (AND / OR) is structure, not a field being compared: it
       spans the version columns and reads quietly, the way the AND/OR chips
       sit between conditions on the real audience screen. Nesting is NOT a
       row type — a nested part gets its own table via cmpSections(). */
    if(kind==='join') return `<tr class="cmpTbl__join"><td></td><td colspan="2">${k}</td></tr>`;
    const changed = cur!==next;
    const mark = (changed && hl) ? `<span class="cd-hl">${next}</span>` : next;
    return `<tr><td>${k}</td><td>${cur}</td><td>${mark}</td></tr>`;
  }).join('');
  return `<div class="cmpTbl-wrap"><table class="cmpTbl"><colgroup><col class="cmp-k"><col><col></colgroup>
    <thead><tr><th>Fields</th><th>${CMP_VA} ${icon('info',13)}</th><th>${CMP_VB} ${icon('info',13)}</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}
/* SECTIONS: a tab whose content splits into parts renders ONE TABLE PER PART,
   each with its own header row, under a small-caps label (user, 2026-09-24) —
   rather than one long table with group rows inside it. The experiment tab is
   the case: the experience's own fields, then a table per treatment.
   A section with no label is rendered bare, as the leading table. */
function cmpSections(sections, hl=true){
  return sections.map(sec=>{
    /* a bare join between two sections (the audience's OR) */
    if(sec.join) return `<div class="cmpSec__join">${sec.join}</div>`;
    return (sec.label ? `<div class="cmpSec__h">${sec.label}</div>` : '')
      + cmpTable(sec.fields, hl);
  }).join('');
}
/* the Preview view: the two versions rendered as the real creative,
   side by side in the same column order as the table */
function cmpCreativePreview(hl=true){
  const f=(i,col)=>CMP_CREATIVE_FIELDS[i][col];
  const card=(label,col,mark)=>`<div class="cmpPrev__col">
      <div class="cmpPrev__h">${label}</div>
      ${helloboxCreative(false,{head:f(0,col),body:f(1,col),cta:f(2,col),terms:f(6,col),ctaHl:mark})}
    </div>`;
  return `<div class="cmpPrev">${card(CMP_VA,1,false)}${card(CMP_VB,2,hl)}</div>`;
}

/* ---- EXPERIENCE META (built) ----
   The fields the experience-meta tab shows, in the screen's own reading
   order: left column top-to-bottom, then the right. Values are the real
   ones from the experience (user supplied the screen, 2026-09-24).
   Two edits between the versions — the end date is pushed out a quarter
   and the impression cap raised — so the screen shows what a meta diff
   looks like rather than fourteen identical rows. */
const CMP_META_FIELDS = [
  ['Offer name','ELM8570-IPD-SBSEGQBOInterstitialAppBanking-US-QBO-RET-CM-Control-ELM8570_24mos-AUD_AUDIENCE19-7588_US_QBO_QBOAV_RET_PROMO-ANNUAL_UPSELL_24-48_Months_CONTROL',
                'ELM8570-IPD-SBSEGQBOInterstitialAppBanking-US-QBO-RET-CM-Control-ELM8570_24mos-AUD_AUDIENCE19-7588_US_QBO_QBOAV_RET_PROMO-ANNUAL_UPSELL_24-48_Months_CONTROL'],
  ['Locales','en-us','en-us'],
  ['Timezone','Etc/GMT','Etc/GMT'],
  ['Start date','Sep 4, 2026 - 11:02 am','Sep 4, 2026 - 11:02 am'],
  ['End date','Dec 31, 2026 - 4:46 am','Mar 31, 2027 - 4:46 am'],
  ['Status','Draft','Draft'],
  ['Impression cap','3','5'],
  ['Priority','-','-'],
  ['Goal','RET','RET'],
  ['Subgoal','PROMO','PROMO'],
  ['Product type','QBO','QBO'],
  ['Tags','-','-'],
  ['Template name','bottomDrawerNewConcept','bottomDrawerNewConcept'],
  ['Experiment ID','681276','681276'],
  ['Treatment ID','1472646','1472646'],
];

/* ---- BILLING OFFER (built) ----
   Reading order off the screen: left column top-to-bottom, then right
   (user supplied the screen, 2026-09-24). The end date moves with the
   experience-meta one so the two tabs tell the same story, and the
   offer count rises with it. */
const CMP_BILLING_FIELDS = [
  ['Promotion type','Upgrade','Upgrade'],
  ['Product','Experts','Experts'],
  ['Offers','19','24'],
  ['Title','70% (Email)','70% (Email)'],
  ['Start date','March 12, 2026','March 12, 2026'],
  ['End date','April 22, 2026','June 30, 2026'],
  ['SKU','QB Live Assisted','QB Live Assisted'],
];

/* ---- AUDIENCE (built, NOT SHIPPED — the tab shows a placeholder) ----
   Held back at the user's request (2026-09-24) while the diff is confirmed.
   Wire it back up by putting `sections:CMP_AUDIENCE_SECTIONS` on the audience
   entry in CMP_TABS and restoring its real title.

   The audience is a RULE EXPRESSION, not flat field/value pairs: conditions
   joined by AND, an OR, then a nested attribute group. SECTIONS, same as the
   experiment tab — the top-level conditions in the leading table, the nested
   group as its own table under a label — with the AND/OR joins staying as
   quiet rows inside each table, where they belong.
   The OPERATOR TRAVELS WITH THE VALUE in the version columns, because the
   diff here is an operator flip: it has to be on the side being compared.
   **Rendered WITHOUT the QA errors** (user: "audience, just without errors"):
   the real screen carries "Audience key does not exist" and "Invalid value"
   flags and a QA error chip, none of which belong on a clean reference
   screen. The `~` invalid value is shown as the real value it should be. */
const AUD_NAME = 'elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_highprice';
/* A CONDITION IS THREE FIELDS — Attribute, Operator, Value (user, 2026-09-24),
   each its own row compared across the two versions. An earlier pass merged
   the operator into the value ("not equal to  No") in the version columns;
   they are separate fields on the real screen and read as separate rows here,
   so an operator change highlights on the Operator row alone. */
const audCond = (attr, op, val, op2, val2)=>[
  ['Attribute', attr, attr],
  ['Operator',  op,  op2===undefined?op:op2],
  ['Value',     val, val2===undefined?val:val2],
];
const CMP_AUDIENCE_SECTIONS = [
  {fields:[
    ...audCond('CDPCompanyAudienceName','contains any',AUD_NAME),
    ['AND','','','join'],
    /* the diff: this condition's OPERATOR flips */
    ...audCond('isAccountantAccessingClient','not equal to','No','equal to'),
    ['AND','','','join'],
    ...audCond('elm9071payingqbopayingqblnum','not equal to','0'),
  ]},
  /* the OR joins the two sections, so it sits BETWEEN the tables — trailing
     it on the first one left a join with nothing after it */
  {join:'OR'},
  {label:'Attribute group', fields:[
    ...audCond('CDPCompanyAudienceName','contains any',AUD_NAME),
    ['AND','','','join'],
    ...audCond('isAccountantAccessingClient','not equal to','No'),
  ]},
];

/* ---- EXPERIMENT (built, NOT SHIPPED — the tab shows a placeholder) ----
   ONE TABLE, with the treatment as a field (user, 2026-09-25: "we will not
   have multiple treatments at experience level"). A first pass gave each
   treatment its own sectioned table, mirroring the experiment screen's
   treatments list — wrong here: this tab is an EXPERIENCE's view of its
   experiment, and an experience sits on exactly ONE treatment.
   The QA/status chip is left off, as on every reference screen. */
const CMP_EXPERIMENT_FIELDS = [
  ['Start date','March 12, 2026','March 12, 2026'],
  ['End date','April 22, 2026','April 22, 2026'],
  ['Type','A/B/N (3-cell)','A/B/N (3-cell)'],
  /* the diff: the experience moves to a different treatment. With one
     treatment there is no reallocation to show, so the change that actually
     happens at this level is WHICH treatment the experience sits on. */
  ['Treatment','Treatment1-ELM9071_Med_70pct','Treatment2-ELM9071_Med_90pct'],
  /* the allocation belongs to whichever treatment the experience is on, so it
     moves WITH the treatment change rather than being a separate edit */
  ['Allocation','~30%','~40%'],
];

/* ---- THE TAB REGISTRY ----
   Creative is built. The rest are placeholders so the page shows what
   is coming and where each one will land; give a tab a `fields` array
   and it renders exactly like Creative with no other change. */
const CMP_TABS = [
  {key:'creative',   label:'Creative',        title:'&lt;Name of creative&gt;', fields:CMP_CREATIVE_FIELDS, preview:cmpCreativePreview},
  {key:'meta',       label:'Experience meta', title:'Experience meta', fields:CMP_META_FIELDS},
  /* AUDIENCE AND EXPERIMENT ARE HELD BACK (user, 2026-09-24: "keep audience
     and experiment local, keep some placeholder"). Their field data is built
     and kept above — to ship either one, just restore `fields:` here. */
  /* AUDIENCE IS HELD BACK (user, 2026-09-24) while its diff is confirmed. Its
     field data is built and kept above — to ship it, restore
     `sections:CMP_AUDIENCE_SECTIONS` here and its real title. */
  {key:'audience',   label:'Audience',        title:'Audience', wip:true},
  {key:'billing',    label:'Billing offer',   title:'Billing offer', fields:CMP_BILLING_FIELDS},
  {key:'experiment', label:'Experiment',      title:'IPD High Price Sensitivity · IXP 321931', fields:CMP_EXPERIMENT_FIELDS},
];
const cmpTab = (k)=>CMP_TABS.find(t=>t.key===k) || CMP_TABS[0];

/* a tab with no field list yet: say so plainly rather than faking a screen */
function cmpTodo(label){
  return `<div class="cmpTodo">
      <div class="cmpTodo__t">${label} comparison — coming soon</div>
    </div>`;
}

/* ---- the screen ----
   The experience canvas exactly as the rollback flow renders it at the
   comparison step: sticky header with the name and ID, the five tabs,
   then the comparison. NO status badge and NO version picker — the
   screen is showing two versions at once, so neither applies. */
function cmpScreen(state={}){
  const t = state.tab || 'creative';
  const tab = cmpTab(t);
  const view = state.view==='preview' ? 'preview' : 'detail';
  const hl = state.hl!==false;
  const tabs = CMP_TABS.map(x=>`<span class="tab ${t===x.key?'active':''}" data-cmptab="${x.key}">${x.label}</span>`).join('');
  /* the Detail/Preview toggle only means something where a preview
     exists; a table-only tab would show a dead control */
  const toggle = tab.preview ? `<div class="cvtoggle" data-cvtoggle>
          <button data-cv="detail" class="${view==='detail'?'active':''}">${DETAIL_ICON} Detail</button>
          <button data-cv="preview" class="${view==='preview'?'active':''}">${IMAGE_ICON} Preview</button>
        </div>` : '';
  const body = tab.sections
    ? cmpSections(tab.sections, hl) + hlBar(hl)
    : tab.fields
      ? ((view==='preview' && tab.preview) ? tab.preview(hl) : cmpTable(tab.fields, hl)) + hlBar(hl)
      : cmpTodo(tab.label);
  return `<div class="content">${topbar(CMP_CRUMB)}<div class="scroll"><div class="pad">
    <div class="detail-sticky"><div class="detail-h"><span class="title">${CMP_NAME}</span><span class="detail-vd"></span><span class="detail-sub" style="margin:0">ID:&nbsp; ${CMP_EID} ${COPY_ICON}</span></div>
    <div class="tabs tabs--insticky tabs--exp">${tabs}</div></div>
    <div class="cd-head"><span class="cd-head__t">${tab.title}</span>${toggle}</div>
    ${body}</div></div></div>` + cmpPanel();
}

/* THE CONVERSATION PANE IS PRESENT BUT BLURRED (user, 2026-09-24: "where did
   the conversation pane go? give it just blur it"). A first pass dropped it
   entirely, which changed the canvas proportions — the real screen is always
   two-pane, and the comparison table is sized by what is left beside the
   panel. So the panel renders for real, carrying the rollback flow's own
   turns, then `.ai--blurred` blurs it and makes it inert: it is here to hold
   the layout, not to be read or clicked. */
function cmpPanel(){
  const body = RB1_PLAN(2,-1,false)
    + `<div class="convoTurn">${RB1_CMP(false)}</div>`;
  return aiPanel({step:`1.  ${RB1_PLAN_TASKS[0]}`, body}).replace('<aside class="ai', '<aside aria-hidden="true" class="ai ai--blurred');
}

/* ============================================================
   ROUTER — a reference page, so state is just what is on screen.
   No scenes, no timers, no autopilot.
   ============================================================ */
let cmpState = {tab:'creative', view:'detail', hl:true};
function render(){
  const main = $('#main');
  main.innerHTML = cmpScreen(cmpState);
  wire();
}
function wire(){
  const main = $('#main');
  main.querySelectorAll('[data-cmptab]').forEach(el=>el.onclick=()=>{
    cmpState = {...cmpState, tab:el.dataset.cmptab}; render(); });
  main.querySelectorAll('[data-cv]').forEach(el=>el.onclick=()=>{
    cmpState = {...cmpState, view:el.dataset.cv}; render(); });
  const hl = main.querySelector('[data-hlchanges]');
  if(hl) hl.onchange=()=>{ cmpState = {...cmpState, hl:hl.checked}; render(); };
}
renderRail();
render();
