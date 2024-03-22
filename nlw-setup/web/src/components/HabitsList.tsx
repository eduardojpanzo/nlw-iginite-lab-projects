import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import dayjs from "dayjs";

type HabitsListProp = {
  date: Date;
  onCompletedChange: (completed: number) => void;
};

type HabitInfo = {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completeHabits: string[];
};

export function HabitsList({ date, onCompletedChange }: HabitsListProp) {
  const [habitInfo, setHabitInfo] = useState<HabitInfo>();
  useEffect(() => {
    api
      .get("/day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((resp) => {
        setHabitInfo(resp.data);
      });
  }, []);

  const handleToggleHabit = async (habitId: string) => {
    await api.patch(`/habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted = habitInfo?.completeHabits.includes(habitId);

    let completeHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completeHabits = habitInfo!.completeHabits.filter((id) => id !== habitId);
    } else {
      completeHabits = [...habitInfo!.completeHabits, habitId];
    }

    setHabitInfo({
      possibleHabits: habitInfo!.possibleHabits,
      completeHabits,
    });

    onCompletedChange(completeHabits.length);
  };

  const isDateInPaste = dayjs(date).endOf("day").isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitInfo?.possibleHabits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          className="flex items-center gap-3 group focus:outline-none"
          checked={habitInfo.completeHabits.includes(habit.id)}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          disabled={isDateInPaste}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background">
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>
          <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
