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
    <View className="flex-1 items-center justify-center bg-transparent">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="w-full h-full bg-black opacity-50 fixed"
      />
      <View className="bg-white w-11/12 rounded-2xl items-center py-6 gap-4 absolute">
        <View className="w-20 h-20 bg-red-100 rounded-full justify-center items-center mb-2">
          <FontAwesome6 name="right-from-bracket" size={36} color="#EF4444" />
        </View>

        <Text className="text-2xl font-rbold text-textcolor">
          Sair do aplicativo
        </Text>
        <Text className="text-base font-rregular text-gray-600 text-center px-6">
          Tem certeza que deseja sair? Você precisará fazer login novamente.
        </Text>

        <View className="w-5/6 gap-3 mt-2">
          <TouchableOpacity
            onPress={handleConfirmLogout}
            className="w-full bg-red-500 py-4 rounded-full items-center"
          >
            <Text className="text-white font-rsemi text-lg">Sim, sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full bg-gray-200 py-4 rounded-full items-center"
          >
            <Text className="text-textcolor font-rsemi text-lg">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LogoutConfirmation;
