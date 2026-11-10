/* eslint-disable @next/next/no-img-element -- Static export uses pre-sized, compressed WebP assets. */
import { alumni, type AlumniCompany, type AlumniEvent, type AlumniNews } from './alumni-data';
import { alumniUi, localizedAlumni } from './alumni-localized';
import { capitalFeatures, cooperationSummary, eventFormats, eventIdsByFormat, eventPhotos, eventYear, isCapitalNews } from './alumni-editorial';
import type { Locale } from './content';

const A = alumni;
const total = A.companies.length;
const disclosedRegions = A.stats.byRegion.filter((region) => region.name !== '未披露').length;
const year = eventYear;
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
            {[c.fullName, c.periods.map(periodLabel).join(' / '), c.status].filter(Boolean).join(' · ')}
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
    <a className="alumni-news-row" data-news-id={n.id} data-news-kind={isCapitalNews(n.id) ? 'capital' : 'other'} href={n.url} target="_blank" rel="noopener">
      <time dateTime={n.date}>{n.date.replace(/-/g, '.')}</time><b>{n.company}</b><span>{n.title}</span><em>{n.source}</em>
    </a>
  );
}

function NewsGroup({ title, news, locale, kind }: { title: string; news: AlumniNews[]; locale: Locale; kind: string }) {
  if (!news.length) return null;
  return (
    <div className="alumni-news-group" data-news-group={kind}>
      <h3 className="news-group-heading">{title}</h3>
      <div className="alumni-news">
        {news.slice(0, 8).map((n) => <NewsRow key={n.id} n={n} />)}
      </div>
      {news.length > 8 ? <details className="alumni-news-more">
        <summary>{alumniUi[locale].more} · {news.length - 8}</summary>
        {news.slice(8).map((n) => <NewsRow key={n.id} n={n} />)}
      </details> : null}
    </div>
  );
}

function EventFormats({ locale, events }: { locale: Locale; events: AlumniEvent[] }) {
  const ui = alumniUi[locale];
  return (
    <div className="alumni-community" aria-labelledby="event-formats-title">
      <div className="community-heading">
        <h3 id="event-formats-title">{ui.eventFormatsTitle}</h3>
        <p>{ui.eventFormatsNote.replace('{year}', String(year))}</p>
      </div>
      <div className="event-format-grid">
        {eventFormats.map((format) => {
          const ids = eventIdsByFormat.get(format.type);
          const matching = events.filter((event) => ids?.has(event.id));
          const photo = format.photo;
          return (
            <article className="event-format-card" key={format.type} data-event-type={format.type}>
              <figure>
                <img src={`../../assets/alumni/${photo.file}`} alt={photo[locale].alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                <figcaption>{photo[locale].caption}</figcaption>
              </figure>
              <div className="event-format-body">
                <strong className="event-format-count" aria-label={`${year} · ${format[locale].title} · ${matching.length}`}>{matching.length}</strong>
                <div>
                  <h4>{format[locale].title}</h4>
                  <p className="event-format-description">{format[locale].description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function AlumniPageContent({ locale }: { locale: Locale }) {
  const A = localizedAlumni(locale);
  const ui = alumniUi[locale];
  const scheduledIds = new Set(scheduled.map((e) => e.id));
  const upcoming = A.events.filter((e) => scheduledIds.has(e.id));
  const featuredIds = new Set(capitalFeatures.map((f) => f.id));
  const news = A.news.filter((n) => n.url && n.date);
  const featured = capitalFeatures.map((feature) => {
    const record = news.find((n) => n.id === feature.id);
    if (!record) throw new Error(`Missing featured news record: ${feature.id} (${locale})`);
    return { ...record, feature };
  });
  const remaining = news.filter((n) => !featuredIds.has(n.id)).sort((a, b) => b.date.localeCompare(a.date));
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
          <article><strong>{disclosedRegions}</strong><span>{ui.regionUnit}</span></article>
          <article><strong>{A.meta.counts.events}</strong><span>{ui.annualEventUnit.replace('{year}', String(year))}</span></article>
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
              <h3><a href={n.url} target="_blank" rel="noopener">{n.feature[locale].value}<span>{n.feature[locale].label}</span></a></h3>
              <p className="featured-company">{n.company}</p>
              <p className="featured-fact">{n.title}</p>
              <p className="featured-source"><a href={n.url} target="_blank" rel="noopener">{n.source} · <time dateTime={n.feature.reportedAt}>{n.feature.reportedAt.replace(/-/g, '.')}</time> ↗</a></p>
            </article>
          ))}
        </div>
        <NewsGroup title={ui.capitalNews} news={remaining.filter((n) => isCapitalNews(n.id))} locale={locale} kind="capital" />
        <NewsGroup title={ui.otherNews} news={remaining.filter((n) => !isCapitalNews(n.id))} locale={locale} kind="other" />
      </section>

      <section className="section alumni-cooperation" id="cooperation" data-provenance={cooperationSummary.provenance}>
        <div className="cooperation-heading">
          <p className="kicker">{ui.cooperation}</p>
          <h2>{ui.cooperationTitle}</h2>
          <p className="cooperation-source">{ui.cooperationSource}</p>
        </div>
        <dl className="cooperation-stats">
          {cooperationSummary.metrics.map((metric) => (
            <div key={metric.id} data-summary-id={metric.id}>
              <dt>{metric[locale].label}</dt>
              <dd>{metric[locale].value}</dd>
            </div>
          ))}
        </dl>
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
        <figure className="alumni-event-hero">
          <img src={`../../assets/alumni/${eventPhotos.annual.file}`} alt={eventPhotos.annual[locale].alt} width={eventPhotos.annual.width} height={eventPhotos.annual.height} loading="lazy" decoding="async" />
          <figcaption>
            <p className="kicker kicker-light">{ui.annualPhoto}</p>
            <h3>{eventPhotos.annual[locale].caption}</h3>
            <p>{ui.annualPhotoNote}</p>
          </figcaption>
        </figure>
        <div className="event-stats">
          <article><strong>{A.meta.counts.events}</strong><span>{ui.annualEventUnit.replace('{year}', String(year))}</span></article>
          <article><strong>{A.stories.eventSummary.done}</strong><span>{ui.completed}</span></article>
          <article><strong>{A.stories.eventSummary.planned}</strong><span>{ui.scheduled}</span></article>
          <article><strong>{A.stories.eventSummary.months}</strong><span>{ui.months}</span></article>
        </div>
        <EventFormats locale={locale} events={A.events} />
        <p className="event-year-note" id="event-year-note">{ui.eventYearNote.replace('{year}', String(year))}</p>
        {upcoming.length ? <div className="event-upcoming">
          <h3>{ui.next} · {year}</h3>
          {upcoming.map((e) => <EventRow key={e.id} e={e} locale={locale} />)}
        </div> : null}
        <h3 className="event-year-heading">{year} · {ui.archive}</h3>
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
        <div className="event-grid" aria-describedby="event-year-note">
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
