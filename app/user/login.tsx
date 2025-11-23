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
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import { useLoading } from "@/hooks/loadingContext";
import { router } from "expo-router";
import { loginSchema } from "@/types/user";

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const { login } = useAuth();
  const { isLoading } = useLoading();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
      subscription?.remove();
    };
  }, []);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email.trim(), data.password.trim());
      router.replace("/(tabs)");
    } catch (error) {
      router.push({
        pathname: "/modals/customAlert",
        params: {
          title: "Erro",
          message: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: keyboardVisible ? "flex-start" : "center",
            paddingTop: keyboardVisible ? 25 : 0,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            className={`${
              keyboardVisible ? "" : "flex-1 justify-center"
            } items-center px-8`}
          >
            {(!keyboardVisible || screenHeight > 700) && (
              <View className="items-center mb-12">
                <View className="w-32 h-32 bg-lightgreen rounded-full justify-center items-center mb-4">
                  <MaterialCommunityIcons
                    name="teddy-bear"
                    size={80}
                    color="black"
                  />
                </View>
                <Text className="text-4xl font-rbold text-textcolor text-center">
                  GymBro
                </Text>
                <Text className="text-lg font-rregular text-gray-600 text-center mt-2">
                  Seu parceiro de treino
                </Text>
              </View>
            )}

            <View
              className="w-full"
              style={{ marginTop: keyboardVisible ? 20 : 0 }}
            >
              <Text className="text-2xl font-rsemi text-textcolor mb-6">
                Bem-vindo!
              </Text>

              <Text className="text-base font-rregular text-gray-600 mb-2">
                E-mail
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`w-full h-14 bg-white rounded-2xl px-4 text-lg font-rregular border border-gray-200 ${
                      errors.email ? "mb-2" : "mb-4"
                    }`}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    submitBehavior="blurAndSubmit"
                    editable={!isLoading}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mb-4">
                  {errors.email.message}
                </Text>
              )}

              <Text className="text-base font-rregular text-gray-600 mb-2">
                Senha
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className={`relative ${errors.password ? "mb-2" : "mb-6"}`}>
                    <TextInput
                      className="w-full h-14 bg-white rounded-2xl px-4 pr-14 text-lg font-rregular border border-gray-200"
                      placeholder="Sua senha"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-0 h-14 justify-center items-center"
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
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
                <Text className="text-red-500 mb-6">
                  {errors.password.message}
                </Text>
              )}

              <Pressable
                disabled={!isValid || isLoading}
                className={`w-full h-14 mb-6 ${
                  !isValid || isLoading ? "bg-secondary/30 opacity-50" : "bg-darkgreen"
                } rounded-3xl justify-center items-center shadow-md`}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-lg font-rbold">
                  {isLoading ? "Entrando..." : "Entrar"}
                </Text>
              </Pressable>

              <View className="flex flex-row justify-start"> 
                <Text className="text-base font-rregular text-gray-600 mr-2">Não possui conta?</Text>
                <Pressable 
                  onPress={() => router.push("/user/register")}
                  disabled={isLoading}
                >
                  <Text className="text-base font-rsemi text-darkgreen">Registre-se agora</Text>
                </Pressable>
              </View>

            </View>

            <View style={{ height: keyboardVisible ? 100 : 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
