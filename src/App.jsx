import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import ServiceMenu from './components/ServiceMenu';
import CrewRoster from './components/CrewRoster';
import BookingFlow from './components/BookingFlow';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';
import ContactInfo from './components/ContactInfo';
import RecordingStudio from './components/RecordingStudio';
import JoinTeam from './components/JoinTeam';

import { AuthProvider } from './admin/AuthContext';
import { ThemeProvider } from './admin/ThemeContext';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import BarberManagement from './admin/BarberManagement';
import GeneralAgenda from './admin/GeneralAgenda';
import BarberAgenda from './admin/BarberAgenda';
import BranchesManagement from './admin/BranchesManagement';
import CustomerManagement from './admin/CustomerManagement';
import AppointmentHistory from './admin/AppointmentHistory';
import BarberProfile from './admin/BarberProfile';

const App = () => {
  const [view, setView] = useState('LANDING');
  const [booking, setBooking] = useState({
    service: null,
    barber: null,
    date: null,
    time: null,
    customer: { name: '', phone: '' }
  });

  const nextStep = (step) => setView(step);
  const handleBarberStart = () => nextStep('SERVICES');
  const handleStudioStart = () => nextStep('STUDIO');
  const handleJoinStart = () => nextStep('JOIN');

  const handleServiceSelect = (service) => {
    setBooking(prev => ({ ...prev, service }));
    nextStep('CREW');
  };

  const handleBarberSelect = (barber) => {
    setBooking(prev => ({ ...prev, barber }));
    nextStep('BOOKING');
  };

  const handleBookingDateTime = ({ date, time }) => {
    setBooking(prev => ({ ...prev, date, time }));
    nextStep('CONTACT');
  };

  const handleContactComplete = (customer) => {
    setBooking(prev => ({ ...prev, customer }));
    nextStep('CONFIRMATION');
  };

  const reset = () => {
    setBooking({
      service: null,
      barber: null,
      date: null,
      time: null,
      customer: { name: '', phone: '' }
    });
    setView('LANDING');
  };

  const UserPlatform = () => (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      {view === 'LANDING' && (
        <Landing
          onBarberStart={handleBarberStart}
          onStudioStart={handleStudioStart}
          onJoinStart={handleJoinStart}
        />
      )}

      {view === 'STUDIO' && <RecordingStudio onBack={reset} />}
      {view === 'JOIN' && <JoinTeam onBack={reset} />}

      {view === 'SERVICES' && (
        <ServiceMenu
          onSelect={handleServiceSelect}
          onBack={reset}
          selectedService={booking.service}
        />
      )}

      {view === 'CREW' && (
        <CrewRoster
          onSelect={handleBarberSelect}
          onBack={() => setView('SERVICES')}
          selectedBarber={booking.barber}
        />
      )}

      {view === 'BOOKING' && (
        <BookingFlow
          onComplete={handleBookingDateTime}
          onBack={() => setView('CREW')}
          booking={booking}
        />
      )}

      {view === 'CONTACT' && (
        <ContactInfo
          onComplete={handleContactComplete}
          onBack={() => setView('BOOKING')}
          booking={booking}
        />
      )}

      {view === 'CONFIRMATION' && (
        <Confirmation
          booking={booking}
          onReset={reset}
        />
      )}
    </div>
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* User Facing App */}
          <Route path="/" element={<UserPlatform />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Platform */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agenda" element={<GeneralAgenda />} />
            <Route path="my-agenda" element={<BarberAgenda />} />
            <Route path="barbers" element={<BarberManagement />} />
            <Route path="branches" element={<BranchesManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="profile" element={<BarberProfile />} />
            <Route path="appointments" element={<AppointmentHistory />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
