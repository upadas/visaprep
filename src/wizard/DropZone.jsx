import { useRef, useState } from 'react'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatSize(bytes) {
  if (bytes < 1024)        return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function DropZone({ fileTypes, onUpload }) {
  const inputRef  = useRef(null)
  const [over,    setOver]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const ACCEPT = fileTypes.includes('PDF') && fileTypes.includes('JPG')
    ? '.pdf,.jpg,.jpeg,.png'
    : fileTypes.includes('PDF')
      ? '.pdf'
      : '.jpg,.jpeg,.png'

  async function handleFile(file) {
    setError(null)
    if (!file) return

    // Type check
    const ext = file.name.split('.').pop().toLowerCase()
    const allowed = ACCEPT.split(',').map(e => e.replace('.',''))
    if (!allowed.includes(ext)) {
      setError(`Invalid file type. Accepted: ${fileTypes}`)
      return
    }

    // Size check
    if (file.size > MAX_BYTES) {
      setError(`File too large (${formatSize(file.size)}). Max 10 MB.`)
      return
    }

    setLoading(true)
    try {
      const dataURL = await readAsDataURL(file)
      onUpload({
        name:      file.name,
        sizeBytes: file.size,
        type:      file.type,
        dataURL,
        at:        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } catch {
      setError('Could not read file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onInputChange = (e) => {
    handleFile(e.target.files[0])
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      className={'drop' + (over ? ' over' : '')}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={onInputChange}
        aria-label="Upload document"
      />
      <div className="icon">{loading ? '⏳' : '↑'}</div>
      <h4>{loading ? 'Reading file…' : 'Drop your file here, or click to browse'}</h4>
      <p>{fileTypes} · max 10 MB · stays on your device</p>
      <button
        className="btn"
        disabled={loading}
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
      >
        {loading ? 'Reading…' : 'Choose file'}
      </button>
      {error && (
        <p style={{ color: 'var(--err)', fontSize: 13, marginTop: 8 }}>{error}</p>
      )}
    </div>
  )
}
