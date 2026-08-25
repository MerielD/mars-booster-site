import type { Metadata } from 'next';
import { VenturesPage } from '../../mars/pages';
export const metadata: Metadata = { title: '孵化与产业｜火星加速器', description: '孵化投资与产业解决方案' };
export default function Page() { return <VenturesPage locale="zh" />; }
