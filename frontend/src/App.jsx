import { BrowserRouter, Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import FindJobs from "./pages/FindJobs"
import Jobdetails from "./pages/Jobdetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import WorkerDashboard from "./pages/WorkerDashboard"
import MyApplications from "./pages/MyApplications"
import EmployerDashboard from "./pages/EmployerDashboard"
import PostJob from "./pages/PostJob"
import MyJobs from "./pages/MyJobs"
import Applicants from "./pages/Applicants"
import Footer from "./components/Footer"


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/find-jobs" element={<FindJobs />} />

        <Route path="/job/:id" element={<Jobdetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/worker-dashboard"
          element={<WorkerDashboard />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />

        <Route
          path="/employer-dashboard"
          element={<EmployerDashboard />}
        />

        <Route
          path="/post-job"
          element={<PostJob />}
        />

        <Route path="/my-jobs" element={<MyJobs />} />

        <Route
          path="/applicants/:jobId"
          element={<Applicants />}
        />

      </Routes>

       <Footer />

    </BrowserRouter>
  )
}

export default App