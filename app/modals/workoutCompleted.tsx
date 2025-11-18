import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const WorkoutCompletedModal = () => {
  const { workoutLabel } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="w-full h-full absolute"
      />
      <View className="bg-white w-11/12 rounded-3xl py-8 px-6 shadow-2xl">
        <View className="items-center mb-6">
          <View className="bg-darkgreen/20 w-24 h-24 rounded-3xl justify-center items-center mb-4">
            <FontAwesome5 name="trophy" size={48} color="#D5D962" />
          </View>
          <Text className="text-3xl font-rbold text-secondary mb-2">
            Parabéns!
          </Text>
          <Text className="text-base font-rregular text-secondary/60 text-center px-4">
            Você completou o treino {workoutLabel || ""}! Continue assim e alcance seus objetivos.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-full py-4 bg-darkgreen rounded-2xl items-center shadow-md"
        >
          <Text className="text-white font-rbold text-lg">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutCompletedModal;
