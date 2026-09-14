import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuthenticated, teacher, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
          <Link to="/" className="font-display text-xl font-semibold">
            Mural
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Link to="/" className="hover:text-accent">
              Posts
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="hover:text-accent">
                  Administração
                </Link>
                <span className="hidden text-ink/50 sm:inline">{teacher?.name}</span>
                <button onClick={handleLogout} className="text-accent hover:underline">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-accent">
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}