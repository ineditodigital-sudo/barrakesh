import React, { useState } from 'react';
import Landing from './components/Landing';
import ServiceMenu from './components/ServiceMenu';
import CrewRoster from './components/CrewRoster';
import BookingFlow from './components/BookingFlow';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';

const App = () => {
  const [view, setView] = useState('LANDING'); // LANDING, SERVICES, CREW, BOOKING, CONFIRMATION, DASHBOARD
  const [booking, setBooking] = useState({
    service: null,
    barber: null,
    date: null,
    time: null
  });

  const nextStep = (step) => setView(step);

  const handleServiceSelect = (service) => {
    setBooking(prev => ({ ...prev, service }));
    nextStep('CREW');
  };

  const handleBarberSelect = (barber) => {
    setBooking(prev => ({ ...prev, barber }));
    nextStep('BOOKING');
  };

  const handleBookingComplete = ({ date, time }) => {
    setBooking(prev => ({ ...prev, date, time }));
    nextStep('CONFIRMATION');
  };

  const reset = () => {
    setBooking({ service: null, barber: null, date: null, time: null });
    setView('LANDING');
  };

  // Hidden way to enter dashboard for this demo: triple tap bottom right or just a simple toggle for now
  const openDashboard = () => setView('DASHBOARD');

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      {view === 'LANDING' && <Landing onNext={() => nextStep('SERVICES')} />}

      {view === 'SERVICES' && (
        <ServiceMenu
          onSelect={handleServiceSelect}
          selectedService={booking.service}
        />
      )}

      {view === 'CREW' && (
        <CrewRoster
          onSelect={handleBarberSelect}
          selectedBarber={booking.barber}
        />
      )}

      {view === 'BOOKING' && (
        <BookingFlow
          onComplete={handleBookingComplete}
          booking={booking}
        />
      )}

      {view === 'CONFIRMATION' && (
        <Confirmation
          booking={booking}
          onReset={reset}
        />
      )}

      {view === 'DASHBOARD' && (
        <Dashboard onExit={reset} />
      )}

      {/* Admin Secret Entry - Bottom Right Invisible Area */}
      {view === 'LANDING' && (
        <div
          onClick={(e) => {
            if (e.detail === 3) openDashboard(); // Triple click
          }}
          className="fixed bottom-0 right-0 w-16 h-16 z-[60] cursor-default"
          title="Admin Access"
        />
      )}
    </div>
  );
};

export default App;
