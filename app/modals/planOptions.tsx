import { View, Text, Pressable, Dimensions } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/authContext';
import CustomAlert from './customAlert';
import { useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PlanOptions = () => {
    const { planId, planName } = useLocalSearchParams();
    const { userType } = useAuth();

    const isTrainer = userType === 'trainer';

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const confirmRemoval = () => {
        setAlertTitle('Atenção');
        setAlertMessage('Você tem certeza que deseja excluir este plano? Essa ação será irreversível.');
        setAlertVisible(true);
    };

    function deletePlan() {
        console.log('Excluindo plano:', planId);
        router.back();
    }

    function sharePlan() {
        console.log('Compartilhando plano:', planId);
        router.back();
    }

    return (
        <View className='flex-1 bg-transparent'>
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
                actions={[
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', onPress: () => deletePlan(), style: 'destructive' },
                ]}
            />
            <Pressable android_disableSound onPress={() => router.back()} className='h-full w-full'></Pressable>
            <View 
                className='bg-white rounded-2xl shadow-2xl overflow-hidden' 
                style={{
                    position: 'absolute', 
                    top: 70, 
                    right: 20, 
                    width: 180,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 10,
                }}
            >
                {isTrainer && (
                    <Pressable onPress={() => sharePlan()} className='flex-row items-center gap-2 px-4 py-4 border-b border-secondary/10 active:bg-secondary/5'>
                        <FontAwesome6 name="share" size={18} color="#D5D962" />
                        <Text className='font-rsemi text-base ml-4 text-secondary'>Encaminhar</Text>
                    </Pressable>
                )}
                <Pressable onPress={() => confirmRemoval()} className='flex-row items-center gap-2 px-4 py-4 active:bg-secondary/5'>
                    <FontAwesome6 name="trash" size={18} color="#EF4444" />
                    <Text className='font-rsemi text-base ml-4 text-red-500'>Excluir</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default PlanOptions;
