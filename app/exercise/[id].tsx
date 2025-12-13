import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseFormSchema, ExerciseFormData } from "@/types/exercise";
import { useLoading } from "@/hooks/loadingContext";
import api from "@/utils/axiosConfig";
import { useAuth } from "@/hooks/authContext";

const exercisePage = () => {
  const {
    exercise,
    isWorkoutBlocked,
    hasActiveSession,
    sessionId,
    isCompleted,
  } = useLocalSearchParams<{
    exercise: string;
    isWorkoutBlocked?: string;
    hasActiveSession?: string;
    sessionId?: string;
    isCompleted?: string;
  }>();
  const parsedExercise = JSON.parse(exercise!);
  const { userId } = useAuth();
  const { isLoading } = useLoading();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = (seconds: number) => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      setTimeLeft(0);
    } else {
      if (seconds > 0) {
        setTimeLeft(seconds);
        setIsTimerRunning(true);
      }
    }
  };

  const workoutBlocked = isWorkoutBlocked === "true";
  const sessionActive = hasActiveSession === "true";
  const completed = isCompleted === "true";
  const isButtonDisabled = workoutBlocked || !sessionActive || completed;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    mode: "onChange",
    defaultValues: {
      weight: parsedExercise.weightKg || 0,
      sets: parsedExercise.sets || 0,
      reps: parsedExercise.reps || 0,
      restSeconds: parsedExercise.restSeconds || 0,
      notes: parsedExercise.notes || "",
    },
  });

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      await api.post(
        "/workout/session/set",
        {
          exerciseId: parsedExercise.id,
          sessionId: sessionId || null,
          userId,
          weight: data.weight,
          sets: data.sets,
          restSeconds: data.restSeconds,
          reps: data.reps,
          notes: data.notes || null,
        },
        {
          headers: { "X-Silent": "true" },
        }
      );

      router.back();
    } catch (error: unknown) {
      const err = error as any;
      let message = "Erro ao finalizar exercício";

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardVisible ? 300 : 0,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
                onPress={() => router.back()}
              >
                <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
              </TouchableOpacity>
              <Text className="font-rbold text-2xl text-center flex-1 px-4 text-secondary">
                {parsedExercise.exerciseDef.name || "Exercício"}
              </Text>
              <View className="h-12 w-12" />
            </View>

            <View className="bg-secondary/5 rounded-3xl h-48 justify-center items-center mb-6 overflow-hidden">
              <MaterialCommunityIcons
                name="image-outline"
                size={80}
                color="#D5D962"
                opacity={0.3}
              />
              <Text className="text-secondary/40 font-rregular text-sm mt-2">
                Imagem do exercício
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-secondary font-rbold text-xl mb-4">
                Informações do Treino
              </Text>
              <View className="bg-white rounded-3xl p-5 shadow-md mb-4">
                <View className="flex-row justify-between mb-4">
                  <View className="flex-1 mr-2">
                    <Text className="text-darkgreen font-rsemi text-sm mb-2">
                      REPETIÇÕES
                    </Text>
                    <Controller
                      control={control}
                      name="reps"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          <TextInput
                            className={`bg-secondary/5 border-2 ${
                              errors.reps
                                ? "border-red-500"
                                : "border-secondary/10"
                            } rounded-2xl px-4 py-3 font-rbold text-2xl text-center text-secondary`}
                            value={value > 0 ? value.toString() : ""}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/[^0-9]/g, "");
                              onChange(cleaned ? parseInt(cleaned) : 0);
                            }}
                            placeholder="0"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            autoComplete="off"
                            editable={!isLoading && !isButtonDisabled}
                          />
                          {errors.reps && (
                            <Text className="text-red-500 text-xs mt-1 text-center">
                              {errors.reps.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Text className="text-darkgreen font-rsemi text-sm mb-2">
                      SÉRIES
                    </Text>
                    <Controller
                      control={control}
                      name="sets"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          <TextInput
                            className={`bg-secondary/5 border-2 ${
                              errors.sets
                                ? "border-red-500"
                                : "border-secondary/10"
                            } rounded-2xl px-4 py-3 font-rbold text-2xl text-center text-secondary`}
                            value={value > 0 ? value.toString() : ""}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/[^0-9]/g, "");
                              onChange(cleaned ? parseInt(cleaned) : 0);
                            }}
                            placeholder="0"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            autoComplete="off"
                            editable={!isLoading && !isButtonDisabled}
                          />
                          {errors.sets && (
                            <Text className="text-red-500 text-xs mt-1 text-center">
                              {errors.sets.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-darkgreen font-rsemi text-sm mb-2">
                      CARGA (KG)
                    </Text>
                    <Controller
                      control={control}
                      name="weight"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          <TextInput
                            className={`bg-secondary/5 border-2 ${
                              errors.weight
                                ? "border-red-500"
                                : "border-secondary/10"
                            } rounded-2xl px-4 py-3 font-rbold text-2xl text-center text-secondary`}
                            value={value > 0 ? value.toString() : ""}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/[^0-9.]/g, "");
                              onChange(cleaned ? parseFloat(cleaned) : 0);
                            }}
                            placeholder="0"
                            placeholderTextColor="#999"
                            keyboardType="decimal-pad"
                            autoComplete="off"
                            editable={!isLoading && !isButtonDisabled}
                          />
                          {errors.weight && (
                            <Text className="text-red-500 text-xs mt-1 text-center">
                              {errors.weight.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Text className="text-darkgreen font-rsemi text-sm mb-2">
                      DESCANSO (S)
                    </Text>
                    <Controller
                      control={control}
                      name="restSeconds"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          {isTimerRunning ? (
                            <View className="bg-secondary/5 border-2 border-darkgreen rounded-2xl px-4 py-3 flex-row justify-center items-center">
                              <Text className="font-rbold text-2xl text-darkgreen mr-3">
                                {timeLeft}
                              </Text>
                              <TouchableOpacity onPress={() => toggleTimer(0)}>
                                <FontAwesome6
                                  name="stop"
                                  size={22}
                                  color="#D5D962"
                                />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View className="relative justify-center">
                              <TextInput
                                className={`bg-secondary/5 border-2 ${
                                  errors.restSeconds
                                    ? "border-red-500"
                                    : "border-secondary/10"
                                } rounded-2xl px-4 py-3 font-rbold text-2xl text-center text-secondary`}
                                value={
                                  (value || 0) > 0
                                    ? (value || 0).toString()
                                    : ""
                                }
                                onChangeText={(text) => {
                                  const cleaned = text.replace(/[^0-9]/g, "");
                                  onChange(cleaned ? parseInt(cleaned) : 0);
                                }}
                                placeholder="0"
                                placeholderTextColor="#999"
                                keyboardType="number-pad"
                                autoComplete="off"
                                editable={!isLoading && !isButtonDisabled}
                              />
                              <TouchableOpacity
                                className="absolute right-4"
                                onPress={() => toggleTimer(value || 0)}
                                disabled={!value || value <= 0}
                              >
                                <FontAwesome6
                                  name="play"
                                  size={22}
                                  color={
                                    (value || 0) > 0 ? "#2D3748" : "#A0AEC0"
                                  }
                                />
                              </TouchableOpacity>
                              {errors.restSeconds && (
                                <Text className="text-red-500 text-xs mt-1 text-center">
                                  {errors.restSeconds.message}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      )}
                    />
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-3xl p-5 shadow-md">
                <Text className="text-darkgreen font-rsemi text-sm mb-2">
                  ANOTAÇÕES
                </Text>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput
                        className={`bg-secondary/5 border-2 ${
                          errors.notes
                            ? "border-red-500"
                            : "border-secondary/10"
                        } rounded-2xl p-4 h-28 font-rregular text-base text-secondary`}
                        placeholder="Suas observações sobre o exercício"
                        placeholderTextColor="#999"
                        multiline
                        textAlignVertical="top"
                        value={value}
                        onChangeText={onChange}
                        maxLength={500}
                        autoComplete="off"
                        editable={!isLoading && !isButtonDisabled}
                      />
                      {errors.notes && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.notes.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>

            {!isButtonDisabled && (
              <TouchableOpacity
                disabled={!isValid || isLoading || isButtonDisabled}
                className={`bg-darkgreen rounded-3xl py-5 shadow-lg ${
                  !isValid || isLoading || isButtonDisabled ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="font-rbold text-xl text-white text-center">
                  {isLoading ? "Finalizando..." : "Finalizar Exercício"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default exercisePage;
