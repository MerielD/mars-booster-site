import type { Metadata } from 'next';
import { ProgramsPage } from '../../mars/pages';
export const metadata: Metadata = { title: '创始人项目｜火星加速器', description: '产业营与物理AI创业营，两类进入高质量社区的路径' };
export default function Page() { return <ProgramsPage locale="zh" />; }
