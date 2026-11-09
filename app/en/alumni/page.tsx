import type { Metadata } from 'next';
import { AlumniPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Alumni Ecosystem | Mars Booster', description: 'Mars community companies and events: 185 companies, 7 industry segments, 63 events' };
export default function Page() { return <AlumniPage locale="en" />; }
