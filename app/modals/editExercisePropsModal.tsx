import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function EditExercisePropsModal() {
  const [weight, setWeight] = useState("");

  return (
    <View className="flex-1 justify-center items-center">
      <Pressable
        onPress={() => router.back()}
        className="h-full w-full bg-black opacity-50 fixed"
      ></Pressable>
      <View className="w-11/12 h-2/5 bg-primary rounded-3xl absolute items-center justify-between">
        <View className="flex-row w-5/6 py-6 items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={32} color="black" />
          </TouchableOpacity>
          <Text className="font-rsemi text-2xl">Editar carga</Text>
          <View className="h-12 w-10 items-center justify-center"></View>
        </View>
        <View className="w-5/6 items-center justify-between">
          <View className="w-full items-center">
            <Text className="font-rregular text-lg mb-4">
              Digite a nova carga:
            </Text>
            <View className="w-2/4 h-20 border-2 flex-row border-darkgreen rounded-xl mb-6">
              <TextInput
                className="w-full h-20 text-xl font-rsemi text-center"
                keyboardType="numeric"
                placeholderTextColor="#888"
                maxLength={3}
                value={weight}
                onChangeText={setWeight}
              />
              <Text className="font-rregular font-bold text-textcolor text-lg ml-3 mt-8">
                Kg
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="w-11/12 bg-stronggreen py-4 rounded-xl mb-6"
          onPress={() => router.back()}
        >
          <Text className="text-center font-rbold text-xl">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
