/* eslint-disable @next/next/no-img-element -- relative static assets are required for GitHub Pages subpaths */

import type { ReactNode } from 'react';
import { copies, type Locale } from './content';
import { ArrowIcon } from './icons';
import { imageUrl } from './images';

// Depth-aware asset prefix: '' = homepage (../assets), '../' = sub-page (../../assets).
const asset = (name: string, base: string) => imageUrl(`ppt/${name}`, base === '' ? '../' : '../../');

/**
 * Shared page shell: header + footer. `base` is the relative prefix from the
 * current page back to the language root — '' on the homepage, '../' on sub-pages.
 * All internal links stay relative so the static export works under any GitHub
 * Pages base path.
 */
export function Shell({
  locale,
  base,
  nav,
  switchLabel,
  switchHref,
  logoAlt,
  menuLabel,
  child,
}: {
  locale: Locale;
  base: string;
  nav: { label: string; href: string }[];
  switchLabel: string;
  switchHref: string;
  logoAlt: string;
  menuLabel: string;
  child: ReactNode;
}) {
  const c = copies[locale];
  const en = locale === 'en';

  return (
    <main className={`site locale-${locale}`} id="top" lang={en ? 'en' : 'zh-CN'}>
      <header className="site-header">
        <a href={base === '' ? './' : base} className="brand-link"><img src={asset('mars-logo-white.png', base)} alt={logoAlt} width="498" height="112" /></a>
        <nav className="desktop-nav" aria-label={menuLabel}>{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        <a className="language-link" href={switchHref}><span aria-hidden="true">◎</span>{switchLabel}<i aria-hidden="true">⌄</i></a>
        <details className="mobile-nav"><summary aria-label={menuLabel}><span /><span /></summary><div>{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div></details>
      </header>

      {child}

      <footer className="site-footer" id="contact">
        <div className="footer-planet" style={{ backgroundImage: `url('${asset('brand-mars-wide.png', base)}')` }} />
        <div className="footer-shade" />
        <div className="footer-content">
          <p className="kicker kicker-light">{c.actionKicker}</p>
          <h2>{c.actionTitle}</h2>
          <div className="action-grid">{c.actions.map((x, i) => <a key={x.title} href={x.href}><span>0{i + 1}</span><h3>{x.title}</h3><p>{x.body}</p><b><ArrowIcon direction="up-right" /></b></a>)}</div>
          <address className="contact"><span>{c.location}</span><a href={`mailto:${c.email}`}>{c.email}</a><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></address>
        </div>
        <div className="footer-bottom">
          <img src={asset('mars-logo-white.png', base)} alt={logoAlt} width="498" height="112" />
          <span>© 2026 {c.copyright}</span>
          <a href="#top" aria-label={en ? 'Back to top' : '返回顶部'}><ArrowIcon direction="up" /></a>
        </div>
      </footer>
    </main>
  );
}
