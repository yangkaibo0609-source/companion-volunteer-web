export type PortraitMetric = {
  label: string
  value: string
  detail: string
}

export type PortraitQuestion = {
  eyebrow: string
  title: string
  body: string
  dataLine: string
}

export type FaceDatum = {
  label: string
  value: string
  note: string
  percent: string
}

export type LoadCard = {
  title: string
  value: string
  body: string
}

export type ChallengeCard = {
  title: string
  value: string
  body: string
}

export type ContributorPage = {
  id: string
  chapter: string
  question: string
  lead: string
  focus: string[]
  quote: string
  flipFront: string
  flipBack: string
  scratchTitle: string
  scratchHidden: string
}

export const portraitMetrics: PortraitMetric[] = [
  {
    label: '心智障碍群体',
    value: '1200万-2000万',
    detail: '涵盖智力发育迟缓、孤独症谱系障碍、唐氏综合征等多种类型。',
  },
  {
    label: '孤独症谱系障碍人群',
    value: '1300万-1400万',
    detail: '其中 0-14 岁孤独症儿童约 200 万-500 万。',
  },
  {
    label: '实名注册志愿者',
    value: '2.4亿',
    detail: '志愿队伍 135 万个，志愿服务项目 1332 万个。',
  },
  {
    label: '助残志愿者',
    value: '3744.3万',
    detail: '他们从庞大的志愿服务网络中走向心智障碍者和家庭。',
  },
]

export const portraitQuestions: PortraitQuestion[] = [
  {
    eyebrow: '01 / WHO',
    title: '心智障碍儿童是谁？',
    body: '他们可能是“星星的孩子”，也可能被诊断为智力发育迟缓、唐氏综合征或其他发展障碍。数据背后，是康复、教育、就业、未来安置与监护的长期压力。',
    dataLine: '我国心智障碍群体约 1200 万-2000 万人。',
  },
  {
    eyebrow: '02 / WHO ELSE',
    title: '志愿者是谁？',
    body: '注册系统里，志愿者更年轻、女性占比更高、学生群体更集中；但真正长期走进社区和家庭的人，又呈现出更成熟、更家庭化的样貌。',
    dataLine: '女性注册志愿者 65.79%，活跃志愿者平均年龄 43.1 岁。',
  },
  {
    eyebrow: '03 / COST',
    title: '他们付出什么？',
    body: '他们把周末、夜晚、节假日切成可以服务的时间，也把通勤、体力、情绪劳动和对孩子的牵挂一并带入陪护现场。',
    dataLine: '全国活跃志愿者年度服务总时长 41.06 亿小时。',
  },
  {
    eyebrow: '04 / GAP',
    title: '他们面临什么？',
    body: '距离、疲惫、流失、低回馈和风险保障的不确定性，让善意很难只靠热情维持。照亮他人的人，也需要被制度和社区接住。',
    dataLine: '同期加入十多名志愿者，长期留下的可能仅 1-2 人。',
  },
]

export const registeredVolunteerFace: FaceDatum[] = [
  { label: '女性志愿者', value: '65.79%', note: '近六年持续攀升。', percent: '66%' },
  { label: '大专以上学历', value: '75.73%', note: '本科及以上占 50.55%。', percent: '76%' },
  { label: '学生群体', value: '61.46%', note: '年龄集中在 15-22 岁。', percent: '61%' },
]

export const activeVolunteerFace: FaceDatum[] = [
  { label: '平均年龄', value: '43.1岁', note: '活跃志愿者更成熟。', percent: '72%' },
  { label: '男性占比', value: '56.7%', note: '与注册画像形成对照。', percent: '57%' },
  { label: '已婚群体', value: '81%', note: '许多人也承担家庭责任。', percent: '81%' },
]

export const loadCards: LoadCard[] = [
  {
    title: '时间不是剩余，而是挤出来的',
    value: '41.06亿小时',
    body: '全国活跃志愿者年度贡献服务总时长；平均到每位活跃志愿者，为 86.52 小时/年。',
  },
  {
    title: '他们走进的是高压家庭',
    value: '5871元/月',
    body: '心智障碍者家庭月均支出中，子女相关支出占 43%；超六成家庭年收入低于 10 万元。',
  },
  {
    title: '照护者也在被消耗',
    value: '75%',
    body: '文稿显示，照护者中 87% 为母亲，75% 有抑郁倾向，55% 处于亚健康状态。',
  },
  {
    title: '公益人的心理警报',
    value: '63.86%',
    body: '公益人职业倦怠和心理健康调查显示，受访公益人存在不同程度抑郁的比例较高。',
  },
]

