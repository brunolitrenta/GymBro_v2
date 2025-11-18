import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { workoutLabels } from "@/constants/workoutLabels";
import { bodyAreas } from "@/constants/BodyAreas";
import { ISaveWorkout } from "@/interfaces/ISaveWorkout";
import { useLoading } from "@/hooks/loadingContext";
import CustomAlert from "./customAlert";
import api from "@/utils/axiosConfig";

const CreateWorkout = () => {
  const { planId } = useLocalSearchParams();

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [bodyAreaSelected, setBodyAreaSelected] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string[]>([]);

  const [buttonsDisabled, setButtonsDisabled] = useState<string[]>([]);

  const [workoutData, setWorkoutData] = useState<any[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownButtonRef = useRef<View>(null);

  const { isLoading, withLoading } = useLoading();

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
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
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
      console.log(result.data);
      router.back();
    } catch (error) {
      console.error("Erro ao enviar treino:", error);
    }
  }

  useEffect(() => {
    labelsSelecionadas([]);
  }, []);

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
            ? "bg-stronggreen border-2 border-darkgreen"
            : "bg-lightgreen border-2 border-transparent"
        }`}
        style={{
          shadowColor: foundId ? "#0D0D0D" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: foundId ? 5 : 2,
        }}
      >
        <View
          className={`w-14 h-14 rounded-xl justify-center items-center ${
            foundId ? "bg-darkgreen" : "bg-black"
          }`}
        >
          <MaterialCommunityIcons
            name="image-outline"
            size={32}
            color="white"
          />
        </View>
        <View className="flex-1 mx-3">
          <Text
            className={`font-rbold text-base ${
              foundId ? "text-textcolor" : "text-textcolor"
            }`}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.primaryMuscles && item.primaryMuscles[0] && (
            <Text
              className={`font-rregular text-xs mt-1 ${
                foundId ? "text-textcolor opacity-80" : "text-reallygray"
              }`}
            >
              {item.primaryMuscles[0].muscleGroup.name}
            </Text>
          )}
        </View>
        <View
          className={`w-10 h-10 rounded-full justify-center items-center ${
            foundId ? "bg-darkgreen" : "bg-grayish"
          }`}
        >
          {foundId ? (
            <FontAwesome6 size={20} name="check" color="#FFFFFF" />
          ) : (
            <View className="w-5 h-5 rounded-full border-2 border-reallygray" />
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
            console.log(response.data.data[0]);
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
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: "transparent" }}
    >
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full bg-black opacity-50 fixed"
      ></Pressable>
      <View className="w-11/12 h-5/6 bg-primary rounded-3xl absolute items-center gap-8 pt-8">
        <View className="flex-row w-5/6 h-8 justify-between items-center">
          <TouchableOpacity
            className="h-12 w-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={32} color="#0d0d0d" />
          </TouchableOpacity>
          <Text className="font-rbold text-3xl text-textcolor">
            Novo treino
          </Text>
          <FontAwesome6 name="dumbbell" size={28} color="#0d0d0d" />
        </View>
        <View className="w-11/12">
          <Text className="text-textcolor font-rbold ml-2 text-xl">
            Etiqueta
          </Text>
          <View className="flex-row w-full justify-around">
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
                        ? "font-rbold text-5xl text-secondary opacity-50"
                        : selectedLabel === label
                        ? "font-rbold text-5xl text-lightgreen"
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
        <View className="w-11/12">
          <Text className="text-textcolor font-rbold ml-2 text-xl mb-2">
            Filtro
          </Text>
          <View ref={dropdownButtonRef} className="w-full">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                dropdownButtonRef.current?.measure(
                  (x, y, width, height, pageX, pageY) => {
                    setDropdownPosition({
                      top: pageY + height,
                      left: pageX,
                      width,
                    });
                    setIsDropdownOpen(!isDropdownOpen);
                  }
                );
              }}
              className="w-full bg-grayish rounded-2xl px-4 py-3 flex-row justify-between items-center border-2 border-reallygray"
            >
              <Text
                className={`font-rregular text-lg ${
                  bodyAreaSelected ? "text-textcolor" : "text-reallygray"
                }`}
              >
                {bodyAreaSelected || "Filtre por uma parte do corpo"}
              </Text>
              <FontAwesome6
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#60665E"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isDropdownOpen}
          hardwareAccelerated
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View
              style={{
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: 240,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: "#60665E",
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <ScrollView>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setBodyAreaSelected(null);
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-3 border-b border-grayish"
                >
                  <Text className="font-rregular text-base text-reallygray">
                    Todas as partes
                  </Text>
                </TouchableOpacity>
                {bodyAreas.map((ba, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      setBodyAreaSelected(ba);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-3 ${
                      index < bodyAreas.length - 1
                        ? "border-b border-grayish"
                        : ""
                    }`}
                  >
                    <Text
                      className={`font-rregular text-base ${
                        bodyAreaSelected === ba
                          ? "text-darkgreen font-rbold"
                          : "text-textcolor"
                      }`}
                    >
                      {ba}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
        <View className="h-1/2 w-11/12">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-textcolor font-rbold ml-2 text-xl">
              Exercícios
            </Text>
            {selectedId.length > 0 && (
              <View className="bg-stronggreen px-3 py-1 rounded-full">
                <Text className="text-textcolor font-rbold text-sm">
                  {selectedId.length} selecionado
                  {selectedId.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#8FD14F" />
              <Text className="text-textcolor font-rregular mt-2">
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
        <View className="absolute bg-primary w-full h-16 top-[95%] rounded-b-2xl justify-center items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              addWorkout();
            }}
            className="w-11/12 h-5/6 bg-stronggreen rounded-2xl justify-evenly items-center flex-row"
          >
            <Text className="text-2xl font-rbold">Adicionar treino</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreateWorkout;
