import { Suspense } from "react"
import DashboardPage from "./pages/dashboard"
import "./languages"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

export default function App() {
  return (
    <Suspense>
      <div className="App">
        <DashboardPage />
      </div>
    </Suspense>
  )
}
