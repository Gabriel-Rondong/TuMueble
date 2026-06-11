import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout({ tipo, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-tm-dark">
      <Sidebar tipo={tipo} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}
