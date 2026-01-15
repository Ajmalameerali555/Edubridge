import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, User, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/me"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (error) {
      setLocation("/");
    }
  }, [error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto" />
          <p className="mt-4 text-brand-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  const user = data.user;

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-brand-blue">EDUBRIDGE</h1>
              <p className="text-xs font-semibold text-brand-muted tracking-wider">LEARNING</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-brand-ink">Welcome, {user.parentName}!</h2>
          <p className="text-brand-muted mt-1">Your assessment has been submitted successfully.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-blue" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-brand-muted">Student Name</p>
                <p className="font-semibold text-brand-ink">{user.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">Grade</p>
                <p className="font-semibold text-brand-ink">Grade {user.grade}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">Contact Email</p>
                <p className="font-semibold text-brand-ink">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">Mobile</p>
                <p className="font-semibold text-brand-ink">{user.mobile}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-mint" />
                Assessment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-semibold text-amber-800">Under Review</p>
                <p className="text-sm text-amber-700 mt-1">
                  Our academic advisors are reviewing your assessment. You will receive a detailed learning plan within 24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
