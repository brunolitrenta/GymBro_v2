import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { userName, userType } = useAuth();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="px-6 pt-8 pb-6">
        <View className="items-center mb-8">
          <View className="bg-lightgreen w-28 h-28 rounded-3xl justify-center items-center mb-4 shadow-lg">
            <MaterialCommunityIcons name="teddy-bear" size={70} color="black" />
          </View>
          <Text className="text-3xl font-rbold text-textcolor">{userName}</Text>
          <View className="bg-darkgreen/10 px-4 py-2 rounded-full mt-2">
            <Text className="text-sm font-rsemi text-darkgreen">
              {userType === "trainer" ? "Treinador" : "Membro"}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rbold text-secondary mb-4">
            Configurações
          </Text>
          <View className="bg-white rounded-3xl overflow-hidden shadow-md">
            <Link asChild href="/profileOptions">
              <Pressable className="flex-row items-center p-5 border-b border-secondary/5 active:bg-secondary/5">
                <View className="bg-darkgreen/10 w-11 h-11 rounded-2xl items-center justify-center mr-4">
                  <FontAwesome6 name="user" size={18} color="#D5D962" />
                </View>
                <Text className="text-base font-rregular text-secondary flex-1">
                  Dados pessoais
                </Text>
                <FontAwesome6 name="chevron-right" size={18} color="#D5D962" />
              </Pressable>
            </Link>

            {userType === "trainer" && (
              <Link asChild href="/studentsManagement">
                <Pressable className="flex-row items-center p-5 border-b border-secondary/5 active:bg-secondary/5">
                  <View className="bg-darkgreen/10 w-11 h-11 rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="user-group" size={16} color="#D5D962" />
                  </View>
                  <Text className="text-base font-rregular text-secondary flex-1">
                    Gerenciar alunos
                  </Text>
                  <FontAwesome6 name="chevron-right" size={18} color="#D5D962" />
                </Pressable>
              </Link>
            )}

            <Link asChild href="/help">
              <Pressable className="flex-row items-center p-5 active:bg-secondary/5">
                <View className="bg-darkgreen/10 w-11 h-11 rounded-2xl items-center justify-center mr-4">
                  <FontAwesome6 name="question-circle" size={18} color="#D5D962" />
                </View>
                <Text className="text-base font-rregular text-secondary flex-1">
                  Ajuda e suporte
                </Text>
                <FontAwesome6 name="chevron-right" size={18} color="#D5D962" />
                </Pressable>
            </Link>
          </View>
        </View>

        <Link asChild href="/modals/logoutConfirmation">
          <Pressable className="bg-red-500 rounded-3xl p-5 shadow-md active:opacity-90">
            <View className="flex-row items-center justify-center gap-3">
              <FontAwesome6 name="right-from-bracket" size={20} color="white" />
              <Text className="text-white text-lg font-rbold">
                Sair do aplicativo
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
