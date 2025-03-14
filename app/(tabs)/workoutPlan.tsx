import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { weekDays } from "@/constants/weekDays";
import { useWorkout } from "@/hooks/workoutContext";
import { ISaveWorkout } from "@/interfaces/ISaveWorkout";

const WorkoutPlan = () => {
  const dayWeek = new Date().getDay();

  const { saveWorkout } = useWorkout();

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
      className="flex-1 items-center justify-evenly bg-primary"
    >
      <View className="flex-row w-5/6 justify-between items-center">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="textcolor" />
        </TouchableOpacity>
        <Text className="font-rbold text-3xl color-textcolor">Treinos</Text>
        <Link asChild href="/modals/addWorkoutModal">
          <TouchableOpacity className="h-12 w-12 items-center justify-center">
            <AntDesign name="pluscircle" size={40} color="#A3A65B" />
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
      <View
        className={
          saveWorkout.length == 0
            ? "w-11/12 h-2/4 items-center"
            : "w-11/12 h-2/4"
        }
      >
        {saveWorkout.length == 0 ? (
          <View className="w-5/6 h-full justify-center items-center">
            <Text className="text-secondary font-rbold ml-2 text-base text-center">
              Você não possui nenhum treino, adicione um clicando no + no canto
              superior direito.
            </Text>
          </View>
        ) : (
          <Text className="text-darkgreen font-rbold ml-5 mb-3 text-base">
            Plano de treinos atual
          </Text>
        )}
        <View className="w-full h-full items-center">
          <FlatList
            data={saveWorkout}
            renderItem={renderWorkout}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutPlan;
