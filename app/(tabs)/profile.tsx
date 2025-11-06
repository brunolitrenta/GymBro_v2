import { SafeAreaView, Text, View, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import { Link, router } from "expo-router";

const Profile = () => {
  const { userName, userType, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-6 pt-6">
      <View className="items-center mt-8 mb-12">
        <Text className="text-3xl font-rbold text-textcolor mb-2">Perfil</Text>
      </View>

      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-lightgreen rounded-full justify-center items-center mb-4">
          <MaterialCommunityIcons name="teddy-bear" size={60} color="black" />
        </View>
        <Text className="text-2xl font-rsemi text-textcolor">{userName}</Text>
        <Text className="text-base font-rregular text-gray-600">
          Membro do GymBro
        </Text>
      </View>

      <View className="flex-1">
        <View className="bg-white rounded-3xl p-6 mb-6">
          <Text className="text-lg font-rsemi text-textcolor mb-4">
            Configurações
          </Text>

          <Link asChild href="/profileOptions">
            <Pressable className="flex-row items-center py-3 justify-center gap-4 border-b border-gray-100">
              <FontAwesome6 name="user" size={20} color="#666" />
              <Text className="text-base font-rregular text-textcolor flex-1">
                Informações pessoais
              </Text>
              <FontAwesome6 name="arrow-right" size={16} color="#666" />
            </Pressable>
          </Link>

          {userType === "trainer" && (
            <Link asChild href="/studentsManagement">
              <Pressable className="flex-row items-center py-3 justify-center gap-4 border-b border-gray-100">
                <FontAwesome6 name="user-group" size={14} color="#666" />
                <Text className="text-base font-rregular text-textcolor flex-1">
                  Gerenciamento de alunos
                </Text>
                <FontAwesome6 name="arrow-right" size={16} color="#666" />
              </Pressable>
            </Link>
          )}

          <Pressable className="flex-row items-center justify-center gap-4 py-3">
            <FontAwesome6 name="question-circle" size={18} color="#666" />
            <Text className="text-base font-rregular text-textcolor flex-1">
              Ajuda e suporte
            </Text>
            <FontAwesome6 name="arrow-right" size={16} color="#666" />
          </Pressable>
        </View>

        <Pressable
          className="bg-red-500 rounded-2xl p-4 flex-row items-center justify-center gap-3"
          onPress={handleLogout}
        >
          <FontAwesome6 name="right-from-bracket" size={20} color="white" />
          <Text className="text-white text-lg font-rsemi leading-5">
            Sair do aplicativo
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
