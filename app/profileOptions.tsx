import React, { useState } from "react";
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
} from "react-native";
import CustomAlert from "./modals/customAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { personalDataSchema } from "@/types/user";

type PersonalDataForm = z.infer<typeof personalDataSchema>;

const ProfileOptions = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRefs = React.useRef<{ [key: string]: TextInput | null }>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      height: undefined,
      weight: undefined,
      goal: undefined,
      workoutDays: [],
      medical: "",
    },
  });

  React.useEffect(() => {
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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const focusInput = (inputKey: string) => {
    setTimeout(() => {
      inputRefs.current[inputKey]?.focus();
    }, 100);
  };

  const onSubmit = async (data: PersonalDataForm) => {
    try {
      // Aqui você pode fazer a chamada à API para salvar os dados
      console.log("Dados a serem salvos:", data);

      setAlertTitle("Sucesso");
      setAlertMessage("Dados pessoais salvos com sucesso!");
      setAlertVisible(true);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setAlertTitle("Erro");
      setAlertMessage("Não foi possível salvar os dados pessoais");
      setAlertVisible(true);
    }
  };

  const goalOptions = [
    { value: "weight_loss", label: "Emagrecimento" },
    { value: "muscle_gain", label: "Ganho de massa muscular" },
    { value: "other", label: "Outro" },
  ];

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <SafeAreaView className="flex-1 bg-primary p-6">
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <View className="flex-row w-full justify-between items-center">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-10 items-center justify-center"
          >
            <FontAwesome6 name="arrow-left" size={32} color="black" />
          </Pressable>
          <Text className="font-rbold text-3xl color-textcolor">
            Dados pessoais
          </Text>
          <FontAwesome6 name="user-large" size={28} color="textcolor" />
        </View>

        <ScrollView
          ref={scrollViewRef}
          className={["mt-4 grow"] + (keyboardVisible ? "pb-[300px]" : "pb-[80px]")}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="interactive"
          scrollEventThrottle={16}
        >
          {/* Nome */}
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
                placeholder="Michael Jackson"
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

          {/* E-mail */}
          <Text className="text-sm font-rregular text-gray-600 mb-1">
            E-mail
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={(ref) => (inputRefs.current["email"] = ref)}
                className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                  errors.email ? "mb-2" : "mb-3"
                }`}
                style={{ textAlignVertical: "center" }}
                placeholder="imalive@bahia.com"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                scrollEnabled={false}
                multiline={false}
                numberOfLines={1}
                onSubmitEditing={() => focusInput("height")}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mb-3 text-sm">
              {errors.email.message}
            </Text>
          )}

          {/* Altura */}
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
                placeholder="175.5"
                placeholderTextColor="#9CA3AF"
                value={value ? value.toString() : ""}
                onChangeText={(text) => {
                  const normalizedText = text.replace(",", ".");

                  if (normalizedText === "") {
                    onChange(undefined);
                  } else if (
                    normalizedText === "." ||
                    normalizedText.endsWith(".")
                  ) {
                    onChange(normalizedText);
                  } else {
                    const numericValue = parseFloat(normalizedText);
                    if (!isNaN(numericValue)) {
                      onChange(numericValue);
                    } else {
                      onChange(normalizedText);
                    }
                  }
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

          {/* Peso */}
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
                placeholder="70.5"
                placeholderTextColor="#9CA3AF"
                value={value ? value.toString() : ""}
                onChangeText={(text) => {
                  const normalizedText = text.replace(",", ".");

                  if (normalizedText === "") {
                    onChange(undefined);
                  } else if (
                    normalizedText === "." ||
                    normalizedText.endsWith(".")
                  ) {
                    onChange(normalizedText);
                  } else {
                    const numericValue = parseFloat(normalizedText);
                    if (!isNaN(numericValue)) {
                      onChange(numericValue);
                    } else {
                      onChange(normalizedText);
                    }
                  }
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

          {/* Objetivo */}
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

          {/* Dias de treino */}
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

          {/* Condições médicas */}
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

          {/* Botão Salvar */}
          <Pressable
            disabled={!isValid}
            className={`w-full h-12 mb-4 ${
              !isValid ? "bg-grayish opacity-50" : "bg-lightgreen"
            } rounded-2xl justify-center items-center`}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-black text-base font-rsemi">Salvar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileOptions;
