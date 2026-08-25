import type { Metadata } from 'next';
import { GlobalPage } from '../../mars/pages';
export const metadata: Metadata = { title: '全球连接｜火星加速器', description: '从中国市场走向全球' };
export default function Page() { return <GlobalPage locale="zh" />; }
