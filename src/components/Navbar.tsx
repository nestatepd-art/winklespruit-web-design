import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/native-digital-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center">
            <img src={logo} alt="Native Digital" className="h-12 w-auto" />
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
            <a href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <Button variant="default" size="sm">
              Get Started
            </Button>
          </div>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="/#services" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>Services</a>
              <a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>Pricing</a>
              <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>Blog</a>
              <a href="/#about" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>About</a>
              <a href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>Contact</a>
              <Button variant="default" size="sm" className="w-fit">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
