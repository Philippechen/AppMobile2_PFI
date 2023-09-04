/**
 * Date: 28 aout 2023
 * Auteur: Enlong Chen
 * 
 * énoncé:
 * lire des items par BD, afficher tous les produits qu'on a déjà ajouté dans le panier
 * 
 * Un panier montre la liste des produits sélectionnés avec: 
 *      quantités
 *      prix
 *      prix total
 * Le client peut alors enlever un item, vider le panier, retourner à la liste de produits ou acheter. 
 * S’il achète, affichez un écran final d’achat.
 */
import { createContext, useContext, useState } from 'react';
import { Text, StyleSheet, FlatList, View, Image, Pressable, Alert, Button } from 'react-native';
//import{ NavigationContainer } from '@react-navigation/native'; 
import{ createNativeStackNavigator } from '@react-navigation/native-stack';

/**
 * Todo: Pour développer seulement, on doit lire des produits par BD 
 */
import produits from "../assets/produits.json";

const stack = createNativeStackNavigator();

/**  Pour partager les données */
const PanierContext = createContext();
export const PanierContextProvider = ({ children }) => {
  const [paniersTous, setPaniersTous] = useState([{}]);

  return (
    <PanierContext.Provider value={{ paniersTous, setPaniersTous }}>
      {children}
    </PanierContext.Provider>
  );
};
export const useMyContext = () => useContext(PanierContext);


/**
 * Afficher tous les information d'un produit: nom, description, prix
 * On peut l'ajouter au panier aussi
 * 
 * @param {*} param0 
 * @returns 
 */
const DetailScreenPage = ({navigation, route}) => {
  const {id, nom, prix, description,image} = route.params.item;
  const { paniersTous, setPaniersTous } = useMyContext();
  return (
    <View style={styles.detail}>
      <Image source={{uri:image}} style={styles.imageDetail}/>
      <Text style={styles.titreDetail}> {nom} </Text>
      <View style={{alignItems: 'left', paddingTop:20}}>
        <Text > Prix: {prix} </Text>
        <Text > Description:{description} </Text>
      </View>
 
      <Pressable style={{backgroundColor: 'orange', marginTop:20}}
        onPress={()=>{
          // Si l'id existe déjà, accumuler le champ 'nbr', sinon, ajoute directement 
          let pasExiste = true;
          for (let i of paniersTous) {
            if (i.id == id) {
              pasExiste = false;
              i.nbr++;
              break;
            }
          }
          if (pasExiste) {
            setPaniersTous([...paniersTous,{id:id, nom:nom, prix:prix, image:image, nbr:1}]);
          }
          
          Alert.alert('Confirmation', 'Ajouté avec succès', [
            {
              text:'Oui',
              onPress:()=>navigation.goBack()
            }
          ])
        }}
       >
        <Text style={{color:"white", fontSize: 20}}>Ajout au panier</Text>
      </Pressable>
    </View>
  )
}

/**
 * Décrire brièvement un produit avec Image
 * On peut le presser pour l'information plus détaillée
 * 
 * @param {*} param0 
 * @returns 
 */
const Produit = ({navigation, item}) => {
  const {nom, prix, image} = item;
  return (
    <Pressable 
      onPress={()=>{navigation.navigate("Details",{'item':item})}}
      style={[styles.lignes, {backgroundColor: '#DDD', borderWidth:1}]} >
      <View style={styles.produit}>
        <View>
          <Image source={{uri:image}} style={styles.imageProduit}/>
        </View>
        <View>
          <Text styles={styles.nom}> {nom} </Text>
          <Text styles={styles.nom}> Prix: {prix} </Text>
        </View>
      </View>
    </Pressable>
    );
}
/**
 * Afficher tous les produits qu'on a lit par BD
 * 
 * @param {*} param0 
 * @returns 
 */
const ProduitsScreenPage = ({navigation}) => {
  return (
    <View>
      <FlatList  
        data={produits} 
        renderItem={({item})=><Produit navigation={navigation} item={item} />} 
        keyExtractor={item=>item.id} 
        />
    </View>
  );
}
/**
 * Component à exporter 
 * @param {*} param0 
 * @returns 
 */
function ProduitsScreen({navigation}) {
  return (
    <stack.Navigator>
      <stack.Screen name='ProduitList' component={ProduitsScreenPage} />
      <stack.Screen name='Details' component={DetailScreenPage} />
    </stack.Navigator>
  )
}

/**
 * Afficher Produit cards, 
 * y compris image, nom, prix et numéro de produits qu'on ajoute au panier
 * 
 * @param {*} param0 
 * @returns 
 */
