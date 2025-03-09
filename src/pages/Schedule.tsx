import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TrainerCard } from "@/components/scheduling/TrainerCard";
import { ScheduleCalendar } from "@/components/scheduling/ScheduleCalendar";
import { BookingConfirmation } from "@/components/scheduling/BookingConfirmation";

export default function Schedule() {
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [bookingStage, setBookingStage] = useState<
    "trainers" | "calendar" | "confirmation"
  >("trainers");
  const [bookingDetails, setBookingDetails] = useState({
    trainer: {
      name: "",
      specialization: "",
    },
    date: "",
    startTime: "",
    endTime: "",
  });
  const [notes, setNotes] = useState("");

  const trainers = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "Data Science Expert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
      bio: "Dr. Johnson has over 10 years of experience in data science and machine learning. She specializes in helping students understand complex concepts through practical examples.",
    },
    {
      id: "2",
      name: "Michael Chen",
      specialization: "Web Development Instructor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 4.8,
      bio: "Michael is a senior web developer with expertise in React, Node.js, and modern JavaScript frameworks. He focuses on teaching practical, industry-relevant skills.",
    },
    {
      id: "3",
      name: "Emma Williams",
      specialization: "Business Communication Coach",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 4.7,
      bio: "Emma has helped hundreds of professionals improve their communication skills. Her sessions focus on practical techniques for effective business communication.",
    },
  ];

  const availableSlots = {
    "2023-06-15": [
      { id: "1", startTime: "09:00 AM", endTime: "10:00 AM", booked: false },
      { id: "2", startTime: "11:00 AM", endTime: "12:00 PM", booked: true },
      { id: "3", startTime: "02:00 PM", endTime: "03:00 PM", booked: false },
    ],
    "2023-06-16": [
      { id: "4", startTime: "10:00 AM", endTime: "11:00 AM", booked: false },
      { id: "5", startTime: "01:00 PM", endTime: "02:00 PM", booked: false },
    ],
  };

  const handleBookSession = (trainerId: string) => {
    const trainer = trainers.find((t) => t.id === trainerId);
    if (trainer) {
      setSelectedTrainer(trainerId);
      setBookingStage("calendar");
    }
  };

  const handleBookSlot = (date: Date, slotId: string) => {
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedDate = date.toISOString().split("T")[0];
    const slot = availableSlots[formattedDate]?.find((s) => s.id === slotId);

    if (slot && selectedTrainer) {
      const trainer = trainers.find((t) => t.id === selectedTrainer);

      setBookingDetails({
        trainer: {
          name: trainer?.name || "",
          specialization: trainer?.specialization || "",
        },
        date: dateString,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      setBookingStage("confirmation");
    }
  };

  const handleConfirmBooking = () => {
    // In a real app, you would send the booking data to your backend
    alert("Booking confirmed! You will receive a confirmation email shortly.");
    setBookingStage("trainers");
    setSelectedTrainer(null);
    setNotes("");
  };

  const handleCancelBooking = () => {
    setBookingStage("calendar");
  };

  const renderContent = () => {
    switch (bookingStage) {
      case "trainers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onBookSession={handleBookSession}
              />
            ))}
          </div>
        );
      case "calendar":
        if (selectedTrainer) {
          const trainer = trainers.find((t) => t.id === selectedTrainer);
          if (trainer) {
            return (
              <div>
                <button
                  onClick={() => setBookingStage("trainers")}
                  className="mb-6 text-sm text-primary hover:underline flex items-center"
                >
                  ← Back to trainers
                </button>
                <ScheduleCalendar
                  trainer={{
                    id: trainer.id,
                    name: trainer.name,
                    avatar: trainer.avatar,
                    specialization: trainer.specialization,
                  }}
                  availableSlots={availableSlots}
                  onBookSlot={handleBookSlot}
                />
              </div>
            );
          }
        }
        return null;
      case "confirmation":
        return (
          <div>
            <button
              onClick={() => setBookingStage("calendar")}
              className="mb-6 text-sm text-primary hover:underline flex items-center"
            >
              ← Back to calendar
            </button>
            <BookingConfirmation
              booking={bookingDetails}
              notes={notes}
              onNotesChange={setNotes}
              onConfirm={handleConfirmBooking}
              onCancel={handleCancelBooking}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule a Session</h1>
          <p className="text-muted-foreground mt-2">
            Book one-on-one sessions with our expert trainers to accelerate your
            learning
          </p>
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
}
