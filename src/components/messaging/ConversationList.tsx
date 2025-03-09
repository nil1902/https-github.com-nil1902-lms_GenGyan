import { Edit, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "offline";
  };
  lastMessage: {
    content: string;
    timestamp: string;
    unread: boolean;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation?: (conversationId: string) => void;
  onSearch?: (query: string) => void;
}

export function ConversationList({
  conversations = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        status: "online" as const,
      },
      lastMessage: {
        content:
          "Let me explain it in more detail. The key thing to remember is...",
        timestamp: "10:35 AM",
        unread: false,
      },
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Michael Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        status: "offline" as const,
      },
      lastMessage: {
        content: "When is the next assignment due?",
        timestamp: "Yesterday",
        unread: true,
      },
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "Sarah Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        status: "online" as const,
      },
      lastMessage: {
        content: "Thanks for your help with the project!",
        timestamp: "2 days ago",
        unread: false,
      },
    },
  ],
  selectedConversationId,
  onSelectConversation = () => {},
  onSearch = () => {},
}: ConversationListProps) {
  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Messages</h2>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="px-4 pt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversationId === conversation.id ? "bg-muted" : ""}`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                  />
                  <AvatarFallback>
                    {conversation.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conversation.user.status === "online" && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-medium truncate ${conversation.lastMessage.unread ? "font-semibold" : ""}`}
                  >
                    {conversation.user.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {conversation.lastMessage.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-sm truncate ${conversation.lastMessage.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {conversation.lastMessage.content}
                  </p>
                  {conversation.lastMessage.unread && (
                    <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0">
                      1
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
