const DEFAULT_USERS = [
  { id: 'usr_admin', name: 'Bahalul (Admin)', email: 'bahalul1964@gmail.com', role: 'admin', pin: '1964', password: 'admin', active: true, created: '2026-08-01' },
  { id: 'usr_operator', name: 'Floor Operator', email: 'operator@stocklens.internal', role: 'operator', pin: '2026', password: 'operator', active: true, created: '2026-08-15' },
  { id: 'usr_auditor', name: 'Audit Inspector', email: 'auditor@stocklens.internal', role: 'auditor', pin: '8888', password: 'auditor', active: true, created: '2026-08-20' }
];

const state = {
  records: [],
  baseRecords: [],
  view: 'dashboard',
  lang: 'en',
  currency: 'BDT',
  selectedImei: null,
  query: '',
  filters: { wing: '', status: '', from: '', to: '' },
  allocations: JSON.parse(localStorage.getItem('stocklens_allocations') || '[]'),
  offers: JSON.parse(localStorage.getItem('stocklens_offers') || '[]'),
  rates: { BDT: 1, CNY: 0.0598, USD: 0.00833 },
  users: JSON.parse(localStorage.getItem('stocklens_users') || 'null') || DEFAULT_USERS,
  currentUser: JSON.parse(localStorage.getItem('stocklens_current_user') || sessionStorage.getItem('stocklens_current_user') || 'null'),
  authTab: 'password',
  pinBuffer: '',
  isLocked: false,
  auditLog: JSON.parse(localStorage.getItem('stocklens_audit_log') || '[]')
};

const I18N = {
  en: {
    overview: 'Operations overview', dashboard: 'Dashboard', inventory: 'Inventory', imei: 'IMEI intelligence',
    offers: 'Client offers', data: 'Data center', users: 'Users & Security', guide: 'Guide & definitions',
    import: 'Import', export: 'Export', records: 'Records', unique: 'Unique IMEI / serials',
    duplicates: 'Actual duplicate IMEIs', units: 'Tracked units', search: 'Search IMEI, party, model or source…',
    allWings: 'All wings', allStatus: 'All statuses', dateFrom: 'From date', dateTo: 'To date',
    recent: 'Recent records', wings: 'Wing distribution', health: 'Data health',
    duplicatesNote: 'A duplicate means the same individual IMEI appears in more than one operational record — sale, repair, stock, resell or another event. Repeated source rows are not counted twice.',
    searchTitle: 'Find an IMEI', searchHelp: 'Search any IMEI / serial to see its full chain of custody.',
    noResults: 'No matching records found.', allocation: 'Allocate stock',
    allocationHelp: 'Assign available units to a seller or client without creating another inventory record.',
    seller: 'Seller / client', qty: 'Quantity', model: 'Model / product', save: 'Save allocation',
    offersTitle: 'Dedicated offers', offersHelp: 'Create an offer from available stock and a client target.',
    price: 'Price', client: 'Client', create: 'Create offer', dataTitle: 'Import, clean and export',
    dataHelp: 'Import only new records. The app skips exact repeated fingerprints while still flagging genuine repeated IMEIs across events.',
    importData: 'Import spreadsheet / CSV', exportData: 'Export current data', loaded: 'Loaded',
    actual: 'actual duplicates', guideTitle: 'How StockLens works',
    userTitle: 'User accounts & access control', userHelp: 'Manage role-based security, PINs, and terminal authorizations.',
    addUser: 'Add user', name: 'Full name', email: 'Email address', role: 'Role', pin: 'Terminal PIN',
    password: 'Password', actions: 'Actions', accessDenied: 'Access restricted to Administrators.'
  },
  bn: {
    overview: 'অপারেশনস ওভারভিউ', dashboard: 'ড্যাশবোর্ড', inventory: 'ইনভেন্টরি', imei: 'IMEI বিশ্লেষণ',
    offers: 'ক্লায়েন্ট অফার', data: 'ডাটা সেন্টার', users: 'ইউজার ও সিকিউরিটি', guide: 'গাইড ও সংজ্ঞা',
    import: 'ইমপোর্ট', export: 'এক্সপোর্ট', records: 'রেকর্ড', unique: 'ইউনিক IMEI / সিরিয়াল',
    duplicates: 'আসল ডুপ্লিকেট IMEI', units: 'ট্র্যাকড ইউনিট', search: 'IMEI, পার্টি, মডেল বা সোর্স খুঁজুন…',
    allWings: 'সব উইং', allStatus: 'সব স্ট্যাটাস', dateFrom: 'শুরুর তারিখ', dateTo: 'শেষ তারিখ',
    recent: 'সাম্প্রতিক রেকর্ড', wings: 'উইং বিতরণ', health: 'ডাটা স্বাস্থ্য',
    duplicatesNote: 'একই ব্যক্তিগত IMEI একাধিক অপারেশনাল রেকর্ডে — বিক্রয়, রিপেয়ার, স্টক, রিসেল বা অন্য ইভেন্টে — থাকলে সেটিই ডুপ্লিকেট। একই সোর্সের পুনরাবৃত্তি দুইবার গণনা হয় না।',
    searchTitle: 'IMEI খুঁজুন', searchHelp: 'যেকোনো IMEI / সিরিয়াল খুঁজে সম্পূর্ণ হিস্ট্রি দেখুন।',
    noResults: 'মিল পাওয়া যায়নি।', allocation: 'স্টক বরাদ্দ',
    allocationHelp: 'নতুন ইনভেন্টরি রেকর্ড তৈরি না করে উপলব্ধ ইউনিট বিক্রেতা বা ক্লায়েন্টকে দিন।',
    seller: 'বিক্রেতা / ক্লায়েন্ট', qty: 'পরিমাণ', model: 'মডেল / পণ্য', save: 'বরাদ্দ সংরক্ষণ',
    offersTitle: 'বিশেষ অফার', offersHelp: 'উপলব্ধ স্টক ও ক্লায়েন্টের জন্য অফার তৈরি করুন।',
    price: 'মূল্য', client: 'ক্লায়েন্ট', create: 'অফার তৈরি', dataTitle: 'ইমপোর্ট, পরিষ্কার ও এক্সপোর্ট',
    dataHelp: 'শুধু নতুন রেকর্ড ইমপোর্ট হয়। একই ফিঙ্গারপ্রিন্ট বাদ যায়, কিন্তু বিভিন্ন ইভেন্টে থাকা একই IMEI আলাদাভাবে ধরা হয়।',
    importData: 'স্প্রেডশিট / CSV ইমপোর্ট', exportData: 'বর্তমান ডাটা এক্সপোর্ট', loaded: 'লোড হয়েছে',
    actual: 'আসল ডুপ্লিকেট', guideTitle: 'StockLens কীভাবে কাজ করে',
    userTitle: 'ইউজার অ্যাকাউন্ট ও এক্সেস নিয়ন্ত্রণ', userHelp: 'রোলভিত্তিক নিরাপত্তা, পিন ও টার্মিনাল অনুমোদন পরিচালনা করুন।',
    addUser: 'নতুন ইউজার যোগ', name: 'নাম', email: 'ইমেইল', role: 'রোল', pin: 'টার্মিনাল পিন',
    password: 'পাসওয়ার্ড', actions: 'অ্যাকশন', accessDenied: 'শুধু অ্যাডমিনের জন্য অনুমোদিত।'
  },
  zh: {
    overview: '运营总览', dashboard: '仪表盘', inventory: '库存', imei: 'IMEI 智能分析',
    offers: '客户报价', data: '数据中心', users: '用户与安全', guide: '指南与定义',
    import: '导入', export: '导出', records: '记录', unique: '唯一 IMEI / 序列号',
    duplicates: '真实重复 IMEI', units: '跟踪单位', search: '搜索 IMEI、客户、型号或来源…',
    allWings: '全部部门', allStatus: '全部状态', dateFrom: '开始日期', dateTo: '结束日期',
    recent: '最近记录', wings: '部门分布', health: '数据健康',
    duplicatesNote: '同一个 IMEI 出现在销售、维修、库存、转售或其他运营记录中，才算真实重复。相同来源的重复行不会重复计数。',
    searchTitle: '查找 IMEI', searchHelp: '搜索任意 IMEI / 序列号，查看完整流转记录。',
    noResults: '没有找到匹配记录。', allocation: '库存分配',
    allocationHelp: '将可用单位分配给销售员或客户，不创建重复库存记录。',
    seller: '销售员 / 客户', qty: '数量', model: '型号 / 产品', save: '保存分配',
    offersTitle: '专属报价', offersHelp: '根据可用库存和客户创建报价。',
    price: '价格', client: '客户', create: '创建报价', dataTitle: '导入、清理与导出',
    dataHelp: '只导入新记录。完全相同的指纹会跳过，但不同事件中的同一 IMEI 仍会标记。',
    importData: '导入表格 / CSV', exportData: '导出当前数据', loaded: '已加载',
    actual: '真实重复', guideTitle: 'StockLens 如何工作',
    userTitle: '用户账号与权限管理', userHelp: '管理基于角色的安全、PIN 码与终端授权。',
    addUser: '添加用户', name: '姓名', email: '电子邮箱', role: '角色', pin: '终端 PIN',
    password: '密码', actions: '操作', accessDenied: '仅限管理员访问。'
  }
};

