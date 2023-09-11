import { StyleSheet, Text, View, Linking } from 'react-native';

const ContactUsScreen = () => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const myI18n = route.params.i18n;
  setI18n(myI18n);

    const handleOpenURL = () => {
        Linking.openURL('https://github.com/Philippechen/AppMobile2_PFI.git');
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Crédits de réalisation</Text>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    <Text style={styles.nameHighlight}>Allan</Text> a réalisé : login.js, modal.js, pageAdmin.js, contactUs.js et la base de données SQlite pour les logins.
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    <Text style={styles.nameHighlight}>Enlong</Text> a réalisé : panier.js, entrepots.js, l'internationalisation du projet et la base de données produits SQlite.
                </Text>
            </View>
            <Text style={styles.gitHubNote}>De plus, vous pouvez trouver notre projet sur GitHub.</Text>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}onPress={handleOpenURL}>
                Voir sur GitHub
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  textContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  nameHighlight: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  gitHubNote: {
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export { ContactUsScreen };