const ProduitPanier = ({id, nom, prix, image, nbr}) => {
  const { paniersTous, setPaniersTous } = useMyContext();

  if (typeof(id) == "undefined") 
    return;
  
  const delProduit = () => {
    let nouvauPanier = [];
    paniersTous.forEach(item=>{
      if (item.id != id) nouvauPanier.push(item);
    })
    setPaniersTous(nouvauPanier)
  }
  const changeNbrProduit = (nb) => {
    let nouvauPanier = [];
    paniersTous.forEach(item=>{
      if (item.id == id) item.nbr += nb;
      if (item.nbr <= 0) {
        delProduit();
        return;
      }
      nouvauPanier.push(item);
    })
    setPaniersTous(nouvauPanier)
  }
  return (
    <View style={styles.panier}>
      <Image source={{uri:image}} style={styles.image}/>

      <View style={styles.panierEnonce}>
        <Text style={styles.panierTitre}> {nom} </Text>
        <Text style={styles.panierText}> Prix: {prix} </Text>

        <View style={styles.panierNbr}>
          <Button style={styles.panierNbrBtn} onPress={()=>{changeNbrProduit(-1)}} title="-"/>
            <Text style={styles.panierNbrText}> {nbr} </Text>
          <Button style={styles.panierNbrBtn} onPress={()=>{changeNbrProduit(1)}} title="+"/>
        </View>
        
        <Pressable style={styles.panierSupprimer} 
          onPress={()=>{
            Alert.alert('Confirmation', 'Voulez vous supprimer ce produit?', [
              {
                text:'Oui',
                onPress:()=>{delProduit()}
              },
              {
                text: 'Non',
                onPress:()=>{},
                style: 'cancel'
              }
            ])
          }}
        >
            <Text style={{color:"white", fontSize: 20}}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
    );
}
/**
 * Afficher:
 *  1. tous les produits qu'on a ajouté
 *  2. Prix total pour
 *  3. Un bouton pour Supprimer tous les produits
 *  4. Un bouton pour acheter tous les produits, si on le presser, afficher un écran final d'achat
 * @param {*} param0 
 * @returns 
 */
const PanierScreenPage = ({navigation}) => {
  const { paniersTous, setPaniersTous } = useMyContext();
  let prixTous = 0;
  
  paniersTous.forEach(it =>{
    if (typeof(it.prix) != "undefined") 
      prixTous+=it.prix*it.nbr;
  });
  return (
    <View style={styles.panierScreen}>
      <FlatList  
        data={paniersTous} 
        renderItem={({item})=><ProduitPanier id={item.id} nom={item.nom} prix={item.prix} image={item.image} nbr={item.nbr} />}
        keyExtractor={item=>item.id} 
      />
        
      <Text style={{fontWeight:'bold', fontSize:20}} >Prix Total: {prixTous.toFixed(2)}</Text>
      <Pressable 
        style={[styles.panierBtn, {backgroundColor: 'red'}]}
        onPress={()=>{
          Alert.alert('Confirmation', 'Voulez vous valider le panier?', [
            {
              text:'Oui',
              onPress:()=>{setPaniersTous([])}
            },
            {
              text: 'Non',
              onPress:()=>{},
              style: 'cancel'
            }
          ])
        }}
        >
        <Text style={{color:"white", fontSize: 20}}>Supprimer Tous</Text>
      </Pressable>

      <Pressable 
        style={[styles.panierBtn, {backgroundColor: 'green'}]}
        onPress={()=>{navigation.navigate("Achat",{'prix':prixTous.toFixed(2)});setPaniersTous([])}}
        >
        <Text style={{color:"white", fontSize: 20}}>Acheter</Text>
      </Pressable>
    </View>
  );
}


const AchatScreenPage = ({navigation, route}) => {
  const prix = route.params.prix;
  return (
  <View style={styles.produit}>
    <Text style={styles.panierTitre}>Merci pour votre achat. </Text>
    <Text>Votre command de {prix} a bien été confirmé</Text>
  </View>
)}
/**
 * Component à exporter 
 * @param {*} param0 
 * @returns 
 */
function PanierScreen({navigation}) {
  return (
    <stack.Navigator>
      <stack.Screen name='Panier' component={PanierScreenPage} options={{title:""}}/>
      <stack.Screen name='Achat' component={AchatScreenPage} options={{title:"Confirmation d'achat"}}/>
    </stack.Navigator>
  )
}
export {PanierScreen, ProduitsScreen};

const styles = StyleSheet.create({
  produit: {
    flexDirection: "colomn",
    justifyContent: 'flex-start',
    justifyContent: 'center',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5,
    height: 310
  },
  panierScreen: {
    flex:1,
    flexDirection: "colomn",
    justifyContent: 'flex-end',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    height: 130
  },
  panierBtn:{
    margin:5,
    height: 40
  },
  panierNbrBtn:{
    width:20,
    height:20,
    borderWidth:1,
    margin:5,
    backgroundColor:'red'
  },
  panierNbr: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderWidth:1,
    height: 40
  },
  panierNbrText: {
    fontSize: 20,
    borderWidth:1,
    width:30
  },
  panier: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5,
    borderWidth:1,
    height: 130
  },
  panierEnonce: {
    flexDirection: "colomn",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'left',
    paddingTop: 5,
    height: 130
  },
  panierTitre: {
    fontSize: 20,
    fontWeight:'bold'
  },
  panierText: {
    fontSize: 20
  },
  panierSupprimer: {
    justifyContent: "center",
    backgroundColor: 'red', 
    height:30, 
    alignItems:'right'
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
  detail: {
    flexDirection: "colomn",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5
  },
  titreDetail: {
    fontSize: 28,
    fontWeight:'bold'
  },
  imageDetail: {
    height: 310,
    width: 300,
    paddingRight: 10
  },
  imageProduit: {
    width: 310,
    height: 210,
    paddingRight: 10
  },
  image: {
    width: 130,
    height: 130,
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
