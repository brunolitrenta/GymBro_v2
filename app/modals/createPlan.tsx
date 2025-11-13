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
    <View className="flex-1 items-center justify-center bg-transparent">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="w-full h-full bg-black opacity-50 fixed"
      />
      <View className="bg-primary w-11/12 rounded-2xl items-center py-6 gap-4 absolute">
        <View className="flex-row w-5/6 justify-between items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-12 w-10 items-center justify-center"
          >
            <FontAwesome6 name="arrow-left" size={32} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-rsemi">Novo plano</Text>
          <FontAwesome6 name="file-invoice" size={32} color="black" />
        </View>

        <View className="w-5/6">
          <Text className="text-black font-rsemi mb-1">Nome do plano</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => {
              const [focused, setFocused] = useState(false);
              const baseInputClass =
                "w-full h-12 bg-white rounded-xl px-4 py-0 font-rregular text-black border";
              const borderClass = errors.name
                ? "border-red-600"
                : focused
                ? "border-stronggreen"
                : "border-black/30";
              return (
                <TextInput
                  placeholder="Digite o nome do plano"
                  placeholderTextColor="#555"
                  className={`${baseInputClass} ${borderClass}`}
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
            <Text className="text-red-600 mt-1 font-rregular text-sm">
              {errors.name.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          disabled={isSubmitting || isLoading}
          onPress={handleSubmit(onSubmit)}
          className={`w-5/6 py-4 rounded-full mt-2 items-center ${
            isSubmitting || isLoading ? "bg-grayish opacity-50" : "bg-stronggreen"
          }`}
        >
          <Text className="text-black font-rsemi text-lg">
            {isSubmitting || isLoading ? "Salvando..." : "Criar plano"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePlan;
