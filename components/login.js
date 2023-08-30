import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
//database
import { Database } from './database';
// autres pages
import EntrepotsScreen from './entrepots';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//titre qui se trouve en haut de l'app
const storeTitle = "Electro +";

// pages produtis & à propos (pt creer fichier pour eux ?)
const ElectronicsScreen = () => (
  <View style={styles.container}>
    <Text>Électroniques</Text>
  </View>
);

const ContactUsScreen = () => (
  <View style={styles.container}>
    <Text>À propos</Text>
  </View>
);

// page homeScreen (pt creer fichier pour lui ?)
const HomeScreen = ({ navigation }) => {
  // pour la db le useState. 
  const [users, setUsers] = useState([]);
  const db = new Database("users");

  // onPress button -> envoie dans page produit electroniques (pt creer fichier pour lui ?)
  const handleValidationElec = () => {
    navigation.navigate('Produits: Électroniques');
  };

 // Récupérer les données des utilisateurs depuis la base de données pour les afficher à l'écran
  useEffect(() => {
    db.execute("CREATE TABLE IF NOT EXISTS users (id_user TEXT PRIMARY KEY, nom TEXT, admin BOOLEAN);")
      .then(() => db.execute("SELECT * FROM users"))
      .then(resultSet => {
        console.log("Result set:", resultSet);  
        setUsers(resultSet.rows);
      })
      .catch(error => {
        console.error("An error occurred:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {users.map(user => (
        <Pressable 
        key={user.id_user} 
        style={styles.pressable}
        onPress={handleValidationElec}
        >
          <Text style={styles.pressableText}>{user.nom}</Text>
        </Pressable>
      ))}
    </View>
  );
};

// menu bottom avec icons
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
    <Tab.Screen
      name="Entrepôt"
      component={EntrepotsScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="search-circle-sharp" size={36} color={focused ? 'green' : 'lightgrey'} />
        ),
      }}
    />
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
//navigation + appel à tabsNavigator (menu avec buttons + icons)
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabsNavigator} options={{headerTitle: storeTitle}} />
    <Stack.Screen name="Produits: Électroniques" component={ElectronicsScreen} />
  </Stack.Navigator>
);

//app maitre (ne pas toucher au <Text></Text> bug si on raccourcis l'espace creer. pourquoi ? no sé.)
export const Login = () => {

  return (
    <NavigationContainer>
      <View>
        <Text>                                                                                                                                                                           </Text>
        <MainNavigator />
      </View>
    </NavigationContainer>
  );
};

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
        shadowOffset: { //a verifier
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29, // a verfier
        shadowRadius: 4.65, // a verfier
        elevation: 7,
      },
      pressableText: {
        color: 'white',
        fontSize: 18,
      },
  });