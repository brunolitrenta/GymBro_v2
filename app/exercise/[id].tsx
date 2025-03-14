import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons'

const exercisePage = () => {

    const { exercise } = useLocalSearchParams<{ exercise: string }>();

    const parsedExercise = JSON.parse(exercise!);

    return (
        <SafeAreaView edges={['top']} className="flex-1 justify-evenly items-center bg-primary">
            <View className="flex-row w-5/6 h-8 justify-between items-center">
                <TouchableOpacity className="h-12 w-10 items-center justify-center" onPress={() => router.back()}>
                    <FontAwesome6 name="arrow-left" size={32} color="black" />
                </TouchableOpacity>
                <Text className="font-rbold text-3xl">Exercício {parsedExercise}</Text>
                <View className="h-12 w-10 items-center justify-center"></View>
            </View>
            <View className='w-5/6 h-1/4 justify-center items-center border-2 border-black'>
                <Text>Imagem</Text>
            </View>
            <View className='flex-row w-5/6 justify-between items-center'>
                <View className='w-1/3 h-20 justify-evenly items-center'>
                    <Text className='text-darkgreen font-rbold text-base'>Carga</Text>
                    <View className='flex-row w-full items-center justify-evenly'>
                        <Text className='font-textcolor text-xl font-rsemi'>0 kg</Text>
                        <TouchableOpacity>
                            <FontAwesome6 name="pen" size={32} color="#D5D962" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='w-1/2 h-20 justify-evenly items-center'>
                    <Text className='text-darkgreen font-rbold text-base'>Séries e Repetições</Text>
                    <View className='flex-row w-full items-center justify-center gap-x-2'>
                        <Text className='font-textcolor text-xl font-rsemi'>0x de 0</Text>
                        <TouchableOpacity>
                            <FontAwesome6 name="pen" size={32} color="#D5D962" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className='w-5/6 h-1/3 bg-stronggreen rounded-2xl justify-center items-center'>
                <TouchableOpacity className='absolute top-[5%] left-[85%]'>
                    <FontAwesome6 name="pen" size={32} color="black" />
                </TouchableOpacity>
                <Text className='font-rsemi text-base text-textcolor opacity-50'>Faça suas anotações aqui</Text>
            </View>
        </SafeAreaView>
    );
};

export default exercisePage;