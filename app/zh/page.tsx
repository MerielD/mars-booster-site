import type { Metadata } from 'next';
import { HomePage } from '../mars/pages';
export const metadata: Metadata = { title: '火星加速器｜物理AI创始人加速与创新生态平台', description: '连接创始人、产业与市场，助力新一代技术创业者成长并走向全球。' };
export default function ChineseHome() { return <HomePage locale="zh" />; }
