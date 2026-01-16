import * as React from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/datastore";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RouteGuard({ children, allowedRoles, redirectTo = "/" }: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to={redirectTo} />;
  }

  if (!allowedRoles.includes(user.role)) {
    const correctPath = getCorrectPathForRole(user.role);
    if (location !== correctPath) {
      return <Redirect to={correctPath} />;
    }
    return <Redirect to={redirectTo} />;
  }

  return <>{children}</>;
}

function getCorrectPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "tutor":
      return "/tutor";
    case "parent":
      return "/parent";
    case "student":
    default:
      return "/dashboard";
  }
}
