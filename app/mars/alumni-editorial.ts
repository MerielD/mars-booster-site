import { alumni } from './alumni-data';

// The event snapshot contains month/day dates for this year, not the device's year.
export const eventYear = 2026;

// Explicitly supplied by the client on 2026-11-10; not independently audited or tied to the event year.
export const cooperationSummary = {
  provenance: 'client-provided',
  receivedAt: '2026-11-10',
  scope: 'cumulative',
  metrics: [
    {
      id: 'alumni-collaboration',
      zh: { value: '超 3 亿元', label: '校友之间的合作' },
      en: { value: '>RMB 300m', label: 'Collaboration between alumni' },
    },
    {
      id: 'fundraising-support',
      zh: { value: '超 6 亿元', label: '助力校友融资' },
      en: { value: '>RMB 600m', label: 'Alumni fundraising supported' },
    },
    {
      id: 'community-partners',
      zh: { value: '600+', label: '社区里的具身产业伙伴' },
      en: { value: '600+', label: 'Embodied AI industry partners in the community' },
    },
  ],
};

// Client-supplied company-profile PPTX, slide 17 (printed page 16).
// Preserve the source's time windows, intent/order distinctions and company estimate.
export const cooperationCases = [
  {
    id: 'lingyu', company: '灵御智能', logo: 'lingyu-logo.png',
    zh: {
      result: { value: '2,000万+', label: '校友合作订单' },
      description: '通过产业营与长期社区协同，连接供应链和校友业务。',
    },
    en: {
      result: { value: 'RMB 20m+', label: 'Orders through alumni collaboration' },
      description: 'The Industry Program and ongoing community collaboration connected supply chains and alumni business opportunities.',
    },
  },
  {
    id: 'jipai', company: '极湃电磁', logo: 'jipai-logo.jpg',
    zh: {
      result: { value: '>10家', label: '意向合作校友（半年+）' },
      description: '通过同期深度共学、跨期校友引荐与业务对接，拓展客户和新应用场景。',
    },
    en: {
      result: { value: '>10', label: 'Alumni companies interested in collaboration (over six months)' },
      description: 'Shared learning, introductions across cohorts and business matching opened connections to customers and new applications.',
    },
  },
  {
    id: 'zhongzhi', company: '中智蓝途', logo: 'zhongzhi-logo.png',
    zh: {
      result: { value: '<1个月', label: '开营后与同期学员达成合作意向' },
      description: '围绕机器人业务识别需求、连接场景与供应链，形成百万级初步订单。',
    },
    en: {
      result: { value: '<1 month', label: 'From program start to an intent to collaborate with cohort peers' },
      description: 'Identifying robotics needs and connecting applications and supply chains led to preliminary orders in the millions of RMB.',
    },
  },
];

// Classify source records once so translated titles keep the same editorial order.
const capitalIds = new Set(alumni.news
  .filter((n) => /融资|上市|估值|IPO|募资|挂牌|增发/.test(n.title))
  .map((n) => n.id));

export function isCapitalNews(id: string): boolean {
  return capitalIds.has(id);
}

// Source checks and date distinctions: rounds/round-03-capital-evidence-2026-11-10.md.
export const capitalFeatures = [
  {
    id: 'reczz28XSn9mlFYR', reportedAt: '2026-10-03',
    zh: { value: '约10.8亿港元', label: 'IPO 募资总额' },
    en: { value: '~HK$1.08bn', label: 'Gross IPO proceeds' },
  },
  {
    id: 'reczz28XSn9mlRV1', reportedAt: '2026-04-02',
    zh: { value: '超200亿元', label: '人民币 · 投后估值' },
    en: { value: '>RMB 20bn', label: 'Post-money valuation' },
  },
  {
    id: 'reczz28XSn9mlQqF', reportedAt: '2026-05-11',
    zh: { value: '近5亿元', label: '人民币 · Pre-A 轮融资' },
    en: { value: 'Nearly RMB 500m', label: 'Pre-A funding' },
  },
];

export const eventPhotos = {
  annual: {
    file: 'ces-2026.webp', width: 1400, height: 1050,
    zh: { caption: '火星看世界 · CES 2026', alt: '火星成员合影，前排展示 Mars Booster @ CES 2026 横幅' },
    en: { caption: 'Mars goes global · CES 2026', alt: 'Mars participants with a Mars Booster at CES 2026 banner' },
  },
};

