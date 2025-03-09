import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

interface CourseFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string, value: string) => void;
  onReset?: () => void;
}

export function CourseFilters({
  onSearch = () => {},
  onFilterChange = () => {},
  onReset = () => {},
}: CourseFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => onFilterChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="data-science">Data Science</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange("level", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange("duration", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Duration</SelectItem>
            <SelectItem value="short">Less than 3 hours</SelectItem>
            <SelectItem value="medium">3-6 hours</SelectItem>
            <SelectItem value="long">More than 6 hours</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange("rating", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Rating</SelectItem>
            <SelectItem value="4plus">4.0 & above</SelectItem>
            <SelectItem value="3plus">3.0 & above</SelectItem>
            <SelectItem value="2plus">2.0 & above</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onReset} className="md:col-start-4">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
