import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[hsl(var(--bg))]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-56 min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
