import { FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/utils/axiosConfig";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/authContext";

const Plans = () => {
  const { userId } = useAuth();

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = useCallback(
    async (isRefreshing = false) => {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const result = await api.get(`/workout/plan/all/${userId}`);
        setPlans(result.data?.data);
      } catch (error: any) {
        if (error?.name === "CanceledError") return;
        console.error("Erro ao carregar planos:", error);
      } finally {
        if (isRefreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [userId]
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const controller = new AbortController();

      const loadPlans = async () => {
        setLoading(true);
        try {
          const result = await api.get(`/workout/plan/all/${userId}`, {
            signal: controller.signal as any,
          });
          if (!isActive) return;
          setPlans(result.data?.data);
        } catch (error: any) {
          if (error?.name === "CanceledError") return;
          console.error("Erro ao carregar planos:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadPlans();

      return () => {
        isActive = false;
        controller.abort();
      };
    }, [userId])
  );

  const onRefresh = useCallback(() => {
    fetchPlans(true);
  }, [fetchPlans]);

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center bg-primary p-6"
    >
      <View className="flex-row w-full justify-between items-center mb-4">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={32} color="black" />
        </TouchableOpacity>
        <Text className="font-rbold text-2xl">Meus Planos</Text>
        <Link asChild href="/modals/createPlan">
          <TouchableOpacity className="items-center justify-center">
            <FontAwesome6 name="circle-plus" size={40} color="#D5D962" />
          </TouchableOpacity>
        </Link>
      </View>

      {loading ? (
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-3 text-black font-rregular">
            Carregando planos…
          </Text>
        </View>
      ) : (
        <ScrollView
          className="w-full"
          contentContainerStyle={{
            paddingBottom: 80,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#D5D962"]}
              tintColor="#D5D962"
            />
          }
        >
          {plans.length > 0 ? (
            <View className="gap-4">
              {plans.map((plan: any) => (
                <TouchableOpacity
                  key={plan.id}
                  className="w-full bg-white rounded-2xl p-6 border-2 border-black/5 shadow-sm"
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/plan/[name]" as any,
                      params: {
                        planId: plan.id,
                        planName: plan.name,
                      },
                    })
                  }
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4 flex-1">
                      <View className="bg-stronggreen/30 w-14 h-14 rounded-2xl items-center justify-center">
                        <FontAwesome6
                          name="dumbbell"
                          size={24}
                          color="#000"
                        />
                      </View>
                      <Text className="font-rbold text-2xl text-black flex-1">
                        {plan.name}
                      </Text>
                    </View>
                    <FontAwesome6
                      name="chevron-right"
                      size={20}
                      color="#000"
                      style={{ opacity: 0.3 }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-6">
              <FontAwesome6 name="file-invoice" size={64} color="black" />
              <Text className="font-rsemi text-xl mt-4 text-black">
                Nenhum plano criado
              </Text>
              <Text className="font-rregular text-center text-black/70 mt-2">
                Toque no ícone <Text className="font-rsemi">"+"</Text> no canto
                superior direito para criar seu primeiro plano de treino.
              </Text>
              <Link asChild href="/modals/createPlan" >
                <TouchableOpacity
                  className="mt-6 flex-row items-center gap-2 bg-stronggreen px-6 py-3 rounded-full"
                  activeOpacity={0.9}
                >
                  <FontAwesome6 name="circle- plus" size={24} color="black" />
                  <Text className="font-rsemi text-black">Criar plano</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Plans;
