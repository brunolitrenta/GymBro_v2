import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { eventEmitter } from "@/utils/eventEmitter";

const CustomAlert = () => {
  const { title, message, iconName, confirmText, cancelText, action } = useLocalSearchParams();

  const handleConfirm = () => {
    router.back();
    if (action) {
      setTimeout(() => {
        eventEmitter.emit('customAlertConfirm', { action });
      }, 100);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="w-full h-full absolute"
      />
      <View className="bg-white w-11/12 rounded-3xl py-8 px-6 shadow-2xl">
        <View className="items-center mb-6">
          <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
            <FontAwesome6 name={(iconName as string) || "triangle-exclamation"} size={36} color="#D5D962" />
          </View>
          <Text className="text-2xl font-rbold text-secondary mb-2">{title}</Text>
          <Text className="text-base font-rregular text-secondary/60 text-center px-2">{message}</Text>
        </View>

        <View className="w-full gap-3">
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.7}
            className="w-full py-4 rounded-2xl items-center bg-red-500"
          >
            <Text className="font-rbold text-base text-white">
              {confirmText || "Confirmar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-full py-4 rounded-2xl items-center bg-secondary/10"
          >
            <Text className="font-rbold text-base text-secondary">
              {cancelText || "Cancelar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomAlert;
