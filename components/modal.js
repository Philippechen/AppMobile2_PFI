//Modal pour le login 
//01/09/23

import {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput} from 'react-native';

//dimension 
const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 180;

const SimpleModal = (props) => {
    const selectedUser = props.selectedUser;
    const [password, setPassword] = useState('');
    const [passwordFailed, setPasswordFailed] = useState(false);

    closeModal = (bool, data) => {
        if (data === props.i18n.t('modalAnnuler')) {
            props.changeModalVisible(bool);
            props.setData(data);
            return;
        }
        
        if (password === selectedUser.mdp) {
            setPasswordFailed(false);
            props.changeModalVisible(bool);
            props.setData(`${props.i18n.t('bienvenue')} ${selectedUser.nom}`);
            props.handleUserLogin(selectedUser);
        } else {
            setPasswordFailed(true);
            props.changeModalVisible(bool);
            props.setData(props.i18n.t('modelMotDePassIncorrect'));
        }
    }
    
    return(
        <TouchableOpacity
            disabled={true}
            style={styles.container}
        >
            <View style={styles.modal}>
                <View style={styles.textView}>
                    <Text 
                        style={[styles.text, {fontSize:20} ]}>
                        {props.i18n.t('bienvenue')}
                    </Text>
                    <Text 
                        style={styles.text}>
                        {props.i18n.t('msgMotDePass')}
                    </Text>
                    <TextInput 
                        style={styles.textInput}
                        placeholder="••••••••"
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                        value={password}
                    />
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity 
                        style={styles.touchableOpacity}
                        onPress={() => closeModal(false, props.i18n.t('modalAnnuler'))}    
                    >
                        <Text 
                            style={[styles.text, {color: 'blue'}]}>
                            {props.i18n.t('annuler')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.touchableOpacity}
                        onPress={() => closeModal(false, 'Continuer')} 
                    >
                        <Text 
                            style={[styles.text, {color: 'blue'}]}>
                            {props.i18n.t('continuer')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    },
    modal: {
        height: HEIGHT_MODAL,
        width: WIDTH - 80,
        paddingTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    textView: {
        flex:1,
        alignItems:'center',
    },
    text: {
        margin: 5,
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonsView: {
        width: '100%',
        flexDirection: 'row',
    },
    touchableOpacity:{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    textInput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
})

export {SimpleModal};