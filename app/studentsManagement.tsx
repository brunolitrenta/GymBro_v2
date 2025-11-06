import { SafeAreaView, View, Text } from "react-native";

const StudentsManagement = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary px-6">
      <View className="items-center mt-8 mb-12">
        <Text className="text-3xl font-rbold text-textcolor mb-2">Gerenciamento de Alunos</Text>
      </View>

      <View className="flex-1">
        <View className="bg-white rounded-3xl p-6 mb-6">
          <Text className="text-lg font-rsemi text-textcolor mb-4">Lista de Alunos</Text>

          {/* Aqui você pode mapear a lista de alunos e renderizar cada um deles */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentsManagement;
