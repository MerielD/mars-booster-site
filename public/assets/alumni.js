/* Native details and CSS filters remain usable if this enhancement cannot load. */
(function () {
  var input = document.getElementById('alumni-q');
  var count = document.getElementById('alumni-count');
  var empty = document.getElementById('alumni-empty');
  var reset = document.getElementById('alumni-reset');
  if (!input || !count || !empty || !reset || input.dataset.ready) return;
  input.dataset.ready = 'true';

  var cards = Array.prototype.slice.call(document.querySelectorAll('.co-card'));
  var grid = document.querySelector('.alumni-grid');
  var active = null;
  var drawer = document.createElement('section');
  drawer.className = 'co-drawer';
  drawer.hidden = true;
  drawer.setAttribute('role', 'region');
  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'co-close';
  close.textContent = document.documentElement.lang.indexOf('en') === 0 ? 'Close details' : '\u6536\u8d77\u8be6\u60c5';
  var drawerHeader = document.createElement('header');
  drawerHeader.className = 'co-drawer-header';
  var drawerTitle = document.createElement('h3');
  drawerTitle.className = 'co-drawer-title';
  drawerHeader.appendChild(drawerTitle);
  drawerHeader.appendChild(close);
  drawer.appendChild(drawerHeader);
  function closeDetails(returnFocus) {
    if (!active) return;
    var card = active;
    var summary = card.querySelector('summary');
    var content = drawer.querySelector('.co-open');
    if (content) card.appendChild(content);
    card.open = false;
    summary.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
    active = null;
    if (returnFocus) summary.focus({ preventScroll: true });
  }
  function positionDrawer() {
    if (!active) return;
    var focused = document.activeElement;
    // Temporarily removing the drawer restores the uninterrupted summary grid.
    drawer.remove();
    var visibleCards = cards.filter(function (card) { return getComputedStyle(card).display !== 'none'; });
    var columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    var index = visibleCards.indexOf(active);
    var last = Math.min(Math.ceil((index + 1) / columns) * columns, visibleCards.length) - 1;
    visibleCards[last].after(drawer);
    if (focused && drawer.contains(focused)) focused.focus({ preventScroll: true });
  }
  function openDetails(card) {
    closeDetails(false);
    active = card;
    card.open = true;
    var summary = card.querySelector('summary');
    summary.setAttribute('aria-expanded', 'true');
    drawerTitle.textContent = card.querySelector('.co-name').textContent;
    drawer.setAttribute('aria-labelledby', summary.id);
    drawer.appendChild(card.querySelector('.co-open'));
    drawer.hidden = false;
    positionDrawer();
  }
  cards.forEach(function (card) {
    var summary = card.querySelector('summary');
    summary.setAttribute('aria-controls', card.querySelector('.co-open').id);
    summary.setAttribute('aria-expanded', 'false');
    card.open = false;
    summary.addEventListener('click', function (event) {
      event.preventDefault();
      if (active === card) closeDetails(false);
      else openDetails(card);
    });
  });
  close.addEventListener('click', function () { closeDetails(true); });
  drawer.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { event.preventDefault(); closeDetails(true); }
  });
  grid.classList.add('alumni-grid-enhanced');
  window.addEventListener('resize', positionDrawer);
  var groups = { segment: 'seg-', region: 'reg-', period: 'per-', 'event-month': 'ev-' };
  function selected(name) { return document.querySelector('input[name="' + name + '"]:checked'); }
  function restore() {
    var params = new URL(window.location.href).searchParams;
    input.value = params.get('q') || '';
    Object.keys(groups).forEach(function (name) {
      var value = params.get(name);
      var options = Array.from(document.querySelectorAll('input[name="' + name + '"]'));
      var match = options.find(function (el) { return value && el.id === groups[name] + value; });
      (match || options[0]).checked = true;
    });
  }
  function save() {
    var url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    Object.keys(groups).forEach(function (name) {
      var option = selected(name);
      if (option && option.id) url.searchParams.set(name, option.id.slice(groups[name].length));
      else url.searchParams.delete(name);
    });
    if (url.href !== window.location.href) window.history.replaceState(null, '', url.href);
  }

  function apply(updateUrl) {
    closeDetails(drawer.contains(document.activeElement));
    var q = input.value.trim().toLowerCase();
    var seg = document.querySelector('input[name="segment"]:checked');
    var reg = document.querySelector('input[name="region"]:checked');
    var per = document.querySelector('input[name="period"]:checked');
    var segId = seg && seg.id !== '' && /^seg-\d+$/.test(seg.id) ? seg.id : '';
    var regId = reg && /^reg-\d+$/.test(reg.id) ? reg.id : '';
    var perId = per && /^per-\d+$/.test(per.id) ? per.id : '';
    var visible = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var show = true;
      if (segId && !card.classList.contains('s' + segId.split('-')[1])) show = false;
      if (regId && !card.classList.contains('r' + regId.split('-')[1])) show = false;
      if (perId && !card.classList.contains('p' + perId.split('-')[1])) show = false;
      if (show && q) {
        var text = card.getAttribute('data-search') || card.textContent.toLowerCase();
        if (text.indexOf(q) === -1) show = false;
      }
      card.hidden = !show;
      if (show) visible++;
    }
    count.textContent = visible + ' ' + count.dataset.unit;
    empty.hidden = visible !== 0;
    reset.disabled = !q && ['segment', 'region', 'period'].every(function (name) { return !selected(name).id; });
    if (updateUrl) save();
  }

  var timer = null;
  input.addEventListener('input', function (event) {
    if (timer) clearTimeout(timer);
    if (!event.isComposing) timer = setTimeout(function () { apply(true); }, 120);
  });
  input.addEventListener('compositionend', function () { clearTimeout(timer); apply(true); });
  document.addEventListener('change', function (e) {
    if (e.target && Object.prototype.hasOwnProperty.call(groups, e.target.name)) apply(true);
  });
  reset.addEventListener('click', function () {
    clearTimeout(timer);
    input.value = '';
    ['segment', 'region', 'period'].forEach(function (name) {
      document.querySelector('input[name="' + name + '"]').checked = true;
    });
    apply(true);
    input.focus();
  });
  window.addEventListener('popstate', function () { clearTimeout(timer); restore(); apply(false); });
  window.addEventListener('pageshow', function () { restore(); apply(false); });
  restore();
  apply(false);
  var panel = document.querySelector('.alumni-filter-panel');
  var mobile = window.matchMedia('(max-width:760px)');
  if (panel) {
    panel.open = !mobile.matches;
    mobile.addEventListener('change', function (event) { panel.open = !event.matches; });
  }
  document.querySelectorAll('[data-alumni-enhanced]').forEach(function (el) { el.hidden = false; });
})();
