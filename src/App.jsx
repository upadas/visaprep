import { useEffect, useCallback, useState } from 'react'
import { useStore } from './store/useStore'
import { getDocsForCountry } from './data/docsForCountry'
import { COUNTRIES } from './data/countries'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import ProgressBar from './components/ProgressBar'
import Toast from './components/Toast'
import Wizard from './wizard/Wizard'
import Board from './board/Board'
import SaveModal, { decodeState } from './components/SaveModal'
import ConfirmDialog from './components/ConfirmDialog'
import { clearBlobs } from './lib/fileStorage'
import GuidesPage from './pages/GuidesPage'
import DocumentsPage from './pages/DocumentsPage'
import HelpPage from './pages/HelpPage'

export default function App() {
  const {
    country, setCountry,
    view, setView,
    current, setCurrent,
    page, setPage,
    profile, setProfile,
    statuses, setStatus,
    files, setFiles,
    tweaks, setTweak,
    resetProgress,
  } = useStore()

  const c = COUNTRIES[country] ?? COUNTRIES.canada
  const docs         = getDocsForCountry(country)
  const requiredDocs = docs.filter((d) => d.required)
  const done         = docs.filter((d) => statuses[d.id] === 'done').length
  const total        = docs.length
  const allRequiredDone = requiredDocs.length > 0 && requiredDocs.every((d) => statuses[d.id] === 'done')

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#s=')) return
    const encoded = hash.slice(3)
    const restored = decodeState(encoded)
    if (!restored) return
    if (restored.country)  setCountry(restored.country)
    if (restored.current !== undefined) setCurrent(restored.current)
    if (restored.profile)  setProfile(restored.profile)
    if (restored.statuses) {
      Object.entries(restored.statuses).forEach(([id, status]) => setStatus(id, status))
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { theme } = tweaks
    if (theme === 'dark') {
      document.body.dataset.theme = 'dark'
    } else if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      document.body.dataset.theme = mq.matches ? 'dark' : ''
      const handler = (e) => { document.body.dataset.theme = e.matches ? 'dark' : '' }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      document.body.dataset.theme = ''
    }
  }, [tweaks.theme])

  useEffect(() => {
    const onKey = (e) => {
      if (page !== 'app') return
      if (view !== 'wizard') return
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') setCurrent(Math.min(docs.length - 1, current + 1))
      if (e.key === 'ArrowLeft')  setCurrent(Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, view, current, setCurrent])

  const [toast, setToast] = useState({ msg: '', show: false })
  const flash = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }, [])

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleCountry = (val) => { setCountry(val); flash('Switched country') }
  const handleReset   = () => setConfirmReset(true)

  const doReset = async () => {
    await clearBlobs()
    resetProgress()
    setConfirmReset(false)
    flash('Progress reset')
  }

  return (
    <div className="app">
      <TopBar
        country={country}
        onCountry={handleCountry}
        onSaveModal={() => setSaveModalOpen(true)}
        page={page}
        onPage={setPage}
        theme={tweaks.theme}
        onTheme={(t) => setTweak('theme', t)}
      />

      {page === 'guides'    && <GuidesPage />}
      {page === 'documents' && <DocumentsPage />}
      {page === 'help'      && <HelpPage />}

      {page === 'app' && (

      <div>
        <div className="page-head">
          <div className="crumbs">
            <a href="#">Home</a><span>›</span>
            <a href="#">Visas</a><span>›</span>
            <a href="#">{c.name}</a><span>›</span>
            <span style={{ color: 'var(--ink)' }}>Tourist visa application</span>
          </div>
          <div className="page-title">
            <h1>{c.flag} <em>{c.name}</em> tourist visa<br />
              <span style={{ color: 'var(--muted)' }}>document checklist</span>
            </h1>
            <div className="meta">
              <span>Fee · <b>{c.fee}</b></span>
              <span>Processing · <b>{c.proc}</b></span>
              <span>Updated · <b>May 2026</b></span>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="layout">
            <Rail profile={profile} setProfile={setProfile} />

            <div className="main">
              <ProgressBar
                done={done}
                total={total}
                view={view}
                setView={setView}
                onPdf={() => flash('PDF generated')}
                onSave={() => flash('Saved & emailed')}
                complete={allRequiredDone}
              />

              {view === 'wizard'
                ? <Wizard
                    docs={docs}
                    statuses={statuses}
                    current={current}
                    setCurrent={setCurrent}
                    setStatus={setStatus}
                    files={files}
                    setFiles={setFiles}
                  />
                : <Board
                    docs={docs}
                    statuses={statuses}
                    setStatus={setStatus}
                    setCurrent={setCurrent}
                    setView={setView}
                  />
              }

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
                <span>Auto-saved locally · sync across devices by saving with email.</span>
                <button className="btn ghost sm" onClick={handleReset}>Reset progress</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      <Toast msg={toast.msg} show={toast.show} />

      {confirmReset && (
        <ConfirmDialog
          title="Reset all progress?"
          message="This will erase all document statuses and uploaded files. This cannot be undone."
          confirmLabel="Yes, reset everything"
          onConfirm={doReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}

      {saveModalOpen && (
        <SaveModal
          statuses={statuses}
          current={current}
          profile={profile}
          country={country}
          onClose={() => setSaveModalOpen(false)}
        />
      )}
    </div>
  )
}
