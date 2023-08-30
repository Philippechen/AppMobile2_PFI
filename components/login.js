import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

/*
 Import des Components 
*/
import EntrepotsScreen from './entrepots'
import ProduitsScreen from './panier'
const ManageScreen = () => {}


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//Todo: nous devons vérifier c'est qui l'utilisateur, est administrateur ou clientelle?
var isClient = true;

// titre du magasin
const storeTitle = "Electro +";

// les 2 ci-dessous inutile pour linstant - a remplacer par la bonne direction - (une base pour quelque chose si besoin)

const ElectronicsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Électroniques</Text>
  </View>
);

const BooksScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Livres</Text>
  </View>
);

//page à propos
const ContactUsScreen = () => (
  <View style={styles.screenContainer} >
    <Text >Page à propos</Text>
    <Text>Allan</Text>
    <Text>Enlong</Text>
  </View>
);

//Page Accueil / login
const HomeScreen = ({ navigation }) => {

    const [users, setUsers] = useState([]);
    
    // cherche notre database users 
    useEffect(() => {
      const data = require('./database.json');
      setUsers(data.connexion);
    }, []);

// inutile pour linstant - a remplacer par la bonne direction - (une base pour quelque chose si besoin)

//   const handleValidationElec = () => {
//     navigation.navigate('Produits: Electroniques');
//   };

//   const handleValidationLivres = () => {
//     navigation.navigate('Produits: Livres');
//   };

// map sur id user pour resortir le nom
return (
    <View style={styles.container}>
      {users.map((user) => (
        <Pressable
          key={user.id_user}
          style={styles.pressable}
        >
          <Text>{user.nom}</Text>
        </Pressable>
      ))}
    </View>
  );
};
// modifier le style (pas complet pour le pressable, + add onPress={() => handleUserPress(user)} pt ?)

// pour la navigation en bas de l'écran via icone
const TabsNavigator = () => (

  <Tab.Navigator initialRouteName="Accueil">
    <Tab.Screen
      name="Accueil"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="ios-home" size={28} color={focused ? 'green' : 'lightgrey'} />
        ),
      }}
    />
    { 
      /**
       * Si clientelle login, afficher produitsScreen
       * Si administrateur login, afficher manageScreen 
       */
      isClient ? <Tab.Screen
        name="Electroniques"
        component={ProduitsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search-circle-sharp" size={36} color={focused ? 'green' : 'lightgrey'} />
          ),
        }}
      /> : <Tab.Screen
        name="Management"
        component={ManageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search-circle-sharp" size={36} color={focused ? 'green' : 'lightgrey'} />
          ),
        }}
      />
    }
    {
      // Afficher tous les entrepôts sur le map, il y a encore des travaux à faire.
      <Tab.Screen
        name="Entrepôt"
        component={EntrepotsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="warehouse" size={36} color={focused ? 'green' : 'lightgrey'} />
          ),
        }}
      />
    }
    <Tab.Screen
      name="À propos"
      component={ContactUsScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="search-circle-sharp" size={36} color={focused ? 'green' : 'lightgrey'} />
        ),
      }}
    />
  </Tab.Navigator>
);

//incomplet. Premier stack.screen = login
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabsNavigator} options={{headerTitle: storeTitle}} />
    <Stack.Screen name="Produits: Electroniques" component={ElectronicsScreen} />
    <Stack.Screen name="Produits: Livres" component={BooksScreen} />
  </Stack.Navigator>
);

export const Login = () => {

  return(
    <View>
      <Text>                                                                                                                                                                             </Text>
      <NavigationContainer><StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </View>
)};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    boutonBleu: {
      backgroundColor: 'blue',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center'
    },
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pressable: {
        backgroundColor: '#4CAF50', // Vert
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
      pressableText: {
        color: 'white',
        fontSize: 16,
      },
  });