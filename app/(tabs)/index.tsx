import { Pressable, Text, View, Image } from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { weekDays } from "@/constants/weekDays";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const dayWeek = new Date().getDay();

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 flex-column items-center justify-evenly bg-primary"
    >
      <View className="flex-row justify-between w-11/12 h-9 items-center">
        <Text className="text-3xl font-rbold text-textcolor">Bem vindo,</Text>
        <Link asChild href="/modals/creditsModal">
          <Pressable className="bg-lightgreen w-14 h-14 justify-center items-center rounded-full">
            <MaterialCommunityIcons name="teddy-bear" size={38} color="black" />
          </Pressable>
        </Link>
      </View>
      <Link asChild href="/workoutPlan">
        <Pressable className="flex-row w-11/12 h-16 justify-evenly items-center bg-secondary rounded-3xl">
          <FontAwesome6 name="dumbbell" size={28} color="white" />
          <Text className="text-white font-rsemi text-2xl">
            Acessar treinos
          </Text>
          <FontAwesome6 name="arrow-right" size={38} color="white" />
        </Pressable>
      </Link>
      <View className="flex-row w-11/12 justify-between">
        <View className="w-36 h-36 bg-lightgreen rounded-3xl justify-center items-center">
          <MaterialCommunityIcons name="teddy-bear" size={100} color="black" />
        </View>
        <View className="flex-column justify-evenly items-center">
          <View className="flex-column w-32 items-center">
            <Text className="font-rsemi">Você treinou</Text>
            <Text className="font-rsemi"> x dias esse mês</Text>
          </View>
          <View className="flex-row justify-center h-4">
            <View className="w-40 h-4 bg-stronggreen rounded-full"></View>
            <Text className="font-rbold text-sm">%</Text>
          </View>
        </View>
      </View>
      <Link asChild href="/calendar">
        <Pressable className="w-11/12 h-24 rounded-3xl">
          <View className="flex-row justify-evenly w-full h-16 bg-secondary rounded-3xl">
            {[...Array(5)].map((_, index) => {
              return (
                <View key={index} className="items-center justify-evenly h-14">
                  <Text className="color-white font-rsemi h-6 text-lg">
                    {weekDays[(dayWeek + index - 2 + 7) % 7]}
                  </Text>
                  <View className="w-8 h-2 bg-grayish rounded-full" />
                </View>
              );
            })}
          </View>
          <View className="flex-row justify-end w-full h-8 items-center">
            <Text className="mr-2 font-rsemi">Acessar calendário</Text>
            <FontAwesome6 name="arrow-right" size={20} color="black" />
          </View>
        </Pressable>
      </Link>
      <Link asChild href="/progress">
        <Pressable className="w-11/12 h-56">
          <View className="h-56 bg-lightgreen rounded-3xl justify-center items-center">
            <Image
              resizeMode="contain"
              source={require("../../assets/images/chart-line.png")}
              style={{ height: 175, width: 280 }}
            ></Image>
          </View>
          <View className="flex-row justify-end w-full h-8 items-center">
            <Text className="mr-2 font-rsemi">Acompanhar progresso</Text>
            <FontAwesome6 name="arrow-right" size={20} color="black" />
          </View>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default Index;
