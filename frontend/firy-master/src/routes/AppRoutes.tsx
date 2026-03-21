import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Roles from "../pages/roles/Roles";
import Candidate from "../pages/candidate/candidate";
import Emails from "../pages/email/Emails";
import EmailSettings from "../pages/emailSettings/EmailSettings";
import CreateUser from "../pages/auth/Createuser";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
         <Route path="/create-user" element={<CreateUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/email-settings" element={<EmailSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;