const t = k => I18N[state.lang][k] || I18N.en[k] || k;
const esc = x => String(x ?? '').replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m]));

function fmt(n) {
  return new Intl.NumberFormat(state.lang === 'bn' ? 'bn-BD' : state.lang === 'zh' ? 'zh-CN' : 'en-US').format(Number(n) || 0);
}

function money(n) {
  const symbols = { BDT: '৳', CNY: '¥', USD: '$' };
  return symbols[state.currency] + ' ' + new Intl.NumberFormat(state.lang === 'bn' ? 'bn-BD' : 'en-US', { maximumFractionDigits: 0 }).format((Number(n) || 0) * state.rates[state.currency]);
}

function dateVal(x) {
  if (!x) return '';
  let s = String(x).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function uniq(a) { return [...new Set(a.filter(Boolean))]; }

/* ===== EVENT CLASSIFICATION & IMEI AUDIT ===== */
function eventType(r) {
  const raw = [r.Status, r['Source Sheet'], r['Source File'], r['Product Detail'], r['Color / Note']].filter(Boolean).join(' ').toLowerCase();
  if (/return|refund|rma|returned|back/.test(raw)) return 'Return';
  if (/repair|service|damage|badbin|repared|warranty/.test(raw)) return 'Repair / warranty';
  if (/sale|sold|order|invoice|delivery|resell|withdraw/.test(raw)) return 'Sale / resell';
  if (/stock|inventory|receive|received|lot|master|warehouse|bin/.test(raw)) return 'Inventory';
  if (/print/.test(raw)) return 'Print / movement';
  return r.Status || 'Operational event';
}

function auditModel(rows) {
  const ordered = rows.slice().sort((a, b) => dateVal(a['Record Date']).localeCompare(dateVal(b['Record Date'])));
  const text = r => [r.Status, r['Source Sheet'], r['Source File'], r['Product Detail'], r['Color / Note']].filter(Boolean).join(' ').toLowerCase();
  const types = ordered.map(eventType), products = uniq(ordered.map(r => r['Product Detail'])), parties = uniq(ordered.map(r => r['Party Name'])), statuses = uniq(ordered.map(r => r.Status));
  const first = ordered[0], last = ordered[ordered.length - 1];
  const inventory = ordered.filter(r => /stock|inventory|receive|received|lot|master|warehouse|bin/.test(text(r)));
  const sales = ordered.filter(r => /sale|sold|order|invoice|delivery|resell|withdraw/.test(text(r)));
  const returns = ordered.filter(r => /return|refund|rma|returned|back/.test(text(r)));
  const repairs = ordered.filter(r => /repair|service|damage|badbin|repared|warranty/.test(text(r)));
  const saleDate = sales.length ? dateVal(sales[sales.length - 1]['Record Date']) : '';
  const returnDate = returns.length ? dateVal(returns[returns.length - 1]['Record Date']) : '';
  const days = (saleDate && returnDate) ? Math.round((new Date(returnDate) - new Date(saleDate)) / 86400000) : null;
  const ownership = inventory.length ? 'Likely ours' : 'Needs ownership proof';
  const warranty = returns.length && sales.length && days !== null && days >= 0 && days <= 365 ? 'Review eligible' : 'Insufficient warranty evidence';
  const refund = returns.length && sales.length && days !== null && days >= 0 ? 'Refund review' : 'Not enough sale-return linkage';
  const alerts = [];
  if (products.length > 1) alerts.push('Model changed across records');
  if (parties.length > 1) alerts.push('Customer / party changed across records');
  if (statuses.length > 1) alerts.push('Status changed across records');
  if (!inventory.length) alerts.push('No clear inventory/receiving event');
  if (returns.length && !sales.length) alerts.push('Return appears without a sale record');
  return { ordered, types, products, parties, statuses, first, last, inventory, sales, returns, repairs, saleDate, returnDate, days, ownership, warranty, refund, alerts };
}

function decisionTag(value) {
  return value === 'Likely ours' || value === 'Review eligible' || value === 'Refund review'
    ? '<span class="tag tag-good">' + esc(value) + '</span>'
    : '<span class="tag tag-warn">' + esc(value) + '</span>';
}

function auditRows(rows) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Event type</th><th>Model</th><th>Customer / party</th><th>Status</th><th>Source</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(dateVal(r['Record Date']))}</td><td><span class="tag ${eventType(r) === 'Return' ? 'tag-danger' : eventType(r) === 'Inventory' ? 'tag-good' : 'tag-warn'}">${esc(eventType(r))}</span></td><td>${esc(r['Product Detail'])}</td><td>${esc(r['Party Name'] || '—')}</td><td>${esc(r.Status || '—')}</td><td>${esc((r['Source Sheet'] || '') + ' / ' + (r['Source File'] || ''))}</td></tr>`).join('')}</tbody></table></div>`;
}

