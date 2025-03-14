import { View, Text, Pressable, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { workoutLabels } from '@/constants/workoutLabels';
import { bodyAreas } from '@/constants/BodyAreas';
import { workoutData } from '@/datasets/exercises';
import { ISaveWorkout } from '@/interfaces/ISaveWorkout';
import { useWorkout } from '@/hooks/workoutContext';
import { IExercise } from '@/interfaces/IExercise';

const AddWorkoutModal = () => {

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [bodyAreaSelected, setBodyAreaSelected] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<Array<number>>([]);

  const [buttonsDisabled, setButtonsDisabled] = useState<Array<string>>([]);

  const { saveWorkout, setSaveWorkout } = useWorkout();

  const labelsSelecionadas = (arrayDeObjetos: ISaveWorkout[]) => {
    const labels: { [key: string]: boolean } = {};
    arrayDeObjetos.forEach(objeto => {
      labels[!objeto.label ? 0 : objeto.label] = true;
    });
    setButtonsDisabled(Object.keys(labels));
  };

  function filterData() {
    const filteredData = workoutData.filter(ex => ex.bp == bodyAreaSelected);

    return filteredData;
  };

  function getMuscle(id: number) {
    const exercise = workoutData.find(ex => ex.id == id);
    return exercise ? exercise.bp : 'Não Encontrado';
  };

  function addWorkout() {

    if (!selectedLabel && selectedId.length == 0) {
      Alert.alert('Atenção', 'Você precisa preencher todos as informações do seu novo treino.');
      return
    }
    else if (selectedId.length == 0) {
      Alert.alert('Atenção', 'Você precisa selecionar os exercícios desejados.');
      return
    }
    else if (!selectedLabel) {
      Alert.alert('Atenção', 'Você precisa escolher uma etiqueta.');
      return
    };

    const musclesToAdd = selectedId.map(id => getMuscle(id));

    const uniqueMuscles = Array.from(new Set(musclesToAdd));

    const newWorkout: ISaveWorkout = {
      label: selectedLabel,
      muscle: uniqueMuscles,
      exercises: selectedId,
    };

    setSaveWorkout((prevArray) => [...prevArray, newWorkout]);
    router.back();
  };

  useEffect(() => {
    labelsSelecionadas(saveWorkout);
  }, [saveWorkout]);

  function renderExercise({ item }: { item: IExercise }) {

    const foundId = selectedId.find(id => id == item.id);

    return (
      <View className='w-full h-11/12 bg-lightgreen rounded-2xl p-3 mb-3 flex-row justify-between'>
        <View>
          <Text className='font-rbold'>{item.exercicio}</Text>
          <Text className='font-rsemi'>Tipo de músculo: {item.tipoDeMusculo}</Text>
          <Text className='font-rsemi'>Séries: {item.series}</Text>
          <Text className='font-rsemi'>Repetições por série: {item.repeticoesPorSerie}</Text>
        </View>
        <View className='justify-center items-center mr-3'>
          <Pressable onPress={() => { foundId ? setSelectedId(selectedId.filter(id => id != item.id)) : setSelectedId(pvs => [...pvs, item.id]) }}>
            {
              foundId
                ? <FontAwesome6 size={30} name="check-circle" color="#0D0D0D" />
                : <FontAwesome6 size={30} name="circle" color="#0D0D0D" />
            }
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Pressable android_disableSound onPress={() => router.back()} className='h-full w-full bg-black opacity-50 fixed'></Pressable>
      <View className='w-11/12 h-5/6 bg-primary rounded-3xl absolute items-center justify-evenly'>
        <View className="flex-row w-5/6 h-8 justify-between items-center">
          <TouchableOpacity className="h-12 w-10 items-center justify-center" onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={32} color="#0d0d0d" />
          </TouchableOpacity>
          <Text className="font-rbold text-3xl text-textcolor">Novo treino</Text>
          <FontAwesome6 name="dumbbell" size={28} color="#0d0d0d" />
        </View>
        <View className='w-11/12'>
          <Text className='text-textcolor font-rbold ml-2 text-xl'>Etiqueta</Text>
          <View className='flex-row w-full justify-around'>
            {
              workoutLabels.map((label, index) => {
                const foundButton = buttonsDisabled.find(button => button == label);

                return (
                  <Pressable disabled={foundButton ? true : false} onPress={() => setSelectedLabel(label)} key={index}>
                    <Text className={foundButton ? 'font-rbold text-5xl text-secondary opacity-50' : (selectedLabel == label ? 'font-rbold text-5xl text-lightgreen' : 'font-rbold text-5xl text-secondary')}>{label}</Text>
                  </Pressable>
                );
              })
            }
          </View>
        </View>
        <View className='w-11/12 h-1/5'>
          <Text className='text-textcolor font-rbold ml-2 text-xl'>Partes do corpo</Text>
          <View className='w-full h-full items-center'>
            <View className='flex-wrap h-5/6 w-11/12 content-between '>
              {
                bodyAreas.map((ba, index) => {
                  return (
                    <Pressable onPress={() => bodyAreaSelected == ba ? setBodyAreaSelected(null) : setBodyAreaSelected(ba)} key={index}>
                      <Text className={bodyAreaSelected == ba ? 'font-rbold text-3xl text-lightgreen' : 'font-rbold text-3xl text-secondary'}>{ba}</Text>
                    </Pressable>
                  );
                })
              }
            </View>
          </View>
        </View>
        <View className='h-2/5 w-11/12'>
          <Text className='text-textcolor font-rbold ml-2 text-xl'>Exercícios</Text>
          <FlatList
            data={!bodyAreaSelected ? workoutData : filterData()}
            renderItem={renderExercise}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View className='absolute w-full bg-secondary h-14 top-[95%] rounded-b-2xl justify-center items-center'>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { addWorkout() }} className='w-11/12 h-5/6 bg-stronggreen rounded-xl justify-evenly items-center flex-row'>
            <Text className='text-2xl font-rbold'>Adicionar treino</Text>
            <FontAwesome6 name="plus" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddWorkoutModal;