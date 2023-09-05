import { useState, useEffect, useContext, createContext } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';

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