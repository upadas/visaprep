import { create } from 'zustand'

const LS_STATUS = 'vp-status'
const LS_FILES  = 'vp-files'
const LS_TWEAKS = 'vp-tweaks'

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const INITIAL = {
  country: 'canada',
  view: 'wizard',
  current: 0,
  profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
  statuses: {},
  files: {},
  tweaks: { theme: 'blue', density: 'default' },
}

export const useStore = create((set, get) => ({
  ...INITIAL,
  statuses: load(LS_STATUS, {}),
  files:    load(LS_FILES,  {}),
  tweaks:   load(LS_TWEAKS, INITIAL.tweaks),

  setCountry: (country) => set({ country }),
  setView:    (view)    => set({ view }),
  setCurrent: (current) => set({ current }),

  setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

  setStatus: (id, status) => set((s) => {
    const statuses = { ...s.statuses, [id]: status }
    save(LS_STATUS, statuses)
    return { statuses }
  }),

  setFiles: (files) => set(() => {
    save(LS_FILES, files)
    return { files }
  }),

  setTweak: (key, value) => set((s) => {
    const tweaks = { ...s.tweaks, [key]: value }
    save(LS_TWEAKS, tweaks)
    try { document.body.dataset[key] = value } catch {}
    return { tweaks }
  }),

  resetProgress: () => set(() => {
    try { localStorage.removeItem(LS_STATUS); localStorage.removeItem(LS_FILES) } catch {}
    return { statuses: {}, files: {}, current: 0 }
  }),
}))

useStore.getInitialState = () => ({ ...INITIAL, statuses: {}, files: {}, tweaks: { ...INITIAL.tweaks } })
