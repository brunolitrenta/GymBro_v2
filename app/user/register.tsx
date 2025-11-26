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
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { registerSchema } from "@/types/user";
import api from "@/utils/axiosConfig";
import { weekDays } from "@/constants/Calendar";
import { useLoading } from "@/hooks/loadingContext";

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const { isLoading } = useLoading();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRefs = React.useRef<{ [key: string]: TextInput | null }>({});
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      userType: undefined,
      gender: undefined,
      birthDate: "",
      weight: "",
      height: "",
      goal: undefined,
      workoutDays: [],
      medical: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenHeight(window.height);
    });
    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
      subscription?.remove();
    };
  }, []);

  const focusInput = (inputKey: string) => {
    setTimeout(() => {
      inputRefs.current[inputKey]?.focus();
    }, 100);
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
        birthdate: data.birthDate || null,
        gender: data.gender || null,
        goal: data.goal || null,
        height: data.height || null,
        weight: data.weight || null,
        workoutDays: data.workoutDays || null,
        medical: data.medical || null,
        type: data.userType,
      });

      console.log("Resposta do registro:", res.data);
      router.replace("/user/login");
    } catch (error: unknown) {
      console.error("Erro ao registrar usuário:", error);
      const err = error as any;
      let message = "Erro ao registrar-se";

      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (Array.isArray(data.errors)) {
          message = data.errors
            .map((e: any) => e.message || e.msg || JSON.stringify(e))
            .join("\n");
        } else {
          try {
            message = JSON.stringify(data);
          } catch {
            message = String(data);
          }
        }
      } else if (err?.message) {
        message = err.message;
      }

      router.push({
        pathname: "/modals/customAlert",
        params: {
          title: "Erro",
          message: message,
          iconName: "triangle-exclamation",
          confirmText: "Entendi",
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            paddingTop: keyboardVisible ? 10 : 40,
            paddingBottom: keyboardVisible ? 300 : 80,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="interactive"
          scrollEventThrottle={16}
          nestedScrollEnabled
        >
          <View className="items-center px-6">
            {(!keyboardVisible || screenHeight > 700) && (
              <View className="items-center mb-6">
                <View className="w-24 h-24 bg-lightgreen rounded-full justify-center items-center mb-3">
                  <MaterialCommunityIcons
                    name="teddy-bear"
                    size={60}
                    color="black"
                  />
                </View>
                <Text className="text-3xl font-rbold text-textcolor text-center">
                  GymBro
                </Text>
                <Text className="text-base font-rregular text-gray-600 text-center mt-1">
                  Seu parceiro de treino
                </Text>
              </View>
            )}
            <View
              className="w-full"
              style={{ marginTop: keyboardVisible ? 10 : 0 }}
            >
              <Text className="text-xl font-rsemi text-textcolor mb-4">
                Crie sua conta
              </Text>
              <Text className={`text-base font-rregular text-gray-600`}>
                Nome *
              </Text>
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
                    onSubmitEditing={() => focusInput("birthDate")}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 mb-3">{errors.name.message}</Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Tipo de usuário *
              </Text>
              <Controller
                control={control}
                name="userType"
                render={({ field: { value, onChange } }) => (
                  <View
                    className={`flex flex-row ${
                      errors.userType ? "mb-2" : "mb-3"
                    }`}
                  >
                    <Pressable
                      disabled={isLoading}    
                      className={`flex-1 h-12 rounded-2xl border ${
                        value === "normal"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center mr-2`}
                      onPress={() => onChange("normal")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "normal" ? "text-black" : "text-gray-600"
                        }`}
                      >
                        Comum
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      className={`flex-1 h-12 rounded-2xl border ${
                        value === "trainer"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center ml-2`}
                      onPress={() => onChange("trainer")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "trainer" ? "text-black" : "text-gray-600"
                        }`}
                      >
                        Treinador
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
              {errors.userType && (
                <Text className="text-red-500 mb-3">
                  {errors.userType.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                E-mail *
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
                    placeholder="Seu e-mail"
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
                    onSubmitEditing={() => focusInput("password")}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mb-3">
                  {errors.email.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Senha *
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className="relative mb-3">
                    <TextInput
                      ref={(ref) => (inputRefs.current["password"] = ref)}
                      className="w-full h-12 bg-white rounded-2xl px-4 py-0 pr-12 text-base font-rregular border border-gray-200"
                      style={{ textAlignVertical: "center" }}
                      placeholder="Sua senha"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="next"
                      scrollEnabled={false}
                      multiline={false}
                      numberOfLines={1}
                      onSubmitEditing={() => focusInput("confirmPassword")}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-0 h-12 justify-center items-center"
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                      style={{ width: 36, height: 48 }}
                      disabled={isLoading}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-red-500 mb-3">
                  {errors.password.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Confirmar senha *
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`relative ${
                      errors.confirmPassword ? "mb-2" : "mb-4"
                    }`}
                  >
                    <TextInput
                      ref={(ref) =>
                        (inputRefs.current["confirmPassword"] = ref)
                      }
                      className="w-full h-12 bg-white rounded-2xl px-4 py-0 pr-12 text-base font-rregular border border-gray-200"
                      style={{ textAlignVertical: "center" }}
                      placeholder="Confirme sua senha"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="done"
                      scrollEnabled={false}
                      multiline={false}
                      numberOfLines={1}
                      onSubmitEditing={() => Keyboard.dismiss()}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-0 h-12 justify-center items-center"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      activeOpacity={0.7}
                      style={{ width: 36, height: 48 }}
                      disabled={isLoading}
                    >
                      <MaterialCommunityIcons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={24}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 mb-4">
                  {errors.confirmPassword.message}
                </Text>
              )}

              <Text className="text-xl font-rsemi text-textcolor mb-4">
                Informações adicionais{" "}
                <Text className="align-center text-sm font-rregular text-secondary">
                  (opcional)
                </Text>
              </Text>

              <Text className={`text-sm font-rregular text-gray-600`}>
                Gênero
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { value, onChange } }) => (
                  <View
                    className={`flex flex-row ${
                      errors.gender ? "mb-2" : "mb-3"
                    }`}
                  >
                    <Pressable
                      disabled={isLoading}
                      className={`flex-1 h-10 rounded-2xl border ${
                        value === "M"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center mr-2`}
                      onPress={() => onChange("M")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "M" ? "text-black" : "text-gray-600"
                        }`}
                      >
                        Homem
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      className={`flex-1 h-10 rounded-2xl border ${
                        value === "F"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center mx-2`}
                      onPress={() => onChange("F")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "F" ? "text-black" : "text-gray-600"
                        }`}
                      >
                        Mulher
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      className={`flex-1 h-10 rounded-2xl border ${
                        value === "O"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center ml-2`}
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
                <Text className="text-red-500 mb-3">
                  {errors.gender.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Data de nascimento
              </Text>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => {
                  const handleDateChange = (text: string) => {
                    let cleaned = text.replace(/\D/g, "");
                    if (cleaned.length > 2 && cleaned.length <= 4) {
                      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
                    } else if (cleaned.length > 4) {
                      cleaned =
                        cleaned.slice(0, 2) +
                        "/" +
                        cleaned.slice(2, 4) +
                        "/" +
                        cleaned.slice(4, 8);
                    }
                    onChange(cleaned);
                  };
                  return (
                    <TextInput
                      ref={(ref) => (inputRefs.current["birthDate"] = ref)}
                      className={`w-full h-12 bg-white rounded-2xl px-4 py-0 text-base font-rregular border border-gray-200 ${
                        errors.birthDate ? "mb-2" : "mb-3"
                      }`}
                      style={{ textAlignVertical: "center" }}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={handleDateChange}
                      keyboardType="numeric"
                      maxLength={10}
                      returnKeyType="next"
                      scrollEnabled={false}
                      multiline={false}
                      numberOfLines={1}
                      onSubmitEditing={() => focusInput("weight")}
                      editable={!isLoading}
                    />
                  );
                }}
              />
              {errors.birthDate && (
                <Text className="text-red-500 mb-3">
                  {errors.birthDate.message}
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
                    onSubmitEditing={() => focusInput("height")}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.weight && (
                <Text className="text-red-500 mb-3">
                  {errors.weight.message}
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
                    onSubmitEditing={() => focusInput("medical")}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.height && (
                <Text className="text-red-500 mb-3">
                  {errors.height.message}
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
                    <Pressable
                      disabled={isLoading}
                      className={`w-full h-12 rounded-2xl border ${
                        value === "weight_loss"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center mb-2`}
                      onPress={() => onChange("weight_loss")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "weight_loss"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Emagrecimento
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      className={`w-full h-12 rounded-2xl border ${
                        value === "muscle_gain"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center mb-2`}
                      onPress={() => onChange("muscle_gain")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "muscle_gain"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Ganho de massa muscular
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      className={`w-full h-12 rounded-2xl border ${
                        value === "other"
                          ? "bg-lightgreen border-lightgreen"
                          : "bg-white border-gray-200"
                      } justify-center items-center`}
                      onPress={() => onChange("other")}
                    >
                      <Text
                        className={`text-base font-rregular ${
                          value === "other" ? "text-black" : "text-gray-600"
                        }`}
                      >
                        Outro
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
              {errors.goal && (
                <Text className="text-red-500 mb-3">{errors.goal.message}</Text>
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
                            disabled={isLoading}
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
                <Text className="text-red-500 mb-3">
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
                    className={`w-full min-h-12 max-h-24 bg-white rounded-2xl px-4 py-2 text-base font-rregular border border-gray-200 ${
                      errors.medical ? "mb-2" : "mb-3"
                    }`}
                    style={{ textAlignVertical: "top" }}
                    placeholder="Condições médicas (até 200 caracteres)"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    scrollEnabled
                    maxLength={200}
                    returnKeyType="next"
                    onSubmitEditing={() => focusInput("email")}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.medical && (
                <Text className="text-red-500 mb-3">
                  {errors.medical.message}
                </Text>
              )}

              <Pressable
                disabled={!isValid || isLoading}
                className={`w-full h-12 mb-4 ${
                  !isValid || isLoading
                    ? "bg-secondary/30 opacity-50"
                    : "bg-darkgreen"
                } rounded-3xl justify-center items-center shadow-md`}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-base font-rbold">
                  {isLoading ? "Registrando..." : "Registrar"}
                </Text>
              </Pressable>
            </View>
            <View style={{ height: keyboardVisible ? 10 : 40 }} />
          </View>
        </ScrollView>

        <View
          className={`absolute bottom-0 left-0 right-0 bg-primary border-t border-gray-200 px-4 py-4 ${
            keyboardVisible ? "hidden" : ""
          }`}
        >
          <Text className="text-xs font-rregular text-gray-600 text-center">
            Já possui conta?{" "}
            <Text
              className="text-xs font-rsemi text-darkgreen"
              onPress={() => router.push("/user/login")}
            >
              Entrar
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
