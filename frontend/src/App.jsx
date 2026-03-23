import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* Employee */
import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RaiseGrievance from "./pages/RaiseGrievance";
import TrackStatus from "./pages/TrackStatus";
import Feedback from "./pages/Feedback";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import MyGrievances from "./pages/MyGrievances";

/* Admin */
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageGrievances from "./pages/ManageGrievances";
import ManageFeedback from "./pages/ManageFeedback";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* EMPLOYEE ROUTES */}
        <Route element={<EmployeeLayout />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/raise-grievance" element={<RaiseGrievance />} />
          <Route path="/track-status" element={<TrackStatus />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/my-grievances" element={<MyGrievances />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-grievances" element={<ManageGrievances />} />
          <Route path="/manage-feedback" element={<ManageFeedback />} />
          <Route path="/admin-reports" element={<Reports />} />
          <Route path="/admin-audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
