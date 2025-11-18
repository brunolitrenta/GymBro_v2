import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

const HelpScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL("mailto:support@gymbro.com");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>
          <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center">
            <FontAwesome6 name="question-circle" size={24} color="#D5D962" />
          </View>
        </View>
        <Text className="font-rbold text-4xl color-textcolor">Ajuda e Suporte</Text>
        <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
      </View>
      
      <View className="flex-1 px-6 justify-center">
        <View className="bg-white rounded-3xl p-8 shadow-md items-center">
          <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-6">
            <FontAwesome6 name="envelope" size={32} color="#D5D962" />
          </View>
          <Text className="font-rbold text-xl text-secondary text-center mb-4">
            Precisa de ajuda?
          </Text>
          <Text className="font-rregular text-center text-base leading-6 text-secondary/60 mb-6">
            Eventuais problemas, instabilidades ou sugestões de melhorias, entre em contato:
          </Text>
          <TouchableOpacity 
            onPress={handleEmailPress} 
            activeOpacity={0.7}
            className="bg-darkgreen px-6 py-3 rounded-2xl shadow-md"
          >
            <Text className="font-rsemi text-white text-base">
              support@gymbro.com
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
