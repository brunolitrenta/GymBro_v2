import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StudentsManagement = () => {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 items-center bg-primary p-6">
      <View className="flex-row w-11/12 justify-between items-center">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="black" />
        </TouchableOpacity>
        <Text className="font-rbold text-xl text-center w-2/3">Gerenciamento de Alunos</Text>
        <FontAwesome6 name="user-group" size={24} color="black" />
      </View>

      <View className="flex-1">
        <View className="bg-white rounded-3xl p-6 mb-6">
          <Text className="text-lg font-rsemi text-textcolor mb-4">
            Lista de Alunos
          </Text>

          {/* Aqui você pode mapear a lista de alunos e renderizar cada um deles */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentsManagement;
