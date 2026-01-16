import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import { AIAssistant } from "@/components/portal/AIAssistant";
import GamesHub from "@/components/games/GamesHub";
import { useToast } from "@/hooks/use-toast";

export default function StudentGames() {
  const { user, student } = useAuth();
  const { toast } = useToast();
  const grade = student?.grade || "5";

  const handlePointsEarned = async (points: number, gameName: string) => {
    toast({
      title: "Points Earned!",
      description: `You earned ${points} points from ${gameName}!`,
    });

    try {
      await fetch("/api/games/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: gameName.toLowerCase().replace(/\s+/g, "-"),
          score: points * 10,
          accuracy: Math.min(100, points * 5),
          duration: 120,
          grade,
          studentId: student?.id,
        }),
      });
    } catch (error) {
      console.error("Failed to record game:", error);
    }
  };

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-games-title">
              Games & Challenges
            </h1>
            <p className="text-muted-foreground">
              Play educational games to earn points and climb the leaderboard!
            </p>
          </div>
          <GamesHub grade={grade} onPointsEarned={handlePointsEarned} />
        </div>
        <AIAssistant role="student" context={{ studentName: user?.firstName, grade }} />
      </PortalLayout>
    </RouteGuard>
  );
}
