import { useState } from 'react'

export default function DropZone({ fileTypes, onUpload }) {
  const [over, setOver] = useState(false)
  return (
    <div
      className={'drop' + (over ? ' over' : '')}
      onClick={onUpload}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onUpload() }}
    >
      <div className="icon">↑</div>
      <h4>Drop your file here, or click to browse</h4>
      <p>{fileTypes} · max 10 MB · stays on your device</p>
      <button className="btn" onClick={(e) => { e.stopPropagation(); onUpload() }}>Choose file</button>
    </div>
  )
}