export const eventFormats = [
  {
    type: '火星之夜',
    zh: { title: '火星之夜', description: '连接创始人、产业方、投资人和专家，围绕机器人与 AI 创业展开开放交流。' },
    en: { title: 'Mars Night', description: 'Open conversations on robotics and AI entrepreneurship, bringing together founders, industry partners, investors and experts.' },
    photo: {
      file: 'mars-night.webp', width: 1000, height: 666,
      zh: { caption: '火星之夜现场', alt: '火星之夜现场，成员围桌交流' },
      en: { caption: 'Mars Night gathering', alt: 'Members gathering around a table at Mars Night' },
    },
  },
  {
    type: '产业营课程',
    zh: { title: '产业营课程', description: '围绕战略、商业经营与财务展开主题课程，结合案例分享、沙盘与跨期选修。' },
    en: { title: 'Industry Program', description: 'Courses in strategy, business management and finance, with case discussions, simulations and electives across cohorts.' },
    photo: {
      file: 'founder-workshop.webp', width: 1000, height: 667,
      zh: { caption: '产业营课堂', alt: '产业营成员在桌面沙盘前共同讨论' },
      en: { caption: 'Program workshop', alt: 'Program participants discussing a tabletop business simulation' },
    },
  },
  {
    type: '校友与闭门',
    zh: { title: '校友与闭门', description: '创始人大会、产融对接、技术交流与校友年会，围绕具体业务问题开展讨论。' },
    en: { title: 'Alumni & private sessions', description: 'Founder summits, industry–investment matchmaking, technical discussions and alumni gatherings focused on practical business questions.' },
    photo: {
      file: 'founder-summit-2025.webp', width: 1000, height: 667,
      zh: { caption: '创始人大会 · 2025', alt: '2025 火星具身智能创始人大会舞台合影' },
      en: { caption: 'Founder Summit · 2025', alt: 'Group photo on stage at the 2025 Mars Embodied AI Founder Summit' },
    },
  },
  {
    type: '海外考察',
    zh: { title: '海外考察', description: 'CES、欧洲考察与海外机构参访，也包括海外团来华交流，连接国内外创业与产业网络。' },
    en: { title: 'Overseas visits', description: 'CES and European visits, overseas institution tours and visiting international delegations connect founder and industry networks.' },
    photo: {
      file: 'global-visit.webp', width: 1000, height: 750,
      zh: { caption: '海外参访现场', alt: '火星海外参访成员在建筑外合影' },
      en: { caption: 'Overseas visit', alt: 'Mars overseas visit participants photographed outside a building' },
    },
  },
  {
    type: '大会与赛事',
    zh: { title: '大会与赛事', description: 'Fair Plus、ITEC、WRC 与黑客松等大会赛事，提供展示、交流和产业连接的机会。' },
    en: { title: 'Conferences & competitions', description: 'Fair Plus, ITEC, WRC and hackathons offer opportunities to showcase products, exchange ideas and connect with industry.' },
    photo: {
      file: 'industry-expo.webp', width: 1000, height: 844,
      zh: { caption: '机器人产业链展会现场', alt: '机器人产业链展馆内的展位与参观人群' },
      en: { caption: 'Robotics industry exhibition', alt: 'Exhibition booths and visitors at a robotics industry trade show' },
    },
  },
  {
    type: '参访与政企合作',
    zh: { title: '参访与政企合作', description: '走进企业、工厂与园区，结合现场导览、主题圆桌和政企合作活动，连接真实产业需求。' },
    en: { title: 'Visits & industry partnerships', description: 'Company, factory and industry-park visits combine guided tours, roundtables and public-sector collaboration around real industry needs.' },
    photo: {
      file: 'product-demo-2025.webp', width: 1000, height: 666,
      zh: { caption: '赢在苏州交流现场 · 2025', alt: '2025 赢在苏州活动现场，参与者围绕产品演示交流' },
      en: { caption: 'Suzhou gathering · 2025', alt: 'Participants discussing a product demonstration at the 2025 Suzhou event' },
    },
  },
];

// Associate formats by canonical record IDs so translated type names do not affect counts.
export const eventIdsByFormat = new Map(eventFormats.map((format) => [
  format.type,
  new Set(alumni.events.filter((event) => event.types.includes(format.type)).map((event) => event.id)),
]));
