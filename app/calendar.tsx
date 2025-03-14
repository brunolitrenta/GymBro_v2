import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { months, weeks } from "../constants/Calendar";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

const Calendario = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const monthName = months[currentMonth];

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

  const renderDays = () => {
    const blanks = Array(firstDay).fill(null);
    const allDays = [...blanks, ...daysInMonth];
    return allDays.map((day, index) => {
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      return (
        <View
          key={index}
          className="w-[14.28%] h-12 items-center justify-center my-1"
        >
          {day ? (
            <TouchableOpacity
              className={`w-9 h-9 items-center justify-center rounded-full ${
                isToday ? "bg-green-500" : ""
              }`}
            >
              <Text
                className={`text-base ${
                  isToday ? "text-white font-bold" : "text-black"
                }`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="w-9 h-9" />
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center gap-[10%] p-4">
      <View className="flex-row w-5/6 h-8 justify-between  mt-[10%] items-center">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="black" />
        </TouchableOpacity>
        <Text className="font-rbold text-3xl">Calendário</Text>
        <FontAwesome5 name="calendar-alt" size={32} color="black" />
      </View>
      <View className="flex-row w-11/12 justify-evenly">
        <View className="items-center">
          <Text className="font-rsemi">X</Text>
          <Text className="font-rregular">treinos</Text>
        </View>
        <View className="items-center">
          <Text className="font-rsemi">X</Text>
          <Text className="font-rregular">metas alcançadas</Text>
        </View>
        <View className="items-center">
          <Text className="font-rsemi">X</Text>
          <Text className="font-rregular">streaks</Text>
        </View>
      </View>
      <View>
        <View className="w-full flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={handlePrevMonth}>
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">
            {monthName} {currentYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <FontAwesome name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full flex-row justify-around mb-2">
          {weeks.map((weekDay, idx) => (
            <Text key={idx} className="w-8 text-center text-sm font-semibold">
              {weekDay}
            </Text>
          ))}
        </View>
        <View className="w-full flex-row flex-wrap">{renderDays()}</View>
      </View>
    </SafeAreaView>
  );
};

export default Calendario;
