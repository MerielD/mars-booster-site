import type { Metadata } from 'next';
import { HomePage } from '../mars/pages';
export const metadata: Metadata = { title: 'Mars Booster | Physical AI Founder Acceleration', description: 'Connecting Physical AI founders, industry and global markets.' };
export default function EnglishHome() { return <HomePage locale="en" />; }
