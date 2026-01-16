import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "@/pages/landing";
import StaffLogin from "@/pages/staff-login";
import NotFound from "@/pages/not-found";

import AdminPortal from "@/pages/admin/index";
import AdminInbox from "@/pages/admin/inbox";
import AdminStudents from "@/pages/admin/students";
import AdminTutors from "@/pages/admin/tutors";
import AdminMatching from "@/pages/admin/matching";
import AdminSessions from "@/pages/admin/sessions";
import AdminIncidents from "@/pages/admin/incidents";
import AdminNotifications from "@/pages/admin/notifications";
import AdminSettings from "@/pages/admin/settings";
import AdminHiring from "@/pages/admin/hiring";

import TutorPortal from "@/pages/tutor/index";
import TutorStudents from "@/pages/tutor/students";
import TutorStudentProfile from "@/pages/tutor/student-profile";
import TutorSessions from "@/pages/tutor/sessions";
import TutorHomework from "@/pages/tutor/homework";
import TutorMessages from "@/pages/tutor/messages";

import StudentDashboard from "@/pages/student/index";
import StudentSprint from "@/pages/student/sprint";
import StudentSessions from "@/pages/student/sessions";
import StudentHomework from "@/pages/student/homework";
import StudentReports from "@/pages/student/reports";
import StudentMessages from "@/pages/student/messages";
import StudentGames from "@/pages/student/games";

import ParentPortal from "@/pages/parent/index";
import ParentChild from "@/pages/parent/child";
import ParentSessions from "@/pages/parent/sessions";
import ParentReports from "@/pages/parent/reports";
import ParentMessages from "@/pages/parent/messages";

import CareersHub from "@/pages/careers/index";
import TutorRecruitment from "@/pages/careers/tutors";
import TutorApply from "@/pages/careers/apply";
import TeamCareers from "@/pages/careers/team";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/staff-login" component={StaffLogin} />
      <Route path="/dashboard" component={StudentDashboard} />
      <Route path="/student" component={StudentDashboard} />
      
      <Route path="/admin" component={AdminPortal} />
      <Route path="/admin/inbox" component={AdminInbox} />
      <Route path="/admin/students" component={AdminStudents} />
      <Route path="/admin/tutors" component={AdminTutors} />
      <Route path="/admin/matching" component={AdminMatching} />
      <Route path="/admin/sessions" component={AdminSessions} />
      <Route path="/admin/incidents" component={AdminIncidents} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/hiring" component={AdminHiring} />

      <Route path="/tutor" component={TutorPortal} />
      <Route path="/tutor/students" component={TutorStudents} />
      <Route path="/tutor/students/:id" component={TutorStudentProfile} />
      <Route path="/tutor/sessions" component={TutorSessions} />
      <Route path="/tutor/homework" component={TutorHomework} />
      <Route path="/tutor/messages" component={TutorMessages} />

      <Route path="/dashboard/sprint" component={StudentSprint} />
      <Route path="/dashboard/sessions" component={StudentSessions} />
      <Route path="/dashboard/homework" component={StudentHomework} />
      <Route path="/dashboard/reports" component={StudentReports} />
      <Route path="/dashboard/messages" component={StudentMessages} />

      <Route path="/student/sprint" component={StudentSprint} />
      <Route path="/student/sessions" component={StudentSessions} />
      <Route path="/student/homework" component={StudentHomework} />
      <Route path="/student/reports" component={StudentReports} />
      <Route path="/student/messages" component={StudentMessages} />
      <Route path="/student/games" component={StudentGames} />
      <Route path="/dashboard/games" component={StudentGames} />

      <Route path="/parent" component={ParentPortal} />
      <Route path="/parent/child" component={ParentChild} />
      <Route path="/parent/sessions" component={ParentSessions} />
      <Route path="/parent/reports" component={ParentReports} />
      <Route path="/parent/messages" component={ParentMessages} />

      <Route path="/careers" component={CareersHub} />
      <Route path="/careers/tutors" component={TutorRecruitment} />
      <Route path="/careers/tutors/apply" component={TutorApply} />
      <Route path="/careers/team" component={TeamCareers} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
