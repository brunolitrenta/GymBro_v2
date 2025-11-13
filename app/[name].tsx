import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { weekDays } from "@/constants/Calendar";
import { useWorkout } from "@/hooks/workoutContext";
import { ISaveWorkout } from "@/interfaces/ISaveWorkout";
import { useMemo } from "react";

const WorkoutPlan = () => {
  const dayWeek = new Date().getDay();
  const params = useLocalSearchParams();

  const { saveWorkout } = useWorkout();

  // Recebe os parâmetros passados pela navegação
  const planId = params.id as string;
  const planName = params.name as string;
  const planWorkouts = useMemo(() => {
    if (params.workouts && params.workouts !== "undefined") {
      try {
        return JSON.parse(params.workouts as string);
      } catch (error) {
        console.error("Erro ao fazer parse dos workouts:", error);
        return [];
      }
    }
    return [];
  }, [params.workouts]);

  // Usa os workouts do plano se foram passados, senão usa os do contexto
  const workoutsToDisplay =
    planWorkouts.length > 0 ? planWorkouts : saveWorkout;

  function renderWorkout({ item }: { item: ISaveWorkout }) {
    return (
      <Link
        asChild
        href={{
          pathname: "/workout/[label]",
          params: {
            label: item.label,
            exercises: JSON.stringify(item.exercises),
          },
        }}
      >
        <Pressable className="w-full h-20 bg-secondary mb-3 rounded-3xl flex-row justify-around p-2 items-center">
          <Text className="font-rbold text-5xl h-10 text-white">
            {item.label}
          </Text>
          {item.muscle.length > 1 ? (
            <View className="flex-row justify-evenly w-1/2">
              <Text className="font-rregular text-2xl text-white">
                {item.muscle[0]},
              </Text>
              <Text className="font-rregular text-2xl text-white">
                {item.muscle[1]}
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-evenly w-1/2">
              <Text className="font-rregular text-2xl text-white">
                {item.muscle[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center gap-6 pt-6 bg-primary"
    >
      <View className="flex-row w-5/6 justify-between items-center">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="textcolor" />
        </TouchableOpacity>
        <Text className="font-rbold text-3xl color-textcolor">
          {planName || "Treinos"}
        </Text>
        <Link
          asChild
          href={{
            pathname: "/modals/planOptions",
            params: {
              planId: planId,
              planName: planName,
            },
          }}
        >
          <TouchableOpacity className="h-12 w-12 items-center justify-center">
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
      <Link asChild href="/calendar">
        <Pressable className="w-5/6 h-32 flex-row justify-between items-center">
          <View className="bg-secondary w-20 h-20 rounded-full justify-center items-center">
            <Text className="text-white font-rsemi">
              {weekDays[(dayWeek + 6) % 7]}
            </Text>
            <View className="w-5 h-5 bg-reallygray rounded-md justify-center items-center">
              <Text className="text-white font-rregular">-</Text>
            </View>
          </View>
          <View className="bg-secondary w-28 h-28 rounded-full justify-center items-center">
            <Text className="text-white font-rsemi text-xl">
              {weekDays[dayWeek]}
            </Text>
            <View className="w-6 h-6 bg-reallygray rounded-md justify-center items-center">
              <Text className="text-white font-rregular">-</Text>
            </View>
          </View>
          <View className="bg-secondary w-20 h-20 rounded-full justify-center items-center">
            <Text className="text-white font-rsemi">
              {weekDays[(dayWeek + 1) % 7]}
            </Text>
            <View className="w-5 h-5 bg-reallygray rounded-md justify-center items-center">
              <Text className="text-white font-rregular">-</Text>
            </View>
          </View>
        </Pressable>
      </Link>
      <View className="w-11/12 flex-1 pb-6">
        {workoutsToDisplay.length === 0 ? (
          <View className="w-full h-full justify-center items-center">
            <Text className="text-secondary font-rbold ml-2 text-base text-center mb-6">
              Você não possui nenhum treino, adicione um clicando no botão
              abaixo.
            </Text>
            <Link asChild href="/modals/createWorkout">
              <TouchableOpacity className="items-center justify-center">
                <View>
                  <FontAwesome6 name="circle-plus" size={50} color="#D5D962" />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View className="flex-1">
            <Text className="text-darkgreen font-rbold ml-5 mb-3 text-base">
              Plano de treinos atual
            </Text>
            <View className="flex-1 w-full items-center">
              <FlatList
                data={workoutsToDisplay}
                renderItem={renderWorkout}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View className="w-full items-center pt-4">
              <Link asChild href="/modals/createWorkout">
                <TouchableOpacity className="items-center justify-center">
                  <View className="shadow-lg rounded-full">
                    <FontAwesome6
                      name="circle-plus"
                      size={50}
                      color="#D5D962"
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WorkoutPlan;
