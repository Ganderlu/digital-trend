"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/app/site-header";
import { SiteFooter } from "@/app/site-footer";
import { ThemeProvider } from "@/components/theme-provider";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/deposit",
  "/withdraw",
  "/trade",
  "/matrix-plan",
  "/investment-plans",
  "/plans",
  "/account-history",
  "/referrals",
  "/account-settings",
  "/security-settings",
  "/admin",
];

function isDashboardRoute(pathname: string) {
  return DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = isDashboardRoute(pathname ?? "");
  const isLandingPage = !isDashboard;

  return (
    <ThemeProvider isLandingPage={isLandingPage}>
      <div className="flex min-h-screen flex-col">
        {!isDashboard && <SiteHeader />}
        <div className="flex-1">{children}</div>
        {!isDashboard && <SiteFooter />}
      </div>
    </ThemeProvider>
  );
}
