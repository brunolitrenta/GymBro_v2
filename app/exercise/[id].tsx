import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseFormSchema, ExerciseFormData } from "@/types/exercise";
import { useLoading } from "@/hooks/loadingContext";
import api from "@/utils/axiosConfig";
import CustomAlert from "../modals/customAlert";
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

  const workoutBlocked = isWorkoutBlocked === "true";
  const sessionActive = hasActiveSession === "true";
  const completed = isCompleted === "true";
  const isButtonDisabled = workoutBlocked || !sessionActive || completed;

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");

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
      notes: parsedExercise.notes || "",
    },
  });

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      await api.post("/workout/session/set", {
        exerciseId: parsedExercise.id,
        sessionId: sessionId || null,
        userId,
        weight: data.weight,
        sets: data.sets,
        reps: data.reps,
        notes: data.notes || null,
      });

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

      setAlertTitle("Erro");
      setAlertMessage(message);
      setAlertVisible(true);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center bg-primary p-6"
    >
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        actions={
          alertTitle === "Sucesso"
            ? [{ text: "OK", onPress: () => router.back() }]
            : undefined
        }
      />
      <View className="flex-row w-full h-12 justify-between items-center mb-6">
        <TouchableOpacity
          className="h-12 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text className="font-rbold text-xl text-center flex-1">
          {parsedExercise.exerciseDef.name || "Crucifixo com Halter"}
        </Text>
        <View className="h-12 w-10" />
      </View>

      <View className="w-11/12 h-48 justify-center items-center bg-black rounded-3xl mb-6">
        <MaterialCommunityIcons name="image-outline" size={80} color="white" />
      </View>

      <View className="w-full mb-6">
        <View className="flex-row w-full justify-between items-start mb-4">
          <View className="w-[48%] items-center">
            <Text className="text-darkgreen font-rbold text-lg mb-2">
              Repetições
            </Text>
            <Controller
              control={control}
              name="reps"
              render={({ field: { onChange, value } }) => (
                <View className="w-full">
                  <TextInput
                    className={`bg-white border-2 ${
                      errors.reps ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3 w-full font-rsemi text-xl text-center`}
                    value={value > 0 ? value.toString() : ""}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, "");
                      onChange(cleaned ? parseInt(cleaned) : 0);
                    }}
                    placeholder="Ex: 12"
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
          <View className="w-[48%] items-center">
            <Text className="text-darkgreen font-rbold text-lg mb-2">
              Séries
            </Text>
            <Controller
              control={control}
              name="sets"
              render={({ field: { onChange, value } }) => (
                <View className="w-full">
                  <TextInput
                    className={`bg-white border-2 ${
                      errors.sets ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3 w-full font-rsemi text-xl text-center`}
                    value={value > 0 ? value.toString() : ""}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, "");
                      onChange(cleaned ? parseInt(cleaned) : 0);
                    }}
                    placeholder="Ex: 3"
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
        <View className="w-full items-center">
          <Text className="text-darkgreen font-rbold text-lg mb-2">
            Carga (kg)
          </Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <View className="w-full">
                <TextInput
                  className={`bg-white border-2 ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-3 w-full font-rsemi text-xl text-center`}
                  value={value > 0 ? value.toString() : ""}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.]/g, "");
                    onChange(cleaned ? parseFloat(cleaned) : 0);
                  }}
                  placeholder="Ex: 30"
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
      </View>

      <View className="w-full mb-6">
        <Text className="text-darkgreen font-rbold text-lg mb-2">
          Anotações
        </Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <View className="w-full">
              <View
                className={`bg-white border-2 ${
                  errors.notes ? "border-red-500" : "border-gray-300"
                } rounded-xl p-4 h-32`}
              >
                <TextInput
                  className="flex-1 font-rregular text-base text-gray-700"
                  placeholder="Anote aqui suas observações"
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                  value={value}
                  onChangeText={onChange}
                  maxLength={500}
                  autoComplete="off"
                  editable={!isLoading && !isButtonDisabled}
                />
              </View>
              {errors.notes && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.notes.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {isButtonDisabled ? null : (
        <TouchableOpacity
          disabled={!isValid || isLoading || isButtonDisabled}
          className={`w-full rounded-full py-4 items-center ${
            !isValid || isLoading || isButtonDisabled
              ? "bg-stronggreen opacity-50"
              : "bg-stronggreen"
          }`}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="font-rbold text-lg">
            {isLoading ? "Finalizando..." : "Finalizar exercício"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default exercisePage;