function normalize(r) {
  const out = { ...r };
  out['IMEI / Serial'] = String(out['IMEI / Serial'] || out.IMEI || out.IMIE || '').trim();
  out['IMEI Key'] = (out['IMEI / Serial'].replace(/[^0-9A-Za-z]/g, '').toUpperCase());
  out['Record Date'] = dateVal(out['Record Date'] || out.Date || out.Dt || out['Rcv Date'] || out['Receiving Date']) || '2026-08-01';
  out.Wing = out.Wing || out.Location || 'Unassigned';
  out['Party Name'] = out['Party Name'] || out.Name || out.Client || '';
  out['Product Detail'] = out['Product Detail'] || out.Product || out.Variant || out['Product name'] || out.SKU || '';
  out['Source File'] = out['Source File'] || 'Imported';
  out['Source Sheet'] = out['Source Sheet'] || 'Imported';
  out.Status = out.Status || '';
  out.Quantity = Number(out.Quantity || out.Qty || out['Unit Count'] || 1) || 1;
  return out;
}

function recompute() {
  const counts = {};
  state.records.forEach(r => {
    const k = r['IMEI Key'];
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  state.records.forEach(r => {
    r['IMEI Occurrences'] = counts[r['IMEI Key']] || 0;
    r['Duplicate IMEI'] = (counts[r['IMEI Key']] || 0) > 1 ? 'Yes' : 'No';
  });
  return counts;
}

function metrics() {
  const c = recompute();
  const unique = Object.keys(c).filter(Boolean).length;
  const dup = Object.values(c).filter(v => v > 1).length;
  return { records: state.records.length, units: state.records.reduce((a, r) => a + Number(r.Quantity || 1), 0), unique, dup, c };
}

/* ===== AUTHENTICATION & SESSION MANAGEMENT ===== */
function saveUsers() {
  localStorage.setItem('stocklens_users', JSON.stringify(state.users));
}

function logAudit(action, details = '') {
  const entry = {
    user: state.currentUser ? state.currentUser.email : 'system',
    role: state.currentUser ? state.currentUser.role : 'none',
    action,
    details,
    timestamp: new Date().toLocaleString()
  };
  state.auditLog.unshift(entry);
  if (state.auditLog.length > 50) state.auditLog.pop();
  localStorage.setItem('stocklens_audit_log', JSON.stringify(state.auditLog));
}

function authenticateUser(user, remember = true) {
  if (!user.active) {
    showAuthError('This account has been deactivated. Please contact your administrator.');
    return;
  }
  user.lastLogin = new Date().toISOString();
  state.currentUser = user;
  saveUsers();

  if (remember) {
    localStorage.setItem('stocklens_current_user', JSON.stringify(user));
    sessionStorage.removeItem('stocklens_current_user');
  } else {
    sessionStorage.setItem('stocklens_current_user', JSON.stringify(user));
    localStorage.removeItem('stocklens_current_user');
  }

  logAudit('Login Successful', `Method: ${state.authTab}`);
  hideAuthOverlay();
  updateUserUI();
  toast(`Welcome, ${user.name}`);
  render();
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearAuthError() {
  const el = document.getElementById('authError');
  el.textContent = '';
  el.classList.add('hidden');
}

function showAuthOverlay() {
  document.getElementById('authOverlay').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
  clearAuthError();
  state.pinBuffer = '';
  renderPinDots();
}

function hideAuthOverlay() {
  document.getElementById('authOverlay').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  clearAuthError();
}

function lockApp() {
  if (!state.currentUser) return;
  state.isLocked = true;
  document.getElementById('lockedUserName').textContent = state.currentUser.name;
  document.getElementById('lockOverlay').classList.remove('hidden');
  document.getElementById('unlockInput').value = '';
  document.getElementById('unlockInput').focus();
  document.getElementById('userDropdown').classList.remove('show');
}

function unlockApp() {
  const val = document.getElementById('unlockInput').value.trim();
  if (!val) return;
  if (val === state.currentUser.pin || val === state.currentUser.password) {
    state.isLocked = false;
    document.getElementById('lockOverlay').classList.add('hidden');
    toast('Terminal unlocked');
  } else {
    toast('Incorrect PIN or password');
  }
}

function logoutUser() {
  logAudit('User Logged Out');
  state.currentUser = null;
  localStorage.removeItem('stocklens_current_user');
  sessionStorage.removeItem('stocklens_current_user');
  document.getElementById('userDropdown').classList.remove('show');
  toast('Signed out');
  showAuthOverlay();
}

function updateUserUI() {
  if (!state.currentUser) return;
  const initial = (state.currentUser.name || 'U').charAt(0).toUpperCase();
  document.getElementById('topAvatar').textContent = initial;
  document.getElementById('topUserName').textContent = state.currentUser.name.split(' ')[0];
  document.getElementById('topUserRole').textContent = state.currentUser.role.toUpperCase();
  document.getElementById('dropUserName').textContent = state.currentUser.name;
  document.getElementById('dropUserEmail').textContent = state.currentUser.email;
}

function renderPinDots() {
  const dots = document.querySelectorAll('#pinDots .pin-dot');
  dots.forEach((dot, idx) => {
    if (idx < state.pinBuffer.length) dot.classList.add('filled');
    else dot.classList.remove('filled');
  });
}

function handlePinKey(digit) {
  if (state.pinBuffer.length < 4) {
    state.pinBuffer += digit;
    renderPinDots();
  }
  if (state.pinBuffer.length === 4) {
    // Attempt PIN authentication
    const matched = state.users.find(u => u.pin === state.pinBuffer && u.active);
    if (matched) {
      authenticateUser(matched, true);
    } else {
      showAuthError('Invalid PIN code. Please check and try again.');
      setTimeout(() => {
        state.pinBuffer = '';
        renderPinDots();
      }, 500);
    }
  }
}

/* Inactivity Auto-Lock Timer (15 Minutes) */
let idleTimer = null;
function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  if (state.currentUser && !state.isLocked) {
    idleTimer = setTimeout(() => {
      lockApp();
      toast('Terminal locked due to inactivity');
    }, 15 * 60 * 1000);
  }
}
window.addEventListener('mousemove', resetIdleTimer);
window.addEventListener('keypress', resetIdleTimer);
window.addEventListener('touchstart', resetIdleTimer);

/* ===== NAVIGATION & VIEW CONTROLLER ===== */
function page(title, kicker = 'COMMAND CENTER') {
  document.getElementById('pageKicker').textContent = kicker;
  document.getElementById('pageTitle').textContent = title;
  nav();
}

function nav() {
  const role = state.currentUser?.role || 'operator';
  const items = [
    ['dashboard', '⌂', t('dashboard')],
    ['inventory', '▦', t('inventory')],
    ['imei', '⌕', t('imei')],
    ['offers', '◈', t('offers')]
  ];

  if (role === 'admin') {
    items.push(['data', '⇅', t('data')]);
    items.push(['users', '👥', t('users')]);
  }

  items.push(['guide', '?', t('guide')]);

  document.getElementById('nav').innerHTML = items.map(x =>
    `<button class="${state.view === x[0] ? 'active' : ''}" data-view="${x[0]}"><span class="nav-icon">${x[1]}</span>${x[2]}</button>`
  ).join('');
}

function getFiltered() {
  const q = state.query.toLowerCase();
  return state.records.filter(r => {
    const d = dateVal(r['Record Date']);
    return (!q || Object.values(r).some(v => String(v).toLowerCase().includes(q))) &&
      (!state.filters.wing || r.Wing === state.filters.wing) &&
      (!state.filters.status || r.Status === state.filters.status) &&
      (!state.filters.from || d >= state.filters.from) &&
      (!state.filters.to || d <= state.filters.to);
  });
}

function dashboard() {
  const m = metrics(), wings = {};
  state.records.forEach(r => wings[r.Wing || 'Unassigned'] = (wings[r.Wing || 'Unassigned'] || 0) + 1);
  const top = Object.entries(wings).sort((a, b) => b[1] - a[1]).slice(0, 7), max = top[0]?.[1] || 1;
  page(t('overview'));
  document.getElementById('view').innerHTML = `
    <div class="view-grid">
      <div class="stats">
        <div class="metric"><div class="metric-label">${t('records')}</div><div class="metric-value">${fmt(m.records)}</div><div class="metric-foot">${t('loaded')} · ${new Date().toLocaleDateString()}</div></div>
        <div class="metric"><div class="metric-label">${t('unique')}</div><div class="metric-value">${fmt(m.unique)}</div><div class="metric-foot">${fmt(m.units)} ${t('units').toLowerCase()}</div></div>
        <div class="metric"><div class="metric-label">${t('duplicates')}</div><div class="metric-value">${fmt(m.dup)}</div><div class="metric-foot">Needs review across events</div></div>
        <div class="metric"><div class="metric-label">${t('units')}</div><div class="metric-value">${fmt(m.units)}</div><div class="metric-foot">Inventory + operational records</div></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><div><h2>${t('wings')}</h2><p>Where records are concentrated.</p></div><span class="tag tag-good">LIVE</span></div>
          ${top.map(([k, v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="bar"><i style="width:${v / max * 100}%"></i></div><b>${fmt(v)}</b></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-head"><div><h2>${t('health')}</h2><p>Cleaning rules applied to the source workbook.</p></div></div>
          <div class="notice"><b>49 legacy dates normalized</b><br>Dates such as 1930-08-01 were treated as spreadsheet date artifacts and moved to 2026-08-01.</div>
          <br>
          <div class="notice warn"><b>${fmt(m.dup)} actual duplicate IMEIs</b><br>${t('duplicatesNote')}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div><h2>${t('recent')}</h2><p>Click IMEI to inspect its full history.</p></div><button class="ghost-btn" data-view="inventory">View all</button></div>
        ${table(state.records.slice().sort((a, b) => dateVal(b['Record Date']).localeCompare(dateVal(a['Record Date']))).slice(0, 8))}
      </div>
    </div>`;
}

function table(rows) {
  if (!rows.length) return `<div class="empty">${t('noResults')}</div>`;
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>IMEI / Serial</th><th>Product</th><th>Party</th><th>Wing</th><th>Status</th><th>Signal</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(dateVal(r['Record Date']))}</td><td><button class="ghost-btn imei-link" data-imei="${esc(r['IMEI Key'])}">${esc(r['IMEI / Serial'])}</button></td><td>${esc(r['Product Detail'])}</td><td>${esc(r['Party Name'])}</td><td>${esc(r.Wing)}</td><td>${esc(r.Status || '—')}</td><td>${r['Duplicate IMEI'] === 'Yes' ? '<span class="tag tag-danger">Duplicate</span>' : '<span class="tag tag-good">Unique</span>'}</td></tr>`).join('')}</tbody></table></div>`;
}

function inventory() {
  page(t('inventory'));
  const rows = getFiltered();
  const wings = uniq(state.records.map(r => r.Wing)).sort(), statuses = uniq(state.records.map(r => r.Status)).sort();
  document.getElementById('view').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>${t('inventory')}</h2><p>Filter and inspect the cleaned master register.</p></div><div class="kpi-strip"><span><b>${fmt(rows.length)}</b> shown</span><span><b>${fmt(metrics().dup)}</b> duplicates</span></div></div>
      <div class="search-line"><input id="query" value="${esc(state.query)}" placeholder="${t('search')}"/><button class="primary-btn" id="clearSearch">Clear</button></div>
      <div class="filters">
        <label class="filter">Wing<select id="wingFilter"><option value="">${t('allWings')}</option>${wings.map(v => `<option ${v === state.filters.wing ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
        <label class="filter">Status<select id="statusFilter"><option value="">${t('allStatus')}</option>${statuses.map(v => `<option ${v === state.filters.status ? 'selected' : ''}>${esc(v || 'Blank')}</option>`).join('')}</select></label>
        <label class="filter">${t('dateFrom')}<input type="date" id="fromFilter" value="${state.filters.from}"></label>
        <label class="filter">${t('dateTo')}<input type="date" id="toFilter" value="${state.filters.to}"></label>
      </div>
      ${table(rows.slice(0, 250))}
      <p class="muted">Showing up to 250 rows for a fast browser experience. Export includes all filtered rows.</p>
    </div>`;
}

function imei() {
  page(t('imei'));
  const q = state.selectedImei || '';
  const rows = q ? state.records.filter(r => r['IMEI Key'] === q) : [];
  const r = rows[0];
  const a = rows.length ? auditModel(rows) : null;
  document.getElementById('view').innerHTML = `
    <div class="view-grid">
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><div><h2>${t('searchTitle')}</h2><p>${t('searchHelp')}</p></div></div>
          <div class="search-line"><input id="imeiSearch" value="${esc(q)}" placeholder="${t('search')}"/><button class="primary-btn" id="findImei">Find</button></div>
          ${r ? `
            <div class="notice ${rows.length > 1 ? 'warn' : ''}"><b>${rows.length > 1 ? `Actual duplicate · ${rows.length} events` : 'Single event found'}</b><br>${esc(r['IMEI / Serial'])} · ${esc(r['Product Detail'])}</div>
            <br>
            <div class="record-detail">
              <div class="detail-item"><small>IMEI type</small><b>${esc(r['IMEI Type'] || 'IMEI / serial')}</b></div>
              <div class="detail-item"><small>First seen / inventory</small><b>${esc(dateVal(a.first['Record Date']))}</b></div>
              <div class="detail-item"><small>Models / parties</small><b>${fmt(a.products.length)} / ${fmt(a.parties.length)}</b></div>
            </div>` : '<div class="empty">Search a normalized IMEI to inspect its chain of custody.</div>'}
        </div>
        <div class="card">
          <div class="card-head"><div><h2>Ownership, warranty & refund review</h2><p>Decision support only — keep the source documents before approving a refund.</p></div></div>
          ${a ? `
            <div class="audit-grid">
              <div class="detail-item"><small>Ownership check</small><b>${decisionTag(a.ownership)}</b></div>
              <div class="detail-item"><small>Warranty signal</small><b>${decisionTag(a.warranty)}</b></div>
              <div class="detail-item"><small>Refund signal</small><b>${decisionTag(a.refund)}</b></div>
            </div>
            <div class="kpi-strip">
              <span><b>${fmt(a.inventory.length)}</b> inventory</span>
              <span><b>${fmt(a.sales.length)}</b> sale/resell</span>
              <span><b>${fmt(a.returns.length)}</b> returns</span>
              <span><b>${fmt(a.repairs.length)}</b> repair</span>
            </div>
            <br>
            <div class="notice"><b>Trace summary</b><br>First seen ${esc(dateVal(a.first['Record Date']))}; latest event ${esc(dateVal(a.last['Record Date']))}; ${a.saleDate ? 'sale ' + esc(a.saleDate) : 'no sale found'}; ${a.returnDate ? 'return ' + esc(a.returnDate) : 'no return found'}${a.days !== null ? ' · ' + fmt(a.days) + ' days between sale and return' : ''}.</div>
            ${a.alerts.length ? `<br><div class="notice warn"><b>Review flags</b><br>${a.alerts.map(esc).join(' · ')}</div>` : ''}` : '<div class="empty">Enter an IMEI to calculate ownership and eligibility signals.</div>'}
        </div>
      </div>
      ${a ? `
        <div class="card">
          <div class="card-head"><div><h2>Full event timeline</h2><p>Different model, customer, status, and source appearances for this same individual IMEI.</p></div><span class="tag ${rows.length > 1 ? 'tag-danger' : 'tag-good'}">${fmt(rows.length)} events</span></div>
          ${auditRows(a.ordered)}
        </div>` : ''}
    </div>`;
}

function offers() {
  page(t('offers'));
  const models = uniq(state.records.map(r => r['Product Detail'])).filter(Boolean).slice(0, 300);
  document.getElementById('view').innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div><h2>${t('offersTitle')}</h2><p>${t('offersHelp')}</p></div></div>
        <form id="offerForm" class="form-grid">
          <label>${t('client')}<input name="client" required placeholder="Client name"></label>
          <label>${t('model')}<select name="model" required><option value="">Select model</option>${models.map(x => `<option>${esc(x)}</option>`).join('')}</select></label>
          <label>${t('qty')}<input name="qty" type="number" min="1" value="1" required></label>
          <label>${t('price')} (${state.currency})<input name="price" type="number" min="0" value="0" required></label>
          <label class="wide">Note<textarea name="note" rows="3" placeholder="Warranty, delivery, payment terms…"></textarea></label>
          <div class="form-actions wide"><button class="primary-btn">${t('create')}</button></div>
        </form>
      </div>
      <div class="card">
        <div class="card-head"><div><h2>Saved offers</h2><p>Offers remain in this browser until exported or synced.</p></div></div>
        ${state.offers.length ? state.offers.map(o => `
          <div class="offer-card">
            <div><h3>${esc(o.model)}</h3><p>${esc(o.client)} · ${fmt(o.qty)} units · ${esc(o.note || 'No note')}</p></div>
            <div class="offer-price">${money(o.price)}<br><small>${esc(o.created)}</small></div>
          </div>`).join('') : '<div class="empty">No offers created yet.</div>'}
      </div>
    </div>`;
}

function dataCenter() {
  if (state.currentUser?.role !== 'admin') {
    page(t('dataTitle'));
    document.getElementById('view').innerHTML = `<div class="card"><div class="empty"><h3>${t('accessDenied')}</h3><p>Only authorized administrators can import, wipe, or synchronize raw datasets.</p></div></div>`;
    return;
  }
  page(t('dataTitle'));
  document.getElementById('view').innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div><h2>${t('dataTitle')}</h2><p>${t('dataHelp')}</p></div></div>
        <div class="notice"><b>Import logic</b><br>Records are normalized, exact duplicate fingerprints are skipped, legacy 1930 dates are moved to 2026-08-01, and actual duplicate IMEIs remain visible for review.</div>
        <br>
        <button class="primary-btn" id="importData">${t('importData')}</button> <button class="ghost-btn" id="exportData">${t('exportData')}</button>
        <br><br>
        <div class="kpi-strip">
          <span><b>${fmt(state.records.length)}</b> records</span>
          <span><b>${fmt(metrics().unique)}</b> unique IMEIs</span>
          <span><b>${fmt(metrics().dup)}</b> ${t('actual')}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div><h2>${t('allocation')}</h2><p>${t('allocationHelp')}</p></div></div>
        <form id="allocationForm" class="form-grid">
          <label>${t('seller')}<input name="seller" required placeholder="Seller or client"></label>
          <label>${t('model')}<input name="model" required placeholder="Product / model"></label>
          <label>${t('qty')}<input name="qty" type="number" min="1" value="1" required></label>
          <div class="form-actions wide"><button class="primary-btn">${t('save')}</button></div>
        </form>
        <div id="allocList">
          ${state.allocations.slice(-5).reverse().map(a => `
            <div class="offer-card">
              <div><h3>${esc(a.model)}</h3><p>${esc(a.seller)} · ${fmt(a.qty)} units</p></div>
              <span class="tag tag-good">Allocated</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ===== USER MANAGEMENT VIEW (ADMIN ONLY) ===== */
function usersView() {
  if (state.currentUser?.role !== 'admin') {
    page(t('users'));
    document.getElementById('view').innerHTML = `<div class="card"><div class="empty"><h3>${t('accessDenied')}</h3></div></div>`;
    return;
  }
  page(t('users'));
  document.getElementById('view').innerHTML = `
    <div class="view-grid">
      <div class="grid-2">
        <div class="card">
          <div class="card-head">
            <div><h2>Authorized Users & Roles</h2><p>${t('userHelp')}</p></div>
          </div>
          <div class="table-wrap">
            <table class="data-table user-mgmt-table">
              <thead><tr><th>User</th><th>Role</th><th>PIN</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${state.users.map(u => `
                  <tr>
                    <td>
                      <div class="user-badge-cell">
                        <div class="user-avatar">${esc((u.name || 'U').charAt(0))}</div>
                        <div>
                          <strong>${esc(u.name)}</strong><br>
                          <small class="muted">${esc(u.email)}</small>
                        </div>
                      </div>
                    </td>
                    <td><span class="tag ${u.role === 'admin' ? 'tag-good' : u.role === 'operator' ? 'tag-warn' : ''}">${esc(u.role.toUpperCase())}</span></td>
                    <td><code>${esc(u.pin)}</code></td>
                    <td>
                      <span class="status-dot ${u.active ? 'active' : 'inactive'}"></span>
                      ${u.active ? 'Active' : 'Disabled'}
                    </td>
                    <td>
                      ${u.id === 'usr_admin' ? '<small class="muted">Primary</small>' : `
                        <button class="ghost-btn btn-toggle-user" data-uid="${esc(u.id)}">
                          ${u.active ? 'Disable' : 'Enable'}
                        </button>`}
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-head">
            <div><h2>Create Authorized User</h2><p>Add terminal personnel, operators, or audit inspectors.</p></div>
          </div>
          <form id="addUserForm" class="form-grid">
            <label>${t('name')}<input name="name" required placeholder="e.g. Tariq Ahmed"></label>
            <label>${t('email')}<input name="email" type="email" required placeholder="tariq@stocklens.internal"></label>
            <label>${t('role')}
              <select name="role" required>
                <option value="operator">Floor Operator</option>
                <option value="auditor">Audit Inspector</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <label>${t('pin')} (4 digits)<input name="pin" type="text" pattern="[0-9]{4}" maxlength="4" required placeholder="e.g. 5566"></label>
            <label class="wide">${t('password')}<input name="password" type="text" required placeholder="Temporary initial password"></label>
            <div class="form-actions wide"><button class="primary-btn">${t('addUser')}</button></div>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-head">
          <div><h2>Security & Activity Audit Log</h2><p>Recent authentication and administrative actions.</p></div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Details</th></tr></thead>
            <tbody>
              ${state.auditLog.length ? state.auditLog.slice(0, 10).map(l => `
                <tr>
                  <td>${esc(l.timestamp)}</td>
                  <td><b>${esc(l.user)}</b></td>
                  <td><span class="tag">${esc(l.role)}</span></td>
                  <td>${esc(l.action)}</td>
                  <td class="muted">${esc(l.details)}</td>
                </tr>`).join('') : '<tr><td colspan="5" class="empty">No activity logged yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

function guide() {
  page(t('guideTitle'));
  document.getElementById('view').innerHTML = `
    <div class="guide">
      <div class="card"><h2>Actual duplicate IMEI</h2><p>The same normalized IMEI appears in more than one operational record. This is intentional: it lets you trace a phone from stock to sale, repair, resell or another event.</p></div>
      <div class="card"><h2>New-only import</h2><p>Every row gets a fingerprint made from date, party, product, IMEI, source and quantity. Only fingerprints not already in the register are added.</p></div>
      <div class="card"><h2>Date cleanup</h2><p>Spreadsheet artifacts before 2020 are not treated as historical dates. They are normalized to 2026-08-01 to keep the August 2026 operational period intact.</p></div>
      <div class="card"><h2>Currency</h2><p>Use the selector below to display offers in Bangladeshi taka (৳), Chinese yuan (¥), or US dollars ($). Rates are editable in <code>app.js</code> for your preferred business rate.</p><div class="select-wrap"><select id="currencySelect"><option>BDT</option><option>CNY</option><option>USD</option></select></div></div>
      <div class="card"><h2>Role-Based Security</h2><p>Administrators have full operational control. Floor Operators can track inventory and create client offers. Audit Inspectors have dedicated access to IMEI lifecycle intelligence.</p></div>
      <div class="card"><h2>InfinityFree & Android APK</h2><p>StockLens operates as a standalone web application and as an installable Android APK with local offline caching and biometric/PIN terminal lock.</p></div>
    </div>`;
}

function render() {
  if (!state.currentUser) {
    showAuthOverlay();
    return;
  }
  nav();
  if (state.view === 'dashboard') dashboard();
  else if (state.view === 'inventory') inventory();
  else if (state.view === 'imei') imei();
  else if (state.view === 'offers') offers();
  else if (state.view === 'data') dataCenter();
  else if (state.view === 'users') usersView();
  else guide();
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function persist() {
  localStorage.setItem('stocklens_records', JSON.stringify(state.records));
  document.getElementById('dataState').textContent = `${fmt(state.records.length)} records ready`;
}

function exportCsv(rows = state.records) {
  if (state.currentUser?.role === 'auditor') {
    toast('Export not permitted for auditor role');
    return;
  }
  const keys = ['Record ID', 'Record Date', 'Status', 'Wing', 'Party Name', 'Product Detail', 'Model Group', 'Brand', 'IMEI / Serial', 'Sales / Employee', 'Source File', 'Source Sheet', 'Quantity', 'Color / Note', 'Unit Count', 'IMEI Type', 'IMEI Occurrences', 'Duplicate IMEI'];
  const escCsv = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => escCsv(r[k])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `stocklens-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  logAudit('Export CSV', `${rows.length} rows exported`);
  toast(`Exported ${fmt(rows.length)} records`);
}

async function importFile(file) {
  if (state.currentUser?.role !== 'admin') {
    toast(t('accessDenied'));
    return;
  }
  try {
    let rows;
    if (file.name.toLowerCase().endsWith('.json')) rows = JSON.parse(await file.text());
    else {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
    }
    const old = new Set(state.records.map(r => fingerprint(r)));
    let added = 0;
    for (const raw of rows) {
      const r = normalize(raw);
      const f = fingerprint(r);
      if (!old.has(f)) {
        state.records.push(r);
        old.add(f);
        added++;
      }
    }
    recompute();
    persist();
    logAudit('Import Dataset', `Added ${added} new records from ${file.name}`);
    toast(`Imported ${fmt(added)} new records; skipped ${fmt(rows.length - added)} repeats`);
    render();
  } catch (e) {
    toast('Import failed: ' + e.message);
  }
}

function fingerprint(r) {
  return ['Record Date', 'Status', 'Wing', 'Party Name', 'Product Detail', 'IMEI / Serial', 'Source File', 'Source Sheet', 'Quantity'].map(k => String(r[k] || '').trim().toLowerCase()).join('|');
}

/* ===== EVENT LISTENERS ===== */
document.addEventListener('click', e => {
  // Navigation
  const v = e.target.closest('[data-view]')?.dataset.view;
  if (v) {
    state.view = v;
    render();
    return;
  }
  if (e.target.id === 'menuBtn') document.querySelector('.sidebar').classList.toggle('open');
  if (e.target.id === 'importTop' || e.target.id === 'importData') document.getElementById('fileInput').click();
  if (e.target.id === 'exportTop' || e.target.id === 'exportData') exportCsv(getFiltered());
  if (e.target.classList.contains('imei-link')) {
    state.selectedImei = e.target.dataset.imei;
    state.view = 'imei';
    render();
  }
  if (e.target.id === 'clearSearch') {
    state.query = '';
    render();
  }
  if (e.target.id === 'findImei') {
    state.selectedImei = (document.getElementById('imeiSearch').value || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    render();
  }

  // User Dropdown Toggle
  if (e.target.closest('#userBadgeBtn')) {
    document.getElementById('userDropdown').classList.toggle('show');
  } else if (!e.target.closest('#userMenuWrap')) {
    document.getElementById('userDropdown')?.classList.remove('show');
  }

  // User Dropdown Actions
  if (e.target.id === 'btnLockApp') lockApp();
  if (e.target.id === 'btnSwitchAccount') {
    document.getElementById('userDropdown').classList.remove('show');
    showAuthOverlay();
  }
  if (e.target.id === 'btnLogout') logoutUser();

  // Lock Screen Actions
  if (e.target.id === 'btnUnlock') unlockApp();
  if (e.target.id === 'btnUnlockSwitch') {
    state.isLocked = false;
    document.getElementById('lockOverlay').classList.add('hidden');
    logoutUser();
  }

  // Auth Tabs
  const authTab = e.target.closest('[data-auth-tab]')?.dataset.authTab;
  if (authTab) {
    state.authTab = authTab;
    document.querySelectorAll('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.authTab === authTab));
    document.getElementById('panePassword').classList.toggle('hidden', authTab !== 'password');
    document.getElementById('panePin').classList.toggle('hidden', authTab !== 'pin');
    document.getElementById('paneDemo').classList.toggle('hidden', authTab !== 'demo');
    clearAuthError();
  }

  // PIN Keypad
  const digit = e.target.closest('[data-digit]')?.dataset.digit;
  if (digit !== undefined) handlePinKey(digit);
  if (e.target.id === 'pinClear') {
    state.pinBuffer = '';
    renderPinDots();
  }
  if (e.target.id === 'pinBackspace') {
    state.pinBuffer = state.pinBuffer.slice(0, -1);
    renderPinDots();
  }

  // 1-Click Demo Accounts
  const demoCard = e.target.closest('[data-demo-email]');
  if (demoCard) {
    const email = demoCard.dataset.demoEmail;
    const user = state.users.find(u => u.email === email);
    if (user) authenticateUser(user, true);
  }

  // Toggle Password Field
  if (e.target.id === 'togglePasswordVisibility') {
    const input = document.getElementById('loginPassword');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // Toggle User Active Status (Admin only)
  const toggleUserBtn = e.target.closest('.btn-toggle-user');
  if (toggleUserBtn) {
    const uid = toggleUserBtn.dataset.uid;
    const u = state.users.find(x => x.id === uid);
    if (u) {
      u.active = !u.active;
      saveUsers();
      logAudit('User Status Toggled', `${u.email}: ${u.active ? 'Active' : 'Disabled'}`);
      toast(`${u.name} is now ${u.active ? 'Active' : 'Disabled'}`);
      render();
    }
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'langSelect') {
    state.lang = e.target.value;
    render();
  }
  if (e.target.id === 'currencySelect') {
    state.currency = e.target.value;
    toast(`Currency: ${state.currency}`);
  }
  if (e.target.id === 'fileInput' && e.target.files[0]) importFile(e.target.files[0]);
  if (e.target.id === 'wingFilter') {
    state.filters.wing = e.target.value;
    render();
  }
  if (e.target.id === 'statusFilter') {
    state.filters.status = e.target.value === 'Blank' ? '' : e.target.value;
    render();
  }
  if (e.target.id === 'fromFilter') {
    state.filters.from = e.target.value;
    render();
  }
  if (e.target.id === 'toFilter') {
    state.filters.to = e.target.value;
    render();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'query') {
    state.query = e.target.value;
    clearTimeout(window.__q);
    window.__q = setTimeout(render, 180);
  }
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);

  // Password Login Form
  if (e.target.id === 'passwordLoginForm') {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    const matched = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched && matched.password === pass) {
      authenticateUser(matched, remember);
    } else {
      showAuthError('Invalid email address or password.');
    }
  }

  // Add User Form (Admin only)
  if (e.target.id === 'addUserForm') {
    const name = f.get('name').trim();
    const email = f.get('email').trim().toLowerCase();
    const role = f.get('role');
    const pin = f.get('pin').trim();
    const password = f.get('password').trim();

    if (state.users.some(u => u.email === email)) {
      toast('A user with this email already exists.');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      pin,
      password,
      active: true,
      created: new Date().toISOString().slice(0, 10)
    };

    state.users.push(newUser);
    saveUsers();
    logAudit('User Created', `${name} (${email}) as ${role}`);
    toast(`User ${name} successfully authorized`);
    e.target.reset();
    render();
  }

  // Stock Allocation Form
  if (e.target.id === 'allocationForm') {
    state.allocations.push({
      seller: f.get('seller'),
      model: f.get('model'),
      qty: Number(f.get('qty')),
      created: new Date().toLocaleDateString()
    });
    localStorage.setItem('stocklens_allocations', JSON.stringify(state.allocations));
    toast('Stock allocation saved');
    render();
  }

  // Client Offer Form
  if (e.target.id === 'offerForm') {
    state.offers.push({
      client: f.get('client'),
      model: f.get('model'),
      qty: Number(f.get('qty')),
      price: Number(f.get('price')),
      note: f.get('note'),
      created: new Date().toLocaleDateString()
    });
    localStorage.setItem('stocklens_offers', JSON.stringify(state.offers));
    toast('Offer created');
    render();
  }
});

// Unlock input enter key listener
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && state.isLocked) {
    unlockApp();
  }
});

async function load() {
  try {
    const [r, m] = await Promise.all([
      fetch('data/records.json').then(x => x.json()),
      fetch('data/meta.json').then(x => x.json())
    ]);
    state.baseRecords = r.map(normalize);
    state.records = JSON.parse(localStorage.getItem('stocklens_records') || 'null') || state.baseRecords;
    recompute();
    document.getElementById('dataState').textContent = `${fmt(state.records.length)} records ready`;
    
    if (state.currentUser) {
      updateUserUI();
      hideAuthOverlay();
    } else {
      showAuthOverlay();
    }
    render();
  } catch (e) {
    toast('Data load failed: ' + e.message);
  }
}

load();
