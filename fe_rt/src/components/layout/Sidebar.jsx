import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Home, Wallet, Settings, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'General',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { to: '/warga', icon: Users, label: 'Warga' },
      { to: '/rumah', icon: Home, label: 'Rumah & Penghuni' },
      { to: '/keuangan', icon: Wallet, label: 'Keuangan' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] z-40 select-none">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[hsl(var(--border))]">
        <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
          <Home className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[hsl(var(--text-primary))] truncate leading-tight">RT Management</p>
          <p className="text-[10px] text-[hsl(var(--text-muted))] truncate">Admin Dashboard</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors duration-100',
                      isActive
                        ? 'bg-[hsl(var(--sidebar-item-active-bg))] text-[hsl(var(--sidebar-item-active-text))]'
                        : 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(0_0%_96%)] hover:text-[hsl(var(--text-primary))]'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[hsl(var(--text-primary))]' : 'text-[hsl(var(--text-muted))]')} />
                      <span className="flex-1 truncate">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer user */}
      <div className="px-2 py-3 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[hsl(0_0%_96%)] cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-full bg-[hsl(var(--accent))] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-[hsl(var(--text-primary))] truncate">Admin RT</p>
            <p className="text-[10px] text-[hsl(var(--text-muted))] truncate">admin@rt.local</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-[hsl(var(--text-muted))] shrink-0" />
        </div>
      </div>
    </aside>
  )
}
