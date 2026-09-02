import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import EventPage from '@/pages/EventPage';
import JourneyPage from '@/pages/JourneyPage';
import SchedulePage from '@/pages/SchedulePage';
import CoordinatorsPage from '@/pages/CoordinatorsPage';
import RegisterPage from '@/pages/RegisterPage';
import SuccessPage from '@/pages/SuccessPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminRegistrationsPage from '@/pages/AdminRegistrationsPage';
import SubmitPage from '@/pages/SubmitPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/coordinators" element={<CoordinatorsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/register/success" element={<SuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
