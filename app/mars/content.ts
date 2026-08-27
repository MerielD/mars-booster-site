export type Locale = 'zh' | 'en';
type Item = { title: string; body: string };
type Action = Item & { href: string };
type Metric = { value: string; label: string; note?: string };
type Program = { title: string; status: string; audience: string; stage: string; format: string; value: string; role: string; href: string; cta: string };
type Resource = Item & { access: string; href: string };
export type SiteCopy = {
  lang: Locale; logoAlt: string; menuLabel: string; nav: string[]; switchLabel: string; switchHref: string;
  heroKicker: string; heroLines: string[]; heroSummary: string; heroCta: string; heroMarker: string;
  glanceLabel: string; glance: Metric[];
  trustProofKicker: string; trustProofTitle: string; trustProofBody: string; trustProofMetrics: Metric[]; trustProofLink: string; trustProofPerson: string; trustProofPersonRole: string;
  thesisKicker: string; thesisTitle: string; thesisBody: string; thesisNotes: string[]; stack: Item[];
  frontiersKicker: string; frontiersTitle: string; frontiersIntro: string; frontiers: Item[];
  aboutKicker: string; aboutTitle: string; aboutBody: string; aboutModel: string; values: string[]; milestones: Item[];
  modelKicker: string; modelTitle: string; modelBody: string; cycle: Item[]; capabilities: Item[];
  networkKicker: string; networkTitle: string; networkBody: string; networkMetrics: Metric[]; touchpoints: Item[];
  insightKicker: string; insightTitle: string; insightBody: string; insightAssets: Resource[];
  programsKicker: string; programsTitle: string; programsIntro: string; programLabels: string[]; programs: Program[];
  ventureKicker: string; ventureTitle: string; ventureBody: string; ventureSteps: string[]; ventureMetrics: Metric[];
  solutionsKicker: string; solutionsTitle: string; solutionsBody: string; solutions: Item[];
  globalKicker: string; globalTitle: string; globalBody: string; globalMetrics: Metric[]; globalDone: string; globalNext: string;
  proofKicker: string; proofTitle: string; proofIntro: string; proof: { company: string; outcome: string; detail: string }[];
  voiceKicker: string; voiceTitle: string; voices: { quote: string; by: string; image: string; pos?: string }[];
  brandKicker: string; brandTitle: string; brandBody: string; brandLine: string;
  actionKicker: string; actionTitle: string; actions: Action[]; location: string; email: string; phone: string; copyright: string;
  explore: { title: string; body: string; href: string }[];
};

