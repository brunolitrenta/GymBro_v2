import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutPlan } from "@/hooks/workoutPlanContext";
import { useWorkout } from "@/hooks/workoutContext";
import { IWorkoutPlan } from "@/interfaces/IWorkoutPlan";

const WorkoutPlansScreen = () => {
  const { workoutPlans = [], setWorkoutPlans, activeWorkoutPlan, setActiveWorkoutPlan } = useWorkoutPlan();
  const { saveWorkout = [], setSaveWorkout } = useWorkout();

  const MAX_PLANS = 3;

  const handleCreateNewPlan = () => {
    if (!workoutPlans || !saveWorkout) {
      Alert.alert('Erro', 'Sistema não inicializado corretamente. Tente novamente.');
      return;
    }

    if (workoutPlans.length >= MAX_PLANS) {
      Alert.alert(
        'Limite Atingido',
        `Você já possui ${MAX_PLANS} planos de treino. Delete um plano existente para criar um novo.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (saveWorkout.length === 0) {
      Alert.alert(
        'Nenhum Treino Disponível',
        'Você precisa criar pelo menos um treino antes de criar um plano.',
        [
          { text: 'Cancelar' },
          { text: 'Criar Treino', onPress: () => router.push('/modals/addWorkoutModal') }
        ]
      );
      return;
    }

    router.push('/modals/createWorkoutPlanModal');
  };



  const activatePlan = (plan: IWorkoutPlan) => {
    if (!workoutPlans || !plan || !plan.workouts) {
      Alert.alert('Erro', 'Plano inválido ou sistema não inicializado.');
      return;
    }

    // Deactivate all plans
    const updatedPlans = workoutPlans.map(p => ({ ...p, isActive: false }));
    
    // Activate selected plan
    const activatedPlans = updatedPlans.map(p => 
      p.id === plan.id ? { ...p, isActive: true } : p
    );
    
    setWorkoutPlans(activatedPlans);
    setActiveWorkoutPlan(plan);
    
    // Load workouts from the plan
    setSaveWorkout(plan.workouts || []);
    
    Alert.alert(
      'Plano Ativado',
      `O plano "${plan.name}" está agora ativo.`,
      [{ text: 'OK' }]
    );
  };

  const deletePlan = (planId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const planToDelete = workoutPlans.find(p => p.id === planId);
            const updatedPlans = workoutPlans.filter(p => p.id !== planId);
            
            setWorkoutPlans(updatedPlans);
            
            // If deleted plan was active, clear workouts and active plan
            if (planToDelete?.isActive) {
              setActiveWorkoutPlan(null);
              setSaveWorkout([]);
            }
          }
        }
      ]
    );
  };

  const renderWorkoutPlan = ({ item }: { item: IWorkoutPlan }) => {
    if (!item || !item.workouts) {
      return null; // Skip rendering if item is invalid
    }

    return (
      <View className={`w-full bg-white rounded-2xl p-4 mb-4 shadow-sm border-2 ${
        item.isActive ? 'border-stronggreen' : 'border-transparent'
      }`}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="font-rbold text-xl text-textcolor">{item.name || 'Sem nome'}</Text>
              {item.isActive && (
                <View className="ml-2 bg-stronggreen rounded-full px-2 py-1">
                  <Text className="font-rsemi text-xs text-textcolor">ATIVO</Text>
                </View>
              )}
            </View>
            {item.description && (
              <Text className="font-rregular text-sm text-reallygray">{item.description}</Text>
            )}
          </View>
          
          <TouchableOpacity
            onPress={() => deletePlan(item.id)}
            className="w-10 h-10 rounded-full bg-red-100 items-center justify-center ml-2"
          >
            <FontAwesome6 name="trash" size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-6">
            <MaterialIcons name="fitness-center" size={16} color="#A3A65B" />
            <Text className="font-rsemi text-sm text-reallygray ml-1">
              {item.workouts.length} treino{item.workouts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="schedule" size={16} color="#A3A65B" />
            <Text className="font-rsemi text-sm text-reallygray ml-1">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Data inválida'}
            </Text>
          </View>
        </View>

        {/* Workouts Preview */}
        <View className="mb-3">
          <Text className="font-rsemi text-sm text-textcolor mb-2">Treinos inclusos:</Text>
          <View className="flex-row flex-wrap">
            {item.workouts.map((workout, index) => (
              <View key={index} className="bg-lightgreen rounded-full px-3 py-1 mr-2 mb-1">
                <Text className="font-rsemi text-sm text-textcolor">
                  {workout.label || 'N/A'} - {workout.muscle ? workout.muscle.join(', ') : 'Sem músculo'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        {!item.isActive && (
          <TouchableOpacity
            onPress={() => activatePlan(item)}
            className="bg-stronggreen rounded-xl py-3 items-center"
          >
            <Text className="font-rbold text-base text-textcolor">Ativar Plano</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };



  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row w-full justify-between items-center px-6 py-4">
          <TouchableOpacity
            className="h-12 w-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={32} color="#0d0d0d" />
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="font-rbold text-2xl text-textcolor">Planos de Treino</Text>
            <Text className="font-rregular text-sm text-reallygray">
              {workoutPlans ? workoutPlans.length : 0}/{MAX_PLANS} planos criados
            </Text>
          </View>
          
          <TouchableOpacity 
            className="h-12 w-12 items-center justify-center"
            onPress={handleCreateNewPlan}
          >
            <AntDesign name="pluscircle" size={40} color="#A3A65B" />
          </TouchableOpacity>
        </View>

        {/* Current Workouts Section */}
        {saveWorkout && saveWorkout.length > 0 && (
          <View className="px-6 mb-4">
            <View className="bg-lightgreen/20 rounded-2xl p-4 border border-stronggreen">
              <Text className="font-rbold text-base text-textcolor mb-2">
                Treinos Atuais ({saveWorkout.length})
              </Text>
              <Text className="font-rregular text-sm text-reallygray mb-3">
                Estes treinos serão incluídos no próximo plano que você criar.
              </Text>
              <View className="flex-row flex-wrap">
                {saveWorkout.map((workout, index) => (
                  <View key={index} className="bg-stronggreen rounded-full px-3 py-1 mr-2 mb-1">
                    <Text className="font-rsemi text-xs text-textcolor">
                      {workout.label || 'N/A'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Plans List */}
        <View className="flex-1 px-6">
          {!workoutPlans || workoutPlans.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <FontAwesome6 name="dumbbell" size={64} color="#D9D9D9" />
              <Text className="font-rbold text-xl text-textcolor mt-4 mb-2 text-center">
                Nenhum Plano Criado
              </Text>
              <Text className="font-rregular text-base text-reallygray text-center px-8 mb-6">
                Crie seus primeiros treinos e depois organize-os em planos personalizados.
              </Text>
              <Link asChild href="/modals/addWorkoutModal">
                <TouchableOpacity className="bg-stronggreen rounded-xl px-6 py-3">
                  <Text className="font-rbold text-base text-textcolor">Criar Primeiro Treino</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            <>
              <Text className="font-rbold text-lg text-textcolor mb-4">
                Seus Planos de Treino
              </Text>
              <FlatList
                data={workoutPlans || []}
                renderItem={renderWorkoutPlan}
                keyExtractor={(item) => item?.id || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutPlansScreen;