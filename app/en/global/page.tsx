import type { Metadata } from 'next';
import { GlobalPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Global | Mars Booster', description: 'From China to global markets' };
export default function Page() { return <GlobalPage locale="en" />; }
