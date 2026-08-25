import type { Metadata } from 'next';
import { ProofPage } from '../../mars/pages';
export const metadata: Metadata = { title: '成果案例｜火星加速器', description: '创始人关键结果与社区声音' };
export default function Page() { return <ProofPage locale="zh" />; }
