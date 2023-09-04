import { useState, useEffect, useContext, createContext } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()
//database
import { Database } from './database';

const ManageScreen = ({ navigation }) => {
    // pour la db le useState. 
    const [telephones, setTelephones] = useState([]);
    const db = new Database("telephones");
  
    return(
        <View style={styles.container}>
          <Text>TEST</Text>
            {telephones.map((tel) => (
                <View key={tel.id_tel}>
                    <Text>{tel.nom}</Text>
                    <Text>{tel.description}</Text>
                    <Text>{tel.prix}$</Text>
                    
                </View>
            ))}
        </View>
    );
};  

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
  });
  
export { ManageScreen };