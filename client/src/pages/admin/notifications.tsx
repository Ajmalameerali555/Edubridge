import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getNotificationsByRole,
  markNotificationAsRead,
  Notification,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function AdminNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const refreshNotifications = () => {
    setNotifications(getNotificationsByRole("admin"));
  };

  React.useEffect(() => {
    refreshNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    refreshNotifications();
    toast({ title: "Marked as read" });
  };

  const handleMarkAllAsRead = () => {
    notifications.filter((n) => !n.read).forEach((n) => markNotificationAsRead(n.id));
    refreshNotifications();
    toast({ title: "All notifications marked as read" });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "session_live":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "policy_block":
        return <Shield className="w-5 h-5 text-orange-600" />;
      case "incident_logged":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "questionnaire_new":
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "session_live":
        return "Session Live";
      case "policy_block":
        return "Policy Block";
      case "incident_logged":
        return "Incident Logged";
      case "questionnaire_new":
        return "New Questionnaire";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const getTypeDescription = (notification: Notification) => {
    const payload = notification.payload;
    switch (notification.type) {
      case "session_live":
        return `Session with ${payload.studentName || "student"} is now live`;
      case "policy_block":
        return "A message was blocked due to policy violation";
      case "incident_logged":
        return `New incident logged: ${(payload.issues as string[])?.join(", ") || "Check details"}`;
      case "questionnaire_new":
        return "A new questionnaire has been submitted";
      default:
        return "Notification received";
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead} data-testid="button-mark-all-read">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-colors ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                  data-testid={`row-notification-${notification.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          !notification.read ? "bg-primary/10" : "bg-muted"
                        }`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{getTypeLabel(notification.type)}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getTypeDescription(notification)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={notification.read ? "secondary" : "default"}>
                          {notification.read ? "Read" : "Unread"}
                        </Badge>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            data-testid={`button-mark-read-${notification.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
