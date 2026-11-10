import translations from '../../data/alumni-en.json';
import researchedNames from '../../data/company-names.json';
import { alumni, type AlumniData } from './alumni-data';
import type { Locale } from './content';

const dictionary: Record<string, string> = {
  '未披露': 'Not disclosed',
  '本体与场景应用': 'Robots & applications', '数据及基础设施': 'Data & infrastructure',
  '感知与交互': 'Sensing & interaction', '大小脑与神经网络': 'AI models & neural networks',
  '驱动与执行系统': 'Drive & actuation', '操作与末端执行': 'Manipulation & end effectors', '能源与动力系统': 'Energy & power',
  '长三角': 'Yangtze River Delta', '大湾区': 'Greater Bay Area', '京津冀': 'Beijing–Tianjin–Hebei',
  '华中': 'Central China', '西南': 'Southwest China', '其他': 'Other', '海外': 'Overseas', '日本': 'Japan', '美国': 'United States',
  '商用服务': 'Commercial services', '巡检与特种': 'Inspection & specialized applications', '工业与物流': 'Industry & logistics',
  '整机本体': 'Robot platforms', '消费与健康': 'Consumer & health', '生态与跨界': 'Ecosystem & cross-industry',
  'IPO中': 'IPO in progress', '上市公司': 'Public company', '上市公司旗下': 'Public-company subsidiary', '已被收购': 'Acquired',
  '产业营课程': 'Industry Program', '参访与政企合作': 'Visits & industry partnerships', '大会与赛事': 'Conferences & competitions',
  '校友与闭门': 'Alumni & private sessions', '海外考察': 'Overseas visits', '火星之夜': 'Mars Night',
  '已办': 'Completed', '已排期': 'Scheduled', '学员': 'Participants', '报名审核': 'Application review',
  '校友优先': 'Alumni priority', '校友和受邀嘉宾': 'Alumni & invited guests', '校友和合作方': 'Alumni & partners', '联合举办': 'Co-hosted',
  '60+ 位跨期同学回到火星': '60+ participants from multiple cohorts returned to Mars', 'CES 期间': 'During CES',
  '上海': 'Shanghai', '上海 · 20+ 家企业和机构': 'Shanghai · 20+ companies and organizations',
  '上海 · 主题课程、案例分享、私董会': 'Shanghai · thematic courses, case studies & peer advisory sessions',
  '上海 · 西岸艺术中心': 'Shanghai · West Bund Art Center',
  '上海奉贤 · 工厂导览和圆桌「产品走向市场': 'Fengxian, Shanghai · factory tour & product-to-market roundtable',
  '北京': 'Beijing', '北欧': 'Nordic countries', '卡在哪一步？」': 'Where does market entry stall?',
  '含火星私董会': 'Includes a Mars peer advisory session', '宁波': 'Ningbo', '深圳': 'Shenzhen',
  '深圳 · Fair Plus 峰会期间': 'Shenzhen · during Fair Plus',
  '深圳 · 财务主题课程、经营沙盘': 'Shenzhen · finance course & business simulation',
  '瑞士、柏林、慕尼黑、瑞典、巴黎': 'Switzerland, Berlin, Munich, Sweden & Paris',
  '美国 · 伯克利': 'United States · Berkeley', '美国 · 斯坦福': 'United States · Stanford',
  '美国 · 旧金山、拉斯维加斯': 'United States · San Francisco & Las Vegas',
  '苏州 · 15 家产业方、10 位创业者、10 位投资人': 'Suzhou · 15 industry partners, 10 founders & 10 investors',
  '遵义': 'Zunyi', '遵义 · 主题研讨「守初心」': 'Zunyi · discussion on staying true to the mission', '遵义 · 茅台镇': 'Zunyi · Maotai Town',
  '36氪转载': '36Kr (reprint)', '北京商报': 'Beijing Business Today', '南方财经': 'Southern Finance',
  '同花顺转北交所披露': 'Beijing Stock Exchange disclosure via iFinD', '封面新闻（网易转载）': 'Cover News (via NetEase)',
  '每日经济新闻': 'National Business Daily', '华尔街见闻': 'Wallstreetcn',
  '新华网（转载）': 'Xinhua (reprint)', '澎湃新闻': 'The Paper', '腾讯新闻': 'Tencent News', '行业报道': 'Industry report',
};

function label(value: string): string {
  if (!value) return '';
  const period = value.match(/^第\s*(\d+)\s*期$/);
  if (period) return `Cohort ${period[1]}`;
  if (value.includes('官网')) return value.includes('36氪') ? 'Official website, via 36Kr' : 'Official website';
  if (!(value in dictionary)) throw new Error(`Missing alumni English label: ${value}`);
  return dictionary[value];
}

