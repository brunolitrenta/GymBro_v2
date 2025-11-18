import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

const Progress = () => {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-primary"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-6">
          <Text className="font-rbold text-4xl color-textcolor">Progresso</Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-white rounded-3xl p-5 shadow-md">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <FontAwesome6 name="dumbbell" size={20} color="#D5D962" />
              </View>
              <Text className="text-secondary/60 font-rregular text-xs mb-1">
                TREINOS
              </Text>
              <Text className="text-secondary font-rbold text-3xl">0</Text>
              <Text className="text-secondary/60 font-rregular text-xs mt-1">
                este mês
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-3xl p-5 shadow-md">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <FontAwesome6 name="fire" size={20} color="#D5D962" />
              </View>
              <Text className="text-secondary/60 font-rregular text-xs mb-1">
                SEQUÊNCIA
              </Text>
              <Text className="text-secondary font-rbold text-3xl">0</Text>
              <Text className="text-secondary/60 font-rregular text-xs mt-1">
                dias seguidos
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View className="px-6 mb-6">
          <Text className="text-secondary font-rbold text-xl mb-3">
            Atividade Semanal
          </Text>
          <View className="bg-white rounded-3xl p-6 shadow-md">
            <View className="items-center justify-center" style={{height: 200}}>
              <FontAwesome6 name="chart-line" size={64} color="#D5D962" opacity={0.3} />
              <Text className="text-secondary/60 font-rregular text-sm mt-4">
                Gráfico em breve
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Workouts */}
        <View className="px-6">
          <Text className="text-secondary font-rbold text-xl mb-3">
            Treinos Recentes
          </Text>
          <View className="bg-white rounded-3xl p-6 shadow-md">
            <View className="items-center justify-center py-8">
              <View className="bg-darkgreen/10 w-16 h-16 rounded-full items-center justify-center mb-3">
                <FontAwesome6 name="clock-rotate-left" size={28} color="#D5D962" />
              </View>
              <Text className="text-secondary/60 font-rregular text-sm text-center">
                Seus treinos recentes
                aparecerão aqui
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Progress;
