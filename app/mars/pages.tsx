import { type ReactNode } from 'react';
import { copies, type Locale } from './content';
import { Shell } from './shell';
import { Hero, Glance, TrustProof, Thesis, Explore, AboutModel, Network, Programs, VenturesSolutions, Insight, Global, ProofVoices, Brand } from './sections';

const SLUGS = ['about', 'programs', 'ventures', 'insight', 'global', 'proof'];

/** Wrap a page's content in the shared header/footer with built relative nav. */
function Page({ locale, base, children }: { locale: Locale; base: string; children: ReactNode }) {
  const c = copies[locale];
  const nav = [
    { label: c.nav[0], href: `${base}about` },
    { label: c.nav[1], href: `${base}programs` },
    { label: c.nav[2], href: `${base}ventures` },
    { label: c.nav[3], href: `${base}insight` },
    { label: c.nav[4], href: `${base}global` },
    { label: c.nav[5], href: `${base}proof` },
    { label: c.nav[6], href: '#contact' },
  ];
  const switchHref = `${base}${locale === 'zh' ? '../en/' : '../zh/'}`;
  return (
    <Shell locale={locale} base={base} nav={nav} switchLabel={c.switchLabel} switchHref={switchHref} logoAlt={c.logoAlt} menuLabel={c.menuLabel} child={children} />
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="">
      <Hero c={c} base="" />
      <Glance c={c} />
      <TrustProof c={c} base="" />
      <Thesis c={c} base="" />
      <Explore c={c} base="" />
      <Brand c={c} base="" />
    </Page>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <AboutModel c={c} base="../" />
      <Network c={c} locale={locale} base="../" />
    </Page>
  );
}

export function ProgramsPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <Programs c={c} />
    </Page>
  );
}

export function VenturesPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <VenturesSolutions c={c} locale={locale} base="../" />
    </Page>
  );
}

export function InsightPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <Insight c={c} locale={locale} base="../" />
    </Page>
  );
}

export function GlobalPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <Global c={c} locale={locale} base="../" />
    </Page>
  );
}

export function ProofPage({ locale }: { locale: Locale }) {
  const c = copies[locale];
  return (
    <Page locale={locale} base="../">
      <ProofVoices c={c} base="../" />
    </Page>
  );
}

export { SLUGS };
