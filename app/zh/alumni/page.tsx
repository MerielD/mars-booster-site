import type { Metadata } from 'next';
import { AlumniPage } from '../../mars/pages';
export const metadata: Metadata = { title: '校友生态｜火星加速器', description: '火星社区公司与活动名录：185 家公司、7 个产业环节、63 场活动' };
export default function Page() { return <AlumniPage locale="zh" />; }
