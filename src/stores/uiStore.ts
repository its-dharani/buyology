import { create } from 'zustand'
import type { UIStore } from '../types/stores'

const useUIStore = create<UIStore>((set) => ({
  activeView: 'search',
  setView: (view) => set({ activeView: view }),
}))

export default useUIStore
