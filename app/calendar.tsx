import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { months, weekDays } from "../constants/Calendar";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";

const Calendario = () => {
  const today = new Date();
  const { userId } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const monthName = months[currentMonth];

  useFocusEffect(
    useCallback(() => {
      const fetchWorkoutSessions = async () => {
        if (!userId) return;

        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          Promise.allSettled([
            api.get(`/workout/session/all/${userId}`, {
              headers: { "X-Silent": "true" },
            }),
            api.get(`/users/workout-streak/${userId}`, {
              headers: { "X-Silent": "true" },
              params: { timezone },
            }),
          ]).then((response) => {
            if (response[0].status === "fulfilled") {
              setWorkoutSessions(response[0].value.data?.data || []);
            } else {
              setWorkoutSessions([]);
            }
            if (response[1].status === "fulfilled") {
              setStreakCount(response[1].value.data?.data?.currentStreak || 0);
              setLongestStreak(response[1].value.data?.data?.longestStreak || 0);
            } else {
              setStreakCount(0);
              setLongestStreak(0);
            }
          });
        } catch (error) {
          console.error("Erro ao buscar sessões de treino:", error);
        }
      };

      fetchWorkoutSessions();
    }, [userId])
  );

  const getFirstDayOfWeek = useCallback(
    (year: number, month: number): number => {
      return new Date(year, month, 1).getDay();
    },
    []
  );

  const updateDaysInMonth = useCallback(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    setDaysInMonth(daysArray);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    updateDaysInMonth();
  }, [updateDaysInMonth]);

  const firstDay = useMemo(
    () => getFirstDayOfWeek(currentYear, currentMonth),
    [getFirstDayOfWeek, currentYear, currentMonth]
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const getWorkoutForDay = (year: number, month: number, day: number): any => {
    const session = workoutSessions.find((s: any) => {
      if (!s.finishedAt) return false;
      const sessionDate = new Date(s.finishedAt);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month &&
        sessionDate.getDate() === day
      );
    });

    return session || null;
  };

  const renderDays = () => {
    const blanks = Array(firstDay).fill(null);
    const allDays = [...blanks, ...daysInMonth];
    return allDays.map((day, index) => {
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      const workout = day
        ? getWorkoutForDay(currentYear, currentMonth, day)
        : null;

      return (
        <View
          key={index}
          className="w-[14.28%] items-center justify-center my-1"
        >
          {day ? (
            <View className="items-center relative">
              {workout ? (
                <Link
                  asChild
                  href={{
                    pathname: "/modals/workoutDetails",
                    params: {
                      workoutName: workout.workout?.name,
                      planName: workout.workout?.plan?.name || "",
                      startedAt: workout.startedAt,
                      finishedAt: workout.finishedAt,
                    },
                  }}
                >
                  <TouchableOpacity
                    className={`w-10 h-10 items-center justify-center rounded-2xl ${
                      isToday ? "bg-darkgreen" : "bg-darkgreen/10"
                    }`}
                  >
                    <Text
                      className={`text-base font-rsemi ${
                        isToday ? "text-white" : "text-darkgreen"
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ) : (
                <TouchableOpacity
                  className={`w-10 h-10 items-center justify-center rounded-2xl ${
                    isToday ? "bg-darkgreen/20" : ""
                  }`}
                  disabled
                >
                  <Text
                    className={`text-base font-rregular ${
                      isToday ? "text-darkgreen font-rbold" : "text-secondary"
                    }`}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              )}
              {workout && (
                <View
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isToday ? "bg-stronggreen" : "bg-darkgreen"
                  }`}
                />
              )}
            </View>
          ) : (
            <View className="w-10 h-10" />
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>
          <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center">
            <FontAwesome6 name="calendar-days" size={24} color="#D5D962" />
          </View>
        </View>
        <Text className="font-rbold text-4xl color-textcolor">Calendário</Text>
        <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
      </View>

      <View className="px-6 mb-6">
        <View className="bg-white rounded-3xl p-5 shadow-md">
          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                <FontAwesome6 name="dumbbell" size={20} color="#D5D962" />
              </View>
              <Text className="font-rbold text-2xl text-secondary">
                {workoutSessions.length}
              </Text>
              <Text className="font-rregular text-xs text-secondary/60">
                treinos
              </Text>
            </View>
            <View className="items-center">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                <FontAwesome6 name="fire" size={20} color="#D5D962" />
              </View>
              <Text className="font-rbold text-2xl text-secondary">
                {streakCount}
              </Text>
              <Text className="font-rregular text-xs text-secondary/60">
                em streak
              </Text>
            </View>
            <View className="items-center">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-2">
                <MaterialCommunityIcons
                  name="clock"
                  size={24}
                  color="#D5D962"
                />
              </View>
              <Text className="font-rbold text-2xl text-secondary">
                {longestStreak}
              </Text>
              <Text className="font-rregular text-xs text-secondary/60">
                maior streak
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="px-6 flex-1">
        <View className="bg-white rounded-3xl p-5 shadow-md">
          <View className="w-full flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={handlePrevMonth}
              className="bg-darkgreen/10 w-10 h-10 rounded-2xl items-center justify-center"
            >
              <FontAwesome name="chevron-left" size={20} color="#D5D962" />
            </TouchableOpacity>
            <Text className="text-xl font-rbold text-secondary">
              {monthName} {currentYear}
            </Text>
            <TouchableOpacity
              onPress={handleNextMonth}
              className="bg-darkgreen/10 w-10 h-10 rounded-2xl items-center justify-center"
            >
              <FontAwesome name="chevron-right" size={20} color="#D5D962" />
            </TouchableOpacity>
          </View>
          <View className="w-full flex-row justify-around mb-3">
            {weekDays.map((weekDay, idx) => (
              <Text
                key={idx}
                className="w-10 text-center text-xs font-rsemi text-secondary/60"
                numberOfLines={1}
              >
                {weekDay}
              </Text>
            ))}
          </View>
          <View className="w-full flex-row flex-wrap">{renderDays()}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Calendario;
