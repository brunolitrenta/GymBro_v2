import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const { login } = useAuth();

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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha email e senha");
      return;
    }

    try {
      await login(email.trim(), password.trim());
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Ocorreu um erro inesperado");
    }
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
            justifyContent: keyboardVisible ? "flex-start" : "center",
            paddingTop: keyboardVisible ? 40 : 0,
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
              <TextInput
                className="w-full h-14 bg-white rounded-2xl px-4 text-lg font-rregular border border-gray-200 mb-4"
                placeholder="Seu e-mail"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                submitBehavior="blurAndSubmit"
              />

              <Text className="text-base font-rregular text-gray-600 mb-2">
                Senha
              </Text>
              <View className="relative mb-6">
                <TextInput
                  className="w-full h-14 bg-white rounded-2xl px-4 pr-14 text-lg font-rregular border border-gray-200"
                  placeholder="Sua senha"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 h-14 justify-center items-center"
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  style={{ width: 40, height: 56 }}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              <Pressable
                disabled={!email.trim() || !password.trim()}
                className={`w-full h-14 ${
                  !email.trim() || !password.trim()
                    ? "bg-grayish"
                    : "bg-secondary"
                } rounded-2xl justify-center items-center ${
                  !email.trim() || !password.trim() ? "opacity-50" : ""
                }`}
                onPress={handleLogin}
              >
                <Text className="text-white text-lg font-rsemi">Entrar</Text>
              </Pressable>
            </View>

            <View style={{ height: keyboardVisible ? 100 : 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
