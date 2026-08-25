import type { Metadata } from 'next';
import { AboutPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'About Mars | Mars Booster', description: 'Mission, operating model and the founder network' };
export default function Page() { return <AboutPage locale="en" />; }
