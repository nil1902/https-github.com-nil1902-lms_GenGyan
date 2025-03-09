import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

interface TrainerCardProps {
  trainer: {
    id: string;
    name: string;
    specialization: string;
    avatar: string;
    rating: number;
    bio?: string;
  };
  onViewProfile?: (trainerId: string) => void;
  onBookSession?: (trainerId: string) => void;
}

export function TrainerCard({
  trainer,
  onViewProfile = () => {},
  onBookSession = () => {},
}: TrainerCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardContent className="pt-6 px-6 flex-1">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={trainer.avatar} alt={trainer.name} />
            <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{trainer.name}</h3>
          <p className="text-sm text-muted-foreground">
            {trainer.specialization}
          </p>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(trainer.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm">{trainer.rating.toFixed(1)}</span>
          </div>
        </div>

        {trainer.bio && (
          <p className="text-sm text-muted-foreground mb-4">{trainer.bio}</p>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex space-x-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewProfile(trainer.id)}
        >
          View Profile
        </Button>
        <Button className="flex-1" onClick={() => onBookSession(trainer.id)}>
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
}
