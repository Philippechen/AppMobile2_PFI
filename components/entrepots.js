import {useState} from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, Pressable, useWindowDimensions,ScrollView } from 'react-native';
import Constants from 'expo-constants';
import entrepots from "../assets/entrepots.json";
import MapView, {Marker, Circle, Polyline} from 'react-native-maps';

const regionMontreal = {
                       "latitude": 45.57959635115827,
                       "latitudeDelta": 0.2898489739060395,
                       "longitude": -73.80305992439389,
                       "longitudeDelta": 0.24999964982271194,
                       }

export default function EntrepotsScreen() {
  const [pressedId, setPressedId] = useState(-1);
  const {height, width} = useWindowDimensions();

  const Items = ({item}) => {
    const isPressed = item.id === pressedId;
    return (
      <Pressable style={[styles.pressable, {backgroundColor: isPressed ? "hsl(50, 100%, 50%)" :"hsl(38, 100%, 50%)"}]}
        onPress={()=> {setPressedId(item.id)}}
      >
        <Text style={styles.text}>{item.nom}</Text>
      </Pressable>
    )
  }

  const [region, setRegion] = useState(regionMontreal);

  let markTous = entrepots.map(item=> {
    const isPressed = item.id === pressedId;
    return (<Marker
        pinColor={isPressed ? 'indigo' : 'red'}
        key={`${item.id}-${isPressed ? 'active' : 'inactive'}`}
        title={item.nom}
        coordinate={item.coord} />);
  });
  const Cercle = (radius, couleur) => {
        return (entrepots.map(item=> <Circle key={item.id} radius={radius} center={item.coord} strokeWidth={2} strokeColor={couleur} />));
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={entrepots}
        renderItem={Items}
        keyExtractor={item=>item.id}
        />
      <MapView
        style={{height:height * 0.6, width:width}}
        provider="google"
        region={region}
        onRegionChangeComplete={setRegion}>
        {markTous}
        {Cercle(500, 'green')}
        {Cercle(3000, 'red')}

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
  text : {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  },
  pressable: {
    margin: 5,
    padding:8,
    backgroundColor:"hsl(38, 100%, 50%)",
    borderRadius:10
  },
});
