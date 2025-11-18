import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";

const LogoutConfirmation = () => {
  const { logout } = useAuth();

  const handleConfirmLogout = async () => {
    router.back();
    await logout();
    router.replace("/user/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="w-full h-full absolute"
      />
      <View className="bg-white w-11/12 rounded-3xl py-8 px-6 shadow-2xl">
        <View className="items-center mb-6">
          <View className="bg-red-100 w-20 h-20 rounded-3xl justify-center items-center mb-4">
            <FontAwesome6 name="right-from-bracket" size={32} color="#EF4444" />
          </View>
          <Text className="text-2xl font-rbold text-secondary mb-2">
            Sair do aplicativo
          </Text>
          <Text className="text-base font-rregular text-secondary/60 text-center px-4">
            Tem certeza que deseja sair? Você precisará fazer login novamente.
          </Text>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={handleConfirmLogout}
            className="w-full bg-red-500 py-4 rounded-2xl items-center shadow-md"
          >
            <Text className="text-white font-rbold text-base">Sim, sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full bg-secondary/10 py-4 rounded-2xl items-center"
          >
            <Text className="text-secondary font-rbold text-base">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LogoutConfirmation;
