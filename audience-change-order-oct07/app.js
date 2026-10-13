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
  /* Three markers, matching the plan table's own row states:
       stepLoading  → spinner, the agent is WORKING
       stepNum (n)  → the dashed numbered circle, task started but IDLE
                      (it is waiting on the user, so neither working nor done)
       neither      → green check, the task is FINISHED
     Only flows that block mid-task on the user pass stepNum. */
  const marker = opts.stepLoading
    ? `<span class="chk chk--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
    : opts.stepNum
      ? `<span class="planNum">${opts.stepNum}</span>`
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
/* The Experiment tab's title carries the experiment's ID in the SAME pattern as
   an experiment header: name, a vertical divider, then "ID:" with the copy icon
   (user, 2026-09-16). Replaces the old "name · IXP 716920" run-on. A plain
   string still works, for the placeholder callers that have no separate id. */
const expTabTitle = (v)=>{
  const name = (v && v.name!==undefined) ? v.name : v;
  const id   = (v && v.id!==undefined) ? v.id : null;
  return `<div class="cd-head"><span class="cd-head__t">${name}</span>${id
    ? `<span class="expHead__div" style="margin:0 12px"></span><span class="expHead__idw">ID:&nbsp; ${id} ${COPY_ICON}</span>`
    : ''}</div>`;
};
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
function agentLoader(label, tasks, bare=false){
  // Figma "Doing some tasks" (7463-9100): bare stroked tick per row (no green circle).
  // During loading a fade hierarchy applies (done=dark, active/pending=faded); once
  // ALL steps are done the whole list settles to the done color.
  const allDone = tasks.length && tasks.every(t=>t.state==='done');
  const list = bare ? '' : `<ul class="agentTasks__list${allDone?' agentTasks__list--settled':''}">${tasks.map(t=>`
    <li class="agentTask ${t.state==='done'?'agentTask--done':t.state==='active'?'agentTask--active':'agentTask--idle'}">
      <span class="agentTask__check">${I.tick}</span>
      <span class="agentTask__label">${t.label}</span>
    </li>`).join('')}</ul>`;
  return `<div class="chatMsgGroup"><div class="agentTasks">
    <div class="agentTasks__head"><img class="agentTasks__loader spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"><span class="agentTasks__label agentTasks__label--shimmer">${label}</span></div>
    ${list}
  </div></div>`;
}

/* status badge */
const badge = (t)=>{
  if(t==='Published'||t==='Verified') return `<span class="badge badge--pos">${t}</span>`;
  if(t==='Draft') return `<span class="badge badge--draft">${t}</span>`;   // blue #d6ebff/#0a73dc (nodes 25033/25303)
  if(t==='Error') return `<span class="badge badge--err">${t}</span>`;
  if(t==='Edited') return `<span class="badge badge--edited">${t}</span>`;
  return `<span class="badge badge--neutral">${t}</span>`;
};

/* meta grid (shared) */
const META = [
  ['PRODUCT','QBL (QB Live Assisted)'],['LOCALE','en-us'],
  ['GOAL','RETENTION'],['SUB GOAL','FTU'],
  ['START DATE','01/28/2026'],['END DATE','04/22/2026'],
  ['START TIME','9:18 am'],['END TIME','12: 30 am'],
  ['TIME ZONE','United States (Los Angeles)'],['PRIORITY','Medium'],
  ['VALUE','10.0'],
];
/* metaGrid(opts) — campaign meta attribute/value grid.
   opts.endDate / opts.priority override those values; opts.highlight=true wraps the
   overridden END DATE + PRIORITY values in a yellow edited highlight (Figma diff view). */
function metaGrid(opts={}){
  const rows = META.map(([k,v])=>{
    let val=v, edited=false;
    if(opts.endDate && k==='END DATE'){ val=opts.endDate; edited=!!opts.highlight; }
    if(opts.priority && k==='PRIORITY'){ val=opts.priority; edited=!!opts.highlight; }
    const vHtml = edited ? `<span class="meta__hl">${val}</span>` : val;
    return `<div><div class="meta__k">${k}</div><div class="meta__v">${vHtml}</div></div>`;
  }).join('');
  // opts.bare → drop the grey container (bg/radius/padding); plain pairs on white
  return `<div class="meta${opts.bare?' meta--bare':''}">${rows}</div>`;
}

/* generic table builder.
   opts.select: rows carry a checkbox the user toggles to select (data-selrow).
   opts.selected: array/Set of pre-checked row indices. */
function tableHTML(cols, rows, opts={}){
  const sel = opts.selected instanceof Set ? opts.selected : new Set(opts.selected||[]);
  const cb = opts.checkbox ? `<th class="cbcol"><input type="checkbox" class="cb"${opts.select?'':' disabled'}></th>` : '';
  const head = cols.map(c=>`<th><span class="th-inner">${c.label}${c.info?`<span class="i">${I.info}</span>`:''}<span class="sort">${I.sortsm}</span></span></th>`).join('');
  const rowHTML = (r,ri)=>{
    if(!r) return '';
    const on = sel.has(ri);
    const cbc = opts.checkbox ? `<td class="cbcol">${opts.select?`<input type="checkbox" class="cb" data-selrow="${ri}" ${on?'checked':''}>`:`<input type="checkbox" class="cb" disabled>`}</td>` : '';
    const rowEdited = !!r.editedRow;   // whole-row yellow band (WB tables)
    const tds = cols.map(c=>{
      /* A missing value renders EMPTY, never the string "undefined" — a row
         source without the key is a data gap, and printing it as text made it
         look like a real id (user, 2026-09-17). */
      const raw = r[c.key];
      const val = (raw===undefined || raw===null) ? '' : raw;
      // a cell is yellow if the whole row is edited OR the per-cell editedKey flags it
      const edited = (rowEdited || (c.editedKey && r[c.editedKey])) ? ' class="edited"' : '';
      if(c.badge) return `<td${edited}>${val===''?'':badge(val)}</td>`;
      return `<td${edited}>${val}</td>`;
    }).join('');
    const drill = opts.drillrow ? ` data-drillplace="${ri}" style="cursor:pointer"` : '';
    return `<tr ${opts.select?`data-selrowtr="${ri}"`:''}${rowEdited?' class="row-edited"':''}${drill}>${cbc}${tds}</tr>`;
  };
  const body = rows.map(rowHTML).join('');
  /* opts.groups = [{label, idx:[row indices]}] renders the table's own GROUP-BY
     rows (Figma reference: a chevron + "Group name (n)" band spanning the
     table) instead of one flat body. Row indices stay GLOBAL so selection and
     drill-down keep working. */
  if(opts.groups && opts.groups.length){
    const span = cols.length + (opts.checkbox?1:0);
    const gbody = opts.groups.map((g,gi)=>{
      const open = !opts.collapsed || !opts.collapsed.includes(gi);
      const hdr = `<tr class="grp"><td class="grp__cell" colspan="${span}" data-grp="${gi}">
        <span class="grp__chev">${open?`<span class="rot-180">${I.chev}</span>`:I.chev}</span>
        <span class="grp__name">${g.label}</span><span class="grp__n">(${g.idx.length})</span>
      </td></tr>`;
      return hdr + (open ? g.idx.map(ri=>rowHTML(rows[ri],ri)).join('') : '');
    }).join('');
    return `<div class="tbl-wrap"><table class="tbl">
      <thead><tr>${cb}${head}</tr></thead>
      <tbody>${gbody}</tbody></table></div>`;
  }
  return `<div class="tbl-wrap"><table class="tbl">
    <thead><tr>${cb}${head}</tr></thead>
    <tbody>${body}</tbody></table></div>`;
}

/* ============================================================
   SCENE DATA
   ============================================================ */
// search list rows
const SEARCH_ROWS = [
  ['DIWM QB Live campaign','Published'],['ELM9684-IPD-QBOPayroll','Draft'],
  ['ELM9533-IPD-QBOPayroll','Draft'],['ELM4217-IPD-QBOPayroll','Published'],
  ['ELM7856-IPD-QBOPayroll','Draft'],['ELM3041-IPD-QBOPayroll','Draft'],
  ['ELM6198-IPD-QBOPayroll','Published'],['ELM8724-IPD-QBOPayroll','Draft'],
  ['ELM2365-IPD-QBOPayroll','Draft'],['ELM5490-IPD-QBOPayroll','Draft'],
].map(([name,status])=>({name,id:'1113460',status,start:'Jul 9, 2025',end:'Dec 9, 2025',mod:'Dec 12, 2025'}));

// audiences (same across detail screens)
const AUDIENCES = [
  ['AUD_AUDIENCE1-QBO_MediumPriceSensitivty','Medium Price Sensitivity'],
  ['AUD_AUDIENCE2-QBO_HighPriceSensitivity','High Price Sensitivity'],
  ['AUD_AUDIENCE3-QBO_NoPriceSensitvty','No Price Sensitivity'],
  ['AUD_AUDIENCE4-QBO_BroadlyAvailable','Broadly Available (Email)'],
].map(([name,desc])=>({name,status:'Verified',desc,size:'~141k',mod:'06/30 18:30PST'}));

const PLACEMENTS = [
  ['Hellobox - Chart of Accounts','Hellobox - Image','1','19'],
  ['Hellobox - Expenses','Hellobox - Image','2','19'],
  ['Hellobox - Banking','Hellobox - Image','3','27'],
  ['Hellobox - Payments Deposit','Hellobox - Image','3','27'],
  ['Hellobox - Vendors','Hellobox - Image','2','27'],
  ['Banner - Shell','Banner','N/A','27'],
].map(([name,tmpl,cap,off])=>({name,tmpl,status:'Verified',cap,off,mod:'06/30 18:30PST'}));

// billing offers + experiments — endDate param decides the diff
function billingRows(endDate, edited){
  return [
    ['20059622','70% (Email)','19'],['20059628','90% (Email)','19'],
    ['No billing code','Controls / free trial offers','27'],
  ].map(([code,title,off])=>({code,status:'Verified',title,off,start:'01/28/2026',end:endDate,sku:'QB Live Assisted',mod:'06/30 18:30PST',edited}));
}
function experimentRows(endDate, edited){
  return [
    ['IPD - Medium Price Sensitivity','IXP 321930'],['IPD - High Price Sensitivity','IXP 321931'],
    ['IPD - Unknown Price Sensitivity','IXP 321933'],['Landing Page - ALL Price Sensitivity','IXP 321934'],
  ].map(([name,id])=>({name,status:'Verified',id,start:'03/12/2026',end:endDate,t1:'70% off 3 mo',t2:'90% off 3 mo',ctrl:'30D Free Trial',mod:'06/30 18:30PST',edited}));
}

/* column defs */
const COL = {
  search:[{label:'Campaign name',key:'name'},{label:'Campaign ID',key:'id'},{label:'Status',key:'status',badge:1},{label:'Start date',key:'start'},{label:'End date',key:'end'},{label:'Last modified',key:'mod',info:1}],
  aud:[{label:'Audience name',key:'name',info:1},{label:'QA status',key:'status',badge:1},{label:'Description',key:'desc'},{label:'Size',key:'size'}],
  billing:[{label:'Billing code',key:'code',info:1},{label:'QA status',key:'status',badge:1},{label:'Title',key:'title'},{label:'No. of offers',key:'off'},{label:'Start date',key:'start'},{label:'End date',key:'end',editedKey:'edited'},{label:'SKU',key:'sku'}],
  place:[{label:'Access point name',key:'name',info:1},{label:'QA status',key:'status',badge:1},{label:'Template',key:'tmpl'},{label:'Impression cap',key:'cap'},{label:'No. of offers',key:'off'}],
  exp:[{label:'Experiment name',key:'name',info:1},{label:'QA status',key:'status',badge:1},{label:'ID',key:'id'},{label:'Start date',key:'start'},{label:'End date',key:'end',editedKey:'edited'}],
};

/* campaign-data section: table of the 4 sub-tables. endDate/edited drive diff */
// campaign-data tables carry the Last updated column (the task-canvas lists don't)
const withMod = (cols)=>[...cols,{label:'Last updated',key:'mod'}];
function campaignDataTables(endDate, edited){
  return `
    <div class="sec-label">Audiences</div>${tableHTML(withMod(COL.aud),AUDIENCES)}
    <div class="sec-label">Access point</div>${tableHTML(withMod(COL.place),PLACEMENTS)}
    <div class="sec-label">Experiments</div>${tableHTML(withMod(COL.exp),experimentRows(endDate,edited))}`;
}

/* view toggle control */
// exact Figma toggle icons (user-provided). Fill swaps with active/inactive:
// active segment → purple #5d47d5; inactive → #1d1d1f. currentColor via the button.
const TOGGLE_TABLE_ICON = c=>`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.4693 1.34017C14.1418 1.40834 14.6666 1.97591 14.6666 2.66634V13.333L14.6595 13.4691C14.5958 14.0968 14.0971 14.5955 13.4693 14.6592L13.3333 14.6663H2.66659C1.97615 14.6663 1.40859 14.1415 1.34041 13.4691L1.33325 13.333V2.66634C1.33325 1.92996 1.93021 1.33301 2.66659 1.33301H13.3333L13.4693 1.34017ZM2.66659 13.333H7.33325V10.6663H2.66659V13.333ZM8.66658 10.6663V13.333H13.3333V10.6663H8.66658ZM8.66658 6.66634V9.33301H13.3333V6.66634H8.66658ZM2.66659 9.33301H7.33325V6.66634H2.66659V9.33301ZM2.66659 5.33301H13.3333V2.66634H2.66659V5.33301Z" fill="${c}"/></svg>`;
const TOGGLE_TREE_ICON = c=>`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.6666 10.6663H8.66658C8.25396 10.6675 7.85178 10.7963 7.51521 11.035C7.17863 11.2737 6.92413 11.6106 6.78659 11.9997H5.33325C5.15644 11.9997 4.98687 11.9294 4.86185 11.8044C4.73682 11.6794 4.66658 11.5098 4.66658 11.333V6.66634H6.79325C6.93041 7.05431 7.1839 7.39052 7.51915 7.62914C7.8544 7.86775 8.2551 7.99714 8.66658 7.99967H12.6666C13.197 7.99967 13.7057 7.78896 14.0808 7.41389C14.4559 7.03882 14.6666 6.53011 14.6666 5.99967C14.6666 5.46924 14.4559 4.96053 14.0808 4.58546C13.7057 4.21039 13.197 3.99967 12.6666 3.99967H8.66658C8.25396 4.00083 7.85178 4.12959 7.51521 4.3683C7.17863 4.60701 6.92413 4.94397 6.78659 5.33301H4.66658V2.66634H5.99992C6.17673 2.66634 6.3463 2.5961 6.47132 2.47108C6.59635 2.34605 6.66658 2.17649 6.66658 1.99967C6.66658 1.82286 6.59635 1.65329 6.47132 1.52827C6.3463 1.40325 6.17673 1.33301 5.99992 1.33301H1.99992C1.82311 1.33301 1.65354 1.40325 1.52851 1.52827C1.40349 1.65329 1.33325 1.82286 1.33325 1.99967C1.33325 2.17649 1.40349 2.34605 1.52851 2.47108C1.65354 2.5961 1.82311 2.66634 1.99992 2.66634H3.33325V11.333C3.33325 11.8634 3.54397 12.3721 3.91904 12.7472C4.29411 13.1223 4.80282 13.333 5.33325 13.333H6.78659C6.92413 13.722 7.17863 14.059 7.51521 14.2977C7.85178 14.5364 8.25396 14.6652 8.66658 14.6663H12.6666C13.197 14.6663 13.7057 14.4556 14.0808 14.0806C14.4559 13.7055 14.6666 13.1968 14.6666 12.6663C14.6666 12.1359 14.4559 11.6272 14.0808 11.2521C13.7057 10.8771 13.197 10.6663 12.6666 10.6663ZM8.66658 5.33301H12.6666C12.8434 5.33301 13.013 5.40325 13.138 5.52827C13.263 5.65329 13.3333 5.82286 13.3333 5.99967C13.3333 6.17649 13.263 6.34605 13.138 6.47108C13.013 6.5961 12.8434 6.66634 12.6666 6.66634H8.66658C8.48977 6.66634 8.3202 6.5961 8.19518 6.47108C8.07016 6.34605 7.99992 6.17649 7.99992 5.99967C7.99992 5.82286 8.07016 5.65329 8.19518 5.52827C8.3202 5.40325 8.48977 5.33301 8.66658 5.33301ZM12.6666 13.333H8.66658C8.48977 13.333 8.3202 13.2628 8.19518 13.1377C8.07016 13.0127 7.99992 12.8432 7.99992 12.6663C7.99992 12.4895 8.07016 12.32 8.19518 12.1949C8.3202 12.0699 8.48977 11.9997 8.66658 11.9997H12.6666C12.8434 11.9997 13.013 12.0699 13.138 12.1949C13.263 12.32 13.3333 12.4895 13.3333 12.6663C13.3333 12.8432 13.263 13.0127 13.138 13.1377C13.013 13.2628 12.8434 13.333 12.6666 13.333Z" fill="${c}"/></svg>`;
function viewToggle(active){ // active: 'table' | 'tree'
  return `<div class="viewtoggle" data-toggle>
    <button data-view="table" class="${active==='table'?'active':''}">${TOGGLE_TABLE_ICON(active==='table'?'#5d47d5':'#1d1d1f')} Table</button>
    <button data-view="tree" class="${active==='tree'?'active':''}">${TOGGLE_TREE_ICON(active==='tree'?'#5d47d5':'#1d1d1f')} Tree</button>
  </div>`;
}

