import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DashboardPage from "@/pages/dashboard";

export default function App() {
  return (
    <Suspense>
      <div className="App">
        <DashboardPage />
      </div>
    </Suspense>
  );
}
