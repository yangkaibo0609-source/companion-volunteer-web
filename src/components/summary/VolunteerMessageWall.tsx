import { volunteerMessages } from '../../data/investigationData'

export function VolunteerMessageWall() {
  return (
    <section className="volunteer-message-wall" aria-labelledby="volunteer-message-title">
      <header className="investigation-heading">
        <p className="summary-kicker">八位受访者留言</p>
        <h2 id="volunteer-message-title">在过去志愿服务中，您有过“真不想去了”或“想请假”的念头吗？</h2>
      </header>

      <div className="volunteer-message-list">
        {volunteerMessages.map((message, index) => (
          <article className="volunteer-message" key={message.id}>
            <img alt="" src={message.avatar} />
            <div className="volunteer-message__bubble">
              <span>{message.identity}</span>
              <p>{message.answer}</p>
            </div>
            <span className="volunteer-message__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
