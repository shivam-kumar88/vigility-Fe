import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
}

export function FilterBar({
  dateRange,
  setDateRange,
  age,
  setAge,
  gender,
  setGender,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      
      {/* date Range Picker */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-gray-700">Date Range</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover> 
      </div>

      
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-gray-700">Age</label>
        <Select value={age} onValueChange={setAge}>
          <SelectTrigger>
            <SelectValue placeholder="Select Age Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="<18">Under 18</SelectItem>
            <SelectItem value="18-40">18 - 40</SelectItem>
            <SelectItem value=">40">Over 40</SelectItem>
          </SelectContent>
        </Select>
      </div>

      
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-gray-700">Gender</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}