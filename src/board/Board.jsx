import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import BoardColumn from './BoardColumn'

const COLS = [
  { id: 'todo',  label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done',  label: 'Done' },
]

export default function Board({ docs, statuses, setStatus, setCurrent, setView }) {
  const sensors = useSensors(useSensor(PointerSensor))

  const docsForCol = (colId) =>
    docs.filter((d) => {
      const s = statuses[d.id] || 'todo'
      if (colId === 'todo') return s === 'todo' || s === 'skipped'
      return s === colId
    })

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setStatus(active.id, over.id)
    }
  }

  const onCardClick = (doc) => {
    const i = docs.findIndex((d) => d.id === doc.id)
    setCurrent(i)
    setView('wizard')
  }

  return (
    <section className="kanban fade">
      <div className="kan-head">
        <h3>Application board</h3>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Drag cards between columns. Click any card to open it.
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="kan-cols">
          {COLS.map((col) => (
            <BoardColumn
              key={col.id}
              colId={col.id}
              label={col.label}
              docs={docsForCol(col.id)}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </DndContext>
    </section>
  )
}
