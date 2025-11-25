import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const WorkoutDetails = () => {
  const { 
    workoutName, 
    planName, 
    startedAt, 
    finishedAt
  } = useLocalSearchParams();

  return (
    <View
      className="flex-1 justify-center items-center bg-black/50"
    >
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full absolute"
      />
      <View className="w-11/12 bg-white rounded-3xl p-6 shadow-2xl">
        <View className="items-end mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-secondary/10 w-10 h-10 rounded-2xl items-center justify-center"
          >
            <FontAwesome name="close" size={20} color="#2D3748" />
          </TouchableOpacity>
        </View>
        
        <View className="items-center mb-6">
          <View className="bg-darkgreen/10 w-16 h-16 rounded-3xl items-center justify-center mb-3">
            <FontAwesome name="check-circle" size={32} color="#D5D962" />
          </View>
          <Text className="font-rbold text-2xl text-secondary mb-2">
            Treino Realizado
          </Text>
        </View>
        
        <View className="bg-secondary/5 rounded-2xl p-4 gap-3">
          <View className="flex-row justify-between items-center py-2 border-b border-secondary/10">
            <Text className="font-rsemi text-sm text-secondary/60">PLANO</Text>
            <Text className="font-rregular text-base text-secondary">
              {planName || 'N/A'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2 border-b border-secondary/10">
            <Text className="font-rsemi text-sm text-secondary/60">TREINO</Text>
            <Text className="font-rregular text-base text-secondary">
              {workoutName}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2 border-b border-secondary/10">
            <Text className="font-rsemi text-sm text-secondary/60">INÍCIO</Text>
            <Text className="font-rregular text-base text-secondary">
              {startedAt && new Date(startedAt as string).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2">
            <Text className="font-rsemi text-sm text-secondary/60">TÉRMINO</Text>
            <Text className="font-rregular text-base text-secondary">
              {finishedAt && new Date(finishedAt as string).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        
        </View>
      </View>
    </View>
  );
};

export default WorkoutDetails;
