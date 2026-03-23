import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import CreateUser from "../pages/auth/CreateUser";
import Dashboard from "../pages/dashboard/Dashboard";
import Roles from "../pages/roles/Roles";
import Candidate from "../pages/candidate/candidate";
import Emails from "../pages/email/Emails";
import EmailSettings from "../pages/emailSettings/EmailSettings";
import ProtectedRoute from "./Protectedroute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>


        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />


        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/roles" element={
          <ProtectedRoute><Roles /></ProtectedRoute>
        } />
        <Route path="/candidate" element={
          <ProtectedRoute><Candidate /></ProtectedRoute>
        } />
        <Route path="/emails" element={
          <ProtectedRoute><Emails /></ProtectedRoute>
        } />
        <Route path="/email-settings" element={
          <ProtectedRoute><EmailSettings /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;