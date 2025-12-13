import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import api from "@/utils/axiosConfig";
import { useAuth } from "@/hooks/authContext";
import { eventEmitter } from "@/utils/eventEmitter";
import { useLoading } from "@/hooks/loadingContext";

const DynamicWorkout = () => {
  const { label, workoutId, planId, planName } = useLocalSearchParams<{
    label: string;
    workoutId: string;
    planId: string;
    planName: string;
  }>();

  const [exercisesCompleted, setExercisesCompleted] = useState<string[]>([]);
  const [exercises, setExercises] = useState<any[] | null>(null);
  const [isWorkoutBlocked, setIsWorkoutBlocked] = useState(false);
  const { withLoading, isLoading } = useLoading();
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = useAuth();

  React.useEffect(() => {
    const handleAlertConfirm = (data: any) => {
      const { action } = data;
      if (action === "finishWorkout") {
        handleFinishWorkout();
      }
    };

    eventEmitter.on("customAlertConfirm", handleAlertConfirm);
    return () => eventEmitter.off("customAlertConfirm", handleAlertConfirm);
  }, [sessionId, userId]);

  const fetchWorkoutData = useCallback(
    async (isRefreshing = false) => {
      if (!workoutId) {
        console.log("workoutId não definido");
        return;
      }

      const handleSessionData = (sessionData: any) => {
        const finishedAt = sessionData?.finishedAt;

        if (sessionData?.sets && Array.isArray(sessionData.sets)) {
          const completedExerciseIds = [
            ...new Set(
              sessionData.sets.map((set: any) => set.workoutExerciseId)
            ),
          ] as string[];
          setExercisesCompleted(completedExerciseIds);
        } else {
          setExercisesCompleted([]);
        }

        if (sessionData && !finishedAt) {
          setSessionId(sessionData.id);
          setHasActiveSession(true);
          setIsWorkoutBlocked(false);
        } else if (finishedAt) {
          const finishedDate = new Date(finishedAt);
          const now = new Date();
          const hoursDifference =
            (now.getTime() - finishedDate.getTime()) / (1000 * 60 * 60);

          setIsWorkoutBlocked(hoursDifference < 12);
          setHasActiveSession(false);
          setSessionId(null);
        } else {
          setIsWorkoutBlocked(false);
          setHasActiveSession(false);
          setSessionId(null);
        }
      };

      try {
        if (isRefreshing) {
          setRefreshing(true);
          const [exercisesResponse, sessionResponse] = await Promise.all([
            api.get(`/workout/exercises/${workoutId}`, {
              headers: { "X-Silent": "true" },
            }),
            api.get(`/workout/session/${workoutId}`, {
              headers: { "X-Silent": "true" },
            }),
          ]);

          const exerciseData = exercisesResponse.data?.data;
          if (Array.isArray(exerciseData)) {
            setExercises(exerciseData);
          } else {
            setExercises([]);
          }

          handleSessionData(sessionResponse.data?.data);
          setRefreshing(false);
        } else {
          await withLoading(
            Promise.allSettled([
              api.get(`/workout/exercises/${workoutId}`, {
                headers: { "X-Silent": "true" },
              }),
              api.get(`/workout/session/${workoutId}`, {
                headers: { "X-Silent": "true" },
              }),
            ]).then((results) => {
              if (results[0].status === "fulfilled") {
                const exerciseData = results[0].value.data?.data;
                if (Array.isArray(exerciseData)) {
                  setExercises(exerciseData);
                } else {
                  setExercises([]);
                }
              } else {
                console.error(
                  "Erro ao buscar exercícios do treino:",
                  results[0].reason
                );
                setExercises([]);
              }

              if (results[1].status === "fulfilled") {
                handleSessionData(results[1].value.data?.data);
              } else {
                console.error(
                  "Erro ao buscar sessão do treino:",
                  results[1].reason
                );
                setIsWorkoutBlocked(false);
                setHasActiveSession(false);
                setSessionId(null);
                setExercisesCompleted([]);
              }
            })
          );
        }
      } catch (error) {
        console.error("Erro ao buscar dados do treino:", error);
        if (isRefreshing) {
          setRefreshing(false);
        }
      }
    },
    [workoutId, withLoading]
  );

  const onRefresh = useCallback(() => {
    fetchWorkoutData(true);
  }, [fetchWorkoutData]);

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutData();
    }, [fetchWorkoutData])
  );

  const handleStartWorkout = async () => {
    if (!workoutId) return;

    try {
      await api.post(`/workout/session/start/`, {
        workoutId,
        userId,
      });
      fetchWorkoutData();
    } catch (error) {
      console.error("Erro ao iniciar treino:", error);
    }
  };

  const handleFinishWorkout = async () => {
    if (!sessionId) return;

    try {
      await api.post(`/workout/session/finish/`, {
        sessionId,
        userId,
      });
      fetchWorkoutData();

      router.push({
        pathname: "/modals/workoutCompleted",
        params: { workoutLabel: label },
      });
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);
    }
  };

  const confirmFinishWorkout = () => {
    router.push({
      pathname: "/modals/customAlert",
      params: {
        title: "Finalizar treino",
        message: "Tem certeza que deseja finalizar este treino?",
        iconName: "dumbbell",
        confirmText: "Finalizar",
        cancelText: "Cancelar",
        action: "finishWorkout",
      },
    });
  };

  function renderExercise({ item }: { item: any }) {
    if (!item) return null;

    const foundExercise = exercisesCompleted.find((ex) => ex === item.id);
    const isCompleted = !!foundExercise;

    return (
      <Link
        asChild
        href={{
          pathname: "/exercise/[id]",
          params: {
            exercise: JSON.stringify(item),
            id: item.id,
            sessionId: sessionId || "",
            isWorkoutBlocked: isWorkoutBlocked.toString(),
            hasActiveSession: hasActiveSession.toString(),
            isCompleted: isCompleted.toString(),
          },
        }}
      >
        <Pressable
          className={`bg-white rounded-3xl p-5 mb-4 shadow-md active:opacity-90 ${
            isCompleted ? "border-2 border-darkgreen" : ""
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text
                className={`font-rbold text-lg text-secondary ${
                  isCompleted ? "opacity-60 line-through" : ""
                }`}
              >
                {item.exerciseDef.name || "Exercício sem nome"}
              </Text>
              {isCompleted && (
                <View className="bg-darkgreen/10 px-3 py-1 rounded-full mt-2 self-start">
                  <Text className="text-darkgreen font-rsemi text-xs">
                    Concluído
                  </Text>
                </View>
              )}
            </View>
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                isCompleted ? "bg-darkgreen" : "bg-secondary/10"
              }`}
            >
              {isCompleted ? (
                <FontAwesome5 name="check" size={24} color="white" />
              ) : (
                <FontAwesome6 name="chevron-right" size={20} color="#D5D962" />
              )}
            </View>
          </View>
        </Pressable>
      </Link>
    );
  }

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
          <Link
            disabled={isLoading}
            asChild
            href={{
              pathname: "/modals/workoutOptions",
              params: {
                label: label,
                workoutId: workoutId,
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
        <View className="flex-row items-center gap-3">
          <View className="bg-darkgreen w-16 h-16 rounded-2xl justify-center items-center shadow-sm">
            <Text className="font-rbold text-4xl text-white">{label}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-rbold text-3xl color-textcolor">
              Treino {label}
            </Text>
            <Text className="font-rregular text-sm text-secondary/60 mt-1">
              {exercises?.length || 0}{" "}
              {exercises?.length === 1 ? "exercício" : "exercícios"}
            </Text>
          </View>
        </View>
      </View>
      {isLoading || exercises === null ? (
        <View
          className="w-full justify-center items-center bg-white rounded-3xl p-8"
          style={{ minHeight: 200 }}
        >
          <ActivityIndicator size="large" color="#D5D962" />
          <Text className="text-secondary font-rregular text-sm mt-4">
            Carregando exercícios...
          </Text>
        </View>
      ) : exercises.length == 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center shadow-md">
          <View className="bg-darkgreen/10 w-16 h-16 rounded-full items-center justify-center mb-3">
            <FontAwesome6 name="dumbbell" size={28} color="#D5D962" />
          </View>
          <Text className="font-rbold text-lg text-secondary mb-2">
            Nenhum exercício
          </Text>
          <Text className="font-rregular text-sm text-secondary/60 text-center">
            Adicione exercícios para começar
          </Text>
        </View>
      ) : (
        <View className="flex-1 px-6">
          <Text className="text-secondary font-rbold text-xl mb-4">
            Lista de Exercícios
          </Text>
          <FlatList
            data={exercises || []}
            renderItem={renderExercise}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#D5D962"]}
                tintColor="#D5D962"
              />
            }
          />
        </View>
      )}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-primary">
        {isWorkoutBlocked ? (
          <View className="bg-secondary/20 rounded-3xl p-5 flex-row items-center justify-center gap-3">
            <FontAwesome5 name="lock" size={24} color="#666" />
            <Text className="font-rbold text-lg text-secondary/60">
              Treino já realizado
            </Text>
          </View>
        ) : hasActiveSession ? (
          <TouchableOpacity
            onPress={confirmFinishWorkout}
            disabled={exercisesCompleted.length === 0 || isLoading}
            activeOpacity={0.7}
            className={`bg-red-500 rounded-3xl p-5 shadow-lg flex-row items-center justify-center gap-3 ${
              exercisesCompleted.length === 0 ? "opacity-50" : ""
            }`}
          >
            <FontAwesome5 name="check" size={24} color="white" />
            <Text className="font-rbold text-white text-xl">
              Finalizar Treino
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={isLoading ? undefined : () => handleStartWorkout()}
            disabled={isLoading}
            activeOpacity={0.7}
            className="bg-darkgreen rounded-3xl p-5 shadow-lg flex-row items-center justify-center gap-3"
          >
            <FontAwesome5 name="play" size={24} color="white" />
            <Text className="font-rbold text-white text-xl">
              Iniciar Treino
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DynamicWorkout;
