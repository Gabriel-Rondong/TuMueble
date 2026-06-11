import AppRouter from "./routes"
import { ToastProvider } from "./components/ui/Toast"

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}