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
          <Route path="/register/success" element={<SuccessPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
