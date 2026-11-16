import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/lost', label: 'Perdí', icon: '🔍' },
  { to: '/found', label: 'Encontré', icon: '🐾' },
  { to: '/location', label: 'Mapa', icon: '📍' },
  { to: '/about', label: 'Nosotros', icon: 'ℹ️' },
  { to: '/support', label: 'Soporte', icon: '💬' },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const isInstitution = user?.role === 'institution';

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('search-animal-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('search-animal-theme', theme);
  }, [theme]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const themeVars = {
    ['--color-background' as any]: theme === 'dark' ? '#111827' : '#FFFBF5',
    ['--color-foreground' as any]: theme === 'dark' ? '#F9FAFB' : '#1C1008',
    ['--color-card' as any]: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    ['--color-card-foreground' as any]: theme === 'dark' ? '#F9FAFB' : '#1C1008',
    ['--color-primary' as any]: '#F97316',
    ['--color-primary-foreground' as any]: '#FFFFFF',
    ['--color-secondary' as any]: theme === 'dark' ? '#2A3448' : '#FEF3C7',
    ['--color-secondary-foreground' as any]: theme === 'dark' ? '#F8C98B' : '#92400E',
    ['--color-muted' as any]: theme === 'dark' ? '#1F2937' : '#F5EDE2',
    ['--color-muted-foreground' as any]: theme === 'dark' ? '#D1D5DB' : '#78604A',
    ['--color-accent' as any]: '#10B981',
    ['--color-accent-foreground' as any]: '#FFFFFF',
    ['--color-border' as any]: theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#E8D5BC',
    ['--color-ring' as any]: '#F97316',
    ['--color-destructive' as any]: '#EF4444',
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        ...themeVars,
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        colorScheme: theme,
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={isAuthenticated ? '/inicio' : '/'} className="flex items-center gap-2">
            <img src="/logo.png" alt="Search Animal" className="h-30 w-30 object-contain" />
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              Search Animal
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1.5 rounded-lg text-sm font-600 transition-all"
                style={{
                  color: location.pathname === item.to ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  backgroundColor: location.pathname === item.to ? 'var(--color-secondary)' : 'transparent',
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              className="ml-2 flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-700 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
                color: theme === 'dark' ? '#f9fafb' : '#111827',
              }}
              aria-label="Cambiar tema claro/oscuro"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] shadow-sm" style={{ color: '#f59e0b' }}>
                {theme === 'dark' ? '☀' : '☾'}
              </span>
              <span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
            </button>
            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  to={isInstitution ? '/shelter-dashboard' : '/profile'}
                  className="ml-2 px-4 py-1.5 rounded-lg text-sm font-700 text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {user?.avatar} {isInstitution ? 'Mi refugio' : 'Mi perfil'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg text-sm font-600"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  Salir
                </button>
              </>
            ) : !isLoading ? (
              <Link
                to="/login"
                className="ml-2 px-4 py-1.5 rounded-lg text-sm font-700 text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Iniciar sesión
              </Link>
            ) : null}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--color-foreground)' }}
          >
            <div className="w-5 h-0.5 mb-1" style={{ backgroundColor: 'currentColor' }} />
            <div className="w-5 h-0.5 mb-1" style={{ backgroundColor: 'currentColor' }} />
            <div className="w-5 h-0.5" style={{ backgroundColor: 'currentColor' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-2" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-600"
                style={{
                  color: location.pathname === item.to ? 'var(--color-primary)' : 'var(--color-foreground)',
                  backgroundColor: location.pathname === item.to ? 'var(--color-secondary)' : 'transparent',
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              className="flex items-center justify-between gap-2 rounded-full border px-3 py-2 text-sm font-700 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
                color: theme === 'dark' ? '#f9fafb' : '#111827',
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] shadow-sm" style={{ color: '#f59e0b' }}>
                {theme === 'dark' ? '☀' : '☾'}
              </span>
              <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  to={isInstitution ? '/shelter-dashboard' : '/profile'}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-700 text-white text-center"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {user?.avatar} {isInstitution ? 'Mi refugio' : 'Mi perfil'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-lg text-sm font-600 text-center"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : !isLoading ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-700 text-white text-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Iniciar sesión
              </Link>
            ) : null}
          </div>
        )}
      </header>

      <main id="content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}>
        <p>© 2026 Search Animal · Conectando mascotas con sus familias 🐾</p>
      </footer>
    </div>
  );
}
