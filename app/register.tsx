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
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome obrigatório"),
    gender: z.enum(["M", "F", "O"], {
      message: "Selecione o gênero",
    }),
    birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida"),
    weight: z.union([
      z.number().min(1, { message: "Peso deve ser maior que 0" }),
      z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, { message: "Peso deve ser maior que 0" })
    ]),
    height: z.union([
      z.number().min(1, { message: "Altura deve ser maior que 0" }),
      z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, { message: "Altura deve ser maior que 0" })
    ]),
    goal: z.string().max(200, "Máximo 200 caracteres"),
    medical: z.string().max(200, "Máximo 200 caracteres"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      birthDate: "",
      weight: undefined,
      height: undefined,
      goal: "",
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

  const onSubmit = (data: RegisterForm) => {
    console.log({
      "nome: ": data.name,
      "email: ": data.email,
      "senha: ": data.password,
      birthdate: data.birthDate,
      gender: data.gender,
      goal: data.goal,
      height: data.height,
      weight: data.weight,
      medical: data.medical,
    });
    router.push("/login");
    //api.post
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            paddingTop: keyboardVisible ? 20 : 40,
            paddingBottom: keyboardVisible ? 20 : 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
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
                Nome
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`w-full h-12 bg-white rounded-2xl px-4 text-base font-rregular border border-gray-200 ${
                      errors.name ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Seu nome"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 mb-3">{errors.name.message}</Text>
              )}

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
                      className={`w-full h-12 bg-white rounded-2xl px-4 text-base font-rregular border border-gray-200 ${
                        errors.birthDate ? "mb-2" : "mb-3"
                      }`}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={handleDateChange}
                      keyboardType="numeric"
                      maxLength={10}
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
                    className={`w-full h-12 bg-white rounded-2xl px-4 text-base font-rregular border border-gray-200 ${
                      errors.weight ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Ex: 70.5"
                    placeholderTextColor="#9CA3AF"
                    value={value ? value.toString() : ""}
                    onChangeText={(text) => {
                      const normalizedText = text.replace(',', '.');
                      
                      if (normalizedText === "") {
                        onChange(undefined);
                      } else if (normalizedText === "." || normalizedText.endsWith('.')) {
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
                    className={`w-full h-12 bg-white rounded-2xl px-4 text-base font-rregular border border-gray-200 ${
                      errors.height ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Ex: 175.5"
                    placeholderTextColor="#9CA3AF"
                    value={value ? value.toString() : ""}
                    onChangeText={(text) => {
                      // Substitui vírgula por ponto para padronização
                      const normalizedText = text.replace(',', '.');
                      
                      if (normalizedText === "") {
                        onChange(undefined);
                      } else if (normalizedText === "." || normalizedText.endsWith('.')) {
                        // Permite digitar ponto/vírgula no final
                        onChange(normalizedText);
                      } else {
                        const numericValue = parseFloat(normalizedText);
                        if (!isNaN(numericValue)) {
                          onChange(numericValue);
                        } else {
                          // Mantém o texto se não for um número válido ainda (ex: "7.")
                          onChange(normalizedText);
                        }
                      }
                    }}
                    keyboardType="decimal-pad"
                    maxLength={6}
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
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`w-full min-h-12 max-h-24 bg-white rounded-2xl px-4 py-2 text-base font-rregular border border-gray-200 ${
                      errors.goal ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Seus objetivos (até 200 caracteres)"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    maxLength={200}
                  />
                )}
              />
              {errors.goal && (
                <Text className="text-red-500 mb-3">{errors.goal.message}</Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Complicações médicas
              </Text>
              <Controller
                control={control}
                name="medical"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`w-full min-h-12 max-h-24 bg-white rounded-2xl px-4 py-2 text-base font-rregular border border-gray-200 ${
                      errors.medical ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Complicações médicas (até 200 caracteres)"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    maxLength={200}
                  />
                )}
              />
              {errors.medical && (
                <Text className="text-red-500 mb-3">
                  {errors.medical.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                E-mail
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`w-full h-12 bg-white rounded-2xl px-4 text-base font-rregular border border-gray-200 ${
                      errors.email ? "mb-2" : "mb-3"
                    }`}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mb-3">
                  {errors.email.message}
                </Text>
              )}

              <Text className="text-sm font-rregular text-gray-600 mb-1">
                Senha
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className="relative mb-3">
                    <TextInput
                      className="w-full h-12 bg-white rounded-2xl px-4 pr-12 text-base font-rregular border border-gray-200"
                      placeholder="Sua senha"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-0 h-12 justify-center items-center"
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                      style={{ width: 36, height: 48 }}
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
                Confirmar senha
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
                      className="w-full h-12 bg-white rounded-2xl px-4 pr-12 text-base font-rregular border border-gray-200"
                      placeholder="Confirme sua senha"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-0 h-12 justify-center items-center"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      activeOpacity={0.7}
                      style={{ width: 36, height: 48 }}
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

              <Pressable
                className={`w-full h-12 mb-4 ${
                  Object.keys(errors).length
                    ? "bg-grayish opacity-50"
                    : "bg-secondary"
                } rounded-2xl justify-center items-center`}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-base font-rsemi">Registrar</Text>
              </Pressable>

              <View className="flex flex-row justify-start">
                <Text className="text-sm font-rregular text-gray-600 mr-2">
                  Já possui conta?
                </Text>
                <Pressable onPress={() => router.push("/login")}>
                  <Text className="text-sm font-rsemi text-lightgreen">
                    Entrar
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={{ height: keyboardVisible ? 40 : 20 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
