import { useCallback, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { Header } from "../components/Header";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Loading } from "../components/Loading";

const datesYearStart = generateRangeDatesFromYearStart();
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const minimumSummaryDatesSize = 18 * 4;
const amountOfDaysToFill = minimumSummaryDatesSize - datesYearStart.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
};

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSammary] = useState<Summary[]>([]);
  const { navigate } = useNavigation();

  async function fetctData() {
    try {
      setLoading(true);

      const response = await api.get("/summary");
      setSammary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar os dados!");
      if (error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetctData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            key={`${weekDay + i}`}
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() => navigate("habit", { date: date.toString() })}
                  key={date.toISOString()}
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
