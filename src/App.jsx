import React, { useState } from 'react';
import Landing from './components/Landing';
import ServiceMenu from './components/ServiceMenu';
import CrewRoster from './components/CrewRoster';
import BookingFlow from './components/BookingFlow';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';
import IntentSelection from './components/IntentSelection';
import ContactInfo from './components/ContactInfo';
import RecordingStudio from './components/RecordingStudio';
import JoinTeam from './components/JoinTeam';

const App = () => {
  const [view, setView] = useState('LANDING'); // LANDING, SERVICES, CREW, BOOKING, CONTACT, CONFIRMATION, DASHBOARD, STUDIO, JOIN
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
    setView('INTENT');
  };

  // Hidden way to enter dashboard for this demo: triple tap bottom right or just a simple toggle for now
  const openDashboard = () => setView('DASHBOARD');

  return (
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
          onComplete={handleBookingDateTime}
          booking={booking}
        />
      )}

      {view === 'CONTACT' && (
        <ContactInfo
          onComplete={handleContactComplete}
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
