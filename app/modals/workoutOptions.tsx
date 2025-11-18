import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import CustomAlert from "./customAlert";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WorkoutOptions = () => {
  const { label } = useLocalSearchParams();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const confirmRemoval = () => {
    setAlertTitle("Atenção");
    setAlertMessage(
      "Você tem certeza que deseja excluir este treino? Essa ação será irreversível."
    );
    setAlertVisible(true);
  };

  function deleteWorkout() {
    // TODO: Implementar lógica de exclusão de treino via API
    router.back();
  }

  return (
    <View
      className="flex-1 bg-transparent"
    >
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        actions={[
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            onPress: () => deleteWorkout(),
            style: "destructive",
          },
        ]}
      />
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full"
      />
      <View 
        className="bg-white rounded-2xl shadow-2xl overflow-hidden" 
        style={{
          position: 'absolute', 
          top: 70, 
          right: 20, 
          width: 180,
          shadowColor: '#000',
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