/* ---------- TREE view — data model + real expand/collapse ---------- */
const NODE_COLORS={segment:'var(--node-segment)',experiment:'var(--node-experiment)',billing:'var(--node-billing)',placement:'var(--node-access point)',campaign:'var(--node-campaign)',treatment:'var(--node-experiment)',uipattern:'var(--node-access point)',template:'var(--node-access point)'};
// tile glyphs = real DS icons tinted WHITE (Figma: icon-inverse on the colored tile)
const whiteIcon=(name)=>`<span class="tile-ico">${icon(name,16)}</span>`;
const NODE_ICON={segment:whiteIcon('personThree'),experiment:whiteIcon('beaker'),billing:whiteIcon('percent'),placement:whiteIcon('thumbnail'),campaign:whiteIcon('megaphone'),treatment:whiteIcon('beaker'),uipattern:whiteIcon('thumbnail'),template:whiteIcon('thumbnail')};
// which node ids are expanded (persists across re-renders within a scene)
let treeExpanded = new Set();
/* render one data node. n = {id,type,k,v,meta,children[],pre,extra}
   pre  = HTML rendered ABOVE children (e.g. segment LABEL/Value grid)
   extra= HTML rendered BELOW children (e.g. access point preview card) */
function treeNode(n){
  const hasKids = (n.children&&n.children.length) || n.extra || n.pre;
  const open = treeExpanded.has(n.id);
  // chevron: down when collapsed, up when expanded (Figma 6287:21907)
  const chev = hasKids
    ? `<span class="node__chev" data-treetoggle="${n.id}">${open?`<span class="rot-180">${I.chev}</span>`:I.chev}</span>`
    : `<span style="width:20px;flex:0 0 20px"></span>`;
  const kids = (open && hasKids)
    ? `<div class="node__children">${n.pre||''}${(n.children||[]).map(treeNode).join('')}${n.extra||''}</div>`
    : '';
  const chip = n.offers ? `<span class="node__offers">${n.offers}</span>` : '';
  return `<div class="node">
    <div class="node__row ${n.type==='experiment'?'exp':''} ${n.type==='segment'?'segrow':''}">
      ${chev}
      <span class="node__tile" style="background:${NODE_COLORS[n.type]}">${NODE_ICON[n.type]}</span>
      <span class="node__body"><span class="node__k">${n.k}</span><div class="node__v">${n.v}${n.meta?`<span class="node__meta">${n.meta}</span>`:''}${chip}</div></span>
    </div>
    ${kids}
  </div>`;
}
function segGrid(){
  return `<div class="seg-grid">${Array(4).fill(0).map(()=>`<div><div class="k">LABEL</div><div class="v">Value</div></div>`).join('')}</div>`;
}
function previewCard(){
  return `<div class="preview-wrap">
    <div class="preview-tabs"><span class="pt active">Preview</span><span class="pt">Data</span></div>
    <div class="hellobox">
      <div class="art">${I.tag}</div>
      <div class="body">
        <span class="lt">limited time</span>
        <h4>Get 50% off Payroll for the next 3 months*</h4>
        <p>Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically.</p>
        <span class="cta">Claim 50% off offer</span>
        <div class="fine">Offer valid for new paid subscriptions only. <a href="#">Terms apply</a></div>
      </div>
    </div>
    <div class="preview-cap">Preview · helloboxThirdParty · SBSEG QBO Hellobox AppAccountsettings</div>
  </div>`;
}
/* ============================================================
   DYNAMIC GROUP-BY TREE (functioning modeled on the MSDS
   campaign-management Storybook; visuals unchanged from Figma).
   The tree is built from a FLAT list of leaf offers; the numbered
   group-by chips define the nesting order; filters + deep search
   compose; no grouping → flat leaf list.
   ============================================================ */
