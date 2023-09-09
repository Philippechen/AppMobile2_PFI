import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Pressable, TextInput, Alert, ScrollView, Dimensions  } from 'react-native';
import { obtenirProduits } from './panier';
import { Database } from './database';

// Composant pour le formulaire d'ajout de produits
const NewProduit = ({ addProduit }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [image, setImage] = useState('');

  const handleAddProduit = () => {
    //image par defaut si vide
    const defaultImageLink = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png";

    let finalImageURL = image ? { uri: image } : { uri: defaultImageLink };
    //verification
    if (!nom || !description || !prix) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (isNaN(parseFloat(prix))) {
      Alert.alert("Erreur", "Veuillez entrer un prix valide.");
      return;
    }
    // Vérifier l'extension de l'image
    if (image) {
      const imageRegex = /\.(jpeg|jpg|gif|png)$/;
      if (!imageRegex.test(image.toLowerCase())) {
        Alert.alert("Erreur", "Veuillez fournir un lien d'image valide (jpeg, jpg, gif, png).");
        return;
      }
    }
    
    addProduit({ nom, description, prix, image: finalImageURL.uri });
    setNom('');
    setDescription('');
    setPrix('');
    setImage('');
  };

  return (
  <View style={styles.formContainer}>
    <ScrollView>
        <TextInput 
            style={styles.input} 
            placeholder="Nom du produit" 
            value={nom} 
            onChangeText={setNom} 
        />
        <TextInput 
            style={styles.input} 
            placeholder="Description" 
            value={description} 
            onChangeText={setDescription} 
            multiline 
        />
        <TextInput 
            style={styles.input} 
            placeholder="Prix" 
            value={prix} 
            onChangeText={setPrix} 
            keyboardType="numeric" 
        />
        <TextInput 
            style={styles.input} 
            placeholder="Image (lien URL)" 
            value={image} 
            onChangeText={setImage} 
        />
        <Pressable style={styles.addButton} onPress={handleAddProduit}>
            <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
    </ScrollView>
</View>
  );
};

const ButtonShowHide = ({ isShown, toggleShow }) => (
  <View style={styles.buttonContainer}>
    <Pressable
      style={[styles.toggleButton, isShown ? styles.buttonShown : styles.buttonHidden]}
      onPress={toggleShow}>
      <Text style={styles.toggleButtonText}>{isShown ? 'Annuler' : 'Ajouter Produit'}</Text>
    </Pressable>
  </View>
);

const ManageScreen = ({ navigation }) => {
  const db = new Database("produits");
  const [produits, setProduits] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    obtenirProduits(setProduits);
  }, []);

  const addProduit = async (produit) => {
    try {
      await db.execute("INSERT INTO produits (nom, description, prix, image) VALUES (?, ?, ?, ?)", [produit.nom, produit.description, produit.prix, produit.image]);
      obtenirProduits(setProduits);
      Alert.alert("Succès", "Produit ajouté avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      Alert.alert("Erreur", "Il y a eu une erreur lors de l'ajout du produit.");
    }
  };
  
  

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
      <ButtonShowHide isShown={showForm} toggleShow={() => setShowForm(!showForm)} />
      {showForm && <NewProduit addProduit={addProduit} />}
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
  formContainer: {
    height: Dimensions.get('window').height * 0.8,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 10
},
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  buttonContainer: {
    
    marginVertical: 10,
    alignItems: 'center'
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center'
  },
  buttonShown: {
    backgroundColor: 'lightgrey'
  },
  buttonHidden: {
    backgroundColor: 'lightgreen'
  },
  toggleButtonText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export { ManageScreen };
