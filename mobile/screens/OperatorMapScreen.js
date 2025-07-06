import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Text,
    Button,
    TextInput,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from "./components/LogoutButton";

const BACKEND_URL = 'http://YOUR IP ADRESS';

const OperatorMapScreen = () => {
    const [scooters, setScooters] = useState([]);
    const [selectedScooter, setSelectedScooter] = useState(null);
    const [newScooterCoords, setNewScooterCoords] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState('');
    const [battery, setBattery] = useState('100');
    const [token, setToken] = useState(null);

    const fetchScooters = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);

            const res = await fetch(`${BACKEND_URL}/scooters`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });

            if (!res.ok) throw new Error('Scooter listesi alınamadı');
            const data = await res.json();
            setScooters(data); // Operator tüm scooter'ları görür
        } catch (error) {
            console.error('Scooter fetch error:', error);
            Alert.alert('Hata', 'Scooterlar yüklenemedi');
        }
    };

    useEffect(() => {
        fetchScooters();
    }, []);

    const handleAddScooter = async () => {
        if (!newScooterCoords || !name || !battery) {
            return Alert.alert('Hata', 'Tüm alanları doldurun.');
        }

        try {
            const res = await fetch(`${BACKEND_URL}/scooters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    latitude: newScooterCoords.latitude,
                    longitude: newScooterCoords.longitude,
                    battery: parseInt(battery),
                }),
            });

            if (!res.ok) throw new Error('Scooter eklenemedi');
            setShowAddModal(false);
            setName('');
            setBattery('100');
            setNewScooterCoords(null);
            fetchScooters();
        } catch (error) {
            console.error('Add error:', error);
            Alert.alert('Hata', error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/scooters/${selectedScooter.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Scooter silinemedi');
            setSelectedScooter(null);
            fetchScooters();
        } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Hata', error.message);
        }
    };

    const handleCharge = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/scooters/${selectedScooter.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ battery: 100 }),
            });

            if (!res.ok) throw new Error('Şarj işlemi başarısız');
            setSelectedScooter(null);
            fetchScooters();
        } catch (error) {
            console.error('Charge error:', error);
            Alert.alert('Hata', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 39.92077,
                    longitude: 32.85411,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onLongPress={(e) => {
                    setNewScooterCoords(e.nativeEvent.coordinate);
                    setShowAddModal(true);
                }}
            >
                {scooters.map((scooter) => (
                    <Marker
                        key={scooter.id}
                        coordinate={{
                            latitude: scooter.latitude,
                            longitude: scooter.longitude,
                        }}
                        title={scooter.name}
                        description={`Batarya: %${scooter.battery}`}
                        onPress={() => setSelectedScooter(scooter)}
                    >
                        <Text style={{ fontSize: 20 }}>🛴</Text>
                    </Marker>
                ))}
            </MapView>
            <View style={{ position: 'absolute', top: 40, right: 20 }}>
                <LogoutButton />
            </View>
            {/* Detay modalı */}
            {selectedScooter && (
                <Modal transparent visible animationType="fade">
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{selectedScooter.name}</Text>
                            <Text style={styles.modalBattery}>Batarya: %{selectedScooter.battery}</Text>

                            <Button title="Şarj Et (100%)" onPress={handleCharge} />
                            <View style={{ marginTop: 10 }}>
                                <Button title="Scooter Sil" onPress={handleDelete} color="red" />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Button title="Kapat" onPress={() => setSelectedScooter(null)} />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Ekleme modalı */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Scooter adı"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Batarya (%)"
                            value={battery}
                            onChangeText={setBattery}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <Button title="Scooter Ekle" onPress={handleAddScooter} />
                        <Button title="İptal" onPress={() => setShowAddModal(false)} color="gray" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default OperatorMapScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    modal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 30,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalBattery: {
        fontSize: 16,
        marginBottom: 15,
    },
});
