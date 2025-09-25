import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useWorkoutPlan } from '@/hooks/workoutPlanContext';
import { useWorkout } from '@/hooks/workoutContext';
import { IWorkoutPlan } from '@/interfaces/IWorkoutPlan';

const CreateWorkoutPlanModal = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const { workoutPlans = [], setWorkoutPlans, setActiveWorkoutPlan } = useWorkoutPlan();
  const { saveWorkout = [], setSaveWorkout } = useWorkout();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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

  const handleCreatePlan = () => {
    if (!planName.trim()) {
      Alert.alert('Erro', 'Digite um nome para o plano de treino.');
      return;
    }

    if (!saveWorkout || saveWorkout.length === 0) {
      Alert.alert('Erro', 'Você precisa ter pelo menos um treino para criar um plano.');
      return;
    }

    if (!setWorkoutPlans || !setActiveWorkoutPlan || !setSaveWorkout) {
      Alert.alert('Erro', 'Sistema não inicializado corretamente.');
      return;
    }

    const newPlan: IWorkoutPlan = {
      id: Date.now().toString(),
      name: planName.trim(),
      description: planDescription.trim(),
      workouts: [...saveWorkout],
      createdAt: new Date(),
      isActive: workoutPlans.length === 0,
    };

    setWorkoutPlans(prev => [...prev, newPlan]);
    
    if (workoutPlans.length === 0) {
      setActiveWorkoutPlan(newPlan);
    }

    setSaveWorkout([]);

    Alert.alert(
      'Plano Criado!',
      `O plano "${planName}" foi criado com sucesso com ${newPlan.workouts.length} treino${newPlan.workouts.length > 1 ? 's' : ''}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center items-center"
    >
      <Pressable
        onPress={() => router.back()}
        className="absolute inset-0 bg-black opacity-50"
      />
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="w-11/12 bg-white rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-grayish items-center justify-center"
          >
            <FontAwesome6 name="xmark" size={20} color="#0d0d0d" />
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="font-rbold text-xl text-textcolor">Novo Plano</Text>
            <FontAwesome6 name="clipboard-list" size={20} color="#A3A65B" />
          </View>
          
          <View className="w-10" />
        </View>

        <View className="px-6 pb-6">
          {/* Info about current workouts */}
          {saveWorkout && saveWorkout.length > 0 && (
            <View className="bg-lightgreen/20 rounded-2xl p-4 mb-6 border border-stronggreen">
              <Text className="font-rbold text-base text-textcolor mb-2">
                Treinos que serão incluídos:
              </Text>
              <Text className="font-rregular text-sm text-reallygray mb-3">
                {saveWorkout.length} treino{saveWorkout.length > 1 ? 's' : ''} atual{saveWorkout.length > 1 ? 'mente' : ''} criado{saveWorkout.length > 1 ? 's' : ''}
              </Text>
              <View className="flex-row flex-wrap">
                {saveWorkout.map((workout, index) => (
                  <View key={index} className="bg-stronggreen rounded-full px-3 py-1 mr-2 mb-1">
                    <Text className="font-rsemi text-xs text-textcolor">
                      {workout.label || 'N/A'} - {workout.muscle ? workout.muscle.slice(0, 2).join(', ') : 'Sem músculo'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Plan Name Input */}
          <View className="mb-4">
            <Text className="font-rbold text-base text-textcolor mb-2">
              Nome do Plano *
            </Text>
            <View className="bg-grayish/20 rounded-xl border border-grayish focus:border-stronggreen">
              <TextInput
                value={planName}
                onChangeText={setPlanName}
                placeholder="Ex: Hipertrofia, Definição, Push/Pull/Legs..."
                placeholderTextColor="#60665E"
                className="font-rregular text-base text-textcolor px-4 py-3"
                maxLength={30}
              />
            </View>
            <Text className="font-rregular text-xs text-reallygray mt-1">
              {planName.length}/30 caracteres
            </Text>
          </View>

          {/* Plan Description Input */}
          <View className="mb-6">
            <Text className="font-rbold text-base text-textcolor mb-2">
              Descrição (Opcional)
            </Text>
            <View className="bg-grayish/20 rounded-xl border border-grayish focus:border-stronggreen">
              <TextInput
                value={planDescription}
                onChangeText={setPlanDescription}
                placeholder="Descreva o objetivo ou detalhes do plano..."
                placeholderTextColor="#60665E"
                className="font-rregular text-base text-textcolor px-4 py-3"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={150}
              />
            </View>
            <Text className="font-rregular text-xs text-reallygray mt-1">
              {planDescription.length}/150 caracteres
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 mr-2 bg-grayish rounded-xl py-4 items-center"
            >
              <Text className="font-rsemi text-base text-textcolor">Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleCreatePlan}
              className="flex-1 ml-2 bg-stronggreen rounded-xl py-4 items-center flex-row justify-center"
            >
              <FontAwesome6 name="plus" size={16} color="#0d0d0d" />
              <Text className="font-rbold text-base text-textcolor ml-2">
                Criar Plano
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default CreateWorkoutPlanModal;