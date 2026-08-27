/* eslint-disable @next/next/no-img-element -- relative static assets are required for GitHub Pages subpaths */

import { type Locale, type SiteCopy } from './content';

// Depth-aware asset prefix: '' = homepage (../assets), '../' = sub-page (../../assets).
const asset = (name: string, base: string) => `${base === '' ? '../' : '../../'}assets/ppt/${name}`;

// Order of program detail fields must match c.programLabels (适合谁 / 企业阶段 / 项目机制 / 核心价值 / 战略作用).
const programFields = ['audience', 'stage', 'format', 'value', 'role'] as const;

export function Hero({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-image" style={{ backgroundImage: `url('${asset('hero-community.jpeg', base)}')` }} aria-hidden="true" /><div className="hero-shade" aria-hidden="true" />
      <div className="hero-content"><p className="kicker kicker-light">{c.heroKicker}</p><h1 id="hero-title">{c.heroLines.map((line) => <span key={line}>{line}</span>)}</h1><p className="hero-summary">{c.heroSummary}</p><a className="text-link text-link-light" href={`${base}about`}>{c.heroCta}<span aria-hidden="true">↘</span></a></div>
      <p className="hero-marker">{c.heroMarker}</p>
    </section>
  );
}

export function Glance({ c }: { c: SiteCopy }) {
  return (
    <section className="glance" aria-label={c.glanceLabel}><p>{c.glanceLabel}</p><div>{c.glance.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span></article>)}</div></section>
  );
}

export function TrustProof({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <aside className="trust-proof" aria-labelledby="trust-proof-title"><div className="trust-proof-copy"><p className="kicker">{c.trustProofKicker}</p><h2 id="trust-proof-title">{c.trustProofTitle}</h2><p>{c.trustProofBody}</p><a href={`${base}proof`}>{c.trustProofLink}<span aria-hidden="true">↘</span></a><div className="trust-person"><strong>{c.trustProofPerson}</strong><span>{c.trustProofPersonRole}</span></div></div><div className="trust-proof-metrics">{c.trustProofMetrics.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span></article>)}</div></aside>
  );
}

