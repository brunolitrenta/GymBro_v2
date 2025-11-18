import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/authContext";
import { useLoading } from "@/hooks/loadingContext";
import api from "@/utils/axiosConfig";

const schema = z.object({
  name: z.string().trim().min(1, "Informe o nome do plano"),
});

type FormData = z.infer<typeof schema>;

const CreatePlan = () => {
  const { userId } = useAuth();
  const { isLoading } = useLoading();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/workout/plan", {
        name: data.name,
        authorId: userId,
      });
      router.back();
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
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
          <View className="bg-darkgreen/10 w-16 h-16 rounded-2xl items-center justify-center mb-4">
            <FontAwesome6 name="file-invoice" size={28} color="#D5D962" />
          </View>
          <Text className="text-3xl font-rbold text-secondary">Novo Plano</Text>
          <Text className="text-sm font-rregular text-secondary/60 mt-1">Crie um novo plano de treino</Text>
        </View>

        <View className="mb-6">
          <Text className="text-darkgreen font-rsemi text-sm mb-2">NOME DO PLANO</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => {
              const [focused, setFocused] = useState(false);
              return (
                <TextInput
                  placeholder="Ex: Treino de Hipertrofia"
                  placeholderTextColor="#999"
                  className={`bg-secondary/5 border-2 rounded-2xl px-4 py-3 font-rregular text-base text-secondary ${
                    errors.name ? "border-red-500" : focused ? "border-darkgreen" : "border-secondary/10"
                  }`}
                  onBlur={() => {
                    onBlur();
                    setFocused(false);
                  }}
                  onFocus={() => setFocused(true)}
                  onChangeText={onChange}
                  value={value}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!isLoading}
                />
              );
            }}
          />
          {errors.name && (
            <Text className="text-red-500 mt-2 font-rregular text-xs">
              {errors.name.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-secondary/10 py-4 rounded-2xl items-center"
          >
            <Text className="text-secondary font-rsemi text-base">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isSubmitting || isLoading}
            onPress={handleSubmit(onSubmit)}
            className={`flex-1 bg-darkgreen py-4 rounded-2xl items-center ${
              isSubmitting || isLoading ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white font-rbold text-base">
              {isSubmitting || isLoading ? "Salvando..." : "Criar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreatePlan;
