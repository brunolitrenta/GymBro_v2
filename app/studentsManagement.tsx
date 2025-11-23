import { FontAwesome6 } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";
import { eventEmitter } from "@/utils/eventEmitter";

interface Student {
  id: string;
  studentEmail: string;
  trainerId: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    type: string;
    medical: any;
  };
}

const StudentsManagement = () => {
  const { userId } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener para o evento de confirmação do modal
    const handleAlertConfirm = (data: any) => {
      const { action } = data;
      if (action && action.startsWith('deleteStudent:')) {
        const studentEmail = action.split(':')[1];
        executeDelete(studentEmail);
      }
    };

    eventEmitter.on('customAlertConfirm', handleAlertConfirm);
    return () => eventEmitter.off('customAlertConfirm', handleAlertConfirm);
  }, [userId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/relation/${userId}`);
      setStudents(response.data?.data || []);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [userId])
  );

  const handleDeleteRelation = (studentEmail: string, studentName: string) => {
    router.push({
      pathname: "/modals/customAlert",
      params: {
        title: "Confirmar exclusão",
        message: `Deseja realmente remover o aluno ${studentName} da sua lista?`,
        iconName: "user-xmark",
        confirmText: "Remover",
        cancelText: "Cancelar",
        action: `deleteStudent:${studentEmail}`,
      },
    });
  };

  const executeDelete = async (studentEmail: string) => {
    try {
      await api.delete("/users/relation/delete", {
        data: {
          trainerId: userId,
          studentEmail: studentEmail,
        },
      });
      fetchStudents();
    } catch (error) {
      console.error("Erro ao remover relação:", error);
    }
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center">
        <View className="bg-darkgreen/10 w-12 h-12 rounded-xl items-center justify-center mr-3">
          <FontAwesome6 name="user" size={20} color="#D5D962" />
        </View>
        <View className="flex-1">
          <Text className="text-secondary font-rsemi text-base">{item.student.name}</Text>
          <Text className="text-secondary/60 font-rregular text-sm">{item.student.email}</Text>
        </View>
        {item.student.medical && (
          <TouchableOpacity
            className="bg-red-500/10 w-10 h-10 rounded-xl items-center justify-center mr-5"
            onPress={() => 
              router.push({
                pathname: "/modals/medicalConditions",
                params: {
                  studentName: item.student.name,
                  medical: item.student.medical,
                },
              })
            }
          >
            <FontAwesome6 name="heart-pulse" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-red-500 w-10 h-10 rounded-xl items-center justify-center"
          onPress={() => handleDeleteRelation(item.student.email, item.student.name)}
        >
          <FontAwesome6 name="user-xmark" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center bg-secondary/10 rounded-2xl"
            onPress={() => router.back()}
          >
            <FontAwesome6 name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-darkgreen w-12 h-12 rounded-2xl items-center justify-center"
            onPress={() => router.push("/modals/createStudent")}
          >
            <FontAwesome6 name="user-plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text className="font-rbold text-3xl color-textcolor">Gerenciar Alunos</Text>
        <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
      </View>

      <View className="flex-1 px-6">
        {loading ? (
          <View className="bg-white rounded-3xl p-8 shadow-md items-center justify-center">
            <ActivityIndicator size="large" color="#D5D962" />
            <Text className="text-secondary/60 font-rregular text-sm mt-4">
              Carregando alunos...
            </Text>
          </View>
        ) : students.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 shadow-md items-center">
            <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
              <FontAwesome6 name="users" size={32} color="#D5D962" />
            </View>
            <Text className="text-secondary font-rbold text-xl mb-2">
              Lista de Alunos
            </Text>
            <Text className="text-secondary/60 font-rregular text-sm text-center">
              Os alunos vinculados aparecerão aqui
            </Text>
          </View>
        ) : (
          <FlatList
            data={students}
            renderItem={renderStudent}
            keyExtractor={(item) => item.student.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentsManagement;
