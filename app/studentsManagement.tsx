import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StudentsManagement = () => {
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
            <FontAwesome6 name="user-group" size={20} color="#D5D962" />
          </View>
        </View>
        <Text className="font-rbold text-3xl color-textcolor">Gerenciar Alunos</Text>
        <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
      </View>

      <View className="flex-1 px-6">
        <View className="bg-white rounded-3xl p-8 shadow-md items-center">
          <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
            <FontAwesome6 name="users" size={32} color="#D5D962" />
          </View>
          <Text className="text-secondary font-rbold text-xl mb-2">
            Lista de Alunos
          </Text>
          <Text className="text-secondary/60 font-rregular text-sm text-center">
            Os alunos vinculados aparecerão aqui
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentsManagement;
