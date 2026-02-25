"use client";

import Link from "next/link";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Target, 
  MessageSquare, 
  User,
  LogOut,
  Menu,
  X,
  Landmark
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CurrencyProvider } from "@/components/CurrencyContext";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Check if user has accepted terms
  useEffect(() => {
    if (!isLoaded || !user) return;
    const termsAccepted = (user.publicMetadata as any)?.termsAcceptedAt;
    if (!termsAccepted) {
      router.replace('/terms');
    } else {
      setTermsChecked(true);
    }
  }, [isLoaded, user, router]);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);                         // set initial value
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: PlusCircle },
    { name: "AI Analysis", href: "/dashboard/analysis", icon: BarChart3 },
    { name: "Financial Goals", href: "/dashboard/goals", icon: Target },
    { name: "Bank Accounts", href: "/dashboard/bank", icon: Landmark },
    { name: "AI Chatbot", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  // On desktop the sidebar is always visible; on mobile it slides in/out
  const sidebarClassName = `sidebar${isMobile && isSidebarOpen ? " open" : ""}`;

  // Don't render dashboard until terms check is complete
  if (!termsChecked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '24px', height: '24px', border: '3px solid #eee', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/laxance-logo.png" alt="Laxance" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (mobile only) */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClassName}>
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/laxance-logo.png" alt="Laxance" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <SignOutButton>
            <button className="sidebar-logout">
              <LogOut size={20} />
              Logout
            </button>
          </SignOutButton>
        </nav>

        <div className="sidebar-user">
          <UserButton afterSignOutUrl="/" />
          <div style={{ overflow: 'hidden' }}>
            <div className="sidebar-user-name">
              {user?.fullName || user?.firstName || "User"}
            </div>
            <div className="sidebar-user-sub">Manage Account</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </main>
    </div>
  );
}