export const challengeCards: ChallengeCard[] = [
  {
    title: '通勤没有被计入',
    value: '1.5小时',
    body: '高校志愿者从学校到服务地往往要经历长距离地铁通勤，活动后睡过站、坐过站并不少见。',
  },
  {
    title: '留存不断流失',
    value: '<20%',
    body: '同期加入的十多名志愿者中，至今仍在坚持的可能仅剩 1-2 人。',
  },
  {
    title: '保障并不稳定',
    value: '缺口',
    body: '保险购买、专业培训、情绪支持等保障措施很大程度依赖机构能力，现实执行参差不齐。',
  },
]

export const volunteerJourney = [
  '从学校到服务地：交通成本常被排除在“服务时长”之外。',
  '从报名到坚持：离开的原因常常是学业压力、通勤太远、服务太疲惫。',
  '从善意到制度：保险、培训、补贴与情绪支持仍需要稳定托底。',
]

export const contributorPages: ContributorPage[] = [
  {
    id: 'who',
    chapter: '他们是谁',
    question: '心智障碍儿童是谁？志愿者是谁？',
    lead: '她把“被看见”拆成两组人：一边是长期游离在公众视线之外的心智障碍儿童，一边是从 2.4 亿实名注册志愿者中走出来的助残志愿者。',
    focus: [
      '心智障碍群体约 1200 万-2000 万人。',
      '我国孤独症谱系障碍人群已达 1300 万-1400 万人。',
      '女性志愿者占比 65.79%，学生群体占比 61.46%。',
      '活跃志愿者平均年龄 43.1 岁，已婚群体高达 81%。',
    ],
    quote: '“这不是偶然的相遇，而是无数个家庭在漫长黑夜里等待的一束光。”',
    flipFront: '注册的、活跃的，年轻的、中年的，女性的、男性的。志愿者的面孔从来不是单一的。',
    flipBack: '宏观数据告诉我们规模，画像数据告诉我们差异：真正长期出现在线下服务现场的人，往往也背负自己的家庭与生活压力。',
    scratchTitle: '刮开第一层答案',
    scratchHidden: '他们是星星的孩子，也是千万个日复一日、无处言说的家庭。',
  },
  {
    id: 'cost',
    chapter: '他们付出了多少',
    question: '时间、精力、情感投入从哪里来？',
    lead: '她先让读者看见志愿者走进的世界：家庭月均支出 5871 元，子女相关支出占 43%，照护者身体与精神承受双重压力。',
    focus: [
      '心智障碍者家庭月均支出 5871 元。',
      '子女相关支出占家庭月均支出的 43%。',
      '全国活跃志愿者年度贡献服务总时长 41.06 亿小时。',
      '平均到每位活跃志愿者，为 86.52 小时/年。',
    ],
    quote: '“善意从来不是无限的。它需要被支持，被回应，被接住。”',
    flipFront: '他们不是闲人，而是上班族、学生、退休老人，把本属于自己的时间拿出来填补缝隙。',
    flipBack: '这些时间从周末、夜晚、节假日里挤出来。付出不只是一张服务时长表，也是一种被压缩的生活。',
    scratchTitle: '刮开时间账本',
    scratchHidden: '走出那扇门后，他们可能回到同样需要照顾的家庭，也可能回到一份不敢请假的工位。',
  },
  {
    id: 'gap',
    chapter: '他们面临什么',
    question: '疲惫、流失与制度缺口如何形成？',
    lead: '她把困境写得更具体：职业倦怠、薪酬困境、长距离通勤、志愿者留存率不足两成、风险保障缺口和机构资金压力彼此缠绕。',
    focus: [
      '63.86% 的受访公益人存在不同程度抑郁。',
      '同期加入的十多名志愿者中，坚持下来的可能仅 1-2 人。',
      '高校志愿者通勤常常需要约一个半小时。',
      '保险、培训、情绪支持仍依赖机构能力，现实执行参差不齐。',
    ],
    quote: '“制度为志愿者撑起的伞，漏洞太多。”',
    flipFront: '价值感会断裂，热情会疲惫，风险边界也并不总是清楚。',
    flipBack: '公益行业的困境不只属于机构，也会落到每一次陪护现场：人少事多、资金不稳、保障不足。',
    scratchTitle: '刮开困境闭环',
    scratchHidden: '一个半小时的地铁、从未被补偿的交通成本、一次活动后的愉悦与疲惫，共同拼出志愿者的现实处境。',
  },
]

export const portraitSource =
  '数据来源：数据新闻文稿整理，含中国残疾人联合会《2025年残疾人事业发展统计公报》、《中国孤独症教育康复行业发展状况报告》、中国志愿服务发展指数调研报告、北京市晓更助残基金会《心智障碍者家庭现状与未来托付需求调研报告》、《公益人职业倦怠和心理健康调查报告》、机构负责人及志愿者访谈等。'
