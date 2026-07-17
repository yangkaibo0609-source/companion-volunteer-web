import { useEffect, useRef, useState, type RefObject } from 'react'
import { portraitSource } from '../../data/portraitData'

type VolunteerPortraitSectionProps = {
  sectionRef: RefObject<HTMLElement | null>
}

type BlackboardScene = {
  id: string
  label: string
  question: string
  deck: string
  answer: string[]
  insight?: string
  notes?: Array<{
    value?: string
    label: string
    detail?: string
  }>
  people?: Array<{
    title: string
    body: string
  }>
  timeline?: Array<{
    time: string
    story: string
  }>
  keywords?: string[]
  roles?: string[]
  closing?: string[]
}

const voiceScenes: BlackboardScene[] = [
  {
    id: 'group',
    label: '第一问',
    question: '心智障碍群体是什么？',
    deck: '先看见他们，才能理解陪伴为什么重要。',
    answer: [
      '它不是一个单一标签。',
      '它可能指向智力发育迟缓、孤独症谱系障碍、唐氏综合征，',
      '也指向长期的康复、教育、就业、监护压力。',
    ],
    insight: '一个家庭被困住的，往往不只是诊断本身，还有漫长照护里不断叠加的时间、金钱和情绪成本。',
    notes: [
      { value: '1200万—2000万', label: '心智障碍群体', detail: '文稿整理的群体规模估计' },
      { value: '1300万—1400万', label: '孤独症谱系障碍人群', detail: '对应康复、教育与长期支持需求' },
      { value: '5871元/月', label: '心智障碍者家庭月均支出', detail: '子女相关支出约占 43%' },
      { value: '87%', label: '主要照护者为母亲', detail: '照护压力长期落在家庭内部' },
    ],
  },
  {
    id: 'volunteer',
    label: '第二问',
    question: '谁在走近他们？',
    deck: '志愿者不是单一的“好人”形象，而是一组具体的人。',
    answer: ['志愿者不是单一的面孔。', '他们从不同生活里走来，又在同一个现场相遇。'],
    insight: '注册系统里的年轻人、女性、学生，与现场里更成熟、更稳定的活跃志愿者，一起构成了助残服务的真实底盘。',
    notes: [
      { value: '2.4亿', label: '实名注册志愿者', detail: '志愿服务网络的总体规模' },
      { value: '3744.3万', label: '助残志愿者', detail: '从庞大网络走向残障群体与家庭' },
      { value: '65.79%', label: '女性志愿者', detail: '注册画像中女性占比较高' },
      { value: '61.46%', label: '学生群体', detail: '年龄集中在 15—22 岁' },
      { value: '43.1岁', label: '活跃志愿者平均年龄', detail: '现场稳定陪伴者更成熟' },
      { value: '81%', label: '已婚群体', detail: '许多人也承担家庭责任' },
    ],
    people: [
      { title: '学生志愿者', body: '从周末、夜晚、假期里挤出时间。' },
      { title: '长期陪伴者', body: '不是每一次陪伴都会被记录。' },
      { title: '活跃志愿者', body: '他们也有自己的家庭、工作和压力。' },
    ],
  },
  {
    id: 'time',
    label: '第三问',
    question: '陪伴只是在场吗？',
    deck: '服务时长之外，还有抵达现场之前和离开之后。',
    answer: ['他们不是闲人。', '他们只是把自己的休息时间，挪给了另一个家庭。'],
    insight: '文稿里的志愿者反复提到：真正被消耗的，不只有活动里的几个小时，还有通勤、等待、返程和活动结束后的情绪劳动。',
    notes: [
      { value: '41.06亿小时', label: '年度服务总时长', detail: '全国活跃志愿者贡献的服务时间' },
      { value: '86.52小时/年', label: '平均到每位活跃志愿者', detail: '被拆成一次次周末与夜晚' },
      { value: '约1.5小时', label: '典型单程通勤', detail: '高校志愿者常提到的路程成本' },
    ],
    timeline: [
      { time: '周末', story: '把原本属于自己的休息日留给活动现场。' },
      { time: '夜晚', story: '服务结束后，很多情绪才慢慢回到自己身上。' },
      { time: '地铁上', story: '从学校过去要一个半小时地铁。' },
      { time: '活动后', story: '回去路上常常累到睡过站。' },
      { time: '回学校的路上', story: '有时候陪伴三个小时，回家一句话都不想说。' },
    ],
  },
  {
    id: 'tired',
    label: '第四问',
    question: '为什么照亮他人的人，也会疲惫？',
    deck: '善意会发光，但善意本身也会被消耗。',
    answer: ['不是每一个愿意照亮别人的人，', '都能一直留在现场。'],
    insight: '文稿把困境写得更具体：职业倦怠、长距离通勤、志愿者留存不足、风险保障缺口和机构资金压力彼此缠绕。',
    notes: [
      { value: '63.86%', label: '受访公益人存在不同程度抑郁', detail: '来自公益人职业倦怠与心理健康调查' },
      { value: '不足两成', label: '长期留存困难', detail: '体验一次后离开的志愿者并不少见' },
      { value: '1—2人', label: '同期加入后可能留下的人', detail: '访谈中提到的长期坚持困境' },
    ],
    keywords: ['通勤太远', '服务太累', '学业压力', '长期留存困难', '机构支持有限', '制度保障不足'],
  },
  {
    id: 'support',
    label: '最后一问',
    question: '谁来照亮他们？',
    deck: '答案不是把他们塑造成英雄，而是让支持系统真正托住他们。',
    answer: ['善意从来不是无限的。', '它需要被支持，被回应，被接住。'],
    insight: '当家庭、学校、机构、社区、政策和普通公众一起出现，志愿者才不必独自承担所有光亮。',
    roles: ['家庭', '学校', '机构', '社区', '政策', '普通公众'],
    closing: ['每一个照亮他人的人，', '也值得被世界温柔照亮。'],
  },
]

