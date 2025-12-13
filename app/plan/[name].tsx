import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { weekDays } from "@/constants/Calendar";
import { useCallback, useMemo, useState } from "react";
import api from "@/utils/axiosConfig";
import { useLoading } from "@/hooks/loadingContext";
import { useAuth } from "@/hooks/authContext";

const WorkoutPlan = () => {
  const dayWeek = new Date().getDay();
  const { planId, planName } = useLocalSearchParams();
  const { withLoading, isLoading } = useLoading();
  const { userId } = useAuth();

  const [workoutsToDisplay, setWorkoutsToDisplay] = useState<any[] | null>(
    null
  );
  const [workoutSessions, setWorkoutSessions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = useCallback(
    async (isRefreshing = false) => {
      try {
        if (isRefreshing) {
          setRefreshing(true);
          const [workoutsResponse, sessionsResponse] = await Promise.all([
            api.get(`/workout/${planId}`, {
              headers: { "X-Silent": "true" },
            }),
            api.get(`/workout/session/plan/${userId}/${planId}`, {
              headers: { "X-Silent": "true" },
            }),
          ]);
          const workoutsData = workoutsResponse.data.data;
          setWorkoutsToDisplay(Array.isArray(workoutsData) ? workoutsData : []);
          setWorkoutSessions(sessionsResponse.data.data || []);
          setRefreshing(false);
        } else {
          await withLoading(
            Promise.allSettled([
              api.get(`/workout/${planId}`, {
                headers: { "X-Silent": "true" },
              }),
              api.get(`/workout/session/plan/${userId}/${planId}`, {
                headers: { "X-Silent": "true" },
              }),
            ]).then((results) => {
              if (results[0].status === "fulfilled") {
                const workoutsData = results[0].value.data.data;
                setWorkoutsToDisplay(
                  Array.isArray(workoutsData) ? workoutsData : []
                );
              } else {
                console.error("Erro ao buscar workouts:", results[0].reason);
                setWorkoutsToDisplay([]);
              }

              if (results[1].status === "fulfilled") {
                setWorkoutSessions(results[1].value.data.data || []);
              } else {
                console.error("Erro ao buscar sessions:", results[1].reason);
                setWorkoutSessions([]);
              }
            })
          );
        }
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        if (isRefreshing) {
          setRefreshing(false);
        }
      }
    },
    [planId, userId, withLoading]
  );

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [fetchWorkouts])
  );

  const onRefresh = useCallback(() => {
    fetchWorkouts(true);
  }, [fetchWorkouts]);

  const getWorkoutForDay = (dayOffset: number): string => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayOffset);

    const targetDateStr = `${targetDate.getFullYear()}-${String(
      targetDate.getMonth() + 1
    ).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

    const session = workoutSessions.find((s: any) => {
      if (!s.finishedAt) return false;
      const sessionDate = new Date(s.finishedAt);
      const sessionDateStr = `${sessionDate.getFullYear()}-${String(
        sessionDate.getMonth() + 1
      ).padStart(2, "0")}-${String(sessionDate.getDate()).padStart(2, "0")}`;
      return sessionDateStr === targetDateStr;
    });

    return session?.workout?.name || "-";
  };

  const getUniqueMuscles = (workout: any): string[] => {
    if (!workout.items || !Array.isArray(workout.items)) {
      return [];
    }

    const muscles: string[] = [];

    workout.items.forEach((item: any) => {
      if (
        item?.exerciseDef?.primaryMuscles &&
        Array.isArray(item.exerciseDef.primaryMuscles)
      ) {
        item.exerciseDef.primaryMuscles.forEach((muscle: any) => {
          if (muscle?.muscleGroup?.name) {
            muscles.push(muscle.muscleGroup.name);
          }
        });
      }
    });

    return [...new Set(muscles)];
  };

  function renderWorkout({ item }: { item: any }) {
    const uniqueMuscles = getUniqueMuscles(item);

    return (
      <Link
        asChild
        href={{
          pathname: "/workout/[label]",
          params: {
            label: item.name,
            workoutId: item.id,
            planId: planId,
            planName: planName,
          },
        }}
      >
        <Pressable className="w-full min-h-24 bg-white rounded-3xl p-5 mb-4 shadow-md active:opacity-80">
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-darkgreen w-16 h-16 rounded-2xl justify-center items-center shadow-sm">
              <Text className="font-rbold text-4xl text-white">
                {item.name}
              </Text>
            </View>
            <AntDesign name="right" size={24} color="#D5D962" />
          </View>
          {uniqueMuscles.length > 0 && (
            <View className="mt-2">
              <Text className="font-rsemi text-xs text-secondary/60 mb-1">
                GRUPOS MUSCULARES
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {uniqueMuscles.map((muscle, index) => (
                  <View
                    key={index}
                    className="bg-darkgreen/10 px-3 py-1.5 rounded-full"
                  >
                    <Text className="font-rregular text-sm text-secondary">
                      {muscle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Pressable>
      </Link>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D5D962"]}
            tintColor="#D5D962"
          />
        }
      >
        <View className="w-full px-6 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
              onPress={() => router.back()}
            >
              <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
            </TouchableOpacity>
            <Link
              disabled={isLoading}
              asChild
              href={{
                pathname: "/modals/planOptions",
                params: {
                  planId: planId,
                  planName: planName,
                },
              }}
            >
              <TouchableOpacity className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl">
                <Entypo name="dots-three-vertical" size={20} color="#2D3748" />
              </TouchableOpacity>
            </Link>
          </View>
          <Text className="font-rbold text-4xl color-textcolor mt-2">
            {planName || "Treinos"}
          </Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>
        <View className="w-full px-6 mb-8">
          <View className="flex-row items-center mb-3">
            <AntDesign name="calendar" size={20} color="#D5D962" />
            <Text className="font-rsemi text-lg color-secondary ml-2">
              Calendário Semanal
            </Text>
          </View>
          <Link asChild href="/calendar">
            <Pressable className="w-full bg-white rounded-3xl p-6 shadow-lg flex-row justify-between items-center">
              <View className="bg-secondary/20 w-20 h-20 rounded-2xl justify-center items-center">
                <Text className="text-secondary font-rsemi text-sm">
                  {weekDays[(dayWeek + 6) % 7]}
                </Text>
                <View className="w-7 h-7 bg-secondary rounded-lg justify-center items-center mt-1">
                  <Text className="text-white font-rbold text-xs">
                    {getWorkoutForDay(-1)}
                  </Text>
                </View>
              </View>
              <View className="bg-darkgreen w-28 h-28 rounded-2xl justify-center items-center shadow-md">
                <Text className="text-white font-rbold text-base">
                  {weekDays[dayWeek]}
                </Text>
                <View className="w-10 h-10 bg-white rounded-xl justify-center items-center mt-2">
                  <Text className="text-darkgreen font-rbold text-lg">
                    {getWorkoutForDay(0)}
                  </Text>
                </View>
              </View>
              <View className="bg-secondary/20 w-20 h-20 rounded-2xl justify-center items-center">
                <Text className="text-secondary font-rsemi text-sm">
                  {weekDays[(dayWeek + 1) % 7]}
                </Text>
                <View className="w-7 h-7 bg-secondary rounded-lg justify-center items-center mt-1">
                  <Text className="text-white font-rbold text-xs">
                    {getWorkoutForDay(1)}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
        </View>
        <View className="w-full px-6">
          {isLoading || workoutsToDisplay === null ? (
            <View
              className="w-full justify-center items-center bg-white rounded-3xl p-8"
              style={{ minHeight: 200 }}
            >
              <ActivityIndicator size="large" color="#D5D962" />
              <Text className="text-secondary font-rregular text-sm mt-4">
                Carregando treinos...
              </Text>
            </View>
          ) : workoutsToDisplay.length === 0 ? (
            <View
              className="w-full justify-center items-center bg-white rounded-3xl p-8"
              style={{ minHeight: 200 }}
            >
              <View className="bg-darkgreen/10 w-20 h-20 rounded-full justify-center items-center mb-4">
                <FontAwesome6 name="dumbbell" size={32} color="#D5D962" />
              </View>
              <Text className="text-secondary font-rbold text-lg text-center mb-2">
                Nenhum treino criado
              </Text>
              <Text className="text-secondary/60 font-rregular text-sm text-center mb-6 px-4">
                Comece criando seu primeiro treino para este plano
              </Text>
              <Link
                asChild
                href={{
                  pathname: "/modals/createWorkout",
                  params: {
                    planId: planId,
                    existingWorkoutNames: JSON.stringify(
                      workoutsToDisplay.map((w) => w.name)
                    ),
                  },
                }}
              >
                <TouchableOpacity className="bg-darkgreen px-6 py-3 rounded-2xl shadow-md active:opacity-80">
                  <View className="flex-row items-center gap-2">
                    <FontAwesome6 name="plus" size={18} color="white" />
                    <Text className="text-white font-rsemi text-base">
                      Criar Treino
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-secondary font-rbold text-xl">
                    Seus Treinos
                  </Text>
                  <Text className="text-secondary/60 font-rregular text-sm">
                    {workoutsToDisplay.length}{" "}
                    {workoutsToDisplay.length === 1 ? "treino" : "treinos"}
                  </Text>
                </View>
                <Link
                  asChild
                  href={{
                    pathname: "/modals/createWorkout",
                    params: {
                      planId: planId,
                      existingWorkoutNames: JSON.stringify(
                        workoutsToDisplay.map((w) => w.name)
                      ),
                    },
                  }}
                >
                  <TouchableOpacity className="bg-darkgreen w-12 h-12 rounded-2xl justify-center items-center shadow-md active:opacity-80">
                    <FontAwesome6 name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </Link>
              </View>
              <View className="w-full">
                {workoutsToDisplay.map((item, index) => (
                  <View key={index} className="w-full">
                    {renderWorkout({ item })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutPlan;
