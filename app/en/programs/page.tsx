import type { Metadata } from 'next';
import { ProgramsPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Founder Programs | Mars Booster', description: 'Industry Program and Physical AI Startup Program' };
export default function Page() { return <ProgramsPage locale="en" />; }
