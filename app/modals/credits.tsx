import { View, Text, Pressable, TouchableOpacity } from "react-native";

import React from "react";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Credits = () => {
  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <Pressable
        onPress={() => router.back()}
        className="w-full h-full absolute"
      />
      <View className="bg-white w-11/12 rounded-3xl py-8 px-6 shadow-2xl">
        <View className="items-center mb-6">
          <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
            <MaterialCommunityIcons name="teddy-bear" size={48} color="#D5D962" />
          </View>
          <Text className="font-rbold text-3xl text-secondary mb-2">GymBro</Text>
          <Text className="font-rregular text-sm text-secondary/60">Seu parceiro de treino</Text>
        </View>

        <View className="bg-secondary/5 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-rsemi text-secondary mb-3 text-center">
            Criado por
          </Text>
          <View className="items-center gap-2">
            <Text className="text-base font-rregular text-secondary">Bruno Litrenta</Text>
            <Text className="text-base font-rregular text-secondary">Cauã Lopes</Text>
          </View>
        </View>

        <View className="items-center">
          <Text className="text-base font-rsemi text-secondary mb-3">
            Tecnologias utilizadas
          </Text>
          <View className="flex-row gap-4 mb-3">
            <View className="bg-secondary/5 w-16 h-16 rounded-2xl items-center justify-center">
              <MaterialCommunityIcons name="android" size={36} color="#3DDC84" />
            </View>
            <View className="bg-secondary/5 w-16 h-16 rounded-2xl items-center justify-center">
              <MaterialCommunityIcons name="apple" size={36} color="#0D0D0D" />
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="bg-secondary/5 w-16 h-16 rounded-2xl items-center justify-center">
              <MaterialCommunityIcons name="react" size={36} color="#087ea4" />
            </View>
            <View className="bg-secondary/5 w-16 h-16 rounded-2xl items-center justify-center">
              <MaterialCommunityIcons name="tailwind" size={36} color="#0ea5e9" />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-darkgreen rounded-2xl py-3 mt-6"
        >
          <Text className="text-white font-rbold text-base text-center">Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Credits;
