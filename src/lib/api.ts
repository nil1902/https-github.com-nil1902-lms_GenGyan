import { supabase } from "./supabase";
import type {
  Course,
  Notification,
  Message,
  Trainer,
  TimeSlot,
  Booking,
  Certificate,
} from "@/types";

// User related functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
  return data;
}

// Course related functions
export async function getCourses(filters = {}) {
  let query = supabase.from("courses").select(`
    *,
    users!instructor_id(name)
  `);

  // Apply filters if any
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      if (key === "level") {
        query = query.eq("level", value);
      } else if (key === "category") {
        query = query.eq("category", value);
      }
    }
  });

  const { data, error } = await query;
  if (error) throw error;

  return data.map((course) => ({
    ...course,
    instructor: course.users.name,
  }));
}

export async function getCourseDetails(courseId: string) {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      users!instructor_id(name),
      course_modules(*, lessons(*), quizzes(*))
    `,
    )
    .eq("id", courseId)
    .single();

  if (error) throw error;

  return {
    ...data,
    instructor: data.users.name,
    modules: data.course_modules,
  };
}

export async function enrollInCourse(userId: string, courseId: string) {
  const { data, error } = await supabase.from("enrollments").insert({
    user_id: userId,
    course_id: courseId,
    progress: 0,
    last_accessed: new Date().toISOString(),
    completed: false,
  });

  if (error) throw error;
  return data;
}

export async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses(*)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  completed: boolean,
  timeSpent: number,
) {
  const { data, error } = await supabase.from("lesson_progress").upsert({
    user_id: userId,
    lesson_id: lessonId,
    completed,
    time_spent: timeSpent,
  });

  if (error) throw error;
  return data;
}

// Notification related functions
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) throw error;
  return data;
}

// Messaging related functions
export async function getUserConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      *,
      messages!last_message_id(*),
      users!user1_id(*),
      users!user2_id(*)
    `,
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) throw error;

  return data.map((conversation) => {
    const otherUser =
      conversation.user1_id === userId
        ? conversation.users.user2_id
        : conversation.users.user1_id;

    return {
      id: conversation.id,
      user: otherUser,
      lastMessage: conversation.messages,
    };
  });
}

export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
) {
  // First check if conversation exists
  const { data: existingConversation } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`,
    );

  let conversationId;

  if (existingConversation && existingConversation.length > 0) {
    conversationId = existingConversation[0].id;
  } else {
    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        user1_id: senderId,
        user2_id: receiverId,
      })
      .select();

    if (error) throw error;
    conversationId = newConversation[0].id;
  }

  // Send message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
    })
    .select();

  if (error) throw error;

  // Update conversation with last message
  await supabase
    .from("conversations")
    .update({ last_message_id: message[0].id })
    .eq("id", conversationId);

  return message[0];
}

// Trainer and scheduling related functions
export async function getTrainers() {
  const { data, error } = await supabase.from("trainers").select(`
      *,
      users!user_id(*)
    `);

  if (error) throw error;

  return data.map((trainer) => ({
    ...trainer,
    name: trainer.users.name,
    avatar: trainer.users.avatar_url,
  }));
}

export async function getTrainerAvailability(trainerId: string) {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .eq("trainer_id", trainerId);

  if (error) throw error;

  // Group by date
  const availabilityByDate: Record<string, TimeSlot[]> = {};
  data.forEach((slot) => {
    if (!availabilityByDate[slot.date]) {
      availabilityByDate[slot.date] = [];
    }
    availabilityByDate[slot.date].push({
      id: slot.id,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      booked: slot.booked,
    });
  });

  return availabilityByDate;
}

export async function bookSession(
  userId: string,
  trainerId: string,
  timeSlotId: string,
  notes?: string,
) {
  // Start a transaction
  const { data, error } = await supabase.rpc("book_session", {
    p_user_id: userId,
    p_trainer_id: trainerId,
    p_time_slot_id: timeSlotId,
    p_notes: notes || "",
  });

  if (error) throw error;
  return data;
}

// Analytics and dashboard related functions
export async function getUserInsights(userId: string) {
  const { data, error } = await supabase.rpc("get_user_insights", {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function getAdminAnalytics(organizationId?: string) {
  let query = supabase.rpc("get_admin_analytics");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
