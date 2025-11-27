import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { workoutLabels } from "@/constants/workoutLabels";
import { bodyAreas } from "@/constants/BodyAreas";
import { ISaveWorkout } from "@/interfaces/ISaveWorkout";
import { useLoading } from "@/hooks/loadingContext";
import api from "@/utils/axiosConfig";
import { CustomPicker } from "@/components/CustomPicker";

const CreateWorkout = () => {
  const { planId, existingWorkoutNames } = useLocalSearchParams();

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [bodyAreaSelected, setBodyAreaSelected] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string[]>([]);

  const [buttonsDisabled, setButtonsDisabled] = useState<string[]>([]);

  const [workoutData, setWorkoutData] = useState<any[]>([]);

  const { isLoading, withLoading } = useLoading();

  const bodyAreaItems = useMemo(
    () => [
      { label: "Todas as partes do corpo", value: "__all__" },
      ...bodyAreas.map((area) => ({ label: area, value: area })),
    ],
    []
  );

  const handleBodyAreaChange = (value: string) => {
    if (value === "__all__") {
      setBodyAreaSelected(null);
    } else {
      setBodyAreaSelected(value);
    }
  };

  const labelsSelecionadas = (arrayDeObjetos: ISaveWorkout[]) => {
    const labels: { [key: string]: boolean } = {};
    arrayDeObjetos.forEach((objeto) => {
      labels[!objeto.label ? 0 : objeto.label] = true;
    });
    setButtonsDisabled(Object.keys(labels));
  };

  function filterData() {
    const filteredData = workoutData.filter(
      (ex) => ex.primaryMuscles[0].muscleGroup.name === bodyAreaSelected
    );

    return filteredData;
  }


  function showAlert(title: string, message: string) {
    router.push({
      pathname: "/modals/customAlert",
      params: {
        title,
        message,
        iconName: "triangle-exclamation",
        confirmText: "Entendi",
      },
    });
  }

  async function addWorkout() {
    if (!selectedLabel && selectedId.length === 0) {
      showAlert(
        "Atenção",
        "Você precisa preencher todos as informações do seu novo treino."
      );
      return;
    } else if (selectedId.length === 0) {
      showAlert("Atenção", "Você precisa selecionar os exercícios desejados.");
      return;
    } else if (!selectedLabel) {
      showAlert("Atenção", "Você precisa escolher uma etiqueta.");
      return;
    }

    try {
      const result = await api.post("/workout", {
        planId,
        label: selectedLabel,
        exerciseIds: selectedId,
      });
      router.back();
    } catch (error) {
      console.error("Erro ao enviar treino:", error);
    }
  }

  useEffect(() => {
    if (existingWorkoutNames) {
      try {
        const parsedNames = JSON.parse(existingWorkoutNames as string);
        setButtonsDisabled(parsedNames);
      } catch (error) {
        console.error("Erro ao parsear nomes dos treinos:", error);
        setButtonsDisabled([]);
      }
    } else {
      setButtonsDisabled([]);
    }
  }, [existingWorkoutNames]);

  function renderExercise({ item }: { item: any }) {
    const foundId = selectedId.find((id) => id === item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (foundId) {
            setSelectedId(selectedId.filter((id) => id !== item.id));
          } else {
            setSelectedId((pvs) => [...pvs, item.id]);
          }
        }}
        className={`w-full rounded-2xl p-4 mb-3 flex-row justify-between items-center ${
          foundId
            ? "bg-darkgreen/10 border-2 border-darkgreen"
            : "bg-secondary/5 border-2 border-transparent"
        }`}
      >
        <View
          className={`w-14 h-14 rounded-2xl justify-center items-center ${
            foundId ? "bg-darkgreen" : "bg-secondary/20"
          }`}
        >
          <MaterialCommunityIcons
            name="dumbbell"
            size={28}
            color={foundId ? "white" : "#60665E"}
          />
        </View>
        <View className="flex-1 mx-3">
          <Text
            className={`font-rbold text-base text-secondary`}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.primaryMuscles && item.primaryMuscles[0] && (
            <Text
              className="font-rregular text-xs mt-1 text-secondary/60"
            >
              {item.primaryMuscles[0].muscleGroup.name}
            </Text>
          )}
        </View>
        <View
          className={`w-10 h-10 rounded-2xl justify-center items-center ${
            foundId ? "bg-darkgreen" : "bg-secondary/10"
          }`}
        >
          {foundId ? (
            <FontAwesome6 size={18} name="check" color="#FFFFFF" />
          ) : (
            <View className="w-5 h-5 rounded-full border-2 border-secondary/30" />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await withLoading(
          api.get("/workout/exercises/all").then((response) => {
            setWorkoutData(response.data.data);
          })
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [withLoading]);

  return (
    <View
      className="flex-1 justify-center items-center bg-black/50"
    >
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full absolute"
      />
      <View className="w-11/12 h-5/6 bg-white rounded-3xl items-center shadow-2xl">
        <View className="w-full px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
              onPress={() => router.back()}
            >
              <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
            </TouchableOpacity>
            <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center">
              <FontAwesome6 name="dumbbell" size={24} color="#D5D962" />
            </View>
          </View>
          <Text className="font-rbold text-3xl text-secondary">Novo Treino</Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>
        <View className="w-11/12 px-2 mb-4">
          <Text className="text-secondary font-rbold text-lg mb-3">
            Etiqueta do Treino
          </Text>
          <View className="bg-secondary/5 rounded-2xl p-4">
            <View className="flex-row justify-around">
              {workoutLabels.map((label, index) => {
                const foundButton = buttonsDisabled.find(
                  (button) => button === label
                );

                return (
                  <Pressable
                    disabled={foundButton ? true : false}
                    onPress={() => setSelectedLabel(label)}
                    key={index}
                  >
                    <Text
                      className={
                        foundButton
                          ? "font-rbold text-5xl text-secondary opacity-30"
                          : selectedLabel === label
                          ? "font-rbold text-5xl text-darkgreen"
                          : "font-rbold text-5xl text-secondary"
                      }
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
        <View className="w-11/12 px-2 mb-4">
          <Text className="text-secondary font-rbold text-lg mb-3">
            Filtrar Exercícios
          </Text>
          <CustomPicker
            items={bodyAreaItems}
            selectedValue={bodyAreaSelected ?? "__all__"}
            onValueChange={handleBodyAreaChange}
            placeholder="Todas as partes do corpo"
            emptyMessage="Nenhuma parte do corpo disponível"
          />
        </View>

        
        <View className="flex-1 w-11/12 px-2">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-secondary font-rbold text-lg">
              Exercícios
            </Text>
            {selectedId.length > 0 && (
              <View className="bg-darkgreen/10 px-3 py-1.5 rounded-full">
                <Text className="text-darkgreen font-rbold text-xs">
                  {selectedId.length} selecionado
                  {selectedId.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#D5D962" />
              <Text className="text-secondary font-rregular text-sm mt-2">
                Carregando exercícios...
              </Text>
            </View>
          ) : (
            <FlatList
              data={!bodyAreaSelected ? workoutData : filterData()}
              renderItem={renderExercise}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <View className="w-full px-6 py-4 border-t border-secondary/10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              addWorkout();
            }}
            className="w-full py-4 bg-darkgreen rounded-2xl items-center shadow-md"
          >
            <Text className="text-white text-lg font-rbold">Adicionar Treino</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreateWorkout;