export const copies: Record<Locale, SiteCopy> = {
  zh: {
    lang: 'zh', logoAlt: '火星加速器', menuLabel: '打开导航', switchLabel: 'EN', switchHref: '../en/',
    nav: ['关于火星', '创始人项目', '孵化与产业', '行业洞察', '全球连接', '成果案例', '联系申请'],
    heroKicker: '物理AI创始人加速与创新生态平台', heroLines: ['从技术到市场，', '从中国到全球'],
    heroSummary: '连接创始人、产业与市场，陪伴新一代科技创业者完成从专家到创始人、从产品到真实市场、从中国到全球的关键跨越。',
    heroCta: '认识火星', heroMarker: '上海 · 苏州 · 深圳 · 北京',
    glanceLabel: '截至 2026.07.22', glance: [
      { value: '2024.12', label: '成立于上海' }, { value: '8期', label: '主办及联合主办项目' },
      { value: '320+', label: '火星物理AI企业学员' }, { value: '30+', label: '企业、政府及园区伙伴' }, { value: '5个', label: '孵化及投资项目' },
    ],
    trustProofKicker: '社区成果案例', trustProofTitle: '火星的连接与陪伴，是创始人关键结果的一部分。',
    trustProofBody: '火星参与组织建设、供应链与校友业务连接；创始人的关键结果，同样由企业自身经营、市场环境与多方支持共同促成。',
    trustProofMetrics: [{ value: '5轮', label: '灵御智能 · 一年多内完成融资' }, { value: '>10家', label: '极湃电磁 · 半年内意向合作校友' }, { value: '<1个月', label: '中智蓝途 · 开营后达成合作意向' }],
    trustProofLink: '查看完整成果依据',
    trustProofPerson: '陈亮', trustProofPersonRole: '「陈亮聊机器人创业」主理人 · 由火星团队策划运营的创始人IP',
    thesisKicker: '为什么是现在', thesisTitle: '智能，由此具身。',
    thesisBody: '当智能开始感知环境、形成决策并驱动真实世界，物理AI由此发生。未来20—30年，它将与全球化共同重构新一代科技企业。',
    thesisNotes: ['中国的工程、制造与供应链能力提供系统性基础', '全球市场、人才与创新网络成为必须尽早建立的成长能力'],
    stack: [
      { title: '产业底座', body: '材料 · 芯片 · 传感器 · 核心零部件 · 能源 · 先进制造' },
      { title: '智能系统', body: '感知 · 模型 · 数据 · 决策 · 控制' },
      { title: '产品载体', body: '机器人 · 自动驾驶 · 无人机 · AI硬件 · 智能设备' },
      { title: '应用场景', body: '制造 · 家庭 · 交通 · 物流 · 商业服务 · 特种作业' },
    ],
    frontiersKicker: '创始人的真实挑战', frontiersTitle: '技术领先，不等于企业领先。',
    frontiersIntro: '成为全球领先企业，往往需要连续完成三次关键跨越。单一课程、资本或资源介绍，无法替代长期、可信、产业相关的创新生态。',
    frontiers: [
      { title: '技术专家 → 创始人CEO', body: '战略、组织、融资与领导力' },
      { title: '技术产品 → 真实市场', body: '场景、客户、产品市场匹配、交付与规模化' },
      { title: '中国市场 → 全球市场', body: '本地化、渠道、合规、人才、品牌与全球合作网络' },
    ],
    aboutKicker: '关于火星', aboutTitle: '把创始人、产业认知与全球资源组织在一起。',
    aboutBody: '火星不是单一的培训机构、传统孵化器或行业协会。我们持续发现创业者、沉淀一线认知、组织高信任协作，并推动创新走向真实市场。',
    aboutModel: '一个核心网络 · 两项平台能力 · 四类业务', values: ['简单', '信任', '共享', '共创'],
    milestones: [
      { title: '2024.12', body: '火星加速器成立于上海' }, { title: '2025.03', body: '产业营第1期开营；首个孵化项目诞生' },
      { title: '2025.04', body: '首届火星创始人大会；发布社区图谱' }, { title: '2026.01', body: '火星看世界·美国CES与硅谷行动' },
      { title: '2026.04', body: '第二届创始人大会；发布产业深度报告' }, { title: '2026.05', body: '物理AI创业营第1期，38个早期项目入选' },
    ],
    modelKicker: '运行机制', modelTitle: '网络、认知与业务，形成持续运转的价值循环。',
    modelBody: '火星通过网络密度、产业判断和生态动员，让项目发现、真实需求、业务价值与社区成长彼此反哺。',
    cycle: [
      { title: '高质量入口', body: '创始人项目与生态活动持续发现成员和真实需求' },
      { title: '产业判断', body: '研究、数据、访谈与一线信号提高项目筛选质量' },
      { title: '协作创造价值', body: '孵化、产业服务与全球合作推动创新落地' },
      { title: '长期反哺', body: '业务与成果继续增强社区信任和项目发现' },
    ],
    capabilities: [
      { title: '产业洞察与项目筛选', body: '火星内核：研究、数据、访谈与判断' },
      { title: '生态动员与影响力放大', body: '社区、活动、内容与全球伙伴协同' },
    ],
    networkKicker: '创始人网络', networkTitle: '网络的价值不在规模，而在高质量节点之间持续发生的合作。',
    networkBody: '320+为火星自2024年12月成立以来的物理AI企业学员；下列规模来自核心团队九年长期积累，并非火星成立后新增。精选进入、深度共学、高频互动与长期协作，才是这些节点产生价值的方式。',
    networkMetrics: [
      { value: '640+', label: '创始人校友', note: '核心团队九年累计｜非火星新增' }, { value: '600+', label: '社区企业', note: '核心团队九年累计｜非火星新增' },
      { value: '500+', label: '具身智能产业链企业', note: '核心团队九年累计｜非火星新增' }, { value: '2,000+', label: '投资人与生态伙伴', note: '核心团队九年累计｜非火星新增' },
    ],
    touchpoints: [
      { title: '行研会', body: '围绕技术路线、商业化与产业趋势展开小规模深度讨论。' },
      { title: '火星之夜', body: '连接创始人、产业方、投资人、专家与合作伙伴。' },
      { title: '创始人大会', body: '呈现创始人观点、企业进展、研究成果与产业议题。' },
      { title: '参访与展会', body: '连接真实需求、客户、伙伴、供应链与市场机会。' },
    ],
    insightKicker: '火星内核', insightTitle: '从一线信号，到产业判断。',
    insightBody: '社区让火星持续接触一线信号；研究把信号沉淀为判断；判断再服务于项目筛选、产业合作和创始人决策。',
    insightAssets: [
      { title: '火星社区图谱', body: '持续更新的社区数据库与产业地图', access: '持续更新｜联系获取', href: 'mailto:lifen@mars686.com?subject=Request%20Mars%20Community%20Map' },
      { title: 'AI硬件深度研究', body: '2025.07 · 30页 · 桌面研究、访谈与数据库', access: '报告资料｜联系获取', href: 'mailto:lifen@mars686.com?subject=Request%20AI%20Hardware%20Research' },
      { title: '具身智能数据产业链', body: '2026.04 · 44页 · 新基础设施深度研究', access: '报告资料｜联系获取', href: 'mailto:lifen@mars686.com?subject=Request%20Embodied%20AI%20Data%20Report' },
      { title: '陈亮聊机器人创业', body: '5万+粉丝 · 600万+累计播放 · 172条视频', access: '公开内容｜平台链接待补充', href: 'mailto:lifen@mars686.com?subject=Request%20Mars%20Media%20Links' },
    ],
    programsKicker: '创始人项目', programsTitle: '两类项目，两条进入高质量社区的路径。',
    programsIntro: '产业营服务已经进入产业的创始人；创业营更早发现产品与项目。二者共同构成社区入口与项目发现机制。',
    programLabels: ['适合谁', '企业阶段', '项目机制', '核心价值', '战略作用'],
    programs: [
      { title: '火星具身智能产业营', status: '5期已完成 · 每期26 / 39 / 40 / 40 / 40人', audience: '具身智能创始人及产业新业务负责人', stage: '种子轮至上市公司', format: '付费 · 深度模块 · 长期社区', value: '创始人成长、商业化、组织、融资、产业协作与全球化', role: '核心社区入口', cta: '咨询下一期', href: 'mailto:lifen@mars686.com?subject=Mars%20Industry%20Program%20Application' },
      { title: '火星物理AI创业营', status: '1期已完成 · 38个早期项目入选', audience: '消费级AI硬件及早期物理AI创业者', stage: '想法、Demo至种子轮；85%+为天使或更早', format: '上百项目报名 · 免费 · 高度筛选', value: '产品定义、市场、供应链、全球化与早期验证', role: '早期项目与投资入口', cta: '咨询下一期', href: 'mailto:lifen@mars686.com?subject=Mars%20Physical%20AI%20Startup%20Program' },
    ],
    ventureKicker: '孵化与投资', ventureTitle: '从社区发现，到长期共创。',
    ventureBody: '火星不只提供资源连接，而是在项目早期参与方向、产品、业务、团队和融资等关键判断与执行。',
    ventureSteps: ['发现', '判断', '共创', '投资', '加速'],
    ventureMetrics: [{ value: '5个', label: '孵化及投资项目' }, { value: '3个', label: '从成立初期深度孵化' }],
    solutionsKicker: '产业解决方案', solutionsTitle: '把社区、研究与项目能力，组合成产业解决方案。',
    solutionsBody: '面向企业、政府部门与产业园区，围绕产业判断、创始人项目、企业能力和产业链协同展开。',
    solutions: [
      { title: '产业研究与咨询', body: '行业地图、趋势判断与决策依据' }, { title: '定制创始人项目', body: '产业营、创业营、极客营与创新大赛' },
      { title: '企业内训及咨询', body: '战略、组织、经营与财务等关键能力' }, { title: '生态建设及产业链协同', body: '技术、客户、供应链、市场、资本与人才连接' },
    ],
    globalKicker: '全球连接', globalTitle: '把全球化，从一次参访变成科技公司的成长能力。',
    globalBody: '火星正在逐步建设双向连接能力，帮助创始人更早理解市场、渠道、品牌、本地化、人才与合作网络。',
    globalMetrics: [{ value: '6场', label: '海外活动' }, { value: '7场', label: '机构及企业参访' }, { value: '400+', label: '活动参与企业' }],
    globalDone: '已完成｜美国CES与硅谷参访、投资机构与创业公司交流、海外人才连接',
    globalNext: '规划中｜欧洲行动、CES 2027、海外伙伴节点与软着陆能力',
    proofKicker: '成果案例', proofTitle: '社区的价值，最终体现在创始人的关键结果上。',
    proofIntro: '以下案例来自已批准公开的公司介绍材料。成果由企业自身经营、市场环境与多方支持共同促成。',
    proof: [
      { company: '灵御智能', outcome: '一年多完成5轮融资，团队由20+人成长至120+人。', detail: '火星参与组织建设、供应链与校友业务连接；校友合作订单超过2,000万元。' },
      { company: '极湃电磁', outcome: '半年内获得10+家校友合作意向，估值翻倍。', detail: '通过跨期校友引荐与业务对接，企业估算潜在订单超过2,000万元。' },
      { company: '中智蓝途', outcome: '开营不足1个月，与同期学员达成合作意向。', detail: '围绕机器人第二曲线完成需求识别、场景与供应链连接，形成百万级初步订单。' },
    ],
    voiceKicker: '创始人声音', voiceTitle: '人们相信火星，因为长期陪伴留下了具体记忆。',
    voices: [
      { quote: '负责到底的长期坚持，赢得了硬科技创业者的“信任溢价”。', by: '龚䶮 · 华屹科技创始人、CEO', image: 'founder-gongyan.jpeg', pos: '50% 85%' },
      { quote: '在亮哥的加速营，对我的成长和提升非常大，陪我度过了一次很重要的个人瓶颈突破。', by: '李婷婷 · 木宇信息创始人', image: 'founder-litingting.jpeg', pos: '50% 4%' },
      { quote: '七年来一路见证亮哥与团队，面对挑战一次次迎难而上，一番番破茧重生。', by: '柴志伟 · 深擎科技 CEO', image: 'founder-chaizhiwei.png', pos: '50% 31%' },
    ],
    brandKicker: '品牌故事', brandTitle: '聚是一团火，散是满天星。',
    brandBody: '科技创业者像降落到地球的火星人：在人群中是异类，来到这里，都是同类。他们在科技无人区探索拓荒，也在用科技推动人类进步。',
    brandLine: '温暖与奇幻，光明与冒险，科技与未来。',
    actionKicker: '进入火星', actionTitle: '下一次关键跨越，从一次真实连接开始。',
    actions: [
      { title: '申请创始人项目', body: '加入产业营或物理AI创业营', href: 'mailto:lifen@mars686.com?subject=Mars%20Founder%20Program%20Application' },
      { title: '产业生态合作', body: '与企业、政府及产业园区共同建设创新项目', href: 'mailto:lifen@mars686.com?subject=Mars%20Industry%20Partnership' },
      { title: '全球市场合作', body: '连接海外市场、伙伴、人才与创新网络', href: 'mailto:lifen@mars686.com?subject=Mars%20Global%20Partnership' },
      { title: '联系火星团队', body: '讨论项目、合作与长期同行的可能', href: 'mailto:lifen@mars686.com?subject=Contact%20Mars%20Booster' },
    ],
    location: '上海', email: 'lifen@mars686.com', phone: '+86 185 0167 6966', copyright: '火星加速器',
    explore: [
      { title: '关于火星', body: '使命、运行机制与创始人网络', href: 'about' },
      { title: '创始人项目', body: '产业营与物理AI创业营，两类进入社区路径', href: 'programs' },
      { title: '孵化与产业', body: '孵化投资与产业解决方案', href: 'ventures' },
      { title: '行业洞察', body: '研究报告、社区图谱与从业者内容', href: 'insight' },
      { title: '成果案例', body: '创始人关键结果与社区声音', href: 'proof' },
      { title: '全球连接', body: '从中国市场走向全球', href: 'global' },
    ],
  },
  en: {
    lang: 'en', logoAlt: 'Mars Booster', menuLabel: 'Open navigation', switchLabel: '中文', switchHref: '../zh/',
    nav: ['About', 'Programs', 'Ventures & Industry', 'Insight', 'Global', 'Proof', 'Contact'],
    heroKicker: 'Founder Acceleration & Innovation Ecosystem for Physical AI', heroLines: ['From technology to market.', 'From China to the world.'],
    heroSummary: 'We connect founders, industry and markets—helping technology entrepreneurs cross from expert to founder, product to real market, and China to the world.',
    heroCta: 'Meet Mars Booster', heroMarker: 'SHANGHAI · SUZHOU · SHENZHEN · BEIJING',
    glanceLabel: 'AS OF JUL 22, 2026', glance: [
      { value: '2024.12', label: 'Founded in Shanghai' }, { value: '8', label: 'Programs hosted / co-hosted' },
      { value: '320+', label: 'Mars Physical AI company participants' }, { value: '30+', label: 'Corporate, government & park partners' }, { value: '5', label: 'Incubation & investment projects' },
    ],
    trustProofKicker: 'Community outcome cases', trustProofTitle: 'Mars’ connection and support are one part of founders’ key results.',
    trustProofBody: 'Mars participated in organization building, supply-chain and alumni-business connections. Founders’ key results also reflect their own execution, market conditions and support from many parties.',
    trustProofMetrics: [{ value: '5', label: 'Lingyu · rounds in a little over a year' }, { value: '10+', label: 'GPEM · alumni leads within six months' }, { value: '<1 mo', label: 'Zhongzhi · partnership intent within a month' }],
    trustProofLink: 'See the full evidence',
    trustProofPerson: 'Chen Liang', trustProofPersonRole: 'Host, “Chen Liang Talks Robotics” · Founder-led media run by the Mars team',
    thesisKicker: 'Why now', thesisTitle: 'Intelligence becomes embodied.',
    thesisBody: 'When intelligence senses its environment, makes decisions and acts in the real world, Physical AI begins. Over the next 20–30 years, it will converge with globalization to reshape technology companies.',
    thesisNotes: ['China’s engineering, manufacturing and supply-chain strengths provide the foundation', 'Global markets, talent and innovation networks become essential growth capabilities'],
    stack: [
      { title: 'Industry base', body: 'Materials · Chips · Sensors · Components · Energy · Advanced manufacturing' },
      { title: 'Intelligence', body: 'Perception · Models · Data · Decision-making · Control' },
      { title: 'Products', body: 'Robots · Autonomous driving · Drones · AI hardware · Smart devices' },
      { title: 'Applications', body: 'Manufacturing · Home · Mobility · Logistics · Services · Specialized operations' },
    ],
    frontiersKicker: 'The founder challenge', frontiersTitle: 'Technical leadership does not automatically become company leadership.',
    frontiersIntro: 'Building a global leader often requires three successive transitions. Courses, capital or introductions alone cannot replace a trusted, long-term, industry-rooted ecosystem.',
    frontiers: [
      { title: 'Technical expert → Founder / CEO', body: 'Strategy, organization, fundraising and leadership' },
      { title: 'Technology product → Real market', body: 'Use cases, customers, PMF, delivery and scale' },
      { title: 'China market → Global market', body: 'Localization, channels, compliance, talent, brand and partnerships' },
    ],
    aboutKicker: 'About Mars', aboutTitle: 'Connecting founders, industry insight and global resources.',
    aboutBody: 'Mars Booster is more than a training provider, incubator or association. We continuously identify founders, build frontline insight, organize high-trust collaboration and help innovation reach real markets.',
    aboutModel: '1 core network · 2 platform capabilities · 4 businesses', values: ['Simplicity', 'Trust', 'Sharing', 'Co-create'],
    milestones: [
      { title: 'DEC 2024', body: 'Mars Booster founded in Shanghai' }, { title: 'MAR 2025', body: 'Industry Program #1; first incubated venture' },
      { title: 'APR 2025', body: 'Founder Summit #1; community map released' }, { title: 'JAN 2026', body: 'Mars Goes Global: U.S. CES and Silicon Valley' },
      { title: 'APR 2026', body: 'Founder Summit #2; deep industry report released' }, { title: 'MAY 2026', body: 'Startup Program #1; 38 early-stage ventures selected' },
    ],
    modelKicker: 'Operating model', modelTitle: 'Network, insight and business form a sustained value cycle.',
    modelBody: 'Network density, informed judgment and ecosystem mobilization allow venture discovery, real demand, business value and community growth to reinforce one another.',
    cycle: [
      { title: 'High-quality entry', body: 'Programs and ecosystem activity surface founders and real demand' },
      { title: 'Industry judgment', body: 'Research, data, interviews and frontline signals improve selection' },
      { title: 'Collaboration creates value', body: 'Venture building, industry services and global partnerships bring innovation to market' },
      { title: 'Long-term reinforcement', body: 'Outcomes strengthen trust and future venture discovery' },
    ],
    capabilities: [
      { title: 'Industry insight & venture screening', body: 'Mars Insight: research, data, interviews and judgment' },
      { title: 'Ecosystem mobilization & reach', body: 'Community, events, content and global partners' },
    ],
    networkKicker: 'Founder network', networkTitle: 'A network’s value lies not in scale, but in what its high-quality nodes build together.',
    networkBody: 'The 320+ figure covers Mars Physical AI company participants since December 2024. The larger figures below come from the core team’s nine-year cumulative network and are not additions since Mars was founded. Curated entry, deep peer learning and long-term collaboration are how those nodes create value.',
    networkMetrics: [
      { value: '640+', label: 'Founder alumni', note: '9-year team network · not Mars-era additions' }, { value: '600+', label: 'Community companies', note: '9-year team network · not Mars-era additions' },
      { value: '500+', label: 'Embodied AI value-chain companies', note: '9-year team network · not Mars-era additions' }, { value: '2,000+', label: 'Investors & ecosystem partners', note: '9-year team network · not Mars-era additions' },
    ],
    touchpoints: [
      { title: 'Research roundtables', body: 'Small-group discussions on technology paths, commercialization and industry trends.' },
      { title: 'Mars Night', body: 'Connect founders, industry leaders, investors, experts and partners.' },
      { title: 'Founder Summit', body: 'Present founder views, venture progress, research and industry priorities.' },
      { title: 'Visits & exhibitions', body: 'Connect members to demand, customers, supply chains and markets.' },
    ],
    insightKicker: 'Mars Insight', insightTitle: 'From frontline signals to industry judgment.',
    insightBody: 'Community produces frontline signals; research turns those signals into judgment; judgment informs venture selection, industry collaboration and founder decisions.',
    insightAssets: [
      { title: 'Mars Community Map', body: 'A continuously updated community database and industry map', access: 'Continuously updated · request access', href: 'mailto:lifen@mars686.com?subject=Request%20Mars%20Community%20Map' },
      { title: 'AI Hardware Deep Dive', body: 'Jul 2025 · 30 pages · research, interviews and database', access: 'Research report · request access', href: 'mailto:lifen@mars686.com?subject=Request%20AI%20Hardware%20Research' },
      { title: 'Embodied AI Data Value Chain', body: 'Apr 2026 · 44 pages · new infrastructure deep dive', access: 'Research report · request access', href: 'mailto:lifen@mars686.com?subject=Request%20Embodied%20AI%20Data%20Report' },
      { title: 'Chen Liang Talks Robotics', body: '50K+ followers · 6M+ views · 172 videos', access: 'Public content · platform link pending', href: 'mailto:lifen@mars686.com?subject=Request%20Mars%20Media%20Links' },
    ],
    programsKicker: 'Founder programs', programsTitle: 'Two programs. Two paths into a high-quality community.',
    programsIntro: 'The Industry Program serves founders already building in the sector; the Startup Program discovers products and ventures earlier.',
    programLabels: ['For whom', 'Company stage', 'Format', 'Core value', 'Strategic role'],
    programs: [
      { title: 'Mars Embodied AI Industry Program', status: '5 cohorts completed · 26 / 39 / 40 / 40 / 40 participants', audience: 'Embodied AI founders and new-business leaders', stage: 'Seed-stage to listed companies', format: 'Paid · Deep modules · Long-term community', value: 'Founder development, commercialization, organization, fundraising, industry collaboration and globalization', role: 'Core community gateway', cta: 'Ask about the next cohort', href: 'mailto:lifen@mars686.com?subject=Mars%20Industry%20Program%20Application' },
      { title: 'Mars Physical AI Startup Program', status: '1 cohort completed · 38 early-stage ventures selected', audience: 'Consumer AI hardware and early Physical AI founders', stage: 'Idea/demo to seed; 85%+ at angel or earlier', format: '100+ applicants · Free · Highly selective', value: 'Product definition, market, supply chain, globalization and early validation', role: 'Early ventures & investment gateway', cta: 'Ask about the next cohort', href: 'mailto:lifen@mars686.com?subject=Mars%20Physical%20AI%20Startup%20Program' },
    ],
    ventureKicker: 'Ventures & investment', ventureTitle: 'From community discovery to long-term co-creation.',
    ventureBody: 'Mars does more than make introductions. We join early ventures in key decisions and execution across direction, product, business, team and fundraising.',
    ventureSteps: ['Discover', 'Assess', 'Co-create', 'Invest', 'Accelerate'],
    ventureMetrics: [{ value: '5', label: 'Ventures incubated and/or invested in' }, { value: '3', label: 'Deeply incubated from formation' }],
    solutionsKicker: 'Industry solutions', solutionsTitle: 'Community, research and venture capabilities—combined for industry.',
    solutionsBody: 'For companies, government agencies and industrial parks, Mars combines informed judgment, founder programs, organizational capability and value-chain collaboration.',
    solutions: [
      { title: 'Industry research & advisory', body: 'Industry maps, trend analysis and decision support' }, { title: 'Custom founder programs', body: 'Industry, startup and geek programs; innovation competitions' },
      { title: 'Corporate training & advisory', body: 'Strategy, organization, operations and finance' }, { title: 'Ecosystem & value-chain collaboration', body: 'Technology, customers, supply chain, markets, capital and talent' },
    ],
    globalKicker: 'Global connectivity', globalTitle: 'Make globalization a growth capability—not a one-off visit.',
    globalBody: 'Mars is building two-way connectivity that helps founders understand markets, channels, brand, localization, talent and partnerships earlier.',
    globalMetrics: [{ value: '6', label: 'Overseas events' }, { value: '7', label: 'Organizations visited' }, { value: '400+', label: 'Participating companies' }],
    globalDone: 'Completed | U.S. CES & Silicon Valley, investors and startups, global talent connections',
    globalNext: 'In development | Europe, CES 2027, overseas partner hubs and soft-landing support',
    proofKicker: 'Proof & outcomes', proofTitle: 'The community’s value ultimately shows up in decisive founder outcomes.',
    proofIntro: 'These cases come from approved company-profile materials. Outcomes reflect company execution, market conditions and support from many parties.',
    proof: [
      { company: 'Lingyu Intelligence', outcome: 'Five funding rounds in just over a year; team growth from 20+ to 120+.', detail: 'Mars supported organization building, supply chain and alumni business connections; alumni orders exceeded RMB 20 million.' },
      { company: 'GPEM', outcome: '10+ alumni leads and a doubled valuation within six months.', detail: 'Cross-cohort introductions and business matchmaking created an estimated RMB 20 million+ in potential orders.' },
      { company: 'Zhongzhi Lantu', outcome: 'Partnership intent with a cohort peer in less than one month.', detail: 'Demand discovery, use-case and supply-chain connections supported an initial order above RMB 1 million.' },
    ],
    voiceKicker: 'Founder voices', voiceTitle: 'People trust Mars because long-term support leaves specific memories.',
    voices: [
      { quote: 'Years of follow-through have earned the Mars team a rare trust premium among hard-tech founders.', by: 'Gong Yan · Founder & CEO, Huayi Technology', image: 'founder-gongyan.jpeg', pos: '50% 85%' },
      { quote: 'The program transformed my growth as a founder. Its faculty, curriculum and thoughtful team helped me break through a critical bottleneck.', by: 'Li Tingting · Founder, Muyu Information', image: 'founder-litingting.jpeg', pos: '50% 4%' },
      { quote: 'For seven years, I have watched Liang and his team face uncertainty head-on and emerge stronger.', by: 'Chai Zhiwei · CEO, Shenqing Technology', image: 'founder-chaizhiwei.png', pos: '50% 31%' },
    ],
    brandKicker: 'Brand story', brandTitle: 'Together, a blazing fire; apart, stars across the sky.',
    brandBody: 'Technology founders are Martians on Earth: pioneers in uncharted territory who find their peers here—and use technology to advance human progress.',
    brandLine: 'Warmth and wonder. Light and adventure. Technology and the future.',
    actionKicker: 'Enter Mars', actionTitle: 'The next critical transition starts with a real connection.',
    actions: [
      { title: 'Apply to a founder program', body: 'Join the Industry Program or Physical AI Startup Program', href: 'mailto:lifen@mars686.com?subject=Mars%20Founder%20Program%20Application' },
      { title: 'Industry collaboration', body: 'Build innovation programs with companies, governments and industrial parks', href: 'mailto:lifen@mars686.com?subject=Mars%20Industry%20Partnership' },
      { title: 'Global-market partnership', body: 'Connect markets, partners, talent and innovation networks', href: 'mailto:lifen@mars686.com?subject=Mars%20Global%20Partnership' },
      { title: 'Contact Mars', body: 'Discuss a venture, partnership or long-term journey', href: 'mailto:lifen@mars686.com?subject=Contact%20Mars%20Booster' },
    ],
    location: 'Shanghai', email: 'lifen@mars686.com', phone: '+86 185 0167 6966', copyright: 'Mars Booster',
    explore: [
      { title: 'About Mars', body: 'Mission, operating model and the founder network', href: 'about' },
      { title: 'Founder programs', body: 'Industry Program and Physical AI Startup Program', href: 'programs' },
      { title: 'Ventures & industry', body: 'Incubation, investment and industry solutions', href: 'ventures' },
      { title: 'Insight', body: 'Research, the community map and founder-led media', href: 'insight' },
      { title: 'Proof & outcomes', body: 'Founders’ key results and community voices', href: 'proof' },
      { title: 'Global', body: 'From China to global markets', href: 'global' },
    ],
  },
};
