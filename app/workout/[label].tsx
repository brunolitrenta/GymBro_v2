import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { workoutData } from "@/datasets/exercises";
import { IExercise } from "@/interfaces/IExercise";

const DynamicWorkout = () => {
  const { label, exercises } = useLocalSearchParams<{
    label: string;
    exercises: string;
  }>();

  const parsedExercises: number[] = JSON.parse(exercises!);

  const [exercisesCompleted, setExercisesCompleted] = useState<
    Array<number | string>
  >([]);

  function filterExercises() {
    return workoutData.filter((wk) => parsedExercises?.includes(wk.id));
  }

  const filteredExercises = filterExercises();

  function renderExercise({ item }: { item: IExercise }) {
    const foundExercise = exercisesCompleted.find((ex) => ex == item.id);

    return (
      <Link
        asChild
        href={{
          pathname: "/exercise/[id]",
          params: { exercise: JSON.stringify(item.id), id: item.id },
        }}
      >
        <Pressable className="w-full h-28 bg-lightgreen rounded-2xl items-center justify-center p-2 mb-5 flex-row justify-around">
          <Pressable
            className="w-12 h-12 items-center justify-center"
            onPress={() => {
              foundExercise
                ? setExercisesCompleted(
                    exercisesCompleted.filter((ex) => ex != item.id)
                  )
                : setExercisesCompleted((pv) => [...pv, item.id]);
            }}
          >
            {foundExercise ? (
              <FontAwesome5 name="check-square" size={32} color="black" />
            ) : (
              <FontAwesome5 name="square" size={32} color="black" />
            )}
          </Pressable>
          <Text className="font-rsemi text-xl w-[58%] text-center">
            {item.exercicio}
          </Text>
        </Pressable>
      </Link>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 flex-column justify-evenly items-center bg-primary"
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
            pathname: "/modals/workoutOptionsModal",
            params: { label: label },
          }}
        >
          <TouchableOpacity className="h-12 w-10 items-center justify-center">
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="w-full h-5/6">
        <Text className="text-darkgreen font-rbold ml-2 text-base ml-5">
          Lista de exercícios
        </Text>
        <View className="w-full h-[90%] justify-evenly items-center">
          <FlatList
            data={filteredExercises}
            renderItem={renderExercise}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <TouchableOpacity
        disabled={exercisesCompleted.length == 0 ? true : false}
        activeOpacity={0.7}
        className={
          exercisesCompleted.length == 0
            ? "flex-row w-11/12 h-16 absolute top-[94.5%] bg-stronggreen justify-evenly items-center rounded-2xl opacity-60"
            : "flex-row w-11/12 h-16 absolute top-[94.5%] bg-stronggreen justify-evenly items-center rounded-2xl"
        }
      >
        <Text className="font-rbold text-2xl">Finalizar treino</Text>
        <FontAwesome5 name="check" size={28} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DynamicWorkout;
