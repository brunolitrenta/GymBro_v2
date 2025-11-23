import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { eventEmitter } from "@/utils/eventEmitter";
import api from "@/utils/axiosConfig";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WorkoutOptions = () => {
  const { label, workoutId, planId, planName } = useLocalSearchParams<{
    label: string;
    workoutId: string;
    planId: string;
    planName: string;
  }>();

  useEffect(() => {
    const handleAlertConfirm = (data: any) => {
      const { action } = data;
      if (action === "deleteWorkout") {
        deleteWorkout();
      }
    };

    eventEmitter.on("customAlertConfirm", handleAlertConfirm);
    return () => eventEmitter.off("customAlertConfirm", handleAlertConfirm);
  }, [workoutId]);

  const confirmRemoval = () => {
    router.push({
      pathname: "/modals/customAlert",
      params: {
        title: "Atenção",
        message:
          "Você tem certeza que deseja excluir este treino? Essa ação será irreversível.",
        iconName: "triangle-exclamation",
        confirmText: "Excluir",
        cancelText: "Cancelar",
        action: "deleteWorkout",
      },
    });
  };

  async function deleteWorkout() {
    try {
      await api.delete(`/workout/${workoutId}`);
      eventEmitter.emit('workoutDeleted');
      router.back();
      setTimeout(() => {
        router.back();
      }, 50);
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
    }
  }

  return (
    <View className="flex-1 bg-transparent">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full"
      />
      <View
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          position: "absolute",
          top: 70,
          right: 20,
          width: 180,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <Pressable
          onPress={() => confirmRemoval()}
          className="flex-row items-center gap-2 px-4 py-4 active:bg-secondary/5"
        >
          <FontAwesome6 name="trash" size={18} color="#EF4444" />
          <Text className="font-rsemi text-base ml-4 text-red-500">
            Excluir
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WorkoutOptions;
