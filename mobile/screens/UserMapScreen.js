import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal, Button, StyleSheet, Alert } from 'react-native';
import { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapScreen from './MapScreen';
import LogoutButton from "./components/LogoutButton";
const BACKEND_URL = 'http://YOUR IP ADRESS';

const UserMapScreen = () => {
    const [scooters, setScooters] = useState([]);
    const [selectedScooter, setSelectedScooter] = useState(null);
    const [ridingScooter, setRidingScooter] = useState(null);
    const rideInterval = useRef(null);

    // Token'ı al ve scooterları getir
    const fetchScooters = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (!storedToken) throw new Error('Giriş yapılmamış. Token bulunamadı.');

            const res = await fetch(`${BACKEND_URL}/scooters`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Scooter listesi alınamadı');
            }

            const data = await res.json();
            const visibleScooters = data.filter((scooter) => scooter.battery >= 20);
            setScooters(visibleScooters);
        } catch (err) {
            console.error('Scooter fetch error:', err);
            Alert.alert('Hata', err.message || 'Scooterlar yüklenemedi');
        }
    };

    useEffect(() => {
        fetchScooters();
    }, []);

    useEffect(() => {
        if (!ridingScooter) return;

        rideInterval.current = setInterval(async () => {
            const storedToken = await AsyncStorage.getItem('token');

            setScooters((prev) =>
                prev.map((scooter) => {
                    if (scooter.id === ridingScooter.id && scooter.battery > 0) {
                        const newBattery = scooter.battery - 1;

                        fetch(`${BACKEND_URL}/scooters/${scooter.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${storedToken}`,
                            },
                            body: JSON.stringify({ battery: newBattery }),
                        });

                        if (selectedScooter?.id === scooter.id) {
                            setSelectedScooter({ ...scooter, battery: newBattery });
                        }

                        return { ...scooter, battery: newBattery };
                    }
                    return scooter;
                })
            );
        }, 1000);

        return () => clearInterval(rideInterval.current);
    }, [ridingScooter]);

    const startRide = () => {
        setRidingScooter(selectedScooter);
    };

    const stopRide = () => {
        clearInterval(rideInterval.current);
        setRidingScooter(null);
        setSelectedScooter(null);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapScreen>
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
                        <Text style={{ fontSize: 22 }}>🛴</Text>
                    </Marker>
                ))}
            </MapScreen>
            <View style={{ position: 'absolute', top: 40, right: 20 }}>
                <LogoutButton />
            </View>
            {selectedScooter && (
                <Modal visible transparent animationType="slide">
                    <View style={styles.modal}>
                        <Text style={styles.modalText}>{selectedScooter.name}</Text>
                        <Text style={styles.batteryText}>Batarya: %{selectedScooter.battery}</Text>

                        {ridingScooter?.id === selectedScooter.id ? (
                            <Button title="Sürüşü Bitir" onPress={stopRide} color="red" />
                        ) : (
                            <Button title="Sürüşe Başla" onPress={startRide} />
                        )}

                        <Button title="Kapat" onPress={() => setSelectedScooter(null)} />
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default UserMapScreen;

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 40,
        left: 30,
        right: 30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    batteryText: {
        fontSize: 16,
        marginBottom: 15,
    },
});
