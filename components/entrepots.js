import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, Pressable, useWindowDimensions } from 'react-native';
import Constants from 'expo-constants';
import data from "../assets/entrepots.json";
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

const entrepotsData = data.entrepots;
const destinatairesData = data.destinataire[0]; 
const trajetData = data.trajet;

const regionMontreal = {
    "latitude": 45.57959635115827,
    "latitudeDelta": 0.2898489739060395,
    "longitude": -73.80305992439389,
    "longitudeDelta": 0.24999964982271194,
};

export default function EntrepotsScreen() {
    const [pressedId, setPressedId] = useState(-1);
    const { height, width } = useWindowDimensions();
    const [region, setRegion] = useState(regionMontreal);

    const listeTous = ({ item }) => {
        const isPressed = item.id === pressedId;
        return (
            <Pressable 
                style={[styles.pressable, { backgroundColor: isPressed ? "hsl(50, 100%, 50%)" : "hsl(38, 100%, 50%)" }]}
                onPress={() => { setPressedId(item.id) }}>
                <Text style={styles.text}>{item.nom}</Text>
            </Pressable>
        );
    }

    const markTous = entrepotsData.map(item => {
        const isPressed = item.id === pressedId;
        return (
            <Marker
                pinColor={isPressed ? 'indigo' : 'red'}
                key={`${item.id}-${isPressed ? 'active' : 'inactive'}`}
                title={item.nom}
                coordinate={item.coord}
            />
        );
    });

    const Cercle = (radius, couleur) => {
        return entrepotsData.map(item => (
            <Circle key={item.id} radius={radius} center={item.coord} strokeWidth={2} strokeColor={couleur} />
        ));
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={entrepotsData}
                renderItem={listeTous}
                keyExtractor={item => item.id.toString()}
            />
            <MapView
                style={{ height: height * 0.6, width: width }}
                provider="google"
                region={region}
                onRegionChangeComplete={setRegion}>
                
                {markTous}
                {Cercle(3000, 'red')}
                
                <Polyline
                    coordinates={trajetData}
                    strokeColor="#1E90FF"
                    strokeWidth={6}
                />
                
                <Marker
                    pinColor='green'
                    title={destinatairesData.nom}
                    coordinate={destinatairesData.coord}
                />
            </MapView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    },
    pressable: {
        margin: 5,
        padding: 8,
        backgroundColor: "hsl(38, 100%, 50%)",
        borderRadius: 10
    },
});
