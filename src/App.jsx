import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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
import ServicesManagement from './admin/ServicesManagement';
import AppointmentHistory from './admin/AppointmentHistory';
import BarberProfile from './admin/BarberProfile';

import SEOManagement from './admin/SEOManagement';
import ProtectedRoute from './admin/ProtectedRoute';
import { ToastProvider, useToast } from './admin/ToastContext';
import NotFound from './components/NotFound';


import { useServices, useBranches, useAppointments, useSettings } from './admin/data';

const App = () => {
  const [settings] = useSettings();
  const [view, setView] = useState('LANDING');

  // Dynamically Apply SEO Settings
  React.useEffect(() => {
    if (settings) {
      document.title = settings.siteTitle || 'Barrakesh';

      const updateTag = (selector, attr, content, isProperty = false) => {
        if (!content) return;
        let tag = document.querySelector(selector);
        if (!tag) {
          tag = document.createElement('meta');
          if (isProperty) tag.setAttribute('property', attr);
          else tag.name = attr;
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      // Standard Meta
      updateTag('meta[name="description"]', 'description', settings.siteDesc);

      const makeAbsolute = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return window.location.origin + (url.startsWith('/') ? '' : '/') + url;
      };

      const finalOgImage = makeAbsolute(settings.ogImage);

      // Open Graph
      updateTag('meta[property="og:title"]', 'og:title', settings.siteTitle, true);
      updateTag('meta[property="og:description"]', 'og:description', settings.siteDesc, true);
      updateTag('meta[property="og:image"]', 'og:image', finalOgImage, true);
      updateTag('meta[property="og:site_name"]', 'og:site_name', settings.siteName, true);
      updateTag('meta[property="og:type"]', 'og:type', 'website', true);
      updateTag('meta[property="og:url"]', 'og:url', window.location.origin, true);

      // Twitter
      updateTag('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image');
      updateTag('meta[name="twitter:title"]', 'twitter:title', settings.siteTitle);
      updateTag('meta[name="twitter:description"]', 'twitter:description', settings.siteDesc);
      updateTag('meta[name="twitter:image"]', 'twitter:image', finalOgImage);


      // Favicon
      if (settings.favicon) {
        let icon = document.querySelector('link[rel="icon"]');
        if (icon) {
          icon.href = settings.favicon;
        } else {
          icon = document.createElement('link');
          icon.rel = 'icon';
          icon.href = settings.favicon;
          document.head.appendChild(icon);
        }
      }
    }
  }, [settings]);



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
    setPreferredCategory(null); // Show all
    nextStep('SERVICES');
  };
  const handleStudioStart = () => {
    setPreferredCategory('Music Studio'); // Keep this for studio specifically if desired, but user wants both in "Agendar"
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

  const [appointments, { addItem: addAppointment }] = useAppointments();

  const { addToast } = useToast();

  const handleContactComplete = async (customer) => {
    const finalBooking = { ...booking, customer };
    setBooking(finalBooking);

    try {
      // Save to Firebase
      await addAppointment({
        ...finalBooking,
        status: 'Confirmed',
        total: finalBooking.services.reduce((acc, s) => acc + parseFloat(s.price || 0), 0) * (finalBooking.studioInfo?.hours || 1)
      });
      addToast('Cita agendada correctamente. ¡Te esperamos!', 'success');
      nextStep('CONFIRMATION');
    } catch (error) {
      console.error("Error saving appointment:", error);
      addToast('Hubo un error al agendar tu cita. Por favor intenta de nuevo.', 'error');
    }
  };

  const reset = () => {
    setBooking({
      services: [],
      barber: null,
      date: null,
      time: null,
      studioInfo: { description: '', hours: 1 }
    });
    setPreferredCategory(null);
    setView('LANDING');
  };

  const UserPlatform = () => (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const location = useLocation();

  return (
    <Routes location={location}>
      {/* User Facing App */}
      <Route path="/" element={<UserPlatform />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Platform */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="agenda" element={<ProtectedRoute roles={['SUPER_ADMIN']}><GeneralAgenda /></ProtectedRoute>} />
        <Route path="my-agenda" element={<ProtectedRoute roles={['BARBER']}><BarberAgenda /></ProtectedRoute>} />
        <Route path="barbers" element={<ProtectedRoute roles={['SUPER_ADMIN']}><BarberManagement /></ProtectedRoute>} />
        <Route path="branches" element={<ProtectedRoute roles={['SUPER_ADMIN']}><BranchesManagement /></ProtectedRoute>} />
        <Route path="services" element={<ProtectedRoute roles={['SUPER_ADMIN']}><ServicesManagement /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute roles={['BARBER']}><BarberProfile /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AppointmentHistory /></ProtectedRoute>} />
        <Route path="seo" element={<ProtectedRoute roles={['SUPER_ADMIN']}><SEOManagement /></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
