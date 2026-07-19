import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, User, LogOut, LogIn, Shield, UserCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { imagePath } from '@/lib/imagePath';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  chatOpen?: boolean;
}

export function Header({ activeSection, onSectionChange, chatOpen = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

const navItems = [
    {
      id: '/about',
      label: 'О проекте',
      isRoute: false,
      isStub: true,
      dropdownItems: [
        { id: '/about', label: 'О проекте', isRoute: true },
        { id: '/contact', label: 'Связаться', isRoute: true },
      ]
    },
    {
      id: '/services',
      label: 'Наши услуги',
      isRoute: false,
      isStub: true,
      dropdownItems: [
        { id: '/survey', label: 'Опрос выпускников', isRoute: true },
        { id: '/career-quiz', label: 'Карьерный тест', isRoute: true },
        { id: '/profession-selection', label: 'Подбор профессии', isRoute: true },
        { id: '/admission-help', label: 'Помощь при поступлении', isRoute: false, isStub: true },
        { id: '/internships', label: 'Стажировки', isRoute: true },
        { id: '/events', label: 'Мероприятия', isRoute: true },
        { id: '/career-map', label: 'Карта карьер', isRoute: true },
        { id: '/blog', label: 'Блог', isRoute: true },
      ]
    },
    {
      id: '/data',
      label: 'Наши данные',
      isRoute: false,
      isStub: true,
      dropdownItems: [
        { id: '/statistics', label: 'Аналитика', isRoute: true },
        { id: '/analytics/specialties', label: 'Аналитика поступления', isRoute: true },
        { id: '/admission-stats', label: 'Статистика поступления', isRoute: true },
        { id: '/survey', label: 'Анкета', isRoute: true },
        { id: '/universities', label: 'Университеты', isRoute: true },
      ]
    },
  ];

  const handleNavClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setMobileOpen(false);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t('profile.logoutSuccess'),
      description: t('profile.logoutSuccessDesc'),
    });
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const navLinks = (
    <div className="flex items-start gap-6">
      {navItems.map((item) => (
        <div key={item.id} className="space-y-2 min-w-0">
          <Link
            to={item.id}
            className={cn(
              "text-sm font-semibold whitespace-nowrap hover:text-primary transition-colors",
              isScrolled ? "text-white" : "text-foreground"
            )}
          >
            {item.label}
          </Link>
          <div className="space-y-1">
            {item.dropdownItems?.map((dropdownItem) => (
              <Link
                key={dropdownItem.id}
                to={dropdownItem.isRoute ? dropdownItem.id : '#'}
                className={cn(
                  "block text-sm py-1 whitespace-nowrap transition-colors",
                  isScrolled
                    ? dropdownItem.isStub ? "text-white/40 cursor-not-allowed" : "text-white/70 hover:text-white"
                    : dropdownItem.isStub ? "text-muted-foreground opacity-60 cursor-not-allowed" : "text-muted-foreground hover:text-primary"
                )}
              >
                {dropdownItem.label}
                {dropdownItem.isStub && <span className="text-xs ml-1">(скоро)</span>}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
    >
      <motion.div
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        onClick={() => {
          if ('ontouchstart' in window) setIsHeaderHovered(prev => !prev)
        }}
        animate={{
          maxWidth: isScrolled && !isMobile ? 1024 : '100%',
          borderRadius: isScrolled && !isMobile ? 16 : 0,
          boxShadow: isScrolled ? '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' : 'none',
          marginTop: isScrolled && !isMobile ? 12 : 0,
          backgroundColor: isScrolled ? 'rgb(15,26,28)' : 'rgba(255,255,255,0.8)',
          borderBottom: isScrolled ? '0px solid transparent' : '1px solid hsl(var(--border))',
          color: isScrolled ? 'rgb(255,255,255)' : 'inherit',
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
              <img src={imagePath('/favicon.png')} alt="GradPath" className="w-6 h-6 object-contain" />
            </div>
            <motion.span
              animate={{
                maxWidth: isScrolled ? 0 : (isMobile ? 180 : 400),
                opacity: isScrolled ? 0 : 1,
                marginRight: isScrolled ? 0 : (isMobile ? 8 : 12),
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-block font-serif text-base sm:text-xl lg:text-2xl font-semibold overflow-hidden whitespace-nowrap"
            >
              GradPath Analytics
            </motion.span>
          </Link>

            {!isMobile && (
              <nav
                className={cn(
                  "hidden md:flex items-center gap-6",
                  isScrolled ? "flex-1 justify-center" : ""
                )}
              >
                {navItems.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 relative py-2 flex items-center gap-1 cursor-pointer",
                      isScrolled
                        ? "text-white/70 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                ))}
              </nav>
            )}

            {!isMobile && (
              <div className="hidden md:flex items-center gap-4 shrink-0">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={cn("flex items-center gap-2", isScrolled && "hover:bg-white/10")}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="hidden lg:inline text-sm font-medium">
                          {user.email?.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                      {isAdmin && (
                        <div className="px-2 py-1 text-xs text-primary">
                          <Shield className="w-3 h-3 inline mr-1" />Администратор
                        </div>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserCircle className="w-4 h-4 mr-2" />Профиль
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />Админ-панель
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant={isScrolled ? "ghost" : "outline"}
                    onClick={handleSignIn}
                    className={cn(
                      "flex items-center gap-2",
                      isScrolled && "border border-white/30 text-white hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden lg:inline">Войти</span>
                  </Button>
                )}

                {!chatOpen && (
                  <div className="flex items-center gap-2">
                    <Link to="/search">
                      <Button variant="ghost" size="icon" className={cn("w-9 h-9", isScrolled && "hover:bg-white/10")}>
                        <Search className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/universities">
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="btn-primary flex items-center gap-2 text-sm"
                      >
                        Университеты
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isMobile && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors hover:bg-white/10",
                  isScrolled ? "text-white" : "text-foreground hover:bg-secondary"
                )}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* Desktop dropdown */}
          <AnimatePresence mode="wait">
            {isHeaderHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-hidden"
              >
                <div
                  className={cn(
                    "py-3 border-t",
                    isScrolled
                      ? "border-white/10 shadow-lg rounded-2xl mt-1"
                      : "bg-background/80 border-border"
                  )}
                >
                  {isScrolled ? (
                    <div className="px-4 sm:px-6 lg:px-8">{navLinks}</div>
                  ) : (
                    <div className="section-container">
                      <div className="flex items-start justify-between">
                        <div className="invisible flex items-center gap-2 shrink-0 pointer-events-none select-none">
                          <div className="w-9 h-9 rounded-full bg-muted" />
                          <span className="font-serif text-xl">GradPath Analytics</span>
                        </div>
                        {navLinks}
                        <div className="invisible flex items-center gap-4 shrink-0 pointer-events-none select-none">
                          <div className="w-9 h-9 rounded-lg bg-muted" />
                          <div className="w-28 h-9 rounded-lg bg-primary/20" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
              className={cn(
                "overflow-hidden fixed left-0 right-0 top-16 sm:top-20 z-50",
                isScrolled
                  ? "bg-[#0f1a1c] shadow-lg"
                  : "bg-background border-b border-border"
              )}
          >
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item, index) => (
                <Link key={item.id} to={item.id} onClick={() => setMobileOpen(false)}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium",
                      isActiveRoute(item.id)
                        ? "bg-primary text-primary-foreground"
                        : isScrolled
                          ? "text-white/70 hover:bg-white/10"
                          : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-border my-3" />
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="px-4 py-2"
                  >
                    <p className={cn("text-sm font-medium", isScrolled ? "text-white" : "text-foreground")}>{user.email}</p>
                    {isAdmin && (
                      <p className="text-xs text-primary mt-1">
                        <Shield className="w-3 h-3 inline mr-1" />Администратор
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium cursor-pointer",
                      isScrolled
                        ? "text-white/70 hover:bg-white/10"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <UserCircle className="w-4 h-4 inline mr-2" />Профиль
                  </motion.div>
                  {isAdmin && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium cursor-pointer",
                        isScrolled
                          ? "text-white/70 hover:bg-white/10"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <Shield className="w-4 h-4 inline mr-2" />Админ-панель
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium cursor-pointer",
                      isScrolled
                        ? "text-red-400 hover:bg-white/10"
                        : "text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />Выйти
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-3" />
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium cursor-pointer",
                      isScrolled
                        ? "border border-white/30 text-white hover:bg-white/10"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <LogIn className="w-4 h-4 inline mr-2" />Войти
                  </motion.div>
                </>
              )}

              <div className="pt-3">
                <Link to="/applicants" onClick={() => setMobileOpen(false)}>
                  <button className="w-full btn-primary flex items-center justify-center gap-2">
                    Выбрать профессию
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