const names = researchedNames as Record<string, { nameEn: string | null; verified: boolean; sourceUrl: string | null }>;
const english = translations as { intro: Record<string, string>; events: Record<string, string>; news: Record<string, string> };
const companyNames = new Map(alumni.companies.map((c) => {
  const research = names[c.id];
  // Keep the Chinese name when no evidenced official English name is available.
  return [c.name, research?.verified && research.nameEn && /^https?:\/\//.test(research.sourceUrl || '') ? research.nameEn : c.name];
}));

function requiredTranslation(table: 'intro' | 'events', id: string): string {
  const value = english[table][id];
  if (!value?.trim()) throw new Error(`Missing alumni English ${table}: ${id}`);
  return value;
}

export function localizedAlumni(locale: Locale): AlumniData {
  if (locale === 'zh') return alumni;
  const mapStats = (items: { name: string; count: number }[]) => items.map((item) => ({ ...item, name: label(item.name) }));
  return {
    ...alumni,
    stats: { byPeriod: mapStats(alumni.stats.byPeriod), bySegment: mapStats(alumni.stats.bySegment), byRegion: mapStats(alumni.stats.byRegion) },
    companies: alumni.companies.map((c) => {
      const news = c.latestNews && alumni.news.find((n) => n.company === c.name && n.title === c.latestNews?.title);
      return {
        ...c, name: companyNames.get(c.name) || c.name, intro: requiredTranslation('intro', c.id),
        segment: label(c.segment), region: label(c.region), subSegment: label(c.subSegment), status: label(c.status),
        latestNews: news && english.news[news.id] ? { date: news.date, title: english.news[news.id], source: label(news.source), url: news.url } : null,
      };
    }),
    news: alumni.news.filter((n) => english.news[n.id]?.trim()).map((n) => ({ ...n, company: companyNames.get(n.company) || n.company, title: english.news[n.id], source: label(n.source) })),
    events: alumni.events.map((e) => ({ ...e, date: e.date.replace(/下午/g, 'afternoon').replace(/晚/g, 'evening'), title: requiredTranslation('events', e.id), types: e.types.map(label), places: e.places.map(label), status: label(e.status), audience: label(e.audience) })),
  };
}

export const alumniUi = {
  zh: {
    all: '全部', directory: '校友名录', title: '找公司，看生态', data: '更新于',
    contents: '本页内容', companies: '公司', news: '动态', proof: '合作成果', events: '活动', scale: '校友生态规模', asOf: '截至',
    companyUnit: '家公司', countUnit: '家公司', alumniUnit: '位校友', segmentUnit: '个产业环节', regionUnit: '个地区', eventUnit: '场活动与课程',
    search: '搜索公司', placeholder: '搜公司、方向，比如 灵巧手、巡检、陪伴', reset: '清除筛选', filters: '按环节、地区、期数筛选',
    segment: '环节', region: '地区', period: '期数（可跨期）', empty: '没有匹配的公司，换个关键词或清除筛选试试。',
    reports: '公开报道', recent: '校友进展', newsIntro: '融资、上市与公司新进展。', more: '查看更多动态',
    official: '官网', latest: '最新动态', source: '来源', eventTitle: '活动与课程', completed: '场已办', scheduled: '场已排期', months: '个月有活动',
    next: '接下来', archive: '全年记录', monthFilter: '按月份查看全年活动', emptyMonth: '本月暂无活动记录。', scheduledStatus: '已排期',
    eventYearNote: '以下活动日期均为 {year} 年，数量仅统计该年度。',
    annualEventUnit: '{year} 年活动与课程',
    annualPhoto: '2026 年活动现场', annualPhotoNote: 'CES 考察与海外交流',
    eventFormatsTitle: '六类活动与课程', eventFormatsNote: '{year} 年数量含已办与排期；配图含往期现场。',
    capitalNews: '融资与上市', otherNews: '更多校友进展',
    cooperation: '校友合作', cooperationTitle: '合作累计', cooperationCases: '校友合作案例',
    expandEvents: '展开其余 {count} 条', collapseEvents: '收起',
  },
  en: {
    all: 'All', directory: 'Company directory', title: 'Find companies. Explore the ecosystem.', data: 'Updated',
    contents: 'On this page', companies: 'Companies', news: 'News', proof: 'Outcomes', events: 'Events', scale: 'Community at a glance', asOf: 'As of',
    companyUnit: 'companies', countUnit: 'companies', alumniUnit: 'alumni', segmentUnit: 'industry segments', regionUnit: 'regions', eventUnit: 'events & courses',
    search: 'Search companies', placeholder: 'Search companies or capabilities', reset: 'Clear filters', filters: 'Filter by segment, region or cohort',
    segment: 'Segment', region: 'Region', period: 'Cohort (may overlap)', empty: 'No matching companies. Try another keyword or clear the filters.',
    reports: 'Public reports', recent: 'Alumni updates', newsIntro: 'Funding, listings & company milestones.', more: 'More news',
    official: 'Website', latest: 'Latest news', source: 'Source', eventTitle: 'Events & courses', completed: 'completed', scheduled: 'scheduled', months: 'active months',
    next: 'Coming up', archive: 'Year in review', monthFilter: 'Filter annual events by month', emptyMonth: 'No events recorded this month.', scheduledStatus: 'Scheduled',
    eventYearNote: 'All event dates below are in {year}. Counts cover this year only.',
    annualEventUnit: 'Events & courses in {year}',
    annualPhoto: 'Events in 2026', annualPhotoNote: 'CES visits & overseas exchanges',
    eventFormatsTitle: 'Six ways to take part', eventFormatsNote: 'Counts include completed and scheduled events in {year}. Photos include past gatherings.',
    capitalNews: 'Funding & listings', otherNews: 'More company updates',
    cooperation: 'Alumni collaboration', cooperationTitle: 'Cumulative impact', cooperationCases: 'Alumni collaboration cases',
    expandEvents: 'Show {count} more', collapseEvents: 'Show less',
  },
};
