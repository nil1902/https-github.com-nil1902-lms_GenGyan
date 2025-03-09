import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Session {
  id: string;
  title: string;
  trainer: {
    name: string;
    avatar: string;
  };
  date: string;
  time: string;
}

interface UpcomingSessionsCardProps {
  sessions: Session[];
  onJoinSession?: (sessionId: string) => void;
  onViewAllSessions?: () => void;
}

export function UpcomingSessionsCard({
  sessions = [
    {
      id: "1",
      title: "Introduction to Python Programming",
      trainer: {
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      date: "Today",
      time: "2:00 PM - 3:30 PM",
    },
    {
      id: "2",
      title: "Data Visualization Techniques",
      trainer: {
        name: "Maria Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      date: "Tomorrow",
      time: "10:00 AM - 11:30 AM",
    },
  ],
  onJoinSession = () => {},
  onViewAllSessions = () => {},
}: UpcomingSessionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Sessions
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAllSessions}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={session.trainer.avatar} />
                    <AvatarFallback>
                      {session.trainer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {session.trainer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.date} • {session.time}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onJoinSession(session.id)}
                >
                  Join
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No upcoming sessions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
