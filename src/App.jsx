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
import BranchSelector from './components/BranchSelector';
import MaintenanceScreen from './components/MaintenanceScreen';

import { AuthProvider, useAuth } from './admin/AuthContext';
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
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    window.onerror = (msg, url, line) => {
      setError(`ERROR DETECTADO: ${msg} en línea ${line}`);
    };
  }, []);

  if (error) return <div style={{background:'red', color:'white', padding:'20px', position:'fixed', inset:0, zIndex:99999}}>{error}</div>;

  const [settings, { loading: settingsLoading, error: settingsError }] = useSettings();
  const [view, setView] = useState('LANDING');
  const [appLoading, setAppLoading] = useState(true);

  const [booking, setBooking] = useState({
    services: [], 
    branch: null,
    barber: null,
    date: null,
    time: null,
    customer: { name: '', phone: '' },
    studioInfo: { description: '', hours: 1 }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [preferredCategory, setPreferredCategory] = useState(null);
  const [appointments, { addItem: addAppointment }] = useAppointments();
  const { addToast } = useToast();

  // Safety timeout: 5 seconds to prevent permanent white screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 5000);
    
    if (!settingsLoading) {
      setAppLoading(false);
    }
    
    return () => clearTimeout(timer);
  }, [settingsLoading]);

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



  if (settingsError) {
    return (
      <div className="min-h-screen bg-[#500] text-white flex flex-col items-center justify-center p-10 font-mono">
        <h1 className="text-3xl font-black mb-4 tracking-tighter uppercase">Fallo de Conexión</h1>
        <p className="text-white/60 mb-8 max-w-md text-center uppercase tracking-widest text-[10px] font-bold">
          No se pudo establecer el enlace con el núcleo de datos. Verifica la carpeta /backend y el archivo db.php.
        </p>
        <div className="bg-black/50 p-6 rounded-2xl border border-white/10 w-full max-w-2xl overflow-auto text-[10px] leading-relaxed">
          <pre className="text-primary">{JSON.stringify(settingsError, null, 2)}</pre>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-10 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all rounded-full"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-black animate-pulse">Iniciando Barrakesh...</p>
      </div>
    );
  }

  const nextStep = (step) => setView(step);
  const handleBarberStart = () => {
    setPreferredCategory(null); // Show all
    nextStep('BRANCHES');
  };
  const handleStudioStart = () => {
    setPreferredCategory('Music Studio');
    nextStep('BRANCHES');
  };
  const handleJoinStart = () => nextStep('JOIN');

  const handleBranchSelect = (branch) => {
    setBooking(prev => ({ ...prev, branch }));
    nextStep('SERVICES');
  };

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

  const handleBookingDateTime = ({ branch, date, time }) => {
    setBooking(prev => ({ ...prev, branch, date, time }));
    nextStep('CONTACT');
  };



  const handleContactComplete = async (customer) => {
    const finalBooking = { ...booking, customer };
    setBooking(finalBooking);
    setIsSaving(true);

    try {
      // Save to MySQL via PHP API
      await addAppointment({
        ...finalBooking,
        location: finalBooking.branch?.name || 'BK MATRIZ',
        status: 'Confirmed',
        total: finalBooking.services.reduce((acc, s) => {
          const price = (s.branchPrices && finalBooking.branch?.id && s.branchPrices[finalBooking.branch.id]) || s.price;
          return acc + parseFloat(price || 0);
        }, 0) * (finalBooking.studioInfo?.hours || 1)
      });
      addToast('Cita agendada correctamente. ¡Te esperamos!', 'success');
      nextStep('CONFIRMATION');
    } catch (error) {
      console.error("Error saving appointment:", error);
      addToast('Hubo un error al agendar tu cita. Por favor intenta de nuevo.', 'error');
    } finally {
      setIsSaving(false);
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

  const { user } = useAuth();
  const isAdmin = user && ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'].includes(user.role);
  const isMaintenance = (Number(settings?.maintenance_mode) === 1 || settings?.maintenance_mode === true) && !isAdmin;

  const UserPlatform = () => {
    if (isMaintenance) return <MaintenanceScreen />;
    
    return (
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

            {view === 'BRANCHES' && (
              <BranchSelector
                onSelect={handleBranchSelect}
                onBack={reset}
                preferredCategory={preferredCategory}
              />
            )}

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
                onBack={() => setView('BRANCHES')}
                initialSelected={booking.services}
                preferredCategory={preferredCategory}
                selectedBranch={booking.branch}
              />
            )}

            {view === 'CREW' && (
              <CrewRoster
                onSelect={handleBarberSelect}
                onBack={() => setView('SERVICES')}
                selectedBarber={booking.barber}
                selectedBranch={booking.branch}
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

        {/* Global Saving Loader */}
        {isSaving && (
          <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="relative">
              <div className="size-40 border-8 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 size-40 border-8 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/LOGO-BARRAKESH-CUADRADO-TXT-BLANCO.png" className="size-20 object-contain animate-pulse" alt="Loading" />
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-white font-display text-4xl font-black uppercase tracking-tighter mb-4">Asegurando el <span className="text-primary italic">Flow</span></h3>
              <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Sincronizando con los servidores de Barrakesh...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const location = useLocation();

  return (
    <Routes location={location}>
      {/* User Facing App */}
      <Route path="/" element={<UserPlatform />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Platform */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="agenda" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><GeneralAgenda /></ProtectedRoute>} />
        <Route path="my-agenda" element={<ProtectedRoute roles={['BARBER']}><BarberAgenda /></ProtectedRoute>} />
        <Route path="barbers" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><BarberManagement /></ProtectedRoute>} />
        <Route path="branches" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><BranchesManagement /></ProtectedRoute>} />
        <Route path="services" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><ServicesManagement /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute roles={['BARBER']}><BarberProfile /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><AppointmentHistory /></ProtectedRoute>} />
        <Route path="seo" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']}><SEOManagement /></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
