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
      const val = r[c.key];
      // a cell is yellow if the whole row is edited OR the per-cell editedKey flags it
      const edited = (rowEdited || (c.editedKey && r[c.editedKey])) ? ' class="edited"' : '';
      if(c.badge) return `<td${edited}>${badge(val)}</td>`;
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
    ['Create IPD','Design in-product display creatives for targeted access points.', scIpd],
  ].map(([t,d,ic])=>`<div class="scard"><div class="si">${ic}</div><div><div class="st">${t}</div><div class="sd">${d}</div></div></div>`).join('');
  return `<div class="content">
    ${topbar('<span>Home</span>')}
    <div class="scroll"><div class="pad">
      <div class="home-hero">
        <h1>Good Morning, Raashi.</h1>
        <div class="sub">What would you like to do today?</div>
        <div class="promptBox" id="homePrompt">
          <div class="promptBox__content">
            ${state.fileChip?`<div class="fileChip"><span class="fileChip__ico">${icon('note',14)}</span><span class="fileChip__name">name of file.doc</span><span class="fileChip__x">${icon('close',12)}</span></div>`:''}
            <div class="promptBox__input" id="homeInput"><span class="promptBox__ph">Ask Marketing Agent</span></div>
            <div class="promptBox__actions">
              <button class="promptBox__ctrl">${icon('plus',18)}</button>
              <button class="promptBox__send" id="homeSend">${icon('arrowUp',18)}</button>
            </div>
          </div>
        </div>
        <!-- Simulate a scenario: dashed pill → the access point-change scenario -->
        <div class="simWrap">
          <button class="simPill" id="simPill" type="button">${icon('plus',14)} Simulate a scenario ${I.chev}</button>
          <div class="simMenu hidden" id="simMenu">
            <button class="simMenu__item" data-sim="ulPub">Unlink experiences from a published experiment</button>
            <button class="simMenu__item" data-sim="ulDraft">Unlink experiences from a draft experiment</button>
            <button class="simMenu__item" data-sim="lkExp">Link an experience to a published experiment</button>
            <button class="simMenu__item" data-sim="lkDraft">Link an experience to a draft experiment</button>
            <button class="simMenu__item" data-sim="mvExp">Move an experience to another experiment</button>
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

/* shared chat transcripts (built from real DS widgets). Each returns HTML.
   These accumulate as the flow progresses so the panel reads as one conversation. */
const SEARCH_CONV = ()=>
  userBubble('Find all QBO IPD campaigns created in the last 3 months.')
  // "created project" is its OWN agent group (Figma 2875:22232)
  + agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">QBO IPD campaigns</span>" project for you.</div>`,'')
  // disclosure + results card = a SEPARATE group (Figma 2875:22271); disclosure 16px above the card
  + agentMsg(
      disclosure('Looked at your brief, created a summary',['Looked at your brief','Searching QBO IPD campaigns','Compiling results'])
      + `<div class="chatBubble">Search results${objectCard('search','QBO IPD campaigns')}</div>`);

/* ---- CUMULATIVE TRANSCRIPT SEGMENTS ----
   The AI panel reads as ONE continuous conversation across every scene. Each
   downstream scene composes the full prior history (all recorded turns) and then
   appends its own new/active message. These segments are the RECORDED (completed)
   form of each turn, reused by later scenes so nothing is lost. */
// From/To diff block. Defaults to the campaign end-date change (04/22 → 08/31).
const ftRows = (from='04/22/2026', to='08/31/2026')=>`<div class="ft" style="margin-top:6px;margin-bottom:14px">
    <div class="ft__row"><div class="ft__k">From</div><div class="ft__v">${from}</div></div>
    <div class="ft__row"><div class="ft__k">To</div><div class="ft__v">${to}</div></div></div>`;
const ftBlk = (label,from,to)=>`<div class="ft-label">${label}</div>${ftRows(from,to)}`;
// user's change request
const CONV_CHANGE_REQ = ()=> userBubble('Change end date for campaign to 31 August and priority to high.');
// plan (recorded — "Looks good"). doneCount/loadingIndex drive the row markers so the
// plan-table in history reflects live progress as steps complete.
const CONV_PLAN = (doneCount=0, loadingIndex=-1)=> agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${planTableRows(doneCount,loadingIndex)}</div><p class="summaryCard__q">Does this look ok? I'll then proceed.</p>${recordedReply('Looks good')}</div>`);
// task 1 — end date + priority change (recorded — "Approved")
const CONV_CHANGE = ()=> agentMsg(`<div class="chatBubble">Changed end date for campaign to 08/31/2026 and priority to High.${objectCard('edit','Change end date and priority - ELM…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
// change summary (From/To for end date + priority) + download
const CONV_SUMMARY = ()=> agentMsg(`<div class="chatBubble">Here is a summary of the changes I've made:${ftBlk('Changed end date for campaign:','04/22/2026','08/31/2026')}${ftBlk('Changed priority:','Medium','High')}${dlLink()}</div>`);
// campaign summary review (recorded — "Approved")
const CONV_REVIEW = ()=> agentMsg(`<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to regenerate experiences.</div>${recordedReply('Approved')}</div>`);
// everything up to (not including) the change request
const CONV_TO_SEARCH = ()=> SEARCH_CONV();
// everything up to (not including) the plan
const CONV_TO_PLAN   = ()=> SEARCH_CONV() + CONV_CHANGE_REQ();
// everything up to (not including) task 1. plan(done,loading) reflects live progress.
const CONV_TO_CHANGE = (done=0, loading=-1)=> CONV_TO_PLAN() + CONV_PLAN(done, loading);
// everything up to (not including) the summary review (task 2)
const CONV_TO_REVIEW = (done=1, loading=-1)=> CONV_TO_CHANGE(done, loading) + CONV_CHANGE() + CONV_SUMMARY();
// everything up to (not including) the final update (task 3)
const CONV_TO_UPDATE = (done=2, loading=-1)=> CONV_TO_REVIEW(done, loading) + CONV_REVIEW();

/* ============================================================
   SCENARIO 2 — WORKBOOK-BASED CHANGE ORDER (transcript segments)
   Same cumulative-transcript pattern as the prompt flow. 5 tasks.
   ============================================================ */
const WB_PLAN_TASKS = [
  'Change IPD content and images to reflect new pricing',
  'Review change summary','Update the campaign',
];
function wbPlanTableRows(doneCount=0, loadingIndex=-1){
  const marker=(i)=>{
    if(i<doneCount) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loadingIndex) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return WB_PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
// user prompt (workbook attached) — file chip + prompt
const WB_USER = ()=> userBubble(`<span class="bubbleFile"><span class="bubbleFile__ico">${icon('note',14)}</span>Name of file.csv <span class="bubbleFile__badge">1</span></span><br>${WORKBOOK_PROMPT}`);
// created project bubble
const WB_CREATED = ()=> agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">Change order - DIWM QB Live campaign</span>" project for you.</div>`,'');
// "Here's what I understood" 3-row understanding table + Looks good
const WB_UNDERSTOOD_TABLE = `<div class="planTable" style="margin:0">
    ${[['IPD content','Update to reflect new pricing'],['Images','Update to reflect new pricing']].map(([a,b])=>`<div class="planTable__row planTable__row--2col"><span class="uw-k">${a}</span><span>${b}</span></div>`).join('')}
  </div>`;
const WB_UNDERSTOOD = ()=> agentMsg(
  disclosure('Looked at your brief, created a summary',['Looked at your brief','Reading the workbook','Compiling changes'])
  + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood will be changed.</p>${WB_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look right? I'll put together a plan once you confirm.</p>${recordedReply('Looks good')}</div>`);
// plan (recorded)
const WB_PLAN = (done=0, loading=-1)=> agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${wbPlanTableRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${recordedReply('Looks good')}</div>`);
// task 1 recorded — billing offer IDs
const WB_BILLING = ()=> agentMsg(`<div class="chatBubble">Changed the billing offers IDs${objectCard('edit','Change IDs: Billing offers - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
// task 2 recorded — IPD content AND images (merged)
const WB_IPD = ()=> agentMsg(`<div class="chatBubble">Changed IPD content and images to reflect new pricing${objectCard('edit','Change IPD content and images: Pl…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
// change summary (From/To id/content) + download
const wbFtId = ()=>`<div class="ft" style="margin-top:6px;margin-bottom:14px"><div class="ft__row"><div class="ft__k">From</div><div class="ft__v">&lt;id&gt;</div></div><div class="ft__row"><div class="ft__k">To</div><div class="ft__v">&lt;id&gt;</div></div></div>`;
const wbFtContent = ()=>`<div class="ft" style="margin-top:6px;margin-bottom:14px"><div class="ft__row"><div class="ft__k">From</div><div class="ft__v">&lt;content&gt;</div></div><div class="ft__row"><div class="ft__k">To</div><div class="ft__v">&lt;content&gt;</div></div></div>`;
const WB_SUMMARY = ()=> agentMsg(`<div class="chatBubble">Here is a summary of the changes I've made:<div class="ft-label">Changed IPD content and images to reflect new pricing</div>${wbFtContent()}${dlLink()}</div>`);
// task 3 recorded — review
const WB_REVIEW = ()=> agentMsg(`<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to task 3.</div>${recordedReply('Approved')}</div>`);
// composed "history up to" helpers (4 steps now: billing → ipd+images → review → update)
const WB_TO_PLAN     = ()=> WB_USER() + WB_CREATED() + WB_UNDERSTOOD();
const WB_TO_BILLING  = (d=0,l=-1)=> WB_TO_PLAN() + WB_PLAN(d,l);
const WB_TO_IPD      = (d=0,l=-1)=> WB_TO_BILLING(d,l);
const WB_TO_REVIEW   = (d=1,l=-1)=> WB_TO_IPD(d,l) + WB_IPD() + WB_SUMMARY();
const WB_TO_UPDATE   = (d=2,l=-1)=> WB_TO_REVIEW(d,l) + WB_REVIEW();

/* ============================================================
   SCENARIO 3 — PROMPT-BASED CHANGE ORDER (billing IDs + IPD content)
   Same task body as the workbook flow, but the intake is a typed prompt
   (no CSV chip). Only ONE billing offer ID is replaced → single-row highlight.
   Cloned P2_* transcript so it can diverge from the workbook flow.
   ============================================================ */
const P2_PLAN_TASKS = [
  'Change IPD content and images',
  'Review change summary','Update the campaign',
];
function p2PlanTableRows(doneCount=0, loadingIndex=-1){
  const marker=(i)=>{
    if(i<doneCount) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loadingIndex) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return P2_PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
// user prompt (typed — NO file chip)
const P2_USER = ()=> userBubble(PROMPTCO_PROMPT.replace(/\n/g,'<br>'));
const P2_CREATED = ()=> agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">Change order - DIWM QB Live campaign</span>" project for you.</div>`,'');
// "Here's what I understood" table — exact wording from the shared screen
// prompt CO (IPD) understood card: From → To format (Figma 8802:32859) — flush blocks,
// the summary card's 12px flex gap provides all vertical rhythm
const p2FtBlk=(label,from,to)=>`<div class="ft-label" style="margin:0">${label}</div><div class="ft" style="margin:0">
    <div class="ft__row"><div class="ft__k">From</div><div class="ft__v">${from}</div></div>
    <div class="ft__row"><div class="ft__k">To</div><div class="ft__v">${to}</div></div></div>`;
const P2_UNDERSTOOD_TABLE =
  p2FtBlk('IPD content headline:','Get 50% off Payroll for the next 3 months*','Get 90% off Payroll for the next 3 months*')
  + p2FtBlk('IPD creative Image:','123.png','imagename.png');
const P2_UNDERSTOOD = ()=> agentMsg(
  disclosure('Looked at your brief, created a summary',['Looked at your brief','Reading your request','Compiling changes'])
  + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood will be changed.</p>${P2_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look right? I'll put together a plan once you confirm.</p>${recordedReply('Looks good')}</div>`);
const P2_PLAN = (done=0, loading=-1)=> agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${p2PlanTableRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${recordedReply('Looks good')}</div>`);
const P2_BILLING = ()=> agentMsg(`<div class="chatBubble">Changed the billing offers IDs${objectCard('edit','Change IDs: Billing offers - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
const P2_IPD = ()=> agentMsg(`<div class="chatBubble">Changed IPD content and images to reflect new pricing${objectCard('edit','Change IPD content and images: Pl…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
const P2_SUMMARY = ()=> agentMsg(`<div class="chatBubble">Here is a summary of the changes I've made:<div class="ft-label">Changed IPD content and images to reflect new pricing</div>${wbFtContent()}${dlLink()}</div>`);
const P2_REVIEW = ()=> agentMsg(`<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to task 3.</div>${recordedReply('Approved')}</div>`);
const P2_TO_PLAN     = ()=> P2_USER() + P2_CREATED() + P2_UNDERSTOOD();
const P2_TO_BILLING  = (d=0,l=-1)=> P2_TO_PLAN() + P2_PLAN(d,l);
const P2_TO_IPD      = (d=0,l=-1)=> P2_TO_BILLING(d,l);
const P2_TO_REVIEW   = (d=1,l=-1)=> P2_TO_IPD(d,l) + P2_IPD() + P2_SUMMARY();
const P2_TO_UPDATE   = (d=2,l=-1)=> P2_TO_REVIEW(d,l) + P2_REVIEW();
// scenario #2 billing table: ONLY the replaced ID (row 0 = 20059622) is highlighted
function p2SummaryTables(hl=true){
  // scenario-2 changes one billing ID + IPD content; end dates untouched → original 04/22
  const bill = billingRows('04/22/2026',false).map((r,i)=>({...r,editedRow:hl&&i===0}));
  const placeHi=new Set([0,1,3,5]);
  const place = PLACEMENTS.map((r,i)=>({...r,editedRow:hl&&placeHi.has(i)}));
  return `<div class="sec-label">Audiences</div>${tableHTML(COL.aud,AUDIENCES)}
    <div class="sec-label">Access point</div>${tableHTML(COL.place,place)}
    <div class="sec-label">Experiments</div>${tableHTML(COL.exp,experimentRows('04/22/2026',false))}`;
}

/* ---- Scene 1: SEARCH RESULTS (multiple) ----
   Interaction: user CHECKS a campaign (select), which enables "View (n)".
   Clicking View drills into that campaign. Nothing advances on a stray click. */
scenes.searchMultiple = (state={})=>{
  const phase = state.phase;            // 'boot' | 'created' | undefined
  const loading = state.loading;        // search loader + skeleton table
  const sel = new Set(state.selected||[]);
  const n = sel.size;
  const uPrompt = userBubble('Find all QBO IPD campaigns created in the last 3 months.');
  const createdBubble = `<div class="chatBubble">I have created "<span class="chatBubble__name">QBO IPD campaigns</span>" project for you.</div>`;
  // ── FULL-SCREEN boot loader (step 1): centered spinner + "Creating a project"
  //    on an empty canvas — NO messages yet. Shown right after the user sends. ──
  if(phase==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  // ── CENTERED phase: prompt → created bubble → searching loader play in a single
  //    centered conversation column — NO canvas, NO toolbar, NO pagination. ──
  if(phase==='msg-prompt' || phase==='msg-created' || phase==='msg-search'){
    let centeredBody = uPrompt;
    if(phase==='msg-created' || phase==='msg-search') centeredBody += agentMsg(createdBubble);
    if(phase==='msg-search') centeredBody += agentLoader('Searching campaigns', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>')}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }
  let body, table;
  if(loading){
    body = uPrompt + agentMsg(createdBubble) + agentLoader('Searching campaigns', state.tasks||[]);
    table = skeletonTable(COL.search,true);        // canvas skeleton
  } else {
    body = SEARCH_CONV();
    table = tableHTML(COL.search,SEARCH_ROWS,{checkbox:true,select:true,selected:sel});
  }
  const act = (icon,label)=>`<span class="act ${n?'act--on':'act--off'}">${icon} ${label} (${n})</span>`;
  const pager = loading ? '' : `<div class="pager">
        <span>1-10 of 22 items</span>
        <span class="nav">${I.chevL}<span>Page</span><span class="box">1</span><span>of 3</span>${I.chevR}</span>
      </div>`;
  const content = `<div class="content${state.opening?' content--opening':''}">
    ${topbar('<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>')}
    <div class="scroll"><div class="pad">
      <h2 class="page-h">QBO IPD campaigns in the last 3 months</h2>
      <div class="toolbar">
        <div class="search">${I.search}<span>Search</span></div>
        <span class="iconbtn">${I.sliders}</span><span class="iconbtn">${I.sortLines}</span>
      </div>
      ${table}
      ${pager}
    </div></div>
    <div class="selbar selbar--footer">${n} of n selected
      <div class="acts">
        ${act(I.keep,'Keep')}
        ${act(I.minus,'Remove')}
        <span class="act act--view ${n?'act--on':'act--off'}" ${n?'data-view-selected':''}>${I.eye} View (${n})</span>
      </div>
    </div>
  </div>`;
  return content + aiPanel({body,opening:state.opening});
};

/* detail body builder shared by scenes 2 & 3 (single campaign) */
/* shared Experiences tab panel (toolbar + table + pager).
   opts.loading → skeleton; opts.highlight → set of edited row indices (yellow + "Edited");
   opts.status → default status for non-edited rows ('Draft' | 'Published'). */
function experiencesPanel(opts={}){
  const loading = opts.loading;
  const hi = opts.highlight instanceof Set ? opts.highlight : new Set(opts.highlight||[]);
  const status = opts.status || 'Draft';
  const hlOn = opts.hlOn!==false;   // "Highlight changes" toggle (default on)
  // opts.allEdited → every row is Edited (yellow); otherwise only rows in `highlight`.
  const rows = Array(10).fill(0).map((_,i)=>{const ed=opts.allEdited||hi.has(i);return {exp:'ELM9071-IPD-HelloChartAcc-US…',expEdited:ed && hlOn,eid:'4d738ef0-9505-11f1-86ec-a3e65…',status:ed?'Edited':status,ap:'Chart of Accounts -hellobox',tmpl:'helloboxThirdParty',prio:'15.0',by:'Stroupe, Kristin',mod:'06/30 18:30PST'};});
  const cols=[{label:'Experience',key:'exp',info:1,editedKey:'expEdited'},{label:'Experience ID',key:'eid'},{label:'Status',key:'status',badge:1},{label:'Access point',key:'ap'},{label:'Template',key:'tmpl'},{label:'Priority',key:'prio'},{label:'Created by',key:'by'},{label:'Last updated',key:'mod'}];
  const expTable = loading ? skeletonTable(cols,true) : tableHTML(cols,rows,{checkbox:true,drillrow:opts.drillrow});
  const pager = loading ? '' : `<div class="pager"><span>1-10 of 64 items</span><span class="nav">${I.chevL}<span>Page</span><span class="box">1</span><span>of 3</span>${I.chevR}</span></div>`;
  // bottom action bar (Figma 919:48089): 0 selected → all actions disabled
  const selbar = loading ? '' : `<div class="selbar">0 of n selected${opts.hlToggle?`<span class="selbar__vd"></span><label class="hlToggle"><input type="checkbox" data-hlchanges${hlOn?' checked':''}> Highlight changes</label>`:''}
      <div class="acts">
        <span class="act act--off">${I.keep} Keep (0)</span>
        <span class="act act--off">${I.minus} Remove (0)</span>
        <span class="act act--view act--off">${I.eye} View (0)</span>
      </div>
    </div>`;
  return `<div class="toolbar">
      <div class="search">${I.search}<span>Search</span></div>
      <span class="iconbtn">${I.sliders}</span>
      <span class="groupby">Group by ${I.chev}</span>
    </div>${expTable}${pager}${selbar}`;
}

/* Insights tab — campaign-level metric cards (reuses the home .metrics styling). */
function insightsPanel(){
  const spark = `<svg class="spark" viewBox="0 0 200 48" preserveAspectRatio="none"><polyline points="0,34 30,20 60,30 90,12 120,26 150,16 180,28 200,18" fill="none" stroke="#5d47d5" stroke-width="2"/></svg>`;
  const metric = (label,val,delta,cls)=>`<div class="mcard"><div class="ml">${label}</div><div class="mv">${val}</div><div class="md ${cls}">${delta}</div>${spark}</div>`;
  return `<div style="margin-top:20px">
    <div class="metrics" style="grid-template-columns:repeat(4,1fr)">
      ${metric('IPD Impressions','6.4M','↑ 12K vs last week','up')}
      ${metric('Click-through rate','3.8%','↑ 0.4% vs last week','up')}
      ${metric('Offer conversions','18.2K','↑ 9K this week','up')}
      ${metric('Cost per acquisition','$42.10','↓ 0.2 vs last week','dn')}
    </div>
  </div>`;
}

function detailContent({crumb,view,endDate,edited,showIdentity,tab}){
  tab = tab || 'meta';
  const dataBody = view==='tree' ? treeView(false) : campaignDataTables(endDate,edited);
  const identity = showIdentity ? `<div class="identity">
      <span class="tile" style="background:var(--node-campaign)">${I.tileMega}</span>
      <span><span class="k">CAMPAIGN</span><div class="v">DIWM QB Live campaign ${badge('Draft')}</div></span>
    </div>` : '';
  const header = showIdentity ? '' : `<div class="detail-h">
      <span class="back" data-back>${I.back}</span>
      <span class="title">DIWM QB Live campaign</span>
      <span class="detail-vd"></span>
      ${badge('Published')}
      <span class="detail-vd"></span>
      <span class="detail-sub" style="margin:0">Last updated: 1 min ago</span>
      <span class="verselect">v1 ${I.chev}</span>
    </div>`;
  const metaBody = `${identity}
      ${metaGrid()}
      <div class="data-head"><span class="h">Campaign data</span>${viewToggle(view)}</div>
      <div id="dataZone">${dataBody}</div>`;
  const expBody = experiencesPanel({status:'Published'});   // pre-edit: all Published, no highlights
  return `<div class="content">
    ${topbar(crumb)}
    <div class="scroll"><div class="pad">
      <div class="detail-sticky">
        ${header}
        <div class="tabs tabs--insticky tabs--exp" style="${showIdentity?'':'margin-top:18px'}">
          <span class="tab ${tab==='meta'?'active':''}" data-tab="meta">Campaign meta</span>
          <span class="tab ${tab==='experiences'?'active':''}" data-tab="experiences">Experiences</span>
          <span class="tab ${tab==='insights'?'active':''}" data-tab="insights">Insights</span>
        </div>
      </div>
      ${tab==='insights' ? insightsPanel() : tab==='experiences' ? expBody : metaBody}
    </div></div>
  </div>`;
}

/* ---- Scene 2: SINGLE CAMPAIGN (drill-down) ---- */
scenes.singleCampaign = (state={view:'table'})=>{
  const draft = state.draft || '';
  return detailContent({crumb:'<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>',view:state.view,endDate:'04/22/2026',edited:false,tab:state.tab})
    + aiPanel({body:SEARCH_CONV(), draft});
};

/* ---- Scene 3: CHANGE-ORDER INTENT + plan playback ---- */
const PLAN_TASKS = [
  'Change end date and priority',
  'Review change summary','Update the campaign',
];
/* plan-table rows shared by planCard + CONV_PLAN.
   rows < doneCount → green check; row === loadingIndex → II spinner; else → number. */
function planTableRows(doneCount=0, loadingIndex=-1){
  const marker=(i)=>{
    if(i<doneCount) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loadingIndex) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
function planCard(doneCount=0, loadingIndex=-1){
  return `<div class="summaryCard">
    <p class="summaryCard__intro">I will make the changes in the following order:</p>
    <div class="planTable">
      <div class="planTable__head"><span>Task</span><span>What happens</span></div>
      ${planTableRows(doneCount,loadingIndex)}
    </div>
    <p class="summaryCard__q">Does this look ok? I'll then proceed.</p>
    ${replyBtn('Looks good','looksGood')}
  </div>`;
}
scenes.coIntent = (state={view:'table'})=>{
  const loading = state.loading;
  const conv = CONV_TO_PLAN();
  const body = loading
    ? conv + agentLoader('Creating a plan', state.tasks||[])
    : conv + agentMsg(disclosure('Read your brief, created a plan',['Reading your request','Mapping requested changes','Ordering the tasks']) + planCard(0));
  return detailContent({crumb:'<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>',view:state.view,endDate:'04/22/2026',edited:false}) + aiPanel({body});
};

/* artifact table screen (billing / experiments) */
function artifactScreen({crumb,title,version,table,step,body,stepLoading}){
  const content = `<div class="content">
    ${topbar(crumb)}
    <div class="scroll"><div class="pad">
      <div class="detail-h"><span class="title">${title}</span>${version?`<span class="verselect">${version} ${I.chev}</span>`:''}</div>
      <div style="height:16px"></div>
      ${table}
    </div></div>
  </div>`;
  return content + aiPanel({step,body,stepLoading});
}

/* ---- Scene 4: TASK 1 — CHANGE END DATE + PRIORITY (campaign meta diff) ---- */
scenes.changeMeta = (state={})=>{
  const loading = state.loading;
  // step 1: while loading row 1 spins; once settled row 1 is checked
  const conv = CONV_TO_CHANGE(loading?0:1, loading?0:-1);
  const body = loading
    ? conv + agentLoader('Changing end date and priority', state.tasks||[])
    : conv + agentMsg(
        `<div class="chatBubble">Changed end date for campaign to 08/31/2026 and priority to High.${objectCard('edit','Change end date and priority - ELM…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','approveChange')}</div>`);
  // canvas = campaign meta; once settled, END DATE + PRIORITY show the new values highlighted.
  const settled = !loading;
  // this step reviews just the campaign meta → NO grey container (bare grid)
  const hl = state.hl!==false;
  const metaOpts = settled ? {endDate:'08/31/2026',priority:'High',highlight:hl,bare:true} : {bare:true};
  const canvas = loading
    ? summarySkeleton()
    : `<div class="detail-h"><span class="title">Campaign Meta - DIWM QB Live campaign</span></div>
      <div style="height:16px"></div>
      ${metaGrid(metaOpts)}
      ${hlBar(hl)}`;
  const content = `<div class="content">
    ${topbar('<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>')}
    <div class="scroll"><div class="pad">${canvas}</div></div>
  </div>`;
  return content + aiPanel({step:'1.  Change end date and priority',body,stepLoading:loading});
};

/* ---- Scene 6: CAMPAIGN OBJECT — diff summary (table ⇄ tree) ---- */
scenes.campaignObject = (state={view:'table'})=>{
  const loading = state.loading;
  // reveal: 0 = neither new bubble, 1 = summary only, 2 = summary + review (default when settled)
  const reveal = state.reveal!==undefined ? state.reveal : 2;
  // step 2 (review): row 1 done; loading → row 2 spins; settled → rows 1-2 checked
  const priorConv = CONV_TO_CHANGE(loading?1:2, loading?1:-1) + CONV_CHANGE();
  const summaryMsg = CONV_SUMMARY();
  const reviewMsg = agentMsg(
    `<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to regenerate experiences.</div>${replyBtn('Approve','approveCampaign')}</div>`);
  let body;
  if(loading){
    body = priorConv + agentLoader('Reviewing change summary', state.tasks||[]);
  } else {
    // messages appear one after the other: summary first, then the review bubble
    body = priorConv + (reveal>=1?summaryMsg:'') + (reveal>=2?reviewMsg:'');
  }
  // only the campaign end date + priority change; billing/experiment end dates stay 04/22 (unedited)
  const dataBody = state.view==='tree' ? treeView(false) : campaignDataTables('04/22/2026',false);
  // before the summary appears, show a skeleton canvas (something is loading)
  const canvas = loading
    ? summarySkeleton()
    : `<div class="detail-h"><span class="title">Campaign summary - DIWM QB Live campaign</span></div>
      <div style="height:10px"></div>
${metaGrid({endDate:'08/31/2026',priority:'High',highlight:state.hl!==false})}
      <div class="data-head"><span class="h">Campaign data</span>${viewToggle(state.view)}</div>
      <div id="dataZone">${dataBody}</div>
      ${hlBar(state.hl!==false)}`;
  const content = `<div class="content">
    ${topbar('<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>')}
    <div class="scroll"><div class="pad">${canvas}</div></div>
  </div>`;
  return content + aiPanel({step:'2.  Review change summary',body,stepLoading:loading});
};

/* ---- Scene 7: CAMPAIGN TREE - Segment view (final) ---- */
scenes.campaignTree = (state={view:'tree',tab:'experiences'})=>{
  const loading = state.loading;
  // step 3 (final): rows 1-2 done; loading → row 3 spins; settled → all 3 checked
  const savedConv = CONV_TO_UPDATE(loading?2:3, loading?2:-1);
  const body = loading
    ? savedConv + agentLoader('Updating the campaign', state.tasks||[])
    : savedConv + agentMsg(
        `<div class="chatBubble">Updated campaign and regenerated experiences with the end date and priority changes.${objectCard('megaphone','Update campaign - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok?</div>${replyBtn('Looks good','looksGoodFinal')}</div>`);

  let mainInner;
  if(state.tab==='insights'){
    mainInner = insightsPanel();
  } else if(state.tab==='experiences'){
    // regenerated experiences: ALL rows Edited (yellow + "Edited"); skeleton while loading
    mainInner = experiencesPanel({loading, allEdited:true, status:'Published', hlToggle:true, hlOn:state.hl!==false});
  } else {
    // only the campaign end date + priority change; billing/experiment end dates stay 04/22 (unedited)
    const dataBody = state.view==='tree' ? treeView(true) : campaignDataTables('04/22/2026',false);
    const hl = state.hl!==false;
    mainInner = `${metaGrid({endDate:'08/31/2026',priority:'High',highlight:hl})}
      <div class="data-head"><span class="h">Campaign data</span>${viewToggle(state.view)}</div>
      <div id="dataZone">${dataBody}</div>
      ${hlBar(hl)}`;
  }
  const content = `<div class="content">
    ${topbar('<span>Home</span> <span class="sep">/</span> <span>QBO IPD campaigns</span>')}
    <div class="scroll"><div class="pad">
      <div class="detail-sticky">
        <div class="detail-h">
          <span class="title">DIWM QB Live campaign</span>
          <span class="detail-vd"></span>
          ${badge('Edited')}
          <span class="detail-vd"></span>
          <span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span>
          <span class="verselect">v2 ${I.chev}</span>
        </div>
        <div class="tabs tabs--insticky tabs--exp">
          <span class="tab ${state.tab==='meta'?'active':''}" data-tab="meta">Campaign meta</span>
          <span class="tab ${state.tab==='experiences'?'active':''}" data-tab="experiences">Experiences</span>
          <span class="tab ${state.tab==='insights'?'active':''}" data-tab="insights">Insights</span>
        </div>
      </div>
      ${mainInner}
    </div></div>
  </div>`;
  return content + aiPanel({step:'3.  Update campaign',body,stepLoading:loading});
};

/* ============================================================
   SCENARIO 2 — WORKBOOK SCENES
   Reuses artifactScreen, tableHTML (edited highlights), plan/step spinners,
   cumulative WB_* transcript. Access point rows drill down to a content table.
   ============================================================ */
const WB_CRUMB = '<span>Home</span> <span class="sep">/</span> <span>Change order - DIWM QB Live campaign</span>';

// content (Hellobox) drill-down. mode 'both' = merged IPD content + images:
// Headline / Body / CTA / Image / Metadata columns; edited rows highlight Headline + Image + Metadata.
/* ---- drill-down "Creatives" view (Figma 5236-166780 detail / 5323-102736 preview) ----
   The wide table was replaced by stacked creative CARDS with a Detail | Preview toggle. */
// Detail values mirror the Preview creative content (single source of truth)
const CREATIVE_HEADLINE = 'Get 90% off Payroll for the next 3 months*';
const CREATIVE_BODY = "Limited-time offer–claim before your trial ends. We'll calculate, file, and pay your payroll taxes automatically.";
const CREATIVE_CTA = 'Claim your offer';

// PLACEMENT / TEMPLATE attribute row + "Creatives" section header with the toggle
function creativesHeader(view){
  return `<div class="cd-attr">
      <div><div class="cd-attr__k">ACCESS POINT</div><div class="cd-attr__v">Chart of Accounts -hellobox</div></div>
      <div><div class="cd-attr__k">TEMPLATE</div><div class="cd-attr__v">helloboxThirdParty</div></div>
    </div>
    <div class="cd-head"><span class="cd-head__t">Creatives</span>
      <div class="cvtoggle" data-cvtoggle>
        <button data-cv="detail" class="${view==='detail'?'active':''}">${DETAIL_ICON} Detail</button>
        <button data-cv="preview" class="${view==='preview'?'active':''}">${IMAGE_ICON} Preview</button>
      </div>
    </div>`;
}
// one attribute/value pair; `edited` wraps the value in the yellow highlight
function cdPair(label,value,edited,link){
  const v = `<span class="cd-pair__v${link?' cd-pair__v--link':''}${edited?' cd-hl':''}">${value}</span>`;
  return `<div class="cd-pair"><div class="cd-pair__k">${label}</div>${v}</div>`;
}
// DETAIL view: 9 creative cards. Create flow = freshly parsed content, so no
// edit highlights (yellow marks are change-order semantics only).
function contentDetail(hl=false){
  const cards = Array.from({length:9}).map((_,i)=>{
    const edited = hl && i<6;
    return `<div class="cd-card">
      <div class="cd-card__name">Hellobox - Chart of Accounts</div>
      <div class="cd-row">${cdPair('HEADLINE',CREATIVE_HEADLINE,edited)}${cdPair('BODY',CREATIVE_BODY,false)}</div>
      <div class="cd-row">${cdPair('CTA',CREATIVE_CTA,false)}${cdPair('IMAGE','imagename.png',edited,true)}</div>
    </div>`;
  }).join('');
  return `<div class="cd-list">${cards}</div>`;
}
// PREVIEW view: 9 creative cards rendering the actual creative. No edit
// highlights in the create flow.
function helloboxCreative(hl=false, opts={}){
  // opts.sub / opts.foot are the fields the hellobox image access point adds — rendered
  // with the inline highlight so the yellow hugs the text, not the whole row.
  const mark = (t)=> opts.hl===false ? t : `<span class="cd-hl">${t}</span>`;
  const sub  = opts.sub  ? `<div class="hb-sub">${mark(opts.sub)}</div>` : '';
  const fine = opts.foot ? `${mark(opts.foot)} <a href="#">Terms apply</a>`
                         : `Offer valid for new paid subscriptions only. <a href="#">Terms apply</a>`;
  const tmpl = opts.tmpl || 'helloboxThirdParty';
  return `<div class="preview-wrap preview-wrap--wide">
        <div class="hellobox">
          <div class="art${hl?' cd-hl-border':''}">${I.tag}</div>
          <div class="body">
            <span class="lt">limited time</span>
            <h4><span class="${hl?'cd-hl':''}">${CREATIVE_HEADLINE}</span></h4>
            ${sub}
            <p>${opts.body||CREATIVE_BODY}</p>
            <span class="cta">${CREATIVE_CTA}</span>
            <div class="fine">${fine}</div>
          </div>
        </div>
        <div class="preview-cap">Preview · ${tmpl} · SBSEG QBO Hellobox AppAccountsettings</div>
      </div>`;
}
function contentPreview(hl=false){
  const cards = Array.from({length:9}).map((_,i)=>`<div class="cd-card">
      <div class="cd-card__name">Hellobox - Chart of Accounts</div>
      ${helloboxCreative(hl&&i<6)}
    </div>`).join('');
  return `<div class="cd-list">${cards}</div>`;
}
// experience drill-down Creative tab: ONE creative, bare — the .cd-card outline
// only groups multiple creatives on a access point, so it's dropped here.
function singleCreative(view){
  if(view==='preview') return `<div class="creativeCenter">${helloboxCreative()}</div>`;
  return `<div class="cd-row">${cdPair('HEADLINE',CREATIVE_HEADLINE,false)}${cdPair('BODY',CREATIVE_BODY,false)}</div>
    <div class="cd-row" style="margin-top:16px">${cdPair('CTA',CREATIVE_CTA,false)}${cdPair('IMAGE','imagename.png',false,true)}</div>`;
}
/* Clone review creative (scenario 2). Same shape as singleCreative, but the
   carried-over body copy is over the new access point's limit until it's fixed:
   over=true shows the original copy with the field-level error (Figma
   6306:11217 — no border, value unchanged, red icon + message beneath),
   over=false shows the corrected copy. Nothing is highlighted: a clone is a new
   object, not an edit. */
function cloneCreative(view, over, edited){
  const body = over ? CREATIVE_BODY : BODY_FIXED;
  if(view==='preview') return `<div class="creativeCenter">${helloboxCreative(false,{body})}</div>`;
  const bodyErr = over ? `<div class="cd-pair__err">${ERR_ICON}<span>${BODY_ERR}</span></div>` : '';
  // once the copy has been supplied the BODY is a changed field, so it carries
  // the same highlight as the access point and template
  const bodyCls = (!over && edited) ? ' cd-hl' : '';
  return `<div class="cd-row">${cdPair('HEADLINE',CREATIVE_HEADLINE,false)}<div class="cd-pair"><div class="cd-pair__k">BODY</div><span class="cd-pair__v${bodyCls}">${body}</span>${bodyErr}</div></div>
    <div class="cd-row" style="margin-top:16px">${cdPair('CTA',CREATIVE_CTA,false)}${cdPair('IMAGE','imagename.png',false,true)}</div>`;
}
// dispatch by view
function creativesBody(view, hl=false){ return view==='preview' ? contentPreview(hl) : contentDetail(hl); }

// access point table where each row drills into the content table (steps 2 & 3).
// rows 0,1,3,5 highlighted; every row clickable (data-drillplace) to open content.
function placementDrill(hl=true){
  // rows 1,2,4,6 (1-indexed) highlighted; the rest stay white
  const hi=new Set([0,1,3,5]);
  const rows = PLACEMENTS.map((r,i)=>({...r, editedRow:hl&&hi.has(i)}));
  return tableHTML(COL.place, rows, {drillrow:true});
}
// slim action bar: ONLY the Highlight-changes toggle (no count, no CTAs)
const hlBar=(on)=>`<div style="height:16px"></div><div class="selbar selbar--hlonly"><label class="hlToggle"><input type="checkbox" data-hlchanges${on?' checked':''}> Highlight changes</label></div>`;

/* ---- WB intake: Change-order summary + plan (staggered like prompt flow) ---- */
scenes.coIntentWB = (state={})=>{
  const phase = state.phase;           // 'bootfull' | 'msg-user' | 'msg-created' | 'msg-understood' | 'msg-loader'
  const loading = state.loading;       // planning loader (after 'Looks good' on understanding)
  if(phase==='bootfull'){
    return `<div class="content">${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}<div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  // live understanding card (its "Looks good" pill triggers the planning loader)
  const understoodLive = disclosure('Looked at your brief, created a summary',['Looked at your brief','Reading the workbook','Compiling changes'])
    + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood will be changed.</p>${WB_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look right? I'll put together a plan once you confirm.</p>${replyBtn('Looks good','wbApproveUnderstood')}</div>`;
  if(phase==='msg-user' || phase==='msg-created' || phase==='msg-loader' || phase==='msg-understood' || phase==='planning'){
    let b = WB_USER();
    if(phase!=='msg-user') b += WB_CREATED();
    if(phase==='msg-loader') b += agentLoader('Looking at your brief', state.tasks||[]);
    if(phase==='msg-understood') b += agentMsg(understoodLive);
    if(phase==='planning') b += WB_UNDERSTOOD() + agentLoader('Creating a plan', state.tasks||[]);
    return `<div class="content content--centered">${topbar(WB_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${b}</div>
        ${expandedComposer()}
      </div></div></div>`;
  }
  // settled plan phase: understanding recorded → plan card with live "Looks good"
  const conv = WB_USER() + WB_CREATED() + WB_UNDERSTOOD();
  const body = loading
    ? conv + agentLoader('Creating a plan', state.tasks||[])
    : conv + agentMsg(disclosure('Looked at your brief, created a plan',['Reading your request','Mapping requested changes','Ordering the tasks']) + `<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${wbPlanTableRows(0,-1)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${replyBtn('Looks good','wbApprovePlan')}</div>`);
  return `<div class="content content--centered">${topbar(WB_CRUMB)}<div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${body}</div>
    ${expandedComposer()}
  </div></div></div>`;
};

/* ---- WB step 1: Change billing offer IDs ---- */
scenes.billingIDs = (state={})=>{
  const loading = state.loading;
  const conv = WB_TO_BILLING(loading?0:1, loading?0:-1);
  const body = loading
    ? conv + agentLoader('Changing billing offer IDs', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Changed the billing offers IDs${objectCard('edit','Change IDs: Billing offers - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','wbApproveBilling')}</div>`);
  // top 2 billing rows highlighted (IDs changed). skeleton shows while loading.
  const rows = billingRows('04/22/2026',false).map((r,i)=>({...r, editedRow:i<2}));
  const billTbl = (loading||state.skeleton) ? skeletonTable(COL.billing,false) : tableHTML(COL.billing, rows);
  return artifactScreen({crumb:WB_CRUMB,title:'Billing offers - DIWM QB Live campaign',table:billTbl,step:'1.  Change billing offer IDs',body,stepLoading:loading});
};

/* WB step 2 & 3 share a access point table that drills into the content table.
   state.drill = index of the access point row being viewed (content table shown). */
function wbPlacementScene({step,stepNum,conv,activeReply,replyId,loaderLabel,loading,tasks,mode,drill,drillLoading,crumb:crumbIn,creativeView,hl=true}){
  let canvas, title, crumb=crumbIn||WB_CRUMB, backForDrill=false;
  if(drill!==undefined && drill!==null){
    // content drill-down view (skeleton flashes before the creatives cards)
    backForDrill=true;
    title='Hellobox - Chart of Accounts';
    const view = creativeView==='preview' ? 'preview' : 'detail';
    const contentBody = drillLoading
      ? skeletonTable([{label:'Headline'},{label:'Body'},{label:'CTA'},{label:'Image'},{label:'Metadata'}],false)
      : creativesHeader(view) + creativesBody(view, hl);
    canvas = `<div class="detail-h"><span class="back" data-wbback>${I.back}</span><span class="title">Hellobox - Chart of Accounts</span><span class="detail-vd"></span>${badge('Edited')}<span class="detail-vd"></span>
        <span class="detail-sub" style="margin:0">Size:&nbsp;0k</span><span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span></div>
      <div style="height:16px"></div>${contentBody}
      ${drillLoading?'':hlBar(hl)}`;
    crumb = '<span>Home</span> <span class="sep">/</span> <span>DIWM QB Live campaign</span>';
  } else {
    title=`Access point - DIWM QB Live campaign`;
    canvas = `<div class="detail-h"><span class="title">Access point - DIWM QB Live campaign</span></div><div style="height:16px"></div>${loading?skeletonTable(COL.place,false):placementDrill(hl)+hlBar(hl)}`;
  }
  const bodyFull = loading ? conv + agentLoader(loaderLabel, tasks||[]) : conv + activeReply;
  const content = `<div class="content">${topbar(crumb)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step,body:bodyFull,stepLoading:loading});
}

// merged step 2: IPD content AND images — drill-down highlights headline + image + metadata together
scenes.ipdContent = (state={})=>{
  const loading=state.loading;
  const conv = WB_TO_IPD(loading?0:1, loading?0:-1);
  const activeReply = agentMsg(`<div class="chatBubble">Changed IPD content and images to reflect new pricing${objectCard('edit','Change IPD content and images: Pl…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','wbApproveIpd')}</div>`);
  return wbPlacementScene({step:'1.  Change IPD content and images',conv,activeReply,loaderLabel:'Changing IPD content and images',loading,tasks:state.tasks,mode:'both',drill:state.drill,drillLoading:state.drillLoading,creativeView:state.creativeView,hl:state.hl!==false});
};

/* ---- WB step 3: Review change summary ---- */
scenes.campaignObjectWB = (state={view:'table'})=>{
  const loading=state.loading;
  const reveal = state.reveal!==undefined ? state.reveal : 2;
  // history through the merged IPD+images approval (summary revealed separately below)
  const priorConv = WB_TO_IPD(loading?1:2, loading?1:-1) + WB_IPD();
  const summaryMsg = WB_SUMMARY();
  const reviewMsg = agentMsg(`<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to task 3.</div>${replyBtn('Approve','wbApproveReview')}</div>`);
  let body;
  if(loading){ body = priorConv + agentLoader('Reviewing change summary', state.tasks||[]); }
  else { body = priorConv + (reveal>=1?summaryMsg:'') + (reveal>=2?reviewMsg:''); }
  // campaign summary canvas with billing + access point rows highlighted yellow
  const hl = state.hl!==false;
  const canvas = loading ? summarySkeleton() : `<div class="detail-h"><span class="title">Campaign summary - DIWM QB Live campaign</span></div>
    <div style="height:10px"></div>
${metaGrid()}
    <div class="data-head"><span class="h">Campaign data</span>${viewToggle('table')}</div>
    <div id="dataZone">${wbSummaryTables(hl)}</div>
    ${hlBar(hl)}`;
  const content = `<div class="content">${topbar(WB_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'2.  Review change summary',body,stepLoading:loading});
};

// summary tables for WB review: audiences (plain), billing (2 rows yellow), access point (all yellow), experiments
function wbSummaryTables(hl=true){
  // billing-ID/IPD flow does NOT change end dates → keep original 04/22 (unchanged);
  // the whole-row highlight flags the billing offers whose IDs changed.
  const bill = billingRows('04/22/2026',false).map((r,i)=>({...r,editedRow:hl&&i<2}));
  const placeHi=new Set([0,1,3,5]);
  const place = PLACEMENTS.map((r,i)=>({...r,editedRow:hl&&placeHi.has(i)}));
  return `<div class="sec-label">Audiences</div>${tableHTML(COL.aud,AUDIENCES)}
    <div class="sec-label">Access point</div>${tableHTML(COL.place,place)}
    <div class="sec-label">Experiments</div>${tableHTML(COL.exp,experimentRows('04/22/2026',false))}`;
}

/* ---- WB step 5: Update the campaign (Experiences + same tree) ---- */
scenes.campaignTreeWB = (state={view:'tree',tab:'experiences'})=>{
  const loading=state.loading;
  const savedConv = WB_TO_UPDATE(loading?2:3, loading?2:-1);
  const body = loading
    ? savedConv + agentLoader('Updating the campaign', state.tasks||[])
    : savedConv + agentMsg(`<div class="chatBubble">Updated campaign and regenerated experiences with the changes to IPD content and images.${objectCard('megaphone','Update campaign - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok?</div>${replyBtn('Looks good','wbLooksGoodFinal')}</div>`);
  let mainInner;
  if(state.tab==='experiences'){
    mainInner = experiencesPanel({loading, highlight:[1,3,6,9], hlToggle:true, hlOn:state.hl!==false});
  } else if(state.tab==='insights'){
    mainInner = insightsPanel();
  } else {
    // Campaign meta tab reflects the WORKBOOK edits (billing IDs + access point highlights), not the prompt-flow end-date diff
    mainInner = `${metaGrid()}<div class="data-head"><span class="h">Campaign data</span>${viewToggle(state.view)}</div><div id="dataZone">${state.view==='tree'?treeView(true):wbSummaryTables()}</div>`;
  }
  const content = `<div class="content">${topbar(WB_CRUMB)}<div class="scroll"><div class="pad">
    <div class="detail-sticky"><div class="detail-h"><span class="title">DIWM QB Live campaign</span><span class="detail-vd"></span>${badge('Edited')}<span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span><span class="verselect">v2 ${I.chev}</span></div>
    <div class="tabs tabs--insticky tabs--exp"><span class="tab ${state.tab==='meta'?'active':''}" data-tab="meta">Campaign meta</span><span class="tab ${state.tab==='experiences'?'active':''}" data-tab="experiences">Experiences</span><span class="tab ${state.tab==='insights'?'active':''}" data-tab="insights">Insights</span></div></div>
    ${mainInner}</div></div></div>`;
  return content + aiPanel({step:'3.  Update the campaign',body,stepLoading:loading});
};

/* ============================================================
   SCENARIO 3 SCENES — prompt-based billing + IPD change order.
   Cloned from the workbook scenes; typed-prompt intake, single-row billing.
   ============================================================ */
const P2_CRUMB = '<span>Home</span> <span class="sep">/</span> <span>Change order - DIWM QB Live campaign</span>';

/* ---- P2 intake: prompt → created → understanding → plan ---- */
scenes.p2Intent = (state={})=>{
  const loading=state.loading, phase=state.phase;
  if(phase==='bootfull'){
    return `<div class="content">${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}<div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  const understoodLive = disclosure('Looked at your brief, created a summary',['Looked at your brief','Reading your request','Compiling changes'])
    + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood will be changed.</p>${P2_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look right? I'll put together a plan once you confirm.</p>${replyBtn('Looks good','p2ApproveUnderstood')}</div>`;
  if(phase==='msg-user' || phase==='msg-created' || phase==='msg-loader' || phase==='msg-understood' || phase==='planning'){
    let b = P2_USER();
    if(phase!=='msg-user') b += P2_CREATED();
    if(phase==='msg-loader') b += agentLoader('Looking at your brief', state.tasks||[]);
    if(phase==='msg-understood') b += agentMsg(understoodLive);
    if(phase==='planning') b += P2_UNDERSTOOD() + agentLoader('Creating a plan', state.tasks||[]);
    return `<div class="content content--centered">${topbar(P2_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${b}</div>
        ${expandedComposer()}
      </div></div></div>`;
  }
  const conv = P2_USER() + P2_CREATED() + P2_UNDERSTOOD();
  const body = loading
    ? conv + agentLoader('Creating a plan', state.tasks||[])
    : conv + agentMsg(disclosure('Looked at your brief, created a plan',['Reading your request','Mapping requested changes','Ordering the tasks']) + `<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${p2PlanTableRows(0,-1)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${replyBtn('Looks good','p2ApprovePlan')}</div>`);
  return `<div class="content content--centered">${topbar(P2_CRUMB)}<div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${body}</div>
    ${expandedComposer()}
  </div></div></div>`;
};

/* ---- P2 step 1: Change billing offer ID (single row highlighted) ---- */
scenes.p2Billing = (state={})=>{
  const loading = state.loading;
  const conv = P2_TO_BILLING(loading?0:1, loading?0:-1);
  const body = loading
    ? conv + agentLoader('Changing billing offer ID', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Changed the billing offers IDs${objectCard('edit','Change IDs: Billing offers - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','p2ApproveBilling')}</div>`);
  // ONLY the replaced ID (row 0 = 20059622) is highlighted; end date unchanged (04/22)
  const rows = billingRows('04/22/2026',false).map((r,i)=>({...r, editedRow:i===0}));
  const billTbl = (loading||state.skeleton) ? skeletonTable(COL.billing,false) : tableHTML(COL.billing, rows);
  return artifactScreen({crumb:P2_CRUMB,title:'Billing offers - DIWM QB Live campaign',table:billTbl,step:'1.  Change billing offer ID',body,stepLoading:loading});
};

/* ---- P2 step 2: Change IPD content and images (access point drill-down) ---- */
scenes.p2Ipd = (state={})=>{
  const loading=state.loading;
  const conv = P2_TO_IPD(loading?0:1, loading?0:-1);
  const activeReply = agentMsg(`<div class="chatBubble">Changed IPD content and images to reflect new pricing${objectCard('edit','Change IPD content and images: Pl…')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','p2ApproveIpd')}</div>`);
  return wbPlacementScene({step:'1.  Change IPD content and images',conv,activeReply,loaderLabel:'Changing IPD content and images',loading,tasks:state.tasks,mode:'both',drill:state.drill,drillLoading:state.drillLoading,crumb:P2_CRUMB,creativeView:state.creativeView,hl:state.hl!==false});
};

/* ---- P2 step 3: Review change summary ---- */
scenes.p2Review = (state={view:'table'})=>{
  const loading=state.loading;
  const reveal = state.reveal!==undefined ? state.reveal : 2;
  const priorConv = P2_TO_IPD(loading?1:2, loading?1:-1) + P2_IPD();
  const summaryMsg = P2_SUMMARY();
  const reviewMsg = agentMsg(`<div class="chatBubble">Here's the campaign summary for you review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll proceed to task 3.</div>${replyBtn('Approve','p2ApproveReview')}</div>`);
  let body;
  if(loading){ body = priorConv + agentLoader('Reviewing change summary', state.tasks||[]); }
  else { body = priorConv + (reveal>=1?summaryMsg:'') + (reveal>=2?reviewMsg:''); }
  const hl = state.hl!==false;
  const canvas = loading ? summarySkeleton() : `<div class="detail-h"><span class="title">Campaign summary - DIWM QB Live campaign</span></div>
    <div style="height:10px"></div>
${metaGrid()}
    <div class="data-head"><span class="h">Campaign data</span>${viewToggle('table')}</div>
    <div id="dataZone">${p2SummaryTables(hl)}</div>
    ${hlBar(hl)}`;
  const content = `<div class="content">${topbar(P2_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'2.  Review change summary',body,stepLoading:loading});
};

/* ---- P2 step 4: Update the campaign ---- */
scenes.p2Tree = (state={view:'tree',tab:'experiences'})=>{
  const loading=state.loading;
  const savedConv = P2_TO_UPDATE(loading?2:3, loading?2:-1);
  const body = loading
    ? savedConv + agentLoader('Updating the campaign', state.tasks||[])
    : savedConv + agentMsg(`<div class="chatBubble">Updated campaign and regenerated experiences with the changes to IPD content and images.${objectCard('megaphone','Update campaign - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok?</div>${replyBtn('Looks good','p2LooksGoodFinal')}</div>`);
  let mainInner;
  if(state.tab==='experiences'){
    mainInner = experiencesPanel({loading, highlight:[1,3,6,9], hlToggle:true, hlOn:state.hl!==false});
  } else if(state.tab==='insights'){
    mainInner = insightsPanel();
  } else {
    mainInner = `${metaGrid()}<div class="data-head"><span class="h">Campaign data</span>${viewToggle(state.view)}</div><div id="dataZone">${state.view==='tree'?treeView(true):p2SummaryTables()}</div>`;
  }
  const content = `<div class="content">${topbar(P2_CRUMB)}<div class="scroll"><div class="pad">
    <div class="detail-sticky"><div class="detail-h"><span class="title">DIWM QB Live campaign</span><span class="detail-vd"></span>${badge('Edited')}<span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span><span class="verselect">v2 ${I.chev}</span></div>
    <div class="tabs tabs--insticky tabs--exp"><span class="tab ${state.tab==='meta'?'active':''}" data-tab="meta">Campaign meta</span><span class="tab ${state.tab==='experiences'?'active':''}" data-tab="experiences">Experiences</span><span class="tab ${state.tab==='insights'?'active':''}" data-tab="insights">Insights</span></div></div>
    ${mainInner}</div></div></div>`;
  return content + aiPanel({step:'3.  Update the campaign',body,stepLoading:loading});
};

/* skeleton canvas for the Campaign summary scene (shown before the summary appears) */
function summarySkeleton(){
  const bar=(w,h=14,mt=0)=>`<span class="cfskel cfskel--bar" style="display:block;width:${w};height:${h}px;margin-top:${mt}px"></span>`;
  const metaCell=()=>`<div>${bar('40%',10)}${bar('70%',16,8)}</div>`;
  return `<div style="max-width:520px">${bar('55%',26)}</div>
    <div style="height:18px"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <span class="cfskel" style="width:36px;height:36px;border-radius:8px"></span>
      <div style="flex:1;max-width:260px">${bar('30%',10)}${bar('60%',16,8)}</div>
    </div>
    <div style="height:24px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px 64px;max-width:760px">
      ${Array.from({length:8}).map(metaCell).join('')}
    </div>
    <div style="height:28px"></div>
    ${bar('160px',18)}
    <div style="height:14px"></div>
    <div class="tbl-wrap">${Array.from({length:6}).map((_,i)=>`<div style="display:flex;gap:24px;padding:16px 20px;border-bottom:1px solid #f1f1f3">${Array.from({length:5}).map((_,j)=>`<span class="cfskel cfskel--bar" style="flex:1;height:14px;max-width:${60+((i*7+j*11)%30)}%"></span>`).join('')}</div>`).join('')}</div>`;
}

/* key-value-pairs skeleton — for canvases that settle into meta grids or
   attribute/value expressions. Never implies a table. */
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

/* ============================================================
   SCENARIO 4 — CREATE A CAMPAIGN (from a Workbook / creative brief)
   Prompt-based. Same cumulative-transcript pattern; 6 create+validate tasks.
   Happy path (all Verified / Draft) — no yellow diffs. Local only.
   ============================================================ */
const CR_CRUMB = '<span>Home</span> <span class="sep">/</span> <span>DIWM QB Live campaign</span>';
const CR_PLAN_TASKS = [
  'Parse and validate campaign meta',
  'Parse and validate audiences',
  'Parse and validate access points',
  'Parse and validate experiments',
  'Review campaign summary',
  'Create experiences',
];
function crPlanTableRows(doneCount=0, loadingIndex=-1){
  const marker=(i)=>{
    if(i<doneCount) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loadingIndex) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return CR_PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
// user prompt (workbook attached) + created bubble
const CR_USER = ()=> userBubble(`<span class="bubbleFile"><span class="bubbleFile__ico">${icon('note',14)}</span>name of file.doc</span><br>I want to create a targeted offer campaign from this Workbook.`);
const CR_CREATED = ()=> agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">DIWM QB Live campaign</span>" project for you.</div>`,'');
// "Let me play back what I understood" — 6-row understanding table
const CR_UNDERSTOOD_TABLE = `<div class="planTable" style="margin:0">
    ${[['Campaign','DIWM QB Live campaign'],['Product','QBL (QB Live Assisted)'],['Locale','en-us'],['Duration','Jan 28, 2026 - Apr 22, 2026'],['Goal','XSell/Attach, Buy, Upgrade, Discount'],['Total offers','64']].map(([a,b])=>`<div class="planTable__row planTable__row--2col"><span class="uw-k">${a}</span><span>${b}</span></div>`).join('')}
  </div>`;
const CR_UNDERSTOOD = ()=> agentMsg(
  disclosure('Parsed workbook',['Reading documents','Collecting campaign metadata','Validating against CM schema'])
  + `<div class="summaryCard"><p class="summaryCard__intro">Let me play back what I understood</p>${CR_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look ok?</p>${recordedReply('Looks good')}</div>`);
const CR_PLAN = (done=0, loading=-1)=> agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">We'll do the following tasks to create the campaign</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${crPlanTableRows(done,loading)}</div><p class="summaryCard__q">Does this look ok?</p>${recordedReply('Looks good')}</div>`);
// per-task recorded messages (create + validate). Each ends "Approved".
const CR_META    = ()=> agentMsg(`<div class="chatBubble">Parsed and validated the campaign meta.${objectCard('megaphone','Campaign meta - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${recordedReply('Approved')}</div>`);
const CR_AUD     = ()=> agentMsg(`<div class="chatBubble">Parsed and validated the audiences.${objectCard('personThree','Audience - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 3.</div>${recordedReply('Approved')}</div>`);
const CR_BILLING = ()=> agentMsg(`<div class="chatBubble">Parsed and validated the billing offers.${objectCard('percent','Billing offer - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${recordedReply('Approved')}</div>`);
const CR_CREATIVE= ()=> agentMsg(`<div class="chatBubble">Parsed and validated the access points.${objectCard('thumbnail','Access points - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${recordedReply('Approved')}</div>`);
const CR_EXP     = ()=> agentMsg(`<div class="chatBubble">Parsed and validated the experiments.${objectCard('beaker','Experiments - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 5.</div>${recordedReply('Approved')}</div>`);
// composed "history up to" helpers
const CR_TO_PLAN     = ()=> CR_USER() + CR_CREATED() + CR_UNDERSTOOD();
const CR_TO_META     = (d=0,l=-1)=> CR_TO_PLAN() + CR_PLAN(d,l);
const CR_TO_AUD      = (d=1,l=-1)=> CR_TO_META(d,l) + CR_META();
const CR_TO_BILLING  = (d=2,l=-1)=> CR_TO_AUD(d,l) + CR_AUD();
const CR_TO_CREATIVE = (d=2,l=-1)=> CR_TO_AUD(d,l) + CR_AUD();
const CR_TO_EXP      = (d=3,l=-1)=> CR_TO_CREATIVE(d,l) + CR_CREATIVE();
// task 6 — campaign summary review (recorded — "Approved")
const CR_SUM     = ()=> agentMsg(`<div class="chatBubble">Here's the campaign summary for your review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 6.</div>${recordedReply('Approved')}</div>`);
const CR_TO_SUMMARY  = (d=4,l=-1)=> CR_TO_EXP(d,l) + CR_EXP();
const CR_TO_TREE     = (d=5,l=-1)=> CR_TO_SUMMARY(d,l) + CR_SUM();

/* ---- Create intake: prompt → created → parsing loader → understanding → plan ---- */
scenes.crIntent = (state={})=>{
  const loading=state.loading, phase=state.phase;
  if(phase==='bootfull'){
    return `<div class="content">${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}<div class="scroll scroll--center">${bootCanvas()}</div></div>`;
  }
  const understoodLive = disclosure('Parsed workbook',['Reading documents','Collecting campaign metadata','Validating against CM schema'])
    + `<div class="summaryCard"><p class="summaryCard__intro">Let me play back what I understood</p>${CR_UNDERSTOOD_TABLE}<p class="summaryCard__q">Does this look ok?</p>${replyBtn('Looks good','crApproveUnderstood')}</div>`;
  if(phase==='msg-user' || phase==='msg-created' || phase==='msg-loader' || phase==='msg-understood' || phase==='planning'){
    let b = CR_USER();
    if(phase!=='msg-user') b += CR_CREATED();
    if(phase==='msg-loader') b += agentLoader('Parsing Workbook', state.tasks||[]);
    if(phase==='msg-understood') b += agentMsg(understoodLive);
    if(phase==='planning') b += CR_UNDERSTOOD() + agentLoader('Creating a plan', state.tasks||[]);
    return `<div class="content content--centered">${topbar(CR_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${b}</div>
        ${expandedComposer()}
      </div></div></div>`;
  }
  const conv = CR_USER() + CR_CREATED() + CR_UNDERSTOOD();
  const body = loading
    ? conv + agentLoader('Creating a plan', state.tasks||[])
    : conv + agentMsg(disclosure('Created a plan',['Reading your request','Mapping the campaign','Ordering the tasks']) + `<div class="summaryCard"><p class="summaryCard__intro">We'll do the following tasks to create the campaign</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${crPlanTableRows(0,-1)}</div><p class="summaryCard__q">Does this look ok?</p>${replyBtn('Looks good','crApprovePlan')}</div>`);
  return `<div class="content content--centered">${topbar(CR_CRUMB)}<div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${body}</div>
    ${expandedComposer()}
  </div></div></div>`;
};

/* ---- CR task 1: Campaign meta ---- */
scenes.crMeta = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_META(loading?0:1, loading?0:-1);
  const body = loading
    ? conv + agentLoader('Creating campaign meta', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the campaign meta.${objectCard('megaphone','Campaign meta - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${replyBtn('Approve','crApproveMeta')}</div>`);
  // loads ONLY key-value pairs — the loader must not imply a table
  const canvas = loading
    ? `<span class="cfskel cfskel--bar" style="display:block;width:280px;height:16px"></span>
       <div style="height:20px"></div>${kvSkeleton(8,2)}`
    : `<div class="detail-h"><span class="title">Campaign Meta - DIWM QB Live campaign</span></div>
       <div style="height:16px"></div>${metaGrid({bare:true})}`;
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'1.  Parse and validate campaign meta',body,stepLoading:loading});
};

/* ---- CR task 2: Audience (Segment table → attribute/value drill) ---- */
scenes.crAudience = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_AUD(loading?1:2, loading?1:-1);
  const body = loading
    ? conv + agentLoader('Creating audience', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the audiences.${objectCard('personThree','Audience - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 3.</div>${replyBtn('Approve','crApproveAud')}</div>`);
  let canvas;
  if(state.drill!==undefined && state.drill!==null){
    // settles into the attribute/value boolean expression — kv skeleton, not a table
    const drillBody = state.drillLoading
      ? `<div style="height:16px"></div>${kvSkeleton(4,1)}`
      : `<div class="cd-sub" style="margin:12px 0 28px">${AUDIENCES[state.drill].desc}</div>${audienceBuilder()}`;
    canvas = `<div class="detail-h"><span class="back" data-crback="crAudience">${I.back}</span><span class="title">${AUDIENCES[state.drill].name}</span><span class="detail-vd"></span>${badge('Verified')}<span class="detail-vd"></span>
        <span class="detail-sub" style="margin:0">Size:&nbsp;0k</span><span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 06/30 18:30PST</span></div>
      ${drillBody}`;
  } else {
    const rows = AUDIENCES.map((r,i)=>({...r}));
    const tbl = loading ? skeletonTable(COL.aud,false) : tableHTML(COL.aud, rows, {drillrow:true});
    canvas = `<div class="detail-h"><span class="title">Audience - DIWM QB Live campaign</span></div><div style="height:16px"></div>${tbl}`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'2.  Parse and validate audiences',body,stepLoading:loading});
};
// audience attribute/value builder (ATTRIBUTE / operator / VALUE + AND/OR + Attribute group)
function audienceRow(attr,op,val){
  return `<div class="ab-row">
    <div class="ab-col"><div class="ab-k">ATTRIBUTE</div><div class="ab-attr">${attr}</div></div>
    <div class="ab-op">${op}</div>
    <div class="ab-col"><div class="ab-k">VALUE</div><div class="ab-v">${val}</div></div>
  </div>`;
}
function audienceBuilder(){
  const conj = t=>`<div class="ab-conj">${t}</div>`;
  const grp = `${audienceRow('CDPCompanyAudienceName','contains any','elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_highprice')}
    ${conj('AND')}${audienceRow('isAccountantAccessingClient','not equal to','No')}
    ${conj('AND')}${audienceRow('elm9071payingqbopayingqblnum','not equal to','~')}`;
  return `${audienceRow('CDPCompanyAudienceName','contains any','elm_9071_ipd_us_qbl_qblast_naql_xsll_promo_seg_diwm_deep_disc_highprice')}
    ${conj('AND')}${audienceRow('isAccountantAccessingClient','not equal to','No')}
    ${conj('AND')}${audienceRow('elm9071payingqbopayingqblnum','not equal to','~')}
    <div class="ab-orwrap">${conj('OR')}</div>
    <div class="ab-group"><div class="ab-group__h">Attribute group ${I.chev}</div>${grp}</div>`;
}

/* ---- CR task 3: Billing offer (table → detail drill) ---- */
scenes.crBilling = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_BILLING(loading?2:3, loading?2:-1);
  const body = loading
    ? conv + agentLoader('Creating billing offer', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the billing offers.${objectCard('percent','Billing offer - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${replyBtn('Approve','crApproveBilling')}</div>`);
  let canvas;
  if(state.drill!==undefined && state.drill!==null){
    // settles into key-value pairs — kv skeleton, not a table
    const drillBody = state.drillLoading
      ? kvSkeleton(6,2)
      : metaGrid2([['PROMOTION TYPE','Upgrade'],['PRODUCT','Experts'],['OFFERS','19'],['TITLE','70% (Email)'],['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['SKU','QB Live Assisted']]);
    canvas = `<div class="detail-h"><span class="back" data-crback="crBilling">${I.back}</span><span class="title">20059622</span><span class="detail-vd"></span>${badge('Verified')}<span class="detail-vd"></span>
        <span class="detail-sub" style="margin:0">Last updated:&nbsp; 06/30 18:30PST</span></div>
      <div style="height:16px"></div>${drillBody}`;
  } else {
    const rows = billingRows('04/22/2026',false);
    const tbl = loading ? skeletonTable(COL.billing,false) : tableHTML(COL.billing, rows, {drillrow:true});
    canvas = `<div class="detail-h"><span class="title">Billing offers - DIWM QB Live campaign</span></div><div style="height:16px"></div>${tbl}`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'3.  Parse and validate billing offers',body,stepLoading:loading});
};
// bare 2-col attribute grid for detail screens
function metaGrid2(pairs){
  return `<div class="meta meta--bare">${pairs.map(([k,v])=>`<div><div class="meta__k">${k}</div><div class="meta__v">${v}</div></div>`).join('')}</div>`;
}

/* ---- CR task 4: Creative, access points and content (Access point table → Creatives drill) ---- */
scenes.crCreative = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_CREATIVE(loading?2:3, loading?2:-1);
  const body = loading
    ? conv + agentLoader('Creating creative, access points and content', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the access points.${objectCard('thumbnail','Access points - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${replyBtn('Approve','crApproveCreative')}</div>`);
  let canvas;
  if(state.drill!==undefined && state.drill!==null){
    const view = state.creativeView==='preview' ? 'preview' : 'detail';
    const drillBody = state.drillLoading
      ? skeletonTable([{label:'Headline'},{label:'Body'},{label:'CTA'},{label:'Image'}],false)
      : creativesHeader(view)+creativesBody(view);
    canvas = `<div class="detail-h"><span class="back" data-crback="crCreative">${I.back}</span><span class="title">Hellobox - Chart of Accounts</span><span class="detail-vd"></span>${badge('Verified')}<span class="detail-vd"></span>
        <span class="detail-sub" style="margin:0">Size:&nbsp;0k</span><span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span></div>
      <div style="height:16px"></div>${drillBody}`;
  } else {
    const tbl = loading ? skeletonTable(COL.place,false) : tableHTML(COL.place, PLACEMENTS, {drillrow:true});
    canvas = `<div class="detail-h"><span class="title">Access points - DIWM QB Live campaign</span></div><div style="height:16px"></div>${tbl}`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'3.  Parse and validate access points',body,stepLoading:loading});
};

/* ---- CR task 5: Experiment (table → treatments drill) ---- */
scenes.crExperiment = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_EXP(loading?3:4, loading?3:-1);
  const body = loading
    ? conv + agentLoader('Creating experiment', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the experiments.${objectCard('beaker','Experiments - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 5.</div>${replyBtn('Approve','crApproveExp')}</div>`);
  let canvas;
  if(state.drill!==undefined && state.drill!==null){
    const drillBody = state.drillLoading
      ? skeletonTable([{label:'Treatment name'},{label:'Allocation'}],false)
      : `${metaGrid2([['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['TYPE','A/B/N (3-cell)']])}
      <div style="height:12px"></div>${treatmentsTable()}`;
    canvas = `<div class="detail-h"><span class="back" data-crback="crExperiment">${I.back}</span><span class="title">IPD High Price Sensitivity · IXP 321931</span><span class="detail-vd"></span>${badge('Verified')}<span class="detail-vd"></span>
        <span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span></div>
      <div style="height:16px"></div>${drillBody}`;
  } else {
    // Create flow shows long-form dates (Figma 919:52556) — local rows, shared experimentRows untouched
    const rows = experimentRows('04/22/2026',false).map(r=>({...r,start:'March 12, 2026',end:'April 22, 2026'}));
    const tbl = loading ? skeletonTable(COL.exp,false) : tableHTML(COL.exp, rows, {drillrow:true});
    canvas = `<div class="detail-h"><span class="title">Experiments - DIWM QB Live campaign</span></div><div style="height:16px"></div>${tbl}`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'4.  Parse and validate experiments',body,stepLoading:loading});
};
// IPD is cartesian: NO billing offers anywhere, so treatments carry only the
// name + allocation (no Billing Offer ID / Offers columns).
function treatmentsTable(){
  const rows=[
    {tn:'Treatment1-ELM9071_Med_70pct',al:'~30%'},
    {tn:'Treatment2-ELM9071_Med_90pct',al:'~30%'},
    {tn:'Control-ELM9071_Med_30dFree',al:'~30%'},
  ];
  const cs=[{label:'Treatment name',key:'tn'},{label:'Allocation',key:'al',info:1}];
  return tableHTML(cs, rows);
}

/* ---- CR task 6: Campaign tree → create experiences (final) ---- */
/* ---- CR task 6: Review campaign summary — the campaign page WITHOUT tabs
   (meta card + campaign data); the tabbed view only exists after experiences. ---- */
scenes.crSummary = (state={view:'tree'})=>{
  const loading=state.loading;
  const conv = CR_TO_SUMMARY(loading?4:5, loading?4:-1);
  const body = loading
    ? conv + agentLoader('Creating campaign summary', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Here's the campaign summary for your review.${objectCard('megaphone','Campaign summary - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 6.</div>${replyBtn('Approve','crApproveSummary')}</div>`);
  const view = state.view||'tree';
  const canvas = loading ? summarySkeleton()
    : `<div class="detail-h"><span class="title">Campaign summary - DIWM QB Live campaign</span></div>
       <div style="height:16px"></div>${metaGrid()}
       <div class="data-head"><span class="h">Campaign data</span>${viewToggle(view)}</div>
       <div id="dataZone">${view==='tree' ? treeView(true,true) : campaignDataTables('04/22/2026',false)}</div>`;
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'5.  Review campaign summary',body,stepLoading:loading});
};

scenes.crTree = (state={view:'tree',tab:'meta'})=>{
  const loading=state.loading;
  const savedConv = CR_TO_TREE(loading?5:6, loading?5:-1);
  const body = loading
    ? savedConv + agentLoader('Creating experiences', state.tasks||[])
    : savedConv + agentMsg(`<div class="chatBubble">Created the campaign and generated experiences.${objectCard('megaphone','Experiences - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok?</div>${replyBtn('Looks good','crLooksGoodFinal')}${cmLink()}</div>`);
  // ── EXPERIENCE DRILL-DOWN (Figma 1:38730): clicking an experiences row swaps the
  //    canvas for the experience detail — name from the clicked row, 5 sub-tabs. ──
  if(state.tab==='experiences' && state.expDrill!==undefined && state.expDrill!==null){
    const expName = 'ELM9071-IPD-HelloChartAcc-US-Discount';
    const t = state.expTab || 'creative';
    let tabBody;
    // each sub-tab's content leads with its own title (Figma 1:38730 pattern)
    const tabTitle = (txt)=>expTabTitle(txt);
    if(state.expDrillLoading){
      tabBody = kvSkeleton(6,2);
    } else if(t==='audience'){
      tabBody = `<div class="cd-head" style="margin:0 0 12px"><span class="cd-head__t">AUD_AUDIENCE2-QBO_HighPriceSensitivity</span></div>
        <div class="cd-sub" style="margin:0 0 28px">${AUDIENCES[1].desc}</div>${audienceBuilder()}`;
    } else if(t==='billing'){
      tabBody = tabTitle('20059622') + metaGrid2([['PROMOTION TYPE','Upgrade'],['PRODUCT','Experts'],['OFFERS','19'],['TITLE','70% (Email)'],['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['SKU','QB Live Assisted']]);
    } else if(t==='creative'){
      const view = state.creativeView==='preview' ? 'preview' : 'detail';
      // title row + toggle first, then the access-point strip (Figma 1:38730 order)
      tabBody = `<div class="cd-head"><span class="cd-head__t">ELM 200_Hellobox Creative_Deep Discount</span>
          <div class="cvtoggle" data-cvtoggle>
            <button data-cv="detail" class="${view==='detail'?'active':''}">${DETAIL_ICON} Detail</button>
            <button data-cv="preview" class="${view==='preview'?'active':''}">${IMAGE_ICON} Preview</button>
          </div></div>
        <div class="cd-attr">
          <div><div class="cd-attr__k">ACCESS POINT</div><div class="cd-attr__v">Chart of Accounts -hellobox</div></div>
          <div><div class="cd-attr__k">TEMPLATE</div><div class="cd-attr__v">helloboxThirdParty</div></div>
        </div>` + singleCreative(view);
    } else if(t==='experiment'){
      /* opts.experiment overrides the placeholder, so a flow that CHANGES which
         experiment an experience belongs to can show the real one. */
      tabBody = tabTitle(opts.experiment || 'IPD High Price Sensitivity · IXP 321931')
        + `${metaGrid2([['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['TYPE','A/B/N (3-cell)']])}<div style="height:12px"></div>${treatmentsTable()}`;
    } else {
      // no section title on the meta tab — the pairs stand alone
      tabBody = metaGrid2([['PRIORITY','15.0'],['CREATED BY','Stroupe, Kristin'],['START DATE','January 28, 2026'],['END DATE','April 22, 2026']]);
    }
    const expTabs = [['creative','Creative'],['meta','Experience meta'],['audience','Audience'],['experiment','Experiment']]
      .map(([k,l])=>`<span class="tab ${t===k?'active':''}" data-exptab="${k}">${l}</span>`).join('');
    const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">
      <div class="detail-sticky"><div class="detail-h"><span class="back" data-expback>${I.back}</span><span class="title">${expName}</span><span class="detail-vd"></span>${badge('Draft')}<span class="detail-vd"></span><span class="detail-sub" style="margin:0">ID:&nbsp; 4d738ef0-9505-11f1-86ec-a3e651c6bc02 ${COPY_ICON}</span><span class="verselect">v1 ${I.chev}</span></div>
      <div class="tabs tabs--insticky tabs--exp">${expTabs}</div></div>
      ${tabBody}</div></div></div>`;
    return content + aiPanel({step:'6.  Create experiences',body,stepLoading:false});
  }
  let mainInner;
  if(state.tab==='experiences'){
    mainInner = experiencesPanel({loading, status:'Draft', drillrow:!loading});   // newly created → all Draft
  } else if(state.tab==='insights'){
    mainInner = insightsPanel();
  } else {
    // Create tree runs in RICH mode: real per-level attributes + leaf dims/content tabs
    const dataBody = state.view==='tree' ? treeView(true,true) : campaignDataTables('04/22/2026',false);
    mainInner = `${metaGrid()}<div class="data-head"><span class="h">Campaign data</span>${viewToggle(state.view)}</div><div id="dataZone">${dataBody}</div>`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">
    <div class="detail-sticky"><div class="detail-h"><span class="title">DIWM QB Live campaign</span><span class="detail-vd"></span>${badge('Draft')}<span class="detail-vd"></span><span class="detail-sub" style="margin:0">Last updated:&nbsp; 1 min ago</span><span class="verselect">v1 ${I.chev}</span></div>
    <div class="tabs tabs--insticky tabs--exp"><span class="tab ${state.tab==='meta'?'active':''}" data-tab="meta">Campaign meta</span><span class="tab ${state.tab==='experiences'?'active':''}" data-tab="experiences">Experiences</span></div></div>
    ${mainInner}</div></div></div>`;
  return content + aiPanel({step:'6.  Create experiences',body,stepLoading:loading});
};

/* ============================================================
   LOADER ORCHESTRATION — golden timings from ChangeOrder.tsx
   ============================================================ */
const LOADERS = {
  search:   { label:'Searching campaigns', tasks:['Reading your brief','Searching QBO IPD campaigns','Compiling results'], after:5400 },
  planning: { label:'Creating a plan', tasks:['Reading your request','Mapping requested changes','Ordering the tasks'], after:3400 },
  saving:   { label:'Applying your changes', tasks:['Applying changes to experiences','Updating statuses','Refreshing the table'], after:2900 },
};
// edit-task loader (row-by-row): skeleton 1900, row step 900 (start 2200), 4 subtask ticks
const EDIT_SUBTASKS = {
  billing:['Loading the billing offers','Locating the end-date field','Applying the new end date','Saving the updated offers'],
  experiments:['Loading the experiments','Locating the end-date field','Applying the new end date','Saving the updated experiments'],
};

let timers = [];
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

/* INTAKE sequence:
   1) full-screen "Creating a project" boot loader (alone, no messages)
   2) messages appear IN SEQUENCE, one after another:
        user prompt → "I have created…project" bubble → "Searching campaigns" loader
   3) search loader ticks through subtasks → results table.
   Timeline: bootfull 2400ms → prompt (600ms) → created (900ms) → search 5400ms (4 subtasks). */
function runIntake(){
  const searchTasks=['Reading your brief','Searching QBO IPD campaigns','Compiling results'];
  const tick=(activeIdx)=>render('searchMultiple',{phase:'msg-search',tasks:searchTasks.map((label,j)=>({label,state:j<activeIdx?'done':j===activeIdx?'active':'idle'}))});
  // 1) full-screen boot loader — no messages
  render('searchMultiple',{phase:'bootfull'});
  // 2) staggered messages
  const promptAt=2400, createdAt=promptAt+600, searchAt=createdAt+900;
  timers.push(setTimeout(()=>render('searchMultiple',{phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('searchMultiple',{phase:'msg-created'}),createdAt));
  // 3) search loader + subtasks
  const searchDur=5400;
  timers.push(setTimeout(()=>tick(0),searchAt));
  const slot=(searchDur-600)/searchTasks.length;
  searchTasks.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),searchAt+Math.round(slot*(i+1)))));
  // 4) canvas OPENS: conversation slides right, canvas slides in from the left,
  //    then the canvas shows a skeleton loader before the results appear.
  const openAt=searchAt+searchDur;
  timers.push(setTimeout(()=>render('searchMultiple',{loading:true,opening:true}),openAt));
  // 5) real results after the open animation + a short skeleton hold
  timers.push(setTimeout(()=>go('searchMultiple',{}),openAt+2000));
}

/* Run a generic AI loader phase (search / planning / saving) then advance.
   loadingExtra merges into each loading render (e.g. {tab:'experiences'} to show
   the canvas skeleton during the phase). */
function runLoader(scene, cfg, nextName, nextState, loadingExtra={}){
  const tasks = cfg.tasks.map(label=>({label,state:'idle'}));
  tasks[0].state='active';
  render(scene,{loading:true,...loadingExtra,tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>{
    timers.push(setTimeout(()=>{
      const t=cfg.tasks.map((label,j)=>({label,state:j<=i?'done':j===i+1?'active':'idle'}));
      render(scene,{loading:true,...loadingExtra,tasks:t});
    }, Math.round(slot*(i+1))));
  });
  timers.push(setTimeout(()=>go(nextName,nextState), cfg.after));
}

/* Step 3 sequence: "Reviewing change summary" loader → then the two review messages
   appear ONE AFTER THE OTHER (summary bubble, then the campaign-summary review bubble). */
function runReviewSequence(){
  const cfg = LOADERS.saving; const label='Reviewing change summary';
  const tasks = cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('campaignObject',{view:'table',loading:true,tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{
    const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));
    render('campaignObject',{view:'table',loading:true,tasks:t});
  }, Math.round(slot*(i+1)))));
  // after the loader: reveal the summary bubble, then the review bubble ~900ms later.
  // use render() (not go) so the pending reveal:2 timer isn't cleared by go()'s clearTimers.
  const doneAt=cfg.after;
  timers.push(setTimeout(()=>render('campaignObject',{view:'table',reveal:1}), doneAt));
  timers.push(setTimeout(()=>render('campaignObject',{view:'table',reveal:2}), doneAt+900));
}

/* ===== WORKBOOK runners ===== */
// intake: full-screen boot → staggered messages → "Looking at your brief" loader → understanding card
function runIntakeWB(){
  render('coIntentWB',{phase:'bootfull'});
  const subs=['Looked at your brief','Reading the workbook','Compiling changes'];
  const a=2400,b=a+600,ldr=b+900,dur=3600;
  timers.push(setTimeout(()=>render('coIntentWB',{phase:'msg-user'}),a));
  timers.push(setTimeout(()=>render('coIntentWB',{phase:'msg-created'}),b));
  // loader with ticking subtasks
  const tick=(idx)=>render('coIntentWB',{phase:'msg-loader',tasks:subs.map((label,j)=>({label,state:j<idx?'done':j===idx?'active':'idle'}))});
  timers.push(setTimeout(()=>tick(0),ldr));
  const slot=(dur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),ldr+Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('coIntentWB',{phase:'msg-understood'}),ldr+dur));
}
// access point row → content drill-down: skeleton flash (~1100ms) then the content table
function drillInto(scene, idx){
  clearTimers();
  go(scene,{drill:idx,drillLoading:true});
  timers.push(setTimeout(()=>render(scene,{drill:idx}),1100));
}
// understanding "Looks good" → planning loader → settled plan card
function runWBPlan(){
  const cfg=LOADERS.planning;
  const tasks=cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('coIntentWB',{phase:'planning',tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));render('coIntentWB',{phase:'planning',tasks:t});},Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('coIntentWB',{}), cfg.after));
}
// generic step loader for WB artifact steps: loader (with plan/step spinner via scene) → next
function runWBStep(scene, label, nextName, nextState, loadingExtra={}){
  runLoader(scene, {label, tasks:LOADERS.saving.tasks, after:2900}, nextName, nextState, loadingExtra);
}
// WB review (step 4): loader → summary bubble → review bubble (staggered)
function runWBReview(){
  const cfg={after:2900,tasks:LOADERS.saving.tasks};
  const tasks=cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('campaignObjectWB',{view:'table',loading:true,tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));render('campaignObjectWB',{view:'table',loading:true,tasks:t});},Math.round(slot*(i+1)))));
  const d=cfg.after;
  timers.push(setTimeout(()=>render('campaignObjectWB',{view:'table',reveal:1}),d));
  timers.push(setTimeout(()=>render('campaignObjectWB',{view:'table',reveal:2}),d+900));
}

/* ===== SCENARIO 3 (prompt CO) runners — clone of the WB runners ===== */
function runIntakeP2(){
  render('p2Intent',{phase:'bootfull'});
  const subs=['Looked at your brief','Reading your request','Compiling changes'];
  const a=2400,b=a+600,ldr=b+900,dur=3600;
  timers.push(setTimeout(()=>render('p2Intent',{phase:'msg-user'}),a));
  timers.push(setTimeout(()=>render('p2Intent',{phase:'msg-created'}),b));
  const tick=(idx)=>render('p2Intent',{phase:'msg-loader',tasks:subs.map((label,j)=>({label,state:j<idx?'done':j===idx?'active':'idle'}))});
  timers.push(setTimeout(()=>tick(0),ldr));
  const slot=(dur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),ldr+Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('p2Intent',{phase:'msg-understood'}),ldr+dur));
}
function runP2Plan(){
  const cfg=LOADERS.planning;
  const tasks=cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('p2Intent',{phase:'planning',tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));render('p2Intent',{phase:'planning',tasks:t});},Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('p2Intent',{}), cfg.after));
}
function runP2Step(scene, label, nextName, nextState, loadingExtra={}){
  runLoader(scene, {label, tasks:LOADERS.saving.tasks, after:2900}, nextName, nextState, loadingExtra);
}
function runP2Review(){
  const cfg={after:2900,tasks:LOADERS.saving.tasks};
  const tasks=cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('p2Review',{view:'table',loading:true,tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));render('p2Review',{view:'table',loading:true,tasks:t});},Math.round(slot*(i+1)))));
  const d=cfg.after;
  timers.push(setTimeout(()=>render('p2Review',{view:'table',reveal:1}),d));
  timers.push(setTimeout(()=>render('p2Review',{view:'table',reveal:2}),d+900));
}

/* ===== SCENARIO 4 (create) runners ===== */
function runIntakeCR(){
  render('crIntent',{phase:'bootfull'});
  const subs=['Reading documents','Collecting campaign metadata','Validating against CM schema'];
  const a=2400,b=a+600,ldr=b+900,dur=3600;
  timers.push(setTimeout(()=>render('crIntent',{phase:'msg-user'}),a));
  timers.push(setTimeout(()=>render('crIntent',{phase:'msg-created'}),b));
  const tick=(idx)=>render('crIntent',{phase:'msg-loader',tasks:subs.map((label,j)=>({label,state:j<idx?'done':j===idx?'active':'idle'}))});
  timers.push(setTimeout(()=>tick(0),ldr));
  const slot=(dur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),ldr+Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('crIntent',{phase:'msg-understood'}),ldr+dur));
}
function runCRPlan(){
  const cfg=LOADERS.planning;
  const tasks=cfg.tasks.map(l=>({label:l,state:'idle'})); tasks[0].state='active';
  render('crIntent',{phase:'planning',tasks:tasks.map(t=>({...t}))});
  const slot=(cfg.after-600)/cfg.tasks.length;
  cfg.tasks.forEach((_,i)=>timers.push(setTimeout(()=>{const t=cfg.tasks.map((l,j)=>({label:l,state:j<=i?'done':j===i+1?'active':'idle'}));render('crIntent',{phase:'planning',tasks:t});},Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go('crIntent',{}), cfg.after));
}
function runCRStep(scene, label, nextName, nextState, loadingExtra={}){
  runLoader(scene, {label, tasks:LOADERS.saving.tasks, after:2900}, nextName, nextState, loadingExtra);
}

/* Edit-task loader: table cells flip row-by-row + 4-tick conversation loader.
   A single shared state object is mutated by both the row timers and the
   loader-tick timers so they never stomp each other (golden: skeleton 1900,
   rows start 2200 every 900ms, 4 subtask ticks over total/5, done at total). */
function runEditLoader(scene, kind, rowCount, nextName, nextState){
  const subs = EDIT_SUBTASKS[kind];
  const start=2200, ROW_STEP=900;
  const total = start + rowCount*ROW_STEP + 900;
  // canvas skeleton for the first 1900ms (July-31 editLoading), then flipping table
  const st = {loading:true, skeleton:true, rowsDone:0, loaderStep:0};
  const paint=()=>render(scene,{loading:true,skeleton:st.skeleton,rowsDone:st.rowsDone,
    tasks:subs.map((label,i)=>({label,state:st.loaderStep>i?'done':st.loaderStep===i?'active':'idle'}))});
  paint();
  timers.push(setTimeout(()=>{ st.skeleton=false; paint(); }, 1900));
  for(let i=1;i<=rowCount;i++) timers.push(setTimeout(()=>{ st.rowsDone=i; paint(); }, start+i*ROW_STEP));
  for(let i=1;i<=4;i++) timers.push(setTimeout(()=>{ st.loaderStep=i; paint(); }, Math.round((total/5)*i)));
  timers.push(setTimeout(()=>go(nextName,nextState), total));
}

/* re-render a scene body in place WITHOUT resetting scroll (for loader ticks) */
function render(scene, state){
  current = {name:scene, state};
  const main=$('#main');
  main.innerHTML = scenes[scene](state);
  wire(scene, state);
  const b=main.querySelector('.ai__body'); if(b) b.scrollTop=b.scrollHeight;
  // centered-chat (intake) auto-scrolls its own .scroll so the latest message stays visible
  const cc=main.querySelector('.content--centered .scroll'); if(cc) cc.scrollTop=cc.scrollHeight;
}

/* ============================================================
   ROUTER + interactions — GUIDED DEMO (auto-driving, like the
   real Create-Change-Order). Every prompt/approval is TYPED into
   the prompt box at 18ms/char, then auto-sends. The user can also
   click to drive it manually; toggle autopilot with the 'p' key.
   ============================================================ */
// single scenario in this build: change the template on one experience
/* This build has only the two unlink scenarios — the clone scenarios came with
   the copied source and are unreachable here. Default to the published unlink
   flow so arrow keys before picking a scenario walk THIS build (user,
   2026-09-15: arrows were showing clone flows). */
let scenario = 'ulPub';
const FLOW_PROMPT   = ['home','searchMultiple','singleCampaign','coIntent','changeMeta','campaignObject','campaignTree'];
const FLOW_WORKBOOK = ['home','coIntentWB','ipdContent','campaignObjectWB','campaignTreeWB'];
const FLOW_PROMPTCO = ['home','p2Intent','p2Ipd','p2Review','p2Tree'];
const FLOW_CREATE   = ['home','crIntent','crMeta','crAudience','crCreative','crExperiment','crSummary','crTree'];
// active FLOW: home → experience search results (every later step is state on pcSearch)
const FLOW_PC = ['home','pcSearch'];
function FLOW_ARR(){ return FLOW_PC; }
const FLOW = FLOW_PROMPT; // back-comaptible alias (prompt-flow arrow-nav default)
const TYPE_MS = 18;                    // per-char typing speed (source)
// auto-type prompts + delays before typing starts (source: ChangeOrder.tsx)
const FIND_PROMPT = 'Find all QBO IPD campaigns created in the last 3 months.';
const CHANGE_PROMPT = 'Change end date for campaign to 31 August and priority to high.';
const WORKBOOK_PROMPT = "I'd like to execute a change order for the DIWM QB Live campaign. I've attached the workbook.";
// scenario #2 — prompt-based billing + IPD change order (typed, no workbook)
const PROMPTCO_PROMPT = `I'd like to execute a change order for the DIWM QB Live campaign. Please make the following change:
For IPD creatives, update the headline from "50% off" to "90% off" and update the image to imagename.png`;
// scenario #4 — create a campaign from a workbook
const CREATE_PROMPT = 'I want to create an IPD campaign from this Workbook.';
const APPROVE_PROMPT = 'Approved';
const LOOKS_GOOD = 'Looks good';
/* USER-TRIGGERED guided demo: the user clicks to advance each step (send button,
   "Looks good"/"Approve" pills, drilling into a row). Each trigger then plays the
   typed-prompt animation + loader on its own. Autopilot (fully hands-off) stays
   available via the 'p' key but is OFF by default. */
let autopilot = false;
let current = {name:'home', state:{}};

/* Type `text` into a prompt-box input el at 18ms/char, then call done().
   Shows a blinking caret while typing; clears the placeholder first. */
/* The composer grows as a multi-line draft types, which shrinks .ai__body and
   pushes the newest message out of view. Pin the conversation to the bottom so
   the response moves UP instead of being hidden. */
function pinConvo(){
  const b=document.querySelector('.ai__body');
  if(b) b.scrollTop=b.scrollHeight;
}
/* Past four lines the composer stops growing and scrolls (max-height:96px), so
   the caret has to be kept in view inside the box as well. */
function pinDraft(input){ if(input) input.scrollTop=input.scrollHeight; }
function typeInto(input, text, done){
  if(!input){ done&&done(); return; }
  input.classList.add('promptBox__input--filled');
  input.innerHTML='<span class="promptBox__caret"></span>';
  const caret=input.firstChild; let i=0;
  const tick=()=>{
    i++; input.textContent=text.slice(0,i);
    pinConvo(); pinDraft(input);      // the composer may have just grown a line
    if(i<text.length) timers.push(setTimeout(tick,TYPE_MS));
    else { input.innerHTML=text+'<span class="promptBox__caret"></span>'; pinConvo(); pinDraft(input); timers.push(setTimeout(()=>done&&done(),650)); }
  };
  timers.push(setTimeout(tick,140));
}

function go(name, state={}){
  clearTimers();
  current = {name, state};
  const main = $('#main');
  main.innerHTML = scenes[name](state);
  wire(name, state);
  main.querySelectorAll('.scroll').forEach(s=>s.scrollTop=0);
  const b = main.querySelector('.ai__body'); if(b) b.scrollTop = b.scrollHeight;
  // centered-chat intake: keep the latest message visible (overrides the reset above)
  const cc=main.querySelector('.content--centered .scroll'); if(cc) cc.scrollTop=cc.scrollHeight;
  // HOME: nothing auto-types on load — the user picks a scenario from the
  // "Simulate a scenario" pill first, which then types that scenario's prompt.
  if(name==='home' && state.autotype){
    timers.push(setTimeout(()=>{
      const inp=$('#homeInput'); if(inp) typeInto(inp,state.autotype,null);  // type only, no send
    },600));
  }
  // SINGLE CAMPAIGN: on open, the AI TYPES the change request into the composer,
  // then STOPS. The user clicks Send (composerSend) to run the loader → plan.
  else if(name==='singleCampaign' && !state.typed){
    timers.push(setTimeout(()=>{
      const inp=$('#composerInput'); if(inp) typeInto(inp,CHANGE_PROMPT,null);  // type only, no send
    },1400));
  }
  else if(autopilot && !state.loading) scheduleAuto(name, state);
}

/* Optional AUTOPILOT (opt-in via 'p'): performs the SAME user triggers on a
   timer so a hands-off demo is possible. It drives the real controls, never a
   shortcut — e.g. it checks a row then clicks View, exactly like a person. */
function scheduleAuto(name, state){
  const t=(fn,ms)=>timers.push(setTimeout(fn,ms));
  if(name==='home') t(()=>trigger.home(),900);
  // access point change: pick one row → send the ask → confirm each card in turn
  else if(name==='pcSearch' && !state.loading && !state.phase){
    const p=state.pc;
    // scenario 4: take the CHANGE branch and walk every group
    const c4=state.cl4;
    if(c4!==undefined){
      if(c4==='grouped')            t(()=>trigger.cl4Change(),1600);
      else if(c4==='confirm')       t(()=>trigger.cl4ApproveConfirm(),1600);
      else if(c4==='naming')        t(()=>trigger[state.path==='direct'?'cl4ApproveNamingDirect':'cl4ApproveNaming'](),1600);
      else if(c4==='plan')          t(()=>trigger.cl4ApprovePlan(),1600);
      else if(/^g\d+ask$/.test(c4)) t(()=>trigger.cl4SendDest(),2600);
      else if(/^g\d+int$/.test(c4))  t(()=>trigger.cl4ApproveGroupIntent(),1600);
      else if(/^g\d+done$/.test(c4)) t(()=>trigger.cl4ApproveGroup(),1600);
      // executing states just wait
      return;
    }
    /* scenario 5 is terminal: once `mixed` is on screen there is nothing to
       advance to, so autopilot just stops. MUST return — falling through
       reaches the bare `else` that re-fires the clone ask. */
    /* scenario 5: take the CHANGE branch (the limit is the point of the
       scenario), then stop at the guardrail — the next move is the user
       re-selecting, which autopilot cannot guess. MUST return. */
    if(state.cl5!==undefined){
      if(state.cl5==='choice') t(()=>trigger.cl5Change(),1600);
      else if(state.cl5==='naming') t(()=>trigger.cl5ApproveNaming(),1600);
      return;
    }
    // scenario 3: take the CHANGE branch, then approve each step
    const c3=state.cl3;
    if(c3!==undefined){
      if(c3==='choice')          t(()=>trigger.cl3Change(),1600);
      else if(c3==='asking')     t(()=>trigger.cl3SendTarget(),2600);
      else if(c3==='intent')     t(()=>trigger.cl3ApproveIntent(),1600);
      else if(c3==='naming')     t(()=>trigger[state.path==='direct'?'cl3ApproveNamingDirect':'cl3ApproveNaming'](),1600);
      else if(c3==='fields')     t(()=>trigger.cl3ApproveFields(),1600);
      /* clonesErr is where the user takes over: fixes are per experience, so
         autopilot opens the first flagged clone rather than guessing. */
      else if(c3==='clonesErr' && state.expDrill===undefined){
        const f=state.fixes||[]; const nSel=state.asked||1;
        const next=[...Array(nSel).keys()].find(i=>!f.includes(i));
        if(next!==undefined) t(()=>go('pcSearch',{...state,expDrill:next,expDrillLoading:true}),1400);
        else t(()=>trigger.cl3ApproveAll(),1600);
      }
      else if(c3==='clonesErr')  t(()=>trigger.cl3SendFix(),2600);
      // executing states just wait
      return;                 // must NOT fall through: the chain below ends in
                              // a bare `else` that would re-fire the clone ask
    }
    // scenario 2: the naming card, the plan, task 1's fix, then Approve each
    // per-clone review, the all-clones review, and done
    const c=state.cl2;
    if(c!==undefined){
      if(c==='naming')        t(()=>trigger.cl2KeepPrefix(),1600);
      else if(c==='plan')     t(()=>trigger.cl2ApprovePlan(),1600);
      else if(c==='t0err')    t(()=>trigger.cl2SendBodyFix(),2600);  // no Approve: fix first
      else if(c==='t0fixed')  t(()=>trigger.cl2ApproveTask(),1600);
      else if(/^t\d+$/.test(c)) t(()=>trigger.cl2ApproveTask(),1600);
      else if(c==='allrev')   t(()=>trigger.cl2ApproveAll(),1600);
      // executing states (reading / planning / w0 / wN / wall) just wait
    }
    // scenario 1: one confirm, then the clone runs and the flow ends
    else if(p==='understood') t(()=>trigger.pcLooksGood(),1600);
    else if(p){ /* reading / planning / updating / building / done */ }
    else if(!(state.selected&&state.selected.length)){
      t(()=>{ render('pcSearch',{selected:[1]}); if(autopilot) timers.push(setTimeout(()=>trigger.pcSend(),2400)); },1200);
    }
    else t(()=>trigger.pcSend(),2400);
  }
  else if(name==='searchMultiple' && !state.loading){
    if(!(state.selected&&state.selected.length)) t(()=>render('searchMultiple',{selected:[0]}),1200);
    else t(()=>trigger.viewSelected(state),900);
  }
  else if(name==='singleCampaign') t(()=>trigger.change(state),1200);
  else if(name==='coIntent' && !state.loading) t(()=>trigger.approvePlan(),1400);
  else if(name==='changeMeta' && !state.loading) t(()=>trigger.approveChange(),1400);
  else if(name==='campaignObject' && !state.loading) t(()=>trigger.approveCampaign(),1400);
  // campaignTree = end of the guided run.
}

/* The canonical NEXT-ACTION triggers. Every advance in the flow goes through
   exactly one of these — invoked by a real control (or by autopilot). */
const trigger = {
  // Home SEND (user click) — prompt is already typed by the 2s auto-type; just run
  // the INTAKE sequence: boot loader → "created project" bubble → search + skeleton → results.
  home:()=>{ clearTimers(); const inp=$('#homeInput');
    if(scenario==='ulPub'){
      if(inp) inp.textContent=XP_FIND_PROMPT; runIntakeXp(); return; }
    if(scenario==='ulDraft'){
      if(inp) inp.textContent=XP_FIND_ONE_PROMPT; runIntakeXpOne(); return; }
    if(scenario==='lkExp'){
      if(inp) inp.textContent=XP_FIND_PROMPT; runIntakeXp(); return; }
    if(scenario==='lkDraft'){
      if(inp) inp.textContent=XP_FIND_ONE_PROMPT; runIntakeXpOne(); return; }
    if(scenario==='mvExp'){
      if(inp) inp.textContent=MV_FIND_PROMPT; runIntakeMv(); return; }
    if((scenario==='cl4'||scenario==='cl5') && inp) inp.textContent=CL4_FIND_PROMPT;
    if(inp) inp.textContent=FIND_EXP_PROMPT; runIntakePC(); },
  viewSelected:(state)=>{ clearTimers(); go('singleCampaign',{view:'table'}); },
  // ── CLONE triggers (scenario 1) ──
  // composer SEND with a selection → AI reads it → clone confirmation.
  // In scenario 2 the same Send runs the combined clone+change ask instead.
  pcSend:()=>{ const sel=current.state.selected||[]; if(!sel.length) return; clearTimers();
    if(scenario==='cl2') runCl2Understand();
    else if(scenario==='cl3') runCl3Understand();
    else if(scenario==='cl4') runCl4Understand();
    /* Scenario 5 sends TWICE. The first send hits the guardrail. The second
       comes after the user regrouped and re-picked, so it re-tests the new
       selection: still spanning access points → the guardrail again; down to one
       access point → SCENARIO 3's choice card, because a plain clone ask always
       means the agent asks whether to change the access point first and the
       answer drives the rest. (Routing it into scenario 1 hardcoded "no
       changes" and skipped that question — wrong, caught 2026-09-09.)
       cl5Prior keeps the guardrail's own counts so it can be replayed as
       history once state.cl5 is gone. */
    else if(scenario==='cl5'){
      const G = cl4Groups(sel);
      if(G.length>1) runCl5Understand();
      else {
        runCl3Understand({cl5Prior: current.state.cl5Prior});
      }
    }
    else runPCUnderstand(); },
  // "Looks good" on the confirmation → clone them (the flow's only execution step)
  pcLooksGood:()=>{ recordPillThen(()=>runClone()); },
  /* ── scenario 5's choice: the same question scenario 4 asks, but only the
     CHANGE branch runs into the one-access point-at-a-time limit. ── */
  cl5Direct:()=>{ recordPillThen(()=>runCl5NamingDirect()); },
  cl5ApproveNaming:()=>{ recordPillThen(()=>runCl5Direct()); },
  cl5Change:()=>{ recordPillThen(()=>runCl5Change()); },
  // ── CLONE triggers (scenario 2: clone + change access point) ──
  // keep the Clone- prefix rather than naming them → planning loader → plan
  cl2KeepPrefix:()=>{ recordPillThen(()=>runCl2Plan()); },
  // Approve on the plan → task 1 (which hits the body-copy limit)
  cl2ApprovePlan:()=>{ recordPillThen(()=>runCl2Task0()); },
  // composer SEND carrying the corrected copy → canvas + panel both load
  cl2SendBodyFix:()=>{ clearTimers(); runCl2BodyFix(); },
  // Approve on a per-clone review → the next clone, or the all-clones review.
  // t0fixed is task 1 corrected, so it advances to task 2 like any other.
  cl2ApproveTask:()=>{ const c=current.state.cl2||'';
    const mm=/^t(\d+)$/.exec(c);
    const i = mm ? +mm[1] : 0;              // t0fixed → i=0
    recordPillThen(()=>runCl2Task(i+1)); },
  // Approve on the all-clones review → done
  cl2ApproveAll:()=>{ recordPillThen(()=>runCl2Done()); },
  // ── CLONE triggers (scenario 3: the AI offers the choice) ──
  // ── link an experience to an experiment by ID (flow 1) ──
  lkSend:()=>{ clearTimers(); runLkRead(); },
  lkApproveIntent:()=>{ recordPillThen(()=>runLkPlan()); },
  lkApprovePlan:()=>{ recordPillThen(()=>runLkTask(0)); },
  lkApproveTask:()=>{ const m=/^t(\d+)$/.exec(current.state.lk||''); if(!m) return;
    recordPillThen(()=>runLkNext(+m[1])); },
  lkApprove:()=>{ recordPillThen(()=>runLkWork()); },
  lkPublish:()=>{ recordPillThen(()=>runLkPublish()); },
  // ── move an experience between experiments (flow 3) ──
  mvSend:()=>{ clearTimers(); runMvRead(); },
  mvApproveIntent:()=>{ recordPillThen(()=>runMvPlan()); },
  mvApprovePlan:()=>{ recordPillThen(()=>runMvTask(0)); },
  /* matches BOTH a task rest (`t{i}`) and the published rest (`p{i}`) — the
     Approve after publishing X has to carry on to task 3 as well. */
  mvApproveTask:()=>{ const m=/^[tp](\d+)$/.exec(current.state.mv||''); if(!m) return;
    recordPillThen(()=>runMvNext(+m[1])); },
  /* the Publish pill on task 2 PUBLISHES X, then carries on to task 3. X is
     still a Draft while the pill is on offer — publishing is what makes it
     Published, and that is what frees the experience to be linked elsewhere
     (user, 2026-09-16). */
  mvPublishTask:()=>{ const m=/^t(\d+)$/.exec(current.state.mv||''); if(!m) return;
    recordPillThen(()=>runMvPublish(+m[1])); },
  /* task 4's Publish, if the user DOES take it: publishes Y with just the moved
     experience on it, and the flow ends there (no continuation). */
  mvPublishTo:()=>{ recordPillThen(()=>runMvPublishTo()); },
  /* the continuation: a second ask typed instead of taking that pill */
  mv2Send:()=>{ clearTimers(); runMv2Read(); },
  mv2Approve:()=>{ recordPillThen(()=>runMv2Link()); },
  mv2Publish:()=>{ recordPillThen(()=>runMv2Publish()); },
  // ── unlink experiences from an experiment ──
  ulSend:()=>{ const sel=current.state.selected||[]; if(!sel.length) return; clearTimers(); runUlRead(); },
  ulApproveIntent:()=>{ recordPillThen(()=>runUlPlan()); },
  ulApprovePlan:()=>{ recordPillThen(()=>runUlPlanApprove()); },
  ulApprove:()=>{ recordPillThen(()=>runUlWork()); },
  ulPublish:()=>{ recordPillThen(()=>runUlPublish()); },
  cl3Direct:()=>{ recordPillThen(()=>runCl3NamingDirect()); },
  cl3ApproveNamingDirect:()=>{ recordPillThen(()=>runCl3Direct()); },
  cl3Change:()=>{ recordPillThen(()=>runCl3Ask()); },
  // composer SEND naming the access point + template
  cl3SendTarget:()=>{ clearTimers(); runCl3Target(); },
  cl3ApproveIntent:()=>{ recordPillThen(()=>runCl3Naming()); },
  cl3ApproveNaming:()=>{ recordPillThen(()=>runCl3Fields()); },
  cl3ApproveFields:()=>{ recordPillThen(()=>runCl3Clones()); },

  /* composer SEND on the clones message → apply every clone's copy at once */
  cl3SendFix:()=>{ clearTimers(); runCl3FixAll(); },
  cl3ApproveAll:()=>{ recordPillThen(()=>runCl3Done()); },
  // ── CLONE triggers (scenario 4: the selection spans access points) ──
  cl4Direct:()=>{ recordPillThen(()=>runCl4NamingDirect()); },
  cl4ApproveNamingDirect:()=>{ recordPillThen(()=>runCl4Direct()); },
  cl4Change:()=>{ recordPillThen(()=>runCl4Confirm()); },
  cl4ApproveConfirm:()=>{ recordPillThen(()=>runCl4Naming()); },
  cl4ApproveNaming:()=>{ recordPillThen(()=>runCl4Plan()); },
  cl4ApprovePlan:()=>{ recordPillThen(()=>runCl4AskGroup(0)); },
  // composer SEND naming this group's destination access point
  cl4SendDest:()=>{ const m=/^g(\d+)ask$/.exec(current.state.cl4||''); if(!m) return;
    clearTimers(); runCl4MapGroup(+m[1]); },
  /* ONE pill id serves both of a group's approvals — the stage in the state
     says whether we are approving the playback or the finished group. */
  cl4ApproveGroupIntent:()=>{ const m=/^g(\d+)int$/.exec(current.state.cl4||''); if(!m) return;
    recordPillThen(()=>runCl4CloneGroup(+m[1])); },
  cl4ApproveGroup:()=>{ const m=/^g(\d+)done$/.exec(current.state.cl4||''); if(!m) return;
    recordPillThen(()=>runCl4NextGroup(+m[1])); },
  // ── dead access point-change triggers, kept for scenarios 2 and 4 ──
  // Proceed on the name card → the fields the new template adds
  pcNameProceed:()=>{ recordPillThen(()=>runPCFields()); },
  // composer SEND carrying the corrected body copy → canvas + panel both load
  pcSendBodyFix:()=>{ clearTimers(); runPCBodyFix(); },
  // "Looks good" on the corrected copy → task 2
  pcApproveBodyFix:()=>{ recordPillThen(()=>runPCExperience()); },
  // Proceed on the field card → planning loader → plan
  pcProceed:()=>{ recordPillThen(()=>runPCPlan()); },
  // "Looks good" on the plan → task 1 (update the access point)
  pcApprovePlan:()=>{ recordPillThen(()=>runPCPlacement()); },
  // Approve on task 2 → done
  pcApproveExp:()=>{ recordPillThen(()=>runPCDone()); },
  // autopilot only: fill the two fields, then Proceed
  pcAutofill:()=>{ const st=current.state;
    render('pcSearch',{...st,fields:{...PC_FIELD_VALUES}});
    timers.push(setTimeout(()=>trigger.pcProceed(),1200)); },
  // change SEND (user click) — prompt already typed on campaign open; run planning loader → plan.
  change:(state)=>{ clearTimers(); const inp=$('#composerInput'); if(inp) inp.textContent=CHANGE_PROMPT; runLoader('coIntent',LOADERS.planning,'coIntent',{view:state.view||'table'}); },
  // Pill clicks: the pill converts to a recorded reply IN PLACE (avatar + text)
  // inside the same message, then the loader runs. NOT typed into the composer.
  approvePlan:()=>{ recordPillThen(()=>runLoader('changeMeta',LOADERS.saving,'changeMeta',{})); },
  approveChange:()=>{ recordPillThen(()=>runReviewSequence()); },
  approveCampaign:()=>{ recordPillThen(()=>runLoader('campaignTree',LOADERS.saving,'campaignTree',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  // ── WORKBOOK triggers ──
  wbApproveUnderstood:()=>{ recordPillThen(()=>runWBPlan()); },
  wbApprovePlan:()=>{ recordPillThen(()=>runWBStep('ipdContent','Changing IPD content and images','ipdContent',{})); },
  wbApproveBilling:()=>{ recordPillThen(()=>runWBStep('ipdContent','Loading access points','ipdContent',{})); },   // loader → access point table (merged step 2)
  wbApproveIpd:()=>{ recordPillThen(()=>runWBReview()); },                                                       // step 2 done → review (step 3)
  wbApproveReview:()=>{ recordPillThen(()=>runLoader('campaignTreeWB',LOADERS.saving,'campaignTreeWB',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  wbLooksGoodFinal:()=>{ autopilot=false; go('home'); },
  // ── SCENARIO 3 (prompt CO) triggers ──
  p2ApproveUnderstood:()=>{ recordPillThen(()=>runP2Plan()); },
  p2ApprovePlan:()=>{ recordPillThen(()=>runP2Step('p2Ipd','Changing IPD content and images','p2Ipd',{})); },
  p2ApproveBilling:()=>{ recordPillThen(()=>runP2Step('p2Ipd','Loading access points','p2Ipd',{})); },
  p2ApproveIpd:()=>{ recordPillThen(()=>runP2Review()); },
  p2ApproveReview:()=>{ recordPillThen(()=>runLoader('p2Tree',LOADERS.saving,'p2Tree',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  p2LooksGoodFinal:()=>{ autopilot=false; go('home'); },
  // ── SCENARIO 4 (create) triggers ──
  crApproveUnderstood:()=>{ recordPillThen(()=>runCRPlan()); },
  crApprovePlan:()=>{ recordPillThen(()=>runCRStep('crMeta','Parsing and validating campaign meta','crMeta',{})); },
  crApproveMeta:()=>{ recordPillThen(()=>runCRStep('crAudience','Parsing and validating audiences','crAudience',{})); },
  crApproveAud:()=>{ recordPillThen(()=>runCRStep('crCreative','Parsing and validating access points','crCreative',{})); },
  crApproveBilling:()=>{ recordPillThen(()=>runCRStep('crCreative','Parsing and validating access points','crCreative',{})); },
  crApproveCreative:()=>{ recordPillThen(()=>runCRStep('crExperiment','Parsing and validating experiments','crExperiment',{})); },
  crApproveExp:()=>{ recordPillThen(()=>runCRStep('crSummary','Creating campaign summary','crSummary',{})); },
  crApproveSummary:()=>{ recordPillThen(()=>runLoader('crTree',{label:'Creating experiences',tasks:LOADERS.saving.tasks,after:2900},'crTree',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  crLooksGoodFinal:()=>{ autopilot=false; goHomeCreate(); },
};

/* Replace the clicked pill with the recorded reply (avatar + label) in place,
   hold ~700ms so the user sees the reply land, then run the loader. */
function recordPillThen(next){
  clearTimers();
  const pill=$('.ai__body .cardReplyBtn');
  if(pill){
    const label=pill.textContent.trim();
    // "Approve" records as past-tense "Approved"; "Looks good" (and others) stay as-is
    const recordedLabel = label==='Approve' ? 'Approved' : label;
    pill.outerHTML=recordedReply(recordedLabel);
    const b=$('.ai__body'); if(b) b.scrollTop=b.scrollHeight;
  }
  timers.push(setTimeout(next,700));
}

/* Toggle Table⇄Tree by swapping only #dataZone (preserve scroll). Re-binds itself. */
function bindToggle(main, name, state){
  const tg=main.querySelector('[data-toggle]'); if(!tg) return;
  tg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    autopilot=false;
    const v=b.dataset.view;
    current.state={...current.state,view:v};
    tg.outerHTML=viewToggle(v);                       // refresh toggle (active state + icon colors)
    const zone=main.querySelector('#dataZone');
    // CONV flow (campaignObject/campaignTree) changes only the campaign end date + priority,
    // so its Table view keeps billing/experiment end dates at 04/22, unedited.
    const isConv = name==='campaignObject' || name==='campaignTree';
    const edited = !(name==='singleCampaign' || isConv);
    if(zone){
      if(v==='tree'){
        // preview card only on the final tree scenes; Create's tree runs in RICH mode
        zone.innerHTML = treeView(name==='campaignTree'||name==='campaignTreeWB'||name==='p2Tree'||name==='crTree'||name==='crSummary', name==='crTree'||name==='crSummary');
      } else if(name==='campaignTreeWB'||name==='campaignObjectWB'){
        // Workbook flow Table view = billing-ID + access point edits, NOT the end-date diff
        zone.innerHTML = wbSummaryTables(current.state.hl!==false);
      } else if(name==='p2Tree'||name==='p2Review'){
        // Scenario 2 (prompt billing) Table view = single billing-ID + access point edits
        zone.innerHTML = p2SummaryTables(current.state.hl!==false);
      } else if(name==='crTree'||name==='crSummary'){
        // Create flow Table view: newly created data, nothing edited
        zone.innerHTML = campaignDataTables('04/22/2026',false);
      } else {
        zone.innerHTML = campaignDataTables((name==='singleCampaign'||isConv)?'04/22/2026':'07/31/2026',edited);
      }
    }
    wireTreeChevrons(main);
    wireTreeToolbar(main);                            // group-by / filter / search / expand-collapse
    bindToggle(main,name,current.state);              // re-bind (outerHTML replaced the node)
  });
}
/* Real expand/collapse: chevron toggles the node id in treeExpanded, then
   re-renders the tree in place (scroll preserved). */
/* re-render ONLY the .tree body (toolbar stays put → search input keeps focus),
   then re-bind chevrons. Returns silently if no tree is present. */
function refreshTreeBody(main){
  const treeEl=main.querySelector('[data-tree]');
  if(!treeEl) return;
  const tw=main.querySelector('[data-treewrap]');
  treeRichMode = !!(tw && tw.dataset.rich==='1');
  const withPreview=treeEl.dataset.preview==='1';
  const wrap=document.createElement('div');
  wrap.innerHTML=treeBody(withPreview);
  treeEl.replaceWith(wrap.firstElementChild);
  wireTreeChevrons(main);   // re-bind after replace
}
/* Detail ⇄ Preview toggle on the creatives drill-down. Re-renders the scene in place
   with the chosen view, preserving the current drill index. */
function wireCreativeToggle(main, scene, state){
  main.querySelectorAll('[data-cvtoggle] button').forEach(b=>b.onclick=()=>{
    autopilot=false;
    render(scene, {...state, creativeView:b.dataset.cv});
  });
}
function wireTreeChevrons(main){
  main.querySelectorAll('[data-treetoggle]').forEach(ch=>ch.onclick=(e)=>{
    e.stopPropagation();
    const id=ch.dataset.treetoggle;
    treeExpanded.has(id)?treeExpanded.delete(id):treeExpanded.add(id);
    refreshTreeBody(main);
  });
  // rich leaves: functional Preview | Data pills on the content card
  main.querySelectorAll('[data-pt]').forEach(pt=>pt.onclick=(e)=>{
    e.stopPropagation();
    const id=pt.dataset.ptleaf;
    if(pt.dataset.pt==='data') treeDataTab.add(id); else treeDataTab.delete(id);
    refreshTreeBody(main);
  });
}
/* toolbar behavior (Storybook semantics): click-in-order group-by chips,
   WORKING per-dimension filters, deep search, expand/collapse all. */
function wireTreeToolbar(main){
  const bar=main.querySelector('[data-treebar]'); if(!bar) return;
  const wrap=main.querySelector('[data-treewrap]');
  const withPreview=wrap && wrap.dataset.preview==='1';
  treeRichMode = !!(wrap && wrap.dataset.rich==='1');
  // refresh the purple 'active' state on the expand/collapse buttons after any change
  const syncEio=()=>{
    const st=treeExpandState();
    const e=bar.querySelector('[data-treeexpand]'), c=bar.querySelector('[data-treecollapse]');
    if(e) e.classList.toggle('active', st==='all');
    if(c) c.classList.toggle('active', st==='none');
  };
  // swap the panel in place (chip numbers / filter selected states) and re-bind
  const repaintPanel=()=>{
    const panel=bar.querySelector('.treebar__panel');
    if(panel){ const t=document.createElement('div'); t.innerHTML=treeToolbar(); panel.replaceWith(t.querySelector('.treebar__panel')); }
    refreshTreeBody(main); wireTreeToolbar(main); syncEio();
  };
  // group-by chip: append as the NEXT level / remove + renumber. After a regroup
  // the group levels open expanded (leaves stay collapsed) — Storybook behavior.
  const toggleGb=(key)=>{
    if(!DIM_BY_KEY[key]) return;
    const i=treeGroupBy.indexOf(key);
    if(i>=0) treeGroupBy.splice(i,1); else treeGroupBy.push(key);
    treeExpanded=new Set(groupTreeIds());
    repaintPanel();
  };
  bar.querySelectorAll('[data-gb]').forEach(chip=>{
    chip.onclick=()=>{ autopilot=false; toggleGb(chip.dataset.gb); };
    chip.onkeydown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); autopilot=false; toggleGb(chip.dataset.gb); } };
  });
  // per-dimension filters: real dropdowns over the distinct leaf values
  bar.querySelectorAll('[data-fbsel]').forEach(sel=>sel.onchange=()=>{
    autopilot=false;
    const k=sel.dataset.fbsel, v=sel.value;
    if(v) treeFilters[k]=v; else delete treeFilters[k];
    treeExpanded=new Set(groupTreeIds());   // keep the (re)filtered structure visible
    repaintPanel();
  });
  // reset EVERYTHING to the scene default: grouping, filters, search, expansion.
  const reset=bar.querySelector('[data-treereset]');
  if(reset) reset.onclick=()=>{ autopilot=false;
    treeGroupBy=GB_DEFAULT.slice(); treeFilters={}; treeSearch='';
    treeExpanded=defaultExpanded(withPreview);
    const si=bar.querySelector('[data-treesearch]'); if(si) si.value='';
    repaintPanel(); };
  const si=bar.querySelector('[data-treesearch]');
  if(si) si.oninput=()=>{ autopilot=false; treeSearch=si.value;
    // when searching, auto-expand everything so matches deep in the tree are visible
    if(treeSearch.trim()) treeExpanded=new Set(allTreeIds());
    refreshTreeBody(main); syncEio(); };
  const ex=bar.querySelector('[data-treeexpand]');
  if(ex) ex.onclick=()=>{ autopilot=false; treeExpanded=new Set(allTreeIds()); refreshTreeBody(main); syncEio(); };
  const cl=bar.querySelector('[data-treecollapse]');
  if(cl) cl.onclick=()=>{ autopilot=false; treeExpanded=new Set(); refreshTreeBody(main); syncEio(); };
}

function wire(name, state){
  const main = $('#main');
  // Table⇄Tree toggle: swap ONLY the #dataZone in place — preserve scroll position.
  bindToggle(main, name, state);
  // tab switch stays inside the same campaign — carry typed:true (no re-type) and
  // preserve whatever's currently in the composer as the draft so it doesn't reset
  main.querySelectorAll('[data-tab]').forEach(t=>t.onclick=()=>{
    autopilot=false;
    const inp=main.querySelector('#composerInput');
    const draft = (inp && !inp.querySelector('.promptBox__ph')) ? inp.textContent.trim() : (state.draft||'');
    go(name,{...state,tab:t.dataset.tab,typed:true,draft});
  });
  const back = main.querySelector('[data-back]'); if(back) back.onclick=()=>{autopilot=false;go('searchMultiple');};
  main.querySelectorAll('[data-disclosure]').forEach(d=>d.onclick=()=>{
    const ul=d.parentElement.querySelector('.chatStatus__steps'); const chev=d.querySelector('.chatStatus__chev');
    const open=ul.style.display!=='none'; ul.style.display=open?'none':'flex'; chev.classList.toggle('chatStatus__chev--open',!open);
  });

  // ── HOME: pill picks the scenario → types that prompt; Send runs it ──
  if(name==='home'){
    main.querySelector('#homeSend').onclick=(e)=>{e.stopPropagation();autopilot=false;trigger.home();};
    const pill=main.querySelector('#simPill'); const menu=main.querySelector('#simMenu');
    if(pill&&menu){
      pill.onclick=(e)=>{e.stopPropagation();menu.classList.toggle('hidden');};
      menu.querySelectorAll('[data-sim]').forEach(b=>b.onclick=(e)=>{
        e.stopPropagation(); autopilot=false;
        scenario = b.dataset.sim;
        /* The unlink flows start at "Find experiment" (the diagram's first box),
           so they open HOME with the find prompt typed, exactly like every
           other build: prompt -> project created -> search -> results -> open
           the experiment. */
        if(scenario==='ulPub')   { go('home',{autotype:XP_FIND_PROMPT}); return; }
        if(scenario==='ulDraft') { go('home',{autotype:XP_FIND_ONE_PROMPT}); return; }
        if(scenario==='lkExp')   { go('home',{autotype:XP_FIND_PROMPT}); return; }
        if(scenario==='lkDraft') { go('home',{autotype:XP_FIND_ONE_PROMPT}); return; }
        if(scenario==='mvExp')   { go('home',{autotype:MV_FIND_PROMPT}); return; }
        go('home',{autotype: (scenario==='cl4'||scenario==='cl5') ? CL4_FIND_PROMPT : FIND_EXP_PROMPT});
      });
      document.addEventListener('click',()=>menu.classList.add('hidden'),{once:true});
    }
  }

  // ── CLONE FLOW: the results table is MULTI-select (clone as many as you
  //    like); once the first row is picked the clone ask auto-types into the
  //    composer. Send runs the confirmation step, whose pill runs the clone.
  //    Selection freezes once the conversation starts (state.pc set). Row click
  //    still drills into the experience. ──
  // ── EXPERIMENT SEARCH: a row click opens that experiment's detail screen ──
  if(name==='xpSearch' && !state.loading && !state.phase){
    main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=()=>{
      autopilot=false;
      const r=XP_LIST[+tr.dataset.drillplace]; if(!r) return;
      // the draft row opens the unpublished variant, so the list itself decides
      go('xpDetail',{pub:r.status!=='Draft'});
    });
  }

  // ── ONE EXPERIENCE: the move ask auto-types, Send runs it ──
  if(name==='mvExp' && !state.loading && !state.phase){
    if(!state.mv && !state.typed) scheduleAskType('mvExp', MV_PROMPT);
    /* THE CONTINUATION (user, 2026-09-16): task 4's Publish is on offer, and
       the user ignores it — the second ask types itself into the composer so
       the flow visibly carries on instead of dead-ending at the pill. */
    const atLastTask = state.mv==='t'+MV_LAST_TASK;
    if(atLastTask && !state.typed2) scheduleAskType('mvExp', MV2_PROMPT, 'typed2');
    const send=main.querySelector('#composerSend');
    /* Send means the SECOND ask once the plan is finished */
    if(send) send.onclick=(e)=>{e.stopPropagation();autopilot=false;
      if(atLastTask) trigger.mv2Send(); else trigger.mvSend();};
    const ip=main.querySelector('#mvApproveIntent');
    if(ip) ip.onclick=()=>{autopilot=false;trigger.mvApproveIntent();};
    const pp=main.querySelector('#mvApprovePlan');
    if(pp) pp.onclick=()=>{autopilot=false;trigger.mvApprovePlan();};
    const tp=main.querySelector('#mvApproveTask');
    if(tp) tp.onclick=()=>{autopilot=false;trigger.mvApproveTask();};
    const mvp=main.querySelector('#mvPublishTask');
    if(mvp) mvp.onclick=()=>{autopilot=false;trigger.mvPublishTask();};
    /* Clicking any experience row in an experiment's list opens that
       experience's drill-down on the EXPERIMENT tab (user, 2026-09-16) — the
       tab that says which experiment it is linked to, which is the whole point
       of this flow. The checkbox keeps selecting, so ignore clicks on it. */
    main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=(e)=>{
      if(e.target.closest('.cbcol,.cb,[data-selrow]')) return;
      autopilot=false;
      render('mvExp',{...state, expDrill:true, expTab:'experiment'});
    });
    /* the version picker toggles here too, same as on xpDetail */
    const mvt=main.querySelector('[data-vertoggle]');
    if(mvt) mvt.onclick=(e)=>{
      if(e.target.closest('[data-verpick]')) return;
      e.stopPropagation(); autopilot=false;
      render('mvExp',{...state, verOpen:!state.verOpen});
    };
    /* the continuation's pills */
    const mvpt=main.querySelector('#mvPublishTo');
    if(mvpt) mvpt.onclick=()=>{autopilot=false;trigger.mvPublishTo();};
    const m2a=main.querySelector('#mv2Approve');
    if(m2a) m2a.onclick=()=>{autopilot=false;trigger.mv2Approve();};
    const m2p=main.querySelector('#mv2Publish');
    if(m2p) m2p.onclick=()=>{autopilot=false;trigger.mv2Publish();};
    /* the experience screen's TABS must work (user, 2026-09-15) */
    main.querySelectorAll('[data-exptab]').forEach(tb=>tb.onclick=()=>{
      autopilot=false; render('mvExp',{...state,expTab:tb.dataset.exptab}); });
    /* back out of a row drill-down to the experiment's list */
    const ebk=main.querySelector('[data-expback]');
    if(ebk) ebk.onclick=()=>{ autopilot=false;
      const st={...state}; delete st.expDrill; render('mvExp',st); };
    wireCreativeToggle(main,'mvExp',state);
  }

  // ── EXPERIMENT DETAIL: select linked experiences, then unlink them ──
  if(name==='xpDetail'){
    const sel=new Set(state.selected||[]);
    const frozen = state.ul!==undefined;       // the ask is in flight: freeze the table
    main.querySelectorAll('[data-selrow]').forEach(cb=>cb.onclick=(e)=>{
      e.stopPropagation(); if(frozen) return; autopilot=false;
      const i=+cb.dataset.selrow; sel.has(i)?sel.delete(i):sel.add(i);
      render('xpDetail',{...state,selected:[...sel]});
    });
    /* once the unlink lands the rows are a RESULT, not a picker: hand
       wireSelAll an EMPTY set or the header checkbox renders checked over
       unchecked rows (the same trap as the clone build's results table). */
    /* same rule as the table: the row list is shorter from the unlink onward
       (done, publishing, published), so the header checkbox must reflect an
       EMPTY selection in all three — not just `done`. */
    const shortList = ['done','publishing','published'].includes(state.ul);
    wireSelAll(main, shortList?new Set():sel, frozen,
      (s)=>render('xpDetail',{...state,selected:[...s]}));
    /* the LINK flow's ask needs no selection — the experience arrives by ID —
       so it auto-types as soon as the experiment is open. */
    if(scenario==='lkExp'||scenario==='lkDraft'){
      if(state.lk===undefined && !state.typed) scheduleAskType('xpDetail', LK_PROMPT);
      [['#lkApproveIntent','lkApproveIntent'],['#lkApprovePlan','lkApprovePlan'],
       ['#lkApproveTask','lkApproveTask'],['#lkApprove','lkApprove']]
        .forEach(([sel,fn])=>{ const b=main.querySelector(sel);
          if(b) b.onclick=()=>{autopilot=false;trigger[fn]();}; });
      const lp=main.querySelector('#lkPublish');
      if(lp) lp.onclick=()=>{autopilot=false;trigger.lkPublish();};
    }
    else if(!state.ul && sel.size && !state.typed) scheduleAskType('xpDetail', UL_PROMPT);
    /* ONE Send binding for this scene, routed by scenario. Binding it twice —
       once inside the link block and once here — meant this unconditional one
       ran LAST and overwrote the link handler, so Send did nothing. */
    const send=main.querySelector('#composerSend');
    if(send) send.onclick=(e)=>{e.stopPropagation();autopilot=false;
      if(scenario==='lkExp'||scenario==='lkDraft') trigger.lkSend();
      else trigger.ulSend();};
    const chipX=main.querySelector('[data-chipclear]');
    if(chipX) chipX.onclick=()=>{ if(frozen) return; autopilot=false; render('xpDetail',{...state,selected:[]}); };
    /* Clicking an experience row opens that experience's drill-down on the
       EXPERIMENT tab (user, 2026-09-16) — same rule as the move flow. The
       checkbox keeps selecting, so clicks on it are ignored here. */
    main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=(e)=>{
      if(e.target.closest('.cbcol,.cb,[data-selrow]')) return;
      autopilot=false;
      render('xpDetail',{...state, expDrill:+tr.dataset.drillplace, expTab:'experiment'});
    });
    const xbk=main.querySelector('[data-expback]');
    if(xbk) xbk.onclick=()=>{ autopilot=false;
      const st={...state}; delete st.expDrill; render('xpDetail',st); };
    main.querySelectorAll('[data-exptab]').forEach(tb=>tb.onclick=()=>{
      autopilot=false; render('xpDetail',{...state,expTab:tb.dataset.exptab}); });
    /* the version picker: clicking the chip toggles the menu. `verOpen` is
       tri-state — undefined means "use the default for this state" (open when
       the draft has just been created), true/false are the user's own choice. */
    /* the version menu opens ONLY when the user clicks the control (user,
       2026-09-15) — it never opens by itself on any state. */
    const vt=main.querySelector('[data-vertoggle]');
    if(vt) vt.onclick=(e)=>{
      if(e.target.closest('[data-verpick]')) return;
      e.stopPropagation(); autopilot=false;
      render('xpDetail',{...state, verOpen:!state.verOpen});
    };
    const ipill=main.querySelector('#ulApproveIntent');
    if(ipill) ipill.onclick=()=>{autopilot=false;trigger.ulApproveIntent();};
    const ppill=main.querySelector('#ulApprovePlan');
    if(ppill) ppill.onclick=()=>{autopilot=false;trigger.ulApprovePlan();};
    const pill=main.querySelector('#ulApprove');
    if(pill) pill.onclick=()=>{autopilot=false;trigger.ulApprove();};
    const pubpill=main.querySelector('#ulPublish');
    if(pubpill) pubpill.onclick=()=>{autopilot=false;trigger.ulPublish();};
  }

  if(name==='pcSearch' && !state.loading && !state.phase){
    const sel=new Set(state.selected||[]);
    // multi-select: each checkbox toggles that row in or out of the selection
    const apply=(arr)=>{ autopilot=false; render('pcSearch',{...state, selected: arr}); };
    const toggle=(i)=>{ const s=new Set(sel); s.has(i)?s.delete(i):s.add(i); apply([...s].sort((a,b)=>a-b)); };
    main.querySelectorAll('[data-selrow]').forEach(cb=>cb.onclick=(e)=>{
      /* cl5 deliberately does NOT freeze: the guardrail asks the user to
         re-pick, so the checkboxes must stay live. `reading` still freezes
         (a loader is running) but `mixed` does not. */
      e.stopPropagation(); if(state.pc!==undefined||state.cl2!==undefined||state.cl3!==undefined||state.cl4!==undefined||(state.cl5!==undefined && state.cl5!=='mixed')) return; toggle(+cb.dataset.selrow);
    });
    /* Group-by dropdown. Only scenario 5 makes it interactive: the guardrail
       asks the user to narrow to one access point, and regrouping the table is
       how they do it. Picking Access point CLEARS the selection (it spanned
       several access points, which is what the guardrail objected to) so the user
       starts clean inside one group. */
    const gb = main.querySelector('[data-groupby]');
    if(gb && state.cl5==='mixed') gb.onclick=(e)=>{
      e.stopPropagation(); autopilot=false;
      render('pcSearch',{...state, groupByOpen: !state.groupByOpen});
    };
    main.querySelectorAll('[data-groupopt]').forEach(b=>b.onclick=(e)=>{
      e.stopPropagation(); autopilot=false;
      render('pcSearch',{...state, groupBy:b.dataset.groupopt, groupByOpen:false, selected:[], retyped:false});
    });
    // tri-state header checkbox: select all / none, frozen once the flow starts.
    // On the clone-results view nothing is selected (the rows are copies, not a
    // picker), so pass an empty set or the header renders checked over unchecked rows.
    const onCloneList = state.pc==='done' || state.cl2==='allrev' || state.cl2==='done'
      || state.cl3==='done3a' || ['clonesErr','fixingAll','verified'].includes(state.cl3)
      || ['doneall','allrev','done'].includes(state.cl4)
      || state.cl5==='doneall';
    wireSelAll(main, onCloneList ? new Set() : sel,
      state.pc!==undefined||state.cl2!==undefined||state.cl3!==undefined||state.cl4!==undefined||(state.cl5!==undefined && state.cl5!=='mixed'), apply);
    // row click → experience drill-down (checkbox still selects)
    main.querySelectorAll('[data-selrowtr]').forEach(tr=>tr.onclick=(e)=>{
      if(e.target.closest('[data-selrow]'))return;
      autopilot=false;
      const i=+tr.dataset.selrowtr;
      go('pcSearch',{...state,expDrill:i,expDrillLoading:true});
      timers.push(setTimeout(()=>render('pcSearch',{...state,expDrill:i}),1100));
    });
    // drill-down bindings: back, sub-tabs, creative Detail | Preview toggle.
    // The task-2 review canvas has no back button but keeps its tabs.
    // Scenario 1 has no task-review canvases: the canvas stays on the results
    // list the whole time, so the only drill-down is a row click. (state.pc
    // 'done' here is the clone-results list, NOT an experience review — wiring
    // the experience sub-tabs onto it would bind handlers to the table.)
    const onTask2 = false;
    // scenario 2's per-task review canvases are drill-downs: they need the
    // Creative Detail|Preview toggle and the sub-tabs wired, same as a row drill
    if(state.cl2!==undefined && /^([tw]\d+|t0err|t0fix|t0fixed)$/.test(state.cl2)){
      main.querySelectorAll('[data-exptab]').forEach(tb=>tb.onclick=()=>{ autopilot=false; go('pcSearch',{...state,expDrillLoading:false,expTab:tb.dataset.exptab}); });
      wireCreativeToggle(main,'pcSearch',state);
    }
    if(state.expDrill!==undefined && state.expDrill!==null){
      const bk=main.querySelector('[data-expback]');
      if(bk) bk.onclick=()=>{ autopilot=false; const s={...state}; delete s.expDrill; delete s.expDrillLoading; delete s.expTab; delete s.creativeView; go('pcSearch',s); };
    }
    if(state.expDrill!==undefined && state.expDrill!==null || onTask2){
      main.querySelectorAll('[data-exptab]').forEach(tb=>tb.onclick=()=>{ autopilot=false; go('pcSearch',{...state,expDrillLoading:false,expTab:tb.dataset.exptab}); });
      wireCreativeToggle(main,'pcSearch',state);
    }
    // the selection-scoped ask auto-types once the first row is picked; which
    // ask depends on the scenario
    if(state.pc===undefined && state.cl2===undefined && state.cl3===undefined && sel.size && !state.typed)
      scheduleAskType('pcSearch', scenario==='cl2' ? CLONE2_PROMPT : CLONE_PROMPT);
    /* Scenario 5's SECOND ask. After the guardrail the user regroups and
       re-picks, so the clone ask has to type itself again — but `typed` is
       already true from the first ask, so it needs its own flag (`retyped`),
       cleared whenever the selection is emptied by the regroup. */
    if(state.cl5==='mixed' && sel.size && !state.retyped)
      scheduleAskType('pcSearch', CLONE_PROMPT, 'retyped');
    // the scenario-4 grouping object is a tree: bind its chevrons
    if(state.cl4!==undefined) wireTreeChevrons(main);
    // scenario 3's two typed replies auto-type in turn
    if(state.cl3==='asking' && !state.tgtTyped) scheduleAskType('pcSearch', CL3_TARGET_PROMPT, 'tgtTyped');
    /* the copy for every flagged clone arrives in ONE prompt, naming each one */
    if(state.cl3==='clonesErr' && !state.fixTyped)
      scheduleAskType('pcSearch', cl3FixPrompt(cloneNamesW()), 'fixTyped');
    // scenario 4: each group's destination auto-types when its turn comes.
    // The flag is per-GROUP, so the next group types afresh.
    const g4=/^g(\d+)ask$/.exec(state.cl4||'');
    if(g4 && !state['dTyped'+g4[1]]) scheduleAskType('pcSearch', cl4DestPrompt(+g4[1]), 'dTyped'+g4[1]);
    // task 1's error: the fix ask auto-types so the user only has to send it
    if(state.cl2==='t0err' && !state.fixTyped) scheduleAskType('pcSearch', USE_BODY_PROMPT, 'fixTyped');
    const send=main.querySelector('#composerSend');
    if(send) send.onclick=(e)=>{
      e.stopPropagation(); autopilot=false;
      // while task 1 shows the over-limit error, Send carries the corrected copy
      if(state.cl2==='t0err') trigger.cl2SendBodyFix();
      else if(state.cl3==='asking') trigger.cl3SendTarget();
      else if(state.cl3==='clonesErr') trigger.cl3SendFix();
      else if(/^g\d+ask$/.test(state.cl4||'')) trigger.cl4SendDest();
      else trigger.pcSend();
    };
    const chipX=main.querySelector('[data-chipclear]');
    if(chipX) chipX.onclick=()=>{ if(state.pc!==undefined||state.cl2!==undefined||state.cl3!==undefined||state.cl4!==undefined||(state.cl5!==undefined && state.cl5!=='mixed')) return; autopilot=false; render('pcSearch',{...state, selected:[]}); };
    // ── name card: arrives prefilled with the AI's proposal (no typing
    //    animation). Editing it keeps the value on state; emptying it disables
    //    Proceed, since a new experience has to be called something. ──
    const nameEl=main.querySelector('[data-namefield]');
    if(nameEl){
      const nameBtn=main.querySelector('#pcNameProceed');
      current.state.expName = nameEl.textContent.trim();
      nameEl.oninput=()=>{
        const v=nameEl.textContent.trim();
        current.state.expName=v;
        if(nameBtn){ nameBtn.disabled=!v; nameBtn.style.opacity=v?'':'.45'; nameBtn.style.cursor=v?'':'default'; }
      };
      nameEl.onkeydown=(e)=>{ if(e.key==='Enter'){ e.preventDefault(); nameEl.blur(); } };
      if(nameBtn) nameBtn.onclick=()=>{ if(nameBtn.disabled) return; autopilot=false; trigger.pcNameProceed(); };
    }

    // (no body-copy fix turn in scenario 1: nothing is changed, so no QA error)

    // ── field card: this is a guided demo, so clicking into the FIRST field
    //    types out both answers (same 18ms/char cadence as the composer) rather
    //    than making the reviewer type them. Values are held live in `vals` and
    //    synced to state without a re-render, so the caret never jumps. ──
    const inputs=[...main.querySelectorAll('[data-field]')];
    if(inputs.length){
      const vals={...(state.fields||{})};
      const proceed=main.querySelector('#pcProceed');
      const sync=()=>{
        const ready = PC_FIELDS.every(f=>vals[f.key]);
        if(proceed){ proceed.disabled=!ready; proceed.style.opacity=ready?'':'.45'; proceed.style.cursor=ready?'':'default'; }
        current.state.fields={...vals};
      };
      // Assigning textContent replaces the text node, which collapses the caret
      // back to offset 0 — so after every keystroke put it back at the end, the
      // way a real cursor trails the text being typed.
      const caretToEnd=(el)=>{
        const tn=el.firstChild;
        if(!tn || tn.nodeType!==3) return;      // no text node yet — nothing to sit after
        const r=document.createRange(), sel=window.getSelection();
        r.setStart(tn, tn.length); r.collapse(true);   // offset INTO the text node
        sel.removeAllRanges(); sel.addRange(r);
      };
      // type one field, then chain to the next empty one
      const fillFrom=(idx)=>{
        const el=inputs[idx];
        if(!el){ typing=false; return; }          // chain complete — release the latch
        const key=el.dataset.field, answer=PC_FIELD_VALUES[key]||'';
        if(vals[key]){ fillFrom(idx+1); return; }          // already answered
        el.classList.remove('is-empty');
        el.textContent='';
        // the caret must be visibly IN the field being filled, so move focus
        // along with the typing as the chain advances to the next field
        if(document.activeElement!==el) el.focus({preventScroll:true});
        let i=0;
        const step=()=>{
          if(current.state.pc!=='fields'){ typing=false; return; }   // flow moved on
          // append to the existing text node rather than replacing it, so the
          // node identity (and therefore the caret) survives each keystroke
          const tn=el.firstChild;
          if(tn && tn.nodeType===3) tn.appendData(answer[i]); else el.textContent=answer[i];
          i++;
          caretToEnd(el);
          vals[key]=el.textContent; sync();
          if(i<answer.length) timers.push(setTimeout(step,18));
          else timers.push(setTimeout(()=>fillFrom(idx+1),400));
        };
        step();
      };
      // `typing` stops a second focus from starting a competing chain. It must
      // clear once the chain is done, otherwise a stray focus during the render
      // (e.g. focus carried over from the previous card's Proceed) latches it
      // true and the fields can never be filled.
      let typing=false;
      inputs.forEach((el,idx)=>{
        el.onfocus=()=>{
          if(typing) return;
          if(PC_FIELDS.every(f=>vals[f.key])) return;   // already answered
          typing=true; autopilot=false; fillFrom(idx);
        };
        // manual typing still works and overrides the scripted answer
        el.oninput=()=>{ const v=el.textContent.trim(); vals[el.dataset.field]=v; el.classList.toggle('is-empty',!v); sync(); };
        el.onkeydown=(e)=>{ if(e.key==='Enter'){ e.preventDefault(); el.blur(); } };
      });
      if(proceed) proceed.onclick=()=>{ if(proceed.disabled) return; autopilot=false; current.state.fields={...vals}; trigger.pcProceed(); };
    }
    // conversation pills
    const pills=[['#pcLooksGood','pcLooksGood'],['#pcApprovePlan','pcApprovePlan'],
                 ['#pcApproveBodyFix','pcApproveBodyFix'],
                 ['#pcApproveExp','pcApproveExp'],
                 // scenario 2
                 ['#cl2KeepPrefix','cl2KeepPrefix'],['#cl2ApprovePlan','cl2ApprovePlan'],
                 ['#cl2ApproveTask','cl2ApproveTask'],['#cl2ApproveAll','cl2ApproveAll'],
                 // scenario 3
                 ['#cl3Direct','cl3Direct'],['#cl3Change','cl3Change'],
                 ['#cl3ApproveIntent','cl3ApproveIntent'],['#cl3ApproveNaming','cl3ApproveNaming'],
                 ['#cl3ApproveNamingDirect','cl3ApproveNamingDirect'],
                 ['#cl4ApproveNamingDirect','cl4ApproveNamingDirect'],
                 ['#cl3ApproveAll','cl3ApproveAll'],['#cl3ApproveFields','cl3ApproveFields'],
                 // scenario 4
                 ['#cl4Direct','cl4Direct'],['#cl4Change','cl4Change'],
                 ['#cl4ApproveConfirm','cl4ApproveConfirm'],['#cl4ApproveNaming','cl4ApproveNaming'],
                 ['#cl4ApprovePlan','cl4ApprovePlan'],
                 ['#cl4ApproveGroupIntent','cl4ApproveGroupIntent'],
                 ['#cl4ApproveGroup','cl4ApproveGroup'],
                 // scenario 5 — every new pill id MUST be added here or the
                 // button renders and simply does nothing
                 ['#cl5Direct','cl5Direct'],['#cl5Change','cl5Change'],
                 ['#cl5ApproveNaming','cl5ApproveNaming']];
    pills.forEach(([selr,fn])=>{ const b=main.querySelector(selr); if(b) b.onclick=()=>{autopilot=false;trigger[fn]();}; });
  }

  // ── SEARCH: checkbox toggles selection; clicking the ROW opens that campaign
  //    (row = the drill affordance). "View (n)" also opens the selected one. ──
  if(name==='searchMultiple' && !state.loading){
    const sel=new Set(state.selected||[]);
    const setSel=(s)=>render('searchMultiple',{selected:[...s]});
    main.querySelectorAll('[data-selrow]').forEach(cb=>cb.onclick=(e)=>{
      e.stopPropagation(); autopilot=false;
      const i=+cb.dataset.selrow; sel.has(i)?sel.delete(i):sel.add(i); setSel(sel);
    });
    // click a row body (not the checkbox) → drill into that campaign
    main.querySelectorAll('[data-selrowtr]').forEach(tr=>tr.onclick=(e)=>{
      if(e.target.closest('[data-selrow]'))return;
      autopilot=false; trigger.viewSelected(state);
    });
    const view=main.querySelector('[data-view-selected]');
    if(view) view.onclick=()=>{autopilot=false;trigger.viewSelected(state);};
  }

  // ── SINGLE CAMPAIGN: only the composer Send button triggers the change request ──
  if(name==='singleCampaign'){
    const send=main.querySelector('#composerSend');
    if(send) send.onclick=(e)=>{e.stopPropagation();autopilot=false;trigger.change(state);};
  }

  // ── Plan / edits: the reply pill is the trigger ──
  if(name==='coIntent' && !state.loading){
    const lg=main.querySelector('#looksGood'); if(lg) lg.onclick=()=>{autopilot=false;trigger.approvePlan();};
  }
  if(name==='changeMeta' && !state.loading){
    const b=main.querySelector('#approveChange'); if(b) b.onclick=()=>{autopilot=false;trigger.approveChange();};
  }
  if(name==='campaignObject' && !state.loading){
    const b=main.querySelector('#approveCampaign'); if(b) b.onclick=()=>{autopilot=false;trigger.approveCampaign();};
  }
  if(name==='campaignTree' && !state.loading){
    const lg=main.querySelector('#looksGoodFinal'); if(lg) lg.onclick=()=>{autopilot=false;go('home');};
  }

  // ── WORKBOOK flow reply pills + access point drill-down ──
  const wbPill=(id,fn)=>{const b=main.querySelector('#'+id); if(b) b.onclick=()=>{autopilot=false;fn();};};
  if(name==='coIntentWB'){
    wbPill('wbApproveUnderstood',()=>trigger.wbApproveUnderstood());  // understanding → plan
    wbPill('wbApprovePlan',()=>trigger.wbApprovePlan());              // plan → billing
  }
  if(name==='billingIDs' && !state.loading) wbPill('wbApproveBilling',()=>trigger.wbApproveBilling());
  if(name==='ipdContent' && !state.loading){
    wbPill('wbApproveIpd',()=>trigger.wbApproveIpd());
    if(state.drill===undefined) main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=()=>{autopilot=false;drillInto('ipdContent',+tr.dataset.drillplace);});
    const bk=main.querySelector('[data-wbback]'); if(bk) bk.onclick=()=>{autopilot=false;go('ipdContent',{});};
    wireCreativeToggle(main,'ipdContent',state);
  }
  if(name==='campaignObjectWB' && !state.loading) wbPill('wbApproveReview',()=>trigger.wbApproveReview());
  if(name==='campaignTreeWB' && !state.loading) wbPill('wbLooksGoodFinal',()=>trigger.wbLooksGoodFinal());

  // ── SCENARIO 3 (prompt CO) reply pills + access point drill-down ──
  if(name==='p2Intent'){
    wbPill('p2ApproveUnderstood',()=>trigger.p2ApproveUnderstood());
    wbPill('p2ApprovePlan',()=>trigger.p2ApprovePlan());
  }
  if(name==='p2Billing' && !state.loading) wbPill('p2ApproveBilling',()=>trigger.p2ApproveBilling());
  if(name==='p2Ipd' && !state.loading){
    wbPill('p2ApproveIpd',()=>trigger.p2ApproveIpd());
    if(state.drill===undefined) main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=()=>{autopilot=false;drillInto('p2Ipd',+tr.dataset.drillplace);});
    const bk=main.querySelector('[data-wbback]'); if(bk) bk.onclick=()=>{autopilot=false;go('p2Ipd',{});};
    wireCreativeToggle(main,'p2Ipd',state);
  }
  if(name==='p2Review' && !state.loading) wbPill('p2ApproveReview',()=>trigger.p2ApproveReview());
  if(name==='p2Tree' && !state.loading) wbPill('p2LooksGoodFinal',()=>trigger.p2LooksGoodFinal());

  // ── SCENARIO 4 (create) reply pills + drill-rows ──
  const crDrill=(sc)=>{
    // row click → skeleton flash (~1100ms, same as the WB drill) → settled drill view
    if(state.drill===undefined) main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=()=>{
      autopilot=false; const i=+tr.dataset.drillplace;
      go(sc,{...state,drill:i,drillLoading:true});
      timers.push(setTimeout(()=>render(sc,{...state,drill:i}),1100));
    });
    const bk=main.querySelector('[data-crback]'); if(bk) bk.onclick=()=>{autopilot=false;go(bk.dataset.crback,{});};
  };
  if(name==='crIntent'){ wbPill('crApproveUnderstood',()=>trigger.crApproveUnderstood()); wbPill('crApprovePlan',()=>trigger.crApprovePlan()); }
  if(name==='crMeta' && !state.loading) wbPill('crApproveMeta',()=>trigger.crApproveMeta());
  if(name==='crAudience' && !state.loading){ wbPill('crApproveAud',()=>trigger.crApproveAud()); crDrill('crAudience'); }
  if(name==='crBilling' && !state.loading){ wbPill('crApproveBilling',()=>trigger.crApproveBilling()); crDrill('crBilling'); }
  if(name==='crCreative' && !state.loading){ wbPill('crApproveCreative',()=>trigger.crApproveCreative()); crDrill('crCreative'); wireCreativeToggle(main,'crCreative',state); }
  if(name==='crExperiment' && !state.loading){ wbPill('crApproveExp',()=>trigger.crApproveExp()); crDrill('crExperiment'); }
  if(name==='crSummary' && !state.loading) wbPill('crApproveSummary',()=>trigger.crApproveSummary());
  if(name==='crTree' && !state.loading){
    wbPill('crLooksGoodFinal',()=>trigger.crLooksGoodFinal());
    // experiences rows → experience drill-down (skeleton flash, same as other drills)
    if(state.tab==='experiences' && (state.expDrill===undefined || state.expDrill===null)){
      main.querySelectorAll('[data-drillplace]').forEach(tr=>tr.onclick=(e)=>{
        if(e.target.closest('.cbcol'))return;
        autopilot=false; const i=+tr.dataset.drillplace;
        go('crTree',{...state,expDrill:i,expDrillLoading:true});
        timers.push(setTimeout(()=>render('crTree',{...state,expDrill:i}),1100));
      });
    }
    if(state.expDrill!==undefined && state.expDrill!==null){
      const bk=main.querySelector('[data-expback]');
      if(bk) bk.onclick=()=>{autopilot=false;go('crTree',{view:state.view||'tree',tab:'experiences'});};
      main.querySelectorAll('[data-exptab]').forEach(tb=>tb.onclick=()=>{
        autopilot=false;
        go('crTree',{...state,expDrillLoading:false,expTab:tb.dataset.exptab});
      });
      wireCreativeToggle(main,'crTree',state);
    }
  }

  const hlcb=main.querySelector('[data-hlchanges]');
  if(hlcb) hlcb.onchange=()=>{ autopilot=false; go(current.name,{...current.state, hl:hlcb.checked}); };

  wireTreeChevrons(main);   // real expand/collapse on any tree present
  wireTreeToolbar(main);    // group-by / filter / search / expand-collapse on any tree present
}

/* ============================================================
   CLONE IPD EXPERIENCES FLOW (3 Sep)
   Scenario 1 of 4: SAME access point, no changes while cloning.
     1. Same access point, no changes            ← this build
     2. Same access point, want to change it
     3. Varying access points, no changes
     4. Varying access points, want to change it

   Find QB Payroll IPD experiences on the Banking - hellobox access point →
   MULTI-select the ones to copy → "I want to clone these experiences." →
   AI confirms what it will do (how many copies, the access point they keep,
   what carries over, and that the copies land in Draft) → "Looks good"
   → clones → done.

   Deliberately SHORTER than the access point-change flow it was copied from:
   nothing is being changed, so there is no name card, no field card, no
   plan, and no QA error. One confirm, one clone. The access point-change
   pieces (pcNameCard, pcFieldCard, PC_PLAN, the QA-error canvas) are left
   in the file as dead code — scenarios 2 and 4 will need the change-side
   parts of them.
   ============================================================ */
// Scenario 1: every selected experience keeps its own access point, and since the
// search is filtered to one access point they are all the same. No From/To pairs
// anywhere in this build — nothing changes.
const CLONE_PROMPT = 'I want to clone these experiences.';
// copies land in Draft, named from the source with a Clone- PREFIX (front of
// the name, so the copies sort together and read as clones at a glance)
/* The marker goes at the END of the name (user, 2026-09-11; it used to be a
   `Clone-` prefix). Kept as one constant feeding both the names and every
   card's copy so they cannot drift. `CLONE_WORD` is the bare word for prose. */
const CLONE_SUFFIX = '-Clone';
const CLONE_WORD = 'Clone';
/* Whether clone `i` still needs copy, readable from wire() as well as the
   scene (the scene's own `needsCopy` closes over local state). */
/* The clone names for the current selection, derivable from state alone so
   wire() can build the copy prompt without reaching into the scene. */
function cloneNamesW(){
  const st=current&&current.state||{};
  return [...(st.selected||[])].sort((a,b)=>a-b)
    .map(i=>PC_ROWS[i] ? PC_ROWS[i].exp.replace('…','') + CLONE_SUFFIX : null)
    .filter(Boolean);
}
function needsCopyW(i){
  const st=current&&current.state||{};
  const flagged3 = st.cl3!==undefined && st.path==='change' && ['clonesErr','fixing','done'].includes(st.cl3);
  const flagged4 = st.cl4!==undefined && st.path==='change';
  if(!flagged3 && !flagged4) return false;
  return !(st.fixes||[]).includes(i);
}
const CLONE_PLACEMENT = 'Banking -hellobox';
// fresh IDs for the copies (a clone is a new experience, so it gets a new ID)
const CLONE_EIDS = [
  'e3ab45da-9505-11f1-86ec-a3e65…','f4bc56eb-9505-11f1-86ec-a3e65…',
  '05cd67fc-9505-11f1-86ec-a3e65…','16de780d-9505-11f1-86ec-a3e65…',
  '27ef891e-9505-11f1-86ec-a3e65…','38f09a2f-9505-11f1-86ec-a3e65…',
  '4901ab30-9505-11f1-86ec-a3e65…','5a12bc41-9505-11f1-86ec-a3e65…',
  '6b23cd52-9505-11f1-86ec-a3e65…','7c34de63-9505-11f1-86ec-a3e65…',
];
const CLONE_STAMP = '09/03 11:20PST';

/* ============================================================
   SCENARIO 2: same access point selection, but CHANGE the access point while cloning
   Prompt names both the clone and the change in one ask. Unlike the
   access point-change flow, the TEMPLATE is NOT changed here — only the access point,
   so the creative keeps helloboxThirdParty and the same fields.
   Flow: multi-select → "clone these and change access point to Batch save -
   hellobox" → AI offers the Clone- prefix OR a name of the user's choosing →
   user keeps the prefix → plan of n+1 tasks (review each new clone, then review
   all of them together) → task 1 has a body-copy error the user fixes by
   prompt → tasks 2..n pass → final task shows all clones in the table.
   ============================================================ */
/* ============================================================
   SCENARIO 4: the selection spans SEVERAL access points.
   Per the flow diagram's "Same access points? NO" branch:
     search (NOT access point-filtered) → select across access points →
     Marketing Studio GROUPS them and plays the grouping back
     ("You have selected N experiences across M access points"), shown as an
     object on the canvas (diagram Option 1) →
     "Would you like to make access point changes?"
       NO  → one playback + confirm → clone every group at once
       YES → iterate GROUP BY GROUP: ask the destination access point for that
             group, carry the field values over, playback + confirm, clone,
             then "Starting on next group" until the groups run out.
   ============================================================ */
// this search is deliberately NOT filtered to one access point
const CL4_FIND_PROMPT = 'Find all QB Payroll IPD experiences.';
const CL4_PROJECT = 'QB Payroll IPD experiences';
const CL4_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${CL4_PROJECT}</span>`;
// the six access points the results span
const CL4_APS = [
  'Banking -hellobox','Chart of Accounts -hellobox','Expenses -hellobox',
  'Payments Deposit -hellobox','Vendors -hellobox','Banner - Shell',
];
/* 18 rows, 3 per access point, so a selection can genuinely span groups. */
const CL4_ROWS = CL4_APS.flatMap((ap,ai)=>['MedPS','HighPS','NoPS'].map((ps,pi)=>{
  const k = ai*3+pi;
  const elm = ['9684','9533','4217','7856','3041','6198'][ai];
  return {
    exp:`ELM${elm}-IPD-QBPayroll-${ap.split(' -')[0].replace(/\s/g,'')}-${ps}…`,
    eid:(0x4d+k).toString(16)+'738ef0-9505-11f1-86ec-a3e65…',
    ver: ['v3','v4','v3'][pi], status:'Published',
    ap, tmpl:'helloboxThirdParty', prio:'13.0',
    by:'Stroupe, Kristin', mod:'06/30 18:30PST',
  };
}));
// group a selection by access point, in the order the APs appear
const cl4Groups = (selArr)=>{
  const by = new Map();
  [...(selArr||[])].sort((a,b)=>a-b).forEach(i=>{
    const r = CL4_ROWS[i]; if(!r) return;
    if(!by.has(r.ap)) by.set(r.ap, []);
    by.get(r.ap).push(i);
  });
  return [...by.entries()].map(([ap,idx])=>({ap,idx}));
};
// each group is retargeted to a different destination, cycling this list
const CL4_DEST = ['Batch save -hellobox','Invoice -hellobox','Reports -hellobox','Payroll -hellobox','Bills -hellobox','Shell - Banner'];
const cl4Dest = (g)=>CL4_DEST[g % CL4_DEST.length];

/* ============================================================
   SCENARIO 5: the GUARDRAIL. Same input as scenario 4 (a selection spanning
   several access points) but the opposite answer: instead of grouping and
   retargeting, the agent declines the batch and asks the user to narrow the
   selection to ONE access point. Kept alongside cl4 deliberately — the two are
   alternative design directions for the same situation, so they can be shown
   side by side. Reuses CL4_ROWS / CL4_APS / cl4Groups wholesale.
   TERMINAL: the flow ends at the message. There is no continuation, because
   the point is the guardrail itself, not what the user does next. */
/* The message carries the COUNT ONLY, never a list of access point names. Naming
   them does not scale (six in the demo data, and a real selection could span
   twenty), and a CAPPED list is worse still because it hides exactly the
   access points the user needs in order to act. The breakdown belongs in the
   table, which sorts and stays legible at any size — and the table does NOT
   regroup here, per this build's rule that the canvas updates when the agent
   produces an artifact, not when it asks a question. Both calls were the
   user's, 2026-09-09. */
/* Step 1 (user, 2026-09-10): before the limit is mentioned at all, the agent
   asks the same question scenario 4 asks. Only the CHANGE branch runs into the
   one-access point-at-a-time limit; "clone as they are" needs no change, so it
   behaves exactly like 4a. Same copy and the same two-pill .replyRow as
   CL4_GROUPED — the question is identical, so it must read identically. */
const CL5_CHOICE = (nSel, G, active, chose)=> agentMsg(
  disclosure('Read your request, checked the experiences',['Reading your request','Checking the selected experiences','Checking their access points'])
  + `<div class="summaryCard"><p class="summaryCard__intro">You've selected ${nSel} experience${nSel===1?'':'s'} across ${G.length} access point${G.length===1?'':'s'}.</p><p class="summaryCard__q">Do you want to change the access point while I clone them, or clone them as they are?</p>${active
      ? `<div class="replyRow">${replyBtn('Change the access point','cl5Change')}${replyBtn('Clone as they are','cl5Direct')}</div>`
      : recordedReply(chose || 'Change the access point')}</div>`);
/* Same card and copy as CL4_NAMING(active, direct=true): the prefix is stated
   and confirmed before any copy exists. Only the pill id differs. */
const CL5_NAMING = (active)=> agentMsg(
  `<div class="chatBubble">I'll add "${CLONE_WORD}" to the end of each name so you can tell the copies apart.${cloneInfoNote()}<div class="bubble-q">Shall I go ahead?</div>${active?replyBtn('Proceed','cl5ApproveNaming'):recordedReply('Proceed')}</div>`);
const CL5_MIXED = (nSel, G)=> agentMsg(
  disclosure('Checked the selected experiences',
    ['Reading your request','Checking the selected experiences','Comparing their access points'])
  + `<div class="chatBubble">Cloning runs one access point at a time, and the ${nSel} experiences you selected are across ${G.length} access points.<div class="bubble-q">Select experiences that share a access point and I'll clone those together.</div></div>`);
/* the grouped canvas lists the PLACEMENT column but not Validation: nothing
   is flagged in this flow (the template never changes) */
const PC_COLS_AP = [
  {label:'Experience',key:'exp',info:1},
  {label:'Status',key:'status',badge:1},
  {label:'Access point',key:'ap'},
  {label:'Template',key:'tmpl'},{label:'Priority',key:'prio'},
  {label:'Created by',key:'by'},{label:'Last updated',key:'mod'},
];
/* Group-by dropdown — Figma node 919:48122 (Search + Sort + Filter): a 200x40
   input-shaped control, label left and chevron right. Unset it reads the bare
   placeholder "Group by"; once the table IS grouped it names the key,
   "Group by: Access points", so the control reflects the view rather than
   inviting a choice already made. Every table in the clone flows carries it.
   Named groupByCtl because `groupBy` is already a local in the tree builder. */
/* The dropdown's options, matching the real product's list. Only Access point is
   wired: it is the only field the row data actually carries, and it is the one
   this flow is about. The rest are listed (so the control looks like the real
   thing) but inert — no data behind them, and inventing some would add four
   columns this flow never uses. `by` is the label the control shows once set;
   `on` is what makes it clickable. */
const GROUP_BY_OPTS = [
  {label:'Access point',      by:'Access points', on:true},
  {label:'Audience Set',   on:false},
  {label:'Status',         on:false},
  {label:'Promotion Offer',on:false},
  {label:'Experiment ID',  on:false},
  {label:'Treatment ID',   on:false},
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
const rxToolbarCl4 = (by='')=>`<div class="toolbar">
      <div class="search">${I.search}<span>Search</span></div>
      <span class="iconbtn">${I.sliders}</span>
      ${groupByCtl(by)}
    </div>`;
const cl4DestPrompt = (g)=>`Change to ${cl4Dest(g)}.`;

/* ============================================================
   SCENARIO 3: the user does NOT say up front whether they want a change.
   The clone ask is plain ("I want to clone these experiences"), and the AI
   offers the choice — clone directly (3a) or change the access point (3b).

   3a is scenario 1's ending: clone, done.
   3b is the long one:
     AI asks WHICH access point → the user's reply names a access point AND a
     template → plan → **task 1 reviews the updated PLACEMENT** (not an
     experience: one screen, with a change-summary download the user can send
     to marketers to request copy) → approve → the clones are created and
     EVERY ONE carries a validation error, because changing the TEMPLATE (not
     the access point) leaves fields in each experience's creative invalid → the
     user fixes one by prompt → the finished object offers the change summary
     again.
   ============================================================ */
// the user's answer names BOTH the access point and the template
const CL3_TARGET_PROMPT = 'Use Batch save - hellobox with the hellobox - text template.';
const CL3_NEW_PLACEMENT = 'Batch save -hellobox';
const CL3_NEW_TEMPLATE  = 'helloboxText';
const CL3_VIEW_NAME = 'Cloned experiences - Batch save hellobox';
// with the template changed, every clone lands with the same creative problem
const CL3_ERR_FIELD = 'Body copy';
/* Each clone gets its OWN copy — the creatives are not the same, which is why
   the user supplies them per experience in a single prompt. */
const CL3_FIX_COPY = [
  "Claim before your trial ends. We'll calculate, file, and pay your payroll taxes.",
  "Get 90% off payroll for three months. Offer ends soon.",
  "Run payroll in minutes and we'll handle the taxes for you.",
];
/* One prompt supplying every clone's copy, as a LIST — a run-on sentence was
   unreadable past two clones. The composer gets plain text with newlines
   (rendered by white-space:pre-wrap); the bubble gets real list markup. */
const cl3FixPairs = (names)=> names.map((nm,i)=>({nm, copy:CL3_FIX_COPY[i % CL3_FIX_COPY.length]}));
const cl3FixPrompt = (names)=> 'Use this copy:\n'
  + cl3FixPairs(names).map(l=>`\u2022 ${l.nm}: "${l.copy}"`).join('\n');
const cl3FixBubble = (names)=> `Use this copy:<ul class="msgList">${
  cl3FixPairs(names).map(l=>`<li><span class="msgList__k">${l.nm}</span><span class="msgList__v">"${l.copy}"</span></li>`).join('')}</ul>`;

const CLONE2_PROMPT = 'I want to clone these and change access point to Batch save - hellobox.';
// the access point the copies move to (the originals keep theirs)
const CL2_NEW_PLACEMENT = 'Batch save -hellobox';
// the user's reply to the naming offer: keep the prefix rather than name them
const CL2_KEEP_PREFIX_PROMPT = 'Add Clone to the end of each name.';
// the copies live on the NEW access point, so their view is named for that one
const CL2_VIEW_NAME = 'Cloned experiences - Batch save hellobox';
const FIND_EXP_PROMPT = 'Find all QB Payroll IPD experiences using Banking - hellobox access point.';
const CHANGE_TMPL_PROMPT = 'Change access point to Batch save - hellobox and template to hellobox - text.';
const NEW_TEMPLATE = 'helloboxText';
const OLD_TEMPLATE = 'helloboxThirdParty';
const OLD_PLACEMENT = 'Banking -hellobox';
const NEW_PLACEMENT = 'Batch save -hellobox';
// the new experience the access point change creates; the selected one is untouched
const PC_PROPOSED_NAME = 'ELM9684-IPD-QBPayroll-BatchSaveHellobox-HighPS-US';
// body copy limit for the text template — the carried-over copy runs over it
const BODY_LIMIT = 100;
const BODY_OVER  = CREATIVE_BODY.length;                 // 118
const BODY_FIXED = "Claim before your trial ends. We'll calculate, file, and pay your payroll taxes.";
const BODY_ERR   = `Body copy exceeds the character limit. ${BODY_OVER} of ${BODY_LIMIT} used.`;
const USE_BODY_PROMPT = `Use this: ${BODY_FIXED}`;
// IDS info circle in Ui/Info (#6f5ade), filled, white glyph
const INFO_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="#6f5ade"/><rect x="8.25" y="7.6" width="1.5" height="5" rx="0.75" fill="#fff"/><circle cx="9" cy="5.4" r="0.95" fill="#fff"/></svg>`;
// IDS circle-exclamation-fill in Ui/Negative (#d52b1e)
const ERR_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#d52b1e"/><rect x="7.25" y="3.9" width="1.5" height="5" rx="0.75" fill="#fff"/><circle cx="8" cy="11.3" r="0.95" fill="#fff"/></svg>`;

/* Auto-type the selection-scoped ask into the composer. Re-renders (checkbox
   toggles) replace the composer node mid-type, so every wire() re-schedules the
   start and bumps a token — only the latest pending start runs, always against
   the live node. Once typing completes, state.typed keeps the draft across
   re-renders instead. */
let askTypeTok = 0;
function scheduleAskType(scene, text, flag='typed'){
  const tok = ++askTypeTok;
  timers.push(setTimeout(()=>{
    if(tok!==askTypeTok) return;                    // superseded by a newer render
    const inp=$('#composerInput');
    if(!inp) return;
    if(!inp.querySelector('.promptBox__ph') && inp.textContent.trim()) return;  // already has text
    typeInto(inp, text, ()=>{ if(current.name===scene) current.state[flag]=true; });
  },700));
}

/* header checkbox tri-state: checked = all rows selected, indeterminate = some.
   Clicking selects all rows / clears the selection. frozen → selection is
   locked mid-flow, so the click is swallowed. */
function wireSelAll(main, sel, frozen, apply){
  const rowCbs=main.querySelectorAll('[data-selrow]');
  const hdr=main.querySelector('.tbl thead .cb');
  if(!hdr || !rowCbs.length) return;
  hdr.checked = sel.size>0 && sel.size===rowCbs.length;
  hdr.indeterminate = sel.size>0 && sel.size<rowCbs.length;
  hdr.onclick=(e)=>{
    e.stopPropagation();
    if(frozen){ e.preventDefault(); return; }
    autopilot=false;
    apply(sel.size===rowCbs.length ? [] : [...Array(rowCbs.length).keys()]);
  };
}

/* experience drill-down canvas (Figma 1:38730): clicking an experiences row
   swaps the canvas for the experience detail — back arrow, name, status chip,
   full ID, version — with sub-tabs Creative (default) / Experience meta /
   Audience / Experiment. The conversation panel stays put.
   noBack=true renders the same detail as a REVIEW canvas (final task), where
   the experience is the thing under review, not somewhere you navigated into.
   tmpl overrides the template shown on the Creative tab. */
function expDrillCanvas(crumb, r, state, opts={}){
  const t = state.expTab || 'creative';
  const noBack = !!opts.noBack;
  const tmpl = opts.tmpl || r.tmpl;
  const tabTitle = (txt)=>expTabTitle(txt);
  let tabBody;
  if(state.expDrillLoading){
    tabBody = kvSkeleton(6,2);
  } else if(t==='audience'){
    tabBody = `<div class="cd-head" style="margin:0 0 12px"><span class="cd-head__t">AUD_AUDIENCE2-QBO_HighPriceSensitivity</span></div>
      <div class="cd-sub" style="margin:0 0 28px">${AUDIENCES[1].desc}</div>${audienceBuilder()}`;
  } else if(t==='creative'){
    const view = state.creativeView==='preview' ? 'preview' : 'detail';
    tabBody = `<div class="cd-head"><span class="cd-head__t">ELM 200_Hellobox Creative_Deep Discount</span>
        <div class="cvtoggle" data-cvtoggle>
          <button data-cv="detail" class="${view==='detail'?'active':''}">${DETAIL_ICON} Detail</button>
          <button data-cv="preview" class="${view==='preview'?'active':''}">${IMAGE_ICON} Preview</button>
        </div></div>
      <div class="cd-attr">
        <div><div class="cd-attr__k">ACCESS POINT</div><div class="cd-attr__v">${opts.hlAp?`<span class="cd-hl">${opts.ap||r.ap}</span>`:(opts.ap||r.ap)}</div></div>
        <div><div class="cd-attr__k">TEMPLATE</div><div class="cd-attr__v">${opts.hlTmpl?`<span class="cd-hl">${tmpl}</span>`:tmpl}</div></div>
      </div>` + (opts.newFields ? newFieldDetail(view, opts)
                 : opts.bodyOver!==undefined ? cloneCreative(view, opts.bodyOver, opts.bodyEdited)
                 : singleCreative(view));
  } else if(t==='experiment'){
    /* opts.experiment overrides the placeholder so a flow that CHANGES which
       experiment an experience belongs to can show the real one. */
    tabBody = tabTitle(opts.experiment || 'IPD High Price Sensitivity · IXP 321931') + `${metaGrid2([['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['TYPE','A/B/N (3-cell)']])}<div style="height:12px"></div>${treatmentsTable()}`;
  } else {
    tabBody = metaGrid2([['PRIORITY',r.prio],['CREATED BY',r.by],['START DATE','January 28, 2026'],['END DATE','April 22, 2026']]);
  }
  const expTabs = [['creative','Creative'],['meta','Experience meta'],['audience','Audience'],['experiment','Experiment']]
    .map(([k,l])=>`<span class="tab ${t===k?'active':''}" data-exptab="${k}">${l}</span>`).join('');
  const back = noBack ? '' : `<span class="back" data-expback>${I.back}</span>`;
  const name = opts.name || r.exp.replace('…','-US');
  return `<div class="content">${topbar(crumb)}<div class="scroll"><div class="pad">
    <div class="detail-sticky"><div class="detail-h">${back}<span class="title">${name}</span><span class="detail-vd"></span>${badge(opts.status||r.status||'Draft')}${opts.qaBadge?`<span class="detail-vd"></span><span class="qaBadge qaBadge--${opts.bodyOver?'err':'ok'}">${opts.bodyOver?'QA Error':'Verified'}</span>`:''}<span class="detail-vd"></span><span class="detail-sub" style="margin:0">ID:&nbsp; ${(opts.eid||r.eid).replace('…','1c6bc02')} ${COPY_ICON}</span><span class="verselect">${opts.ver||r.ver||'v1'} ${I.chev}</span></div>
    <div class="tabs tabs--insticky tabs--exp">${expTabs}</div></div>
    ${tabBody}${opts.hlBar?hlBar(opts.hl!==false):''}</div></div></div>`;
}

/* Creative tab for the NEW experience: the carried-over values plus the two
   fields the hellobox image access point adds, both marked as changed. */
function newFieldDetail(view, opts){
  const f = opts.fields||{};
  const hl = opts.hl!==false;
  const sub  = f.subheader || PC_FIELD_VALUES.subheader;
  const foot = f.footnote  || PC_FIELD_VALUES.footnote;
  // by task 2 the body copy has been corrected, so it carries the highlight too
  if(view==='preview') return `<div class="creativeCenter">${helloboxCreative(false,{sub,foot,tmpl:NEW_TEMPLATE,hl,body:BODY_FIXED})}</div>`;
  return `<div class="cd-row">${cdPair('HEADLINE',CREATIVE_HEADLINE,false)}${cdPair('BODY',BODY_FIXED,hl)}</div>
    <div class="cd-row" style="margin-top:16px">${cdPair('SUBHEADER',sub,hl)}${cdPair('CTA',CREATIVE_CTA,false)}</div>
    <div class="cd-row" style="margin-top:16px">${cdPair('FOOTNOTE',foot,hl)}${cdPair('',' ',false)}</div>`;
}

// QB Payroll IPD experiences on the Banking - hellobox access point (the search filter).
// Versions are a MIX of v3 and v4 across the search results — these are live
// experiences that have each been revised a different number of times. A clone
// always starts over at v1 (see cloneRows), so the column also makes the reset
// visible on the results view.
/* ============================================================
   LINK / UNLINK EXPERIMENTS  (Sep 11)
   The experiment detail screen, rebuilt in our design from the current
   tool's dialog: name | status | ID on one row, the attributes as a grey
   attribute-value card (holdout treatment is the FIFTH pair, reading
   "None", not the radio row), then the linked experiences table.
   ============================================================ */
const XP_NAME   = 'ty25_Catchall_PLU';
const XP_DRAFT_NAME = 'ty25_Catchall_PLU_holdback';   // the DRAFT experiment (ulDraft)
const XP_DRAFT_ID   = '716944';
/* the detail screen shows whichever experiment the scenario opened */
const xpName = (pub)=> pub ? XP_NAME : XP_DRAFT_NAME;
const xpId   = (pub)=> pub ? XP_ID   : XP_DRAFT_ID;
const XP_ID     = '716920';
const XP_STATUS = 'Published';
/* The treatments the experiment assigns. The linked-experiences table names
   only the two that have experiences on them (D_RealTest, C_Dry_...); the
   third is the recipe_B treatment the link flow targets, so the card is the
   one place all three are named. Count + names (user, 2026-09-16). */
const XP_TREATMENT_NAMES = [
  ['D_RealTest','40%'],
  ['C_Dry_SPNewOffer_Copy2','30%'],
  ['B_RealTest_Control','30%'],
];
/* count, then the names with their allocations in outer parens
   (user, 2026-09-16) */
const XP_TREATMENTS = `${XP_TREATMENT_NAMES.length} (${
  XP_TREATMENT_NAMES.map(([n,a])=>`${n} (${a})`).join(', ')})`;
const XP_META = [
  /* row order (user, 2026-09-16): hypothesis reads beside IXP state, and the
     two dates sit together on their own row. */
  ['IXP STATE','RUNNING'],
  ['HYPOTHESIS','—'],
  ['START DATE','09/09/2026'],
  ['END DATE','05/26/2027'],
  ['NO. OF TREATMENTS', XP_TREATMENTS],
  ['HOLDOUT TREATMENT','None'],
];
const XP_AP = 'CG TURBOTAXO Content PostOnboardingExperience';
/* the experiences linked to this experiment. Treatment is what the experiment
   assigns them, so it is a column here and nowhere else in the repo. */
const XP_ROWS = [
  ['ty25_OICMS_716920_REAL_test_DIY_reco_recipe_D','D_RealTest'],
  ['ty25_OICMS_716920_REAL_test_FS_reco_recipe_D','D_RealTest'],
  ['ty25_OICMS_716920_REAL_test_DIWM_reco_recipe_D','D_RealTest'],
  ['ty25_OICMS_716920_DRY_test_DIWM_reco_recipe_C','C_Dry_SPNewOffer_Copy2'],
  ['ty25_OICMS_716920_DRY_test_DIY_reco_recipe_C','C_Dry_SPNewOffer_Copy2'],
  ['ty25_OICMS_716920_DRY_test_FS_reco_recipe_C','C_Dry_SPNewOffer_Copy2'],
].map(([exp,tr])=>({exp, status:'Published', ap:XP_AP, tmt:tr}));
const XP_COLS = [
  {label:'Experience',key:'exp',info:1},
  {label:'Status',key:'status',badge:1},
  {label:'Access point',key:'ap'},
  {label:'Treatment',key:'tmt'},
];
/* TWO levels, never three (user, 2026-09-15). "Experiments" was a made-up
   middle level — the project the search actually created is `XP_PROJECT`, and
   the experiment sits directly under it.
   A FUNCTION, not a const: XP_PROJECT is declared further down this file, so an
   evaluated template literal here would throw at load. */
/* On the SPECIFIC intake the project IS the experiment, so a second level would
   just repeat the name — one level is correct there. The search intake keeps
   two: the project, then the experiment picked out of it. */
/* EXACTLY TWO LEVELS, and the first is always Home (user, 2026-09-15):
   `Home / <project>`. Never three — the experiment does not get its own level,
   because the project is what the user navigated into. */
const XP_CRUMB = (pub=true)=>
  `<span>Home</span> <span class="sep">/</span> <span>${pub?XP_PROJECT:XP_ONE_PROJECT}</span>`;
/* name | status | ID, divided — the identity row */
/* `draft` = the user approved and we are now looking at the DRAFT version of
   the experiment rather than the live one. Status reads plain "Draft" (user,
   2026-09-15 — not "Draft stage"); the live experiment is untouched. */
/* The status on the header is a VERSION PICKER once more than one version
   exists (same pattern as the rollback build's version history). Before the
   draft is created there is only the published version, so it is a plain chip;
   once the draft exists the picker lists BOTH, with the one on screen active.
   `verOpen` drives the menu, and it is opened for the user the moment the draft
   is created so they can see the two versions side by side. */
const XP_AUTHOR = 'Lathiya, Raashi';
/* `live` = the user published it in this flow, so it is Published regardless of
   how it started. Without this the DRAFT scenario stayed on a Draft chip after
   publishing, contradicting its own done message (user, 2026-09-15). */
/* STATUS and VERSION are two separate controls (user, 2026-09-15). The status
   chip always sits in the header; the version picker is its own control beside
   it. Merging them meant the status only existed inside the dropdown. */
const xpStatus = (pub, staged, live)=> badge(live ? XP_STATUS : ((staged||!pub) ? 'Draft' : XP_STATUS));
/* The picker shows the VERSION AND ITS STATUS together (user, 2026-09-15) —
   "v2 Draft" — as well as the standalone status chip in the header. */
const xpVerSelect = (staged, open, pub=true, live=false)=>{
  /* the picker label is the STATUS ONLY — no version number (user, 2026-09-15).
     The versions themselves are listed inside the menu. */
  const label = badge(live ? XP_STATUS : ((staged||!pub) ? 'Draft' : XP_STATUS));
  /* one version so far: the picker is present but inert, so it does not appear
     out of nowhere the moment a second version exists. */
  if(!staged) return `<span class="verselect verselect--off">${label} ${I.chev}</span>`;
  /* An experiment has exactly TWO states, Published and Draft (user, 2026-09-15),
     so this is a state switch, not a version history — no v1/v2 anywhere. */
  const vers = [
    {status:'Draft',   date:'Edited just now', active:true},
    {status:XP_STATUS, date:'09/09/2026',      active:false},
  ];
  const rows = vers.map(x=>`<div class="verRow${x.active?' verRow--active':''}" data-verpick="${x.status}">
      <div class="verRow__top">${badge(x.status)}</div>
      <div class="verRow__date">${x.date}</div>
      <div class="verRow__by"><img src="figma/avatar.png" alt="">by ${XP_AUTHOR}</div>
    </div>`).join('');
  return `<span class="verselect verselect--live" data-vertoggle>${label} ${I.chev}
    <div class="verMenu${open?'':' hidden'}">${rows}</div></span>`;
};
/* Order is TITLE > STATUS > ID (user, 2026-09-15), with the version picker last
   and NO trailing divider after it — a divider separates items, so one after
   the last item separates nothing. */
const xpHead = (pub=true, staged=false, open=false, live=false)=>`<div class="expHead">
      <span class="expHead__name">${xpName(pub)}</span>
      <span class="expHead__div"></span>
      ${xpStatus(pub, staged, live)}
      <span class="expHead__div"></span>
      <span class="expHead__idw">ID:&nbsp; ${xpId(pub)} ${COPY_ICON}</span>
      <span class="expHead__div"></span>
      ${/* The picker is ALWAYS present (user, 2026-09-15) — DISABLED while the
           experiment is published and there is only one state, active once a
           draft exists. Hiding it made the control appear out of nowhere. */''}
      ${xpVerSelect(staged, open, pub, live)}
    </div>`;
/* a draft experiment is not RUNNING, and its linked experiences are
   drafts too — the screen has to agree with the status chip. */
/* IXP STATE is the EXPERIMENT's state in IXP, not the state of the version you
   are looking at (user, 2026-09-15). A published experiment keeps RUNNING while
   you edit a draft of it — that is exactly what the info note promises. Only an
   experiment that was never published reads DRAFT. */
const xpMeta = (pub=true, live=false)=>`<div class="meta">${
  XP_META.map(([k,v])=>`<div><div class="meta__k">${k}</div><div class="meta__v">${
    (k==='IXP STATE' && !pub && !live) ? 'DRAFT' : v}</div></div>`).join('')}</div>`;
const xpToolbar = (by='')=>`<div class="toolbar">
      <div class="search">${I.search}<span>Search</span></div>
      <span class="iconbtn">${I.sliders}</span>
      ${groupByCtl(by)}
    </div>`;

const PC_ROWS = [
  ['ELM9684-IPD-QBPayroll-Banking-MedPS…','4d738ef0-9505-11f1-86ec-a3e65…','v3'],
  ['ELM9684-IPD-QBPayroll-Banking-HighPS…','5a12bc41-9505-11f1-86ec-a3e65…','v4'],
  ['ELM9533-IPD-QBPayroll-Banking-NoPS…','6b23cd52-9505-11f1-86ec-a3e65…','v3'],
  ['ELM9533-IPD-QBPayroll-Banking-AllPS…','7c34de63-9505-11f1-86ec-a3e65…','v4'],
  ['ELM4217-IPD-QBPayroll-Banking-MedPS…','8d45ef74-9505-11f1-86ec-a3e65…','v4'],
  ['ELM4217-IPD-QBPayroll-Banking-HighPS…','9e56f085-9505-11f1-86ec-a3e65…','v3'],
  ['ELM7856-IPD-QBPayroll-Banking-MedPS…','af670196-9505-11f1-86ec-a3e65…','v3'],
  ['ELM7856-IPD-QBPayroll-Banking-NoPS…','b07812a7-9505-11f1-86ec-a3e65…','v4'],
  ['ELM3041-IPD-QBPayroll-Banking-AllPS…','c18923b8-9505-11f1-86ec-a3e65…','v4'],
  ['ELM3041-IPD-QBPayroll-Banking-HighPS…','d29a34c9-9505-11f1-86ec-a3e65…','v3'],
].map(([exp,eid,ver])=>({exp,eid,ver,status:'Published',ap:'Banking -hellobox',tmpl:OLD_TEMPLATE,prio:'13.0',by:'Stroupe, Kristin',mod:'06/30 18:30PST'}));
// Version sits right after Status, per the rollback build's column order
const PC_COLS = [
  {label:'Experience',key:'exp',info:1},{label:'Experience ID',key:'eid'},
  {label:'Status',key:'status',badge:1},{label:'Version',key:'ver'},
  {label:'Access point',key:'ap'},
  {label:'Template',key:'tmpl'},{label:'Priority',key:'prio'},
  {label:'Created by',key:'by'},{label:'Last updated',key:'mod'},
];
/* ONE status column (user, 2026-09-08): a clone that fails validation reads
   Error in Status rather than carrying a second Validation column. The two
   fields the clone actually CHANGED keep the edit highlight, so the list still
   shows what differs from the source (tableHTML reads `editedKey`). */
const PC_COLS_QA = [
  ...PC_COLS.slice(0,4),
  {label:'Access point',key:'ap',editedKey:'apChanged'},
  {label:'Template',key:'tmpl',editedKey:'tmplChanged'},
  ...PC_COLS.slice(6),
];

const PC_PROJECT = 'QB Payroll IPD experiences - Banking hellobox';
const PC_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${PC_PROJECT}</span>`;
// the clone result is a new thing, so it gets its own crumb level under the search
const CLONE_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${PC_PROJECT}</span> <span class="sep">/</span> <span>Cloned experiences</span>`;
/* The full name of the view the clone creates. The object card in the panel only
   has 177px for a label (286px card − padding − icon tile − eye button), so this
   string is CSS-ellipsised there and shows as "Cloned experiences - Ba…". That is
   the same treatment the search card gets, and the page heading below carries the
   full name, so nothing is lost. Do NOT hand-type a "…" into this string: the
   container already ellipsises, and a hand-typed one just moves the cut earlier. */
const CLONE_VIEW_NAME = 'Cloned experiences - Banking hellobox';
/* scenario 4's search is not access point-filtered, so it replays its own ask */
const CL4_SEARCH_CONV = ()=>
  userBubble(CL4_FIND_PROMPT)
  + agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">${CL4_PROJECT}</span>" project for you.</div>`,'')
  + agentMsg(
      disclosure(`Searched and found ${CL4_ROWS.length} experiences`,['Reading your request','Searching QB Payroll IPD experiences','Compiling results'])
      + `<div class="chatBubble">Search results${objectCard('search',CL4_PROJECT)}</div>`);
const PC_SEARCH_CONV = ()=>
  userBubble(FIND_EXP_PROMPT)
  + agentMsg(`<div class="chatBubble">I have created "<span class="chatBubble__name">${PC_PROJECT}</span>" project for you.</div>`,'')
  + agentMsg(
      disclosure(`Searched and found ${PC_ROWS.length} experiences`,['Reading your request','Searching QB Payroll IPD experiences','Compiling results'])
      + `<div class="chatBubble">Search results${objectCard('search','QB Payroll IPD experiences - Banki…')}</div>`);
const PC_REQ = ()=> userBubble(CLONE_PROMPT);
// selection-thread context above a selection-scoped ask (divider + ↳ Selected n)
const SELCTX_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 3v5.5A3.5 3.5 0 0 0 7.5 12H14" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round"/><path d="M10.8 8.4 14.4 12l-3.6 3.6" stroke="#6b6c72" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const selThread = (n)=>`<div class="selCtx">${SELCTX_ICON}<span>Selected ${n} experience${n===1?'':'s'}</span></div>`;

/* ---- Step 1: intent understanding + carry-over, in ONE response ---- */
const pcFtBlk=(label,from,to)=>`<div class="ft-label" style="margin:0">${label}</div><div class="ft" style="margin:0">
    <div class="ft__row"><div class="ft__k">From</div><div class="ft__v">${from}</div></div>
    <div class="ft__row"><div class="ft__k">To</div><div class="ft__v">${to}</div></div></div>`;
const PC_UNDERSTOOD_TABLE = (r)=>
  pcFtBlk('Access point:', OLD_PLACEMENT, NEW_PLACEMENT)
  + pcFtBlk('Template:', OLD_TEMPLATE, NEW_TEMPLATE);
// A access point change can't be applied in place, so it forks a new experience.
// Informational, not a warning: nothing is lost and nothing needs deciding.
const pcInfoNote = ()=>`<div class="infoNote">${INFO_ICON}<span>Changing the access point creates a new experience. The one you selected stays as it is.</span></div>`;

/* ---- Clone step 1: confirm the clone (the ONLY confirm in scenario 1) ----
   NO From/To table and no key/value block here: nothing is being changed, so
   there is nothing to compare. The card just says what will happen in prose.
   The count is already visible in the selection chip and the checked rows, so
   the copy doesn't repeat it. */
// The one consequence the user cannot see on the canvas: the copies are not live.
const cloneInfoNote = ()=>`<div class="infoNote">${INFO_ICON}<span>The copies are created in Draft. To make them live, publish them from Campaign Manager.</span></div>`;
const CLONE_UNDERSTOOD = (n, active)=> agentMsg(
  disclosure('Read your request, checked the experiences',['Reading your request','Checking the selected experiences','Checking the access point'])
  + `<div class="summaryCard"><p class="summaryCard__intro">I'll clone these experiences for you.</p><p class="summaryCard__intro" style="font-weight:400">I'll add "${CLONE_WORD}" to the end of each name so you can tell them apart. Each copy keeps the same access point, template, audience, creative, and experiment settings.</p>${cloneInfoNote()}<p class="summaryCard__q">Does this look right? I'll clone once you approve.</p>${active?replyBtn('Approve','pcLooksGood'):recordedReply('Approve')}</div>`);

/* ============================================================
   SCENARIO 4 messages
   ============================================================ */
/* Step 1: the GROUPING playback. The selection spans access points, so before
   asking anything the agent says what it found and shows the grouping as an
   object on the canvas. The change question rides on the same card, because the
   grouping IS the context for answering it. */
const CL4_GROUPED = (nSel, groups, active, chose)=> agentMsg(
  disclosure('Read your request, checked the experiences',['Reading your request','Checking the selected experiences','Checking their access points'])
  + `<div class="summaryCard"><p class="summaryCard__intro">You've selected ${nSel} experience${nSel===1?'':'s'} across ${groups.length} access point${groups.length===1?'':'s'}.</p><p class="summaryCard__q">Do you want to change the access point while I clone them, or clone them as they are?</p>${active
      ? `<div class="replyRow">${replyBtn('Change the access points','cl4Change')}${replyBtn('Clone as they are','cl4Direct')}</div>`
      : recordedReply(chose || 'Change the access points')}</div>`);
/* 4b step: the CONFIRMATION that stands in for a playback (user, 2026-09-09).
   The selection spans access points and no destination has been named yet, so
   there is nothing to play back as From/To. The card says what it knows —
   the mix, and that destinations come group by group — and carries the Draft
   note that scenario 3 puts on its intent card. */
const CL4_CONFIRM = (nSel, groups, active)=> agentMsg(
  disclosure('Checked the access points',['Reading your choice','Checking each group','Preparing the changes'])
  + `<div class="summaryCard"><p class="summaryCard__intro">I'll take you through one access point at a time, so you can tell me what each one changes to.</p>${cloneInfoNote()}<p class="summaryCard__q">Does this look right?</p>${active?replyBtn('Proceed','cl4ApproveConfirm'):recordedReply('Proceed')}</div>`);
/* 4b step: NAMING, settled on its own before any copy exists — same position
   in the sequence as scenario 3's naming card. */
const CL4_NAMING = (active, direct=false)=> agentMsg(
  `<div class="chatBubble">I'll add "${CLONE_WORD}" to the end of each name so you can tell the copies apart.${direct?cloneInfoNote():''}<div class="bubble-q">Shall I go ahead?</div>${active?replyBtn('Proceed', direct?'cl4ApproveNamingDirect':'cl4ApproveNaming'):recordedReply('Proceed')}</div>`);
/* 4b PLAN: one task per access-point group, then a final review of everything.
   Named from the groups, so it scales with the selection. */
const cl4TaskLabels = (G)=>[...G.map(g=>`Clone and review ${g.ap}`),'Review all cloned experiences'];
function cl4PlanRows(G, done=0, loading=-1){
  return cl4TaskLabels(G).map((w,i)=>{
    const marker = i<done
      ? `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`
      : i===loading
        ? `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
        : `<span class="planNum">${i+1}</span>`;
    return `<div class="planTable__row">${marker}<span>${w}</span></div>`;
  }).join('');
}
const CL4_PLAN = (G, done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I will work through the access points in this order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${cl4PlanRows(G,done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you approve.</p>${active?replyBtn('Approve','cl4ApprovePlan'):recordedReply('Approve')}</div>`);

/* 4b step: the agent starts on a group and asks where it should go. */
const CL4_ASK_GROUP = (g, groups)=>{
  const grp = groups[g];
  const lead = g===0 ? 'Starting with the first group' : 'Starting on the next group';
  return agentMsg(`<div class="chatBubble">${lead}: <b>${grp.ap}</b> (${grp.idx.length} experience${grp.idx.length===1?'':'s'}).<div class="bubble-q">What is the new access point for these experiences?</div></div>`);
};
/* 4b step: playback for ONE group, before it is cloned (user, 2026-09-11,
   reversing the 2026-09-08 "no playback inside a task" decision — for 4b only).
   The group's access point is the ONE thing changing, so the card is a single
   From/To and an Approve. */
const CL4_GROUP_INTENT = (g, groups, active)=>{
  const grp = groups[g], k = grp.idx.length;
  return agentMsg(
    disclosure('Mapped the change',['Reading your request','Checking the new access point','Preparing the copies'])
    + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood changes for this group.</p>${pcFtBlk('Access point:', grp.ap, cl4Dest(g))}<p class="summaryCard__q">Does this look right? I'll clone ${k===1?'it':`these ${k}`} once you approve.</p>${active?replyBtn('Approve','cl4ApproveGroupIntent'):recordedReply('Approve')}</div>`);
};
/* 4b step: the group is cloned and every clone in it is flagged. */
const CL4_GROUP_DONE = (g, groups, active)=>{
  const grp = groups[g], k = grp.idx.length, last = g===groups.length-1;
  return agentMsg(`<div class="chatBubble">Cloned ${k} experience${k===1?'':'s'} onto ${cl4Dest(g)}, the creative carried over with no issues.${objectCard('edit',`Cloned experiences - ${cl4Dest(g)}`)}<div class="bubble-q">Does this look ok?${last?'' : " I'll move on to the next access point once you approve."}</div>${active?replyBtn('Approve','cl4ApproveGroup'):recordedReply('Approve')}</div>`);
};
/* 4b final task: everything that was cloned, across every access point. */
const CL4_ALL_REVIEW = (nSel, G)=> agentMsg(
  disclosure(`Cloned ${nSel} experience${nSel===1?'':'s'}`,['Collecting the clones','Checking the access points','Compiling the list'])
  + `<div class="chatBubble">Here are all ${nSel} clones across ${G.length} access point${G.length===1?'':'s'}. ${nSel===1?'The copy is':'The copies are'} in Draft.${objectCard('search',`Cloned experiences - ${CL4_PROJECT}`)}<div class="bubble-q">If you want to publish ${nSel===1?'it':'them'}, go to Campaign Manager.</div><div class="link-cm">Go to Campaign Manager</div></div>`);
/* 4a needs NO second confirmation: the "Clone as they are" pill on the choice
   card IS the approval, so it clones straight away. */
const CL4_DONE = (nSel, groups, changed)=> agentMsg(
  disclosure(`Cloned ${nSel} experience${nSel===1?'':'s'}`,['Grouping the experiences','Copying the settings','Creating the clones'])
  + `<div class="chatBubble">I've cloned ${nSel} experience${nSel===1?'':'s'} across ${groups.length} access point${groups.length===1?'':'s'}. ${nSel===1?'The copy is':'The copies are'} in Draft.${objectCard('edit',`Cloned experiences - ${CL4_PROJECT}`)}<div class="bubble-q">To make ${nSel===1?'it':'them'} live, publish from Campaign Manager.</div><div class="link-cm">Go to Campaign Manager</div></div>`);

/* ============================================================
   SCENARIO 3 messages
   ============================================================ */
/* Step 1: the CHOICE. The plain clone ask does not say whether anything
   changes, so the AI offers both ways forward as two pills. It also states the
   naming up front, so the user knows what the copies will be called before
   picking either path. */
const CL3_CHOICE = (active, chose)=> agentMsg(
  disclosure('Read your request, checked the experiences',['Reading your request','Checking the selected experiences','Checking their access points'])
  + `<div class="summaryCard"><p class="summaryCard__q">Do you want to change the access point while I clone them, or clone them as they are?</p>${active
      ? `<div class="replyRow">${replyBtn('Change the access point','cl3Change')}${replyBtn('Clone as they are','cl3Direct')}</div>`
      : recordedReply(chose || 'Change the access point')}</div>`);
/* Step 2: which access point? The user answers with BOTH a access point and a
   template, which is what makes the creative break later. */
const CL3_ASK_TARGET = ()=> agentMsg(`<div class="chatBubble">Which access point do you want the copies on? Tell me the access point and the template to use.</div>`);
/* Step 3: what the AI understood, before the plan. */
const CL3_UNDERSTOOD = (active)=> agentMsg(
  disclosure('Mapped the change',['Reading your request','Checking the new access point','Checking the new template'])
  + `<div class="summaryCard"><p class="summaryCard__intro">Here's what I understood changes.</p>${
      pcFtBlk('Access point:', OLD_PLACEMENT, CL3_NEW_PLACEMENT)
    + pcFtBlk('Template:', OLD_TEMPLATE, CL3_NEW_TEMPLATE)}<p class="summaryCard__intro" style="font-weight:400">The new template uses different creative fields, so I'll flag anything that doesn't carry over and you can fix it from there.</p>${cloneInfoNote()}<p class="summaryCard__q">Does this look right?</p>${active?replyBtn('Approve','cl3ApproveIntent'):recordedReply('Approve')}</div>`);
/* Step 3b: NAMING, its own confirmation step (user, 2026-09-09). The naming
   used to ride on the choice card, which meant the user agreed to it before
   they had even said what was changing. It now comes AFTER the intent is
   approved, as the last thing settled before any clone exists. */
const CL3_NAMING = (active, direct=false)=> agentMsg(
  `<div class="chatBubble">I'll add "${CLONE_WORD}" to the end of each name so you can tell the copies apart.${direct?cloneInfoNote():''}<div class="bubble-q">Shall I go ahead?</div>${active?replyBtn('Proceed', direct?'cl3ApproveNamingDirect':'cl3ApproveNaming'):recordedReply('Proceed')}</div>`);
/* Step 4: the plan. Task 1 is the PLACEMENT review (one screen, not per
   experience), then the clones, then the finished set. */
/* NO PLAN and NO single-access point review in this flow (user, 2026-09-08):
   each experience carries its OWN copy, so reviewing one access point screen
   would misrepresent them. The agent just clones, and every clone lands with a
   validation error the user resolves experience by experience. */
/* Task 2: the clones, every one carrying the SAME validation error — the
   template change is what breaks them, so it breaks all of them equally. */
/* Between the naming card and the clones: the field the new template needs,
   played back as a readback so the user knows what is coming before anything
   is created. Same shape as the placement-change build's pc2FieldCard. */
const CL3_FIELDS_CARD = (n, active)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">The new template needs content this one doesn't carry over.</p><div class="ft-label">Missing fields:</div><div class="ft fldTbl"><div class="ft__row"><div class="ft__k">1.</div><div class="ft__v">${CL3_ERR_FIELD}</div></div></div><p class="summaryCard__intro" style="font-weight:400">I'll create the ${n===1?'clone':`${n} clones`} and flag this field, so you can fill it in as soon as you have the copy.</p>${dlLink()}<p class="summaryCard__q">Shall I go ahead and create the ${n===1?'clone':'clones'}?</p>${active?replyBtn('Proceed','cl3ApproveFields'):recordedReply('Proceed')}</div>`);
const CL3_CLONES_ERR = (n)=> agentMsg(`<div class="chatBubble">Created ${n} clone${n===1?'':'s'} on ${CL3_NEW_PLACEMENT}, <span class="issueCount">found ${n} issue${n===1?'':'s'}.</span>${objectCard('search',CL3_VIEW_NAME)}<div class="msgErr">${ERR_ICON}<span>${CL3_ERR_FIELD} is missing on ${n===1?'the clone':`all ${n}`}. The new template needs it.</span></div><div class="bubble-q">Send me the copy for each one and I'll update them.</div></div>`);
/* every clone verified. A new object holds the finished set; publishing is the
   user's call, so the message points at Campaign Manager rather than doing it. */
const CL3_VERIFIED = (n)=> agentMsg(
  disclosure(`Updated ${n} clone${n===1?'':'s'}`,['Reading your copy','Applying it to each clone','Re-checking the creatives'])
  + `<div class="chatBubble">I've applied the copy. All ${n} clone${n===1?'':'s'} ${n===1?'is':'are'} verified.${objectCard('edit',CL3_VIEW_NAME)}<div class="bubble-q">If you want to publish ${n===1?'it':'them'}, go to Campaign Manager.</div><div class="link-cm">Go to Campaign Manager</div></div>`);
/* Task 2b: the user supplies copy → one clone is fixed, the rest still flagged */
const CL3_CLONE_FIXED = (name, remaining, active)=> agentMsg(`<div class="chatBubble">I've applied that copy to ${name}.${remaining?` <span class="issueCount">${remaining} clone${remaining===1?'':'s'} still need${remaining===1?'s':''} copy.</span>`:' Every clone has its copy now.'}${objectCard('edit',name)}<div class="bubble-q">${remaining?'Open another clone to add its copy.':'Does this look ok?'}</div>${(!remaining&&active)?replyBtn('Approve','cl3ApproveAll'):''}</div>`);
/* Task 3: the finished set, with the summary offered one more time. */
const CL3_ALL = (n, active)=> agentMsg(`<div class="chatBubble">Here are all ${n} clones on ${CL3_NEW_PLACEMENT}.${objectCard('search',CL3_VIEW_NAME)}<div class="bubble-q">Download the change summary to share the outstanding copy with your marketing team.</div>${dlLink()}<div class="bubble-q" style="margin-top:12px">Does this look ok?</div>${active?replyBtn('Approve','cl3ApproveAll'):recordedReply('Approve')}</div>`);
const CL3_DONE = (n)=> agentMsg(
  disclosure(`Cloned ${n} experience${n===1?'':'s'}`,['Updating the access point','Applying the new template','Creating the clones'])
  + `<div class="chatBubble">I've cloned ${n} experience${n===1?'':'s'} onto ${CL3_NEW_PLACEMENT}. ${n===1?'The copy is':'The copies are'} in Draft. To make ${n===1?'it':'them'} live, add the missing copy and publish from Campaign Manager.<div class="link-cm">Go to Campaign Manager</div></div>`);

/* ============================================================
   SCENARIO 2 messages
   ============================================================ */
/* Step 1: the AI reads the combined ask (clone + change access point) and offers
   the naming choice. Two ways forward, so this card carries a pill AND invites
   a typed reply — the user can keep the prefix or send their own name. */
const CL2_NAMING = (active)=> agentMsg(
  disclosure('Read your request, checked the experiences',['Reading your request','Checking the new access point','Checking the selected experiences'])
  + `<div class="summaryCard"><p class="summaryCard__intro">I'll clone these experiences and move the copies to ${CL2_NEW_PLACEMENT}.</p><p class="summaryCard__intro" style="font-weight:400">I'll add "${CLONE_WORD}" to the end of each name, or send me a name and I'll use that instead. The template stays the same, so the creative carries over as it is.</p>${cloneInfoNote()}<p class="summaryCard__q">Does this look right? I'll clone once you approve.</p>${active?replyBtn('Add Clone to the name','cl2KeepPrefix'):recordedReply('Add Clone to the name')}</div>`);

/* Step 2: the plan. n+1 tasks — one review per clone, then all of them
   together. Built from the SELECTION, so it scales: 3 selected → 4 tasks.
   `smart` collapses the middle rows when the list would get long, so the
   panel stays readable at 6+ selections (2 shown, then "Review experience 3-5",
   then the last one) while the per-task states still walk every experience. */
const cl2TaskLabels = (n)=>{
  const per = [...Array(n)].map((_,i)=>`Review experience ${i+1}`);
  return [...per, 'Review all newly created clones'];
};
// the plan TABLE may collapse the middle; the tracker always names the real task
const cl2PlanRowsFor = (n)=>{
  const labels = cl2TaskLabels(n);
  if(n<=4) return labels.map((l,i)=>({label:l, idx:i}));
  // long selections: first 2, a collapsed span, the last, then the final review
  return [
    {label:labels[0], idx:0},
    {label:labels[1], idx:1},
    {label:`Review experiences 3-${n}`, idx:2, span:[2,n-1]},
    {label:labels[n-1], idx:n-1},
    {label:labels[n], idx:n},
  ];
};
function cl2PlanRows(n, doneCount=0, loadingIndex=-1){
  return cl2PlanRowsFor(n).map(r=>{
    // a collapsed span is done only once every task inside it is done
    const spanEnd = r.span ? r.span[1] : r.idx;
    const isDone = doneCount > spanEnd;
    const isLoading = r.span ? (loadingIndex>=r.span[0] && loadingIndex<=r.span[1]) : (loadingIndex===r.idx);
    const marker = isDone
      ? `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`
      : isLoading
        ? `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
        : `<span class="planNum">${r.idx+1}</span>`;
    return `<div class="planTable__row">${marker}<span>${r.label}</span></div>`;
  }).join('');
}
const CL2_PLAN = (n, done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${cl2PlanRows(n,done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you approve.</p>${active?replyBtn('Approve','cl2ApprovePlan'):recordedReply('Approve')}</div>`);

/* Per-clone review messages. Task 1's carried-over body copy runs over the new
   access point's limit, so its message reports the error and offers NO approve
   pill — the copy has to be fixed first (same rule as the access point flow). */
const CL2_REVIEW_ERR = (name)=> agentMsg(`<div class="chatBubble">Created ${name} on ${CL2_NEW_PLACEMENT}, <span class="issueCount">found 1 issue.</span>${objectCard('edit',name)}<div class="msgErr">${ERR_ICON}<span>${BODY_ERR}</span></div><div class="bubble-q">Send me body copy within ${BODY_LIMIT} characters and I'll update it.</div></div>`);
const CL2_REVIEW_FIXED = (name, active)=> agentMsg(`<div class="chatBubble">I've updated the body copy. It's now ${BODY_FIXED.length} of ${BODY_LIMIT} characters.${objectCard('edit',name)}<div class="bubble-q">Does this look ok? I'll then move to the next experience.</div>${active?replyBtn('Approve','cl2ApproveTask'):recordedReply('Approve')}</div>`);
// tasks 2..n pass clean
const CL2_REVIEW_OK = (name, i, n, active)=> agentMsg(`<div class="chatBubble">Created ${name} on ${CL2_NEW_PLACEMENT}, the creative carried over with no issues.${objectCard('edit',name)}<div class="bubble-q">Does this look ok?${i<n-1?" I'll then move to the next experience.":''}</div>${active?replyBtn('Approve','cl2ApproveTask'):recordedReply('Approve')}</div>`);
// final task: all the clones together
const CL2_REVIEW_ALL = (n, active)=> agentMsg(`<div class="chatBubble">Here are all ${n} clones on ${CL2_NEW_PLACEMENT}.${objectCard('search',CL2_VIEW_NAME)}<div class="bubble-q">Does this look ok?</div>${active?replyBtn('Approve','cl2ApproveAll'):recordedReply('Approve')}</div>`);
const CL2_DONE = (n)=> agentMsg(
  disclosure(`Cloned ${n} experience${n===1?'':'s'}`,['Copying the settings','Moving the copies to the new access point','Creating the copies'])
  + `<div class="chatBubble">I've cloned ${n} experience${n===1?'':'s'} onto ${CL2_NEW_PLACEMENT}. ${n===1?'The copy is':'The copies are'} in Draft. To make ${n===1?'it':'them'} live, publish ${n===1?'it':'them'} from Campaign Manager.<div class="link-cm">Go to Campaign Manager</div></div>`);

/* ---- Clone done: the copies in their own view, with a link out to publish ---- */
const CLONE_DONE = (n)=> agentMsg(
  disclosure(`Cloned ${n} experience${n===1?'':'s'}`,['Reading the selected experiences','Copying the settings','Creating the copies'])
  + `<div class="chatBubble">Here ${n===1?'is the copy':'are the copies'}, ${n===1?'it keeps':'they keep'} the same settings as the experience${n===1?'':'s'} ${n===1?'it came':'they came'} from.${objectCard('search',CLONE_VIEW_NAME)}<div class="bubble-q">${n===1?'The copy is':'The copies are'} in Draft. To make ${n===1?'it':'them'} live, publish ${n===1?'it':'them'} from Campaign Manager.</div><div class="link-cm">Go to Campaign Manager</div></div>`);

/* ---- Step 1b: confirm the name of the new experience ----
   Prefilled with the AI's proposal (no typing animation — it arrives already
   filled), editable if the user wants their own. */
function pcNameCard(name, active){
  const v = name===undefined ? PC_PROPOSED_NAME : name;
  const foot = active
    ? `<button class="cardReplyBtn" id="pcNameProceed"${v.trim()?'':' disabled style="opacity:.45;cursor:default"'}>Proceed</button>`
    : recordedReply('Proceed');
  return agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">The new experience needs a name. Here's my suggestion based on the change, edit it if you'd like something else.</p><div class="fieldSet"><div class="fieldRow${active?'':' fieldRow--done'}">
      <div class="fieldRow__k">Experience name</div>
      <div class="fieldRow__in" data-ph="Enter the experience name"${active?' contenteditable="true"':''} data-namefield>${v}</div>
    </div></div>${foot}</div>`);
}

/* ---- Step 2: the extra fields the new access point adds ---- */
const PC_FIELDS = [
  {key:'subheader', label:'Subheader', ph:'Enter the subheader'},
  {key:'footnote',  label:'Footnote',  ph:'Enter the footnote'},
];
// what autofills when the user starts typing in a field (guided demo)
const PC_FIELD_VALUES = {
  subheader: 'Save more on payroll this quarter',
  footnote:  'Offer valid for new paid subscriptions only.',
};
// vals = {image, alt}; active=true → editable + Proceed pill, else recorded
function pcFieldCard(vals={}, active){
  const rows = PC_FIELDS.map(f=>{
    const v = vals[f.key]||'';
    const cls = v ? '' : ' is-empty';
    return `<div class="fieldRow${active?'':' fieldRow--done'}">
      <div class="fieldRow__k">${f.label}</div>
      <div class="fieldRow__in${cls}" data-ph="${f.ph}"${active?' contenteditable="true"':''} data-field="${f.key}">${v}</div>
    </div>`;
  }).join('');
  const ready = !!(vals.image && vals.alt);
  const foot = active
    ? `<button class="cardReplyBtn" id="pcProceed"${ready?'':' disabled style="opacity:.45;cursor:default"'}>Proceed</button>`
    : recordedReply('Proceed');
  const count = PC_FIELDS.length===2 ? 'two' : String(PC_FIELDS.length);
  return agentMsg(`<div class="summaryCard"><p class="summaryCard__intro">The new template needs ${count} more fields. Fill these in and I'll put together a plan.</p><div class="fieldSet">${rows}</div>${foot}</div>`);
}

/* ---- Step 3: the plan (2 reviews) ---- */
const PC_PLAN_TASKS = [
  'Update access point and template',
  'Review the newly created experience',
];
function pcPlanRows(doneCount=0, loadingIndex=-1){
  const marker=(i)=>{
    if(i<doneCount) return `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`;
    if(i===loadingIndex) return `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`;
    return `<span class="planNum">${i+1}</span>`;
  };
  return PC_PLAN_TASKS.map((w,i)=>`<div class="planTable__row">${marker(i)}<span>${w}</span></div>`).join('');
}
const PC_PLAN = (done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I will make the changes in the following order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${pcPlanRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you confirm.</p>${active?replyBtn('Looks good','pcApprovePlan'):recordedReply('Looks good')}</div>`);

/* ---- Task 1: updated access point + template. The carried-over body copy runs
   over the text template's limit, so this message reports the error (Figma
   8327:12515) and its Approve pill is dead until the copy is fixed. ---- */
const PC_PLACEMENT = ()=> agentMsg(`<div class="chatBubble">Updated the access point to Batch save - hellobox and the template to helloboxText, <span class="issueCount">found 1 issue.</span>${objectCard('thumbnail','Placement - Batch save hellobox')}<div class="msgErr">${ERR_ICON}<span>${BODY_ERR}</span></div><div class="bubble-q">Send me body copy within ${BODY_LIMIT} characters and I'll update it.</div></div>`);
/* ---- Task 1b: the user supplies shorter body copy → this replaces the error ---- */
const PC_BODYFIX = (active)=> agentMsg(`<div class="chatBubble">I've updated the body copy. It's now ${BODY_FIXED.length} of ${BODY_LIMIT} characters.${objectCard('thumbnail','Placement - Batch save hellobox')}<div class="bubble-q">Does this look ok? I'll then proceed to task 2.</div>${active?replyBtn('Looks good','pcApproveBodyFix'):recordedReply('Looks good')}</div>`);
/* ---- Task 2: the newly created experience ---- */
const PC_EXPERIENCE = (active)=> agentMsg(`<div class="chatBubble">Here's the new experience with the values carried over and the new fields applied.${objectCard('edit','ELM9684-IPD-QBPayroll-BatchSaveHel…')}<div class="bubble-q">Does this look ok?</div>${active?replyBtn('Approve','pcApproveExp'):recordedReply('Approve')}</div>`);
const PC_DONE = ()=> agentMsg(
  disclosure('Applied the access point change',['Updated the access point and template','Carried over the creative values','Created the new experience'])
  + `<div class="chatBubble">I've applied the access point change. The new experience is in Draft. To make it live, publish it from Campaign Manager.<div class="link-cm">Go to Campaign Manager</div></div>`);

const PC_NEW_EID  = 'e3ab45da-9505-11f1-86ec-a3e651c6bc02';


/* ---- Scene: experience search results + access point-change conversation ----
   state: phase (intake) | loading | selected[] | typed | opening
          pc: 'understood' | 'fields' | 'planning' | 'plan' | 'placement'
              | 'building' | 'experience' | 'done'
          fields: {image, alt} */
/* ============================================================
   UNLINK EXPERIENCE — the diagram's second flow.
   Find experiment -> see details -> is the experiment PUBLISHED?
     YES: prompt to unlink -> playback (1. create staging 2. unlink
          experiences) -> user confirmation -> unlink
     NO:  select experiences -> prompt to unlink -> unlink   (no staging:
          nothing is live, so there is no version to protect)
   The published path is the one built first; `pub:false` drives the other.
   ============================================================ */
const UL_PROMPT = 'Unlink these experiences from this experiment.';
const UL_SEL = [3,4,5];              // the three DRY_test experiences
const ulNames = (sel)=> sel.map(i=>XP_ROWS[i] && XP_ROWS[i].exp).filter(Boolean);
/* the AI reads the ask and plays back what it will do. On a PUBLISHED
   experiment the work has two parts, and staging is the reason why: the live
   experiment is not edited, a staged copy is. */
/* The staging rule sits in the purple info note, not in body copy (user,
   2026-09-15). It answers the question staging raises — what happens to the
   live experiment meanwhile. */
const ulInfoNote = (pub)=>`<div class="infoNote">${INFO_ICON}<span>${
  pub ? `${XP_NAME} is published, so I'll create a draft and make the changes there. The changes go live when you publish the draft.`
      : `${XP_DRAFT_NAME} is a draft, so I'll apply the change directly. It goes live when you publish the experiment.`}</span></div>`;
/* Step 1: the INTENT, played back before any plan (user, 2026-09-15). It states
   the scope plainly — how many of how many, and from what — rather than a
   From/To on a count, which said nothing about which experiences were going. */
const UL_INTENT = (n, pub, active)=> agentMsg(
  disclosure('Read your request, checked the experiment',['Reading your request','Checking the experiment','Checking the linked experiences'])
  /* The note is only on the PUBLISHED path (user, 2026-09-15). There it explains
     something non-obvious — a draft copy is made and the live experiment keeps
     running. On a draft experiment it would only restate the default, which the
     status chip already shows. */
  + `<div class="summaryCard"><p class="summaryCard__intro">${n} experience${n===1?'':'s'} will be unlinked from ${xpName(pub)}.</p>${
      pub ? ulInfoNote(pub) : ''
    }${pub
      /* PUBLISHED: a draft has to be created first, so a plan is worth making. */
      ? `<p class="summaryCard__q">If this looks okay, I'll proceed to create a plan for you.</p>${active?replyBtn('Proceed','ulApproveIntent'):recordedReply('Proceed')}`
      /* DRAFT: nothing to stage, so there is no plan — this card IS the
         confirmation and approving it does the unlink (user, 2026-09-15). */
      : `<p class="summaryCard__q">Does this look right? I'll unlink ${n===1?'it':'them'} once you approve.</p>${active?replyBtn('Approve','ulApprove'):recordedReply('Approve')}`
    }</div>`);
/* Step 2: the PLAN. Only the published path has one — staging is a real second
   task; on a draft the unlink is the whole job. */
const UL_PLAYBACK = (n, pub, active)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I'll unlink ${n===1?'this experience':`these ${n} experiences`} from ${XP_NAME}.</p>${
      pub
      ? `<div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>
           <div class="planTable__row"><span class="planNum">1</span><span>Create a draft of the experiment</span></div>
           <div class="planTable__row"><span class="planNum">2</span><span>Unlink ${n===1?'the experience':`the ${n} experiences`} from the draft</span></div>
         </div>`
      : ''
    }<p class="summaryCard__q">Does this look right? I'll get started once you approve.</p>${active?replyBtn('Approve','ulApprovePlan'):recordedReply('Approve')}</div>`);
/* Step 3 (published only): the DRAFT of the experiment. Nothing has changed
   yet — it is the same view with everything in Draft — so this is the moment to
   confirm before the unlink is made. */
const UL_STAGED = (n, active)=> agentMsg(
  disclosure('Created the draft',['Creating the draft','Copying the linked experiences','Preparing the change'])
  + `<div class="chatBubble">I've created a draft of ${XP_NAME}.${objectCard('edit',`${XP_NAME} (draft)`)}<div class="bubble-q">Approve and I'll unlink the ${n} experience${n===1?'':'s'} from it.</div>${active?replyBtn('Approve','ulApprove'):recordedReply('Approve')}</div>`);
/* done: the draft with those experiences gone. Everything stays in Draft —
   publishing is Campaign Manager's job, so the message points there. */
const UL_DONE = (n, pub, active)=> agentMsg(
  disclosure(`Unlinked ${n} experience${n===1?'':'s'}`,['Applying the change','Unlinking the experiences','Refreshing the list'])
  /* on the PUBLISHED path the change lives on a draft copy, so the message and
     the object card name that draft; on the DRAFT path the experiment itself is
     the draft, so neither should say "the draft" as if it were separate. */
  + `<div class="chatBubble">I've unlinked ${n===1?'the experience':`the ${n} experiences`} from ${xpName(pub)}. ${pub?'The draft':'It'} now has ${XP_ROWS.length-n} linked experience${XP_ROWS.length-n===1?'':'s'}.${
      objectCard('edit', pub?`${XP_NAME} (draft)`:XP_DRAFT_NAME)}<div class="bubble-q">I can publish the experiment for you, or you can do it from Campaign Manager.</div>${pub?`<div class="infoNote">${INFO_ICON}<span>Publishing this draft will replace the version that's live now.</span></div>`:''}${active?replyBtn('Publish','ulPublish'):recordedReply('Publish')}<div class="link-cm">Go to Campaign Manager</div></div>`);
/* published: the draft is live, so the experiment is back to Published with the
   unlinked experiences gone for good. */
const UL_PUBLISHED = (n, pub=true)=> agentMsg(
  disclosure('Published the experiment',['Publishing the draft','Applying the change','Refreshing the list'])
  + `<div class="chatBubble">${xpName(pub)} is published with ${XP_ROWS.length-n} linked experience${XP_ROWS.length-n===1?'':'s'}. The ${n===1?'experience is':`${n} experiences are`} no longer part of it.${
      objectCard('megaphone', xpName(pub))}<div class="link-cm">View in Campaign Manager</div></div>`);

/* The journey starts where the diagram starts: "Find experiment". The user
   types a find prompt, Marketing Studio creates a project, searches, and lands
   on the RESULTS list; opening a row is what reaches the detail screen. Without
   this the detail screen appeared with an empty conversation panel and no
   history (user, 2026-09-15). */
/* TWO INTAKE SHAPES, one per scenario (user, 2026-09-15) — see the
   `ms-prototype-intake` skill:
     ulPub   generic prompt  -> search -> RESULTS TABLE -> pick one
     ulDraft specific prompt -> fetch  -> that experiment DIRECTLY, no table */
const XP_FIND_PROMPT = 'Find the ty25 Catchall experiments.';
const XP_FIND_ONE_PROMPT = `Show me the ${XP_DRAFT_NAME} experiment.`;
/* the project is named from the PROMPT: "Find the ty25 Catchall experiments."
   -> "ty25 Catchall experiments" (user, 2026-09-15). Dropping "Catchall" lost
   the word that actually narrows the search. */
const XP_PROJECT = 'ty25 Catchall experiments';
/* the specific intake asked for ONE experiment, so its project is named for
   that experiment — same rule, applied to that prompt. */
const XP_ONE_PROJECT = 'ty25_Catchall_PLU_holdback';
const XP_SEARCH_CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${XP_PROJECT}</span>`;
/* the results list: the experiment the user asked for, plus near matches, so
   the search reads as a search rather than a single pre-picked answer. */
const XP_LIST = [
  {exp:XP_NAME, status:'Published', eid:XP_ID, ixp:'RUNNING', linked:'6'},
  {exp:'ty25_Catchall_SSG', status:'Published', eid:'716931', ixp:'RUNNING', linked:'4'},
  {exp:'ty25_Catchall_PLU_holdback', status:'Draft', eid:'716944', ixp:'DRAFT', linked:'2'},
];
const XP_LIST_COLS = [
  {label:'Experiment',key:'exp',info:1},
  {label:'Status',key:'status',badge:1},
  {label:'Experiment ID',key:'eid'},
  {label:'IXP state',key:'ixp'},
  {label:'Linked experiences',key:'linked'},
];
const XP_CREATED_FOR = (proj)=>`<div class="chatBubble">I have created "<span class="chatBubble__name">${proj}</span>" project for you.</div>`;
const XP_CREATED = XP_CREATED_FOR(XP_PROJECT);
/* the SPECIFIC intake's finished transcript: no "search results" object, because
   nothing was searched — the experiment was fetched by name. */
const XP_FETCH_CONV = ()=>
  userBubble(XP_FIND_ONE_PROMPT)
  + agentMsg(XP_CREATED_FOR(XP_ONE_PROJECT),'')
  + agentMsg(
      disclosure('Fetched the experiment',['Reading your request','Fetching the experiment','Compiling results'])
      + `<div class="chatBubble">Here's the experiment.${objectCard('search',XP_DRAFT_NAME)}</div>`);
const XP_SEARCH_CONV = ()=>
  userBubble(XP_FIND_PROMPT)
  + agentMsg(XP_CREATED,'')
  + agentMsg(
      disclosure(`Searched and found ${XP_LIST.length} experiments`,['Reading your request','Searching experiments','Compiling results'])
      + `<div class="chatBubble">Search results${objectCard('search',XP_PROJECT)}</div>`);

/* ---- Scene: experiment SEARCH RESULTS. Clicking a row opens the detail. ---- */
scenes.xpSearch = (state={})=>{
  const phase = state.phase, loading = state.loading;
  const created = `<div class="chatBubble">I have created "<span class="chatBubble__name">${XP_PROJECT}</span>" project for you.</div>`;
  /* The intake is a CENTERED single-column conversation, exactly like every
     other build (pcSearch / searchMultiple): no canvas, no two-pane layout
     until the search resolves. Reuse the shared phases rather than inventing a
     new intake (user, 2026-09-15). */
  if(phase==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  if(phase==='msg-prompt' || phase==='msg-created' || phase==='msg-search'){
    let centeredBody = userBubble(XP_FIND_PROMPT);
    if(phase==='msg-created' || phase==='msg-search') centeredBody += agentMsg(created,'');
    if(phase==='msg-search') centeredBody += agentLoader('Searching experiments', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar(XP_SEARCH_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }
  const table = loading
    ? skeletonTable(XP_LIST_COLS,true)
    : tableHTML(XP_LIST_COLS, XP_LIST, {drillrow:true});
  return `<div class="content">${topbar(XP_SEARCH_CRUMB)}<div class="scroll"><div class="pad">
      <h2 class="page-h">${XP_PROJECT}</h2>
      ${xpToolbar()}
      ${table}
    </div></div></div>` + aiPanel({body:XP_SEARCH_CONV(), opening:state.opening});
};

/* ============================================================
   LINK AN EXPERIENCE TO AN EXPERIMENT  (diagram flow 1)
   Built branch: the user HAS the experience ID, and the experiment is
   PUBLISHED — so a draft is created and the link is made there.
     find experiment -> details -> prompt "Link <id> to treatment X"
     -> published? YES -> playback (create draft, draft all linked, link new)
     -> user confirmation -> link -> ready to go live? -> publish
   ============================================================ */
const LK_EID   = '6b23cd52-9505-11f1-86ec-a3e651c6bc02';
const LK_EXP   = 'ty25_OICMS_716920_REAL_test_FS_reco_recipe_B';
const LK_TMT   = 'B_Dry_SPNewOffer_Copy1';
const LK_PROMPT = `Link ${LK_EID} experience to treatment ${LK_TMT} for this experiment.`;
/* the experience being linked in, as a row for the experiment's table */
const LK_ROW = {exp:LK_EXP, status:'Draft', ap:XP_AP, tmt:LK_TMT};
/* Step 1: the PLAYBACK — the diagram's three items. Not a plan table: the
   diagram calls this a playback widget, and our convention for that is the
   intent card (same as the unlink flow). */
const LK_INTENT = (active, pub=true)=> agentMsg(
  disclosure('Read your request, checked the experiment',['Reading your request','Checking the experience','Checking the experiment'])
  /* NO From/To here (user, 2026-09-15): the experience was not linked to any
     experiment before, so nothing is changing FROM something — it is being
     added. A From/To is the MOVE flow's pattern and does not belong here. */
  + `<div class="summaryCard"><p class="summaryCard__intro">This experience will be linked to ${xpName(pub)} on treatment ${LK_TMT}.</p>${pub
      /* PUBLISHED: a draft has to be created first, so a plan is worth making. */
      ? `<div class="infoNote">${INFO_ICON}<span>${XP_NAME} is published, so I'll create a draft and link it there. The change goes live when you publish the draft.</span></div><p class="summaryCard__q">If this looks okay, I'll proceed to create a plan for you.</p>${active?replyBtn('Proceed','lkApproveIntent'):recordedReply('Proceed')}`
      /* DRAFT: nothing to stage, so this card IS the confirmation. */
      : `<p class="summaryCard__q">Does this look right? I'll link it once you approve.</p>${active?replyBtn('Approve','lkApprove'):recordedReply('Approve')}`
    }</div>`);
/* Step 2: the PLAN — two tasks (user, 2026-09-15). Both land on a canvas: the
   draft, then the draft with the experience linked into it. */
/* task 2 links into the DRAFT, not the live experiment — task 1 just created it
   (user, 2026-09-15) */
const LK_TASKS = [
  `Create a draft of ${XP_NAME}`,
  `Link the experience to the draft`,
];
const lkPlanRows = (done=0, loading=-1)=> LK_TASKS.map((w,i)=>{
  const marker = i<done
    ? `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`
    : i===loading
      ? `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
      : `<span class="planNum">${i+1}</span>`;
  return `<div class="planTable__row">${marker}<span>${w}</span></div>`;
}).join('');
const LK_PLAN = (done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I'll link the experience in this order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${lkPlanRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you approve.</p>${active?replyBtn('Approve','lkApprovePlan'):recordedReply('Approve')}</div>`);
/* each task rests on its own canvas with an Approve */
/* both messages name the DRAFT explicitly — the change is happening there, not
   on the live experiment (user, 2026-09-15: "basically call it out") */
const LK_TASK_MSG = [
  ()=>`I've created a draft of ${XP_NAME}. Its linked experiences are drafts too.${objectCard('edit',`${XP_NAME} (draft)`)}`,
  ()=>`I've linked the experience to the draft on treatment ${LK_TMT}. The draft now has ${XP_ROWS.length+1} linked experiences.${objectCard('edit',`${XP_NAME} (draft)`)}`,
];
/* Task 1 (the draft) DOES ask for approval — it is a real object to review
   before anything is linked into it (user, 2026-09-15: "here ask for approval").
   The LAST task offers only PUBLISH: it is the completion, so a separate done
   message would report the link twice. */
const LK_TASK = (i, active)=>{
  const last = i===LK_TASKS.length-1;
  return agentMsg(
    disclosure(LK_TASKS[i],['Reading the experiment','Applying the change','Refreshing the list'])
    + `<div class="chatBubble">${LK_TASK_MSG[i]()}<div class="bubble-q">${last
        ? 'I can publish the experiment for you, or you can do it from Campaign Manager.'
        : "Does this look ok? I'll link the experience to the draft once you approve."}</div>${
      /* the diagram's "staged experiment overrides live experiment": say what
         publishing costs BEFORE the user clicks it */
      last ? `<div class="infoNote">${INFO_ICON}<span>Publishing this draft will replace the version that's live now.</span></div>${active?replyBtn('Publish','lkPublish'):recordedReply('Publish')}<div class="link-cm">Go to Campaign Manager</div>`
           : (active?replyBtn('Approve','lkApproveTask'):recordedReply('Approve'))}</div>`);
};
/* Step 3: linked — the experiment's draft now carries the new experience. */
const LK_DONE = (active, pub=true)=> agentMsg(
  disclosure('Linked the experience',['Creating the draft','Linking the experience','Refreshing the list'])
  + `<div class="chatBubble">I've linked the experience to ${xpName(pub)} on treatment ${LK_TMT}. ${pub?'The draft':'It'} now has ${XP_ROWS.length+1} linked experiences.${objectCard('edit', pub?`${XP_NAME} (draft)`:XP_DRAFT_NAME)}<div class="bubble-q">I can publish the experiment for you, or you can do it from Campaign Manager.</div>${active?replyBtn('Publish','lkPublish'):recordedReply('Publish')}<div class="link-cm">Go to Campaign Manager</div></div>`);
/* Step 3: published — the diagram's "ready to go live? YES". */
const LK_PUBLISHED = (pub=true)=> agentMsg(
  disclosure('Published the experiment',['Publishing the draft','Linking the experience','Refreshing the list'])
  + `<div class="chatBubble">${xpName(pub)} is published with ${XP_ROWS.length+1} linked experiences. The experience is live on treatment ${LK_TMT}.${objectCard('megaphone',xpName(pub))}<div class="link-cm">View in Campaign Manager</div></div>`);

/* ============================================================
   MOVE AN EXPERIENCE BETWEEN EXPERIMENTS  (diagram flow 3)
   "Unlink an experience from an experiment and link another."
   Built branch: the experience IS linked to an experiment, and BOTH
   experiments are published — so both need a draft, and the diagram's
   5-task plan applies.
   ============================================================ */
const MV_EXP      = 'ty25_OICMS_716920_DRY_test_DIY_reco_recipe_C';
const MV_FROM     = XP_NAME;          // experiment X, published
const MV_TO       = 'ty25_Catchall_SSG';   // experiment Y, published
const MV_TO_ID    = '716931';
const MV_PROJECT  = MV_EXP;           // the specific intake names the project for the experience
const MV_EID = '51738ef0-9505-11f1-86ec-a3e651c6bc02';
/* the user pastes the ID, they do not type the full name (the diagram's
   "include experience ID in prompt"). The PROJECT is still named for the
   resolved experience — a GUID in the crumb would be meaningless. */
const MV_FIND_PROMPT = `Show me experience ${MV_EID}.`;
const MV_PROMPT   = `Unlink this from ${MV_FROM} and link it to ${MV_TO}.`;
const MV_CRUMB    = ()=>`<span>Home</span> <span class="sep">/</span> <span>${MV_PROJECT}</span>`;
/* experiment Y's own linked experiences, so task 2 and 4 have a real list */
const MV_TO_ROWS = [
  'ty25_OICMS_716931_SSG_test_DIY_reco_recipe_A',
  'ty25_OICMS_716931_SSG_test_FS_reco_recipe_A',
].map(exp=>({exp, status:'Published', ap:XP_AP, tmt:'A_Baseline'}));
/* ---- the CONTINUATION (user, 2026-09-16) ----
   Task 4 offers Publish, but the user ignores the pill and types another ask:
   add a SECOND experience to the SSG draft. Both experiments are already in
   draft by then, so this behaves like `lkDraft` — no plan, straight to the
   playback and the link. It ends with the Publish offer again, which is what
   shows the flow carrying on rather than dead-ending at a pill. */
const MV2_EXP  = 'ty25_OICMS_716931_SSG_test_DIWM_reco_recipe_A';
const MV2_EID  = '7c40a91b-1182-11f2-b4d9-f7e2a1d05c34';
const MV2_TMT  = 'A_Baseline';
/* names the TREATMENT too (user, 2026-09-16), the same way LK_PROMPT does —
   a link ask has to say which treatment the experience lands on. */
const MV2_PROMPT = `I also want to add ${MV2_EID} to treatment ${MV2_TMT} for this experiment.`;
const MV2_ROW  = {exp:MV2_EXP, status:'Draft', ap:XP_AP, tmt:MV2_TMT};
/* the experience as a row, for expDrillCanvas */
const MV_ROW = {exp:MV_EXP, eid:MV_EID, status:'Published', ver:'v3',
  ap:XP_AP, tmpl:'helloboxThirdParty', prio:'13.0', by:XP_AUTHOR, mod:'06/30 18:30PST'};
/* the specific intake's finished transcript */
const MV_FETCH_CONV = ()=>
  userBubble(MV_FIND_PROMPT)
  + agentMsg(XP_CREATED_FOR(MV_PROJECT),'')
  + agentMsg(
      disclosure('Fetched the experience',['Reading your request','Fetching the experience','Compiling results'])
      /* the disclosure alone left the turn empty — the fetched experience is the
         object the AI produced, so it gets a card like the search results do. */
      + `<div class="chatBubble">Here's the experience.${objectCard('search',MV_EXP)}</div>`);
/* Step 1: the INTENT — what moves, from where to where. Both experiments are
   published, so both need a draft; that is what earns the plan. */
const MV_INTENT = (active)=> agentMsg(
  disclosure('Read your request, checked both experiments',['Reading your request','Checking the experiments','Checking the linked experiences'])
  + `<div class="summaryCard"><p class="summaryCard__intro">This experience will move from ${MV_FROM} to ${MV_TO}.</p>${
      pcFtBlk('Experiment:', MV_FROM, MV_TO)
    }<div class="infoNote">${INFO_ICON}<span>Both experiments are published, so I'll create a draft of each and make the changes there. You'll publish the ${MV_FROM} draft with the unlink before the experience can be linked to ${MV_TO}.</span></div><p class="summaryCard__q">If this looks okay, I'll proceed to create a plan for you.</p>${active?replyBtn('Proceed','mvApproveIntent'):recordedReply('Proceed')}</div>`);
/* Step 2: the PLAN — four tasks, alternating SETUP and REVIEW (user, 2026-09-16). The odd tasks
   only create a draft — there is nothing to review yet, so they carry a plain
   Approve. The change itself lands in the even task, where the user reviews it
   ONCE. Bundling draft+unlink into task 1 made the user approve the same state
   twice, in task 1 and again in task 2. */
const MV_TASKS = [
  `Create a draft of ${MV_FROM}`,
  `Review and publish the draft of ${MV_FROM}`,
  `Create a draft of ${MV_TO}`,
  `Review the updated draft of ${MV_TO}`,
];
const mvPlanRows = (done=0, loading=-1)=> MV_TASKS.map((w,i)=>{
  const marker = i<done
    ? `<span class="planNum planNum--done"><span class="ico-invert">${I.check}</span></span>`
    : i===loading
      ? `<span class="planNum planNum--loading"><img class="spinnerII" src="figma/spinner-ii.gif" alt="" aria-hidden="true"></span>`
      : `<span class="planNum">${i+1}</span>`;
  return `<div class="planTable__row">${marker}<span>${w}</span></div>`;
}).join('');
const MV_PLAN = (done=0, loading=-1, active=false)=> agentMsg(
  `<div class="summaryCard"><p class="summaryCard__intro">I'll move the experience in this order:</p><div class="planTable"><div class="planTable__head"><span>Task</span><span>What happens</span></div>${mvPlanRows(done,loading)}</div><p class="summaryCard__q">Does this look right? I'll get started once you approve.</p>${active?replyBtn('Approve','mvApprovePlan'):recordedReply('Approve')}</div>`);
/* Each task rests on its own canvas with an Approve, like the clone build's
   per-task reviews (user, 2026-09-15: "how can we do 5 tasks when you show me
   nothing on the canvas for each?"). `t{i}` is the resting state for task i. */
const MV_TASK_MSG = [
  ()=>`I've created a draft of ${MV_FROM}. Its ${XP_ROWS.length} linked experiences carried over as drafts.${objectCard('edit',`${MV_FROM} (draft)`)}`,
  ()=>`I've unlinked the experience from the draft. It now has ${XP_ROWS.length-1} linked experiences, and the rest are unchanged.${objectCard('edit',`${MV_FROM} (draft)`)}<div class="bubble-q">${MV_FROM} has to be published before the experience can go on another experiment, so publish it to carry on.</div>`,
  ()=>`I've created a draft of ${MV_TO}. Its ${MV_TO_ROWS.length} linked experiences carried over as drafts.${objectCard('edit',`${MV_TO} (draft)`)}`,
  ()=>`I've linked the experience to the draft of ${MV_TO}. It now has ${MV_TO_ROWS.length+1} linked experiences.${objectCard('edit',`${MV_TO} (draft)`)}`,
];
/* Task 2 REVIEWS AND PUBLISHES X, so it ends in a Publish pill with the
   Campaign Manager alternative and the purple warning above it — the same
   shape as ulPub and lkExp (user, 2026-09-16). It is mid-sequence, so the
   pill also has to carry the flow on to task 3. */
const MV_PUBLISH_TASK = 1;
const MV_LAST_TASK = 3;
/* X published: the state change the user just caused, resting with an
   Approve that carries on to task 3. */
const MV_PUBLISHED = (active)=> agentMsg(
  disclosure(`Published ${MV_FROM}`,['Validating the draft','Publishing the experiment','Refreshing the view'])
  + `<div class="chatBubble">${MV_FROM} is published with ${XP_ROWS.length-1} linked experiences. The experience is off it, so it is free to go on ${MV_TO}.${objectCard('megaphone',MV_FROM)}<div class="bubble-q">Does this look ok? I'll move on to the next task once you approve.</div>${active?replyBtn('Approve','mvApproveTask'):recordedReply('Approve')}<div class="link-cm">View in Campaign Manager</div></div>`);
const MV_TASK = (i, active)=>{
  const last = i===MV_TASKS.length-1;
  /* task 2 publishes X; task 4 offers to publish Y (user, 2026-09-16). The user
     may take it, or ignore it and carry on with another ask. */
  const publishing = i===MV_PUBLISH_TASK || i===MV_LAST_TASK;
  /* the setup tasks (0 and 2) have nothing to review — they say what comes
     next rather than asking the user to vet an unchanged draft */
  const setup = i===0 || i===2;
  const q = publishing
    ? 'I can publish the experiment for you, or you can do it from Campaign Manager.'
    : setup
      ? `The draft is ready. I'll ${i===0?`unlink the experience from it`:`link the experience to it`} once you approve.`
      : `Does this look ok?${last?'':" I'll move on to the next task once you approve."}`;
  const foot = publishing
    ? `<div class="infoNote">${INFO_ICON}<span>Publishing this draft will replace the version that's live now.</span></div>${
        active?replyBtn('Publish', i===MV_LAST_TASK?'mvPublishTo':'mvPublishTask'):recordedReply('Publish')}<div class="link-cm">Go to Campaign Manager</div>`
    : (active?replyBtn('Approve','mvApproveTask'):recordedReply('Approve'));
  return agentMsg(
    disclosure(MV_TASKS[i],['Reading the experiments','Applying the change','Refreshing the view'])
    + `<div class="chatBubble">${MV_TASK_MSG[i]()}<div class="bubble-q">${q}</div>${foot}</div>`);
};
/* ---- the CONTINUATION's turns ----
   Both experiments are drafts by now, so there is nothing to stage and no plan
   to make: the playback card IS the confirmation, exactly as `lkDraft` does it. */
const MV2_INTENT = (active)=> agentMsg(
  disclosure('Read your request, checked the draft',['Reading your request','Checking the experience','Checking the draft'])
  + `<div class="summaryCard"><p class="summaryCard__intro">This experience will be linked to the draft of ${MV_TO} on treatment ${MV2_TMT}.</p><div class="infoNote">${INFO_ICON}<span>${MV_TO} is already in draft, so I'll add it there. The change goes live when you publish the draft.</span></div><p class="summaryCard__q">Does this look right? I'll link it once you approve.</p>${active?replyBtn('Approve','mv2Approve'):recordedReply('Approve')}</div>`);
const MV2_DONE = (active)=> agentMsg(
  disclosure('Linked the experience',['Reading the draft','Linking the experience','Refreshing the list'])
  + `<div class="chatBubble">I've linked the experience to the draft of ${MV_TO} on treatment ${MV2_TMT}. It now has ${MV_TO_ROWS.length+2} linked experiences.${objectCard('edit',`${MV_TO} (draft)`)}<div class="bubble-q">I can publish the experiment for you, or you can do it from Campaign Manager.</div><div class="infoNote">${INFO_ICON}<span>Publishing this draft will replace the version that's live now.</span></div>${active?replyBtn('Publish','mv2Publish'):recordedReply('Publish')}<div class="link-cm">Go to Campaign Manager</div></div>`);
const MV2_PUBLISHED = ()=> agentMsg(
  disclosure(`Published ${MV_TO}`,['Validating the draft','Publishing the experiment','Refreshing the view'])
  + `<div class="chatBubble">${MV_TO} is published with ${MV_TO_ROWS.length+2} linked experiences. Both experiences are live on it.${objectCard('megaphone',MV_TO)}<div class="link-cm">View in Campaign Manager</div></div>`);
/* Step 3: the ending. It SUMMARISES the move and offers the publish, so the
   flow can either end here or carry on (user, 2026-09-16). Two fixes on the
   original: it no longer reports that X "is already published" (the user
   published it themselves two tasks ago, so that is stale news), and it now
   carries the Publish pill rather than only pointing at Campaign Manager. */
/* No separate closing message before the publish: task 4 IS the resting point
   and carries the Publish offer (user, 2026-09-16). The summary appears only
   AFTER publishing, in the `donePub` turn below. */

/* FULL-PAGE experiment skeleton: header, meta card, toolbar and table together.
   Used when a task moves to a DIFFERENT experiment (user, 2026-09-16) — the
   whole page is new content then, so skeletoning only the table would imply the
   header and metadata above it still apply. */
function xpPageSkeleton(){
  const bar=(w,h=14,mt=0)=>`<span class="cfskel cfskel--bar" style="display:block;width:${w};height:${h}px;margin-top:${mt}px"></span>`;
  const metaCell=(i)=>`<div>${bar((34+((i*9)%18))+'%',10)}${bar((52+((i*13)%26))+'%',16,8)}</div>`;
  return `<div style="display:flex;align-items:center;gap:14px">
      ${bar('210px',22)}<span class="cfskel" style="width:62px;height:20px;border-radius:10px"></span>
      ${bar('110px',14)}<span style="flex:1"></span>
      <span class="cfskel" style="width:92px;height:32px;border-radius:16px"></span>
    </div>
    <div style="height:22px"></div>
    <div class="meta" style="margin-bottom:28px">${Array.from({length:6}).map((_,i)=>metaCell(i)).join('')}</div>
    <div style="display:flex;align-items:center;gap:12px">
      <span class="cfskel" style="width:280px;height:36px;border-radius:8px"></span>
      <span class="cfskel" style="width:36px;height:36px;border-radius:8px"></span>
      <span class="cfskel" style="width:140px;height:36px;border-radius:8px"></span>
    </div>
    <div style="height:14px"></div>
    ${skeletonTable(XP_COLS,true)}`;
}
/* The move flow's experiment headers. They used to hand-roll the markup and so
   dropped the version picker, which the convention says is ALWAYS present on an
   experiment header (user, 2026-09-16). `staged` = a draft exists alongside the
   published version, which is true for every experiment in this flow: the
   picker is live, labelled Draft, and reads Published once it goes live. */
const mvHead = (name, id, live, open=false)=>`<div class="expHead">
      <span class="expHead__name">${name}</span>
      <span class="expHead__div"></span>${badge(live?'Published':'Draft')}
      <span class="expHead__div"></span>
      <span class="expHead__idw">ID:&nbsp; ${id} ${COPY_ICON}</span>
      <span class="expHead__div"></span>
      ${xpVerSelect(true, open, true, live)}
    </div>`;
/* ---- Scene: ONE experience + the move conversation ---- */
scenes.mvExp = (state={})=>{
  /* the specific intake lands here (see the `ms-prototype-intake` skill) */
  const ph = state.phase;
  if(ph==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  if(ph==='msg-prompt' || ph==='msg-created' || ph==='msg-search'){
    let centeredBody = userBubble(MV_FIND_PROMPT);
    if(ph==='msg-created' || ph==='msg-search') centeredBody += agentMsg(XP_CREATED_FOR(MV_PROJECT),'');
    if(ph==='msg-search') centeredBody += agentLoader('Fetching the experience', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar(MV_CRUMB())}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }
  const c = state.mv;
  let t='';
  if(c) t += userBubble(MV_PROMPT);
  if(c==='reading')       t += agentLoader('Reading your request', state.tasks||[]);
  else if(c==='intent')   t += MV_INTENT(true);
  else if(c==='planning') t += MV_INTENT(false)
    + `<div class="convoTurn">${agentLoader('Preparing the tasks', state.tasks||[])}</div>`;
  else if(c==='plan')     t += MV_INTENT(false)
    + `<div class="convoTurn">${MV_PLAN(0,-1,true)}</div>`;
  else {
    /* the per-task states: `w{i}` executing, `t{i}` resting on task i's canvas.
       The plan above shows which task is running, and every finished task's
       turn stays in the transcript. */
    const m = /^([wt])(\d+)$/.exec(c||'');
    /* the publish beat that sits between task 2 and task 3 */
    const pm = /^(pw|p)(\d+)$/.exec(c||'');
    /* Replays the finished turns. The PUBLISHED turn sits between task 2 and
       task 3 and is part of the transcript, so it has to be replayed too —
       without it, approving from `p1` made that whole message disappear
       (user, 2026-09-16). */
    const prior = (upto)=>{ let o='';
      for(let i=0;i<upto;i++){
        o += `<div class="convoTurn">${MV_TASK(i,false)}</div>`;
        if(i===MV_PUBLISH_TASK) o += `<div class="convoTurn">${MV_PUBLISHED(false)}</div>`;
      }
      return o; };
    if(m){
      const i=+m[2], running=m[1]==='w';
      t += MV_INTENT(false)
        + `<div class="convoTurn">${MV_PLAN(i, running?i:-1)}</div>`
        + prior(i)
        + `<div class="convoTurn">${running ? agentLoader(MV_TASKS[i], state.tasks||[]) : MV_TASK(i,true)}</div>`;
    }
    else if(pm){
      /* task 2 is DONE once X is published, so the plan ticks it off */
      const i=+pm[2], running=pm[1]==='pw';
      t += MV_INTENT(false)
        + `<div class="convoTurn">${MV_PLAN(running?i:i+1, running?i:-1)}</div>`
        + prior(i)
        + `<div class="convoTurn">${MV_TASK(i,false)}</div>`
        + `<div class="convoTurn">${running
            ? agentLoader(`Publishing ${MV_FROM}`, state.tasks||[])
            : MV_PUBLISHED(true)}</div>`;
    }
    /* task 4's Publish TAKEN: Y goes live, flow ends */
    else if(c==='pubTo' || c==='donePub'){
      t += MV_INTENT(false)
        + `<div class="convoTurn">${MV_PLAN(MV_TASKS.length,-1)}</div>`
        + prior(MV_TASKS.length);
      if(c==='pubTo') t += `<div class="convoTurn">${agentLoader(`Publishing ${MV_TO}`, state.tasks||[])}</div>`;
      else t += `<div class="convoTurn">${agentMsg(
        disclosure('Moved the experience',['Unlinking and publishing','Linking to the new experiment','Publishing the draft'])
        + `<div class="chatBubble">The experience is now linked to ${MV_TO} instead of ${MV_FROM}. ${MV_TO} is published with ${MV_TO_ROWS.length+1} linked experiences.${objectCard('megaphone',MV_TO)}<div class="link-cm">View in Campaign Manager</div></div>`)}</div>`;
    }
    /* THE CONTINUATION: the plan is finished and task 4's Publish is still on
       offer, un-taken. The user types a second ask instead, so the whole move
       transcript stays above it. */
    else if(c && c.startsWith('c2')){
      /* every task's turn stays, with task 4's Publish pill spent-but-unused */
      const head = MV_INTENT(false)
        + `<div class="convoTurn">${MV_PLAN(MV_TASKS.length,-1)}</div>`
        + prior(MV_TASKS.length);
      let tail = `<div class="convoTurn">${userBubble(MV2_PROMPT)}`;
      if(c==='c2reading')        tail += agentLoader('Reading your request', state.tasks||[]);
      else if(c==='c2intent')    tail += MV2_INTENT(true);
      else if(c==='c2working')   tail += MV2_INTENT(false)
        + `<div class="convoTurn">${agentLoader('Linking the experience', state.tasks||[])}</div>`;
      else if(c==='c2done')      tail += MV2_INTENT(false)
        + `<div class="convoTurn">${MV2_DONE(true)}</div>`;
      else if(c==='c2publishing')tail += MV2_INTENT(false)
        + `<div class="convoTurn">${MV2_DONE(false)}</div>`
        + `<div class="convoTurn">${agentLoader(`Publishing ${MV_TO}`, state.tasks||[])}</div>`;
      else if(c==='c2published') tail += MV2_INTENT(false)
        + `<div class="convoTurn">${MV2_DONE(false)}</div>`
        + `<div class="convoTurn">${MV2_PUBLISHED()}</div>`;
      t += head + tail + `</div>`;
    }
  }
  const body = MV_FETCH_CONV() + (t?`<div class="convoTurn">${t}</div>`:'');

  /* THE CANVAS FOLLOWS THE TASK. Tasks 1-4 act on an EXPERIMENT, so they show
     that experiment's linked-experience list; task 5 and the ending show the
     EXPERIENCE itself. Without this the plan ticked past with nothing to look
     at (user, 2026-09-15). */
  const tm = /^([wt])(\d+)$/.exec(c||'');
  const pcm = /^(pw|p)(\d+)$/.exec(c||'');
  /* the publish beat still stands on task 2's experiment (X) */
  const ti = tm ? +tm[2] : pcm ? +pcm[2] : -1;
  const busy = (tm && tm[1]==='w') || (pcm && pcm[1]==='pw');
  /* X only becomes PUBLISHED once the user actually clicks Publish — while the
     pill is still on offer at task 2 it is a Draft (user, 2026-09-16). */
  const xPublished = !!pcm && pcm[1]==='p';
  /* Tasks 1-2 act on X, tasks 3-4 on Y (user, 2026-09-16). Task 2 PUBLISHES X,
     and the publish beat in between still stands on X. X reads Draft
     throughout, and Published only after the user clicks Publish. */
  /* A row click drills into the EXPERIENCE from whatever experiment list was on
     screen (user, 2026-09-16). It overrides the task/continuation canvases, and
     `expBack` returns to the list. */
  if(state.expDrill){
    const onTo = ti>=2 || (c||'').startsWith('c2') || c==='pubTo' || c==='donePub';
    const live = c==='donePub' || c==='c2published';
    return expDrillCanvas(MV_CRUMB(), MV_ROW, state,
      {status:live?'Published':'Draft', ver:onTo?'v4':'v3',
       experiment:{name:onTo?MV_TO:MV_FROM, id:onTo?MV_TO_ID:XP_ID}})
      + aiPanel({body});
  }
  /* the continuation stands on Y's list the whole way through */
  const c2 = c && c.startsWith('c2') ? c.slice(2) : null;
  /* task 4's publish taken directly: Y's list, going live */
  /* The ENDING stands on Y's list, not the experience (user, 2026-09-16): the
     message is about the experiment and its card points at the SSG draft, so
     swapping to the experience drill-down here made no sense. */
  if(c==='pubTo' || c==='donePub'){
    const live = c==='donePub';
    const rowsP = [...MV_TO_ROWS, MV_ROW].map(r=>({...r,status:live?'Published':'Draft'}));
    return `<div class="content">${topbar(MV_CRUMB())}<div class="scroll"><div class="pad">
        ${mvHead(MV_TO, MV_TO_ID, live, !!state.verOpen)}
        ${xpMeta(true)}
        ${xpToolbar()}
        ${c==='pubTo' ? skeletonTable(XP_COLS,true) : tableHTML(XP_COLS, rowsP, {checkbox:true, select:true, selected:new Set(), drillrow:true})}
      </div></div></div>` + aiPanel({body});
  }
  if(c2){
    const busy2 = c2==='reading' || c2==='working' || c2==='publishing';
    const linked2 = ['done','publishing','published'].includes(c2);
    const live2 = c2==='published';
    const rows2 = [...MV_TO_ROWS, MV_ROW, ...(linked2?[MV2_ROW]:[])];
    const st2 = live2 ? 'Published' : 'Draft';
    const table2 = busy2 ? skeletonTable(XP_COLS,true)
      : tableHTML(XP_COLS, rows2.map(r=>({...r,status:st2})), {checkbox:true, select:true, selected:new Set(), drillrow:true});
    const hd2 = mvHead(MV_TO, MV_TO_ID, live2, !!state.verOpen);
    return `<div class="content">${topbar(MV_CRUMB())}<div class="scroll"><div class="pad">
        ${hd2}
        ${xpMeta(true)}
        ${xpToolbar()}
        ${table2}
      </div></div></div>` + aiPanel({body, draft:c2==='typed'?MV2_PROMPT:''});
  }
  const onExperiment = ti>=0 && ti<=3;
  if(onExperiment){
    const showTo = ti>=2;                            // tasks 3 and 4 act on Y
    const name = showTo ? MV_TO : MV_FROM;
    /* The SETUP task shows the draft UNCHANGED — the experience is still on X
       at task 1, and not yet on Y at task 3. The change appears in the review
       task that follows it (user, 2026-09-16). */
    const changed = ti===1 || ti===3 || xPublished;
    const rows = showTo
      ? (changed ? [...MV_TO_ROWS, MV_ROW] : MV_TO_ROWS)
      : (changed ? XP_ROWS.filter(r=>r.exp!==MV_EXP) : XP_ROWS);
    const rowStatus = xPublished ? 'Published' : 'Draft';
    /* Task 3 is the first task on the OTHER experiment, so its loader covers the
       WHOLE page, not just the table (user, 2026-09-16): the header, the meta
       card and the list are all about to be replaced. Every other task stays on
       the experiment it is already showing, so only its table reloads. */
    const wholePage = busy && ti===2;
    const table = busy ? skeletonTable(XP_COLS,true)
      : tableHTML(XP_COLS, rows.map(r=>({...r,status:rowStatus})), {checkbox:true, select:true, selected:new Set(), drillrow:true});
    const hd = mvHead(name, showTo?MV_TO_ID:XP_ID, rowStatus==='Published', !!state.verOpen);
    return `<div class="content">${topbar(MV_CRUMB())}<div class="scroll"><div class="pad">
        ${wholePage ? xpPageSkeleton() : `${hd}
        ${xpMeta(true)}
        ${xpToolbar()}
        ${table}`}
      </div></div></div>` + aiPanel({body,
        /* publishing COMPLETES task 2, so the tracker keeps naming task 2 —
           every entry reads "<n>.  <the plan's own task text>" and this one
           had been cut to a bare invented label (user, 2026-09-16). */
        step:`${ti+1}.  ${MV_TASKS[ti]}`, stepLoading:!!busy});
  }
  /* the Experiment tab must name the experiment the experience is linked to NOW —
     it is the whole point of this flow (user, 2026-09-15: "these tabs should work?!") */
  /* only the ending shows the EXPERIENCE now — every one of the four tasks
     acts on an experiment (user, 2026-09-16, dropping the "Review experience"
     task). Before the move it still reads as linked to X. */
  const movedYet = c==='done';
  const canvas = expDrillCanvas(MV_CRUMB(), MV_ROW, state,
    {noBack:true, status:movedYet?'Draft':'Published', ver:movedYet?'v4':'v3',
     experiment:{name:movedYet?MV_TO:MV_FROM, id:movedYet?MV_TO_ID:XP_ID}});
  return canvas + aiPanel({body,
    ...(ti>=0 ? {step:`${ti+1}.  ${MV_TASKS[ti]}`, stepLoading:!!busy} : {}),
    draft:(state.typed && !c)?MV_PROMPT:''});
};

/* ---- Scene: the experiment detail screen + the unlink conversation ----
   state: selected[] | typed | ul: 'reading' | 'playback' | 'working' | 'done'
          pub (defaults true) */
scenes.xpDetail = (state={})=>{
  /* THE SPECIFIC INTAKE LANDS HERE (ulDraft): the prompt named one experiment,
     so this scene owns boot / C1 / C2 as well as the experiment itself. The
     published scenario reaches this scene by clicking a search result instead,
     and never carries a phase. */
  const ph = state.phase;
  if(ph==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  if(ph==='msg-prompt' || ph==='msg-created' || ph==='msg-search'){
    let centeredBody = userBubble(XP_FIND_ONE_PROMPT);
    if(ph==='msg-created' || ph==='msg-search') centeredBody += agentMsg(XP_CREATED_FOR(XP_ONE_PROJECT),'');
    if(ph==='msg-search') centeredBody += agentLoader('Fetching the experiment', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar(XP_SEARCH_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }
  /* ── LINK flow (diagram flow 1) shares this screen, keyed by `lk`. It has no
     selection: the experience arrives by ID in the prompt. ── */
  if(state.lk!==undefined){
    const L=state.lk;
    const lpub = state.pub!==false;          // published experiment vs draft one
    /* task 1 creates the draft (same 6 rows, all Draft); task 2 adds the
       experience. `linked` is true from t1 onward. */
    const lmT = /^([wt])(\d+)$/.exec(L||'');
    const lti = lmT ? +lmT[2] : -1;
    const lbusy = lmT && lmT[1]==='w';
    const drafted = lti>=0 || ['done','publishing','published'].includes(L);
    const linked = lti>=1 || ['done','publishing','published'].includes(L);
    const livePub = L==='published';
    let lt = userBubble(LK_PROMPT);
    const lprior=(upto)=>{ let o=''; for(let i=0;i<upto;i++) o += `<div class="convoTurn">${LK_TASK(i,false)}</div>`; return o; };
    const lm = /^([wt])(\d+)$/.exec(L||'');
    if(L==='reading')          lt += agentLoader('Reading your request', state.tasks||[]);
    else if(L==='intent')      lt += LK_INTENT(true, lpub);
    else if(L==='planning')    lt += LK_INTENT(false, lpub)
      + `<div class="convoTurn">${agentLoader('Preparing the tasks', state.tasks||[])}</div>`;
    else if(L==='plan')        lt += LK_INTENT(false, lpub)
      + `<div class="convoTurn">${LK_PLAN(0,-1,true)}</div>`;
    else if(lm){
      const i=+lm[2], running=lm[1]==='w';
      lt += LK_INTENT(false, lpub)
        + `<div class="convoTurn">${LK_PLAN(i, running?i:-1)}</div>`
        + lprior(i)
        + `<div class="convoTurn">${running ? agentLoader(LK_TASKS[i], state.tasks||[]) : LK_TASK(i,true)}</div>`;
    }
    else {
      /* the published path's tail replays the plan + every task (the last one
         carries the publish offer); the draft path has no plan, so it uses
         LK_DONE as its single closing message. */
      const tail = lpub
        ? `<div class="convoTurn">${LK_PLAN(LK_TASKS.length,-1)}</div>`
          + lprior(LK_TASKS.length-1)
          + `<div class="convoTurn">${LK_TASK(LK_TASKS.length-1, L==='done')}</div>`
        : `<div class="convoTurn">${LK_DONE(L==='done', lpub)}</div>`;
      if(L==='done')            lt += LK_INTENT(false, lpub) + tail;
      else if(L==='publishing') lt += LK_INTENT(false, lpub) + tail
        + `<div class="convoTurn">${agentLoader('Publishing the experiment', state.tasks||[])}</div>`;
      else if(L==='published')  lt += LK_INTENT(false, lpub) + tail
        + `<div class="convoTurn">${LK_PUBLISHED(lpub)}</div>`;
    }
    /* the search intake got us here on the published path; the specific intake
       on the draft one */
    const lbody = (lpub ? XP_SEARCH_CONV() : XP_FETCH_CONV()) + `<div class="convoTurn">${lt}</div>`;
    /* the new experience joins the list once linked; everything reads Draft
       until the experiment is published again */
    const lrows = (linked ? [...XP_ROWS, LK_ROW] : XP_ROWS)
      .map(r=>({...r, status: ((!lpub || drafted) && !livePub) ? 'Draft' : 'Published'}));
    const ltable = (lbusy||L==='publishing')
      ? skeletonTable(XP_COLS,true)
      : tableHTML(XP_COLS, lrows, {checkbox:true, select:true, selected:new Set(), drillrow:true});
    /* the screen follows the experiment the scenario opened: the published one
       gets a draft as task 1, the draft one is already a draft. */
    return `<div class="content">${topbar(XP_CRUMB(lpub))}<div class="scroll"><div class="pad">
        ${xpHead(lpub, lpub && drafted && !livePub, !!state.verOpen, livePub)}
        ${xpMeta(lpub, livePub)}
        ${xpToolbar()}
        ${ltable}
      </div></div></div>` + aiPanel({body:lbody,
        /* THE STICKY TASK TRACKER at the top of the panel, while the plan runs:
           which task, a spinner while it executes, a check when it rests.
           Every build with a plan has this — do not forget it. */
        ...(lmT ? {step:`${lti+1}.  ${LK_TASKS[lti]}`, stepLoading:!!lbusy} : {}),
        /* the typed draft must SURVIVE re-renders, or scheduleAskType restarts
           it on every tick and it never completes */
        draft:(state.typed && state.lk===undefined)?LK_PROMPT:''});
  }
  const sel = new Set(state.selected||[]);
  const n = sel.size;
  const pub = state.pub!==false;
  const done = state.ul==='done';
  // once unlinked the rows are GONE from the experiment: that is what unlink means
  /* THE DRAFT VIEW IS A CONFIRMATION STEP (user, 2026-09-15). Approving the plan
     creates a DRAFT of the experiment: the SAME view as the published one, with
     every experience in Draft. Nothing has been removed yet — the draft is just
     where the change will be made.
       staging / stagereview -> ALL 6 rows, Draft, header "Draft"
       working / done        -> the same draft, minus the unlinked rows
       publishing / published -> the LIVE experiment, Published, same rows gone */
  /* PUBLISHING closes the loop (user, 2026-09-15): the draft goes live, so the
     experiment is Published again with the unlinked experiences gone for good.
     `staged` covers the draft states only — once published we are back on the
     live experiment. */
  const live = state.ul==='publishing' || state.ul==='published';
  const staged = pub && ['staging','stagereview','working','done'].includes(state.ul);
  const asDraft = (r)=>({...r,status:'Draft'});
  /* once published the rows are live again, whichever path got here; before
     that they are drafts on the draft path and inside a draft copy. */
  const SRC = (live || (pub && !staged)) ? XP_ROWS : XP_ROWS.map(asDraft);
  // the rows are gone from the moment the unlink lands, draft or published
  const gone = done || live;
  const rows = gone ? SRC.filter((_,i)=>!sel.has(i)) : SRC;
  const count = state.asked || n;

  /* the search that got here is HISTORY: it stays above the unlink turn, so
     the panel reads as one conversation rather than starting mid-flow. */
  let t='';
  if(state.ul) t += selThread(count) + userBubble(UL_PROMPT);
  const INTENT = ()=> UL_INTENT(count, pub, false);
  if(state.ul==='reading')       t += agentLoader('Reading your request', state.tasks||[]);
  else if(state.ul==='intent')   t += UL_INTENT(count, pub, true);
  // the draft path has no plan, so its transcript must not replay one
  const PLAN = ()=> pub ? `<div class="convoTurn">${UL_PLAYBACK(count, pub, false)}</div>` : '';
  const STAGED = ()=> `<div class="convoTurn">${UL_STAGED(count, false)}</div>`;
  if(state.ul==='planning') t += INTENT()
    + `<div class="convoTurn">${agentLoader('Preparing the tasks', state.tasks||[])}</div>`;
  else if(state.ul==='playback') t += INTENT()
    + `<div class="convoTurn">${UL_PLAYBACK(count, pub, true)}</div>`;
  // the staging loader + the staged confirmation (published path only)
  else if(state.ul==='staging') t += INTENT() + PLAN()
    + `<div class="convoTurn">${agentLoader('Creating the draft', state.tasks||[])}</div>`;
  else if(state.ul==='stagereview') t += INTENT() + PLAN()
    + `<div class="convoTurn">${UL_STAGED(count, true)}</div>`;
  else if(state.ul==='working')  t += INTENT() + PLAN() + (pub?STAGED():'')
    + `<div class="convoTurn">${agentLoader('Unlinking the experiences', state.tasks||[])}</div>`;
  else if(state.ul==='done')     t += INTENT() + PLAN() + (pub?STAGED():'')
    + `<div class="convoTurn">${UL_DONE(count, pub, true)}</div>`;
  else if(state.ul==='publishing') t += INTENT() + PLAN() + (pub?STAGED():'')
    + `<div class="convoTurn">${UL_DONE(count, pub, false)}</div>`
    + `<div class="convoTurn">${agentLoader('Publishing the experiment', state.tasks||[])}</div>`;
  else if(state.ul==='published') t += INTENT() + PLAN() + (pub?STAGED():'')
    + `<div class="convoTurn">${UL_DONE(count, pub, false)}</div>`
    + `<div class="convoTurn">${UL_PUBLISHED(count, pub)}</div>`;
  /* NO message for opening the experiment (user, 2026-09-15): clicking a search
     result is NAVIGATION, and an object card means the AI CREATED something.
     The search conversation is the history; the next turn is the user's ask. */
  /* whichever intake got here is the history above the unlink turn */
  const intake = pub ? XP_SEARCH_CONV() : XP_FETCH_CONV();
  const body = intake + (t ? `<div class="convoTurn">${t}</div>` : '');

  /* `select` stays TRUE once the ask is in flight: tableHTML's non-select path
     renders a bare disabled checkbox that drops the checked state, so the
     user's selection would visibly clear the moment the conversation starts.
     Freezing is done in wire() (the `frozen` guard), not by un-selecting. */
  /* `sel` indexes the FULL 6-row list, and every view EXCEPT the result still
     renders that same list in the same order — including the draft, which is
     the published view with everything in Draft. So the selection stays visible
     right up to the unlink; the user must keep seeing what they picked.
     Only `done` renders a shorter list, where the indices no longer line up. */
  const picking = !gone;
  const table = (state.loading||state.ul==='working'||state.ul==='staging'||state.ul==='publishing')
    ? skeletonTable(XP_COLS,true)
    : tableHTML(XP_COLS, rows, {checkbox:true, select:true, drillrow:true,
        selected: picking ? sel : new Set()});
  /* A row click drills into that EXPERIENCE, opening on the Experiment tab
     (user, 2026-09-16). `expDrill` holds the clicked row index. */
  if(state.expDrill!==undefined && state.expDrill!==false){
    const r = rows[state.expDrill] || rows[0];
    const drillRow = {exp:r.exp, eid:MV_EID, status:r.status||'Published', ver:'v3',
      ap:r.ap||XP_AP, tmpl:'helloboxThirdParty', prio:'13.0', by:XP_AUTHOR, mod:'06/30 18:30PST'};
    return expDrillCanvas(XP_CRUMB(pub), drillRow, state,
      {status:r.status||'Published', ver:'v3',
       experiment:{name:xpName(pub), id:xpId(pub)}})
      + aiPanel({body});
  }
  return `<div class="content">${topbar(XP_CRUMB(pub))}<div class="scroll"><div class="pad">
      ${xpHead(pub, staged, !!state.verOpen, live)}
      ${xpMeta(pub, live)}
      ${xpToolbar()}
      ${table}
    </div></div></div>` + aiPanel({body,
      /* the sticky task tracker: the unlink plan's two tasks map onto the
         staging and the unlink itself */
      ...(pub && ['staging','stagereview'].includes(state.ul)
            ? {step:'1.  Create a draft of '+XP_NAME, stepLoading:state.ul==='staging'}
        : pub && ['working','done'].includes(state.ul)
            ? {step:'2.  Unlink the experiences from the draft', stepLoading:state.ul==='working'}
        : {}),
      chip: (n&&!done)?n+' experience'+(n===1?'':'s')+' selected':'',
      /* which ask is typing depends on the scenario: the link flow's arrives by
         ID with no selection, the unlink flow's acts on the checked rows. */
      draft: (state.typed&&!state.ul)?((scenario==='lkExp'||scenario==='lkDraft')?LK_PROMPT:UL_PROMPT):''});
};

scenes.pcSearch = (state={})=>{
  const phase = state.phase;
  const loading = state.loading;
  const sel = new Set(state.selected||[]);
  // Once the clone lands, a NEW view is created showing ONLY the copies — the
  // originals are not part of it. No yellow highlight: nothing was edited, these
  // are new objects (row-edited is the EDIT convention in the other builds, so
  // using it for "newly created" would overload it).
  // scenario 2 also moves the copies to a new access point; scenario 1 keeps theirs
  const isCl2 = state.cl2!==undefined;
  // scenario 3b also moves the copies AND changes their template
  const isCl3b = state.cl3!==undefined && state.path==='change';
  /* Scenario 4 searches ACROSS access points, so it has its own result set.
     Everything downstream (grouping, cloning, the table) reads SRC. */
  const isCl4 = state.cl4!==undefined || scenario==='cl4';
  /* scenario 5 needs the SAME multi-access point data as scenario 4 (a selection
     has to be able to span access points for the guardrail to fire at all), so it
     shares CL4_ROWS and cl4Groups. It never clones, so nothing below the
     transcript branch has to know about it. */
  const isCl5 = state.cl5!==undefined || state.cl5Prior!==undefined || scenario==='cl5';
  const SRC = (isCl4||isCl5) ? CL4_ROWS : PC_ROWS;
  const cl4G = (isCl4||isCl5) ? cl4Groups([...sel]) : [];
  // in 4b each group goes to its OWN destination, so the clone's ap depends on
  // which group its source row fell into
  const cl4DestFor = (i)=>{ const g = cl4G.findIndex(x=>x.idx.includes(i)); return g<0?null:cl4Dest(g); };
  const cl4Changed = isCl4 && state.path==='change';
  /* Validation state lives ON the clones, not just in the chat. In 3b every
     clone lands needing copy (the template changed); the fix turn resolves the
     FIRST one only. In 4b the same is true for every cloned group.
     Declared BEFORE cloneRows because its map() calls needsCopy(). */
  const CL3_FLAGGED_STATES = ['clonesErr','fixingAll','verified'];
  const cl3Flagged = isCl3b && CL3_FLAGGED_STATES.includes(state.cl3);
  const cl3IsFixed = ()=> false;   // the fix is all-or-nothing now
  const needsCopy  = (i)=> (cl3Flagged && state.cl3!=='verified') || (cl4Changed && !!state.cl4);
  const cl3Edited  = isCl3b && state.cl3==='verified';
  const anyFlagged = cl3Flagged || (cl4Changed && !!state.cl4);
  const cloneRows = [...sel].sort((a,b)=>a-b).map((i,k)=>({
    ...SRC[i],
    exp: SRC[i].exp.replace('…','') + CLONE_SUFFIX,
    eid: CLONE_EIDS[k % CLONE_EIDS.length],
    status: 'Draft',
    ver: 'v1',          // a copy is a new object: version history starts over,
                        // whatever the source was on (v3 or v4)
    mod: CLONE_STAMP,
    ...(isCl2 ? {ap: CL2_NEW_PLACEMENT} : {}),
    ...(isCl3b ? {ap: CL3_NEW_PLACEMENT, tmpl: CL3_NEW_TEMPLATE} : {}),
    ...(cl4Changed ? {ap: cl4DestFor(i)||SRC[i].ap, tmpl: CL3_NEW_TEMPLATE} : {}),
  })).map((r,k)=>({...r,
    /* a flagged clone's STATUS is Error; once its copy is supplied the clone has
       been EDITED, so it moves to v2 rather than staying at the created v1 */
    status: needsCopy(k) ? 'Error' : (cl3Edited ? 'Edited' : r.status),
    ver: (!needsCopy(k) && cl3Edited) ? 'v2' : r.ver,
    // flags the highlighted columns; only set when this flow changed them
    apChanged: isCl3b||cl4Changed, tmplChanged: isCl3b||cl4Changed }));
  const CL3_LIST = ['clonesErr','fixingAll','verified'];
  const onCloneResults = (state.pc==='done') || (state.cl2==='allrev' || state.cl2==='done')
    || (state.cl3==='done3a') || (state.cl3!==undefined && CL3_LIST.includes(state.cl3))
    || (state.cl4==='doneall' || state.cl4==='done')
    || (state.cl5==='doneall');
  const rows = onCloneResults ? cloneRows : SRC;
  const n = sel.size;
  const pick = rows[[...sel][0]] || rows[1];
  const uPrompt = userBubble((isCl4||isCl5) ? CL4_FIND_PROMPT : FIND_EXP_PROMPT);
  const createdBubble = `<div class="chatBubble">I have created "<span class="chatBubble__name">${(isCl4||isCl5)?CL4_PROJECT:PC_PROJECT}</span>" project for you.</div>`;
  if(phase==='bootfull'){
    return `<div class="content">
      ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
      <div class="scroll scroll--center">${bootCanvas()}</div>
    </div>`;
  }
  if(phase==='msg-prompt' || phase==='msg-created' || phase==='msg-search'){
    let centeredBody = uPrompt;
    if(phase==='msg-created' || phase==='msg-search') centeredBody += agentMsg(createdBubble);
    if(phase==='msg-search') centeredBody += agentLoader('Searching QB Payroll IPD experiences', state.tasks||[]);
    return `<div class="content content--centered">
      ${topbar(PC_CRUMB)}
      <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
        ${expandedComposer()}
      </div></div>
    </div>`;
  }
  let body, table;
  if(loading){
    body = uPrompt + agentMsg(createdBubble) + agentLoader('Searching QB Payroll IPD experiences', state.tasks||[]);
    table = skeletonTable(PC_COLS,true);
  } else {
    body = (isCl4||isCl5) ? CL4_SEARCH_CONV() : PC_SEARCH_CONV();
    if(state.pc){
      const p = state.pc;
      const f = state.fields||{};
      const nm = state.expName;
      // cumulative transcript: each state appends to everything recorded before it
      const UND   = ()=> PC_UNDERSTOOD(pick,false);
      const NAME  = ()=> pcNameCard(nm,false);
      const FIELD = ()=> pcFieldCard(f,false);
      const beforePlan = ()=> UND() + NAME() + FIELD();
      // the body-copy fix turn: user's corrected copy, then the new message
      // the fix is a follow-up inside the SAME task, not a new selection-scoped
      // ask, so it carries no "Selected n experiences" divider
      const FIXREQ = ()=> userBubble(USE_BODY_PROMPT);
      // Scenario 1 is four states: the ask, one confirm, the clone, done.
      const nSel = state.asked || n || 1;
      let tail = selThread(nSel) + PC_REQ();
      if(p==='reading')        tail += agentLoader('Reading your request', state.tasks||[]);
      else if(p==='understood')tail += CLONE_UNDERSTOOD(nSel,true);
      else if(p==='cloning')   tail += CLONE_UNDERSTOOD(nSel,false) + agentLoader(`Cloning ${nSel} experience${nSel===1?'':'s'}`, state.tasks||[]);
      else if(p==='done')      tail += CLONE_UNDERSTOOD(nSel,false) + CLONE_DONE(nSel);
      // the selection-thread turn fills the panel viewport so the prior
      // conversation scrolls up and the thread starts at the top
      body += `<div class="convoTurn">${tail}</div>`;
    }
    /* ── Scenario 2: clone AND change the access point ──
       states: reading | naming | planning | plan | then per-task
               t{i} (resting review of clone i) / w{i} (executing task i)
               plus t0's error turn: t0err (error shown) | t0fix (fixing)
               | t0fixed (corrected, awaiting approve)
               then allrev (all clones) | done
       The per-task states carry the index so ONE branch renders every task. */
    /* ── Scenario 4: the selection spans access points ──
       states: reading | grouped
               4a: wall4 | doneall
               4b: g{i}ask | g{i}map | g{i}int | g{i}wcl | g{i}done, then done
       The group index lives IN the state string, so one branch renders every
       group's turn no matter how many groups the selection produced. */
    /* ── Scenario 5: the guardrail. The agent checks the access points and asks
       the user to narrow to one. NOT terminal: the user regroups the table
       from the Group by dropdown, re-picks inside one group, and the flow
       carries on into scenario 3's choice. Once that happens `state.cl5` is
       gone but `cl5Prior` remains, and the cl3 branch replays this turn as
       history via cl5Prelude() — otherwise the guardrail vanished from the
       conversation the moment the user continued (a real bug, caught by the
       user 2026-09-09). ── */
    else if(state.cl5!==undefined){
      /* Read the counts off the STAMP, never off the live selection. The
         message is a record of what the agent said at the time; regrouping
         CLEARS the selection, so recomputing rewrote the sentence to
         "spans 0 access points" while the user was picking new rows (bug caught
         2026-09-09). Falls back to the live selection for the loader state,
         which runs before the stamp is on screen. */
      const P = state.cl5Prior;
      const nSel = P ? P.n : (state.asked || n || 1);
      const G = P ? {length:P.g} : (cl4G.length ? cl4G : cl4Groups([...sel]));
      const c5 = state.cl5;
      // the pill the user pressed, so the recorded reply matches their choice
      const chose5 = state.path==='direct' ? 'Clone as they are' : 'Change the access point';
      const CHOICE5 = ()=> CL5_CHOICE(nSel,G,false,chose5);
      let tail = selThread(nSel) + PC_REQ();
      if(c5==='reading') tail += agentLoader('Checking the experiences', state.tasks||[]);
      else if(c5==='choice') tail += CL5_CHOICE(nSel,G,true);
      // ── "clone as they are": no change, so the limit never applies (like 4a)
      else if(c5==='wnaming') tail += CHOICE5() + `<div class="convoTurn">${agentLoader('Preparing the copies', state.tasks||[])}</div>`;
      else if(c5==='naming') tail += CHOICE5() + `<div class="convoTurn">${CL5_NAMING(true)}</div>`;
      else if(c5==='wall') tail += CHOICE5() + `<div class="convoTurn">${CL5_NAMING(false)}</div><div class="convoTurn">${agentLoader(`Cloning ${nSel} experience${nSel===1?'':'s'}`, state.tasks||[])}</div>`;
      else if(c5==='doneall') tail += CHOICE5() + `<div class="convoTurn">${CL5_NAMING(false)}</div><div class="convoTurn">${CL4_DONE(nSel,G,false)}</div>`;
      // ── "change the access point": the limit bites, so the guardrail lands here
      else if(c5==='reading2') tail += CHOICE5() + `<div class="convoTurn">${agentLoader('Checking the access points', state.tasks||[])}</div>`;
      else if(c5==='mixed') tail += CHOICE5() + `<div class="convoTurn">${CL5_MIXED(nSel,G)}</div>`;
      body += `<div class="convoTurn">${tail}</div>`;
    }
    else if(state.cl4!==undefined){
      const c = state.cl4;
      const nSel = state.asked || n || 1;
      const G = cl4G.length ? cl4G : cl4Groups([...sel]);
      const chose4 = state.path==='direct' ? 'Clone as they are' : 'Change the access points';
      const GROUPED = ()=> CL4_GROUPED(nSel,G,false,chose4);
      const mm4 = /^g(\d+)(ask|map|int|wcl|done)$/.exec(c);
      const mmLoad = /^g(\d+)load$/.exec(c);
      // the transcript of every group already approved, before group `upto`
      const priorGroups = (upto)=>{
        let out='';
        for(let g=0; g<upto; g++){
          out += `<div class="convoTurn">${CL4_ASK_GROUP(g,G)}</div>`
               + `<div class="convoTurn">${userBubble(cl4DestPrompt(g))}${CL4_GROUP_INTENT(g,G,false)}</div>`
               + `<div class="convoTurn">${CL4_GROUP_DONE(g,G,false)}</div>`;
        }
        return out;
      };
      const PLANNED = (done,loading)=> CL4_PLAN(G,done,loading);
      /* everything settled before the plan exists: the grouping choice, the
         confirmation standing in for a playback, and the naming. Every 4b
         state replays all three, so they are built once here. */
      const BEFORE4 = ()=> GROUPED()
        + `<div class="convoTurn">${CL4_CONFIRM(nSel,G,false)}</div>`
        + `<div class="convoTurn">${CL4_NAMING(false)}</div>`;
      let tail = selThread(nSel) + PC_REQ();
      if(c==='reading')      tail += agentLoader('Reading your request', state.tasks||[]);
      else if(c==='grouped') tail += CL4_GROUPED(nSel,G,true);
      // ── 4a: the pill already said "clone as they are", so clone immediately ──
      else if(c==='wall4')   tail += GROUPED() + `<div class="convoTurn">${CL4_NAMING(false,true)}</div><div class="convoTurn">${agentLoader(`Cloning ${nSel} experience${nSel===1?'':'s'}`, state.tasks||[])}</div>`;
      else if(c==='doneall') tail += GROUPED() + `<div class="convoTurn">${CL4_NAMING(false,true)}</div><div class="convoTurn">${CL4_DONE(nSel,G,false)}</div>`;
      // ── 4b: a plan naming each access point, then group by group ──
      else if(c==='confirming') tail += GROUPED() + `<div class="convoTurn">${agentLoader('Checking the access points', state.tasks||[])}</div>`;
      else if(c==='confirm')  tail += GROUPED() + `<div class="convoTurn">${CL4_CONFIRM(nSel,G,true)}</div>`;
      // the naming card sits on BOTH paths; on `direct` there is no confirm card before it
      else if(c==='wnaming')  tail += GROUPED() + (state.path==='direct' ? '' : `<div class="convoTurn">${CL4_CONFIRM(nSel,G,false)}</div>`) + `<div class="convoTurn">${agentLoader('Preparing the copies', state.tasks||[])}</div>`;
      else if(c==='naming')   tail += GROUPED() + (state.path==='direct' ? '' : `<div class="convoTurn">${CL4_CONFIRM(nSel,G,false)}</div>`) + `<div class="convoTurn">${CL4_NAMING(true, state.path==='direct')}</div>`;
      else if(c==='planning') tail += BEFORE4() + `<div class="convoTurn">${agentLoader('Creating a plan', state.tasks||[])}</div>`;
      else if(c==='plan')     tail += BEFORE4() + `<div class="convoTurn">${CL4_PLAN(G,0,-1,true)}</div>`;
      else if(mmLoad){
        const g = +mmLoad[1];
        tail += BEFORE4() + `<div class="convoTurn">${PLANNED(g,-1)}</div>` + priorGroups(g)
             + `<div class="convoTurn">${agentLoader(g===0?'Starting with the first group':'Starting on the next group', state.tasks||[])}</div>`;
      }
      else if(mm4){
        const g = +mm4[1], stage = mm4[2];
        // `done` counts FINISHED tasks, so group g joins the count only at
        // stage 'done' (its clones exist). At 'ask' the agent is mid-task
        // waiting on a destination, so row g stays a hollow number.
        tail += BEFORE4() + `<div class="convoTurn">${PLANNED(stage==='done'?g+1:g, stage==='wcl'?g:-1)}</div>`
             + priorGroups(g) + `<div class="convoTurn">${CL4_ASK_GROUP(g,G)}</div>`;
        if(stage==='ask') { /* waiting on the user's destination */ }
        // the destination reply is PLAYED BACK before anything is cloned
        else if(stage==='map')  tail += `<div class="convoTurn">${userBubble(cl4DestPrompt(g))}${agentLoader('Mapping the change', state.tasks||[])}</div>`;
        else if(stage==='int')  tail += `<div class="convoTurn">${userBubble(cl4DestPrompt(g))}${CL4_GROUP_INTENT(g,G,true)}</div>`;
        else if(stage==='wcl')  tail += `<div class="convoTurn">${userBubble(cl4DestPrompt(g))}${CL4_GROUP_INTENT(g,G,false)}</div>`
                                     + `<div class="convoTurn">${agentLoader(`Cloning ${G[g].idx.length} experience${G[g].idx.length===1?'':'s'}`, state.tasks||[])}</div>`;
        else if(stage==='done') tail += `<div class="convoTurn">${userBubble(cl4DestPrompt(g))}${CL4_GROUP_INTENT(g,G,false)}</div>`
                                     + `<div class="convoTurn">${CL4_GROUP_DONE(g,G,true)}</div>`;
      }
      else if(c==='wallrev') tail += BEFORE4() + `<div class="convoTurn">${PLANNED(G.length,G.length)}</div>` + priorGroups(G.length) + agentLoader('Compiling the clones', state.tasks||[]);
      // the final review IS the end: every task done, publish guidance, no pill
      else if(c==='allrev' || c==='done')
        tail += BEFORE4() + `<div class="convoTurn">${PLANNED(G.length+1,-1)}</div>` + priorGroups(G.length) + CL4_ALL_REVIEW(nSel,G);
      body += `<div class="convoTurn">${tail}</div>`;
    }
    /* ── Scenario 3: the AI offers the choice, then (3b) access point + template ──
       states: reading | choice
               3a: cloning | done            (same ending as scenario 1)
               3b: asking | targeting | intent | planning | plan
                   | wplace | place                 (task 1: the access point)
                   | wclones | clonesErr            (task 2: clones, all flagged)
                   | fixing | fixed
                   | wall | allrev | done           (task 3: the finished set)
       `path` records which pill was taken so the transcript replays correctly. */
    else if(state.cl3!==undefined){
      const c = state.cl3;
      const nSel = state.asked || n || 1;
      /* Came from scenario 5's guardrail? Replay that turn first, with the
         count it had at the time (cl5Prior holds the spanning selection's
         numbers — the live selection is now narrowed to one access point, so
         recomputing would show "spans 1 access points"). */
      const cl5Prelude = ()=> state.cl5Prior
        ? `<div class="convoTurn">${selThread(state.cl5Prior.n)}${PC_REQ()}`
          + CL5_CHOICE(state.cl5Prior.n,{length:state.cl5Prior.g},false,'Change the access point')
          + `<div class="convoTurn">${CL5_MIXED(state.cl5Prior.n,{length:state.cl5Prior.g})}</div></div>`
        : '';
      // the pill the user actually pressed, so the recorded reply matches it
      const chose3 = state.path==='direct' ? 'Clone as they are' : 'Change the access point';
      const CHOICE = ()=> CL3_CHOICE(false, chose3);
      const TARGETREQ = ()=> userBubble(CL3_TARGET_PROMPT);
      const FIXREQ3 = ()=> userBubble(USE_BODY_PROMPT);
      // everything recorded before the plan starts running
      const beforeClone3 = ()=> CHOICE()
        + `<div class="convoTurn">${CL3_ASK_TARGET()}</div>`
        + `<div class="convoTurn">${TARGETREQ()}${CL3_UNDERSTOOD(false)}</div>`
        + `<div class="convoTurn">${CL3_NAMING(false)}`;
      /* everything from `wclones` on also replays the fields readback */
      const beforeClone3b = ()=> beforeClone3() + CL3_FIELDS_CARD(nSel,false);
      /* The user supplies copy for EVERY flagged clone in ONE prompt, naming
         each one — the creatives differ, so the copy is per experience even
         though it arrives together. */
      const cloneName = (i)=> (cloneRows[i]||{}).exp || 'the clone';
      const allNames = cloneRows.map(r=>r.exp);
      const FIXALL = ()=> userBubble(cl3FixBubble(allNames));
      // the guardrail turn (if this run came through scenario 5) sits ABOVE
      // the new selection thread, as the history it is
      body += cl5Prelude();
      let tail = selThread(nSel) + PC_REQ();
      if(c==='reading')         tail += agentLoader('Reading your request', state.tasks||[]);
      else if(c==='choice')     tail += CL3_CHOICE(true);
      // ── 3a: clone as they are ──
      else if(c==='cloning')    tail += CHOICE() + `<div class="convoTurn">${CL3_NAMING(false,true)}</div><div class="convoTurn">${agentLoader(`Cloning ${nSel} experience${nSel===1?'':'s'}`, state.tasks||[])}</div>`;
      else if(c==='done3a')     tail += CHOICE() + `<div class="convoTurn">${CL3_NAMING(false,true)}</div><div class="convoTurn">${CLONE_DONE(nSel)}</div>`;
      // ── 3b: change access point + template, clone, then supply the copy ──
      else if(c==='reading2')   tail += CHOICE() + `<div class="convoTurn">${agentLoader('Checking the access points', state.tasks||[])}</div>`;
      else if(c==='asking')     tail += CHOICE() + `<div class="convoTurn">${CL3_ASK_TARGET()}</div>`;
      else if(c==='targeting')  tail += CHOICE() + `<div class="convoTurn">${CL3_ASK_TARGET()}</div><div class="convoTurn">${TARGETREQ()}${agentLoader('Mapping the change', state.tasks||[])}</div>`;
      else if(c==='intent')     tail += CHOICE() + `<div class="convoTurn">${CL3_ASK_TARGET()}</div><div class="convoTurn">${TARGETREQ()}${CL3_UNDERSTOOD(true)}</div>`;
      // the naming card sits on BOTH paths; on `direct` there is no intent card before it
      else if(c==='wnaming')    tail += CHOICE() + (state.path==='direct' ? '' : `<div class="convoTurn">${CL3_ASK_TARGET()}</div><div class="convoTurn">${TARGETREQ()}${CL3_UNDERSTOOD(false)}</div>`) + `<div class="convoTurn">${agentLoader('Preparing the copies', state.tasks||[])}</div>`;
      else if(c==='naming')     tail += CHOICE() + (state.path==='direct' ? '' : `<div class="convoTurn">${CL3_ASK_TARGET()}</div><div class="convoTurn">${TARGETREQ()}${CL3_UNDERSTOOD(false)}</div>`) + `<div class="convoTurn">${CL3_NAMING(true, state.path==='direct')}</div>`;
      else if(c==='wfields')    tail += beforeClone3() + agentLoader('Checking the new template', state.tasks||[]) + `</div>`;
      else if(c==='fields')     tail += beforeClone3() + CL3_FIELDS_CARD(nSel,true) + `</div>`;
      else if(c==='wclones')    tail += beforeClone3b() + agentLoader(`Cloning ${nSel} experience${nSel===1?'':'s'}`, state.tasks||[]) + `</div>`;
      else if(c==='clonesErr')  tail += beforeClone3b() + CL3_CLONES_ERR(nSel) + `</div>`;
      else if(c==='fixingAll')  tail += beforeClone3b() + CL3_CLONES_ERR(nSel) + `</div>`
                                     + `<div class="convoTurn">${FIXALL()}${agentLoader('Applying the copy', state.tasks||[])}</div>`;
      else if(c==='verified')   tail += beforeClone3b() + CL3_CLONES_ERR(nSel) + `</div>`
                                     + `<div class="convoTurn">${FIXALL()}${CL3_VERIFIED(nSel)}</div>`;
      body += `<div class="convoTurn">${tail}</div>`;
    }
    else if(state.cl2!==undefined){
      const c = state.cl2;
      const nSel = state.asked || n || 1;
      const cloneName = (i)=>cloneRows[i] ? cloneRows[i].exp : 'experience'+CLONE_SUFFIX;
      const NAMING = ()=> CL2_NAMING(false);
      const KEEPREQ = ()=> userBubble(CL2_KEEP_PREFIX_PROMPT);
      const FIXREQ2 = ()=> userBubble(USE_BODY_PROMPT);
      // the transcript of every task already approved, before task `upto`
      const priorTasks = (upto)=>{
        let s='';
        for(let i=0;i<upto;i++){
          if(i===0) s += CL2_REVIEW_ERR(cloneName(0)) + `<div class="convoTurn">${FIXREQ2()}${CL2_REVIEW_FIXED(cloneName(0),false)}</div>`;
          else s += CL2_REVIEW_OK(cloneName(i),i,nSel,false);
        }
        return s;
      };
      // everything recorded before the plan runs
      const beforePlan2 = ()=> NAMING() + `<div class="convoTurn">${KEEPREQ()}`;
      let tail = selThread(nSel) + userBubble(CLONE2_PROMPT);
      const m = /^([tw])(\d+)$/.exec(c);
      if(c==='reading')       tail += agentLoader('Reading your request', state.tasks||[]);
      else if(c==='naming')   tail += CL2_NAMING(true);
      else if(c==='planning') tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${agentLoader('Creating a plan', state.tasks||[])}</div>`;
      else if(c==='plan')     tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,0,-1,true)}</div>`;
      else if(c==='t0err')    tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,0,-1)}${CL2_REVIEW_ERR(cloneName(0))}</div>`;
      else if(c==='t0fix')    tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,0,0)}${CL2_REVIEW_ERR(cloneName(0))}</div><div class="convoTurn">${FIXREQ2()}${agentLoader('Updating the body copy', state.tasks||[])}</div>`;
      else if(c==='t0fixed')  tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,0,-1)}${CL2_REVIEW_ERR(cloneName(0))}</div><div class="convoTurn">${FIXREQ2()}${CL2_REVIEW_FIXED(cloneName(0),true)}</div>`;
      else if(m){
        const i = +m[2];
        const executing = m[1]==='w';
        tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,i,executing?i:-1)}${priorTasks(i)}`
             + (executing ? agentLoader(`Creating ${cloneName(i)}`, state.tasks||[]) : CL2_REVIEW_OK(cloneName(i),i,nSel,true))
             + `</div>`;
      }
      else if(c==='wall')     tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,nSel,nSel)}${priorTasks(nSel)}${agentLoader('Reviewing all the clones', state.tasks||[])}</div>`;
      else if(c==='allrev')   tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,nSel,-1)}${priorTasks(nSel)}${CL2_REVIEW_ALL(nSel,true)}</div>`;
      else if(c==='done')     tail += NAMING() + `<div class="convoTurn">${KEEPREQ()}${CL2_PLAN(nSel,nSel+1,-1)}${priorTasks(nSel)}${CL2_REVIEW_ALL(nSel,false)}${CL2_DONE(nSel)}</div>`;
      body += `<div class="convoTurn">${tail}</div>`;
    }
    // on the clone-results view the rows are copies, not a selection: render the
    // checkboxes unchecked (indices there refer to clone rows, not PC_ROWS)
    /* while the copy is being applied the CANVAS loads too, not just the
       conversation — the rows are about to change. */
    /* Any state whose outcome is a NEW canvas output loads the canvas as well
       as the conversation — a loader in one pane only reads as a stall. */
    const canvasBusy = ['fixingAll','cloning','wclones'].includes(state.cl3)
      || state.pc==='cloning' || state.cl4==='wall4';
    table = canvasBusy
      ? skeletonTable(anyFlagged&&onCloneResults?PC_COLS_QA:PC_COLS,true)
      : tableHTML(anyFlagged&&onCloneResults?PC_COLS_QA:PC_COLS,rows,{checkbox:true,select:true,selected:onCloneResults?new Set():sel,
          /* scenario 5 only, and only after the USER picks Access point from the
             dropdown. cl4Groups gives {ap,idx} with GLOBAL row indices, which
             is exactly the shape tableHTML's group bands want. */
          ...(state.groupBy && isCl5 && !onCloneResults ? {groups: cl4Groups([...Array(SRC.length).keys()]).map(g=>({label:g.ap, idx:g.idx}))} : {})});
  }
  // The chip belongs to the search selection. Once the copies exist the canvas
  // has moved to its own view and that selection is spent, so the chip goes.
  const chip = (n && !onCloneResults) ? n+' experience'+(n===1?'':'s')+' selected' : '';
  // scenario 1's ask, scenario 2's ask, or the body-copy fix auto-typed on the error
  const draft = (state.cl5==='mixed' && state.retyped) ? CLONE_PROMPT
      : (state.typed && state.pc===undefined && state.cl2===undefined && state.cl3===undefined && state.cl4===undefined && state.cl5===undefined)
      ? (scenario==='cl2' ? CLONE2_PROMPT : CLONE_PROMPT)
      : (state.cl2==='t0err' && state.fixTyped) ? USE_BODY_PROMPT
      // scenario 3: the target access point, then the body copy, auto-type in turn
      : (state.cl3==='asking' && state.tgtTyped) ? CL3_TARGET_PROMPT
      : (state.cl3==='clonesErr' && state.fixTyped) ? USE_BODY_PROMPT : '';
  /* Task tracker at the top of the panel. Scenario 1 has no multi-task plan so
     it shows none; scenario 2 runs n+1 tasks, and the tracker names the REAL
     task even when the plan table collapsed its row into a span. Easy to
     forget in a single state-keyed scene — there is no per-task
     artifactScreen({step}) call to copy. */
  let stepPair = null;
  // scenario 3 has no plan any more, so it shows no task tracker
  if(state.cl2!==undefined){
    const nSel = state.asked || n || 1;
    const labels = cl2TaskLabels(nSel);
    const c = state.cl2, mm = /^([tw])(\d+)$/.exec(c);
    if(mm) stepPair = [`${(+mm[2])+1}.  ${labels[+mm[2]]}`, mm[1]==='w'];
    else if(c==='t0err'||c==='t0fixed') stepPair = [`1.  ${labels[0]}`, false];
    else if(c==='t0fix') stepPair = [`1.  ${labels[0]}`, true];
    else if(c==='wall')  stepPair = [`${nSel+1}.  ${labels[nSel]}`, true];
    else if(c==='allrev'||c==='done') stepPair = [`${nSel+1}.  ${labels[nSel]}`, false];
  }
  /* Scenario 4b runs a per-GROUP plan, so it gets the tracker too. The group
     index is in the state string, so one regex names any group's task. It
     starts only once the plan is approved: 'reading'/'grouped'/'planning'/
     'plan' are before any task, and 4a ('wall4'/'doneall') has no plan at all.
     The CHECK means the task is FINISHED, so a group only earns it at
     g{i}done, once its clones exist. g{i}ask is IDLE mid-task — the agent has
     asked which access point to clone to and is waiting on the user — so it shows
     the dashed NUMBER, not the spinner (a spinner there claims work is running
     when nothing is). Third slot of stepPair carries that number. */
  else if(state.cl4!==undefined && state.path==='change'){
    const G = cl4G.length ? cl4G : cl4Groups([...sel]);
    const labels = cl4TaskLabels(G);
    const c = state.cl4, mm = /^g(\d+)(load|ask|map|int|wcl|done)$/.exec(c);
    if(mm){
      const gi = +mm[1], st = mm[2];
      if(labels[gi]) stepPair = [`${gi+1}.  ${labels[gi]}`,
        (st==='load'||st==='map'||st==='wcl'), (st==='ask'||st==='int') ? gi+1 : 0];
    }
    else if(c==='wallrev') stepPair = [`${G.length+1}.  ${labels[G.length]}`, true];
    else if(c==='allrev'||c==='done') stepPair = [`${G.length+1}.  ${labels[G.length]}`, false];
  }
  const panel = (extra={})=> aiPanel({
    body, chip, draft,
    ...(stepPair ? {step:stepPair[0], stepLoading:stepPair[1], stepNum:stepPair[2]||0} : {}),
    ...extra
  });

  /* ── Scenario 4 canvas: STICKY on the last thing the agent CREATED ──
     The canvas never reverts. Asking for a destination creates nothing, so the
     canvas keeps showing the previous batch's clones; only a completed clone
     (or the final compile) replaces it.
       nothing created yet  → the search results
       g{i}wcl              → skeleton (a batch is being created)
       g{i}done             → THAT batch's clones
       g{i+1}load / ask     → still batch i's clones (nothing new yet)
       wallrev              → skeleton
       allrev / done        → every clone, grouped by access point (accordion)
     `cl4Display` is computed here so the row-click drill-down can index the
     SAME rows the table rendered — otherwise it opened the source experience. */
  let cl4Display = null;
  if(!loading && !phase && state.cl4!==undefined){
    const c = state.cl4;
    const G = cl4G.length ? cl4G : cl4Groups([...sel]);
    const CLONE_COLS = [...PC_COLS.slice(0,4),
      {label:'Access point',key:'ap',editedKey:'apChanged'},
      {label:'Template',key:'tmpl'}, ...PC_COLS.slice(6)];
    // one batch's clones, as rows
    const batchClones = (g)=>{
      const grp=G[g]; if(!grp) return [];
      let off=0; for(let x=0;x<g;x++) off += G[x].idx.length;
      return grp.idx.map((i,k)=>({
        ...CL4_ROWS[i],
        exp: CL4_ROWS[i].exp.replace('…','') + CLONE_SUFFIX,
        eid: CLONE_EIDS[(off+k) % CLONE_EIDS.length],
        status:'Draft', ver:'v1', ap: cl4Dest(g), mod: CLONE_STAMP,
        apChanged: true,
      }));
    };
    const mDone = /^g(\d+)(wcl|done)$/.exec(c);
    const mWait = /^g(\d+)(load|ask|map|int)$/.exec(c);
    if(mDone){
      const g=+mDone[1];
      cl4Display = {rows:batchClones(g), cols:CLONE_COLS, groups:null,
                    title:`Cloned experiences - ${cl4Dest(g)}`, busy:mDone[2]==='wcl'};
    } else if(mWait){
      const g=+mWait[1];
      // nothing new created yet: stay on the PREVIOUS batch's clones
      if(g>0) cl4Display = {rows:batchClones(g-1), cols:CLONE_COLS, groups:null,
                            title:`Cloned experiences - ${cl4Dest(g-1)}`, busy:false};
    } else if(c==='wallrev' || c==='allrev' || c==='done'){
      const all=[]; const groups=[];
      G.forEach((grp,g)=>{
        const start=all.length;
        batchClones(g).forEach(r=>all.push(r));
        groups.push({label: cl4Dest(g), idx: all.map((_,k)=>k).slice(start)});
      });
      cl4Display = {rows:all, cols:CLONE_COLS, groups,
                    title:`Cloned experiences - ${CL4_PROJECT}`, busy:c==='wallrev'};
    }
    if(cl4Display && state.expDrill===undefined){
      const table = cl4Display.busy
        ? skeletonTable(cl4Display.cols,true)
        : tableHTML(cl4Display.cols, cl4Display.rows,
            {checkbox:true, select:true, selected:new Set(),
             ...(cl4Display.groups?{groups:cl4Display.groups}:{})});
      return `<div class="content">${topbar(CL4_CRUMB)}<div class="scroll"><div class="pad">
        <h2 class="page-h">${cl4Display.title}</h2>
        ${rxToolbarCl4(cl4Display.groups?'Access points':'')}
        ${table}
      </div></div></div>` + panel();
    }
  }

  /* Scenario 3b has no per-task canvas: the clone list stays on screen and
     skeletons while the copy is applied (the `fixingAll` table branch). */

  // experience drill-down replaces the canvas (row click); the panel keeps the
  // conversation. `rows` is the clone list on the results view, so a clone row
  // drills into the COPY (Draft, Clone- name), not the experience it came from.
  if(!loading && !phase && state.expDrill!==undefined && state.expDrill!==null){
    /* On a scenario-4 canvas the table renders `cl4Display.rows`, not `rows`,
       so the drill-down has to index THAT array — otherwise clicking a clone
       opened its source experience (Published / v3 / old access point). */
    const dr = (cl4Display && cl4Display.rows[state.expDrill]) || rows[state.expDrill];
    /* A flagged clone must drill in LOOKING flagged: the QA badge next to
       Draft, the field error under BODY, and the un-fixed copy. Without these
       it rendered clean and the error existed only in the chat. Both changed
       fields are highlighted, because both differ from the source. */
    const chg = isCl3b || cl4Changed;
    const onCl4Clone = !!(cl4Display && cl4Display.rows[state.expDrill]);
    /* ONE status badge: the row's own status already reads Error when the clone
       fails validation, so no separate QA badge beside it. */
    const extra = (onCloneResults || onCl4Clone)
      ? {name:dr.exp, status:dr.status, ver:dr.ver, eid:dr.eid,
         ...(chg ? {hlAp:true, hlTmpl:true, tmpl:dr.tmpl, ap:dr.ap,
                    bodyOver:needsCopy(state.expDrill), bodyEdited:cl3Edited,
                    qaBadge:false} : {})}
      : {};
    return expDrillCanvas(onCloneResults?CLONE_CRUMB:PC_CRUMB, dr, state, extra) + panel();
  }
  const total = rows.length;
  const pager = loading ? '' : `<div class="pager">
        <span>1-${total} of ${total} items</span>
        <span class="nav">${I.chevL}<span>Page</span><span class="box">1</span><span>of 1</span>${I.chevR}</span>
      </div>`;
  // The clone lands in its OWN view listing only the copies, so the heading,
  // breadcrumb and footer all change with it. Nothing is selected in that view
  // (it's a result, not a picker), so the selection bar reads 0 of n.
  // the heading has room for the full name; the crumb above it already ends in
  // the search project (…- Banking hellobox), so it stays short there
  // scenario 2 moved the copies to a new access point, so the view is named for THAT
  const heading = onCloneResults
    ? (isCl4 ? 'Cloned experiences'
      : (state.cl5==='doneall') ? `Cloned experiences - ${CL4_PROJECT}`
      : isCl2 ? CL2_VIEW_NAME : isCl3b ? CL3_VIEW_NAME : CLONE_VIEW_NAME)
    : ((isCl4||isCl5) ? 'QB Payroll IPD experiences' : 'QB Payroll IPD experiences using Banking - hellobox access point');
  const crumb = (isCl4||isCl5) ? CL4_CRUMB : (onCloneResults ? CLONE_CRUMB : PC_CRUMB);
  /* This scene's table is always FLAT — scenario 4's grouping lives on the
     cl4Display canvas (the final accordion), not on the search results — so
     the control shows the unset placeholder here. It is a string, not a
     boolean, so a future grouped view on this table just names its key. */
  /* Scenario 5 is the one flow where the USER sets the grouping: the guardrail
     message tells them their selection spans several access points, and they
     regroup the table themselves from this dropdown. The agent never regroups
     it (the canvas changes only when the agent PRODUCES something), so the
     label is driven by state.groupBy, which only a click sets. */
  const pcGroupedBy = (state.groupBy && !onCloneResults) ? state.groupBy : '';
  const selCount = onCloneResults ? 0 : n;
  const actN = (ic,label)=>`<span class="act ${selCount?'act--on':'act--off'}">${ic} ${label} (${selCount})</span>`;
  const content = `<div class="content${state.opening?' content--opening':''}">
    ${topbar(crumb)}
    <div class="scroll"><div class="pad">
      <h2 class="page-h">${heading}</h2>
      <div class="toolbar">
        <div class="search">${I.search}<span>Search</span></div>
        <span class="iconbtn">${I.sliders}</span>
        ${groupByCtl(pcGroupedBy, !!state.groupByOpen)}
      </div>
      ${table}
      ${pager}
    </div></div>
    <div class="selbar selbar--footer">${selCount} of ${total} selected
      <div class="acts">
        ${actN(I.keep,'Keep')}
        ${actN(I.minus,'Remove')}
        <span class="act act--view ${selCount?'act--on':'act--off'}">${I.eye} View (${selCount})</span>
      </div>
    </div>
  </div>`;
  return content + panel({opening:state.opening});
};

/* intake: full-screen boot → staggered messages → searching loader → results. */
/* the find-experiment intake: prompt -> project created -> search -> results */
/* The prompt asks for the ty25 Catchall experimentS (plural), so this IS a
   search: boot -> C1 -> C2 -> the results list, and the user picks one.
   (A prompt naming ONE experiment would open it directly instead — see the
   `ms-prototype-intake` skill.) */
/* SPECIFIC intake (ulDraft): the prompt names ONE experiment, so there is no
   results table — it opens directly. Same sequence as the search intake:
   boot -> C1 -> C2 -> the object; only the loader label and landing differ. */
function runIntakeXpOne(){
  const tasks=['Reading your request','Fetching the experiment','Compiling results'];
  const rest={pub:false};
  const tick=(a)=>render('xpDetail',{...rest,phase:'msg-search',tasks:tasks.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
  render('xpDetail',{...rest,phase:'bootfull'});
  const promptAt=2400, createdAt=promptAt+600, fetchAt=createdAt+900, fetchDur=4200;
  timers.push(setTimeout(()=>render('xpDetail',{...rest,phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('xpDetail',{...rest,phase:'msg-created'}),createdAt));
  timers.push(setTimeout(()=>tick(0),fetchAt));
  const slot=(fetchDur-600)/tasks.length;
  tasks.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),fetchAt+Math.round(slot*(i+1)))));
  const openAt=fetchAt+fetchDur;
  timers.push(setTimeout(()=>render('xpDetail',{...rest,loading:true,opening:true}),openAt));  // C2
  timers.push(setTimeout(()=>go('xpDetail',rest),openAt+2000));
}
function runIntakeXp(){
  const tasks=['Reading your request','Searching experiments','Compiling results'];
  const tick=(a)=>render('xpSearch',{phase:'msg-search',tasks:tasks.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
  render('xpSearch',{phase:'bootfull'});
  const promptAt=2400, createdAt=promptAt+600, searchAt=createdAt+900;
  timers.push(setTimeout(()=>render('xpSearch',{phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('xpSearch',{phase:'msg-created'}),createdAt));
  const searchDur=4800;
  timers.push(setTimeout(()=>tick(0),searchAt));
  const slot=(searchDur-600)/tasks.length;
  tasks.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),searchAt+Math.round(slot*(i+1)))));
  const openAt=searchAt+searchDur;
  timers.push(setTimeout(()=>render('xpSearch',{loading:true,opening:true}),openAt));   // C2
  timers.push(setTimeout(()=>go('xpSearch',{}),openAt+2000));
}

function runIntakePC(){
  const searchTasks=['Reading your brief','Searching QB Payroll IPD experiences','Compiling results'];
  const tick=(a)=>render('pcSearch',{phase:'msg-search',tasks:searchTasks.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
  render('pcSearch',{phase:'bootfull'});
  const promptAt=2400, createdAt=promptAt+600, searchAt=createdAt+900;
  timers.push(setTimeout(()=>render('pcSearch',{phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('pcSearch',{phase:'msg-created'}),createdAt));
  const searchDur=5400;
  timers.push(setTimeout(()=>tick(0),searchAt));
  const slot=(searchDur-600)/searchTasks.length;
  searchTasks.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),searchAt+Math.round(slot*(i+1)))));
  const openAt=searchAt+searchDur;
  timers.push(setTimeout(()=>render('pcSearch',{loading:true,opening:true}),openAt));
  timers.push(setTimeout(()=>go('pcSearch',{}),openAt+2000));
}

/* every runner rebuilds state from scratch, so carry the answers the user has
   already given (selection, name, field values, highlight toggle) explicitly —
   dropping one silently resets that card. */
function pcBase(){
  const st=current.state||{};
  const b={selected:[...(st.selected||[])],asked:(st.selected||[]).length,typed:true,fields:st.fields||{}};
  if(st.expName!==undefined) b.expName=st.expName;
  if(st.hl!==undefined) b.hl=st.hl;
  return b;
}
/* generic step runner for this flow: subtask loader → next resting state */
/* ---- LINK runners (flow 1: link an experience by ID) ---- */
function lkBase(){ return {typed:true}; }
function runLkRead(){
  const base={...lkBase(),lk:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the experience','Checking the experiment'],2600,
    {...base,lk:'intent'},'xpDetail');
}
/* Proceed on the intent -> the plan (PUBLISHED path only) */
function runLkPlan(){
  const base={...lkBase(),lk:'planning'};
  runPCStep(base,'Preparing the tasks',
    ['Reading the experiment','Checking what needs a draft','Ordering the tasks'],2400,
    {...base,lk:'plan'},'xpDetail');
}
/* run task i, which rests on its own canvas for review */
function runLkTask(i){
  const base={...lkBase(),lk:'w'+i};
  const subs=['Reading the experiment','Applying the change','Refreshing the list'];
  const dur=2400;
  const tick=(idx)=>render('xpDetail',{...base,tasks:subs.map((l,j)=>({label:l,state:j<idx?'done':j===idx?'active':'idle'}))});
  tick(0);
  const slot=(dur-600)/subs.length;
  subs.forEach((_,j)=>timers.push(setTimeout(()=>tick(j+1),Math.round(slot*(j+1)))));
  /* No approval gate: the next task follows on its own. `go()` calls
     clearTimers(), so the follow-on MUST be chained inside this callback — a
     timer queued alongside it would be wiped (same trap as the rollback build). */
  // every task RESTS for its own decision: task 1 an Approve, the last a Publish
  timers.push(setTimeout(()=>go('xpDetail',{...base,lk:'t'+i}),dur));
}
/* tasks run straight through: each one's loader finishes and the next starts,
   with no approval in between. The flow rests only at `done`. */
function runLkNext(i){
  if(i+1 < LK_TASKS.length) runLkTask(i+1);
  else go('xpDetail',{...lkBase(),lk:'done'});
}
/* DRAFT experiment: nothing to stage, so the intent card IS the confirmation
   and approving it links straight away (user, 2026-09-15 — same shape as the
   draft unlink flow). */
function runLkWork(){
  const base={...lkBase(),lk:'linking'};
  runPCStep(base,'Linking the experience',
    ['Reading the experiment','Linking the experience','Refreshing the list'],2600,
    {...base,lk:'done'},'xpDetail');
}
/* Publish -> the diagram's "ready to go live? YES" */
function runLkPublish(){
  const base={...lkBase(),lk:'publishing'};
  runPCStep(base,'Publishing the experiment',
    ['Publishing the draft','Linking the experience','Refreshing the list'],2900,
    {...base,lk:'published'},'xpDetail');
}

/* ---- MOVE runners (flow 3: unlink from X, link to Y) ---- */
/* The tab the user is looking at must SURVIVE the conversation (user,
   2026-09-16: "why does the tab move to creative on prompting if I'm in
   experiment tab?"). Every runner rebuilds state from here, so anything not
   carried forward is silently reset to the Creative default. */
function mvBase(){
  const st=current.state||{};
  const b={typed:true};
  if(st.expTab) b.expTab=st.expTab;
  if(st.creativeView) b.creativeView=st.creativeView;
  /* the continuation's ask has already been typed — don't retype it */
  if(st.typed2) b.typed2=true;
  if(st.verOpen!==undefined) b.verOpen=st.verOpen;
  return b;
}
/* the specific intake: boot -> C1 -> C2 -> the experience */
function runIntakeMv(){
  const tasks=['Reading your request','Fetching the experience','Compiling results'];
  const tick=(a)=>render('mvExp',{phase:'msg-search',tasks:tasks.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
  render('mvExp',{phase:'bootfull'});
  const promptAt=2400, createdAt=promptAt+600, fetchAt=createdAt+900, fetchDur=4200;
  timers.push(setTimeout(()=>render('mvExp',{phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('mvExp',{phase:'msg-created'}),createdAt));
  timers.push(setTimeout(()=>tick(0),fetchAt));
  const slot=(fetchDur-600)/tasks.length;
  tasks.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),fetchAt+Math.round(slot*(i+1)))));
  const openAt=fetchAt+fetchDur;
  timers.push(setTimeout(()=>render('mvExp',{loading:true,opening:true}),openAt));   // C2
  timers.push(setTimeout(()=>go('mvExp',{}),openAt+2000));
}
/* the move ask -> the AI plays back what changes */
function runMvRead(){
  const base={...mvBase(),mv:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the experiments','Checking the linked experiences'],2600,
    {...base,mv:'intent'},'mvExp');
}
/* Proceed on the intent -> the 5-task plan */
function runMvPlan(){
  const base={...mvBase(),mv:'planning'};
  runPCStep(base,'Preparing the tasks',
    ['Reading both experiments','Checking what needs a draft','Ordering the tasks'],2600,
    {...base,mv:'plan'},'mvExp');
}
/* Approve the plan -> run task i, which rests on its own canvas for review.
   Approving a task runs the next one; the last one finishes the flow. */
function runMvTask(i){
  const base={...mvBase(),mv:'w'+i};
  runPCStep(base, MV_TASKS[i],
    ['Reading the experiments','Applying the change','Refreshing the view'],2400,
    {...base,mv:'t'+i},'mvExp');
}
/* Publishing X is its own beat: a publishing loader, then X rests as
   PUBLISHED (`p1`) so the user sees the state change they just caused,
   with an Approve to carry on to task 3. */
function runMvPublish(i){
  const base={...mvBase(),mv:'pw'+i};
  runPCStep(base, `Publishing ${MV_FROM}`,
    ['Validating the draft','Publishing the experiment','Refreshing the view'],2600,
    {...base,mv:'p'+i},'mvExp');
}
function runMvNext(i){
  /* task 4 rests with its own Publish pill, so nothing auto-advances past it */
  if(i+1 < MV_TASKS.length) runMvTask(i+1);
}
/* task 4's Publish taken directly: Y goes live with the moved experience */
/* task 4's Publish: Y goes live, then the closing summary */
function runMvPublishTo(){
  const base={...mvBase(),mv:'pubTo'};
  runPCStep(base,`Publishing ${MV_TO}`,
    ['Validating the draft','Publishing the experiment','Refreshing the view'],2600,
    {...base,mv:'donePub'},'mvExp');
}
/* ---- the CONTINUATION runners: task 4's Publish left un-taken, the user
   types a second ask instead. No plan — both experiments are drafts already. */
function runMv2Read(){
  const base={...mvBase(),mv:'c2reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the experience','Checking the draft'],2600,
    {...base,mv:'c2intent'},'mvExp');
}
function runMv2Link(){
  const base={...mvBase(),mv:'c2working'};
  runPCStep(base,'Linking the experience',
    ['Reading the draft','Linking the experience','Refreshing the list'],2400,
    {...base,mv:'c2done'},'mvExp');
}
function runMv2Publish(){
  const base={...mvBase(),mv:'c2publishing'};
  runPCStep(base,`Publishing ${MV_TO}`,
    ['Validating the draft','Publishing the experiment','Refreshing the view'],2600,
    {...base,mv:'c2published'},'mvExp');
}

/* ---- UNLINK runners ---- */
function ulBase(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  const b={selected:sel, asked:sel.length||st.asked||1, typed:true};
  if(st.pub===false) b.pub=false;
  return b;
}
/* the ask -> the AI reads it and plays back what it will do */
function runUlRead(){
  const base={...ulBase(),ul:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the experiment','Checking the linked experiences'],2600,
    {...base,ul:'intent'},'xpDetail');
}
/* Approve on the intent -> the plan */
function runUlPlan(){
  const base={...ulBase(),ul:'planning'};
  runPCStep(base,'Preparing the tasks',
    ['Reading the experiment','Checking what needs staging','Ordering the tasks'],2400,
    {...base,ul:'playback'},'xpDetail');
}
/* Approve on the plan: a PUBLISHED experiment gets a DRAFT to confirm first;
   an unpublished one is already a draft, so it unlinks straight away. */
function runUlPlanApprove(){
  const pub=(current.state||{}).pub!==false;
  if(!pub) return runUlWork();
  const base={...ulBase(),ul:'staging'};
  runPCStep(base,'Creating the draft',
    ['Creating the draft','Copying the linked experiences','Preparing the change'],2600,
    {...base,ul:'stagereview'},'xpDetail');
}
/* Publish -> the draft goes live; the experiment is Published again without the
   unlinked experiences. */
function runUlPublish(){
  const base={...ulBase(),ul:'publishing'};
  runPCStep(base,'Publishing the experiment',
    ['Publishing the draft','Applying the change','Refreshing the list'],2900,
    {...base,ul:'published'},'xpDetail');
}
/* Approve on the draft confirmation -> perform the unlink, staying on the draft
   with those experiences gone */
function runUlWork(){
  const base={...ulBase(),ul:'working'};
  runPCStep(base,'Unlinking the experiences',
    ['Applying the change','Unlinking the experiences','Refreshing the list'],2900,
    {...base,ul:'done'},'xpDetail');
}

/* `scene` defaults to pcSearch (every clone flow runs there); the experiment
   flows pass their own scene so the loader ticks render the right screen. */
function runPCStep(base, label, subs, dur, nextState, scene='pcSearch'){
  const tick=(idx)=>render(scene,{...base,tasks:subs.map((l,j)=>({label:l,state:j<idx?'done':j===idx?'active':'idle'}))});
  tick(0);
  const slot=(dur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),Math.round(slot*(i+1)))));
  timers.push(setTimeout(()=>go(scene,nextState),dur));
}
/* the ask → AI reads it and comes back with the clone confirmation */
function runPCUnderstand(){
  const st=current.state, sel=[...(st.selected||[])];
  const base={selected:sel,asked:sel.length,typed:true,pc:'reading'};
  runPCStep(base,'Reading your request',['Reading your request','Checking the selected experiences','Checking the access point'],2600,
    {...base,pc:'understood'});
}
/* "Looks good" on the confirmation → clone them → done. Scenario 1's only
   execution step: the copies are exact duplicates, so there is nothing to
   review in between. */
function runClone(){
  const st=current.state, sel=[...(st.selected||[])];
  const nSel=sel.length||1;
  const base={selected:sel,asked:nSel,typed:true,pc:'cloning'};
  runPCStep(base,`Cloning ${nSel} experience${nSel===1?'':'s'}`,
    ['Reading the selected experiences','Copying the settings','Creating the copies'],2900,
    {...base,pc:'done'});
}
/* ============================================================
   SCENARIO 2 runners. Every runner rebuilds state from scratch, so carry the
   selection forward explicitly (cl2Base) — dropping it resets the flow.
   ============================================================ */
function cl2Base(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  return {selected:sel, asked:sel.length||st.asked||1, typed:true};
}
const cl2N = ()=> { const st=current.state||{}; return (st.selected||[]).length || st.asked || 1; };
/* the combined ask → AI reads it and offers the naming choice */
function runCl2Understand(){
  const base={...cl2Base(),cl2:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the new access point','Checking the selected experiences'],2600,
    {...base,cl2:'naming'});
}
/* "Use the Clone prefix" → planning loader → the n+1 task plan */
function runCl2Plan(){
  const base={...cl2Base(),cl2:'planning'};
  runPCStep(base,'Creating a plan',
    ['Reading your inputs','Checking each experience','Ordering the tasks'],3400,
    {...base,cl2:'plan'});
}
/* Approve on the plan → task 1, which lands on the body-copy error */
function runCl2Task0(){
  const base={...cl2Base(),cl2:'w0'};
  runPCStep(base,'Creating the first clone',
    ['Copying the settings','Moving it to the new access point','Checking the creative'],2900,
    {...base,cl2:'t0err'});
}
/* the user sends shorter copy → canvas + panel both load → corrected */
function runCl2BodyFix(){
  const base={...cl2Base(),cl2:'t0fix'};
  runPCStep(base,'Updating the body copy',
    ['Reading your copy','Checking the character limit','Updating the creative'],2600,
    {...base,cl2:'t0fixed'});
}
/* Approve on task i → run task i+1, or the final all-clones review */
function runCl2Task(i){
  const n=cl2N();
  if(i>=n){                      // past the per-clone tasks: review them all
    const base={...cl2Base(),cl2:'wall'};
    runPCStep(base,'Reviewing all the clones',
      ['Collecting the clones','Checking the access points','Compiling the list'],2600,
      {...base,cl2:'allrev'});
    return;
  }
  const base={...cl2Base(),cl2:'w'+i};
  runPCStep(base,`Creating clone ${i+1}`,
    ['Copying the settings','Moving it to the new access point','Checking the creative'],2600,
    {...base,cl2:'t'+i});
}
/* Approve on the all-clones review → done */
function runCl2Done(){ go('pcSearch',{...cl2Base(),cl2:'done'}); }

/* ============================================================
   SCENARIO 3 runners. `path` records which pill the user took so the
   transcript replays correctly after any re-render.
   ============================================================ */
function cl3Base(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  const b={selected:sel, asked:sel.length||st.asked||1, typed:true};
  if(st.path) b.path=st.path;
  // carried through every cl3 state so scenario 5's guardrail stays in the
  // transcript for the whole run, not just the first step after it
  if(st.cl5Prior) b.cl5Prior=st.cl5Prior;
  // the USER chose this grouping; it must not silently reset when the flow
  // continues into the clone conversation
  if(st.groupBy) b.groupBy=st.groupBy;
  return b;
}
/* the plain clone ask → AI comes back with the CHOICE */
function runCl3Understand(extra={}){
  const base={...cl3Base(),...extra,cl3:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the selected experiences','Checking their access points'],2600,
    {...base,cl3:'choice'});
}
/* 3a: "Clone as they are" → settle the NAMING first (user, 2026-09-09: the
   prefix must be stated before any copy exists on BOTH paths) */
function runCl3NamingDirect(){
  const base={...cl3Base(),path:'direct',cl3:'wnaming'};
  runPCStep(base,'Preparing the copies',
    ['Reading your choice','Checking naming conventions','Preparing the copies'],2200,
    {...base,cl3:'naming'});
}
/* 3a: naming approved → the clone */
function runCl3Direct(){
  const n=(current.state.selected||[]).length||1;
  const base={...cl3Base(),path:'direct',cl3:'cloning'};
  runPCStep(base,`Cloning ${n} experience${n===1?'':'s'}`,
    ['Reading the selected experiences','Copying the settings','Creating the copies'],2900,
    {...base,cl3:'done3a'});
}
/* 3b: "Change the access point" → the AI asks WHICH access point (no loader: it is
   a question, not work) */
function runCl3Ask(){
  const base={...cl3Base(),path:'change',cl3:'reading2'};
  runPCStep(base,'Checking the access points',
    ['Reading your choice','Checking the selected experiences','Checking the access points'],2200,
    {...base,cl3:'asking'});
}
/* the user names the access point AND template → AI maps the change */
function runCl3Target(){
  const base={...cl3Base(),path:'change',cl3:'targeting'};
  runPCStep(base,'Mapping the change',
    ['Reading your request','Checking the new access point','Checking the new template'],2600,
    {...base,cl3:'intent'});
}
/* approve the intent → settle the NAMING before anything is created */
function runCl3Naming(){
  const base={...cl3Base(),path:'change',cl3:'wnaming'};
  runPCStep(base,'Preparing the copies',
    ['Reading the change','Checking naming conventions','Preparing the copies'],2200,
    {...base,cl3:'naming'});
}
/* approve the naming → clone (no plan, no access point review) */
/* naming approved → the fields the new template needs, as a readback */
function runCl3Fields(){
  const base={...cl3Base(),path:'change',cl3:'wfields'};
  runPCStep(base,'Checking the new template',
    ['Saving the naming','Reading the template','Finding the fields it needs'],2400,
    {...base,cl3:'fields'});
}
function runCl3Clones(){
  const n=(current.state.selected||[]).length||1;
  const base={...cl3Base(),path:'change',cl3:'wclones'};
  runPCStep(base,`Cloning ${n} experience${n===1?'':'s'}`,
    ['Copying the settings','Moving them to the new access point','Checking each creative'],2900,
    {...base,cl3:'clonesErr'});
}
/* the user supplies copy for EVERY flagged clone in one prompt */
function runCl3FixAll(){
  const base={...cl3Base(),path:'change',cl3:'fixingAll'};
  runPCStep(base,'Applying the copy',
    ['Reading your copy','Applying it to each clone','Re-checking the creatives'],2900,
    {...base,cl3:'verified'});
}
function runCl3Done(){ const f=[...(current.state.fixes||[])];
  go('pcSearch',{...cl3Base(),path:'change',cl3:'done',fixes:f}); }

/* ============================================================
   SCENARIO 4 runners (varying access points).
   ============================================================ */
function cl4Base(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  const b={selected:sel, asked:sel.length||st.asked||1, typed:true};
  if(st.path) b.path=st.path;
  return b;
}
const cl4NGroups = ()=> cl4Groups([...(current.state.selected||[])]).length;
/* scenario 5: the clone ask → the agent checks the access points and declines.
   No cloning runner follows: `mixed` is the end of the flow. */
function runCl5Understand(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  /* Stamp the spanning selection's counts NOW. By the time the flow continues
     the user has narrowed to one access point, so recomputing later would render
     "spans 1 access points" in the replayed history. */
  const base={selected:sel, asked:sel.length||1, typed:true, cl5:'reading',
              cl5Prior:{n:sel.length||1, g:cl4Groups(sel).length}};
  runPCStep(base,'Checking the experiences',
    ['Reading your request','Checking the selected experiences','Comparing their access points'],2600,
    {...base,cl5:'choice'});
}
/* cl5 base, preserving the stamp and the user's grouping across transitions */
function cl5Base(){
  const st=current.state||{}, sel=[...(st.selected||[])];
  const b={selected:sel, asked:st.cl5Prior?st.cl5Prior.n:(sel.length||1), typed:true};
  if(st.cl5Prior) b.cl5Prior=st.cl5Prior;
  if(st.groupBy) b.groupBy=st.groupBy;
  if(st.path) b.path=st.path;
  return b;
}
/* "Clone as they are" → the Clone- PREFIX is confirmed before anything is
   created, exactly as 4a does it (user, 2026-09-10: this step was missing).
   The prefix must be stated before copies exist on every path. */
function runCl5NamingDirect(){
  const base={...cl5Base(),path:'direct',cl5:'wnaming'};
  runPCStep(base,'Preparing the copies',
    ['Reading your choice','Checking naming conventions','Preparing the copies'],2200,
    {...base,cl5:'naming'});
}
/* naming approved → nothing changes, so the limit never applies: clone every
   group at once, exactly like 4a. */
function runCl5Direct(){
  const n=(current.state.cl5Prior||{}).n || (current.state.selected||[]).length || 1;
  const base={...cl5Base(),path:'direct',cl5:'wall'};
  runPCStep(base,`Cloning ${n} experience${n===1?'':'s'}`,
    ['Reading each group','Copying the settings','Creating the copies'],2900,
    {...base,cl5:'doneall'});
}
/* "Change the access point" → THIS is where the one-access point-at-a-time limit
   bites, so the guardrail message lands here and nowhere else. */
function runCl5Change(){
  const base={...cl5Base(),path:'change',cl5:'reading2'};
  runPCStep(base,'Checking the access points',
    ['Reading your request','Checking the selected experiences','Comparing their access points'],2400,
    {...base,cl5:'mixed'});
}
/* the clone ask → the agent groups the selection and plays it back */
function runCl4Understand(){
  const base={...cl4Base(),cl4:'reading'};
  runPCStep(base,'Reading your request',
    ['Reading your request','Checking the selected experiences','Checking their access points'],2900,
    {...base,cl4:'grouped'});
}
/* 4a: clone as they are → settle the NAMING first, same as 4b */
function runCl4NamingDirect(){
  const base={...cl4Base(),path:'direct',cl4:'wnaming'};
  runPCStep(base,'Preparing the copies',
    ['Reading your choice','Checking naming conventions','Preparing the copies'],2200,
    {...base,cl4:'naming'});
}
/* 4a: naming approved → every group at once */
function runCl4Direct(){
  const n=(current.state.selected||[]).length||1;
  const base={...cl4Base(),path:'direct',cl4:'wall4'};
  runPCStep(base,`Cloning ${n} experience${n===1?'':'s'}`,
    ['Reading each group','Copying the settings','Creating the copies'],2900,
    {...base,cl4:'doneall'});
}
/* 4b: start on group g and ask for its destination (a question, so no loader) */
function runCl4AskGroup(g){
  const base={...cl4Base(),path:'change',cl4:'g'+g+'load'};
  runPCStep(base, g===0?'Starting with the first group':'Starting on the next group',
    ['Reading the group','Checking its experiences','Preparing the change'],2200,
    {...base,cl4:'g'+g+'ask'});
}
/* "Change the access points" → the confirmation that stands in for a playback */
function runCl4Confirm(){
  const base={...cl4Base(),path:'change',cl4:'confirming'};
  runPCStep(base,'Checking the access points',
    ['Reading your choice','Checking each group','Preparing the changes'],2400,
    {...base,cl4:'confirm'});
}
/* Proceed on the confirmation → settle the NAMING */
function runCl4Naming(){
  const base={...cl4Base(),path:'change',cl4:'wnaming'};
  runPCStep(base,'Preparing the copies',
    ['Reading the change','Checking naming conventions','Preparing the copies'],2200,
    {...base,cl4:'naming'});
}
/* Proceed on the naming → a plan naming every access point */
function runCl4Plan(){
  const base={...cl4Base(),path:'change',cl4:'planning'};
  runPCStep(base,'Creating a plan',
    ['Reading the groups','Ordering the access points','Preparing the tasks'],3400,
    {...base,cl4:'plan'});
}
/* after the last group → the final review of everything cloned */
function runCl4AllReview(){
  const base={...cl4Base(),path:'change',cl4:'wallrev'};
  runPCStep(base,'Compiling the clones',
    ['Collecting the clones','Checking the access points','Compiling the list'],2600,
    {...base,cl4:'allrev'});
}
/* the user names the destination for group g → the agent plays the change back
   (user, 2026-09-11). It no longer clones straight from the reply. */
function runCl4MapGroup(g){
  const base={...cl4Base(),path:'change',cl4:'g'+g+'map'};
  runPCStep(base,'Mapping the change',
    ['Reading your request','Checking the new access point','Preparing the copies'],2400,
    {...base,cl4:'g'+g+'int'});
}
/* Approve on the group's playback → clone that group */
function runCl4CloneGroup(g){
  const G=cl4Groups([...(current.state.selected||[])]);
  const k=G[g]?G[g].idx.length:1;
  const base={...cl4Base(),path:'change',cl4:'g'+g+'wcl'};
  runPCStep(base,`Cloning ${k} experience${k===1?'':'s'}`,
    ['Reading your request','Applying the new access point','Creating the copies'],2600,
    {...base,cl4:'g'+g+'done'});
}
/* approve group g → the next group, or finish */
function runCl4NextGroup(g){
  if(g+1 < cl4NGroups()) runCl4AskGroup(g+1);
  else runCl4AllReview();                  // last group → review everything
}

/* "Looks good" on the understanding → AI asks for the new fields (no loader:
   it already knows which fields the access point adds) */
function runPCNaming(){
  const base={...pcBase(),pc:'namingWait',expName:current.state.expName};
  runPCStep(base,'Naming the new experience',['Reading the change','Checking naming conventions','Drafting a name'],2400,{...base,pc:'naming'});
}
/* Proceed on the name card → the fields the new template adds */
function runPCFields(){
  const base={...pcBase(),pc:'fieldsWait'};
  runPCStep(base,'Checking the new template',['Saving the name','Reading the template','Finding the fields it needs'],2400,{...base,pc:'fields'});
}
/* Proceed on the field card → planning loader → plan */
function runPCPlan(){
  const base={...pcBase(),pc:'planning'};
  runPCStep(base,'Creating a plan',['Reading your inputs','Mapping requested changes','Ordering the tasks'],3400,{...base,pc:'plan'});
}
/* "Looks good" on the plan → task 1: update the access point AND template */
function runPCPlacement(){
  const base={...pcBase(),pc:'updating'};
  runPCStep(base,'Updating the access point and template',['Updating the access point','Applying the new template','Carrying over the creative values'],2900,{...base,pc:'placement'});
}
/* the user supplies shorter body copy → canvas + panel both load → fixed copy */
function runPCBodyFix(){
  const base={...pcBase(),pc:'fixing'};
  runPCStep(base,'Updating the body copy',['Reading your copy','Checking the character limit','Updating the creative'],2600,{...base,pc:'bodyfixed'});
}
/* Approve on task 1 → task 2: create the new experience */
function runPCExperience(){
  const base={...pcBase(),pc:'building'};
  runPCStep(base,'Creating the new experience',['Carrying over the creative values','Applying the new fields','Creating the experience'],2900,{...base,pc:'experience'});
}
/* Approve on task 2 → done */
function runPCDone(){
  go('pcSearch',{...pcBase(),pc:'done'});
}

/* boot */
renderRail();
go('home',{});

/* keyboard: left/right step through flow; 'p' toggles autopilot; 'r' restarts guided run */
/* resting (non-loading) default state for each scene, so arrow-key nav in BOTH
   directions lands each step in its correct finished state — no restart needed. */
const FLOW_STATE = {
  home:{},
  pcSearch:{},
  searchMultiple:{},
  singleCampaign:{view:'table'},
  coIntent:{view:'table'},
  billing:{},
  experiments:{},
  campaignObject:{view:'table'},
  campaignTree:{view:'tree',tab:'experiences'},
  coIntentWB:{},
  ipdContent:{},
  campaignObjectWB:{view:'table'},
  campaignTreeWB:{view:'tree',tab:'experiences'},
  p2Intent:{},
  p2Ipd:{},
  p2Review:{view:'table'},
  p2Tree:{view:'tree',tab:'experiences'},
  crIntent:{},
  crMeta:{},
  crAudience:{},
  crCreative:{},
  crExperiment:{},
  crSummary:{view:'tree'},
  crTree:{view:'tree',tab:'meta'},
};
/* arrow-key navigation walks KEY STATES, not just scenes — every step of this
   flow lives inside pcSearch keyed by state. */
// scenario 1 clones MULTIPLE experiences, so the walked-through demo selects
// three rows rather than the single row the access point-change flow used
const CLONE_SEL = [1,2,4];
const PC_S = (pc,extra={})=>['pcSearch',{selected:[...CLONE_SEL],asked:CLONE_SEL.length,typed:true,pc,...extra}];
const STEPS_PC = [
  ['home',{}],
  ['pcSearch',{}],
  ['pcSearch',{selected:[...CLONE_SEL],typed:true}],
  PC_S('understood'),
  PC_S('done'),
];
/* scenario 2 walks the naming card, the plan, task 1's error + fix, each
   remaining clone, the all-clones review, then done. Built from CLONE_SEL so
   it stays in step with the demo selection. */
const CL2_S = (cl2)=>['pcSearch',{selected:[...CLONE_SEL],asked:CLONE_SEL.length,typed:true,cl2}];
const CL2_ORDER = ['naming','plan','t0err','t0fixed',
  ...[...Array(CLONE_SEL.length-1)].map((_,k)=>'t'+(k+1)),   // t1..t(n-1)
  'allrev','done'];
const STEPS_CL2 = [
  ['home',{}],
  ['pcSearch',{}],
  ['pcSearch',{selected:[...CLONE_SEL],typed:true}],
  ...CL2_ORDER.map(CL2_S),
];
/* scenario 3 walks the CHOICE, then the 3b path end to end */
const CL3_S = (cl3,extra={})=>['pcSearch',{selected:[...CLONE_SEL],asked:CLONE_SEL.length,typed:true,path:'change',cl3,...extra}];
const CL3_ORDER = ['choice','asking','intent','naming','fields','clonesErr','verified'];
const STEPS_CL3 = [
  ['home',{}],
  ['pcSearch',{}],
  ['pcSearch',{selected:[...CLONE_SEL],typed:true}],
  ['pcSearch',{selected:[...CLONE_SEL],asked:CLONE_SEL.length,typed:true,cl3:'choice'}],
  ...CL3_ORDER.slice(1).map(c=>CL3_S(c)),
];
/* scenario 4's demo selection spans THREE access points (CL4_ROWS is 3 rows per
   AP, so 0-2 = AP1, 3-5 = AP2, 6-8 = AP3) — enough to show the per-group loop
   without making it endless. */
const CL4_SEL = [0,1,3,4,6];
const CL4_NG = 3;
const CL4_S = (cl4)=>['pcSearch',{selected:[...CL4_SEL],asked:CL4_SEL.length,typed:true,path:'change',cl4}];
const CL4_ORDER = ['grouped','confirm','naming','plan',
  ...Array.from({length:CL4_NG},(_,g)=>['g'+g+'ask','g'+g+'int','g'+g+'done']).flat(),
  'allrev'];
const STEPS_CL4 = [
  ['home',{}],
  ['pcSearch',{}],
  ['pcSearch',{selected:[...CL4_SEL],typed:true}],
  ['pcSearch',{selected:[...CL4_SEL],asked:CL4_SEL.length,typed:true,cl4:'grouped'}],
  ...CL4_ORDER.slice(1).map(CL4_S),
];
/* scenario 5 reuses cl4's mixed selection — it is the whole premise — and has
   exactly one resting state after the ask. */
const CL5_S = (cl5)=>['pcSearch',{selected:[...CL4_SEL],asked:CL4_SEL.length,typed:true,
  cl5Prior:{n:CL4_SEL.length,g:CL4_NG},
  ...(cl5==='mixed'?{path:'change'}:{}), cl5}];
const CL5_ORDER = ['choice','mixed'];
/* the narrowing the user performs by hand: regroup by access point, then
   reselect inside ONE group. Carries groupBy so the table renders grouped and
   cl5Prior so the guardrail turn stays in the transcript. */
const CL5_NARROW = [0,1,2];
const CL5_NARROWED = (extra={})=>['pcSearch',{selected:[...CL5_NARROW],asked:CL5_NARROW.length,
  typed:true, groupBy:'Access points', cl5Prior:{n:CL4_SEL.length,g:CL4_NG},
  ...(extra.cl3 ? {} : {path:'change', cl5:'mixed'}), ...extra}];
const STEPS_CL5 = [
  ['home',{}],
  ['pcSearch',{}],
  ['pcSearch',{selected:[...CL4_SEL],typed:true}],
  ...CL5_ORDER.map(CL5_S),
  CL5_NARROWED(),                                   // regrouped + reselected
  ...['choice','asking','intent','naming','fields','clonesErr','verified']
      .map(c=>CL5_NARROWED({path: c==='choice'?undefined:'change', cl3:c})),
];
/* the unlink walk: home -> search -> results -> the experiment -> each resting
   state of the conversation. Built LAZILY so it can never reference a constant
   declared further down the file. */
const STEPS_UL = (pub)=>{   // UL_SEL (the three DRY_test experiences) is declared above
  const S=(ul,extra={})=>['xpDetail',{selected:[...UL_SEL],asked:UL_SEL.length,typed:true,
    ...(pub?{}:{pub:false}), ul, ...extra}];
  return [
    ['home',{}],
    /* only the SEARCH intake has a results step; the specific intake goes
       straight from the prompt to the experiment (user, 2026-09-15). */
    ...(pub ? [['xpSearch',{}]] : []),
    ['xpDetail', pub?{}:{pub:false}],
    ['xpDetail',{selected:[...UL_SEL], ...(pub?{}:{pub:false}), typed:true}],
    S('intent'),
    // the draft path has no plan and nothing to stage: intent -> unlink
    ...(pub ? [S('playback'), S('stagereview')] : []),
    S('done'), S('published'),
  ];
};
/* flow 3: home -> the experience -> the ask -> intent -> plan -> done */
const STEPS_MV = ()=>{
  const S=(mv)=>['mvExp',{typed:true,mv}];
  return [ ['home',{}], ['mvExp',{}], S('intent'), S('plan'),
    ...MV_TASKS.map((_,i)=>S('t'+i)), S('done') ];
};
/* flow 1: home -> search -> the experiment -> the ask -> intent -> done -> published */
/* PUBLISHED: search intake, intent -> plan -> two tasks -> done -> published.
   DRAFT: specific intake (no xpSearch step), intent -> done -> published. */
const STEPS_LK = (pub)=>{
  const S=(lk)=>['xpDetail',{typed:true,...(pub?{}:{pub:false}),lk}];
  return [ ['home',{}],
    ...(pub ? [['xpSearch',{}]] : []),
    ['xpDetail', pub?{}:{pub:false}],
    S('intent'),
    ...(pub ? [S('plan'), ...LK_TASKS.map((_,i)=>S('t'+i))] : []),
    S('done'), S('published') ];
};
function FLOW_STEPS(){
  // only this build's scenarios; ulPub is the default for anything else
  if(scenario==='lkExp')   return STEPS_LK(true);
  if(scenario==='lkDraft') return STEPS_LK(false);
  if(scenario==='mvExp') return STEPS_MV();
  return STEPS_UL(scenario!=='ulDraft');
}
const PC_ORDER = ['understood','done'];
// map the CURRENT scene+state onto a step index so arrows resume from anywhere
function stepIndex(){
  const st=current.state||{};
  if(current.name==='home') return 0;
  // ── move flow: the experience, then its conversation states ──
  if(current.name==='mvExp'){
    // executing task states resolve to the resting task they head for
    let r = {reading:'intent',planning:'plan'}[st.mv] || st.mv || '';
    const m=/^w(\d+)$/.exec(r); if(m) r='t'+m[1];
    const ORDER=['intent','plan',...MV_TASKS.map((_,i)=>'t'+i),'done'];
    const i=ORDER.indexOf(r);
    return i===-1 ? 1 : i+2;
  }
  // ── unlink flow: xpSearch is step 1, then the experiment and its states ──
  if(current.name==='xpSearch') return 1;
  if(current.name==='xpDetail'){
    // ── link flow: its own order on this same scene ──
    if(st.lk!==undefined || scenario==='lkExp' || scenario==='lkDraft'){
      const lpub = st.pub!==false;
      let r = {reading:'intent',planning:'plan',linking:'done',publishing:'published'}[st.lk] || st.lk || '';
      const m=/^w(\d+)$/.exec(r); if(m) r='t'+m[1];
      const ORDER = lpub
        ? ['intent','plan',...LK_TASKS.map((_,i)=>'t'+i),'done','published']
        : ['intent','done','published'];
      const base = lpub ? 2 : 1;               // the draft path has no xpSearch step
      const i=ORDER.indexOf(r);
      return i===-1 ? base : i+base+1;
    }
    /* the draft path has no xpSearch step, so everything after `home` sits one
       index earlier than on the search path. */
    const base = st.pub===false ? 1 : 2;
    if(!st.ul) return (st.selected&&st.selected.length)?base+1:base;
    // executing states resolve to the resting state they are heading for
    const R={reading:'intent',planning:'playback',staging:'stagereview',working:'done',
             publishing:'published'};
    const r=R[st.ul]||st.ul;
    const ORDER = st.pub===false ? ['intent','done','published']
                                 : ['intent','playback','stagereview','done','published'];
    const i=ORDER.indexOf(r);
    return i===-1 ? base+1 : i+base+2;
  }
  if(current.name!=='pcSearch') return -1;
  if(st.pc){
    // in-flight states resolve to the resting step they're heading for
    const resolved = {reading:'understood',cloning:'done'}[st.pc] || st.pc;
    const i = PC_ORDER.indexOf(resolved);
    return i===-1 ? 3 : i+3;
  }
  if(scenario==='cl5' && st.cl3!==undefined){
    const R={reading:'choice', reading2:'asking', targeting:'intent',
             wnaming:'naming', wfields:'fields', wclones:'clonesErr',
             fixingAll:'verified'};
    const ORD=['choice','asking','intent','naming','fields','clonesErr','verified'];
    const i = ORD.indexOf(R[st.cl3]||st.cl3);
    return i===-1 ? 6 : i+6;          // step 5 is the narrowed selection
  }
  if(st.cl5!==undefined){
    // the narrowing step shares cl5:'mixed' with the guardrail; what separates
    // them is that the user has regrouped the table by then
    if(st.cl5==='mixed' && st.groupBy) return 5;
    // executing states resolve to the resting state they are heading for
    const R={reading:'choice', reading2:'mixed', wnaming:'choice', naming:'choice',
             wall:'choice', doneall:'choice'};
    const i = CL5_ORDER.indexOf(R[st.cl5]||st.cl5);
    return i===-1 ? 3 : i+3;
  }
  if(st.cl4!==undefined){
    const R={reading:'grouped',wall4:'grouped',doneall:'grouped',
             confirming:'confirm',wnaming:'naming',planning:'plan',wallrev:'allrev'};
    let r=R[st.cl4]||st.cl4;
    // executing group stages resolve to the resting stage they head for
    const m=/^g(\d+)(ask|map|int|wcl|done|load)$/.exec(r);
    if(m){ const st2={wcl:'done',load:'ask',map:'int'}[m[2]]||m[2]; r='g'+m[1]+st2; }
    const i=CL4_ORDER.indexOf(r);
    return i===-1 ? 3 : i+3;
  }
  if(st.cl3!==undefined){
    // executing states resolve to the resting state they are heading for
    const R={reading:'choice',cloning:'done3a',targeting:'intent',
             wnaming:'naming',wfields:'fields',wclones:'clonesErr',fixing:'clonesErr'};
    const r=R[st.cl3]||st.cl3;
    if(r==='done3a') return 3;                 // 3a ends right after the choice
    const i=CL3_ORDER.indexOf(r);
    return i===-1 ? 3 : i+3;
  }
  if(st.cl2!==undefined){
    // executing states resolve to the resting state they're heading for:
    // reading→naming, planning→plan, w0→t0err, t0fix→t0fixed, wN→tN, wall→allrev
    let r = st.cl2;
    if(r==='reading') r='naming';
    else if(r==='planning') r='plan';
    else if(r==='w0') r='t0err';
    else if(r==='t0fix') r='t0fixed';
    else if(r==='wall') r='allrev';
    else if(/^w\d+$/.test(r)) r='t'+r.slice(1);
    const i = CL2_ORDER.indexOf(r);
    return i===-1 ? 3 : i+3;
  }
  return (st.selected&&st.selected.length) ? 2 : 1;
}
function gotoStep(i){
  const steps=FLOW_STEPS();
  if(i<0 || i>=steps.length) return;
  autopilot=false; clearTimers();
  const [name,st]=steps[i];
  go(name, JSON.parse(JSON.stringify(st)));
}
document.addEventListener('keydown',(e)=>{
  // ignore while typing in the composer / any editable field, and with modifiers held
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
