import type { Metadata } from 'next';
import { VenturesPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Ventures & Industry | Mars Booster', description: 'Incubation, investment and industry solutions' };
export default function Page() { return <VenturesPage locale="en" />; }