// one leaf per targeted-promotion offer, carrying every dimension value.
function mkOffers(){
  const placements=[
    {placement:'Invoice - Hellobox',    template:'Hellobox-image',  uipattern:'Hellobox'},
    {placement:'Banking - Aftertask Modal', template:'Aftertask Modal', uipattern:'Aftertask'},
  ];
  const segments=[
    {segment:'HighPropensity', billing:'20095329'},
    {segment:'MidPropensity',  billing:'20095330'},
  ];
  const out=[];
  [['IXP ID 643354 · T1','Treatment 1'],['IXP ID 643354 · T2','Treatment 2']].forEach(([experiment,treatment])=>{
    segments.forEach(s=>placements.forEach(p=>out.push({experiment,treatment,...s,...p})));
  });
  // the no-experiment arm carries a single offer (matches the "1 offer" chip)
  out.push({experiment:'No experiment',treatment:'Control',segment:'BroadlyAvailable',billing:'No billing code',placement:'Banner - Shell',template:'Banner',uipattern:'Banner'});
  return out;
}
const TREE_OFFERS = mkOffers();
// per-dim metadata shown next to a group node's value (our node__meta style)
const DIM_META = {
  experiment:{'IXP ID 643354 · T1':'Demo content variant · 50%','IXP ID 643354 · T2':'Demo content variant · 50%'},
  billing:{'20095329':'90% off · 3 mo','20095330':'70% off · 3 mo'},
};
/* ---- RICH mode (Create workflow only): real per-level attributes, leaf
   dimension panels and functional Preview|Data content tabs — layering
   modeled on the MSDS campaign-management component. ---- */
