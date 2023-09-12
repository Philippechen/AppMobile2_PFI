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
import { createContext, useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Image, Pressable, Alert, Button } from 'react-native';
import{ createNativeStackNavigator } from '@react-navigation/native-stack';
import { Database } from './database';

const stack = createNativeStackNavigator();
const db = new Database("produits");     //Utiliser la même BD

/**
 * Initialize BD pour tous les produits, executer une seule fois
 */
export const initProduitsBD = () => {
  db.execute("DROP TABLE IF EXISTS produits");  // Supprime la table si elle existe
  db.execute("CREATE TABLE IF NOT EXISTS produits (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, description TEXT, prix REAL, image TEXT);")
    .then(() => db.execute("INSERT INTO produits (nom, description, prix, image) VALUES ('Dell Inspiron 16 Laptop','', 949.98, 'https://history-computer.com/wp-content/uploads/2023/01/shutterstock_2093652733-scaled.jpg')"))
    .then(() => db.execute("INSERT INTO produits (nom, description, prix, image) VALUES ('Ipad air 10th','', 599.98, 'https://cdn.macstories.net/13359d69-6cbb-4ade-8a47-dc272b9a8849-1632256898935.jpeg')"))
    .then(() => db.execute("INSERT INTO produits (nom, description, prix, image) VALUES ('Xbox series X','', 1099.98, 'https://i.cbc.ca/1.3704325.1470158500!/fileImage/httpImage/xbox-one-s-photo-01.jpg')"))
    .then(() => db.execute("INSERT INTO produits (nom, description, prix, image) VALUES ('Iphone 14 pro','', 1699.98, 'https://hips.hearstapps.com/hmg-prod/images/iphone-lineup-2022-sq-1663704154.jpg')"))
    db.execute("SELECT * FROM produits")
    .catch(error => {
    console.error("An error occurred:", error);
  });
} 
/**
 * Obtenir tous les produits par sqlite
 * 
 * @param {*} setProduits est une function qui décide comment utiliser les données de produits 
 * @returns 
 */
export const obtenirProduits = (setProduits) => {
  db.execute("SELECT * FROM produits")
  .then(resultSet => {
    console.log("Affichage de notre database :", resultSet);
    setProduits(resultSet.rows);
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });
}

/**  Pour partager les données entre différent écran*/
const PanierContext = createContext();
export const PanierContextProvider = ({ children }) => {
  const [paniersTous, setPaniersTous] = useState([]);
  const [i18n, setI18n] = useState();

  return (
    <PanierContext.Provider value={{ paniersTous, setPaniersTous, i18n, setI18n }}>
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
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const {id, nom, prix, description,image} = route.params.item;

  if (typeof(i18n) == 'undefined')
    return (<View></View>);

  return (
    <View style={styles.detail}>
      <Image source={{uri:image}} style={styles.imageDetail}/>
      <Text style={styles.titreDetail}> {nom} </Text>
      <View style={{alignItems: 'left', paddingTop:20}}>
        <Text > {i18n.t('prix')}: {prix} </Text>
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
          
          Alert.alert('Confirmation', i18n.t('ajoutSuc'), [
            {
              text:i18n.t('oui'),
              onPress:()=>navigation.goBack()
            }
          ])
        }}
       >
        <Text style={{color:"white", fontSize: 20}}>{i18n.t('ajoutAuPanier')}</Text>
      </Pressable>
    </View>
  )
}

/**
 * Component pour décrire brièvement un produit avec image
 * On peut le presser pour l'information plus détaillée
 * 
 * @param {*} param0 
 * @returns 
 */
const Produit = ({navigation, item}) => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
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
          {/* <Text styles={styles.nom}> {i18n.t('prix')}: {prix} </Text> */}
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
  const [produits, setProduits] = useState([]);
  useEffect(() => {
    obtenirProduits(setProduits);
  }, []);

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
 * Component à exporter qui a 2 page:
 *    * un pour liste tous les produis
 *    * un pour donner plus d'information sur un seul produit
 * 
 * @param {*} param0 
 * @returns 
 */
