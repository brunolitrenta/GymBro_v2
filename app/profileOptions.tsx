import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { personalDataSchema } from "@/types/user";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";

type PersonalDataForm = z.infer<typeof personalDataSchema>;

const ProfileOptions = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalData, setOriginalData] = useState<PersonalDataForm | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRefs = React.useRef<{ [key: string]: TextInput | null }>({});
  const { userId } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PersonalDataForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      gender: undefined,
      birthDate: "",
      height: "",
      weight: "",
      goal: undefined,
      workoutDays: [],
      medical: "",
    },
  });

  const normalizeNumericValue = React.useCallback(
    (
      value:
        | PersonalDataForm["height"]
        | PersonalDataForm["weight"]
        | undefined
    ) => {
      if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseFloat(value.replace(",", "."));
        return Number.isFinite(parsed) ? parsed : undefined;
      }
      return undefined;
    },
    []
  );

  const arraysEqual = React.useCallback(
    (
      a: (number | undefined)[] = [],
      b: (number | undefined)[] = []
    ) => {
      const filteredA = a.filter((val): val is number => typeof val === "number");
      const filteredB = b.filter((val): val is number => typeof val === "number");

      if (filteredA.length !== filteredB.length) {
        return false;
      }

      const sortedA = [...filteredA].sort();
      const sortedB = [...filteredB].sort();

      return sortedA.every((val, idx) => val === sortedB[idx]);
    },
    []
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = watch((formData) => {
      if (!originalData) return;
      
      const changed = 
        formData.name !== originalData.name ||
        formData.gender !== originalData.gender ||
        formData.birthDate !== originalData.birthDate ||
        normalizeNumericValue(formData.height) !==
          normalizeNumericValue(originalData.height) ||
        normalizeNumericValue(formData.weight) !==
          normalizeNumericValue(originalData.weight) ||
        formData.goal !== originalData.goal ||
        !arraysEqual(formData.workoutDays || [], originalData.workoutDays || []) ||
        (formData.medical ?? "") !== (originalData.medical ?? "");

      setHasChanges(changed);
    });

    return () => subscription.unsubscribe();
  }, [watch, originalData, normalizeNumericValue, arraysEqual]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingData(true);
        const response = await api.get(`/users/${userId}`, {
          headers: {
            "X-Silent": "true",
          },
        });

        const userData = response.data?.data;

        if (userData) {
          let formattedBirthDate = "";
          if (userData.birthDate) {
            const date = new Date(userData.birthDate);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            formattedBirthDate = `${day}/${month}/${year}`;
          }

          const formData = {
            name: userData.name || "",
            email: userData.email || "",
            gender: userData.gender || undefined,
            birthDate: formattedBirthDate,
            height:
              userData.height !== undefined && userData.height !== null
                ? String(userData.height)
                : "",
            weight:
              userData.weight !== undefined && userData.weight !== null
                ? String(userData.weight)
                : "",
            goal: userData.goal || undefined,
            workoutDays: userData.workoutDays || [],
            medical: userData.medical || "",
          };

          setOriginalData(formData);
          reset(formData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        router.push({
          pathname: "/modals/customAlert",
          params: {
            title: "Erro",
            message: "Não foi possível carregar os dados do usuário",
            iconName: "triangle-exclamation",
            confirmText: "Entendi",
          },
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, reset]);


  const focusInput = (inputKey: string) => {
    setTimeout(() => {
      inputRefs.current[inputKey]?.focus();
    }, 100);
  };

  const onSubmit = async (data: PersonalDataForm) => {
    try {
      let isoDate = undefined;
      if (data.birthDate) {
        const [day, month, year] = data.birthDate.split("/");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        isoDate = date.toISOString();
      }

      if (!originalData) {
        const fallbackPayload = {
          name: data.name,
          gender: data.gender,
          birthDate: isoDate,
          height: normalizeNumericValue(data.height),
          weight: normalizeNumericValue(data.weight),
          goal: data.goal,
          workoutDays: data.workoutDays,
          medical: data.medical,
        };

        await api.put(`/users/${userId}`, fallbackPayload);
        router.back();
        return;
      }

      const payload: Record<string, unknown> = {};

      if (data.name !== originalData.name) {
        payload.name = data.name;
      }

      if (data.gender !== originalData.gender) {
        payload.gender = data.gender;
      }

      if (data.birthDate !== originalData.birthDate) {
        payload.birthDate = isoDate;
      }

      const normalizedHeight = normalizeNumericValue(data.height);
      const originalHeight = normalizeNumericValue(originalData.height);

      if (normalizedHeight !== originalHeight) {
        payload.height = normalizedHeight ?? null;
      }

      const normalizedWeight = normalizeNumericValue(data.weight);
      const originalWeight = normalizeNumericValue(originalData.weight);

      if (normalizedWeight !== originalWeight) {
        payload.weight = normalizedWeight ?? null;
      }

      if (data.goal !== originalData.goal) {
        payload.goal = data.goal;
      }

      if (
        !arraysEqual(data.workoutDays || [], originalData.workoutDays || [])
      ) {
        payload.workoutDays = data.workoutDays;
      }

      if ((data.medical ?? "") !== (originalData.medical ?? "")) {
        payload.medical = data.medical ?? "";
      }

      if (Object.keys(payload).length === 0) {
        router.back();
        return;
      }

      await api.put(`/users/${userId}`, payload);

      router.back();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const goalOptions = [
    { value: "weight_loss", label: "Emagrecimento" },
    { value: "muscle_gain", label: "Ganho de massa muscular" },
    { value: "other", label: "Outro" },
  ];

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  if (isLoadingData) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            >
              <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
            </Pressable>
            <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center">
              <FontAwesome6 name="user-large" size={24} color="#D5D962" />
            </View>
          </View>
          <Text className="font-rbold text-4xl color-textcolor">
            Dados Pessoais
          </Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#D5D962" />
          <Text className="text-textcolor font-rregular mt-4">
            Carregando dados...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            >
              <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
            </Pressable>
            <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center">
              <FontAwesome6 name="user-large" size={24} color="#D5D962" />
            </View>
          </View>
          <Text className="font-rbold text-4xl color-textcolor">
            Dados Pessoais
          </Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="px-6"
          contentContainerStyle={{
            paddingBottom: keyboardVisible ? 300 : 80,
            paddingTop: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="interactive"
          scrollEventThrottle={16}
        >
          <Text className="text-sm font-rregular text-gray-600 mb-1">Nome</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["name"] = ref)}
                className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                  errors.name ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="Seu nome"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                returnKeyType="next"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
                onSubmitEditing={() => focusInput("email")}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.name.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            E-mail
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["email"] = ref)}
                className={`w-full h-12 bg-gray-100 rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 opacity-60 ${
                  errors.email ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="Seu e-mail"
                placeholderTextColor="#9CA3AF"
                value={value}
                editable={false}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.email.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Gênero
          </Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <View
                className={`flex flex-row justify-between ${
                  errors.gender ? "mb-2" : "mb-3"
                }`}
              >
                <Pressable
                  className={`flex-1 h-12 rounded-2xl border mx-0.5 ${
                    value === "M"
                      ? "bg-lightgreen border-lightgreen"
                      : "bg-white border-gray-200"
                  } justify-center items-center`}
                  onPress={() => onChange("M")}
                >
                  <Text
                    className={`text-base font-rregular ${
                      value === "M" ? "text-black" : "text-gray-600"
                    }`}
                  >
                    Masculino
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 h-12 rounded-2xl border mx-0.5 ${
                    value === "F"
                      ? "bg-lightgreen border-lightgreen"
                      : "bg-white border-gray-200"
                  } justify-center items-center`}
                  onPress={() => onChange("F")}
                >
                  <Text
                    className={`text-base font-rregular ${
                      value === "F" ? "text-black" : "text-gray-600"
                    }`}
                  >
                    Feminino
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 h-12 rounded-2xl border mx-0.5 ${
                    value === "O"
                      ? "bg-lightgreen border-lightgreen"
                      : "bg-white border-gray-200"
                  } justify-center items-center`}
                  onPress={() => onChange("O")}
                >
                  <Text
                    className={`text-base font-rregular ${
                      value === "O" ? "text-black" : "text-gray-600"
                    }`}
                  >
                    Outro
                  </Text>
                </Pressable>
              </View>
            )}
          />
          {errors.gender && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.gender.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Data de Nascimento
          </Text>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["birthDate"] = ref)}
                className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                  errors.birthDate ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={(text) => {
                  let formatted = text.replace(/\D/g, "");
                  if (formatted.length > 2) {
                    formatted =
                      formatted.slice(0, 2) + "/" + formatted.slice(2);
                  }
                  if (formatted.length > 5) {
                    formatted =
                      formatted.slice(0, 5) + "/" + formatted.slice(5, 9);
                  }
                  onChange(formatted);
                }}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="next"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
                onSubmitEditing={() => focusInput("height")}
              />
            )}
          />
          {errors.birthDate && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.birthDate.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Altura (cm)
          </Text>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["height"] = ref)}
                className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                  errors.height ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="Ex: 175.5"
                placeholderTextColor="#9CA3AF"
                value={(value as string) ?? ""}
                onChangeText={(text) => {
                  const normalizedText = text.replace(",", ".");
                  onChange(normalizedText === "" ? "" : normalizedText);
                }}
                keyboardType="decimal-pad"
                maxLength={6}
                returnKeyType="next"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
                onSubmitEditing={() => focusInput("weight")}
              />
            )}
          />
          {errors.height && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.height.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Peso (kg)
          </Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["weight"] = ref)}
                className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                  errors.weight ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="Ex: 70.5"
                placeholderTextColor="#9CA3AF"
                value={(value as string) ?? ""}
                onChangeText={(text) => {
                  const normalizedText = text.replace(",", ".");

                  onChange(normalizedText === "" ? "" : normalizedText);
                }}
                keyboardType="decimal-pad"
                maxLength={6}
                returnKeyType="next"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            )}
          />
          {errors.weight && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.weight.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Objetivo
          </Text>
          <Controller
            control={control}
            name="goal"
            render={({ field: { value, onChange } }) => (
              <View
                className={`flex flex-col ${errors.goal ? "mb-2" : "mb-3"}`}
              >
                {goalOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    className={`w-full h-12 rounded-2xl border ${
                      value === option.value
                        ? "bg-lightgreen border-lightgreen"
                        : "bg-white border-gray-200"
                    } justify-center items-center mb-2`}
                    onPress={() => onChange(option.value)}
                  >
                    <Text
                      className={`text-base font-rregular ${
                        value === option.value ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
          {errors.goal && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.goal.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-2">
            Dias de treino
          </Text>
          <Controller
            control={control}
            name="workoutDays"
            render={({ field: { value = [], onChange } }) => (
              <View className={`${errors.workoutDays ? "mb-2" : "mb-3"}`}>
                <View className="flex flex-row justify-between">
                  {weekDays.map((day, index) => {
                    const isSelected = value.includes(index);
                    return (
                      <Pressable
                        key={index}
                        className={`flex-1 h-12 rounded-2xl border mx-0.5 ${
                          isSelected
                            ? "bg-lightgreen border-lightgreen"
                            : "bg-white border-gray-200"
                        } justify-center items-center shadow-sm`}
                        onPress={() => {
                          if (isSelected) {
                            onChange(value.filter((d) => d !== index));
                          } else {
                            onChange([...value, index].sort());
                          }
                        }}
                      >
                        <Text
                          className={`text-sm font-rsemi ${
                            isSelected ? "text-black" : "text-gray-600"
                          }`}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          />
          {errors.workoutDays && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.workoutDays.message}
            </Text>
          )}

          <Text className="text-sm font-rregular text-gray-600 mb-1">
            Condições médicas
          </Text>
          <Controller
            control={control}
            name="medical"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["medical"] = ref)}
                className={`w-full min-h-12 max-h-24 bg-white rounded-2xl px-4 py-3 text-base font-rregular border border-gray-200 ${
                  errors.medical ? "mb-2" : "mb-6"
                }`}
                style={{ textAlignVertical: "top" }}
                placeholder="Coloque aqui qualquer condição médica relevante"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                multiline
                scrollEnabled
                maxLength={200}
                returnKeyType="done"
              />
            )}
          />
          {errors.medical && (
            <Text className="text-red-500 mb-6 text-sm">
              {errors.medical.message}
            </Text>
          )}

          <Pressable
            disabled={!hasChanges}
            className={`w-full h-12 mb-4 ${
              !hasChanges ? "bg-secondary/30 opacity-50" : "bg-darkgreen"
            } rounded-3xl justify-center items-center shadow-md`}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-base font-rbold">Salvar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileOptions;
