import { useState } from 'react'
import { volunteerMessages } from '../../data/investigationData'

function preview(answer: string) {
  return answer.length > 46 ? `${answer.slice(0, 46)}……` : answer
}

export function VolunteerMessageWall() {
  const [expandedId, setExpandedId] = useState('')

  return (
    <section className="volunteer-message-wall" aria-labelledby="volunteer-message-title">
      <header className="investigation-heading">
        <p className="summary-kicker">八位受访者留言</p>
        <h2 id="volunteer-message-title">在过去志愿服务中，您有过“真不想去了”或“想请假”的念头吗？</h2>
        <p>点击留言，读完他们没有说出口的迟疑。</p>
      </header>

      <div className="volunteer-message-list">
        {volunteerMessages.map((message, index) => {
          const expanded = expandedId === message.id
          return (
            <article className={expanded ? 'volunteer-message is-expanded' : 'volunteer-message'} key={message.id}>
              <img alt="" src={message.avatar} />
              <button
                aria-expanded={expanded}
                onClick={() => setExpandedId((current) => current === message.id ? '' : message.id)}
                type="button"
              >
                <span>{message.identity}</span>
                <p>{expanded ? message.answer : preview(message.answer)}</p>
                <small>{expanded ? '收起留言' : '展开全文'}</small>
              </button>
              <span className="volunteer-message__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
