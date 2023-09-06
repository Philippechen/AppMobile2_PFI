import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { obtenirProduits } from './panier';
import { Database } from './database';

const ManageScreen = ({ navigation }) => {
  const db = new Database("produits");
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    obtenirProduits(setProduits);
  }, []);

  const supprimerProduit = async (id) => {
    try {
        // Supprimez le produit spécifique basé sur l'id
        await db.execute(`DELETE FROM produits WHERE id = ?`, [id]);
        
        // Mettre à jour la liste des produits après la suppression
        const updatedProduits = produits.filter(produit => produit.id !== id);
        setProduits(updatedProduits);
    } catch (error) {
        console.error("Erreur lors de la suppression du produit:", error);
    }
};

  const renderItem = ({ item: produit }) => (
    <View style={styles.produitContainer}>
      <Image style={styles.image} source={{uri:produit.image}} />
      <View style={{ flex: 1 }}>
        <Text>{produit.nom}</Text>
        <Text>{produit.description}</Text>
        <Text>{produit.prix}$</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => supprimerProduit(produit.id)}>
        <Text style={styles.buttonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventaire Electro+</Text>
      <FlatList
        data={produits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5FCFF',
  },
  produitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    margin: 10,
    color: '#555',
    textAlign: 'center'
  },
});

export { ManageScreen };
