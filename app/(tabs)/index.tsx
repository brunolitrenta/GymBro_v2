import { Pressable, Text, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { weekDays } from "@/constants/Calendar";
import { useAuth } from "@/hooks/authContext";

const Index = () => {
  const dayWeek = new Date().getDay();
  const { userName } = useAuth();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-sm font-rregular text-secondary/60">
                Bem-vindo de volta,
              </Text>
              <Text className="text-3xl font-rbold text-textcolor mt-1">
                {userName}!
              </Text>
            </View>
            <Link asChild href="/modals/credits">
              <Pressable className="bg-lightgreen w-14 h-14 justify-center items-center rounded-2xl shadow-md active:opacity-80">
                <MaterialCommunityIcons name="teddy-bear" size={38} color="black" />
              </Pressable>
            </Link>
          </View>
        </View>
      <View className="px-6 mb-6">
        <Link asChild href="/plans">
          <Pressable className="bg-darkgreen rounded-3xl p-5 shadow-lg active:opacity-90">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center">
                  <FontAwesome6 name="dumbbell" size={24} color="white" />
                </View>
                <Text className="text-white font-rbold text-xl flex-1">
                  Meus planos de treino
                </Text>
              </View>
              <FontAwesome6 name="arrow-right" size={24} color="white" />
            </View>
          </Pressable>
        </Link>
      </View>
      <View className="px-6 mb-6">
        <View className="bg-white rounded-3xl p-6 shadow-md">
          <View className="flex-row items-center gap-4">
            <View className="bg-lightgreen rounded-2xl p-4">
              <MaterialCommunityIcons name="teddy-bear" size={64} color="black" />
            </View>
            <View className="flex-1">
              <Text className="font-rsemi text-secondary/60 text-sm mb-1">
                ESTE MÊS
              </Text>
              <Text className="font-rbold text-2xl text-secondary mb-2">
                x dias de treino
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                  <View className="h-full bg-darkgreen rounded-full" style={{width: '0%'}} />
                </View>
                <Text className="font-rbold text-sm text-secondary">0%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="px-6 mb-6">
        <Text className="font-rbold text-xl text-secondary mb-3">
          Calendário Semanal
        </Text>
        <Link asChild href="/calendar">
          <Pressable className="bg-white rounded-3xl p-5 shadow-md active:opacity-90">
            <View className="flex-row justify-between mb-4">
              {[...Array(5)].map((_, index) => {
                const isToday = index === 2;
                return (
                  <View key={index} className={`items-center ${isToday ? 'bg-darkgreen/10 px-3 py-2 rounded-2xl' : 'px-3 py-2'}`}>
                    <Text className={`font-rsemi text-sm mb-2 ${isToday ? 'text-darkgreen' : 'text-secondary/60'}`}>
                      {weekDays[(dayWeek + index - 2 + 7) % 7]}
                    </Text>
                    <View className={`w-8 h-2 rounded-full ${isToday ? 'bg-darkgreen' : 'bg-secondary/20'}`} />
                  </View>
                );
              })}
            </View>
            <View className="flex-row items-center justify-end gap-2">
              <Text className="font-rsemi text-sm text-darkgreen">Ver calendário completo</Text>
              <FontAwesome6 name="arrow-right" size={16} color="#D5D962" />
            </View>
          </Pressable>
        </Link>
      </View>
      <View className="px-6">
        <Text className="font-rbold text-xl text-secondary mb-3">
          Seu Progresso
        </Text>
        <Link asChild href="/progress">
          <Pressable className="bg-white rounded-3xl overflow-hidden shadow-md active:opacity-90">
            <View className="bg-lightgreen/30 h-48 justify-center items-center">
              <Image
                resizeMode="contain"
                source={require("../../assets/images/chart-line.png")}
                style={{ height: 160, width: 260 }}
              />
            </View>
            <View className="p-5 flex-row items-center justify-between bg-white">
              <View className="flex-1">
                <Text className="font-rbold text-base text-secondary">Acompanhe sua evolução</Text>
                <Text className="font-rregular text-sm text-secondary/60 mt-1">Visualize gráficos e estatísticas</Text>
              </View>
              <FontAwesome6 name="arrow-right" size={20} color="#D5D962" />
            </View>
          </Pressable>
        </Link>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
