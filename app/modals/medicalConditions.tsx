import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

const MedicalConditions = () => {
  const { studentName, medical } = useLocalSearchParams();

  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full absolute"
      />
      <View className="w-11/12 max-h-5/6 bg-white rounded-3xl p-6 shadow-2xl">
        <View className="items-end mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-secondary/10 w-10 h-10 rounded-2xl items-center justify-center"
          >
            <FontAwesome6 name="xmark" size={20} color="#2D3748" />
          </TouchableOpacity>
        </View>
        
        <View className="items-center mb-6">
          <View className="bg-red-500/10 w-16 h-16 rounded-3xl items-center justify-center mb-3">
            <FontAwesome6 name="heart-pulse" size={32} color="#EF4444" />
          </View>
          <Text className="font-rbold text-2xl text-secondary mb-1">
            Condições Médicas
          </Text>
          <Text className="font-rregular text-sm text-secondary/60">
            {studentName}
          </Text>
        </View>
        
        <ScrollView 
          className="bg-secondary/5 rounded-2xl p-4"
          showsVerticalScrollIndicator={false}
        >
          {medical ? (
            <View className="py-2">
              <Text className="font-rregular text-base text-secondary leading-6">
                {medical}
              </Text>
            </View>
          ) : (
            <View className="items-center py-8">
              <FontAwesome6 name="circle-info" size={48} color="#D5D962" />
              <Text className="text-secondary/60 font-rregular text-sm mt-4 text-center">
                Nenhuma condição médica registrada
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MedicalConditions;
