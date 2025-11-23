import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import { eventEmitter } from "@/utils/eventEmitter";
import api from "@/utils/axiosConfig";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PlanOptions = () => {
  const { planId, planName } = useLocalSearchParams();
  const { userType } = useAuth();

  const isTrainer = userType === "trainer";

  useEffect(() => {
    const handleAlertConfirm = (data: any) => {
      const { action } = data;
      if (action === "deletePlan") {
        deletePlan();
      }
    };

    eventEmitter.on("customAlertConfirm", handleAlertConfirm);
    return () => eventEmitter.off("customAlertConfirm", handleAlertConfirm);
  }, [planId]);

  const confirmRemoval = () => {
    router.push({
      pathname: "/modals/customAlert",
      params: {
        title: "Atenção",
        message:
          "Você tem certeza que deseja excluir este plano? Essa ação será irreversível.",
        iconName: "triangle-exclamation",
        confirmText: "Excluir",
        cancelText: "Cancelar",
        action: "deletePlan",
      },
    });
  };

  async function deletePlan() {
    try {
      await api.delete(`/workout/plan/${planId}`);
      eventEmitter.emit("planDeleted");
      router.replace("/(tabs)/plans");
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
    }
  }

  function sharePlan() {
    router.back();
    setTimeout(() => {
      router.push({
        pathname: "/modals/sharePlan",
        params: {
          planId: planId,
          planName: planName,
        },
      });
    }, 100);
  }

  return (
    <View className="flex-1 bg-transparent">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full"
      ></Pressable>
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
        {isTrainer && (
          <Pressable
            onPress={() => sharePlan()}
            className="flex-row items-center gap-2 px-4 py-4 border-b border-secondary/10 active:bg-secondary/5"
          >
            <FontAwesome6 name="share" size={18} color="#D5D962" />
            <Text className="font-rsemi text-base ml-4 text-secondary">
              Encaminhar
            </Text>
          </Pressable>
        )}
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

export default PlanOptions;