let treeRichMode = false;
// real attributes per group value, keyed by dim (Storybook: RULE/SCORE/…)
const DIM_ATTRS = {
  segment:{
    'HighPropensity':[['RULE','CDPCompanyAudienceName contains any elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_highprice'],['SCORE','15.0'],['BROADLY AVAILABLE','no']],
    'MidPropensity':[['RULE','CDPCompanyAudienceName contains any elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_midprice'],['SCORE','12.0'],['BROADLY AVAILABLE','no']],
    'BroadlyAvailable':[['RULE','BroadlyAvailable equal to yes'],['SCORE','5.0'],['BROADLY AVAILABLE','yes']],
  },
  experiment:{
    'IXP ID 643354 · T1':[['EXPERIMENT ID','643354'],['SPLIT','50%']],
    'IXP ID 643354 · T2':[['EXPERIMENT ID','643354'],['SPLIT','50%']],
  },
  billing:{
    '20095329':[['PROMOTION TYPE','Upgrade'],['SKU','QB Live Assisted']],
    '20095330':[['PROMOTION TYPE','Upgrade'],['SKU','QB Live Assisted']],
  },
  treatment:{
    'Treatment 1':[['ALLOCATION','~30%'],['CONTROL','30D Free Trial']],
    'Treatment 2':[['ALLOCATION','~30%'],['CONTROL','30D Free Trial']],
    'Control':[['ALLOCATION','~30%'],['CONTROL','—']],
  },
};
// feature set rides on the offer (leaf dimension panel)
const FEATURE_SET = {'20095329':'PR_ELITE','20095330':'PR_PREMIUM','No billing code':'PR_BASIC'};
// key/value grid in a grey panel — same container style as the segment grid
function kvGrid(pairs){
  return `<div class="seg-grid seg-grid--kv">${pairs.map(([k,v])=>`<div class="kv"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}</div>`;
}
// raw copydata fields for a leaf offer (the content's Data tab)
function rawFields(o){
  return kvGrid([
    ['TEMPLATE',o.template],['OIDAMIMAGE','multitasking.svg'],
    ['BODYTITLE','Get 50% off Payroll for the next 3 months*'],
    ['BODYMESSAGE',"Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically."],
    ['PRIMARYBTNTEXT','Claim 50% off offer'],['PRICINGCATEGORY','Targeted Only'],['ROUTE','homepage'],
    ['TERMSBODYTEXT','Terms apply. Upgrade charged after 30 days.'],
  ]);
}
// leaf content tab state: leaf ids currently showing the Data (raw fields) tab
let treeDataTab = new Set();
// expanded leaf (rich): full-dimension panel + content card w/ working Preview|Data tabs
function richLeafExtra(o, leafId){
  const dims = kvGrid([
    ['SEGMENT',o.segment],['TREATMENT',o.treatment],['EXPERIMENT',o.experiment],
    ['FEATURE SET',FEATURE_SET[o.billing]||'—'],['PLACEMENT',o.placement],['UI PATTERN',o.uipattern],['TEMPLATE',o.template],
  ]);
  const data = treeDataTab.has(leafId);
  const body = data ? rawFields(o) : `<div class="hellobox">
      <div class="art">${I.tag}</div>
      <div class="body">
        <span class="lt">limited time</span>
        <h4>Get 50% off Payroll for the next 3 months*</h4>
        <p>Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically.</p>
        <span class="cta">Claim 50% off offer</span>
        <div class="fine">Offer valid for new paid subscriptions only. <a href="#">Terms apply</a></div>
      </div>
    </div>`;
  return `${dims}<div class="preview-wrap">
    <div class="preview-tabs"><span class="pt ${data?'':'active'}" data-pt="preview" data-ptleaf="${leafId}">Preview</span><span class="pt ${data?'active':''}" data-pt="data" data-ptleaf="${leafId}">Data</span></div>
    ${body}
    <div class="preview-cap">${data?'Copydata':'Preview'} · helloboxThirdParty · SBSEG QBO Hellobox AppAccountsettings</div>
  </div>`;
}
// copy inside the preview card — included in deep search (like "search all fields")
const LEAF_SEARCH_EXTRA = [
  'limited time','Get 50% off Payroll for the next 3 months*',
  "Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically.",
  'Claim 50% off offer','Offer valid for new paid subscriptions only. Terms apply',
  'Preview · helloboxThirdParty · SBSEG QBO Hellobox AppAccountsettings',
].join(' ').toLowerCase();
// leaves surviving the active filters + deep search
function shownOffers(){
  const q = treeSearch.trim().toLowerCase();
  return TREE_OFFERS.filter(o=>{
    for(const [k,v] of Object.entries(treeFilters)){ if(v && o[k]!==v) return false; }
    if(!q) return true;
    const hay = TREE_DIMS.map(d=>o[d.key]).join(' ').toLowerCase()
      + ' ' + (DIM_META.experiment[o.experiment]||'') + ' ' + (DIM_META.billing[o.billing]||'')
      + ' ' + LEAF_SEARCH_EXTRA;
    return hay.toLowerCase().includes(q);
  });
}
/* group the flat leaves by the selected dims IN ORDER → nested nodes.
   ids are path-based so they're stable across rebuilds of the same grouping. */
function buildTree(){
  // rich (Create) leaves expand into the dimension panel + tabbed content;
  // edit-flow leaves keep the plain preview card.
  const leafNode=(o,parentId,i)=>{
    const id=`${parentId}/leaf${i}`;
    return {id,type:'placement',k:'Access point/Template',v:o.placement,meta:o.template,
      extra:treeRichMode?richLeafExtra(o,id):previewCard()};
  };
  // group-node attribute panel: rich mode shows the REAL per-level attributes,
  // edit flows keep the placeholder LABEL/Value grid on segments only.
  const nodePre=(dim,v)=>{
    if(treeRichMode){ const at=(DIM_ATTRS[dim.key]||{})[v]; return at?kvGrid(at):''; }
    return dim.key==='segment'?segGrid():'';
  };
  const groupBy=(offers,dims,parentId)=>{
    if(!dims.length) return offers.map((o,i)=>leafNode(o,parentId,i));
    const [dim,...rest]=dims;
    const groups=new Map();
    offers.forEach(o=>{ const v=o[dim.key]; if(!groups.has(v)) groups.set(v,[]); groups.get(v).push(o); });
    return [...groups.entries()].map(([v,list])=>{
      const id=`${parentId}/${dim.key}=${v}`;
      return {id,type:dim.type,k:dim.label,v,meta:(DIM_META[dim.key]||{})[v],
        offers:`${list.length} offer${list.length===1?'':'s'}`,
        pre:nodePre(dim,v),
        children:groupBy(list,rest,id)};
    });
  };
  const dims = treeGroupBy.map(k=>DIM_BY_KEY[k]).filter(Boolean);
  return groupBy(shownOffers(), dims, 't');
}
function treeData(){ return buildTree(); }
/* default-expanded set: 2nd top-level group open all the way down its group
   levels (+ the Aftertask preview leaf when the scene shows previews). */
function defaultExpanded(withPreview){
  const ids=new Set();
  const roots=buildTree();
  const openGroups=(n)=>{ if(n.children&&n.children.length&&!n.id.includes('/leaf')){ ids.add(n.id); n.children.forEach(openGroups); } };
  if(roots[1]) openGroups(roots[1]);
  if(withPreview && roots[1]){
    const findLeaf=(n)=>{ if(n.id.includes('/leaf')&&n.v==='Banking - Aftertask Modal') return n;
      for(const c of (n.children||[])){ const f=findLeaf(c); if(f) return f; } return null; };
    const leaf=findLeaf(roots[1]); if(leaf) ids.add(leaf.id);
  }
  return ids;
}
function treeView(withPreview, rich=false){
  treeRichMode = !!rich;
  if(!treeExpanded.size) treeExpanded = defaultExpanded(withPreview);
  return `<div class="treewrap" data-treewrap data-preview="${withPreview?1:0}" data-rich="${rich?1:0}">${treeToolbar()}${treeBody(withPreview)}</div>`;
}
/* just the .tree element (toolbar excluded) — replaced in place on chevron/filter changes.
   Search + filters are applied to the flat leaves BEFORE grouping (Storybook semantics). */
function treeBody(withPreview){
  const shown = treeData();
  const body = shown.length
    ? shown.map(treeNode).join('')
    : `<div class="tree--empty">No results match your filters.</div>`;
  return `<div class="tree" data-tree data-preview="${withPreview?1:0}">${body}</div>`;
}

/* ---------- tree toolbar (Figma 5136:138562) — group-by / filter-by / search / expand-collapse ----------
   State is module-level so it survives the in-place tree re-renders.
   Every dim is a REAL grouping dimension (Storybook semantics): clicking a chip
   appends it as the next nesting level; clicking a numbered chip removes it and
   the rest renumber. No selection → flat list of offers. */
const TREE_DIMS = [
  {key:'experiment',label:'Experiment', type:'experiment'},
  {key:'segment',   label:'Segment',    type:'segment'},
  {key:'treatment', label:'Treatment',  type:'treatment'},
  {key:'placement', label:'Access point',  type:'placement'},
  {key:'uipattern', label:'UI Pattern', type:'uipattern'},
  {key:'template',  label:'Template',   type:'template'},
];
const DIM_BY_KEY = Object.fromEntries(TREE_DIMS.map(d=>[d.key,d]));
// default nesting = the canonical Figma tree: Experiment(1) → Segment(2) → Billing offer(3)
const GB_DEFAULT = ['experiment','segment'];
let treeGroupBy = GB_DEFAULT.slice();
// active per-dimension filters: {dimKey: value} — '' / absent = All
let treeFilters = {};
let treeSearch = '';
// distinct values for a dim (drives its filter dropdown options)
function dimValues(key){ return [...new Set(TREE_OFFERS.map(o=>o[key]))]; }
// icons for the toolbar (inline where not in the registry)
const EYE_ICON  = `<span class="eye">${icon('eye',16)}</span>`;
const CD_ICON   = `<span class="cd">${icon('chevronDown',16)}</span>`;
const RESET_ICON= `<svg viewBox="0 0 20 20" fill="none"><path d="M4.2 9.2a6 6 0 1 1 1 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.2 5.2v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// Detail toggle glyph (list) — fill follows the button's text color (active = purple)
// image glyph as inline currentColor SVG so it follows the toggle's active purple
const IMAGE_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" stroke-width="1.5"/><circle cx="5.6" cy="5.6" r="1.1" fill="currentColor"/><path d="M2.6 11.4L6 8l2.5 2.5L11 8l2.6 3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const DETAIL_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33331 4C1.33331 2.89543 2.22874 2 3.33331 2H4.66665C5.77122 2 6.66665 2.89543 6.66665 4V5.33333C6.66665 6.4379 5.77122 7.33333 4.66665 7.33333H3.33331C2.22874 7.33333 1.33331 6.4379 1.33331 5.33333V4ZM3.33331 3.33333C2.96512 3.33333 2.66665 3.63181 2.66665 4V5.33333C2.66665 5.70152 2.96512 6 3.33331 6H4.66665C5.03484 6 5.33331 5.70152 5.33331 5.33333V4C5.33331 3.63181 5.03484 3.33333 4.66665 3.33333H3.33331Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33331 10.6667C1.33331 9.5621 2.22874 8.66667 3.33331 8.66667H4.66665C5.77122 8.66667 6.66665 9.5621 6.66665 10.6667V12C6.66665 13.1046 5.77122 14 4.66665 14H3.33331C2.22874 14 1.33331 13.1046 1.33331 12V10.6667ZM3.33331 10C2.96512 10 2.66665 10.2985 2.66665 10.6667V12C2.66665 12.3682 2.96512 12.6667 3.33331 12.6667H4.66665C5.03484 12.6667 5.33331 12.3682 5.33331 12V10.6667C5.33331 10.2985 5.03484 10 4.66665 10H3.33331Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 9.33333C7.99998 8.96514 8.29846 8.66667 8.66665 8.66667H14C14.3682 8.66667 14.6666 8.96514 14.6666 9.33333C14.6666 9.70152 14.3682 10 14 10H8.66665C8.29846 10 7.99998 9.70152 7.99998 9.33333Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 2.66667C7.99998 2.29848 8.29846 2 8.66665 2H14C14.3682 2 14.6666 2.29848 14.6666 2.66667C14.6666 3.03486 14.3682 3.33333 14 3.33333H8.66665C8.29846 3.33333 7.99998 3.03486 7.99998 2.66667Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 12C7.99998 11.6318 8.29846 11.3333 8.66665 11.3333H11.3333C11.7015 11.3333 12 11.6318 12 12C12 12.3682 11.7015 12.6667 11.3333 12.6667H8.66665C8.29846 12.6667 7.99998 12.3682 7.99998 12Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99998 5.33333C7.99998 4.96514 8.29846 4.66667 8.66665 4.66667H11.3333C11.7015 4.66667 12 4.96514 12 5.33333C12 5.70152 11.7015 6 11.3333 6H8.66665C8.29846 6 7.99998 5.70152 7.99998 5.33333Z" fill="currentColor"/></svg>`;
const EXPAND_ICON  = `<svg viewBox="0 0 22 22" fill="none"><path d="M1.4165 14.75H20.0832M8.08317 6.75L10.7498 9.41667L13.4165 6.75M5.75 20.75H15.75C18.5114 20.75 20.75 18.5114 20.75 15.75V5.75C20.75 2.98858 18.5114 0.75 15.75 0.75H5.75C2.98858 0.75 0.75 2.98858 0.75 5.75V15.75C0.75 18.5114 2.98858 20.75 5.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const COLLAPSE_ICON= `<svg viewBox="0 0 22 22" fill="none"><path d="M1.4165 7.41667H20.0832M13.4168 15.4167L10.7502 12.75L8.0835 15.4167M5.75 20.75H15.75C18.5114 20.75 20.75 18.5114 20.75 15.75V5.75C20.75 2.98858 18.5114 0.75 15.75 0.75H5.75C2.98858 0.75 0.75 2.98858 0.75 5.75V15.75C0.75 18.5114 2.98858 20.75 5.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function treeToolbar(){
  const cols = TREE_DIMS.map(d=>{
    const pos = treeGroupBy.indexOf(d.key);
    const sel = pos>=0;
    const badge = sel ? `<span class="num">${pos+1}</span>` : '';
    const cur = treeFilters[d.key]||'';
    const opts = ['<option value="">All</option>']
      .concat(dimValues(d.key).map(v=>`<option value="${v.replace(/"/g,'&quot;')}"${v===cur?' selected':''}>${v}</option>`)).join('');
    return `<div class="gbcol">
      <span class="gbchip ${sel?'sel':''}" data-gb="${d.key}" role="button" tabindex="0">${EYE_ICON}${d.label}${badge}</span>
      <select class="fbsel fbsel--select${cur?' fbsel--active':''}" data-fbsel="${d.key}" aria-label="Filter by ${d.label}">${opts}</select>
    </div>`;
  }).join('');
  // list management = Group by / Filter by only (Figma 5491:106126 — no PATH readout)
  return `<div class="treebar" data-treebar>
    <div class="treebar__panel">
      <div class="treebar__grid">
        <div class="treebar__labels"><span>Group by:</span><span>Filter by:</span></div>
        ${cols}
        <button class="eiobtn treebar__reset" data-treereset aria-label="Reset grouping">${RESET_ICON}</button>
      </div>
    </div>
    <div class="treebar__row">
      <label class="treebar__search"><span class="sico">${icon('search',24)}</span>
        <input type="text" data-treesearch placeholder="Search" value="${treeSearch.replace(/"/g,'&quot;')}"></label>
      <div class="treebar__eio">
        <button class="eiobtn ${treeExpandState()==='all'?'active':''}" data-treeexpand aria-label="Expand all">${EXPAND_ICON}</button>
        <button class="eiobtn ${treeExpandState()==='none'?'active':''}" data-treecollapse aria-label="Collapse all">${COLLAPSE_ICON}</button>
      </div>
    </div>
  </div>`;
}
/* expand-state of the current (preview-aware) tree: 'all' | 'none' | 'some'.
   Drives the purple 'active' state on the expand/collapse buttons. */
