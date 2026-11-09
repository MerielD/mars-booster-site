import data from '../../data/alumni.json';

export type AlumniCompany = {
  id: string;
  name: string;
  fullName: string;
  intro: string;
  website: string;
  region: string;
  segment: string;
  subSegment: string;
  status: string;
  periods: number[];
  sourceLink: string;
  latestNews: { date: string; title: string; source: string; url: string } | null;
};

export type AlumniNews = { id: string; company: string; date: string; title: string; source: string; url: string };
export type AlumniEvent = {
  id: string;
  date: string;
  month: string;
  title: string;
  types: string[];
  places: string[];
  status: string;
  audience: string;
};

export type AlumniData = {
  meta: { generatedAt: string; counts: { companies: number; alumni: number; events: number; news: number } };
  stats: {
    byPeriod: { name: string; count: number }[];
    bySegment: { name: string; count: number }[];
    byRegion: { name: string; count: number }[];
  };
  companies: AlumniCompany[];
  news: AlumniNews[];
  events: AlumniEvent[];
  stories: {
    highlights: { value: string; company: string; fact: string; source: string; date: string; url: string }[];
    cases: { company: string; kicker: string; stats: { value: string; label: string }[] }[];
    connections: {
      from: string;
      fromSegment: string;
      relation: string;
      to: string;
      toSegment: string;
      note: string;
      source: string;
      date: string;
    }[];
    cumulative: { value: string; label: string }[];
    eventSummary: { done: number; planned: number; months: number };
  };
};

export const alumni = data as unknown as AlumniData;
