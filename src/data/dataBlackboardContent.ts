export type BlackboardMetric = {
  value: string
  label: string
}

export type BlackboardChart = {
  title: string
  src: string
}

export type DataBlackboardScene = {
  id: string
  part: number
  label: string
  question: string
  sourceSection: string
  chalkLines: string[]
  metrics: BlackboardMetric[]
  timeline?: string[]
  closing?: string
  charts?: BlackboardChart[]
}

export const dataBlackboardScenes: DataBlackboardScene[] = [
  {
    id: 'group',
    part: 1,
    label: '数据黑板 01',
    question: '心智障碍群体是什么？',
    sourceSection: '心智障碍者：一个庞大却沉默的群体',
    chalkLines: [
      '心智障碍涵盖智力发育迟缓、孤独症谱系障碍、唐氏综合征等多种类型。',
      '这意味着，每70个中国人里，就有1个是心智障碍者。',
      '他们大多数无民事行为能力或限制民事行为能力，在康复、教育、就业、未来安置与监护等各个环节，都面临巨大挑战。',
    ],
    metrics: [
      { value: '1200万—2000万人', label: '我国心智障碍群体约有' },
      { value: '每70个中国人里，就有1个', label: '是心智障碍者' },
      { value: '1300万—1400万人', label: '我国孤独症谱系障碍人群已达' },
      { value: '300万—500万人', label: '0至14岁的孤独症儿童约有' },
    ],
    charts: [
      { title: '展开康复服务数据图表', src: 'https://dycharts.com/xshow/index.html?id=c_d8e2c0c4c7dd61fa4c6508534d05e4a3' },
    ],
  },
  {
    id: 'volunteers',
    part: 1,
    label: '数据黑板 02',
    question: '谁在走近他们？',
    sourceSection: '志愿者：照亮他人的人',
    chalkLines: [
      '截至目前，我国实名注册志愿者总数已达2.4亿人，志愿队伍135万个，志愿服务项目1332万个。',
      '其中，助残志愿者有3744.3万人，助残社会组织有2997个。',
      '他们的服务范围包括康复、就业帮助、教育辅导、托养照料、心理辅导、文体活动等多个领域。',
      '那么，这些“照亮他人的人”，是什么样的人？',
    ],
    metrics: [
      { value: '2.4亿人', label: '实名注册志愿者总数' },
      { value: '135万个', label: '志愿队伍' },
      { value: '1332万个', label: '志愿服务项目' },
      { value: '3744.3万人', label: '助残志愿者' },
      { value: '2997个', label: '助残社会组织' },
    ],
    charts: [
      { title: '展开志愿服务规模图表', src: 'https://dycharts.com/xshow/index.html?id=c_2a3665964da43a6469214253e8055246' },
      { title: '展开注册与活跃志愿者图表', src: 'https://dycharts.com/xshow/index.html?id=c_ff52fe485a326c7c2bc78a1120e7ad26' },
    ],
  },
  {
    id: 'time',
    part: 2,
    label: '数据黑板 03',
    question: '陪伴只是在场吗？',
    sourceSection: '他们付出了什么？',
    chalkLines: [
      '心智障碍者家庭月均支出5,871元，其中子女相关支出占43%。',
      '而超六成家庭年收入低于10万元——收入与支出之间的缺口，让这些家庭常年走在钢丝上。',
      '87%的照护者为母亲，64%需兼顾其他家人。',
      '全国活跃志愿者年度贡献服务总时长——41.06亿小时。',
      '平均到每位活跃志愿者，人均86.52小时/年。',
      '这些时间从何而来？从周末、从夜晚、从节假日的休息中挤出来。',
      '他们不是闲人——他们是上班族、是学生、是退休老人，用本属于自己的时间，填补了公共服务与家庭需求之间的缝隙。',
    ],
    timeline: ['周末', '夜晚', '节假日的休息中'],
    metrics: [
      { value: '5,871元/月', label: '心智障碍者家庭月均支出' },
      { value: '43%', label: '子女相关支出占' },
      { value: '87%', label: '照护者为母亲' },
      { value: '64%', label: '需兼顾其他家人' },
      { value: '41.06亿小时', label: '全国活跃志愿者年度贡献服务总时长' },
      { value: '86.52小时/年', label: '平均到每位活跃志愿者' },
    ],
  },
  {
    id: 'dilemma',
    part: 3,
    label: '数据黑板 04',
    question: '为什么照亮他人的人，也会疲惫？',
    sourceSection: '职业倦怠与心理健康；薪酬困境；志愿者的真实困境；机构在支撑，但自身也在挣扎',
    chalkLines: [
      '公益机构普遍的难处——薪资不高、工作压力大，长期下来就容易滋生各类心理问题。',
      '高校志愿者的处境更为特殊。他们没有薪酬，甚至没有补贴。',
      '从学校过去要一个半小时地铁，每次活动结束回去路上经常睡过头、坐过站。',
      '离开的首要原因是学业压力大、通勤太远、服务太疲惫——而这些恰恰是高校志愿者群体无法回避的结构性困境。',
      '经常出现机构需要人手的时候志愿者没时间，志愿者有空的时候机构常规服务又很少。',
    ],
    metrics: [
      { value: '约27%', label: '的公益人存在不同程度的职业倦怠' },
      { value: '63.86%', label: '的公益人患有程度不同的抑郁' },
      { value: '67.33%', label: '的受访者存在不同程度的焦虑' },
      { value: '43.56%', label: '的公益人对生活不满意' },
    ],
    charts: [
      { title: '展开公益人心理健康图表', src: 'https://dycharts.com/xshow/index.html?id=c_cc8728a45d8205657697a74227d39e1b' },
      { title: '展开公益行业薪酬图表', src: 'https://dycharts.com/xshow/index.html?id=c_2700ea033515c3a86b03a0f2916eb03e' },
      { title: '展开行业收入对照图表', src: 'https://dycharts.com/xshow/index.html?id=c_ebe09a73226a8310bdeaadefed961a13' },
    ],
  },
  {
    id: 'echo',
    part: 4,
    label: '数据黑板 05',
    question: '然后呢？',
    sourceSection: '制度为志愿者撑起的伞，漏洞太多；数据结语',
    chalkLines: [
      '政策要求与现实执行之间存在着显著落差。',
      '但在实际落地中，保险购买、专业培训等保障措施依然参差不齐。',
      '志愿者保障如同“空中楼阁”，缺乏坚实的制度支撑。',
      '责任边界在哪里？没有人能说清。',
      '制度的缺位让机构、志愿者、服务对象都暴露在风险之中。',
      '制度为志愿者撑起的伞，漏洞太多。',
      '但数据说不完的是：一个内向的“星伙伴”因为高个子朋友的到来而亮起来的眼神；一个健谈的男孩在朋友圈里关心志愿者的情绪，说“一定要开心起来”；一个在地铁上累到睡过站的女孩，结束后说的第一个词是“愉悦”。',
    ],
    metrics: [
      { value: '63.86%', label: '的公益人正在抑郁中挣扎' },
      { value: '6.6万', label: '的年薪撑不起一份体面的生活' },
      { value: '2.68亿', label: '注册志愿者中，活跃的仅有7704万' },
      { value: '不足两成', label: '志愿者同期留存率' },
    ],
    closing: '他们被爱照亮过，所以选择继续照亮别人。但那些照亮他人的人，谁来照亮他们？接下来，让我们听一听，那些声音。',
  },
]
