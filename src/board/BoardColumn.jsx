import { useDroppable } from '@dnd-kit/core'
import BoardCard from './BoardCard'

const EMPTY = {
  todo:  'All clear!',
  doing: 'Drag a card here when you start working on it.',
  done:  'Nothing here yet.',
}

export default function BoardColumn({ colId, label, docs, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: colId })
  return (
    <div
      ref={setNodeRef}
      className="kan-col"
      style={isOver ? { borderColor: 'var(--brand)' } : undefined}
    >
      <h4>
        <span>{label}</span>
        <span className="num">{docs.length}</span>
      </h4>
      {docs.map((doc, i) => (
        <BoardCard key={doc.id} doc={doc} index={i} onClick={() => onCardClick(doc)} />
      ))}
      {docs.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
          {EMPTY[colId]}
        </div>
      )}
    </div>
  )
}
