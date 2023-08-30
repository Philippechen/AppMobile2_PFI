/**
 * Date: 28 aout 2023
 * 
 * énoncé:
 * lire des items par mongoDB, afficher tous les produits qu'on a déjà ajouté dans le panier
 * 
 * Un panier montre la liste des produits sélectionnés avec: 
 *      quantités
 *      prix
 *      prix total
 * Le client peut alors enlever un item, vider le panier, retourner à la liste de produits ou acheter. 
 * S’il achète, affichez un écran final d’achat.
 */
import {useState} from 'react';
import { Text, StyleSheet, FlatList, View, Image, Button, Pressable } from 'react-native';
import{ NavigationContainer } from '@react-navigation/native'; 
import{ createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';

/**
 * Todo: Pour développer seulement, on doit lire des produits par mongoDB 
 */
import paniers from "../assets/panier.json";
import produits from "../assets/produits.json";

const stack = createNativeStackNavigator();

/**
 * Produit cards, y compris image, nom, prix et numéro de produits qu'on ajoute au panier
 * @param {*} param0 
 * @returns 
 */
const Produit = ({nom, prix, image, nbr, panier}) => {
  //console.log(image);
  /* Todo: 
  * Afficher : quantités, prix, prix total
  * Bouton : Supprimer, Supprimer Tous, Acheter et retourner à la liste de produits
  */
  return (
    <View style={styles.produit}>
      <Image source={{uri:image}} style={styles.image}/>
      <Text styles={styles.nom}> {nom} </Text>
      <Text styles={styles.nom}> Prix: {prix} </Text>
      <Text styles={styles.nom}> nbr: {nbr} </Text>
      {
        panier && <Pressable style={[styles.lignes, {backgroundColor: 'red'}]} >
            <Text style={{color:"white", fontSize: 20}}>Supprimer</Text>
        </Pressable>
        }
    </View>
    );
}

const ProduitsScreenPage = ({navigation}) => {
  return (
    <View>
      <Button onPress={()=>{navigation.push("Panier")}} title="Panier" />
      <FlatList  
        data={produits} 
        renderItem={({item})=><Produit nom={item.nom} prix={item.prix} image={item.image} nbr={item.nbr} panier={false} />} 
        keyExtractor={item=>item.id} 
        />
    </View>
  );
}
const PanierScreenPage = ({navigation}) => {
  return (
    <View>
      <FlatList  
        data={paniers} 
        renderItem={({item})=><Produit nom={item.nom} prix={item.prix} image={item.image} nbr={item.nbr}  panier={true}/>} 
        keyExtractor={item=>item.id} 
        />
        
      <Pressable 
        style={[styles.lignes, {backgroundColor: 'red'}]}
        >
        <Text style={{color:"white", fontSize: 20}}>Supprimer Tous</Text>
      </Pressable>
    </View>
  );
}
export default function ProduitsScreen({navigation}) { 
  return (
        <stack.Navigator>
          <stack.Screen name='Produits' component={ProduitsScreenPage} />
          <stack.Screen name='Panier' component={PanierScreenPage} />
        </stack.Navigator>
  )
}


const styles = StyleSheet.create({
  produit: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5,
    height: 110

  },
  supprimer:{
    width:70,
    height: 70,
    backgroundColor: 'red'
  },
  nom: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    flexShrink:1
  },
  image: {
    width: 110,
    height: 110,
    paddingRight: 10
  },
  titre: {
    backgroundColor: "#171717",
    paddingTop: 20,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#F3F3F3",
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase'
  }
});
