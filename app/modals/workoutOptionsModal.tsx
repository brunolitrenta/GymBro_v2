import { View, Text, Pressable, Alert } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useWorkout } from '@/hooks/workoutContext';

const AddWorkoutModal = () => {

    const { label } = useLocalSearchParams();

    const { saveWorkout, setSaveWorkout } = useWorkout();

    const confirmRemoval = () =>
        Alert.alert('Atenção', 'Você tem certeza que deseja excluir este treino? Essa ação será irreversível.', [
            {
                text: 'Cancelar',
                onPress: () => Alert,
                style: 'cancel',
            },
            { text: 'Excluir', onPress: () => deleteWorkout() },
        ]);

    function deleteWorkout() {

        const currentWorkout = saveWorkout.find(wk => wk.label == label);

        setSaveWorkout(saveWorkout.filter(wk => wk != currentWorkout));

        router.navigate('workoutPlan');
    };

    return (
        <View className='flex-1 justify-center items-center'>
            <Pressable android_disableSound onPress={() => router.back()} className='h-full w-full fixed'></Pressable>
            <View className='w-1/2 h-1/4 bg-primary rounded-3xl absolute top-[10%] left-[45%] items-center justify-evenly shadow-lg shadow-stone-950'>
                <Pressable className='flex-row w-full h-1/2 justify-around items-center rounded-t-2xl active:bg-grayish'>
                    <View className='w-4/5 justify-around flex-row'>
                        <FontAwesome6 name="pen" size={24} color="black" />
                        <Text className='font-rsemi text-xl w-4/6 text-center'>Editar</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => confirmRemoval()} className='flex-row w-full h-1/2 justify-around items-center rounded-b-2xl active:bg-grayish'>
                    <View className='w-4/5 justify-around flex-row'>
                        <FontAwesome6 name="trash" size={24} color="black" />
                        <Text className='font-rsemi text-xl w-4/6 text-center'>Excluir</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

export default AddWorkoutModal;