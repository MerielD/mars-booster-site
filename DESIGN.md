# 校友页设计记录

## 合作总览与企业补充（2026-11-10）

按客户最新截图，在资讯与活动之间增加合作累计总览，仅展示“超 3 亿元校友合作、超 6 亿元助力校友融资、600+ 社区具身产业伙伴”三个数字，不增加具体案例、人物、连线或累计合计。来源明确为本次客户提供的累计口径，不称作媒体核验或 2026 年统计，也不以旧版公司介绍作为这些数值的证据。桌面左侧标题、右侧三行指标，平板手机顺序堆叠，沿用现有字号与间距变量。

二期新增意界智创，业务简介与来源链接使用客户提供的新浪报道；未获证据的法定全称和官网留空、地区标为“未披露”。未披露可筛选，但不计入已披露地区覆盖数。五期按客户确认将展示名改为心言机器人，保留原 ID、期数、原简介中的心元系列模型，不据此推定新的法律主体或官方英文名。英文页面两家公司均保留中文品牌名。

当前目录 186 家、二期 34 家、本体与场景应用 71 家；校友人数仍为 211，不从新增公司推断新增学员。旧故事数组保持为空，本次客户总览与旧无来源案例分开维护，并在公开页面显示“累计数据由火星提供”。

## 样式变量整理（2026-11-10）

本轮属于维护性整理：保留已验收的实际字号、行高、阅读宽度和间距，不扩大为全站视觉改版。变量只定义在校友页五个 section 的范围内，共享页头、页尾和其他页面沿用原样式。详情面板仍在文档流内，继续使用边框及选中线，不增加海拔阴影。

### 字号角色

以下变量均以前缀 `--alumni-font-` 命名。相同阅读角色共用变量；流式标题保留原来的 `clamp()`。不以“取最近档位”为由缩小字号，也不为了限定档位数量合并不同用途。

| 变量后缀 | 桌面 / 手机 | 用途 |
| --- | --- | --- |
| caption | 12px | 规模带更新时间 |
| status | 13px | 活动状态 |
| meta | 14px | 公司元信息、来源、日期、图像说明等辅助文字 |
| control | 15px | 筛选选项、重置、页内跳转、更多动态 |
| body | 16px | 简介、新闻正文、活动标题与照片图注 |
| subheading | 18px | 新闻分组、公司名及活动记录小标题 |
| company | 18 / 17px | 目录公司名，桌面复用 subheading，手机保持原 17px |
| detail-title | 22 / 20px | 展开详情标题 |
| heading | 28px | 社区照片标题、手机规模数字 |
| page | clamp(38px,3.9vw,62px) | 页标题 |
| stat | clamp(24px,2.4vw,34px) | 活动统计数字 |
| hero | clamp(26px,2.7vw,40px) / 26px | 年度照片标题 |
| feature | clamp(36px,3.3vw,48px) / 36px | 精选资本事件金额 |

### 间距与阅读宽度

重复的 12px、24px 间距分别归入 `--alumni-space-related`、`--alumni-space-group`。这些是可复用的现有尺度，不要求所有组内或组间位置都使用同一值。目录摘要的 3px 紧密间距、控制尺寸、其他内距和响应式大间距保持原值。

简介继续使用 16px / 1.8，宽度上限为 `70ch`。`ch` 取当前字体的数字“0”字宽，不代表汉字数。2026-11-10 在本机 Windows Chrome 的实际字体环境中，70ch 约为 656.8px，16px 汉字字宽为 16px，约相当于 41 个汉字的宽度；这只是当前环境的测量，不保证所有字体或设备都一样。

中英最长简介的实测容器宽度记录在验收证据中。中文样本在 1440 / 768 / 390 / 375px 下分别约为 656.8 / 306.1 / 314 / 299px；平板侧栏与手机内距会先限制实际行宽。未来长文页的“30–36 个汉字”只是另一类阅读任务的试排起点，不用于覆盖名录简介，也不能据此认定当前简介必须改窄。

### 证据口径

公司目录与机构介绍中的社区网络或历史服务企业是不同集合。样式整理时的基线为 185 家公司、211 位校友；随后客户补充公司后更新为 186 家，人数保持 211。融资精选记录的是“媒体原报道正文已核对”，不表示已取得交易所或公司公告；本轮不增加 `verified` 字段的新含义。

2026 年 7 月公司介绍只能作为机构自述的来源，使用时须保留截至日期、统计范围及“潜在订单”“企业估算”等限定词。第 2 页“>2 亿校友合作金额”归于“长期累计网络”，但脚注关于“包括火星及创始团队历史服务项目”明确针对 600+ 家企业，不能将该脚注直接推导成合作金额覆盖九年。机构自述、媒体报道与官方披露应分别记录来源类型、时间和所支持的具体事实，不压成一条通用真实性等级。本轮不恢复案例、累计或首页品牌叙事区块。

## Round 03：年度说明、资本资讯与现场照片（2026-11-10）

本轮局部修改中英校友页，目标用户仍为查找公司、了解校友进展和社区活动的创业者及产业伙伴。沿用共享字体、黑白橙、目录与原位详情抽屉、搜索及三维筛选。当前阶段先完成本地实现与验收。

活动数字和月日列表明确属于快照年度 2026，不使用系统当前年份。年度主图采用可辨认 CES 2026 标识的照片；活动形式卡配图包含历史现场，图注明确可确认的年份，不绑定具体年度场次。现有高分辨率素材优先复用，必要时从客户公司介绍 PDF 提取原图；不使用整页截图，不带入旧版指标。