export function Thesis({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="thesis dark-section">
      <div className="section-number">01</div>
      <div className="thesis-copy"><p className="kicker kicker-light">{c.thesisKicker}</p><h2>{c.thesisTitle}</h2><p className="lede lede-light">{c.thesisBody}</p><div className="thesis-notes">{c.thesisNotes.map((note, i) => <p key={note}><b>0{i + 1}</b>{note}</p>)}</div></div>
      <img src={asset('physical-ai-robot.png', base)} alt="" className="thesis-visual" width="900" height="900" />
      <div className="stack-grid">{c.stack.map((item, i) => <article key={item.title}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      <div className="frontiers-band">
        <div className="frontiers-head sub-head"><div><p className="kicker kicker-light">{c.frontiersKicker}</p><h3>{c.frontiersTitle}</h3></div><p className="lede lede-light">{c.frontiersIntro}</p></div>
        <div className="frontier-list">{c.frontiers.map((item, i) => <article key={item.title}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </div>
    </section>
  );
}

export function Explore({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="section explore-section">
      <div className="section-head"><div><p className="kicker">{c.aboutKicker}</p><h2>{c.aboutTitle}</h2></div><p className="lede">{c.aboutBody}</p></div>
      <div className="explore-grid">{c.explore.map((x) => <a key={x.href} href={`${base}${x.href}`}><h3>{x.title}</h3><p>{x.body}</p><b aria-hidden="true">↗</b></a>)}</div>
    </section>
  );
}

export function AboutModel({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="about-chapter" id="about">
      <div className="about-section"><div className="about-image"><img src={asset('cohort-floor.jpeg', base)} alt="Mars founder program cohort" width="1600" height="1067" /></div><div className="about-copy"><p className="kicker">{c.aboutKicker}</p><h2>{c.aboutTitle}</h2><p className="lede">{c.aboutBody}</p><strong className="model-line">{c.aboutModel}</strong><div className="values">{c.values.map((v) => <span key={v}>{v}</span>)}</div></div><div className="milestone-list">{c.milestones.map((m) => <article key={m.title + m.body}><strong>{m.title}</strong><p>{m.body}</p></article>)}</div></div>
      <div className="model-section dark-section"><div className="section-number">02</div><div className="model-intro"><p className="kicker kicker-light">{c.modelKicker}</p><h2>{c.modelTitle}</h2><p className="lede lede-light">{c.modelBody}</p><div className="capability-list">{c.capabilities.map((x) => <article key={x.title}><h3>{x.title}</h3><p>{x.body}</p></article>)}</div></div><div className="cycle-list">{c.cycle.map((x, i) => <article key={x.title}><span>0{i + 1}</span><h3>{x.title}</h3><p>{x.body}</p></article>)}</div></div>
    </section>
  );
}

export function Network({ c, locale, base }: { c: SiteCopy; locale: Locale; base: string }) {
  return (
    <section className="section network-section">
      <div className="section-head section-head-wide"><div><p className="kicker">{c.networkKicker}</p><h2>{c.networkTitle}</h2></div><p className="lede">{c.networkBody}</p></div>
      <div className="network-layout"><div className="network-metrics">{c.networkMetrics.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span><small>{m.note}</small></article>)}</div><div className="touchpoint-list">{c.touchpoints.map((x, i) => <article key={x.title}><span>0{i + 1}</span><div><h3>{x.title}</h3><p>{x.body}</p></div></article>)}</div><figure className="network-photo"><img src={asset('mars-night.jpeg', base)} alt={locale === 'zh' ? '火星之夜交流现场' : 'Mars Night gathering'} width="1600" height="1000" /></figure></div>
    </section>
  );
}

export function Programs({ c }: { c: SiteCopy }) {
  return (
    <section className="program-section dark-section" id="programs">
      <div className="section-number">03</div>
      <div className="program-intro"><p className="kicker kicker-light">{c.programsKicker}</p><h2>{c.programsTitle}</h2><p className="lede lede-light">{c.programsIntro}</p></div>
      <div className="program-compare program-compare-desktop" aria-label={c.programsTitle}>
        <div className="compare-row compare-head">{c.programs.map((p, pi) => <div className="program-head" key={p.title}><span>0{pi + 1}</span><h3>{p.title}</h3><p>{p.status}</p></div>)}</div>
        {c.programLabels.map((label, i) => <div className="compare-row" key={label}>{c.programs.map((p) => <div className="program-detail" key={p.title}><b>{label}</b><p>{p[programFields[i]]}</p></div>)}</div>)}
        <div className="compare-row compare-cta">{c.programs.map((p) => <a className="program-cta" href={p.href} key={p.title}>{p.cta}<span aria-hidden="true">↗</span></a>)}</div>
      </div>
      <div className="program-compare program-accordion">{c.programs.map((p, pi) => <details key={p.title}><summary><span>0{pi + 1}</span><h3>{p.title}</h3><p>{p.status}</p><i aria-hidden="true">＋</i></summary>{[p.audience, p.stage, p.format, p.value, p.role].map((value, i) => <div className="program-detail" key={c.programLabels[i]}><b>{c.programLabels[i]}</b><p>{value}</p></div>)}<a className="program-cta" href={p.href}>{p.cta}<span aria-hidden="true">↗</span></a></details>)}</div>
    </section>
  );
}

export function VenturesSolutions({ c, locale, base }: { c: SiteCopy; locale: Locale; base: string }) {
  return (
    <section className="venture-chapter">
      <div className="venture-section"><div className="venture-copy"><p className="kicker">{c.ventureKicker}</p><h2>{c.ventureTitle}</h2><p className="lede">{c.ventureBody}</p><div className="venture-metrics">{c.ventureMetrics.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span></article>)}</div></div><div className="venture-visual"><img src={asset('product-demo.jpeg', base)} alt={locale === 'zh' ? '物理AI产品现场演示' : 'Physical AI product demonstration'} width="1600" height="1067" /><ol>{c.ventureSteps.map((x, i) => <li key={x}><span>0{i + 1}</span>{x}</li>)}</ol></div></div>
      <div className="solutions-section">
        <div className="solutions-head sub-head"><div><p className="kicker">{c.solutionsKicker}</p><h3>{c.solutionsTitle}</h3></div><p className="lede">{c.solutionsBody}</p></div>
        <div className="solutions-list">{c.solutions.map((x, i) => <article key={x.title}><span>0{i + 1}</span><h3>{x.title}</h3><p>{x.body}</p></article>)}</div>
      </div>
    </section>
  );
}

export function Insight({ c, locale, base }: { c: SiteCopy; locale: Locale; base: string }) {
  return (
    <section className="chapter">
      <div className="section section-head-wrap"><div className="section-head"><div><p className="kicker">{c.insightKicker}</p><h2>{c.insightTitle}</h2></div><p className="lede">{c.insightBody}</p></div></div>
      <div className="insight-section"><div className="insight-image"><img src={asset('research-roundtable.jpeg', base)} alt={locale === 'zh' ? '火星行业研究讨论' : 'Mars industry research discussion'} width="1600" height="1067" /></div><div className="insight-copy"><div className="insight-assets">{c.insightAssets.map((x, i) => <a key={x.title} href={x.href}><span>0{i + 1}</span><div><h3>{x.title}</h3><p>{x.body}</p><small>{x.access}</small></div><b aria-hidden="true">↗</b></a>)}</div></div></div>
    </section>
  );
}

export function Global({ c, locale, base }: { c: SiteCopy; locale: Locale; base: string }) {
  return (
    <section className="global-section dark-section" id="global"><div className="global-image"><img src={asset('global-panel.jpeg', base)} alt={locale === 'zh' ? '火星全球交流现场' : 'Mars global program'} width="1600" height="1067" /></div><div className="global-copy"><p className="kicker kicker-light">{c.globalKicker}</p><h2>{c.globalTitle}</h2><p className="lede lede-light">{c.globalBody}</p><div className="global-metrics">{c.globalMetrics.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span></article>)}</div><p className="global-status">{c.globalDone}</p><p className="global-status">{c.globalNext}</p></div></section>
  );
}

export function ProofVoices({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="proof-chapter" id="proof">
      <div className="section proof-section"><div className="section-head section-head-wide"><div><p className="kicker">{c.proofKicker}</p><h2>{c.proofTitle}</h2></div><p className="lede">{c.proofIntro}</p></div><div className="proof-list">{c.proof.map((item, i) => <article key={item.company}><span>0{i + 1}</span><h3>{item.company}</h3><strong>{item.outcome}</strong><p>{item.detail}</p></article>)}</div></div>
      <div className="voices-section"><div className="voices-head"><p className="kicker">{c.voiceKicker}</p><h3>{c.voiceTitle}</h3></div><div className="voice-grid">{c.voices.map((v) => <figure key={v.by}><img src={asset(v.image, base)} alt={v.by} width="800" height="600" style={{ objectPosition: v.pos }} /><figcaption><blockquote>“{v.quote}”</blockquote><p>— {v.by}</p></figcaption></figure>)}</div></div>
    </section>
  );
}

export function Brand({ c, base }: { c: SiteCopy; base: string }) {
  return (
    <section className="brand-story dark-section"><div className="brand-copy"><p className="kicker kicker-light">{c.brandKicker}</p><h2>{c.brandTitle}</h2><p>{c.brandBody}</p><strong>{c.brandLine}</strong></div><div className="brand-images"><figure><img src={asset('brand-flame.png', base)} alt="" width="800" height="1000" /></figure><figure><img src={asset('brand-mars-vertical.png', base)} alt="" width="800" height="1000" /></figure></div></section>
  );
}
