import { StyleSheet, Text, View, Linking } from 'react-native';
import {useMyContext} from './panier'

const ContactUsScreen = ({navigation, route}) => {
  const { paniersTous, setPaniersTous, i18n, setI18n } = useMyContext();
  const myI18n = route.params.i18n;
  setI18n(myI18n);
  console.log(i18n);
  console.log(111111);
  
  if (typeof(i18n) == 'undefined')
    return (<View></View>);

    const handleOpenURL = () => {
        Linking.openURL('https://github.com/Philippechen/AppMobile2_PFI.git');
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>{i18n.t('aproposTitre')}</Text>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    <Text style={styles.nameHighlight}>Allan</Text> {i18n.t('realise')} : login.js, modal.js, pageAdmin.js, contactUs.js {i18n.t('et')} {i18n.t('sqlite')} {i18n.t('pourLogin')}.
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    <Text style={styles.nameHighlight}>Enlong</Text> {i18n.t('realise')} : panier.js, entrepots.js, l'internationalisation du projet {i18n.t('et')} {i18n.t('sqlite')} {i18n.t('pourProduit')}.
                </Text>
            </View>
            <Text style={styles.gitHubNote}>{i18n.t('msgFinal')}</Text>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}onPress={handleOpenURL}>
                {i18n.t('msgLink')}
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
