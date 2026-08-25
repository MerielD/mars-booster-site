import type { Metadata } from 'next';
import { InsightPage } from '../../mars/pages';
export const metadata: Metadata = { title: '行业洞察与研究报告｜火星加速器', description: '研究报告、社区图谱与从业者内容' };
export default function Page() { return <InsightPage locale="zh" />; }
