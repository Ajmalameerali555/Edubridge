import { useMemo } from "react";
import { Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import { AIAssistant } from "@/components/portal/AIAssistant";
import {
  getSessionsByStudentId,
  getHomeworkByStudentId,
  getNotesByStudentId,
  getUserById,
  Session,
  Homework,
  Note,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Video,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Brain,
  BookMarked,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { format, isWithinInterval, addMinutes, isFuture, isPast, parseISO } from "date-fns";

function SignalBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground capitalize">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className={`h-2 ${color}`} />
    </div>
  );
}

export default function StudentDashboard() {
  const { user, student } = useAuth();

  const { sessions, homework, notes, tutorName, upcomingEvents, nextAction, todayItems } = useMemo(() => {
    if (!student) {
      return {
        sessions: [],
        homework: [],
        notes: [],
        tutorName: "",
        upcomingEvents: [],
        nextAction: { type: "sprint" as const, data: null },
        todayItems: [],
      };
    }

    const allSessions = getSessionsByStudentId(student.id);
    const allHomework = getHomeworkByStudentId(student.id);
    const allNotes = getNotesByStudentId(student.id);

    const now = new Date();
    const in60Minutes = addMinutes(now, 60);

    const upcomingSessions = allSessions
      .filter((s) => s.status === "upcoming" && isFuture(parseISO(s.startAt)))
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());

    const sessionWithin60 = upcomingSessions.find((s) =>
      isWithinInterval(parseISO(s.startAt), { start: now, end: in60Minutes })
    );

    const pendingHomework = allHomework
      .filter((h) => h.status === "assigned" && isFuture(parseISO(h.dueAt)))
      .sort((a, b) => parseISO(a.dueAt).getTime() - parseISO(b.dueAt).getTime());

    const homeworkDueSoon = pendingHomework[0];

    let nextActionResult: { type: "session" | "homework" | "sprint"; data: Session | Homework | null };
    if (sessionWithin60) {
      nextActionResult = { type: "session", data: sessionWithin60 };
    } else if (homeworkDueSoon) {
      nextActionResult = { type: "homework", data: homeworkDueSoon };
    } else {
      nextActionResult = { type: "sprint", data: null };
    }

    const events: Array<{ type: "session" | "homework"; date: Date; title: string; data: Session | Homework }> = [];

    upcomingSessions.slice(0, 5).forEach((s) => {
      events.push({
        type: "session",
        date: parseISO(s.startAt),
        title: `${s.subject} Session`,
        data: s,
      });
    });

    pendingHomework.slice(0, 5).forEach((h) => {
      events.push({
        type: "homework",
        date: parseISO(h.dueAt),
        title: `${h.title} Due`,
        data: h,
      });
    });

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    const latestNote = allNotes.sort(
      (a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    )[0];

    const todayBoard = [];
    todayBoard.push({ type: "sprint", title: "Daily Sprint", subtitle: "Practice your skills" });
    if (pendingHomework[0]) {
      todayBoard.push({
        type: "homework",
        title: pendingHomework[0].title,
        subtitle: `Due ${format(parseISO(pendingHomework[0].dueAt), "MMM d")}`,
      });
    }
    if (latestNote) {
      todayBoard.push({
        type: "note",
        title: "Tutor Note",
        subtitle: latestNote.nextFocus || latestNote.coveredTopic,
      });
    }

    let tutorNameStr = "";
    if (allSessions.length > 0) {
      const firstSession = allSessions[0];
      const tutorUser = getUserById(firstSession.tutorId.replace("tutor", "user_tutor"));
      if (tutorUser) {
        tutorNameStr = `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim();
      }
    }

    return {
      sessions: allSessions,
      homework: allHomework,
      notes: allNotes,
      tutorName: tutorNameStr,
      upcomingEvents: events.slice(0, 3),
      nextAction: nextActionResult,
      todayItems: todayBoard.slice(0, 3),
    };
  }, [student]);

  const signals = student?.signals || { confidence: 70, memory: 70, language: 70, foundation: 70 };

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-welcome">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground">Ready to learn today?</p>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Your next action</p>
                  {nextAction.type === "session" && nextAction.data && (
                    <>
                      <h2 className="text-xl font-semibold">Join your {(nextAction.data as Session).subject} session</h2>
                      <p className="text-sm text-muted-foreground">
                        Starting {format(parseISO((nextAction.data as Session).startAt), "h:mm a")}
                      </p>
                    </>
                  )}
                  {nextAction.type === "homework" && nextAction.data && (
                    <>
                      <h2 className="text-xl font-semibold">Complete your homework</h2>
                      <p className="text-sm text-muted-foreground">
                        {(nextAction.data as Homework).title} due {format(parseISO((nextAction.data as Homework).dueAt), "MMM d")}
                      </p>
                    </>
                  )}
                  {nextAction.type === "sprint" && (
                    <>
                      <h2 className="text-xl font-semibold">Start your daily sprint</h2>
                      <p className="text-sm text-muted-foreground">Quick practice to keep your skills sharp</p>
                    </>
                  )}
                </div>
                <div>
                  {nextAction.type === "session" && nextAction.data && (
                    <Button
                      size="lg"
                      onClick={() => window.open((nextAction.data as Session).meetLink, "_blank")}
                      data-testid="button-join-session"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  )}
                  {nextAction.type === "homework" && (
                    <Link href="/dashboard/homework">
                      <Button size="lg" data-testid="button-start-homework">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Homework
                      </Button>
                    </Link>
                  )}
                  {nextAction.type === "sprint" && (
                    <Link href="/dashboard/sprint">
                      <Button size="lg" data-testid="button-start-sprint">
                        <Zap className="w-4 h-4 mr-2" />
                        Start Sprint
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Learning Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <SignalBar label="Confidence" value={signals.confidence} color="[&>div]:bg-green-500" />
                  <SignalBar label="Memory" value={signals.memory} color="[&>div]:bg-blue-500" />
                  <SignalBar label="Language" value={signals.language} color="[&>div]:bg-purple-500" />
                  <SignalBar label="Foundation" value={signals.foundation} color="[&>div]:bg-orange-500" />
                </div>
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  {student?.track && (
                    <Badge variant="secondary" data-testid="badge-track">
                      {student.track}
                    </Badge>
                  )}
                  {student?.blockers?.map((blocker) => (
                    <Badge key={blocker} variant="outline" className="border-amber-500 text-amber-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {blocker}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer"
                      data-testid={`today-item-${i}`}
                    >
                      {item.type === "sprint" && <Zap className="w-5 h-5 text-primary shrink-0" />}
                      {item.type === "homework" && <BookOpen className="w-5 h-5 text-primary shrink-0" />}
                      {item.type === "note" && <MessageSquare className="w-5 h-5 text-primary shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg border hover-elevate"
                      data-testid={`timeline-event-${i}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {event.type === "session" ? (
                          <Video className="w-5 h-5 text-primary" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{format(event.date, "EEE, MMM d 'at' h:mm a")}</span>
                        </div>
                      </div>
                      {event.type === "session" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open((event.data as Session).meetLink, "_blank")}
                          data-testid={`button-join-${i}`}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <AIAssistant role="student" context={{ studentName: user?.firstName, grade: student?.grade }} />
      </PortalLayout>
    </RouteGuard>
  );
}
