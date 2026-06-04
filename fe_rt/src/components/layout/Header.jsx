import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'

const pageTitles = {
  '/':          'Dashboard',
  '/warga':     'Data Warga',
  '/rumah':     'Rumah & Penghuni',
  '/keuangan':  'Keuangan',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'RT Management'

  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[hsl(var(--border))] bg-white sticky top-0 z-30">
      <h2 className="text-[15px] font-semibold text-[hsl(var(--text-primary))]">{title}</h2>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[hsl(var(--text-muted))] hidden md:block">{today}</span>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[hsl(var(--border))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(0_0%_96%)] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black" />
        </button>
      </div>
    </header>
  )
}
