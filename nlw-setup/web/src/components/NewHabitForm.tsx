import { Check } from "@phosphor-icons/react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const evailableWeekdays = [
  { weekday: "Domingo", key: 0 },
  { weekday: "Segunda-feira", key: 1 },
  { weekday: "Terça-feira", key: 2 },
  { weekday: "Quarta-feira", key: 3 },
  { weekday: "Quinta-feira", key: 4 },
  { weekday: "Sexta-feira", key: 5 },
  { weekday: "Sábado", key: 6 },
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }

    await api.post("habits", {
      title,
      weekDays,
    });

    setTitle("");
    setWeekDays([]);

    alert("Criado com suceeso");
  }

  function handleToggleweekday(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithremovedOne = weekDays.filter((day) => day !== weekDay);
      setWeekDays(weekDaysWithremovedOne);
      return;
    }

    const weekDayWithAddwdOne = [...weekDays, weekDay];
    setWeekDays(weekDayWithAddwdOne);
  }
  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprotimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex: Eercícios , dormir bem, ectc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência
      </label>

      <div className="mt-3 flex flex-col gap-3">
        {evailableWeekdays.map(({ weekday, key }) => (
          <Checkbox.Root
            onCheckedChange={() => handleToggleweekday(key)}
            key={key}
            checked={weekDays.includes(key)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className=" text-white leading-tight">{weekday}</span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
