import { useDraggable } from '@dnd-kit/core'

export default function BoardCard({ doc, index, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: doc.id })
  const style = {
    ...(transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {}),
    opacity: isDragging ? 0.5 : 1,
  }

  // Handle click separately to ensure it fires even with dnd-kit listeners
  const handlePointerDown = (e) => {
    if (listeners.onPointerDown) {
      listeners.onPointerDown(e)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kan-card"
      onPointerDown={handlePointerDown}
      {...attributes}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <div className="t">{doc.title}</div>
      <div className="m">{doc.summary}</div>
      <div className="footer">
        <span className={'dot ' + (doc.required ? 'req' : 'rec')} />
        <span>{doc.required ? 'Required' : 'Recommended'}</span>
        <span style={{ marginLeft: 'auto' }}>{doc.fileTypes.split(' · ')[0]}</span>
      </div>
    </div>
  )
}
