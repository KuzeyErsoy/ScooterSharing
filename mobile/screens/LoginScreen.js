import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';

const BACKEND_URL = 'http://YOUR IP ADRESS';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Giriş başarısız');
            }

            // ✅ Token'ı sakla
            await AsyncStorage.setItem('token', data.access_token);

            // Yönlendirme
            if (data.role === 'user') {
                navigation.replace('UserMap');
            } else if (data.role === 'operator') {
                navigation.replace('OperatorMap');
            } else {
                throw new Error('Geçersiz kullanıcı rolü');
            }
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>

            <TextInput
                placeholder="Kullanıcı adı"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <Button title="Giriş Yap" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.replace('Register')}>
                <Text style={styles.link}>Hesabınız yok mu? Kayıt Olun</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
    },
    link: {
        color: 'blue',
        marginTop: 15,
        textAlign: 'center',
    },
});
