import { useState } from "react";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  booked: boolean;
}

interface ScheduleCalendarProps {
  trainer: {
    id: string;
    name: string;
    avatar: string;
    specialization: string;
  };
  availableSlots: Record<string, TimeSlot[]>;
  onBookSlot?: (date: Date, slotId: string) => void;
}

export function ScheduleCalendar({
  trainer = {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    specialization: "Data Science Expert",
  },
  availableSlots = {
    "2023-06-15": [
      { id: "1", startTime: "09:00 AM", endTime: "10:00 AM", booked: false },
      { id: "2", startTime: "11:00 AM", endTime: "12:00 PM", booked: true },
      { id: "3", startTime: "02:00 PM", endTime: "03:00 PM", booked: false },
    ],
    "2023-06-16": [
      { id: "4", startTime: "10:00 AM", endTime: "11:00 AM", booked: false },
      { id: "5", startTime: "01:00 PM", endTime: "02:00 PM", booked: false },
    ],
  },
  onBookSlot = () => {},
}: ScheduleCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Format the date as YYYY-MM-DD for lookup in availableSlots
  const formattedDate = date ? date.toISOString().split("T")[0] : "";
  const slotsForSelectedDate = availableSlots[formattedDate] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={trainer.avatar} alt={trainer.name} />
              <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{trainer.name}</CardTitle>
              <CardDescription>{trainer.specialization}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
          <CardDescription>
            {date
              ? date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Select a date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slotsForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slotsForSelectedDate.map((slot) => (
                <Button
                  key={slot.id}
                  variant={slot.booked ? "outline" : "default"}
                  className={`justify-start h-auto py-3 ${slot.booked ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={slot.booked}
                  onClick={() => date && onBookSlot(date, slot.id)}
                >
                  <div className="text-left">
                    <p className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slot.booked ? "Already Booked" : "Available"}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No available slots for the selected date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
