import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import CreateOrder from './components/CreateOrder';
import OrdersList from './components/OrdersList';
import EquipmentsPage from './components/EquipmentsPage';
import CustomersPage from './components/CustomersPage';
import Reports from './components/Reports';
import Login from './components/Login';
import { useStore } from '../store/useStore';

type View = 'dashboard' | 'calendar' | 'create' | 'orders' | 'equipments' | 'customers' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const user = useStore((state) => state.user);

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <CalendarView />;
      case 'create': return <CreateOrder />;
      case 'orders': return <OrdersList />;
      case 'equipments': return <EquipmentsPage />;
      case 'customers': return <CustomersPage />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </MainLayout>
  );
}