function useScrollRelease() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-voice-release]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const release = (item: Element) => item.classList.add('is-visible')
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(release)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          release(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -14% 0px', threshold: 0.18 },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return rootRef
}

function HangingBlackboard({
  scene,
  open,
  onToggle,
}: {
  scene: BlackboardScene
  open: boolean
  onToggle: () => void
}) {
  return (
    <button className={`hanging-blackboard${open ? ' is-open' : ''}`} type="button" onClick={onToggle}>
      <span className="hanging-blackboard__ropes" aria-hidden="true" />
      <span className="hanging-blackboard__surface">
        <span className="hanging-blackboard__label">{scene.label}</span>
        <strong>{scene.question}</strong>
        <span className="hanging-blackboard__deck">{scene.deck}</span>
        <span className="hanging-blackboard__hint">{open ? '答案已经写在黑板上' : '轻点黑板，听见答案'}</span>
        <span className="hanging-blackboard__tray" aria-hidden="true" />
      </span>
    </button>
  )
}

function ChalkReveal({ lines, open }: { lines: string[]; open: boolean }) {
  return (
    <div className={`chalk-reveal${open ? ' is-open' : ''}`}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

function SceneArtifacts({ scene, open }: { scene: BlackboardScene; open: boolean }) {
  return (
    <>
      {scene.insight && <p className={`voice-insight${open ? ' is-open' : ''}`}>{scene.insight}</p>}

      {scene.notes && (
        <div className={`voice-note-grid${open ? ' is-open' : ''}`}>
          {scene.notes.map((note) => (
            <article key={`${note.value ?? ''}${note.label}`}>
              {note.value && <strong>{note.value}</strong>}
              <span>{note.label}</span>
              {note.detail && <small>{note.detail}</small>}
            </article>
          ))}
        </div>
      )}

      {scene.people && (
        <div className={`voice-people-notes${open ? ' is-open' : ''}`}>
          {scene.people.map((person) => (
            <article key={person.title}>
              <strong>{person.title}</strong>
              <p>{person.body}</p>
            </article>
          ))}
        </div>
      )}

      {scene.timeline && (
        <div className={`voice-time-track${open ? ' is-open' : ''}`}>
          {scene.timeline.map((item) => (
            <button key={item.time} type="button">
              <span>{item.time}</span>
              <small>{item.story}</small>
            </button>
          ))}
        </div>
      )}

      {scene.keywords && (
        <div className={`voice-chalk-words${open ? ' is-open' : ''}`}>
          {scene.keywords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
      )}

      {scene.roles && (
        <div className={`voice-support-system${open ? ' is-open' : ''}`}>
          {scene.roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      )}
    </>
  )
}

function VoiceStoryScene({ scene }: { scene: BlackboardScene }) {
  const [open, setOpen] = useState(false)

  return (
    <section className={`voice-story-scene voice-story-scene--${scene.id}`} data-voice-release>
      <div className="voice-story-scene__board">
        <HangingBlackboard scene={scene} open={open} onToggle={() => setOpen((value) => !value)} />
      </div>

      <div className="voice-story-scene__answer">
        <ChalkReveal lines={scene.answer} open={open} />
        <SceneArtifacts scene={scene} open={open} />
        {scene.closing && (
          <div className={`voice-closing-note${open ? ' is-open' : ''}`}>
            <p>每一个<span>照亮</span>他人的人，</p>
            <p>也值得被世界温柔<span>照亮</span>。</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function VolunteerPortraitSection({ sectionRef }: VolunteerPortraitSectionProps) {
  const releaseRootRef = useScrollRelease()

  const setSectionRefs = (node: HTMLElement | null) => {
    releaseRootRef.current = node
    ;(sectionRef as { current: HTMLElement | null }).current = node
  }

  return (
    <section ref={setSectionRefs} className="volunteer-portrait voice-story-section" aria-label="听见他们的声音">
      <div className="voice-story-opening" data-voice-release>
        <p className="summary-kicker">听见他们的声音</p>
        <h2>把问题写在黑板上</h2>
        <p>
          这一段不是空泛地赞美志愿者，而是把文稿中的数据、访谈和困境拆成五个问题。轻点黑板，答案才会慢慢显影。
        </p>
      </div>

      {voiceScenes.map((scene) => (
        <VoiceStoryScene key={scene.id} scene={scene} />
      ))}

      <p className="voice-story-source">{portraitSource}</p>
    </section>
  )
}
