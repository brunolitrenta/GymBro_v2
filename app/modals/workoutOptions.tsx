import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import CustomAlert from "./customAlert";

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
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: "transparent" }}
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
        className="h-full w-full fixed"
      ></Pressable>
      <View className="w-1/2 h-[15%] bg-primary rounded-3xl absolute top-[10%] left-[45%] items-center justify-evenly shadow-lg shadow-stone-950">
        <Pressable
          onPress={() => confirmRemoval()}
          className="flex-row w-full h-1/2 justify-around items-center rounded-b-2xl active:bg-grayish"
        >
          <View className="w-4/5 justify-around flex-row">
            <FontAwesome6 name="trash" size={24} color="black" />
            <Text className="font-rsemi text-xl w-4/6 text-center">
              Excluir
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default WorkoutOptions;
