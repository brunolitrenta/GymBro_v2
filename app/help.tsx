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
    <SafeAreaView edges={["top"]} className="flex-1 bg-white items-center p-6">
      <View className="flex-row w-11/12 justify-between items-center">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="black" />
        </TouchableOpacity>
        <Text className="font-rbold text-2xl">Ajuda e Suporte</Text>
        <FontAwesome6 name="question-circle" size={32} color="black" />
      </View>
      <View className="flex-1 w-11/12 items-center justify-center">
        <Text className="font-rregular text-center text-base leading-6 text-textcolor">
          Eventuais problemas com o aplicativo, instabilidades ou sugestões de
          melhorias e novas funcionalidades, favor mandar um email para:
        </Text>
        <TouchableOpacity onPress={handleEmailPress} activeOpacity={0.7}>
          <Text className="font-rsemi text-center text-base mt-4 underline text-secondary">
            support@gymbro.com
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
