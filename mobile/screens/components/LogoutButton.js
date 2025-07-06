import React from 'react';
import { Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            Alert.alert('Çıkış Yapıldı');
            navigation.replace('Login');
        } catch (err) {
            Alert.alert('Hata', 'Çıkış sırasında bir hata oluştu');
        }
    };

    return <Button title="Çıkış Yap" onPress={handleLogout} color="red" />;
};

export default LogoutButton;
