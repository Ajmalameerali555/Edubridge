import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, Crown, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  firstName: string;
  maskedId: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  gradeBracket?: "1-3" | "4-6" | "7-10";
}

const mockEntries: LeaderboardEntry[] = [
  { id: "1", firstName: "Alex", maskedId: "A***23", points: 2450, rank: 1 },
  { id: "2", firstName: "Maya", maskedId: "M***67", points: 2320, rank: 2 },
  { id: "3", firstName: "Jordan", maskedId: "J***89", points: 2180, rank: 3 },
  { id: "4", firstName: "Sam", maskedId: "S***45", points: 1950, rank: 4 },
  { id: "5", firstName: "Riley", maskedId: "R***12", points: 1820, rank: 5, isCurrentUser: true },
  { id: "6", firstName: "Casey", maskedId: "C***34", points: 1750, rank: 6 },
  { id: "7", firstName: "Morgan", maskedId: "M***56", points: 1680, rank: 7 },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Crown className="w-4 h-4 text-white" />
      </motion.div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
        <Award className="w-4 h-4 text-white" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
      <span className="text-sm font-bold text-muted-foreground">{rank}</span>
    </div>
  );
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const isTop3 = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        entry.isCurrentUser
          ? "bg-primary/10 border border-primary/20"
          : isTop3
          ? "bg-muted/50"
          : "hover-elevate"
      )}
      data-testid={`leaderboard-row-${entry.id}`}
    >
      <RankIcon rank={entry.rank} />

      <Avatar className="h-9 w-9">
        <AvatarFallback className={cn(
          entry.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {entry.firstName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate" data-testid={`text-name-${entry.id}`}>
            {entry.firstName}
          </p>
          <span className="text-xs text-muted-foreground" data-testid={`text-masked-id-${entry.id}`}>
            #{entry.maskedId}
          </span>
          {entry.isCurrentUser && (
            <Badge variant="secondary" className="text-xs">
              You
            </Badge>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold" data-testid={`text-points-${entry.id}`}>
          {entry.points.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">pts</p>
      </div>
    </motion.div>
  );
}

export function Leaderboard({
  entries = mockEntries,
  currentUserId,
  gradeBracket = "4-6",
}: LeaderboardProps) {
  const [selectedBracket, setSelectedBracket] = useState(gradeBracket);

  const processedEntries = entries.map((entry) => ({
    ...entry,
    isCurrentUser: entry.isCurrentUser || entry.id === currentUserId,
  }));

  return (
    <Card data-testid="card-leaderboard">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Weekly Leaderboard
          </CardTitle>
          <Badge variant="outline" data-testid="badge-week-info">
            This Week
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedBracket}
          onValueChange={(v) => setSelectedBracket(v as typeof selectedBracket)}
          className="space-y-4"
        >
          <TabsList className="w-full grid grid-cols-3" data-testid="tabs-grade-bracket">
            <TabsTrigger value="1-3" data-testid="tab-grade-1-3">
              Grade 1-3
            </TabsTrigger>
            <TabsTrigger value="4-6" data-testid="tab-grade-4-6">
              Grade 4-6
            </TabsTrigger>
            <TabsTrigger value="7-10" data-testid="tab-grade-7-10">
              Grade 7-10
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {["1-3", "4-6", "7-10"].map((bracket) => (
              <TabsContent key={bracket} value={bracket} className="space-y-2 mt-0">
                {processedEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No entries yet this week</p>
                  </div>
                ) : (
                  processedEntries.map((entry, index) => (
                    <LeaderboardRow key={entry.id} entry={entry} index={index} />
                  ))
                )}
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
}