function treeExpandState(){
  const wrap = typeof document!=='undefined' && document.querySelector('[data-treewrap]');
  const withPreview = wrap ? wrap.dataset.preview==='1' : false;
  const ids = allTreeIds(withPreview);
  if(!ids.length) return 'some';
  const openCount = ids.filter(id=>treeExpanded.has(id)).length;
  if(openCount===0) return 'none';
  if(openCount===ids.length) return 'all';
  return 'some';
}

/* collect every expandable id in the CURRENT tree — used by expand/collapse-all. */
function allTreeIds(){
  const ids=[]; const walk=n=>{ if((n.children&&n.children.length)||n.extra) ids.push(n.id); (n.children||[]).forEach(walk); };
  treeData().forEach(walk); return ids;
}
/* group-node ids only (leaves excluded) — used to auto-expand after regrouping. */
function groupTreeIds(){
  const ids=[]; const walk=n=>{ if(n.children&&n.children.length&&!n.id.includes('/leaf')){ ids.push(n.id); n.children.forEach(walk); } };
  treeData().forEach(walk); return ids;
}

/* expanded prompt box used by every non-home centered composer (Figma 2858-11681):
   1px blue-purple border, 16px radius, attach + send glyphs. */
function expandedComposer(){
  return `<div class="promptBox promptBox--centered promptBox--expanded"><div class="promptBox__content">
    <div class="promptBox__input"><span class="promptBox__ph">Ask Marketing Agent</span></div>
    <div class="promptBox__actions"><button class="promptBox__ctrl">${icon('attach',18)}</button><button class="promptBox__send">${icon('send',18)}</button></div>
  </div></div>`;
}

/* ============================================================
   SCENES
   ============================================================ */
const scenes = {};

