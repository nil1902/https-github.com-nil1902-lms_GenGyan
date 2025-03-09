import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList } from "@/components/messaging/ConversationList";
import { MessageList } from "@/components/messaging/MessageList";

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState("1");

  const conversations = [
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
  ];

  const currentUser = {
    id: "current",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const messages = [
    {
      id: "1",
      senderId: selectedConversation?.user.id || "",
      content: "Hello! How can I help you with the course material?",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: "2",
      senderId: currentUser.id,
      content: "I'm having trouble understanding the concept in module 3.",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: "3",
      senderId: selectedConversation?.user.id || "",
      content:
        "Let me explain it in more detail. The key thing to remember is that machine learning models learn from patterns in data. In module 3, we're focusing on how these patterns are identified and used for predictions.",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: "4",
      senderId: currentUser.id,
      content:
        "That makes more sense now. Could you recommend any additional resources to help me understand this better?",
      timestamp: "10:38 AM",
      read: true,
    },
    {
      id: "5",
      senderId: selectedConversation?.user.id || "",
      content:
        "Absolutely! I'd recommend checking out the supplementary readings in the course library. There's also a great video tutorial in the resources section that breaks down these concepts visually.",
      timestamp: "10:42 AM",
      read: true,
    },
  ];

  return (
    <MainLayout>
      <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 border-r">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="w-full md:w-2/3 h-[60vh] md:h-auto">
          {selectedConversation ? (
            <MessageList
              currentUser={currentUser}
              recipient={selectedConversation.user}
              messages={messages}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
