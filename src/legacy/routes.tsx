import { createBrowserRouter, Navigate, useLocation } from 'react-router';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import { useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import KYC from './pages/KYC';
import Register from './pages/Register';
import RegisterInstitution from './pages/RegisterInstitution';
import LostForm from './pages/LostForm';
import FoundForm from './pages/FoundForm';
import About from './pages/About';
import Support from './pages/Support';
import Location from './pages/Location';
import Profile from './pages/Profile';
import ShelterProfile from './pages/ShelterProfile';
import ShelterDashboard from './pages/ShelterDashboard';
import PublicationDetail from './pages/PublicationDetail';

function MemberHome() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">Cargando tu cuenta…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return user?.role === 'institution' ? <Navigate to="/shelter-dashboard" replace /> : <Home authenticated />;
}

function LandingHome() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">Cargando…</div>;
  if (!isAuthenticated) return <Home />;
  return user?.role === 'institution' ? <Navigate to="/shelter-dashboard" replace /> : <Navigate to="/inicio" replace />;
}

function ProtectedPublication() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">Cargando…</div>;
  return isAuthenticated
    ? <PublicationDetail />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: LandingHome },
      { path: 'inicio', Component: MemberHome },
      { path: 'login', Component: Login },
      { path: 'kyc', Component: KYC },
      { path: 'register', Component: Register },
      { path: 'register-institution', Component: RegisterInstitution },
      { path: 'lost', Component: LostForm },
      { path: 'found', Component: FoundForm },
      { path: 'about', Component: About },
      { path: 'support', Component: Support },
      { path: 'location', Component: Location },
      { path: 'profile', Component: Profile },
      { path: 'publication/:id', Component: ProtectedPublication },
      { path: 'shelter/:id', Component: ShelterProfile },
      { path: 'shelter-dashboard', Component: ShelterDashboard },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