/* ---- Scene 0: HOME ---- */
function kvSkeleton(pairs=6, cols=2){
  const bar=(w,h,mt=0)=>`<span class="cfskel cfskel--bar" style="display:block;width:${w}%;height:${h}px;margin-top:${mt}px"></span>`;
  const cell=(i)=>`<div>${bar(30+((i*9)%22),10)}${bar(55+((i*13)%32),16,8)}</div>`;
  return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:22px 64px;max-width:${cols===1?520:760}px">
    ${Array.from({length:pairs}).map((_,i)=>cell(i)).join('')}
  </div>`;
}

/* skeleton table (8 rows) for loading state */
function skeletonTable(cols,checkbox){
  const head = (checkbox?`<th class="cbcol"></th>`:'')+cols.map(c=>`<th>${c.label}</th>`).join('');
  const body = Array.from({length:8}).map((_,i)=>`<tr>${checkbox?`<td class="cbcol"><span class="skel skel--check"></span></td>`:''}${cols.map((c,j)=>`<td><span class="skel" style="width:${50+((i*7+j*11)%40)}%"></span></td>`).join('')}</tr>`).join('');
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/* full-canvas boot loader (July-31 intake): centered assist GIF + shimmer text */
function bootCanvas(){
  return `<div class="bootLoader"><img class="bootLoader__gif spinnerII" src="figma/spinner-ii.gif" alt=""><span class="bootLoader__shimmer">Creating a project</span></div>`;
}

function expandedComposer(){
  return `<div class="promptBox promptBox--centered promptBox--expanded"><div class="promptBox__content">
    <div class="promptBox__input"><span class="promptBox__ph">Ask Marketing Agent</span></div>
    <div class="promptBox__actions"><button class="promptBox__ctrl">${icon('attach',18)}</button><button class="promptBox__send">${icon('send',18)}</button></div>
  </div></div>`;
}

scenes.home = (state={})=>{
  return `<div class="content">
    ${topbar('<span>Home</span>')}
    <div class="scroll"><div class="pad">
      <div class="home-hero">
        <h1>Good Morning, Raashi.</h1>
        <div class="sub">What would you like to do today?</div>
        <div class="promptBox" id="homePrompt">
          <div class="promptBox__content">
            <div class="promptBox__input" id="homeInput"><span class="promptBox__ph">Ask Marketing Agent</span></div>
            <div class="promptBox__actions">
              <button class="promptBox__ctrl">${icon('plus',18)}</button>
              <button class="promptBox__send" id="homeSend">${icon('arrowUp',18)}</button>
            </div>
          </div>
        </div>
        <!-- Simulate a scenario: dashed pill -->
        <div class="simWrap">
          <button class="simPill" id="simPill" type="button">${icon('plus',14)} Simulate a scenario ${I.chev}</button>
          <div class="simMenu hidden" id="simMenu">
            <div class="simMenu__label">Audience</div>
            <button class="simMenu__item" data-sim="audChange">Change an audience's targeting</button>
          </div>
        </div>
      </div>
      <div class="home-sec">
        <h3>You Top Metrics</h3><div class="note">Insights only for QBO US Active IPD Campaigns</div>
        <div class="metrics"></div>
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
   AUDIENCE CHANGE ORDER — the audience object has its own two-tab
   detail screen (Targeting | Linked experiences), mirroring the
   experiment detail pattern from the link/unlink + update-treatment
   builds. See [[experiment-page-tabs-sep30]].
   ============================================================ */
const AU_NAME = 'AUD_AUDIENCE2-QBO_HighPriceSensitivity';
const AU_ID   = '20143872';
const AU_FIND_PROMPT = `Find the ${AU_NAME} audience.`;
const AU_PROJECT = AU_NAME;
const AU_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${AU_PROJECT}</span>`;
const AU_AUTHOR = 'Lathiya, Raashi';
const AU_SIZE = '~141k';
const AU_META = [
  ['DESCRIPTION','High Price Sensitivity'],
  ['SIZE', AU_SIZE],
  ['LAST UPDATED','06/30 18:30PST'],
];

/* the audience's own boolean-expression rows — ATTRIBUTE / operator / VALUE,
   reused from the audience builder widget already established in the
   link-unlink build (see memory [[ms-dashboard-figma-assets]] /
   [[create-change-order-new-repo]]). The row that gets changed is row 1
   (isAccountantAccessingClient): operator "not equal to" -> "equal to". */
const AU_ROWS = [
  {attr:'CDPCompanyAudienceName', op:'contains any', val:'elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_highprice'},
  {attr:'isAccountantAccessingClient', op:'not equal to', val:'No'},
  {attr:'elm9071payingqbopayingqblnum', op:'not equal to', val:'~'},
];
/* the operator change this flow demonstrates */
const AU_CHANGE_ATTR = 'isAccountantAccessingClient';
const AU_FROM_OP = 'not equal to';
const AU_TO_OP   = 'equal to';
const AU_CHANGE_PROMPT = `Change the operator for ${AU_CHANGE_ATTR} to "${AU_TO_OP}".`;

function auConj(t){ return `<div class="ab-conj">${t}</div>`; }
function auRow(row, opts={}){
  const hl = opts.highlight;
  const opHtml = hl ? `<span class="meta__hl">${row.op}</span>` : row.op;
  return `<div class="ab-row">
    <div class="ab-col"><div class="ab-k">ATTRIBUTE</div><div class="ab-attr">${row.attr}</div></div>
    <div class="ab-op">${opHtml}</div>
    <div class="ab-col"><div class="ab-k">VALUE</div><div class="ab-v">${row.val}</div></div>
  </div>`;
}
/* opts.highlightAttr marks the one row whose operator just changed (the
   highlight-changes convention — yellow, same as every other edited cell
   in these builds). opts.rows lets a caller swap in the POST-change rows. */
function auBuilder(opts={}){
  const rows = opts.rows || AU_ROWS;
  const hlOn = opts.hlOn!==false;
  const parts = rows.map(r=>auRow(r, {highlight: hlOn && opts.highlightAttr===r.attr}));
  return `${parts[0]}${auConj('AND')}${parts[1]}${auConj('AND')}${parts[2]}
    <div class="ab-orwrap">${auConj('OR')}</div>
    <div class="ab-group"><div class="ab-group__h">Attribute group ${I.chev}</div>
      ${parts[0]}${auConj('AND')}${parts[1]}${auConj('AND')}${parts[2]}
    </div>`;
}

/* the audience's linked experiences — the OTHER tab. Same column shape as
   every other experience table in these builds. */
const AU_AP = 'CG TURBOTAXO Content PostOnboardingExperience';
const hex2 = (n)=>n.toString(16).padStart(2,'0');
const AU_EXP_ROWS = [
  ['ELM9071-IPD-HighPS-US-Discount1'],
  ['ELM9071-IPD-HighPS-US-Discount2'],
  ['ELM9071-IPD-HighPS-US-Discount3'],
  ['ELM9071-IPD-HighPS-US-Discount4'],
].map(([exp],i)=>({exp, status:'Published', ap:AU_AP,
  eid:`51738ef0-9505-11f1-86ec-a3e651c6bc${hex2(2+i)}`, mod:'06/30 18:30PST'}));
const AU_EXP_COLS = [
  {label:'Experience',key:'exp',info:1},
  {label:'Experience ID',key:'eid'},
  {label:'Status',key:'status',badge:1},
  {label:'Access point',key:'ap'},
  {label:'Last updated',key:'mod'},
];

const INFO_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="#6f5ade"/><rect x="8.25" y="7.6" width="1.5" height="5" rx="0.75" fill="#fff"/><circle cx="9" cy="5.4" r="0.95" fill="#fff"/></svg>`;

const GROUP_BY_OPTS = [
  {label:'Access point', by:'Access points', on:true},
  {label:'Status', on:false},
  {label:'Experiment ID', on:false},
];
const groupByCtl = (by='', open=false)=>`<div class="groupByWrap">
      <div class="groupBy${by?' groupBy--on':''}" data-groupby>
      <span class="groupBy__label">${by?`Group by: ${by}`:'Group by'}</span>
      <span class="groupBy__chev">${I.chev}</span>
      </div>
      ${open?`<div class="groupByMenu">
        ${GROUP_BY_OPTS.map(o=>o.on
          ? `<button class="groupByMenu__item" data-groupopt="${o.by}">${o.label}</button>`
          : `<button class="groupByMenu__item">${o.label}</button>`).join('')}
      </div>`:''}
    </div>`;
const auToolbar = (by='')=>`<div class="toolbar">
      <div class="search">${I.search}<span>Search</span></div>
      <span class="iconbtn">${I.sliders}</span>
      ${groupByCtl(by)}
    </div>`;
const AU_PAGE_SIZE = 50;
const auPager = (n, size=AU_PAGE_SIZE)=>{
  if(!n) return '';
  const pages = Math.max(1, Math.ceil(n / size));
  return `<div class="pager">
      <span>1-${Math.min(n, size)} of ${n} items</span>
      <span class="nav">${I.chevL}<span>Page</span><span class="box">1</span><span>of ${pages}</span>${I.chevR}</span>
    </div>`;
};

/* THE AUDIENCE PAGE IS TABBED — Targeting | Linked experiences — mirroring
   the experiment detail pattern (user, 2026-10-07: "my audience should have
   targeting as the first tab ... and the other tab called Linked
   Experiences"). Opening the audience lands on Targeting; the tab never
   changes on its own once the user picks one (same rule as xpBody). */
const AU_TABS = [['targeting','Targeting'],['experiences','Linked experiences']];
function auBody(state, targetingHtml, listHtml){
  const st = state || {};
  const t = st.auTab || 'targeting';
  st.auTab = t;
  const tabs = AU_TABS.map(([k,l])=>`<span class="tab ${t===k?'active':''}" data-autab="${k}">${l}</span>`).join('');
  return `<div class="tabs tabs--exp xpTabs">${tabs}</div>` + (t==='targeting' ? targetingHtml : listHtml);
}

/* header: name | Verified | ID (mirrors xpHead's TITLE > STATUS > ID order) */
const auHead = (back=false)=>`<div class="expHead">
      ${back?`<span class="back" data-auback>${I.back}</span>`:''}<span class="expHead__name">${AU_NAME}</span>
      <span class="expHead__div"></span>
      ${badge('Verified')}
      <span class="expHead__div"></span>
      <span class="expHead__idw">ID:&nbsp; ${AU_ID} ${COPY_ICON}</span>
    </div>`;
const auMeta = ()=>`<div class="meta">${AU_META.map(([k,v])=>
  `<div><div class="meta__k">${k}</div><div class="meta__v">${v}</div></div>`).join('')}</div>`;

/* ---- the specific intake: boot -> C1 -> lands directly on the audience
   (no results table — the prompt named one audience by ID/name, same
   shape as the experiment builds' "specific" intake, e.g. XP_FETCH_CONV) ---- */
const AU_CREATED = `<div class="chatBubble">I have created "<span class="chatBubble__name">${AU_PROJECT}</span>" project for you.</div>`;
const AU_FETCH_CONV = ()=>
  userBubble(AU_FIND_PROMPT)
  + agentMsg(AU_CREATED,'')
  + agentMsg(
      disclosure('Fetched the audience',['Reading your request','Fetching the audience','Compiling results'])
      + `<div class="chatBubble">Here's the audience.${objectCard('people',AU_NAME)}</div>`);

/* ---- the playback: From/To for the operator change ---- */
const pcFtBlk=(label,from,to)=>`<div class="ft-label" style="margin:0">${label}</div><div class="ft" style="margin:0">
    <div class="ft__row"><div class="ft__k">From</div><div class="ft__v">${from}</div></div>
    <div class="ft__row"><div class="ft__k">To</div><div class="ft__v">${to}</div></div></div>`;
const AU_INTENT = (active)=> agentMsg(
  disclosure('Read your request, checked the audience',['Reading your request','Checking the audience','Mapping the change'])
  + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood will be changed on ${AU_NAME}.</p>${pcFtBlk(`${AU_CHANGE_ATTR} operator:`, AU_FROM_OP, AU_TO_OP)}<p class="summaryCard__q">Does this look right? I'll put together a plan once you confirm.</p>${active?replyBtn('Looks good','auApproveIntent'):recordedReply('Looks good')}</div>`);

/* ---- the plan: 2 tasks (user, 2026-10-07) — update targeting, then
   review updated experiences. The last task offers Publish, per the
   ms-prototype-intake convention (every task but the last ends in
   Approve; the last carries the real decision). ---- */
const AU_TASKS = [
  'Update the targeting',
  'Review the updated experiences',
];
function auPlanRows(done=0, loading=-1){
  return AU_TASKS.map((w,i)=>{
    const marker = i<done
      ? `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`
      : i===loading
        ? `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
        : `<span class="planNum">${i+1}</span>`;
    return `<div class="planTable__row">${marker}<span>${w}</span></div>`;
  }).join('');
}
const AU_PLAN = (done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">Here's how I'll make this change:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${auPlanRows(done,loading)}</div><p class="summaryCard__q">Does this look ok? I'll then proceed.</p>${active?replyBtn('Approve','auApprovePlan'):recordedReply('Approve')}</div>`);

/* task 1: active=true renders the live Approve the user clicks; false renders
   the recorded form once the conversation has moved past it. */
const AU_TASK1_DONE = (active=false)=> `<div class="chatBubble">Updated the targeting for ${AU_NAME}.${objectCard('people',AU_NAME)}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${active?replyBtn('Approve','auApproveTask'):recordedReply('Approve')}</div>`;
/* task 2 (last task): no approve — it offers Publish + Campaign Manager link */
const AU_TASK2_DONE = ()=> `<div class="chatBubble">Reviewed the ${AU_EXP_ROWS.length} experiences linked to ${AU_NAME}. They'll pick up the updated targeting once published.${objectCard('people',AU_NAME)}<div class="bubble-q">Ready to publish?</div>${replyBtn('Publish','auPublish')}</div>${cmLink()}`;
const AU_PUBLISHED = ()=> agentMsg(`<div class="chatBubble">Published ${AU_NAME} with the updated targeting.${objectCard('people',AU_NAME)}</div>`);

/* ---- Scene: AUDIENCE DETAIL (specific intake owns boot/C1/C2 too) ---- */
scenes.audDetail = (state={})=>{
  const ph = state.phase;
  if(ph==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  if(ph==='msg-prompt' || ph==='msg-created' || ph==='msg-search'){
    let centeredBody = userBubble(AU_FIND_PROMPT);
    if(ph==='msg-created' || ph==='msg-search') centeredBody += agentMsg(AU_CREATED,'');
    if(ph==='msg-search') centeredBody += agentLoader('Fetching the audience', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar(AU_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }

  const A = state.au;
  const m = /^([wt])(\d+)$/.exec(A||'');
  const ai = m ? +m[2] : -1;
  const abusy = m && m[1]==='w';
  const changed = ['done','publishing','published'].includes(A);
  const live = A==='published';

  let at = '';
  if(A) at += userBubble(AU_CHANGE_PROMPT);
  if(A==='reading')       at += agentLoader('Reading your request', state.tasks||[]);
  else if(A==='intent')   at += AU_INTENT(true);
  else if(A==='planning') at += AU_INTENT(false)
    + `<div class="convoTurn">${agentLoader('Preparing the tasks', state.tasks||[])}</div>`;
  else if(A==='plan')     at += AU_INTENT(false)
    + `<div class="convoTurn">${AU_PLAN(0,-1,true)}</div>`;
  else if(m){
    const i=+m[2], running=m[1]==='w';
    const taskLabel = i===0 ? 'Updating the targeting' : 'Reviewing the updated experiences';
    const priorDone = i>0 ? `<div class="convoTurn">${AU_TASK1_DONE()}</div>` : '';
    at += AU_INTENT(false)
      + `<div class="convoTurn">${AU_PLAN(i, running?i:-1)}</div>`
      + priorDone
      + `<div class="convoTurn">${running ? agentLoader(taskLabel, state.tasks||[]) : (i===0 ? AU_TASK1_DONE(true) : AU_TASK2_DONE())}</div>`;
  }
  else if(A==='publishing') at += AU_INTENT(false)
    + `<div class="convoTurn">${AU_PLAN(2,-1)}</div>`
    + `<div class="convoTurn">${AU_TASK1_DONE()}</div>`
    + `<div class="convoTurn">${AU_TASK2_DONE()}</div>`
    + `<div class="convoTurn">${agentLoader('Publishing the audience', state.tasks||[])}</div>`;
  else if(A==='published') at += AU_INTENT(false)
    + `<div class="convoTurn">${AU_PLAN(2,-1)}</div>`
    + `<div class="convoTurn">${AU_TASK1_DONE()}</div>`
    + `<div class="convoTurn">${AU_TASK2_DONE()}</div>`
    + `<div class="convoTurn">${AU_PUBLISHED()}</div>`;

  const abody = AU_FETCH_CONV() + (at ? `<div class="convoTurn">${at}</div>` : '');

  /* TARGETING TAB: once task 1 has run (ai>=0 is at/after "Update the
     targeting"), the expression shows the changed operator, highlighted
     (the highlight-changes convention) until published, then plain. */
  const targetingChanged = changed || ai>=0;
  const hlOn = targetingChanged && !live;
  const auRows = targetingChanged
    ? AU_ROWS.map(r=>r.attr===AU_CHANGE_ATTR ? {...r, op:AU_TO_OP} : r)
    : AU_ROWS;
  const targetingBody = (A==='reading'||A==='intent'||A==='planning'||A==='plan'||(m&&+m[2]===0&&m[1]==='w'))
    ? `<div style="height:16px"></div>${kvSkeleton(3,1)}`
    : `<div class="cd-sub" style="margin:0 0 28px">High Price Sensitivity</div>
       ${auBuilder({rows:auRows, highlightAttr: targetingChanged?AU_CHANGE_ATTR:null, hlOn})}
       ${targetingChanged ? hlBar(hlOn) : ''}`;

  const expBody = `${auToolbar()}${tableHTML(AU_EXP_COLS, AU_EXP_ROWS, {drillrow:false})}${auPager(AU_EXP_ROWS.length)}`;

  return `<div class="content">${topbar(AU_CRUMB)}<div class="scroll"><div class="pad">
      ${auHead()}
      ${auBody(state, `${auMeta()}<div style="height:16px"></div>${targetingBody}`, expBody)}
    </div></div></div>` + aiPanel({body:abody,
      ...(m ? {step:`${ai+1}.  ${AU_TASKS[ai]}`, stepLoading:!!abusy} : {}),
      draft:(state.typed && state.au===undefined)?AU_CHANGE_PROMPT:''});
};
/* "Highlight changes" toggle footer — sits under the targeting expression,
   same convention as every other edited table/meta view in these builds. */
const hlBar=(on)=>`<div style="height:16px"></div><div class="selbar selbar--hlonly"><label class="hlToggle"><input type="checkbox" data-hlchanges${on?' checked':''}> Highlight changes</label></div>`;

/* ============================================================
   ROUTER + interactions
   ============================================================ */
let scenario = 'audChange';
const FLOW_AUD = ['home','audDetail'];
const TYPE_MS = 18;
let autopilot = false;
let current = {name:'home', state:{}};
let timers = [];
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function pinConvo(){
  const b=document.querySelector('.ai__body');
  if(b) b.scrollTop=b.scrollHeight;
}
function pinDraft(input){ if(input) input.scrollTop=input.scrollHeight; }
function typeInto(input, text, done){
  if(!input){ done&&done(); return; }
  input.classList.add('promptBox__input--filled');
  input.innerHTML='<span class="promptBox__caret"></span>';
  const caret=input.firstChild; let i=0;
  const tick=()=>{
    i++; input.textContent=text.slice(0,i);
    pinConvo(); pinDraft(input);
    if(i<text.length) timers.push(setTimeout(tick,TYPE_MS));
    else { input.innerHTML=text+'<span class="promptBox__caret"></span>'; pinConvo(); pinDraft(input); timers.push(setTimeout(()=>done&&done(),650)); }
  };
  timers.push(setTimeout(tick,140));
}

function render(scene, state){
  current = {name:scene, state};
  const main=$('#main');
  main.innerHTML = scenes[scene](state);
  wire(scene, state);
  const b=main.querySelector('.ai__body'); if(b) b.scrollTop=b.scrollHeight;
  const cc=main.querySelector('.content--centered .scroll'); if(cc) cc.scrollTop=cc.scrollHeight;
}

function go(name, state={}){
  clearTimers();
  current = {name, state};
  const main = $('#main');
  main.innerHTML = scenes[name](state);
  wire(name, state);
  main.querySelectorAll('.scroll').forEach(s=>s.scrollTop=0);
  const b = main.querySelector('.ai__body'); if(b) b.scrollTop = b.scrollHeight;
  const cc=main.querySelector('.content--centered .scroll'); if(cc) cc.scrollTop=cc.scrollHeight;
  if(name==='home' && state.autotype){
    timers.push(setTimeout(()=>{
      const inp=$('#homeInput'); if(inp) typeInto(inp,state.autotype,null);
    },600));
  }
  else if(autopilot && !state.loading) scheduleAuto(name, state);
}

function scheduleAuto(name, state){
  const t=(fn,ms)=>timers.push(setTimeout(fn,ms));
  if(name==='home') t(()=>trigger.home(),900);
  else if(name==='audDetail' && !state.loading && !state.phase){
    const A=state.au;
    if(!A && !state.typed) return; // wait for auto-type to finish
    if(!A) t(()=>trigger.auSend(),1600);
    else if(A==='intent') t(()=>trigger.auApproveIntent(),1600);
    else if(A==='plan') t(()=>trigger.auApprovePlan(),1600);
    else if(A==='t0') t(()=>trigger.auApproveTask(),1600);
    else if(A==='t1') t(()=>trigger.auPublish(),1600);
  }
}

/* Type `text` into #composerInput once it exists (polls briefly for scenes
   that render the composer only after a short delay). */
function scheduleAskType(scene, text, flag='typed'){
  const tok = ++askTypeTok;
  timers.push(setTimeout(()=>{
    if(tok!==askTypeTok) return;
    const inp=$('#composerInput');
    if(!inp) return;
    if(!inp.querySelector('.promptBox__ph') && inp.textContent.trim()) return;
    typeInto(inp, text, ()=>{ if(current.name===scene) current.state[flag]=true; });
  },700));
}
let askTypeTok = 0;

const trigger = {
  home(){
    const inp=$('#homeInput');
    const txt = inp ? inp.textContent.trim() : AU_FIND_PROMPT;
    go('audDetail',{phase:'bootfull'});
    timers.push(setTimeout(()=>render('audDetail',{phase:'msg-prompt'}),2400));
    timers.push(setTimeout(()=>render('audDetail',{phase:'msg-created'}),3000));
    const subs=['Reading your request','Fetching the audience','Compiling results'];
    const searchAt=3900;
    const tick=(a)=>render('audDetail',{phase:'msg-search',tasks:subs.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
    timers.push(setTimeout(()=>tick(0),searchAt));
    const slot=(4800-600)/subs.length;
    subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),searchAt+Math.round(slot*(i+1)))));
    const openAt=searchAt+4800;
    timers.push(setTimeout(()=>render('audDetail',{loading:true,opening:true}),openAt));
    timers.push(setTimeout(()=>go('audDetail',{}),openAt+2000));
  },
  auSend(){
    render('audDetail',{au:'reading'});
    const subs=['Reading your request','Checking the audience','Mapping the change'];
    const tick=(a)=>render('audDetail',{au:'reading',tasks:subs.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
    const slot=2400/subs.length;
    subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),Math.round(slot*(i+1)))));
    timers.push(setTimeout(()=>render('audDetail',{au:'intent'}),2600));
  },
  auApproveIntent(){
    render('audDetail',{au:'planning'});
    const subs=['Mapping requested changes','Ordering the tasks'];
    const tick=(a)=>render('audDetail',{au:'planning',tasks:subs.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
    const slot=1800/subs.length;
    subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),Math.round(slot*(i+1)))));
    timers.push(setTimeout(()=>render('audDetail',{au:'plan'}),2000));
  },
  auApprovePlan(){
    render('audDetail',{au:'w0'});
    timers.push(setTimeout(()=>render('audDetail',{au:'t0'}),2200));
  },
  auApproveTask(){
    render('audDetail',{au:'w1'});
    timers.push(setTimeout(()=>render('audDetail',{au:'t1'}),2200));
  },
  auPublish(){
    render('audDetail',{au:'publishing'});
    timers.push(setTimeout(()=>render('audDetail',{au:'published'}),2400));
  },
};

function wire(name, state){
  const main = $('#main');
  main.querySelectorAll('[data-disclosure]').forEach(d=>d.onclick=()=>{
    const ul=d.parentElement.querySelector('.chatStatus__steps'); const chev=d.querySelector('.chatStatus__chev');
    const open=ul.style.display!=='none'; ul.style.display=open?'none':'flex'; chev.classList.toggle('chatStatus__chev--open',!open);
  });

  if(name==='home'){
    main.querySelector('#homeSend').onclick=(e)=>{e.stopPropagation();autopilot=false;trigger.home();};
    const pill=main.querySelector('#simPill'); const menu=main.querySelector('#simMenu');
    if(pill&&menu){
      pill.onclick=(e)=>{e.stopPropagation();menu.classList.toggle('hidden');};
      menu.querySelectorAll('[data-sim]').forEach(b=>b.onclick=(e)=>{
        e.stopPropagation(); autopilot=false;
        scenario = b.dataset.sim;
        go('home',{autotype:AU_FIND_PROMPT});
      });
      document.addEventListener('click',()=>menu.classList.add('hidden'),{once:true});
    }
  }

  if(name==='audDetail' && !state.loading && !state.phase){
    // the TABS must work (Targeting | Linked experiences), same as xpBody's data-xptab
    main.querySelectorAll('[data-autab]').forEach(tb=>tb.onclick=()=>{
      autopilot=false; render('audDetail',{...state,auTab:tb.dataset.autab});
    });
    // the change prompt auto-types once the audience has loaded, before any ask
    if(!state.au && !state.typed) scheduleAskType('audDetail', AU_CHANGE_PROMPT);
    const send=main.querySelector('#composerSend');
    if(send) send.onclick=(e)=>{e.stopPropagation();autopilot=false;trigger.auSend();};
    const ip=main.querySelector('#auApproveIntent');
    if(ip) ip.onclick=()=>{autopilot=false;trigger.auApproveIntent();};
    const pp=main.querySelector('#auApprovePlan');
    if(pp) pp.onclick=()=>{autopilot=false;trigger.auApprovePlan();};
    const tp=main.querySelector('#auApproveTask');
    if(tp) tp.onclick=()=>{autopilot=false;trigger.auApproveTask();};
    const pub=main.querySelector('#auPublish');
    if(pub) pub.onclick=()=>{autopilot=false;trigger.auPublish();};
    const hl=main.querySelector('[data-hlchanges]');
    if(hl) hl.onclick=(e)=>{ e.stopPropagation(); /* visual-only toggle in this build */ };
  }
}

/* ---- step nav (arrow keys) ---- */
function FLOW_STEPS(){
  return [
    ['home',{}],
    ['audDetail',{}],
    ['audDetail',{au:'intent'}],
    ['audDetail',{au:'plan'}],
    ['audDetail',{au:'t0'}],
    ['audDetail',{au:'t1'}],
    ['audDetail',{au:'published'}],
  ];
}
function stepIndex(){
  if(current.name==='home') return 0;
  const st=current.state||{};
  if(!st.au) return 1;
  const R={reading:'intent',planning:'plan',w0:'t0',w1:'t1',publishing:'t1'};
  const r=R[st.au]||st.au;
  const order=['intent','plan','t0','t1','published'];
  const i=order.indexOf(r);
  return i===-1 ? 1 : i+2;
}
function gotoStep(i){
  const steps=FLOW_STEPS();
  if(i<0 || i>=steps.length) return;
  autopilot=false; clearTimers();
  const [name,st]=steps[i];
  go(name, JSON.parse(JSON.stringify(st)));
}
document.addEventListener('keydown',(e)=>{
  const t=e.target;
  if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || (t.closest && t.closest('.promptBox')))) return;
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  if(e.key==='p'){ autopilot=!autopilot; if(autopilot) scheduleAuto(current.name,current.state); else clearTimers(); return; }
  if(e.key==='r'){ autopilot=true; go('home',{}); return; }
  const i = stepIndex();
  if(i===-1) return;
  if(e.key==='ArrowRight'){ e.preventDefault(); gotoStep(i+1); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); gotoStep(i-1); }
});

renderRail();
go('home',{});
