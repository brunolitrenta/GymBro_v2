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

const WorkoutPlan = () => {
  const dayWeek = new Date().getDay();
  const { planId, planName } = useLocalSearchParams();
  const { withLoading, isLoading } = useLoading();

  const [workoutsToDisplay, setWorkoutsToDisplay] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = useCallback(
    async (isRefreshing = false) => {
      try {
        if (isRefreshing) {
          setRefreshing(true);
          const response = await api.get(`/workout/${planId}`, {
            headers: { "X-Silent": "true" },
          });
          setWorkoutsToDisplay(response.data.data);
          setRefreshing(false);
        } else {
          await withLoading(
            api
              .get(`/workout/${planId}`, {
                headers: { "X-Silent": "true" },
              })
              .then((response) => {
                setWorkoutsToDisplay(response.data.data);
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
    [planId, withLoading]
  );

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [fetchWorkouts])
  );

  const onRefresh = useCallback(() => {
    fetchWorkouts(true);
  }, [fetchWorkouts]);

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
          },
        }}
      >
        <Pressable className="w-full h-20 bg-secondary mb-3 rounded-3xl flex-row justify-around p-2 items-center">
          <Text className="font-rbold text-5xl h-10 text-white">
            {item.name}
          </Text>
          {uniqueMuscles.length > 0 && (
            <View className="flex-row justify-evenly w-4/6 flex-wrap">
              {uniqueMuscles.map((muscle, index) => (
                <Text
                  key={index}
                  className={
                    "font-rregular text-white" +
                    (uniqueMuscles.length > 2 ? " text-xl" : " text-2xl")
                  }
                >
                  {muscle}
                  {index < uniqueMuscles.length - 1 ? ", " : ""}
                </Text>
              ))}
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
          paddingTop: 24,
          paddingBottom: 24,
          alignItems: "center",
          gap: 24,
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
        <View className="w-11/12 pb-6">
          {isLoading ? (
            <View
              className="w-full justify-center items-center"
              style={{ minHeight: 200 }}
            >
              <ActivityIndicator size="large" color="#D5D962" />
            </View>
          ) : workoutsToDisplay.length === 0 ? (
            <View
              className="w-full justify-center items-center"
              style={{ minHeight: 200 }}
            >
              <Text className="text-secondary font-rbold ml-2 text-base text-center mb-6">
                Você ainda não possui nenhum treino neste plano, crie um novo
                clicando no botão abaixo.
              </Text>
              <Link
                asChild
                href={{
                  pathname: "/modals/createWorkout",
                  params: { planId: planId },
                }}
              >
                <TouchableOpacity className="items-center justify-center">
                  <View>
                    <FontAwesome6
                      name="circle-plus"
                      size={50}
                      color="#D5D962"
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            <View>
              <Text className="text-darkgreen font-rbold ml-5 mb-3 text-base">
                Plano de treinos atual
              </Text>
              <View className="w-full items-center">
                {workoutsToDisplay.map((item, index) => (
                  <View key={index} className="w-full">
                    {renderWorkout({ item })}
                  </View>
                ))}
              </View>
              <View className="w-full items-center pt-4">
                <Link
                  asChild
                  href={{
                    pathname: "/modals/createWorkout",
                    params: { planId: planId },
                  }}
                >
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutPlan;