资本资讯采用客户参考图的三列大数字层级：金额或事件标题 36–48px、公司名 18px、事实简述 16px、日期来源 14px。桌面三列，手机单列，限定词与币种保留。精选须核实来源，不预设恢复旧参考图中的三条；下方按融资与上市、其他资讯分组，各组时间倒序，精选不重复。中英同一组选题，缺官方英文公司名直接用中文。

用户追加六类活动图文卡参考后，展示为一张年度主图及六张活动形式卡。每张卡包含现场照片及图注、2026 年分类数量和一段简短说明。按用户最新反馈去除全部参与人群小字，保留分类大数字。三列桌面、两列平板、单列手机；沿用黑白橙，使用现有字号及间距变量。数量按原始记录类型关联稳定 ID 后计算，不手写参考图的旧数字。当前六类依次为火星之夜 14、产业营课程 14、校友与闭门 14、海外考察 8、大会与赛事 9、参访与政企合作 4，含已办与排期、合计 63；月份筛选不影响年度分类数量。

主图保留横幅及合影主体；活动形式卡采用 16:9 配图，产业营课堂图片向上取景，保留站立学员头部。图片有中英图注与替代文本、真实尺寸和首屏外懒加载。2025 年大会及赢在苏州照片明确标注历史年份；类别说明概括现有活动记录，不展示未经核实的累计场次或新报名入口。

验证：类型检查、局部 lint、静态导出、隐私及译文校验；中英 1440/768/390/375px 实际截图、融资排序及去重、图像加载和裁切、年度说明、月份筛选与未来活动隔离、原位抽屉、200% 等效重排及旧页回归。

---

## Round 02 历史记录

以下保留当轮布局与数据口径；后续 Round 03 和上方变量说明优先。

覆盖中英校友页，修复阅读字号、展开灰洞和近期动态缺少重点层三个问题。保留共享 Shell、字体、黑白橙、桌面六列与手机两列，完整 185 家公司。共享页头页尾不在本轮范围。

脚本就绪后摘要保持原格位，详情原节点移入所在可见行后的共享抽屉，同时只打开一家。切换、关闭、筛选、搜索和重置会还原节点；窗口变化按实际列数重算位置。摘要保留原生键盘激活；关闭按钮与 Escape 返回摘要焦点，重排保留抽屉内焦点。无脚本时使用原生 details 与 CSS 筛选，网格白底避免灰色空洞。

追加详情面板样式：白底细边框和橙色左侧线，顶部公司名与收起按钮形成标题栏。正文使用深色阅读文字；官网与动态存在时放入右侧浅底资料区，手机移至正文下方。没有链接时正文使用单列，避免空的侧栏。

公司名桌面 18px、手机 17px，摘要元信息 14px，展开正文 16px / 1.8、最多 70ch。来源全称及链接 14px，搜索 16px，操作与选项约 15px。动态正文和公司 16px，日期来源 14px；活动标题 16px、日期地点 14px、状态 13px。长名称自然换行，不通过截断或缩字保留旧高度。

精选新闻从既有数据及英译按稳定 record ID 读取，桌面三列、980px 以下单列，手机标题 24px。精选从列表排除，唯一新闻总量仍为中文 105、英文 30。保留更多动态与活动，不恢复未核实的手写金额、案例或累计数组。

2026-11-09 新决策：找不到官方英文公司名就直接使用中文，不补拼音、不猜译名。已有 sourceUrl 且 verified 的官方英文名继续使用；简介、活动和新闻正文保持英文翻译。品牌名与法律全称允许中文。

验收包括类型检查、改动文件 ESLint、静态导出、隐私及品牌检查，以及中英 1440/768/390/375px Chrome 测试和截图。覆盖行中、行末、最后一行、筛选后抽屉、切换关闭、焦点、断点及 200% 等效重排、最长名称与简介、无脚本回退，保留旧页面 56 个断点组合回归。证据：`../prototype/qa-round02-alumni/`。

发布链路：GitHub main 自动发布 GitHub Pages；`www.marsbooster.net` 由域名 Worker 代理 `mars-booster-site.pages.dev`，须发布并验证 Cloudflare Pages 才能确认 www 更新。


## Image delivery (2026-11-10)

Static hosting serves committed WebP variants from `public/assets/optimized/`; no image API or client runtime is required. `app/mars/images.ts` emits relative URLs and responsive `srcset`/`sizes` using the generated manifest. Regenerate with `npm run images:prepare` after editing source photos; commit the manifest and generated images together.

First-screen section photos are eager and high priority. Offscreen content photos are lazy and asynchronously decoded. The annual alumni photo is eager at low priority to warm the events anchor destination; six activity-format cards remain lazy. Mobile cover images need sufficient pixels for their tall crops, rather than simply using the viewport width as their source width. Match image sizes to the 760px / 980px layout breakpoints. Keep legacy pages script-free and preserve the single alumni interaction script.

`node scripts/site-performance.mjs` audits all exported pages at 1440px and 390px with a cold cache, records FCP/LCP/CLS and image bytes, scrolls through every image, and saves screenshots. Add `--mobile-only --throttle` for fixed 150ms latency and 200,000 bytes/s download. Results are lab measurements, not visitor field metrics or evidence of worldwide CDN speed.
