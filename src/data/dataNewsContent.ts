export type SourceSegment = { text: string; emphasis?: boolean }

export type BlackboardMetric = { value: string; label: string }

export type BlackboardChart = { title: string; src: string }

export type SourceParagraph = { segments: SourceSegment[]; chart?: BlackboardChart }

export type ScenePostscript = {
  lead: SourceParagraph[]
  heading: string
  paragraphs: SourceParagraph[]
}

export type DataBlackboardScene = {
  id: string
  part: number
  label: string
  question: string
  sourceSection: string
  paragraphs: SourceParagraph[]
  metrics: BlackboardMetric[]
  timeline?: string[]
  closing?: SourceParagraph
  postscript?: ScenePostscript
}

const paragraph = (segments: SourceSegment[], chart?: BlackboardChart): SourceParagraph => ({ segments, chart })
const chart = (title: string, src: string): BlackboardChart => ({ title, src })

export const volunteerHighFrequencyChart = chart(
  '访谈高频词',
  'https://dycharts.com/xshow/index.html?id=c_b0a628793cff844051f2a5d482d3c5eb',
)

export const dataBlackboardScenes: DataBlackboardScene[] = [
  {
    id: 'group', part: 1, label: '数据黑板 01', question: '心智障碍者：一个庞大却沉默的群体', sourceSection: '心智障碍者：一个庞大却沉默的群体',
    paragraphs: [
      paragraph([{ text: '心智障碍涵盖智力发育迟缓、孤独症谱系障碍、唐氏综合征等多种类型。《心智障碍者家庭需求与未来托付》调研报告显示，' }, { text: '我国心智障碍群体约有1200万至2000万人', emphasis: true }, { text: '。这意味着，' }, { text: '每70个中国人里，就有1个是心智障碍者', emphasis: true }, { text: '。他们大多数无民事行为能力或限制民事行为能力，在康复、教育、就业、未来安置与监护等各个环节，都面临巨大挑战。' }]),
      paragraph([{ text: '中国残联发布的《2025年残疾人事业发展统计公报》显示，接受基本康复服务的持证残疾人中，智力残疾人有66.3万人，精神残疾人有152.8万人。' }], chart('心智障碍者群体及康复服务数据', 'https://dycharts.com/xshow/index.html?id=c_d8e2c0c4c7dd61fa4c6508534d05e4a3')),
      paragraph([{ text: '在智力与精神残疾的交叉地带，孤独症（自闭症）是最受关注的一类。目前，我国孤独症谱系障碍人群已达1300万至1400万人。其中，0至14岁的孤独症儿童约有300万至500万人。' }, { text: '孤独症已成为导致我国儿童精神残疾的首要疾病。', emphasis: true }]),
    ],
    metrics: [{ value: '1200万至2000万人', label: '我国心智障碍群体约有1200万至2000万人' }, { value: '每70个中国人里，就有1个', label: '每70个中国人里，就有1个是心智障碍者' }, { value: '1300万至1400万人', label: '我国孤独症谱系障碍人群已达1300万至1400万人' }, { value: '300万至500万人', label: '0至14岁的孤独症儿童约有300万至500万人' }],
  },
  {
    id: 'volunteers', part: 1, label: '数据黑板 02', question: '志愿者：照亮他人的人', sourceSection: '志愿者：照亮他人的人',
    paragraphs: [
      paragraph([{ text: '与心智障碍群体的庞大规模相对应的，是另一组同样惊人的数字。' }]),
      paragraph([{ text: '截至目前，' }, { text: '我国实名注册志愿者总数已达2.4亿人', emphasis: true }, { text: '，志愿队伍135万个，志愿服务项目1332万个。其中，助残志愿者有3744.3万人，助残社会组织有2997个。他们的服务范围包括康复、就业帮助、教育辅导、托养照料、心理辅导、文体活动等多个领域。' }], chart('实名注册志愿者与助残志愿者', 'https://dycharts.com/xshow/index.html?id=c_2a3665964da43a6469214253e8055246')),
      paragraph([{ text: '那么，这些“照亮他人的人”，是什么样的人？', emphasis: true }]),
      paragraph([{ text: '注册志愿者，女性撑起半边天。2024年，女性志愿者占比达到65.79%，男性占34.21%。近六年来，女性志愿者的比例还在持续攀升。' }]),
      paragraph([{ text: '这些注册志愿者大多受过良好教育。大专以上学历的占75.73%，本科及以上的占50.55%。他们很年轻，学生群体占61.46%，年龄集中在15至22岁。' }]),
      paragraph([{ text: '当我们把目光投向“活跃志愿者”——那些真正走进社区、走进心智障碍者家庭的人——数据呈现出另一种样貌：' }]),
      paragraph([{ text: '平均年龄43.1岁，男性占56.7%，已婚群体高达81%。大专及以上文化程度占比最高，受教育水平越高的居民，参与志愿服务的可能性也越高。' }], chart('注册志愿者与活跃志愿者画像', 'https://dycharts.com/xshow/index.html?id=c_ff52fe485a326c7c2bc78a1120e7ad26')),
    ],
    metrics: [{ value: '2.4亿人', label: '我国实名注册志愿者总数已达2.4亿人' }, { value: '3744.3万人', label: '助残志愿者有3744.3万人' }, { value: '65.79%', label: '女性志愿者占比达到65.79%' }, { value: '61.46%', label: '学生群体占61.46%' }],
  },
  {
    id: 'time', part: 2, label: '数据黑板 03', question: '他们付出了多少？', sourceSection: '他们付出了多少？',
    paragraphs: [
      paragraph([{ text: '要回答这个问题，先要看他们面对的是什么。' }]),
      paragraph([{ text: '心智障碍者家庭月均支出' }, { text: '5,871元', emphasis: true }, { text: '，其中子女相关支出占' }, { text: '43%', emphasis: true }, { text: '。而超六成家庭年收入低于' }, { text: '10万元', emphasis: true }, { text: '——收入与支出之间的缺口，让这些家庭常年走在钢丝上。' }]),
      paragraph([{ text: '87%的照护者为母亲，64%需兼顾其他家人。她们的身体与精神承受着双重压力——75%有抑郁倾向，55%处于亚健康状态。而面对未来，仅11%的家庭制定了长远规划。' }]),
      paragraph([{ text: '这就是志愿者们走进的世界。' }]),
      paragraph([{ text: '全国活跃志愿者年度贡献服务总时长——' }, { text: '41.06亿小时。', emphasis: true }]),
      paragraph([{ text: '平均到每位活跃志愿者，人均' }, { text: '86.52小时/年', emphasis: true }, { text: '。' }]),
    ],
    metrics: [{ value: '5,871元', label: '心智障碍者家庭月均支出5,871元' }, { value: '41.06亿小时', label: '全国活跃志愿者年度贡献服务总时长' }, { value: '86.52小时/年', label: '平均到每位活跃志愿者，人均86.52小时/年' }],
    postscript: {
      lead: [
        paragraph([], chart('志愿者服务时间来源', 'https://dycharts.com/xshow/index.html?id=c_2700ea033515c3a86b03a0f2916eb03e')),
        paragraph([{ text: '这些时间从何而来？从周末、从夜晚、从节假日的休息中挤出来。他们不是闲人——他们是上班族、是学生、是退休老人，用本属于自己的时间，填补了公共服务与家庭需求之间的缝隙。' }]),
      ],
      heading: '结语',
      paragraphs: [
        paragraph([{ text: '他们走进“星星的孩子”的世界，走进那些被日常压得喘不过气的家庭。他们从2.4亿人中走来，带着时间、体力和一份不计回报的心意。' }]),
        paragraph([{ text: '但走出那扇门之后呢？' }]),
        paragraph([{ text: '他们回到自己的生活里——可能是一个同样需要照顾的家庭，可能是一份不敢请假的工位，也可能是一个无人问津的夜晚。' }]),
        paragraph([{ text: '照亮他人的人，也渴望被看见。不是被赞美，是被理解——理解他们的疲惫，理解他们偶尔也想放弃的瞬间，理解他们其实也怕黑。' }]),
        paragraph([{ text: '善意从来不是无限的。它需要被支持，被回应，被接住。' }]),
        paragraph([{ text: '下一次，当你看到那束光，请记得——它也需要有人为它添一点灯油。' }]),
      ],
    },
  },
  {
    id: 'dilemma', part: 3, label: '数据黑板 04', question: '职业倦怠与心理健康', sourceSection: '职业倦怠与心理健康；薪酬困境：情怀无法替代面包；志愿者的真实困境',
    paragraphs: [
      paragraph([{ text: '如果说志愿者和照护者的付出已经令人动容，那么他们面临的困境则令人不安。' }]),
      paragraph([{ text: '2025年1月，《公益人职业倦怠和心理健康调查报告》发布。数据显示：约27%的公益人存在不同程度的职业倦怠；高达63.86%患有程度不同的抑郁；67.33%存在不同程度的焦虑；43.56%对生活不满意。' }], chart('公益人职业倦怠与心理健康', 'https://dycharts.com/xshow/index.html?id=c_cc8728a45d8205657697a74227d39e1b')),
      paragraph([{ text: '照亮他人的人，自己却正在被黑暗吞噬。' }]),
      paragraph([{ text: '《基金会行业薪酬观察报告（2025）》数据显示，2024年基金会专职人员平均年薪为81,452元，中位值为66,000元；助理专员的薪酬中位数为65,208元。' }]),
      paragraph([{ text: '而2025年全国城镇非私营单位就业人员年平均工资为129,441元——公益行业普通从业者的收入，仅为社会平均水平的一半左右。' }, { text: ' 这是一份需要“用爱发电”的职业，但情怀无法替代面包。', emphasis: true }], chart('公益人月收入分布', 'https://dycharts.com/xshow/index.html?id=c_ebe09a73226a8310bdeaadefed961a13')),
      paragraph([{ text: '薪酬缺乏竞争力直接导致了人才流失。资金不稳定、薪资缺乏吸引力，使得新鲜血液难以进入，老员工“用爱发电”能坚持多久？' }]),
      paragraph([{ text: '志愿者的处境更直接：零薪酬，零补贴。服务地与学校或居住地之间的通勤，是最大的体力消耗。这些交通成本从未被计入服务时长，也从未被补偿。' }]),
      paragraph([{ text: '流失触目惊心。全国实名注册志愿者达2.68亿，但活跃志愿者仅7704万人——超过70%的注册者并未真正活跃在一线。而在心智障碍陪护等深度服务领域，同期留存率往往不足两成。时间精力冲突、通勤成本过高，是最主要的退出原因。' }]),
      paragraph([{ text: '对比政府主导的志愿服务项目（如“西部计划”享有每月2000-3300元生活补贴及交通补贴），民间助残志愿者同样付出时间与精力，却没有任何制度性的经济保障。' }]),
    ],
    metrics: [{ value: '63.86%', label: '高达63.86%患有程度不同的抑郁' }, { value: '66,000元', label: '基金会专职人员年薪中位值为66,000元' }, { value: '7704万人', label: '活跃志愿者仅7704万人' }],
  },
  {
    id: 'echo', part: 4, label: '数据黑板 05', question: '制度缺口：政策与现实的距离', sourceSection: '制度缺口：政策与现实的距离；数据揭示的真相是：',
    paragraphs: [
      paragraph([{ text: '2017年《志愿服务条例》明确了志愿者各项法定权利；2024年，中办国办印发《关于健全新时代志愿服务体系的意见》，提出“为志愿者提供物资设备、安全保障及相应保险”。' }]),
      paragraph([{ text: '然而，政策与现实之间落差显著。有地方志愿者平台因保险政策调整，已暂停为志愿者活动期间提供相关保险服务。机构的保障措施——购置场地意外险、外出活动购买单次保险——来自经验教训的积累，而非制度强制。' }]),
      paragraph([{ text: '制度的缺位让机构、志愿者、服务对象都暴露在风险之中。' }]),
      paragraph([{ text: '数据揭示的真相是：' }]),
      paragraph([{ text: '63.86%的公益人正在抑郁中挣扎。6.6万的年薪撑不起一份体面的生活。2.68亿注册志愿者中，活跃的仅有7704万。超过70%的人注册后未曾真正抵达服务一线。' }]),
      paragraph([{ text: '制度为志愿者撑起的伞，漏洞太多。' }]),
      paragraph([{ text: '但数据说不完的是：一个内向的“星伙伴”因为朋友的到来而亮起来的眼神；一个健谈的男孩在朋友圈关心志愿者的情绪，说“一定要开心起来”；一个在地铁上累到睡过站的女孩，结束后说的第一个词是“愉悦”。' }]),
      paragraph([{ text: '他们被爱照亮过，所以选择继续照亮别人。但那些照亮他人的人，谁来照亮他们？' }]),
    ],
    metrics: [{ value: '63.86%', label: '63.86%的公益人正在抑郁中挣扎' }, { value: '6.6万', label: '6.6万的年薪撑不起一份体面的生活' }, { value: '2.68亿', label: '2.68亿注册志愿者中，活跃的仅有7704万' }],
    closing: paragraph([{ text: '接下来，让我们听一听，那些声音。' }]),
  },
]

export const dataBlackboardChartSources = [
  ...new Set(
    [
      ...dataBlackboardScenes.flatMap((scene) =>
        [
          ...scene.paragraphs,
          ...(scene.postscript?.lead ?? []),
          ...(scene.postscript?.paragraphs ?? []),
          ...(scene.closing ? [scene.closing] : []),
        ].flatMap((paragraph) => (paragraph.chart ? [paragraph.chart.src] : [])),
      ),
      volunteerHighFrequencyChart.src,
    ],
  ),
]
