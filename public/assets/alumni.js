/* Native details and CSS filters remain usable if this enhancement cannot load. */
(function () {
  var input = document.getElementById('alumni-q');
  var count = document.getElementById('alumni-count');
  var empty = document.getElementById('alumni-empty');
  var reset = document.getElementById('alumni-reset');
  if (!input || !count || !empty || !reset || input.dataset.ready) return;
  input.dataset.ready = 'true';

  var cards = Array.prototype.slice.call(document.querySelectorAll('.co-card'));
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
