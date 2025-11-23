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
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Link asChild href="/modals/createPlan">
            <TouchableOpacity className="bg-darkgreen w-12 h-12 rounded-2xl justify-center items-center shadow-md active:opacity-80">
              <FontAwesome6 name="plus" size={20} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <Text className="font-rbold text-4xl color-textcolor mt-2">
          Meus Planos
        </Text>
        <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
      </View>

      {loading ? (
        <View className="flex-1 px-6 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 w-full items-center shadow-md">
            <ActivityIndicator size="large" color="#D5D962" />
            <Text className="mt-4 text-secondary font-rregular text-sm">
              Carregando seus planos…
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
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
            <View>
              <View className="mb-4">
                <Text className="text-secondary font-rbold text-xl">
                  Seus Planos de Treino
                </Text>
                <Text className="text-secondary/60 font-rregular text-sm">
                  {plans.length} {plans.length === 1 ? "plano" : "planos"}
                </Text>
              </View>
              <View className="gap-4">
                {plans.map((plan: any) => (
                  <TouchableOpacity
                    key={plan.id}
                    className="bg-white rounded-3xl p-5 shadow-md active:opacity-90"
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
                        <View className="bg-darkgreen/20 w-14 h-14 rounded-2xl items-center justify-center">
                          <FontAwesome6
                            name="dumbbell"
                            size={24}
                            color="#D5D962"
                          />
                        </View>
                        <Text className="font-rbold text-xl text-secondary flex-1">
                          {plan.name}
                        </Text>
                      </View>
                      <FontAwesome6
                        name="chevron-right"
                        size={20}
                        color="#D5D962"
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <View className="bg-white rounded-3xl p-8 w-full items-center shadow-md">
                <View className="bg-darkgreen/10 w-20 h-20 rounded-full justify-center items-center mb-4">
                  <FontAwesome6 name="file-invoice" size={32} color="#D5D962" />
                </View>
                <Text className="font-rbold text-xl text-secondary mb-2">
                  Nenhum plano criado
                </Text>
                <Text className="font-rregular text-center text-secondary/60 mb-6 px-4">
                  Crie seu primeiro plano de treino para começar
                </Text>
                <Link asChild href="/modals/createPlan">
                  <TouchableOpacity
                    className="bg-darkgreen px-6 py-3 rounded-2xl shadow-md active:opacity-80"
                    activeOpacity={0.9}
                  >
                    <View className="flex-row items-center gap-2">
                      <FontAwesome6 name="plus" size={18} color="white" />
                      <Text className="font-rsemi text-white text-base">
                        Criar Plano
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Plans;
