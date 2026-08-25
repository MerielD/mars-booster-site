import type { Metadata } from 'next';
import { ProofPage } from '../../mars/pages';
export const metadata: Metadata = { title: 'Proof & Outcomes | Mars Booster', description: "Founders' key results and community voices" };
export default function Page() { return <ProofPage locale="en" />; }
