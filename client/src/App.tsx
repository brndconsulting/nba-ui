/**
 * App - Main application component
 * 
 * Structure:
 * - ErrorBoundary wraps everything
 * - ThemeProviders for dark/light and accent colors
 * - ContextProvider for user context (leagues/teams)
 * - ContextGate blocks access without active selection
 * - DashboardShell provides Header + Footer layout
 * - Router handles page navigation
 */
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider as NextThemesProvider } from "./contexts/ThemeContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ContextProvider } from "./contexts/ContextProvider";
import { ContextGate } from "./components/ContextGate";
import { DashboardShell } from "./components/layout/DashboardShell";

// Pages
import Home from '@/pages/Home';
import Matchup from '@/pages/Matchup';
import { Waiver } from '@/pages/Waiver';
import Schedule from '@/pages/Schedule';
import Analytics from '@/pages/Analytics';
import Managers from '@/pages/Managers';
import Settings from '@/pages/Settings';
import ThemeMatrix from '@/pages/ThemeMatrix';

function Router() {
  return (
    <DashboardShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/matchup" component={Matchup} />
        <Route path="/waiver" component={Waiver} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/managers" component={Managers} />
        <Route path="/settings" component={Settings} />
        <Route path="/__theme-matrix" component={ThemeMatrix} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </DashboardShell>
  );
}

// Cookie utilities for cross-subdomain persistence
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookieAcrossSubdomains(name: string, value: string, days = 30) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
    `Domain=manus.computer; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

function bootstrapOwnerId(): string | null {
  // 1) Check query param (useful for debug/sharing)
  const url = new URL(window.location.href);
  const qp = url.searchParams.get("owner_id");

  // 2) Check cookie (shared across subdomains)
  const ck = getCookie("owner_id");

  // 3) Check localStorage
  const ls = localStorage.getItem("owner_id");

  // Priority: localStorage > query param > cookie
  const final = ls || qp || ck;

  if (final) {
    // Persist to both localStorage and cookie
    localStorage.setItem("owner_id", final);
    setCookieAcrossSubdomains("owner_id", final);
    
    // Clean up query param to not leave it visible
    if (qp) {
      url.searchParams.delete("owner_id");
      window.history.replaceState({}, "", url.toString());
    }
  }

  return final;
}

function App() {
  // Bootstrap owner_id from localStorage, cookie, or query param
  const [ownerId, setOwnerId] = React.useState<string | null>(() => {
    return bootstrapOwnerId();
  });

  // Listen for storage changes (for cross-tab sync)
  React.useEffect(() => {
    const handleStorage = () => {
      setOwnerId(localStorage.getItem('owner_id') || null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <ErrorBoundary>
      <NextThemesProvider defaultTheme="dark" switchable>
        <ThemeProvider>
          <ContextProvider ownerId={ownerId}>
            <TooltipProvider>
              <Toaster />
              <ContextGate>
                <Router />
              </ContextGate>
            </TooltipProvider>
          </ContextProvider>
        </ThemeProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}

export default App;
