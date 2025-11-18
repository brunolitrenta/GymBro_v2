import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
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
import WorkoutCompletedModal from "@/app/modals/workoutCompleted";
import CustomAlert from "@/app/modals/customAlert";

const DynamicWorkout = () => {
  const { label, workoutId } = useLocalSearchParams<{
    label: string;
    workoutId: string;
  }>();

  const [exercisesCompleted, setExercisesCompleted] = useState<string[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isWorkoutBlocked, setIsWorkoutBlocked] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

  const { userId } = useAuth();

  const fetchWorkoutData = useCallback(async () => {
    if (!workoutId) {
      console.log("workoutId não definido");
      return;
    }

    try {
      const response = await api.get(`/workout/exercises/${workoutId}`, {
        headers: { "X-Silent": "true" },
      });
      const exerciseData = response.data?.data;

      if (Array.isArray(exerciseData)) {
        setExercises(exerciseData);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios do treino:", error);
      setExercises([]);
    }

    try {
      const session = await api.get(`/workout/session/${workoutId}`, {
        headers: { "X-Silent": "true" },
      });
      const sessionData = session.data?.data;
      const finishedAt = sessionData?.finishedAt;

      if (sessionData?.sets && Array.isArray(sessionData.sets)) {
        const completedExerciseIds = [
          ...new Set(sessionData.sets.map((set: any) => set.workoutExerciseId)),
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
    } catch (error) {
      console.error("Erro ao buscar sessão do treino:", error);
      setIsWorkoutBlocked(false);
      setHasActiveSession(false);
      setSessionId(null);
      setExercisesCompleted([]);
    }
  }, [workoutId]);

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
      setShowFinishConfirmation(false);
      setShowCompletedModal(true);
      fetchWorkoutData();
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);
    }
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
          className={`w-full h-28 rounded-2xl items-center justify-center p-2 mb-5 flex-row justify-around border-2 ${
            isCompleted
              ? "bg-stronggreen border-darkgreen"
              : "bg-lightgreen border-lightgreen"
          }`}
        >
          <Text
            className={`font-rsemi text-xl w-[58%] text-center ${
              isCompleted ? "opacity-70 line-through" : ""
            }`}
          >
            {item.exerciseDef.name || "Exercício sem nome"}
          </Text>

          <View
            className={`items-center justify-center ${
              isCompleted ? "bg-darkgreen rounded-full p-2" : ""
            }`}
          >
            {isCompleted ? (
              <FontAwesome5 name="check-circle" size={40} color="black" />
            ) : (
              <FontAwesome5 name="circle" size={40} color="#666" />
            )}
          </View>
        </Pressable>
      </Link>
    );
  }

  return (
    <>
      <CustomAlert
        visible={showFinishConfirmation}
        title="Finalizar treino"
        message="Tem certeza que deseja finalizar este treino?"
        iconName="dumbbell"
        onClose={() => setShowFinishConfirmation(false)}
        actions={[
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => setShowFinishConfirmation(false),
          },
          {
            text: "Finalizar",
            style: "destructive",
            onPress: handleFinishWorkout,
          },
        ]}
      />
      <WorkoutCompletedModal
        visible={showCompletedModal}
        onClose={() => setShowCompletedModal(false)}
        workoutLabel={label}
      />
      <SafeAreaView
        edges={["top"]}
        className="flex-1 flex-column justify-evenly items-center pt-6 bg-primary"
      >
        <View className="flex-row w-5/6 h-8 justify-between items-center">
          <TouchableOpacity
            className="h-12 w-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={32} color="black" />
          </TouchableOpacity>
          <Text className="font-rbold text-3xl">Treino {label}</Text>
          <Link
            asChild
            href={{
              pathname: "/modals/workoutOptions",
              params: { label: label },
            }}
          >
            <TouchableOpacity className="h-12 w-10 items-center justify-center">
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="w-full h-5/6 mt-5">
          <Text className="text-darkgreen font-rbold ml-2 text-base ml-5">
            Lista de exercícios
          </Text>
          <View className="w-full h-[90%] justify-evenly items-center">
            <FlatList
              data={exercises || []}
              renderItem={renderExercise}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center mt-10">
                  <Text className="font-rregular text-base text-gray-600">
                    Nenhum exercício encontrado
                  </Text>
                </View>
              }
            />
          </View>
        </View>
        {isWorkoutBlocked ? (
          <TouchableOpacity
            disabled
            className="flex-row w-11/12 h-16 fixed bottom-6 bg-gray-400 justify-evenly items-center rounded-2xl opacity-60"
          >
            <Text className="font-rbold text-2xl text-gray-600">
              Treino realizado
            </Text>
            <FontAwesome5 name="lock" size={28} color="#666" />
          </TouchableOpacity>
        ) : hasActiveSession ? (
          <TouchableOpacity
            onPress={() => setShowFinishConfirmation(true)}
            disabled={exercisesCompleted.length === 0}
            activeOpacity={0.7}
            className={"flex-row w-11/12 h-16 fixed bottom-6 bg-rose-500 justify-evenly items-center rounded-2xl" + (exercisesCompleted.length === 0 ? " opacity-60" : "")}
          >
            <Text className="font-rbold text-white text-2xl">Finalizar treino</Text>
            <FontAwesome5 name="check" size={28} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStartWorkout}
            activeOpacity={0.7}
            className="flex-row w-11/12 h-16 fixed bottom-6 bg-stronggreen justify-evenly items-center rounded-2xl"
          >
            <Text className="font-rbold text-2xl">Iniciar treino</Text>
            <FontAwesome5 name="play" size={28} color="black" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default DynamicWorkout;
