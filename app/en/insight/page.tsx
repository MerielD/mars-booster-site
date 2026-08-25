import type { Metadata } from 'next';
import { InsightPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Insight & Research | Mars Booster', description: 'Research, the community map and founder-led media' };
export default function Page() { return <InsightPage locale="en" />; }
