import { useState, useEffect, useContext, createContext } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

/*
 Import des Components 
*/
import EntrepotsScreen from './entrepots'
import {initProduitsBD, PanierScreen, ProduitsScreen, PanierContextProvider} from './panier'
import {SimpleModal} from './modal';
import { ManageScreen } from './pageAdmin';
//database
import { Database } from './database';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//Verification de l'user (qui et recuperationd de l'user pour partout)
const UserContext = createContext(null);

//titre qui se trouve en haut de l'app + id à droite + logout
const StoreTitle = () => {
  const { selectedUser, setSelectedUser } = useContext(UserContext);
  
  return (
    <View style={styles.containerTitle}>
      <Text style={styles.title}>Electro+</Text>
      {selectedUser && (
        <View>
          <Text style={styles.userNom}>ID: {selectedUser.nom}</Text>
          <Text 
            onPress={() => setSelectedUser(null)}
            style={{ color: 'rgba(70, 130, 240, 0.7)', textDecorationLine: 'underline' }}>
            Déconnexion
          </Text>
        </View>
      )}
    </View>
  );
};

const ContactUsScreen = () => (
  <View style={styles.container}>
    <Text>À propos</Text>
  </View>
);

// page homeScreen (pt creer fichier pour lui ?)
const HomeScreen = ({ navigation }) => {
   
  const [users, setUsers] = useState([]); // pour la db le useState.
  const [isModalVisible, setIsModalVisible] = useState(false);    //pour Modal
  const [chooseData, setChooseData] = useState();                 //pour Modal
  const {selectedUser, setSelectedUser} = useContext(UserContext); // Pour recuperer le user avec useContext
  const [tempSelectedUser, setTempSelectedUser] = useState(null); // pour recuperer le user mais de maniere temporaire avant qu'il ne s'identifie

  const db = new Database("users");

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  }; //pour Modal

  const setData = (data) => {
    setChooseData(data);
  }

  const handleUserSelected = (user) => {
    changeModalVisible(true);
    setTempSelectedUser(user);
  }

  const handleUserLogin = (user) => {
    setSelectedUser(user);
  }
  


  // Récupérer les données des utilisateurs depuis la base de données pour les afficher à l'écran
  useEffect(() => {
    initProduitsBD();
  //db.execute("DROP TABLE IF EXISTS users")  // Supprime la table si elle existe
  //.then(() => db.execute("CREATE TABLE IF NOT EXISTS users (id_user TEXT PRIMARY KEY, nom TEXT, admin BOOLEAN, mdp TEXT)"))
  db.execute("CREATE TABLE IF NOT EXISTS users (id_user TEXT PRIMARY KEY, nom TEXT, admin BOOLEAN, mdp TEXT);")
    //.then(() => db.execute("DELETE FROM users")) // Optionnel : supprime les données existantes
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('00', 'Allan Fournier', 1, 'Allan')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('01', 'Enlong Chen', 1, 'Enlong')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('02', 'Lina Jabour', 0, 'Lina')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('03', 'Ava Newman', 0, 'Ava')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('04', 'Liev Newman', 0, 'Liev')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('05', 'Elizaveta Titova', 0, 'Elizaveta')"))
    // .then(() => db.execute("INSERT INTO users (id_user, nom, admin, mdp) VALUES ('06', 'Ashkel Zemiya', 0, 'Ashkel')"))
    .then(() => db.execute("SELECT * FROM users"))
    .then(resultSet => {
      console.log("Affichage de notre database :", resultSet);
      setUsers(resultSet.rows);
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {chooseData}
      </Text>
      {users.map(user => (
        <Pressable 
          key={user.id_user} 
          style={styles.pressable}
          onPress={() =>  {
            changeModalVisible(true)
            handleUserSelected(user);
          }}>
          <Text style={styles.pressableText}>
            {user.nom}
          </Text>
        </Pressable>
      ))}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        nRequestClose={()=>changeModalVisible(false)}
      >
        <SimpleModal 
          changeModalVisible={changeModalVisible}
          setData={setData}
          selectedUser={tempSelectedUser}
          handleUserLogin={handleUserLogin}
        />
      </Modal>
    </View>
  );
};

// menu bottom avec icons
const TabsNavigator = () => {
  const {selectedUser, setSelectedUser} = useContext(UserContext);
  const [panier1, setPanier1] = useState([]);

  return (
    <PanierContextProvider>
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

        {selectedUser && (
          <>
            {selectedUser.admin ? (
              <Tab.Screen
                name="Management"
                component={ManageScreen}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Ionicons name="settings" size={36} color={focused ? 'green' : 'lightgrey'} />
                  ),
                }}
              />
            ) : (
              <>
                <Tab.Screen
                  name="Électroniques"
                  component={ProduitsScreen}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <Ionicons name="list-circle" size={36} color={focused ? 'green' : 'lightgrey'} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Panier"
                  component={PanierScreen}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <Ionicons name="cart" size={36} color={focused ? 'green' : 'lightgrey'} />
                    ),
                  }}
                />
              </>
            )}
            <Tab.Screen
              name="Entrepôt"
              component={EntrepotsScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialCommunityIcons name="warehouse" size={36} color={focused ? 'green' : 'lightgrey'} />
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
          </>
        )}
      </Tab.Navigator>
    </PanierContextProvider>
  );
};

//navigation + appel à tabsNavigator (menu avec buttons + icons)
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabsNavigator} options={{headerTitle: StoreTitle}} />
    <Stack.Screen name="Management" component={ManageScreen} />
    <Stack.Screen name="Produits: Électroniques" component={ProduitsScreen} />
  </Stack.Navigator>
);

//app maitre (ne pas toucher au <Text></Text> bug si on raccourcis l'espace creer. pourquoi ? no sé.)
export const Login = () => {
  const [selectedUser, setSelectedUser] = useState(null);     // prend user
  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      <NavigationContainer>
        <View>
          <Text>                                                                                                                                                                           </Text>
          <MainNavigator />
        </View>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
      text: {
        marginVertical: 20,
        fontSize: 20,
        fontWeight: 'bold'
    },
    containerTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between', // cela séparera le titre et l'ID utilisateur
      alignItems: 'center',
      marginVertical: 20,
      flex: 1,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#4a90e2',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
      letterSpacing: 1.5,
      textAlign: 'left', // positionné à gauche
    },
    userNom: {
      fontSize: 14,
      fontWeight: '500',
      color: 'gray',
      textAlign: 'right', // positionné à droite
      marginRight: 30,
    },
  });