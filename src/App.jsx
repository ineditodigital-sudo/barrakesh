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
import StudioDetails from './components/StudioDetails';
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
import ServicesManagement from './admin/ServicesManagement';
import AppointmentHistory from './admin/AppointmentHistory';
import BarberProfile from './admin/BarberProfile';
import FirebaseSeed from './admin/FirebaseSeed';

const App = () => {
  const [view, setView] = useState('LANDING');
  const [booking, setBooking] = useState({
    services: [], // Changed from service to services
    barber: null,
    date: null,
    time: null,
    customer: { name: '', phone: '' },
    studioInfo: { description: '', hours: 1 } // Added for Music Studio
  });

  const [preferredCategory, setPreferredCategory] = useState(null);

  const nextStep = (step) => setView(step);
  const handleBarberStart = () => {
    setPreferredCategory('Barber Shop');
    nextStep('SERVICES');
  };
  const handleStudioStart = () => {
    setPreferredCategory('Music Studio');
    nextStep('SERVICES');
  };
  const handleJoinStart = () => nextStep('JOIN');

  const handleServiceSelect = (selectedServices) => {
    const isStudioBooking = selectedServices.some(s => s.category === 'Music Studio');

    setBooking(prev => ({
      ...prev,
      services: selectedServices,
      barber: isStudioBooking ? { name: 'ESTUDIO' } : prev.barber // Studio doesn't need a specific barber selection
    }));

    if (isStudioBooking) {
      nextStep('STUDIO_DETAILS');
    } else {
      nextStep('CREW');
    }
  };

  const handleStudioDetailsComplete = (details) => {
    setBooking(prev => ({ ...prev, studioInfo: details }));
    nextStep('BOOKING');
  };

  const handleBarberSelect = (barber) => {
    setBooking(prev => ({ ...prev, barber }));
    nextStep('BOOKING');
  };

  const handleBookingDateTime = ({ location, date, time }) => {
    setBooking(prev => ({ ...prev, location, date, time }));
    nextStep('CONTACT');
  };

  const handleContactComplete = (customer) => {
    setBooking(prev => ({ ...prev, customer }));
    nextStep('CONFIRMATION');
  };

  const reset = () => {
    setBooking({
      services: [],
      barber: null,
      date: null,
      time: null,
      customer: { name: '', phone: '' },
      studioInfo: { description: '', hours: 1 }
    });
    setPreferredCategory(null);
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

      {view === 'STUDIO_DETAILS' && (
        <StudioDetails
          onComplete={handleStudioDetailsComplete}
          onBack={() => setView('SERVICES')}
          booking={booking}
        />
      )}

      {view === 'SERVICES' && (
        <ServiceMenu
          onSelect={handleServiceSelect}
          onBack={reset}
          initialSelected={booking.services}
          preferredCategory={preferredCategory}
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
            <Route path="services" element={<ServicesManagement />} />
            <Route path="profile" element={<BarberProfile />} />
            <Route path="appointments" element={<AppointmentHistory />} />
          </Route>

          <Route path="/admin/setup" element={<FirebaseSeed />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
