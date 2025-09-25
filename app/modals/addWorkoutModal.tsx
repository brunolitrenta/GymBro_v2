import { View, Text, Pressable, TouchableOpacity, FlatList, Alert, ScrollView, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { workoutLabels } from '@/constants/workoutLabels';
import { bodyAreas } from '@/constants/BodyAreas';
import { workoutData } from '@/datasets/exercises';
import { ISaveWorkout } from '@/interfaces/ISaveWorkout';
import { useWorkout } from '@/hooks/workoutContext';
import { IExercise } from '@/interfaces/IExercise';

const AddWorkoutModal = () => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [bodyAreasSelected, setBodyAreasSelected] = useState<Array<string>>([]);
  const [selectedId, setSelectedId] = useState<Array<number>>([]);
  const [buttonsDisabled, setButtonsDisabled] = useState<Array<string>>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const { saveWorkout, setSaveWorkout } = useWorkout();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const labelsSelecionadas = (arrayDeObjetos: ISaveWorkout[]) => {
    const labels: { [key: string]: boolean } = {};
    arrayDeObjetos.forEach(objeto => {
      labels[!objeto.label ? 0 : objeto.label] = true;
    });
    setButtonsDisabled(Object.keys(labels));
  };

  function filterData() {
    if (bodyAreasSelected.length === 0) {
      return workoutData;
    }
    const filteredData = workoutData.filter(ex => bodyAreasSelected.includes(ex.bp));
    return filteredData;
  };

  function getMuscle(id: number) {
    const exercise = workoutData.find(ex => ex.id == id);
    return exercise ? exercise.bp : 'Não Encontrado';
  };

  function addWorkout() {
    if (!selectedLabel) {
      Alert.alert('Atenção', 'Você precisa escolher uma etiqueta.');
      return;
    }
    
    if (selectedId.length === 0) {
      Alert.alert('Atenção', 'Você precisa selecionar pelo menos um exercício.');
      return;
    }

    const musclesToAdd = selectedId.map(id => getMuscle(id));
    const uniqueMuscles = Array.from(new Set(musclesToAdd));

    const newWorkout: ISaveWorkout = {
      label: selectedLabel,
      muscle: uniqueMuscles,
      exercises: selectedId,
    };

    setSaveWorkout((prevArray) => [...prevArray, newWorkout]);
    
    // Success feedback
    Alert.alert(
      'Sucesso!', 
      `Treino ${selectedLabel} criado com ${selectedId.length} exercício${selectedId.length > 1 ? 's' : ''}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  useEffect(() => {
    labelsSelecionadas(saveWorkout);
  }, [saveWorkout]);

  function renderExercise({ item }: { item: IExercise }) {
    const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
    const foundId = selectedId.find(id => id === itemId);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          foundId
            ? setSelectedId(selectedId.filter(id => id !== itemId))
            : setSelectedId(prev => [...prev, itemId]);
        }}
        className={`w-full bg-white rounded-2xl p-4 mb-3 shadow-sm border-2 ${
          foundId ? 'border-stronggreen bg-lightgreen/20' : 'border-transparent'
        }`}
      >
        <View className='flex-row justify-between items-center'>
          <View className='flex-1 pr-4'>
            <Text className='font-rbold text-lg text-textcolor mb-2'>{item.exercicio}</Text>
            <View className='space-y-1'>
              <View className='flex-row items-center'>
                <MaterialIcons name="fitness-center" size={16} color="#A3A65B" />
                <Text className='font-rsemi text-sm text-reallygray ml-2'>{item.tipoDeMusculo}</Text>
              </View>
              <View className='flex-row items-center'>
                <MaterialIcons name="repeat" size={16} color="#A3A65B" />
                <Text className='font-rsemi text-sm text-reallygray ml-2'>{item.series} séries</Text>
              </View>
              <View className='flex-row items-center'>
                <MaterialIcons name="format-list-numbered" size={16} color="#A3A65B" />
                <Text className='font-rsemi text-sm text-reallygray ml-2'>{item.repeticoesPorSerie} repetições</Text>
              </View>
            </View>
          </View>
          <View className='items-center justify-center'>
            {foundId ? (
              <View className='w-8 h-8 rounded-full bg-stronggreen items-center justify-center'>
                <FontAwesome6 size={16} name="check" color="#0D0D0D" />
              </View>
            ) : (
              <View className='w-8 h-8 rounded-full border-2 border-grayish' />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStepIndicator = () => (
    <View className='flex-row items-center justify-center mb-6'>
      {[1, 2, 3].map((step) => (
        <View key={step} className='flex-row items-center'>
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step <= currentStep ? 'bg-stronggreen' : 'bg-grayish'
            }`}
          >
            <Text className={`font-rbold ${step <= currentStep ? 'text-textcolor' : 'text-reallygray'}`}>
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View className={`w-8 h-1 mx-2 ${step < currentStep ? 'bg-stronggreen' : 'bg-grayish'}`} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className='w-full px-6'>
            <Text className='text-textcolor font-rbold text-2xl mb-2 text-center'>Escolha a Etiqueta</Text>
            <Text className='text-reallygray font-rregular text-base mb-6 text-center'>
              Selecione uma letra para identificar seu treino
            </Text>
            <View className='flex-row flex-wrap justify-center gap-4'>
              {workoutLabels.map((label, index) => {
                const isDisabled = buttonsDisabled.find(button => button === label);
                const isSelected = selectedLabel === label;

                return (
                  <TouchableOpacity
                    key={index}
                    disabled={!!isDisabled}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLabel(label)}
                    className={`w-16 h-16 rounded-2xl items-center justify-center border-2 ${
                      isDisabled
                        ? 'bg-grayish border-grayish opacity-50'
                        : isSelected
                        ? 'bg-stronggreen border-stronggreen'
                        : 'bg-white border-secondary'
                    }`}
                  >
                    <Text
                      className={`font-rbold text-2xl ${
                        isDisabled
                          ? 'text-reallygray'
                          : isSelected
                          ? 'text-textcolor'
                          : 'text-secondary'
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 2:
        return (
          <View className='w-full px-6'>
            <Text className='text-textcolor font-rbold text-2xl mb-2 text-center'>Grupos Musculares</Text>
            <Text className='text-reallygray font-rregular text-base mb-4 text-center'>
              Selecione os grupos musculares do seu treino
            </Text>
            {bodyAreasSelected.length > 0 && (
              <View className='bg-lightgreen/30 rounded-xl p-3 mb-4'>
                <Text className='font-rsemi text-textcolor text-center'>
                  {bodyAreasSelected.length} grupo{bodyAreasSelected.length > 1 ? 's' : ''} selecionado{bodyAreasSelected.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            <View className='flex-row flex-wrap justify-center gap-3'>
              {bodyAreas.map((ba, index) => {
                const isSelected = bodyAreasSelected.includes(ba);
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (isSelected) {
                        setBodyAreasSelected(prev => prev.filter(area => area !== ba));
                      } else {
                        setBodyAreasSelected(prev => [...prev, ba]);
                      }
                    }}
                    className={`px-4 py-3 rounded-xl border-2 flex-row items-center ${
                      isSelected
                        ? 'bg-lightgreen border-stronggreen'
                        : 'bg-white border-grayish'
                    }`}
                  >
                    {isSelected && (
                      <View className='w-5 h-5 rounded-full bg-stronggreen items-center justify-center mr-2'>
                        <FontAwesome6 name="check" size={12} color="#0D0D0D" />
                      </View>
                    )}
                    <Text
                      className={`font-rsemi text-base ${
                        isSelected ? 'text-textcolor' : 'text-secondary'
                      }`}
                    >
                      {ba}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className='mt-6'>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setBodyAreasSelected([])}
                className='bg-grayish/50 rounded-xl py-3 px-4 items-center'
              >
                <Text className='font-rsemi text-reallygray'>Limpar seleção</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View className='w-full px-6 flex-1'>
            <Text className='text-textcolor font-rbold text-2xl mb-2 text-center'>Exercícios</Text>
            <Text className='text-reallygray font-rregular text-base mb-2 text-center'>
              Selecione os exercícios para seu treino
            </Text>
            {bodyAreasSelected.length > 0 && (
              <Text className='text-darkgreen font-rsemi text-sm mb-2 text-center'>
                Exibindo exercícios de: {bodyAreasSelected.join(', ')}
              </Text>
            )}
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-reallygray font-rregular text-sm'>
                {filterData().length} exercícios disponíveis
              </Text>
              {selectedId.length > 0 && (
                <View className='bg-lightgreen rounded-full px-3 py-1'>
                  <Text className='font-rsemi text-textcolor text-sm'>
                    {selectedId.length} selecionado{selectedId.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
            <FlatList
              data={filterData()}
              renderItem={renderExercise}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Pressable android_disableSound onPress={() => router.back()} className='h-full w-full bg-black opacity-50 absolute' />
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className='w-11/12 h-5/6 bg-primary rounded-3xl shadow-2xl'
      >
        {/* Header */}
        <View className='flex-row justify-between items-center px-6 pt-6 pb-4'>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                router.back();
              }
            }}
            className='w-10 h-10 rounded-full bg-grayish items-center justify-center'
          >
            <FontAwesome6 name="arrow-left" size={20} color="#0d0d0d" />
          </TouchableOpacity>
          
          <View className='items-center'>
            <Text className='font-rbold text-2xl text-textcolor'>Novo Treino</Text>
            <FontAwesome6 name="dumbbell" size={24} color="#A3A65B" />
          </View>
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className='w-10 h-10 rounded-full bg-grayish items-center justify-center'
          >
            <FontAwesome6 name="xmark" size={20} color="#0d0d0d" />
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <View className='flex-1'>
          {renderStepContent()}
        </View>

        {/* Bottom Actions */}
        <View className='px-6 pb-6 pt-4 bg-white rounded-b-3xl border-t border-grayish/30'>
          <View className='flex-row justify-between items-center'>
            {currentStep < 3 ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCurrentStep(currentStep - 1)}
                  className={`flex-1 mr-3 py-4 rounded-xl items-center ${
                    currentStep === 1 ? 'bg-grayish/50' : 'bg-grayish'
                  }`}
                  disabled={currentStep === 1}
                >
                  <Text className={`font-rsemi text-base ${
                    currentStep === 1 ? 'text-reallygray' : 'text-textcolor'
                  }`}>
                    Voltar
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (currentStep === 1 && !selectedLabel) {
                      Alert.alert('Atenção', 'Selecione uma etiqueta para continuar.');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  className='flex-1 ml-3 py-4 bg-stronggreen rounded-xl items-center'
                >
                  <Text className='font-rbold text-base text-textcolor'>Próximo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={addWorkout}
                className='flex-1 py-4 bg-stronggreen rounded-xl items-center flex-row justify-center'
              >
                <FontAwesome6 name="plus" size={20} color="#0d0d0d" />
                <Text className='font-rbold text-base text-textcolor ml-2'>Criar Treino</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default AddWorkoutModal;