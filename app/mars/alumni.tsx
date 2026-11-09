import { alumni, type AlumniCompany, type AlumniEvent, type AlumniNews } from './alumni-data';
import { alumniUi, localizedAlumni } from './alumni-localized';
import type { Locale } from './content';

const A = alumni;
const total = A.companies.length;
const year = A.meta.generatedAt.slice(0, 4);
const scheduled = A.events.filter((e) => {
  const date = e.date.match(/^(\d{1,2})\.(\d{1,2})/);
  return e.status === '已排期' && date && `${year}-${date[1].padStart(2, '0')}-${date[2].padStart(2, '0')}` >= A.meta.generatedAt;
});

const segIndex = new Map(A.stats.bySegment.map((s, i) => [s.name, i + 1]));
const regIndex = new Map(A.stats.byRegion.map((s, i) => [s.name, i + 1]));
const companyClasses = new Map(A.companies.map((c) => [c.id, { segment: segIndex.get(c.segment), region: regIndex.get(c.region) }]));
const monthIndex = new Map(
  ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'].map((m, i) => [m, i + 1])
);

function FilterRow({
  label,
  name,
  options,
  allLabel,
  allCount,
}: {
  label: string;
  name: string;
  options: { label: string; count: number; id: string }[];
  allLabel?: string;
  allCount?: number;
}) {
  return (
    <div className="filter-row" role="radiogroup" aria-label={label}>
      <span>{label}</span>
      <div className="filter-options">
        <label className="filter-option">
          <input type="radio" name={name} defaultChecked aria-label={allLabel || '全部'} />
          <span>{allLabel || '全部'} <b>{allCount ?? total}</b></span>
        </label>
        {options.map((o) => (
          <label className="filter-option" key={o.id}>
            <input type="radio" name={name} id={o.id} />
            <span>{o.label} <b>{o.count}</b></span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CompanyCard({ c, locale }: { c: AlumniCompany; locale: Locale }) {
  const ui = alumniUi[locale];
  const seg = companyClasses.get(c.id)?.segment || 0;
  const reg = companyClasses.get(c.id)?.region || 0;
  const classes = ['co-card', seg ? `s${seg}` : '', reg ? `r${reg}` : '', ...c.periods.map((p) => `p${p}`)]
    .filter(Boolean)
    .join(' ');
  const periodLabel = (p: number) => locale === 'en' ? `Cohort ${p}` : `第 ${p} 期`;
  const shortPeriods = c.periods.map((p) => `0${p}`).join('·');
  const meta = [c.periods.length ? (locale === 'en' ? `Cohort ${shortPeriods}` : `${shortPeriods} 期`) : '', c.region].filter(Boolean).join(' · ');
  const search = [c.name, c.fullName, c.intro, c.segment, c.subSegment, c.region, c.periods.map(periodLabel).join(' ')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    <details className={classes} data-company-id={c.id} data-search={search}>
      <summary id={`company-${c.id}`}>
        <span className="co-name">{c.name}</span>
        <span className="co-meta">{meta}</span>
        <span className="co-seg">{c.segment}</span>
        <i className="co-plus" aria-hidden="true">+</i>
      </summary>
      <div className="co-open" id={`detail-${c.id}`}>
        <div>
          <p className="co-intro">{c.intro}</p>
          {c.subSegment ? <p className="co-detail">{c.subSegment}</p> : null}
          <p className="co-full">
            {c.fullName}
            {c.periods.length ? ` · ${c.periods.map(periodLabel).join(' / ')}` : ''}
            {c.status ? ` · ${c.status}` : ''}
          </p>
        </div>
        <div className="co-links">
          {c.website ? (
            <a href={c.website} target="_blank" rel="noopener">
              {ui.official} ↗
            </a>
          ) : null}
          {c.latestNews ? (
            c.latestNews.url ? (
              <a href={c.latestNews.url} target="_blank" rel="noopener">
                <b>{ui.latest}</b> {c.latestNews.date.replace(/-/g, '.')} · {c.latestNews.source}: {c.latestNews.title}
              </a>
            ) : (
              <span>
                <b>{ui.latest}</b> {c.latestNews.date.replace(/-/g, '.')} · {c.latestNews.source}: {c.latestNews.title}
              </span>
            )
          ) : null}
          {c.sourceLink ? (
            <a href={c.sourceLink} target="_blank" rel="noopener">
              {ui.source} ↗
            </a>
          ) : null}
        </div>
      </div>
    </details>
  );
}

function EventRow({ e, locale }: { e: AlumniEvent; locale: Locale }) {
  const m = monthIndex.get(e.month) || 0;
  return (
    <div className={`ev-row${m ? ` m${m}` : ''}`}>
      <time>{e.date}</time>
      <div>
        <b>{e.title}</b>
        <span>{e.types.join(' / ')}</span>
        {e.places.length ? <span className="ev-place">{e.places.join(' / ')}</span> : null}
      </div>
      <em className={e.status === alumniUi[locale].scheduledStatus ? 'next' : ''}>{e.status}</em>
    </div>
  );
}

function NewsRow({ n }: { n: AlumniNews }) {
  return (
    <a className="alumni-news-row" data-news-id={n.id} href={n.url} target="_blank" rel="noopener">
      <time>{n.date.replace(/-/g, '.')}</time><b>{n.company}</b><span>{n.title}</span><em>{n.source}</em>
    </a>
  );
}

export function AlumniPageContent({ locale }: { locale: Locale }) {
  const A = localizedAlumni(locale);
  const ui = alumniUi[locale];
  const scheduledIds = new Set(scheduled.map((e) => e.id));
  const upcoming = A.events.filter((e) => scheduledIds.has(e.id));
  const featuredIds = new Set(['reczz28XSn9mlEIS', 'reczz28XSn9mlEXK', 'reczz28XSn9mlEc1']);
  const news = A.news.filter((n) => n.url && n.date);
  const featured = news.filter((n) => featuredIds.has(n.id));
  const remaining = news.filter((n) => !featuredIds.has(n.id));
  return (
    <>
      <section className="section alumni-intro">
        <div className="section-head section-head-wide">
          <div>
            <p className="kicker">{ui.directory}</p>
            <h1 className="alumni-title">{ui.title}</h1>
          </div>
          <p className="lede">
            {ui.data} {A.meta.generatedAt.replace(/-/g, '.')}.
          </p>
        </div>
        <nav className="alumni-jump" aria-label={ui.contents}>
          <a href="#companies">{ui.companies}</a><a href="#news">{ui.news}</a><a href="../proof/">{ui.proof} ↗</a><a href="#events">{ui.events}</a>
        </nav>
      </section>

      <section className="glance alumni-glance" aria-label={ui.scale}>
        <p>{ui.asOf} {A.meta.generatedAt.replace(/-/g, '.')}</p>
        <div>
          <article><strong>{total}</strong><span>{ui.companyUnit}</span></article>
          <article><strong>{A.meta.counts.alumni}</strong><span>{ui.alumniUnit}</span></article>
          <article><strong>{A.stats.bySegment.length}</strong><span>{ui.segmentUnit}</span></article>
          <article><strong>{A.stats.byRegion.length}</strong><span>{ui.regionUnit}</span></article>
          <article><strong>{A.meta.counts.events}</strong><span>{ui.eventUnit}</span></article>
        </div>
      </section>

      <section className="alumni-dir" id="companies">
        <div className="alumni-filters">
          <label className="alumni-search" data-alumni-enhanced hidden>
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5 18 18" /></svg>
            <input id="alumni-q" type="search" placeholder={ui.placeholder} autoComplete="off" aria-label={ui.search} />
          </label>
          <button type="button" className="alumni-reset" id="alumni-reset" data-alumni-enhanced hidden>{ui.reset}</button>
          <details className="alumni-filter-panel" open>
            <summary>{ui.filters}</summary>
          <FilterRow
            label={ui.segment}
            allLabel={ui.all}
            name="segment"
            options={A.stats.bySegment.map((s, i) => ({ label: s.name, count: s.count, id: `seg-${i + 1}` }))}
          />
          <FilterRow
            label={ui.region}
            allLabel={ui.all}
            name="region"
            options={A.stats.byRegion.map((s, i) => ({ label: s.name, count: s.count, id: `reg-${i + 1}` }))}
          />
          <FilterRow
            label={ui.period}
            allLabel={ui.all}
            name="period"
            options={A.stats.byPeriod.map((p) => ({
              label: p.name,
              count: p.count,
              id: `per-${p.name.replace(/[^\d]/g, '')}`,
            }))}
          />
          </details>
        </div>

        <div className="alumni-table">
          <div className="alumni-count" id="alumni-count" aria-live="polite" data-unit={ui.countUnit} data-alumni-enhanced hidden>{total} {ui.countUnit}</div>
          <div className="alumni-grid">
            {A.companies.map((c) => (
              <CompanyCard key={c.id} c={c} locale={locale} />
            ))}
          </div>
          <p className="alumni-empty" id="alumni-empty" hidden>{ui.empty}</p>
        </div>
      </section>

      <section className="section alumni-doing" id="news">
        <div className="section-head">
          <div>
            <p className="kicker">{ui.reports}</p>
            <h2>{ui.recent}</h2>
          </div>
          <p className="lede">{ui.newsIntro}</p>
        </div>
        <div className="alumni-featured" aria-label={locale === 'en' ? 'Featured news' : '重点新闻'}>
          {featured.map((n) => (
            <article key={n.id} data-news-id={n.id}>
              <p className="featured-company">{n.company}</p>
              <h3><a href={n.url} target="_blank" rel="noopener">{n.title}</a></h3>
              <p className="featured-source"><time>{n.date.replace(/-/g, '.')}</time><span>{n.source} ↗</span></p>
            </article>
          ))}
        </div>
        <div className="alumni-news">
          {remaining.slice(0, 16).map((n) => <NewsRow key={n.id} n={n} />)}
        </div>
        <details className="alumni-news-more">
          <summary>{ui.more}</summary>
          {remaining.slice(16).map((n) => <NewsRow key={n.id} n={n} />)}
        </details>
      </section>

      <section className="section dark-section alumni-events" id="events">
        <div className="section-head">
          <div>
            <p className="kicker kicker-light">{ui.eventTitle}</p>
            <h2>{locale === 'en' ? `${year}: ${A.meta.counts.events} events & courses` : `${year} 年，火星约了 ${A.meta.counts.events} 场`}</h2>
          </div>
          <p className="lede lede-light">
            {A.stories.eventSummary.done} {ui.completed} · {A.stories.eventSummary.planned} {ui.scheduled} · {ui.asOf} {A.meta.generatedAt}
          </p>
        </div>
        <div className="event-stats">
          <article><strong>{A.meta.counts.events}</strong><span>{ui.eventUnit}</span></article>
          <article><strong>{A.stories.eventSummary.done}</strong><span>{ui.completed}</span></article>
          <article><strong>{A.stories.eventSummary.planned}</strong><span>{ui.scheduled}</span></article>
          <article><strong>{A.stories.eventSummary.months}</strong><span>{ui.months}</span></article>
        </div>
        {upcoming.length ? <div className="event-upcoming">
          <h3>{ui.next}</h3>
          {upcoming.map((e) => <EventRow key={e.id} e={e} locale={locale} />)}
        </div> : null}
        <h3 className="event-year-heading">{ui.archive}</h3>
        <div className="event-months" role="radiogroup" aria-label={ui.monthFilter}>
          {[
            { label: ui.all, value: 0 },
            ...['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'].map((m) => ({
              label: locale === 'en' ? new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, (monthIndex.get(m) || 1) - 1, 1))) : m,
              value: monthIndex.get(m) || 0,
            })),
          ].map((m, i) => (
            <label className="event-option" key={m.label}>
              <input type="radio" name="event-month" defaultChecked={i === 0} id={m.value ? `ev-${m.value}` : undefined} />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
        <div className="event-grid">
          {A.events.map((e) => (
            <EventRow key={e.id} e={e} locale={locale} />
          ))}
          {Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => !A.events.some((e) => monthIndex.get(e.month) === m)).map((m) => (
            <p className={`ev-row event-empty m${m}`} key={m}>{ui.emptyMonth}</p>
          ))}
        </div>
      </section>
      <script src="../../assets/alumni.js" defer data-keep="alumni" />
    </>
  );
}
