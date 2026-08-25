import type { Metadata } from 'next';
import { AboutPage } from '../../mars/pages';
export const metadata: Metadata = { title: '关于火星｜火星加速器', description: '使命、运行机制与创始人网络' };
export default function Page() { return <AboutPage locale="zh" />; }