export function ProduitsScreen({navigation, route}) {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const myI18n = route.params.i18n;
  setI18n(myI18n);
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
const ProduitEnPanier = ({id, nom, prix, image, nbr}) => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();

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
        <Text style={styles.panierText}> {i18n.t('prix')}: {prix} </Text>

        <View style={styles.panierNbr}>
          <Button style={styles.panierNbrBtn} onPress={()=>{changeNbrProduit(-1)}} title="-"/>
            <Text style={styles.panierNbrText}> {nbr} </Text>
          <Button style={styles.panierNbrBtn} onPress={()=>{changeNbrProduit(1)}} title="+"/>
        </View>
        
        <Pressable style={styles.panierSupprimer} 
          onPress={()=>{
            Alert.alert('Confirmation', i18n.t('msgSupprime'), [
              {
                text:i18n.t('oui'),
                onPress:()=>{delProduit()}
              },
              {
                text: i18n.t('non'),
                onPress:()=>{},
                style: 'cancel'
              }
            ])
          }}
        >
            <Text style={{color:"white", fontSize: 20}}>{i18n.t('supprimer')}</Text>
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
const PanierScreenPage = ({navigation, route}) => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  let prixTous = 0;

  if (typeof(i18n) == 'undefined')
    return (<View></View>);

  paniersTous.forEach(it =>{
    if (typeof(it.prix) != "undefined") 
      prixTous+=it.prix*it.nbr;
  });
  return (
    <View style={styles.panierScreen}>
      <FlatList  
        data={paniersTous} 
        renderItem={({item})=><ProduitEnPanier id={item.id} nom={item.nom} prix={item.prix} image={item.image} nbr={item.nbr} />}
        keyExtractor={item=>item.id} 
      />
        
      <Text style={{fontWeight:'bold', fontSize:20}} >{i18n.t('prixTous')}: {prixTous.toFixed(2)}</Text>
      <Pressable 
        style={[styles.panierBtn, {backgroundColor: 'red'}]}
        onPress={()=>{
          Alert.alert('Confirmation', i18n.t('msgViderPanier'), [
            {
              text:i18n.t('oui'),
              onPress:()=>{setPaniersTous([])}
            },
            {
              text: i18n.t('non'),
              onPress:()=>{},
              style: 'cancel'
            }
          ])
        }}
        >
        <Text style={{color:"white", fontSize: 20}}>{i18n.t('viderPanier')}</Text>
      </Pressable>

      <Pressable 
        style={[styles.panierBtn, {backgroundColor: 'green'}]}
        onPress={()=>{navigation.navigate("AchatPage",{'prix':prixTous.toFixed(2)});setPaniersTous([])}}
        >
        <Text style={{color:"white", fontSize: 20}}>{i18n.t('acheter')}</Text>
      </Pressable>
    </View>
  );
}


const AchatScreenPage = ({navigation, route}) => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const prix = route.params.prix;
  return (
  <View style={styles.produit}>
    <Text style={styles.panierTitre}>{i18n.t('achatTitre')} </Text>
    <Text>{i18n.t('achatMsg1')} {prix} {i18n.t('achatMsg2')}</Text>
  </View>
)}
/**
 * Component à exporter qui a 2 page:
 *    * un pour liste tous les produis dans le panier
 *    * un pour confirmer la demande
 * 
 * @param {*} param0 
 * @returns 
 */
export function PanierScreen({navigation, route}) {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const myI18n = route.params.i18n;
  const msg = myI18n.t('confirmerAcheter');
  setI18n(myI18n);
  return (
    <stack.Navigator>
      <stack.Screen name='PanierPage' component={PanierScreenPage} options={{title:""}}/>
      <stack.Screen name='AchatPage' component={AchatScreenPage} options={{title:msg}}/>
    </stack.Navigator>
  )
}

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
