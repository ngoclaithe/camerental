import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import CreateOrder from './components/CreateOrder';
import OrdersList from './components/OrdersList';
import EquipmentsPage from './components/EquipmentsPage';
import CustomersPage from './components/CustomersPage';
import UsersPage from './components/UsersPage';
import GuidesPage from './components/GuidesPage';
import Reports from './components/Reports';
import Login from './components/Login';
import GuestPage from './components/GuestPage';
import { useStore } from '../store/useStore';

type View = 'dashboard' | 'calendar' | 'create' | 'orders' | 'equipments' | 'customers' | 'users' | 'reports' | 'guides';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('camerental_current_view') as View) || 'dashboard';
    }
    return 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('camerental_current_view', currentView);
  }, [currentView]);
  const user = useStore((state) => state.user);

  if (!user) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return <GuestPage onLoginClick={() => setShowLogin(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <CalendarView />;
      case 'create': return <CreateOrder setView={setCurrentView} />;
      case 'orders': return <OrdersList />;
      case 'equipments': return <EquipmentsPage />;
      case 'customers': return <CustomersPage />;
      case 'users': return <UsersPage />;
      case 'reports': return <Reports />;
      case 'guides': return <GuidesPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </MainLayout>
  );
}
