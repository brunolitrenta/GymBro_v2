import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'

const CreditsModal = () => {
    return (
        <View className='flex-1 justify-center items-center'>
            <Pressable onPress={() => router.back()} className='h-full w-full bg-black opacity-50 fixed'></Pressable>
            <View className='w-11/12 h-2/4 bg-primary rounded-3xl absolute items-center justify-around'>
                <View className="flex-row w-5/6 h-9 justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome6 name="arrow-left" size={32} color="black" />
                    </TouchableOpacity>
                    <Text className="font-rbold text-3xl">Sobre</Text>
                    <MaterialCommunityIcons name="teddy-bear" size={32} color="black" />
                </View>
                <View className='justify-evenly items-center h-4/6'>
                    <Text className='text-2xl font-rsemi'>Criado por:</Text>
                    <View>
                        <Text className='text-xl font-rregular'>Bruno Litrenta</Text>
                        <Text className='text-xl font-rregular'>Cauã Lopes</Text>
                        <Text className='text-xl font-rregular'>Guilherme Heinrich</Text>
                    </View>
                    <View className='items-center'>
                        <Text className='text-xl font-rsemi'>Tecnologias utilizadas:</Text>
                        <View className='flex-row'>
                            <MaterialCommunityIcons name="android" size={40} color="#3DDC84" />
                            <MaterialCommunityIcons name="apple" size={40} color="#0D0D0D" />
                        </View>
                        <View className='flex-row'>
                            <MaterialCommunityIcons name="react" size={40} color="#087ea4" />
                            <MaterialCommunityIcons name="tailwind" size={40} color="#0ea5e9" />
                        </View>

                    </View>
                </View>
            </View>
        </View>
    )
}

export default CreditsModal;