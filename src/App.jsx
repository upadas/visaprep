import { useEffect, useCallback, useState } from 'react'
import { useStore } from './store/useStore'
import { DOCS } from './data/docs'
import { COUNTRIES } from './data/countries'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import ProgressBar from './components/ProgressBar'
import Toast from './components/Toast'
import TweaksPanel from './components/TweaksPanel'
import Wizard from './wizard/Wizard'
import Board from './board/Board'

export default function App() {
  const {
    country, setCountry,
    view, setView,
    current, setCurrent,
    profile, setProfile,
    statuses, setStatus,
    files, setFiles,
    tweaks, setTweak,
    resetProgress,
  } = useStore()

  const c = COUNTRIES[country]
  const done  = DOCS.filter((d) => statuses[d.id] === 'done').length
  const total = DOCS.length

  useEffect(() => {
    document.body.dataset.theme   = tweaks.theme
    document.body.dataset.density = tweaks.density
  }, [tweaks.theme, tweaks.density])

  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'wizard') return
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') setCurrent(Math.min(DOCS.length - 1, current + 1))
      if (e.key === 'ArrowLeft')  setCurrent(Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, current, setCurrent])

  const [toast, setToast] = useState({ msg: '', show: false })
  const flash = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }, [])

  const handleCountry = (val) => { setCountry(val); flash('Switched country') }
  const handleReset   = () => { resetProgress(); flash('Progress reset') }

  return (
    <div className="app">
      <TopBar country={country} onCountry={handleCountry} />

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
              />

              {view === 'wizard'
                ? <Wizard
                    docs={DOCS}
                    statuses={statuses}
                    current={current}
                    setCurrent={setCurrent}
                    setStatus={setStatus}
                    files={files}
                    setFiles={setFiles}
                  />
                : <Board
                    docs={DOCS}
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

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
      <Toast msg={toast.msg} show={toast.show} />
    </div>
  )
}
