import watercolorBg from '../assets/story/watercolor-bg.png'
import storyCarry from '../assets/story/story-carry.png'
import storyHug from '../assets/story/story-hug.png'
import storyQuiet from '../assets/story/story-quiet.png'
import storyStadium from '../assets/story/story-stadium.png'
import storyVoice from '../assets/story/story-voice.png'
import storyWalk from '../assets/story/story-walk.png'

export type StoryDeckSlide = {
  id: string
  eyebrow: string
  title: string[]
  body: string[]
  image: string
  imageAlt: string
  imageNote?: string
  backText?: string
  tags?: string[]
  dataNotes?: Array<{
    label: string
    value?: string
  }>
  secondaryImage?: {
    src: string
    alt: string
    note?: string
    backText?: string
  }
  tone: 'cover' | 'identity' | 'data' | 'cost' | 'dilemma' | 'voice'
}

export const storyDeckAssets = {
  watercolorBg,
}

export const volunteerStoryDeck: StoryDeckSlide[] = [
  {
    id: 'cover',
    eyebrow: '第二板块',
    title: ['照亮他人的人，', '谁来照亮他们？'],
    body: ['不是每一次陪伴都会被记录，', '但每一次靠近，都曾托住一个家庭。'],
    image: storyHug,
    imageAlt: '志愿者拥抱孩子的插画化画面',
    imageNote: 'A quiet opening',
    backText: '问题从这里开始：那些靠近现场的人，也需要被看见。',
    tone: 'cover',
  },
  {
    id: 'who',
    eyebrow: '问题 01',
    title: ['他们是谁？'],
    body: ['他们，是“星星的孩子”。', '他们身后，是千万个日复一日、无处言说的家庭。'],
    image: storyQuiet,
    imageAlt: '志愿者与孩子安静牵手的插画化画面',
    imageNote: 'Not a distant number',
    backText: '心智障碍不只是一个医学名词，也意味着长期康复、教育、监护和家庭照护。',
    tags: ['心智障碍群体', '孤独症儿童', '康复、教育、监护', '家庭照护'],
    tone: 'identity',
  },
  {
    id: 'volunteers',
    eyebrow: '问题 02',
    title: ['那些走近他们的人'],
    body: ['年轻的、中年的，注册的、活跃的，', '都在不同的生活里，走向同一个现场。'],
    image: storyStadium,
    imageAlt: '户外志愿活动合照的插画化画面',
    imageNote: 'The people who come closer',
    backText: '志愿者的面孔从来不是单一的。',
    dataNotes: [
      { label: '实名注册志愿者', value: '2.4 亿' },
      { label: '助残志愿者', value: '3744.3 万' },
      { label: '志愿者的面孔', value: '从来不是单一的' },
    ],
    tone: 'data',
  },
  {
    id: 'cost',
    eyebrow: '问题 03',
    title: ['陪伴，从来不只是“有空”。'],
    body: ['他们不是闲人。', '他们只是把自己的休息时间，挪给了另一个家庭。'],
    image: storyWalk,
    imageAlt: '志愿者陪孩子在校园散步的插画化画面',
    imageNote: 'Borrowed time',
    backText: '服务时长之外，还有通勤、等待、情绪劳动和返程后的疲惫。',
    secondaryImage: {
      src: storyCarry,
      alt: '走廊中背起孩子的插画化画面',
      note: 'A smaller weight',
      backText: '陪伴有时很轻，只是等一等；有时又很重，要把难处接住一会儿。',
    },
    tags: ['周末', '夜晚', '地铁上', '活动后', '回学校的路上'],
    tone: 'cost',
  },
  {
    id: 'dilemma',
    eyebrow: '问题 04',
    title: ['但陪伴也会疲惫。'],
    body: ['不是每一个愿意照亮别人的人，', '都能一直留在现场。'],
    image: storyCarry,
    imageAlt: '志愿者在走廊陪伴孩子的插画化画面',
    imageNote: 'When care becomes heavy',
    backText: '离开的，常常是曾经真实走近过现场的人。',
    tags: ['通勤太远', '服务太累', '学业压力', '长期留存困难', '机构支持有限', '制度保障不足'],
    tone: 'dilemma',
  },
  {
    id: 'voice',
    eyebrow: '然后呢？',
    title: ['然后呢？', '让他们被听见。'],
    body: ['善意从来不是无限的。', '它需要被支持，被回应，被接住。'],
    image: storyVoice,
    imageAlt: '舞台上唱歌的插画化画面',
    imageNote: 'Listen',
    backText: '接下来，让我们听一听，那些声音。',
    tone: 'voice',
  },
]
