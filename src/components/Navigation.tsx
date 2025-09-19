import React from 'react';
import { Brain, Menu, X, User, LogOut, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'counselor' | 'admin' | 'volunteer';
}

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

export const Navigation = ({ user, onLogout }: NavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'AI Chat', href: '#chat' },
    { label: 'Screening', href: '#screening' },
    { label: 'Advanced Analysis', href: '#advanced' },
    { label: 'Resources', href: '#resources' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500 text-white';
      case 'counselor': return 'bg-blue-500 text-white';
      case 'volunteer': return 'bg-green-500 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MindBridge</h1>
              <p className="text-xs text-muted-foreground">Student Mental Health Support</p>
            </div>
          </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
              <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <User className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground transition-colors p-3 rounded-md hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="justify-start gap-2 p-3"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={onLogout}
                  className="justify-start gap-2 p-3 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </nav>
  );
};