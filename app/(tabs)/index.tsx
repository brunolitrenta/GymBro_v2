import {
  Pressable,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { weekDays } from "@/constants/Calendar";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";
import { useCallback, useState } from "react";
import { LineChart } from "@/components/LineChart";
import streak_01 from "@/assets/images/01_streak.png";
import streak_02 from "@/assets/images/02_streak.png";
import streak_03 from "@/assets/images/03_streak.png";
import streak_04 from "@/assets/images/04_streak.png";
import streak_05 from "@/assets/images/05_streak.png";

const Index = () => {
  const dayWeek = new Date().getDay();
  const { userId, userName } = useAuth();
  const [monthSessions, setMonthSessions] = useState(0);
  const [sessions, setSessions] = useState<any[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [daysLabels, setDaysLabels] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchMainData = async () => {
        if (!userId) return;

        try {
          const result = await api.get(`/users/main/${userId}`, {
            headers: { "X-Silent": "true" },
          });
          setMonthSessions(result.data?.data.monthSessions || 0);
          setCompletionRate(result.data?.data.completionRate || 0);
          setCurrentStreak(result.data?.data.currentStreak || 0);
          const completedSessions = result.data?.data.completedSessions || [];
          setSessions(completedSessions);

          const today = new Date();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
          ).getDate();

          const dailyCounts = new Array(daysInMonth).fill(0);
          const labels: string[] = [];

          completedSessions.forEach((session: any) => {
            if (session.startedAt) {
              const sessionDate = new Date(session.startedAt);
              if (
                sessionDate.getMonth() === currentMonth &&
                sessionDate.getFullYear() === currentYear
              ) {
                const dayOfMonth = sessionDate.getDate() - 1;
                dailyCounts[dayOfMonth]++;
              }
            }
          });

          for (let i = 1; i <= daysInMonth; i++) {
            labels.push(i % 5 === 0 || i === 1 ? i.toString() : "");
          }

          setMonthlyData(dailyCounts);
          setDaysLabels(labels);
        } catch (error) {
          console.error("Erro ao buscar informações principais:", error);
        }
      };

      fetchMainData();
    }, [userId])
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-sm font-rregular text-secondary/60">
                Bem-vindo de volta,
              </Text>
              <Text className="text-3xl font-rbold text-textcolor mt-1">
                {userName}!
              </Text>
            </View>
            <Link asChild href="/modals/credits">
              <Pressable className="bg-lightgreen w-14 h-14 justify-center items-center rounded-2xl shadow-md active:opacity-80">
                <MaterialCommunityIcons
                  name="teddy-bear"
                  size={38}
                  color="black"
                />
              </Pressable>
            </Link>
          </View>
        </View>
        <View className="px-6 mb-6">
          <Link asChild href="/plans">
            <Pressable className="bg-darkgreen rounded-3xl p-5 shadow-lg active:opacity-90">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center">
                    <FontAwesome6 name="dumbbell" size={24} color="white" />
                  </View>
                  <Text className="text-white font-rbold text-xl flex-1">
                    Meus planos de treino
                  </Text>
                </View>
                <FontAwesome6 name="arrow-right" size={24} color="white" />
              </View>
            </Pressable>
          </Link>
        </View>
        <View className="px-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-md">
            <View className="flex-row items-center gap-4">
              <View className="bg-lightgreen rounded-2xl p-4 items-center">
                <Image
                  source={
                    currentStreak <= 0
                      ? streak_01
                      : currentStreak <= 3
                      ? streak_02
                      : currentStreak <= 7
                      ? streak_03
                      : currentStreak <= 15
                      ? streak_04
                      : streak_05
                  }
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
                <View className="flex-row gap-1 items-center">
                  <FontAwesome6
                    name="fire"
                    size={20}
                    color={`${
                      currentStreak <= 0
                        ? "#88888870"
                        : currentStreak <= 3
                        ? "#ffbb00ff"
                        : currentStreak <= 7
                        ? "#ff7300ff"
                        : currentStreak <= 15
                        ? "#ff1e00ff"
                        : "#ff00ffff"
                    }`}
                  />
                  <Text className="font-rsemi">{currentStreak}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-rsemi text-secondary/60 text-sm mb-1">
                  ESTE MÊS
                </Text>
                <Text className="font-rbold text-2xl text-secondary mb-2">
                  {monthSessions} dias de treino
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-darkgreen rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </View>
                  <Text className="font-rbold text-sm text-secondary">
                    {completionRate}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="px-6 mb-6">
          <Text className="font-rbold text-xl text-secondary mb-3">
            Calendário Semanal
          </Text>
          <Link asChild href="/calendar">
            <Pressable className="bg-white rounded-3xl p-5 shadow-md active:opacity-90">
              <View className="flex-row justify-between mb-4">
                {[...Array(5)].map((_, index) => {
                  const isToday = index === 2;
                  const today = new Date();
                  const dayDate = new Date(today);
                  dayDate.setDate(today.getDate() + (index - 2));
                  dayDate.setHours(0, 0, 0, 0);

                  const hasTrained = sessions.some((session) => {
                    if (!session.startedAt) return false;
                    const sessionDate = new Date(session.startedAt);
                    sessionDate.setHours(0, 0, 0, 0);
                    return sessionDate.getTime() === dayDate.getTime();
                  });

                  return (
                    <View
                      key={index}
                      className={`items-center ${
                        hasTrained
                          ? "bg-lightgreen/20 px-3 py-2 rounded-2xl"
                          : isToday
                          ? "bg-darkgreen/10 px-3 py-2 rounded-2xl"
                          : "px-3 py-2"
                      }`}
                    >
                      <Text
                        className={`font-rsemi text-sm mb-2 ${
                          hasTrained
                            ? "text-darkgreen"
                            : isToday
                            ? "text-darkgreen"
                            : "text-secondary/60"
                        }`}
                      >
                        {weekDays[(dayWeek + index - 2 + 7) % 7]}
                      </Text>
                      <View
                        className={`w-10 h-5 rounded-full items-center justify-center ${
                          hasTrained
                            ? "bg-stronggreen"
                            : isToday
                            ? "bg-darkgreen"
                            : "bg-secondary/20"
                        }`}
                      >
                        {hasTrained ? (
                          <FontAwesome6
                            name="check"
                            size={14}
                            color="#36403390"
                          />
                        ) : (
                          <Text className="text-secondary/90">-</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
              <View className="flex-row items-center justify-end gap-2">
                <Text className="font-rsemi text-sm text-darkgreen">
                  Ver calendário completo
                </Text>
                <FontAwesome6 name="arrow-right" size={16} color="#D5D962" />
              </View>
            </Pressable>
          </Link>
        </View>
        <View className="px-6">
          <Text className="font-rbold text-xl text-secondary mb-3">
            Seu Progresso
          </Text>
          <Link asChild href="/progress">
            <Pressable className="bg-white rounded-3xl overflow-hidden shadow-md active:opacity-90">
              <View className="bg-lightgreen/30 p-4 justify-center items-center">
                {monthlyData.length > 0 && (
                  <LineChart
                    data={monthlyData}
                    labels={daysLabels}
                    width={Dimensions.get("window").width - 80}
                    height={220}
                    xLabel="Dia do Mês"
                    yLabel="Treinos"
                  />
                )}
              </View>
              <View className="p-5 flex-row items-center justify-between bg-white">
                <View className="flex-1">
                  <Text className="font-rbold text-base text-secondary">
                    Acompanhe sua evolução
                  </Text>
                  <Text className="font-rregular text-sm text-secondary/60 mt-1">
                    Treinos por dia do mês
                  </Text>
                </View>
                <FontAwesome6 name="arrow-right" size={20} color="#D5D962" />
              </View>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
