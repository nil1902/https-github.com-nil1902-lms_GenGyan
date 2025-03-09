import { Check, Calendar, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface BookingConfirmationProps {
  booking: {
    trainer: {
      name: string;
      specialization: string;
    };
    date: string;
    startTime: string;
    endTime: string;
  };
  notes: string;
  onNotesChange?: (notes: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function BookingConfirmation({
  booking = {
    trainer: {
      name: "Dr. Sarah Johnson",
      specialization: "Data Science Expert",
    },
    date: "June 15, 2023",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  },
  notes = "",
  onNotesChange = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}: BookingConfirmationProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Confirm Your Booking</CardTitle>
        <CardDescription>
          Please review the details before confirming
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start">
            <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">{booking.trainer.name}</p>
              <p className="text-sm text-muted-foreground">
                {booking.trainer.specialization}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
            <p>{booking.date}</p>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
            <p>
              {booking.startTime} - {booking.endTime}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium mb-2">
            Notes for the trainer (optional)
          </label>
          <Textarea
            placeholder="Add any specific topics or questions you'd like to discuss..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={onConfirm}>
          <Check className="mr-2 h-4 w-4" /> Confirm Booking
        </Button>
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
