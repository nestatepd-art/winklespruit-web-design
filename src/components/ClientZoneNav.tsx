import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, Shield } from 'lucide-react';
import logo from '@/assets/native-digital-logo.png';

const ClientZoneNav = () => {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Native Digital" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/client">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
            {role === 'admin' && (
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <Shield className="w-4 h-4 mr-2" /> Admin
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientZoneNav;
