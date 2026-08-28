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
  const body = rows.map((r,ri)=>{
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
  }).join('');
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
  place:[{label:'Placement name',key:'name',info:1},{label:'QA status',key:'status',badge:1},{label:'Template',key:'tmpl'},{label:'Impression cap',key:'cap'},{label:'No. of offers',key:'off'}],
  exp:[{label:'Experiment name',key:'name',info:1},{label:'QA status',key:'status',badge:1},{label:'ID',key:'id'},{label:'Start date',key:'start'},{label:'End date',key:'end',editedKey:'edited'}],
};

/* campaign-data section: table of the 4 sub-tables. endDate/edited drive diff */
// campaign-data tables carry the Last updated column (the task-canvas lists don't)
const withMod = (cols)=>[...cols,{label:'Last updated',key:'mod'}];
function campaignDataTables(endDate, edited){
  return `
    <div class="sec-label">Audiences</div>${tableHTML(withMod(COL.aud),AUDIENCES)}
    <div class="sec-label">Placement</div>${tableHTML(withMod(COL.place),PLACEMENTS)}
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
const NODE_COLORS={segment:'var(--node-segment)',experiment:'var(--node-experiment)',billing:'var(--node-billing)',placement:'var(--node-placement)',campaign:'var(--node-campaign)',treatment:'var(--node-experiment)',uipattern:'var(--node-placement)',template:'var(--node-placement)'};
// tile glyphs = real DS icons tinted WHITE (Figma: icon-inverse on the colored tile)
const whiteIcon=(name)=>`<span class="tile-ico">${icon(name,16)}</span>`;
const NODE_ICON={segment:whiteIcon('personThree'),experiment:whiteIcon('beaker'),billing:whiteIcon('percent'),placement:whiteIcon('thumbnail'),campaign:whiteIcon('megaphone'),treatment:whiteIcon('beaker'),uipattern:whiteIcon('thumbnail'),template:whiteIcon('thumbnail')};
// which node ids are expanded (persists across re-renders within a scene)
let treeExpanded = new Set();
/* render one data node. n = {id,type,k,v,meta,children[],pre,extra}
   pre  = HTML rendered ABOVE children (e.g. segment LABEL/Value grid)
   extra= HTML rendered BELOW children (e.g. placement preview card) */
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
    ['TEMPLATE',o.template],['OIDAMIMAGE','multitasking.svg'],['OBILLOFFERID',o.billing],
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
    ['SEGMENT',o.segment],['TREATMENT',o.treatment],['EXPERIMENT',o.experiment],['BILLING OFFER ID',o.billing],
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
    return {id,type:'placement',k:'Placement/Template',v:o.placement,meta:o.template,
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
  {key:'placement', label:'Placement',  type:'placement'},
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
            ${state.fileChip?`<div class="fileChip"><span class="fileChip__ico">${icon('note',14)}</span><span class="fileChip__name">name of file.doc</span><span class="fileChip__x">${icon('close',12)}</span></div>`:''}
            <div class="promptBox__input" id="homeInput"><span class="promptBox__ph">Ask Marketing Agent</span></div>
            <div class="promptBox__actions">
              <button class="promptBox__ctrl">${icon('plus',18)}</button>
              <button class="promptBox__send" id="homeSend">${icon('arrowUp',18)}</button>
            </div>
          </div>
        </div>
        <!-- Simulate a scenario: dashed pill → 3 change-order scenarios -->
        <div class="simWrap">
          <button class="simPill" id="simPill" type="button">${icon('plus',14)} Simulate a scenario ${I.chev}</button>
          <div class="simMenu hidden" id="simMenu">
            <button class="simMenu__item" data-sim="prompt">Prompt based change - campaign meta</button>
            <button class="simMenu__item" data-sim="promptCO">Prompt based change - IPD content</button>
            <button class="simMenu__item" data-sim="workbook">Workbook based changes</button>
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
    <div class="sec-label">Placement</div>${tableHTML(COL.place,place)}
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
   cumulative WB_* transcript. Placement rows drill down to a content table.
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

// ACCESS POINT / TEMPLATE attribute row + "Creatives" section header with the toggle
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
function helloboxCreative(hl=false){
  return `<div class="preview-wrap preview-wrap--wide">
        <div class="hellobox">
          <div class="art${hl?' cd-hl-border':''}">${I.tag}</div>
          <div class="body">
            <span class="lt">limited time</span>
            <h4><span class="${hl?'cd-hl':''}">${CREATIVE_HEADLINE}</span></h4>
            <p>${CREATIVE_BODY}</p>
            <span class="cta">${CREATIVE_CTA}</span>
            <div class="fine">Offer valid for new paid subscriptions only. <a href="#">Terms apply</a></div>
          </div>
        </div>
        <div class="preview-cap">Preview · helloboxThirdParty · SBSEG QBO Hellobox AppAccountsettings</div>
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
// only groups multiple creatives on a placement, so it's dropped here.
function singleCreative(view){
  if(view==='preview') return `<div class="creativeCenter">${helloboxCreative()}</div>`;
  return `<div class="cd-row">${cdPair('HEADLINE',CREATIVE_HEADLINE,false)}${cdPair('BODY',CREATIVE_BODY,false)}</div>
    <div class="cd-row" style="margin-top:16px">${cdPair('CTA',CREATIVE_CTA,false)}${cdPair('IMAGE','imagename.png',false,true)}</div>`;
}
// dispatch by view
function creativesBody(view, hl=false){ return view==='preview' ? contentPreview(hl) : contentDetail(hl); }

// placement table where each row drills into the content table (steps 2 & 3).
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

/* WB step 2 & 3 share a placement table that drills into the content table.
   state.drill = index of the placement row being viewed (content table shown). */
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
    title=`Placement - DIWM QB Live campaign`;
    canvas = `<div class="detail-h"><span class="title">Placement - DIWM QB Live campaign</span></div><div style="height:16px"></div>${loading?skeletonTable(COL.place,false):placementDrill(hl)+hlBar(hl)}`;
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
  // campaign summary canvas with billing + placement rows highlighted yellow
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

// summary tables for WB review: audiences (plain), billing (2 rows yellow), placement (all yellow), experiments
function wbSummaryTables(hl=true){
  // billing-ID/IPD flow does NOT change end dates → keep original 04/22 (unchanged);
  // the whole-row highlight flags the billing offers whose IDs changed.
  const bill = billingRows('04/22/2026',false).map((r,i)=>({...r,editedRow:hl&&i<2}));
  const placeHi=new Set([0,1,3,5]);
  const place = PLACEMENTS.map((r,i)=>({...r,editedRow:hl&&placeHi.has(i)}));
  return `<div class="sec-label">Audiences</div>${tableHTML(COL.aud,AUDIENCES)}
    <div class="sec-label">Placement</div>${tableHTML(COL.place,place)}
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
    // Campaign meta tab reflects the WORKBOOK edits (billing IDs + placement highlights), not the prompt-flow end-date diff
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

/* ---- P2 step 2: Change IPD content and images (placement drill-down) ---- */
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
  'Parse and validate placements',
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
const CR_CREATIVE= ()=> agentMsg(`<div class="chatBubble">Parsed and validated the placements.${objectCard('thumbnail','Placements - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${recordedReply('Approved')}</div>`);
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

/* ---- CR task 4: Creative, placements and content (Placement table → Creatives drill) ---- */
scenes.crCreative = (state={})=>{
  const loading=state.loading;
  const conv = CR_TO_CREATIVE(loading?2:3, loading?2:-1);
  const body = loading
    ? conv + agentLoader('Creating creative, placements and content', state.tasks||[])
    : conv + agentMsg(`<div class="chatBubble">Parsed and validated the placements.${objectCard('thumbnail','Placements - DIWM QB Live campaign')}<div class="bubble-q">Does this look ok? I'll then proceed to task 4.</div>${replyBtn('Approve','crApproveCreative')}</div>`);
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
    canvas = `<div class="detail-h"><span class="title">Placements - DIWM QB Live campaign</span></div><div style="height:16px"></div>${tbl}`;
  }
  const content = `<div class="content">${topbar(CR_CRUMB)}<div class="scroll"><div class="pad">${canvas}</div></div></div>`;
  return content + aiPanel({step:'3.  Parse and validate placements',body,stepLoading:loading});
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
      ? skeletonTable([{label:'Treatment name'},{label:'Allocation'},{label:'Billing Offer ID'},{label:'Offers'}],false)
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
function treatmentsTable(){
  const cols=[{label:'Treatment name'},{label:'Allocation',info:1},{label:'Billing Offer ID'},{label:'Offers'}];
  const rows=[
    {tn:'Treatment1-ELM9071_Med_70pct',al:'~30%',bo:'20059622',of:'8'},
    {tn:'Treatment2-ELM9071_Med_90pct',al:'~30%',bo:'20059622',of:'8'},
    {tn:'Control-ELM9071_Med_30dFree',al:'~30%',bo:'20059622',of:'8'},
  ];
  const cs=[{label:'Treatment name',key:'tn'},{label:'Allocation',key:'al',info:1},{label:'Billing Offer ID',key:'bo'},{label:'Offers',key:'of'}];
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
    const tabTitle = (txt)=>`<div class="cd-head"><span class="cd-head__t">${txt}</span></div>`;
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
      tabBody = tabTitle('IPD High Price Sensitivity · IXP 321931') + `${metaGrid2([['START DATE','March 12, 2026'],['END DATE','April 22, 2026'],['TYPE','A/B/N (3-cell)']])}<div style="height:12px"></div>${treatmentsTable()}`;
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
// placement row → content drill-down: skeleton flash (~1100ms) then the content table
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
// Two scenarios share the app. 'prompt' = end-date change via prompt; 'workbook' = change order via attached workbook.
let scenario = 'prompt';
const FLOW_PROMPT   = ['home','searchMultiple','singleCampaign','coIntent','changeMeta','campaignObject','campaignTree'];
const FLOW_WORKBOOK = ['home','coIntentWB','ipdContent','campaignObjectWB','campaignTreeWB'];
const FLOW_PROMPTCO = ['home','p2Intent','p2Ipd','p2Review','p2Tree'];
const FLOW_CREATE   = ['home','crIntent','crMeta','crAudience','crCreative','crExperiment','crSummary','crTree'];
// active FLOW switches with the scenario
function FLOW_ARR(){ return scenario==='workbook' ? FLOW_WORKBOOK : scenario==='promptCO' ? FLOW_PROMPTCO : scenario==='create' ? FLOW_CREATE : FLOW_PROMPT; }
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
function typeInto(input, text, done){
  if(!input){ done&&done(); return; }
  input.classList.add('promptBox__input--filled');
  input.innerHTML='<span class="promptBox__caret"></span>';
  const caret=input.firstChild; let i=0;
  const tick=()=>{
    i++; input.textContent=text.slice(0,i);
    if(i<text.length) timers.push(setTimeout(tick,TYPE_MS));
    else { input.innerHTML=text+'<span class="promptBox__caret"></span>'; timers.push(setTimeout(()=>done&&done(),650)); }
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
    if(scenario==='workbook'){ if(inp) inp.textContent=WORKBOOK_PROMPT; runIntakeWB(); }
    else if(scenario==='promptCO'){ if(inp) inp.textContent=PROMPTCO_PROMPT; runIntakeP2(); }
    else if(scenario==='create'){ if(inp) inp.textContent=CREATE_PROMPT; runIntakeCR(); }
    else { if(inp) inp.textContent=FIND_PROMPT; runIntake(); } },
  viewSelected:(state)=>{ clearTimers(); go('singleCampaign',{view:'table'}); },
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
  wbApproveBilling:()=>{ recordPillThen(()=>runWBStep('ipdContent','Loading placements','ipdContent',{})); },   // loader → placement table (merged step 2)
  wbApproveIpd:()=>{ recordPillThen(()=>runWBReview()); },                                                       // step 2 done → review (step 3)
  wbApproveReview:()=>{ recordPillThen(()=>runLoader('campaignTreeWB',LOADERS.saving,'campaignTreeWB',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  wbLooksGoodFinal:()=>{ autopilot=false; go('home'); },
  // ── SCENARIO 3 (prompt CO) triggers ──
  p2ApproveUnderstood:()=>{ recordPillThen(()=>runP2Plan()); },
  p2ApprovePlan:()=>{ recordPillThen(()=>runP2Step('p2Ipd','Changing IPD content and images','p2Ipd',{})); },
  p2ApproveBilling:()=>{ recordPillThen(()=>runP2Step('p2Ipd','Loading placements','p2Ipd',{})); },
  p2ApproveIpd:()=>{ recordPillThen(()=>runP2Review()); },
  p2ApproveReview:()=>{ recordPillThen(()=>runLoader('p2Tree',LOADERS.saving,'p2Tree',{view:'tree',tab:'experiences'},{tab:'experiences'})); },
  p2LooksGoodFinal:()=>{ autopilot=false; go('home'); },
  // ── SCENARIO 4 (create) triggers ──
  crApproveUnderstood:()=>{ recordPillThen(()=>runCRPlan()); },
  crApprovePlan:()=>{ recordPillThen(()=>runCRStep('crMeta','Parsing and validating campaign meta','crMeta',{})); },
  crApproveMeta:()=>{ recordPillThen(()=>runCRStep('crAudience','Parsing and validating audiences','crAudience',{})); },
  crApproveAud:()=>{ recordPillThen(()=>runCRStep('crCreative','Parsing and validating placements','crCreative',{})); },
  crApproveBilling:()=>{ recordPillThen(()=>runCRStep('crCreative','Parsing and validating placements','crCreative',{})); },
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
        // Workbook flow Table view = billing-ID + placement edits, NOT the end-date diff
        zone.innerHTML = wbSummaryTables(current.state.hl!==false);
      } else if(name==='p2Tree'||name==='p2Review'){
        // Scenario 2 (prompt billing) Table view = single billing-ID + placement edits
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
        if(scenario==='workbook') go('home',{autotype:WORKBOOK_PROMPT,fileChip:true});
        else if(scenario==='promptCO') go('home',{autotype:PROMPTCO_PROMPT});
        else go('home',{autotype:FIND_PROMPT});
      });
      document.addEventListener('click',()=>menu.classList.add('hidden'),{once:true});
    }
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

  // ── WORKBOOK flow reply pills + placement drill-down ──
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

  // ── SCENARIO 3 (prompt CO) reply pills + placement drill-down ──
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

/* boot */
renderRail();
go('home',{});

/* keyboard: left/right step through flow; 'p' toggles autopilot; 'r' restarts guided run */
/* resting (non-loading) default state for each scene, so arrow-key nav in BOTH
   directions lands each step in its correct finished state — no restart needed. */
const FLOW_STATE = {
  home:{},
  searchMultiple:{},
  singleCampaign:{view:'table'},
  coIntent:{view:'table'},
  billing:{},
  experiments:{},
  campaignObject:{view:'table'},
  campaignTree:{view:'tree',tab:'experiences'},
  // workbook
  coIntentWB:{},
  ipdContent:{},
  campaignObjectWB:{view:'table'},
  campaignTreeWB:{view:'tree',tab:'experiences'},
  // prompt CO (scenario 3)
  p2Intent:{},
  p2Ipd:{},
  p2Review:{view:'table'},
  p2Tree:{view:'tree',tab:'experiences'},
  // create (scenario 4)
  crIntent:{},
  crMeta:{},
  crAudience:{},
  crCreative:{},
  crExperiment:{},
  crSummary:{view:'tree'},
  crTree:{view:'tree',tab:'meta'},
};
// this build's home always boots ready-to-create: chip attached, prompt auto-typing
function goHomeCreate(){ go('home',{autotype:CREATE_PROMPT,fileChip:true}); }
// jump to a step index in the ACTIVE flow with its correct resting state
function gotoStep(i){
  const flow=FLOW_ARR();
  if(i<0 || i>=flow.length) return;
  autopilot=false;
  const name=flow[i];
  go(name, {...(FLOW_STATE[name]||{})});
}
document.addEventListener('keydown',(e)=>{
  // ignore while typing in the composer / any editable field, and with modifiers held
  const t=e.target;
  if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || (t.closest && t.closest('.promptBox')))) return;
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  if(e.key==='p'){ autopilot=!autopilot; if(autopilot) scheduleAuto(current.name,current.state); else clearTimers(); return; }
  if(e.key==='r'){ autopilot=true; go('home',{}); return; }
  const i = FLOW_ARR().indexOf(current.name);
  if(i===-1) return;
  if(e.key==='ArrowRight'){ e.preventDefault(); gotoStep(i+1); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); gotoStep(i-1); }
});
