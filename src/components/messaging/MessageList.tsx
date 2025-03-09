import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Paperclip, Send, Smile } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface MessageListProps {
  currentUser: User;
  recipient: User;
  messages: Message[];
  onSendMessage?: (content: string) => void;
}

export function MessageList({
  currentUser = {
    id: "user1",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  recipient = {
    id: "user2",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  messages = [
    {
      id: "1",
      senderId: "user2",
      content: "Hello! How can I help you with the course material?",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: "2",
      senderId: "user1",
      content: "I'm having trouble understanding the concept in module 3.",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: "3",
      senderId: "user2",
      content:
        "Let me explain it in more detail. The key thing to remember is...",
      timestamp: "10:35 AM",
      read: true,
    },
  ],
  onSendMessage = () => {},
}: MessageListProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-4 border-b sticky top-0 bg-background z-10">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={recipient.avatar} alt={recipient.name} />
          <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{recipient.name}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start max-w-[80%]">
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp} {isCurrentUser && message.read && "✓✓"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-full"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} size="icon" className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
