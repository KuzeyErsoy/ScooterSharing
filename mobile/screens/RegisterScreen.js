import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';

const BACKEND_URL = 'http://192.168.1.2:3000';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'operator'
    const [operatorCode, setOperatorCode] = useState('');

    const handleRegister = async () => {
        try {
            const body = {
                username,
                password,
                role,
                operatorCode: role === 'operator' ? operatorCode : undefined,
            };

            const res = await fetch(`${BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Kayıt başarısız');
            }

            Alert.alert('Başarılı', 'Kayıt tamamlandı');
            navigation.replace('Login');
        } catch (err) {
            Alert.alert('Hata', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>

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

            <View style={styles.roleButtons}>
                <Button
                    title="Kullanıcı"
                    onPress={() => setRole('user')}
                    color={role === 'user' ? 'green' : undefined}
                />
                <Button
                    title="Operatör"
                    onPress={() => setRole('operator')}
                    color={role === 'operator' ? 'green' : undefined}
                />
            </View>

            {role === 'operator' && (
                <TextInput
                    placeholder="Operatör Kodu"
                    value={operatorCode}
                    onChangeText={setOperatorCode}
                    style={styles.input}
                />
            )}

            <Button title="Kaydol" onPress={handleRegister} />

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginLink}>Zaten hesabınız var mı? Giriş Yapın</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

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
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    loginLink: {
        color: 'blue',
        marginTop: 15,
        textAlign: 'center',
    },
});
