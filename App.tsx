
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { Login } from './screens/Login';
import { OrderDetails } from './screens/OrderDetails';
import { History } from './screens/History';
import { Profile } from './screens/Profile';
import { Layout } from './components/Layout';
import { db } from './services/mockFirestore';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  // Fake splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Update location simulation every 10 seconds if "online"
  useEffect(() => {
    const interval = setInterval(() => {
      const partner = db.getPartner();
      if (partner.status === 'active') {
        // Mock slight movement
        const lat = partner.currentLocation.lat + (Math.random() - 0.5) * 0.001;
        const lng = partner.currentLocation.lng + (Math.random() - 0.5) * 0.001;
        db.updatePartnerLocation(lat, lng);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-bounce">
          <span className="text-green-600 font-black text-4xl italic tracking-tighter">P</span>
        </div>
        <div className="text-white font-bold tracking-widest uppercase text-xs opacity-80 animate-pulse">
          Pureingo Partner
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/';
  const isOrderDetails = location.pathname.startsWith('/order/');

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <Layout title="Dashboard">
            <Dashboard />
          </Layout>
        } 
      />
      <Route 
        path="/history" 
        element={
          <Layout title="History">
            <History />
          </Layout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <Layout title="Partner Profile">
            <Profile />
          </Layout>
        } 
      />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
